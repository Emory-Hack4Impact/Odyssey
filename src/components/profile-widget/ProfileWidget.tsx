"use client";

import { User } from "@supabase/supabase-js";
import Avatar from "./Avatar";

export default function ProfileWidget({ user }: { user: User }) {
  return (
    <div className="rounded-md bg-gray-200 px-5 py-3">
      <div>
        <Avatar uid={user?.id ?? null} size={500} />

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
