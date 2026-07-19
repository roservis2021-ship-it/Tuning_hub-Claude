"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { display } from "@/lib/fonts";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-email") setError("Email no válido");
      else setError("No se pudo enviar el correo. Revisa el email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className={`${display.className} italic text-2xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          Recuperar contraseña
        </h1>
        <span className="mt-1.5 block h-0.5 w-10 bg-accent" />
        <p className="mt-2 text-sm text-zinc-400">Te enviaremos un enlace para restablecerla.</p>
      </div>

      {sent ? (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña. Revisa también spam.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-300">Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          {error && <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
          >
            {submitting ? "Enviando…" : "Enviar enlace"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-zinc-500">
        <a href="/login" className="text-accent hover:underline">
          Volver a iniciar sesión
        </a>
      </p>
    </main>
  );
}
