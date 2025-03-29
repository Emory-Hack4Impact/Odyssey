-- Set RLS on Prisma-generated tables (Prisma table RLS should be set here!)
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
