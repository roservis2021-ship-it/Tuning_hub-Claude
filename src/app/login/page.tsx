"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { display } from "@/lib/fonts";

function LoginContent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.push("/perfil");
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className={`${display.className} italic text-2xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          Inicia sesión
        </h1>
        <span className="mt-1.5 block h-0.5 w-10 bg-accent" />
        <p className="mt-2 text-sm text-zinc-400">Accede a tu garaje digital.</p>
      </div>

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
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-300">Contraseña</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-2 text-center text-sm text-zinc-500">
        <a href="/recuperar" className="text-accent hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
        <p>
          ¿Aún no eres Premium?{" "}
          <a href="/garaje/nuevo" className="text-accent hover:underline">
            Empieza aquí
          </a>
        </p>
      </div>
    </main>
  );
}

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Email o contraseña incorrectos";
  }
  if (code === "auth/invalid-email") return "Email no válido";
  return err instanceof Error ? err.message : "No se pudo iniciar sesión";
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
