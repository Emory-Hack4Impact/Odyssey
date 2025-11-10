-- Migration: update dummy rating fields (communication/leadership/timeliness) to non-zero sample values

BEGIN;

-- For string-stored ratings, update empty, NULL, or '0' values to sample non-zero strings.
UPDATE "EmployeeEvaluation"
SET "communication" = '75'
WHERE COALESCE(NULLIF("communication", ''), '0') = '0';

UPDATE "EmployeeEvaluation"
SET "leadership" = '68'
WHERE COALESCE(NULLIF("leadership", ''), '0') = '0';

UPDATE "EmployeeEvaluation"
SET "timeliness" = '82'
WHERE COALESCE(NULLIF("timeliness", ''), '0') = '0';

COMMIT;
