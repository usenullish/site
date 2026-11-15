import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware((context) => {
  const { site, url } = context;
  const { entry, locale, head } = context.locals.starlightRoute;

  if (site === undefined) {
    return;
  }

  const isHomepage = entry.id === locale;
  const isDoc = entry.filePath?.endsWith(".mdoc") === true;

  if (!isHomepage && !isDoc) {
    return;
  }

  const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;

  head.push({
    tag: "link",
    attrs: {
      rel: "alternate",
      type: "text/markdown",
      href: new URL(`${pathname}index.md`, site).href,
    },
  });
});
