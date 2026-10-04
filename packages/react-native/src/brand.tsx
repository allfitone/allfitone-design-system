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

/**
 * Both resolved, never optional: the repository runs `exactOptionalPropertyTypes`,
 * so a possibly-undefined dimension cannot be spread onto `Svg`.
 */
type Size = {
  width: NonNullable<SvgProps["width"]>;
  height: NonNullable<SvgProps["height"]>;
};

/**
 * Derives the missing dimension from the artwork, so asking for one is enough.
 *
 * Every mark here had an independent default for each dimension. Passing only
 * `height` therefore left `width` at a default sized for a different height, and
 * the box came out a different shape from the `viewBox`. SVG does not stretch to
 * fill it — the default `preserveAspectRatio` scales the art to fit and centres
 * it in what is left over, so the mark renders at the right size, inset by half
 * the slack, and stops lining up with the text beside it.
 *
 * That failure survives review because nothing looks broken: the mark is not
 * squashed, only nudged. It was found by eye on the welcome screen.
 *
 * A percentage or other string dimension cannot be resolved here, so it keeps
 * the paired default and the caller stays responsible for the ratio.
 */
function resolveSize(
  artwork: { readonly width: number; readonly height: number },
  width: SvgProps["width"],
  height: SvgProps["height"],
  fallback: { width: number; height: number },
): Size {
  if (width !== undefined && height !== undefined) return { width, height };
  const aspectRatio = artwork.width / artwork.height;
  if (width === undefined && typeof height === "number") {
    return { width: height * aspectRatio, height };
  }
  if (height === undefined && typeof width === "number") {
    return { width, height: width / aspectRatio };
  }
  return { width: width ?? fallback.width, height: height ?? fallback.height };
}

export function BrandLogo({
  variant = "cyan",
  accessibilityLabel,
  decorative,
  width,
  height,
  ...props
}: NativeBrandLogoProps) {
  const size = resolveSize(brandDimensions.logo, width, height, { width: 18, height: 48 });

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      {...size}
      viewBox={brandDimensions.logo.viewBox}
    >
      <Path fill={brandColors[variant]} d={brandGeometry.logoPath} />
    </Svg>
  );
}

export function BrandWordmark({
  surface = "dark",
  accessibilityLabel,
  decorative,
  width,
  height,
  ...props
}: NativeSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
  const size = resolveSize(brandDimensions.wordmark, width, height, { width: 220, height: 41 });

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      {...size}
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
  width,
  height,
  ...props
}: NativeSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
  const size = resolveSize(brandDimensions.lockup, width, height, { width: 120, height: 40 });

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      {...size}
      viewBox={brandDimensions.lockup.viewBox}
    >
      <Path fill={brandColors.cyan} d={brandGeometry.logoPath} transform="translate(44 58) scale(.318)" />
      <G transform="translate(272 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
      <G transform="translate(1000 337) scale(.28 -.28)" fill={brandColors.cyan}>
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
  width,
  height,
  ...props
}: NativeProductSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
  const size = resolveSize(brandDimensions.product.wordmark[product], width, height, {
    width: product === "backoffice" ? 300 : 224,
    height: product === "backoffice" ? 31 : product === "studio" ? 31 : 33,
  });

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      {...size}
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
  width,
  height,
  ...props
}: NativeProductSurfaceBrandProps) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
  const size = resolveSize(brandDimensions.product.lockup[product], width, height, {
    width: product === "backoffice" ? 195 : product === "studio" ? 149 : 143,
    height: 40,
  });

  return (
    <Svg
      {...props}
      {...accessibilityProps(accessibilityLabel, decorative)}
      {...size}
      viewBox={brandDimensions.product.lockup[product].viewBox}
    >
      <Path fill={brandColors.cyan} d={brandGeometry.logoPath} transform="translate(44 58) scale(.318)" />
      <G transform="translate(272 337) scale(.28 -.28)" fill={neutral}>
        {brandGeometry.allfitLetters.map(([path, x], index) => <Path key={index} d={path} transform={`translate(${x} 0)`} />)}
      </G>
      <G transform="translate(272 337) scale(.28 -.28)" fill={brandColors.cyan}>
        <ProductDescriptor product={product} />
      </G>
    </Svg>
  );
}
