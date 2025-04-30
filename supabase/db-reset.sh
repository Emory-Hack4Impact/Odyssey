#!/bin/bash

# since the interactions between supabase and prisma are goofy (supabase resets everything but doesn't run prisma's migrate command), we need to call things sequentially and this helps make that easier

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# reset supabase database
supabase db reset

# apply prisma migrations to create other tables
npm run db:migrate
npm run db:seed

# Apply rls policies to prisma tables after tables exist
psql "$DATABASE_URL" -f supabase/prisma-rls.sql
