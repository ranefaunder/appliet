import type { Database } from "bun:sqlite";

export default function (db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS app_records (
      id TEXT PRIMARY KEY,
      app_id TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
    )
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_app_records_app ON app_records(app_id)`);
}
