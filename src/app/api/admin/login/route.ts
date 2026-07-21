import { NextResponse } from "next/server";
import { adminSessionToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = (body as { password?: string } | null)?.password;
  const secret = process.env.ADMIN_DASHBOARD_KEY;

  if (!secret || !password || password !== secret) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("th_admin", adminSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
