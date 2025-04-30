-- CreateEnum
CREATE TYPE "FileTypes" AS ENUM ('AVATAR', 'DOCUMENT', 'ATTACHMENT', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "Files" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "userId" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" "FileTypes" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Files_userId_type_idx" ON "Files"("userId", "type");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMetadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
