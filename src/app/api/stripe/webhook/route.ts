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
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      const subscription = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;
      const vehicleId = subscription?.metadata?.vehicleId;

      if (uid && vehicleId) {
        await asServerAccount();
        await updateDoc(doc(db, "users", uid), {
          premium: true,
          premiumVehicleId: vehicleId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: subscriptionId ?? null,
        });
        await updateDoc(doc(db, "vehicles", vehicleId), { userId: uid });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const uid = subscription.metadata?.uid;

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
