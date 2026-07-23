"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/lib/firebase-client";
import { display } from "@/lib/fonts";
import { PasswordInput } from "@/components/PasswordInput";

function RegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const intent = searchParams.get("intent");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);

      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        premium: false,
        createdAt: serverTimestamp(),
      });

      if (vehicleId) {
        await updateDoc(doc(db, "vehicles", vehicleId), { userId: cred.user.uid }).catch(() => {});
      }

      if (intent === "premium" && vehicleId) {
        router.push(`/premium?vehicleId=${vehicleId}`);
      } else {
        router.push(vehicleId ? `/garaje/plan?vehicleId=${vehicleId}` : "/");
      }
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
          Crea tu cuenta
        </h1>
        <span className="mt-1.5 block h-0.5 w-10 bg-accent" />
        <p className="mt-2 text-sm text-zinc-400">
          {intent === "premium" ? "Un último paso para activar Premium." : "Guarda tu garaje y accede desde cualquier sitio."}
        </p>
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
          <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-300">Repite la contraseña</span>
          <PasswordInput value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" required />
        </label>

        {error && <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        ¿Ya tienes cuenta?{" "}
        <a
          href={`/login${vehicleId ? `?vehicleId=${vehicleId}` : ""}${intent ? `${vehicleId ? "&" : "?"}intent=${intent}` : ""}`}
          className="text-accent hover:underline"
        >
          Inicia sesión
        </a>
      </p>
    </main>
  );
}

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "auth/email-already-in-use") return "Ese email ya tiene una cuenta. Inicia sesión.";
  if (code === "auth/invalid-email") return "Email no válido";
  if (code === "auth/weak-password") return "Contraseña demasiado débil";
  return err instanceof Error ? err.message : "No se pudo crear la cuenta";
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroContent />
    </Suspense>
  );
}
