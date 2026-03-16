"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import CalendarMini from "./MiniCalender";
import MediaCard from "./MediaCard";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please log in to upload images.");
  }

  const ext = image.name.split(".").pop()?.toLowerCase() ?? "png";
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  const path = `admin/assets/${articleId}/${timestamp}-${randomId}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("article").upload(path, image, {
    contentType: image.type,
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("article").getPublicUrl(path);

  const imageUpdateRes = await fetch("/api/career-dev-articles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: articleId, imageUrl: data.publicUrl }),
  });

  if (!imageUpdateRes.ok) {
    throw new Error("Failed to save image URL to article.");
  }

  return data.publicUrl;
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

const EMPTY_FORM = {
  title: "",
  author: "",
  blurb: "",
  body: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
};

// ---- Components ----

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: CareerDevArticleUI | null;
  onSubmitted: () => Promise<void>;
  isEdit?: boolean;
}

function ArticleModal({
  isOpen,
  onClose,
  article,
  onSubmitted,
  isEdit = false,
}: ArticleModalProps) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (article) {
        setFormData({
          title: article.title,
          author: article.author,
          blurb: article.blurb,
          body: article.body ?? "",
          date: article.date,
          startTime: article.startTime,
          endTime: article.endTime,
          location: article.location,
        });
      } else {
        setFormData({ ...EMPTY_FORM });
      }
      setImage(null);
      setError(null);
    }
  }, [isOpen, article]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...(isEdit && article ? { id: article.id } : {}),
        title: formData.title,
        author: formData.author,
        blurb: formData.blurb,
        body: formData.body,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        ...(isEdit ? {} : { imageUrl: null }),
      };

      const res = await fetch("/api/career-dev-articles", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to ${isEdit ? "update" : "create"} article.`);
      }

      const created = (await res.json()) as { id: string };
      const articleId = isEdit ? article?.id : created.id;

      if (image && articleId) {
        await uploadArticleImage(articleId, image);
      }

      await onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          <h4 className="text-lg font-semibold text-base-content">
            {isEdit ? "Edit Article" : "Create New Article"}
          </h4>
          <button
            className="rounded-md p-1 text-base-content/60 hover:bg-base-200"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-base-content">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-base-content">
                Author *
              </label>
              <input
                type="text"
                id="author"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="blurb" className="block text-sm font-medium text-base-content">
                Short Description *
              </label>
              <textarea
                id="blurb"
                required
                rows={2}
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.blurb}
                onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-base-content">
                Article Content *
              </label>
              <textarea
                id="body"
                required
                rows={8}
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-base-content">
                Date *
              </label>
              <input
                type="date"
                id="date"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-base-content">
                  Start time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  required
                  className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-base-content">
                  End time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  required
                  className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-base-content">
                Location *
              </label>
              <input
                type="text"
                id="location"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-base-content">
                {isEdit ? "Replace" : "Article"} Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium text-base-content hover:bg-base-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
