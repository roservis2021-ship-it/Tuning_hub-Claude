"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { display } from "@/lib/fonts";
import { CAR_BRANDS, getModels, getGenerations, getEngineCodes } from "@/lib/car-catalog";

const FUEL_TYPES = [
  { value: "GASOLINA", label: "Gasolina" },
  { value: "DIESEL", label: "Diésel" },
  { value: "HIBRIDO", label: "Híbrido" },
  { value: "ELECTRICO", label: "Eléctrico" },
  { value: "GLP_GNC", label: "GLP / GNC" },
];

const TRANSMISSIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATICA", label: "Automática" },
];

type FormState = {
  brand: string;
  model: string;
  generation: string;
  engine: string;
  motorCode: string;
  mileage: string;
  fuelType: string;
  transmission: string;
};

const initialState: FormState = {
  brand: "",
  model: "",
  generation: "",
  engine: "",
  motorCode: "",
  mileage: "",
  fuelType: "",
  transmission: "",
};

export default function NuevoVehiculoPage() {
  const router = useRouter();
  const { user, userDoc, refreshUserDoc } = useAuth();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);

  function toggleManualEntry(next: boolean) {
    setManualEntry(next);
    setForm((prev) => ({ ...prev, brand: "", model: "", generation: "", engine: "", motorCode: "" }));
    setErrors({});
  }

  const models = getModels(form.brand);
  const generations = getGenerations(form.brand, form.model);
  const selectedGeneration = generations.find((g) => g.code === form.generation);
  const engineCodes = getEngineCodes(form.engine);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBrandChange(brand: string) {
    setForm((prev) => ({ ...prev, brand, model: "", generation: "", engine: "", motorCode: "" }));
  }

  function handleModelChange(model: string) {
    setForm((prev) => ({ ...prev, model, generation: "", engine: "", motorCode: "" }));
  }

  function handleGenerationChange(generation: string) {
    setForm((prev) => ({ ...prev, generation, engine: "", motorCode: "" }));
  }

  function handleEngineChange(engine: string) {
    setForm((prev) => ({ ...prev, engine, motorCode: "" }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.brand.trim()) next.brand = "La marca es obligatoria";
    if (!form.model.trim()) next.model = "El modelo es obligatorio";
    if (!form.generation.trim()) next.generation = "La generación es obligatoria";
    if (!form.engine.trim()) next.engine = "La motorización es obligatoria";
    if (!form.fuelType) next.fuelType = "Selecciona un tipo de combustible";
    if (!form.transmission) next.transmission = "Selecciona una transmisión";
    if (!form.mileage.trim()) {
      next.mileage = "El kilometraje es obligatorio";
    } else if (Number.isNaN(Number(form.mileage)) || Number(form.mileage) < 0) {
      next.mileage = "Introduce un kilometraje válido";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "vehicles"), {
        brand: form.brand.trim(),
        model: form.model.trim(),
        generation: form.generation.trim(),
        engine: form.engine.trim(),
        motorCode: form.motorCode || null,
        mileage: Number(form.mileage),
        fuelType: form.fuelType,
        transmission: form.transmission,
        userId: user?.uid ?? null,
        createdAt: serverTimestamp(),
      });

      // Cliente Premium que eligió "buscar otro coche": este pasa a ser su vehículo.
      if (user && userDoc?.premium && !userDoc.premiumVehicleId) {
        await fetch("/api/claim-vehicle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, vehicleId: docRef.id }),
        }).catch(() => {});
        await refreshUserDoc();
      }

      router.push(`/garaje/objetivo?vehicleId=${docRef.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "No se pudo guardar el vehículo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-8 px-6 py-16">
      <div>
        <h1 className={`${display.className} italic text-3xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          Busca tu coche
        </h1>
        <span className="mt-2 block h-0.5 w-12 bg-accent" />
        <p className="mt-3 text-zinc-400">Encuentra la mejor configuración para tu coche.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {!manualEntry ? (
          <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Marca" error={errors.brand}>
            <select
              className="input"
              value={form.brand}
              onChange={(e) => handleBrandChange(e.target.value)}
            >
              <option value="">Selecciona...</option>
              {CAR_BRANDS.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Modelo" error={errors.model}>
            <select
              className="input"
              value={form.model}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!form.brand}
            >
              <option value="">{form.brand ? "Selecciona..." : "Elige primero una marca"}</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Generación" error={errors.generation}>
            <select
              className="input"
              value={form.generation}
              onChange={(e) => handleGenerationChange(e.target.value)}
              disabled={!form.model}
            >
              <option value="">{form.model ? "Selecciona..." : "Elige primero un modelo"}</option>
              {generations.map((gen) => (
                <option key={gen.code} value={gen.code}>
                  {gen.label} ({gen.years})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Motorización" error={errors.engine}>
            <select
              className="input"
              value={form.engine}
              onChange={(e) => handleEngineChange(e.target.value)}
              disabled={!form.generation}
            >
              <option value="">{form.generation ? "Selecciona..." : "Elige primero una generación"}</option>
              {(selectedGeneration?.engines ?? []).map((engine) => (
                <option key={engine} value={engine}>
                  {engine}
                </option>
              ))}
            </select>
          </Field>

          {engineCodes.length > 0 && (
            <Field label="Código de motor" optional>
              <select
                className="input"
                value={form.motorCode}
                onChange={(e) => update("motorCode", e.target.value)}
              >
                <option value="">No lo sé / genérico</option>
                {engineCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.power}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleManualEntry(true)}
          className="rounded-md border border-dashed border-garage-700 px-4 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:border-accent hover:text-accent"
        >
          ¿No encuentras tu coche? Escríbelo
        </button>
          </>
        ) : (
          <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Marca" error={errors.brand}>
            <input
              className="input"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              placeholder="Ej: Renault"
            />
          </Field>

          <Field label="Modelo" error={errors.model}>
            <input
              className="input"
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder="Ej: Clio"
            />
          </Field>

          <Field label="Generación" error={errors.generation}>
            <input
              className="input"
              value={form.generation}
              onChange={(e) => update("generation", e.target.value)}
              placeholder="Ej: 3ª generación (2005-2012)"
            />
          </Field>

          <Field label="Motorización" error={errors.engine}>
            <input
              className="input"
              value={form.engine}
              onChange={(e) => update("engine", e.target.value)}
              placeholder="Ej: 1.5 dCi"
            />
          </Field>
        </div>

        <button
          type="button"
          onClick={() => toggleManualEntry(false)}
          className="rounded-md border border-dashed border-garage-700 px-4 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:border-accent hover:text-accent"
        >
          Volver a buscar en el catálogo
        </button>
          </>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Kilometraje" error={errors.mileage}>
            <input
              className="input"
              inputMode="numeric"
              value={form.mileage}
              onChange={(e) => update("mileage", e.target.value)}
              placeholder="120000"
            />
          </Field>

          <Field label="Combustible" error={errors.fuelType}>
            <select
              className="input"
              value={form.fuelType}
              onChange={(e) => update("fuelType", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {FUEL_TYPES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Transmisión" error={errors.transmission}>
            <select
              className="input"
              value={form.transmission}
              onChange={(e) => update("transmission", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {serverError && (
          <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? "Buscando..." : "Buscar modificaciones disponibles"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-300">
        {label} {optional && <span className="font-normal text-zinc-500">(opcional)</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}
