

## Push Presentation Timer to Far Right

### Problem
When no training description is present, the timer Banner sits at the left side of the container because `justify-between` has no left-side element to push against.

### Change (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- line 497

The `flex` container on line 497 already uses `justify-between`, but when the description is conditionally hidden, the timer loses its right alignment.

**Fix:** Add `ml-auto` to the timer's Banner wrapper so it always aligns to the far right, regardless of whether the description div is rendered.

Wrap the timer block (lines 505-515) in a `div` with `className="ml-auto shrink-0"` -- or more simply, since both Banner variants already have `shrink-0`, just add `ml-auto` to each Banner's className.

| Line | Before | After |
|------|--------|-------|
| 507 | `className="w-fit shrink-0"` | `className="w-fit shrink-0 ml-auto"` |
| 511 | `className="w-fit shrink-0"` | `className="w-fit shrink-0 ml-auto"` |

`ml-auto` pushes the element to the far right within the flex container whether or not a sibling exists to the left.

### Review
1. **Risks:** None -- `ml-auto` is additive and has no effect when a left sibling already fills the space via `justify-between`.
2. **Fixes:** Timer is always pinned to the far right.
3. **Database Change:** No.
4. **Verdict:** Go -- two class additions.

