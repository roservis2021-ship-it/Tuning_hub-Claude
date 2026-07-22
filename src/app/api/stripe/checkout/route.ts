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
      ui_mode: "embedded_page",
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      payment_intent_data: { metadata: { vehicleId } },
      metadata: { vehicleId },
      return_url: `${origin}/completar-cuenta?session_id={CHECKOUT_SESSION_ID}&vehicleId=${vehicleId}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("stripe checkout: fallo al crear la sesión", { vehicleId, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo iniciar el pago" }, { status: 502 });
  }
}
