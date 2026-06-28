import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkExistingListing } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rateLimit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rateCheck = checkRateLimit(ip, 10, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Prea multe cereri. Incearca din nou mai tarziu." }, { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Autentificare necesara" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true, role: true } });
    const plan = user?.plan ?? "free";
    if (plan === "free" && user?.role !== "admin") {
      return NextResponse.json({ error: "Necesita plan Pro sau superior", code: "PLAN_REQUIRED" }, { status: 403 });
    }

    let body: { title?: string; description?: string; platform?: string; language?: string };
    try { body = await req.json(); } catch { return NextResponse.json({ error: "Date invalide" }, { status: 400 }); }

    const { title = "", description = "", platform = "both", language = "ro" } = body;
    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Titlul trebuie sa aiba cel putin 3 caractere" }, { status: 400 });
    }
    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: "Descrierea trebuie sa aiba cel putin 10 caractere" }, { status: 400 });
    }

    const result = await checkExistingListing(title.trim(), description.trim(), platform, language as "ro" | "en");
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Eroare AI. Incearca din nou." }, { status: 500 });
  }
}