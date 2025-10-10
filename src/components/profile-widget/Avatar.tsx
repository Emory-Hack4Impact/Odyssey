"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Avatar({ uid, size }: { uid: string; size: number }) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function updateAvatar(path: string) {
    const { data: imageData, error: downloadError } = await supabase.storage
      .from("avatars")
      .download(path);

    if (downloadError) return;

    const url = URL.createObjectURL(imageData);
    setAvatarUrl(url);
  }

  useEffect(() => {
    async function fetchAvatar() {
      const { data, error } = await supabase
        .from("Files")
        .select("path")
        .eq("userId", uid)
        .eq("type", "AVATAR")
        .order("uploadedAt", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error ?? !data) return;

      await updateAvatar(data.path as string);
    }

    fetchAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0]!;
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}/${Date.now()}.${fileExt}`;

      // upload to bucket
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      // insert metadata into db
      const { error: insertError } = await supabase.from("Files").insert({
        userId: uid,
        bucket: "avatars",
        path: filePath,
        type: "AVATAR",
        metadata: {
          originalName: file.name,
          size: file.size,
        },
      });
      if (insertError) throw insertError;

      await updateAvatar(filePath);
    } catch (error) {
      console.log(error);
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <Image width={size} height={size} src={avatarUrl} alt="Avatar" />
      ) : (
        <div
          style={{
            height: size,
            width: size,
            backgroundColor: "#ccc",
          }}
        />
      )}
      <label htmlFor="uploadAvatar">{uploading ? "Uploading..." : "Upload Avatar"}</label>
      <input
        id="uploadAvatar"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        style={{ visibility: "hidden", position: "absolute" }}
      />
    </div>
  );
}
