-- Migration: add employeeId and submitterId to EmployeeEvaluation and create FKs to UserMetadata

BEGIN;

-- Add text columns (nullable) to hold references to users (UserMetadata.id is text)
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "employeeId" text;
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "submitterId" text;

-- Create foreign key constraints referencing UserMetadata(id). Use SET NULL on delete to avoid cascading deletes.
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "UserMetadata" (id) ON DELETE SET NULL;
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "UserMetadata" (id) ON DELETE SET NULL;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS "EmployeeEvaluation_employeeId_idx" ON "EmployeeEvaluation" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeEvaluation_submitterId_idx" ON "EmployeeEvaluation" ("submitterId");

COMMIT;
