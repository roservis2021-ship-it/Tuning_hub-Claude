import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("th_admin", "", { path: "/", maxAge: 0 });
  res.cookies.set("th_internal", "", { path: "/", maxAge: 0 });
  return res;
}
