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
  "accent-gradient.js",
  "sheet-geometry.js",
  "tab-selection.js",
  "step-geometry.js",
  "segmented-geometry.js",
  "badge-look.js",
  "row-look.js",
  "note-look.js",
  "datum-look.js",
  "offer-look.js",
  "stat-look.js",
  "button-look.js",
  "icon-button-look.js",
  "chip-look.js",
  "disclosure-look.js",
  "alert-look.js",
];
const nativeOnlyOutputs = [
  "badge.js",
  "cover-tile.js",
  "content-row.js",
  "monogram.js",
  "number-field.js",
  "tabs.js",
  "step-list.js",
  "sheet.js",
  "selectable-row.js",
  "segmented-control.js",
  "selectable-tile.js",
  "requirement-list.js",
  "switch.js",
  "record-card.js",
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
  "note.js",
  "datum-row.js",
  "offer-row.js",
  "stat-tile.js",
  "progress-ring.js",
  "toast.js",
  "third-party.js",
  "page-dots.js",
  "backdrop.js",
  "shadow-style.js",
];
const requiredOutputs = [...importableOutputs, ...nativeOnlyOutputs];

await Promise.all(
  requiredOutputs.map((file) => access(resolve(packageRoot, "dist", file)))
);

const packageMetadata = JSON.parse(
  await readFile(resolve(packageRoot, "package.json"), "utf8")
);
const { allfitoneReactNative, designSystemVersion } = await import(
  "../dist/index.js"
);
if (designSystemVersion !== packageMetadata.version) {
  throw new Error(
    `Global React Native version ${designSystemVersion} must match package version ${packageMetadata.version}.`
  );
}
if (allfitoneReactNative.packageVersion !== packageMetadata.version) {
  throw new Error(
    `Runtime React Native version ${allfitoneReactNative.packageVersion} must match package version ${packageMetadata.version}.`
  );
}

const { getNativeTouchTarget, resolveNativeLetterSpacing } = await import(
  "../dist/tokens.js"
);

if (
  getNativeTouchTarget("ios") !== 44 ||
  getNativeTouchTarget("android") !== 48
) {
  throw new Error(
    "React Native touch targets do not match the accessibility contract."
  );
}

if (resolveNativeLetterSpacing(20, "utility") !== 3.2) {
  throw new Error("React Native letter-spacing conversion is invalid.");
}

// Every role must resolve to a face the loader actually registers. A role
// pointing at an unregistered family renders in the platform font and raises
// nothing, so this is the only place the mismatch can be caught.
const { getNativeFontFamily, getRoleFontWeight, nativeFontFamily } =
  await import("../dist/font-family.js");
const { typographyRole } = await import("@allfitone/tokens");

const registeredFamilies = new Set(Object.values(nativeFontFamily));
const loaderSource = await readFile(
  resolve(packageRoot, "src/fonts.ts"),
  "utf8"
);

for (const role of Object.keys(typographyRole)) {
  const family = getNativeFontFamily(role);
  if (!registeredFamilies.has(family)) {
    throw new Error(
      `Typographic role "${role}" resolves to unregistered family "${family}".`
    );
  }
  if (!loaderSource.includes(family)) {
    throw new Error(
      `Family "${family}" is mapped but never loaded by useAllfitFonts.`
    );
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
  throw new Error(
    `Display 4xl resolved to ${display.fontSize}px instead of 36px.`
  );
}
// 36 x lineHeight.display (0.82) = 29.52, absolute rather than a ratio.
if (Math.abs(display.lineHeight - 29.52) > 0.001) {
  throw new Error(
    `Display line height resolved to ${display.lineHeight} instead of 29.52.`
  );
}
// 36 x letterSpacing.display (-0.055) = -1.98, absolute rather than an em ratio.
if (Math.abs(display.letterSpacing - -1.98) > 0.001) {
  throw new Error(
    `Display letter spacing resolved to ${display.letterSpacing} instead of -1.98.`
  );
}
// The card face: italic comes from its own drawn face, never from a synthesised slant.
// A product may open a role's tracking for one use — big numerals that touch —
// without moving the token every other product reads.
const opened = resolveTextStyle("display", "4xl", { tracking: 0.01 });
if (Math.abs(opened.letterSpacing - 0.36) > 0.001) {
  throw new Error(
    `Display tracking 0.01 resolved to ${opened.letterSpacing} instead of 0.36.`
  );
}
if (
  resolveTextStyle("display", "4xl", {}).letterSpacing !== display.letterSpacing
) {
  throw new Error(
    "Leaving tracking out must keep the role's own letter spacing."
  );
}

if (
  resolveTextStyle("poster", "4xl").fontFamily !==
  nativeFontFamily.displayExtraboldItalic
) {
  throw new Error(
    "The poster role must resolve to the drawn extrabold italic face."
  );
}
if (resolveTextStyle("poster", "4xl").fontStyle !== undefined) {
  throw new Error(
    "The poster role must not set fontStyle; Android would synthesise the slant."
  );
}
if (
  resolveTextStyle("body", "md").fontFamily !== nativeFontFamily.bodyRegular
) {
  throw new Error("Body role does not resolve to the registered body family.");
}

// Roles that lead tighter than their own em box crop the tops of capitals in
// React Native unless the deficit is padded back. Caught only on a device
// otherwise, and it looks like a font bug rather than a leading one.
for (const [role, size] of [
  ["display", "4xl"],
  ["heading", "2xl"],
]) {
  const style = resolveTextStyle(role, size);
  if (style.lineHeight >= style.fontSize) continue;
  const deficit = Math.ceil(style.fontSize - style.lineHeight);
  if (style.paddingTop !== deficit) {
    throw new Error(
      `Role "${role}" leads at ${style.lineHeight} under ${style.fontSize}px and pads ` +
        `${style.paddingTop} instead of ${deficit}; capitals will be clipped.`
    );
  }
}
// A leaning face overhangs its own advance, and React Native clips what passes the
// box: «86» lost the edge of its 6. Italic roles pad the lean back; upright ones do not.
for (const size of ["md", "4xl"]) {
  const poster = resolveTextStyle("poster", size);
  if (!(poster.paddingRight >= Math.ceil(poster.fontSize * 0.12))) {
    throw new Error(
      `The poster role at ${size} pads ${poster.paddingRight} on its right; the lean is clipped.`
    );
  }
}
if (resolveTextStyle("display", "4xl").paddingRight !== undefined) {
  throw new Error("An upright role must not pad for a lean it does not have.");
}

// A timer that reflows on every tick is the whole reason this role exists.
const data = resolveTextStyle("data", "3xl");
if (!data.fontVariant?.includes("tabular-nums")) {
  throw new Error(
    "The data role must render tabular figures; a timer reflows without them."
  );
}
if (resolveTextStyle("body", "md").fontVariant !== undefined) {
  throw new Error("Only the data role asks for tabular figures.");
}

if (resolveTextStyle("body", "md").paddingTop !== 0) {
  throw new Error(
    "Roles that lead at or above their em box must not be padded."
  );
}

// Controls carry sentence case, so tracking must stay at zero. The `label` role
// tracks at 0.16em for uppercase micro-labels, and applying it to a phrase
// spaces the letters far enough apart to read as broken.
const control = resolveTextStyle("control", "sm");
if (control.letterSpacing !== 0) {
  throw new Error(
    `Control role tracks at ${control.letterSpacing} instead of 0; sentence-case labels will look spaced out.`
  );
}

// An affirmative action must carry the accent gradient, not a flat fill. The web
// adapter paints it through `--afo-gradient-accent`, and a flat native button
// looked measurably cheaper than the same control in the Explorer. Both the
// labelled pill and the round tick are checked, because it was exactly their
// disagreement — one painted, one flat — that sent this through the library.
const gradientSource = await readFile(
  resolve(packageRoot, "src/accent-gradient.ts"),
  "utf8"
);
if (!gradientSource.includes("semanticGradient.accent")) {
  throw new Error(
    "The accent gradient must resolve semanticGradient.accent, matching the web adapter."
  );
}
for (const component of ["button.tsx", "icon-button.tsx"]) {
  const source = await readFile(resolve(packageRoot, "src", component), "utf8");
  if (!source.includes("resolveAccentGradient")) {
    throw new Error(
      `${component} must paint the accent through resolveAccentGradient, not its own copy.`
    );
  }
}

// The destructive action is the other side of that rule. It is a flat `status.danger`
// fill, because a delete is a plain control and not the one signal surface per screen.
const buttonSource = await readFile(
  resolve(packageRoot, "src/button.tsx"),
  "utf8"
);
const dangerPalette = buttonSource.match(
  /case "danger":\s*return \{([\s\S]*?)\};/
)?.[1];
if (!dangerPalette) {
  throw new Error(
    "Button must resolve a danger palette; destructive actions have no other control."
  );
}
if (!dangerPalette.includes("theme.color.status.danger")) {
  throw new Error(
    "The danger variant must fill with status.danger rather than a local colour."
  );
}
if (!dangerPalette.includes("theme.color.status.onStatus")) {
  throw new Error(
    "The danger label must use status.onStatus, the foreground the tokens intend over a status fill."
  );
}
if (!/gradient:\s*false/.test(dangerPalette)) {
  throw new Error(
    "The danger variant must not spend the one accent gradient a screen is allowed."
  );
}

const outlineDangerPalette = buttonSource.match(
  /case "outlineDanger":\s*return \{([\s\S]*?)\};/
)?.[1];
if (
  !outlineDangerPalette ||
  !outlineDangerPalette.includes("theme.color.border.subtle") ||
  !outlineDangerPalette.includes("theme.color.status.danger")
) {
  throw new Error(
    "The outlined danger variant must draw the red word in the subtle outline, as buttonLook says."
  );
}

// A controlled strip whose value matches no tab must mark nothing. Falling back to
// the first would draw a strip that disagrees with the panel below it, and neither
// side would raise.
const { activeTabIndex, INDICATOR_HEIGHT, TAB_MIN_HEIGHT, tabLabelStyle } = await import(
  "../dist/tab-selection.js"
);

// The label stays an eyebrow unless a screen asks otherwise: strips already shipped must
// not change under the products that use them. «control» is the opt-in for labels in
// sentence case, which the eyebrow's wide tracking spreads apart.
if (tabLabelStyle(undefined).role !== "eyebrow" || tabLabelStyle("eyebrow").role !== "eyebrow") {
  throw new Error("A tab strip must keep its eyebrow labels by default.");
}
if (tabLabelStyle("control").role !== "control") {
  throw new Error("A tab strip asked for control labels must draw them in the control role.");
}

if (activeTabIndex(["how", "variants"], "variants") !== 1) {
  throw new Error("A tab strip must mark the value it was given.");
}
if (activeTabIndex(["how", "variants"], "nope") !== -1) {
  throw new Error("An unknown tab value must mark nothing, not the first tab.");
}
if (TAB_MIN_HEIGHT < 44) {
  throw new Error(
    `A tab is ${TAB_MIN_HEIGHT}px tall and the iOS touch floor is 44.`
  );
}
if (INDICATOR_HEIGHT < 2) {
  throw new Error(
    "The active mark must be thicker than the hairline it sits on."
  );
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
  throw new Error(
    "The active mark must be thicker than the hairline it sits on."
  );
}

// The marker meets the ink of the first line, not the top of its box.
const { stepMarkerOffset, STEP_MARKER_SIZE } = await import(
  "../dist/step-geometry.js"
);

// Body at 14 in a 21 line box puts its ink centre at 14; a 24 marker centres at 12.
if (stepMarkerOffset(24, 21, 14) !== 2) {
  throw new Error(
    "A 24px marker beside a 14/21 line must drop by 2 to meet its ink."
  );
}
// A marker taller than the ink sits low enough already; pulling it up would clip it.
if (stepMarkerOffset(40, 21, 14) !== 0) {
  throw new Error(
    "A marker taller than the line it labels must not be dragged upwards."
  );
}
if (STEP_MARKER_SIZE < 20) {
  throw new Error("A step marker must stay large enough to hold two digits.");
}

// Every affirmative action paints the same accent, so a round tick and a labelled
// pill cannot drift apart. Two stops is the floor `LinearGradient` requires.
const { resolveAccentGradient } = await import("../dist/accent-gradient.js");

const accent = resolveAccentGradient();
if (
  accent.colors.length < 2 ||
  accent.colors.length !== accent.locations.length
) {
  throw new Error(
    "The accent gradient needs a position for every colour, and two of each."
  );
}
for (const position of accent.locations) {
  if (position < 0 || position > 1) {
    throw new Error(
      "Gradient stops are fractions here, not the percentages the token declares."
    );
  }
}

// A wrong gradient angle still paints a gradient, pointing the wrong way.
const { resolveGradientEndpoints } = await import(
  "../dist/gradient-geometry.js"
);

const diagonal = resolveGradientEndpoints(135);
if (diagonal.start.x >= diagonal.end.x || diagonal.start.y >= diagonal.end.y) {
  throw new Error("A 135deg gradient must run top-left to bottom-right.");
}
const downward = resolveGradientEndpoints(180);
if (
  Math.abs(downward.start.y - 0) > 0.001 ||
  Math.abs(downward.end.y - 1) > 0.001
) {
  throw new Error("A 180deg gradient must run straight down.");
}

// A sheet is anchored to the bottom edge, which is where the keyboard appears. One
// that takes typing was covered by the thing it asked for, so the panel lifts by the
// keyboard's height and its cap shrinks by the same amount — without the second half,
// a tall sheet lifted by 300 points runs off the top of the screen.
const { resolveSheetGeometry, MAX_HEIGHT_RATIO } = await import(
  "../dist/sheet-geometry.js"
);

const resting = resolveSheetGeometry({
  screenHeight: 800,
  keyboardHeight: 0,
  safeAreaBottom: 34,
  basePadding: 16,
});
if (resting.lift !== 0) {
  throw new Error(
    `A sheet with no keyboard must not lift; it moved ${resting.lift}.`
  );
}
if (resting.maxHeight !== 800 * MAX_HEIGHT_RATIO) {
  throw new Error(
    `Resting cap is ${resting.maxHeight} instead of ${800 * MAX_HEIGHT_RATIO}.`
  );
}
if (resting.paddingBottom !== 50) {
  throw new Error(
    `Resting padding must clear the home indicator; it is ${resting.paddingBottom}.`
  );
}

const typing = resolveSheetGeometry({
  screenHeight: 800,
  keyboardHeight: 300,
  safeAreaBottom: 34,
  basePadding: 16,
});
if (typing.lift !== 300) {
  throw new Error(
    `A sheet must clear the keyboard exactly; it lifted ${typing.lift} of 300.`
  );
}
if (typing.maxHeight !== 500 * MAX_HEIGHT_RATIO) {
  throw new Error(
    `Cap with the keyboard up is ${typing.maxHeight}; measured against the whole screen it ` +
      `would be ${800 * MAX_HEIGHT_RATIO} and the panel would run off the top.`
  );
}
if (typing.paddingBottom !== 16) {
  throw new Error(
    `The home indicator is under the keyboard, so reserving for it leaves the panel ` +
      `floating; padding is ${typing.paddingBottom} instead of 16.`
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
  throw new Error(
    `A sheet cap must never go negative; it is ${absurd.maxHeight}.`
  );
}

// With the keyboard up, the only backdrop left to touch is the strip above the lifted
// panel, and touching it means «I am done typing», not «throw this away».
const { backdropIntent } = await import("../dist/sheet-geometry.js");
if (backdropIntent(300) !== "dismiss-keyboard") {
  throw new Error(
    `A backdrop touched while typing must only close the keyboard.`
  );
}
if (backdropIntent(0) !== "dismiss") {
  throw new Error(`A backdrop touched with no keyboard must close the sheet.`);
}

// A badge that can take a colour stops being a badge and becomes a sticker, which is
// the DT-009 rule stated as something a build can check.
const badgeSource = await readFile(
  resolve(packageRoot, "src", "badge.tsx"),
  "utf8"
);
if (!badgeSource.includes("theme.color.status.onStatus")) {
  throw new Error(
    "Badge must take its ink from `status.onStatus`; a hand-picked white or black " +
      "loses contrast in one of the two themes."
  );
}
for (const literal of badgeSource.match(/#[0-9A-Fa-f]{3,8}\b/g) ?? []) {
  throw new Error(
    `Badge carries the raw colour ${literal}; tones come from the palette.`
  );
}

// `cover-tile.js` imports `react-native`, so its geometry is read from the source. A row
// the height of the tile is why `xs` exists, and the corner has to follow the box.
const coverTileSource = await readFile(
  resolve(packageRoot, "src", "cover-tile.tsx"),
  "utf8"
);
const coverTileBox = coverTileSource.match(/const BOX = \{([^}]*)\}/)?.[1];
if (!/\bxs:\s*44\b/.test(coverTileBox ?? "")) {
  throw new Error(
    `CoverTile's \`xs\` box must be 44 square; it is {${coverTileBox?.trim()}} and a row ` +
      "sized to the tile would stand taller than its content asked for."
  );
}
const coverTileRadius = coverTileSource.match(
  /const RADIUS = \{([^}]*)\}/
)?.[1];
if (!/\bxs:\s*14\b/.test(coverTileRadius ?? "")) {
  throw new Error(
    `CoverTile's \`xs\` corner must be 14; it is {${coverTileRadius?.trim()}} and a box ` +
      "that shrinks without its corner reads as a different shape, not a smaller one."
  );
}

// Touching nothing in particular puts the keyboard away, and does it by observing the
// touch rather than claiming it. Claiming it would silently eat presses on everything
// underneath, which is the failure this check exists to catch — it looks identical until
// somebody tries to drag a row.
const screenSource = await readFile(
  resolve(packageRoot, "src", "screen.tsx"),
  "utf8"
);
if (!screenSource.includes("onStartShouldSetResponder")) {
  throw new Error(
    "Screen must put the keyboard away when a touch lands on nothing: a form under a " +
      "header that stays put has no other way to dismiss it."
  );
}
if (
  !/function dismissKeyboard\(\): boolean \{[\s\S]*?return false;/.test(
    screenSource
  )
) {
  throw new Error(
    "Screen's keyboard dismissal must answer `false` and never become the responder; " +
      "claiming the touch would swallow presses and block gestures underneath."
  );
}

// El fondo ambiental es del lienzo, así que tiene que dibujarse **fuera** de la caja
// con relleno y fuera del área segura. Dentro queda metido por el `paddingHorizontal` y
// deja dos franjas sin pintar a los costados y otra bajo la muesca: se ve idéntico en
// un mockup y sólo salta en el aparato, que es justo lo que esta comprobación busca.
if (!screenSource.includes("<AmbientBackdrop ")) {
  throw new Error(
    "Screen must draw the ambient backdrop: the ground is the canvas's, and a product " +
      "mounting it screen by screen is how two grounds appear in one app."
  );
}
if (
  screenSource.indexOf("<AmbientBackdrop ") >
  screenSource.indexOf("<SafeAreaView")
) {
  throw new Error(
    "Screen's ambient backdrop must sit outside the SafeAreaView; inside it is inset by " +
      "the padding and leaves unpainted strips down the sides and under the notch."
  );
}

// Un aviso que se puede quitar tiene que poder quitarse de las dos maneras, y el
// temporizador tiene que colgar del mensaje: atado a otra cosa, un aviso nuevo heredaría
// lo que le quedaba al anterior y se iría a mitad de leerlo.
const alertSource = await readFile(
  resolve(packageRoot, "src", "inline-alert.tsx"),
  "utf8"
);
if (!alertSource.includes("accessibilityLabel={`Quitar aviso:")) {
  throw new Error(
    "InlineAlert's dismissable form must name what it removes: «quitar» alone on nine " +
      "screens tells a screen reader nothing about which notice it is."
  );
}
if (!/useEffect\([\s\S]*?\[message, autoDismissMs/.test(alertSource)) {
  throw new Error(
    "InlineAlert's timer must depend on the message: a new notice has to start counting " +
      "from zero instead of inheriting what was left of the last one."
  );
}

// A toast confirms; it does not interrupt. `alert` would cut off whatever the screen
// reader was saying, and a timer tied to anything but the message would cut a new one short.
const toastSource = await readFile(
  resolve(packageRoot, "src", "toast.tsx"),
  "utf8"
);
const toastCode = toastSource
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "");
if (/accessibilityRole=\{?"alert"/.test(toastCode)) {
  throw new Error(
    'Toast must not use accessibilityRole="alert"; a confirmation is not an error.'
  );
}
if (!toastCode.includes('accessibilityLiveRegion="polite"')) {
  throw new Error(
    "Toast must be a polite live region, or Android never speaks it."
  );
}
if (
  !toastCode.includes("AccessibilityInfo.announceForAccessibility(message)")
) {
  throw new Error("Toast must announce on iOS, which ignores live regions.");
}
if (!/useEffect\([\s\S]*?\[message, duration/.test(toastCode)) {
  throw new Error(
    "Toast's timer must depend on the message so a new one restarts the clock."
  );
}
if (!toastCode.includes("semanticMotion.reduced")) {
  throw new Error("Toast must fall back to the reduced motion step.");
}

// The Instagram glyph is Meta's geometry verbatim; a redraw would no longer be their mark.
const thirdPartyOutput = await readFile(
  resolve(packageRoot, "dist", "third-party.js"),
  "utf8"
);
if (!thirdPartyOutput.includes("M7.0301.084c-1.2768.")) {
  throw new Error(
    "third-party.js must carry the Simple Icons Instagram path unchanged."
  );
}

// Un campo sin etiqueta dibujada sigue teniendo nombre. Es el único punto donde
// `hideLabel` puede convertirse en un campo mudo para quien lo oye.
const fieldSource = await readFile(
  resolve(packageRoot, "src", "text-field.tsx"),
  "utf8"
);
if (!/accessibilityLabel=\{label\}/.test(fieldSource)) {
  throw new Error(
    "TextField must keep `accessibilityLabel={label}`: `hideLabel` hides the drawn " +
      "label, and without the spoken one the field has no name at all."
  );
}
if (!/aria-labelledby=\{hideLabel \? undefined :/.test(fieldSource)) {
  throw new Error(
    "TextField must drop `aria-labelledby` when the label is hidden: it would point at " +
      "an element that is not rendered, which leaves the field unnamed rather than named twice."
  );
}

// The pill's geometry is `width`, never a scale. Comments are stripped first because
// the file argues that decision in prose, naming the very thing it rejects.
const pageDotsSource = await readFile(
  resolve(packageRoot, "src", "page-dots.tsx"),
  "utf8"
);
const pageDotsCode = pageDotsSource
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "");

if ((pageDotsCode.match(/\bwidth:/g) ?? []).length < 2) {
  throw new Error(
    "Both of PageDots' paths must animate `width`: the stepped one and the one that " +
      "follows the finger, or the two rows stop being the same component."
  );
}
if (/\b(transform|scaleX)\b/.test(pageDotsCode)) {
  throw new Error(
    "PageDots must not stretch the pill with a transform: scaling a four-point pill " +
      "along one axis smears its corners into ovals, and only a screenshot catches it."
  );
}

// The continuous path has to stay on the UI thread. One that hops back to React still
// animates on a simulator and drops frames on a phone, under the finger.
if (!/useAnimatedStyle\(/.test(pageDotsCode)) {
  throw new Error(
    "PageDots must read its fractional index inside `useAnimatedStyle`; computed " +
      "anywhere else it costs a render per frame of the drag."
  );
}
for (const hop of ["runOnJS", "scheduleOnRN", "useState"]) {
  if (pageDotsCode.includes(hop)) {
    throw new Error(
      `PageDots reaches for \`${hop}\`: following the finger must never schedule work ` +
        "back to the React runtime, which is the whole reason the shared value exists."
    );
  }
}

// A segmented control has two sizes, and both are a finger's target, whatever is drawn.
const { segmentedGeometry } = await import("../dist/segmented-geometry.js");
const regular = segmentedGeometry("md");
const small = segmentedGeometry("sm");
if (regular.height !== 48 || regular.inset !== 4) {
  throw new Error("The regular segmented control keeps its 48 track with a 4 inset.");
}
if (small.height >= regular.height || small.labelSize === regular.labelSize) {
  throw new Error("The small segmented control must be smaller, and say so in its label too.");
}
for (const [name, geometry] of [["md", regular], ["sm", small]]) {
  const segment = geometry.height - 2 * geometry.inset;
  if (segment + 2 * geometry.hitSlop < getNativeTouchTarget("android")) {
    throw new Error(
      `A ${name} segment is ${segment} tall; with its slop it must still reach ` +
        `${getNativeTouchTarget("android")}, the larger of the two platform targets.`
    );
  }
}

// A badge's look. The two variants already shipped must not move under the products
// that use them; `tonal` is the new soft one, and caps and the dot are the caller's.
const { badgeLook } = await import("../dist/badge-look.js");
const same = (actual, expected, message) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: ${JSON.stringify(actual)}`);
  }
};
const look = (fill, edge, ink, role, size, uppercase, dot) =>
  ({ fill, edge, ink, role, size, uppercase, dot });
same(
  badgeLook({ tone: "success" }),
  look("tone", "fill", "onStatus", "eyebrow", "2xs", true, false),
  "A solid toned badge keeps its filled eyebrow"
);
same(
  badgeLook({}),
  look("none", "border", "secondary", "eyebrow", "2xs", true, false),
  "A neutral badge keeps its outline"
);
same(
  badgeLook({ tone: "success", variant: "quiet" }),
  look("canvas", "chip", "tone", "control", "xs", false, false),
  "A quiet badge keeps its lower-case phrase on the canvas"
);
same(
  badgeLook({ tone: "success", variant: "tonal", dot: true }),
  look("tint", "none", "tone", "eyebrow", "2xs", true, true),
  "A tonal badge tints its ground and inks its word in the tone"
);
same(
  badgeLook({ tone: "success", variant: "tonal", uppercase: false }),
  look("tint", "none", "tone", "control", "xs", false, false),
  "A tonal badge asked for no caps reads as a word"
);
same(
  badgeLook({ variant: "tonal" }),
  look("muted", "none", "secondary", "eyebrow", "2xs", true, false),
  "A neutral tonal badge sits on the muted surface"
);
if (badgeLook({ tone: "success", uppercase: false }).role !== "control") {
  throw new Error("Any badge asked for no caps must drop the eyebrow's wide tracking.");
}

// A note is one phrase with a mark: small under a form, a step up beside content.
// `accent` inks the mark; the tonal tile belongs to the larger size only.
const { noteLook } = await import("../dist/note-look.js");
same(
  noteLook({}),
  { textSize: "xs", iconSize: 12, boxed: false, tile: false, accent: false, outlined: false },
  "A note is small and grey by default"
);
same(
  noteLook({ size: "md", tile: true }),
  { textSize: "sm", iconSize: 16, boxed: false, tile: true, accent: true, outlined: false },
  "A medium note in the tonal tile inks its mark in the accent"
);
same(
  noteLook({ size: "md", accent: true }),
  { textSize: "sm", iconSize: 16, boxed: false, tile: false, accent: true, outlined: false },
  "An accented note without a tile only inks its mark"
);
same(
  noteLook({ size: "sm", tile: true, boxed: true }),
  { textSize: "xs", iconSize: 12, boxed: true, tile: false, accent: false, outlined: false },
  "A small note has no tile"
);

// An outlined note stands alone in a section, as a panel: its mark grows to 16 so it
// reads beside the phrase, and the outline replaces the muted ground.
same(
  noteLook({ outlined: true, accent: true }),
  { textSize: "xs", iconSize: 16, boxed: false, tile: false, accent: true, outlined: true },
  "An outlined small note keeps its small phrase and draws a 16 mark"
);
same(
  noteLook({ outlined: true, boxed: true }).boxed,
  false,
  "An outlined note has no muted ground"
);

// An offer is a way out offered in a row: three grounds, each with its own tile.
const { offerLook } = await import("../dist/offer-look.js");
same(
  offerLook({ tone: "deep" }),
  { ground: "signal", edge: false, radius: 22, padding: [14, 0], height: 74, gap: 12,
    tile: { size: 42, radius: 14, fill: "solid", edge: false }, iconSize: "sm",
    captionSize: "sm", captionLines: 0, chevron: true },
  "The deep offer keeps the signal ground, the solid tile and the chevron"
);
same(
  offerLook({ tone: "quiet" }),
  { ground: "surface", edge: true, radius: 20, padding: [14, 12], height: 0, gap: 12,
    tile: { size: 36, radius: 12, fill: "tonal", edge: false }, iconSize: "sm",
    captionSize: "sm", captionLines: 0, chevron: false },
  "The quiet offer is flat, outlined, with the tonal tile and no arrow"
);
same(
  offerLook({ tone: "muted" }),
  { ground: "muted", edge: true, radius: 22, padding: [14, 14], height: 0, gap: 14,
    tile: { size: 46, radius: 16, fill: "tint", edge: true }, iconSize: "md",
    captionSize: "xs", captionLines: 1, chevron: true },
  "The muted offer is a card on a sheet with a large tinted tile"
);
if (offerLook({ tone: "deep", end: "none" }).chevron || !offerLook({ tone: "quiet", end: "chevron" }).chevron) {
  throw new Error("An offer's end is the caller's when it says so.");
}

// A stat tile is a figure somebody picks to edit: chosen, its edge turns accent and thickens.
const { statTileLook, ringArc } = await import("../dist/stat-look.js");
same(
  statTileLook({ layout: "stack", selected: false }),
  { direction: "column", align: "center", radius: 22, padding: 12, gap: 6, edge: "subtle", edgeWidth: 1 },
  "A stacked stat tile centres its figure on a 22 card"
);
same(
  statTileLook({ layout: "inline", selected: true }),
  { direction: "row", align: "center", radius: 20, padding: 14, gap: 10, edge: "accent", edgeWidth: 1.5 },
  "A chosen inline stat tile wears the accent edge"
);
const arc = ringArc(76, 7, 0.25);
if (Math.abs(arc.radius - 34.5) > 1e-9 || Math.abs(arc.filled - arc.length / 4) > 1e-9) {
  throw new Error(`A ring's arc is its share of the circumference: ${JSON.stringify(arc)}`);
}
if (ringArc(76, 7, 1.4).filled !== ringArc(76, 7, 1).filled || ringArc(76, 7, -1).filled !== 0) {
  throw new Error("A ring's share is clamped between nothing and the whole circle.");
}

// A destructive action that leaves a whole screen keeps its outline: the pill with the
// red word, weighed like a secondary action rather than like a link.
const { buttonLook } = await import("../dist/button-look.js");
same(
  buttonLook("outlineDanger"),
  { fill: "none", edge: "subtle", ink: "danger", gradient: false, shadow: false },
  "The outlined danger button is a red word in a subtle outline"
);
same(
  buttonLook("quietDanger"),
  { fill: "none", edge: "none", ink: "danger", gradient: false, shadow: false },
  "The quiet danger button keeps no outline"
);
same(
  buttonLook("primary"),
  { fill: "primary", edge: "none", ink: "onPrimary", gradient: true, shadow: true },
  "The primary button keeps its gradient and its shadow"
);

// The smallest icon button is the glyph alone, beside content in a tight row; its reach
// is all slop, and still a finger's target on both platforms.
const { iconButtonBox } = await import("../dist/icon-button-look.js");
for (const size of ["xs", "sm"]) {
  const { box, reach } = iconButtonBox(size, getNativeTouchTarget("android"));
  if (box + 2 * reach < getNativeTouchTarget("android")) {
    throw new Error(`An ${size} icon button reaches ${box + 2 * reach}, short of the target.`);
  }
}
if (iconButtonBox("xs", 48).box !== 16) {
  throw new Error("An xs icon button takes only its glyph's width, so the row keeps its words.");
}

// A row that cannot open anything never pretends it can: no chevron, no action.
const { resolveRowTrailing, rowValueSize, rowGlyphPaint, rowTextLines } = await import(
  "../dist/row-look.js"
);
same(resolveRowTrailing(true, undefined), { kind: "chevron" }, "A pressable row opens with a chevron");
same(resolveRowTrailing(false, undefined), { kind: "none" }, "A row that only reports ends in nothing");
same(
  resolveRowTrailing(false, { kind: "chevron" }),
  { kind: "none" },
  "A row that only reports must not draw a chevron"
);
same(
  resolveRowTrailing(false, { kind: "badge", label: "Pronto" }),
  { kind: "badge", label: "Pronto" },
  "A row that only reports keeps its badge"
);
// A control is its own target: a row that only reports may still end in a choice or
// a button, and a date is a fact either way.
for (const trailing of [
  { kind: "choice", items: [], value: "a", onChange: () => {}, accessibilityLabel: "x" },
  { kind: "button", label: "Quitar", onPress: () => {} },
  { kind: "date", weekday: "LUN", day: "16" },
]) {
  if (resolveRowTrailing(false, trailing) !== trailing) {
    throw new Error(`A row that only reports must keep its ${trailing.kind} trailing.`);
  }
}

// A control at the end takes the width a name needs; such a row lets its name and
// caption wrap to a second line instead of cutting «Entrenar con Bodytech C…».
same(
  ["chevron", "none", "date", "choice", "button", "badge"].map(rowTextLines),
  [1, 1, 1, 2, 2, 2],
  "Only a row ending in a control lets its words wrap"
);

// A datum unanswered says so and offers the answer; answered, it shows where it came
// from, and the versions link only when there are other versions.
const { datumLines } = await import("../dist/datum-look.js");
same(
  datumLines({}),
  { value: "Sin responder", answered: false, origin: undefined, answer: "Responder" },
  "An unanswered datum says so and offers the answer"
);
same(
  datumLines({ value: "En casa", origin: "Declarado por ti" }),
  { value: "En casa", answered: true, origin: "Declarado por ti", answer: undefined },
  "An answered datum shows its origin and offers nothing else"
);

const { rowTitleShrink } = await import("../dist/row-look.js");
same(
  rowTitleShrink(),
  { name: 1, tag: 0 },
  "The name gives way before the tag: «Sigue esta» is always read whole"
);

if (rowValueSize(undefined) !== "sm" || rowValueSize("lg") !== "lg") {
  throw new Error("A row's figure is small unless the screen asks for another size.");
}
same(
  [undefined, "quiet", "neutral", "danger"].map(rowGlyphPaint),
  ["accent", "quiet", "tone", "tone"],
  "The glyph keeps its accent by default; quiet is the grey ink on the muted tile"
);

// Round two of TECH-327: what Space keeps as it is today, now drawn by the library.
same(
  offerLook({ tone: "tonal" }),
  { ground: "tonal", edge: true, radius: 18, padding: [16, 16], height: 0, gap: 12,
    tile: { size: 0, radius: 0, fill: "none", edge: false }, iconSize: "md",
    captionSize: "xs", captionLines: 0, chevron: false },
  "The tonal offer is the accent ground with a bare mark and no arrow («Lo anterior…»)"
);
same(
  offerLook({ tone: "action" }),
  { ground: "subtle", edge: true, radius: 18, padding: [12, 12], height: 0, gap: 14,
    tile: { size: 36, radius: 12, fill: "muted", edge: false }, iconSize: "sm",
    captionSize: "sm", captionLines: 0, chevron: false },
  "The action offer is a card in a sheet's menu, its tile quiet and no arrow"
);
const { offerPaint } = await import("../dist/offer-look.js");
same(
  offerPaint({ tone: "action", danger: true }),
  { ground: "danger", edge: "danger", tile: "danger", glyph: "danger", label: "md",
    labelInk: "danger", captionInk: "muted" },
  "A destructive action wears the danger ground, edge, tile and name"
);
same(
  offerPaint({ tone: "action" }),
  { ground: "subtle", edge: "subtle", tile: "muted", glyph: "primary", label: "md",
    labelInk: "primary", captionInk: "muted" },
  "An ordinary action is quiet: primary glyph on the muted tile"
);
same(
  offerPaint({ tone: "tonal" }),
  { ground: "tonal", edge: "accent", tile: "none", glyph: "tone", label: "sm",
    labelInk: "primary", captionInk: "secondary" },
  "The tonal offer edges in the accent and sets its name a step down"
);
same(
  offerPaint({ tone: "quiet", danger: true }),
  { ground: "surface", edge: "subtle", tile: "tonal", glyph: "tone", label: "md",
    labelInk: "primary", captionInk: "muted" },
  "Only an action can be destructive"
);

same(
  badgeLook({ tone: "accent", variant: "outline" }),
  look("none", "tone", "tone", "eyebrow", "2xs", true, false),
  "An outlined badge draws only its edge and word in the tone («Récord»)"
);
same(
  badgeLook({ tone: "success", variant: "outline", uppercase: false, dot: true }),
  look("none", "tone", "tone", "control", "xs", false, true),
  "The outlined live state keeps its dot in sentence case («Activo»)"
);

const { chipPaint } = await import("../dist/chip-look.js");
same(
  [false, true].map((selected) => chipPaint({ selected })),
  [{ ground: "surface", edge: "subtle", ink: "secondary" }, { ground: "tonal", edge: "accent", ink: "accent" }],
  "A chip keeps its ground and edge, and the accent when chosen"
);
same(
  [false, true].map((selected) => chipPaint({ selected, variant: "bare" })),
  [{ ground: "none", edge: "none", ink: "secondary" }, { ground: "tonal", edge: "accent", ink: "accent" }],
  "A bare chip is only its word until it is chosen («Elige un mes»)"
);
same(
  chipPaint({ selected: false, disabled: true, variant: "bare" }),
  { ground: "none", edge: "none", ink: "disabled" },
  "A bare chip that cannot be chosen stays bare"
);

const { rowDensity, rowNameRole, rowValuePaint, rowFrame } = await import("../dist/row-look.js");
same(
  [rowDensity({}), rowDensity({ hasIcon: true }), rowDensity({ size: "sm" })],
  [{ name: "md", preview: 56 }, { name: "sm", preview: 56 }, { name: "sm", preview: 40 }],
  "A small row sets its name a step down and its picture at 40"
);
if (rowNameRole("outlined") !== "body" || rowNameRole("surface") !== "control") {
  throw new Error("An outlined row is a link and names it in the body's weight.");
}
same(
  [rowValuePaint({}), rowValuePaint({ tone: "primary", face: "data" }), rowValuePaint({ tone: "muted", face: "data" })],
  [{ role: "poster", ink: "accent" }, { role: "data", ink: "primary" }, { role: "data", ink: "muted" }],
  "A row's figure is the accent poster unless the screen asks for plain data («$19.900»)"
);
same(
  [rowFrame({ tone: "surface" }), rowFrame({ tone: "outlined" }), rowFrame({ tone: "outlined", grouped: true })],
  [{ ground: "surface", edge: false, radius: "card" }, { ground: "none", edge: true, radius: "field" }, { ground: "none", edge: false, radius: "none" }],
  "An outlined row is a bordered box on the screen's own ground («Dónde entrenas»)"
);

const { disclosureLook } = await import("../dist/disclosure-look.js");
same(
  disclosureLook("select"),
  { ground: "muted", edgeWidth: 1.5, radius: 14, minHeight: 52, label: "2xs", value: "md", glyph: "expand" },
  "A select reads as a picker: the small label over the value and a down chevron («+57»)"
);
if (disclosureLook("field").glyph !== "next" || disclosureLook("stacked").glyph !== "none") {
  throw new Error("The field and stacked disclosures keep their ends.");
}

const { alertMarkSize } = await import("../dist/alert-look.js");
if (alertMarkSize(undefined) !== "xs" || alertMarkSize("md") !== "md") {
  throw new Error("An alert's mark is small unless a panel asks for the larger one.");
}

const { noteAlign } = await import("../dist/note-look.js");
same(
  [noteAlign(undefined), noteAlign("center")],
  [{ justify: "flex-start", grow: true }, { justify: "center", grow: false }],
  "A centred note sits in the middle and its phrase stops filling the row («Solo tú la ves»)"
);

console.log(
  `Validated ${requiredOutputs.length} React Native adapter outputs, ` +
    `${
      Object.keys(typographyRole).length
    } typographic roles, 2 gradient angles ` +
    `and the sheet's keyboard geometry.`
);
