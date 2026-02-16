

## Fix Footer Height Jump Between Content and Quiz States

### Problem
The `DialogFooter` has `py-4` padding that feels cramped when the quiz appears. The three footer states (content, quiz-active, quiz-done) use slightly different inner layout structures, causing a visible height jump during transitions.

### Changes

**File 1: `src/components/ui/dialog.tsx` (line 115)**
Increase vertical padding from `py-4` to `py-6` for a more spacious, consistent footer:

```
// Before
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 bg-background px-6 py-4 border-t border-border-secondary flex-shrink-0 sm:rounded-b-lg"

// After
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 bg-background px-6 py-6 border-t border-border-secondary flex-shrink-0 sm:rounded-b-lg"
```

**File 2: `src/components/VideoPlayerFullscreen.tsx`**

Two changes:

1. **Quiz container padding (line 560)** -- Add `pb-10` so the attestation checkbox doesn't sit flush against the footer border when scrolled to bottom:

```
// Before
<div id="quiz-section" className="mt-8 border-t pt-8">

// After
<div id="quiz-section" className="mt-8 border-t pt-8 pb-10">
```

2. **Sync all three footer inner wrappers to identical layout structure** -- Currently the quiz-done and quiz-active states use `justify-end` while the content state uses `justify-between`. Normalize all three to `justify-between` with a left zone (even if empty) so the container height stays constant:

- **Quiz-done (line 595)**: Change from `justify-end` to `justify-between`, add an empty left `<div>` spacer.
- **Quiz-active (line 606)**: Change from `justify-end` to `justify-between`, add an empty left `<div>` spacer.
- **Content state (line 674)**: Already uses `justify-between` -- no change needed.

### Technical Detail

```
// Quiz-done (lines 594-600) -- Before
<div className="flex w-full items-center justify-end gap-4">
  <DialogClose asChild><Button>Close</Button></DialogClose>
</div>

// Quiz-done -- After
<div className="flex w-full items-center justify-between gap-4">
  <div />
  <DialogClose asChild><Button>Close</Button></DialogClose>
</div>
```

```
// Quiz-active (lines 605-647) -- Before
<div className="flex w-full items-center justify-end gap-4">
  ...cancel + submit buttons...
</div>

// Quiz-active -- After
<div className="flex w-full items-center justify-between gap-4">
  <div />
  <div className="flex gap-4">
    ...cancel + submit buttons...
  </div>
</div>
```

### Review
1. **Top 3 Risks**: (a) `py-6` increases all dialog footers globally -- acceptable since only fullscreen dialog uses this footer currently. (b) Empty `<div />` spacers are semantically harmless. (c) No logic changes.
2. **Top 3 Fixes**: (a) Consistent `py-6` eliminates cramped feel. (b) `pb-10` gives scroll breathing room for attestation. (c) Identical `justify-between` structure across all states prevents height jumps.
3. **Database Change**: No.
4. **Verdict**: Go -- CSS-only changes across 2 files.
