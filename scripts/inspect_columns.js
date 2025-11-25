import { PrismaClient } from "@prisma/client";
void (async () => {
  const prisma = new PrismaClient();
  try {
    const rows =
      await prisma.$queryRaw`SELECT table_name, column_name, data_type, udt_name FROM information_schema.columns WHERE table_name ILIKE '%employee%' ORDER BY table_name, ordinal_position;`;
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
