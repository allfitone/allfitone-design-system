import { readFile } from "node:fs/promises";

const manifests = [
  new URL("../package.json", import.meta.url),
  new URL("../apps/docs/package.json", import.meta.url),
  new URL("../packages/tokens/package.json", import.meta.url),
  new URL("../packages/brand/package.json", import.meta.url),
  new URL("../packages/icons/package.json", import.meta.url),
  new URL("../packages/react/package.json", import.meta.url),
  new URL("../packages/react-native/package.json", import.meta.url),
];
const entries = await Promise.all(
  manifests.map(async (url) => ({
    url,
    manifest: JSON.parse(await readFile(url, "utf8")),
  })),
);
const [rootEntry] = entries;
const expectedVersion = rootEntry.manifest.version;
const publicPackageNames = new Set(
  entries.slice(2).map(({ manifest }) => manifest.name),
);

for (const { url, manifest } of entries) {
  if (manifest.version !== expectedVersion) {
    throw new Error(
      `${manifest.name} is ${manifest.version}; expected global version ${expectedVersion} (${url.pathname}).`,
    );
  }

  for (const dependencyType of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    for (const [name, version] of Object.entries(
      manifest[dependencyType] ?? {},
    )) {
      if (publicPackageNames.has(name) && version !== expectedVersion) {
        throw new Error(
          `${manifest.name} declares ${name}@${version}; expected ${expectedVersion}.`,
        );
      }
    }
  }
}

const packageLock = JSON.parse(
  await readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
);
const lockfilePaths = [
  "",
  "apps/docs",
  "packages/tokens",
  "packages/brand",
  "packages/icons",
  "packages/react",
  "packages/react-native",
];

for (const path of lockfilePaths) {
  const lockedVersion = packageLock.packages?.[path]?.version;
  if (lockedVersion !== expectedVersion) {
    throw new Error(
      `package-lock.json entry "${path || "<root>"}" is ${lockedVersion}; expected ${expectedVersion}.`,
    );
  }
}

console.log(
  `Validated global Allfit One Design System version ${expectedVersion} across ${entries.length} manifests and package-lock.json.`,
);
