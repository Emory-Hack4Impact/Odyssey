// src/components/hrservices/Career-Development/CareerDev.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// ---- tiny helpers ----
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

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

async function fetchArticles(): Promise<CareerDevArticleUI[]> {
  const res = await fetch("/api/career-dev-articles", { cache: "no-store" });

  if (!res.ok) {
    console.error("fetchArticles error:", await res.text());
    return [];
  }

  return (await res.json()) as CareerDevArticleUI[];
}

// ---- static data ----

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

// ---- image upload helper (shared by create & edit) ----

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
  const path = `${articleId}/${timestamp}-${randomId}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("Article").upload(path, image, {
    contentType: image.type,
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("Article").getPublicUrl(path);

  // Save the public URL back to the article record
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

// ---- calendar ----

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function CalendarMini({
  events = [] as { date: string; label?: string; starttime?: string; endtime?: string }[],
}) {
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [selectedISO, setSelectedISO] = useState<string>(toISODate(new Date()));

  const { weeks, monthName, year } = useMemo(() => {
    const first = startOfMonth(cursor);
    const last = endOfMonth(cursor);

    const monthName = first.toLocaleString(undefined, { month: "long" });
    const year = first.getFullYear();

    const days: Date[] = [];
    // pad from Sunday
    const padBefore = first.getDay();
    for (let i = 0; i < padBefore; i++)
      days.push(new Date(first.getFullYear(), first.getMonth(), 0 - (padBefore - 1 - i)));
    // month days
    for (let d = 1; d <= last.getDate(); d++)
      days.push(new Date(first.getFullYear(), first.getMonth(), d));
    // pad after to fill 6 weeks
    const total = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < total; i++)
      days.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + (i - days.length) + 1),
      );

    // group into weeks
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    return { weeks, monthName, year };
  }, [cursor]);

  const eventDates = useMemo(() => new Set(events.map((e) => e.date)), [events]);
  const todayISO = toISODate(new Date());

  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedISO),
    [events, selectedISO],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          aria-label="Previous month"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
          onClick={() => setCursor((d) => addMonths(d, -1))}
        >
          ‹
        </button>
        <div className="text-sm font-medium">
          {monthName} {year}
        </div>
        <button
          aria-label="Next month"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
          onClick={() => setCursor((d) => addMonths(d, 1))}
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-xs text-gray-500">
        {"SMTWTFS".split("").map((c, i) => (
          <div key={i} className="py-1">
            {c}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {weeks.map((wk, i) => (
          <React.Fragment key={i}>
            {wk.map((d, j) => {
              const inMonth = d.getMonth() === cursor.getMonth();
              const iso = toISODate(d);
              const hasEvent = eventDates.has(iso);
              const isToday = iso === todayISO;
              const isSelected = iso === selectedISO;
              return (
                <button
                  type="button"
                  aria-label={`Select ${iso}`}
                  key={j}
                  onClick={() => setSelectedISO(iso)}
                  disabled={!inMonth}
                  className={classNames(
                    "relative aspect-square rounded-xl text-center leading-6 transition",
                    inMonth
                      ? "bg-base-100 hover:bg-base-200/60"
                      : "bg-transparent text-base-content/30",
                    isToday && "ring-1 ring-indigo-500",
                    isSelected && "outline-2 outline-indigo-600",
                  )}
                >
                  <div className={classNames("mt-1", !inMonth && "opacity-40")}>
                    {inMonth ? d.getDate() : ""}
                  </div>
                  {hasEvent && (
                    <div className="absolute inset-x-0 bottom-1 mx-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium">
          Events on{" "}
          {new Date(selectedISO).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </div>
        {dayEvents.length ? (
          <ul className="mt-2 space-y-1 text-sm">
            {dayEvents.map((e, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" />
                <span className="text-gray-700">
                  {e.label}
                  {e.starttime && e.endtime ? ` — ${e.starttime} to ${e.endtime}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No events for this day.</p>
        )}
      </div>
    </div>
  );
}

// ---- media card ----

function MediaCard({
  title,
  blurb,
  href,
  image,
}: {
  title: string;
  blurb: string;
  href?: string;
  image?: { src: string; alt: string };
}) {
  const CardInner = (
    <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-gray-200">
        {image?.src ? (
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-sm font-medium text-gray-900 group-hover:underline">{title}</div>
        <p className="mt-1 line-clamp-3 text-sm text-gray-600">{blurb}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block h-full">
      {CardInner}
    </a>
  ) : (
    CardInner
  );
}

// ---- article create modal ----

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

function ArticleCreateModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...EMPTY_FORM });
      setImage(null);
      setError(null);
    }
  }, [isOpen]);

  // Escape key to close
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
      const createRes = await fetch("/api/career-dev-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          blurb: formData.blurb,
          body: formData.body,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          imageUrl: null,
        }),
      });

      if (!createRes.ok) {
        const text = await createRes.text();
        throw new Error(text || "Failed to create article.");
      }

      const created = (await createRes.json()) as { id: string };

      if (image) {
        await uploadArticleImage(created.id, image);
      }

      await onCreated();
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
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b p-4">
          <h4 className="text-lg font-semibold">Create New Article</h4>
          <button
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author *
              </label>
              <input
                type="text"
                id="author"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            {/* Blurb */}
            <div>
              <label htmlFor="blurb" className="block text-sm font-medium text-gray-700">
                Short Description *
              </label>
              <textarea
                id="blurb"
                required
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.blurb}
                onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              />
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                Article Content *
              </label>
              <textarea
                id="body"
                required
                rows={8}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="date"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Article Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- article edit modal ----

function ArticleEditModal({
  isOpen,
  onClose,
  article,
  onUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  article: CareerDevArticleUI | null;
  onUpdated: () => Promise<void>;
}) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!article) return;
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
    setImage(null);
    setError(null);
  }, [article]);

  // Escape key to close
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
    if (!article) return;
    setSubmitting(true);
    setError(null);

    try {
      const updateRes = await fetch("/api/career-dev-articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          title: formData.title,
          author: formData.author,
          blurb: formData.blurb,
          body: formData.body,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
        }),
      });

      if (!updateRes.ok) {
        const text = await updateRes.text();
        throw new Error(text || "Failed to update article.");
      }

      if (image) {
        await uploadArticleImage(article.id, image);
      }

      await onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b p-4">
          <h4 className="text-lg font-semibold">Edit Article</h4>
          <button
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="edit-title"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700">
                Author *
              </label>
              <input
                type="text"
                id="edit-author"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            {/* Blurb */}
            <div>
              <label htmlFor="edit-blurb" className="block text-sm font-medium text-gray-700">
                Short Description *
              </label>
              <textarea
                id="edit-blurb"
                required
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.blurb}
                onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              />
            </div>

            {/* Body */}
            <div>
              <label htmlFor="edit-body" className="block text-sm font-medium text-gray-700">
                Article Content *
              </label>
              <textarea
                id="edit-body"
                required
                rows={8}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="edit-date"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700">
                  Start time *
                </label>
                <input
                  type="time"
                  id="edit-startTime"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700">
                  End time *
                </label>
                <input
                  type="time"
                  id="edit-endTime"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="edit-location"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700">
                Replace Article Image
              </label>
              <input
                type="file"
                id="edit-image"
                accept="image/*"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- main component ----

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

  // Escape key to close the article view modal
  useEffect(() => {
    if (!activeArticle) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveArticle(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeArticle]);

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
      <h2 className="mb-6 text-xl font-semibold tracking-tight">Upcoming Workshops & Events</h2>

      {/* content grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* left column: calendar */}
        <div className="lg:col-span-4">
          <CalendarMini events={demoEvents} />
        </div>

        {/* right column: cards */}
        <div className="lg:col-span-8">
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Featured Career Development Courses
              </h3>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
                  aria-label="Add career development article"
                  title="Add article"
                >
                  <span className="text-lg leading-none">+</span>
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

          <section className="mt-8">
            <h3 className="text-base font-semibold text-gray-900">
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

      {/* Article view modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-4">
              <h4 className="text-lg font-semibold">{activeArticle.title}</h4>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
                      onClick={() => {
                        const full = allArticles.find((x) => x.id === activeArticle.id);
                        if (!full) return;
                        setEditingArticle(full);
                        setActiveArticle(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => handleDelete(activeArticle.id)}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}

                <button
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  onClick={() => setActiveArticle(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="px-4 pb-4 text-gray-700">
              <p className="mb-2 text-sm text-gray-500">{activeArticle.blurb}</p>

              <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Author:</span> {activeArticle.author}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {activeArticle.date}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {activeArticle.startTime} to{" "}
                  {activeArticle.endTime}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {activeArticle.location}
                </p>
              </div>

              <p className="leading-relaxed whitespace-pre-line">
                {activeArticle.body ?? "Coming soon..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Article Create Modal */}
      <ArticleCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={reloadArticles}
      />
      <ArticleEditModal
        isOpen={editingArticle !== null}
        onClose={() => setEditingArticle(null)}
        article={editingArticle}
        onUpdated={reloadArticles}
      />
    </section>
  );
}
