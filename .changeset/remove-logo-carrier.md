---
"@allfitone/brand": minor
"@allfitone/react": minor
"@allfitone/react-native": minor
---

Remove the "logo with carrier" presentation. The Allfit One logo now appears only in its plain form, with no cyan tile behind it.

- `BrandLogoCarrier` is removed from `@allfitone/brand/react`, `@allfitone/react/brand`, and `@allfitone/react-native/brand`. Use `BrandLogo` instead.
- `brandGeometry.carrierPath`, `brandDimensions.logoCarrier`, `brandAssetFiles.logoCarrier`, and `brandAssetSpecifiers.logoCarrier` are removed, and `assets/logo/allfit-one-logo-carrier.svg` is no longer shipped.
- `BrandLockup`, `ProductLockup`, `AnimatedBrandLockup`, and the lockup SVG assets render the plain cyan logo beside the wordmark. Their artwork is narrower: the Allfit One lockup is now 1438 × 480, and the Space, Studio, and Backoffice lockups are 1712, 1792, and 2340 × 480.
