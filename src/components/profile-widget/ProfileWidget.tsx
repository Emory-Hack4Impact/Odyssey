"use client";

import Image from "next/image";
import { User } from "@supabase/supabase-js";
import Avatar from "./Avatar";

export default function ProfileWidget({ user }: { user: User }) {
    return (
        <div className="rounded-md bg-gray-200 px-5 py-3">
            <div>
                {/* pfp */}
                <Avatar
                    uid={user?.id ?? null}
                    url={""}
                    size={500}
                    onUpload={(url: string) => { return null }}
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
