---
"@allfitone/react-native": patch
---

`PageDots` animates between pages.

It is the only thing on the deck that animates, and that is deliberate: the pages
already slide, and a parallax on top of them made the carousel feel slower rather than
deeper.

One `Animated.Value` holds the active index and every dot reads its own width and
colour off the distance to it, so there is a single animation rather than six fighting
each other — and a fractional index would work unchanged if a deck ever wanted the pill
to follow the finger.

`width` rather than `scaleX`, which is the one case where that is right: scaling a
four-point pill along one axis smears its corners into ovals. Six of them relaying out
once per page is a single layout pass, not a per-frame cost, which is what makes the
non-native driver acceptable here.

Takes `reduceMotion` like `Sheet` does, and honours it by keeping the change and
dropping the travel: which page you are on is state the row exists to report.
