import { PrismaClient } from "@prisma/client";

void (async () => {
  const prisma = new PrismaClient();
  try {
    const ids = [
      "00000000-0000-0000-0000-000000000001",
      "00000000-0000-0000-0000-000000000002",
      "00000000-0000-0000-0000-000000000003",
      "00000000-0000-0000-0000-000000000004",
      "00000000-0000-0000-0000-000000000005",
    ];
    const rows = await prisma.userMetadata.findMany({
      where: { id: { in: ids } },
      select: { id: true, employeeFirstName: true, employeeLastName: true, position: true },
    });
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
