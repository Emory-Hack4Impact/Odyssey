import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import updatePassword from "./updatePassword";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { token?: string, message: string };
}) {
  if (!searchParams.token) {
    redirect('/forgot-password?message=Please request a password reset email first.');
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    redirect("/forgot-password?message=Invalid or expired reset link. Please request a new one.")
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
