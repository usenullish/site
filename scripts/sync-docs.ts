import { spawn, type SpawnOptions } from "node:child_process";
import { glob, mkdir, rm } from "node:fs/promises";

const cleanExistingFiles = async () => {
  for await (const file of glob("src/content/docs/**/*.mdoc", {
    // We exclude index.mdoc because templates is synced against two different repo
    exclude: ["src/content/docs/*/templates/index.mdoc"],
  })) {
    await rm(file);
  }
};

await cleanExistingFiles();

// From Svelte website: https://github.com/sveltejs/svelte.dev/blob/main/apps/svelte.dev/scripts/sync-docs/utils.ts#L30C24-L30C71
const invoke = ({ cmd, args, opts }: { cmd: string; args: string[]; opts: SpawnOptions }) => {
  const child = spawn(cmd, args, { ...opts, stdio: "inherit" });

  return new Promise<void>((fulfil, reject) => {
    child.on("close", (code) => {
      if (code) {
        reject(new Error(`Exited with code ${code}`));
        return;
      }

      // Give it some extra time to finish writing files to disk
      setTimeout(fulfil, 500);
    });
  });
};

const TMP = "tmp";
const REPOSITORIES = ["nullish", "document-templates", "email-templates"];

const cloneAndCopy = async () => {
  for (const repo of REPOSITORIES) {
    await invoke({
      cmd: "git",
      args: [
        "clone",
        "--depth",
        "1",
        "--branch",
        "main",
        `https://github.com/usenullish/${repo}.git`,
        repo,
      ],
      opts: {
        cwd: TMP,
      },
    });

    await invoke({
      cmd: "cp",
      args: ["-r", `${repo}/docs/.`, "../src/content/docs/"],
      opts: {
        cwd: TMP,
      },
    });
  }
};

await mkdir(TMP, { recursive: true });

try {
  await cloneAndCopy();
} finally {
  await rm(TMP, { recursive: true, force: true });
}
