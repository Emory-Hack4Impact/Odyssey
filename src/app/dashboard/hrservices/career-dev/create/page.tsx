import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/server";
import Error from "@/components/Error";
import AdminArticleEditor from "@/components/hrservices/career-dev/AdminArticleEditor";

export default async function CreateArticlePage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  // Only user4 can create articles
  const USER4_ID = "00000000-0000-0000-0000-000000000004";
  if (user.id !== USER4_ID) {
    return (
      <Error message="Access denied. This page is only available to user4." />
    );
  }

  const userId = user.id;

  return (
    <div className="m-12 min-h-screen">
      <AdminArticleEditor userId={userId} />
    </div>
  );
}
