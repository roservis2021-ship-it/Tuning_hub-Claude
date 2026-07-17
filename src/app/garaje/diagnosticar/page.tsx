"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { AppNav } from "@/components/AppNav";
import { AssistantFab } from "@/components/AssistantFab";
import { PremiumGate } from "@/components/PremiumGate";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";

type Vehicle = {
  brand: string;
  model: string;
  generation: string;
  engine: string;
  mileage: number;
};

type Diagnosis = {
  gravedad: "baja" | "media" | "alta" | "urgente";
  posiblesCausas: { causa: string; probabilidad: "alta" | "media" | "baja"; explicacion: string }[];
  recomendacion: string;
  siguientesPasos: string[];
};

const GRAVEDAD_STYLES: Record<Diagnosis["gravedad"], { label: string; className: string }> = {
  urgente: { label: "Urgente — deja de conducir", className: "border-red-500 bg-red-950/50 text-red-300" },
  alta: { label: "Alta — no lo ignores", className: "border-orange-500 bg-orange-950/40 text-orange-300" },
  media: { label: "Media — programa una revisión", className: "border-yellow-500 bg-yellow-950/40 text-yellow-300" },
  baja: { label: "Baja", className: "border-emerald-500 bg-emerald-950/40 text-emerald-300" },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function DiagnosticarContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!vehicleId) return;
    getDoc(doc(db, "vehicles", vehicleId)).then((snap) => {
      if (snap.exists()) setVehicle(snap.data() as Vehicle);
    });
  }, [vehicleId]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  function toggleRecording() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setDescription((prev) => (prev ? prev + " " : "") + transcript);
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Describe brevemente qué está pasando");
      return;
    }
    setError(null);
    setSubmitting(true);
    setResult(null);

    try {
      let imageBase64: string | undefined;
      if (photo) imageBase64 = await fileToBase64(photo);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          brand: vehicle?.brand,
          model: vehicle?.model,
          generation: vehicle?.generation,
          engine: vehicle?.engine,
          mileage: vehicle?.mileage,
          description: description.trim(),
          imageBase64,
          imageMediaType: photo?.type,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo generar el diagnóstico");
      }

      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PremiumGate vehicleId={vehicleId} feature="Diagnosticar">
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4 py-6 pb-24">
      <ScreenHeader
        title={vehicle ? `${vehicle.brand} ${vehicle.model}` : "Diagnosticar"}
        subtitle="Diagnosticar un problema"
        backHref={`/garaje/plan?vehicleId=${vehicleId}`}
      />

      <p className="rounded-md border border-garage-700 bg-garage-900/40 px-4 py-3 text-xs text-zinc-500">
        Esto es una estimación de IA, no sustituye una inspección presencial de un profesional. El micrófono
        transcribe lo que dices (no analiza el sonido en sí); la foto sí se analiza visualmente.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-300">¿Qué está pasando?</span>
          <textarea
            className="input min-h-[100px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: al frenar en curva escucho un chirrido metálico que no hacía antes..."
          />
        </label>

        <div className="flex flex-wrap gap-3">
          {speechSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                recording ? "border-red-500 bg-red-950/40 text-red-300" : "border-garage-700 bg-garage-900 text-zinc-200"
              }`}
            >
              {recording ? "● Grabando... (pulsa para parar)" : "🎤 Dictar por voz"}
            </button>
          )}

          <label className="cursor-pointer rounded-md border border-garage-700 bg-garage-900 px-4 py-2 text-sm font-medium text-zinc-200">
            📷 Adjuntar foto
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>

        {photoPreview && (
          <div className="flex items-center gap-3">
            <img src={photoPreview} alt="Foto adjunta" className="h-20 w-20 rounded-md object-cover" />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPhotoPreview(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Quitar foto
            </button>
          </div>
        )}

        {error && <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? "Diagnosticando..." : "Diagnosticar"}
        </button>
      </form>

      {result && (
        <div className="flex flex-col gap-4 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
          <div className={`rounded-md border px-4 py-3 text-sm font-semibold ${GRAVEDAD_STYLES[result.gravedad].className}`}>
            {GRAVEDAD_STYLES[result.gravedad].label}
          </div>

          <div>
            <SectionHeading>Posibles causas</SectionHeading>
            <div className="mt-2 flex flex-col gap-2">
              {result.posiblesCausas.map((c) => (
                <div key={c.causa} className="rounded-lg border border-garage-700 bg-garage-950/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-100">{c.causa}</span>
                    <span className="text-xs text-zinc-500">Probabilidad {c.probabilidad}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{c.explicacion}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Recomendación</SectionHeading>
            <p className="mt-2 text-sm text-zinc-300">{result.recomendacion}</p>
          </div>

          <div>
            <SectionHeading>Siguientes pasos</SectionHeading>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-300">
              {result.siguientesPasos.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
    <AssistantFab vehicleId={vehicleId} isPremium={true} />
    <AppNav vehicleId={vehicleId} isPremium={true} />
    </PremiumGate>
  );
}

export default function DiagnosticarPage() {
  return (
    <Suspense>
      <DiagnosticarContent />
    </Suspense>
  );
}
