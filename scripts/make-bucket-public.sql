-- Make the files bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'files';

-- Verify it worked
SELECT id, name, public FROM storage.buckets WHERE id = 'files';
