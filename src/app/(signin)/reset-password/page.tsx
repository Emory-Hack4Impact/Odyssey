import { SubmitButton } from "@/components/submit-button";
import { verifyCode, updatePassword } from "@/app/api/auth/reset-password/action";
// usually we keep server actions scoped with the page/components using them but to me it makes
// more sense to place them in `auth/` here

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; code: string };
}) {
  const session = await verifyCode(searchParams);

  return (
    <div className="mx-auto mt-20 rounded-2xl bg-white p-8 shadow sm:max-w-md">
      <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2 animate-in">
        <label className="text-md text-gray-800" htmlFor="email">
          Update Password
        </label>
        <input
          className="input mb-3 w-full"
          name="newPassword"
          type="password"
          placeholder="New Password"
          required
        />
        <input
          className="input mb-3 w-full"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
        />
        <input type="hidden" name="accessToken" value={session.access_token} />
        <input type="hidden" name="refreshToken" value={session.refresh_token} />
        <SubmitButton
          formAction={updatePassword}
          className="btn border-0 bg-light-maroon btn-primary"
          pendingText="Signing In..."
        >
          Reset Password
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 bg-base-300 p-4 text-center">{searchParams.message}</p>
        )}
      </form>
    </div>
  );
}
