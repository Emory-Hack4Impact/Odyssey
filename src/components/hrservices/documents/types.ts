export type NodeType = "folder" | "file";

/**
 * A DocumentNode represents either a folder or a file.
 * - If type === "folder", it can have children (more nodes).
 * - If type === "file", children is undefined.
 **/
export type DocumentNode = FolderNode | FileNode;

export interface FolderNode {
  id: string; // unique id for React keys and navigation
  name: string; // display name
  type: "folder"; // "folder" or "file"
  children: DocumentNode[]; // present only for folders
}

export interface FileNode {
  id: string;
  name: string;
  type: "file";
  children?: never;
}
