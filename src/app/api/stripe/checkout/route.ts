import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { vehicleId } = (body ?? {}) as { vehicleId?: string };

  if (!vehicleId) {
    return NextResponse.json({ error: "Falta el vehículo" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      subscription_data: { metadata: { vehicleId } },
      success_url: `${origin}/completar-cuenta?session_id={CHECKOUT_SESSION_ID}&vehicleId=${vehicleId}`,
      cancel_url: `${origin}/premium?vehicleId=${vehicleId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("stripe checkout: fallo al crear la sesión", { vehicleId, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo iniciar el pago" }, { status: 502 });
  }
}
