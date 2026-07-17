export function HeroBanner({ label }: { label: string }) {
  return (
    <div className="relative isolate h-40 overflow-hidden rounded-xl border border-garage-700 bg-garage-900 sm:h-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-40%] h-[140%] w-[120%] animate-spotlight-sway [background:conic-gradient(from_205deg_at_50%_0%,transparent_0deg,rgba(230,24,44,0.28)_16deg,transparent_38deg)]" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 animate-glow-pulse rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-full opacity-20 [background:repeating-linear-gradient(100deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_2px,transparent_2px,transparent_16px)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(230,24,44,0.12),transparent)]" />
        <div className="absolute inset-x-6 bottom-4 h-px bg-accent/50 shadow-[0_0_30px_6px_rgba(230,24,44,0.4)]" />
      </div>
      <div className="relative flex h-full items-center justify-center">
        <span className="rounded border border-accent/50 bg-garage-950/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-zinc-300">
          Tuning <span className="text-accent">Hub</span>
        </span>
      </div>
      <p className="absolute bottom-2 right-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">{label}</p>
    </div>
  );
}
