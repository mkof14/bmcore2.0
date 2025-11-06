import { supabase } from "./supabase";
import { logger } from "./logger";

export type JobType =
  | "aggregate_reports"
  | "cleanup_temp_data"
  | "send_email"
  | "process_health_data"
  | "rotate_keys"
  | "archive_logs";

export interface JobPayload {
  [key: string]: any;
}

export interface Job {
  id: string;
  jobType: JobType;
  payload: JobPayload;
  status: "pending" | "processing" | "completed" | "failed";
  priority: number;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export async function enqueueJob(
  jobType: JobType,
  payload: JobPayload = {},
  options: {
    priority?: number;
    scheduledAt?: Date;
    maxRetries?: number;
  } = {}
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc("enqueue_job", {
      p_job_type: jobType,
      p_payload: payload,
      p_priority: options.priority || 5,
      p_scheduled_at: options.scheduledAt?.toISOString() || new Date().toISOString(),
    });

    if (error) {
      logger.error("Failed to enqueue job", error, { jobType, payload });
      return null;
    }

    logger.info("Job enqueued", { jobId: data, jobType, priority: options.priority || 5 });
    return data;
  } catch (error) {
    logger.error("Enqueue job error", error, { jobType });
    return null;
  }
}

export async function getNextJob(): Promise<Job | null> {
  try {
    const { data, error } = await supabase.rpc("get_next_job");

    if (error) {
      logger.error("Failed to get next job", error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const job = data[0];
    return {
      id: job.id,
      jobType: job.job_type,
      payload: job.payload,
      status: job.status,
      priority: job.priority,
      scheduledAt: new Date(job.scheduled_at),
      startedAt: job.started_at ? new Date(job.started_at) : undefined,
      completedAt: job.completed_at ? new Date(job.completed_at) : undefined,
      errorMessage: job.error_message,
      retryCount: job.retry_count,
      maxRetries: job.max_retries,
    };
  } catch (error) {
    logger.error("Get next job error", error);
    return null;
  }
}

export async function completeJob(jobId: string, success: boolean, errorMessage?: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("complete_job", {
      p_job_id: jobId,
      p_success: success,
      p_error_message: errorMessage || null,
    });

    if (error) {
      logger.error("Failed to complete job", error, { jobId, success });
    } else {
      logger.info("Job completed", { jobId, success });
    }
  } catch (error) {
    logger.error("Complete job error", error, { jobId });
  }
}

export async function processJob(job: Job): Promise<boolean> {
  logger.info("Processing job", { jobId: job.id, jobType: job.jobType });

  try {
    switch (job.jobType) {
      case "aggregate_reports":
        await handleAggregateReports(job.payload);
        break;

      case "cleanup_temp_data":
        await handleCleanupTempData(job.payload);
        break;

      case "send_email":
        await handleSendEmail(job.payload);
        break;

      case "process_health_data":
        await handleProcessHealthData(job.payload);
        break;

      case "rotate_keys":
        await handleRotateKeys(job.payload);
        break;

      case "archive_logs":
        await handleArchiveLogs(job.payload);
        break;

      default:
        throw new Error(`Unknown job type: ${job.jobType}`);
    }

    return true;
  } catch (error) {
    logger.error("Job processing failed", error, { jobId: job.id, jobType: job.jobType });
    return false;
  }
}

async function handleAggregateReports(payload: JobPayload): Promise<void> {
  logger.debug("Aggregating reports", payload);
}

async function handleCleanupTempData(payload: JobPayload): Promise<void> {
  const retentionDays = payload.retentionDays || 7;
  logger.debug("Cleaning up temp data", { retentionDays });

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  await supabase.from("analytics_events").delete().lt("created_at", cutoffDate.toISOString());
}

async function handleSendEmail(payload: JobPayload): Promise<void> {
  logger.debug("Sending email", { to: payload.to, subject: payload.subject });
}

async function handleProcessHealthData(payload: JobPayload): Promise<void> {
  logger.debug("Processing health data", { userId: payload.userId });
}

async function handleRotateKeys(payload: JobPayload): Promise<void> {
  logger.debug("Rotating keys", payload);
}

async function handleArchiveLogs(payload: JobPayload): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);

  logger.debug("Archiving logs", { cutoffDate });
}

export async function runWorker(concurrency: number = 3): Promise<void> {
  logger.info("Worker started", { concurrency });

  const workers: Promise<void>[] = [];

  for (let i = 0; i < concurrency; i++) {
    workers.push(workerLoop(i));
  }

  await Promise.all(workers);
}

async function workerLoop(workerId: number): Promise<void> {
  while (true) {
    try {
      const job = await getNextJob();

      if (!job) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      logger.info(`Worker ${workerId} processing job`, { jobId: job.id, jobType: job.jobType });

      const success = await processJob(job);
      await completeJob(job.id, success, success ? undefined : "Processing failed");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error(`Worker ${workerId} error`, error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
