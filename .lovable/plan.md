

## Update Hollow Badge Backgrounds to Transparent

### Change

In `src/index.css`, replace `bg-background` with `bg-transparent` on all 7 hollow badge variants (lines 274–292).

| Line | Class | Before | After |
|------|-------|--------|-------|
| 274 | `.badge-hollow-primary` | `bg-background` | `bg-transparent` |
| 277 | `.badge-hollow-secondary` | `bg-background` | `bg-transparent` |
| 280 | `.badge-hollow-tertiary` | `bg-background` | `bg-transparent` |
| 283 | `.badge-hollow-destructive` | `bg-background` | `bg-transparent` |
| 286 | `.badge-hollow-success` | `bg-background` | `bg-transparent` |
| 289 | `.badge-hollow-warning` | `bg-background` | `bg-transparent` |
| 292 | `.badge-hollow-attention` | `bg-background` | `bg-transparent` |

### Files Changed

| File | Change |
|------|--------|
| `src/index.css` | `bg-background` → `bg-transparent` on all hollow variants |

No component file or database changes needed — all instances inherit from these CSS classes automatically.

