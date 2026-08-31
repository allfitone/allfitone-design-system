/**
 * Typographic component for React Native surfaces.
 *
 * A role plus a size is the whole API. Products do not compose a role out of
 * primitives, because that is how two screens end up with the same intent
 * rendered at different line heights.
 *
 * Two conversions happen here that the web adapter gets for free and React
 * Native does not:
 *
 * - `lineHeight` is a unitless ratio in the tokens and an absolute number in
 *   React Native, so it is multiplied by the resolved font size.
 * - `letterSpacing` is an `em` ratio in the tokens and an absolute number here,
 *   which is what `resolveNativeLetterSpacing` exists for.
 *
 * `fontWeight` is deliberately never set. Combined with a custom `fontFamily`
 * Android synthesises a face, which renders visibly heavier than the real one;
 * the weight is already carried by the family the role resolves to.
 */

import {
  Text as RNText,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
} from "react-native";

import type { TypographyRoleName } from "./font-family.js";
import { useTheme } from "./theme.js";
import { resolveTextStyle, type TextSizeName } from "./typography-style.js";

/**
 * Colour roles a product may ask for by name. Deliberately a subset of the
 * palette: `background` and `action` are not text colours, and offering them
 * here would invite a contrast failure.
 */
export type TextColorName =
  | "primary"
  | "secondary"
  | "muted"
  | "disabled"
  | "inverse"
  | "accent"
  | "danger"
  | "success";

export type { TextSizeName };

/**
 * `role` is omitted from the underlying props on purpose: React Native already
 * has one for accessibility, and its value set intersects ours at exactly
 * `"heading"`, which silently narrows every other role away. Screen-reader
 * semantics stay reachable through `accessibilityRole`, which is unaffected.
 */
export type TextProps = Omit<RNTextProps, "style" | "role"> & {
  readonly role?: TypographyRoleName;
  readonly size?: TextSizeName;
  readonly color?: TextColorName;
  readonly align?: TextStyle["textAlign"];
  readonly uppercase?: boolean;
  readonly style?: StyleProp<TextStyle>;
};

export function Text({
  role = "body",
  size = "md",
  color = "primary",
  align,
  uppercase,
  style,
  ...props
}: TextProps) {
  const theme = useTheme();

  return (
    <RNText
      {...props}
      style={[
        resolveTextStyle(role, size),
        { color: theme.color.text[color] },
        align ? { textAlign: align } : null,
        uppercase ? { textTransform: "uppercase" } : null,
        style,
      ]}
    />
  );
}
