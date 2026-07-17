import { MessageFabIcon, LockIcon } from "@/components/icons";

export function AssistantFab({ vehicleId, isPremium }: { vehicleId: string | null; isPremium: boolean }) {
  const href = isPremium
    ? `/garaje/asistente?vehicleId=${vehicleId}`
    : `/premium${vehicleId ? `?vehicleId=${vehicleId}` : ""}`;

  return (
    <a
      href={href}
      aria-label="Hablar con el Ingeniero"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/50 transition hover:bg-accent/90"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <MessageFabIcon className="h-6 w-6" />
      {!isPremium && (
        <LockIcon className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-garage-950 p-0.5 text-accent" />
      )}
    </a>
  );
}
