// CommonJS seed script to avoid ESM loader issues
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: { employeeFirstName: "Morgan", employeeLastName: "Manager" },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      is_admin: true,
      is_hr: false,
      position: "Manager",
      employeeFirstName: "Morgan",
      employeeLastName: "Manager",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: { employeeFirstName: "Harper", employeeLastName: "Reed" },
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      is_admin: true,
      is_hr: true,
      position: "HR",
      employeeFirstName: "Harper",
      employeeLastName: "Reed",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: { employeeFirstName: "Alex", employeeLastName: "Anderson" },
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      is_admin: false,
      is_hr: false,
      position: "Employee",
      employeeFirstName: "Alex",
      employeeLastName: "Anderson",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000004" },
    update: { employeeFirstName: "Blair", employeeLastName: "Baker" },
    create: {
      id: "00000000-0000-0000-0000-000000000004",
      is_admin: false,
      is_hr: false,
      position: "Employee",
      employeeFirstName: "Blair",
      employeeLastName: "Baker",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000005" },
    update: { employeeFirstName: "Evan", employeeLastName: "Employee" },
    create: {
      id: "00000000-0000-0000-0000-000000000005",
      is_admin: false,
      is_hr: false,
      position: "Employee",
      employeeFirstName: "Evan",
      employeeLastName: "Employee",
    },
  });

  const EMP_ID = "00000000-0000-0000-0000-000000000005";
  const HR_ID = "00000000-0000-0000-0000-000000000002";

  try {
    await prisma.employeeEvaluation.deleteMany({ where: { employeeId: EMP_ID, year: 2025 } });
  } catch {}

  try {
    await prisma.employeeEvaluation.create({
      data: {
        employeeId: EMP_ID,
        submitterId: EMP_ID,
        year: 2025,
        strengths: [
          "Delivers features on time",
          "Communicates scope changes early",
          "Supports teammates proactively",
        ].join("\n"),
        weaknesses: ["Can overcommit during sprint planning", "Occasional test flakiness"].join(
          "\n",
        ),
        improvements: [
          "Allocate buffer for integration tests",
          "Adopt test retry strategy where appropriate",
          "Review sprint velocity each retro",
        ].join("\n"),
        notes: [
          "Interested in mentorship opportunities",
          "Would like to present at engineering forum",
        ].join("\n"),
        communication: 72,
        leadership: 66,
        timeliness: 81,
        skill1: 65,
        skill2: 70,
        skill3: 60,
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    });
  } catch {}

  try {
    await prisma.employeeEvaluation.create({
      data: {
        employeeId: EMP_ID,
        submitterId: HR_ID,
        year: 2025,
        strengths: [
          "Communicates clearly with team",
          "Proactive in sharing updates",
          "Active listener in meetings",
        ].join("\n"),
        weaknesses: [
          "Occasional delays in responding to messages",
          "Needs to delegate more effectively",
        ].join("\n"),
        improvements: [
          "Set response-time goals for Slack/email",
          "Schedule weekly backlog grooming",
          "Pair-program once per sprint",
        ].join("\n"),
        notes: [
          "Eligible for Q1 training stipend",
          "Prefers asynchronous collaboration",
          "Great culture add",
        ].join("\n"),
        communication: 72,
        leadership: 66,
        timeliness: 81,
        skill1: 65,
        skill2: 70,
        skill3: 60,
        submittedAt: new Date(),
      },
    });
  } catch {}
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
