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
  ) values
  -- Manager
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'manager1@example.com',
  crypt ('password123', gen_salt ('bf')),
  current_timestamp, current_timestamp, current_timestamp,
  '{"provider":"email","providers":["email"]}', '{}',
  current_timestamp, current_timestamp,
  '', '', '', ''),

  -- Regular user
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'user1@example.com',
  crypt ('password123', gen_salt ('bf')),
  current_timestamp, current_timestamp, current_timestamp,
  '{"provider":"email","providers":["email"]}', '{}',
  current_timestamp, current_timestamp,
  '', '', '', '');

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
  SELECT uuid_generate_v4 (), id, id,
    format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb, 'email',
    current_timestamp, current_timestamp, current_timestamp
  FROM auth.users
  );
