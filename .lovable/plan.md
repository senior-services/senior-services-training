

## Reorder Toggle Filters in Assign Videos Dialog

### Overview
Change the order of the filter toggles in the Assign Videos dialog from "Unassigned, Assigned, Completed, All" to "Assigned, Unassigned, Completed, All".

---

### Change Required

**File: `src/components/dashboard/AssignVideosModal.tsx`**  
**Lines 585-596**

**Current order:**
```tsx
<ToggleGroupItem value="unassigned" className="text-xs px-3 py-1" aria-label="Filter by unassigned videos">
  Unassigned
</ToggleGroupItem>
<ToggleGroupItem value="assigned" className="text-xs px-3 py-1" aria-label="Filter by assigned videos">
  Assigned
</ToggleGroupItem>
<ToggleGroupItem value="completed" className="text-xs px-3 py-1" aria-label="Filter by completed videos">
  Completed
</ToggleGroupItem>
<ToggleGroupItem value="all" className="text-xs px-3 py-1" aria-label="Show all videos">
  All
</ToggleGroupItem>
```

**Updated order:**
```tsx
<ToggleGroupItem value="assigned" className="text-xs px-3 py-1" aria-label="Filter by assigned videos">
  Assigned
</ToggleGroupItem>
<ToggleGroupItem value="unassigned" className="text-xs px-3 py-1" aria-label="Filter by unassigned videos">
  Unassigned
</ToggleGroupItem>
<ToggleGroupItem value="completed" className="text-xs px-3 py-1" aria-label="Filter by completed videos">
  Completed
</ToggleGroupItem>
<ToggleGroupItem value="all" className="text-xs px-3 py-1" aria-label="Show all videos">
  All
</ToggleGroupItem>
```

---

### Result
The filter toggles will display in the order: **Assigned, Unassigned, Completed, All**

