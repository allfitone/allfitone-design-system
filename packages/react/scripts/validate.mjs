import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredOutputs = ["index.js", "brand.js", "icons.js", "tokens.js", "tokens.css"];

await Promise.all(requiredOutputs.map((file) => access(resolve(packageRoot, "dist", file))));

const css = await readFile(resolve(packageRoot, "dist/tokens.css"), "utf8");
if (!css.includes("--afo-color-brand-primary") || !css.includes("--afo-space-touch-target-web")) {
  throw new Error("React token CSS is missing required generated variables.");
}

console.log(`Validated ${requiredOutputs.length} React adapter outputs.`);
