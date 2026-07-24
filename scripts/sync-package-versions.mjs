import { readFile, writeFile } from "node:fs/promises";

const targets = [
  {
    packageUrl: new URL("../packages/tokens/package.json", import.meta.url),
    sourceUrl: new URL("../packages/tokens/src/index.ts", import.meta.url),
    pattern: /(\n\s*version: ")[^"]+(",)/,
  },
  {
    packageUrl: new URL("../packages/react/package.json", import.meta.url),
    sourceUrl: new URL("../packages/react/src/index.ts", import.meta.url),
    pattern: /(\n\s*packageVersion: ")[^"]+(",)/,
  },
  {
    packageUrl: new URL("../packages/react-native/package.json", import.meta.url),
    sourceUrl: new URL("../packages/react-native/src/index.ts", import.meta.url),
    pattern: /(\n\s*packageVersion: ")[^"]+(",)/,
  },
];

for (const { packageUrl, sourceUrl, pattern } of targets) {
  const packageMetadata = JSON.parse(await readFile(packageUrl, "utf8"));
  const source = await readFile(sourceUrl, "utf8");

  if (!pattern.test(source)) {
    throw new Error(`Could not locate runtime version in ${sourceUrl.pathname}.`);
  }

  const updated = source.replace(pattern, (_, prefix, suffix) =>
    `${prefix}${packageMetadata.version}${suffix}`,
  );

  if (updated !== source) {
    await writeFile(sourceUrl, updated, "utf8");
  }

  console.log(`Synchronized ${packageMetadata.name} runtime metadata to ${packageMetadata.version}.`);
}
