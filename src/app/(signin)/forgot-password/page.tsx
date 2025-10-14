import { SubmitButton } from "@/components/SubmitButton";
import resetPassword from "@/app/api/auth/forgot-password/action";
// usually we keep server actions scoped with the page/components using them but to me it makes
// more sense to place them in `auth/` here

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string; redirectUrl: string };
}) {
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
        <SubmitButton
          formAction={resetPassword}
          className="btn border-0 btn-error"
          pendingText="Sending email"
        >
          Send Email
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 bg-base-300 p-4 text-center">{searchParams.message}</p>
        )}
      </form>
    </div>
  );
}
