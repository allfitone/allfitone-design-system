# @allfitone/react-native

React Native adapters for the Allfit One foundations. The package renders canonical brand geometry through `react-native-svg`, maps the shared semantic icon vocabulary through `lucide-react-native`, and exposes native token helpers.

```tsx
import { BrandLockup, ProductLockup } from "@allfitone/react-native/brand";
import { FoundationIcon } from "@allfitone/react-native/icons";
import { getNativeTheme, getNativeTouchTarget } from "@allfitone/react-native/tokens";

const theme = getNativeTheme("dark");

<BrandLockup surface="dark" accessibilityLabel="Allfit One" />;
<ProductLockup product="space" surface="dark" accessibilityLabel="Allfit Space" />;
<FoundationIcon name="activity" color={theme.icon.primary} decorative />;
<FoundationIcon name="back" color={theme.icon.primary} size="sm" strokeScale="compact" decorative />;
getNativeTouchTarget("android"); // 48
```

## Peer requirements

- React Native `0.86` or newer
- React `19` or newer
- `react-native-svg` `15.15.5` or newer

Expo projects should install `react-native-svg` through `npx expo install react-native-svg` so the version matches the active Expo SDK.

## Entry points

- `@allfitone/react-native/brand`: native master-brand logo plus Space, Studio, and Backoffice wordmark and shared-logo lockup components.
- `@allfitone/react-native/icons`: semantic native icon component and metadata.
- `@allfitone/react-native/tokens`: typed tokens plus touch-target, theme, and letter-spacing helpers.

Meaningful brand images require `accessibilityLabel`. Decorative brand images and icons remain outside the accessibility tree by default.
