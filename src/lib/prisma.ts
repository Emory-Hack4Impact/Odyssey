// this file creates a shared prisma client for features requiring hot-loads
// usage: ` import { prisma } from "@/lib/prisma" `
import { PrismaClient } from "@prisma/client";

// cache the client in dev so we don't create too many connections
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
