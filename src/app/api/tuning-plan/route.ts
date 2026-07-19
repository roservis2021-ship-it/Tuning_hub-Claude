import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { createHash } from "crypto";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const SHORT_ANSWER = "Respuesta corta y directa (pocas palabras o una cifra), sin frases explicativas ni justificaciones largas";

const TuningPlanSchema = z.object({
  specs: z.object({
    potencia: z.string().describe(SHORT_ANSWER + ", ej. '150 CV' o '150-190 CV (estimado)'"),
    par: z.string().describe(SHORT_ANSWER + ", ej. '320 Nm' o '320-380 Nm (estimado)'"),
    aspiracion: z.string().describe(SHORT_ANSWER + ", ej. 'Turbo' o 'Atmosférico'"),
    codigoMotor: z.string().describe(SHORT_ANSWER + ", ej. 'BKD' o 'Familia EA288' o 'No disponible'"),
    centralita: z.string().describe(SHORT_ANSWER + ", ej. 'Bosch EDC17' o 'No disponible'"),
    distribucion: z.string().describe(SHORT_ANSWER + ", ej. 'Cadena — revisar cada 150.000 km'"),
    traccion: z.string().describe(SHORT_ANSWER + ", ej. 'Delantera (FWD)' o 'Total (4x4)' o 'Trasera (RWD)'"),
  }),
  stages: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.string()).describe("EXACTAMENTE 2 o 3 ítems muy concisos, no más"),
        note: z.string().optional().describe("Opcional, una sola frase corta"),
      })
    )
    .describe("MÁXIMO 2 etapas (versión gratuita limitada). No incluyas más de 2 aunque el coche dé para más"),
  risks: z.array(z.string()).describe("MÁXIMO 3 riesgos, cada uno en una frase corta"),
  maintenance: z.array(z.string()).describe("MÁXIMO 3 puntos de mantenimiento, cada uno en una frase corta"),
});

const FUEL_LABELS: Record<string, string> = {
  GASOLINA: "Gasolina",
  DIESEL: "Diésel",
  HIBRIDO: "Híbrido",
  ELECTRICO: "Eléctrico",
  GLP_GNC: "GLP / GNC",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATICA: "Automática",
};

const OBJECTIVE_LABELS: Record<string, string> = {
  DIARIO: "Uso diario",
  TRAMOS: "Tramos y carretera",
  CIRCUITO: "Circuito",
  COMPETICION: "Competición",
};

const client = new Anthropic();

const MILEAGE_BUCKET_SIZE = 20000;

function buildCacheKey(params: {
  brand: string;
  model: string;
  generation: string;
  engine: string;
  motorCode?: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  objectives?: string[];
}): string {
  const mileageBucket = Math.floor(params.mileage / MILEAGE_BUCKET_SIZE) * MILEAGE_BUCKET_SIZE;
  const objectivesKey = [...(params.objectives ?? [])].sort().join(",");
  const raw = [
    "v2-free-limited",
    params.brand,
    params.model,
    params.generation,
    params.engine,
    params.motorCode || "GENERIC",
    mileageBucket,
    params.fuelType,
    params.transmission,
    objectivesKey,
  ].join("|");
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { brand, model, generation, engine, motorCode, mileage, fuelType, transmission, objectives } = body;

  if (!brand || !model || !engine || typeof mileage !== "number") {
    return NextResponse.json({ error: "Faltan datos del vehículo" }, { status: 400 });
  }

  const cacheKey = buildCacheKey({ brand, model, generation, engine, motorCode, mileage, fuelType, transmission, objectives });

  try {
    const cached = await getDoc(doc(db, "planCache", cacheKey));
    if (cached.exists()) {
      const { cachedAt: _cachedAt, ...plan } = cached.data();
      return NextResponse.json(plan);
    }
  } catch (err) {
    console.error("tuning-plan: fallo al leer caché", { cacheKey, message: err instanceof Error ? err.message : String(err) });
  }

  const objectiveLabels = (objectives ?? []).map((o: string) => OBJECTIVE_LABELS[o] ?? o);

  try {
    const response = await client.messages.parse({
      model: "claude-sonnet-5",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: zodOutputFormat(TuningPlanSchema),
      },
      system: `Eres un ingeniero de preparación (tuning) de automóviles con amplia experiencia real en el sector, trabajando para Tuning Hub, una app de garaje digital inteligente.

Dado un vehículo concreto y el uso que le va a dar su propietario, genera un análisis técnico honesto y un plan de modificaciones realista. Debes:

1. Especificaciones: sé DIRECTO, no argumentes ni justifiques la respuesta salvo que sea imprescindible. Da el dato en pocas palabras, como una ficha técnica, no como una explicación. Ejemplo de formato correcto:
   - codigoMotor: "BKD" (no "El código de motor probablemente sea BKD, aunque podría variar según el mercado y año de fabricación...")
   - distribucion: "Cadena — revisar cada 150.000 km" (no un párrafo justificando por qué)
   Si se indica un código de motor concreto en los datos del vehículo, úsalo como dato cierto para potencia y par (no lo trates como estimación). Si no se indica, da potencia y par orientativos marcados como "estimado". Determina también la aspiración (atmosférico/turbo/híbrido/eléctrico), la centralita (ECU) si la conoces (si no, "No disponible"), el tipo de distribución (correa/cadena) con su intervalo habitual, y la tracción (delantera/trasera/total, indicando FWD/RWD/AWD o 4x4 si aplica).

2. Plan de modificaciones (VERSIÓN GRATUITA — LIMITADA A PROPÓSITO): muestra SOLO las 2 primeras etapas del plan, con 2-3 ítems concisos cada una. Es una vista previa gratuita: debe ser útil y despertar interés, pero incompleta. En la última etapa incluye una 'note' breve que insinúe que hay más etapas y detalle en el plan completo (Premium), sin sonar a anuncio agresivo (ej: "Las siguientes etapas (frenos, suspensión, ajuste final) se detallan en el plan completo"). Si el kilometraje es alto, la etapa 0/1 debe ser de puesta a punto antes de tocar potencia. No recomiendes modificaciones agresivas en motores con mucho kilometraje sin antes recomendar una revisión.

3. Riesgos y mantenimiento (LIMITADO): MÁXIMO 3 riesgos y MÁXIMO 3 puntos de mantenimiento, los más importantes, cada uno en una frase corta. Riesgos reales y específicos de ESE coche (no genéricos), incluyendo lo legal en España (ITV, homologación, seguro) cuando aplique.

Regla general: en la versión gratuita sé BREVE y selectivo. Da lo esencial y deja claro implícitamente que el plan completo aporta más. Si algo es estimación, márcalo con la palabra ("estimado"), no con una frase.`,
      messages: [
        {
          role: "user",
          content: `Vehículo:
- Marca: ${brand}
- Modelo: ${model}
- Generación: ${generation}
- Motorización: ${engine}${motorCode ? `\n- Código de motor: ${motorCode} (dato confirmado por el propietario, úsalo como cierto)` : ""}
- Combustible: ${FUEL_LABELS[fuelType] ?? fuelType}
- Transmisión: ${TRANSMISSION_LABELS[transmission] ?? transmission}
- Kilometraje: ${mileage} km

Objetivo de uso declarado por el propietario: ${objectiveLabels.length ? objectiveLabels.join(", ") : "no especificado"}

Genera el análisis y plan de modificaciones para este vehículo.`,
        },
      ],
    });

    if (!response.parsed_output) {
      console.error("tuning-plan: respuesta sin parsed_output", {
        brand,
        model,
        engine,
        stopReason: response.stop_reason,
      });
      return NextResponse.json({ error: "No se pudo generar el plan" }, { status: 502 });
    }

    setDoc(doc(db, "planCache", cacheKey), { ...response.parsed_output, cachedAt: serverTimestamp() }).catch(
      (err) => console.error("tuning-plan: fallo al guardar caché", { cacheKey, message: err instanceof Error ? err.message : String(err) })
    );

    return NextResponse.json(response.parsed_output);
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : undefined;
    console.error("tuning-plan: fallo al llamar a Claude", {
      brand,
      model,
      engine,
      status,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al generar el plan con IA" },
      { status: 502 }
    );
  }
}
