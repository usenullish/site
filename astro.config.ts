import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import markdoc from "@astrojs/markdoc";
import type { StarlightUserConfig } from "@astrojs/starlight/types";
import sitemap from "@astrojs/sitemap";

const locales = {
  en: {
    label: "English",
    lang: "en",
  },
  de: {
    label: "Deutsch",
    lang: "de",
  },
  fr: {
    label: "Français",
    lang: "fr",
  },
  it: {
    label: "Italiano",
    lang: "it",
  },
} satisfies StarlightUserConfig["locales"];

const title = "nullish";
const description =
  "Invoicing, banking and accounting. With an AI assistant. Open-source, self-hostable.";

export default defineConfig({
  site: "https://nullish.ch",
  output: "static",
  outDir: "dist",
  redirects: {
    "/": "/en/",
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    markdoc(),
    sitemap(),
    starlight({
      title,
      description,
      head: [
        { tag: "meta", attrs: { property: "og:title", content: title } },
        { tag: "meta", attrs: { property: "og:description", content: description } },
        {
          tag: "meta",
          attrs: { property: "og:image", content: "https://nullish.ch/social-image.jpg" },
        },
        { tag: "meta", attrs: { property: "og:type", content: "website" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:title", content: title } },
        { tag: "meta", attrs: { name: "twitter:description", content: description } },
        {
          tag: "meta",
          attrs: { name: "twitter:image", content: "https://nullish.ch/social-image.jpg" },
        },
        ...(process.env.NODE_ENV === "production"
          ? [
              {
                tag: "script" as const,
                attrs: {
                  type: "module",
                  async: true,
                  src: "https://nullish.ch/static/yawa.js",
                },
              },
            ]
          : []),
      ],
      defaultLocale: "en",
      locales,
      logo: {
        light: "./src/assets/logo-text-light.svg",
        dark: "./src/assets/logo-text-dark.svg",
        replacesTitle: true,
      },
      lastUpdated: true,
      favicon: "/favicon.svg",
      customCss: [
        "@fontsource-variable/jetbrains-mono/wght.css",
        "./src/styles/font.css",
        "./src/styles/colors.css",
        "./src/styles/layout.css",
        "./src/styles/header.css",
        "./src/styles/sidebar.css",
        "./src/styles/button.css",
        "./src/styles/focus.css",
      ],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/usenullish/nullish" }],
      expressiveCode: {
        themes: ["synthwave-84"],
      },
      sidebar: [
        { slug: "getting-started" },
        { slug: "assistant" },
        {
          label: "Billing",
          translations: { de: "Rechnungsstellung", fr: "Facturation", it: "Fatturazione" },
          collapsed: true,
          items: [{ slug: "billing/clients" }, { slug: "billing/invoices" }],
        },
        {
          label: "Banking",
          translations: { de: "Bank", fr: "Banque", it: "Banca" },
          collapsed: true,
          items: [
            { slug: "banking/bank-accounts" },
            { slug: "banking/import-statements" },
            { slug: "banking/reconciliation" },
          ],
        },
        {
          label: "Accounting",
          translations: { de: "Buchhaltung", fr: "Comptabilité", it: "Contabilità" },
          collapsed: true,
          items: [
            { slug: "accounting/chart-of-accounts" },
            { slug: "accounting/journal" },
            { slug: "accounting/periods" },
            { slug: "accounting/vat" },
            { slug: "accounting/reports" },
          ],
        },
        { slug: "team" },
        {
          label: "Settings",
          translations: { de: "Einstellungen", fr: "Paramètres", it: "Impostazioni" },
          collapsed: true,
          items: [{ slug: "organization" }, { slug: "account" }],
        },
        {
          label: "Templates",
          translations: { de: "Vorlagen", fr: "Modèles", it: "Modelli" },
          collapsed: true,
          items: [{ slug: "templates/document-templates" }, { slug: "templates/email-templates" }],
        },
        {
          label: "Migration",
          translations: { de: "Migration", fr: "Migration", it: "Migrazione" },
          collapsed: true,
          items: [
            {
              label: "From Bexio",
              translations: { de: "Von Bexio", fr: "Depuis Bexio", it: "Da Bexio" },
              slug: "migration/bexio",
            },
          ],
        },
        {
          label: "Developers",
          translations: { de: "Entwickler", fr: "Développeurs", it: "Sviluppatori" },
          collapsed: true,
          items: [
            { slug: "developers/api" },
            { slug: "developers/mcp" },
            { slug: "developers/self-hosting" },
            { slug: "security" },
          ],
        },
      ],
      components: {
        Hero: "./src/components/landing/Hero.astro",
        Footer: "./src/components/landing/Footer.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
        LanguageSelect: "./src/components/LanguageSelect.astro",
        SocialIcons: "./src/components/SocialIcons.astro",
      },
    }),
  ],
});
