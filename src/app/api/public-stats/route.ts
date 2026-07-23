import { NextResponse } from "next/server";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

export async function GET() {
  try {
    const snap = await getCountFromServer(collection(db, "vehicles"));
    return NextResponse.json({ totalVehicles: snap.data().count });
  } catch (err) {
    console.error("public-stats: fallo", err instanceof Error ? err.message : err);
    return NextResponse.json({ totalVehicles: null }, { status: 502 });
  }
}
