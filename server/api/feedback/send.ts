import type { Language, TranslationKey } from "/types/i18n-types";
import { t } from "/utils/i18n";
import { getLang } from "/utils/lang";
import { AVAILABLE_LANGUAGES } from "/i18n/languages";
import { checkRateLimit } from "/utils/rate-limit.server";
import { getClientIP } from "/utils/request.server";
import { dbCreateFeedback } from "/server/database/queries/feedback";
import { createFeedbackNotificationEmail, sendEmailSafe } from "/utils/email.server";
import { apiError, apiSuccess } from "/utils/api.server";
import type { BunRequest } from "bun";

const FOUNDER_EMAIL = "rane@faunder.fi";
const MAX_MESSAGE_LEN = 10000;
const MAX_PAGE_URL_LEN = 2048;

export default {
  /** POST – tallentaa palautteen ja lähettää kopion perustajalle Resendillä. */
  async POST(req: BunRequest) {
    const language = (getLang(req.url) ?? "en") as Language;
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError({ code: "INVALID_JSON" });
    }
    const b = body as { message?: unknown; pageUrl?: unknown };
    const message = typeof b.message === "string" ? b.message.trim() : "";
    const pageUrl =
      typeof b.pageUrl === "string" ? b.pageUrl.trim().slice(0, MAX_PAGE_URL_LEN) : "";

    if (!message || message.length > MAX_MESSAGE_LEN) {
      return apiError({
        code: "INVALID_MESSAGE",
        message: t("Feedback message is required.", language),
      });
    }
    if (!pageUrl) {
      return apiError({
        code: "INVALID_PAGE_URL",
        message: t("Page URL is required.", language),
      });
    }

    const langKey: Language = language in AVAILABLE_LANGUAGES ? language : "en";

    const clientIP = getClientIP(req);
    const isAllowed = checkRateLimit(clientIP, "feedback_send", 5, 10);
    if (!isAllowed) {
      return apiError({
        code: "RATE_LIMIT_EXCEEDED",
        message: t("Too many requests. Wait a moment before retrying.", language),
        status: 429,
      });
    }

    const row = dbCreateFeedback({
      message,
      pageUrl,
      language: langKey,
    });

    const emailContent = createFeedbackNotificationEmail({
      message,
      pageUrl,
      language: langKey,
      feedbackId: row.id,
      createdAt: row.createdAt,
    });
    const sent = await sendEmailSafe(FOUNDER_EMAIL, emailContent.subject, emailContent.text);
    if (!sent.ok) {
      const msg = sent.error ?? "";
      const errorKey: TranslationKey =
        msg.includes("Too many") || msg.includes("rate limit")
          ? "Too many requests. Wait a moment before retrying."
          : msg.includes("Email service") || msg.includes("not configured")
            ? "Email service unavailable. Try again later."
            : "Feedback could not be sent. Please try again.";
      return apiError({
        code: "EMAIL_SEND_FAILED",
        message: t(errorKey, language),
        status: 500,
      });
    }

    return apiSuccess();
  },
};
