import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const APP_URL = process.env.APP_URL || "https://tuning-hub-claude.onrender.com";

const product = await stripe.products.create({ name: "Tuning Hub Premium" });

const price = await stripe.prices.create({
  product: product.id,
  currency: "eur",
  unit_amount: 1299,
  recurring: { interval: "month" },
});

const webhook = await stripe.webhookEndpoints.create({
  url: `${APP_URL}/api/stripe/webhook`,
  enabled_events: ["checkout.session.completed", "customer.subscription.deleted"],
});

console.log("STRIPE_PRICE_ID=" + price.id);
console.log("STRIPE_WEBHOOK_SECRET=" + webhook.secret);
