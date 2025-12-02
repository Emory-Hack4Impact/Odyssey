-- CreateEnum
CREATE TYPE "FileTypes" AS ENUM ('AVATAR', 'DOCUMENT', 'ATTACHMENT', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "UserMetadata" (
    "id" UUID NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_hr" BOOLEAN NOT NULL DEFAULT false,
    "position" TEXT NOT NULL DEFAULT '',
    "employeeFirstName" TEXT,
    "employeeLastName" TEXT,

    CONSTRAINT "UserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" "FileTypes" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOffRequest" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "comments" TEXT NOT NULL DEFAULT '',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "otherLeaveType" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TimeOffRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeEvaluation" (
    "id" UUID NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "communication" INTEGER NOT NULL,
    "leadership" INTEGER NOT NULL,
    "timeliness" INTEGER NOT NULL,
    "skill1" INTEGER NOT NULL,
    "skill2" INTEGER NOT NULL,
    "skill3" INTEGER NOT NULL,

    CONSTRAINT "EmployeeEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeEvaluationMetadata" (
    "id" UUID NOT NULL,
    "evaluationId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "submitterId" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeEvaluationMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Files_userId_type_idx" ON "Files"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeEvaluationMetadata_evaluationId_key" ON "EmployeeEvaluationMetadata"("evaluationId");

-- CreateIndex
CREATE INDEX "EmployeeEvaluationMetadata_employeeId_idx" ON "EmployeeEvaluationMetadata"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeEvaluationMetadata_submitterId_idx" ON "EmployeeEvaluationMetadata"("submitterId");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMetadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "UserMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluationMetadata" ADD CONSTRAINT "EmployeeEvaluationMetadata_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "EmployeeEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluationMetadata" ADD CONSTRAINT "EmployeeEvaluationMetadata_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "UserMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluationMetadata" ADD CONSTRAINT "EmployeeEvaluationMetadata_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "UserMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
