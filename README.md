# Project Odyssey

Internal HR Employee management hub.

This project is built with Next.js, Supabase, and Prisma. Follow the instructions below to get
started with local development.

## Table of Contents:

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Best Practices](#best-practices)
5. [Useful Resources](#useful-resources)
6. [Troubleshooting](#troubleshooting)
7. [Getting Help](#getting-help)

## Prerequisites

- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/download)
- npm (installed with Node)
- [Docker](https://www.docker.com/get-started/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=npm)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Supabase CLI

Follow the [Supabase CLI installation guide](https://supabase.com/docs/guides/cli/getting-started)
for your operating system.

### 4. Start Supabase Locally

```bash
supabase start
```

This will spin up all Supabase services in Docker containers. Once complete, you'll see output with
access credentials and URLs.

**Important URLs:**

- **Supabase Studio Dashboard**: http://localhost:54323
- **API URL**: http://localhost:54321
- **Database**: See the output of `supabase start`!

Keep these credentials handy, as you'll need them for your environment variables.

### 5. Configure Environment Variables

Copy `.env.sample` to `.env` file in the project root:

```bash
cp .env.example .env
```

Update the file with your local Supabase credentials from the `supabase start` output:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 # API URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key> # anon key
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres # DB URL
# ...
```

### 6. Set Up Prisma

Generate the Prisma client and push the schema to your local database:

```bash
npm run db:generate
npm run db:push
```

**Helpful Prisma tools:**

- View your database schema: `npx prisma studio` (opens at http://localhost:5555)
- See the [Prisma Schema Explorer](https://www.prisma.io/docs/concepts/components/prisma-schema) for
  reference

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Making Changes

1. Create a new branch for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Format and lint your code before committing (see Best Practices below)

### Database Schema Changes

When modifying the Prisma schema (`prisma/schema.prisma`):

```bash
# Push changes to local database
npx prisma db push

# Regenerate Prisma Client
npx prisma generate
```

For production, create a migration:

```bash
npx prisma migrate dev --name descriptive_migration_name
```

### Viewing Emails

Supabase captures emails sent in a Mailpit instance, accessible via the Inbucket URL from
`supabase status`.

### Stopping Services

When you're done developing:

```bash
# Stop Supabase services
supabase stop
```

## Best Practices

### Code Quality

- **Check for linting errors**:

  ```bash
  npm run lint
  ```

- **Format code with Prettier** before committing:

  ```bash
  npm run format
  ```

### Git Workflow

- **Work on feature branches**, never directly on `main`
- **Write concise but descriptive commit messages** in present tense:
  - ✅ Good: `Add user authentication flow`
  - ✅ Good: `Fix navigation menu on mobile`
  - ❌ Avoid: `Added stuff` or `Fixed things`
- **Keep commits focused** on a single logical change so we can revert changes easily!

### Submitting Changes

1. Ensure your code is formatted and passes linting
2. Test your changes locally
3. Push your branch and create a pull request
4. Provide a clear description of your changes in the PR

### Use DaisyUI

We use [daisyUI](https://daisyui.com/) for consistent styling. Check their component library before
creating custom styles to keep our UI uniform.

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Prisma Documentation](https://www.prisma.io/docs)
- [daisyUI Reference](https://daisyui.com/components/)

## Troubleshooting

### Supabase won't start

- Ensure Docker Desktop is running
- Check that ports 54321-54323 aren't already in use
- Try `supabase stop` followed by `supabase start`

### Prisma Client errors

- Run `npx prisma generate` to regenerate the client
- Ensure your `DATABASE_URL` in `.env` is correct

### Module not found errors

- Delete `node_modules` and lock file, then reinstall dependencies
- Clear Next.js cache: `rm -rf .next`

## Getting Help

If you encounter issues not covered here, please:

1. Review the documentation links above
2. Check with our project director/tech lead
