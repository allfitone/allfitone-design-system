---
"@allfitone/react": patch
---

Keep the table `AreaChart` and `BarChart` carry for assistive technology inside the screen. The table was hidden by its own class, and a table ignores a width under its content's, so its box stayed as wide as its longest row and hung past the edge of a phone. A hidden block now holds it and the table may wrap, so nothing of it leaves a 320 px screen. `[data-slot="chart-table"]` still names the table and its rows read as before.
