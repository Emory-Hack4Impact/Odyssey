import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect, usePathname } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import resetPassword from "./sendEmail";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string, redirectUrl: string };
}) {
  const supabase = createClient();

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
          <SubmitButton
            formAction={resetPassword}
            className="mb-2 rounded-md bg-light-maroon px-4 py-2 text-foreground"
            pendingText="Sending email"
          >
            Send Email
          </SubmitButton>
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
