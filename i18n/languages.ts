export const AVAILABLE_LANGUAGES = {
  fi: { name: 'Finnish', nativeName: 'Suomi' },
  en: { name: 'English', nativeName: 'English' },
  sv: { name: 'Swedish', nativeName: 'Svenska' },
  zh: { name: 'Chinese', nativeName: '中文' },
  es: { name: 'Spanish', nativeName: 'Español' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  de: { name: 'German', nativeName: 'Deutsch' },
  fr: { name: 'French', nativeName: 'Français' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  ko: { name: 'Korean', nativeName: '한국어' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  // no: { name: 'Norwegian', nativeName: 'Norsk' },
  // da: { name: 'Danish', nativeName: 'Dansk' },
  // is: { name: 'Icelandic', nativeName: 'Íslenska' },
  // uk: { name: 'Ukrainian', nativeName: 'Українська' },
  // bn: { name: 'Bengali', nativeName: 'বাংলা' },
  // tr: { name: 'Turkish', nativeName: 'Türkçe' },
  // id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  // vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  // th: { name: 'Thai', nativeName: 'ไทย' },
  // tl: { name: 'Filipino', nativeName: 'Filipino' },
  // ms: { name: 'Malay', nativeName: 'Bahasa Melayu' },
  // pl: { name: 'Polish', nativeName: 'Polski' }
} as const;

export type Language = keyof typeof AVAILABLE_LANGUAGES;

/** Juuriohjauksen ja `hreflang="x-default"` -oletus (root.ts). */
export const DEFAULT_LANGUAGE: Language = "en";
