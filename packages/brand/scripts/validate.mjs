import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  brandAssetFiles,
  brandAssetSpecifiers,
  brandColors,
  brandDimensions,
  brandGeometry,
  designSystemVersion,
} from "../dist/index.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(resolve(packageRoot, "assets/manifest.json"), "utf8"));
const packageMetadata = JSON.parse(
  await readFile(resolve(packageRoot, "package.json"), "utf8"),
);

const assetPaths = [
  ...Object.values(brandAssetFiles.logo),
  brandAssetFiles.logoCarrier,
  ...Object.values(brandAssetFiles.wordmark),
  ...Object.values(brandAssetFiles.lockup),
  ...Object.values(brandAssetFiles.product).flatMap((assets) => [
    ...Object.values(assets.wordmark),
    ...Object.values(assets.lockup),
  ]),
];
const assetSpecifiers = [
  ...Object.values(brandAssetSpecifiers.logo),
  brandAssetSpecifiers.logoCarrier,
  ...Object.values(brandAssetSpecifiers.wordmark),
  ...Object.values(brandAssetSpecifiers.lockup),
  ...Object.values(brandAssetSpecifiers.product).flatMap((assets) => [
    ...Object.values(assets.wordmark),
    ...Object.values(assets.lockup),
  ]),
];
const uniqueLetterPaths = [
  ...new Set([
    ...brandGeometry.allfitLetters.map(([path]) => path),
    ...brandGeometry.oneLetters.map(([path]) => path),
  ]),
];

function sorted(values) {
  return [...values].sort();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertSameValues(actual, expected, label) {
  assert(
    JSON.stringify(sorted(actual)) === JSON.stringify(sorted(expected)),
    `${label} mismatch.\nExpected: ${JSON.stringify(sorted(expected))}\nReceived: ${JSON.stringify(sorted(actual))}`,
  );
}

function localOneOffset(value) {
  return Number((value - 2600).toFixed(3)).toString();
}

const wordmarkXValues = [
  ...brandGeometry.allfitLetters.map(([, x]) => x.toString()),
  ...brandGeometry.oneLetters.map(([, x]) => x.toString()),
];
const lockupXValues = [
  ...brandGeometry.allfitLetters.map(([, x]) => x.toString()),
  ...brandGeometry.oneLetters.map(([, x]) => localOneOffset(x)),
];

const expectedAssets = new Map([
  [brandAssetFiles.logo.cyan, {
    type: "logo",
    lettering: null,
    viewBox: brandDimensions.logo.viewBox,
    paths: [brandGeometry.logoPath],
    fills: [brandColors.cyan],
    strokes: [],
    fragments: [],
    xValues: [],
  }],
  [brandAssetFiles.logo.ink, {
    type: "logo",
    lettering: null,
    viewBox: brandDimensions.logo.viewBox,
    paths: [brandGeometry.logoPath],
    fills: [brandColors.ink],
    strokes: [],
    fragments: [],
    xValues: [],
  }],
  [brandAssetFiles.logo.chalk, {
    type: "logo",
    lettering: null,
    viewBox: brandDimensions.logo.viewBox,
    paths: [brandGeometry.logoPath],
    fills: [brandColors.chalk],
    strokes: [],
    fragments: [],
    xValues: [],
  }],
  [brandAssetFiles.logoCarrier, {
    type: "logo-carrier",
    lettering: null,
    viewBox: brandDimensions.logoCarrier.viewBox,
    paths: [brandGeometry.carrierPath, brandGeometry.logoPath],
    fills: [brandColors.cyan, brandColors.ink],
    strokes: [],
    fragments: [
      'transform="translate(32 36)"',
      'transform="translate(142 22) scale(.318)"',
    ],
    xValues: [],
  }],
  [brandAssetFiles.wordmark.onDark, {
    type: "wordmark",
    lettering: "outlined",
    viewBox: brandDimensions.wordmark.viewBox,
    paths: uniqueLetterPaths,
    fills: [brandColors.chalk, brandColors.cyan],
    strokes: [],
    fragments: ['transform="translate(20 728) scale(1 -1)"'],
    xValues: wordmarkXValues,
  }],
  [brandAssetFiles.wordmark.onLight, {
    type: "wordmark",
    lettering: "outlined",
    viewBox: brandDimensions.wordmark.viewBox,
    paths: uniqueLetterPaths,
    fills: [brandColors.ink, brandColors.cyan],
    strokes: [],
    fragments: ['transform="translate(20 728) scale(1 -1)"'],
    xValues: wordmarkXValues,
  }],
  [brandAssetFiles.lockup.onDark, {
    type: "lockup",
    lettering: "outlined",
    viewBox: brandDimensions.lockup.viewBox,
    paths: [brandGeometry.carrierPath, brandGeometry.logoPath, ...uniqueLetterPaths],
    fills: [brandColors.cyan, brandColors.ink, brandColors.chalk],
    strokes: [],
    fragments: [
      'transform="translate(44 36)"',
      'transform="translate(142 22) scale(.318)"',
      'transform="translate(512 337) scale(.28 -.28)"',
      'transform="translate(1240 337) scale(.28 -.28)"',
    ],
    xValues: lockupXValues,
  }],
  [brandAssetFiles.lockup.onLight, {
    type: "lockup",
    lettering: "outlined",
    viewBox: brandDimensions.lockup.viewBox,
    paths: [brandGeometry.carrierPath, brandGeometry.logoPath, ...uniqueLetterPaths],
    fills: [brandColors.cyan, brandColors.ink],
    strokes: [],
    fragments: [
      'transform="translate(44 36)"',
      'transform="translate(142 22) scale(.318)"',
      'transform="translate(512 337) scale(.28 -.28)"',
      'transform="translate(1240 337) scale(.28 -.28)"',
    ],
    xValues: lockupXValues,
  }],
]);

for (const [product, files] of Object.entries(brandAssetFiles.product)) {
  const descriptorLetters = brandGeometry.product.descriptorLetters[product];
  const productLetterPaths = [
    ...new Set([
      ...brandGeometry.allfitLetters.map(([path]) => path),
      ...descriptorLetters.map(([path]) => path),
    ]),
  ];
  const productXValues = [
    ...brandGeometry.allfitLetters.map(([, x]) => x.toString()),
    ...descriptorLetters.map(([, x]) => x.toString()),
  ];
  for (const surface of ["dark", "light"]) {
    const surfaceKey = surface === "dark" ? "onDark" : "onLight";
    const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
    expectedAssets.set(files.wordmark[surfaceKey], {
      type: "product-wordmark",
      product,
      lettering: "outlined",
      viewBox: brandDimensions.product.wordmark[product].viewBox,
      paths: productLetterPaths,
      fills: [neutral, brandColors.cyan],
      strokes: [],
      fragments: ['transform="translate(20 728) scale(1 -1)"'],
      xValues: productXValues,
    });
    expectedAssets.set(files.lockup[surfaceKey], {
      type: "product-lockup",
      product,
      lettering: "outlined",
      viewBox: brandDimensions.product.lockup[product].viewBox,
      paths: [brandGeometry.carrierPath, brandGeometry.logoPath, ...productLetterPaths],
      fills: [...new Set([brandColors.cyan, brandColors.ink, neutral])],
      strokes: [],
      fragments: [
        'transform="translate(44 36)"',
        'transform="translate(142 22) scale(.318)"',
        'transform="translate(512 337) scale(.28 -.28)"',
      ],
      xValues: productXValues,
    });
  }
}

assert(
  designSystemVersion === packageMetadata.version,
  `Runtime brand version ${designSystemVersion} must match package version ${packageMetadata.version}.`,
);
assert(manifest.schemaVersion === "1.0.0", "Unsupported brand manifest schema.");
assert(
  manifest.brandVersion === packageMetadata.version,
  `Manifest brand version ${manifest.brandVersion} must match package version ${packageMetadata.version}.`,
);
assert(
  JSON.stringify(manifest.colors) === JSON.stringify(brandColors),
  "Manifest colors must match the runtime brand color contract.",
);

const manifestPaths = manifest.assets.map(({ path }) => path);
assertSameValues(manifestPaths, assetPaths, "Manifest asset paths");
assert(
  new Set(manifestPaths).size === manifestPaths.length,
  "Manifest asset paths must be unique.",
);

for (const [index, specifier] of assetSpecifiers.entries()) {
  assert(
    specifier === `@allfitone/brand/${assetPaths[index]}`,
    `Public asset specifier does not match package-relative path: ${specifier}`,
  );
  assert(
    import.meta.resolve(specifier).startsWith("file:"),
    `Public asset specifier is not resolvable: ${specifier}`,
  );
}

await Promise.all(manifest.assets.map(async (asset) => {
  const expected = expectedAssets.get(asset.path);
  assert(expected, `Manifest contains an unknown brand asset: ${asset.path}`);
  assert(asset.type === expected.type, `Unexpected asset type for ${asset.path}.`);
  assert(asset.product === expected.product, `Unexpected product for ${asset.path}.`);
  assert(asset.background === "transparent", `Brand asset must remain transparent: ${asset.path}`);
  assert(asset.lettering === expected.lettering, `Unexpected lettering mode for ${asset.path}.`);

  const absolutePath = resolve(packageRoot, asset.path);
  const details = await stat(absolutePath);
  assert(details.isFile(), `Brand asset is not a file: ${asset.path}`);

  const source = await readFile(absolutePath, "utf8");
  assert(/<title(?:\s[^>]*)?>[^<]+<\/title>/.test(source), `Missing SVG title: ${asset.path}`);
  assert(/<desc(?:\s[^>]*)?>[^<]+<\/desc>/.test(source), `Missing SVG description: ${asset.path}`);

  const viewBoxes = [...source.matchAll(/\bviewBox="([^"]+)"/g)].map((match) => match[1]);
  assertSameValues(viewBoxes, [expected.viewBox], `ViewBox values for ${asset.path}`);

  const paths = [...source.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
  assertSameValues(paths, expected.paths, `Canonical geometry for ${asset.path}`);

  const fills = [...new Set(
    [...source.matchAll(/\sfill="([^"]+)"/g)].map((match) => match[1]),
  )];
  assertSameValues(fills, expected.fills, `Canonical fills for ${asset.path}`);

  const strokes = [...new Set(
    [...source.matchAll(/\sstroke="([^"]+)"/g)].map((match) => match[1]),
  )];
  assertSameValues(strokes, expected.strokes, `Canonical strokes for ${asset.path}`);

  for (const fragment of expected.fragments) {
    assert(source.includes(fragment), `Missing canonical layout fragment in ${asset.path}: ${fragment}`);
  }

  const xValues = [...source.matchAll(/<use\b[^>]*\sx="([^"]+)"/g)].map((match) => match[1]);
  assertSameValues(xValues, expected.xValues, `Letter positions for ${asset.path}`);
}));

console.log(
  `Validated ${manifest.assets.length} canonical brand assets against schema ${manifest.schemaVersion}.`,
);
