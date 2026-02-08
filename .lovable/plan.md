

## Left-Align Quiz Column Checkmarks

### Summary

Change the Quiz column from center-aligned to left-aligned so all checkmarks line up vertically, regardless of whether a version badge is present.

### What Changes

**File: `src/components/dashboard/VideoTable.tsx`**

1. **Table header** (Quiz column): Change from `text-center` to `text-left`
2. **Table cell** (Quiz column): Change from `text-center` to `text-left`, and update the inner flex container from `justify-center` to `justify-start`

### Risk Assessment

- **Top 5 Risks/Issues:** None significant -- purely a CSS alignment change
- **Top 5 Fixes/Improvements:** Two class name swaps, no logic changes
- **Database Change Required:** No
- **Go/No-Go Verdict:** Go -- minimal CSS-only change

