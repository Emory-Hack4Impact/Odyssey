import { SubNavBar } from "@/components/NavBar";
import { useUser } from "@/utils/supabase/server";

export default async function Index() {
  const user = await useUser();

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="flex max-w-4xl flex-1 flex-col gap-20 px-3 opacity-0 animate-in">
        {/* non-null assertion because middleware will redirect to signin if user doesn't exist */}
        <SubNavBar selected={`HR Services for ${user!.email}`} />
      </div>
    </div>
  );
}
