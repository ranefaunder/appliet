import type { BunRequest } from "bun";
import { getAuthenticatedUser } from "/utils/auth.server";
import { apiSuccess } from "/utils/api.server";
import { dbListExploreApps, dbListUserApps } from "/server/database/queries/apps";

export default {
  async GET(req: BunRequest) {
    const user = getAuthenticatedUser(req);
    const url = new URL(req.url);
    const scope = url.searchParams.get("scope");

    if (scope === "mine" && user) {
      return apiSuccess({ data: { apps: dbListUserApps(user.id) } });
    }

    return apiSuccess({ data: { apps: dbListExploreApps() } });
  },
};
