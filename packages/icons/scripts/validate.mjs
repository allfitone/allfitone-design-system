import { readFile } from "node:fs/promises";

import {
  designSystemVersion,
  iconCatalog,
  iconSize,
} from "../dist/index.js";

const packageMetadata = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

if (designSystemVersion !== packageMetadata.version) {
  throw new Error(
    `Runtime icon version ${designSystemVersion} must match package version ${packageMetadata.version}.`,
  );
}

const names = Object.keys(iconCatalog);
const categories = new Set(["navigation", "action", "status", "object"]);
const sizes = Object.values(iconSize);

if (names.length !== 32) {
  throw new Error(`Expected 32 foundation icons, received ${names.length}.`);
}

for (const [name, definition] of Object.entries(iconCatalog)) {
  if (!categories.has(definition.category)) {
    throw new Error(`Icon ${name} has an unsupported category: ${definition.category}`);
  }
}

if (!sizes.every((size, index) => index === 0 || size > sizes[index - 1])) {
  throw new Error("Icon sizes must be strictly increasing.");
}

console.log(`Validated ${names.length} semantic icons across ${categories.size} categories.`);
