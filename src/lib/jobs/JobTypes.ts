export enum JobType {
  SEND_NOTIFICATION = "SEND_NOTIFICATION",
  GENERATE_ANALYTICS = "GENERATE_ANALYTICS",
  SYNC_EXTERNAL = "SYNC_EXTERNAL",
  CUSTOM = "CUSTOM",
}

export enum JobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  RETRYING = "RETRYING",
  CANCELLED = "CANCELLED",
}

export interface Job {
  id: string;
  jobType: string;
  payload: any;
  status: string;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobHandler {
  /**
   * Executes the business logic for the job.
   * MUST be idempotent: capable of running multiple times without duplicate side effects.
   */
  handle(job: Job): Promise<void>;
}
