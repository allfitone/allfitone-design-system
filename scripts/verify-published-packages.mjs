const releasePlan = JSON.parse(process.env.RELEASE_PLAN ?? "[]");
const commit = process.env.GITHUB_SHA;
const registry = "https://registry.npmjs.org";

if (!commit) {
  throw new Error("GITHUB_SHA is required to verify published package provenance.");
}

if (!Array.isArray(releasePlan) || releasePlan.length === 0) {
  throw new Error("RELEASE_PLAN must contain at least one package.");
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let pending = releasePlan;

for (let attempt = 1; attempt <= 12; attempt += 1) {
  const nextPending = [];

  for (const { name, version } of pending) {
    const response = await fetch(
      `${registry}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      nextPending.push({ name, version, reason: `npm returned ${response.status}` });
      continue;
    }

    const published = await response.json();

    if (published.version !== version || published.gitHead !== commit) {
      nextPending.push({
        name,
        version,
        reason: `received version=${published.version ?? "<missing>"} gitHead=${published.gitHead ?? "<missing>"}`,
      });
    }
  }

  pending = nextPending;

  if (pending.length === 0) break;
  if (attempt < 12) await wait(5_000);
}

if (pending.length > 0) {
  throw new Error(
    `Published package verification failed for commit ${commit}: ${pending
      .map(({ name, version, reason }) => `${name}@${version} (${reason})`)
      .join(", ")}`,
  );
}

console.log(
  `Verified ${releasePlan.map(({ name, version }) => `${name}@${version}`).join(", ")} from ${commit}.`,
);
