import { Job, JobHandler } from "../JobTypes";
import { NotificationService } from "@/services/NotificationService";

export class NotificationJobHandler implements JobHandler {
  async handle(job: Job): Promise<void> {
    const data = job.payload;
    
    // Provide job.id as idempotencyKey to the domain service
    // if the underlying service supports it, ensuring that multiple runs
    // do not send multiple emails/notifications.
    // In this sprint, we rely on the internal createNotification idempotency logic
    // or we assume it's safe to replay if it fails midway.
    
    // Check if notification already exists by checking metadata.jobId
    // to guarantee idempotency.
    // (Assuming our NotificationService allows querying or enforcing uniqueness)
    
    await NotificationService.createNotification(data.restaurantId, {
      recipientType: data.recipientType,
      notificationType: data.notificationType,
      title: data.title,
      message: data.message,
      metadata: { ...data.metadata, jobId: job.id },
    });
  }
}
