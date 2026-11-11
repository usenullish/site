import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

const DIST = join(process.cwd(), "dist");

const precompress = async () => {
  const entries = await readdir(DIST, { recursive: true, withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile());

  for (const file of files) {
    const path = join(file.parentPath, file.name);
    const content = await readFile(path);

    await writeFile(
      `${path}.br`,
      brotliCompressSync(content, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
      }),
    );
  }

  return files.length;
};

const count = await precompress();

console.log(`🍋‍🟩️${count} files compressed`);
