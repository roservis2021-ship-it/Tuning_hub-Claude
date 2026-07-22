"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, getDoc, getDocs, addDoc, orderBy, query, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { AppNav } from "@/components/AppNav";
import { AssistantFab } from "@/components/AssistantFab";
import { VerifyEmailBanner } from "@/components/VerifyEmailBanner";
import { PromoRotatingBanner } from "@/components/PromoRotatingBanner";
import { ScreenHeader } from "@/components/ScreenHeader";
import { HeroBanner } from "@/components/HeroBanner";
import { QuickActions } from "@/components/QuickActions";
import { SectionHeading } from "@/components/SectionHeading";
import { SpecRow } from "@/components/SpecRow";
import {
  EngineIcon,
  GaugeIcon,
  TorqueIcon,
  TurboIcon,
  KeyIcon,
  DrivetrainIcon,
  ChipIcon,
  ChainIcon,
  FuelIcon,
  OdometerIcon,
  ChartSmallIcon,
} from "@/components/icons";
import { computeSpecs, generateModPlan, generateRisks, generateMaintenance, type ModStage } from "@/lib/tuning-engine";

type ModLogEntry = {
  name: string;
  date: string;
  notes?: string | null;
};

type ModProgress = {
  estimatedPower: string;
  estimatedTorque: string;
  summary: string;
  nextStep: { title: string; reasoning: string };
};

type DisplaySpecs = {
  potencia: string;
  par: string;
  aspiracion: string;
  codigoMotor: string;
  centralita: string;
  distribucion: string;
  traccion: string;
};

type TuningPlan = {
  specs: DisplaySpecs;
  stages: ModStage[];
  risks: string[];
  maintenance: string[];
};

type Vehicle = {
  brand: string;
  model: string;
  generation: string;
  engine: string;
  motorCode?: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  objectives?: string[];
  aiPlan?: TuningPlan;
  modProgress?: ModProgress;
};

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

function PlanContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const { userDoc, refreshUserDoc } = useAuth();
  const isPremium = !!userDoc?.premium && userDoc.premiumVehicleId === vehicleId;
  const justCheckedOut = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (!justCheckedOut || isPremium) return;
    const interval = setInterval(refreshUserDoc, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 20000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [justCheckedOut, isPremium, refreshUserDoc]);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aiPlan, setAiPlan] = useState<TuningPlan | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFailed, setAiFailed] = useState(false);

  const [modLog, setModLog] = useState<ModLogEntry[]>([]);
  const [modProgress, setModProgress] = useState<ModProgress | null>(null);
  const [modProgressLoading, setModProgressLoading] = useState(false);

  const [index, setIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideHeight, setSlideHeight] = useState<number | undefined>(undefined);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!vehicleId) {
      setError("Falta el identificador del vehículo");
      setLoading(false);
      return;
    }
    Promise.all([
      getDoc(doc(db, "vehicles", vehicleId)),
      getDocs(query(collection(db, "vehicles", vehicleId, "modLog"), orderBy("date", "asc"))),
    ])
      .then(([snap, modsSnap]) => {
        if (!snap.exists()) {
          setError("No se encontró el vehículo");
          return;
        }
        const data = snap.data() as Vehicle;
        setVehicle(data);
        if (data.aiPlan) setAiPlan(data.aiPlan);
        if (data.modProgress) setModProgress(data.modProgress);
        setModLog(modsSnap.docs.map((d) => d.data() as ModLogEntry));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar el vehículo"))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  useEffect(() => {
    if (!vehicle || vehicle.aiPlan || !vehicleId) return;
    setAiLoading(true);
    setAiFailed(false);
    fetch("/api/tuning-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo generar el plan");
        const data = await res.json();
        setAiPlan(data);
        updateDoc(doc(db, "vehicles", vehicleId), { aiPlan: data }).catch(() => {});
      })
      .catch(() => setAiFailed(true))
      .finally(() => setAiLoading(false));
  }, [vehicle, vehicleId]);

  const fallbackSpecs = useMemo(() => {
    if (!vehicle) return null;
    return computeSpecs(vehicle.brand, vehicle.model, vehicle.engine, vehicle.fuelType, vehicle.motorCode);
  }, [vehicle]);

  const fallbackStages = useMemo(() => {
    if (!vehicle || !fallbackSpecs) return [];
    return generateModPlan({
      aspiracion: fallbackSpecs.aspiracion,
      objectives: vehicle.objectives ?? [],
      mileage: vehicle.mileage,
      potencia: fallbackSpecs.potencia,
    });
  }, [vehicle, fallbackSpecs]);

  const fallbackRisks = useMemo(() => {
    if (!vehicle || !fallbackSpecs) return [];
    return generateRisks({
      aspiracion: fallbackSpecs.aspiracion,
      objectives: vehicle.objectives ?? [],
      mileage: vehicle.mileage,
      stages: fallbackStages,
    });
  }, [vehicle, fallbackSpecs, fallbackStages]);

  const fallbackMaintenance = useMemo(() => {
    if (!vehicle || !fallbackSpecs) return [];
    return generateMaintenance({ aspiracion: fallbackSpecs.aspiracion, mileage: vehicle.mileage, stages: fallbackStages });
  }, [vehicle, fallbackSpecs, fallbackStages]);

  const plan: TuningPlan | null = aiPlan
    ? aiPlan
    : fallbackSpecs
    ? {
        specs: {
          potencia: fallbackSpecs.potencia.label,
          par: fallbackSpecs.par,
          aspiracion: fallbackSpecs.aspiracion,
          codigoMotor: fallbackSpecs.codigoMotor,
          centralita: fallbackSpecs.centralita,
          distribucion: fallbackSpecs.distribucion,
          traccion: fallbackSpecs.traccion,
        },
        stages: fallbackStages,
        risks: fallbackRisks,
        maintenance: fallbackMaintenance,
      }
    : null;

  function refreshModProgress() {
    if (!vehicleId) return;
    setModProgressLoading(true);
    fetch("/api/mod-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!data.error) setModProgress(data);
      })
      .catch(() => {})
      .finally(() => setModProgressLoading(false));
  }

  useEffect(() => {
    if (!isPremium || !vehicleId || !plan || modProgress || modProgressLoading) return;
    refreshModProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium, vehicleId, plan]);

  async function handleAddMod(entry: ModLogEntry) {
    if (!vehicleId) return;
    await addDoc(collection(db, "vehicles", vehicleId, "modLog"), { ...entry, createdAt: serverTimestamp() });
    setModLog((prev) => [...prev, entry]);
    refreshModProgress();
  }

  const screens = ["Características", "Modificaciones", "Recomendaciones"];

  function handlePointerDown(e: ReactPointerEvent) {
    setDragStartX(e.clientX);
  }

  function handlePointerMove(e: ReactPointerEvent) {
    if (dragStartX === null) return;
    setDragOffset(e.clientX - dragStartX);
  }

  function endDrag() {
    if (dragOffset < -80 && index < screens.length - 1) {
      setIndex((i) => i + 1);
    } else if (dragOffset > 80 && index > 0) {
      setIndex((i) => i - 1);
    }
    setDragStartX(null);
    setDragOffset(0);
  }

  useLayoutEffect(() => {
    const el = slideRefs.current[index];
    if (el) setSlideHeight(el.offsetHeight);
  }, [index, plan, modProgress, modLog]);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-zinc-400">Cargando plan...</p>
      </main>
    );
  }

  if (error || !vehicle || !plan) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="text-red-400">{error ?? "No se pudo cargar el vehículo"}</p>
      </main>
    );
  }

  if (aiLoading && !aiPlan) {
    return <ProgressiveLoadingScreen vehicle={vehicle} />;
  }

  return (
    <>
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4 py-6 pb-24">
        <ScreenHeader title={`${vehicle.brand} ${vehicle.model}`} subtitle="Plan de acción tuning" backHref="/" />

        {isPremium && <VerifyEmailBanner />}
        {!isPremium && !justCheckedOut && <PromoRotatingBanner vehicleId={vehicleId} />}

        {justCheckedOut && !isPremium && (
          <p className="-mt-3 flex items-center justify-center gap-2 text-center text-xs text-accent">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            Activando tu Premium…
          </p>
        )}

        {aiFailed && (
          <p className="-mt-3 text-center text-xs text-zinc-500">
            No se pudo generar el plan — mostrando una estimación básica.
          </p>
        )}

        <HeroBanner label={vehicle.engine} />

        <QuickActions vehicleId={vehicleId} isPremium={isPremium} />

        <div className="flex items-center justify-center gap-2">
          {screens.map((label, i) => (
            <div
              key={label}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-accent" : "w-1.5 bg-garage-700"}`}
            />
          ))}
        </div>

        <div
          className="overflow-hidden touch-pan-y select-none"
          style={{ height: slideHeight, transition: "height 250ms ease" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={() => dragStartX !== null && endDrag()}
        >
          <div
            className="flex items-start"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
              transition: dragStartX === null ? "transform 300ms ease" : "none",
            }}
          >
            <div ref={(el) => { slideRefs.current[0] = el; }} className="w-full shrink-0 px-1">
              <CaracteristicasScreen
                vehicle={vehicle}
                specs={plan.specs}
                isAi={!!aiPlan}
                onViewProgress={() => setIndex(1)}
              />
            </div>
            <div ref={(el) => { slideRefs.current[1] = el; }} className="w-full shrink-0 px-1">
              <ModificacionesScreen
                stages={plan.stages}
                modLog={modLog}
                modProgress={modProgress}
                modProgressLoading={modProgressLoading}
                onAddMod={handleAddMod}
                isPremium={isPremium}
                vehicleId={vehicleId}
              />
            </div>
            <div ref={(el) => { slideRefs.current[2] = el; }} className="w-full shrink-0 px-1">
              <RecomendacionesScreen risks={plan.risks} maintenance={plan.maintenance} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pr-16 text-sm text-zinc-500">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="hidden sm:inline">Desliza para continuar</span>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(screens.length - 1, i + 1))}
            disabled={index === screens.length - 1}
            className="disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      </main>
      <AssistantFab vehicleId={vehicleId} isPremium={isPremium} />
      <AppNav vehicleId={vehicleId} isPremium={isPremium} />
    </>
  );
}

const LOADING_MESSAGES_TEMPLATE = (vehicle: Vehicle) => [
  `Analizando tu ${vehicle.brand} ${vehicle.model}...`,
  "Calculando potencia, par y aspiración...",
  "Repasando el historial típico de este motor...",
  "Diseñando el plan de modificaciones por etapas...",
  "Evaluando riesgos reales y mantenimiento...",
  "Puliendo las recomendaciones finales...",
];

const ESTIMATED_DURATION_MS = 30000;

function ProgressiveLoadingScreen({ vehicle }: { vehicle: Vehicle }) {
  const messages = useMemo(() => LOADING_MESSAGES_TEMPLATE(vehicle), [vehicle]);
  const [progress, setProgress] = useState(4);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(92, (elapsed / ESTIMATED_DURATION_MS) * 100);
      setProgress(Math.max(4, pct));
      setMessageIndex(Math.min(messages.length - 1, Math.floor((elapsed / ESTIMATED_DURATION_MS) * messages.length)));
    }, 250);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-garage-700 border-t-accent" />
      <p className="min-h-[1.5rem] text-lg font-medium text-zinc-100">{messages[messageIndex]}</p>
      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-garage-700">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">Esto puede tardar unos segundos, estamos preparando tu plan</p>
    </main>
  );
}

function CaracteristicasScreen({
  vehicle,
  specs,
  isAi,
  onViewProgress,
}: {
  vehicle: Vehicle;
  specs: DisplaySpecs;
  isAi: boolean;
  onViewProgress: () => void;
}) {
  const rows: { icon: (p: { className?: string }) => React.ReactNode; code?: string; label: string; value: string; caption?: string }[] = [
    { icon: EngineIcon, label: "Motorización", value: vehicle.engine },
    { icon: GaugeIcon, label: "Potencia", value: specs.potencia },
    { icon: TorqueIcon, label: "Par motor", value: specs.par },
    { icon: TurboIcon, label: "Aspiración", value: specs.aspiracion },
    {
      code: vehicle.motorCode || undefined,
      icon: EngineIcon,
      label: "Código de motor",
      value: vehicle.motorCode || specs.codigoMotor,
    },
    { icon: KeyIcon, label: "Transmisión", value: TRANSMISSION_LABELS[vehicle.transmission] ?? vehicle.transmission },
    { icon: DrivetrainIcon, label: "Tracción", value: specs.traccion },
    { icon: ChipIcon, label: "Centralita (ECU)", value: specs.centralita },
    { icon: ChainIcon, label: "Distribución", value: specs.distribucion },
    { icon: FuelIcon, label: "Combustible", value: FUEL_LABELS[vehicle.fuelType] ?? vehicle.fuelType },
    { icon: OdometerIcon, label: "Kilometraje", value: `${vehicle.mileage.toLocaleString("es-ES")} km` },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
      <SectionHeading
        action={
          <button
            type="button"
            onClick={onViewProgress}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-garage-700 text-accent transition hover:border-accent"
            aria-label="Ver progreso"
          >
            <ChartSmallIcon className="h-4 w-4" />
          </button>
        }
      >
        Características
      </SectionHeading>
      <div className="divide-y divide-garage-700 rounded-lg border border-garage-700 bg-garage-950/40">
        {rows.map((row) => (
          <SpecRow key={row.label} icon={row.icon} code={row.code} label={row.label} value={row.value} />
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        {isAi
          ? "Análisis personalizado a partir de los datos del vehículo. Consulta la ficha técnica oficial de tu unidad para datos certificados."
          : "Valores orientativos según la motorización y la marca. Consulta la ficha técnica oficial de tu unidad para datos exactos."}
      </p>
    </div>
  );
}

function ModificacionesScreen({
  stages,
  modLog,
  modProgress,
  modProgressLoading,
  onAddMod,
  isPremium,
  vehicleId,
}: {
  stages: ModStage[];
  modLog: ModLogEntry[];
  modProgress: ModProgress | null;
  modProgressLoading: boolean;
  onAddMod: (entry: ModLogEntry) => Promise<void>;
  isPremium: boolean;
  vehicleId: string | null;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onAddMod({ name: name.trim(), date, notes: notes.trim() || null });
      setName("");
      setNotes("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!isPremium ? (
        <a
          href={`/premium?vehicleId=${vehicleId}`}
          className="flex flex-col gap-2 rounded-xl border border-accent/40 bg-garage-900/40 p-4"
        >
          <p className="font-semibold text-zinc-100">🔒 Seguimiento real de tus mods</p>
          <p className="text-sm text-zinc-300">
            Registra lo que instalas y calculamos tu potencia y par estimados frente al plan, con el siguiente paso lógico.
          </p>
          <span className="text-sm font-semibold text-accent">Mejorar a Premium →</span>
        </a>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
          <SectionHeading>Tu progreso</SectionHeading>
          {modProgressLoading && !modProgress && <p className="text-sm text-accent">Evaluando tu progreso...</p>}
          {modProgress && (
            <div className="flex flex-col gap-3 rounded-lg border border-garage-700 bg-garage-950/40 p-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-zinc-500">Potencia estimada</p>
                  <p className="font-semibold text-zinc-100">{modProgress.estimatedPower}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Par estimado</p>
                  <p className="font-semibold text-zinc-100">{modProgress.estimatedTorque}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300">{modProgress.summary}</p>
              <div className="rounded-md border border-accent/40 bg-accent/10 p-3">
                <p className="text-xs font-medium text-accent">Siguiente paso lógico</p>
                <p className="mt-1 font-semibold text-zinc-100">{modProgress.nextStep.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{modProgress.nextStep.reasoning}</p>
              </div>
              {modProgressLoading && <p className="text-xs text-zinc-500">Actualizando...</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-garage-700 bg-garage-950/40 p-4">
            <h3 className="font-semibold text-zinc-100">Registrar modificación instalada</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Reprogramación Stage 1"
              />
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <input
              className="input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas (opcional): taller, marca de la pieza..."
            />
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Registrar"}
            </button>
          </form>

          {modLog.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-zinc-100">Historial de modificaciones</h3>
              <div className="divide-y divide-garage-700 rounded-lg border border-garage-700 bg-garage-950/40">
                {modLog.map((m, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-zinc-100">{m.name}</p>
                      {m.notes && <p className="text-xs text-zinc-500">{m.notes}</p>}
                    </div>
                    <span className="text-xs text-zinc-400">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
        <SectionHeading>Plan sugerido</SectionHeading>
        <div className="flex flex-col gap-4">
          {stages.map((stage) => (
            <div key={stage.title} className="rounded-lg border border-garage-700 bg-garage-950/40 p-4">
              <h3 className="font-semibold text-accent">{stage.title}</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-300">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {stage.note && <p className="mt-2 text-xs text-zinc-500">{stage.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecomendacionesScreen({ risks, maintenance }: { risks: string[]; maintenance: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
        <SectionHeading>Riesgos reales</SectionHeading>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-300">
          {risks.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
        <SectionHeading>Mantenimiento requerido</SectionHeading>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-300">
          {maintenance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense>
      <PlanContent />
    </Suspense>
  );
}
