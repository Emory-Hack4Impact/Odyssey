"use client";

import { useEffect, useState } from "react";

type BugReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EMPTY_FORM = {
  title: "",
  description: "",
};

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false); // prevent double clicking
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // handle description section text input
  useEffect(() => {
    if (!isOpen) return;

    setFormData({ ...EMPTY_FORM });
    setIsSubmitting(false);
    setError(null);
    setSuccessMessage(null);
  }, [isOpen]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bug-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          pagePath: window.location.pathname,
          metadata: {
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
          },
        }),
      });

      // handle error message
      const contentType = response.headers.get("content-type");
      let errorMessage = `Request failed with status ${response.status}.`;

      if (contentType?.includes("application/json")) {
        const data = (await response.json()) as { error?: string };
        errorMessage = data.error ?? errorMessage;
      } else {
        const text = await response.text();

        if (response.status === 404) {
          errorMessage = "API route not found. Check the fetch URL.";
        } else if (response.status === 401) {
          errorMessage = "You are not signed in.";
        } else if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          errorMessage = "Server returned an HTML page instead of JSON. Check the API route.";
        }
      }

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      setSuccessMessage("Bug report submitted successfully.");
      setFormData({ ...EMPTY_FORM });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <p className="text-sm text-base-content/70">
            Describe the issue you found and where it happened.
          </p>
          {/* success/error message */}
          {successMessage ? (
            <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
              {successMessage}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
              {error}
            </div>
          ) : null}
          {/* for title */}
          <div className="form-control">
            <label htmlFor="bug-report-title" className="label">
              <span className="label-text font-semibold">Title</span>
            </label>
            <input
              id="bug-report-title"
              type="text"
              className="input-bordered input w-full"
              placeholder="Short summary of the bug"
              value={formData.title}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              required
            />
          </div>
          {/* for description */}
          <div className="form-control">
            <label htmlFor="bug-report-description" className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              id="bug-report-description"
              className="textarea-bordered textarea min-h-32 w-full"
              placeholder="What happened? What did you expect to happen?"
              value={formData.description}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              required
            />
          </div>
          {/* cancel, submit button*/}
          <div className="modal-action mt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
