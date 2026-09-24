---
"@allfitone/tokens": minor
---

`screenTop` grows from 12 to 20.

The safe area clears the hardware and nothing else, so this is the only air between
the notch and the first thing anybody reads. At 12 every screen in Space read as
shoved against the top of the phone — and it being every screen at once is the tell
that the fault is in the token rather than in a hundred layouts.

16 was tried first on a device and still read pinned; 20 is where it stopped. Both
are steps of the scale — a value between them would be a number this ramp does not
have.
