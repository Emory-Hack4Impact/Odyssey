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

const articles = [
  {
    id: 1,
    title: "Some Article",
    blurb:
      "A brief reflection on why hard work matters, how it builds resilience and confidence, and why effort is most powerful when balanced with rest, purpose, and thoughtful direction.",
    date: "2025-11-16",
    time: "4:00 PM – 5:30 PM",
    location: "Zoom",
    href: "#",
    image: { src: "/testingfiles/articles/flowers.png", alt: "Article 1 thumbnail" },
  },
  {
    id: 2,
    title: "Some Article",
    blurb: "Short description about article",
    date: "2025-11-16",
    time: "4:00 PM – 5:30 PM",
    location: "Zoom",
    href: "#",
    image: { src: "/testingfiles/articles/flower2.jpeg", alt: "Article 2 thumbnail" },
  },
  {
    id: 3,
    title: "Some Article",
    blurb: "Short description about article",
    date: "2025-11-16",
    time: "4:00 PM – 5:30 PM",
    location: "Zoom",
    href: "#",
    image: { src: "/testingfiles/articles/flowers.png", alt: "Article 3 thumbnail" },
  },
];

// placeholder long bodies for the modal (mock content)
const mockArticleBodies: Record<number, string> = {
  1: "Hard work is often described as the foundation of success. Whether in academics, sports, or creative fields, consistent effort allows people to build knowledge and improve their abilities. Unlike talent, which may come naturally, hard work is a choice that anyone can make. It reflects discipline, focus, and determination. Working hard also builds resilience. When people encounter challenges or setbacks, their persistence helps them recover and learn from mistakes. Over time, this habit strengthens not only their skills but also their confidence. The ability to keep going, even when things are difficult, often separates success from failure. However, hard work should be balanced with rest and reflection. Working endlessly without direction can lead to burnout or frustration. True effort means working smart—setting goals, prioritizing tasks, and learning from feedback. When hard work is guided by purpose, it becomes a powerful tool for personal growth. Hard work also creates opportunities. People who consistently show effort are more likely to gain trust from teachers, mentors, and peers. This trust can lead to new responsibilities, leadership roles, or chances to explore interests more deeply. In many ways, effort signals commitment, and others respond to that commitment by offering support and guidance. At the same time, it’s important to remember that hard work looks different for everyone. Some people may need more time to grasp certain skills, while others may face obstacles that make progress slower. What matters most is not how quickly someone improves, but how willing they are to stay engaged with the process. Growth rarely happens all at once; it builds gradually through small, steady steps. Ultimately, hard work is meaningful because it shapes a person’s character. The habits formed through sustained effort—patience, discipline, adaptability—carry into every part of life. These qualities help people navigate future challenges with confidence. Hard work is not simply a path to achievement; it is a way of developing the mindset needed to keep learning, keep improving, and keep moving forward.",
  2: "Some description about Article 2.",
  3: "Some description about Article 3.",
};

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

import Image from "next/image";

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
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw"
            className="object-cover"
            priority={false}
          />
        ) : null}
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

export default function CareerDev() {
  // ---- article modal state ----
  const [activeArticle, setActiveArticle] = useState<null | {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    blurb: string;
    body?: string;
  }>(null);

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
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveArticle({ ...a, body: mockArticleBodies[a.id] })}
                  className="text-left"
                >
                  <MediaCard title={a.title} blurb={a.blurb} image={a.image} />
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
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
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

              <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Date:</span> {activeArticle.date}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {activeArticle.time}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {activeArticle.location}
                </p>
              </div>

              <p className="leading-relaxed">{activeArticle.body ?? "Coming soon…"}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
