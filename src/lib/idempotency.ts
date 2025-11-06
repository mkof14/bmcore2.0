const processedEvents = new Set<string>();
const CLEANUP_INTERVAL = 10 * 60 * 1000;
const EVENT_TTL = 60 * 60 * 1000;

interface EventRecord {
  id: string;
  timestamp: number;
}

const eventTimestamps = new Map<string, number>();

export function isEventProcessed(eventId: string): boolean {
  if (!eventId) return false;
  return processedEvents.has(eventId);
}

export function markEventProcessed(eventId: string): void {
  if (!eventId) return;

  processedEvents.add(eventId);
  eventTimestamps.set(eventId, Date.now());
}

export function once(eventId?: string): boolean {
  if (!eventId) return true;

  if (isEventProcessed(eventId)) {
    return false;
  }

  markEventProcessed(eventId);
  return true;
}

function cleanupExpiredEvents(): void {
  const now = Date.now();
  const expiredIds: string[] = [];

  eventTimestamps.forEach((timestamp, id) => {
    if (now - timestamp > EVENT_TTL) {
      expiredIds.push(id);
    }
  });

  expiredIds.forEach((id) => {
    processedEvents.delete(id);
    eventTimestamps.delete(id);
  });

  if (expiredIds.length > 0) {
    console.log(`[Idempotency] Cleaned up ${expiredIds.length} expired events`);
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEvents, CLEANUP_INTERVAL);
}

export function getStats() {
  return {
    totalProcessed: processedEvents.size,
    oldestEvent: Math.min(...Array.from(eventTimestamps.values())),
    newestEvent: Math.max(...Array.from(eventTimestamps.values())),
  };
}

export function clearAll(): void {
  processedEvents.clear();
  eventTimestamps.clear();
}
