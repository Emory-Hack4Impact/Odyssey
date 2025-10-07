-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            ('00000000-0000-0000-0000-00000000000' || (ROW_NUMBER() OVER ()) || '')::uuid,
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 5)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );


INSERT INTO storage.buckets
    (id, name)
values
    ('avatars', 'avatars'),
    ('files', 'files');


-------------------------------------------------------------------
------------------------------- RLS -------------------------------
-------------------------------------------------------------------

-- -- Enable RLS on the storage.objects table (if not already enabled)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- -- Allow authenticated users to upload files (INSERT)
-- CREATE POLICY "Users can upload their own avatars"
-- ON storage.objects
-- FOR INSERT
-- WITH CHECK (auth.uid() IS NOT NULL);

-- -- Allow any user to see avatars
-- CREATE POLICY "Public can read avatars"
-- ON storage.objects
-- FOR SELECT
-- USING (bucket_id = 'avatars');

-- -- Allow users to update only their own files (UPDATE)
-- CREATE POLICY "Users can update their own avatars"
-- ON storage.objects
-- FOR UPDATE
-- USING (auth.uid() = owner);

-- -- Allow users to delete only their own files (DELETE)
-- CREATE POLICY "Users can delete their own avatars"
-- ON storage.objects
-- FOR DELETE
-- USING (auth.uid() = owner);
