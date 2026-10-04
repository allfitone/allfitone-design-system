#!/usr/bin/env node

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { buildSocialAssets, buildSocialManifest } from "./social-assets.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const socialRoot = resolve(packageRoot, "social");
const assets = buildSocialAssets();

// Only the tone directories are generated output; the README beside them is not.
for (const tone of new Set(assets.map(({ tone: name }) => name))) {
  await rm(resolve(socialRoot, tone), { recursive: true, force: true });
}

for (const asset of assets) {
  const svgPath = resolve(packageRoot, asset.svg);
  await mkdir(dirname(svgPath), { recursive: true });
  await writeFile(svgPath, asset.source, "utf8");
  await sharp(Buffer.from(asset.source))
    .png({ compressionLevel: 9 })
    .toFile(resolve(packageRoot, asset.png));
}

await writeFile(
  resolve(socialRoot, "manifest.json"),
  `${JSON.stringify(buildSocialManifest(assets), null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${assets.length} social assets as SVG and PNG under packages/brand/social.`);
