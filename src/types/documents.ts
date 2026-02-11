/**
 * Document types
 * Moved from src/components/hrservices/documents/types.ts
 */

export type BaseNode = {
  id: string;
  name: string;
};

export type FileNode = BaseNode & {
  type: "file";
  url: string;
  mimeType?: string;
};

export type FolderNode = BaseNode & {
  type: "folder";
  children: DocumentNode[];
};

export type DocumentNode = FileNode | FolderNode;

export type FileType = "AVATAR" | "DOCUMENT" | "ATTACHMENT" | "ANNOUNCEMENT";

export interface FileRecord {
  id: string;
  userId: string;
  bucket: string;
  path: string;
  type: FileType;
  uploadedAt: string | Date;
  metadata?: Record<string, unknown>;
}
