

## Remove Hover Background Color from Employee Rows

### Overview
Remove the hover state that changes the background color when hovering over employee rows in the Employees tab.

---

### Change Required

**File: `src/components/dashboard/EmployeeManagement.tsx`**

**Line 429** - Remove `hover:bg-slate-100` from the TableRow className:

**Current:**
```tsx
<TableRow key={employee.id} className="group transition-colors hover:bg-slate-100">
```

**Updated:**
```tsx
<TableRow key={employee.id}>
```

---

### Notes
- Removes `hover:bg-slate-100` (the hover background color)
- Removes `transition-colors` (no longer needed without hover effect)
- Removes `group` class (was used for group hover effects, no longer needed)
- Result: Clean, static rows with no visual change on hover

