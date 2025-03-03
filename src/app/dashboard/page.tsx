"use server";

import { useUser } from "@/utils/supabase/server";
import ProfileWidget from "@/components/profile-widget/ProfileWidget";

export default async function Index() {
  // non-null assertion because middleware will redirect to signin if user doesn't exist
  const user = (await useUser())!;

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="animate-in flex max-w-4xl flex-1 flex-col gap-20 px-3 opacity-0">
        <ProfileWidget user={user} />
      </div>
    </div>
  );
}
