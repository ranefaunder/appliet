import { db } from "/server/database/db"

export type LoginCodeInDatabase = {
  id: number
  email: string
  code: string
  expires_at: string
  is_used: number
  created_at: string
}

export const dbGetLoginCode = (email: string, code: string): LoginCodeInDatabase | null =>
  db.query<LoginCodeInDatabase, [string, string, string]>(`
    SELECT * FROM login_codes 
    WHERE email = ? AND UPPER(code) = ? AND is_used = 0 AND expires_at > ?
    ORDER BY created_at DESC
    LIMIT 1
  `).get(email, code.toUpperCase(), new Date().toISOString()) ?? null

export const dbGetUsedLoginCode = (email: string, code: string): LoginCodeInDatabase | null =>
  db.query<LoginCodeInDatabase, [string, string]>(`
    SELECT * FROM login_codes 
    WHERE email = ? AND code = ? AND is_used = 1
    ORDER BY created_at DESC
    LIMIT 1
  `).get(email, code) ?? null

export const dbGetLatestLoginCode = (email: string): LoginCodeInDatabase | null =>
  db.query<LoginCodeInDatabase, [string, string]>(`
    SELECT * FROM login_codes 
    WHERE email = ? AND expires_at > ? AND is_used = 0
    ORDER BY created_at DESC
    LIMIT 1
  `).get(email, new Date().toISOString()) ?? null

export const dbCreateLoginCode = (data: { email: string, code: string, expiresAt: string }) =>
  db.query("INSERT INTO login_codes (email, code, expires_at) VALUES (?, ?, ?)").run(
    data.email,
    data.code.toUpperCase(),
    data.expiresAt
  )

export const dbUpdateLoginCodeUsed = (id: number) =>
  db.query("UPDATE login_codes SET is_used = 1 WHERE id = ?").run(id)

export const dbDeleteExpiredLoginCodes = () => {
  const now = new Date().toISOString()
  return db.query("DELETE FROM login_codes WHERE expires_at < ?").run(now)
}

