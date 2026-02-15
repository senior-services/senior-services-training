

## Fix Attestation Checkbox Vertical Alignment

### Changes in `src/components/shared/TrainingAttestation.tsx`

**1. Fix parent flex alignment (line 68)**

Change `items-start` to `items-center` on the parent `div`. This is the root cause -- `items-start` forces the checkbox to the top of the row, ignoring the span's internal centering.

**2. Clean up span wrapper (line 72)**

Update the span class to `"flex items-center justify-center"` for explicit centering in both axes.

**3. Verify tooltip and label**

- `TooltipContent` already has `align="center"` -- no change needed.
- Label's `ml-3` spacing remains intact and will now share the same horizontal center axis as the checkbox.

### Summary

Two class changes on lines 68 and 72. Single file, no logic changes.

### Review
1. **Top 3 Risks**: None -- purely visual.
2. **Top 3 Fixes**: (a) Parent flex centers both children. (b) Span wrapper explicitly centers checkbox. (c) Tooltip arrow already centered.
3. **Database Change**: No.
4. **Verdict**: Go.

