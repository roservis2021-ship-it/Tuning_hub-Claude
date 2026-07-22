import Image from "next/image";

export function HeroBanner({ label }: { label: string }) {
  return (
    <div className="relative isolate h-40 overflow-hidden rounded-xl border border-garage-700 bg-garage-900 sm:h-48">
      <Image
        src="/vehicle-hero-generic.png"
        alt=""
        fill
        priority
        sizes="(max-width: 640px) 100vw, 640px"
        className="object-cover"
        style={{ objectPosition: "center 42%" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-garage-950/70 via-transparent to-transparent" />
      <p className="absolute bottom-2 right-3 rounded bg-garage-950/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
        {label}
      </p>
    </div>
  );
}
