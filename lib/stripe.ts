import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    limit: 1,
    priceId: null,
  },
  pro: {
    name: "Pro",
    price: 10,
    limit: 3,
    priceId: process.env.STRIPE_PRICE_PRO ?? "",
  },
  proplus: {
    name: "Pro+",
    price: 15,
    limit: 5,
    priceId: process.env.STRIPE_PRICE_PROPLUS ?? "",
  },
  business: {
    name: "Business",
    price: 30,
    limit: 15,
    priceId: process.env.STRIPE_PRICE_BUSINESS ?? "",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
