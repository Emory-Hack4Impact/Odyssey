// src/components/hrservices/Career-Development/CareerDev.tsx
"use client";

import React, { useMemo, useState } from "react";
//helpers
export function classNames(...xs: Array<string | false | null | undefined>) {
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

export default function Page() {
  return (
    <section className="px-4 py-4 md:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">Upcoming Workshops & Events</h2>

      {/* layout: calendar (left) | content (right) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">{/* calendar here */}</div>
        <div className="lg:col-span-8">{/* cards here */}</div>
      </div>
    </section>
  );
}
