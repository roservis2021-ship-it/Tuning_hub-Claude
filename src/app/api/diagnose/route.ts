import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const SHORT_ANSWER = "Respuesta corta y directa, sin frases explicativas largas";

const DiagnosisSchema = z.object({
  gravedad: z.enum(["baja", "media", "alta", "urgente"]).describe(
    "urgente = riesgo de seguridad inmediato (frenos, dirección, humo, olor a quemado): dejar de conducir. alta = no ignorar, llevar al taller pronto. media = vigilar y programar revisión. baja = cosmético o de bajo riesgo"
  ),
  posiblesCausas: z.array(
    z.object({
      causa: z.string().describe(SHORT_ANSWER),
      probabilidad: z.enum(["alta", "media", "baja"]),
      explicacion: z.string().describe(SHORT_ANSWER + ", una frase"),
    })
  ),
  recomendacion: z.string().describe(SHORT_ANSWER + ", qué hacer ahora"),
  siguientesPasos: z.array(z.string().describe(SHORT_ANSWER)),
});

const client = new Anthropic();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { vehicleId, brand, model, generation, engine, mileage, description, imageBase64, imageMediaType } = body;

  if (!description || !String(description).trim()) {
    return NextResponse.json({ error: "Describe brevemente qué está pasando" }, { status: 400 });
  }

  const content: Anthropic.ContentBlockParam[] = [];
  if (imageBase64) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: imageMediaType || "image/jpeg", data: imageBase64 },
    });
  }
  content.push({
    type: "text",
    text: `Vehículo:
- Marca: ${brand ?? "desconocida"}
- Modelo: ${model ?? "desconocido"}
- Generación: ${generation ?? "desconocida"}
- Motorización: ${engine ?? "desconocida"}
- Kilometraje: ${mileage ?? "desconocido"} km

El propietario describe lo siguiente:
"${description}"

Diagnostica el problema.`,
  });

  try {
    const response = await client.messages.parse({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: zodOutputFormat(DiagnosisSchema),
      },
      system: `Eres un mecánico experto trabajando para Tuning Hub, una app de garaje digital inteligente. Un propietario te describe un problema con su coche (ruido extraño, fuga, luz de aviso, algo que ha visto) y a veces adjunta una foto.

Da un diagnóstico honesto y directo, como lo haría un mecánico real: no expliques de más, ve al grano. Ordena las posibles causas por probabilidad. Sé especialmente cuidadoso marcando "gravedad" como "urgente" cuando el problema pueda afectar a frenos, dirección, o haya riesgo de incendio/humo — en esos casos la recomendación debe ser dejar de conducir el vehículo.

Deja claro en tus respuestas que esto es una estimación y no sustituye una inspección presencial de un profesional.`,
      messages: [{ role: "user", content }],
    });

    if (!response.parsed_output) {
      console.error("diagnose: respuesta sin parsed_output", { brand, model, stopReason: response.stop_reason });
      return NextResponse.json({ error: "No se pudo generar el diagnóstico" }, { status: 502 });
    }

    if (vehicleId) {
      addDoc(collection(db, "vehicles", vehicleId, "diagnostics"), {
        description,
        hadPhoto: !!imageBase64,
        result: response.parsed_output,
        createdAt: serverTimestamp(),
      }).catch((err) => console.error("diagnose: fallo al guardar historial", { message: err instanceof Error ? err.message : String(err) }));
    }

    return NextResponse.json(response.parsed_output);
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : undefined;
    console.error("diagnose: fallo al llamar a Claude", { brand, model, status, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al generar el diagnóstico con IA" },
      { status: 502 }
    );
  }
}
