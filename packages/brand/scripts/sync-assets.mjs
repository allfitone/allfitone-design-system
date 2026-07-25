#!/usr/bin/env node

import {
  cp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  parse,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

const requestedTarget = process.argv[2];

if (!requestedTarget) {
  console.error("Usage: allfitone-brand-assets <target-directory>");
  process.exit(1);
}

const target = resolve(requestedTarget);
if (target === parse(target).root) {
  throw new Error("Refusing to synchronize assets into a filesystem root.");
}

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = resolve(packageRoot, "assets");
if (target === assetsRoot || target.startsWith(`${assetsRoot}${sep}`)) {
  throw new Error("Refusing to synchronize assets into the canonical source directory.");
}

const manifest = JSON.parse(
  await readFile(resolve(assetsRoot, "manifest.json"), "utf8"),
);
const sentinelName = ".allfitone-brand-assets.json";
const sentinelPath = resolve(target, sentinelName);
const managedFiles = [
  "README.md",
  "manifest.json",
  ...manifest.assets.map(({ path }) =>
    relative("assets", path).replaceAll("\\", "/")),
];

function resolveManagedFile(path) {
  const absolutePath = resolve(target, path);
  if (!absolutePath.startsWith(`${target}${sep}`)) {
    throw new Error(`Unsafe managed asset path: ${path}`);
  }
  return absolutePath;
}

for (const path of managedFiles) {
  resolveManagedFile(path);
}

let previousManagedFiles = [];
try {
  const previousState = JSON.parse(await readFile(sentinelPath, "utf8"));
  if (
    previousState.format !== "allfitone-brand-assets" ||
    !Array.isArray(previousState.managedFiles)
  ) {
    throw new Error(`Invalid synchronization metadata in ${sentinelPath}.`);
  }
  previousManagedFiles = previousState.managedFiles;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const currentFiles = new Set(managedFiles);
await Promise.all(
  previousManagedFiles
    .filter((path) => !currentFiles.has(path))
    .map((path) => rm(resolveManagedFile(path), { force: true })),
);

await mkdir(target, { recursive: true });
await cp(assetsRoot, target, { recursive: true, force: true });
await writeFile(
  sentinelPath,
  `${JSON.stringify({
    format: "allfitone-brand-assets",
    schemaVersion: 1,
    brandVersion: manifest.brandVersion,
    managedFiles,
  }, null, 2)}\n`,
  "utf8",
);

console.log(
  `Synchronized ${manifest.assets.length} Allfit One brand assets to ${target}`,
);
