/**
 * Auto-generated definitions file ("pnpm i18n")
 */
import type { Languages } from "./languages.ts";

export type I18nHero = { label: string; title: string[]; badge: string };

export type I18nVideo = { label: string; description: string };

export type I18nBoring = {
  label: string;
  title: string;
  groups: { name: string; items: string[] }[];
};

export type I18nLessBoring = {
  label: string;
  title: string;
  cards: { title: string; text: string }[];
};

export type I18nSwiss = { title: string; text: string }[];

export type I18nFooter = {
  product: string;
  getStarted: string;
  becomeTester: string;
  status: string;
  migrate: string;
  docs: string;
  assistant: string;
  billing: string;
  banking: string;
  accounting: string;
  developers: string;
  selfHosting: string;
  community: string;
};

export interface I18n {
  lang: Languages;
  hero: I18nHero;
  video: I18nVideo;
  boring: I18nBoring;
  lessBoring: I18nLessBoring;
  swiss: I18nSwiss;
  footer: I18nFooter;
}
