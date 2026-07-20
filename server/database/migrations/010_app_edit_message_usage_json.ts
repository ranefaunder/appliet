import type { Database } from "bun:sqlite";

/** Per-tool AI usage breakdown for edit chat messages (JSON array). */
export default function (db: Database) {
  db.run(`ALTER TABLE app_edit_messages ADD COLUMN usage_json TEXT`);
}
