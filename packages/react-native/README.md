# @allfitone/react-native

React Native adapters for the Allfit One foundations. The package renders canonical brand geometry through `react-native-svg`, maps the shared semantic icon vocabulary through `lucide-react-native`, loads the two brand typefaces, and exposes themed primitives so products compose layout rather than palettes.

```tsx
import { Button } from "@allfitone/react-native/button";
import { ProductLockup } from "@allfitone/react-native/brand";
import { useAllfitFonts } from "@allfitone/react-native/fonts";
import { Screen } from "@allfitone/react-native/screen";
import { Text } from "@allfitone/react-native/text";
import { ThemeProvider, useTheme } from "@allfitone/react-native/theme";

function App() {
  const { loaded } = useAllfitFonts();
  if (!loaded) return null;

  return (
    <ThemeProvider theme="dark">
      <Screen>
        <ProductLockup product="space" surface="dark" accessibilityLabel="Allfit Space" />
        <Text role="display" size="4xl" uppercase>
          Todo tu fitness
        </Text>
        <Button label="Crear mi cuenta" onPress={createAccount} />
      </Screen>
    </ThemeProvider>
  );
}
```

## Fonts

The token package names Barlow Condensed and Manrope but ships no font files. React Native cannot resolve a family name that was never registered: it falls back to the platform font **silently**, with no error. `useAllfitFonts` therefore lives here rather than in each product, so two surfaces cannot load different weights of the same family.

Render nothing meaningful until `loaded` is true. Text drawn before the faces register lays out in the platform font and reflows when they arrive.

Only the five faces `typographyRole` resolves to are loaded. A role that needs a new weight adds it deliberately — every extra face is bundle weight paid on each cold start.

## Peer requirements

- React Native `0.86` or newer
- React `19` or newer
- `react-native-svg` `15.15.5` or newer
- `react-native-safe-area-context` `5` or newer
- `expo-font` `57` or newer
- `expo-linear-gradient` `57` or newer

Expo projects should install the native peers through `npx expo install` so the versions match the active Expo SDK.

## Entry points

- `@allfitone/react-native/brand`: native master-brand logo plus Space, Studio, and Backoffice wordmark and shared-logo lockup components.
- `@allfitone/react-native/icons`: semantic native icon component and metadata.
- `@allfitone/react-native/tokens`: typed tokens plus touch-target, theme, and letter-spacing helpers.
- `@allfitone/react-native/fonts`: font loading and the role-to-family mapping.
- `@allfitone/react-native/theme`: `ThemeProvider`, `useTheme`, and a resolved theme.
- `@allfitone/react-native/text`: typographic component driven by `typographyRole`.
- `@allfitone/react-native/button`: pill action with the platform touch target.
- `@allfitone/react-native/screen`: safe-area container that paints the canvas.
- `@allfitone/react-native/gradient`: `SignalBlock` and `Scrim`.
- `@allfitone/react-native/glass`: `GlassPanel`, the translucent chrome material.
- `@allfitone/react-native/backdrop`: `AmbientBackdrop`, the soft blooms and dot grid.
- `@allfitone/react-native/brand-entrance`: the mark filling with liquid, for app launch.
- `@allfitone/react-native/text-field`: labelled text entry with a state-carrying border.
- `@allfitone/react-native/code-field`: segmented entry for a short numeric code.
- `@allfitone/react-native/inline-alert`: status message that sits with its control.

## Notes that are easy to get wrong

**Never set `fontWeight` alongside a role.** The weight is carried by the family the role resolves to. Combined with a custom `fontFamily`, Android synthesises a face and renders visibly heavier than the real one.

**`Text` omits the underlying `role` prop.** React Native has its own for accessibility, and its value set intersects the typographic roles at exactly `"heading"`, which silently narrows every other role away. Screen-reader semantics stay available through `accessibilityRole`.

**`Scrim` needs image beneath it.** `coverage` is where the fade *completes*, not where the image ends. If the image stops at that point, the last percent of the fade still shows image and leaves a visible seam — obvious on a light canvas, where the dark edge of a photograph meets a near-white background.

**`CodeField` is one input, not one per digit.** A field per digit has to simulate backspace across fields, and only one of them receives the platform's one-time-code autofill. The boxes are drawn beneath a single transparent input and hidden from assistive technology.

**`CodeField` sets no `returnKeyType` and does not accept one.** The iOS number pad has no return key, so requesting one makes the platform float a loose button over the layout.

**One `SignalBlock` per screen.** Ink & Signal allows a single accent surface; a second one is a design error this component cannot catch.

Meaningful brand images require `accessibilityLabel`. Decorative brand images and icons remain outside the accessibility tree by default.

## Testing limits

The validation script asserts what can be imported outside Metro: the role-to-family mapping, the ratio-to-absolute conversions for line height and letter spacing, and the gradient angle conversion. Those are the silent-failure paths — each renders something plausible when wrong.

Components themselves are not yet covered. The repository has no React Native test runner, so rendering, press behaviour, and accessibility state remain unverified by automation. This is a known gap, not an oversight.
