

## Update Export Date Format to `formatLong`

### Change

In `src/components/dashboard/PeopleManagement.tsx`, replace two `formatShort` calls with `formatLong` in the export data builder:

- **Line 37**: Update import from `formatShort` to `formatLong`
- **Line 472**: `formatShort(assignment.due_date)` → `formatLong(assignment.due_date)`
- **Line 478**: `formatShort(completionDateStr)` → `formatLong(completionDateStr)`

Result: Due Date and Completion Date columns in the Excel export will display as "February 16, 2026" instead of "Feb 16, '26".

### Files Changed

| File | Change |
|------|--------|
| `src/components/dashboard/PeopleManagement.tsx` | Import + 2 `formatShort` → `formatLong` swaps |

