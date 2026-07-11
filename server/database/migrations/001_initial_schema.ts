import type { Database } from "bun:sqlite";

export default function (db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      nickname TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT,
      marketing_opt_in INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS login_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      is_used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      ip_address TEXT NOT NULL,
      action TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 1,
      first_attempt TEXT NOT NULL,
      last_attempt TEXT NOT NULL,
      blocked_until TEXT,
      PRIMARY KEY (ip_address, action)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS apps (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL UNIQUE,
      visibility TEXT NOT NULL DEFAULT 'private',
      source_app_id TEXT,
      config_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      published_at TEXT,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (source_app_id) REFERENCES apps(id) ON DELETE SET NULL
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_apps_owner ON apps(owner_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_apps_visibility ON apps(visibility)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`);
}
