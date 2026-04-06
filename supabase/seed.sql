SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


INSERT INTO storage.buckets
    (id, name)
values
    ('avatars', 'avatars'),
    ('files', 'files'),
    ('article', 'article');



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'user1@example.com', '$2a$06$gaTejOLlT/A/2OCc0uF08uQF3mj6CYOTvYVdyNz88DdYsuOOp70e6', '2026-03-20 01:39:04.301975+00', NULL, '', NULL, '', '2026-03-20 01:39:04.301975+00', '', '', NULL, '2026-03-20 01:39:04.301975+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'user2@example.com', '$2a$06$1qMGJK1x2gdMYddWQ3XCQetNNqKZ1StcIxA4rYK4B45Mw3t95Jk9.', '2026-03-20 01:39:04.301975+00', NULL, '', NULL, '', '2026-03-20 01:39:04.301975+00', '', '', NULL, '2026-03-20 01:39:04.301975+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'user3@example.com', '$2a$06$LLRRFeEVDdah0FUbXA4MNucC/CabhtVmj2sQISGL5vtWFemP8TI8q', '2026-03-20 01:39:04.301975+00', NULL, '', NULL, '', '2026-03-20 01:39:04.301975+00', '', '', NULL, '2026-03-20 01:39:04.301975+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'user4@example.com', '$2a$06$zLu0yCbVJ4SVI2Y5Cdq7A.EJWnsoZ8Xt609.l3xLQrX0kuObmT6cS', '2026-03-20 01:39:04.301975+00', NULL, '', NULL, '', '2026-03-20 01:39:04.301975+00', '', '', NULL, '2026-03-20 01:39:04.301975+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'user5@example.com', '$2a$06$P9vo101MYZzybeAp5RuM0u3GeqoyVCS/MWlx4qIaVX6nymyapc7SC', '2026-03-20 01:39:04.301975+00', NULL, '', NULL, '', '2026-03-20 01:39:04.301975+00', '', '', NULL, '2026-03-20 01:39:04.301975+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub": "00000000-0000-0000-0000-000000000001", "email": "user1@example.com"}', 'email', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '2e98800d-e80e-4df4-b16d-756e7565c776'),
	('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub": "00000000-0000-0000-0000-000000000002", "email": "user2@example.com"}', 'email', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '54ba2567-bbfa-49c6-9ff2-b3f0b3acfce0'),
	('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '{"sub": "00000000-0000-0000-0000-000000000003", "email": "user3@example.com"}', 'email', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '35595879-77d5-42a1-a0b6-854304f8a983'),
	('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '{"sub": "00000000-0000-0000-0000-000000000004", "email": "user4@example.com"}', 'email', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '0c452722-8088-4004-8cf8-198e73179c90'),
	('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', '{"sub": "00000000-0000-0000-0000-000000000005", "email": "user5@example.com"}', 'email', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', '39ae874b-ea51-48b7-b354-d349fae2fa9b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('avatars', 'avatars', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', false, false, NULL, NULL, NULL, 'STANDARD'),
	('files', 'files', NULL, '2026-03-20 01:39:04.301975+00', '2026-03-20 01:39:04.301975+00', false, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
