

## Create Reusable SortableTableHead Component

### Summary

This plan extracts the duplicated sortable table header button pattern into a single reusable component. Currently, the same code block is repeated across four files (VideoTable, EmployeeManagement, AdminManagement, and ComponentsGallery). By creating one shared component, we eliminate repetition and ensure consistent behavior everywhere.

---

### What Will Be Created

**New file: `src/components/ui/sortable-table-head.tsx`**

A reusable component that handles:
- Displaying the column label
- Showing the correct sort arrow (up, down, or neutral)
- Toggling sort direction when clicked
- Screen reader accessibility

---

### Files That Will Be Updated

| File | What Changes |
|------|--------------|
| `EmployeeManagement.tsx` | Update `handleSort` to accept a column parameter (currently hardcoded to 'name' only), then replace inline button with new component |
| `VideoTable.tsx` | Replace 2 inline button patterns with new component |
| `AdminManagement.tsx` | Replace 2 inline button patterns with new component |
| `ComponentsGallery.tsx` | Replace 3 inline button patterns in the example table |

---

### Key Fix: EmployeeManagement Callback

The `handleSort` function in EmployeeManagement currently doesn't accept any parameters—it only toggles the "name" column. This will be updated to accept a column parameter for compatibility with the new component (even though only the Name column is sortable in that table per design requirements).

**Current (line 224-231):**
```tsx
const handleSort = useCallback(() => {
  if (sortColumn === 'name') {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn('name');
    setSortDirection('asc');
  }
}, [sortColumn, sortDirection]);
```

**Updated:**
```tsx
const handleSort = useCallback((column: 'name') => {
  if (sortColumn === column) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn(column);
    setSortDirection('asc');
  }
}, [sortColumn, sortDirection]);
```

---

### Component Usage Example

**Before (repeated in every table):**
```tsx
<TableHead>
  <Button variant="ghost" onClick={() => handleSort('name')} 
    className={`text-xs uppercase ... ${sortColumn === 'name' ? 'font-bold' : 'font-medium'}`}>
    Name
    {sortColumn === 'name' ? sortDirection === 'asc' 
      ? <ArrowUp /> : <ArrowDown /> 
      : <ArrowUpDown className="opacity-50" />}
  </Button>
</TableHead>
```

**After (single line):**
```tsx
<SortableTableHead
  column="name"
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={handleSort}
>
  Name
</SortableTableHead>
```

---

### Accessibility Features

The component includes built-in accessibility that will now be consistent across all tables:
- `aria-sort` attribute on the table header (announces "ascending" or "descending")
- Descriptive `aria-label` explaining what clicking will do
- Full keyboard navigation support (inherited from Button component)

---

### Technical Details

**Component Props:**

| Prop | Type | Description |
|------|------|-------------|
| `column` | `string` | Identifier for this column |
| `sortColumn` | `string \| null` | Which column is currently sorted (from parent state) |
| `sortDirection` | `"asc" \| "desc"` | Current sort direction (from parent state) |
| `onSort` | `(column: string) => void` | Function called when header is clicked |
| `children` | `ReactNode` | The label text to display |

**Styling Details:**
- Uses ghost button variant (no background)
- Uppercase, smaller text (`text-xs`)
- Muted color by default, primary color on hover
- Bold font when column is actively sorted
- Icons: ArrowUp (ascending), ArrowDown (descending), ArrowUpDown (neutral with reduced opacity)

---

### Summary of Changes

| Step | File | Change Type |
|------|------|-------------|
| 1 | `src/components/ui/sortable-table-head.tsx` | Create new component |
| 2 | `src/components/dashboard/EmployeeManagement.tsx` | Update handleSort + replace 1 pattern |
| 3 | `src/components/dashboard/VideoTable.tsx` | Replace 2 patterns |
| 4 | `src/components/dashboard/AdminManagement.tsx` | Replace 2 patterns |
| 5 | `src/pages/ComponentsGallery.tsx` | Replace 3 patterns in example |

