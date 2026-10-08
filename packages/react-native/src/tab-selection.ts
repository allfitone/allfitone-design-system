/**
 * What a tab strip is, minus React Native.
 *
 * Kept apart from the component for the reason the other geometry modules are: nothing
 * that imports `react-native` resolves outside Metro, so anything left inside the
 * component can only be checked for existence. What is here can be asserted.
 *
 * **An unknown value selects nothing, and that is deliberate.** Falling back to the
 * first tab would draw a strip that disagrees with the state the caller is holding —
 * the panel below shows one thing and the mark above points at another, and neither
 * side raises. Selecting nothing is visible immediately, which is what a bug in a
 * controlled component should be.
 */

/** The accessible floor on iOS. Android's 48 is met by the row this sits in. */
export const TAB_MIN_HEIGHT = 44;

/** Thick enough to read as a mark rather than as a border that moved. */
export const INDICATOR_HEIGHT = 2;

/** The index the strip marks, or `-1` when the value is not one of the tabs. */
export function activeTabIndex(values: readonly string[], value: string): number {
  return values.indexOf(value);
}

/**
 * How a strip draws its labels.
 *
 * `eyebrow` is the default and what every strip so far ships with: short words read as
 * section names, in the overline role. `control` is opt-in for labels written in
 * sentence case — «Exacta», «Rango» — which the eyebrow's wide tracking spreads apart.
 */
export type TabLabelStyle = "eyebrow" | "control";

export function tabLabelStyle(style: TabLabelStyle | undefined): {
  readonly role: TabLabelStyle;
  readonly size: "2xs" | "sm";
} {
  return style === "control" ? { role: "control", size: "sm" } : { role: "eyebrow", size: "2xs" };
}
