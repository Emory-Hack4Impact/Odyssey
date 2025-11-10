-- Migration: update int rating fields to non-zero sample values for dummy rows

BEGIN;

-- Only adjust rows that look like seeded dummies (all three ratings are 0)
UPDATE "EmployeeEvaluation"
SET "communication" = 72,
    "leadership"    = 66,
    "timeliness"    = 81
WHERE COALESCE("communication", 0) = 0
  AND COALESCE("leadership", 0) = 0
  AND COALESCE("timeliness", 0) = 0;

COMMIT;
