import type { SVGProps } from "react";

import { brandColors, brandDimensions, brandGeometry, type BrandLogoVariant, type BrandSurface } from "./index.js";

export type BrandSvgProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  title?: string;
};

export type BrandLogoProps = BrandSvgProps & {
  variant?: BrandLogoVariant;
};

export type SurfaceBrandProps = BrandSvgProps & {
  surface?: BrandSurface;
};

function Accessibility({ title }: { title: string | undefined }) {
  return title ? <title>{title}</title> : null;
}

export function BrandLogo({ variant = "cyan", title, ...props }: BrandLogoProps) {
  return (
    <svg
      {...props}
      viewBox={brandDimensions.logo.viewBox}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Accessibility title={title} />
      <path fill={brandColors[variant]} d={brandGeometry.logoPath} />
    </svg>
  );
}

export function BrandWordmark({ surface = "dark", title, ...props }: SurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <svg
      {...props}
      viewBox={brandDimensions.wordmark.viewBox}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Accessibility title={title} />
      <g transform="translate(20 728) scale(1 -1)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(20 728) scale(1 -1)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
    </svg>
  );
}

export function BrandLockup({ surface = "dark", title, ...props }: SurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <svg
      {...props}
      viewBox={brandDimensions.lockup.viewBox}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Accessibility title={title} />
      <g transform="translate(44 36)">
        <path fill={brandColors.cyan} d="M65 0h330l-65 408H0L65 0Z" />
        <path fill={brandColors.ink} d={brandGeometry.logoPath} transform="translate(142 22) scale(.318)" />
      </g>
      <g transform="translate(512 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(1240 337) scale(.28 -.28)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x - 2600} 0)`} />)}
      </g>
    </svg>
  );
}
