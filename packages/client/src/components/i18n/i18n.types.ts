/**
 * Auto-generated definitions file ("pnpm i18n")
 */
import type { Languages } from "./languages.ts";

export type I18nNav = { features: string; pricing: string; docs: string };

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

export type I18nContact = {
  label: { name: string; email: string; company: string; message: string };
  action: { send: string };
  status: { sent: string; error: string; limit: string };
};

export type I18nPricing = {
  billing: { label: string; year: string; month: string };
  perMonth: string;
  perMonthBilledYearly: string;
  customPricing: string;
  vatExcluded: string;
  cloud: { description: string; features: string[]; action: string };
  instance: { description: string; features: string[]; action: string };
  onPrem: { description: string; features: string[]; action: string };
};

export type I18nFooter = {
  product: string;
  getStarted: string;
  features: string;
  pricing: string;
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
  contact: I18nContact;
  pricing: I18nPricing;
  footer: I18nFooter;
  structuredData: I18nStructuredData;
}
