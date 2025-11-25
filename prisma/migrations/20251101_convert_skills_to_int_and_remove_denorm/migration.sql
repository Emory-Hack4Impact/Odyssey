-- Migration: convert skill1/skill2/skill3 columns from text to integer (0-100)
-- and remove denormalized name/submitter text fields

BEGIN;

-- Add new integer columns with default 0
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "skill1_int" integer DEFAULT 0;
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "skill2_int" integer DEFAULT 0;
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "skill3_int" integer DEFAULT 0;

-- Populate new integer columns with 0 for now (can't infer numeric ratings from text)
UPDATE "EmployeeEvaluation" SET "skill1_int" = 0 WHERE "skill1_int" IS NULL;
UPDATE "EmployeeEvaluation" SET "skill2_int" = 0 WHERE "skill2_int" IS NULL;
UPDATE "EmployeeEvaluation" SET "skill3_int" = 0 WHERE "skill3_int" IS NULL;

-- Drop old text skill columns if they exist
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "skill1";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "skill2";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "skill3";

-- Rename new columns into place
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "skill1_int" TO "skill1";
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "skill2_int" TO "skill2";
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "skill3_int" TO "skill3";

-- Add range checks to ensure values are between 0 and 100
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "skill1_range" CHECK ("skill1" >= 0 AND "skill1" <= 100);
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "skill2_range" CHECK ("skill2" >= 0 AND "skill2" <= 100);
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "skill3_range" CHECK ("skill3" >= 0 AND "skill3" <= 100);

-- Drop denormalized submitter and employee name columns
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "submitterUsername";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "submitterRole";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "submitterEmail";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "employeeFirstName";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "employeeLastName";

COMMIT;
