"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,  // TODO: make this optional, if not set then avatar has no input to change
}: {
  uid: string;
  url: string;
  size: number;
  onUpload: ((url: string) => null);
}) {
  let supabase = createClient();
  let [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  let [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  });

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0]!;
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
      <label htmlFor="uploadAvatar">
        {uploading ? "Uploading..." : "Upload"}
      </label>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type="file"
        id="uploadAvatar"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  );
}
