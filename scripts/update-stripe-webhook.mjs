import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const NEW_URL = process.env.WEBHOOK_URL || "https://tuning-hub-claude.vercel.app/api/stripe/webhook";

const { data: endpoints } = await stripe.webhookEndpoints.list({ limit: 100 });

const target = endpoints.find((e) => e.url.includes("/api/stripe/webhook"));

if (!target) {
  console.log("No se encontró ningún webhook /api/stripe/webhook existente.");
  process.exit(1);
}

const updated = await stripe.webhookEndpoints.update(target.id, { url: NEW_URL });

console.log("Webhook actualizado:");
console.log("  id:  " + updated.id);
console.log("  url: " + updated.url);
