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

async function createUserMetadata() {
  try {
    console.log("Create/Update UserMetadata record\n");
    console.log("To find your user ID:");
    console.log("1. Sign in to your app");
    console.log("2. Visit: http://localhost:3000/api/debug/user-info");
    console.log("3. Copy the 'id' from the authUser object\n");
    
    const userId = await question("Enter your Supabase auth user ID: ");
    
    if (!userId || userId.trim() === "") {
      console.log("❌ User ID is required");
      process.exit(1);
    }

    const firstName = await question("First name (optional): ");
    const lastName = await question("Last name (optional): ");
    const position = await question("Position (optional): ");
    const isAdmin = (await question("Is admin? (y/n) [y]: ")).toLowerCase() !== "n";
    const isHR = (await question("Is HR? (y/n) [n]: ")).toLowerCase() === "y";

    const userData = {
      id: userId.trim(),
      is_admin: isAdmin,
      is_hr: isHR,
      position: position.trim() || "",
      employeeFirstName: firstName.trim() || null,
      employeeLastName: lastName.trim() || null,
    };

    const existing = await prisma.userMetadata.findUnique({
      where: { id: userId.trim() },
    });

    if (existing) {
      await prisma.userMetadata.update({
        where: { id: userId.trim() },
        data: userData,
      });
      console.log(`\n✅ Updated UserMetadata for user ${userId.trim()}!`);
      console.log(`   Admin: ${isAdmin}, HR: ${isHR}, Position: ${position || "Not set"}`);
    } else {
      await prisma.userMetadata.create({
        data: userData,
      });
      console.log(`\n✅ Created UserMetadata record for user ${userId.trim()}!`);
      console.log(`   Admin: ${isAdmin}, HR: ${isHR}, Position: ${position || "Not set"}`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createUserMetadata();
