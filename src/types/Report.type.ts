export type ReportTargetType =
  | "USER"
  | "POST"
  | "COMMENT"
  | "GROUP"
  | "MESSAGE"
  | "STORY";

export type ReportStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED"
  | "ESCALATED";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "HATE_SPEECH"
  | "VIOLENCE"
  | "NUDITY"
  | "FALSE_INFORMATION"
  | "COPYRIGHT_INFRINGEMENT"
  | "IMPERSONATION"
  | "SCAM_OR_FRAUD"
  | "SELF_HARM"
  | "TERRORISM"
  | "DRUG_SALES"
  | "INAPPROPRIATE_CONTENT"
  | "OTHER";

export interface ReportItemResponse {
  id: number;
  reporterId: number | null;
  reporterName: string;
  reporterEmail: string;
  reportTargetType: ReportTargetType;
  reportTargetId: number | null;
  reportReason: ReportReason;
  additionalInfo?: string;
  status: ReportStatus;
  reviewedById?: number | null;
  reviewedByName?: string;
  reviewedAt?: string;
  adminNotes?: string;
  isAnonymous?: boolean;
  priority?: number;
  createdAt: string;
}
