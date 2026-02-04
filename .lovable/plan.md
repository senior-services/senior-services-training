

## Fix: Show "--" for Quiz Results When Video is Unassigned

### What's Being Fixed

In the Edit Assignments dialog, when a video has a quiz but is **unassigned**, the Quiz Results column currently shows "Not Completed". It should instead show "--" since quiz results are not applicable for unassigned videos.

---

### Changes

**File: `src/components/dashboard/AssignVideosModal.tsx`**

**Lines 523-541** - Update `getQuizResults` to check assignment status:

```tsx
// Current logic (simplified):
const getQuizResults = (videoId: string): React.ReactNode => {
  const hasQuiz = videoIdsWithQuizzes.has(videoId);
  const quizAttempt = employeeQuizResults.get(videoId);

  if (!hasQuiz) {
    return <span aria-label="No quiz available">--</span>;
  }

  if (!quizAttempt) {
    return <span>Not Completed</span>;  // ← Shows this for unassigned too
  }
  // ... score display
};
```

**Updated logic:**

```tsx
const getQuizResults = (videoId: string): React.ReactNode => {
  const hasQuiz = videoIdsWithQuizzes.has(videoId);
  const quizAttempt = employeeQuizResults.get(videoId);
  const isAssigned = assignedVideoIds.has(videoId);

  if (!hasQuiz) {
    return <span aria-label="No quiz available">--</span>;
  }

  // Unassigned videos show "--" instead of "Not Completed"
  if (!isAssigned) {
    return <span aria-label="Not assigned">--</span>;
  }

  if (!quizAttempt) {
    return <span>Not Completed</span>;
  }
  // ... score display remains unchanged
};
```

---

### Result

| Status | Quiz Available | Quiz Results Display |
|--------|---------------|---------------------|
| Unassigned | Yes | "--" ✓ |
| Unassigned | No | "--" |
| Assigned (not taken) | Yes | "Not Completed" |
| Assigned (completed) | Yes | "85% (17/20 Correct)" |

This ensures quiz results are only shown as "Not Completed" when the video is actually assigned and the employee hasn't taken the quiz yet.

