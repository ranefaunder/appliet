import type { ApiError, ApiSuccess } from "/types/api-types";

/**
 * Palauttaa JSON-virhevastauksen `{ success: false, error: { code, … }, status }`.
 *
 * TEKOÄLY / KIRJOITUSSÄÄNTÖ — `message`:
 * - Lisää `message` vain kun asiakas näyttää sen käyttäjälle (toast, alert, lomakkeen virheteksti, modaali).
 * - Älä lisää `message`: jos virhe käsitellään hiljaisesti (tyhjä tila, uudelleenohjaus, lokitus) tai UI käyttää vain `code` / HTTP-statusia.
 * - Käyttäjälle näkyvä teksti: käytä `t("…", req)` kun käännös on olemassa; muuten lyhyt selvä englanti vain jos UI todella näyttää sen.
 * - `code` (ja tarvittaessa `status`) pitää aina riittää logiikkaan; `message` on valinnainen käyttöliittymäkerros.
 */
export function apiError(params: {
  code: string;
  message?: string;
  details?: unknown;
  status?: number;
}): Response {
  const status = params.status ?? 400;
  const body: ApiError = {
    success: false,
    error: {
      code: params.code,
      ...(params.message !== undefined ? { message: params.message } : {}),
      ...(params.details !== undefined ? { details: params.details } : {}),
    },
    status,
  };
  return Response.json(body, { status });
}

/** `Response` JSON-vastauksella `ApiSuccess<T>`. Ilman `data`a vastauksen `data` on `{}`. */
export function apiSuccess<T extends object = Record<string, never>>(params?: {
  data?: T;
  message?: string;
  status?: number;
}): Response {
  const { data = {} as T, message, status = 200 } = params ?? {};
  const body: ApiSuccess<T> = {
    success: true,
    data,
    status,
    ...(message !== undefined ? { message } : {}),
  };
  return Response.json(body, { status });
}
