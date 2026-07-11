import type { Language } from "/types/i18n-types";
import type { AppSummary } from "/types/app-types";
import type { AppDetail } from "/types/app-config-types";
import type { AuthenticatedUser } from "/types/user-types";

export type InitialConfig = {
  staticRoot: string;
};

export type SsrContext = {
  initialConfig?: InitialConfig;
  initialUser?: AuthenticatedUser | null;
  language?: Language;
  initialTranslations?: Record<string, string>;
  initialApps?: AppSummary[];
  initialApp?: AppDetail | null;
};
