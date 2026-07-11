import { join } from "node:path"
import { Database } from "bun:sqlite"
import { runMigrations } from "./migrate"

export const db = new Database(join(import.meta.dir, "app.db"))
db.run("PRAGMA foreign_keys = ON;")

export async function initDb() {
  await runMigrations(db)
}

