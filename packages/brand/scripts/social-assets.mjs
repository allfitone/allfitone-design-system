/**
 * Social media and banner kit, derived from the canonical brand geometry.
 *
 * Every file is the exact Allfit One logo or lockup placed on a Design System
 * tone. Nothing is redrawn: the mark and the outlined wordmark come from
 * `brandGeometry`, the lockup layout is the one `BrandLockup` renders, and every
 * background colour is a token from `@allfitone/tokens`.
 *
 * Tones are limited to surfaces the canonical lockup is defined for: ink
 * surfaces take the on-dark lockup, light surfaces take the on-light lockup.
 * There is no lockup on the signal gradient because `ONE` and the mark are
 * cyan, and the brand package ships no monochrome lockup.
 */

import { color, gradient } from "@allfitone/tokens";

import { brandColors, brandDimensions, brandGeometry } from "../dist/index.js";

const lockup = brandDimensions.lockup;

/** Same placement as `BrandLockup` and `assets/lockup/*.svg`. */
const lockupLayout = {
  logoTransform: "translate(44 58) scale(.318)",
  allfitTransform: "translate(272 337) scale(.28 -.28)",
  oneTransform: "translate(1000 337) scale(.28 -.28)",
  oneOffset: 2600,
};

/**
 * The three blooms of `AmbientBackdrop`, with its opacities per theme. The dot
 * grid is left out: at banner scale it reads as a pattern, not as ground.
 */
const blooms = {
  dark: [
    { cx: 0.2, cy: 0.08, rx: 0.78, ry: 0.52, color: color.brand.turquoise, opacity: 0.12 },
    { cx: 0.92, cy: 0.26, rx: 0.66, ry: 0.46, color: color.brand.turquoiseDeep, opacity: 0.14 },
    { cx: 0.5, cy: 0.98, rx: 0.88, ry: 0.56, color: color.brand.primary, opacity: 0.05 },
  ],
  light: [
    { cx: 0.2, cy: 0.08, rx: 0.78, ry: 0.52, color: color.brand.turquoise, opacity: 0.16 },
    { cx: 0.92, cy: 0.26, rx: 0.66, ry: 0.46, color: color.brand.turquoiseDark, opacity: 0.08 },
    { cx: 0.5, cy: 0.98, rx: 0.88, ry: 0.56, color: color.brand.primary, opacity: 0.12 },
  ],
};

export const socialTones = {
  ink: {
    label: "Ink",
    surface: "dark",
    description: "Flat brand ink (`color.ink.void`). The default dark tone.",
    background: color.ink.void,
  },
  "surface-deep": {
    label: "Surface deep",
    surface: "dark",
    description: "The `gradient.surfaceDeep` ink gradient used by large cards.",
    gradient: gradient.surfaceDeep,
  },
  "ambient-dark": {
    label: "Ambient dark",
    surface: "dark",
    description: "Dark canvas (`color.ink.carbon`) under the ambient backdrop blooms.",
    background: color.ink.carbon,
    bloom: "dark",
  },
  chalk: {
    label: "Chalk",
    surface: "light",
    description: "Flat brand chalk (`color.neutral.chalk`). The default light tone.",
    background: color.neutral.chalk,
  },
  white: {
    label: "White",
    surface: "light",
    description: "Pure white (`color.neutral.white`) for platforms that frame images on white.",
    background: color.neutral.white,
  },
  "ambient-light": {
    label: "Ambient light",
    surface: "light",
    description: "Light canvas (`color.neutral.canvasLight`) under the ambient backdrop blooms.",
    background: color.neutral.canvasLight,
    bloom: "light",
  },
};

/**
 * `lockupWidth` and `logoHeight` are fractions of the canvas. They keep the
 * mark inside each platform's safe area with generous clear space.
 */
export const socialFormats = {
  avatar: {
    label: "Avatar",
    width: 1080,
    height: 1080,
    mark: "logo",
    logoHeight: 0.56,
    platforms: "Profile picture on Instagram, X, LinkedIn, Facebook, and YouTube",
  },
  square: {
    label: "Square post",
    width: 1080,
    height: 1080,
    mark: "lockup",
    lockupWidth: 0.68,
    platforms: "Instagram and Facebook feed, LinkedIn image post",
  },
  story: {
    label: "Story",
    width: 1080,
    height: 1920,
    mark: "lockup",
    lockupWidth: 0.72,
    platforms: "Instagram and Facebook stories, reel covers, TikTok",
  },
  "link-preview": {
    label: "Link preview",
    width: 1200,
    height: 630,
    mark: "lockup",
    lockupWidth: 0.56,
    platforms: "Open Graph and X card images for shared links",
  },
  "x-header": {
    label: "X header",
    width: 1500,
    height: 500,
    mark: "lockup",
    lockupWidth: 0.4,
    platforms: "X (Twitter) profile header",
  },
  "linkedin-banner": {
    label: "LinkedIn banner",
    width: 1584,
    height: 396,
    mark: "lockup",
    lockupWidth: 0.34,
    platforms: "LinkedIn profile and company page banner",
  },
  "facebook-cover": {
    label: "Facebook cover",
    width: 1640,
    height: 624,
    mark: "lockup",
    lockupWidth: 0.4,
    platforms: "Facebook page cover",
  },
  "youtube-banner": {
    label: "YouTube banner",
    width: 2560,
    height: 1440,
    mark: "lockup",
    lockupWidth: 0.39,
    platforms: "YouTube channel art; the lockup sits inside the 1546 × 423 safe area",
  },
};

const round = (value) => Number(value.toFixed(2));

function cssAngleToSvgLine(angle) {
  // CSS gradient angles run clockwise from "to top"; SVG lines run from (x1, y1) to (x2, y2).
  const radians = (angle * Math.PI) / 180;
  const dx = Math.sin(radians);
  const dy = -Math.cos(radians);
  return {
    x1: round(0.5 - dx / 2),
    y1: round(0.5 - dy / 2),
    x2: round(0.5 + dx / 2),
    y2: round(0.5 + dy / 2),
  };
}

function backgroundMarkup(tone, width, height) {
  const defs = [];
  const layers = [];

  if (tone.gradient) {
    const line = cssAngleToSvgLine(tone.gradient.angle);
    const stops = tone.gradient.stops
      .map(({ color: stopColor, position }) => `      <stop offset="${position}%" stop-color="${stopColor}"/>`)
      .join("\n");
    defs.push(`    <linearGradient id="tone" x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}">\n${stops}\n    </linearGradient>`);
    layers.push(`  <rect width="${width}" height="${height}" fill="url(#tone)"/>`);
  } else {
    layers.push(`  <rect width="${width}" height="${height}" fill="${tone.background}"/>`);
  }

  if (tone.bloom) {
    blooms[tone.bloom].forEach((bloom, index) => {
      const id = `bloom-${index}`;
      defs.push(
        `    <radialGradient id="${id}" cx="${bloom.cx}" cy="${bloom.cy}" r="1" gradientTransform="translate(${bloom.cx} ${bloom.cy}) scale(${bloom.rx} ${bloom.ry}) translate(${-bloom.cx} ${-bloom.cy})">\n` +
        `      <stop offset="0" stop-color="${bloom.color}" stop-opacity="${bloom.opacity}"/>\n` +
        `      <stop offset="1" stop-color="${bloom.color}" stop-opacity="0"/>\n` +
        `    </radialGradient>`,
      );
      layers.push(`  <rect width="${width}" height="${height}" fill="url(#${id})"/>`);
    });
  }

  return { defs, layers };
}

function letterDefinitions() {
  const paths = [
    ...brandGeometry.allfitLetters.map(([path]) => path),
    ...brandGeometry.oneLetters.map(([path]) => path),
  ];
  const uniquePaths = [...new Set(paths)];
  const ids = new Map(uniquePaths.map((path, index) => [path, `letter-${index}`]));
  const definitions = uniquePaths
    .map((path) => `    <path id="${ids.get(path)}" d="${path}"/>`)
    .join("\n");

  return { definitions, ids };
}

function lockupMarkup(surface, width, height, lockupWidth) {
  const neutral = surface === "dark" ? brandColors.chalk : brandColors.ink;
  const scale = lockupWidth / lockup.width;
  const x = round((width - lockupWidth) / 2);
  const y = round((height - lockup.height * scale) / 2);
  const { definitions, ids } = letterDefinitions();
  const uses = (letters, offset) => letters
    .map(([path, letterX]) => `      <use href="#${ids.get(path)}" x="${round(letterX - offset)}"/>`)
    .join("\n");

  return {
    defs: [definitions],
    content:
      `  <g transform="translate(${x} ${y}) scale(${round(scale * 10000) / 10000})">\n` +
      `    <path fill="${brandColors.cyan}" d="${brandGeometry.logoPath}" transform="${lockupLayout.logoTransform}"/>\n` +
      `    <g transform="${lockupLayout.allfitTransform}" fill="${neutral}">\n${uses(brandGeometry.allfitLetters, 0)}\n    </g>\n` +
      `    <g transform="${lockupLayout.oneTransform}" fill="${brandColors.cyan}">\n${uses(brandGeometry.oneLetters, lockupLayout.oneOffset)}\n    </g>\n` +
      `  </g>`,
  };
}

function logoMarkup(width, height, logoHeight) {
  const logo = brandDimensions.logo;
  const scale = logoHeight / logo.height;
  const x = round((width - logo.width * scale) / 2);
  const y = round((height - logoHeight) / 2);

  return {
    defs: [],
    content: `  <path fill="${brandColors.cyan}" d="${brandGeometry.logoPath}" transform="translate(${x} ${y}) scale(${round(scale * 10000) / 10000})"/>`,
  };
}

function svgDocument({ title, description, width, height, defs, body }) {
  const defsMarkup = defs.length ? `  <defs>\n${defs.join("\n")}\n  </defs>\n` : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">${description}</desc>
${defsMarkup}${body.join("\n")}
</svg>
`;
}

/** Builds every kit file in memory. Paths are relative to the package root. */
export function buildSocialAssets() {
  const assets = [];

  for (const [toneName, tone] of Object.entries(socialTones)) {
    for (const [formatName, format] of Object.entries(socialFormats)) {
      const { width, height } = format;
      const background = backgroundMarkup(tone, width, height);
      const mark = format.mark === "logo"
        ? logoMarkup(width, height, Math.round(height * format.logoHeight))
        : lockupMarkup(tone.surface, width, height, Math.round(width * format.lockupWidth));
      const subject = format.mark === "logo" ? "logo" : "logo and wordmark";
      const baseName = `allfit-one-${formatName}-${toneName}`;

      assets.push({
        tone: toneName,
        format: formatName,
        mark: format.mark,
        width,
        height,
        svg: `social/${toneName}/${baseName}.svg`,
        png: `social/${toneName}/${baseName}.png`,
        source: svgDocument({
          title: "Allfit One",
          description: `Allfit One ${subject} on the ${tone.label.toLowerCase()} tone, ${format.label.toLowerCase()} ${width} × ${height}`,
          width,
          height,
          defs: [...background.defs, ...mark.defs],
          body: [...background.layers, mark.content],
        }),
      });
    }
  }

  return assets;
}

export function buildSocialManifest(assets = buildSocialAssets()) {
  return {
    sourceOfTruth: "packages/brand/scripts/social-assets.mjs",
    tones: Object.fromEntries(
      Object.entries(socialTones).map(([name, { label, surface, description }]) => [name, { label, surface, description }]),
    ),
    formats: Object.fromEntries(
      Object.entries(socialFormats).map(([name, { label, width, height, mark, platforms }]) => [name, { label, width, height, mark, platforms }]),
    ),
    assets: assets.map(({ source, ...asset }) => asset),
  };
}
