import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const SHORT_ANSWER = "Respuesta corta y directa, sin frases explicativas largas";

const ModProgressSchema = z.object({
  estimatedPower: z.string().describe(SHORT_ANSWER + ", ej. '210 CV (estimado)'"),
  estimatedTorque: z.string().describe(SHORT_ANSWER + ", ej. '400 Nm (estimado)'"),
  summary: z.string().describe("2-3 frases: qué se ha hecho hasta ahora respecto al plan y el objetivo declarado"),
  nextStep: z.object({
    title: z.string().describe(SHORT_ANSWER),
    reasoning: z.string().describe("1-2 frases explicando por qué este es el siguiente paso lógico ahora, no antes ni después"),
  }),
});

const client = new Anthropic();

const OBJECTIVE_LABELS: Record<string, string> = {
  DIARIO: "Uso diario",
  TRAMOS: "Tramos y carretera",
  CIRCUITO: "Circuito",
  COMPETICION: "Competición",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const vehicleId = body?.vehicleId;
  if (!vehicleId) {
    return NextResponse.json({ error: "Falta vehicleId" }, { status: 400 });
  }

  const vehicleSnap = await getDoc(doc(db, "vehicles", vehicleId));
  if (!vehicleSnap.exists()) {
    return NextResponse.json({ error: "No se encontró el vehículo" }, { status: 404 });
  }
  const v = vehicleSnap.data();

  const logsSnap = await getDocs(query(collection(db, "vehicles", vehicleId, "modLog"), orderBy("date", "asc"))).catch(() => null);
  const mods = logsSnap ? logsSnap.docs.map((d) => d.data()) : [];

  const modsText = mods.length
    ? mods.map((m) => `- ${m.name} (${m.date})${m.notes ? `: ${m.notes}` : ""}`).join("\n")
    : "Ninguna modificación registrada todavía — el coche sigue en estado de fábrica.";

  const planText = v.aiPlan
    ? `Potencia de partida: ${v.aiPlan.specs?.potencia}. Par de partida: ${v.aiPlan.specs?.par}.
Plan de modificaciones sugerido:
${(v.aiPlan.stages ?? []).map((s: any) => `${s.title}: ${(s.items ?? []).join(", ")}`).join("\n")}`
    : "No hay un plan de modificaciones generado todavía para este vehículo.";

  const objectivesText = (v.objectives ?? []).map((o: string) => OBJECTIVE_LABELS[o] ?? o).join(", ") || "no especificado";

  try {
    const response = await client.messages.parse({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: zodOutputFormat(ModProgressSchema),
      },
      system: `Eres un preparador de automóviles trabajando para Tuning Hub. No solo das un plan de modificaciones, haces seguimiento real del progreso del propietario en su proyecto.

Dado el vehículo, su plan de modificaciones sugerido, su objetivo de uso, y las modificaciones que REALMENTE ha instalado hasta ahora, debes:
1. Estimar la potencia y par actuales acumulados (partiendo de la cifra de fábrica/base y sumando el efecto realista de cada modificación instalada).
2. Resumir en 2-3 frases directas qué se ha hecho respecto al plan sugerido y respecto al objetivo declarado.
3. Determinar el siguiente paso lógico UNO SOLO (no una lista), coherente con lo que ya está instalado y el objetivo, y argumentar brevemente por qué toca ahora y no otra cosa.

Sé directo y específico, no genérico. Si no hay modificaciones instaladas todavía, el siguiente paso lógico es el primer elemento razonable del plan.`,
      messages: [
        {
          role: "user",
          content: `Vehículo: ${v.brand} ${v.model} ${v.generation}, motor ${v.engine}${v.motorCode ? ` (${v.motorCode})` : ""}, ${v.mileage} km.
Objetivo de uso: ${objectivesText}

${planText}

Modificaciones instaladas hasta ahora:
${modsText}

Evalúa el progreso.`,
        },
      ],
    });

    if (!response.parsed_output) {
      console.error("mod-progress: respuesta sin parsed_output", { vehicleId, stopReason: response.stop_reason });
      return NextResponse.json({ error: "No se pudo evaluar el progreso" }, { status: 502 });
    }

    updateDoc(doc(db, "vehicles", vehicleId), { modProgress: response.parsed_output }).catch((err) =>
      console.error("mod-progress: fallo al guardar", { vehicleId, message: err instanceof Error ? err.message : String(err) })
    );

    return NextResponse.json(response.parsed_output);
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : undefined;
    console.error("mod-progress: fallo al llamar a Claude", { vehicleId, status, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al evaluar el progreso con IA" },
      { status: 502 }
    );
  }
}
