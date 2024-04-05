import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000000" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000000",
      is_admin: true,
      is_hr: false,
      position: "Manager",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
