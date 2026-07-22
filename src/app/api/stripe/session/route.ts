import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Falta session_id" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid = session.payment_status === "paid" || session.status === "complete";
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

    return NextResponse.json({
      paid,
      email: session.customer_details?.email ?? session.customer_email ?? null,
      customerId,
      paymentIntentId,
      vehicleId: session.metadata?.vehicleId ?? null,
    });
  } catch (err) {
    console.error("stripe session: fallo al recuperar la sesión", { sessionId, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo verificar el pago" }, { status: 502 });
  }
}
