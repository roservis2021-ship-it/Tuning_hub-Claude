type IconComponent = (props: { className?: string }) => React.ReactNode;

export function SpecRow({
  icon: Icon,
  code,
  label,
  value,
  caption,
}: {
  icon?: IconComponent;
  code?: string;
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-accent/30 text-accent/90">
        {code ? (
          <span className="text-[8px] font-bold uppercase leading-none tracking-tight">{code}</span>
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : null}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">{label}</span>
        <span className="text-right">
          <span className="block text-[13px] font-semibold tabular-nums tracking-tight text-zinc-100">{value}</span>
          {caption && <span className="block text-[9px] uppercase tracking-wide text-zinc-600">{caption}</span>}
        </span>
      </div>
    </div>
  );
}
