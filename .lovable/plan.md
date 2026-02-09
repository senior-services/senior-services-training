
## Apply Muted Foreground Color to "N/A" and "--" in Assign Videos Dialog

### What Will Change
Add `text-muted-foreground` class to all instances of "N/A" and "--" text in the Assign Videos modal so they appear visually de-emphasized, matching the design system's secondary text color.

### Changes

**File: `src/components/dashboard/AssignVideosModal.tsx`**

1. **Due Date column (line 819)**: The `formatDueDate` function returns plain strings ("--" and "N/A"), so wrap the rendered output with conditional styling. When the value is "--" or "N/A", apply `text-muted-foreground`.

2. **Quiz Results column (lines 611-620)**: The `getQuizResults` function already returns JSX `<span>` elements for "--" and "N/A". Add `className="text-muted-foreground"` to each of these three spans:
   - Line 613: `N/A` (no quiz for assigned course)
   - Line 614: `--` (unassigned, no quiz)
   - Line 619: `--` (unassigned, has quiz)

### Technical Details

- **Due Date**: Since `formatDueDate` returns a string, the simplest approach is to add a conditional class on the wrapping `<span>` at line 819: check if the value is "--" or "N/A" and apply `text-muted-foreground`.
- **Quiz Results**: Directly add the class to the existing `<span>` elements.
- No new components, state, or dependencies needed.

### Review
- **Top 5 Risks**: None -- purely visual styling change.
- **Top 5 Fixes**: (1) Add muted color to quiz "--" spans. (2) Add muted color to quiz "N/A" span. (3) Add muted color to due date "--" and "N/A" output.
- **Database Change Required**: No
- **Go/No-Go**: Go
