/**
 * The mark of an `InlineAlert`. Small beside a message under a field; a panel that
 * stands alone — «Tus datos nunca se cobran» — may ask for the larger one.
 */

export type AlertIconSize = "sm" | "md";

export function alertMarkSize(size: AlertIconSize | undefined): "xs" | "md" {
  return size === "md" ? "md" : "xs";
}
