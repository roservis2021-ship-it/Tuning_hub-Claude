import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { asServerAccount } from "@/lib/firebase-server-auth";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { uid, email, vehicleId } = (body ?? {}) as { uid?: string; email?: string; vehicleId?: string };

  if (!uid || !vehicleId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;

  try {
    await asServerAccount();
    const userSnap = await getDoc(doc(db, "users", uid));
    const existingPremiumVehicleId = userSnap.exists() ? (userSnap.data().premiumVehicleId as string | undefined) : undefined;

    if (existingPremiumVehicleId && existingPremiumVehicleId !== vehicleId) {
      return NextResponse.json({ error: "Tu cuenta Premium ya está vinculada a otro vehículo" }, { status: 409 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      client_reference_id: uid,
      customer_email: email,
      subscription_data: { metadata: { uid, vehicleId } },
      success_url: `${origin}/garaje/plan?vehicleId=${vehicleId}&checkout=success`,
      cancel_url: `${origin}/premium?vehicleId=${vehicleId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("stripe checkout: fallo al crear la sesión", { uid, vehicleId, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo iniciar el pago" }, { status: 502 });
  }
}
