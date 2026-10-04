import type { ReactNode, SVGProps } from "react";

import {
  brandColors,
  brandDimensions,
  brandGeometry,
  type BrandLogoVariant,
  type BrandProduct,
  type BrandSurface,
} from "./index.js";

export type BrandSvgProps = Omit<SVGProps<SVGSVGElement>, "children" | "color"> & {
  title?: string | undefined;
};

export type BrandLogoProps = BrandSvgProps & {
  variant?: BrandLogoVariant;
};

export type SurfaceBrandProps = BrandSvgProps & {
  surface?: BrandSurface;
};

export type ProductSurfaceBrandProps = SurfaceBrandProps & {
  product: BrandProduct;
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
      <path fill={brandColors.cyan} d={brandGeometry.logoPath} transform="translate(44 58) scale(.318)" />
      <g transform="translate(272 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(1000 337) scale(.28 -.28)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x - 2600} 0)`} />)}
      </g>
    </BrandSvgFrame>
  );
}

function ProductDescriptor({ product }: { product: BrandProduct }) {
  return (
    <>
      {brandGeometry.product.descriptorLetters[product].map(([path, x], index) => (
        <path key={index} d={path} transform={`translate(${x} 0)`} />
      ))}
    </>
  );
}

export function ProductWordmark({ product, surface = "dark", title, ...props }: ProductSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <BrandSvgFrame
      {...props}
      viewBox={brandDimensions.product.wordmark[product].viewBox}
      title={title}
    >
      <g transform="translate(20 728) scale(1 -1)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(20 728) scale(1 -1)" fill={brandColors.cyan}>
        <ProductDescriptor product={product} />
      </g>
    </BrandSvgFrame>
  );
}

export function ProductLockup({ product, surface = "dark", title, ...props }: ProductSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <BrandSvgFrame
      {...props}
      viewBox={brandDimensions.product.lockup[product].viewBox}
      title={title}
    >
      <path fill={brandColors.cyan} d={brandGeometry.logoPath} transform="translate(44 58) scale(.318)" />
      <g transform="translate(272 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(272 337) scale(.28 -.28)" fill={brandColors.cyan}>
        <ProductDescriptor product={product} />
      </g>
    </BrandSvgFrame>
  );
}
