"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, sendEmailVerification } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { AppNav } from "@/components/AppNav";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionHeading } from "@/components/SectionHeading";

type Vehicle = {
  brand: string;
  model: string;
  engine: string;
  modProgress?: { estimatedPower: string; estimatedTorque: string; summary: string };
};

export default function PerfilPage() {
  const router = useRouter();
  const { user, userDoc, loading } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [resent, setResent] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const premiumVehicleId = userDoc?.premiumVehicleId;

  useEffect(() => {
    if (!premiumVehicleId) return;
    getDoc(doc(db, "vehicles", premiumVehicleId)).then((snap) => {
      if (snap.exists()) setVehicle(snap.data() as Vehicle);
    });
  }, [premiumVehicleId]);

  async function handleResend() {
    if (!user) return;
    await sendEmailVerification(user).catch(() => {});
    setResent(true);
  }

  async function handlePortal() {
    if (!user) return;
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else setPortalLoading(false);
    } catch {
      setPortalLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(getFirebaseAuth());
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-zinc-400">Cargando…</p>
      </main>
    );
  }

  if (!user || !userDoc?.premium) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-3xl">🔒</span>
        <p className="max-w-xs text-sm text-zinc-400">Inicia sesión con tu cuenta Premium para ver tu perfil.</p>
        <a href="/login" className="rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90">
          Iniciar sesión
        </a>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4 py-6 pb-24">
        <ScreenHeader title="Perfil" subtitle="Tu cuenta" backHref={premiumVehicleId ? `/garaje/plan?vehicleId=${premiumVehicleId}` : "/"} />

        {!user.emailVerified && (
          <div className="flex flex-col gap-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
            <p className="text-sm text-yellow-200">Verifica tu email para asegurar tu cuenta.</p>
            <button
              onClick={handleResend}
              disabled={resent}
              className="self-start rounded-md border border-yellow-500/50 px-3 py-1.5 text-xs font-semibold text-yellow-200 transition hover:bg-yellow-500/10 disabled:opacity-60"
            >
              {resent ? "Correo enviado ✓" : "Reenviar verificación"}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
          <SectionHeading>Datos</SectionHeading>
          <div className="divide-y divide-garage-700 rounded-lg border border-garage-700 bg-garage-950/40">
            <Row label="Nombre" value={userDoc.name || "—"} />
            <Row label="Email" value={user.email ?? "—"} />
            <Row label="Estado" value={user.emailVerified ? "Verificado" : "Sin verificar"} />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
          <SectionHeading>Vehículo</SectionHeading>
          {vehicle ? (
            <div className="divide-y divide-garage-700 rounded-lg border border-garage-700 bg-garage-950/40">
              <Row label="Coche" value={`${vehicle.brand} ${vehicle.model}`} />
              <Row label="Motor" value={vehicle.engine} />
              <Row
                label="Progreso"
                value={vehicle.modProgress ? `${vehicle.modProgress.estimatedPower} · ${vehicle.modProgress.estimatedTorque}` : "Sin progreso aún"}
              />
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Aún no has asignado un vehículo.</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="rounded-md border border-garage-700 bg-garage-900 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-accent disabled:opacity-60"
          >
            {portalLoading ? "Abriendo…" : "Gestionar suscripción"}
          </button>
          <button
            onClick={handleLogout}
            className="rounded-md px-6 py-3 text-sm font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            Cerrar sesión
          </button>
        </div>
      </main>
      <AppNav vehicleId={premiumVehicleId ?? null} isPremium={true} />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">{label}</span>
      <span className="text-right text-sm font-semibold text-zinc-100">{value}</span>
    </div>
  );
}
