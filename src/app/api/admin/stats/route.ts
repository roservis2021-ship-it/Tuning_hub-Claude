import { NextResponse } from "next/server";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore";
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

    const usersCol = collection(db, "users");
    const vehiclesCol = collection(db, "vehicles");

    const [totalUsersSnap, premiumUsersSnap, newUsers7dSnap, newUsers30dSnap, totalVehiclesSnap, recentUsersSnap] =
      await Promise.all([
        getCountFromServer(usersCol),
        getCountFromServer(query(usersCol, where("premium", "==", true))),
        getCountFromServer(query(usersCol, where("createdAt", ">=", sevenDaysAgo))),
        getCountFromServer(query(usersCol, where("createdAt", ">=", thirtyDaysAgo))),
        getCountFromServer(vehiclesCol),
        getDocs(query(usersCol, orderBy("createdAt", "desc"), limit(10))),
      ]);

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
      totalUsers: totalUsersSnap.data().count,
      premiumUsers: premiumUsersSnap.data().count,
      newUsers7d: newUsers7dSnap.data().count,
      newUsers30d: newUsers30dSnap.data().count,
      totalVehicles: totalVehiclesSnap.data().count,
      activeSubscriptions,
      cancelingSubscriptions,
      mrrEur: mrrCents / 100,
      recentUsers,
    });
  } catch (err) {
    console.error("admin/stats: fallo", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "No se pudieron cargar las métricas" }, { status: 502 });
  }
}
