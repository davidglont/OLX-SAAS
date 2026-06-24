import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { analyzeListingImages } from "@/lib/ai";
import { checkAndIncrementUsage } from "@/lib/usage";
import { checkRateLimit } from "@/lib/rateLimit";
import { prisma } from "@/lib/db";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

const bodySchema = z.object({
  images: z
    .array(
      z.object({
        data: z.string().min(1),
        mediaType: z.string(),
      })
    )
    .min(1)
    .max(MAX_FILES),
  description: z.string().max(500).optional().default(""),
  platform: z.enum(["olx", "vinted", "both"]),
  language: z.enum(["ro", "en"]).default("ro"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = checkRateLimit(ip, 10, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Prea multe cereri. Încearcă din nou mai târziu." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfter) },
      }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 });
  }

  let body;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  for (const img of body.images) {
    if (!ALLOWED_MIME_TYPES.includes(img.mediaType)) {
      return NextResponse.json(
        { error: "Tip de fișier neacceptat. Folosește JPEG, PNG sau WebP." },
        { status: 400 }
      );
    }
    const sizeBytes = Math.ceil((img.data.length * 3) / 4);
    if (sizeBytes > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "O poză depășește 10MB." },
        { status: 400 }
      );
    }
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const usageCheck = await checkAndIncrementUsage(session.user.id, user?.plan ?? "free");
  if (!usageCheck.allowed) {
    return NextResponse.json(
      {
        error: "Limita zilnică atinsă",
        used: usageCheck.used,
        limit: usageCheck.limit,
        code: "LIMIT_REACHED",
      },
      { status: 403 }
    );
  }

  try {
    const result = await analyzeListingImages(
      body.images,
      body.description,
      body.platform,
      body.language
    );
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Eroare AI. Încearcă din nou." }, { status: 500 });
  }
}
