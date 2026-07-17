"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { AppNav } from "@/components/AppNav";
import { AssistantFab } from "@/components/AssistantFab";
import { PremiumGate } from "@/components/PremiumGate";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { computeItemStatus, type MaintenanceItem, type MaintenanceLogEntry, type ItemStatus } from "@/lib/maintenance-engine";

type Vehicle = {
  brand: string;
  model: string;
  generation: string;
  engine: string;
  motorCode?: string;
  mileage: number;
  fuelType: string;
  maintenanceGuide?: MaintenanceItem[];
};

const STATUS_LABELS: Record<ItemStatus["status"], { label: string; className: string }> = {
  sin_registro: { label: "Sin registro", className: "text-zinc-500" },
  ok: { label: "Al día", className: "text-emerald-400" },
  proximo: { label: "Próximo", className: "text-yellow-400" },
  atrasado: { label: "Atrasado", className: "text-red-400" },
};

function MantenimientoContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [guide, setGuide] = useState<MaintenanceItem[] | null>(null);
  const [logs, setLogs] = useState<MaintenanceLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [guideLoading, setGuideLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formItem, setFormItem] = useState("");
  const [formMileage, setFormMileage] = useState("");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!vehicleId) {
      setError("Falta el identificador del vehículo");
      setLoading(false);
      return;
    }
    Promise.all([
      getDoc(doc(db, "vehicles", vehicleId)),
      getDocs(query(collection(db, "vehicles", vehicleId, "maintenanceLog"), orderBy("date", "desc"))),
    ])
      .then(([vehicleSnap, logsSnap]) => {
        if (!vehicleSnap.exists()) {
          setError("No se encontró el vehículo");
          return;
        }
        const data = vehicleSnap.data() as Vehicle;
        setVehicle(data);
        setFormMileage(String(data.mileage));
        if (data.maintenanceGuide) setGuide(data.maintenanceGuide);
        setLogs(logsSnap.docs.map((d) => d.data() as MaintenanceLogEntry));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar el vehículo"))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  useEffect(() => {
    if (!vehicle || guide || !vehicleId) return;
    setGuideLoading(true);
    fetch("/api/maintenance-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: vehicle.brand,
        model: vehicle.model,
        generation: vehicle.generation,
        engine: vehicle.engine,
        motorCode: vehicle.motorCode,
        fuelType: vehicle.fuelType,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        setGuide(data.items);
        updateDoc(doc(db, "vehicles", vehicleId), { maintenanceGuide: data.items }).catch(() => {});
      })
      .catch(() => setError("No se pudo generar la guía de mantenimiento"))
      .finally(() => setGuideLoading(false));
  }, [vehicle, guide, vehicleId]);

  const statuses = useMemo(() => {
    if (!guide || !vehicle) return [];
    return guide.map((item) => computeItemStatus(item, logs, vehicle.mileage));
  }, [guide, vehicle, logs]);

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleId || !formItem || !formMileage.trim() || !formDate) return;
    setSaving(true);
    try {
      const entry = { item: formItem, mileage: Number(formMileage), date: formDate, notes: formNotes.trim() || null };
      await addDoc(collection(db, "vehicles", vehicleId, "maintenanceLog"), { ...entry, createdAt: serverTimestamp() });
      setLogs((prev) => [entry as MaintenanceLogEntry, ...prev]);
      setFormNotes("");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-zinc-400">Cargando...</p>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="text-red-400">{error ?? "No se pudo cargar el vehículo"}</p>
      </main>
    );
  }

  return (
    <PremiumGate vehicleId={vehicleId} feature="Mantenimiento">
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4 py-6 pb-24">
        <ScreenHeader
          title={`${vehicle.brand} ${vehicle.model}`}
          subtitle="Mantenimiento e historial"
          backHref={`/garaje/plan?vehicleId=${vehicleId}`}
        />

        {guideLoading && <p className="text-center text-sm text-accent">Generando guía de mantenimiento...</p>}

        {statuses.length > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
            <SectionHeading>Estado</SectionHeading>
            <div className="flex flex-col gap-3">
              {statuses.map(({ item, status, lastMileage, lastDate, nextDueKm, nextDueDate }) => {
                const s = STATUS_LABELS[status];
                return (
                  <div key={item.name} className="rounded-lg border border-garage-700 bg-garage-950/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-zinc-100">{item.name}</h3>
                      <span className={`text-sm font-medium ${s.className}`}>{s.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span>
                        Cada {item.intervalKm.toLocaleString("es-ES")} km / {item.intervalMonths} meses
                      </span>
                      {lastMileage != null && (
                        <span>
                          Último: {lastMileage.toLocaleString("es-ES")} km ({lastDate})
                        </span>
                      )}
                      {nextDueKm != null && (
                        <span>
                          Próximo: {nextDueKm.toLocaleString("es-ES")} km ({nextDueDate})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <form
          onSubmit={handleAddLog}
          className="flex flex-col gap-4 rounded-xl border border-garage-700 bg-garage-900/40 p-4"
        >
          <SectionHeading>Registrar mantenimiento</SectionHeading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-300">Elemento</span>
              <select className="input" value={formItem} onChange={(e) => setFormItem(e.target.value)}>
                <option value="">Selecciona...</option>
                {(guide ?? []).map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-300">Kilometraje</span>
              <input className="input" inputMode="numeric" value={formMileage} onChange={(e) => setFormMileage(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-300">Fecha</span>
              <input className="input" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-300">Notas (opcional)</span>
              <input
                className="input"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Taller, referencia de pieza..."
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving || !formItem}
            className="rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Registrar"}
          </button>
        </form>

        {logs.length > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
            <SectionHeading>Historial</SectionHeading>
            <div className="divide-y divide-garage-700 rounded-lg border border-garage-700 bg-garage-950/40">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-zinc-100">{log.item}</p>
                    {log.notes && <p className="text-xs text-zinc-500">{log.notes}</p>}
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    <p>{log.mileage.toLocaleString("es-ES")} km</p>
                    <p>{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <AssistantFab vehicleId={vehicleId} isPremium={true} />
      <AppNav vehicleId={vehicleId} isPremium={true} />
    </PremiumGate>
  );
}

export default function MantenimientoPage() {
  return (
    <Suspense>
      <MantenimientoContent />
    </Suspense>
  );
}
