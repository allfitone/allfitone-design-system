# @allfitone/brand

## 0.4.1

### Patch Changes

- 6ef125e: Point repository, homepage and issue links at the renamed `allfitone` GitHub organization so npm provenance matches the publishing repository.

## 0.4.0

### Minor Changes

- 679be83: Remove the "logo with carrier" presentation. The Allfit One logo now appears only in its plain form, with no cyan tile behind it.

  - `BrandLogoCarrier` is removed from `@allfitone/brand/react`, `@allfitone/react/brand`, and `@allfitone/react-native/brand`. Use `BrandLogo` instead.
  - `brandGeometry.carrierPath`, `brandDimensions.logoCarrier`, `brandAssetFiles.logoCarrier`, and `brandAssetSpecifiers.logoCarrier` are removed, and `assets/logo/allfit-one-logo-carrier.svg` is no longer shipped.
  - `BrandLockup`, `ProductLockup`, `AnimatedBrandLockup`, and the lockup SVG assets render the plain cyan logo beside the wordmark. Their artwork is narrower: the Allfit One lockup is now 1438 × 480, and the Space, Studio, and Backoffice lockups are 1712, 1792, and 2340 × 480.

## 0.3.0

### Minor Changes

- 36f5bf4: Add canonical ink and cyan favicon variants with public asset paths, resolvable specifiers, manifest entries, generated SVGs, and synchronization support.

## 0.2.0

### Minor Changes

- 760c84e: Add outlined Allfit Space, Studio, and Backoffice wordmarks plus Web, React Native, and static SVG lockups that temporarily reuse the exact canonical Allfit One logo.
