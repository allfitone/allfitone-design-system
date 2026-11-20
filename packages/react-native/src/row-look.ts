/**
 * The rules of a `ContentRow` that do not need React Native, so they can be asserted.
 *
 * **A row that cannot open anything never pretends it can.** Without `onPress` the row
 * only reports, and a chevron or an inner action would promise a place it does not
 * lead to, so both resolve to nothing. A badge still says its word, and a choice or a
 * button keeps its place: each is its own target with its own name.
 *
 * The figure before the chevron is small by default: it is a fact about the row, and
 * at the poster's larger sizes it outweighed the row's own name.
 */

export type RowTrailingInput =
  | {
      readonly kind: "chevron";
      readonly tone?: "muted" | "accent";
      readonly glyph?: "next" | "forward";
    }
  | {
      readonly kind: "action";
      readonly icon: string;
      readonly accessibilityLabel: string;
      readonly onPress: () => void;
    }
  | {
      readonly kind: "badge";
      readonly label: string;
      readonly tone?: string;
      readonly variant?: "solid" | "quiet" | "tonal" | "outline";
      readonly uppercase?: boolean;
      readonly dot?: boolean;
    }
  | {
      readonly kind: "choice";
      readonly items: readonly unknown[];
      readonly value: string;
      readonly onChange: (value: never) => void;
      readonly accessibilityLabel: string;
    }
  | {
      readonly kind: "button";
      readonly label: string;
      readonly onPress: () => void;
      readonly accessibilityLabel?: string;
    }
  | { readonly kind: "date"; readonly weekday: string; readonly day: string }
  | { readonly kind: "none" };

export function resolveRowTrailing<T extends RowTrailingInput>(
  pressable: boolean,
  trailing: T | undefined
):
  | T
  | {
      readonly kind: "chevron";
      readonly tone?: "muted" | "accent";
      readonly glyph?: "next" | "forward";
    }
  | { readonly kind: "none" } {
  if (trailing === undefined)
    return pressable ? { kind: "chevron" } : { kind: "none" };
  if (
    !pressable &&
    (trailing.kind === "chevron" || trailing.kind === "action")
  ) {
    return { kind: "none" };
  }
  return trailing;
}

export type RowValueSize = "sm" | "md" | "lg";

export function rowValueSize(size: RowValueSize | undefined): RowValueSize {
  return size ?? "sm";
}

/** `accent` is the default; `quiet` the grey ink on the muted tile; any tone tints. */
export function rowGlyphPaint(
  iconTone: string | undefined
): "accent" | "quiet" | "tone" {
  if (iconTone === undefined) return "accent";
  return iconTone === "quiet" ? "quiet" : "tone";
}

/** A control at the end takes the width a name needs, so its row lets the words wrap. */
export function rowTextLines(kind: RowTrailingInput["kind"]): 1 | 2 {
  return kind === "choice" || kind === "button" || kind === "badge" ? 2 : 1;
}

/** The name gives way before the tag beside it, so a tag such as «Sigue esta» is never cut. */
export function rowTitleShrink(): { readonly name: 1; readonly tag: 0 } {
  return { name: 1, tag: 0 };
}

export type RowSize = "md" | "sm";
export type RowTone = "surface" | "plain" | "outlined";

/** A small row sets its name a step down and its picture at 40, as a list of many does. */
export function rowDensity({
  size = "md",
  hasIcon = false,
}: {
  readonly size?: RowSize | undefined;
  readonly hasIcon?: boolean | undefined;
}): { readonly name: "md" | "sm"; readonly preview: 56 | 40 } {
  return size === "sm"
    ? { name: "sm", preview: 40 }
    : { name: hasIcon ? "sm" : "md", preview: 56 };
}

/** An outlined row is a link to somewhere else, so its name has the body's weight. */
export function rowNameRole(tone: RowTone): "body" | "control" {
  return tone === "outlined" ? "body" : "control";
}

/** The accent poster is the default figure; plain data is for an amount among others. */
export function rowValuePaint({
  tone = "accent",
  face = "poster",
}: {
  readonly tone?: "accent" | "primary" | "muted" | undefined;
  readonly face?: "poster" | "data" | undefined;
}): { readonly role: "poster" | "data"; readonly ink: "accent" | "primary" | "muted" } {
  return { role: face, ink: tone };
}

/** Inside a group the group owns the surface; alone, an outlined row is a bordered box. */
export function rowFrame({
  tone,
  grouped = false,
}: {
  readonly tone: RowTone;
  readonly grouped?: boolean | undefined;
}): {
  readonly ground: "surface" | "none";
  readonly edge: boolean;
  readonly radius: "card" | "field" | "none";
} {
  if (grouped) return { ground: "none", edge: false, radius: "none" };
  if (tone === "outlined") return { ground: "none", edge: true, radius: "field" };
  return { ground: tone === "surface" ? "surface" : "none", edge: false, radius: "card" };
}
