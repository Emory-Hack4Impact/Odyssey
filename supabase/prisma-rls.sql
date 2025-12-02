-- Set RLS and permissions on Prisma-generated tables (execute after migrations/seed)
-- Execute after `supabase db reset`, `npm run db:migrate`, and `npm run db:seed` by running:
-- psql <your db url> -f supabase/prisma-rls.sql
-- or run `./supabase/db-reset.sh` from the root `Odyssey/` directory

ALTER TABLE "Files" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read avatar files"
ON "Files"
FOR SELECT
USING (type='AVATAR');

CREATE POLICY "Users can upload files"
ON "Files"
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own files"
ON "Files"
FOR UPDATE
USING (auth.uid() = "userId"::uuid);

CREATE POLICY "Users can delete their own files"
ON "Files"
FOR DELETE
USING (auth.uid() = "userId"::uuid);

-- Ensure client roles can access the public schema (fixes: permission denied for schema public)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Basic read access to UserMetadata for authenticated users; keep writes restricted
GRANT SELECT ON TABLE "UserMetadata" TO anon, authenticated, service_role;

-- Optionally lock down with RLS (users can only read their own row)
ALTER TABLE "UserMetadata" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own metadata" ON "UserMetadata";
CREATE POLICY "Users can read own metadata"
ON "UserMetadata"
FOR SELECT
USING (id = auth.uid());
