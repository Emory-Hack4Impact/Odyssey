-- Migration: update dummy skill values from 0 to non-zero sample values

BEGIN;

-- Only update rows that appear to be the earlier dummy rows (all three skills == 0)
-- Set to reasonable non-zero sample values so UI shows variation.
UPDATE "EmployeeEvaluation"
SET "skill1" = 65, "skill2" = 70, "skill3" = 60
WHERE COALESCE("skill1", 0) = 0 AND COALESCE("skill2", 0) = 0 AND COALESCE("skill3", 0) = 0;

COMMIT;
