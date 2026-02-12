

## Final Polish for Fullscreen Dialog

### Changes (single file: `src/components/VideoPlayerFullscreen.tsx`)

**1. Scroll Reset on Open**

Add a `useRef` for the scrollable wrapper and a `useEffect` that resets `scrollTop = 0` when the dialog opens or `videoId` changes.

```tsx
// Near existing refs (around line 60-80)
const scrollRef = useRef<HTMLDivElement>(null);

// New useEffect (near other open-dependent effects)
useEffect(() => {
  if (open && scrollRef.current) {
    scrollRef.current.scrollTop = 0;
  }
}, [open, videoId]);
```

Attach the ref to the scrollable div at line 490:
```tsx
<div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 w-full p-6 flex flex-col gap-6" data-dialog-scroll-area>
```

**2. Restore Header Border with Edge Bleed**

Line 491: Change the `DialogHeader` className from:
```
"flex-shrink-[unset] border-b-0 px-0 pb-0 pt-0"
```
to:
```
"-mx-6 -mt-6 px-6 py-4 border-b flex-shrink-0"
```

This pulls the header to the edges of the `p-6` parent using negative margins, restoring the full-width bottom border. The header becomes visually pinned at the top of the scroll area (not the viewport) and scrolls away with the content. The `mb` is not needed because the parent's `gap-6` handles the spacing below.

**3. Verify DialogTitle**

Line 492-494: Confirm `DialogTitle` has no inline typography overrides. It currently renders as a bare tag, which correctly inherits `.text-h3` from the global CSS layer. No change needed here.

**4. Footer -- No Changes Needed**

The `DialogFooter` is already outside the scrollable div (line 550+) and uses the primitive's built-in `px-6 py-4 border-t flex-shrink-0`. The inner wrapper divs already had `p-4` removed in the previous pass. No further changes required.

### Summary

| Area | Change |
|------|--------|
| Scroll reset | New `useRef` + `useEffect` to force `scrollTop = 0` on open |
| Header | Negative margins for edge-bleed border, restored `border-b` |
| Title | No change -- already inherits `.text-h3` |
| Footer | No change -- already correct |

### Review

1. **Risks:** None -- layout and scroll-position only, no logic changes.
2. **Fixes:** Header border restored with proper edge bleed; scroll position resets on open; no double-padding; footer remains pinned and consistent.
3. **Database Change:** No.
4. **Verdict:** Go.

