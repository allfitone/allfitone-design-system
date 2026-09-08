---
"@allfitone/tokens": minor
"@allfitone/react-native": minor
---

Add `WheelPicker`, and the three `wheel` colours it reads.

A column of values that turns under a fixed window: the reading is not a label above
a ruler, it **is** the row sitting in the window, so the number and the act of
choosing it are one object instead of two that have to be kept in agreement.

It is a `ScrollView` with `snapToInterval`, not a pan gesture — a wheel is scrolling,
and saying so hands over momentum, the platform's fling curve and accessibility
scrolling for free. Distance from the window drives size and colour in three steps
rather than a continuous ramp, because interpolating `fontSize` per frame cannot run
on the native driver and would drag the scroll back onto the JavaScript thread
exactly while the finger is moving fastest.

It runs both ways. `orientation` lays the scale across or down — the pairing of a
horizontal weight beside a vertical height is deliberate, and two components would
let their detents, tiers and accessibility drift apart the first time one of them was
touched.

The window is two ticks and nothing between them — a filled band with a
rule above and below draws a second object around the reading and turns the wheel
into a table.

It paints no background of its own. Softening the ends with a gradient in the page's
colour is a claim about what the page is, and over anything but a flat fill that
claim shows up as a rectangle sitting on the design; dimming the far pair and letting
the frame cut it in half reads the same and survives whatever it stands on.

`semanticColor.wheel` carries `near` and `far` in both themes, with two new neutrals
behind them.
