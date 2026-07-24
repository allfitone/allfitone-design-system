import { color, semanticColor } from "./color.js";
import { gradient, semanticGradient } from "./gradient.js";
import { material } from "./material.js";
import { motion, semanticMotion } from "./motion.js";
import { radius, semanticRadius } from "./radius.js";
import { semanticShadow, shadow } from "./shadow.js";
import { semanticSpacing, spacing } from "./spacing.js";
import { typography, typographyRole } from "./typography.js";
import type { CubicBezier, GlassMaterial, Gradient, ShadowLayer } from "./types.js";
import { designSystemVersion } from "./version.js";

type TokenTree = Readonly<Record<string, unknown>>;

const kebab = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replaceAll(".", "-").toLowerCase();

const flatten = (tree: TokenTree, prefix: string[] = []): Array<[string, unknown]> =>
  Object.entries(tree).flatMap(([key, value]) => {
    const path = [...prefix, kebab(key)];
    return value !== null && typeof value === "object" && !Array.isArray(value)
      ? flatten(value as TokenTree, path)
      : [[path.join("-"), value]];
  });

const shadowValue = (layers: readonly ShadowLayer[]) =>
  layers.length === 0
    ? "none"
    : layers.map(({ x, y, blur, spread, color: layerColor }) => `${x}px ${y}px ${blur}px ${spread}px ${layerColor}`).join(", ");

const easingValue = ([x1, y1, x2, y2]: CubicBezier) => `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

const gradientValue = ({ angle, stops }: Gradient) =>
  `linear-gradient(${angle}deg, ${stops.map(({ color: stopColor, position }) => `${stopColor} ${position}%`).join(", ")})`;

const materialEntries = (materials: Readonly<Record<string, GlassMaterial>>) =>
  Object.entries(materials).flatMap(([name, value]) => [
    [`material-${kebab(name)}-fill`, value.fill] as [string, string],
    [`material-${kebab(name)}-border`, value.border] as [string, string],
    [`material-${kebab(name)}-blur`, `${value.blur}px`] as [string, string],
    [`material-${kebab(name)}-saturate`, value.saturate] as [string, number],
  ]);

const declarations = (entries: Array<[string, string | number]>) =>
  entries.map(([name, value]) => `  --afo-${name}: ${value};`).join("\n");

const colorEntries = (tree: TokenTree, prefix: string) =>
  flatten(tree).map(([name, value]) => [`${prefix}-${name}`, String(value)] as [string, string]);

const typographyRoleEntries = Object.entries(typographyRole).flatMap(([role, value]) => [
  [`typography-${kebab(role)}-font-family`, `var(--afo-font-family-${kebab(value.family)})`] as [string, string],
  [`typography-${kebab(role)}-font-weight`, `var(--afo-font-weight-${kebab(value.weight)})`] as [string, string],
  [`typography-${kebab(role)}-line-height`, `var(--afo-line-height-${kebab(value.lineHeight)})`] as [string, string],
  [`typography-${kebab(role)}-letter-spacing`, `var(--afo-letter-spacing-${kebab(value.letterSpacing)})`] as [string, string],
]);

export function createCssVariables() {
  const primitiveEntries: Array<[string, string | number]> = [
    ["design-system-version", `"${designSystemVersion}"`],
    ...colorEntries(color, "color"),
    ...Object.entries(spacing).map(([name, value]) => [`space-${kebab(name)}`, `${value}px`] as [string, string]),
    ...Object.entries(radius).map(([name, value]) => [`radius-${kebab(name)}`, `${value}px`] as [string, string]),
    ...Object.entries(typography.stack).map(([name, value]) => [`font-family-${kebab(name)}`, value] as [string, string]),
    ...Object.entries(typography.weight).map(([name, value]) => [`font-weight-${kebab(name)}`, value] as [string, number]),
    ...Object.entries(typography.size).map(([name, value]) => [`font-size-${kebab(name)}`, `${value / 16}rem`] as [string, string]),
    ...Object.entries(typography.lineHeight).map(([name, value]) => [`line-height-${kebab(name)}`, value] as [string, number]),
    ...Object.entries(typography.letterSpacing).map(([name, value]) => [`letter-spacing-${kebab(name)}`, `${value}em`] as [string, string]),
    ...Object.entries(shadow).map(([name, value]) => [`shadow-${kebab(name)}`, shadowValue(value)] as [string, string]),
    ...Object.entries(motion.duration).map(([name, value]) => [`motion-duration-${kebab(name)}`, `${value}ms`] as [string, string]),
    ...Object.entries(motion.easing).map(([name, value]) => [`motion-easing-${kebab(name)}`, easingValue(value)] as [string, string]),
    ...Object.entries(gradient).map(([name, value]) => [`gradient-${kebab(name)}`, gradientValue(value)] as [string, string]),
  ];

  const semanticBaseEntries: Array<[string, string | number]> = [
    ...typographyRoleEntries,
    ...Object.entries(semanticSpacing).map(([name, value]) => [`space-${kebab(name)}`, `${value}px`] as [string, string]),
    ...Object.entries(semanticRadius).map(([name, value]) => [`radius-${kebab(name)}`, `${value}px`] as [string, string]),
    ...Object.entries(semanticShadow).map(([name, value]) => [`shadow-${kebab(name)}`, shadowValue(value)] as [string, string]),
    ...Object.entries(semanticMotion).flatMap(([role, values]) => [
      [`motion-${kebab(role)}-duration`, `${values.duration}ms`] as [string, string],
      [`motion-${kebab(role)}-easing`, easingValue(values.easing)] as [string, string],
    ]),
    ...Object.entries(semanticGradient).map(([name, value]) => [`gradient-${kebab(name)}`, gradientValue(value)] as [string, string]),
  ];

  const darkEntries = [...colorEntries(semanticColor.dark, "color"), ...materialEntries(material.dark)];
  const lightEntries = [...colorEntries(semanticColor.light, "color"), ...materialEntries(material.light)];

  return `/* Generated by @allfitone/tokens. Do not edit directly. */
:root {
${declarations([...primitiveEntries, ...semanticBaseEntries, ...darkEntries])}
}

[data-afo-theme="dark"] {
${declarations(darkEntries)}
}

[data-afo-theme="light"] {
${declarations(lightEntries)}
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --afo-motion-feedback-duration: 0ms;
    --afo-motion-transition-duration: 0ms;
    --afo-motion-enter-duration: 0ms;
    --afo-motion-exit-duration: 0ms;
  }
}
`;
}

