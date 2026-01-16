/**
 * Time off request types
 */

export type LeaveType = "vacation" | "sick" | "personal" | "bereavement" | "jury_duty" | "other";

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string | Date;
  endDate: string | Date;
  comments: string;
  approved: boolean;
  otherLeaveType: string;
}

export interface TimeOffFormData {
  leaveType: LeaveType;
  otherLeaveType?: string;
  startDate: string;
  endDate: string;
  comments: string;
}

export interface TimeOffSubmission {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
  otherLeaveType?: string;
}

export interface DaysInfo {
  approved: number;
  pending: number;
  total: number;
  available: number;
}
