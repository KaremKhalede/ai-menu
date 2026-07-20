import { db } from "@/lib/db";
import { JobType, JobStatus } from "./JobTypes";

export class JobDispatcher {
  /**
   * Enqueues a job for deferred execution.
   * Separates scheduling entirely from execution.
   */
  static async enqueue(
    jobType: JobType | string,
    payload: Record<string, any>,
    options?: {
      scheduledAt?: Date;
      maxAttempts?: number;
    }
  ) {
    const job = await db.backgroundJob.create({
      data: {
        jobType,
        payload: JSON.stringify(payload),
        status: JobStatus.PENDING,
        maxAttempts: options?.maxAttempts ?? 3,
        scheduledAt: options?.scheduledAt ?? new Date(),
      },
    });

    return job;
  }

  static async cancel(jobId: string) {
    return await db.backgroundJob.update({
      where: { id: jobId },
      data: { status: JobStatus.CANCELLED },
    });
  }
}
