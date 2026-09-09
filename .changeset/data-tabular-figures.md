---
"@allfitone/react-native": patch
---

The `data` role renders tabular figures, which its token already promised.

It exists for metrics, timers and KPIs and says so: *"large data numerals render in
the condensed display face with tabular figures for athletic character"*. Nothing
was setting `fontVariant`, so the figures stayed proportional — and a running clock
reflowed on every tick, because `00:09` and `00:10` are different widths and the
whole row shifts under the eye reading it.

The validator now asserts it, and asserts that no other role asks for it: tabular
figures cost width and are wrong under prose.
