import { appendFile, readFile } from "node:fs/promises";

const publicPackageUrls = [
  new URL("../packages/tokens/package.json", import.meta.url),
  new URL("../packages/brand/package.json", import.meta.url),
  new URL("../packages/icons/package.json", import.meta.url),
  new URL("../packages/react/package.json", import.meta.url),
  new URL("../packages/react-native/package.json", import.meta.url),
];
const registry = "https://registry.npmjs.org";
const commit = process.env.GITHUB_SHA;
const allowEmpty = process.argv.includes("--allow-empty");

const manifests = await Promise.all(
  publicPackageUrls.map(async (packageUrl) => JSON.parse(await readFile(packageUrl, "utf8"))),
);
const releasePlan = [];

for (const { name, version } of manifests) {
  const response = await fetch(
    `${registry}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`,
    { headers: { Accept: "application/json" } },
  );

  if (response.status === 404) {
    releasePlan.push({ name, version, tag: `${name}@${version}` });
    continue;
  }

  if (!response.ok) {
    throw new Error(`Could not inspect ${name}@${version}: npm returned ${response.status}.`);
  }

  const published = await response.json();

  if (commit && published.gitHead === commit) {
    releasePlan.push({ name, version, tag: `${name}@${version}` });
  }
}

if (releasePlan.length === 0 && !allowEmpty) {
  throw new Error(
    "No unpublished package versions belong to this commit. Merge a Changesets version PR before dispatching Publish to npm.",
  );
}

const serializedPlan = JSON.stringify(releasePlan);

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `packages=${serializedPlan}\n`, "utf8");
}

console.log(serializedPlan);
