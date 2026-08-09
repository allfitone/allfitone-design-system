import { G, Path, Svg, type SvgProps } from "react-native-svg";

import {
  brandColors,
  brandDimensions,
  brandGeometry,
  type BrandLogoVariant,
  type BrandProduct,
  type BrandSurface,
} from "@allfitone/brand";

type NativeBrandAccessibilityProps = {
  accessibilityLabel?: string;
  decorative?: boolean;
};

export type NativeBrandLogoProps = Omit<SvgProps, "color"> & NativeBrandAccessibilityProps & {
  variant?: BrandLogoVariant;
};

export type NativeSurfaceBrandProps = Omit<SvgProps, "color"> & NativeBrandAccessibilityProps & {
  surface?: BrandSurface;
};

export type NativeProductSurfaceBrandProps = NativeSurfaceBrandProps & {
  product: BrandProduct;
};

const accessibilityProps = (label: string | undefined, decorative: boolean | undefined) =>
  !decorative && label
    ? { accessible: true, accessibilityLabel: label, accessibilityRole: "image" as const }
    : { accessible: false };

export function BrandLogo({
  variant = "cyan",
  accessibilityLabel,
  decorative,
  width = 18,
  height = 48,
  ...props
}: NativeBrandLogoProps) {
  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      width={width}
      height={height}
      viewBox={brandDimensions.logo.viewBox}
    >
      <Path fill={brandColors[variant]} d={brandGeometry.logoPath} />
    </Svg>
  );
}

export function BrandLogoCarrier({
  accessibilityLabel,
  decorative,
  width = 46,
  height = 48,
  ...props
}: Omit<SvgProps, "color"> & NativeBrandAccessibilityProps) {
  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      width={width}
      height={height}
      viewBox={brandDimensions.logoCarrier.viewBox}
    >
      <G transform="translate(32 36)">
        <Path fill={brandColors.cyan} d={brandGeometry.carrierPath} />
        <Path fill={brandColors.ink} d={brandGeometry.logoPath} transform="translate(142 22) scale(.318)" />
      </G>
    </Svg>
  );
}

export function BrandWordmark({
  surface = "dark",
  accessibilityLabel,
  decorative,
  width = 220,
  height = 41,
  ...props
}: NativeSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      width={width}
      height={height}
      viewBox={brandDimensions.wordmark.viewBox}
    >
      <G transform="translate(20 728) scale(1 -1)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
      <G transform="translate(20 728) scale(1 -1)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
    </Svg>
  );
}

export function BrandLockup({
  surface = "dark",
  accessibilityLabel,
  decorative,
  width = 140,
  height = 40,
  ...props
}: NativeSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      width={width}
      height={height}
      viewBox={brandDimensions.lockup.viewBox}
    >
      <G transform="translate(44 36)">
        <Path fill={brandColors.cyan} d={brandGeometry.carrierPath} />
        <Path fill={brandColors.ink} d={brandGeometry.logoPath} transform="translate(142 22) scale(.318)" />
      </G>
      <G transform="translate(512 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
      <G transform="translate(1240 337) scale(.28 -.28)" fill={brandColors.cyan}>
        {brandGeometry.oneLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x - 2600} 0)`} />)}
      </G>
    </Svg>
  );
}

function ProductDescriptor({ product }: { product: BrandProduct }) {
  return (
    <>
      {brandGeometry.product.descriptorLetters[product].map(([path, x], index) => (
        <Path key={index} d={path} transform={`translate(${x} 0)`} />
      ))}
    </>
  );
}

export function ProductWordmark({
  product,
  surface = "dark",
  accessibilityLabel,
  decorative,
  width = product === "backoffice" ? 300 : 224,
  height = product === "backoffice" ? 31 : product === "studio" ? 31 : 33,
  ...props
}: NativeProductSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      width={width}
      height={height}
      viewBox={brandDimensions.product.wordmark[product].viewBox}
    >
      <G transform="translate(20 728) scale(1 -1)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
      <G transform="translate(20 728) scale(1 -1)" fill={brandColors.cyan}>
        <ProductDescriptor product={product} />
      </G>
    </Svg>
  );
}

export function ProductLockup({
  product,
  surface = "dark",
  accessibilityLabel,
  decorative,
  width = product === "backoffice" ? 215 : product === "studio" ? 169 : 163,
  height = 40,
  ...props
}: NativeProductSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      width={width}
      height={height}
      viewBox={brandDimensions.product.lockup[product].viewBox}
    >
      <G transform="translate(44 36)">
        <Path fill={brandColors.cyan} d={brandGeometry.carrierPath} />
        <Path fill={brandColors.ink} d={brandGeometry.logoPath} transform="translate(142 22) scale(.318)" />
      </G>
      <G transform="translate(512 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
      <G transform="translate(512 337) scale(.28 -.28)" fill={brandColors.cyan}>
        <ProductDescriptor product={product} />
      </G>
    </Svg>
  );
}
