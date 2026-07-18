import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { asServerAccount } from "@/lib/firebase-server-auth";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { uid } = (body ?? {}) as { uid?: string };

  if (!uid) {
    return NextResponse.json({ error: "Falta uid" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;

  try {
    await asServerAccount();
    const userSnap = await getDoc(doc(db, "users", uid));
    const stripeCustomerId = userSnap.exists() ? (userSnap.data().stripeCustomerId as string | undefined) : undefined;

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "No se encontró la suscripción de este usuario" }, { status: 404 });
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/garaje/plan`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("stripe portal: fallo al crear la sesión", { uid, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo abrir la gestión de suscripción" }, { status: 502 });
  }
}
