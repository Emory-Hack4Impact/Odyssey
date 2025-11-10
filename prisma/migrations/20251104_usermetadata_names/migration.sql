-- Add employee first and last name columns to UserMetadata for testing
ALTER TABLE "UserMetadata"
ADD COLUMN IF NOT EXISTS "employeeFirstName" TEXT,
ADD COLUMN IF NOT EXISTS "employeeLastName" TEXT;
