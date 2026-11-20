/**
 * What each `Button` variant is painted with, apart from the theme that resolves it.
 *
 * `outlineDanger` is the destructive action that leaves a whole screen — «Cerrar sesión»
 * at the foot of a profile: the red word in a subtle outline, as heavy as a secondary
 * action. `quietDanger` drops the outline, for the one that only opens a confirmation.
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "quietDanger"
  | "outlineDanger";

export interface ButtonLook {
  readonly fill: "primary" | "secondary" | "danger" | "none";
  readonly edge: "subtle" | "none";
  readonly ink: "onPrimary" | "onSecondary" | "accent" | "danger" | "onStatus";
  readonly gradient: boolean;
  readonly shadow: boolean;
}

export function buttonLook(variant: ButtonVariant): ButtonLook {
  switch (variant) {
    case "primary":
      return { fill: "primary", edge: "none", ink: "onPrimary", gradient: true, shadow: true };
    case "secondary":
      return { fill: "secondary", edge: "subtle", ink: "onSecondary", gradient: false, shadow: true };
    case "ghost":
      return { fill: "none", edge: "none", ink: "accent", gradient: false, shadow: false };
    case "quietDanger":
      return { fill: "none", edge: "none", ink: "danger", gradient: false, shadow: false };
    case "outlineDanger":
      return { fill: "none", edge: "subtle", ink: "danger", gradient: false, shadow: false };
    case "danger":
      return { fill: "danger", edge: "none", ink: "onStatus", gradient: false, shadow: true };
  }
}
