import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getStripe, PLANS, type PlanKey } from "@/lib/stripe";
import { prisma } from "@/lib/db";

const schema = z.object({
  plan: z.enum(["pro", "proplus", "business"]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = schema.parse(await req.json());
  const priceId = PLANS[plan as PlanKey].priceId;

  if (!priceId) {
    return NextResponse.json({ error: "Plan indisponibil" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  let customerId = user?.stripeCustomId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomId: customerId },
    });
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${baseUrl}/account?success=1`,
    cancel_url: `${baseUrl}/pricing?canceled=1`,
    metadata: { userId: session.user.id, plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
