

## Fix Date Column Showing "N/A" When Selecting Checkbox

### Summary

Update the date display logic so that newly selected (but not yet assigned) videos show "--" instead of "N/A" when their checkbox is checked.

---

### The Issue

Currently when you check a course checkbox:
- The date column changes from "--" to "N/A"
- This is confusing because the video isn't actually assigned yet

### The Fix

**File:** `src/components/dashboard/AssignVideosModal.tsx` (lines 471-494)

Add a specific check for videos that are selected but not yet assigned:

```tsx
// Format due date for display
const formatDueDate = (videoId: string): string => {
  // Not selected and not assigned - show "--"
  if (!assignedVideoIds.has(videoId) && !selectedVideoIds.has(videoId)) return "--";

  // Newly selected but not yet assigned - show "--" until actually assigned
  if (selectedVideoIds.has(videoId) && !assignedVideoIds.has(videoId)) {
    const deadline = videoDeadlines.get(videoId);
    // Only show date if user has set a pending deadline for this selection
    if (deadline) {
      return `Due ${format(deadline, "MMM dd, yyyy")}`;
    }
    return "--";
  }

  // ... rest of existing logic for assigned videos
};
```

---

### Behavior After Fix

| Scenario | Display |
|----------|---------|
| Video not selected, not assigned | "--" |
| Video selected (checkbox checked), no deadline set | "--" |
| Video selected, deadline set via date picker | "Due [date]" |
| Video assigned, has due date | "Due [date]" or date |
| Video assigned, no due date | "N/A" |

