/**
 * Theme context for React Native surfaces.
 *
 * Products compose layout; they never assemble a palette. Handing them a
 * resolved theme rather than raw tokens is what keeps DT-008 enforceable — a
 * screen that reads `theme.color.action.primary` cannot drift, whereas a screen
 * that reaches for a hex can.
 *
 * Both themes are carried even where a product ships dark only. DT-009 makes the
 * light theme first-class, and a screen written against fixed colours has to be
 * rewritten to gain one; a screen written against this context does not.
 *
 * The touch target resolves per platform because the accessibility contract
 * differs — 44 pt on iOS, 48 dp on Android — and a component that hardcodes
 * either one fails the other.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Platform } from "react-native";

import {
  getNativeTheme,
  getNativeTouchTarget,
  radius,
  semanticMotion,
  semanticGradient,
  semanticRadius,
  semanticSpacing,
  spacing,
  type ThemeName,
} from "./tokens.js";

export type ThemeColors = ReturnType<typeof getNativeTheme>;

export type Theme = {
  readonly name: ThemeName;
  readonly color: ThemeColors;
  readonly spacing: typeof spacing;
  readonly semanticSpacing: typeof semanticSpacing;
  readonly radius: typeof radius;
  readonly semanticRadius: typeof semanticRadius;
  readonly gradient: typeof semanticGradient;
  /**
   * How long things take and how they ease. A product that hardcodes a duration is
   * a product whose motion drifts from every other surface, which is the same drift
   * DT-008 stops for colour.
   */
  readonly motion: typeof semanticMotion;
  readonly touchTarget: number;
};

function resolveTouchTarget(): number {
  return getNativeTouchTarget(Platform.OS === "android" ? "android" : "ios");
}

export function createTheme(name: ThemeName): Theme {
  return {
    name,
    color: getNativeTheme(name),
    spacing,
    semanticSpacing,
    radius,
    semanticRadius,
    gradient: semanticGradient,
    motion: semanticMotion,
    touchTarget: resolveTouchTarget(),
  };
}

/**
 * Dark is the ecosystem default, so an unwrapped subtree still renders in brand
 * rather than throwing. A provider is still required for a product that offers
 * both themes.
 */
const ThemeContext = createContext<Theme>(createTheme("dark"));

export type ThemeProviderProps = {
  readonly theme?: ThemeName;
  readonly children: ReactNode;
};

export function ThemeProvider({ theme = "dark", children }: ThemeProviderProps) {
  const value = useMemo(() => createTheme(theme), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
