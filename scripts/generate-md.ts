import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import TurndownService from "turndown";

const DIST = join(process.cwd(), "dist");
const LOCALES = ["en", "de", "fr", "it"];

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

for (const locale of LOCALES) {
  const html = await readFile(join(DIST, locale, "index.html"), "utf-8");
  const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1] ?? html;

  await writeFile(join(DIST, locale, "index.md"), turndownService.turndown(main));
}

console.log(`📝 ${LOCALES.length} homepages converted to Markdown`);
