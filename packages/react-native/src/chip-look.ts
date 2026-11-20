/**
 * What a `Chip` paints, decided apart from the drawing so it can be asserted.
 *
 * The default chip keeps a ground and an edge so it reads as a target on its own. The
 * `bare` one is a word in a grid of many — the months of a year: until it is chosen it
 * has no ground and no edge, because twelve filled pills read as twelve buttons
 * shouting at once. Chosen, both are the same chip.
 */

export type ChipVariant = "default" | "bare";

export interface ChipPaint {
  readonly ground: "surface" | "tonal" | "subtle" | "none";
  readonly edge: "subtle" | "accent" | "disabled" | "none";
  readonly ink: "secondary" | "accent" | "disabled";
}

export function chipPaint({
  selected,
  disabled = false,
  variant = "default",
}: {
  readonly selected: boolean;
  readonly disabled?: boolean | undefined;
  readonly variant?: ChipVariant | undefined;
}): ChipPaint {
  if (disabled) {
    return variant === "bare"
      ? { ground: "none", edge: "none", ink: "disabled" }
      : { ground: "subtle", edge: "disabled", ink: "disabled" };
  }
  if (selected) return { ground: "tonal", edge: "accent", ink: "accent" };
  return variant === "bare"
    ? { ground: "none", edge: "none", ink: "secondary" }
    : { ground: "surface", edge: "subtle", ink: "secondary" };
}
