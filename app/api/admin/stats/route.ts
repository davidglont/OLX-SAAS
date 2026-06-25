import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [totalUsers, totalListings, todayAnalyses, weekAnalyses, planBreakdown] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.usageLog.aggregate({
        where: { date: today },
        _sum: { count: true },
      }),
      prisma.usageLog.aggregate({
        where: { date: { gte: sevenDaysAgo } },
        _sum: { count: true },
      }),
      prisma.user.groupBy({
        by: ["plan"],
        _count: { id: true },
      }),
    ]);

  return NextResponse.json({
    totalUsers,
    totalListings,
    todayAnalyses: todayAnalyses._sum.count ?? 0,
    weekAnalyses: weekAnalyses._sum.count ?? 0,
    planBreakdown: planBreakdown.map((p) => ({
      plan: p.plan,
      count: p._count.id,
    })),
  });
}