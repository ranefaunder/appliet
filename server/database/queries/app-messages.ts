import { db } from "/server/database/db";
import type { AppEditMessage, AppEditRole } from "/types/app-config-types";

type MessageRow = {
  id: string;
  app_id: string;
  role: AppEditRole;
  content: string;
  created_at: string;
};

function toMessage(row: MessageRow): AppEditMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

export const dbListAppMessages = (appId: string): AppEditMessage[] =>
  db
    .query<MessageRow, [string]>(
      "SELECT * FROM app_edit_messages WHERE app_id = ? ORDER BY created_at ASC, rowid ASC",
    )
    .all(appId)
    .map(toMessage);

export const dbAddAppMessage = (data: {
  id: string;
  appId: string;
  role: AppEditRole;
  content: string;
}): void => {
  const now = new Date().toISOString();
  db.query(
    `INSERT INTO app_edit_messages (id, app_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)`,
  ).run(data.id, data.appId, data.role, data.content, now);
};
