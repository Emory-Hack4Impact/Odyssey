import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export const getUser = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export async function uploadFileToStorage(
  bucket: string,
  path: string,
  // file body, in bytes
  fileBody: ArrayBuffer,
  contentType?: string,
): Promise<{ bucket: string; path: string }> {
  const supabase = createClient();
  
  // call supabase helpers and upload file bytes
  // for now, just return basic info.
  const { data, error } = await supabase.storage
    .from (bucket)
    .upload (path, fileBody,{
      contentType,
      // not overwriting existing files for now; can be changed later
      upsert: false, 
    });

    if (error) {
      throw new Error (`Failed to upload file to Supabase: ${error.message}`);
    }
  // TODO: will finalize later
  return { bucket, path };
}
