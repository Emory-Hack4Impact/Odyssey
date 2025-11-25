-- Migration: convert communication/leadership/timeliness from text to integer (0-100)

BEGIN;

-- Add new integer columns with safe default 0
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "communication_int" integer DEFAULT 0;
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "leadership_int" integer DEFAULT 0;
ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "timeliness_int" integer DEFAULT 0;

-- Populate new integer columns by casting numeric-looking strings, otherwise set sensible defaults
UPDATE "EmployeeEvaluation"
SET "communication_int" = (
  CASE
    WHEN COALESCE(NULLIF(trim("communication"), ''), '0') ~ '^\d+$' THEN LEAST(GREATEST(CAST(trim("communication") AS integer), 0), 100)
    ELSE 0
  END
)
WHERE TRUE;

UPDATE "EmployeeEvaluation"
SET "leadership_int" = (
  CASE
    WHEN COALESCE(NULLIF(trim("leadership"), ''), '0') ~ '^\d+$' THEN LEAST(GREATEST(CAST(trim("leadership") AS integer), 0), 100)
    ELSE 0
  END
)
WHERE TRUE;

UPDATE "EmployeeEvaluation"
SET "timeliness_int" = (
  CASE
    WHEN COALESCE(NULLIF(trim("timeliness"), ''), '0') ~ '^\d+$' THEN LEAST(GREATEST(CAST(trim("timeliness") AS integer), 0), 100)
    ELSE 0
  END
)
WHERE TRUE;

-- Drop old text columns
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "communication";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "leadership";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "timeliness";

-- Rename integer columns into place
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "communication_int" TO "communication";
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "leadership_int" TO "leadership";
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "timeliness_int" TO "timeliness";

-- Add range checks
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "communication_range" CHECK ("communication" >= 0 AND "communication" <= 100);
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "leadership_range" CHECK ("leadership" >= 0 AND "leadership" <= 100);
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "timeliness_range" CHECK ("timeliness" >= 0 AND "timeliness" <= 100);

COMMIT;
