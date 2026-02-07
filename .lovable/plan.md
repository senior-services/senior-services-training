

# Add "Quiz Results" Heading

## What changes

Add a "Quiz Results" heading text back into the compact banner, placed after the icon and before the percentage.

## How

**File: `src/components/quiz/QuizScoreSummary.tsx`** (line 39)

Insert a `<span className="font-semibold text-sm">Quiz Results</span>` between the icon container and the percentage, inside the existing flex row.

| Item | Detail |
|---|---|
| Files changed | 1 |
| Lines changed | 1 |
| Risk | Minimal -- text-only addition |

