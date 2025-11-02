"use client";

import { useMemo, useState } from "react";
import { ROOT } from "./mockData"; // to be modified when backend is ready
import type { DocumentNode, FolderNode, ItemNode } from "./types";
import { FolderIcon, FileIcon } from "./icons";

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

function isItem(node: ItemNode): node is ItemNode {
  return node.type === "item";
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

export default function Documents() {
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [path, setPath] = useState<string[]>([]); // [] means root

  // only rerender when path changed thro memorization
  const { node: current, complete } = useMemo(() => findByPath(ROOT, path), [path]);

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

  // different views:

  // icon view
  const IconGrid = ({ folder }: { folder: FolderNode }) => (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      role="list"
      aria-label="Folder contents as icons"
    >
      {folder.children.map((node: DocumentNode) => (
        <button
          key={node.id}
          type="button"
          className="card link bg-base-100 p-3 text-left link-hover shadow transition hover:shadow-md"
          onClick={() => {
            if (node.type === "folder") {
              setPath((prev) => [...prev, node.id]); // if folder go further
            } else {
              openItem(node.url); // if file open
            }
          }}
        >
          <div className="min-w-0">
            {isFolder(node) ? (
              <div className="truncate font-medium">{node.name}</div> // if folder, navigate into
            ) : (
              // enable
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // avoid triggering the tile's onClick
                className="link truncate font-medium link-hover"
                title={node.name}
              >
                {node.name}
              </a>
            )}
            <div className="text-xs text-base-content/60">{isFolder(node) ? "folder" : "item"}</div>
          </div>
        </button>
      ))}
    </div>
  );

  // table view
  const ListTable = ({ folder }: { folder: FolderNode }) => (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th className="w-0">Type</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {folder.children.map((node) => (
            <tr
              key={node.id}
              className={node.type === "folder" ? "link link-hover" : ""}
              onClick={() => {
                if (node.type === "folder") setPath((prev) => [...prev, node.id]);
                else {
                  openItem(node.url);
                }
              }}
            >
              <td className="align-middle">
                {isFolder(node) ? ( // handle command click
                  <div className="font-medium">{node.name}</div>
                ) : (
                  <a
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // avoid triggering the row's onClick
                    className="link font-medium link-hover"
                    title={node.name}
                  >
                    {node.name}
                  </a>
                )}
                <div className="text-xs text-base-content/60">
                  {isFolder(node) ? "folder" : "item"}
                </div>
              </td>
            </tr>
          ))}
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
      <div className="mb-3 overflow-x-auto">
        <ul className="breadcrumbs p-1 text-sm">
          {crumbs.map((c, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <li key={c.id.length ? c.id.join("/") : "root"}>
                {isLast ? (
                  <span className="font-bold">{"> " + c.label}</span>
                ) : (
                  <button type="button" className="link link-hover" onClick={() => goTo(c.id)}>
                    {c.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main card shell */}
      <div className="card bg-base-200 shadow">
        <div className="card-body p-4">
          {isFolder(current) ? (
            viewMode === "icons" ? (
              <IconGrid folder={current} />
            ) : (
              <ListTable folder={current} />
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
  );
}
