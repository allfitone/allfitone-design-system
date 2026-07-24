import { readFile, writeFile } from "node:fs/promises";

const publicPackages = [
  {
    packageUrl: new URL("../packages/tokens/package.json", import.meta.url),
    sourceUrl: new URL("../packages/tokens/src/version.ts", import.meta.url),
  },
  {
    packageUrl: new URL("../packages/brand/package.json", import.meta.url),
    sourceUrl: new URL("../packages/brand/src/index.ts", import.meta.url),
  },
  {
    packageUrl: new URL("../packages/icons/package.json", import.meta.url),
    sourceUrl: new URL("../packages/icons/src/index.ts", import.meta.url),
  },
  {
    packageUrl: new URL("../packages/react/package.json", import.meta.url),
    sourceUrl: new URL("../packages/react/src/index.ts", import.meta.url),
  },
  {
    packageUrl: new URL("../packages/react-native/package.json", import.meta.url),
    sourceUrl: new URL("../packages/react-native/src/index.ts", import.meta.url),
  },
];

const packageMetadata = await Promise.all(
  publicPackages.map(async (target) => ({
    ...target,
    metadata: JSON.parse(await readFile(target.packageUrl, "utf8")),
  })),
);
const versions = new Set(packageMetadata.map(({ metadata }) => metadata.version));

if (versions.size !== 1) {
  throw new Error(
    `Public package versions must remain aligned; received ${[...versions].join(", ")}.`,
  );
}

const [designSystemVersion] = versions;
const versionPattern = /(export const designSystemVersion = ")[^"]+(" as const;)/;

for (const { metadata, sourceUrl } of packageMetadata) {
  const source = await readFile(sourceUrl, "utf8");

  if (!versionPattern.test(source)) {
    throw new Error(`Could not locate designSystemVersion in ${sourceUrl.pathname}.`);
  }

  const updated = source.replace(
    versionPattern,
    `$1${designSystemVersion}$2`,
  );

  if (updated !== source) {
    await writeFile(sourceUrl, updated, "utf8");
  }

  console.log(
    `Synchronized ${metadata.name} runtime metadata to ${designSystemVersion}.`,
  );
}

const publicPackageNames = new Set(
  packageMetadata.map(({ metadata }) => metadata.name),
);
const workspaceManifests = [
  new URL("../package.json", import.meta.url),
  new URL("../apps/docs/package.json", import.meta.url),
  ...publicPackages.map(({ packageUrl }) => packageUrl),
];

for (const manifestUrl of workspaceManifests) {
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  let changed = manifest.version !== designSystemVersion;
  manifest.version = designSystemVersion;

  for (const dependencyType of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    const dependencies = manifest[dependencyType];
    if (!dependencies) continue;

    for (const dependencyName of Object.keys(dependencies)) {
      if (
        publicPackageNames.has(dependencyName) &&
        dependencies[dependencyName] !== designSystemVersion
      ) {
        dependencies[dependencyName] = designSystemVersion;
        changed = true;
      }
    }
  }

  if (changed) {
    await writeFile(
      manifestUrl,
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8",
    );
  }
}

console.log(
  `Allfit One Design System manifests are aligned at ${designSystemVersion}.`,
);
