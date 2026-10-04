import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { brandColors, brandGeometry } from "../dist/index.js";
import { buildSocialAssets, buildSocialManifest, socialFormats, socialTones } from "../scripts/social-assets.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const regenerate = "Run `npm run generate:social` in packages/brand to refresh the kit.";
const assets = buildSocialAssets();

test("the social kit covers every tone and format once", () => {
  const expected = Object.keys(socialTones).length * Object.keys(socialFormats).length;
  assert.equal(assets.length, expected);
  assert.equal(new Set(assets.map(({ svg }) => svg)).size, expected);
});

test("the committed social manifest matches the generator", async () => {
  const committed = JSON.parse(await readFile(resolve(packageRoot, "social/manifest.json"), "utf8"));
  assert.deepEqual(committed, buildSocialManifest(assets), regenerate);
});

for (const asset of assets) {
  test(`${asset.svg} is the generator output`, async () => {
    const committed = await readFile(resolve(packageRoot, asset.svg), "utf8");
    assert.equal(committed, asset.source, regenerate);
  });

  test(`${asset.png} has the ${asset.width} × ${asset.height} canvas`, async () => {
    const metadata = await sharp(resolve(packageRoot, asset.png)).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
  });

  test(`${asset.svg} places the canonical cyan logo with no carrier`, () => {
    assert.match(asset.source, new RegExp(`fill="${brandColors.cyan}" d="${brandGeometry.logoPath}"`));
    assert.doesNotMatch(asset.source, /M65 0h330/);
    assert.doesNotMatch(asset.source, /stroke=/);
    assert.match(asset.source, new RegExp(`viewBox="0 0 ${asset.width} ${asset.height}"`));

    if (asset.mark === "lockup") {
      const neutral = socialTones[asset.tone].surface === "dark" ? brandColors.chalk : brandColors.ink;
      assert.match(asset.source, /transform="translate\(44 58\) scale\(\.318\)"/);
      assert.match(asset.source, new RegExp(`transform="translate\\(272 337\\) scale\\(\\.28 -\\.28\\)" fill="${neutral}"`));
      assert.match(asset.source, new RegExp(`transform="translate\\(1000 337\\) scale\\(\\.28 -\\.28\\)" fill="${brandColors.cyan}"`));
    } else {
      assert.doesNotMatch(asset.source, /<use /);
    }
  });
}
