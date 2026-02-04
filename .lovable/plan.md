

## Update Employee Status Column Display

### Summary

Change the Status column in the Employee Management table to show To-do count as plain text and only use a badge for Overdue items.

---

### Current Behavior

The status column currently shows one of these badges:
- `soft-secondary` badge: "# To-do" 
- `soft-destructive` badge: "# Overdue"
- `soft-success` badge: "All Training Complete"
- `soft-secondary` badge: "No Required Training"

---

### New Behavior

| Scenario | Display |
|----------|---------|
| All complete | "All Training Complete" as plain text |
| Some to-do, none overdue | "3 To-do" as plain text |
| Some to-do + some overdue | "3 To-do" as plain text + `soft-destructive` badge "2 Overdue" |
| No required training | "No Required Training" as plain text |

---

### Changes

**File:** `src/components/dashboard/EmployeeManagement.tsx`

**Location:** `getEmployeeStatus` function (lines 243-283)

Update the return statements to:

1. **No Required Training**: Return plain text `<span>` instead of badge

2. **All Complete**: Return plain text `<span>` instead of badge

3. **Has Overdue**: Return a `<div>` with:
   - Plain text showing "# To-do"
   - Space separator
   - Destructive badge showing "# Overdue"

4. **Only To-do (no overdue)**: Return plain text `<span>` instead of badge

**Updated function logic:**

```tsx
const getEmployeeStatus = (employeeId: string) => {
  const videos = employeeVideos.get(employeeId) || [];
  const requiredVideos = videos.filter(assignment => assignment.video_type === 'Required');
  
  if (requiredVideos.length === 0) {
    return <span className="text-muted-foreground">No Required Training</span>;
  }

  // ... existing helper function and filtering logic stays the same ...

  const pendingCount = requiredVideos.length - completedRequired.length;

  if (completedRequired.length === requiredVideos.length) {
    return <span className="text-muted-foreground">All Training Complete</span>;
  }

  if (overdueRequired.length > 0) {
    return (
      <div className="flex items-center gap-2">
        <span>{pendingCount} {STATUS_LABELS.pending}</span>
        <Badge variant="soft-destructive">{overdueRequired.length} Overdue</Badge>
      </div>
    );
  }

  return <span>{pendingCount} {STATUS_LABELS.pending}</span>;
};
```

---

### Files Modified

| File | Changes |
|------|---------|
| `src/components/dashboard/EmployeeManagement.tsx` | Update 4 return statements in `getEmployeeStatus` function |

