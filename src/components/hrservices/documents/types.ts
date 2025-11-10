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
