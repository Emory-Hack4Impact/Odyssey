const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUserAdmin() {
  try {
    console.log("Checking all users in UserMetadata...\n");
    
    const allUsers = await prisma.userMetadata.findMany({
      select: {
        id: true,
        is_admin: true,
        is_hr: true,
        position: true,
        employeeFirstName: true,
        employeeLastName: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    console.log("Found", allUsers.length, "users in UserMetadata:\n");
    
    allUsers.forEach((user) => {
      console.log(`ID: ${user.id}`);
      console.log(`  Name: ${user.employeeFirstName || ""} ${user.employeeLastName || ""}`);
      console.log(`  Position: ${user.position || "Not set"}`);
      console.log(`  is_admin: ${user.is_admin}`);
      console.log(`  is_hr: ${user.is_hr}`);
      console.log("---");
    });

    // Check for user1 specifically (ID ending in 0001)
    const user1 = allUsers.find((u) => u.id.includes("0001") || u.id.endsWith("1"));
    if (user1) {
      console.log("\nFound potential user1:");
      console.log(JSON.stringify(user1, null, 2));
      
      if (!user1.is_admin) {
        console.log("\n⚠️  User1 is NOT set as admin. Run the update script to fix this.");
      } else {
        console.log("\n✅ User1 is set as admin.");
      }
    } else {
      console.log("\n⚠️  Could not find user1 in the database.");
      console.log("You may need to create a UserMetadata record for your auth user.");
    }
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserAdmin();
