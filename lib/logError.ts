import { prisma } from "@/lib/db";

export async function logError(route: string, message: string, userId?: string, userEmail?: string) {
  try {
    await prisma.errorLog.create({ data: { route, message, userId, userEmail } });
  } catch {}
}
