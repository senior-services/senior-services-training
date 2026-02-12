

## Sticky Footer with Scrollable Header+Body Refactor

### What Changes

The `DialogHeader` and body content currently live as separate flex children of `FullscreenDialogContent`. The header uses `flex-shrink-0`, pinning it to the top permanently. This refactor wraps the header and body into one scrollable container so the header scrolls away, while the footer stays pinned.

```text
BEFORE                              AFTER
FullscreenDialogContent             FullscreenDialogContent
  (flex flex-col overflow-hidden)     (flex flex-col overflow-hidden)
  +-- DialogHeader (shrink-0)         +-- div.flex-1.overflow-y-auto.min-h-0
  +-- DialogScrollArea (flex-1)       |     +-- DialogHeader (shrink unset)
  +-- DialogFooter (shrink-0)         |     +-- body content (inline)
                                      +-- DialogFooter (shrink-0, sticky)
```

### File: `src/components/VideoPlayerFullscreen.tsx`

**1. Replace `DialogHeader` + `DialogScrollArea` with a single scrollable wrapper**

- After `FullscreenDialogContent` opens (line 488), insert `<div className="flex-1 overflow-y-auto min-h-0">`.
- Override `DialogHeader` className to `"flex-shrink-[unset] border-b-0"` so it scrolls naturally and loses its fixed bottom border.
- Remove the `<DialogScrollArea>` open tag (line 496) and close tag (line 549) -- body content renders directly inside the new wrapper div.
- Close the new wrapper div (`</div>`) right before the first `DialogFooter` block (before line 551).

**2. Normalize all footer branches to single-child wrapper pattern**

Remove all layout overrides from the `DialogFooter` primitives themselves (no `className` additions).

- **Quiz footer (non-presentation, line 552):** Remove `className="flex-row sm:justify-end items-center"`. Each branch renders one child:
  - Active quiz: `<div className="flex w-full items-center justify-end gap-4 p-4">` containing Cancel + Submit.
  - Completed/review: `<div className="flex w-full items-center justify-end gap-4 p-4">` containing Close button.

- **Presentation footer (line 609):** Already has no className on `DialogFooter`. Update inner wrappers:
  - Quiz-started branch (line 611): change to `className="flex w-full items-center justify-end gap-4 p-4"`.
  - Pre-quiz/timer branch (line 657): change to `className="flex w-full items-center justify-between gap-4 p-4"`.

**3. No changes to `dialog.tsx`**

The `DialogFooter` base component already has `flex-shrink-0` and `border-t`, which is correct for sticky behavior. No primitive modifications needed.

### Technical Detail: Data Attributes

The new wrapper div is not a recognized data-attribute child (`data-dialog-header`, `data-dialog-footer`, `data-dialog-scroll-area`), so it will receive the catch-all padding from `FullscreenDialogContent`'s child selector (`px-6 py-6`). To avoid this, the wrapper div should carry `data-dialog-scroll-area` to inherit the scroll-area padding rules (`px-6 py-6 bg-muted/50`), matching the current visual appearance.

### Review

1. **Risks:** Header is no longer visible when scrolled -- this is the intended behavior. No logic changes, layout-only.
2. **Fixes:** Footer permanently pinned; no height jump between states; header scrolls with content; all footer branches follow identical structural contract.
3. **Database Change:** No.
4. **Verdict:** Go.

