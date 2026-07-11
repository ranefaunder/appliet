import { db } from "/server/database/db"

export type RateLimitEntry = {
  ip_address: string
  action: string
  attempts: number
  first_attempt: string
  last_attempt: string
  blocked_until?: string
}

export const dbGetRateLimit = (ip: string, action: string): RateLimitEntry | null =>
  db.query<RateLimitEntry, [string, string]>(`
    SELECT * FROM rate_limits 
    WHERE ip_address = ? AND action = ?
  `).get(ip, action) ?? null

export const dbCreateRateLimit = (data: {
  ip: string
  action: string
  attempts: number
  firstAttempt: string
  lastAttempt: string
}) =>
  db.query(`
    INSERT INTO rate_limits (ip_address, action, attempts, first_attempt, last_attempt)
    VALUES (?, ?, ?, ?, ?)
  `).run(data.ip, data.action, data.attempts, data.firstAttempt, data.lastAttempt)

export const dbUpdateRateLimit = (ip: string, action: string, data: {
  attempts?: number
  firstAttempt?: string
  lastAttempt?: string
  blockedUntil?: string | null
}) =>
  db.query(`
    UPDATE rate_limits 
    SET attempts = COALESCE(?, attempts),
        first_attempt = COALESCE(?, first_attempt),
        last_attempt = COALESCE(?, last_attempt),
        blocked_until = ?
    WHERE ip_address = ? AND action = ?
  `).run(
    data.attempts ?? null,
    data.firstAttempt ?? null,
    data.lastAttempt ?? null,
    data.blockedUntil ?? null,
    ip,
    action
  )

