"use client";

import { useMemo, useState } from "react";
import { ROOT } from "./mockData"; // to be modified when backend is ready
import type { DocumentNode, FolderNode } from "./types";
import { FileIcon, FolderIcon, FolderOutlineIcon, ChevronRightIcon } from "./icons";

/**
 * viewMode:
 * - "icons": grid of large icons (like the wireframe)
 * - "list": compact rows with name + type
 */

type ViewMode = "icons" | "list";

type PathResult = {
  // new type to guard against wrong paths
  node: DocumentNode;
  complete: boolean;
};

/** Type guards */
function isFolder(node: DocumentNode): node is FolderNode {
  return node.type === "folder";
}

/** Returns type `PathResult` according to `path` provided */
function findByPath(root: DocumentNode, path: string[]): PathResult {
  let current = root;
  for (const id of path) {
    if (!isFolder(current)) return { node: current, complete: false }; // if not folder
    const next = current.children.find((c) => c.id === id && c.type === "folder");
    if (!next) return { node: current, complete: false }; // if no further folder
    current = next;
  }
  return { node: current, complete: true };
}

function openItem(url: string) {
  // Opens in a NEW TAB; safe defaults:
  // - "_blank": new tab
  // - "noopener": new tab cannot control the opener
  // - "noreferrer": don’t leak the current page as referrer
  window.open(url, "_blank", "noopener, noreferrer");
}

export default function UserDocuments() {
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [path, setPath] = useState<string[]>([]); // [] means root

  // only rerender when path changed thro memorization
  const { node: current } = useMemo(() => findByPath(ROOT, path), [path]);

  const crumbs: { id: string[]; label: string }[] = [{ id: [], label: ROOT.name }];
  let prefix: string[] = [];

  for (const id of path) {
    const nextPrefix = [...prefix, id];
    const { node, complete } = findByPath(ROOT, nextPrefix);
    if (!complete) break; // stop adding crumbs on the first gap
    crumbs.push({ id: nextPrefix, label: node.name });
    prefix = nextPrefix;
  }

  const goTo = (ids: string[]) => setPath(ids);

  const currentPathKey = path.length ? path.join("/") : "root";

  // different views:

  // icon view
  const IconGrid = ({ folder }: { folder: FolderNode }) => (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      role="list"
      aria-label="Folder contents as icons"
    >
      {folder.children.map((node: DocumentNode) => {
        const isFolderNode = node.type === "folder";
        return (
          <button
            key={node.id}
            type="button"
            className="group flex flex-col gap-3 rounded-xl border border-base-200 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => {
              if (node.type === "folder") {
                setPath((prev) => [...prev, node.id]);
              } else {
                openItem(node.url);
              }
            }}
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20">
              {isFolderNode ? <FolderIcon className="h-8 w-8" /> : <FileIcon className="h-8 w-8" />}
            </span>
            <div className="min-w-0">
              {node.type === "folder" ? (
                <div className="truncate font-medium">{node.name}</div>
              ) : (
                <a
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="link truncate font-medium group-hover:underline"
                  title={node.name}
                >
                  {node.name}
                </a>
              )}
              <div className="text-xs tracking-wide text-base-content/60 uppercase">
                {node.type === "folder" ? "Folder" : "File"}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  // table view
  const ListTable = ({ folder }: { folder: FolderNode }) => (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr className="text-sm text-base-content/60 uppercase">
            <th className="w-0">Type</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {folder.children.map((node) => {
            const isFolderNode = node.type === "folder";
            return (
              <tr
                key={node.id}
                className="cursor-pointer transition hover:bg-base-200/70"
                onClick={() => {
                  if (node.type === "folder") setPath((prev) => [...prev, node.id]);
                  else {
                    openItem(node.url);
                  }
                }}
              >
                <td className="w-0 align-middle">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-base-200 text-primary">
                    {isFolderNode ? (
                      <FolderIcon className="h-6 w-6" />
                    ) : (
                      <FileIcon className="h-6 w-6" />
                    )}
                  </span>
                </td>
                <td className="align-middle">
                  {node.type === "folder" ? (
                    <span className="font-medium text-base-content">{node.name}</span>
                  ) : (
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="link font-medium"
                      title={node.name}
                    >
                      {node.name}
                    </a>
                  )}
                  <div className="text-xs tracking-wide text-base-content/60 uppercase">
                    {node.type === "folder" ? "Folder" : "File"}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full">
      {/* Top row: title + view mode switcher */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{current.name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">View</span>
          <select
            className="select-bordered select select-sm"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            aria-label="View mode"
          >
            <option value="icons">As Icons</option>
            <option value="list">As List</option>
          </select>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="mb-3 overflow-x-auto" aria-label="Current folder path">
        <ul className="breadcrumbs flex flex-nowrap items-center gap-2 p-1 text-sm">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <li key={crumb.id.length ? crumb.id.join("/") : "root"} className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <FolderOutlineIcon className={`h-4 w-4 ${isLast ? "text-primary" : ""}`} />
                  {isLast ? (
                    <span className="font-semibold text-primary" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-base-content/80 transition hover:text-base-content"
                      onClick={() => goTo(crumb.id)}
                    >
                      {crumb.label}
                    </button>
                  )}
                  {!isLast ? <ChevronRightIcon className="h-3 w-3 text-base-content/40" /> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main card shell */}
      <div className="card bg-base-200 shadow">
        <div className="card-body p-4">
          <div key={currentPathKey} className="motion-safe:animate-[docFadeIn_0.22s_ease-out]">
            {isFolder(current) ? (
              current.children.length ? (
                viewMode === "icons" ? (
                  <IconGrid folder={current} />
                ) : (
                  <ListTable folder={current} />
                )
              ) : (
                <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-sm text-base-content/70">
                  This folder is empty. Come back later when an administrator shares documents with
                  you.
                </div>
              )
            ) : (
              // (Edge case) If someone somehow navigated to a file id, show a simple summary.
              <div className="text-sm text-base-content/70">
                “{current.name}” is a file. Use the breadcrumbs above to go back to a folder.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
