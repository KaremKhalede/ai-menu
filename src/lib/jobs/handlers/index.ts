import { JobHandler, JobType } from "../JobTypes";
import { NotificationJobHandler } from "./NotificationJobHandler";
import { AnalyticsJobHandler } from "./AnalyticsJobHandler";

export const handlersRegistry: Record<string, JobHandler> = {
  [JobType.SEND_NOTIFICATION]: new NotificationJobHandler(),
  [JobType.GENERATE_ANALYTICS]: new AnalyticsJobHandler(),
  // SYNC_EXTERNAL, CUSTOM can be added here
};
