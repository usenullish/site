import de from "../../assets/i18n/de.json";
import en from "../../assets/i18n/en.json";
import fr from "../../assets/i18n/fr.json";
import it from "../../assets/i18n/it.json";
import type { I18n } from "./i18n.types.ts";
import type { Languages } from "./languages.ts";

const translations: Record<Languages, Omit<I18n, "lang">> = { en, de, fr, it };

const isLanguage = (locale: string | undefined): locale is Languages =>
  locale !== undefined && locale in translations;

export const i18n = (locale: string | undefined): I18n => {
  const lang: Languages = isLanguage(locale) ? locale : "en";
  return { lang, ...translations[lang] };
};
