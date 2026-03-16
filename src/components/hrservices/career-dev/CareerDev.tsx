"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import CalendarMini from "./MiniCalender";
import MediaCard from "./MediaCard";
import ArticleModal from "./ArticleModal";

// ---- Types ----

export type CareerDevArticleUI = {
  id: string;
  title: string;
  author: string;
  blurb: string;
  body?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl?: string | null;
  image?: { src: string; alt: string };
};

// ---- API Calls ----

async function fetchArticles(): Promise<CareerDevArticleUI[]> {
  const res = await fetch("/api/career-dev-articles", { cache: "no-store" });

  if (!res.ok) {
    console.error("fetchArticles error:", await res.text());
    return [];
  }

  return (await res.json()) as CareerDevArticleUI[];
}

async function uploadArticleImage(articleId: string, image: File): Promise<string | null> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please log in to upload images.");
  }

  // Generate unique path for the image
  const ext = image.name.split(".").pop()?.toLowerCase() ?? "png";
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  const path = `admin/assets/${articleId}/${timestamp}-${randomId}.${ext}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("article")
    .upload(path, image, { contentType: image.type, upsert: false });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  // Generate a signed URL (valid for 1 hour, adjust as needed)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("article")
    .createSignedUrl(path, 60); // 60 = 1 minute

  if (signedUrlError || !signedUrlData?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${signedUrlError?.message}`);
  }

  // Update article with signed URL
  const imageUpdateRes = await fetch("/api/career-dev-articles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: articleId, imageUrl: signedUrlData.signedUrl }),
  });

  if (!imageUpdateRes.ok) {
    throw new Error("Failed to save image URL to article.");
  }

  return signedUrlData.signedUrl;
}

// ---- Static Data ----

const courses = [
  {
    id: 1,
    title: "Some Course",
    blurb: "Short description about course",
    href: "#",
    image: { src: "/testingfiles/courses/flowers.png", alt: "Course 1 cover" },
  },
  {
    id: 2,
    title: "Some Course",
    blurb: "Short description about course",
    href: "#",
    image: { src: "/testingfiles/courses/flower2.jpeg", alt: "Course 2 cover" },
  },
  {
    id: 3,
    title: "Some Course",
    blurb: "Short description about course",
    href: "#",
    image: { src: "/testingfiles/courses/flowers.png", alt: "Course 3 cover" },
  },
];

const demoEvents = [
  { date: "2025-11-07", label: "Coaching 1:1", starttime: "16:00", endtime: "17:30" },
  { date: "2025-11-16", label: "Workshop: Interview Prep", starttime: "16:00", endtime: "17:30" },
  { date: "2025-11-24", label: "Lunch & Learn", starttime: "16:00", endtime: "17:30" },
];

// ---- Components ----

function ArticleDetailModal({
  isOpen,
  onClose,
  article,
  onEdit,
  onDelete,
  isAdmin,
  deleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  article: CareerDevArticleUI | null;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
  deleting: boolean;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-base-100 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-base-300 p-4">
          <h4 className="text-lg font-semibold text-base-content">{article.title}</h4>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  type="button"
                  className="rounded-md border border-base-300 bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content hover:bg-base-200"
                  onClick={onEdit}
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  className="rounded-md border border-error/30 bg-base-100 px-3 py-1.5 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-50"
                  onClick={onDelete}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}

            <button
              className="rounded-md p-1 text-base-content/60 hover:bg-base-200"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="px-4 pb-4 text-base-content/80">
          <p className="mb-2 text-sm text-base-content/60">{article.blurb}</p>

          <div className="mb-4 space-y-1 text-sm">
            <p>
              <span className="font-medium">Author:</span> {article.author}
            </p>
            <p>
              <span className="font-medium">Date:</span> {article.date}
            </p>
            <p>
              <span className="font-medium">Time:</span> {article.startTime} to {article.endTime}
            </p>
            <p>
              <span className="font-medium">Location:</span> {article.location}
            </p>
          </div>

          <p className="leading-relaxed whitespace-pre-line">{article.body ?? "Coming soon..."}</p>
        </div>
      </div>
    </div>
  );
}

// ---- Main Component ----

export default function CareerDev({ isAdmin }: { isAdmin: boolean }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CareerDevArticleUI | null>(null);
  const [activeArticle, setActiveArticle] = useState<CareerDevArticleUI | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [allArticles, setAllArticles] = useState<CareerDevArticleUI[]>([]);

  const reloadArticles = useCallback(async () => {
    const data = await fetchArticles();
    setAllArticles(data);
  }, []);

  useEffect(() => {
    void reloadArticles();
  }, [reloadArticles]);

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/career-dev-articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Failed to delete article: ${text}`);
        return;
      }

      setActiveArticle(null);
      await reloadArticles();
    } catch {
      alert("Failed to delete article. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="px-4 py-4 md:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-base-content">
        Upcoming Workshops & Events
      </h2>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Calendar */}
        <div className="lg:col-span-4">
          <CalendarMini events={demoEvents} />
        </div>

        {/* Content */}
        <div className="space-y-8 lg:col-span-8">
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-base-content">
                Featured Career Development Courses
              </h3>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-base-300 bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content hover:bg-base-200"
                  aria-label="Add career development article"
                  title="Add article"
                >
                  <span>+</span>
                  <span className="hidden sm:inline">Add Article</span>
                </button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <MediaCard
                  key={c.id}
                  title={c.title}
                  blurb={c.blurb}
                  href={c.href}
                  image={c.image}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-base-content">
              Featured Career Development Articles
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allArticles.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveArticle(a)}
                  className="text-left"
                >
                  <MediaCard
                    title={a.title}
                    blurb={a.blurb}
                    image={a.imageUrl ? { src: a.imageUrl, alt: `${a.title} image` } : a.image}
                  />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <ArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitted={reloadArticles}
      />
      <ArticleModal
        isOpen={editingArticle !== null}
        onClose={() => setEditingArticle(null)}
        article={editingArticle}
        onSubmitted={reloadArticles}
        isEdit
      />
      <ArticleDetailModal
        isOpen={activeArticle !== null}
        onClose={() => setActiveArticle(null)}
        article={activeArticle}
        onEdit={() => {
          const full = allArticles.find((x) => x.id === activeArticle?.id);
          if (full) {
            setEditingArticle(full);
            setActiveArticle(null);
          }
        }}
        onDelete={() => handleDelete(activeArticle?.id ?? "")}
        isAdmin={isAdmin}
        deleting={deleting}
      />
    </section>
  );
}
