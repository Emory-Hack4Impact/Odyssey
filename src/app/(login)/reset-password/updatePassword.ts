import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const updatePassword = async (formData: FormData) => {
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
    console.log("passwords must match");
    return redirect("/reset-password?message=Passwords must match");
  }

  const { error } = await supabase.auth.updateUser({
    password: confirmPassword,
  });

  if (error) {
    console.log(error);
    return redirect(`/forgot-password?message=${error.message}`);
  } else {
    return redirect("/protected");
  }
};

export default updatePassword;
