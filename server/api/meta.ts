import { getClientMeta } from "/utils/meta.server";
import { apiSuccess } from "/utils/api.server";
import type { BunRequest } from "bun";

export default {
  /** GET – Palauttaa sivun meta-tiedot (title, …) polun perusteella. Käytetään client-puolen title-päivitykseen. */
  async GET(req: BunRequest) {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const fullUrl = `${url.origin}${path}`;
    const data = await getClientMeta({ url: fullUrl } as Parameters<typeof getClientMeta>[0]);
    return apiSuccess({ data });
  },
};
