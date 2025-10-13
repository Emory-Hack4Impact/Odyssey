import { SubmitButton } from "@/components/submit-button";
import resetPassword from "@/app/auth/forgot-password/action";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string; redirectUrl: string };
}) {
  return (
    <div className="mx-auto mt-20 rounded-2xl bg-white p-8 shadow sm:max-w-md">
      <form className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in">
        <label className="text-md text-gray-800" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border border-gray-300 bg-inherit px-4 py-2 text-gray-800"
          name="email"
          placeholder="sam.fisher@odysseycounseling.org"
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
  );
}
