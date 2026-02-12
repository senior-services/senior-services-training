

## Fix Timer Position in Dialog Footer

### Root Cause
The timer is trapped inside a single `<div className="flex gap-2">` wrapper (line 610) that contains **all** footer content. The `DialogFooter` uses `sm:justify-end`, so everything clusters to the right. The previous fix added a nested buttons div but didn't pull the timer out of the outer wrapper.

### Fix (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- lines 607-710

**Structure changes:**

1. Change `sm:justify-end` to `sm:justify-between` on the `DialogFooter` (line 609) so left/right split works.

2. Restructure the pre-quiz branch (lines 657-707) so the timer is a **direct child** of `DialogFooter`, not nested inside the outer `div.flex.gap-2`.

3. Remove the redundant `isPresentation && !wasEverCompleted` guard on the timer (line 660) -- the entire footer block is already gated by that same condition (line 608).

4. Remove the extra nested `<div className="flex gap-2">` around the buttons (line 672) since the outer wrapper already provides `flex gap-2` for the quiz-started branch's buttons.

**Target structure (pre-quiz branch):**

```text
DialogFooter (sm:justify-between, items-center)
  [LEFT]   Timer Banner (direct child)
  [RIGHT]  <div flex gap-2>  Cancel | Action Button  </div>
```

**For the quiz-started branch** (lines 611-656), there is no timer, so the `sm:justify-between` with only one child (the buttons div) will naturally push buttons to the right -- no change needed there.

### Cleanup Summary
- Remove 1 redundant conditional check
- Flatten 1 unnecessary nesting level
- Fix the `justify` class from `end` to `between`
- Add `items-center` for vertical alignment of banner with buttons

### Review
1. **Risks:** None -- layout-only, no logic changes.
2. **Fixes:** Timer pinned far-left, buttons grouped far-right, cleaner DOM structure.
3. **Database Change:** No.
4. **Verdict:** Go.
