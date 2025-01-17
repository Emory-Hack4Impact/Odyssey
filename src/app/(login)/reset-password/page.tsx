import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import updatePassword from "./updatePassword";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; code: string };
}) {
  const supabase = createClient();

  if (!searchParams.code) {
    redirect("/forgot-password?message=Invalid code! Please try again.");
  }

  // generate session
  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(searchParams.code);

  if (error ?? !session) {
    redirect("/forgot-password?message=Error exchanging code.");
  }

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
            Update Password
          </label>
          <input
            className="mb-6 rounded-md border border-gray-300 bg-inherit px-4 py-2 text-gray-800"
            name="newPassword"
            type="password"
            placeholder="New Password"
            required
          />
          <input
            className="mb-6 rounded-md border border-gray-300 bg-inherit px-4 py-2 text-gray-800"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
          <input
            type="hidden"
            name="accessToken"
            value={session.access_token}
          />
          <input
            type="hidden"
            name="refreshToken"
            value={session.refresh_token}
          />
          <SubmitButton
            formAction={updatePassword}
            className="mb-2 rounded-md bg-light-maroon px-4 py-2 text-foreground"
            pendingText="Signing In..."
          >
            Reset Password
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
