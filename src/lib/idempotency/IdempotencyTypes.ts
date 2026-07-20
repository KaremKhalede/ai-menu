export enum IdempotencyStatus {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface IdempotencyRecordModel {
  idempotencyKey: string;
  requestHash: string;
  status: IdempotencyStatus;
  responseSnapshot: any | null;
  createdAt: Date;
  expiresAt: Date;
}
