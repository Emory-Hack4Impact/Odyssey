"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { ROOT } from "./mockData";
import type { DocumentNode, FolderNode } from "./types";
import { FileIcon } from "./icons";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

// ----- Data helpers -------------------------------------------------------

type FolderOption = {
  id: string;
  label: string;
};

// for handling frontend UI
type AdminDocument = {
  id: string;
  userId: string;
  name: string;
  url: string;
  pathIds: string[];
  pathLabel: string;
  viewers: string[];
  updatedAt: string;
};

// for handling backend
type UploadedDocumentResult = {
  id: string;
  userId: string;
  bucket: string;
  path: string;
  fileName: string;
  viewers: string[];
  folderPath: string[];
  uploadedAt: string;
  // for accessing db
  metadata: {
    fileName?: string;
    viewers?: string[];
    folderPath?: string[];
  } | null;
};

type DocumentGridProps = {
  documents: AdminDocument[];
  currentUserId: string | null;
  canDeleteFiles: boolean;
  onEdit: (doc: AdminDocument) => void;
  onDelete: (doc: AdminDocument) => void;
  viewMode: "icons" | "list";
  viewerLable: (viewerId: string) => string;
};

type SignedUrlResponse = {
  signedUrl?: string;
};

// for fetching users' fullnames
type LabelUser = {
  id?: string | null;
  displayName?: string | null;
};

type LabelsResponse = {
  users?: LabelUser[];
};

type UserSearchResult = {
  id: string;
  employeeFirstName: string | null;
  employeeLastName: string | null;
};

type UploadPanelProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onClear: () => void;
  onUpload: () => void;
  isUploadEnabled: boolean;
  selectedEmployee: string;
  onEmployeeChange: (value: string) => void;
  folderOptions: FolderOption[];
  selectedFolderId: string | null;
  onFolderChange: (value: string | null) => void;
  recipients: string[];
  onRecipientAdd: (value: string) => void;
  onRecipientRemove: (value: string) => void;
  recipientQuery: string;
  onRecipientQueryChange: (value: string) => void;
  // for fullname auto-population
  userSuggestions: UserSearchResult[];
  showSuggestions: boolean;
  onSuggestionPick: (user: UserSearchResult) => void;
  formatUserId: (id: string) => string;
  onActivateUserSearch: (mode: "sendTo" | "viewers" | "editViewers") => void;
};

type EditDocumentModalProps = {
  document: AdminDocument;
  recipients: string[];
  onRecipientAdd: (value: string) => void;
  onRecipientRemove: (value: string) => void;
  recipientQuery: string;
  onRecipientQueryChange: (value: string) => void;
  replacementFile: File | null;
  onReplacementFileChange: (file: File | null) => void;
  isSaving: boolean;
  saveError: string | null;
  onClose: () => void;
  onSave: () => void;
  userSuggestions: UserSearchResult[];
  showSuggestions: boolean;
  onSuggestionPick: (user: UserSearchResult) => void;
  onActivateUserSearch: (mode: "sendTo" | "viewers" | "editViewers") => void;
  formatUserId: (id: string) => string;
};

// Build a select-friendly list of every folder in the tree.
function flattenFolders(
  node: DocumentNode,
  pathIds: string[] = [],
  pathLabels: string[] = [],
): FolderOption[] {
  if (node.type !== "folder") return [];

  const isRoot = node.id === "root";
  const nextIds = isRoot ? [] : [...pathIds, node.id];
  const nextLabels = isRoot ? [] : [...pathLabels, node.name];
  const label = isRoot ? node.name : [...pathLabels, node.name].join(" / ");

  const childFolders = node.children
    .filter((child): child is FolderNode => child.type === "folder")
    .flatMap((child) => flattenFolders(child, nextIds, nextLabels));

  return [
    {
      id: nextIds.length ? nextIds.join("/") : "root",
      label,
    },
    ...childFolders,
  ];
}

function formatPath(doc: AdminDocument) {
  return doc.pathLabel || "Shared Root";
}

// Handles all upload inputs on the left column.
function UploadPanel({
  files,
  onFilesChange,
  onClear,
  onUpload,
  isUploadEnabled,
  selectedEmployee,
  onEmployeeChange,
  folderOptions,
  selectedFolderId,
  onFolderChange,
  recipients,
  onRecipientRemove,
  recipientQuery,
  onRecipientQueryChange,
  userSuggestions,
  showSuggestions,
  onSuggestionPick,
  formatUserId,
  onActivateUserSearch,
}: UploadPanelProps) {
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    onFilesChange(Array.from(event.target.files));
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!event.dataTransfer.files?.length) return;
    onFilesChange(Array.from(event.dataTransfer.files));
  };

  return (
    <section className="card bg-base-200 shadow-lg">
      <div className="card-body gap-6">
        <div>
          <h3 className="text-lg font-semibold">Upload documents</h3>
          <p className="text-sm text-base-content/70">
            Select the employee first, then drop files and choose the right folder.
          </p>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Send to</span>
          </label>
          <div className="dropdown dropdown-bottom w-full">
            <input
              type="text"
              placeholder="Type the employee name or email" // email not included in userMetadata yet
              className="input-bordered input input-sm w-full"
              value={selectedEmployee}
              onChange={(event) => onEmployeeChange(event.target.value)}
              onFocus={() => onActivateUserSearch("sendTo")}
              autoComplete="off"
            />

            {showSuggestions &&
              userSuggestions.length > 0 &&
              selectedEmployee.trim().length > 0 && (
                <ul className="dropdown-content menu z-[9999] mt-2 w-full rounded-box bg-base-100 p-2 shadow">
                  {userSuggestions.map((u) => {
                    const displayName =
                      `${u.employeeFirstName ?? ""} ${u.employeeLastName ?? ""}`.trim() ||
                      "Unknown user";
                    const short = `…${u.id.slice(-4)}`;

                    return (
                      <li key={u.id}>
                        <button type="button" onClick={() => onSuggestionPick(u)}>
                          {displayName} · ({short})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
          </div>

          <span className="label-text-alt mt-1 text-base-content/60">
            Folder choices appear after an employee is selected.
          </span>
        </div>

        <label
          htmlFor="admin-doc-upload"
          className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center transition hover:border-primary hover:bg-base-100/80"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <UploadCloud className="h-10 w-10 text-primary" aria-hidden />
          <div className="text-sm font-medium">Drop files here or click to browse</div>
          <div className="text-xs text-base-content/60">Supports multiple documents at once.</div>
          <input
            id="admin-doc-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </label>

        {!!files.length && (
          <div className="rounded-lg border border-base-300 bg-base-100 p-3">
            <h4 className="mb-2 text-sm font-semibold">Selected files</h4>
            <ul className="space-y-2 text-sm">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-base-100 px-3 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-base-content/60">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => onFilesChange(files.filter((_, position) => position !== index))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Destination folder</span>
          </label>
          <select
            className="select-bordered select select-sm"
            value={selectedFolderId ?? ""}
            onChange={(event) => onFolderChange(event.target.value || null)}
            disabled={!selectedEmployee || !folderOptions.length}
          >
            {!selectedEmployee ? (
              <option value="">Select an employee to see folders</option>
            ) : (
              folderOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))
            )}
          </select>
          <span className="label-text-alt mt-1 text-base-content/60">
            This will map to the selected employee&apos;s folder tree once the backend is connected.
          </span>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Additional viewers (optional)</span>
          </label>

          <div className="dropdown dropdown-bottom w-full">
            <input
              type="text"
              placeholder="Type the employee name"
              className="input-bordered input input-sm w-full"
              value={recipientQuery}
              onChange={(event) => onRecipientQueryChange(event.target.value)}
              onFocus={() => onActivateUserSearch("viewers")}
              autoComplete="off"
            />

            {showSuggestions && userSuggestions.length > 0 && recipientQuery.trim().length > 0 && (
              <ul className="dropdown-content menu z-[9999] mt-2 w-full rounded-box bg-base-100 p-2 shadow">
                {userSuggestions.map((u) => {
                  const displayName =
                    `${u.employeeFirstName ?? ""} ${u.employeeLastName ?? ""}`.trim() ||
                    "Unknown user";
                  const short = `…${u.id.slice(-4)}`;

                  return (
                    <li key={u.id}>
                      <button type="button" onClick={() => onSuggestionPick(u)}>
                        {displayName} · ({short})
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {!!recipients.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {recipients.map((recipient) => (
                <span key={recipient} className="badge gap-2 badge-primary">
                  {formatUserId(recipient)}
                  <button
                    type="button"
                    className="btn px-1 btn-ghost btn-xs"
                    onClick={() => onRecipientRemove(recipient)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <span className="label-text-alt mt-1 text-base-content/60">
            Start typing to search employees. Selecting one stores their UUID (not the name).
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn flex-1 btn-sm btn-primary"
            disabled={!isUploadEnabled}
            onClick={onUpload}
          >
            Upload documents
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}

function DocumentGrid({
  documents,
  currentUserId,
  canDeleteFiles,
  onEdit,
  onDelete,
  viewMode,
  viewerLable,
}: DocumentGridProps) {
  //
  const handleClickViewDocument = async (doc: AdminDocument) => {
    if (doc.url.startsWith("blob:")) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const res = await fetch(`/api/documents?fileId=${encodeURIComponent(doc.id)}&mode=view`);
      if (!res.ok) {
        console.error("Failed to fetch signed URL", await res.text());
        return;
      }
      const { signedUrl }: SignedUrlResponse = await res.json();
      if (!signedUrl) {
        console.error("Signed URL missing in response");
        return;
      }
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening document", error);
    }
  };

  if (!documents.length) {
    return (
      <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-sm text-base-content/70">
        Upload documents to see them listed here.
      </div>
    );
  }

  if (viewMode === "icons") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            // check file card updates after edit panel added viewers
            className="group flex flex-col gap-3 rounded-xl border border-base-200 bg-base-100 p-4 text-sm shadow-sm transition hover:border-primary/60 hover:shadow-md"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
              <FileIcon className="h-6 w-6" />
            </span>
            <div className="min-h-[3.5rem]">
              <div className="font-medium">{doc.name}</div>
              <div className="text-xs text-base-content/60">{formatPath(doc)}</div>
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              {doc.viewers.slice(0, 3).map((viewer, i) => (
                <span key={i} className="badge badge-outline badge-sm">
                  {viewerLable(viewer)}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => handleClickViewDocument(doc)}
              >
                View
              </button>
              {currentUserId === doc.userId && (
                <button
                  type="button"
                  className="btn btn-xs btn-primary"
                  onClick={() => onEdit(doc)}
                >
                  Edit
                </button>
              )}
              {canDeleteFiles && (
                <button
                  type="button"
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(doc)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr className="text-xs text-base-content/60 uppercase">
            <th>Name</th>
            <th>Location</th>
            <th>Shared with</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="text-sm">
              <td className="font-medium">{doc.name}</td>
              <td>{formatPath(doc)}</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {doc.viewers.map((viewer) => (
                    <span
                      key={viewer}
                      className={`badge badge-sm ${
                        viewer.toLowerCase() === "everyone" ? "badge-outline" : "badge-secondary"
                      }`}
                    >
                      {viewerLable(viewer)}
                    </span>
                  ))}
                </div>
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleClickViewDocument(doc)}
                  >
                    View
                  </button>
                  {currentUserId === doc.userId && (
                    <button
                      type="button"
                      className="btn btn-xs btn-primary"
                      onClick={() => onEdit(doc)}
                    >
                      Edit
                    </button>
                  )}
                  {canDeleteFiles && (
                    <button
                      type="button"
                      className="btn btn-xs btn-error"
                      onClick={() => onDelete(doc)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Lightweight edit modal
function EditDocumentModal({
  document,
  recipients,
  onRecipientAdd,
  onRecipientRemove,
  recipientQuery,
  onRecipientQueryChange,
  replacementFile,
  onReplacementFileChange,
  onClose,
  onSave,
  saveError,
  isSaving,
  userSuggestions,
  showSuggestions,
  onSuggestionPick,
  onActivateUserSearch,
  formatUserId,
}: EditDocumentModalProps) {
  const handleRecipientSubmit = () => {
    const trimmed = recipientQuery.trim();
    if (!trimmed) return;
    onRecipientAdd(trimmed);
    onRecipientQueryChange("");
  };

  return (
    <div className="modal-open modal">
      <div className="modal-box max-w-2xl space-y-4">
        <h3 className="text-lg font-semibold">Edit “{document.name}”</h3>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Re-upload file</span>
            </label>
            <input
              type="file"
              className="file-input-bordered file-input w-full file-input-sm"
              onChange={(event) => onReplacementFileChange(event.target.files?.[0] ?? null)}
            />
            {replacementFile && (
              <span className="label-text-alt mt-1 text-base-content/60">
                Selected: {replacementFile.name} ({(replacementFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Shared with</span>
            </label>
            <div className="dropdown dropdown-bottom w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="input-bordered input input-sm flex-1"
                  placeholder="Add new viewers"
                  value={recipientQuery}
                  onChange={(event) => onRecipientQueryChange(event.target.value)}
                  onFocus={() => onActivateUserSearch("editViewers")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleRecipientSubmit();
                    }
                  }}
                  autoComplete="off"
                />
                {/* TODO: determine whether this send button is to be removed, given auto-population is active*/}
                <button
                  type="button"
                  className="btn btn-circle btn-sm"
                  onClick={handleRecipientSubmit}
                >
                  ➤
                </button>
              </div>

              {showSuggestions &&
                userSuggestions.length > 0 &&
                recipientQuery.trim().length > 0 && (
                  <ul className="dropdown-content menu z-[9999] mt-2 w-full rounded-box bg-base-100 p-2 shadow">
                    {userSuggestions.map((u) => {
                      const displayName =
                        `${u.employeeFirstName ?? ""} ${u.employeeLastName ?? ""}`.trim() ||
                        "Unknown user";
                      const short = `…${u.id.slice(-4)}`;

                      return (
                        <li key={u.id}>
                          <button type="button" onClick={() => onSuggestionPick(u)}>
                            {displayName} · ({short})
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
            </div>
            {!!recipients.length && (
              <div className="mt-2 flex flex-wrap gap-2">
                {recipients.map((name) => (
                  <span key={name} className="badge gap-2 badge-primary">
                    {formatUserId(name)}
                    <button
                      type="button"
                      className="btn px-1 btn-ghost btn-xs"
                      onClick={() => onRecipientRemove(name)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {saveError ? <p className="text-sm text-error">{saveError}</p> : null}

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Top-level admin surface combining upload, listing, and edit modal.
export default function AdminDocuments() {
  const idToNameCache = useRef<Map<string, string>>(new Map());
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [viewMode, setViewMode] = useState<"icons" | "list">("icons");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [folderOptions, setFolderOptions] = useState<FolderOption[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [uploadRecipients, setUploadRecipients] = useState<string[]>([]);
  const [uploadRecipientQuery, setUploadRecipientQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [canDeleteFiles, setCanDeleteFiles] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState<UserSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeUserSearch, setActiveUserSearch] = useState<
    "sendTo" | "viewers" | "editViewers" | null
  >(null);

  const [editingDoc, setEditingDoc] = useState<AdminDocument | null>(null);
  const [editRecipients, setEditRecipients] = useState<string[]>([]);
  const [editRecipientQuery, setEditRecipientQuery] = useState("");
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // helper for UUID-fullname mapping
  const shortId = (id: string) => `…${id.slice(-4)}`;
  // UUID -> fullname with shortId hint
  const viewerLabel = (viewerId: string) => {
    if (viewerId === "Everyone") return "Everyone";
    const name = idToNameCache.current.get(viewerId) ?? "Unknown user";
    return `${name} · (${shortId(viewerId)})`;
  };

  // helper for rerendering UUID -> fullname label
  const hydrateViewerLabels = async (viewerIds: string[]) => {
    const missingIds = Array.from(
      new Set(viewerIds.filter((id) => id && id !== "Everyone")),
    ).filter((id) => !idToNameCache.current.has(id));

    if (missingIds.length === 0) return;

    const res = await fetch("/api/documents?mode=labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: missingIds }),
    });

    if (!res.ok) {
      console.error("Failed to fetch user labels:", await res.text());
      return;
    }

    const data: LabelsResponse = await res.json();
    for (const u of data.users ?? []) {
      if (u?.id && typeof u.displayName === "string") {
        idToNameCache.current.set(u.id, u.displayName);
      }
    }
  };

  // this is the only admin in db now
  // const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to fetch current user", error);
        return;
      }
      setCurrentUserId(data.user?.id ?? null);
    };

    loadUser().catch((error) => {
      console.error("Unexpected error while fetching current user", error);
    });
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await fetch("/api/documents?mode=permissions");
      if (!res.ok) {
        setCanDeleteFiles(false);
        return;
      }

      const data = (await res.json()) as { canDeleteFiles?: boolean };
      setCanDeleteFiles(Boolean(data.canDeleteFiles));
    };

    void fetchPermissions();
  }, []);

  // hook to fetching documents for the file cards
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!currentUserId) return;
      const res = await fetch(`/api/documents?userId=${currentUserId}`);
      if (!res.ok) {
        console.error("Failed to fetch documents", await res.text());
        return;
      }
      const results: UploadedDocumentResult[] = await res.json();

      const docs: AdminDocument[] = results.map((doc) => {
        const meta = doc.metadata ?? {};
        const folderPath = Array.isArray(meta.folderPath) ? meta.folderPath : [];
        const viewers = Array.isArray(meta.viewers) ? meta.viewers : ["Everyone"];
        const name =
          typeof meta.fileName === "string"
            ? meta.fileName
            : (doc.path.split("/").pop() ?? "Document");

        return {
          //
          id: doc.id,
          userId: doc.userId,
          name,
          // "url" uses signed URLs from server
          // not used for card display, just keep it here for future features.
          url: `/api/documents?fileId=${encodeURIComponent(doc.id)}`,
          pathIds: folderPath,
          pathLabel: folderPath.length ? folderPath.join(" / ") : "Shared Root",
          viewers: viewers,
          updatedAt: doc.uploadedAt, // updatedAt is currenrly unused as well
        };
      });

      // collect unique viewer UUIDs across all docs
      const uniqueIds = new Set<string>();
      for (const d of docs) {
        for (const v of d.viewers ?? []) {
          if (v && v !== "Everyone") uniqueIds.add(v);
        }
      }

      await hydrateViewerLabels(Array.from(uniqueIds));

      setDocuments(docs);
    };
    // call (and catch error if throws)
    fetchDocuments().catch((error) => {
      console.error("Unexpected error while fetching documents", error);
    });
  }, [currentUserId]);
  // end of fetch doc hook

  // for auto populate recipients entry
  useEffect(() => {
    const raw =
      activeUserSearch === "sendTo"
        ? selectedEmployee
        : activeUserSearch === "viewers"
          ? uploadRecipientQuery
          : activeUserSearch === "editViewers"
            ? editRecipientQuery
            : "";
    const q = raw.trim();
    // If empty, hide dropdown and clear suggestions
    if (q.length === 0) {
      setUserSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // fetch + set state
    const fetchSuggestions = async () => {
      try {
        const url = `/api/documents?mode=userSearch&nameKeyword=${encodeURIComponent(q)}`;
        const res = await fetch(url);

        if (!res.ok) {
          console.error("userSearch failed:", await res.text());
          setUserSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        const data: { users: UserSearchResult[] } = await res.json();
        setUserSuggestions(data.users ?? []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("userSearch error:", err);
        setUserSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Debounce: wait a bit after typing stops
    const timer = setTimeout(() => {
      void fetchSuggestions();
    }, 200);
    return () => clearTimeout(timer);
  }, [activeUserSearch, selectedEmployee, uploadRecipientQuery, editRecipientQuery]);

  // When an employee is chosen, generate folder shortcuts from mock data.
  useEffect(() => {
    if (!selectedEmployee.trim()) {
      setFolderOptions([]);
      setSelectedFolderId(null);
      return;
    }
    const options = flattenFolders(ROOT);
    setFolderOptions(options);
    setSelectedFolderId(options[0]?.id ?? null);
  }, [selectedEmployee]);

  const resetUploadForm = () => {
    setUploadFiles([]);
    setUploadRecipients([]);
    setUploadRecipientQuery("");
  };

  // handling file upload
  const handleUpload = async () => {
    if (!uploadFiles.length || !selectedEmployee.trim() || !selectedFolderId) return;

    const targetOption =
      folderOptions.find((option) => option.id === selectedFolderId) ?? folderOptions[0];

    // Folder path for server side metadata.folderPath (in json) to use
    const folderPath = targetOption?.label != null ? targetOption.label.split("/") : [];

    // if chose upload recipients, use them; otherwise by default select selectedEmployee
    const viewers = uploadRecipients.length ? uploadRecipients : [selectedEmployee];

    // use local URLs so the admin can preview files immediately,
    // but also call the server action to store everything in Supabase + Prisma.
    const uploadedDocs: AdminDocument[] = [];

    for (const file of uploadFiles) {
      const formData = new FormData();
      // build file itself + metadata to send to backend
      formData.append("file", file);
      formData.append("viewers", JSON.stringify(viewers));
      formData.append("folderPath", JSON.stringify(folderPath));
      formData.append("contentType", file.type);

      // call API route
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error("Failed to upload document", await res.text());
        continue;
      }

      // parse backend result + map into AdminDocument
      const result: UploadedDocumentResult = await res.json();

      if (!currentUserId) {
        throw new Error("No currentUserId found while uploading");
      }

      uploadedDocs.push({
        id: result.id,
        userId: currentUserId,
        name: result.fileName,
        // use a local blob URL so the admin can preview immediately
        url: URL.createObjectURL(file),
        pathIds: targetOption?.id === "root" ? [] : (targetOption?.id.split("/") ?? []),
        pathLabel: targetOption?.label ?? "Shared Root",
        viewers: result.viewers,
        updatedAt: result.uploadedAt,
      });
    }

    setDocuments((prev) => [...uploadedDocs, ...prev]);
    resetUploadForm();
  };

  const openEditModal = (doc: AdminDocument) => {
    setEditingDoc(doc);
    setEditRecipients(doc.viewers);
    setReplacementFile(null);
    setEditRecipientQuery("");
    setSaveError(null);
  };

  const closeEditModal = () => {
    setEditingDoc(null);
    setReplacementFile(null);
    setEditRecipientQuery("");
    setSaveError(null);
  };

  const saveDocumentChanges = async () => {
    if (!editingDoc) return;

    try {
      // call PATCH
      setIsSaving(true);
      setSaveError(null);
      const res = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: editingDoc.id,
          viewers: editRecipients,
        }),
      });

      // parse payload from server
      const data = (await res.json()) as {
        fileId?: string;
        viewers?: string[];
        updatedAt?: string;
        error?: string;
      };

      if (!res.ok) {
        console.error("Failed to save viewer changes", data.error ?? data);
        setSaveError(data.error ?? "Failed to save viewer changes");
        return;
      }

      if (!data.fileId || !Array.isArray(data.viewers)) {
        console.error("Invalid PATCH response payload", data);
        setSaveError("Server returned an invalid response");
        return;
      }

      await hydrateViewerLabels(data.viewers);

      // update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === data.fileId
            ? {
                ...doc,
                viewers: data.viewers!,
                updatedAt: data.updatedAt ?? new Date().toISOString(),
              }
            : doc,
        ),
      );

      // close only after success
      closeEditModal();
    } catch (err) {
      console.error("Unexpected error while saving viewer changes", err);
      setSaveError("Unexpected error while saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDocument = async (doc: AdminDocument) => {
    const confirmed = window.confirm(`Delete "${doc.name}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch("/api/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: doc.id }),
      });

      if (!res.ok) {
        console.error("Failed to delete document", await res.text());
        return;
      }

      setDocuments((prev) => prev.filter((item) => item.id !== doc.id));
      if (editingDoc?.id === doc.id) {
        closeEditModal();
      }
    } catch (err) {
      console.error("Unexpected error while deleting document", err);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <UploadPanel
        files={uploadFiles}
        onFilesChange={setUploadFiles}
        onClear={resetUploadForm}
        onUpload={handleUpload}
        isUploadEnabled={Boolean(selectedEmployee && selectedFolderId && uploadFiles.length)}
        selectedEmployee={selectedEmployee}
        onEmployeeChange={setSelectedEmployee}
        folderOptions={folderOptions}
        selectedFolderId={selectedFolderId}
        onFolderChange={(value) => setSelectedFolderId(value)}
        recipients={uploadRecipients}
        onRecipientAdd={(value) =>
          setUploadRecipients((prev) => (prev.includes(value) ? prev : [...prev, value]))
        }
        onRecipientRemove={(value) =>
          setUploadRecipients((prev) => prev.filter((recipient) => recipient !== value))
        }
        recipientQuery={uploadRecipientQuery}
        onRecipientQueryChange={setUploadRecipientQuery}
        // for user fullname auto-population
        userSuggestions={userSuggestions}
        showSuggestions={showSuggestions}
        onSuggestionPick={(u) => {
          const displayName =
            `${u.employeeFirstName ?? ""} ${u.employeeLastName ?? ""}`.trim() || "Unknown user";

          // cache for labels
          idToNameCache.current.set(u.id, displayName);

          if (activeUserSearch === "sendTo") {
            // store UUID as the selected employee
            setSelectedEmployee(u.id);
            setShowSuggestions(false);
            return;
          }

          if (activeUserSearch === "editViewers") {
            setEditRecipients((prev) => (prev.includes(u.id) ? prev : [...prev, u.id]));
            setEditRecipientQuery("");
            setShowSuggestions(false);
            return;
          }

          // default: viewers
          setUploadRecipients((prev) => (prev.includes(u.id) ? prev : [...prev, u.id]));
          setUploadRecipientQuery("");
          setShowSuggestions(false);
        }}
        formatUserId={viewerLabel}
        onActivateUserSearch={setActiveUserSearch}
      />

      <section className="card bg-base-200 shadow-lg">
        <div className="card-body gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Existing documents</h3>
              <p className="text-sm text-base-content/70">Review the files available to admins.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70">View</span>
              <select
                className="select-bordered select select-sm"
                value={viewMode}
                onChange={(event) => setViewMode(event.target.value as typeof viewMode)}
              >
                <option value="icons">As icons</option>
                <option value="list">As list</option>
              </select>
            </div>
          </div>
          <DocumentGrid
            documents={documents}
            currentUserId={currentUserId}
            canDeleteFiles={canDeleteFiles}
            onEdit={openEditModal}
            onDelete={deleteDocument}
            viewMode={viewMode}
            viewerLable={viewerLabel}
          />
        </div>
      </section>

      {editingDoc ? (
        <EditDocumentModal
          document={editingDoc}
          recipients={editRecipients}
          onRecipientAdd={(value) =>
            setEditRecipients((prev) => (prev.includes(value) ? prev : [...prev, value]))
          }
          onRecipientRemove={(value) =>
            setEditRecipients((prev) => prev.filter((recipient) => recipient !== value))
          }
          recipientQuery={editRecipientQuery}
          onRecipientQueryChange={setEditRecipientQuery}
          replacementFile={replacementFile}
          onReplacementFileChange={setReplacementFile}
          isSaving={isSaving}
          saveError={saveError}
          onClose={closeEditModal}
          onSave={saveDocumentChanges}
          userSuggestions={userSuggestions}
          showSuggestions={showSuggestions}
          onActivateUserSearch={setActiveUserSearch}
          formatUserId={viewerLabel}
          onSuggestionPick={(u) => {
            const displayName =
              `${u.employeeFirstName ?? ""} ${u.employeeLastName ?? ""}`.trim() || "Unknown user";

            idToNameCache.current.set(u.id, displayName);
            setEditRecipients((prev) => (prev.includes(u.id) ? prev : [...prev, u.id]));
            setEditRecipientQuery("");
            setShowSuggestions(false);
          }}
        />
      ) : null}
    </div>
  );
}
