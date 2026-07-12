import type { Database } from "bun:sqlite";

export default function (db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS app_edit_messages (
      id TEXT PRIMARY KEY,
      app_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
    )
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_app_edit_messages_app ON app_edit_messages(app_id, created_at)`);
}
