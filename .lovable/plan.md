

## Should Internal Variable Names Be Updated Too?

### Short Answer: Yes, but the scope is small and low-risk.

There is only **one file** with internal code references to "course" — `AssignVideosModal.tsx`. Updating these keeps the codebase consistent and avoids confusion when a developer sees `'course'` in code but "Training" in the UI.

### What Needs Updating

**`src/components/dashboard/AssignVideosModal.tsx`** — 6 internal references:

| Line | Current | Updated | Type |
|------|---------|---------|------|
| 105 | `useState<'course' \| 'status' \| null>('course')` | `useState<'training' \| 'status' \| null>('training')` | State type + default |
| 456 | `setSortColumn('course')` | `setSortColumn('training')` | Reset value |
| 525 | `handleSort = useCallback((column: 'course' \| 'status')` | `handleSort = useCallback((column: 'training' \| 'status')` | Function parameter type |
| 551 | `if (sortColumn === 'course')` | `if (sortColumn === 'training')` | Comparison |
| 743 | `column="course"` | `column="training"` | JSX prop (passed to SortableTableHead) |

The `SortableTableHead` component accepts `column` as a generic `string`, so changing `"course"` to `"training"` requires no changes to the shared component.

### What This Plan Adds to the Previous Terminology Plan

This would be folded into the existing "Course to Training" terminology plan as an additional section. The combined plan would cover:

1. All **20 user-facing text updates** across 8 files (already approved)
2. These **6 internal code updates** in 1 file (this addition)

No new files, no new logic, no database changes.

### Review

- **Top 5 Risks**: (1) The type change from `'course'` to `'training'` is fully contained within one file -- no external consumers. (2) `SortableTableHead` uses `string` typing, so the prop change is safe. (3) Sort behavior is unchanged -- only the identifier string changes. (4) No database impact. (5) No security impact.
- **Top 5 Fixes**: (1) Update the type union. (2) Update the default state value. (3) Update the reset value. (4) Update the comparison check. (5) Update the JSX column prop.
- **Database Change Required**: No
- **Go/No-Go**: Go -- minimal effort, improves consistency, zero risk.
