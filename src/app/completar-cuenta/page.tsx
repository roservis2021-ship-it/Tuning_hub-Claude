"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/lib/firebase-client";
import { display } from "@/lib/fonts";

type SessionInfo = { paid: boolean; email: string | null; vehicleId: string | null };

function CompletarContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const vehicleId = searchParams.get("vehicleId");

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [vehicleLabel, setVehicleLabel] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [keepVehicle, setKeepVehicle] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Falta la referencia del pago");
      setLoading(false);
      return;
    }
    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data: SessionInfo & { error?: string }) => {
        if (data.error || !data.paid) {
          setError("No hemos podido confirmar tu pago. Si crees que es un error, contacta con soporte.");
        } else {
          setSession(data);
        }
      })
      .catch(() => setError("No se pudo verificar el pago"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    const vid = vehicleId || session?.vehicleId;
    if (!vid) return;
    getDoc(doc(db, "vehicles", vid))
      .then((snap) => {
        if (snap.exists()) {
          const v = snap.data();
          setVehicleLabel(`${v.brand} ${v.model}`);
        }
      })
      .catch(() => {});
  }, [vehicleId, session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!session?.email) {
      setError("No hay email asociado al pago");
      return;
    }

    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), session.email, password);
      await sendEmailVerification(cred.user).catch(() => {});
      await setDoc(doc(db, "users", cred.user.uid), {
        email: session.email,
        name: name.trim(),
        premium: false,
        createdAt: serverTimestamp(),
      });

      const res = await fetch("/api/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: cred.user.uid,
          sessionId,
          name: name.trim(),
          keepVehicle,
          vehicleId: vehicleId || session.vehicleId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo activar el Premium");

      // Navegación completa para reinicializar el estado de auth con premium ya activo.
      const vid = vehicleId || session.vehicleId;
      if (keepVehicle && vid) {
        window.location.href = `/garaje/plan?vehicleId=${vid}`;
      } else {
        window.location.href = "/garaje/nuevo";
      }
    } catch (err) {
      setError(mapError(err));
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="text-zinc-400">Confirmando tu pago…</p>
      </main>
    );
  }

  if (error && !session) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="max-w-xs text-sm text-zinc-300">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-16">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Pago confirmado ✓</span>
        <h1 className={`${display.className} italic mt-2 text-3xl font-extrabold uppercase tracking-tight text-zinc-50`}>
          Crea tu cuenta
        </h1>
        <span className="mt-1.5 block h-0.5 w-10 bg-accent" />
        <p className="mt-2 text-sm text-zinc-400">Ya eres Premium. Solo falta configurar tu acceso.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-300">Tu nombre</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-300">Email</span>
          <input className="input opacity-70" value={session?.email ?? ""} readOnly />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-300">Crea una contraseña</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-300">¿Con qué coche empiezas?</span>
          <button
            type="button"
            onClick={() => setKeepVehicle(true)}
            className={`rounded-md border px-4 py-3 text-left text-sm transition ${
              keepVehicle ? "border-accent bg-accent/10 text-zinc-100" : "border-garage-700 bg-garage-900 text-zinc-400"
            }`}
          >
            <span className="font-semibold">Continuar con {vehicleLabel ?? "el coche buscado"}</span>
          </button>
          <button
            type="button"
            onClick={() => setKeepVehicle(false)}
            className={`rounded-md border px-4 py-3 text-left text-sm transition ${
              !keepVehicle ? "border-accent bg-accent/10 text-zinc-100" : "border-garage-700 bg-garage-900 text-zinc-400"
            }`}
          >
            <span className="font-semibold">Buscar otro coche</span>
            <span className="mt-0.5 block text-xs text-zinc-500">Tu cuenta gestiona un único vehículo.</span>
          </button>
        </div>

        {error && <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? "Activando…" : "Entrar a mi garaje"}
        </button>
      </form>
    </main>
  );
}

function mapError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === "auth/email-already-in-use") return "Ese email ya tiene una cuenta. Inicia sesión y se vinculará tu Premium.";
  if (code === "auth/weak-password") return "Contraseña demasiado débil";
  return err instanceof Error ? err.message : "No se pudo crear la cuenta";
}

export default function CompletarCuentaPage() {
  return (
    <Suspense>
      <CompletarContent />
    </Suspense>
  );
}
