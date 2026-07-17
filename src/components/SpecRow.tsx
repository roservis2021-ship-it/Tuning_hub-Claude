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
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/40 text-accent">
        {code ? (
          <span className="text-[9px] font-extrabold uppercase leading-none">{code}</span>
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : null}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
        <span className="text-right">
          <span className="block font-bold text-zinc-50">{value}</span>
          {caption && <span className="block text-[10px] text-zinc-500">{caption}</span>}
        </span>
      </div>
    </div>
  );
}
