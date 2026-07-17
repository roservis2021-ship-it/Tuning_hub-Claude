export function LedBorderCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-px ${className ?? ""}`}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280%] w-[280%] -translate-x-1/2 -translate-y-1/2 animate-border-spin bg-[conic-gradient(from_0deg,transparent_0deg,rgba(230,24,44,0.9)_18deg,transparent_45deg,transparent_360deg)]"
        style={{ animationDelay: `${-delay}s` }}
      />
      <div className="relative rounded-[11px] bg-garage-900/95">{children}</div>
    </div>
  );
}
