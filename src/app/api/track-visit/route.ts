import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const path = (body as { path?: string } | null)?.path;

  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "Falta path" }, { status: 400 });
  }

  const country = req.headers.get("x-vercel-ip-country");
  const region = req.headers.get("x-vercel-ip-country-region");
  const cityHeader = req.headers.get("x-vercel-ip-city");
  const city = cityHeader ? decodeURIComponent(cityHeader) : null;

  try {
    await addDoc(collection(db, "pageViews"), {
      path: path.slice(0, 200),
      country: country || null,
      region: region || null,
      city: city || null,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("track-visit: fallo al guardar", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "No se pudo registrar" }, { status: 502 });
  }
}
