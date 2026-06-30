import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeonHttp(url, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
}

// Lazy proxy: defers actual PrismaClient construction (and the DATABASE_URL
// read) until the first real query, so importing this module never throws —
// e.g. during Next.js build-time route analysis, which only inspects exports.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma() as object, prop, receiver);
  },
}) as PrismaClient;