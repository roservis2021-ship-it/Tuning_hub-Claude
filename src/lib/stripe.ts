import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY no está configurada");
    }
    cached = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return cached;
}
