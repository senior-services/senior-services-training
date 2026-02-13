

## Fix: Inconsistent Button Gap in Training Dialog Footer

### Problem
The screenshot shows that the video training footer (quiz-active state) has `gap-4` (1rem) between Cancel and Submit Quiz, while the presentation training footer (content state) has `gap-2` (0.5rem) between Cancel and Complete Training. This is because the "content" footer state wraps its right-zone buttons in a nested `div` with `gap-2`, while all other states use `gap-4` from the outer wrapper.

### Current State

| Footer State | Gap Between Buttons | Source |
|---|---|---|
| completed | `gap-4` (outer div) | Line 481 |
| quiz-done | N/A (single button) | Line 495 |
| quiz-active | `gap-4` (outer div, buttons are direct children) | Line 506 |
| content | **`gap-2`** (nested right-zone div) | Line 590 |

### Fix

**`src/components/VideoPlayerFullscreen.tsx`** -- single-line change

Change line 590 from `gap-2` to `gap-4`:

```
<div className="flex gap-4">
```

This aligns the content state's button spacing with all other footer states, making the footer visually cohesive across all four training use cases.

### Review
1. **Top 3 Risks:** None -- pure spacing alignment, no logic change.
2. **Top 3 Fixes:** (a) Consistent `gap-4` across all footer states.
3. **Database Change:** No.
4. **Verdict:** Go -- one-line fix.
