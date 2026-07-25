import { readFile, writeFile } from "node:fs/promises";

import semver from "semver";

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
const versionPattern = /(export const designSystemVersion = ")[^"]+(" as const;)/;

for (const { metadata, sourceUrl } of packageMetadata) {
  const source = await readFile(sourceUrl, "utf8");

  if (!versionPattern.test(source)) {
    throw new Error(`Could not locate designSystemVersion in ${sourceUrl.pathname}.`);
  }

  const updated = source.replace(
    versionPattern,
    `$1${metadata.version}$2`,
  );

  if (updated !== source) {
    await writeFile(sourceUrl, updated, "utf8");
  }

  console.log(
    `Synchronized ${metadata.name} runtime metadata to ${metadata.version}.`,
  );
}

const publicPackageVersions = new Map(
  packageMetadata.map(({ metadata }) => [metadata.name, metadata.version]),
);

for (const { metadata } of packageMetadata) {
  for (const dependencyType of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    for (const [dependencyName, range] of Object.entries(metadata[dependencyType] ?? {})) {
      const dependencyVersion = publicPackageVersions.get(dependencyName);

      if (
        dependencyVersion &&
        (!semver.validRange(range) ||
          !semver.satisfies(dependencyVersion, range, { includePrerelease: true }))
      ) {
        throw new Error(
          `${metadata.name} declares ${dependencyName}@${range}, which does not accept ${dependencyVersion}. Changesets must version the dependent package and update its range.`,
        );
      }
    }
  }
}

const privateManifestUrls = [new URL("../apps/docs/package.json", import.meta.url)];

for (const manifestUrl of privateManifestUrls) {
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  let changed = false;

  for (const dependencyType of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    const dependencies = manifest[dependencyType];
    if (!dependencies) continue;

    for (const dependencyName of Object.keys(dependencies)) {
      const dependencyVersion = publicPackageVersions.get(dependencyName);
      const currentRange = dependencies[dependencyName];

      if (
        dependencyVersion &&
        (!semver.validRange(currentRange) ||
          !semver.satisfies(dependencyVersion, currentRange, { includePrerelease: true }))
      ) {
        const prefix = currentRange.startsWith("^")
          ? "^"
          : currentRange.startsWith("~")
            ? "~"
            : "";
        dependencies[dependencyName] = `${prefix}${dependencyVersion}`;
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

console.log("Synchronized package-local runtime versions and compatible private workspace ranges.");
