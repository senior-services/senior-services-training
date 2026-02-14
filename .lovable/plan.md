

## Fix: People Not Visible Due to Null Assignment Crash

### Problem
The People tab shows "No people found" because `employeeOperations.getAll()` crashes with `TypeError: Cannot read properties of null (reading 'progress_percent')`. This prevents any data from loading.

### Root Cause
The `get_all_employee_assignments()` database function uses `LEFT JOIN LATERAL` + `json_agg`. When a person has zero assignments (like the admin user), the lateral join produces a single null row, and `json_agg` aggregates it as `[null]` instead of `[]`.

In `src/services/api.ts` line 424, the code does:
```
assignments.filter((a: any) => a.progress_percent === 100)
```
When `a` is `null`, accessing `.progress_percent` throws a TypeError, which aborts the entire `getAll()` call.

### Changes

**1. `src/services/api.ts` (line 423)**

Filter out null entries from the assignments array before processing:

```typescript
const assignments = Array.isArray(emp.assignments) 
  ? emp.assignments.filter((a: any) => a != null) 
  : [];
```

This single-line change fixes the crash. The same null-filtering should also be applied in the `getHidden()` method if it has the same pattern.

### Result
- All four people (admin, John, Jane, Billy) will appear in the People tab.
- Admin users with no assignments will show correctly with an empty assignment list.

### Review
1. **Top 3 Risks:** (a) None -- defensive null filtering. (b) No database change. (c) No behavior change for non-null data.
2. **Top 3 Fixes:** (a) People tab loads correctly. (b) Handles edge case of users with zero assignments. (c) Minimal change.
3. **Database Change:** No.
4. **Verdict:** Go -- one-line defensive fix.
