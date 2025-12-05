"use server";

import { FileTypes, type Files } from "@prisma/client";
import { uploadFileToStorage, getFileSignedUrl } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

// Data we need from the frontend when uploading a document
export type UploadDocumentInput = {
  userId: string;
  fileName: string;
  viewers: string[];
  folderPath: string[];
  bucket: string;
  contentType?: string;
  fileBody: ArrayBuffer; // plain array of bytes of file
};

// data returned to the frontend after upload
export type UploadedDocumentResult = {
  id: string;
  bucket: string;
  path: string;
  fileName: string;
  viewers: string[];
  folderPath: string[];
  uploadedAt: string;
};

type FileWithMetadataViewers = Files & {
  metadata?: {
    viewers?: string[];
  } | null;
};

// server function handling upload

export async function uploadDocumentCore(
  input: UploadDocumentInput,
): Promise<UploadedDocumentResult> {
  const { userId, fileName, viewers, folderPath, bucket, contentType, fileBody } = input;

  // build storage path inside the bucket
  const safeFileName = fileName.replace(/\s+/g, "_"); // replace spaces
  const timestamp = Date.now(); // timestamp gives uniqueness to filepaths
  const path = `${userId}/${timestamp}-${safeFileName}`;

  // supabase side
  // upload file bytes
  const { bucket: storedBucket, path: storedPath } = await uploadFileToStorage(
    bucket,
    path,
    fileBody,
    contentType,
  );

  // prisma side
  // create file row in database
  const created = await prisma.files.create({
    data: {
      userId,
      bucket: storedBucket,
      path: storedPath,
      type: FileTypes.DOCUMENT,
      metadata: {
        fileName,
        viewers,
        folderPath,
      },
    },
  });

  // return clean result for API route
  return {
    id: created.id, // id handled by prisma
    bucket: created.bucket,
    path: created.path,
    fileName,
    viewers,
    folderPath,
    uploadedAt: created.uploadedAt.toISOString(), // convert time object into unique string
  };
}

// helper function to check whether valid viewer or not
async function canUserViewFile(
  file: FileWithMetadataViewers,
  currentUserId: string,
): Promise<boolean> {
  // check whether is owner
  if (file.userId === currentUserId) {
    return true;
  }
  // check whether is admin
  // TODO: db access implementation may be improved, but it works for now
  const userMetadata = await prisma.userMetadata.findUnique({
    where: { id: currentUserId },
    select: { is_admin: true },
  });
  if (userMetadata?.is_admin) {
    return true;
  }
  // check whether assigned as viewer
  const metadata = file.metadata as unknown as { viewers?: string[] } | null;
  const viewers = metadata?.viewers;
  if (Array.isArray(viewers) && viewers.includes(currentUserId)) {
    return true;
  }
  // else not allowed to view file
  return false;
}

// file id and current user id as input
// check permission & return signed url
export async function getSignedUrlForFileId(
  fileId: string,
  currentUserId: string,
  expiresInSeconds: 60,
): Promise<string> {
  // look up file in database
  const file = await prisma.files.findUnique({
    where: { id: fileId },
  });

  if (!file) {
    throw new Error("File not found");
  }
  // check permission for viewing
  if (!(await canUserViewFile(file, currentUserId))) {
    throw new Error("You do not have permission to view this file");
  }
  // if all good, return signed url
  const signedUrl = await getFileSignedUrl(file.bucket, file.path, expiresInSeconds);
  return signedUrl;
}
