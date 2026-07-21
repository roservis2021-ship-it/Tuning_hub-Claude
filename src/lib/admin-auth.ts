import { createHash } from "crypto";

export function adminSessionToken(secret: string): string {
  return createHash("sha256").update(`${secret}:th-admin-session`).digest("hex");
}

export function isAdminRequest(req: Request): boolean {
  const secret = process.env.ADMIN_DASHBOARD_KEY;
  if (!secret) return false;
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)th_admin=([^;]+)/);
  if (!match) return false;
  return match[1] === adminSessionToken(secret);
}
