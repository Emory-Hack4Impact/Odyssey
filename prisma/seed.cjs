/* eslint-disable */
// CommonJS seed script to avoid ESM loader issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient, RequestStatus } = require("@prisma/client");

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
  } catch { }

  // Seed dummy time-off requests
  try {
    await prisma.timeOffRequest.deleteMany({
      where: {
        employeeId: { in: [EMP_ID, "00000000-0000-0000-0000-000000000003", "00000000-0000-0000-0000-000000000004"] },
      },
    });

    await prisma.timeOffRequest.createMany({
      data: [
        // Pending requests (should show under Pending Employee Requests)
        {
          employeeId: EMP_ID,
          leaveType: "Vacation",
          otherLeaveType: "",
          startDate: new Date(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          comments: "Family trip",
          status: RequestStatus.PENDING,
        },
        {
          employeeId: "00000000-0000-0000-0000-000000000003",
          leaveType: "Sick",
          otherLeaveType: "",
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
          comments: "Doctor appointment",
          status: RequestStatus.PENDING,
        },
        // Approved requests (should show under Status of Employee Requests)
        {
          employeeId: EMP_ID,
          leaveType: "Personal",
          otherLeaveType: "",
          startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
          comments: "Errands",
          status: RequestStatus.APPROVED,
        },
        {
          employeeId: "00000000-0000-0000-0000-000000000004",
          leaveType: "Vacation",
          otherLeaveType: "",
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
          comments: "Travel",
          status: RequestStatus.APPROVED,
        },
        // Declined request
        {
          employeeId: "00000000-0000-0000-0000-000000000003",
          leaveType: "Other",
          otherLeaveType: "Conference",
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
          comments: "External conference",
          status: RequestStatus.DECLINED,
        },
      ],
    });
  } catch { }

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
  } catch { }

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
  } catch { }
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
