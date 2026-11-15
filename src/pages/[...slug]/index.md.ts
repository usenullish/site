import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const getStaticPaths = (async () => {
  const entries = await getCollection("docs", ({ filePath }) => filePath?.endsWith(".mdoc"));

  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: CollectionEntry<"docs"> }> = ({
  props: {
    entry: {
      data: { title, description },
      body,
    },
  },
}) => {
  const header = description === undefined ? `# ${title}` : `# ${title}\n\n> ${description}`;

  return new Response(`${header}\n\n${body ?? ""}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
