import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const product = await stripe.products.create({ name: "Tuning Hub Premium" });

const price = await stripe.prices.create({
  product: product.id,
  currency: "eur",
  unit_amount: 1299,
  recurring: { interval: "month" },
});

console.log("STRIPE_PRICE_ID=" + price.id);
