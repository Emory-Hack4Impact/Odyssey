"use server";

import Error from "@/components/Error";
import { HRServices } from "@/components/hrservices/HRServices";
import { createClient, getUser } from "@/utils/supabase/server";

export default async function HRServicesPage() {
  const supabase = createClient();
  const user = (await getUser())!;

  // Get UserMetadata from DB
  const { data: userData, error: userError } = await supabase
    .from("UserMetadata")
    .select("is_admin, is_hr, position")
    .eq("id", user.id);

  if (userError)
    return <Error message={`Error fetching user info, please try again!\n${userError.message}`} />;

  // Get userId, username and role and pass as props
  const userId = user?.id ?? user?.user_metadata?.id ?? "0";
  const username = user?.email ?? user?.user_metadata?.name ?? "User";
  const userMetadata = userData?.[0] ?? null;
  const userRole = userMetadata?.position ?? "Unknown";

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
