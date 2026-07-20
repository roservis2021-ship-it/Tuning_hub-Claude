import Anthropic from "@anthropic-ai/sdk";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const client = new Anthropic();

const FUEL_LABELS: Record<string, string> = {
  GASOLINA: "Gasolina",
  DIESEL: "Diésel",
  HIBRIDO: "Híbrido",
  ELECTRICO: "Eléctrico",
  GLP_GNC: "GLP / GNC",
};

const OBJECTIVE_LABELS: Record<string, string> = {
  DIARIO: "Uso diario",
  TRAMOS: "Tramos y carretera",
  CIRCUITO: "Circuito",
  COMPETICION: "Competición",
};

async function buildSystemPrompt(vehicleId: string): Promise<string | null> {
  const vehicleSnap = await getDoc(doc(db, "vehicles", vehicleId));
  if (!vehicleSnap.exists()) return null;
  const v = vehicleSnap.data();

  const [logsSnap, diagSnap] = await Promise.all([
    getDocs(query(collection(db, "vehicles", vehicleId, "maintenanceLog"), orderBy("date", "desc"), limit(10))).catch(() => null),
    getDocs(query(collection(db, "vehicles", vehicleId, "diagnostics"), orderBy("createdAt", "desc"), limit(5))).catch(() => null),
  ]);

  const logsText = logsSnap && !logsSnap.empty
    ? logsSnap.docs.map((d) => {
        const l = d.data();
        return `- ${l.item}: ${l.mileage} km (${l.date})${l.notes ? ` — ${l.notes}` : ""}`;
      }).join("\n")
    : "Sin registros de mantenimiento todavía.";

  const diagText = diagSnap && !diagSnap.empty
    ? diagSnap.docs.map((d) => {
        const diag = d.data();
        return `- "${diag.description}" → gravedad ${diag.result?.gravedad}, causa principal: ${diag.result?.posiblesCausas?.[0]?.causa ?? "desconocida"}`;
      }).join("\n")
    : "Sin diagnósticos previos.";

  const objectivesText = (v.objectives ?? []).map((o: string) => OBJECTIVE_LABELS[o] ?? o).join(", ") || "no especificado";

  const planText = v.aiPlan
    ? `Potencia: ${v.aiPlan.specs?.potencia}. Par: ${v.aiPlan.specs?.par}. Aspiración: ${v.aiPlan.specs?.aspiracion}. Código de motor: ${v.aiPlan.specs?.codigoMotor}. Tracción: ${v.aiPlan.specs?.traccion}.
Plan de modificaciones por etapas: ${(v.aiPlan.stages ?? []).map((s: any) => s.title).join(" → ")}.`
    : "Todavía no se ha generado un plan de modificaciones para este vehículo.";

  return `Eres el Ingeniero de Tuning Hub, un experto en tuning y mecánica que conoce a fondo el vehículo concreto de este usuario. Responde sus dudas de forma directa y útil, basándote SIEMPRE en los datos reales de su coche y su progreso — no des respuestas genéricas cuando puedas ser específico.

Datos del vehículo:
- Marca: ${v.brand}
- Modelo: ${v.model}
- Generación: ${v.generation}
- Motorización: ${v.engine}${v.motorCode ? ` (código ${v.motorCode})` : ""}
- Combustible: ${FUEL_LABELS[v.fuelType] ?? v.fuelType}
- Kilometraje: ${v.mileage} km
- Objetivo de uso: ${objectivesText}

Plan de tuning generado:
${planText}

Historial de mantenimiento reciente:
${logsText}

Diagnósticos previos:
${diagText}

Estilo de conversación (muy importante):
- NUNCA sueltes toda la información de golpe. Compórtate como un mecánico real hablando en el taller, no como un informe o un manual.
- Si el usuario plantea un problema o síntoma (un ruido, un fallo, algo que no va bien), no des directamente la lista de causas y solución. Primero haz 1 o 2 preguntas cortas y concretas para acotarlo (cuándo ocurre, en qué condiciones, si es constante o intermitente, desde cuándo, etc.). Ve deduciendo el problema turno a turno, como una conversación real, antes de dar ninguna conclusión.
- Da el diagnóstico completo (causas, recomendación, pasos) solo cuando ya tengas suficiente información para acotarlo bien, o si el usuario te pide explícitamente ir al grano.
- Si la pregunta es simple y directa (un dato concreto, no un problema que diagnosticar), respóndela sin alargar la conversación con preguntas innecesarias.
- Cada respuesta debe ser corta (pocas frases, no listas largas salvo que el usuario pida más detalle), directa, con criterio de mecánico/preparador. Si el usuario pregunta algo fuera del ámbito de coches/tuning, redirígelo amablemente.`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return new Response("JSON inválido", { status: 400 });
  }

  const { vehicleId, messages } = body as { vehicleId: string; messages: { role: "user" | "assistant"; content: string }[] };

  if (!vehicleId || !Array.isArray(messages) || messages.length === 0) {
    return new Response("Faltan datos", { status: 400 });
  }

  const systemPrompt = await buildSystemPrompt(vehicleId);
  if (!systemPrompt) {
    return new Response("No se encontró el vehículo", { status: 404 });
  }

  const recentMessages = messages.slice(-30);

  const encoder = new TextEncoder();

  try {
    const anthropicStream = client.messages.stream({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      thinking: { type: "disabled" },
      system: systemPrompt,
      messages: recentMessages,
    });

    const stream = new ReadableStream({
      start(controller) {
        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });
        anthropicStream.on("end", () => {
          controller.close();
        });
        anthropicStream.on("error", (err) => {
          console.error("assistant: fallo en el stream", { message: err instanceof Error ? err.message : String(err) });
          controller.error(err);
        });
      },
      cancel() {
        anthropicStream.abort();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("assistant: fallo al llamar a Claude", { vehicleId, message: err instanceof Error ? err.message : String(err) });
    return new Response("Error al contactar con el ingeniero", { status: 502 });
  }
}
