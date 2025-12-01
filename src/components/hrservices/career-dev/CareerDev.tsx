// src/components/hrservices/Career-Development/CareerDev.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

// ---- tiny helpers ----
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// ---- mock data (replace with live data when #33 ) ----
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

// Article type from database
interface Article {
  id: string;
  title: string;
  content: string;
  blurb: string | null;
  imageUrls: string[];
  createdAt: string;
  author: {
    employeeFirstName: string | null;
    employeeLastName: string | null;
  };
}

const demoEvents = [
  { date: "2025-11-07", label: "Coaching 1:1" },
  { date: "2025-11-16", label: "Workshop: Interview Prep" },
  { date: "2025-11-24", label: "Lunch & Learn" },
];

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

function CalendarMini({ events = [] as { date: string; label?: string }[] }) {
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
        {"SMTWTFS".split("").map((c) => (
          <div key={c} className="py-1">
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
                    isSelected && "outline outline-2 outline-indigo-600",
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
                <span className="text-gray-700">{e.label}</span>
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
    <div className="group block rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-gray-200">
        {image?.src ? (
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
            onLoad={() => {
              console.log("Image loaded successfully:", image.src);
            }}
            onError={(e) => {
              console.error("Image failed to load:", {
                src: image.src,
                alt: image.alt,
                error: e,
              });
              // Show a placeholder instead of hiding
              e.currentTarget.style.display = "none";
              const placeholder = document.createElement("div");
              placeholder.className = "flex h-full w-full items-center justify-center bg-gray-300 text-xs text-gray-500";
              placeholder.textContent = "Image not found";
              e.currentTarget.parentElement?.appendChild(placeholder);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200 text-xs text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-medium text-gray-900 group-hover:underline">{title}</div>
        <p className="mt-1 text-sm text-gray-600">{blurb}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {CardInner}
    </a>
  ) : (
    CardInner
  );
}

interface CareerDevProps {
  userId: string;
  userMetadata: {
    is_admin: boolean;
    is_hr: boolean;
    position: string;
  } | null;
}

export default function CareerDev({ userId, userMetadata }: CareerDevProps) {
  // ---- article state ----
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration by only rendering conditional content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await fetch("/api/articles?published=true");
        const data = await response.json();
        console.log("Fetched articles:", data.articles);
        if (data.articles) {
          // Log each article's image URLs
          data.articles.forEach((article: Article) => {
            console.log(`Article "${article.title}":`, {
              id: article.id,
              imageUrls: article.imageUrls,
              hasImages: article.imageUrls && article.imageUrls.length > 0,
            });
          });
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    if (mounted) {
      fetchArticles();
    }
  }, [mounted]);

  // Only user4 can create articles
  const canCreateArticle = userId === "00000000-0000-0000-0000-000000000004";

  return (
    <section className="px-4 py-4 md:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Upcoming Workshops & Events</h2>
        {mounted && canCreateArticle && (
          <Link
            href="/dashboard/hrservices/career-dev/create"
            className="btn-primary btn btn-sm whitespace-nowrap"
          >
            ➕ Create Article
          </Link>
        )}
      </div>

      {/* content grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* left column: calendar */}
        <div className="lg:col-span-4">
          <CalendarMini events={demoEvents} />
        </div>

        {/* right column: cards */}
        <div className="lg:col-span-8">
          <section>
            <h3 className="text-base font-semibold text-gray-900">
              Featured Career Development Courses
            </h3>
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
            {loadingArticles ? (
              <div className="mt-3 text-center text-sm text-gray-500">Loading articles...</div>
            ) : articles.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-sm text-base-content/70">
                No articles available yet. Check back soon!
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => {
                  const imageUrl = article.imageUrls && article.imageUrls.length > 0 ? article.imageUrls[0] : null;
                  if (imageUrl) {
                    console.log(`Article "${article.title}":`, {
                      imageUrl,
                      allImageUrls: article.imageUrls,
                    });
                  } else {
                    console.warn(`Article "${article.title}" has no images`);
                  }
                  
                  return (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="text-left"
                    >
                      <MediaCard
                        title={article.title}
                        blurb={article.blurb || ""}
                        image={
                          imageUrl
                            ? {
                                src: imageUrl,
                                alt: `${article.title} thumbnail`,
                              }
                            : undefined
                        }
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-start justify-between bg-white p-4 border-b">
              <h4 className="text-lg font-semibold">{activeArticle.title}</h4>
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                onClick={() => setActiveArticle(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="px-4 pb-4 pt-4 text-gray-700">
              {activeArticle.blurb && (
                <p className="mb-4 text-sm text-gray-500">{activeArticle.blurb}</p>
              )}
              <div className="markdown-content">
                <ReactMarkdown>{activeArticle.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
