import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = checkRateLimit(ip, 5, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: "Prea multe cereri. Incearca mai tarziu." }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Autentificare necesara" }, { status: 401 });
  }

  let body: { name?: string; currentPassword?: string; newPassword?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const { name, currentPassword, newPassword } = body;
  const updates: Record<string, string> = {};

  if (name !== undefined) {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return NextResponse.json({ error: "Numele trebuie sa aiba minim 2 caractere" }, { status: 400 });
    }
    updates.name = trimmed;
  }

  if (newPassword !== undefined) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Introdu parola curenta" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Parola noua trebuie sa aiba minim 6 caractere" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.password) {
      return NextResponse.json({ error: "Contul tau nu are parola setata" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Parola curenta este incorecta" }, { status: 400 });
    }
    updates.password = await bcrypt.hash(newPassword, 12);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nimic de actualizat" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: session.user.id }, data: updates });
  return NextResponse.json({ success: true });
}