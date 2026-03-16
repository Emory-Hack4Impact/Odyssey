import { useEffect } from "react";
import { type CareerDevArticleUI } from "./CareerDev";

const ArticleDetailsModal = ({
  isOpen,
  onClose,
  article,
  onEdit,
  onDelete,
  isAdmin,
  deleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  article: CareerDevArticleUI | null;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
  deleting: boolean;
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

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
          <h4 className="text-lg font-semibold text-base-content">{article.title}</h4>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  type="button"
                  className="rounded-md border border-base-300 bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content hover:bg-base-200"
                  onClick={onEdit}
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  className="rounded-md border border-error/30 bg-base-100 px-3 py-1.5 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-50"
                  onClick={onDelete}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}

            <button
              className="rounded-md p-1 text-base-content/60 hover:bg-base-200"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="px-4 pb-4 text-base-content/80">
          <p className="mb-2 text-sm text-base-content/60">{article.blurb}</p>

          <div className="mb-4 space-y-1 text-sm">
            <p>
              <span className="font-medium">Author:</span> {article.author}
            </p>
            <p>
              <span className="font-medium">Date:</span> {article.date}
            </p>
            <p>
              <span className="font-medium">Time:</span> {article.startTime} to {article.endTime}
            </p>
            <p>
              <span className="font-medium">Location:</span> {article.location}
            </p>
          </div>

          <p className="leading-relaxed whitespace-pre-line">{article.body ?? "Coming soon..."}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsModal;
