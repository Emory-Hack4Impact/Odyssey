"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/protected");
};

export default signIn;