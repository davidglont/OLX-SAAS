import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token lipsă" }, { status: 400 });
  }

  const vt = await prisma.verificationToken.findFirst({ where: { token } });
  if (!vt) {
    return NextResponse.json({ error: "Token invalid" }, { status: 400 });
  }
  if (vt.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { token } });
    return NextResponse.json({ error: "Token expirat" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: vt.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.deleteMany({ where: { token } });

  return NextResponse.json({ success: true });
}
