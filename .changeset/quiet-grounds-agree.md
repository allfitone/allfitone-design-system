---
"@allfitone/react-native": minor
---

`Screen` draws the ambient backdrop, so one product has one ground.

The blooms and the dot grid used to be mounted screen by screen, which left the
sparse screens — welcome, sign in, onboarding — on one ground and everything else
flat. That is the disagreement about what the canvas is that `Screen` exists to
prevent, one layer up, and the seam showed on walking from onboarding into the
app.

It is on by default; `ambient={false}` is for a screen whose own imagery is the
ground.

The dot grid does not come with it. `AmbientBackdrop` takes `dots` (still true when
asked for directly) and `Screen` takes `dots`, off by default: the grid belongs to
the screens with room to spare — welcome, sign in, onboarding — and on a screen of
dense reading it puts a pattern between the eye and the text. Those screens keep
the wash, which carries the same colour without the texture. It is drawn outside the safe area and outside the inset, so it reaches the
notch and both margins — mounted by hand inside the padded box it was inset by the
padding and left unpainted strips down the sides.

The dark wash is also dimmer — roughly four tenths off each bloom. The canvas is
already near black, and the wash was lifting it toward the same muted turquoise the
cards, the tiles and the hairlines already sit in, so on a full screen everything
fell into one band of colour and nothing read as being in front. The ground has to
be where nothing happens.
