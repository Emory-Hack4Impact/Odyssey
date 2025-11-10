-- Create EmployeeEvaluation table with submitter fields
CREATE TABLE IF NOT EXISTS "EmployeeEvaluation" (
    "id" SERIAL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "communication" TEXT NOT NULL,
    "leadership" TEXT NOT NULL,
    "timeliness" TEXT NOT NULL,
    "skill1" TEXT NOT NULL,
    "skill2" TEXT NOT NULL,
    "skill3" TEXT NOT NULL,
    "submitterUsername" TEXT,
    "submitterRole" TEXT,
    "submitterEmail" TEXT
);
