"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, X, Loader2, ArrowLeft, Eye, FileText, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface AdminArticleEditorProps {
  userId: string;
  articleId?: string; // If provided, we're editing an existing article
  initialTitle?: string;
  initialContent?: string;
  initialBlurb?: string;
  initialImageUrls?: string[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminArticleEditor({
  userId,
  articleId,
  initialTitle = "",
  initialContent = "",
  initialBlurb = "",
  initialImageUrls = [],
  onSuccess,
  onCancel,
}: AdminArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [blurb, setBlurb] = useState(initialBlurb);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(initialImageUrls);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch article data if editing
  useEffect(() => {
    if (articleId && !initialTitle && !initialContent) {
      setIsLoading(true);
      fetch(`/api/articles?id=${articleId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.article) {
            setTitle(data.article.title || "");
            setContent(data.article.content || "");
            setBlurb(data.article.blurb || "");
            setUploadedImageUrls(data.article.imageUrls || []);
          }
        })
        .catch((err) => {
          console.error("Error loading article:", err);
          setError("Failed to load article");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [articleId, initialTitle, initialContent]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleImageDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!event.dataTransfer.files?.length) return;
    const files = Array.from(event.dataTransfer.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        console.log("Uploading image:", {
          fileName,
          filePath,
          fileSize: file.size,
          fileType: file.type,
        });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error details:", {
            error: uploadError,
            message: uploadError.message,
          });
          
          // More detailed error message
          let errorMsg = `Failed to upload ${file.name}: ${uploadError.message}`;
          if (uploadError.message?.includes("bucket")) {
            errorMsg += " - Check if the 'files' bucket exists and is configured correctly.";
          } else if (uploadError.message?.includes("permission") || uploadError.message?.includes("policy")) {
            errorMsg += " - Check storage bucket permissions/RLS policies.";
          }
          
          throw new Error(errorMsg);
        }

        console.log("Upload successful:", uploadData);
        console.log("Uploaded file path:", uploadData?.path);

        // Get public URL - use the path returned from upload, not the original filePath
        const uploadedPath = uploadData?.path || filePath;
        const {
          data: { publicUrl },
        } = supabase.storage.from("files").getPublicUrl(uploadedPath);

        console.log("Public URL generated:", publicUrl);
        console.log("Using path:", uploadedPath);
        
        // Verify the URL is correct format
        if (!publicUrl || !publicUrl.includes("storage/v1/object/public")) {
          console.warn("WARNING: Public URL might be incorrect:", publicUrl);
        }
        
        uploadedUrls.push(publicUrl);
      } catch (error: any) {
        console.error("Error in upload loop:", error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload new images first
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        console.log("Starting image upload for", imageFiles.length, "file(s)");
        newImageUrls = await uploadImagesToStorage(imageFiles);
        console.log("Image uploads completed. URLs:", newImageUrls);
      }

      // Combine existing and new image URLs
      const allImageUrls = [...uploadedImageUrls, ...newImageUrls];

      // Submit article
      const response = await fetch("/api/articles", {
        method: articleId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: articleId,
          title: title.trim(),
          content: content.trim(),
          blurb: blurb.trim() || null,
          imageUrls: allImageUrls,
          authorId: userId,
          published: true, // Auto-publish articles when submitted
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save article");
      }

      // Reset form
      setTitle("");
      setContent("");
      setBlurb("");
      setImageFiles([]);
      setUploadedImageUrls([]);
      setError(null);

      if (onSuccess) {
        onSuccess();
      } else {
        // If no onSuccess callback, redirect to HR services page
        router.push("/dashboard/hrservices");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // If no onCancel callback, redirect to HR services page
      router.push("/dashboard/hrservices");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost btn-circle btn btn-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-semibold">
            {articleId ? "Edit Article" : "Create New Article"}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="btn-ghost btn btn-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Title *</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className="input-bordered input w-full"
            required
          />
        </div>

        {/* Blurb/Preview */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Short Description (Preview)</span>
          </label>
          <input
            type="text"
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            placeholder="A brief description that will appear in article listings"
            className="input-bordered input w-full"
          />
        </div>

        {/* Content (Markdown) */}
        <div className="form-control">
          <div className="label">
            <div className="flex items-center gap-2">
              <span className="label-text font-semibold">Content (Markdown) *</span>
              <button
                type="button"
                className="btn btn-circle btn-ghost btn-xs"
                onClick={() => setShowMarkdownHelp(true)}
                aria-label="Markdown help"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`btn btn-sm btn-ghost ${!showPreview ? "btn-active" : ""}`}
              >
                <FileText className="h-4 w-4" />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`btn btn-sm btn-ghost ${showPreview ? "btn-active" : ""}`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
          <div className="grid h-96 grid-cols-1 gap-4 md:grid-cols-2">
            {/* Editor */}
            <div className={`${showPreview ? "hidden md:block" : ""}`}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content in Markdown format..."
                className="textarea-bordered textarea h-full w-full font-mono text-sm"
                required
              />
            </div>
            {/* Preview */}
            <div className={`${!showPreview ? "hidden md:block" : ""} textarea-bordered overflow-y-auto rounded-lg border p-4`}>
              <div className="markdown-content prose prose-sm max-w-none">
                {content.trim() ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-base-content/50 italic">Preview will appear here as you type...</p>
                )}
              </div>
            </div>
          </div>
          <label className="label">
            <span className="label-text-alt">
              {showPreview
                ? "Preview mode - Toggle to 'Editor' to modify the markdown"
                : "You can use Markdown syntax. Preview appears on the right (desktop) or toggle to Preview mode. Images uploaded below will be available to reference."}
            </span>
          </label>
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Images</span>
          </label>
          <label
            htmlFor="article-image-upload"
            className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center transition hover:border-primary hover:bg-base-100/80"
            onDrop={handleImageDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <UploadCloud className="h-10 w-10 text-primary" aria-hidden />
            <div className="text-sm font-medium">Drop images here or click to browse</div>
            <div className="text-xs text-base-content/60">
              Supports multiple images. PNG, JPG, GIF formats.
            </div>
            <input
              id="article-image-upload"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </label>

          {/* New image files preview */}
          {imageFiles.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">New Images to Upload:</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-base-300 bg-base-200">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImageFile(index)}
                      className="btn-ghost btn-circle btn absolute right-1 top-1 h-6 w-6 min-h-0 bg-base-100/80 p-0"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="mt-1 truncate text-xs text-base-content/70">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing uploaded images preview */}
          {uploadedImageUrls.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Existing Images:</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {uploadedImageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-base-300 bg-base-200">
                      <Image
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(index)}
                      className="btn-ghost btn-circle btn absolute right-1 top-1 h-6 w-6 min-h-0 bg-base-100/80 p-0"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              articleId ? "Update Article" : "Publish Article"
            )}
          </button>
        </div>
      </form>

      {/* Markdown Help Modal */}
      {showMarkdownHelp && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="mb-4 text-lg font-bold">Markdown Syntax Guide</h3>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto">
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-base">Headers</strong>
                  <p className="mb-1 text-xs text-base-content/70">Create headings of different sizes</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`# H1 - Largest heading
## H2 - Second level
### H3 - Third level
#### H4 - Fourth level`}
                  </pre>
                </div>
                <div>
                  <strong className="text-base">Bold & Italic</strong>
                  <p className="mb-1 text-xs text-base-content/70">Emphasize your text</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`**bold text** or __bold text__
*italic text* or _italic text_
***bold and italic***`}
                  </pre>
                </div>
                <div>
                  <strong className="text-base">Lists</strong>
                  <p className="mb-1 text-xs text-base-content/70">Create ordered or unordered lists</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2
   1. Nested item`}
                  </pre>
                </div>
                <div>
                  <strong className="text-base">Links</strong>
                  <p className="mb-1 text-xs text-base-content/70">Add clickable links</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`[Link text](https://example.com)
[Link with title](https://example.com "Title")`}
                  </pre>
                </div>
                <div>
                  <strong className="text-base">Blockquote</strong>
                  <p className="mb-1 text-xs text-base-content/70">Quote text</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`> This is a quote
> It can span multiple lines`}
                  </pre>
                </div>
                <div>
                  <strong className="text-base">Horizontal Rule</strong>
                  <p className="mb-1 text-xs text-base-content/70">Add a divider line</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`---`}
                  </pre>
                </div>
                <div>
                  <strong className="text-base">Line Breaks</strong>
                  <p className="mb-1 text-xs text-base-content/70">Start a new line</p>
                  <pre className="mt-1 rounded bg-base-200 p-3 text-xs">
{`End a line with two spaces  
to create a line break

Or add a blank line for a paragraph break`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowMarkdownHelp(false)}
              >
                Got it!
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowMarkdownHelp(false)} />
        </div>
      )}
    </div>
  );
}

