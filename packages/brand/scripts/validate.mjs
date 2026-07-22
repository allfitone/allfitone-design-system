import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(resolve(packageRoot, "assets/manifest.json"), "utf8"));

if (manifest.assets.length !== 7) {
  throw new Error(`Expected 7 canonical brand assets, received ${manifest.assets.length}.`);
}

await Promise.all(manifest.assets.map(async ({ path }) => {
  const absolutePath = resolve(packageRoot, path);
  const details = await stat(absolutePath);

  if (!details.isFile()) {
    throw new Error(`Brand asset is not a file: ${path}`);
  }

  const source = await readFile(absolutePath, "utf8");
  if (!source.includes("<title") || !source.includes("<desc") || !source.includes("viewBox=")) {
    throw new Error(`Brand asset is missing accessible SVG metadata: ${path}`);
  }
}));

console.log(`Validated ${manifest.assets.length} canonical brand assets.`);
