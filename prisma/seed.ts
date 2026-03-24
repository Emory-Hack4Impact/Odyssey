import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {
      department: "Operations",
      jobTitle: "Manager",
      bio: "Keeps cross-functional work moving and removes blockers for the team.",
      mobile: "(404) 555-0111",
      workNumber: "(404) 555-0101",
      birthday: new Date("1988-04-12"),
      avatarUrl: "",
      location: "Atlanta",
      employeeFirstName: "Morgan",
      employeeLastName: "Manager",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      department: "Operations",
      jobTitle: "Manager",
      bio: "Keeps cross-functional work moving and removes blockers for the team.",
      mobile: "(404) 555-0111",
      workNumber: "(404) 555-0101",
      birthday: new Date("1988-04-12"),
      avatarUrl: "",
      location: "Atlanta",
      is_admin: true,
      is_hr: false,
      position: "Manager",
      employeeFirstName: "Morgan",
      employeeLastName: "Manager",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {
      department: "People",
      jobTitle: "HR Lead",
      bio: "Supports people operations, policies, and employee relations across the org.",
      mobile: "(646) 555-0112",
      workNumber: "(646) 555-0102",
      birthday: new Date("1990-09-03"),
      avatarUrl: "",
      location: "New York",
      employeeFirstName: "Harper",
      employeeLastName: "Reed",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      department: "People",
      jobTitle: "HR Lead",
      bio: "Supports people operations, policies, and employee relations across the org.",
      mobile: "(646) 555-0112",
      workNumber: "(646) 555-0102",
      birthday: new Date("1990-09-03"),
      avatarUrl: "",
      location: "New York",
      is_admin: true,
      is_hr: true,
      position: "HR",
      employeeFirstName: "Harper",
      employeeLastName: "Reed",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {
      department: "Engineering",
      jobTitle: "Frontend Engineer",
      bio: "Builds polished employee-facing interfaces and improves usability.",
      mobile: "(415) 555-0113",
      workNumber: "(415) 555-0103",
      birthday: new Date("1994-01-19"),
      avatarUrl: "",
      location: "Remote",
      employeeFirstName: "Alex",
      employeeLastName: "Anderson",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      department: "Engineering",
      jobTitle: "Frontend Engineer",
      bio: "Builds polished employee-facing interfaces and improves usability.",
      mobile: "(415) 555-0113",
      workNumber: "(415) 555-0103",
      birthday: new Date("1994-01-19"),
      avatarUrl: "",
      location: "Remote",
      is_admin: false,
      is_hr: false,
      position: "Employee",
      employeeFirstName: "Alex",
      employeeLastName: "Anderson",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000004" },
    update: {
      department: "Design",
      jobTitle: "Product Designer",
      bio: "Designs accessible product flows and keeps the visual system consistent.",
      mobile: "(917) 555-0114",
      workNumber: "(917) 555-0104",
      birthday: new Date("1992-06-27"),
      avatarUrl: "",
      location: "Remote",
      employeeFirstName: "Blair",
      employeeLastName: "Baker",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000004",
      department: "Design",
      jobTitle: "Product Designer",
      bio: "Designs accessible product flows and keeps the visual system consistent.",
      mobile: "(917) 555-0114",
      workNumber: "(917) 555-0104",
      birthday: new Date("1992-06-27"),
      avatarUrl: "",
      location: "Remote",
      is_admin: false,
      is_hr: false,
      position: "Employee",
      employeeFirstName: "Blair",
      employeeLastName: "Baker",
    },
  });

  await prisma.userMetadata.upsert({
    where: { id: "00000000-0000-0000-0000-000000000005" },
    update: {
      department: "Support",
      jobTitle: "Support Specialist",
      bio: "Helps employees resolve day-to-day issues and keeps service quality high.",
      mobile: "(312) 555-0115",
      workNumber: "(312) 555-0105",
      birthday: new Date("1993-11-08"),
      avatarUrl: "",
      location: "Chicago",
      employeeFirstName: "Evan",
      employeeLastName: "Employee",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000005",
      department: "Support",
      jobTitle: "Support Specialist",
      bio: "Helps employees resolve day-to-day issues and keeps service quality high.",
      mobile: "(312) 555-0115",
      workNumber: "(312) 555-0105",
      birthday: new Date("1993-11-08"),
      avatarUrl: "",
      location: "Chicago",
      is_admin: false,
      is_hr: false,
      position: "Employee",
      employeeFirstName: "Evan",
      employeeLastName: "Employee",
    },
  });

  // Restore sample EmployeeEvaluation data for employee ...0005 (year 2025)
  const EMP_ID = "00000000-0000-0000-0000-000000000005";
  const HR_ID = "00000000-0000-0000-0000-000000000002"; // HR user

  try {
    // Delete metadata first due to cascade
    await prisma.employeeEvaluationMetadata.deleteMany({
      where: { employeeId: EMP_ID, year: 2025 },
    });
  } catch {}

  // Employee self-submitted evaluation
  try {
    await prisma.employeeEvaluation.create({
      data: {
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
        metadata: {
          create: {
            employeeId: EMP_ID,
            submitterId: EMP_ID,
            year: 2025,
            submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
        },
      },
    });
  } catch {
    // ignore if table not present
  }

  // HR-submitted evaluation
  try {
    await prisma.employeeEvaluation.create({
      data: {
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
        metadata: {
          create: {
            employeeId: EMP_ID,
            submitterId: HR_ID,
            year: 2025,
            submittedAt: new Date(),
          },
        },
      },
    });
  } catch {
    // ignore if table not present
  }
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
