"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalUsers: number;
  premiumUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  totalVehicles: number;
  activeSubscriptions: number;
  cancelingSubscriptions: number;
  mrrEur: number;
  recentUsers: { email: string | null; name: string | null; premium: boolean; createdAt: string | null }[];
};

export function PanelClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }
      if (!res.ok) {
        setError("No se pudieron cargar las métricas");
        return;
      }
      setStats(await res.json());
      setNeedsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Contraseña incorrecta");
      return;
    }
    setPassword("");
    loadStats();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStats(null);
    setNeedsAuth(true);
  }

  if (loading) {
    return <main className="flex min-h-dvh items-center justify-center bg-garage-950 text-sm text-zinc-500">Cargando…</main>;
  }

  if (needsAuth) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-garage-950 px-6">
        <form
          onSubmit={handleLogin}
          className="flex w-full max-w-xs flex-col gap-3 rounded-xl border border-garage-700 bg-garage-900/60 p-6"
        >
          <p className="text-sm font-semibold text-zinc-300">Acceso restringido</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="input"
            autoFocus
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">
            Entrar
          </button>
        </form>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-garage-950 text-sm text-red-400">
        {error ?? "Error"}
      </main>
    );
  }

  const conversion = stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : "0.0";

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-6 py-10 text-zinc-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel interno — Tuning Hub</h1>
        <button onClick={handleLogout} className="text-xs text-zinc-500 hover:text-zinc-300">
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="Usuarios totales" value={stats.totalUsers} />
        <Metric label="Premium activos" value={stats.premiumUsers} />
        <Metric label="Conversión" value={`${conversion}%`} />
        <Metric label="Nuevos (7 días)" value={stats.newUsers7d} />
        <Metric label="Nuevos (30 días)" value={stats.newUsers30d} />
        <Metric label="Vehículos" value={stats.totalVehicles} />
        <Metric label="Suscripciones activas" value={stats.activeSubscriptions} />
        <Metric label="Cancelando" value={stats.cancelingSubscriptions} />
        <Metric label="MRR" value={`${stats.mrrEur.toFixed(2)} €`} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">Últimos registros</h2>
        <div className="flex flex-col gap-2">
          {stats.recentUsers.length === 0 && <p className="text-sm text-zinc-500">Todavía no hay usuarios.</p>}
          {stats.recentUsers.map((u, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border border-garage-700 bg-garage-900/40 px-3 py-2 text-sm"
            >
              <span>{u.name ?? u.email ?? "—"}</span>
              <span className={u.premium ? "text-emerald-400" : "text-zinc-500"}>{u.premium ? "Premium" : "Free"}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-garage-700 bg-garage-900/40 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
