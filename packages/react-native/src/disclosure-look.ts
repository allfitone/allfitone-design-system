/**
 * The three ways a `DisclosureButton` reads, decided apart from the drawing.
 *
 * `stacked` is a filter: label over value, no end. `field` is a form field that opens a
 * picker: one line and a chevron forward. `select` is the small picker beside another
 * field — the country before a phone number: a tiny label over the value in the control
 * weight, and a chevron down, because what it opens is a list to choose from.
 */

export type DisclosureVariant = "stacked" | "field" | "select";

export interface DisclosureLook {
  readonly ground: "surface" | "subtle" | "muted";
  readonly edgeWidth: number;
  readonly radius: number;
  readonly minHeight: number;
  readonly label: "2xs" | "sm" | "none";
  readonly value: "md" | "sm";
  readonly glyph: "expand" | "next" | "none";
}

export function disclosureLook(variant: DisclosureVariant): DisclosureLook {
  if (variant === "select") {
    return { ground: "muted", edgeWidth: 1.5, radius: 14, minHeight: 52, label: "2xs", value: "md", glyph: "expand" };
  }
  if (variant === "field") {
    return { ground: "subtle", edgeWidth: 2, radius: 0, minHeight: 52, label: "none", value: "sm", glyph: "next" };
  }
  return { ground: "surface", edgeWidth: 1, radius: 14, minHeight: 58, label: "sm", value: "sm", glyph: "none" };
}
