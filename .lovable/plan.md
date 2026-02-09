

## Remove "Completed" Label from Completed Course Badge

### What's Changing
The completed course badge currently shows "Completed Sep 9" -- updating it to show just the date "Sep 9" (with the green checkmark icon). The tooltip on hover will still show the full context: "Completed September 9, 2025".

### Technical Details

**File: `src/components/TrainingCard.tsx`** (lines 308-310)
- Change badge text from `` `Completed ${format(..., 'MMM d')}` `` to just `format(..., 'MMM d')`
- Tooltip text remains unchanged: "Completed February 19, 2026"

One line change. No other files affected.

### Review
- **Top 5 Risks**: None -- cosmetic text-only change.
- **Top 5 Fixes**: (1) Remove "Completed" prefix from badge label.
- **Database Change Required**: No
- **Go/No-Go**: Go
