

## Fix Table Header Text Size: `text-small` Standardization

### Problem
The `TableHead` component (line 83 of `table.tsx`) already applies `text-small font-medium uppercase text-muted-foreground` at the base level. However, the Style Guide demos incorrectly use `text-caption` (10px) instead, and several app files redundantly re-declare these same utilities.

### Changes

#### 1. Style Guide (`src/pages/ComponentsGallery.tsx`)

**Basic Table** (lines 1358-1361): Strip all redundant classes. `TableHead` already provides `text-small font-medium uppercase text-muted-foreground`.

| Line | Before | After |
|------|--------|-------|
| 1358 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1359 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1360 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1361 | `<TableHead className="text-right text-caption font-medium uppercase text-muted-foreground">` | `<TableHead className="text-right">` |

**Sortable Table** (line 1432): Same fix.

| Line | Before | After |
|------|--------|-------|
| 1432 | `<TableHead className="text-right text-caption font-medium uppercase text-muted-foreground">` | `<TableHead className="text-right">` |

**Filtered Table** (lines 1491-1495): Same fix.

| Line | Before | After |
|------|--------|-------|
| 1491 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1492 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1493 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1494 | `<TableHead className="text-caption font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 1495 | `<TableHead className="text-right text-caption font-medium uppercase text-muted-foreground">` | `<TableHead className="text-right">` |

**Typography Reference Table** (lines 626-629): These use `font-semibold text-foreground` which are intentional overrides for a reference/documentation table (bolder headers, non-muted color). **KEEP as-is** -- this is a design choice for the scale reference, not a data table.

#### 2. App Files -- Strip Redundant Overrides

**`VideoTable.tsx`** (lines 155, 165): Remove redundant utilities already in `TableHead` base.

| Line | Before | After |
|------|--------|-------|
| 155 | `<TableHead className="text-left text-small font-medium uppercase text-muted-foreground whitespace-nowrap">` | `<TableHead className="whitespace-nowrap">` |
| 165 | `<TableHead className="text-right text-small font-medium uppercase text-muted-foreground whitespace-nowrap">` | `<TableHead className="text-right whitespace-nowrap">` |

**`AdminManagement.tsx`** (lines 238, 247): Same cleanup.

| Line | Before | After |
|------|--------|-------|
| 238 | `<TableHead className="text-small font-medium uppercase text-muted-foreground">` | `<TableHead>` |
| 247 | `<TableHead className="text-right text-small font-medium uppercase text-muted-foreground">` | `<TableHead className="text-right">` |

**No changes needed** for `EmployeeManagement.tsx` (already uses `table-head-cell` or bare `TableHead`), `VideoManagement.tsx` (bare `TableHead`), or `AssignVideosModal.tsx` (bare `TableHead` with only layout classes like `whitespace-nowrap`).

### Summary

| File | Lines Changed | What |
|------|--------------|------|
| `ComponentsGallery.tsx` | 10 lines | `text-caption` to inherited `text-small`; strip redundant utilities |
| `VideoTable.tsx` | 2 lines | Strip redundant utilities |
| `AdminManagement.tsx` | 2 lines | Strip redundant utilities |

### Review

1. **Top 3 Risks:** (1) Style Guide table headers will visually increase from 10px (`text-caption`) to 13px (`text-small`) -- this is the correct size per the design system standard. (2) Zero risk on app file changes since we're only removing redundant classes. (3) Typography reference table keeps its intentional `font-semibold text-foreground` overrides.
2. **Top 3 Fixes:** (1) Style Guide now correctly demonstrates the `TableHead` component as-designed. (2) App tables shed ~14 redundant utility declarations. (3) Single source of truth: all header styling flows from `table.tsx` line 83.
3. **Database Change:** No
4. **Verdict:** Go -- pure cleanup, zero visual regressions in app tables; Style Guide corrected to match the actual component.
