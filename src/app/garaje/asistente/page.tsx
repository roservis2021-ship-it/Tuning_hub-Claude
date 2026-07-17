"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, getDoc, getDocs, addDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { AppNav } from "@/components/AppNav";
import { PremiumGate } from "@/components/PremiumGate";
import { ScreenHeader } from "@/components/ScreenHeader";

type Vehicle = { brand: string; model: string };

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function AsistenteContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vehicleId) {
      setLoading(false);
      return;
    }
    Promise.all([
      getDoc(doc(db, "vehicles", vehicleId)),
      getDocs(query(collection(db, "vehicles", vehicleId, "assistantMessages"), orderBy("createdAt", "asc"))),
    ])
      .then(([vehicleSnap, msgsSnap]) => {
        if (vehicleSnap.exists()) setVehicle(vehicleSnap.data() as Vehicle);
        setMessages(msgsSnap.docs.map((d) => ({ role: d.data().role, content: d.data().content })));
      })
      .finally(() => setLoading(false));
  }, [vehicleId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !vehicleId || sending) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError(null);

    addDoc(collection(db, "vehicles", vehicleId, "assistantMessages"), { ...userMessage, createdAt: serverTimestamp() }).catch(() => {});

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        throw new Error("El ingeniero no pudo responder");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      }

      addDoc(collection(db, "vehicles", vehicleId, "assistantMessages"), {
        role: "assistant",
        content: assistantText,
        createdAt: serverTimestamp(),
      }).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-zinc-400">Cargando...</p>
      </main>
    );
  }

  return (
    <PremiumGate vehicleId={vehicleId} feature="Ingeniero">
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 px-4 py-6 pb-24">
      <ScreenHeader
        title={vehicle ? `${vehicle.brand} ${vehicle.model}` : "Ingeniero"}
        subtitle="Hablar con tu ingeniero"
        backHref={`/garaje/plan?vehicleId=${vehicleId}`}
      />

      <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-garage-700 bg-garage-900/40 p-4">
        {messages.length === 0 && (
          <p className="rounded-md border border-garage-700 bg-garage-950/40 px-4 py-3 text-sm text-zinc-500">
            Puedo responder sobre las modificaciones de tu coche, su mantenimiento, diagnósticos previos o dudas generales de tuning.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
              m.role === "user" ? "self-end bg-accent text-white" : "self-start border border-garage-700 bg-garage-900 text-zinc-100"
            }`}
          >
            {m.content || (sending && i === messages.length - 1 ? "…" : "")}
          </div>
        ))}
        {error && <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{error}</p>}
      </div>

      <form onSubmit={handleSend} className="mt-2 flex gap-2">
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-md bg-accent px-5 py-2 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </main>
    <AppNav vehicleId={vehicleId} isPremium={true} />
    </PremiumGate>
  );
}

export default function AsistentePage() {
  return (
    <Suspense>
      <AsistenteContent />
    </Suspense>
  );
}
