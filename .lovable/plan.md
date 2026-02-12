

## Fix Layout Regressions in Fullscreen Dialog Refactor

### Problem

The previous refactor removed `DialogScrollArea` (which provided `px-6 py-6 bg-muted/50`) and replaced it with a plain div. The current wrapper div has `data-dialog-scroll-area` but no explicit padding classes, and the inner footer branches add their own `p-4` which conflicts with the `px-6 py-4` already baked into the `DialogFooter` primitive.

### Changes (single file: `src/components/VideoPlayerFullscreen.tsx`)

**1. Scrollable wrapper -- restore content spacing**

Line 490: Change the scrollable div from:
```
<div className="flex-1 overflow-y-auto min-h-0" data-dialog-scroll-area>
```
to:
```
<div className="flex-1 overflow-y-auto min-h-0 w-full p-6 flex flex-col gap-6" data-dialog-scroll-area>
```

**2. Header -- remove double padding**

Line 491: Change `DialogHeader` from:
```
<DialogHeader className="flex-shrink-[unset] border-b-0">
```
to:
```
<DialogHeader className="flex-shrink-[unset] border-b-0 px-0 pb-0 pt-0">
```
This zeroes out the header's own `px-6 py-4` since the parent wrapper now provides the `p-6` padding. The header sits flush inside the scrollable container.

**3. Footer branches -- remove inner p-4, let primitive handle padding**

The `DialogFooter` primitive already applies `px-6 py-4`. The inner wrapper divs must not duplicate padding. Four lines change:

- Line 552: `"flex w-full items-center justify-end gap-4 p-4"` becomes `"flex w-full items-center justify-end gap-4"`
- Line 599: `"flex w-full items-center justify-end gap-4 p-4"` becomes `"flex w-full items-center justify-end gap-4"`
- Line 612: `"flex w-full items-center justify-end gap-4 p-4"` becomes `"flex w-full items-center justify-end gap-4"`
- Line 658: `"flex w-full items-center justify-between gap-4 p-4"` becomes `"flex w-full items-center justify-between gap-4"`

**4. No changes to `dialog.tsx`**

The `DialogFooter` primitive already has `px-6 py-4 border-t flex-shrink-0` -- this is correct and provides consistent 16px vertical / 24px horizontal padding across all states.

### Review

1. **Risks:** None -- layout-only, no logic changes. The `data-dialog-scroll-area` attribute prevents the catch-all padding selector from also firing on this div.
2. **Fixes:** Restores 24px content padding; eliminates double-padding from header and footer branches; consistent footer height across all states; Banner and Close button aligned within 24px side gutters.
3. **Database Change:** No.
4. **Verdict:** Go.

