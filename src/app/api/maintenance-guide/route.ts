import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { createHash } from "crypto";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { generateMaintenanceGuide } from "@/lib/maintenance-engine";
import { deriveDistribucion } from "@/lib/tuning-engine";

const SHORT_ANSWER = "Respuesta corta y directa, sin frases explicativas largas";

const MaintenanceGuideSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().describe(SHORT_ANSWER + ", ej. 'Aceite y filtro de aceite'"),
      intervalKm: z.number().describe("Intervalo en kilómetros entre revisiones/cambios de este elemento"),
      intervalMonths: z.number().describe("Intervalo en meses entre revisiones/cambios de este elemento"),
      description: z.string().describe(SHORT_ANSWER + ", una frase corta de qué implica esta tarea"),
    })
  ),
});

const FUEL_LABELS: Record<string, string> = {
  GASOLINA: "Gasolina",
  DIESEL: "Diésel",
  HIBRIDO: "Híbrido",
  ELECTRICO: "Eléctrico",
  GLP_GNC: "GLP / GNC",
};

const client = new Anthropic();

function buildCacheKey(params: { brand: string; model: string; generation: string; engine: string; motorCode?: string; fuelType: string }): string {
  const raw = [params.brand, params.model, params.generation, params.engine, params.motorCode || "GENERIC", params.fuelType].join("|");
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { brand, model, generation, engine, motorCode, fuelType } = body;

  if (!brand || !model || !engine || !fuelType) {
    return NextResponse.json({ error: "Faltan datos del vehículo" }, { status: 400 });
  }

  const cacheKey = buildCacheKey({ brand, model, generation, engine, motorCode, fuelType });

  try {
    const cached = await getDoc(doc(db, "maintenanceGuideCache", cacheKey));
    if (cached.exists()) {
      const { cachedAt: _cachedAt, ...guide } = cached.data();
      return NextResponse.json(guide);
    }
  } catch (err) {
    console.error("maintenance-guide: fallo al leer caché", { cacheKey, message: err instanceof Error ? err.message : String(err) });
  }

  try {
    const response = await client.messages.parse({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: zodOutputFormat(MaintenanceGuideSchema),
      },
      system: `Eres un ingeniero de mantenimiento de automóviles trabajando para Tuning Hub, una app de garaje digital inteligente.

Dado un vehículo concreto, genera una guía de mantenimiento realista: la lista de tareas periódicas típicas para ESE motor y marca (aceite y filtro, filtros de aire/habitáculo/combustible, bujías o inyectores según combustible, líquido de frenos, refrigerante, distribución con su intervalo real conocido para esa marca/motor si lo sabes, pastillas/discos de freno, correa de accesorios, etc.).

Para cada tarea da un intervalo en kilómetros y en meses, y una descripción muy breve. Sé directo, sin justificar cada cifra — es una ficha, no un ensayo.`,
      messages: [
        {
          role: "user",
          content: `Vehículo:
- Marca: ${brand}
- Modelo: ${model}
- Generación: ${generation}
- Motorización: ${engine}${motorCode ? `\n- Código de motor: ${motorCode}` : ""}
- Combustible: ${FUEL_LABELS[fuelType] ?? fuelType}

Genera la guía de mantenimiento para este vehículo.`,
        },
      ],
    });

    if (!response.parsed_output) {
      console.error("maintenance-guide: respuesta sin parsed_output", { brand, model, engine, stopReason: response.stop_reason });
      return NextResponse.json({ error: "No se pudo generar la guía" }, { status: 502 });
    }

    setDoc(doc(db, "maintenanceGuideCache", cacheKey), { ...response.parsed_output, cachedAt: serverTimestamp() }).catch((err) =>
      console.error("maintenance-guide: fallo al guardar caché", { cacheKey, message: err instanceof Error ? err.message : String(err) })
    );

    return NextResponse.json(response.parsed_output);
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : undefined;
    console.error("maintenance-guide: fallo al llamar a Claude", { brand, model, engine, status, message: err instanceof Error ? err.message : String(err) });

    const distribucion = deriveDistribucion(brand, engine, fuelType);
    const items = generateMaintenanceGuide(brand, engine, fuelType, distribucion);
    return NextResponse.json({ items });
  }
}
