-- Migration: add submittedAt timestamp to EmployeeEvaluation

BEGIN;

ALTER TABLE "EmployeeEvaluation" ADD COLUMN IF NOT EXISTS "submittedAt" timestamptz DEFAULT now();

COMMIT;
