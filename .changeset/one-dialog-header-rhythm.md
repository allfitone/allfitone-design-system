---
"@allfitone/react": patch
---

`DialogHeader` spaces a title from its description by 6px, matching
`AlertDialogHeader`. The two carried 10px and 6px for the same pairing, which
only became visible once the base reset removed the user-agent margins that had
swamped both.
