/**
 * HR/Admin components
 *
 * These components are only accessible to users with is_admin or is_hr flags.
 * File location indicates permission level.
 */

// Evaluations - HR can review all employee evaluations
export { default as PerfEvalHR } from "../hrservices/performance-evaluation/PerfEvalHR";
export { default as HRPerfEvalForm } from "../hrservices/performance-evaluation/HRPerfEvalForm";

// Documents - Admin document management
export { default as AdminDocuments } from "../hrservices/documents/AdminDocuments";

// Time Off - HR can manage all time-off requests
// Re-export from existing location for now
