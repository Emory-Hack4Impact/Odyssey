import { HRServices } from "./HRServices";
import { createClient } from "@/utils/supabase/server";

export default async function HRServicesPage() {

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const username = user?.email || user?.user_metadata?.name || "User";

  return (
    <div>
      <HRServices username={username} />
    </div>
  )
}