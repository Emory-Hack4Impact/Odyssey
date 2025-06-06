import { HRServices } from "./HRServices";
import { createClient } from "@/utils/supabase/server";

export default async function HRServicesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  // Get UserMetadata from DB
  const { data: userData, error: userError } = await supabase
    .from("UserMetadata")
    .select("is_admin, is_hr, position")
    .eq("id", user.id);

  // console.log("user:", user);
  // console.log("usermetadata:", data);

  // Get userId, username and role and pass as props
  const userId = user?.id ?? user?.user_metadata?.id ?? "0";
  const username = user?.email ?? user?.user_metadata?.name ?? "User";
  const userRole = userData?.[0]?.position ?? "Unknown";

  // console.log(userId, username, userRole)

  const { data: evaluations, error: evalError } = await supabase
    .from("EmployeeEvaluation")
    .select("*");

  // console.log(evaluations)

  return (
    <div>
      <HRServices userId={userId} username={username} userRole={userRole} />
    </div>
  );
}
