import { randomInt } from "crypto";
import type { Language, TranslationKey } from "/types/i18n-types";
import { t } from "/utils/i18n";
import { createLoginCodeEmail, sendEmailSafe } from "/utils/email.server";
import { checkRateLimit } from "/utils/rate-limit.server";
import { getClientIP } from "/utils/request.server";
import { dbDeleteExpiredLoginCodes, dbCreateLoginCode } from "/server/database/queries/login-codes";
import { dbGetUserByEmail } from "/server/database/queries/users";
import { apiError, apiSuccess } from "/utils/api.server";
import type { BunRequest } from "bun";

function validateEmail(email: string): TranslationKey | null {
  if (!email || typeof email !== "string" || email.length > 254)
    return email?.length > 254 ? "Email address is too long" : "Email address required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address";
  return null;
}

/** POST – Lähetä kirjautumiskoodi olemassa olevalle käyttäjälle. */
export default {
  async POST(req: BunRequest) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError({ code: "INVALID_JSON" });
    }
    const b = body as { email?: string; language?: string };
    const email = typeof b?.email === "string" ? b.email.trim().toLowerCase() : "";
    const language = (b?.language || "en") as Language;

    const emailError = validateEmail(email);
    if (emailError)
      return apiError({
        code: "INVALID_EMAIL",
        message: t(emailError, language),
      });

    const clientIP = getClientIP(req);
    const isAllowed = checkRateLimit(clientIP, "login_code_request", 3, 10);
    if (!isAllowed) {
      return apiError({
        code: "RATE_LIMIT_EXCEEDED",
        message: t("Too many requests. Wait a moment before retrying.", language),
        status: 429,
      });
    }

    const existingUser = dbGetUserByEmail(email);
    if (!existingUser) {
      return apiError({
        code: "USER_NOT_FOUND",
        message: t("User not found. Register first.", language),
        status: 404,
      });
    }

    dbDeleteExpiredLoginCodes();

    let code = "";
    for (let i = 0; i < 6; i++) {
      code += randomInt(0, 10);
    }
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    dbCreateLoginCode({ email, code, expiresAt });

    const emailContent = createLoginCodeEmail(code, language);
    const sent = await sendEmailSafe(email, emailContent.subject, emailContent.text);
    if (!sent.ok) {
      const msg = sent.error ?? "";
      const errorKey: TranslationKey = msg.includes("Too many") || msg.includes("rate limit")
        ? "Too many requests. Wait a moment before retrying."
        : msg.includes("Email service")
          ? "Email service unavailable. Try again later."
          : "Error sending code. Try again.";
      return apiError({
        code: "EMAIL_SEND_FAILED",
        message: t(errorKey, language),
        status: 500,
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.info(`🔑 DEVELOPMENT: Login code for ${email}: ${code}`);
    }

    return apiSuccess({
      data: {
        debugCode: process.env.NODE_ENV === "development" ? code : undefined,
      },
    });
  },
};
