

## Add `text-body` to TableCell for Senior Legibility

### Problem
`TableCell` currently has no explicit font-size class, so it inherits whatever size its parent context provides -- which can inconsistently fall to 13px in some layouts. Senior users need a guaranteed 16px minimum for row data.

### Change (1 file)

**`src/components/ui/table.tsx`** -- TableCell className (line 87)

| Before | After |
|--------|-------|
| `"px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0"` | `"px-4 py-2 align-middle text-body [&:has([role=checkbox])]:pr-0"` |

Adding `text-body` locks cell content to 16px / 1rem with the `line-height: 1.6` already defined in the base layer's `.text-body` class.

### Review
1. **Risks:** None -- `text-body` is the default body size, so this only makes the inheritance explicit. Header cells remain at `text-small` (13px) via their own class.
2. **Fixes:** All table row data now renders at a guaranteed 16px for senior-friendly legibility.
3. **Database Change:** No.
4. **Verdict:** Go -- one-word addition.

