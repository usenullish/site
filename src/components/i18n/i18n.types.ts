/**
 * Auto-generated definitions file ("pnpm i18n")
 */
import type { Languages } from "./languages.ts";

export type I18nNav = { features: string; docs: string };

export type I18nHero = {
  label: string;
  title: string[];
  badge: string;
  ledger: { debit: string; credit: string; balance: string };
  assistant: { question: string; thinking: string; thought: string; detail: string };
};

export type I18nVideo = { label: string; description: string };

export type I18nBoring = {
  label: string;
  title: string;
  groups: { name: string; items: string[] }[];
};

export type I18nLessBoring = {
  label: string;
  title: string;
  punchline: string;
  prompt: string;
  cards: { title: string; text: string }[];
};

export type I18nSwiss = { title: string; text: string }[];

export type I18nFeatures = { groups: { name: string; items: { title: string; text: string }[] }[] };

export type I18nFooter = {
  product: string;
  getStarted: string;
  features: string;
  becomeTester: string;
  data: string;
  status: string;
  migrate: string;
  docs: string;
  assistant: string;
  billing: string;
  templates: string;
  banking: string;
  accounting: string;
  developers: string;
  selfHosting: string;
  resources: string;
  contact: string;
  legal: string;
  terms: string;
  privacy: string;
  impressum: string;
};

export type I18nStructuredData = { keywords: string[] };

export interface I18n {
  lang: Languages;
  nav: I18nNav;
  hero: I18nHero;
  video: I18nVideo;
  boring: I18nBoring;
  lessBoring: I18nLessBoring;
  swiss: I18nSwiss;
  features: I18nFeatures;
  footer: I18nFooter;
  structuredData: I18nStructuredData;
}
