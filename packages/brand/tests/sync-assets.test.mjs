import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execute = promisify(execFile);
const script = fileURLToPath(new URL("../scripts/sync-assets.mjs", import.meta.url));

test("asset synchronization removes only obsolete managed files", async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "allfitone-brand-"));
  const target = join(temporaryRoot, "public-brand");

  try {
    await execute(process.execPath, [script, target]);

    const sentinelPath = join(target, ".allfitone-brand-assets.json");
    const sentinel = JSON.parse(await readFile(sentinelPath, "utf8"));
    assert.equal(sentinel.format, "allfitone-brand-assets");
    assert.ok(sentinel.managedFiles.includes("logo/allfit-one-logo-cyan.svg"));
    assert.ok(sentinel.managedFiles.includes("favicon/allfit-one-favicon-ink.svg"));
    assert.ok(sentinel.managedFiles.includes("favicon/allfit-one-favicon-cyan.svg"));

    const stalePath = join(target, "logo", "obsolete-logo.svg");
    const unrelatedPath = join(target, "consumer-note.txt");
    await mkdir(dirname(stalePath), { recursive: true });
    await writeFile(stalePath, "obsolete", "utf8");
    await writeFile(unrelatedPath, "keep", "utf8");
    sentinel.managedFiles.push("logo/obsolete-logo.svg");
    await writeFile(sentinelPath, `${JSON.stringify(sentinel, null, 2)}\n`, "utf8");

    await execute(process.execPath, [script, target]);

    await assert.rejects(access(stalePath), { code: "ENOENT" });
    assert.equal(await readFile(unrelatedPath, "utf8"), "keep");
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
