"use server";

import Error from "@/components/Error";
import { HRServices } from "@/components/hrservices/HRServices";
import { getUser } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function HRServicesPage() {
  const user = (await getUser())!;

  // Get UserMetadata from DB using Prisma (bypasses RLS for server-side queries)
  let userMetadata = null;
  try {
    userMetadata = await prisma.userMetadata.findUnique({
      where: { id: user.id },
      select: { is_admin: true, is_hr: true, position: true },
    });
  } catch (error: any) {
    return <Error message={`Error fetching user info, please try again!\n${error.message}`} />;
  }

  // Get userId, username and role and pass as props
  const userId = user?.id ?? user?.user_metadata?.id ?? "0";
  const username = user?.email ?? user?.user_metadata?.name ?? "User";
  const userRole = userMetadata?.position ?? "Unknown";

  // If userMetadata is null, show a helpful error message
  if (!userMetadata) {
    return (
      <Error
        message={
          `No UserMetadata record found for your account (ID: ${userId}). ` +
          `Please contact an administrator or run the script: node scripts/create-user-metadata.js`
        }
      />
    );
  }

  // const { data: evaluations, error: evalError } = await supabase
  //   .from("EmployeeEvaluation")
  //   .select("*");

  // console.log(evaluations)

  return (
    <div>
      <HRServices
        userId={userId}
        username={username}
        userRole={userRole}
        userMetadata={userMetadata}
      />
    </div>
  );
}
