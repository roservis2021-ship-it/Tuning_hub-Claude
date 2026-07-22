"use client";

import { useEffect, useState } from "react";
import { CloseIcon, CrownIcon } from "@/components/icons";

const CYCLE_MS = 24 * 60 * 60 * 1000;
const POPUP_DELAY_MS = 5_000;
const AUTO_SHRINK_MS = 9_000;
const DEADLINE_KEY = "th_offer_deadline";

function getDeadline(): number {
  const stored = localStorage.getItem(DEADLINE_KEY);
  const parsed = stored ? Number(stored) : NaN;
  if (!Number.isNaN(parsed) && parsed > Date.now()) return parsed;
  const next = Date.now() + CYCLE_MS;
  localStorage.setItem(DEADLINE_KEY, String(next));
  return next;
}

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function OfferCountdownPopup({ onCtaClick }: { onCtaClick: () => void }) {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [phase, setPhase] = useState<"hidden" | "popup" | "banner">("hidden");

  useEffect(() => {
    const d = getDeadline();
    setDeadline(d);
    setRemaining(d - Date.now());

    const seenKey = "th_offer_seen_for";
    const alreadySeenThisCycle = localStorage.getItem(seenKey) === String(d);

    const showTimer = setTimeout(
      () => {
        setPhase("popup");
        localStorage.setItem(seenKey, String(d));
      },
      alreadySeenThisCycle ? 0 : POPUP_DELAY_MS
    );

    if (alreadySeenThisCycle) {
      setPhase("banner");
      clearTimeout(showTimer);
    }

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => {
      const d = getDeadline();
      if (d !== deadline) setDeadline(d);
      setRemaining(d - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  useEffect(() => {
    if (phase !== "popup") return;
    const id = setTimeout(() => setPhase("banner"), AUTO_SHRINK_MS);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === "hidden" || deadline === null) return null;

  if (phase === "banner") {
    return (
      <div className="animate-slide-down-in fixed inset-x-0 top-0 z-50 border-b border-accent/50 bg-gradient-to-r from-accent/25 via-accent/10 to-accent/25 backdrop-blur">
        <div
          className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-2"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-accent">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="truncate">
              Oferta termina en <span className="tabular-nums text-zinc-100">{formatRemaining(remaining)}</span>
            </span>
            <span className="animate-urgent-pulse shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-black text-emerald-400">
              -44%
            </span>
          </p>
          <button
            onClick={onCtaClick}
            className="animate-cta-glow relative shrink-0 overflow-hidden rounded-md bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <span className="relative">Guía</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="animate-pop-in relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-accent bg-garage-950 p-6 text-center shadow-[0_0_60px_rgba(230,24,44,0.35)]">
        <div className="pointer-events-none absolute inset-0 animate-glow-pulse rounded-full bg-accent/20 blur-3xl" />

        <button
          onClick={() => setPhase("banner")}
          aria-label="Cerrar oferta"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-garage-700 text-zinc-400 transition hover:border-accent hover:text-accent"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Oferta por tiempo limitado
          </span>

          <p className="animate-urgent-pulse mt-4 text-3xl font-black tabular-nums text-zinc-50">
            {formatRemaining(remaining)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">Termina en</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-lg text-zinc-500 line-through">15,89€</span>
            <span className="text-3xl font-extrabold text-zinc-50">8,89€</span>
            <span className="animate-urgent-pulse rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400">
              -44%
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Pago único, acceso de por vida</p>
          <p className="mt-2 text-[11px] font-semibold text-zinc-400">
            🔥 Ya se han unido <span className="text-accent">+127</span> coches modificados
          </p>

          <button
            onClick={onCtaClick}
            className="animate-cta-glow relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-accent bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.02]"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <span className="relative flex items-center gap-2">
              Obtener Guía
              <CrownIcon className="h-4 w-4 shrink-0" />
            </span>
          </button>
          <p className="mt-2 text-[10px] text-zinc-600">Este precio no se repetirá cuando acabe el contador</p>
        </div>
      </div>
    </div>
  );
}
