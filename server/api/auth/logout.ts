import { withAuth } from "/utils/auth.server";
import { dbDeleteSession } from "/server/database/queries/sessions";
import { apiSuccess } from "/utils/api.server";
import type { BunRequest } from "bun";

export default {
  async POST(req: BunRequest) {
    return withAuth(req, async () => {
      const sid = req.cookies?.get("appstudo-auth");
      if (sid) {
        dbDeleteSession(sid);
      }
      req.cookies?.delete("appstudo-auth");
      return apiSuccess({ message: "Logged out successfully" });
    });
  },
};
