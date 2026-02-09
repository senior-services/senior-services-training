

## Fix "Legacy - No Quiz" Quiz Version in Assign Videos Dialog

### Problem
The "Quiz Version" column in the Assign Videos dialog shows "1" for employees with "Legacy - No Quiz" status. It should show "N/A" because the employee is exempt from the quiz.

### Change

**File: `src/components/dashboard/AssignVideosModal.tsx`**

Update `getQuizVersion` (line 641) to check for legacy exemption before returning the version number. If the employee is legacy-exempt for a given video (same `isLegacyExempt()` function already used for Quiz Results), return "N/A" instead of the active version.

Updated logic:
```
const getQuizVersion = (videoId: string): string => {
  const hasQuiz = videoIdsWithQuizzes.has(videoId);
  const isAssigned = assignedVideoIds.has(videoId) || selectedVideoIds.has(videoId);
  if (!hasQuiz) {
    return isAssigned ? "N/A" : "--";
  }
  // Legacy-exempt employees should show N/A
  if (isLegacyExempt(videoId)) {
    return "N/A";
  }
  const version = videoQuizVersions.get(videoId);
  return version !== undefined ? `${version}` : "--";
};
```

### Review
- **Top 5 Risks**: None -- reuses existing `isLegacyExempt()` function.
- **Top 5 Fixes**: (1) Add legacy exemption check to `getQuizVersion`.
- **Database Change Required**: No
- **Go/No-Go**: Go
