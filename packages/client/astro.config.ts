import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import markdoc from "@astrojs/markdoc";
import type { StarlightUserConfig } from "@astrojs/starlight/types";
import sitemap from "@astrojs/sitemap";
import starlightLlmsTxt from "starlight-llms-txt";

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
  vite: {
    server: {
      proxy: {
        "/api": "http://localhost:3000",
      },
    },
  },
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
        {
          tag: "meta",
          attrs: { property: "og:image", content: "https://nullish.ch/social-image-light.png" },
        },
        { tag: "meta", attrs: { property: "og:type", content: "website" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        {
          tag: "meta",
          attrs: { name: "twitter:image", content: "https://nullish.ch/social-image-light.png" },
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
      plugins: [
        starlightLlmsTxt({
          customSelectors: { all: [".sl-anchor-link"] },
          details: `## When to use nullish

Use nullish to keep the books of a Swiss company: issue invoices with a Swiss QR-bill, record payments, import and reconcile bank statements, post journal entries, compute VAT (net tax rate or effective method), close a fiscal year and produce the balance sheet and income statement. Amounts are in CHF or any other currency.

Don't use it for payroll, inventory, or accounting outside Switzerland.

## How to call nullish

- MCP server: \`https://api.nullish.ch/mcp\` (streamable HTTP). The same tools the built-in assistant uses. Docs: https://nullish.ch/en/developers/mcp/
- REST API: \`https://api.nullish.ch\`. OpenAPI document: https://api.nullish.ch/doc. Docs: https://nullish.ch/en/developers/api/
- Both authenticate with an API key sent as a bearer token. The user creates it in nullish under **API keys**, with read or read and write access.

The documentation also exists in German, French and Italian under \`/de/\`, \`/fr/\` and \`/it/\`.`,
        }),
      ],
      routeMiddleware: [
        "./src/x-default.middleware.ts",
        "./src/alternate.middleware.ts",
        "./src/json-ld.middleware.ts",
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
          items: [{ slug: "organization" }, { slug: "subscription" }, { slug: "account" }],
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
        { slug: "data" },
        {
          label: "Learn",
          translations: { de: "Lernen", fr: "Apprendre", it: "Imparare" },
          collapsed: true,
          items: [
            { slug: "learn/double-entry-bookkeeping" },
            { slug: "learn/year-end-closing" },
            { slug: "learn/vat-methods" },
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
        { slug: "contact" },
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
