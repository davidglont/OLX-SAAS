import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

const PLAN_BY_PRICE: Record<string, string> = {
  [process.env.STRIPE_PRICE_PRO ?? ""]: "pro",
  [process.env.STRIPE_PRICE_PROPLUS ?? ""]: "proplus",
  [process.env.STRIPE_PRICE_BUSINESS ?? ""]: "business",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          stripeSubId: session.subscription as string,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.user.updateMany({
      where: { stripeSubId: subscription.id },
      data: { plan: "free", stripeSubId: null },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = PLAN_BY_PRICE[priceId] ?? "free";
    await prisma.user.updateMany({
      where: { stripeSubId: subscription.id },
      data: { plan },
    });
  }

  return NextResponse.json({ received: true });
}
