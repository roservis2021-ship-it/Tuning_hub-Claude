"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { display } from "@/lib/fonts";

const OBJECTIVES = [
  { value: "DIARIO", label: "Uso diario", description: "Confort, fiabilidad y bajo consumo en el día a día" },
  { value: "TRAMOS", label: "Tramos y carretera", description: "Conducción deportiva en carretera abierta y puertos de montaña" },
  { value: "CIRCUITO", label: "Circuito", description: "Rendimiento y track days en pista" },
  { value: "COMPETICION", label: "Competición", description: "Rally, autocross o competición reglada" },
];

const POWER_RANGES = [
  { value: "100-150", label: "100-150 CV" },
  { value: "150-200", label: "150-200 CV" },
  { value: "200-250", label: "200-250 CV" },
  { value: "300+", label: "300+ CV" },
  { value: "OTRO", label: "Otro / No lo sé" },
];

function ObjetivoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [selected, setSelected] = useState<string[]>([]);
  const [desiredPower, setDesiredPower] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleContinue() {
    if (selected.length === 0) {
      setError("Selecciona al menos un objetivo");
      return;
    }
    if (!desiredPower) {
      setError("Selecciona la potencia deseada");
      return;
    }
    setError(null);

    if (!vehicleId) {
      router.push("/");
      return;
    }

    setSubmitting(true);
    try {
      await updateDoc(doc(db, "vehicles", vehicleId), { objectives: selected, desiredPower });
      router.push(`/garaje/plan?vehicleId=${vehicleId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el objetivo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-16">
      <div>
        <h1 className={`${display.className} italic text-3xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          ¿En qué va a estar enfocado tu coche?
        </h1>
        <span className="mt-2 block h-0.5 w-12 bg-accent" />
        <p className="mt-3 text-zinc-400">Elige el uso que le vas a dar. Puedes seleccionar varios.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OBJECTIVES.map((objective) => {
          const isSelected = selected.includes(objective.value);
          return (
            <button
              key={objective.value}
              type="button"
              onClick={() => toggle(objective.value)}
              className={`flex flex-col items-start gap-1 rounded-lg border px-5 py-4 text-left transition ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-garage-700 bg-garage-900 hover:border-garage-700/60"
              }`}
            >
              <span className="font-semibold text-zinc-100">{objective.label}</span>
              <span className="text-sm text-zinc-400">{objective.description}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-zinc-100">Potencia deseada</span>
          <select
            className="input"
            value={desiredPower}
            onChange={(e) => setDesiredPower(e.target.value)}
          >
            <option value="">Selecciona...</option>
            {POWER_RANGES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <p className="rounded-md border border-garage-700 bg-garage-900/40 px-4 py-3 text-xs text-zinc-500">
          Ten en cuenta que no todos los vehículos están diseñados para asumir tanta potencia con garantías.
          Ajustaremos el plan a lo que tu motor pueda soportar de forma realista.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={submitting}
        className="rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
      >
        {submitting ? "Guardando..." : "Continuar"}
      </button>
    </main>
  );
}

export default function ObjetivoPage() {
  return (
    <Suspense>
      <ObjetivoForm />
    </Suspense>
  );
}
