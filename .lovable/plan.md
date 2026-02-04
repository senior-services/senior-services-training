

## Change "Pending" to "To-do" in Employees Table

### Summary

Update all instances of "Pending" status text to "To-do" in the employee management table and the downloaded Excel export file.

---

### Changes Required

**File:** `src/components/dashboard/EmployeeManagement.tsx`

| Location | Current | Updated |
|----------|---------|---------|
| Line 281 (status badge) | `{pendingCount} Pending` | `{pendingCount} To-do` |
| Line 307 (export default status) | `let status = 'Pending'` | `let status = 'To-do'` |
| Line 329 (export - has due date, not past) | `status = 'Pending'` | `status = 'To-do'` |
| Line 332 (export - no due date) | `status = 'Pending'` | `status = 'To-do'` |

---

### What Users Will See

**In the employees table:**
- Status badges will show "3 To-do" instead of "3 Pending"

**In the downloaded Excel file:**
- The Status column will show "To-do" instead of "Pending" for incomplete items that are not overdue

---

### Files Modified

- `src/components/dashboard/EmployeeManagement.tsx` (4 text changes)

