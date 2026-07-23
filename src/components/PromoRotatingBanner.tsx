"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Crea el proyecto de tu vehículo",
  "Aquí comienza tu proyecto",
  "Los mejores mods para tu coche",
];

const ROTATE_MS = 4_000;

export function PromoRotatingBanner({ vehicleId }: { vehicleId: string | null }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-accent/40 bg-gradient-to-r from-accent/20 via-garage-950/90 to-accent/20 backdrop-blur">
      <div
        className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-2.5"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="animate-urgent-pulse shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-black text-white">
            -44%
          </span>
          <p key={index} className="animate-fade-up min-w-0 truncate text-xs font-semibold text-zinc-100">
            {MESSAGES[index]}
          </p>
        </div>
        <a
          href={`/premium${vehicleId ? `?vehicleId=${vehicleId}` : ""}`}
          className="relative shrink-0 overflow-hidden rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_16px_rgba(230,24,44,0.4)]"
        >
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          <span className="relative">Guía</span>
        </a>
      </div>
    </div>
  );
}
