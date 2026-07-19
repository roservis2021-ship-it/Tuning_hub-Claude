import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { asServerAccount } from "@/lib/firebase-server-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { uid, vehicleId } = (body ?? {}) as { uid?: string; vehicleId?: string };

  if (!uid || !vehicleId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  try {
    await asServerAccount();
    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists() || !userSnap.data().premium) {
      return NextResponse.json({ error: "La cuenta no es Premium" }, { status: 403 });
    }
    if (userSnap.data().premiumVehicleId) {
      return NextResponse.json({ error: "Esta cuenta ya tiene un vehículo Premium" }, { status: 409 });
    }

    await updateDoc(doc(db, "users", uid), { premiumVehicleId: vehicleId });
    await updateDoc(doc(db, "vehicles", vehicleId), { userId: uid }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("claim-vehicle: fallo", { uid, vehicleId, message: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "No se pudo vincular el vehículo" }, { status: 502 });
  }
}
