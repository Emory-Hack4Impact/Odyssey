"use client";

import { useEffect, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { ROOT } from "./mockData";
import type { DocumentNode, FolderNode } from "./types";
import { FileIcon } from "./icons";

// ----- Data helpers -------------------------------------------------------

type FolderOption = {
  id: string;
  label: string;
};

type AdminDocument = {
  id: string;
  name: string;
  url: string;
  pathIds: string[];
  pathLabel: string;
  viewers: string[];
  updatedAt: string;
};

type LocatedFile = {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
  parents: string[];
  folderNames: string[];
};

type DocumentGridProps = {
  documents: AdminDocument[];
  onEdit: (doc: AdminDocument) => void;
  viewMode: "icons" | "list";
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
  onClose: () => void;
  onSave: () => void;
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

// Flatten files while remembering the folder breadcrumb they live under.
function collectFiles(
  node: DocumentNode,
  pathIds: string[] = [],
  pathLabels: string[] = [],
): LocatedFile[] {
  if (node.type === "file") {
    return [
      {
        id: node.id,
        name: node.name,
        url: node.url,
        mimeType: node.mimeType,
        parents: pathIds,
        folderNames: pathLabels,
      },
    ];
  }

  const isRoot = node.id === "root";
  const nextIds = isRoot ? [] : [...pathIds, node.id];
  const nextLabels = isRoot ? [] : [...pathLabels, node.name];

  return node.children.flatMap((child) => collectFiles(child, nextIds, nextLabels));
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
  onRecipientAdd,
  onRecipientRemove,
  recipientQuery,
  onRecipientQueryChange,
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

  const handleRecipientSubmit = () => {
    const trimmed = recipientQuery.trim();
    if (!trimmed) return;
    onRecipientAdd(trimmed);
    onRecipientQueryChange("");
  };

  return (
    <section className="card bg-base-100 shadow">
      <div className="card-body gap-6">
        <div>
          <h3 className="text-lg font-semibold">Upload documents</h3>
          <p className="text-sm text-base-content/70">
            Select the employee first, then drop files and choose the right folder.
          </p>
          {/* TODO: Replace mock upload functions with real storage + metadata calls */}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Send to</span>
          </label>
          <input
            type="text"
            placeholder="Type the employee name or email"
            className="input-bordered input input-sm"
            value={selectedEmployee}
            onChange={(event) => onEmployeeChange(event.target.value)}
          />
          <span className="label-text-alt mt-1 text-base-content/60">
            Folder choices appear after an employee is selected.
          </span>
        </div>

        <label
          htmlFor="admin-doc-upload"
          className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-8 text-center transition hover:border-primary hover:bg-base-200"
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
          <div className="rounded-lg border border-base-200 bg-base-200/40 p-3">
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
          {/* TODO: Populate folderOptions from the selected employee's tree */}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Additional viewers (optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="input-bordered input input-sm flex-1"
              placeholder="Add teammate name or email"
              value={recipientQuery}
              onChange={(event) => onRecipientQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleRecipientSubmit();
                }
              }}
            />
            <button type="button" className="btn btn-circle btn-sm" onClick={handleRecipientSubmit}>
              ➤
            </button>
          </div>
          {!!recipients.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {recipients.map((recipient) => (
                <span key={recipient} className="badge gap-2 badge-primary">
                  {recipient}
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

function DocumentGrid({ documents, onEdit, viewMode }: DocumentGridProps) {
  if (!documents.length) {
    return (
      <div className="rounded-xl border border-dashed border-base-300 bg-base-200/40 p-10 text-center text-sm text-base-content/70">
        Upload documents to see them listed here. Admins will eventually see results from the
        backend in this space.
      </div>
    );
  }

  if (viewMode === "icons") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
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
              {doc.viewers.slice(0, 3).map((viewer) => (
                <span key={viewer} className="badge badge-outline badge-sm">
                  {viewer}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
              >
                View
              </button>
              <button type="button" className="btn btn-xs btn-primary" onClick={() => onEdit(doc)}>
                Edit
              </button>
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
                      {viewer}
                    </span>
                  ))}
                </div>
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs btn-primary"
                    onClick={() => onEdit(doc)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Lightweight edit modal with fake replacement upload support.
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="input-bordered input input-sm flex-1"
                placeholder="Add teammate name or email"
                value={recipientQuery}
                onChange={(event) => onRecipientQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleRecipientSubmit();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-circle btn-sm"
                onClick={handleRecipientSubmit}
              >
                ➤
              </button>
            </div>
            {!!recipients.length && (
              <div className="mt-2 flex flex-wrap gap-2">
                {recipients.map((name) => (
                  <span key={name} className="badge gap-2 badge-primary">
                    {name}
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

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Top-level admin surface combining upload, listing, and edit modal.
export default function AdminDocuments() {
  const initialDocuments = useMemo<AdminDocument[]>(() => {
    const files = collectFiles(ROOT);
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      pathIds: [...file.parents],
      pathLabel: file.folderNames.length ? file.folderNames.join(" / ") : "Shared Root",
      viewers: ["Everyone"],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const [documents, setDocuments] = useState<AdminDocument[]>(initialDocuments);
  const [viewMode, setViewMode] = useState<"icons" | "list">("icons");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [folderOptions, setFolderOptions] = useState<FolderOption[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [uploadRecipients, setUploadRecipients] = useState<string[]>([]);
  const [uploadRecipientQuery, setUploadRecipientQuery] = useState("");

  const [editingDoc, setEditingDoc] = useState<AdminDocument | null>(null);
  const [editRecipients, setEditRecipients] = useState<string[]>([]);
  const [editRecipientQuery, setEditRecipientQuery] = useState("");
  const [replacementFile, setReplacementFile] = useState<File | null>(null);

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

  // Fake upload handler – simply pushes the files into local state.
  const handleUpload = () => {
    if (!uploadFiles.length || !selectedEmployee.trim() || !selectedFolderId) return;

    const targetOption =
      folderOptions.find((option) => option.id === selectedFolderId) ?? folderOptions[0];
    const now = new Date().toISOString();

    const newDocs: AdminDocument[] = uploadFiles.map((file) => ({
      id: `${file.name}-${now}`,
      name: file.name,
      url: URL.createObjectURL(file),
      pathIds: targetOption?.id === "root" ? [] : (targetOption?.id.split("/") ?? []),
      pathLabel: targetOption?.label ?? "Shared Root",
      viewers: uploadRecipients.length ? uploadRecipients : [selectedEmployee],
      updatedAt: now,
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
    resetUploadForm();
  };

  const openEditModal = (doc: AdminDocument) => {
    setEditingDoc(doc);
    setEditRecipients(doc.viewers);
    setReplacementFile(null);
    setEditRecipientQuery("");
  };

  const closeEditModal = () => {
    setEditingDoc(null);
    setReplacementFile(null);
    setEditRecipientQuery("");
  };

  // Apply edits captured in the modal to local state.
  const saveDocumentChanges = () => {
    if (!editingDoc) return;
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== editingDoc.id) return doc;

        return {
          ...doc,
          name: replacementFile?.name ?? doc.name,
          viewers: editRecipients.length ? editRecipients : doc.viewers,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
    closeEditModal();
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
      />

      <section className="card bg-base-100 shadow">
        <div className="card-body gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Existing documents</h3>
              <p className="text-sm text-base-content/70">
                {/* This view currently shows sample data. Hook up the data-fetching layer so admins see
                every uploaded file across the organization. */}
              </p>
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

          <DocumentGrid documents={documents} onEdit={openEditModal} viewMode={viewMode} />
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
          onClose={closeEditModal}
          onSave={saveDocumentChanges}
        />
      ) : null}
    </div>
  );
}
