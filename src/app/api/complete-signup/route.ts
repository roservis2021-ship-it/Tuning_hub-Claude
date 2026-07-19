import { NextResponse } from "next/server";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { asServerAccount } from "@/lib/firebase-server-auth";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { uid, sessionId, name, keepVehicle, vehicleId } = (body ?? {}) as {
    uid?: string;
    sessionId?: string;
    name?: string;
    keepVehicle?: boolean;
    vehicleId?: string;
  };

  if (!uid || !sessionId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid" || session.status === "complete";

    if (!paid) {
      return NextResponse.json({ error: "El pago no está confirmado" }, { status: 402 });
    }

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    const sessionVehicleId = session.metadata?.vehicleId ?? vehicleId ?? null;

    await asServerAccount();

    // Anti-reuso: una sesión de pago solo puede activar una cuenta.
    const usedRef = doc(db, "usedSessions", sessionId);
    const used = await getDoc(usedRef);
    if (used.exists()) {
      return NextResponse.json({ error: "Este pago ya se usó para activar una cuenta" }, { status: 409 });
    }

    const linkedVehicleId = keepVehicle ? sessionVehicleId : null;

    await updateDoc(doc(db, "users", uid), {
      premium: true,
      premiumVehicleId: linkedVehicleId,
      ...(name ? { name } : {}),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    });

    if (linkedVehicleId) {
      await updateDoc(doc(db, "vehicles", linkedVehicleId), { userId: uid }).catch(() => {});
    }

    await setDoc(usedRef, { uid, createdAt: serverTimestamp() });

    // Estampar el uid en la suscripción para identificar al usuario en cancelaciones.
    if (subscriptionId) {
      await stripe.subscriptions.update(subscriptionId, { metadata: { uid, vehicleId: linkedVehicleId ?? "" } }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("complete-signup: fallo", { uid, sessionId, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo activar el Premium" }, { status: 502 });
  }
}
