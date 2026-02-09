/**
 * Centralized type exports
 * Import types from here: import { UserMetadata, Evaluation } from "@/types"
 */

// Auth types
export type { UserMetadata, AuthUser, Session } from "./auth";

// Permission types
export type { UserRole, Permission, PermissionCheck } from "./permissions";
export { PERMISSION_ROLES } from "./permissions";

// Evaluation types
export type {
  EvaluationMetadata,
  Evaluation,
  EvaluationFormData,
  EvaluationSubmissionMetadata,
  Reviewer,
  EvaluationWithReviewers,
  RawEvaluation,
} from "./evaluations";

// Time off types
export type {
  LeaveType,
  TimeOffRequest,
  TimeOffFormData,
  TimeOffSubmission,
  DaysInfo,
} from "./time-off";

// Document types
export type {
  BaseNode,
  FileNode,
  FolderNode,
  DocumentNode,
  FileType,
  FileRecord,
} from "./documents";
