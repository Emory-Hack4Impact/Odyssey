import { useEffect } from "react";

type BugReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // escape key exit
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bug-report-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-base-100 text-base-content shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-base-300 p-4">
          <h2 id="bug-report-modal-title" className="text-lg font-semibold">
            Report a Bug
          </h2>
          <button
            type="button"
            className="rounded-full p-1 text-base-content/60 hover:bg-base-200"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-base-content/70">
            Describe the issue you found and where it happened.
          </p>
        </div>
      </div>
    </div>
  );
}
