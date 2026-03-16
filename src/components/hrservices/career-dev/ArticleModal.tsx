import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type CareerDevArticleUI } from "./CareerDev";

async function uploadArticleImage(articleId: string, image: File): Promise<string | null> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please log in to upload images.");
  }

  // Generate unique path for the image
  const ext = image.name.split(".").pop()?.toLowerCase() ?? "png";
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  const path = `admin/assets/${articleId}/${timestamp}-${randomId}.${ext}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("article")
    .upload(path, image, { contentType: image.type, upsert: false });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  // Generate a signed URL (valid for 1 hour, adjust as needed)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("article")
    .createSignedUrl(path, 60); // 60 = 1 minute

  if (signedUrlError || !signedUrlData?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${signedUrlError?.message}`);
  }

  // Update article with signed URL
  const imageUpdateRes = await fetch("/api/career-dev-articles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: articleId, imageUrl: signedUrlData.signedUrl }),
  });

  if (!imageUpdateRes.ok) {
    throw new Error("Failed to save image URL to article.");
  }

  return signedUrlData.signedUrl;
}

const EMPTY_FORM = {
  title: "",
  author: "",
  blurb: "",
  body: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
};

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: CareerDevArticleUI | null;
  onSubmitted: () => Promise<void>;
  isEdit?: boolean;
}

const ArticleModal = ({
  isOpen,
  onClose,
  article,
  onSubmitted,
  isEdit = false,
}: ArticleModalProps) => {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (article) {
        setFormData({
          title: article.title,
          author: article.author,
          blurb: article.blurb,
          body: article.body ?? "",
          date: article.date,
          startTime: article.startTime,
          endTime: article.endTime,
          location: article.location,
        });
      } else {
        setFormData({ ...EMPTY_FORM });
      }
      setImage(null);
      setError(null);
    }
  }, [isOpen, article]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...(isEdit && article ? { id: article.id } : {}),
        title: formData.title,
        author: formData.author,
        blurb: formData.blurb,
        body: formData.body,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        ...(isEdit ? {} : { imageUrl: null }),
      };

      const res = await fetch("/api/career-dev-articles", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to ${isEdit ? "update" : "create"} article.`);
      }

      const created = (await res.json()) as { id: string };
      const articleId = isEdit ? article?.id : created.id;

      if (image && articleId) {
        await uploadArticleImage(articleId, image);
      }

      await onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-base-100 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-base-300 p-4">
          <h4 className="text-lg font-semibold text-base-content">
            {isEdit ? "Edit Article" : "Create New Article"}
          </h4>
          <button
            className="rounded-md p-1 text-base-content/60 hover:bg-base-200"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-base-content">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-base-content">
                Author *
              </label>
              <input
                type="text"
                id="author"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="blurb" className="block text-sm font-medium text-base-content">
                Short Description *
              </label>
              <textarea
                id="blurb"
                required
                rows={2}
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.blurb}
                onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-base-content">
                Article Content *
              </label>
              <textarea
                id="body"
                required
                rows={8}
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-base-content">
                Date *
              </label>
              <input
                type="date"
                id="date"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-base-content">
                  Start time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  required
                  className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-base-content">
                  End time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  required
                  className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-base-content">
                Location *
              </label>
              <input
                type="text"
                id="location"
                required
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-base-content">
                {isEdit ? "Replace" : "Article"} Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="mt-1 w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium text-base-content hover:bg-base-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
