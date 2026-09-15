import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Split deliberately. The second group imports `react-native`, `expo-font` or
// `expo-linear-gradient`, none of which resolve outside Metro, so those outputs
// can only be checked for existence here. The logic worth defending was
// extracted into the importable modules below precisely so it stays assertable.
const importableOutputs = [
  "index.js",
  "tokens.js",
  "font-family.js",
  "typography-style.js",
  "gradient-geometry.js",
  "sheet-geometry.js",
  "tab-selection.js",
  "step-geometry.js",
];
const nativeOnlyOutputs = [
  "tabs.js",
  "step-list.js",
  "sheet.js",
  "selectable-row.js",
  "selectable-tile.js",
  "disclosure-button.js",
  "brand.js",
  "icons.js",
  "fonts.js",
  "theme.js",
  "text.js",
  "button.js",
  "icon-button.js",
  "screen.js",
  "gradient.js",
  "brand-entrance.js",
  "glass.js",
  "text-field.js",
  "inline-alert.js",
  "backdrop.js",
  "shadow-style.js",
];
const requiredOutputs = [...importableOutputs, ...nativeOnlyOutputs];

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

// Every role must resolve to a face the loader actually registers. A role
// pointing at an unregistered family renders in the platform font and raises
// nothing, so this is the only place the mismatch can be caught.
const { getNativeFontFamily, getRoleFontWeight, nativeFontFamily } = await import(
  "../dist/font-family.js"
);
const { typographyRole } = await import("@allfitone/tokens");

const registeredFamilies = new Set(Object.values(nativeFontFamily));
const loaderSource = await readFile(resolve(packageRoot, "src/fonts.ts"), "utf8");

for (const role of Object.keys(typographyRole)) {
  const family = getNativeFontFamily(role);
  if (!registeredFamilies.has(family)) {
    throw new Error(`Typographic role "${role}" resolves to unregistered family "${family}".`);
  }
  if (!loaderSource.includes(family)) {
    throw new Error(`Family "${family}" is mapped but never loaded by useAllfitFonts.`);
  }
  if (typeof getRoleFontWeight(role) !== "number") {
    throw new Error(`Typographic role "${role}" has no numeric weight.`);
  }
}

// The conversions React Native needs and the web adapter does not. A ratio left
// unconverted still renders text, just at the wrong size.
const { resolveTextStyle } = await import("../dist/typography-style.js");

const display = resolveTextStyle("display", "4xl");
if (display.fontSize !== 36) {
  throw new Error(`Display 4xl resolved to ${display.fontSize}px instead of 36px.`);
}
// 36 x lineHeight.display (0.82) = 29.52, absolute rather than a ratio.
if (Math.abs(display.lineHeight - 29.52) > 0.001) {
  throw new Error(`Display line height resolved to ${display.lineHeight} instead of 29.52.`);
}
// 36 x letterSpacing.display (-0.055) = -1.98, absolute rather than an em ratio.
if (Math.abs(display.letterSpacing - -1.98) > 0.001) {
  throw new Error(`Display letter spacing resolved to ${display.letterSpacing} instead of -1.98.`);
}
if (resolveTextStyle("body", "md").fontFamily !== nativeFontFamily.bodyRegular) {
  throw new Error("Body role does not resolve to the registered body family.");
}

// Roles that lead tighter than their own em box crop the tops of capitals in
// React Native unless the deficit is padded back. Caught only on a device
// otherwise, and it looks like a font bug rather than a leading one.
for (const [role, size] of [["display", "4xl"], ["heading", "2xl"]]) {
  const style = resolveTextStyle(role, size);
  if (style.lineHeight >= style.fontSize) continue;
  const deficit = Math.ceil(style.fontSize - style.lineHeight);
  if (style.paddingTop !== deficit) {
    throw new Error(
      `Role "${role}" leads at ${style.lineHeight} under ${style.fontSize}px and pads ` +
        `${style.paddingTop} instead of ${deficit}; capitals will be clipped.`,
    );
  }
}
// A timer that reflows on every tick is the whole reason this role exists.
const data = resolveTextStyle("data", "3xl");
if (!data.fontVariant?.includes("tabular-nums")) {
  throw new Error("The data role must render tabular figures; a timer reflows without them.");
}
if (resolveTextStyle("body", "md").fontVariant !== undefined) {
  throw new Error("Only the data role asks for tabular figures.");
}

if (resolveTextStyle("body", "md").paddingTop !== 0) {
  throw new Error("Roles that lead at or above their em box must not be padded.");
}

// Controls carry sentence case, so tracking must stay at zero. The `label` role
// tracks at 0.16em for uppercase micro-labels, and applying it to a phrase
// spaces the letters far enough apart to read as broken.
const control = resolveTextStyle("control", "sm");
if (control.letterSpacing !== 0) {
  throw new Error(
    `Control role tracks at ${control.letterSpacing} instead of 0; sentence-case labels will look spaced out.`,
  );
}

// The primary action must carry the accent gradient, not a flat fill. The web
// adapter paints it through `--afo-gradient-accent`, and a flat native button
// looked measurably cheaper than the same control in the Explorer.
const buttonSource = await readFile(resolve(packageRoot, "src/button.tsx"), "utf8");
if (!buttonSource.includes("semanticGradient.accent")) {
  throw new Error("The primary button must paint semanticGradient.accent, matching the web adapter.");
}

// A controlled strip whose value matches no tab must mark nothing. Falling back to
// the first would draw a strip that disagrees with the panel below it, and neither
// side would raise.
const { activeTabIndex, INDICATOR_HEIGHT, TAB_MIN_HEIGHT } = await import(
  "../dist/tab-selection.js"
);

if (activeTabIndex(["how", "variants"], "variants") !== 1) {
  throw new Error("A tab strip must mark the value it was given.");
}
if (activeTabIndex(["how", "variants"], "nope") !== -1) {
  throw new Error("An unknown tab value must mark nothing, not the first tab.");
}
if (TAB_MIN_HEIGHT < 44) {
  throw new Error(`A tab is ${TAB_MIN_HEIGHT}px tall and the iOS touch floor is 44.`);
}
if (INDICATOR_HEIGHT < 2) {
  throw new Error("The active mark must be thicker than the hairline it sits on.");
}

if (activeTabIndex(["how", "variants"], "variants") !== 1) {
  throw new Error("A tab strip must mark the value it was given.");
}
if (activeTabIndex(["how", "variants"], "nope") !== -1) {
  throw new Error("An unknown tab value must mark nothing, not the first tab.");
}
if (TAB_MIN_HEIGHT < 44) {
  throw new Error();
}
if (INDICATOR_HEIGHT < 2) {
  throw new Error("The active mark must be thicker than the hairline it sits on.");
}

// The marker meets the ink of the first line, not the top of its box.
const { stepMarkerOffset, STEP_MARKER_SIZE } = await import("../dist/step-geometry.js");

// Body at 14 in a 21 line box puts its ink centre at 14; a 24 marker centres at 12.
if (stepMarkerOffset(24, 21, 14) !== 2) {
  throw new Error("A 24px marker beside a 14/21 line must drop by 2 to meet its ink.");
}
// A marker taller than the ink sits low enough already; pulling it up would clip it.
if (stepMarkerOffset(40, 21, 14) !== 0) {
  throw new Error("A marker taller than the line it labels must not be dragged upwards.");
}
if (STEP_MARKER_SIZE < 20) {
  throw new Error("A step marker must stay large enough to hold two digits.");
}

// A wrong gradient angle still paints a gradient, pointing the wrong way.
const { resolveGradientEndpoints } = await import("../dist/gradient-geometry.js");

const diagonal = resolveGradientEndpoints(135);
if (diagonal.start.x >= diagonal.end.x || diagonal.start.y >= diagonal.end.y) {
  throw new Error("A 135deg gradient must run top-left to bottom-right.");
}
const downward = resolveGradientEndpoints(180);
if (Math.abs(downward.start.y - 0) > 0.001 || Math.abs(downward.end.y - 1) > 0.001) {
  throw new Error("A 180deg gradient must run straight down.");
}

// A sheet is anchored to the bottom edge, which is where the keyboard appears. One
// that takes typing was covered by the thing it asked for, so the panel lifts by the
// keyboard's height and its cap shrinks by the same amount — without the second half,
// a tall sheet lifted by 300 points runs off the top of the screen.
const { resolveSheetGeometry, MAX_HEIGHT_RATIO } = await import("../dist/sheet-geometry.js");

const resting = resolveSheetGeometry({
  screenHeight: 800,
  keyboardHeight: 0,
  safeAreaBottom: 34,
  basePadding: 16,
});
if (resting.lift !== 0) {
  throw new Error(`A sheet with no keyboard must not lift; it moved ${resting.lift}.`);
}
if (resting.maxHeight !== 800 * MAX_HEIGHT_RATIO) {
  throw new Error(`Resting cap is ${resting.maxHeight} instead of ${800 * MAX_HEIGHT_RATIO}.`);
}
if (resting.paddingBottom !== 50) {
  throw new Error(`Resting padding must clear the home indicator; it is ${resting.paddingBottom}.`);
}

const typing = resolveSheetGeometry({
  screenHeight: 800,
  keyboardHeight: 300,
  safeAreaBottom: 34,
  basePadding: 16,
});
if (typing.lift !== 300) {
  throw new Error(`A sheet must clear the keyboard exactly; it lifted ${typing.lift} of 300.`);
}
if (typing.maxHeight !== 500 * MAX_HEIGHT_RATIO) {
  throw new Error(
    `Cap with the keyboard up is ${typing.maxHeight}; measured against the whole screen it ` +
      `would be ${800 * MAX_HEIGHT_RATIO} and the panel would run off the top.`,
  );
}
if (typing.paddingBottom !== 16) {
  throw new Error(
    `The home indicator is under the keyboard, so reserving for it leaves the panel ` +
      `floating; padding is ${typing.paddingBottom} instead of 16.`,
  );
}

// A keyboard taller than the screen is nonsense the platform has reported before on
// rotation; a negative cap would make the panel disappear rather than merely misfit.
const absurd = resolveSheetGeometry({
  screenHeight: 400,
  keyboardHeight: 900,
  safeAreaBottom: 0,
  basePadding: 16,
});
if (absurd.maxHeight < 0) {
  throw new Error(`A sheet cap must never go negative; it is ${absurd.maxHeight}.`);
}

console.log(
  `Validated ${requiredOutputs.length} React Native adapter outputs, ` +
    `${Object.keys(typographyRole).length} typographic roles, 2 gradient angles ` +
    `and the sheet's keyboard geometry.`,
);
