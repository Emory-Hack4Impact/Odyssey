import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const updatePassword = async (formData: FormData) => {
  "use server";

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const supabase = createClient();

  if (newPassword !== confirmPassword) {
    console.log("passwords must match");
    return redirect("/reset-password?message=Passwords must match");
  }

  const { data, error } = await supabase.auth.updateUser({
    password: confirmPassword,
  });

  if (error) {
    console.log(error);
    return redirect("/reset-password?message=Could not reset password");
  } else {
    return redirect("/protected");
  }
};

export default updatePassword;