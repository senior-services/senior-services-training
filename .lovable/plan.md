

## Update Quiz Results Display for Completed Courses Without Quizzes

### What's Being Changed

When a course is completed but has no quiz attached, both the "Edit Assignments" dialog and the Excel download should show "N/A" in the Quiz Results column instead of "--".

---

### Changes

**File 1: `src/components/dashboard/AssignVideosModal.tsx`**

**Lines 526-533** - Update `getQuizResults` to check completion status when there's no quiz:

```tsx
// Current:
const getQuizResults = (videoId: string): React.ReactNode => {
  const hasQuiz = videoIdsWithQuizzes.has(videoId);
  const quizAttempt = employeeQuizResults.get(videoId);
  const isAssigned = assignedVideoIds.has(videoId);

  if (!hasQuiz) {
    return <span aria-label="No quiz available">--</span>;
  }
  // ...
};

// Updated:
const getQuizResults = (videoId: string): React.ReactNode => {
  const hasQuiz = videoIdsWithQuizzes.has(videoId);
  const quizAttempt = employeeQuizResults.get(videoId);
  const isAssigned = assignedVideoIds.has(videoId);
  const isCompleted = completedVideoIds.has(videoId);

  if (!hasQuiz) {
    // Show "N/A" for completed courses without quiz, "--" otherwise
    return isCompleted 
      ? <span aria-label="No quiz for this course">N/A</span>
      : <span aria-label="No quiz available">--</span>;
  }
  // ...
};
```

---

**File 2: `src/components/dashboard/EmployeeManagement.tsx`**

**Lines 336-345** - Update quiz results logic to show "N/A" for completed courses without quiz:

```tsx
// Current:
let quizResults = '--';
if (!assignment.hasQuiz) {
  quizResults = '--';
} else if (!quizAttempt) {
  quizResults = 'Not Completed';
} else {
  const percentage = Math.round(quizAttempt.score / quizAttempt.total_questions * 100);
  quizResults = `${percentage}% (${quizAttempt.score}/${quizAttempt.total_questions} Correct)`;
}

// Updated:
let quizResults = '--';
if (!assignment.hasQuiz) {
  // Show "N/A" for completed courses without quiz, "--" otherwise
  quizResults = isCompleted ? 'N/A' : '--';
} else if (!quizAttempt) {
  quizResults = 'Not Completed';
} else {
  const percentage = Math.round(quizAttempt.score / quizAttempt.total_questions * 100);
  quizResults = `${percentage}% (${quizAttempt.score}/${quizAttempt.total_questions} Correct)`;
}
```

---

### Result

| Scenario | Quiz Results (Before) | Quiz Results (After) |
|----------|----------------------|----------------------|
| Completed, no quiz | "--" | "N/A" ✓ |
| Pending/Overdue, no quiz | "--" | "--" |
| Unassigned, no quiz | "--" | "--" |
| Has quiz, not completed | "Not Completed" | "Not Completed" |
| Has quiz, completed | "85% (17/20 Correct)" | "85% (17/20 Correct)" |

