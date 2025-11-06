// src/components/hrservices/Career-Development/CareerDev.tsx
"use client";

import React, { useMemo, useState } from "react";

// ---- tiny helpers ----
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// ---- data access layer (DB later) ----
// when #33 is complete, swap this with a real fetch
export async function fetchArticles() {
  // TODO: replace with DB call. return mock for now
  return Promise.resolve(articles);
}

// ---- mock data (replace with live data when #33 ) ----
const courses = [
  { id: 1, title: "Some Course", blurb: "Short description about course", href: "#" },
  { id: 2, title: "Some Course", blurb: "Short description about course", href: "#" },
  { id: 3, title: "Some Course", blurb: "Short description about course", href: "#" },
];

// Articles: will be fetched later; using mock as placeholder
const articles = [
  { id: 1, title: "Some Article", blurb: "Short description about article", href: "#" },
  { id: 2, title: "Some Article", blurb: "Short description about article", href: "#" },
  { id: 3, title: "Some Article", blurb: "Short description about article", href: "#" },
];

// placeholder long bodies for the modal (mock content)
const mockArticleBodies: Record<number, string> = {
  1: "Some description about Article 1.",
  2: "Some description about Article 2.",
  3: "Some description about Article 3.",
};

const demoEvents = [
  { date: "2025-11-07", label: "Coaching 1:1" },
  { date: "2025-11-16", label: "Workshop: Interview Prep" },
  { date: "2025-11-24", label: "Lunch & Learn" },
];

export default function CareerDev() {
  // ---- article modal state ----
  const [activeArticle, setActiveArticle] = useState<null | {
    id: number;
    title: string;
    blurb: string;
    body?: string;
  }>(null);

  return (
    <section className="px-4 py-4 md:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">Upcoming Workshops & Events</h2>

      {/* content grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* left column: calendar */}
        <div className="lg:col-span-4">{/* <CalendarMini events={demoEvents} /> */}</div>

        {/* right column: cards */}
        <div className="lg:col-span-8">
          <section>
            <h3 className="text-base font-semibold text-gray-900">
              Featured Career Development Courses
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* {courses.map((c) => (
                <MediaCard key={c.id} title={c.title} blurb={c.blurb} href={c.href} />
              ))} */}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-gray-900">
              Featured Career Development Articles
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveArticle({ ...a, body: mockArticleBodies[a.id] })}
                  className="text-left"
                >
                  {/* <MediaCard title={a.title} blurb={a.blurb} href={undefined} /> */}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between p-4">
              <h4 className="text-lg font-semibold">{activeArticle.title}</h4>
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                onClick={() => setActiveArticle(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="px-4 pb-4 text-gray-700">
              <p className="mb-2 text-sm text-gray-500">{activeArticle.blurb}</p>
              <p className="leading-relaxed">{activeArticle.body ?? "Coming soon…"}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
