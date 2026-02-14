

## Downsize Header Title from `text-h4` to `text-body`

### Change

**`src/components/Header.tsx` (line 50)**

Replace `text-h4` with `text-body` on the `h1` element:

```tsx
// Before
<h1 className={`text-h4 ${headerTextColor}`}>

// After
<h1 className={`text-body ${headerTextColor}`}>
```

This is a single-line change. The `font-bold` on the "Training Portal" span and `font-normal` on the "/ Admin Dashboard" suffix remain unchanged -- these are acceptable 20% overrides per the typography rule since they differentiate the two title segments.

### Review
1. **Top 3 Risks:** (a) `h1` tag at `text-body` (16px) is smaller than typical heading size -- acceptable here as the logo provides primary visual hierarchy. (b) None other. (c) None other.
2. **Top 3 Fixes:** (a) Better proportional fit within the ~60px header. (b) Aligns with senior legibility standard (16px minimum met). (c) Reduces visual weight so logo remains dominant.
3. **Database Change:** No.
4. **Verdict:** Go -- one-line class swap.

