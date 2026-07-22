import { NextResponse } from "next/server";
import { adminSessionToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = (body as { password?: string } | null)?.password;
  const secret = process.env.ADMIN_DASHBOARD_KEY;

  if (!secret || !password || password !== secret) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const maxAge = 60 * 60 * 24 * 180;
  const res = NextResponse.json({ ok: true });
  res.cookies.set("th_admin", adminSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  // Marca legible por el cliente: este navegador es el del dueño, no contarlo
  // como visita/tráfico real en las analíticas.
  res.cookies.set("th_internal", "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
