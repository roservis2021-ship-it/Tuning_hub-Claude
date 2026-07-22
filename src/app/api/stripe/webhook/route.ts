import Stripe from "stripe";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { asServerAccount } from "@/lib/firebase-server-auth";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("stripe webhook: firma inválida", { message: err instanceof Error ? err.message : String(err) });
    return new Response("Firma inválida", { status: 400 });
  }

  try {
    // La activación del Premium la realiza /api/complete-signup tras crear la
    // cuenta. Aquí solo desactivamos si el pago único se reembolsa.
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      const uid = paymentIntentId ? (await stripe.paymentIntents.retrieve(paymentIntentId)).metadata?.uid : undefined;

      if (uid) {
        await asServerAccount();
        await updateDoc(doc(db, "users", uid), { premium: false });
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("stripe webhook: fallo procesando evento", {
      type: event.type,
      message: err instanceof Error ? err.message : String(err),
    });
    return new Response("Error interno", { status: 500 });
  }
}
