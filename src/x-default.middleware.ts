import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

// The root https://nullish.ch/ redirects visitors to their language, so it is the x-default
// of the homepages. Without a page pointing to it, Google never evaluates it (error "HTTPS not
// evaluated" in Google Search Console).
//
// Homepages (/en/, /de/, /fr/, /it/):
//   Starlight:         <link rel="alternate" hreflang="x-default" href="https://nullish.ch/en/">
//   Expected for SEO:  <link rel="alternate" hreflang="x-default" href="https://nullish.ch/">
//
// Docs pages are left untouched, e.g. /de/billing/ keeps https://nullish.ch/en/billing/.
export const onRequest = defineRouteMiddleware((context) => {
  const { site } = context;

  if (site === undefined) {
    return;
  }

  const defaultHome = new URL("/en/", site).href;

  const xDefault = context.locals.starlightRoute.head.find(
    ({ tag, attrs }) =>
      tag === "link" && attrs?.hreflang === "x-default" && attrs.href === defaultHome,
  );

  if (xDefault?.attrs !== undefined) {
    xDefault.attrs.href = new URL("/", site).href;
  }
});
