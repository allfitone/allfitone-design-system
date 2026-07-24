import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredOutputs = ["index.js", "brand.js", "icons.js", "tokens.js"];

await Promise.all(requiredOutputs.map((file) => access(resolve(packageRoot, "dist", file))));

const packageMetadata = JSON.parse(
  await readFile(resolve(packageRoot, "package.json"), "utf8"),
);
const { allfitoneReactNative, designSystemVersion } = await import(
  "../dist/index.js"
);
if (designSystemVersion !== packageMetadata.version) {
  throw new Error(
    `Global React Native version ${designSystemVersion} must match package version ${packageMetadata.version}.`,
  );
}
if (allfitoneReactNative.packageVersion !== packageMetadata.version) {
  throw new Error(
    `Runtime React Native version ${allfitoneReactNative.packageVersion} must match package version ${packageMetadata.version}.`,
  );
}

const { getNativeTouchTarget, resolveNativeLetterSpacing } = await import("../dist/tokens.js");

if (getNativeTouchTarget("ios") !== 44 || getNativeTouchTarget("android") !== 48) {
  throw new Error("React Native touch targets do not match the accessibility contract.");
}

if (resolveNativeLetterSpacing(20, "utility") !== 3.2) {
  throw new Error("React Native letter-spacing conversion is invalid.");
}

console.log(`Validated ${requiredOutputs.length} React Native adapter outputs.`);
