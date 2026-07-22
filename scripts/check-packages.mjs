import { execFileSync } from "node:child_process";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("check-packages must run through an npm script so npm_execpath is available.");
}

const contracts = {
  "@allfitone/tokens": ["dist/index.js", "dist/index.d.ts", "dist/tokens.css", "dist/tokens.json"],
  "@allfitone/brand": ["assets/manifest.json", "dist/index.js", "dist/react.js", "scripts/sync-assets.mjs"],
  "@allfitone/icons": ["dist/index.js", "dist/react.js", "dist/react.d.ts"],
  "@allfitone/react": ["dist/index.js", "dist/styles.css", "dist/tokens.css", "dist/components/button.js"],
  "@allfitone/react-native": ["dist/index.js", "dist/brand.js", "dist/icons.js", "dist/tokens.js"],
};

for (const [name, requiredFiles] of Object.entries(contracts)) {
  const output = execFileSync(
    process.execPath,
    [npmCli, "pack", "--dry-run", "--json", "--ignore-scripts", "--workspace", name],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
  const [manifest] = JSON.parse(output);
  const files = new Set(manifest.files.map((file) => file.path.replaceAll("\\", "/")));

  for (const path of requiredFiles) {
    if (!files.has(path)) {
      throw new Error(`${name} is missing required packed output: ${path}`);
    }
  }

  for (const path of files) {
    if (path.startsWith("src/") || path.includes(".env") || path.includes("test-results/")) {
      throw new Error(`${name} contains forbidden packed content: ${path}`);
    }
  }

  console.log(`Validated ${name}@${manifest.version}: ${manifest.entryCount} files, ${manifest.unpackedSize} bytes unpacked.`);
}
