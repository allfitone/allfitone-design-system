import type { ReactNode, SVGProps } from "react";

import { brandColors, brandDimensions, brandGeometry, type BrandLogoVariant, type BrandSurface } from "./index.js";

export type BrandSvgProps = Omit<SVGProps<SVGSVGElement>, "children" | "color"> & {
  title?: string | undefined;
};

export type BrandLogoProps = BrandSvgProps & {
  variant?: BrandLogoVariant;
};

export type SurfaceBrandProps = BrandSvgProps & {
  surface?: BrandSurface;
};

type BrandSvgFrameProps = BrandSvgProps & {
  children: ReactNode;
  viewBox: string;
};

function BrandSvgFrame({
  title,
  children,
  viewBox,
  role,
  focusable,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-hidden": ariaHidden,
  ...props
}: BrandSvgFrameProps) {
  const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);

  return (
    <svg
      {...props}
      viewBox={viewBox}
      role={role ?? (hasAccessibleName ? "img" : "presentation")}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : title)}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      focusable={focusable ?? "false"}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function BrandLogo({ variant = "cyan", title, ...props }: BrandLogoProps) {
  return (
    <BrandSvgFrame
      {...props}
      viewBox={brandDimensions.logo.viewBox}
      title={title}
    >
      <path fill={brandColors[variant]} d={brandGeometry.logoPath} />
    </BrandSvgFrame>
  );
}

export function BrandLogoCarrier({ title, ...props }: BrandSvgProps) {
  return (
    <BrandSvgFrame
      {...props}
      viewBox={brandDimensions.logoCarrier.viewBox}
      title={title}
    >
      <g transform="translate(32 36)">
        <path fill={brandColors.cyan} d={brandGeometry.carrierPath} />
        <path fill={brandColors.ink} d={brandGeometry.logoPath} transform="translate(142 22) scale(.318)" />
      </g>
    </BrandSvgFrame>
  );
}

export function BrandWordmark({ surface = "dark", title, ...props }: SurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <BrandSvgFrame
      {...props}
      viewBox={brandDimensions.wordmark.viewBox}
      title={title}
    >
      <g transform="translate(20 728) scale(1 -1)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(20 728) scale(1 -1)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
    </BrandSvgFrame>
  );
}

export function BrandLockup({ surface = "dark", title, ...props }: SurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <BrandSvgFrame
      {...props}
      viewBox={brandDimensions.lockup.viewBox}
      title={title}
    >
      <g transform="translate(44 36)">
        <path fill={brandColors.cyan} d={brandGeometry.carrierPath} />
        <path fill={brandColors.ink} d={brandGeometry.logoPath} transform="translate(142 22) scale(.318)" />
      </g>
      <g transform="translate(512 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(1240 337) scale(.28 -.28)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x - 2600} 0)`} />)}
      </g>
    </BrandSvgFrame>
  );
}
