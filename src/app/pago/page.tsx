"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { display } from "@/lib/fonts";
import { ScreenHeader } from "@/components/ScreenHeader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PagoContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId }),
    });
    const data = await res.json();
    if (!res.ok || !data.clientSecret) throw new Error(data.error ?? "No se pudo iniciar el pago");
    return data.clientSecret as string;
  }, [vehicleId]);

  if (!vehicleId) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="text-red-400">Falta el vehículo</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-4 py-6">
      <ScreenHeader title="Pago seguro" subtitle="Tuning Hub Premium" backHref={`/premium?vehicleId=${vehicleId}`} />

      <div className="text-center">
        <p className="text-sm text-zinc-400">Pago único</p>
        <p className={`${display.className} italic text-2xl font-extrabold text-zinc-50`}>8,89€</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-garage-700 bg-white p-1">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>

      <p className="text-center text-[11px] text-zinc-600">
        Pago procesado de forma segura por Stripe. Tras el pago crearás tu cuenta.
      </p>
    </main>
  );
}

export default function PagoPage() {
  return (
    <Suspense>
      <PagoContent />
    </Suspense>
  );
}
