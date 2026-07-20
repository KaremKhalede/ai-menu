import { db } from "@/lib/db";
import { JobHandler, JobStatus, Job } from "./JobTypes";
import { handlersRegistry } from "./handlers";
import { LockManager } from "@/lib/concurrency/LockManager";
import { LockScope } from "@/lib/concurrency/LockProvider";

export class JobQueue {
  /**
   * Selects runnable jobs and orchestrates their execution.
   * Completely separated from business logic (which lives in JobHandlers)
   * and scheduling (which lives in JobDispatcher).
   */
  static async processPendingJobs(batchSize = 10) {
    const now = new Date();

    // Select pending or retrying jobs that are ready to run
    const jobsToRun = await db.backgroundJob.findMany({
      where: {
        status: { in: [JobStatus.PENDING, JobStatus.RETRYING] },
        scheduledAt: { lte: now },
      },
      take: batchSize,
      orderBy: { scheduledAt: 'asc' },
    });

    for (const job of jobsToRun) {
      await this.executeJob(job as unknown as Job);
    }
  }

  private static async executeJob(job: Job) {
    try {
      // Concurrency Optimization: Prevent double execution if multiple queue pollers
      // fetch the same job simultaneously.
      await LockManager.withLock(LockScope.JOB, job.id, async () => {
        // 1. Mark as RUNNING
        await db.backgroundJob.update({
          where: { id: job.id },
          data: { status: JobStatus.RUNNING, startedAt: new Date() },
        });

        const handler: JobHandler = handlersRegistry[job.jobType];

        try {
          if (!handler) {
            throw new Error(`No handler registered for JobType: ${job.jobType}`);
          }

          // 2. Execute Idempotent Business Logic
          const parsedPayload = JSON.parse(job.payload);
          await handler.handle({ ...job, payload: parsedPayload });

          // 3. Mark as COMPLETED
          await db.backgroundJob.update({
            where: { id: job.id },
            data: { status: JobStatus.COMPLETED, completedAt: new Date() },
          });

        } catch (error: any) {
          // 4. Error Isolation & Retry Strategy
          const attempts = job.attempts + 1;
          const errorMessage = error.message || "Unknown error";

          if (attempts >= job.maxAttempts) {
            // Fail completely
            await db.backgroundJob.update({
              where: { id: job.id },
              data: {
                status: JobStatus.FAILED,
                attempts,
                lastError: errorMessage,
                failedAt: new Date(),
              },
            });
          } else {
            // Exponential Backoff: delay = 2^attempts seconds
            const delaySeconds = Math.pow(2, attempts);
            const nextRun = new Date(Date.now() + delaySeconds * 1000);

            await db.backgroundJob.update({
              where: { id: job.id },
              data: {
                status: JobStatus.RETRYING,
                attempts,
                lastError: errorMessage,
                scheduledAt: nextRun,
              },
            });
          }
        }
      });
    } catch (lockError: any) {
      // If we couldn't acquire the lock, another process is handling this job.
      // Silently skip it. We don't want to increment attempts or fail the job.
      if (lockError.message.includes("Concurrency error")) {
        console.log(`[JobQueue] Job ${job.id} is already being executed by another process. Skipping.`);
      } else {
        throw lockError; // Rethrow unexpected errors
      }
    }
  }
}
