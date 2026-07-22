import { writeFile } from "node:fs/promises";

import { createCssVariables, tokenBundle } from "../dist/index.js";

const jsonPath = new URL("../dist/tokens.json", import.meta.url);
const cssPath = new URL("../dist/tokens.css", import.meta.url);

await Promise.all([
  writeFile(jsonPath, `${JSON.stringify(tokenBundle, null, 2)}\n`, "utf8"),
  writeFile(cssPath, createCssVariables(), "utf8"),
]);

console.log("Generated dist/tokens.json and dist/tokens.css");

