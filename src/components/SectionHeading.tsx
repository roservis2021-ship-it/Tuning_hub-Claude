import { display } from "@/lib/fonts";

export function SectionHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className={`${display.className} italic text-2xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          {children}
        </h2>
        <span className="mt-1 block h-0.5 w-10 bg-accent" />
      </div>
      {action}
    </div>
  );
}
