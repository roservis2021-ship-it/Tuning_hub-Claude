"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { display } from "@/lib/fonts";
import { LedBorderCard } from "@/components/LedBorderCard";
import {
  ShieldCheckIcon,
  TargetIcon,
  LockIcon,
  EngineIcon,
  WrenchNavIcon,
  GaugeIcon,
  MessageFabIcon,
  CheckCircleIcon,
  TrendUpIcon,
  CrownIcon,
  RefreshIcon,
} from "@/components/icons";

const TRUST_BADGES = [
  { icon: ShieldCheckIcon, label: "Información", highlight: "100% fiable" },
  { icon: TargetIcon, label: "Recomendaciones", highlight: "personalizadas" },
  { icon: LockIcon, label: "Datos exclusivos", highlight: "para miembros" },
];

const FEATURES = [
  { icon: EngineIcon, title: "Diagnosticar", desc: "Describe un problema o sube una foto y recibe un diagnóstico al instante." },
  { icon: WrenchNavIcon, title: "Mantenimiento", desc: "Historial completo, recordatorios y aviso de qué tienes pendiente." },
  { icon: GaugeIcon, title: "Modificaciones", desc: "Registra tus mods reales y sigue tu progreso frente al plan." },
  { icon: MessageFabIcon, title: "Ingeniero", desc: "Chatea con tu ingeniero IA, que conoce tu coche, tu historial y tus mods." },
];

const FOOTER_TRUST = [
  { icon: ShieldCheckIcon, label: "Cancela cuando quieras" },
  { icon: LockIcon, label: "Pago 100% seguro" },
  { icon: RefreshIcon, label: "Actualizaciones continuas" },
];

function PremiumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const { userDoc } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const lockedToOtherVehicle =
    !!userDoc?.premium && !!userDoc.premiumVehicleId && userDoc.premiumVehicleId !== vehicleId;

  function handleSubscribe() {
    if (lockedToOtherVehicle || !vehicleId) return;
    setSubmitting(true);
    router.push(`/pago?vehicleId=${vehicleId}`);
  }

  return (
    <>
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-8 px-6 pt-16 pb-48">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Premium</span>
        <h1 className={`${display.className} italic mt-2 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-zinc-50`}>
          Lleva tu coche al siguiente <span className="text-accent">nivel</span>
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Todo lo que necesitas para cuidar, mejorar y exprimir tu coche. <span className="text-accent">En un solo sitio.</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-garage-700 bg-garage-900/40 p-4">
        {TRUST_BADGES.map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
            <b.icon className="h-6 w-6 text-emerald-400" />
            <p className="text-[10px] font-semibold uppercase leading-tight text-zinc-400">
              {b.label}
              <br />
              <span className="text-emerald-400">{b.highlight}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-garage-700" />
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
          Todo lo que <span className="text-accent">obtienes</span>
        </p>
        <span className="h-px flex-1 bg-garage-700" />
      </div>

      <ul className="flex flex-col gap-3">
        {FEATURES.map((f, i) => (
          <li key={f.title}>
            <LedBorderCard delay={i * 1}>
              <div className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent/40 text-accent">
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold uppercase tracking-wide text-zinc-100">{f.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-400">{f.desc}</p>
                </div>
                <CheckCircleIcon className="h-6 w-6 shrink-0 text-emerald-400" />
              </div>
            </LedBorderCard>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
        <TrendUpIcon className="h-8 w-8 shrink-0 text-emerald-400" />
        <div>
          <p className="font-bold uppercase tracking-wide text-emerald-400">Mejora. Controla. Disfruta.</p>
          <p className="mt-0.5 text-sm text-zinc-300">Rendimiento, fiabilidad y seguridad. Todo en una sola plataforma.</p>
        </div>
      </div>

      {lockedToOtherVehicle && (
        <div className="flex flex-col gap-3 text-center">
          <p className="rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-zinc-300">
            Tu cuenta Premium ya está vinculada a otro vehículo. Cada cuenta gestiona un único coche.
          </p>
          <a
            href={`/garaje/plan?vehicleId=${userDoc?.premiumVehicleId}`}
            className="rounded-md border-2 border-accent px-6 py-4 text-lg font-bold uppercase tracking-wide text-accent transition hover:bg-accent hover:text-white"
          >
            Ir a tu vehículo Premium
          </a>
        </div>
      )}
    </main>

    {!lockedToOtherVehicle && (
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-garage-700 bg-garage-950/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md flex-col gap-2 px-5 py-3">
          <button
            onClick={handleSubscribe}
            disabled={submitting}
            className="relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-md border-2 border-accent bg-accent px-5 py-3 text-white shadow-[0_0_22px_rgba(230,24,44,0.45)] transition hover:bg-accent/90 disabled:opacity-60"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <span className="relative flex flex-col items-start leading-none">
              <span className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold">11,99€</span>
                <span className="text-sm font-semibold text-white/60 line-through">18,99€</span>
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/80">al mes</span>
            </span>
            <span className="relative flex items-center gap-2 text-base font-bold uppercase tracking-wide">
              {submitting ? "Redirigiendo…" : "Obtener plan"}
              <CrownIcon className="h-5 w-5" />
            </span>
          </button>

          <div className="flex items-center justify-center gap-x-3 gap-y-0.5 flex-wrap text-center">
            {FOOTER_TRUST.map((t) => (
              <span key={t.label} className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-zinc-500">
                <t.icon className="h-3 w-3 text-emerald-400" />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default function PremiumPage() {
  return (
    <Suspense>
      <PremiumContent />
    </Suspense>
  );
}
