-- Migration: change EmployeeEvaluation.id from integer autoincrement to UUID (text) primary key
-- Note: this migration will create the pgcrypto extension (for gen_random_uuid)
-- and convert the existing integer id column to a uuid-based id.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- Add a new UUID column with DB-generated values for existing and new rows
ALTER TABLE "EmployeeEvaluation" ADD COLUMN "id_new" uuid NOT NULL DEFAULT gen_random_uuid();

-- Drop the existing primary key constraint if present
ALTER TABLE "EmployeeEvaluation" DROP CONSTRAINT IF EXISTS "EmployeeEvaluation_pkey";

-- Drop the old integer id column (CASCADE will remove dependent constraints if any)
ALTER TABLE "EmployeeEvaluation" DROP COLUMN IF EXISTS "id" CASCADE;

-- Rename the new column into place
ALTER TABLE "EmployeeEvaluation" RENAME COLUMN "id_new" TO "id";

-- Make the new column the primary key
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_pkey" PRIMARY KEY ("id");

COMMIT;
