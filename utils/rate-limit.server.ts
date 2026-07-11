import { dbGetRateLimit, dbCreateRateLimit, dbUpdateRateLimit } from "/server/database/queries/rate-limits";
import type { RateLimitEntry } from "/server/database/queries/rate-limits";

// Lightweight persistent rate limiter backed by SQLite
export function checkRateLimit(
  ip: string, 
  action: string, 
  maxAttempts: number = 3, 
  windowMinutes: number = 2
): boolean {
  try {
    // Relax limits for development (by checking if IP starts with 'fingerprint:' which is our fallback)
    // In production, real IPs or fingerprints will be used
    if (process.env.NODE_ENV === 'development' && (ip === 'localhost' || ip.startsWith('fingerprint:'))) {
      maxAttempts = maxAttempts * 10;
    }

    const now = new Date().toISOString();
    const windowStartIso = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    // Get current record
    const existing = dbGetRateLimit(ip, action);

    if (!existing) {
      // Create a fresh record
      dbCreateRateLimit({
        ip,
        action,
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return true;
    }

    // Blocked window still active
    if (existing.blocked_until && existing.blocked_until > now) {
      return false;
    }

    // Reset window
    if (existing.first_attempt < windowStartIso) {
      dbUpdateRateLimit(ip, action, {
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now,
        blockedUntil: null
      });
      return true;
    }

    // Exceeded attempts → block for windowMinutes
    if (existing.attempts >= maxAttempts) {
      const blockUntil = new Date(Date.now() + windowMinutes * 60 * 1000).toISOString();
      dbUpdateRateLimit(ip, action, {
        blockedUntil: blockUntil
      });
      return false;
    }

    // Increment
    dbUpdateRateLimit(ip, action, {
      attempts: existing.attempts + 1,
      lastAttempt: now
    });

    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail closed on storage errors
    return false;
  }
}