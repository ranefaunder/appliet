import type { BunRequest } from "bun";
import { withAuth } from "/utils/auth.server";
import { apiError, apiSuccess } from "/utils/api.server";
import { dbGetAppBySlug } from "/server/database/queries/apps";
import { dbListAppMessages } from "/server/database/queries/app-messages";

export default {
  async GET(req: BunRequest) {
    return withAuth(req, async (user) => {
      const url = new URL(req.url);
      const slug = url.searchParams.get("slug")?.trim();
      if (!slug) return apiError({ code: "SLUG_REQUIRED" });

      const row = dbGetAppBySlug(slug);
      if (!row) return apiError({ code: "NOT_FOUND", status: 404 });
      if (row.owner_id !== user.id) return apiError({ code: "FORBIDDEN", status: 403 });

      return apiSuccess({ data: { messages: dbListAppMessages(row.id) } });
    });
  },
};
