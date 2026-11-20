/**
 * What the web adapter decides by theme, on top of the tokens.
 *
 * The signal cannot carry an action on the light theme: cyan on white is under
 * 1.5:1, so a primary button was a pale shape with no edge. There the action is
 * paid in the deep ink of the same family, and elevation falls back to the soft
 * shadow, because the dark theme's 60 % ink reads as a smear on white.
 *
 * These read the stylesheet and the component sources as text: jsdom applies no
 * stylesheet, and the contract is which variable each theme and control reads.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { color } from "../src/tokens.js";

// vitest runs from the package root, and under jsdom the module URL is not a file URL.
const stylesheet = readFileSync(resolve("src/styles/globals.css"), "utf8");
const componentDirectory = resolve("src/components");
const components = readdirSync(componentDirectory)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => ({ file, source: readFileSync(resolve(componentDirectory, file), "utf8") }));

/** The declarations of the top-level rule whose selector list is exactly `selector`. */
function rule(selector: string) {
  const opening = `\n${selector} {\n`;
  let start = stylesheet.indexOf(opening);
  // A match that follows a comma is the tail of a longer selector list.
  while (start !== -1 && stylesheet[start - 1] === ",") start = stylesheet.indexOf(opening, start + 1);
  if (start === -1) throw new Error(`No rule for ${selector}`);
  return stylesheet.slice(start, stylesheet.indexOf("\n}", start));
}

const everyTheme = ':root,\n[data-afo-theme="dark"],\n[data-afo-theme="light"]';
const inkFill =
  "linear-gradient(var(--afo-color-brand-turquoise-ink), var(--afo-color-brand-turquoise-ink))";

function luminance(hex: string) {
  const channel = (offset: number) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (high + 0.05) / (low + 0.05);
}

describe("theme adapter", () => {
  it("keeps the signal gradient as the action unless a theme says otherwise", () => {
    const shared = rule(everyTheme);

    expect(shared).toContain("--afo-action-fill: var(--afo-gradient-accent);");
    expect(shared).toContain("--afo-action-on-fill: var(--afo-color-accent-on-accent);");
    expect(shared).toContain("--afo-floating-shadow: var(--afo-shadow-floating);");
    expect(shared).toContain("--afo-overlay-shadow: var(--afo-shadow-overlay);");
  });

  it("pays for the action in ink on the light theme, with white text", () => {
    const light = rule('[data-afo-theme="light"]');

    expect(light).toContain("--primary: var(--afo-color-brand-turquoise-ink);");
    expect(light).toContain("--primary-foreground: var(--afo-color-neutral-white);");
    // An image even when flat: controls read it as `background-image`.
    expect(light).toContain(`--afo-action-fill: ${inkFill};`);
    expect(light).toContain("--afo-action-on-fill: var(--afo-color-neutral-white);");
  });

  it("keeps the signal on an ink panel, which stays dark on either theme", () => {
    const panel = rule('[data-slot="access-panel"],\n[data-slot="setup-panel-intro"]');

    expect(panel).toContain("--primary: var(--afo-color-action-primary);");
    expect(panel).toContain("--primary-foreground: var(--afo-color-action-on-primary);");
    expect(panel).toContain("--afo-action-fill: var(--afo-gradient-accent);");
    expect(panel).toContain("--afo-action-on-fill: var(--afo-color-accent-on-accent);");
  });

  it("gives a ghost or link button no resting shadow to draw a pill around bare text", () => {
    expect(stylesheet).toMatch(
      /:is\(\[data-variant="ghost"\], \[data-variant="link"\]\):not\(:disabled\) \{\s+box-shadow: none;/,
    );
  });

  it("chose that ink because the signal fails on white and the ink does not", () => {
    expect(contrast(color.brand.primary, color.neutral.white)).toBeLessThan(1.5);
    expect(contrast(color.brand.turquoiseInk, color.neutral.white)).toBeGreaterThan(4.5);
    // The action also has to stand out from the light canvas it sits on.
    expect(contrast(color.brand.turquoiseInk, color.neutral.canvasLight)).toBeGreaterThan(3);
  });

  it("lifts with the soft shadow on the light theme and never with a glow", () => {
    const light = rule('[data-afo-theme="light"]');

    for (const alias of [
      "--afo-control-shadow-hover",
      "--afo-surface-shadow",
      "--afo-floating-shadow",
      "--afo-overlay-shadow",
    ]) {
      expect(light).toContain(`${alias}: var(--afo-shadow-sm);`);
    }
  });

  it("lets no component read an elevation token past the adapter's alias", () => {
    const direct = /--afo-shadow-(?:card|floating|overlay)\b/;
    const offenders = components.filter(({ source }) => direct.test(source)).map(({ file }) => file);

    expect(offenders).toEqual([]);
    expect(stylesheet.match(/box-shadow:[^;]*--afo-shadow-(?:card|floating|overlay)\b/g)).toBeNull();
  });

  it("fills every control with the themed action, not with the signal directly", () => {
    const controls = ["checkbox.tsx", "radio-group.tsx", "switch.tsx", "progress.tsx"];
    const offenders = components
      .filter(({ file }) => controls.includes(file))
      .filter(({ source }) => /--afo-gradient-accent|--afo-color-accent-on-accent/.test(source))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it("draws every active rail with the themed action", () => {
    const direct = /(?:box-shadow|background):[^;]*var\(--afo-color-action-primary\)/g;

    expect(stylesheet.match(direct)).toBeNull();
  });
});
