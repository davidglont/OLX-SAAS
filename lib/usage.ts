import { prisma } from "./db";
import { PLANS, type PlanKey } from "./stripe";

export async function checkAndIncrementUsage(userId: string, plan: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const limit = PLANS[(plan as PlanKey) ?? "free"]?.limit ?? 1;

  const log = await prisma.usageLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: {},
    create: { userId, date: today, count: 0 },
  });

  if (log.count >= limit) {
    return { allowed: false, used: log.count, limit };
  }

  await prisma.usageLog.update({
    where: { userId_date: { userId, date: today } },
    data: { count: { increment: 1 } },
  });

  return { allowed: true, used: log.count + 1, limit };
}

export async function getTodayUsage(userId: string): Promise<{ used: number; limit: number }> {
  const today = new Date().toISOString().split("T")[0];
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const plan = user?.plan ?? "free";
  const limit = PLANS[(plan as PlanKey)]?.limit ?? 1;

  const log = await prisma.usageLog.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  return { used: log?.count ?? 0, limit };
}
