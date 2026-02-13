

## Composite Typography Token Refactor -- UI Primitives First

### Priority 1: Foundation Files

#### A. `tailwind.config.ts` -- Replace fontSize map with composite tokens

Remove old aliases (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`) and replace with semantic names carrying weight, leading, and tracking:

```ts
fontSize: {
  'h1':      ['1.802rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
  'h2':      ['1.602rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
  'h3':      ['1.424rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0' }],
  'h4':      ['1.266rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0' }],
  'body-lg': ['1.125rem', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }],
  'body':    ['1rem',     { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }],
  'body-sm': ['0.889rem', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }],
  'caption': ['0.79rem',  { lineHeight: '1.4', fontWeight: '400', letterSpacing: '0' }],
  'code':    ['0.9375rem',{ lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }],
},
```

#### B. `src/index.css` -- Base tag reset and semantic class cleanup

**Base tags** (lines 166-208): Replace hardcoded `font-size`/`font-weight`/`line-height` with `@apply` tokens. Remove the shared heading `line-height: 1.3` block (lines 174-181).

```css
body { @apply bg-background-main text-foreground font-sans antialiased text-body; }

h1 { @apply text-h1; }
h2 { @apply text-h2; }
h3 { @apply text-h3; }
h4 { @apply text-h4; }
h5 { @apply text-body-lg; font-weight: 600; }
h6 { @apply text-body-lg; font-weight: 600; }
```

**Semantic utility classes** (lines 512-555): Remove manual `font-size`/`line-height`/`font-weight` declarations from `.text-h1` through `.text-caption` -- the Tailwind composite tokens now generate these automatically. Keep `.text-code` only for its `font-family` rule.

**Other hardcoded values updated:**
- `.tooltip-content` (line 543): replace with `@apply text-body-sm`
- `.form-helper-text` (line 559): replace `font-size` with `@apply text-body-sm`
- `.form-additional-text` (line 565): replace `font-size` with `@apply text-body-sm`
- `.button-base` (line 232): replace `font-size: 1rem` with `@apply text-body` (size only -- weight stays `font-medium` from existing `@apply`)
- `.button-toggle` (line 244): rename `text-small` to `text-body-sm`
- Input base rule `font-size: 1rem` (line 215): replace with `@apply text-body`
- `.badge-base` (line 259): rename `text-body` stays (already correct)

---

### Priority 2: `src/components/ui` File Updates

Rename `text-small` to `text-body-sm` in all UI primitives. These are mechanical find-and-replace changes:

| File | Line(s) | Change |
|------|---------|--------|
| `alert-dialog.tsx` | 106 | `text-small` to `text-body-sm` |
| `calendar.tsx` | 24, 35, 37 | `text-small` to `text-body-sm` |
| `drawer.tsx` | 99 | `text-small` to `text-body-sm` |
| `error-boundary.tsx` | 124, 184, 226, 229, 306 | `text-small` to `text-body-sm` |
| `ErrorBoundary.tsx` | 133, 134, 140 | `text-small` to `text-body-sm` |
| `form.tsx` | 136, 158 | `text-small` to `text-body-sm` |
| `loading-spinner.tsx` | 81 | `text-small` to `text-body-sm` |
| `sheet.tsx` | 119 | `text-small` to `text-body-sm` |
| `sidebar.tsx` | 437, 520, 723 | `text-small` to `text-body-sm` |
| `table.tsx` | 83, 109 | `text-small` to `text-body-sm` |
| `toast.tsx` | 107 | `text-small` to `text-body-sm` |

**Surgical override cleanup in UI files:**
- `drawer.tsx` line 85: `font-semibold leading-none tracking-tight` -- **PRESERVE** (intentional title override)
- `toast.tsx` line 63: `font-medium` -- **PRESERVE** (action button emphasis)
- `toast.tsx` line 95: `font-semibold` -- **PRESERVE** (title weight override)
- `label.tsx` line 8: `font-medium leading-none` -- **PRESERVE** (form alignment override)
- `banner.tsx` line 89: `font-medium leading-none` -- **PRESERVE** (banner title override)
- `table.tsx` line 83: `font-medium` on TableHead -- **PRESERVE** (table emphasis)
- `form.tsx` line 158: `font-medium` on error message -- **PRESERVE** (error emphasis)

---

### Priority 3: Remaining Project Files

Rename `text-small` to `text-body-sm` in non-UI files (~20 additional files across `src/pages/`, `src/components/dashboard/`, `src/components/content/`, etc.). Same mechanical rename.

---

### Priority 4: `STYLEGUIDE.md`

- Replace scale table with composite token table (size + weight + leading + tracking)
- Add **Override Clause**: "The 80/20 Rule: 80% of the app should use naked tokens (e.g., `text-body`). 20% (Forms, Tables, Banners) may use utility overrides (e.g., `text-body font-medium leading-tight`) when specific layout constraints require them."
- Remove references to old `text-xs`, `text-sm`, `text-base` aliases

---

### Review

1. **Top 3 Risks:** (a) Removing old Tailwind aliases (`text-xs`, `text-sm`, etc.) may break shadcn internals -- each UI file has been audited above and none use the old aliases directly. (b) Scale shift: h1 drops from ~32px to ~29px, h4 from ~23px to ~20px. (c) `text-small` rename touches ~30 files total -- high surface area but purely mechanical.
2. **Top 3 Fixes:** (a) Single composite token carries size + weight + leading + tracking. (b) Base HTML tags auto-inherit via `@apply`. (c) Override clause documents when manual values are acceptable.
3. **Database Change:** No.
4. **Verdict:** Go.
