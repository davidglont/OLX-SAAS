import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  plan: z.enum(["free", "pro", "proplus", "business"]).optional(),
  role: z.enum(["user", "admin"]).optional(),
  usageLimit: z.number().int().min(-1).nullable().optional(),
  newPassword: z.string().min(4).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let body;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const passwordHash = body.newPassword ? await bcrypt.hash(body.newPassword, 12) : undefined;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.plan !== undefined && { plan: body.plan }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit }),
      ...(passwordHash && { password: passwordHash }),
    },
    select: { id: true, plan: true, role: true, usageLimit: true },
  });

  return NextResponse.json(updated);
}