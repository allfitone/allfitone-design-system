import { readFile } from "node:fs/promises";

import * as lucideReact from "lucide-react";

import {
  designSystemVersion,
  iconCatalog,
  iconSize,
  iconStrokeWidth,
} from "../dist/index.js";

const packageMetadata = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const nativePackageMetadata = JSON.parse(
  await readFile(new URL("../../react-native/package.json", import.meta.url), "utf8"),
);
const nativeAdapterSource = await readFile(
  new URL("../../react-native/src/icons.tsx", import.meta.url),
  "utf8",
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sorted(values) {
  return [...values].sort();
}

assert(
  designSystemVersion === packageMetadata.version,
  `Runtime icon version ${designSystemVersion} must match package version ${packageMetadata.version}.`,
);

const webLucideRange = packageMetadata.dependencies["lucide-react"];
const nativeLucideRange =
  nativePackageMetadata.dependencies["lucide-react-native"];
assert(
  webLucideRange === nativeLucideRange,
  `Web and Native Lucide ranges must match; received ${webLucideRange} and ${nativeLucideRange}.`,
);

const names = Object.keys(iconCatalog);
const categories = new Set(["navigation", "action", "status", "object"]);
const sizes = Object.entries(iconSize);
const strokes = Object.entries(iconStrokeWidth);

assert(names.length === 81, `Expected 81 foundation icons, received ${names.length}.`);

for (const [name, definition] of Object.entries(iconCatalog)) {
  assert(/^[a-z][a-z0-9]*$/.test(name), `Icon name must be semantic camelCase: ${name}`);
  assert(
    categories.has(definition.category),
    `Icon ${name} has an unsupported category: ${definition.category}`,
  );
  assert(
    /^[A-Z][A-Za-z0-9]*$/.test(definition.source),
    `Icon ${name} has an invalid Lucide source name: ${definition.source}`,
  );

  const component = lucideReact[definition.source];
  assert(component, `Lucide does not export ${definition.source} for icon ${name}.`);
  assert(
    component.displayName === definition.source,
    `Lucide source identity mismatch for ${name}: expected ${definition.source}.`,
  );
}

const nativeSourceBlock = nativeAdapterSource.match(
  /const sourceComponents = \{([\s\S]*?)\} satisfies Record<IconSource,/,
)?.[1];
assert(nativeSourceBlock, "Could not inspect the React Native icon source map.");
const nativeSources = [
  ...nativeSourceBlock.matchAll(/^\s{2}([A-Z][A-Za-z0-9]*),$/gm),
].map((match) => match[1]);
// Unique: two semantic names may legitimately draw the same glyph — `subtract` and
// `indeterminate` are both a minus and mean different things.
const catalogSources = [
  ...new Set(Object.values(iconCatalog).map(({ source }) => source)),
];
assert(
  JSON.stringify(sorted([...new Set(nativeSources)])) ===
    JSON.stringify(sorted(catalogSources)),
  "React Native must map every catalog source through shorthand source entries.",
);

for (const [index, [name, value]] of sizes.entries()) {
  assert(
    Number.isInteger(value) && value > 0,
    `Icon size ${name} must be a positive integer.`,
  );
  if (index > 0) {
    assert(
      value > sizes[index - 1][1],
      "Icon sizes must be strictly increasing.",
    );
  }
}

for (const [name, value] of strokes) {
  assert(
    Number.isFinite(value) && value > 0,
    `Icon stroke ${name} must be a positive finite number.`,
  );
}
assert(
  iconStrokeWidth.display < iconStrokeWidth.default &&
    iconStrokeWidth.default < iconStrokeWidth.compact,
  "Icon stroke scales must remain ordered: display < default < compact.",
);

console.log(
  `Validated ${names.length} semantic icons, ${sizes.length} sizes, ${strokes.length} strokes, and Web/Native Lucide parity at ${webLucideRange}.`,
);
