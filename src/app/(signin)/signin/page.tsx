"use client";

import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import signIn from "@/app/api/auth/signin/action";
// usually we keep server actions scoped with the page/components using them but to me it makes
// more sense to place them in `auth/` here

export default function Signin({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="mx-auto mt-20 rounded-2xl bg-white p-8 shadow sm:max-w-md">
      <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2 animate-in">
        <label className="text-md text-gray-800" htmlFor="email">
          Email
        </label>
        <input
          className="input mb-3 w-full"
          name="email"
          placeholder="user@odysseycounseling.org"
          required
        />
        <label className="text-md text-gray-800" htmlFor="password">
          Password
        </label>
        <input
          className="input mb-3 w-full"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="btn border-0 bg-light-maroon btn-primary"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <Link
          className="m-auto link text-sm link-hover"
          href={`/forgot-password?redirectUrl=${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`}
        >
          Forgot password?
        </Link>
        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
