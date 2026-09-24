---
"@allfitone/tokens": minor
"@allfitone/react-native": minor
---

Glass is translucent again, and there are two materials instead of one.

The fill is what colours the panel, but `BlurView`'s dark tint is a heavy
translucency in its own right and at the intensity this shipped with it darkened
everything a second time. A chip over a photograph came out solid, with none of the
photograph in it. The blur now only blurs, and the token's own alpha decides how
much shows through.

`chip` joins `glass`: chrome floats over the canvas, where the thing behind it is a
colour and the fill can afford to be heavy; a chip floats over imagery, where the
thing behind it is the reason the screen works. At the same opacity it reads as a
sticker, so it is lighter and its edge is brighter.

`shine` becomes a token of its own. The specular edge was being painted with
`border.subtle`, which is a border colour standing in for a highlight.
