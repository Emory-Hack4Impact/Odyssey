// Apply Supabase-friendly permissions and RLS policies using Prisma
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.$executeRawUnsafe(
      "GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role",
    );

    await prisma.$executeRawUnsafe(
      'GRANT SELECT ON TABLE "UserMetadata" TO anon, authenticated, service_role',
    );

    await prisma.$executeRawUnsafe('ALTER TABLE "UserMetadata" ENABLE ROW LEVEL SECURITY');

    await prisma.$executeRawUnsafe(
      'DROP POLICY IF EXISTS "Users can read own metadata" ON "UserMetadata"',
    );

    await prisma.$executeRawUnsafe(
      'CREATE POLICY "Users can read own metadata" ON "UserMetadata" FOR SELECT USING (id = auth.uid()::text)',
    );

    console.log("Permissions and RLS policies applied successfully.");
  } catch (e) {
    console.error("Failed to apply permissions:", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error("Unhandled error calling run():", e);
  process.exitCode = 1;
});
