import { NextResponse } from "next/server";
import { collection, deleteDoc, getCountFromServer, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { asServerAccount } from "@/lib/firebase-server-auth";
import { getStripe } from "@/lib/stripe";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await asServerAccount();

    const now = Date.now();
    const sevenDaysAgo = Timestamp.fromMillis(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = Timestamp.fromMillis(now - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = Timestamp.fromMillis(now - 14 * 24 * 60 * 60 * 1000);

    const usersCol = collection(db, "users");
    const vehiclesCol = collection(db, "vehicles");

    const [
      totalUsersSnap,
      premiumUsersSnap,
      newUsers7dSnap,
      newUsers30dSnap,
      totalVehiclesSnap,
      recentUsersSnap,
      last14dUsersSnap,
    ] = await Promise.all([
      getCountFromServer(usersCol),
      getCountFromServer(query(usersCol, where("premium", "==", true))),
      getCountFromServer(query(usersCol, where("createdAt", ">=", sevenDaysAgo))),
      getCountFromServer(query(usersCol, where("createdAt", ">=", thirtyDaysAgo))),
      getCountFromServer(vehiclesCol),
      getDocs(query(usersCol, orderBy("createdAt", "desc"), limit(10))),
      getDocs(query(usersCol, where("createdAt", ">=", fourteenDaysAgo), orderBy("createdAt", "asc"))),
    ]);

    const dayBuckets = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      dayBuckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const d of last14dUsersSnap.docs) {
      const createdAt = (d.data() as { createdAt?: Timestamp }).createdAt;
      if (!createdAt) continue;
      const key = createdAt.toDate().toISOString().slice(0, 10);
      if (dayBuckets.has(key)) dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
    }
    const signupsByDay = Array.from(dayBuckets.entries()).map(([date, count]) => ({ date, count }));

    let onlineNow = 0;
    try {
      const onlineSince = Timestamp.fromMillis(now - 45_000);
      const staleSince = Timestamp.fromMillis(now - 60 * 60 * 1000);
      const presenceCol = collection(db, "presence");
      const [onlineNowSnap, stalePresenceSnap] = await Promise.all([
        getCountFromServer(query(presenceCol, where("lastSeen", ">=", onlineSince))),
        getDocs(query(presenceCol, where("lastSeen", "<", staleSince), limit(200))),
      ]);
      onlineNow = onlineNowSnap.data().count;
      await Promise.all(stalePresenceSnap.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
    } catch (err) {
      console.error("admin/stats: fallo al leer presencia", err instanceof Error ? err.message : err);
    }

    const dayKeys: string[] = [];
    for (let i = 13; i >= 0; i--) {
      dayKeys.push(new Date(now - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    }

    let uniqueVisitorsByDay = dayKeys.map((date) => ({ date, count: 0 }));
    try {
      const dailyVisitsCol = collection(db, "dailyVisits");
      const counts = await Promise.all(
        dayKeys.map((date) => getCountFromServer(query(dailyVisitsCol, where("date", "==", date))))
      );
      uniqueVisitorsByDay = dayKeys.map((date, i) => ({ date, count: counts[i].data().count }));

      const oldestKept = Timestamp.fromMillis(now - 35 * 24 * 60 * 60 * 1000);
      const staleVisits = await getDocs(query(dailyVisitsCol, where("lastSeen", "<", oldestKept), limit(200)));
      await Promise.all(staleVisits.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
    } catch (err) {
      console.error("admin/stats: fallo al leer visitantes únicos", err instanceof Error ? err.message : err);
    }

    let topScreens: { path: string; count: number }[] = [];
    let topLocations: { label: string; count: number }[] = [];
    let hourlyVisits: { hour: string; count: number }[] = [];
    try {
      const pageViewsCol = collection(db, "pageViews");
      const pageViewsSnap = await getDocs(
        query(pageViewsCol, where("createdAt", ">=", sevenDaysAgo), orderBy("createdAt", "desc"), limit(1500))
      );

      const screenCounts = new Map<string, number>();
      const locationCounts = new Map<string, number>();
      const hourBuckets = new Map<string, number>();
      const oneDayAgoMillis = now - 24 * 60 * 60 * 1000;
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now - i * 60 * 60 * 1000);
        hourBuckets.set(`${String(d.getHours()).padStart(2, "0")}:00`, 0);
      }

      for (const d of pageViewsSnap.docs) {
        const data = d.data() as { path?: string; country?: string | null; city?: string | null; createdAt?: Timestamp };
        if (data.path) screenCounts.set(data.path, (screenCounts.get(data.path) ?? 0) + 1);

        const locationLabel = data.city && data.country ? `${data.city}, ${data.country}` : data.country || null;
        if (locationLabel) locationCounts.set(locationLabel, (locationCounts.get(locationLabel) ?? 0) + 1);

        const createdAtMs = data.createdAt?.toMillis?.();
        if (createdAtMs && createdAtMs >= oneDayAgoMillis) {
          const key = `${String(new Date(createdAtMs).getHours()).padStart(2, "0")}:00`;
          if (hourBuckets.has(key)) hourBuckets.set(key, (hourBuckets.get(key) ?? 0) + 1);
        }
      }

      topScreens = Array.from(screenCounts.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      topLocations = Array.from(locationCounts.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      hourlyVisits = Array.from(hourBuckets.entries()).map(([hour, count]) => ({ hour, count }));

      const oldestKeptPageViews = Timestamp.fromMillis(now - 30 * 24 * 60 * 60 * 1000);
      const stalePageViews = await getDocs(
        query(pageViewsCol, where("createdAt", "<", oldestKeptPageViews), limit(200))
      );
      await Promise.all(stalePageViews.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
    } catch (err) {
      console.error("admin/stats: fallo al leer páginas vistas", err instanceof Error ? err.message : err);
    }

    let topSearchedCars: { label: string; count: number }[] = [];
    try {
      const vehiclesSnap = await getDocs(query(vehiclesCol, orderBy("createdAt", "desc"), limit(2000)));
      const carCounts = new Map<string, number>();
      for (const d of vehiclesSnap.docs) {
        const v = d.data() as { brand?: string; model?: string };
        if (!v.brand || !v.model) continue;
        const key = `${v.brand} ${v.model}`;
        carCounts.set(key, (carCounts.get(key) ?? 0) + 1);
      }
      topSearchedCars = Array.from(carCounts.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
    } catch (err) {
      console.error("admin/stats: fallo al leer coches más buscados", err instanceof Error ? err.message : err);
    }

    const recentUsers = recentUsersSnap.docs.map((d) => {
      const u = d.data() as { email?: string; name?: string; premium?: boolean; createdAt?: Timestamp };
      return {
        email: u.email ?? null,
        name: u.name ?? null,
        premium: !!u.premium,
        createdAt: u.createdAt?.toDate?.().toISOString() ?? null,
      };
    });

    let activeSubscriptions = 0;
    let cancelingSubscriptions = 0;
    let mrrCents = 0;
    try {
      const stripe = getStripe();
      for await (const sub of stripe.subscriptions.list({ status: "active", limit: 100 })) {
        activeSubscriptions++;
        if (sub.cancel_at_period_end) cancelingSubscriptions++;
        for (const item of sub.items.data) {
          if (item.price.unit_amount) mrrCents += item.price.unit_amount * (item.quantity ?? 1);
        }
      }
    } catch (err) {
      console.error("admin/stats: fallo al leer Stripe", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({
      onlineNow,
      totalUsers: totalUsersSnap.data().count,
      premiumUsers: premiumUsersSnap.data().count,
      newUsers7d: newUsers7dSnap.data().count,
      newUsers30d: newUsers30dSnap.data().count,
      totalVehicles: totalVehiclesSnap.data().count,
      activeSubscriptions,
      cancelingSubscriptions,
      mrrEur: mrrCents / 100,
      recentUsers,
      signupsByDay,
      uniqueVisitorsByDay,
      topScreens,
      topLocations,
      hourlyVisits,
      topSearchedCars,
    });
  } catch (err) {
    console.error("admin/stats: fallo", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "No se pudieron cargar las métricas" }, { status: 502 });
  }
}
