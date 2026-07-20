import { Job, JobHandler } from "../JobTypes";
import { db } from "@/lib/db";

export class AnalyticsJobHandler implements JobHandler {
  async handle(job: Job): Promise<void> {
    const data = job.payload;

    // Ensure idempotency: Don't insert if we already processed this job
    const existing = await db.analyticsEvent.findFirst({
      where: {
        data: {
          contains: `"jobId":"${job.id}"`
        }
      }
    });

    if (existing) {
      return; // Idempotent success
    }

    await db.analyticsEvent.create({
      data: {
        type: data.type,
        data: JSON.stringify({
          ...data.payload,
          jobId: job.id, // Stored for idempotency checks on retries
        }),
      },
    });
  }
}
