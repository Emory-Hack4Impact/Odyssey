"user server";

import { PrismaClient, FileTypes } from "@prisma/client";
import { uploadFileToStorage } from "@/utils/supabase/server";

const prisma = new PrismaClient();

// Data we need from the frontend when uploading a document
export type UploadDocumentInput = {
  userId: string;
  fileName: string;
  viewers: string[];
  folderPath: string[];
  bucket: string;
  contentType?: string;
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

// server function handling upload

export async function uploadDocument(
  input: UploadDocumentInput,
  fileBody: ArrayBuffer,
): Promise<UploadedDocumentResult> {
  const { userId, fileName, viewers, folderPath, bucket, contentType } = input;
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

  // return UploadedDocumentResult
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
