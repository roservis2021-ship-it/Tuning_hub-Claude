"use client";

import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";

export function VerifyEmailBanner() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);

  if (!user || user.emailVerified) return null;

  async function handleResend() {
    if (!user) return;
    await sendEmailVerification(user).catch(() => {});
    setSent(true);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2.5">
      <span className="text-xs text-yellow-200">Verifica tu email para asegurar tu cuenta.</span>
      <button
        onClick={handleResend}
        disabled={sent}
        className="shrink-0 rounded-md border border-yellow-500/50 px-2.5 py-1 text-[11px] font-semibold text-yellow-200 transition hover:bg-yellow-500/10 disabled:opacity-60"
      >
        {sent ? "Enviado ✓" : "Reenviar"}
      </button>
    </div>
  );
}
