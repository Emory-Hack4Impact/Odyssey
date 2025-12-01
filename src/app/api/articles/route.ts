import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/utils/supabase/server";

const prisma = new PrismaClient();

// GET - Fetch articles (for listing)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get("id");
    const published = searchParams.get("published");

    if (articleId) {
      // Fetch single article
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        include: {
          author: {
            select: {
              employeeFirstName: true,
              employeeLastName: true,
            },
          },
        },
      });

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      return NextResponse.json({ article });
    }

    // Fetch multiple articles
    const where: any = {};
    if (published !== null) {
      where.published = published === "true";
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            employeeFirstName: true,
            employeeLastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ articles });
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only user4 can create articles
    const USER4_ID = "00000000-0000-0000-0000-000000000004";
    if (user.id !== USER4_ID) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, blurb, imageUrls, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        blurb: blurb || null,
        imageUrls: imageUrls || [],
        authorId: user.id,
        published: published ?? true, // Default to true (published) unless explicitly set to false
      },
      include: {
        author: {
          select: {
            employeeFirstName: true,
            employeeLastName: true,
          },
        },
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create article" },
      { status: 500 }
    );
  }
}

// PUT - Update existing article
export async function PUT(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only user4 can update articles
    const USER4_ID = "00000000-0000-0000-0000-000000000004";
    if (user.id !== USER4_ID) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, content, blurb, imageUrls, published } = body;

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    // Check if article exists and user is the author
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(blurb !== undefined && { blurb: blurb || null }),
        ...(imageUrls !== undefined && { imageUrls }),
        ...(published !== undefined && { published }),
      },
      include: {
        author: {
          select: {
            employeeFirstName: true,
            employeeLastName: true,
          },
        },
      },
    });

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only user4 can delete articles
    const USER4_ID = "00000000-0000-0000-0000-000000000004";
    if (user.id !== USER4_ID) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get("id");

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}

