import { color, motion, radius, semanticColor, spacing } from "../dist/index.js";

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const channels = (hex) => {
  const normalized = hex.slice(1, 7);
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
};

const luminance = (hex) => {
  const values = channels(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
};

const contrast = (foreground, background) => {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const contrastPairs = [
  ["dark primary text", semanticColor.dark.text.primary, semanticColor.dark.background.canvas],
  ["dark primary action", semanticColor.dark.action.onPrimary, semanticColor.dark.action.primary],
  ["light primary text", semanticColor.light.text.primary, semanticColor.light.background.canvas],
  ["light accent text", semanticColor.light.text.accent, semanticColor.light.background.canvas],
  ["light primary action", semanticColor.light.action.onPrimary, semanticColor.light.action.primary],
  ["success status", semanticColor.dark.status.onStatus, semanticColor.dark.status.success],
  ["warning status", semanticColor.dark.status.onStatus, semanticColor.dark.status.warning],
  ["danger status", semanticColor.dark.status.onStatus, semanticColor.dark.status.danger],
  ["info status", semanticColor.dark.status.onStatus, semanticColor.dark.status.info],
];

for (const [name, foreground, background] of contrastPairs) {
  assert(contrast(foreground, background) >= 4.5, `${name} must meet WCAG AA contrast.`);
}

const colorValues = Object.values(color).flatMap((group) => Object.values(group));
for (const value of colorValues) {
  assert(/^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(value), `Invalid color: ${value}`);
}

const semanticColorValues = Object.values(semanticColor).flatMap((theme) =>
  Object.values(theme).flatMap((group) => Object.values(group)),
);
for (const value of semanticColorValues) {
  assert(/^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(value), `Invalid semantic color: ${value}`);
}

const spacingValues = Object.values(spacing);
assert(spacingValues.every((value) => value >= 0 && value % 2 === 0), "Spacing values must stay on the 2 px sub-grid.");
assert(radius.full === 9999, "Full radius must remain platform-safe.");

const durationValues = Object.values(motion.duration);
assert(durationValues.every((value, index) => index === 0 || value >= durationValues[index - 1]), "Motion durations must be ordered.");

console.log(`Validated ${colorValues.length} primitive colors, ${semanticColorValues.length} semantic colors, ${spacingValues.length} spacing values, and ${contrastPairs.length} contrast pairs.`);

