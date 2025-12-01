const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixUser1Admin() {
  try {
    console.log("Setting up UserMetadata for user1...\n");
    
    // User1 ID from seed data
    const user1Id = "00000000-0000-0000-0000-000000000001";
    
    // Check if user1 exists
    const existingUser = await prisma.userMetadata.findUnique({
      where: { id: user1Id },
    });

    if (existingUser) {
      console.log("User1 already exists. Updating to admin...");
      await prisma.userMetadata.update({
        where: { id: user1Id },
        data: { 
          is_admin: true,
          is_hr: false,
          position: "Manager",
          employeeFirstName: "Morgan",
          employeeLastName: "Manager",
        },
      });
      console.log("✅ Updated user1 to have admin access!");
    } else {
      console.log("Creating UserMetadata for user1...");
      await prisma.userMetadata.create({
        data: {
          id: user1Id,
          is_admin: true,
          is_hr: false,
          position: "Manager",
          employeeFirstName: "Morgan",
          employeeLastName: "Manager",
        },
      });
      console.log("✅ Created UserMetadata record for user1 with admin access!");
    }

    // Also ensure other seed users exist
    const usersToSeed = [
      {
        id: "00000000-0000-0000-0000-000000000002",
        is_admin: true,
        is_hr: true,
        position: "HR",
        employeeFirstName: "Harper",
        employeeLastName: "Reed",
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        is_admin: false,
        is_hr: false,
        position: "Employee",
        employeeFirstName: "Alex",
        employeeLastName: "Anderson",
      },
    ];

    for (const userData of usersToSeed) {
      await prisma.userMetadata.upsert({
        where: { id: userData.id },
        update: {
          is_admin: userData.is_admin,
          is_hr: userData.is_hr,
          position: userData.position,
        },
        create: userData,
      });
    }

    console.log("\n✅ Seeded UserMetadata table!");
    
    // Verify
    const allUsers = await prisma.userMetadata.findMany();
    console.log(`\nTotal users in UserMetadata: ${allUsers.length}`);
    allUsers.forEach((user) => {
      console.log(`  - ${user.id}: ${user.employeeFirstName} ${user.employeeLastName} (admin: ${user.is_admin})`);
    });
  } catch (error) {
    console.error("Error fixing user1 admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUser1Admin();
