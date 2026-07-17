import { ChevronRightIcon, LockIcon, WrenchNavIcon, PulseNavIcon } from "@/components/icons";

type Action = {
  href: string;
  lockedHref: string;
  icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  locked: boolean;
};

export function QuickActions({ vehicleId, isPremium }: { vehicleId: string | null; isPremium: boolean }) {
  const premiumHref = `/premium${vehicleId ? `?vehicleId=${vehicleId}` : ""}`;

  const actions: Action[] = [
    {
      href: `/garaje/mantenimiento?vehicleId=${vehicleId}`,
      lockedHref: premiumHref,
      icon: WrenchNavIcon,
      label: "Mantenimiento e historial",
      locked: !isPremium,
    },
    {
      href: `/garaje/diagnosticar?vehicleId=${vehicleId}`,
      lockedHref: premiumHref,
      icon: PulseNavIcon,
      label: "Diagnosticar un problema",
      locked: !isPremium,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const [first, second] = splitTwoLines(action.label);
        return (
          <a
            key={action.label}
            href={action.locked ? action.lockedHref : action.href}
            className="flex items-center justify-between gap-2 rounded-lg border border-accent/40 bg-garage-900 px-3 py-2.5 transition hover:border-accent"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="relative shrink-0 text-accent">
                <Icon className="h-5 w-5" />
                {action.locked && (
                  <LockIcon className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-garage-900 text-accent" />
                )}
              </span>
              <span className="text-[11px] font-bold uppercase leading-tight tracking-wide text-zinc-200">
                {first}
                {second && (
                  <>
                    <br />
                    {second}
                  </>
                )}
              </span>
            </span>
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-accent" />
          </a>
        );
      })}
    </div>
  );
}

function splitTwoLines(label: string): [string, string] {
  const words = label.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
