import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { i18n } from "./components/i18n/i18n.ts";

export const onRequest = defineRouteMiddleware((context) => {
  const { site, url } = context;
  const { entry, locale, head } = context.locals.starlightRoute;

  if (site === undefined || entry.id !== locale) {
    return;
  }

  const { lang, structuredData } = i18n(locale);
  const tagline = entry.data.hero?.tagline?.replace(/<br\s*\/?>/g, " ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "nullish",
    url: new URL(url.pathname, site).href,
    description: [entry.data.title, tagline].filter(Boolean).join(". "),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: lang,
    keywords: structuredData.keywords.join(", "),
    sameAs: ["https://github.com/usenullish"],
  };

  head.push({
    tag: "script",
    attrs: { type: "application/ld+json" },
    content: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  });
});
