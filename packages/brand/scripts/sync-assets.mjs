#!/usr/bin/env node

import { cp, mkdir } from "node:fs/promises";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const requestedTarget = process.argv[2];

if (!requestedTarget) {
  console.error("Usage: allfitone-brand-assets <target-directory>");
  process.exit(1);
}

const target = resolve(requestedTarget);
if (target === parse(target).root) {
  throw new Error("Refusing to synchronize assets into a filesystem root.");
}

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(target, { recursive: true });
await cp(resolve(packageRoot, "assets"), target, { recursive: true, force: true });

console.log(`Synchronized Allfit One brand assets to ${target}`);
