-- RLS policies for Supabase Storage buckets
-- Run this after setting up your Supabase instance
-- Note: For local development, these are permissive policies

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can upload to files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can read files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can update files in files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files in files bucket" ON storage.objects;

-- Allow authenticated users to upload files to the 'files' bucket
CREATE POLICY "Authenticated users can upload to files bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'files');

-- Allow public to read files from the 'files' bucket (for article images)
CREATE POLICY "Public can read files bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'files');

-- Allow authenticated users to update files in the 'files' bucket
CREATE POLICY "Users can update files in files bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'files');

-- Allow authenticated users to delete files in the 'files' bucket
CREATE POLICY "Users can delete files in files bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'files');

