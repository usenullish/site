import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { i18n } from "../components/i18n/i18n.ts";

export const onRequest = defineRouteMiddleware((context) => {
  const { site, url } = context;
  const { entry, locale, head } = context.locals.starlightRoute;

  if (site === undefined || entry.id !== locale) {
    return;
  }

  const { lang, structuredData } = i18n(locale);
  const tagline = entry.data.hero?.tagline?.replace(/<br\s*\/?>/g, " ");

  const organization = {
    "@type": "Organization",
    "@id": "https://fluster.ch",
    name: "Fluster GmbH",
    url: "https://fluster.ch",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zürich",
      addressCountry: "CH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hi@nullish.ch",
      url: new URL(`/${lang}/contact/`, site).href,
      availableLanguage: ["en", "de", "fr", "it"],
    },
  };

  const application = {
    "@type": "SoftwareApplication",
    name: "nullish",
    url: new URL(url.pathname, site).href,
    description: [entry.data.title, tagline].filter(Boolean).join(". "),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: lang,
    keywords: structuredData.keywords.join(", "),
    sameAs: ["https://github.com/usenullish"],
    publisher: { "@id": organization["@id"] },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organization, application],
  };

  head.push({
    tag: "script",
    attrs: { type: "application/ld+json" },
    content: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  });
});
