import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const saveSchema = z.object({
  platform: z.enum(["olx", "vinted", "both"]),
  inputDesc: z.string().max(500).optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  tags: z.string(),
  photoCount: z.number().int().min(1).max(10),
  photoScores: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = saveSchema.parse(await req.json());
    const listing = await prisma.listing.create({
      data: { ...body, userId: session.user.id },
    });
    return NextResponse.json(listing, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Eroare la salvare" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(listings);
}
