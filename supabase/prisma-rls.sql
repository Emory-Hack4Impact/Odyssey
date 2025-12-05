-- Set RLS and permissions on Prisma-generated tables (execute after migrations/seed)
-- Execute after `supabase db reset`, `npm run db:migrate`, and `npm run db:seed` by running:
-- psql <your db url> -f supabase/prisma-rls.sql
-- or run `./supabase/db-reset.sh` from the root `Odyssey/` directory

-- Ensure client roles can access the public schema (fixes: permission denied for schema public)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;


-- =============
-- User Metadata
-- =============
ALTER TABLE "UserMetadata" ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE "UserMetadata" TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Users can read own metadata" ON "UserMetadata";
CREATE POLICY "Users can read own metadata"
ON "UserMetadata"
FOR SELECT
USING (id = auth.uid());


-- =====
-- Files
-- =====
ALTER TABLE "Files" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read avatar files" ON "Files";
CREATE POLICY "Public can read avatar files"
ON "Files"
FOR SELECT
USING (type='AVATAR');

DROP POLICY IF EXISTS "Users can upload files" ON "Files";
CREATE POLICY "Users can upload files"
ON "Files"
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own files" ON "Files";
CREATE POLICY "Users can update their own files"
ON "Files"
FOR UPDATE
USING (auth.uid() = "userId"::uuid);

DROP POLICY IF EXISTS "Users can delete their own files" ON "Files";
CREATE POLICY "Users can delete their own files"
ON "Files"
FOR DELETE
USING (auth.uid() = "userId"::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "Files" TO authenticated;
GRANT SELECT ON TABLE "Files" TO anon;


-- ====================
-- Employee Evaluations
-- ====================
ALTER TABLE "EmployeeEvaluation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmployeeEvaluationMetadata" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin and HR can read all evaluations" ON "EmployeeEvaluation";
CREATE POLICY "Admin and HR can read all evaluations"
ON "EmployeeEvaluation"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "UserMetadata"
    WHERE id = auth.uid()
    AND (is_admin = true OR is_hr = true)
  )
);

DROP POLICY IF EXISTS "Admin and HR can read all metadata" ON "EmployeeEvaluationMetadata";
CREATE POLICY "Admin and HR can read all metadata"
ON "EmployeeEvaluationMetadata"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "UserMetadata"
    WHERE id = auth.uid()
    AND (is_admin = true OR is_hr = true)
  )
);


DROP POLICY IF EXISTS "Employees can read own evaluations" ON "EmployeeEvaluation";
CREATE POLICY "Employees can read own evaluations"
ON "EmployeeEvaluation"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "EmployeeEvaluationMetadata"
    WHERE "EmployeeEvaluationMetadata"."evaluationId" = "EmployeeEvaluation".id
    AND "EmployeeEvaluationMetadata"."employeeId"::uuid = auth.uid()
  )
);

DROP POLICY IF EXISTS "Employees can read own evaluation metadata" ON "EmployeeEvaluationMetadata";
CREATE POLICY "Employees can read own evaluation metadata"
ON "EmployeeEvaluationMetadata"
FOR SELECT
USING ("employeeId"::uuid = auth.uid());


DROP POLICY IF EXISTS "Employees can read evaluations they submitted" ON "EmployeeEvaluation";
CREATE POLICY "Employees can read evaluations they submitted"
ON "EmployeeEvaluation"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "EmployeeEvaluationMetadata"
    WHERE "EmployeeEvaluationMetadata"."evaluationId" = "EmployeeEvaluation".id
    AND "EmployeeEvaluationMetadata"."submitterId"::uuid = auth.uid()
  )
);

DROP POLICY IF EXISTS "Employees can read metadata they created" ON "EmployeeEvaluationMetadata";
CREATE POLICY "Employees can read metadata they created"
ON "EmployeeEvaluationMetadata"
FOR SELECT
USING ("submitterId"::uuid = auth.uid());


DROP POLICY IF EXISTS "Authenticated users can create evaluations" ON "EmployeeEvaluation";
CREATE POLICY "Authenticated users can create evaluations"
ON "EmployeeEvaluation"
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create metadata" ON "EmployeeEvaluationMetadata";
CREATE POLICY "Authenticated users can create metadata"
ON "EmployeeEvaluationMetadata"
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND "submitterId"::uuid = auth.uid()  -- Must be the submitter
);


DROP POLICY IF EXISTS "Admin and HR can update evaluations" ON "EmployeeEvaluation";
CREATE POLICY "Admin and HR can update evaluations"
ON "EmployeeEvaluation"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "UserMetadata"
    WHERE id = auth.uid()
    AND (is_admin = true OR is_hr = true)
  )
);

DROP POLICY IF EXISTS "Admin and HR can update metadata" ON "EmployeeEvaluationMetadata";
CREATE POLICY "Admin and HR can update metadata"
ON "EmployeeEvaluationMetadata"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "UserMetadata"
    WHERE id = auth.uid()
    AND (is_admin = true OR is_hr = true)
  )
);


DROP POLICY IF EXISTS "Admin and HR can delete evaluations" ON "EmployeeEvaluation";
CREATE POLICY "Admin and HR can delete evaluations"
ON "EmployeeEvaluation"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "UserMetadata"
    WHERE id = auth.uid()
    AND (is_admin = true OR is_hr = true)
  )
);

DROP POLICY IF EXISTS "Admin and HR can delete metadata" ON "EmployeeEvaluationMetadata";
CREATE POLICY "Admin and HR can delete metadata"
ON "EmployeeEvaluationMetadata"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "UserMetadata"
    WHERE id = auth.uid()
    AND (is_admin = true OR is_hr = true)
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "EmployeeEvaluation" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "EmployeeEvaluationMetadata" TO authenticated;

REVOKE ALL ON TABLE "EmployeeEvaluation" FROM anon;
REVOKE ALL ON TABLE "EmployeeEvaluationMetadata" FROM anon;
