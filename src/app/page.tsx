import Link from "next/link";
import Image from "next/image";
import { Archivo_Black, Caveat } from "next/font/google";

const display = Archivo_Black({ subsets: ["latin"], weight: "400" });
const handwriting = Caveat({ subsets: ["latin"], weight: ["700"] });

const FEATURES = [
  { label: "Fichas técnicas", icon: DocumentIcon },
  { label: "Plan de modificación", icon: ChartIcon },
  { label: "Mantenimiento y averías", icon: WrenchIcon },
  { label: "Ingeniero IA", icon: ChatIcon },
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-garage-950">
      <div
        className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-garage-950/70 backdrop-blur-sm"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <p className="mx-auto max-w-3xl px-6 py-2.5 text-center text-xs text-zinc-400">
          ¿Ya eres premium?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          className="scale-105 object-cover object-[50%_22%] opacity-95 blur-[2px]"
        />
        <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-garage-950/25 via-garage-950/55 to-garage-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-garage-950/70 via-transparent to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-15%] h-[65vh] w-[160vw] animate-spotlight-sway [background:conic-gradient(from_205deg_at_50%_0%,transparent_0deg,rgba(230,24,44,0.22)_16deg,transparent_38deg)]" />
        <div className="absolute left-1/2 top-[32%] h-[46vh] w-[46vh] animate-glow-pulse rounded-full bg-accent/25 blur-[110px]" />
        <div className="absolute inset-x-0 top-0 h-40 opacity-25 [background:repeating-linear-gradient(100deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_18px)]" />
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-[linear-gradient(to_top,rgba(230,24,44,0.10),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-accent/40 shadow-[0_0_50px_12px_rgba(230,24,44,0.35)]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-7 px-6 py-24 text-center">
        <p
          className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500"
          style={{ animationDelay: "0ms" }}
        >
          Información <span className="text-accent">·</span> Rendimiento <span className="text-accent">·</span> Pasión
        </p>

        <h1
          className={`${display.className} animate-fade-up text-6xl uppercase leading-[0.88] tracking-tight sm:text-7xl`}
          style={{ animationDelay: "90ms" }}
        >
          <span className="text-zinc-100 [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]">Tuning</span>
          <br />
          <span className={`${handwriting.className} relative inline-block animate-neon-text text-[1.5em] normal-case leading-none text-accent`}>
            Hub
            <span
              aria-hidden
              className="animate-shimmer absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/80 to-transparent bg-clip-text text-transparent"
            >
              Hub
            </span>
          </span>
        </h1>

        <p className="animate-fade-up max-w-md text-balance text-lg text-zinc-300" style={{ animationDelay: "180ms" }}>
          Descubre una guía personalizada para modificar y cuidar tu vehículo.
        </p>

        <Link
          href="/garaje/nuevo"
          className="animate-fade-up group relative mt-2 overflow-hidden rounded-md border-2 border-accent px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:text-garage-950"
          style={{ animationDelay: "260ms" }}
        >
          <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <span className="relative flex items-center gap-2">
            Buscar mi coche
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>

        <div
          className="animate-fade-up mt-10 grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4"
          style={{ animationDelay: "340ms" }}
        >
          {FEATURES.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-7 w-7 text-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
            </div>
          ))}
        </div>

        <div
          className="animate-fade-up mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-600"
          style={{ animationDelay: "420ms" }}
        >
          <ShieldIcon className="h-4 w-4 shrink-0 text-accent" />
          <span>
            <span className="text-accent">IA real</span> · Gratis para empezar ·{" "}
            <span className="text-accent">Para apasionados</span>
          </span>
        </div>
      </div>
    </main>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M6 3h9l3 3v15H6z" strokeLinejoin="round" />
      <path d="M15 3v4h4" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4 20V13M9.5 20V9M15 20v-7.5M20.5 20V5" strokeLinecap="round" />
      <path d="M2 20h20" strokeLinecap="round" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.6-2.6z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4 4h16v12H8l-4 4V4z" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" strokeLinejoin="round" />
    </svg>
  );
}
