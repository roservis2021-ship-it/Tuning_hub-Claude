import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Reuse the same product as the current price
const current = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID);

const price = await stripe.prices.create({
  product: current.product,
  currency: "eur",
  unit_amount: 1199,
  recurring: { interval: "month" },
});

console.log("STRIPE_PRICE_ID=" + price.id);
