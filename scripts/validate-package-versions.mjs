import { readFile } from "node:fs/promises";

import semver from "semver";

const workspaceTargets = [
  { path: "", packageUrl: new URL("../package.json", import.meta.url) },
  { path: "apps/docs", packageUrl: new URL("../apps/docs/package.json", import.meta.url) },
  {
    path: "packages/tokens",
    packageUrl: new URL("../packages/tokens/package.json", import.meta.url),
    sourceUrl: new URL("../packages/tokens/src/version.ts", import.meta.url),
  },
  {
    path: "packages/brand",
    packageUrl: new URL("../packages/brand/package.json", import.meta.url),
    sourceUrl: new URL("../packages/brand/src/index.ts", import.meta.url),
  },
  {
    path: "packages/icons",
    packageUrl: new URL("../packages/icons/package.json", import.meta.url),
    sourceUrl: new URL("../packages/icons/src/index.ts", import.meta.url),
  },
  {
    path: "packages/react",
    packageUrl: new URL("../packages/react/package.json", import.meta.url),
    sourceUrl: new URL("../packages/react/src/index.ts", import.meta.url),
  },
  {
    path: "packages/react-native",
    packageUrl: new URL("../packages/react-native/package.json", import.meta.url),
    sourceUrl: new URL("../packages/react-native/src/index.ts", import.meta.url),
  },
];

const entries = await Promise.all(
  workspaceTargets.map(async (target) => ({
    ...target,
    manifest: JSON.parse(await readFile(target.packageUrl, "utf8")),
  })),
);
const publicEntries = entries.filter(({ manifest }) => !manifest.private && manifest.name.startsWith("@allfitone/"));
const publicPackages = new Map(publicEntries.map((entry) => [entry.manifest.name, entry]));
const versionPattern = /export const designSystemVersion = "([^"]+)" as const;/;

for (const entry of publicEntries) {
  const source = await readFile(entry.sourceUrl, "utf8");
  const runtimeVersion = source.match(versionPattern)?.[1];

  if (runtimeVersion !== entry.manifest.version) {
    throw new Error(
      `${entry.manifest.name} exports ${runtimeVersion ?? "<missing>"}; expected package version ${entry.manifest.version}.`,
    );
  }
}

for (const { manifest } of entries) {
  for (const dependencyType of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    for (const [name, range] of Object.entries(manifest[dependencyType] ?? {})) {
      const dependency = publicPackages.get(name);

      if (!dependency) continue;
      if (!semver.validRange(range) || !semver.satisfies(dependency.manifest.version, range, { includePrerelease: true })) {
        throw new Error(
          `${manifest.name} declares ${name}@${range}, which does not accept workspace version ${dependency.manifest.version}.`,
        );
      }
    }
  }
}

const packageLock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));

for (const { path, manifest } of entries) {
  const lockedVersion = packageLock.packages?.[path]?.version;

  if (lockedVersion !== manifest.version) {
    throw new Error(
      `package-lock.json entry "${path || "<root>"}" is ${lockedVersion}; expected ${manifest.name}@${manifest.version}.`,
    );
  }
}

console.log(
  `Validated ${publicEntries.length} independently versioned public packages, ${entries.length} workspace manifests, runtime metadata, internal ranges, and package-lock.json.`,
);
