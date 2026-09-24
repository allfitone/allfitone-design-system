---
"@allfitone/react": minor
---

A horizontal `TabsList` now wraps onto a second row instead of scrolling
horizontally. A tab pushed off the edge was a section the person had no way of
knowing existed, and a strip of three ordinary labels stops fitting at 390px.

Nothing changes for a strip that already fits: the list still takes the width of
its content, so it is laid out exactly as before until wrapping is needed.
