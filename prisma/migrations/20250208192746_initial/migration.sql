-- CreateTable
CREATE TABLE "UserMetadata" (
    "id" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_hr" BOOLEAN NOT NULL DEFAULT false,
    "position" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "UserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOffRequest" (
    "id" SERIAL NOT NULL,
    "leaveType" TEXT NOT NULL,
    "otherLeaveType" TEXT NOT NULL DEFAULT '',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "comments" TEXT NOT NULL DEFAULT '',
    "userId" TEXT,

    CONSTRAINT "TimeOffRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
