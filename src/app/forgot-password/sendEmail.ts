import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const resetPassword = async (formData: FormData) => {
  "use server";

  const email = formData.get("email") as string;
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return redirect(
      "/forgot-password?message=Could not send password reset email",
    );
  }
};

export default resetPassword;
