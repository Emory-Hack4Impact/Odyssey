"use client";

import { User } from "@supabase/supabase-js";
import Avatar from "./Avatar";
import { useState } from "react";

export default function ProfileWidget({ user }: { user: User }) {
  let [avatarUrl, setAvatarUrl] = useState("");

  return (
    <div className="rounded-md bg-gray-200 px-5 py-3">
      <div>
        {/* pfp TODO: update to store avatar url in database and fetch instead of doing this */}
        <Avatar
          uid={user?.id ?? null}
          url={avatarUrl}
          size={500}
          onUpload={(url: string) => {
            setAvatarUrl(url);
          }}
        />

        <div>
          {/* name */}
          {/* status */}
          {/* tags */}
        </div>

        {/* Contact Info */}
        {/* Work Info */}
        {/* Personal Info */}
      </div>
    </div>
  );
}
