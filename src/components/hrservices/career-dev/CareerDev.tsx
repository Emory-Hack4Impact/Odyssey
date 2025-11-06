// src/components/hrservices/Career-Development/CareerDev.tsx
"use client";

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
