import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentSourceDirectory = resolve(packageRoot, "src/components");
const components = (await readdir(componentSourceDirectory))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""));

const requiredOutputs = [
  "index.js",
  "index.d.ts",
  "index.js.map",
  "brand.js",
  "brand.d.ts",
  "brand.js.map",
  "icons.js",
  "icons.d.ts",
  "icons.js.map",
  "tokens.js",
  "tokens.d.ts",
  "tokens.js.map",
  "tokens.css",
  "app.css",
  "styles.css",
  "lib/utils.js",
  "lib/utils.d.ts",
  "lib/utils.js.map",
  ...components.flatMap((component) => [
    `components/${component}.js`,
    `components/${component}.d.ts`,
    `components/${component}.js.map`,
  ]),
];

await Promise.all(requiredOutputs.map((file) => access(resolve(packageRoot, "dist", file))));

const css = await readFile(resolve(packageRoot, "dist/tokens.css"), "utf8");
if (
  !css.includes("--afo-color-brand-primary") ||
  !css.includes("--afo-space-touch-target-web") ||
  !css.includes("--afo-typography-data-font-family")
) {
  throw new Error("React token CSS is missing required generated variables.");
}

const styles = await readFile(resolve(packageRoot, "dist/styles.css"), "utf8");
const requiredStyleTokens = [
  "--color-background",
  "--color-foreground",
  "--color-primary",
  "--color-destructive",
  "--color-ring",
  "--afo-color-focus-ring",
  "0 0 0 4px",
  "prefers-reduced-motion",
  "forced-colors",
];

for (const token of requiredStyleTokens) {
  if (!styles.includes(token)) {
    throw new Error(`Compiled component styles are missing ${token}.`);
  }
}

const appStyles = await readFile(resolve(packageRoot, "dist/app.css"), "utf8");
const requiredAppStyleContracts = [
  "--afo-app-font-display",
  "--afo-app-font-body",
  "box-sizing: border-box",
  "background: var(--afo-color-background-canvas)",
  "font-family: var(--afo-font-family-body)",
];

for (const contract of requiredAppStyleContracts) {
  if (!appStyles.includes(contract)) {
    throw new Error(`Application baseline is missing ${contract}.`);
  }
}

const sourceFiles = await Promise.all(
  components.map(async (component) => ({
    component,
    source: await readFile(resolve(componentSourceDirectory, `${component}.tsx`), "utf8"),
  })),
);

const forbiddenPatterns = [
  { label: "raw hexadecimal color", pattern: /#[0-9a-f]{3,8}\b/i },
  { label: "manual dark-mode utility", pattern: /\bdark:/ },
  { label: "direct Lucide import", pattern: /from ["']lucide-react["']/ },
  { label: "workspace-internal alias", pattern: /from ["']@\// },
  { label: "direct Tailwind palette color", pattern: /\b(?:bg|text|border|ring)-(?:black|white|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)(?:-|\b)/ },
];

for (const { component, source } of sourceFiles) {
  for (const { label, pattern } of forbiddenPatterns) {
    if (pattern.test(source)) {
      throw new Error(`${component}.tsx contains a forbidden ${label}.`);
    }
  }
}

const packageJson = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
const { allfitoneReact, designSystemVersion } = await import(
  pathToFileURL(resolve(packageRoot, "dist/index.js")).href
);
if (designSystemVersion !== packageJson.version) {
  throw new Error(
    `Global React version ${designSystemVersion} must match package version ${packageJson.version}.`,
  );
}
if (allfitoneReact.packageVersion !== packageJson.version) {
  throw new Error(
    `Runtime React version ${allfitoneReact.packageVersion} must match package version ${packageJson.version}.`,
  );
}

const expectedSideEffects = ["./dist/tokens.css", "./dist/app.css", "./dist/styles.css"];
if (JSON.stringify(packageJson.sideEffects) !== JSON.stringify(expectedSideEffects)) {
  throw new Error("Only tokens.css, app.css, and styles.css may be marked as side effects.");
}

for (const entry of [".", "./app.css", "./styles.css", "./lib/utils", "./components/*"]) {
  if (!packageJson.exports?.[entry]) {
    throw new Error(`Package export ${entry} is missing.`);
  }
}

await Promise.all(
  ["index.js", "brand.js", "icons.js", "tokens.js", "lib/utils.js", ...components.map((component) => `components/${component}.js`)]
    .map((output) => import(pathToFileURL(resolve(packageRoot, "dist", output)).href)),
);

console.log(`Validated ${requiredOutputs.length} React outputs and ${components.length} component contracts.`);
