"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SignInState = {
  error?: string;
};

const signIn = async (
  prevState: SignInState | null,
  formData: FormData
): Promise<SignInState> => {
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      error: "Supabase is not configured. Please check your environment variables.",
    };
  }

  try {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (error: any) {
    // Re-throw Next.js redirect errors - they should not be caught
    if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    
    // Handle connection errors
    if (error?.cause?.code === "ECONNREFUSED" || error?.message?.includes("fetch failed")) {
      return {
        error: "Cannot connect to Supabase. Please ensure Supabase is running locally (run 'supabase start').",
      };
    }
    
    // Handle other errors
    return {
      error: error?.message || "An unexpected error occurred",
    };
  }
};

export default signIn;
