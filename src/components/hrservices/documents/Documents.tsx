"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminDocuments from "./AdminDocuments";
import UserDocuments from "./UserDocuments";

type ViewState = {
  isAdmin: boolean | null;
  error: string | null;
};

const initialState: ViewState = {
  isAdmin: null,
  error: null,
};

export default function Documents() {
  const [{ isAdmin, error }, setState] = useState<ViewState>(initialState);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const loadMetadata = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        if (!isMounted) return;
        setState({ isAdmin: false, error: authError?.message ?? null });
        return;
      }

      const { data, error: metadataError } = await supabase
        .from("UserMetadata")
        .select("is_admin")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (metadataError) {
        setState({ isAdmin: false, error: metadataError.message });
        return;
      }

      setState({ isAdmin: data?.is_admin ?? false, error: null });
    };

    void loadMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-error/30 bg-error/5 p-6 text-sm text-error">
        Unable to determine your document permissions. Error: {error}
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="rounded-xl border border-base-200 bg-base-100 p-8 text-sm text-base-content/70">
        Loading documents...
      </div>
    );
  }

  return isAdmin ? <AdminDocuments /> : <UserDocuments />;
}
