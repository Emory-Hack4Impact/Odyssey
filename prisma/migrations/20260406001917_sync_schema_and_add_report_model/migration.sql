-- AlterTable
ALTER TABLE "UserMetadata" ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "bio" TEXT NOT NULL DEFAULT 'Enter edit mode to update your bio',
ADD COLUMN     "birthday" DATE,
ADD COLUMN     "department" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "jobTitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "mobile" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "workNumber" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" UUID,
    "pagePath" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerDevArticles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "body" TEXT,
    "date" DATE NOT NULL,
    "starttime" TIME(6) NOT NULL,
    "endtime" TIME(6) NOT NULL,
    "location" TEXT NOT NULL,
    "imageurl" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerDevArticles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
