"use server";

import Error from "@/components/Error";
import { EmployeeDirectory } from "@/components/directory/EmployeeDirectory";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/utils/supabase/server";

export default async function EmployeeDirectoryPage() {
  const user = (await getUser())!;

  // Get UserMetadata from DB
  const data = await prisma.userMetadata.findUnique({
    where: { id: user.id },
  });

  if (!data) return <Error message={`User not found, please try again!\n`} />;

  // Get userId, username and role and pass as props
  const userId = user?.id ?? user?.user_metadata?.id ?? "0";
  const username = user?.email ?? user?.user_metadata?.name ?? "User";
  const userMetadata = data;
  const userRole = userMetadata?.position ?? "Unknown";

  return (
    <EmployeeDirectory
      userId={userId}
      username={username}
      userRole={userRole}
      userMetadata={userMetadata}
    />
  );
}
