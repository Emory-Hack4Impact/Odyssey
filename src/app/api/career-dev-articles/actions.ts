"use server";

import { prisma } from "@/lib/prisma";

type CreateCareerDevArticleInput = {
  title: string;
  author: string;
  blurb: string;
  body: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location: string;
  imageurl?: string | null;
};

export async function CreateCareerDevArticle(input: CreateCareerDevArticleInput) {
  // basic guardrails (keeps DB errors quieter)
  if (!input.title || !input.author || !input.blurb || !input.date) {
    throw new Error("Missing required fields.");
  }

  const row = await prisma.careerDevArticles.create({
    data: {
      title: input.title,
      author: input.author,
      blurb: input.blurb,
      body: input.body,
      date: input.date,
      starttime: input.startTime,
      endtime: input.endTime,
      location: input.location,
      imageurl: input.imageurl ?? null,
    },
  });

  return row;
}

export async function GetCareerDevArticles() {
  const rows = await prisma.careerDevArticles.findMany({
    orderBy: { created_at: "desc" },
  });

  // map DB -> UI shape (camelCase times for the UI)
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    author: r.author,
    blurb: r.blurb,
    body: r.body,
    date: r.date.toISOString().slice(0, 10), // "YYYY-MM-DD"
    startTime: r.starttime.toISOString().slice(11, 16),
    endTime: r.endtime.toISOString().slice(11, 16),
    location: r.location,
    imageUrl: r.imageurl,
    image: r.imageurl ? { src: r.imageurl, alt: `${r.title} image` } : undefined,
  }));
}
