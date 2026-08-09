import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(resolve(packageRoot, "dist"), { recursive: true });
await copyFile(resolve(packageRoot, "../tokens/dist/tokens.css"), resolve(packageRoot, "dist/tokens.css"));
await copyFile(resolve(packageRoot, "src/styles/app.css"), resolve(packageRoot, "dist/app.css"));

console.log("Generated React token CSS adapter and application baseline.");
