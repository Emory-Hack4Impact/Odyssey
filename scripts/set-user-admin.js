const { PrismaClient } = require("@prisma/client");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setUserAdmin() {
  try {
    console.log("Setting user as admin...\n");
    
    const userId = await question("Enter the user ID (from Supabase auth): ");
    
    if (!userId || userId.trim() === "") {
      console.log("❌ User ID is required");
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await prisma.userMetadata.findUnique({
      where: { id: userId.trim() },
    });

    if (!existingUser) {
      console.log(`\n⚠️  User with ID ${userId.trim()} not found in UserMetadata.`);
      const create = await question("Create new UserMetadata record? (y/n): ");
      
      if (create.toLowerCase() === "y") {
        const firstName = await question("First name (optional): ");
        const lastName = await question("Last name (optional): ");
        const position = await question("Position (optional): ");
        
        await prisma.userMetadata.create({
          data: {
            id: userId.trim(),
            is_admin: true,
            is_hr: false,
            position: position.trim() || "",
            employeeFirstName: firstName.trim() || null,
            employeeLastName: lastName.trim() || null,
          },
        });
        console.log("\n✅ Created UserMetadata record with admin access!");
      } else {
        console.log("Aborted.");
        process.exit(0);
      }
    } else {
      // Update existing user
      await prisma.userMetadata.update({
        where: { id: userId.trim() },
        data: { is_admin: true },
      });
      console.log(`\n✅ Updated user ${userId.trim()} to have admin access!`);
    }
  } catch (error) {
    console.error("Error setting user admin:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

setUserAdmin();
