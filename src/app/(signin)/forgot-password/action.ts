"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const resetPassword = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return redirect(
      "/forgot-password?message=Could not send password reset email",
    );
  }

  return redirect("/forgot-password?message=Confirmation email sent!");
};

export default resetPassword;
