import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json());

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: "Link expirat sau invalid" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: record.email },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
