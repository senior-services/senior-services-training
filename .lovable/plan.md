

## Update: Badge Typography from `text-small` (13px) to `text-body` (16px)

### Problem
All badge text currently renders at 13px (`text-small`), which falls below the 16px senior-first legibility minimum established for primary UI elements. This applies to both the `.badge-base` master template and the `.status-badge` utility class.

### Fix

**File: `src/index.css`**

Two changes in the single source of truth:

**1. `.badge-base` (line 259, 261-262):**
- Change `text-small` to `text-body`
- Remove the manual `font-size: 0.8rem` and `line-height: 1.5` overrides (these were locking in 13px; `text-body` provides 16px with its own line-height)

```css
/* Before */
.badge-base {
  @apply ... text-small font-semibold ...;
  font-size: 0.8rem;
  line-height: 1.5;
}

/* After */
.badge-base {
  @apply ... text-body font-semibold ...;
}
```

**2. `.status-badge` (line 488):**
- Change `text-small` to `text-body`

```css
/* Before */
.status-badge {
  @apply px-3 py-2 rounded-md text-small font-semibold;
  ...
}

/* After */
.status-badge {
  @apply px-3 py-2 rounded-md text-body font-semibold;
  ...
}
```

### Scope

No component files need editing. Both `.badge-base` and `.status-badge` are CSS-only master templates -- every `Badge` primitive and status indicator across the app (employee dashboard, admin tabs, Components Gallery, training cards) inherits the update automatically.

### Review

1. **Top 3 Risks:** (a) Badges will be slightly wider at 16px -- acceptable given the existing `whitespace-nowrap` and flexible layouts. (b) Training card badge rows may wrap on very narrow viewports -- the grid already caps at 4 columns with adequate spacing. (c) No downstream `text-small` overrides found on Badge components.
2. **Top 3 Fixes:** (a) All badges meet 16px senior legibility minimum. (b) Consistent with Label, TableCell, and description typography standards. (c) Two-line CSS change, zero component edits.
3. **Database Change:** No.
4. **Verdict:** Go.
