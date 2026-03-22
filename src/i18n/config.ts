export const locales = ['nl', 'en', 'de', 'fr', 'es', 'pt', 'ar', 'zh', 'uk', 'hi', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'nl';

export const rtlLocales: Locale[] = ['ar'];

export const localeNames: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  ar: 'العربية',
  zh: '中文',
  uk: 'Українська',
  hi: 'हिन्दी',
  tr: 'Türkçe',
};
