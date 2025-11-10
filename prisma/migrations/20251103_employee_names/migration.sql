-- Replace employeeId with employeeFirstName and employeeLastName
ALTER TABLE "EmployeeEvaluation"
ADD COLUMN IF NOT EXISTS "employeeFirstName" TEXT,
ADD COLUMN IF NOT EXISTS "employeeLastName" TEXT;

-- Optionally migrate data from employeeId -> employeeFirstName/LastName if there is a pattern
-- For now leave new columns NULL for existing rows.

-- Drop the old employeeId column if it exists
ALTER TABLE "EmployeeEvaluation"
DROP COLUMN IF EXISTS "employeeId";
