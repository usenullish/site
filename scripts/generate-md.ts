import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import TurndownService from "turndown";

const DIST = join(process.cwd(), "dist");
const PAGES = [
  "en/index",
  "de/index",
  "fr/index",
  "it/index",
  "en/pricing/index",
  "de/pricing/index",
  "fr/pricing/index",
  "it/pricing/index",
  "404",
];

const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  codeBlockStyle: "fenced",
});

turndownService.remove("script");
turndownService.remove("head");
turndownService.remove("nav");
turndownService.remove("aside");
turndownService.remove("footer");
turndownService.remove("title");

for (const page of PAGES) {
  const html = await readFile(join(DIST, `${page}.html`), "utf-8");
  const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1] ?? html;

  await writeFile(join(DIST, `${page}.md`), turndownService.turndown(main));
}

console.log(`📝 ${PAGES.length} pages converted to Markdown`);
