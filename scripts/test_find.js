import { PrismaClient } from '@prisma/client';
void (async () => {
  const prisma = new PrismaClient();
  try {
    const employeeId = '00000000-0000-0000-0000-000000000005';
    console.log('Running findMany for', employeeId, 'year', 2025);
    const rows = await prisma.employeeEvaluation.findMany({ where: { employeeId, year: 2025 }, orderBy: { submittedAt: 'desc' } });
    console.log('rows:', rows.length);
    console.log(rows.slice(0, 5));
  } catch (e) {
    console.error('error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
