"use client";

import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import signIn from "./action";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 bg-maroon px-8">
      <div className="mb-10">
        <h1 className="pb-5 text-center font-playfair text-7xl text-white">
          Odyssey Family Counseling
        </h1>
        <h2 className="text-center font-playfair text-5xl text-odyssey-yellow">
          Employee Portal
        </h2>
      </div>
      <div className="mx-auto mt-20 rounded-2xl bg-white p-8 shadow sm:max-w-md">
        <form className="animate-in flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
          <label className="text-md text-gray-800" htmlFor="email">
            Email
          </label>
          <input
            className="mb-6 rounded-md border border-gray-300 bg-inherit px-4 py-2 text-gray-800"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md text-gray-800" htmlFor="password">
            Password
          </label>
          <input
            className="mb-6 rounded-md border border-gray-300 bg-inherit px-4 py-2 text-gray-800"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton
            formAction={signIn}
            className="mb-2 rounded-md bg-light-maroon px-4 py-2 text-foreground"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
          <Link
            className="m-auto"
            href={`/forgot-password?redirectUrl=${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`}
          >
            Forgot password?
          </Link>
          {searchParams?.message && (
            <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
