

## Restore Natural Scroll Flow in VideoPlayerFullscreen.tsx

### Problem

The current layout has `DialogHeader` fixed outside the scroll area and `DialogFooter` also outside. The user wants a **natural scroll flow** where header, content, and footer all live inside a single scrollable container -- the footer only appears when you scroll to the bottom.

### Structural Change

Current structure:
```text
FullscreenDialogContent (flex-col, overflow-hidden)
  +-- DialogHeader (fixed, flex-shrink-0)
  +-- div[scrollable] (flex-1 overflow-y-auto, p-6)
  |     +-- content (video/slides/quiz/attestation)
  +-- DialogFooter (fixed, flex-shrink-0)
```

New structure:
```text
FullscreenDialogContent (flex-col, overflow-hidden)
  +-- div[scrollable] (flex-1 overflow-y-auto, px-6 pb-6 pt-0)
        +-- DialogHeader (pt-6 pb-4 px-0 border-b)
        +-- content (video/slides/quiz/attestation)
        +-- DialogFooter (px-0 py-6 mt-6 border-t)
```

### Changes (single file: `src/components/VideoPlayerFullscreen.tsx`)

**1. Move DialogHeader back inside the scrollable div and wrap footer inside it too**

Line 503-508: Move `DialogHeader` inside the scrollable div and change the div's padding:

```tsx
<div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 w-full px-6 pb-6 pt-0" data-dialog-scroll-area>
  <DialogHeader className="pt-6 pb-4 px-0 border-b">
    <DialogTitle>
      {video?.title || 'Training Video'}
    </DialogTitle>
  </DialogHeader>
  <div className="flex flex-col gap-6 pt-6">
    ... existing content (description, video, quiz, attestation) ...
  </div>
```

The header overrides:
- `pt-6 pb-4`: top padding provides the 24px top spacing, bottom padding gives 16px before the border
- `px-0`: zeroes out the primitive's built-in `px-6` since the parent already provides it
- `border-b`: kept (primitive default, but explicitly stated to override any prior removal)
- The primitive's `bg-background` and `flex-shrink-0` remain from the base class -- `flex-shrink-0` is harmless inside a scroll container

**2. Move both DialogFooter blocks inside the scrollable div**

Move the two footer blocks (quiz footer at line 563-619 and presentation footer at line 621-727) from after `</div>` (closing the scroll area) to just before `</div>`. Apply className overrides to remove their own padding/border since the parent handles gutters:

```tsx
<DialogFooter className="px-0 py-6 mt-6 border-t">
```

This override:
- `px-0`: zeroes out primitive's `px-6` since the scrollable parent provides `px-6`
- `py-6`: 24px vertical padding for breathing room
- `mt-6`: gap above the footer separator
- `border-t`: kept from primitive default (explicitly stated for clarity)

**3. Scroll reset -- no changes needed**

The existing `useEffect` and `onOpenAutoFocus` handler both reset `scrollRef.current.scrollTop = 0`. Since the header is now the first child inside the scroll container, resetting to 0 guarantees the header is visible on open.

### Summary

| Area | Change |
|------|--------|
| Scrollable div | Now wraps header + content + footer; className changes to `px-6 pb-6 pt-0` |
| DialogHeader | Moved inside scroll div; className `pt-6 pb-4 px-0 border-b` |
| Content wrapper | Wrapped in inner `div` with `flex flex-col gap-6 pt-6` for spacing |
| Both DialogFooters | Moved inside scroll div; className `px-0 py-6 mt-6 border-t` |
| Scroll reset | No change -- existing logic already handles it |

### Review

1. **Risks:** Footer is no longer pinned -- it scrolls away. This is the explicitly requested behavior. Users must scroll to reach action buttons. For short content that fits the viewport, the footer will still be visible.
2. **Fixes:** Header visible on open; natural document flow; consistent 24px side gutters; border separators on header and footer; no negative-margin hacks.
3. **Database Change:** No.
4. **Verdict:** Go.
