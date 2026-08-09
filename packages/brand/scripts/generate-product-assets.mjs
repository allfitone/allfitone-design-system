#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  brandAssetFiles,
  brandColors,
  brandDimensions,
  brandGeometry,
  brandProductNames,
} from "../dist/index.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = resolve(packageRoot, "assets");
const products = Object.keys(brandProductNames);

function carrierMarkup() {
  return `  <g transform="translate(44 36)">
    <path fill="${brandColors.cyan}" d="${brandGeometry.carrierPath}"/>
    <path fill="${brandColors.ink}" d="${brandGeometry.logoPath}" transform="translate(142 22) scale(.318)"/>
  </g>`;
}

function letterDefinitions(product, prefix) {
  const paths = [
    ...brandGeometry.allfitLetters.map(([path]) => path),
    ...brandGeometry.product.descriptorLetters[product].map(([path]) => path),
  ];
  const uniquePaths = [...new Set(paths)];
  const ids = new Map(uniquePaths.map((path, index) => [path, `${prefix}-${index}`]));
  const definitions = uniquePaths
    .map((path) => `    <path id="${ids.get(path)}" d="${path}"/>`)
    .join("\n");

  return { definitions, ids };
}

function letterUses(letters, ids, indent = "    ") {
  return letters
    .map(([path, x]) => `${indent}<use href="#${ids.get(path)}" x="${x}"/>`)
    .join("\n");
}

function wordmarkContent(product, surface, prefix, transform = "translate(20 728) scale(1 -1)") {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
  const { definitions, ids } = letterDefinitions(product, prefix);

  return `  <defs>\n${definitions}\n  </defs>\n  <g transform="${transform}" fill="${neutral}">\n${letterUses(brandGeometry.allfitLetters, ids)}\n  </g>\n  <g transform="${transform}" fill="${brandColors.cyan}">\n${letterUses(brandGeometry.product.descriptorLetters[product], ids)}\n  </g>`;
}

function svgDocument({ title, description, viewBox, content }) {
  const id = title.toLowerCase().replaceAll(" ", "-");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="${id}-title ${id}-description">
  <title id="${id}-title">${title}</title>
  <desc id="${id}-description">${description}</desc>
${content}
</svg>
`;
}

async function writeAsset(path, source) {
  const absolutePath = resolve(packageRoot, path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, source, "utf8");
}

const manifestAssets = [];

for (const product of products) {
  const name = brandProductNames[product];
  const files = brandAssetFiles.product[product];

  for (const surface of ["dark", "light"]) {
    const surfaceKey = surface === "dark" ? "onDark" : "onLight";
    const wordmarkPath = files.wordmark[surfaceKey];
    const lockupPath = files.lockup[surfaceKey];

    await writeAsset(wordmarkPath, svgDocument({
      title: `${name} wordmark`,
      description: `${name} outlined wordmark for ${surface} surfaces`,
      viewBox: brandDimensions.product.wordmark[product].viewBox,
      content: wordmarkContent(product, surface, `${product}-wordmark-${surface}`),
    }));
    manifestAssets.push({ path: wordmarkPath, type: "product-wordmark", product, background: "transparent", lettering: "outlined" });

    await writeAsset(lockupPath, svgDocument({
      title: `${name} lockup`,
      description: `Shared Allfit One logo and ${name} outlined wordmark for ${surface} surfaces`,
      viewBox: brandDimensions.product.lockup[product].viewBox,
      content: `${carrierMarkup()}\n${wordmarkContent(product, surface, `${product}-lockup-${surface}`, "translate(512 337) scale(.28 -.28)")}`,
    }));
    manifestAssets.push({ path: lockupPath, type: "product-lockup", product, background: "transparent", lettering: "outlined" });
  }
}

const manifestPath = resolve(assetsRoot, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.assets = [
  ...manifest.assets.filter(({ product }) => !product),
  ...manifestAssets,
];
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Generated ${manifestAssets.length} product wordmarks and shared-logo lockups.`);
