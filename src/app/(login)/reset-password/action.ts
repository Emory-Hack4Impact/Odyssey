import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function verifyCode(searchParams: {
  message: string;
  code: string;
}) {
  "use server";
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

  return session;
}

export const updatePassword = async (formData: FormData) => {
  "use server";

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const accessToken = formData.get("accessToken") as string;
  const refreshToken = formData.get("refreshToken") as string;
  const supabase = createClient();

  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (newPassword !== confirmPassword) {
    return redirect("/reset-password?message=Passwords must match");
  }

  const { error } = await supabase.auth.updateUser({
    password: confirmPassword,
  });

  if (error) {
    return redirect(`/forgot-password?message=${error.message}`);
  } else {
    return redirect("/dashboard");
  }
};
