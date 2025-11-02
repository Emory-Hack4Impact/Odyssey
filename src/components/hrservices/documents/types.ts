export type NodeType = "folder" | "item";

// discriminated union design for safety
export interface BaseNode {
  id: string;
  name: string;
  type: NodeType;
}
/**
 * A DocumentNode represents either a folder or a file.
 * - If type === "folder", it can have children (more nodes).
 * - If type === "file", children is undefined.
 **/
export type DocumentNode = FolderNode | ItemNode;

export interface FolderNode extends BaseNode {
  type: "folder";
  children: DocumentNode[];
}

export interface ItemNode extends BaseNode {
  type: "item";
  url: string;
  mimeType?: string; // records file extension
}
