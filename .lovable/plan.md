

## Finalize Spacing and Conditional Logic for Training Dialog

### Changes across 2 files

---

### File 1: `src/components/VideoPlayerFullscreen.tsx`

**Change A -- Fix scrollable div padding (line 435)**

Update the className from `p-6` to `px-6 pb-6 pt-0`:

```tsx
// Before
className="flex-1 overflow-y-auto min-h-0 w-full p-6 flex flex-col gap-6"

// After
className="flex-1 overflow-y-auto min-h-0 w-full px-6 pb-6 pt-0 flex flex-col gap-6"
```

This removes the 24px top gap so the first content element sits exactly 16px below the header border (the header's `py-4` provides 16px bottom padding, and `pt-0` on the scroll area adds nothing extra).

**Change B -- Conditional description block (lines 436-444)**

The description wrapper currently renders a flex container with `pb-4` even when description is empty. Tighten the conditional and remove the outer wrapper so it only renders when content exists:

```tsx
// Before
<div className="flex items-start justify-between gap-4 pb-4">
  {video?.description && video.description.trim() && (
    <div className="flex-1" id="video-description">
      <p className="text-body text-foreground">
        {video.description}
      </p>
    </div>
  )}
</div>

// After
{video?.description && video.description.trim() !== '' && (
  <div id="video-description">
    <p className="text-body text-foreground">
      {video.description}
    </p>
  </div>
)}
```

The outer flex wrapper is removed entirely. When description is absent, nothing renders and the `gap-6` on the parent handles spacing naturally.

**Change C -- Footer verification (no change needed)**

Both `DialogFooter` blocks (lines 490-546 for quiz, lines 548-651 for presentation) are already direct children of `FullscreenDialogContent`, outside the scrollable div. No structural change required.

---

### File 2: `src/components/ui/dialog.tsx`

**Change D -- DialogTitle scale step (line 133)**

Update from `text-h3` to `text-h4` globally:

```tsx
// Before
className={cn("text-h3", className)}

// After
className={cn("text-h4", className)}
```

This changes all dialog titles from 25px/600 weight to 20px/600 weight, matching the user's senior-first compliance requirement.

---

### Summary

| Area | Change |
|------|--------|
| Scrollable div | `p-6` changed to `px-6 pb-6 pt-0` to eliminate top spacing gap |
| Description block | Outer wrapper removed; conditional tightened to `!== ''`; no residual spacing when empty |
| DialogHeader | No change -- primitive defaults (`px-6 py-4 border-b flex-shrink-0`) are correct |
| DialogFooter | No change -- already outside scrollable div, inherits primitive defaults |
| DialogTitle (primitive) | `text-h3` changed to `text-h4` globally |

### Review

1. **Top 3 Risks:** (a) Changing DialogTitle to `text-h4` globally affects every dialog in the app (AlertDialogs, modals, etc.) -- this is likely the desired outcome for consistency. (b) Removing the description wrapper changes the `id="video-description"` anchor from a flex container to a plain div -- `aria-describedby` still works. (c) `pt-0` means the first child in the scroll area has no top padding, relying entirely on the header's bottom padding for separation.
2. **Top 3 Fixes:** (a) No extra whitespace above video/slides. (b) Empty descriptions no longer leave phantom spacing. (c) Dialog titles standardized to `text-h4` (20px).
3. **Database Change:** No.
4. **Verdict:** Go.
