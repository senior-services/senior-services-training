

## Fix Quiz Footer Height

### Root Cause
The `DialogFooter` base class includes `flex-col-reverse` (mobile-first) which stacks children vertically. Combined with `sm:justify-between items-center` added for the timer layout, the quiz branch (single child) inherits unnecessary vertical space. The footer height visually jumps when transitioning from the pre-quiz view (timer + buttons) to the quiz view (buttons only).

### Fix (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- line 609

Move the `sm:justify-between` class from the shared `DialogFooter` into the pre-quiz branch only, so the quiz branch gets the default `sm:justify-end` behavior without layout inflation.

**Before (line 609):**
```tsx
<DialogFooter className="sm:justify-between items-center">
```

**After:**
```tsx
<DialogFooter className="items-center">
```

Then on the pre-quiz fragment wrapper (line 657), change from a bare fragment to a wrapper that spans the full width with justify-between:

**Before (lines 657, 710):**
```tsx
<>
  {/* timer + buttons */}
</>
```

**After:**
```tsx
<div className="flex w-full items-center justify-between gap-2">
  {/* timer + buttons */}
</div>
```

This way:
- **Quiz branch**: `DialogFooter(sm:justify-end)` + `div.ml-auto` = buttons right-aligned, single-row height.
- **Pre-quiz branch**: `DialogFooter` wraps a single full-width div that handles `justify-between` internally for timer (left) and buttons (right).

### Review
1. **Risks:** None -- layout-only, no logic changes.
2. **Fixes:** Footer height stays consistent between pre-quiz and quiz states.
3. **Database Change:** No.
4. **Verdict:** Go.
