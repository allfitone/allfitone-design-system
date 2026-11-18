/**
 * The rules of a `ContentRow` that do not need React Native, so they can be asserted.
 *
 * **A row that cannot open anything never pretends it can.** Without `onPress` the row
 * only reports, and a chevron or an inner action would promise a place it does not
 * lead to, so both resolve to nothing. A badge still says its word.
 *
 * The figure before the chevron is small by default: it is a fact about the row, and
 * at the poster's larger sizes it outweighed the row's own name.
 */

export type RowTrailingInput =
  | { readonly kind: "chevron"; readonly tone?: "muted" | "accent" }
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
      readonly variant?: "solid" | "quiet" | "tonal";
      readonly uppercase?: boolean;
      readonly dot?: boolean;
    }
  | { readonly kind: "none" };

export function resolveRowTrailing<T extends RowTrailingInput>(
  pressable: boolean,
  trailing: T | undefined
):
  | T
  | { readonly kind: "chevron"; readonly tone?: "muted" | "accent" }
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
