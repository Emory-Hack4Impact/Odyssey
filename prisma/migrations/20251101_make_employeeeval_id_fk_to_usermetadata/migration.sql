-- Migration: make EmployeeEvaluation.id reuse UserMetadata.id (primary key AND foreign key)
-- WARNING: This migration requires that every existing EmployeeEvaluation.id already matches a UserMetadata.id.
-- If they don't match, the ALTER TABLE ADD CONSTRAINT will fail. Back up your DB first.

BEGIN;

-- Drop the employeeId FK and column if it exists (we'll reuse id as the FK)
ALTER TABLE "EmployeeEvaluation" DROP CONSTRAINT IF EXISTS "EmployeeEvaluation_employeeId_fkey";
DROP INDEX IF EXISTS "EmployeeEvaluation_employeeId_idx";
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "employeeId";

-- Ensure id column is uuid type. If the id column is text, attempt to cast it.
-- If id is not uuid, this may fail; ensure prior migrations converted it to uuid.
-- Here we try to alter type to uuid USING id::uuid if possible.
ALTER TABLE "EmployeeEvaluation" ALTER COLUMN "id" TYPE uuid USING ("id"::uuid);

-- Add the foreign key constraint making the PK also reference UserMetadata(id)
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_id_fkey" FOREIGN KEY ("id") REFERENCES "UserMetadata" (id) ON DELETE CASCADE;

COMMIT;
