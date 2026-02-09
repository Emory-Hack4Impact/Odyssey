/**
 * Employee components
 *
 * These components are accessible to all authenticated employees.
 * File location indicates permission level.
 */

// Evaluations - Employees can submit self-evaluations and view their reviews
export { default as PerfEvalEmployee } from "../hrservices/performance-evaluation/PerfEvalEmployee";
export { default as EmployeePerfEvalForm } from "../hrservices/performance-evaluation/EmployeePerfEvalForm";
export { PerformanceReviewDashboard } from "../hrservices/performance-evaluation/PerfReviewDashboard";

// Documents - Employees can view shared documents
export { default as UserDocuments } from "../hrservices/documents/UserDocuments";

// Time Off - Employees can request time off
export { default as TimeOff } from "../hrservices/time-off/TimeOff";

// Career Development - All employees can access
export { default as CareerDev } from "../hrservices/career-dev/CareerDev";
