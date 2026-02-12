

## Layout Audit Report: Separating Layout Spacing from Component Styling

### Scope

All page-level files (`pages/*.tsx`, `components/Header.tsx`, `components/TrainingCard.tsx`, `components/layout/DashboardLayout.tsx`, `components/dashboard/*.tsx`) audited for violations of the "No Internal Override" rule.

---

### Violation Summary

| # | File | Line | Violation | Severity |
|---|------|------|-----------|----------|
| 1 | `Header.tsx` | 49 | `<Button>` with `className="text-primary-foreground hover:text-primary-foreground p-0"` -- overrides internal padding AND color variant | HIGH |
| 2 | `Header.tsx` | 26 | `py-[5px]` arbitrary value on logo `<img>` | MEDIUM |
| 3 | `Auth.tsx` | 154 | `<Button className="border-primary/30 text-primary hover:bg-primary/10">` -- overrides outline variant colors | HIGH |
| 4 | `Auth.tsx` | 158 | `<Button className="border-success/30 text-success hover:bg-success/10">` -- same pattern | HIGH |
| 5 | `Auth.tsx` | 162 | `<Button className="border-destructive/30 text-destructive hover:bg-destructive/10">` -- same pattern | HIGH |
| 6 | `Auth.tsx` | 174 | `<Button className="w-full bg-card text-foreground border border-border hover:bg-muted">` -- completely overrides variant styling | HIGH |
| 7 | `Auth.tsx` | 147 | Dev testing section uses raw `bg-attention/10 border border-attention/20 rounded-lg` on a `<div>` -- should be a `<Banner>` component | MEDIUM |
| 8 | `Landing.tsx` | 35 | `<Button className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm">` -- fully overrides variant | HIGH |
| 9 | `VideoPage.tsx` | 272 | `<Badge className="bg-success hover:bg-success/90">` -- overrides variant styling; should use `variant="success"` | HIGH |
| 10 | `VideoPage.tsx` | 290 | `<Button className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-primary...">` on TrainingCard play overlay -- overrides size and variant | HIGH |
| 11 | `TrainingCard.tsx` | 290 | Same play button override (duplicated from VideoPage pattern) | HIGH |
| 12 | `EmployeeManagement.tsx` | 624-625 | `<TableHead className="px-4 py-3 ...">` -- overrides table cell padding | LOW |
| 13 | `EmployeeManagement.tsx` | 630, 638, 641 | `<TableCell className="py-3 ...">` -- overrides table cell padding | LOW |
| 14 | `AuthCallback.tsx` | 234 | `<Button className="bg-card text-foreground hover:bg-muted">` -- overrides variant styling | MEDIUM |

---

### Clean Files (No Violations)

- `AdminDashboard.tsx` -- CLEAN
- `EmployeeDashboard.tsx` -- CLEAN (typography uses `text-h2`, `text-h3`, `text-small` correctly; headings use raw `<h1>`, `<h2>`, `<h3>` tags)
- `NotFound.tsx` -- CLEAN
- `Index.tsx` -- CLEAN
- `DashboardLayout.tsx` -- CLEAN

---

### Remediation Plan

#### Phase 1: Create Missing Semantic Variants in `src/index.css`

Several violations exist because the design system lacks the needed variant. We need to add:

```css
/* Google/Social sign-in button -- neutral white style */
.button-social {
  @apply bg-card text-foreground border border-border hover:bg-muted shadow-sm;
}

/* Play overlay button -- large circular white */
.button-play-overlay {
  @apply rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary
    shadow-lg hover:shadow-xl;
}

/* Test/dev quick-login color tints (outline variants with color hints) */
.button-outline-primary {
  @apply border-primary/30 text-primary hover:bg-primary/10;
}
.button-outline-success {
  @apply border-success/30 text-success hover:bg-success/10;
}
.button-outline-destructive {
  @apply border-destructive/30 text-destructive hover:bg-destructive/10;
}

/* Header logout -- link variant with inverted colors, no padding */
.button-header-link {
  @apply shadow-none hover:shadow-none text-primary-foreground hover:text-primary-foreground
    underline-offset-4 hover:underline active:scale-100 p-0;
}

/* Button size: play overlay (large circle) */
.button-size-play {
  @apply w-16 h-16;
}
```

#### Phase 2: Fix Page-Level Files

**`Header.tsx` (line 49):**
- Before: `<Button variant="link" size="sm" onClick={onLogout} className="text-primary-foreground hover:text-primary-foreground p-0">`
- After: `<Button variant="link" size="sm" onClick={onLogout} className="button-header-link">`
- Also fix line 26: replace `py-[5px]` with `py-1` (standard 4px, close enough to 5px without arbitrary values)

**`Auth.tsx` (lines 154-162):**
- Before: `<Button ... className="border-primary/30 text-primary hover:bg-primary/10">`
- After: `<Button ... className="button-outline-primary">`
- Same for success and destructive variants
- Line 174 Google button: replace raw utilities with `className="w-full button-social"`
- Line 147 dev section `<div>`: replace raw `bg-attention/10 border border-attention/20 rounded-lg` with `<Banner variant="attention" size="compact">` or a semantic class

**`Landing.tsx` (line 35):**
- Before: `<Button ... className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm">`
- After: `<Button ... className="w-full button-social">`

**`VideoPage.tsx` (line 272):**
- Before: `<Badge className="bg-success hover:bg-success/90">`
- After: `<Badge variant="success">`

**`TrainingCard.tsx` (line 290):**
- Before: `<Button size="lg" className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">`
- After: `<Button size="icon" className="button-play-overlay button-size-play">`

**`AuthCallback.tsx` (line 234):**
- Before: `<Button ... className="bg-card text-foreground hover:bg-muted">`
- After: `<Button ... className="button-social">`

**`EmployeeManagement.tsx` (lines 624-625, 630, 638, 641):**
- The `px-4 py-3` on `<TableHead>` and `py-3` on `<TableCell>` are table layout overrides. These should be absorbed into `.table-head` and `.table-cell` base classes in `index.css`, or left as-is since table components are layout-only (no CVA). Verdict: LOW priority, leave as layout utilities on structural elements.

#### Phase 3: Verify Typography Compliance

All page files confirmed compliant:
- `EmployeeDashboard.tsx`: `text-h2` (line 544), `text-h3` (line 567, 624), raw `<h3>` (line 590) -- all correct
- `Header.tsx`: `text-h3` on `<h1>` (line 30) -- correct semantic class
- `Landing.tsx`: `text-h4` (line 20) -- correct
- `VideoPage.tsx`: `text-h2` (line 270), `text-h4` (line 332), `text-small` throughout -- correct
- Zero instances of `text-xl`, `text-lg`, `text-sm`, `text-xs`, `text-base` found in page files

#### Phase 4: Arbitrary Spacing Cleanup

- `Header.tsx` line 26: `py-[5px]` on logo image -- change to `py-1` (4px standard step)
- No other arbitrary spacing values found in page-level files

---

### Files Changed Summary

| File | Change |
|---|---|
| `src/index.css` | Add 7 new semantic variant classes (button-social, button-play-overlay, button-outline-primary/success/destructive, button-header-link, button-size-play) |
| `src/components/Header.tsx` | Replace `p-0` + color overrides on logout Button with `button-header-link`; fix `py-[5px]` to `py-1` |
| `src/pages/Auth.tsx` | Replace 4 Button className overrides with semantic classes; convert dev section div to Banner or semantic class |
| `src/pages/Landing.tsx` | Replace Button className override with `button-social` |
| `src/pages/VideoPage.tsx` | Replace Badge className with `variant="success"`; remove raw color utilities |
| `src/components/TrainingCard.tsx` | Replace play overlay Button overrides with `button-play-overlay button-size-play` |
| `src/pages/AuthCallback.tsx` | Replace Button className override with `button-social` |

**Total: 7 files**

---

### Review

1. **Top 3 Risks:** (1) The `button-social` class introduces a new variant not in the CVA map -- consumers must use `className` instead of `variant`. This is acceptable because it is a one-off styling need, not a reusable variant. (2) Changing `py-[5px]` to `py-1` (4px) on the logo shifts it by 1px -- visually negligible. (3) Converting the dev testing section in Auth.tsx from raw utilities to a Banner component changes its DOM structure slightly.
2. **Top 3 Fixes:** (1) Eliminates all raw `bg-`, `border-`, and `p-` overrides on Button, Badge, and Card components across all pages. (2) Ensures that changing `.button-base` or `.badge-base` padding in CSS propagates everywhere without page-level fights. (3) Removes the only arbitrary spacing value in page files.
3. **Database Change:** No
4. **Verdict:** Go -- this completes the layout/component separation mandate.

