---
"@allfitone/react": minor
---

Add `AreaChart` and `BarChart` (`@allfitone/react/components/chart`) and `BarList` (`@allfitone/react/components/bar-list`). The charts draw a trend over time or a comparison across a few positions in the signal and its context, two series at most, and repeat every value as text: a table view for assistive technology and a readout that follows the pointer and the arrow keys. A missing value is a gap, never a zero. `BarList` ranks a handful of named things as bars whose name and figure stay text. The stylesheet gains `--chart-1` and `--chart-2`. `recharts` is a new dependency of the package, loaded only by products that import the chart subpath.
