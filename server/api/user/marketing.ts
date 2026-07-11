import type { BunRequest } from "bun";
import { withAuth } from "/utils/auth.server";
import { dbUpdateUserMarketingOptIn } from "/server/database/queries/users";
import { apiError, apiSuccess } from "/utils/api.server";

export default {
  async POST(req: BunRequest) {
    return withAuth(req, async (user) => {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return apiError({ code: "INVALID_JSON" });
      }
      const marketingOptIn = (body as { marketingOptIn?: boolean }).marketingOptIn === true;
      dbUpdateUserMarketingOptIn(user.id, marketingOptIn);
      return apiSuccess({ data: { marketingOptIn } });
    });
  },
};
