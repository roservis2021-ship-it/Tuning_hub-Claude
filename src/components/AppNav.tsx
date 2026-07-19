"use client";

import { usePathname } from "next/navigation";
import { ClipboardNavIcon, WrenchNavIcon, PulseNavIcon, UserNavIcon, LockIcon } from "@/components/icons";

type Tab = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  premium: boolean;
};

function buildTabs(vehicleId: string | null): Tab[] {
  const qs = vehicleId ? `?vehicleId=${vehicleId}` : "";
  return [
    { href: `/garaje/plan${qs}`, label: "Plan", icon: ClipboardNavIcon, premium: false },
    { href: `/garaje/mantenimiento${qs}`, label: "Mantenim.", icon: WrenchNavIcon, premium: true },
    { href: `/garaje/diagnosticar${qs}`, label: "Diagnóstico", icon: PulseNavIcon, premium: true },
    { href: `/perfil`, label: "Perfil", icon: UserNavIcon, premium: true },
  ];
}

export function AppNav({ vehicleId, isPremium }: { vehicleId: string | null; isPremium: boolean }) {
  const pathname = usePathname();
  const tabs = buildTabs(vehicleId);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-garage-700 bg-garage-950/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-2xl items-stretch justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href.split("?")[0];
          const locked = tab.premium && !isPremium;
          const Icon = tab.icon;
          return (
            <a
              key={tab.href}
              href={locked ? `/premium${vehicleId ? `?vehicleId=${vehicleId}` : ""}` : tab.href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition ${
                active ? "text-accent" : "text-zinc-500"
              }`}
            >
              {active && <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-accent" />}
              <span className="relative">
                <Icon className="h-5 w-5" />
                {locked && <LockIcon className="absolute -bottom-1 -right-1.5 h-3 w-3" />}
              </span>
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
