import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { estimatePrice } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rateLimit";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = checkRateLimit(ip, 10, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: "Prea multe cereri. Incearca din nou mai tarziu." }, { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Autentificare necesara" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true, role: true } });
  const plan = user?.plan ?? "free";
  if (plan === "free" && user?.role !== "admin") {
    return NextResponse.json({ error: "Necesita plan Pro sau superior", code: "PLAN_REQUIRED" }, { status: 403 });
  }

  let body: { description?: string; language?: string; productType?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Date invalide" }, { status: 400 }); }

  const { description = "", language = "ro", productType } = body;
  if (!description || description.trim().length < 5) {
    return NextResponse.json({ error: "Descrierea trebuie sa aiba cel putin 5 caractere" }, { status: 400 });
  }

  try {
    const result = await estimatePrice(description.trim(), language as "ro" | "en", productType as "original" | "replica" | undefined);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Eroare AI. Incearca din nou." }, { status: 500 });
  }
}