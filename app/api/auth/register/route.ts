import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email deja înregistrat" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
