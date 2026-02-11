/**
 * Employee evaluation types
 * Consolidated from PerfEvalHR.tsx and PerfReviewDashboard.tsx
 */

/**
 * Evaluation metadata (who submitted, for whom, when)
 */
export interface EvaluationMetadata {
  id: string;
  evaluationId: string;
  employeeId: string | null;
  submitterId: string | null;
  employeeFirstName: string;
  employeeLastName: string;
  year: number;
  submittedAt: string;
}

/**
 * Full evaluation with content and ratings
 */
export interface Evaluation extends EvaluationMetadata {
  strengths: string;
  weaknesses: string;
  improvements: string;
  notes: string;
  communication: string | number;
  leadership: string | number;
  timeliness: string | number;
  skill1: string | number;
  skill2: string | number;
  skill3: string | number;
  submitterEmail?: string | null;
}

/**
 * Evaluation form data for submission
 */
export interface EvaluationFormData {
  strengths: string;
  weaknesses: string;
  improvements: string;
  notes: string;
  communication: number;
  leadership: number;
  timeliness: number;
  skill1: number;
  skill2: number;
  skill3: number;
}

/**
 * Evaluation submission metadata
 */
export interface EvaluationSubmissionMetadata {
  employeeId: string;
  submitterId: string;
  year: number;
}

/**
 * Reviewer info displayed on evaluation dashboard
 */
export interface Reviewer {
  id: string;
  initials: string;
}

/**
 * API response for evaluation with reviewers
 */
export interface EvaluationWithReviewers {
  evaluation: Evaluation | null;
  reviewers: Reviewer[];
}

/**
 * Raw evaluation data from API (before normalization)
 */
export interface RawEvaluation {
  id?: string | number;
  employeeId?: string | number | null;
  submitterId?: string | number | null;
  [key: string]: unknown;
}
