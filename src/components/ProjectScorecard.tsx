import type { ProjectScorecard as ScorecardData } from "@/lib/tuning-engine";

export function ProjectScorecard({ scorecard, currentCv }: { scorecard: ScorecardData; currentCv: number }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-accent/40 bg-gradient-to-b from-garage-900 to-garage-950 p-4">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tu proyecto · primer análisis</span>

      <div className="grid grid-cols-3 gap-2">
        <ScoreTile label="Salud" value={scorecard.salud} />
        <ScoreTile label="Potencial" value={scorecard.potencial} />
        <ScoreTile label="Fiabilidad" value={scorecard.fiabilidad} />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-garage-700 bg-garage-950/60 p-3">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Actual</p>
          <p className="text-lg font-extrabold text-zinc-100">{currentCv} CV</p>
        </div>
        <span className="text-accent">→</span>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Objetivo</p>
          <p className="text-lg font-extrabold text-emerald-400">{scorecard.objetivoCv} CV</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-garage-700 bg-garage-950/40 p-2 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">Preparación recomendada</p>
          <p className="mt-0.5 text-xs font-bold text-zinc-100">{scorecard.preparacionRecomendada}</p>
        </div>
        <div className="rounded-md border border-garage-700 bg-garage-950/40 p-2 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">Tiempo estimado</p>
          <p className="mt-0.5 text-xs font-bold text-zinc-100">{scorecard.tiempoEstimado}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreTile({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "text-emerald-400" : value >= 60 ? "text-yellow-400" : "text-accent";
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-garage-700 bg-garage-950/50 py-2.5">
      <span className={`text-xl font-black ${color}`}>{value}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
    </div>
  );
}
