

## Add Secondary Sort & Reset Sort State on Dialog Close

### Summary

This plan adds two improvements to the sorting implementation:

1. **Secondary sort by title** - When sorting by Status, videos with the same status will be alphabetically sorted by title for consistent ordering
2. **Reset sort state on close** - When the Assign Videos dialog is closed, sorting resets to the default (Course ascending)

Both changes will also be applied to the Component Gallery's sortable table example to maintain consistency.

---

### Files That Will Be Updated

| File | What Changes |
|------|--------------|
| `AssignVideosModal.tsx` | Add secondary sort logic; reset sort state in closeModal function |
| `ComponentsGallery.tsx` | Add secondary sort logic to the sortable table example |

---

### Change 1: Secondary Sort by Title (Assign Videos Dialog)

**Current behavior:** When sorting by Status, videos with the same status (e.g., two "Pending" items) may appear in unpredictable order.

**Updated behavior:** Videos with the same status will be alphabetically sorted by title.

**Location:** `src/components/dashboard/AssignVideosModal.tsx` - sortVideos function (around line 518)

**Current code:**
```tsx
const sortVideos = (videosToSort: VideoType[]): VideoType[] => {
  return [...videosToSort].sort((a, b) => {
    let comparison = 0;
    if (sortColumn === 'course') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortColumn === 'status') {
      comparison = getStatusPriority(a.id) - getStatusPriority(b.id);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};
```

**Updated code:**
```tsx
const sortVideos = (videosToSort: VideoType[]): VideoType[] => {
  return [...videosToSort].sort((a, b) => {
    let comparison = 0;
    if (sortColumn === 'course') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortColumn === 'status') {
      comparison = getStatusPriority(a.id) - getStatusPriority(b.id);
      // Secondary sort: alphabetical by title when status is the same
      if (comparison === 0) {
        comparison = a.title.localeCompare(b.title);
      }
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};
```

---

### Change 2: Reset Sort State on Dialog Close

**Current behavior:** Sort state persists when dialog closes and reopens, which may confuse users who expect consistent initial state.

**Updated behavior:** Sort resets to Course ascending (the default) when dialog is closed.

**Location:** `src/components/dashboard/AssignVideosModal.tsx` - closeModal function (line 439-450)

**Current code:**
```tsx
const closeModal = () => {
  setSelectedVideoIds(new Set());
  setVideoDeadlines(new Map(initialVideoDeadlines));
  setShowDiscardDialog(false);
  setShowUnassignDialog(false);
  setFilterMode("assigned");
  resetDueDateDialog();
  // Reset quiz state
  setVideoIdsWithQuizzes(new Set());
  setEmployeeQuizResults(new Map());
  onOpenChange(false);
};
```

**Updated code:**
```tsx
const closeModal = () => {
  setSelectedVideoIds(new Set());
  setVideoDeadlines(new Map(initialVideoDeadlines));
  setShowDiscardDialog(false);
  setShowUnassignDialog(false);
  setFilterMode("assigned");
  resetDueDateDialog();
  // Reset quiz state
  setVideoIdsWithQuizzes(new Set());
  setEmployeeQuizResults(new Map());
  // Reset sort state to default
  setSortColumn('course');
  setSortDirection('asc');
  onOpenChange(false);
};
```

---

### Change 3: Secondary Sort in Component Gallery

**Purpose:** Keep the example table in the Component Gallery consistent with the pattern used in the main application.

**Location:** `src/pages/ComponentsGallery.tsx` - sortedData logic (lines 121-138)

**Current code:**
```tsx
const sortedData = [...tableData].sort((a, b) => {
  const aValue = a[sortColumn as keyof typeof a];
  const bValue = b[sortColumn as keyof typeof b];

  // Handle numerical sorting for department column
  if (sortColumn === "department") {
    const aNum = parseInt(aValue);
    const bNum = parseInt(bValue);
    return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
  }

  // String sorting for other columns
  if (sortDirection === "asc") {
    return aValue.localeCompare(bValue);
  } else {
    return bValue.localeCompare(aValue);
  }
});
```

**Updated code:**
```tsx
const sortedData = [...tableData].sort((a, b) => {
  const aValue = a[sortColumn as keyof typeof a];
  const bValue = b[sortColumn as keyof typeof b];

  // Handle numerical sorting for department column
  if (sortColumn === "department") {
    const aNum = parseInt(aValue);
    const bNum = parseInt(bValue);
    let comparison = aNum - bNum;
    // Secondary sort: alphabetical by name when department is the same
    if (comparison === 0) {
      comparison = a.name.localeCompare(b.name);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  }

  // String sorting for other columns
  let comparison = aValue.localeCompare(bValue);
  // Secondary sort: alphabetical by name when primary column values are the same
  if (comparison === 0 && sortColumn !== "name") {
    comparison = a.name.localeCompare(b.name);
  }
  return sortDirection === "asc" ? comparison : -comparison;
});
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `AssignVideosModal.tsx` | Add secondary alphabetical sort when sorting by Status |
| `AssignVideosModal.tsx` | Reset sortColumn and sortDirection in closeModal function |
| `ComponentsGallery.tsx` | Add secondary alphabetical sort by name for consistent example |

---

### Expected Behavior After Changes

**Assign Videos Dialog:**
- Clicking Status header sorts by priority (Overdue → Pending → Unassigned → Completed)
- Videos with the same status are alphabetically sorted by title
- Closing the dialog resets sort to Course ascending

**Component Gallery:**
- Sorting by any column uses a secondary sort by Name for consistent ordering
- Demonstrates best practice for stable sorting

