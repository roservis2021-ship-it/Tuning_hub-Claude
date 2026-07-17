"use client";

import { useRouter } from "next/navigation";
import { display } from "@/lib/fonts";
import { BackIcon, MenuDotsIcon } from "@/components/icons";

export function ScreenHeader({
  title,
  subtitle,
  backHref,
  onMenuClick,
}: {
  title: string;
  subtitle: string;
  backHref?: string;
  onMenuClick?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-garage-700 bg-garage-900 text-zinc-200 transition hover:border-accent hover:text-accent"
        aria-label="Volver"
      >
        <BackIcon className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <h1 className={`${display.className} italic truncate text-2xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          {title}
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">{subtitle}</p>
      </div>

      {onMenuClick ? (
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-garage-700 bg-garage-900 text-zinc-200 transition hover:border-accent hover:text-accent"
          aria-label="Más opciones"
        >
          <MenuDotsIcon className="h-5 w-5" />
        </button>
      ) : (
        <div className="h-10 w-10 shrink-0" />
      )}
    </div>
  );
}
