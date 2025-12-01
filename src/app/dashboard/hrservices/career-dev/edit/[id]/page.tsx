import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/server";
import Error from "@/components/Error";
import AdminArticleEditor from "@/components/hrservices/career-dev/AdminArticleEditor";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  // Only user4 can edit articles
  const USER4_ID = "00000000-0000-0000-0000-000000000004";
  if (user.id !== USER4_ID) {
    return (
      <Error message="Access denied. This page is only available to user4." />
    );
  }

  // Fetch the article
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return <Error message="Article not found." />;
  }

  const userId = user.id;

  return (
    <div className="m-12 min-h-screen">
      <AdminArticleEditor
        userId={userId}
        articleId={id}
        initialTitle={article.title}
        initialContent={article.content}
        initialBlurb={article.blurb || ""}
        initialImageUrls={article.imageUrls || []}
      />
    </div>
  );
}
