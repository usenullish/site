#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const PATH_TO_EN_JSON = join(process.cwd(), "src", "assets", "i18n", "en.json");
const PATH_TO_OUTPUT = join(process.cwd(), "src", "components", "i18n", "i18n.types.ts");

/**
 * Generates TypeScript interfaces from the English translation file.
 */
const generateTypes = async () => {
  const { default: en } = await import(PATH_TO_EN_JSON, { with: { type: "json" } });

  const toType = (value: unknown): string => {
    if (Array.isArray(value)) {
      return `${toType(value[0])}[]`;
    }

    if (typeof value === "object" && value !== null) {
      return `{${Object.entries(value)
        .map(([key, nested]) => `${key}: ${toType(nested)};`)
        .join("")}}`;
    }

    return "string";
  };

  const data = Object.entries(en).map(([key, values]) => ({
    key,
    name: `I18n${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    type: toType(values),
  }));

  const interfaces = data.map(({ name, type }) => `\n\nexport type ${name} = ${type};`).join("");

  const main = `\n\nexport interface I18n {lang: Languages;${data.map(({ key, name }) => `${key}: ${name};`).join("")}}`;

  const comment = `/**\n* Auto-generated definitions file ("pnpm i18n")\n*/`;
  const langImport = `\nimport type { Languages } from "./languages.ts";\n`;

  writeFileSync(PATH_TO_OUTPUT, `${comment}${langImport}${interfaces}${main}\n`);
};

await generateTypes();
