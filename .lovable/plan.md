
## Update Date Column to Show "Due" Prefix for Pending/Overdue Videos

### What's Being Changed

In the Edit Assignments dialog, the "Date" column currently shows just the date (e.g., "Jan 15, 2026"). For videos with "Pending" or "Overdue" status, it should display "Due Jan 15, 2026" to make it clearer that this is a deadline.

---

### Changes

**File: `src/components/dashboard/AssignVideosModal.tsx`**

**Lines 462-482** - Update `formatDueDate` to include "Due" prefix for pending/overdue statuses:

```tsx
// Current logic:
const formatDueDate = (videoId: string): string => {
  if (!assignedVideoIds.has(videoId) && !selectedVideoIds.has(videoId)) return "--";

  if (completedVideoIds.has(videoId)) {
    const progressData = videoProgressData.get(videoId);
    if (progressData?.completed_at) {
      return format(new Date(progressData.completed_at), "MMM dd, yyyy");
    }
  }

  const deadline = videoDeadlines.get(videoId);
  const existingDueDate = assignmentData.get(videoId)?.due_date;

  if (deadline) {
    return format(deadline, "MMM dd, yyyy");
  } else if (existingDueDate) {
    return format(new Date(existingDueDate), "MMM dd, yyyy");
  }
  return "N/A";
};
```

**Updated logic:**

```tsx
const formatDueDate = (videoId: string): string => {
  if (!assignedVideoIds.has(videoId) && !selectedVideoIds.has(videoId)) return "--";

  if (completedVideoIds.has(videoId)) {
    const progressData = videoProgressData.get(videoId);
    if (progressData?.completed_at) {
      return format(new Date(progressData.completed_at), "MMM dd, yyyy");
    }
  }

  const deadline = videoDeadlines.get(videoId);
  const existingDueDate = assignmentData.get(videoId)?.due_date;
  const status = getCompletionStatus(videoId);

  if (deadline) {
    const formattedDate = format(deadline, "MMM dd, yyyy");
    return status === "pending" || status === "overdue" ? `Due ${formattedDate}` : formattedDate;
  } else if (existingDueDate) {
    const formattedDate = format(new Date(existingDueDate), "MMM dd, yyyy");
    return status === "pending" || status === "overdue" ? `Due ${formattedDate}` : formattedDate;
  }
  return "N/A";
};
```

---

### Result

| Status | Date Column Display |
|--------|---------------------|
| Unassigned | "--" |
| Pending | "Due Jan 15, 2026" ✓ |
| Overdue | "Due Jan 10, 2026" ✓ |
| Completed | "Jan 12, 2026" (completion date, no prefix) |
