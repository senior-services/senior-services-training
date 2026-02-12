

## Separate Timer from Buttons in Dialog Footer

### Problem
The timer Banner sits right next to the Cancel button because all three elements (timer, Cancel, action button) are siblings in the fragment. The footer's `sm:justify-between` distributes space evenly across all children instead of creating a left/right split.

### Fix (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- lines 671-705

Wrap the Cancel button and the action button (the entire "Pre-quiz or no-quiz" button group) in a `<div className="flex gap-2">` so the footer sees only two top-level children:

```text
DialogFooter (sm:justify-between)
  [LEFT]   Timer Banner
  [RIGHT]  <div flex gap-2>  Cancel | Action Button  </div>
```

This pushes the timer to the far left and keeps the buttons grouped on the far right.

### Review
1. **Risks:** None -- purely layout, no logic change.
2. **Fixes:** Timer pinned far-left, buttons grouped far-right.
3. **Database Change:** No.
4. **Verdict:** Go -- one wrapper div addition.
