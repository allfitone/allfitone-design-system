import { color, motion, radius, semanticColor, semanticSpacing, spacing } from "../dist/index.js";

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const rgba = (hex) => {
  const normalized = hex.slice(1);
  const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
  const alpha = normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1;
  return [...channels, alpha];
};

const composite = (foreground, background) =>
  foreground.slice(0, 3).map((channel, index) => Math.round(channel * foreground[3] + background[index] * (1 - foreground[3])));

const luminance = (channels) => {
  const values = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
};

const contrast = (foreground, background) => {
  const backgroundChannels = rgba(background);
  assert(backgroundChannels[3] === 1, `Contrast background must be opaque: ${background}`);
  const foregroundChannels = composite(rgba(foreground), backgroundChannels);
  const backgroundLuminance = luminance(backgroundChannels.slice(0, 3));
  const foregroundLuminance = luminance(foregroundChannels);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

const contrastPairs = [
  ["dark primary text", semanticColor.dark.text.primary, semanticColor.dark.background.canvas, 4.5],
  ["dark secondary text", semanticColor.dark.text.secondary, semanticColor.dark.background.canvas, 4.5],
  ["dark muted text", semanticColor.dark.text.muted, semanticColor.dark.background.canvas, 4.5],
  ["dark danger text", semanticColor.dark.text.danger, semanticColor.dark.background.canvas, 4.5],
  ["dark primary action", semanticColor.dark.action.onPrimary, semanticColor.dark.action.primary, 4.5],
  ["dark secondary action", semanticColor.dark.action.onSecondary, semanticColor.dark.action.secondary, 4.5],
  ["light primary text", semanticColor.light.text.primary, semanticColor.light.background.canvas, 4.5],
  ["light secondary text", semanticColor.light.text.secondary, semanticColor.light.background.canvas, 4.5],
  ["light muted text", semanticColor.light.text.muted, semanticColor.light.background.canvas, 4.5],
  ["light accent text", semanticColor.light.text.accent, semanticColor.light.background.canvas, 4.5],
  ["light danger text", semanticColor.light.text.danger, semanticColor.light.background.canvas, 4.5],
  ["light primary action", semanticColor.light.action.onPrimary, semanticColor.light.action.primary, 4.5],
  ["light secondary action", semanticColor.light.action.onSecondary, semanticColor.light.action.secondary, 4.5],
  ["success status fill", semanticColor.dark.status.onStatus, semanticColor.dark.status.success, 4.5],
  ["warning status fill", semanticColor.dark.status.onStatus, semanticColor.dark.status.warning, 4.5],
  ["danger status fill", semanticColor.dark.status.onStatus, semanticColor.dark.status.danger, 4.5],
  ["info status fill", semanticColor.dark.status.onStatus, semanticColor.dark.status.info, 4.5],
  ["dark secondary icon", semanticColor.dark.icon.secondary, semanticColor.dark.background.canvas, 3],
  ["light secondary icon", semanticColor.light.icon.secondary, semanticColor.light.background.canvas, 3],
  ["dark strong boundary", semanticColor.dark.border.strong, semanticColor.dark.background.canvas, 3],
  ["light strong boundary", semanticColor.light.border.strong, semanticColor.light.background.canvas, 3],
  ["dark focus ring", semanticColor.dark.focus.ring, semanticColor.dark.background.canvas, 3],
  ["light focus ring", semanticColor.light.focus.ring, semanticColor.light.background.canvas, 3],
];

for (const [name, foreground, background, minimum] of contrastPairs) {
  const ratio = contrast(foreground, background);
  assert(ratio >= minimum, `${name} must meet ${minimum}:1 contrast; received ${ratio.toFixed(2)}:1.`);
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
assert(semanticSpacing.touchTargetWeb >= 44, "Web touch targets must be at least 44 CSS px.");
assert(semanticSpacing.touchTargetIos >= 44, "iOS touch targets must be at least 44 pt.");
assert(semanticSpacing.touchTargetAndroid >= 48, "Android touch targets must be at least 48 dp.");
assert(radius.full === 9999, "Full radius must remain platform-safe.");

const durationValues = Object.values(motion.duration);
assert(durationValues.every((value, index) => index === 0 || value >= durationValues[index - 1]), "Motion durations must be ordered.");

console.log(`Validated ${colorValues.length} primitive colors, ${semanticColorValues.length} semantic colors, ${spacingValues.length} spacing values, and ${contrastPairs.length} contrast pairs.`);
