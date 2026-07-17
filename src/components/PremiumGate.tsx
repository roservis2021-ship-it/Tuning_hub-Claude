"use client";

import { useAuth } from "@/lib/auth-context";

export function PremiumGate({
  vehicleId,
  feature,
  children,
}: {
  vehicleId: string | null;
  feature: string;
  children: React.ReactNode;
}) {
  const { userDoc, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-zinc-400">Cargando...</p>
      </main>
    );
  }

  const linkedToThisVehicle = !!userDoc?.premium && userDoc.premiumVehicleId === vehicleId;
  const linkedToOtherVehicle = !!userDoc?.premium && !!userDoc.premiumVehicleId && userDoc.premiumVehicleId !== vehicleId;

  if (!linkedToThisVehicle) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-3xl">🔒</span>
        <h1 className="text-xl font-bold text-zinc-100">{feature} es Premium</h1>
        <p className="max-w-xs text-sm text-zinc-400">
          {linkedToOtherVehicle
            ? "Tu cuenta Premium ya está vinculada a otro vehículo. Cada cuenta gestiona un único coche."
            : "Activa Premium para desbloquear esta función y el resto del garaje digital."}
        </p>
        <a
          href={
            linkedToOtherVehicle
              ? `/garaje/plan?vehicleId=${userDoc!.premiumVehicleId}`
              : `/premium${vehicleId ? `?vehicleId=${vehicleId}` : ""}`
          }
          className="rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90"
        >
          {linkedToOtherVehicle ? "Ir a tu vehículo Premium" : "Mejorar a Premium"}
        </a>
      </main>
    );
  }

  return <>{children}</>;
}
