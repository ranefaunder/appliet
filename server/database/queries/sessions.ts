import { db } from "/server/database/db"

export type Session = {
  id: string
  user_id: string
  created_at: string
  expires_at: string
}

export const dbGetSession = (id: string): Session | null =>
  db.query<Session, [string]>("SELECT id, user_id, created_at, expires_at FROM sessions WHERE id = ?").get(id) ?? null

export const dbCreateSession = (data: { id: string, userId: string, expiresAt: string }) =>
  db.query("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(data.id, data.userId, data.expiresAt)

export const dbUpdateSessionExpiresAt = (id: string, expiresAt: string) =>
  db.query("UPDATE sessions SET expires_at = ? WHERE id = ?").run(expiresAt, id)

export const dbDeleteSession = (id: string) =>
  db.query("DELETE FROM sessions WHERE id = ?").run(id)

