

## Add Sorting to Assign Videos Dialog Table

### Summary

Add sorting functionality to the "Course" and "Status" columns in the Assign Videos dialog using the new `SortableTableHead` component. Users will be able to click column headers to sort the table ascending or descending.

---

### Current State

The table in the Assign Videos dialog currently:
- Displays courses with static column headers (Course, Status, Date, Quiz Results)
- Uses alphabetical sorting by title within each filter mode (assigned, unassigned, completed, all)
- Has no interactive sorting controls

---

### What Will Change

**File: `src/components/dashboard/AssignVideosModal.tsx`**

| Change | Description |
|--------|-------------|
| Add state variables | Track which column is sorted and in which direction |
| Add sort handler | Function to toggle sort column and direction |
| Update table headers | Replace static headers with sortable headers for Course and Status |
| Update filtering logic | Apply sorting based on user selection instead of always alphabetical |

---

### Sorting Behavior

**Course Column:**
- Sorts alphabetically by video title (A-Z or Z-A)

**Status Column:**
- Sorts by status priority order:
  - Overdue (most urgent first)
  - Pending
  - Unassigned  
  - Completed (least urgent)
- Descending reverses this order

---

### Implementation Details

**1. New State Variables (add near line 86):**
```tsx
const [sortColumn, setSortColumn] = useState<'course' | 'status' | null>('course');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
```

**2. Sort Handler Function (add near line 460):**
```tsx
const handleSort = (column: 'course' | 'status') => {
  if (sortColumn === column) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn(column);
    setSortDirection('asc');
  }
};
```

**3. Update getFilteredVideos Function (lines 502-523):**

Replace the current alphabetical `.sort()` with dynamic sorting based on `sortColumn` and `sortDirection`:
- For "course": compare titles alphabetically
- For "status": compare using priority values (overdue=0, pending=1, unassigned=2, completed=3)

**4. Update Table Headers (lines 678-683):**

Replace static `<TableHead>` elements with `<SortableTableHead>` for Course and Status columns.

**Before:**
```tsx
<TableHead>Course</TableHead>
<TableHead>Status</TableHead>
```

**After:**
```tsx
<SortableTableHead
  column="course"
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={handleSort}
>
  Course
</SortableTableHead>
<SortableTableHead
  column="status"
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={handleSort}
>
  Status
</SortableTableHead>
```

---

### User Experience

- Clicking a column header sorts by that column in ascending order
- Clicking the same header again reverses the direction
- Sort arrows indicate current sort state:
  - ↑ = ascending (A-Z for Course, Overdue first for Status)
  - ↓ = descending (Z-A for Course, Completed first for Status)
  - ↕ = not currently sorted by this column
- Sorting persists while the dialog is open
- Default: Course ascending (matches current behavior)

---

### Files Modified

| File | Changes |
|------|---------|
| `src/components/dashboard/AssignVideosModal.tsx` | Add sort state, handler, update filtering logic, replace 2 table headers with SortableTableHead |

