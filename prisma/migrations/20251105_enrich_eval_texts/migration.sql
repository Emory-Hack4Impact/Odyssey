-- Migration: enrich evaluation text fields with newline-separated bullets for sample data

BEGIN;

-- Update sample employee (id ...0005) for year 2025 to have multiline bullets
UPDATE "EmployeeEvaluation"
SET
  "strengths" = E'Communicates clearly with team\nProactive in sharing updates\nActive listener in meetings',
  "weaknesses" = E'Occasional delays in responding to messages\nNeeds to delegate more effectively',
  "improvements" = E'Set response-time goals for Slack/email\nSchedule weekly backlog grooming\nPair-program once per sprint',
  "notes" = E'Eligible for Q1 training stipend\nPrefers asynchronous collaboration\nGreat culture add'
WHERE "employeeId" = '00000000-0000-0000-0000-000000000005'
  AND "year" = 2025;

COMMIT;
