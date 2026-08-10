export const designSystemVersion = "0.2.0" as const;

export const brandColors = {
  cyan: "#55EFFB",
  ink: "#030713",
  chalk: "#EAFFFF",
} as const;

export const brandDimensions = {
  favicon: {
    ink: { width: 512, height: 512, viewBox: "0 0 512 512" },
    cyan: { width: 64, height: 64, viewBox: "0 0 64 64" },
  },
  logo: { width: 405, height: 1149, viewBox: "0 0 405 1149" },
  logoCarrier: { width: 460, height: 480, viewBox: "0 0 460 480" },
  wordmark: { width: 4047, height: 756, viewBox: "0 0 4047 756" },
  lockup: { width: 1678, height: 480, viewBox: "0 0 1678 480" },
  product: {
    wordmark: {
      space: { width: 5077, height: 756, viewBox: "0 0 5077 756" },
      studio: { width: 5390, height: 756, viewBox: "0 0 5390 756" },
      backoffice: { width: 7318, height: 756, viewBox: "0 0 7318 756" },
    },
    lockup: {
      space: { width: 1952, height: 480, viewBox: "0 0 1952 480" },
      studio: { width: 2032, height: 480, viewBox: "0 0 2032 480" },
      backoffice: { width: 2580, height: 480, viewBox: "0 0 2580 480" },
    },
  },
} as const;

export const brandProductNames = {
  space: "Allfit Space",
  studio: "Allfit Studio",
  backoffice: "Allfit Backoffice",
} as const;

/**
 * Package-relative asset paths used by the manifest and filesystem tooling.
 * Use `brandAssetSpecifiers` when resolving an asset through a package loader.
 */
export const brandAssetFiles = {
  favicon: {
    ink: "assets/favicon/allfit-one-favicon-ink.svg",
    cyan: "assets/favicon/allfit-one-favicon-cyan.svg",
  },
  logo: {
    cyan: "assets/logo/allfit-one-logo-cyan.svg",
    ink: "assets/logo/allfit-one-logo-ink.svg",
    chalk: "assets/logo/allfit-one-logo-chalk.svg",
  },
  logoCarrier: "assets/logo/allfit-one-logo-carrier.svg",
  wordmark: {
    onDark: "assets/wordmark/allfit-one-wordmark-on-dark.svg",
    onLight: "assets/wordmark/allfit-one-wordmark-on-light.svg",
  },
  lockup: {
    onDark: "assets/lockup/allfit-one-lockup-on-dark.svg",
    onLight: "assets/lockup/allfit-one-lockup-on-light.svg",
  },
  product: {
    space: {
      wordmark: {
        onDark: "assets/product/space/allfit-space-wordmark-on-dark.svg",
        onLight: "assets/product/space/allfit-space-wordmark-on-light.svg",
      },
      lockup: {
        onDark: "assets/product/space/allfit-space-lockup-on-dark.svg",
        onLight: "assets/product/space/allfit-space-lockup-on-light.svg",
      },
    },
    studio: {
      wordmark: {
        onDark: "assets/product/studio/allfit-studio-wordmark-on-dark.svg",
        onLight: "assets/product/studio/allfit-studio-wordmark-on-light.svg",
      },
      lockup: {
        onDark: "assets/product/studio/allfit-studio-lockup-on-dark.svg",
        onLight: "assets/product/studio/allfit-studio-lockup-on-light.svg",
      },
    },
    backoffice: {
      wordmark: {
        onDark: "assets/product/backoffice/allfit-backoffice-wordmark-on-dark.svg",
        onLight: "assets/product/backoffice/allfit-backoffice-wordmark-on-light.svg",
      },
      lockup: {
        onDark: "assets/product/backoffice/allfit-backoffice-lockup-on-dark.svg",
        onLight: "assets/product/backoffice/allfit-backoffice-lockup-on-light.svg",
      },
    },
  },
} as const;

const toBrandAssetSpecifier = <Path extends string>(path: Path) =>
  `@allfitone/brand/${path}` as const;

/** Public module specifiers accepted by package-aware resolvers and bundlers. */
export const brandAssetSpecifiers = {
  favicon: {
    ink: toBrandAssetSpecifier(brandAssetFiles.favicon.ink),
    cyan: toBrandAssetSpecifier(brandAssetFiles.favicon.cyan),
  },
  logo: {
    cyan: toBrandAssetSpecifier(brandAssetFiles.logo.cyan),
    ink: toBrandAssetSpecifier(brandAssetFiles.logo.ink),
    chalk: toBrandAssetSpecifier(brandAssetFiles.logo.chalk),
  },
  logoCarrier: toBrandAssetSpecifier(brandAssetFiles.logoCarrier),
  wordmark: {
    onDark: toBrandAssetSpecifier(brandAssetFiles.wordmark.onDark),
    onLight: toBrandAssetSpecifier(brandAssetFiles.wordmark.onLight),
  },
  lockup: {
    onDark: toBrandAssetSpecifier(brandAssetFiles.lockup.onDark),
    onLight: toBrandAssetSpecifier(brandAssetFiles.lockup.onLight),
  },
  product: Object.fromEntries(
    Object.entries(brandAssetFiles.product).map(([product, assets]) => [
      product,
      {
        wordmark: {
          onDark: toBrandAssetSpecifier(assets.wordmark.onDark),
          onLight: toBrandAssetSpecifier(assets.wordmark.onLight),
        },
        lockup: {
          onDark: toBrandAssetSpecifier(assets.lockup.onDark),
          onLight: toBrandAssetSpecifier(assets.lockup.onLight),
        },
      },
    ]),
  ) as unknown as {
    [Product in keyof typeof brandAssetFiles.product]: {
      wordmark: {
        onDark: `@allfitone/brand/${string}`;
        onLight: `@allfitone/brand/${string}`;
      };
      lockup: {
        onDark: `@allfitone/brand/${string}`;
        onLight: `@allfitone/brand/${string}`;
      };
    };
  },
} as const;

export type BrandSurface = "dark" | "light";
export type BrandFaviconVariant = keyof typeof brandAssetFiles.favicon;
export type BrandLogoVariant = keyof typeof brandAssetFiles.logo;
export type BrandProduct = keyof typeof brandProductNames;

export { brandGeometry } from "./geometry.js";
