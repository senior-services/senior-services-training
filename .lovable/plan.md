
## Fix Vertical Gap Between Tab Labels and Underline

### Problem
The badge inside the "Quiz" tab trigger has default vertical padding (`py-0.5`) which stretches the trigger height, creating a visible gap between the tab text and the horizontal underline bar.

### Fix

**File: `src/components/EditVideoModal.tsx`** (line 993)

Add `py-0 leading-none` classes to the Badge inside the Quiz tab trigger. This neutralizes the badge's vertical footprint so it doesn't push the trigger taller than "Details", keeping both tabs flush with the underline.

### Review

- **Top 5 Risks**: None -- single CSS class addition.
- **Top 5 Fixes**: (1) Add `py-0 leading-none` to tab badge.
- **Database Change Required**: No
- **Go/No-Go**: Go -- minimal styling fix consistent with established tab-layout-consistency pattern.
