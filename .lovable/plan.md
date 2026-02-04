

## Update Quiz Results for Assigned Courses Without Quizzes

### What's Being Changed

For courses that are **assigned** but have no quiz, the Quiz Results column should show "N/A" instead of "--" regardless of completion status. This applies to both the Edit Assignments dialog and the Excel download.

---

### Changes

**File 1: `src/components/dashboard/AssignVideosModal.tsx`**

**Lines 532-536** - Update condition to check if assigned (not just completed):

```tsx
// Current:
if (!hasQuiz) {
  return isCompleted 
    ? <span aria-label="No quiz for this course">N/A</span>
    : <span aria-label="No quiz available">--</span>;
}

// Updated:
if (!hasQuiz) {
  // Show "N/A" for assigned courses without quiz, "--" for unassigned
  return isAssigned 
    ? <span aria-label="No quiz for this course">N/A</span>
    : <span aria-label="No quiz available">--</span>;
}
```

---

**File 2: `src/components/dashboard/EmployeeManagement.tsx`**

**Lines 338-340** - Simplify to always show "N/A" when no quiz (since all items in the export are assigned):

```tsx
// Current:
if (!assignment.hasQuiz) {
  // Show "N/A" for completed courses without quiz, "--" otherwise
  quizResults = isCompleted ? 'N/A' : '--';
}

// Updated:
if (!assignment.hasQuiz) {
  // All exported items are assigned, so show "N/A" when no quiz
  quizResults = 'N/A';
}
```

Note: In the data download, all assignments in the loop are already assigned courses, so we can simply use "N/A" for any course without a quiz.

---

### Result

| Scenario | Quiz Results (Before) | Quiz Results (After) |
|----------|----------------------|----------------------|
| Assigned + Pending, no quiz | "--" | "N/A" ✓ |
| Assigned + Overdue, no quiz | "--" | "N/A" ✓ |
| Assigned + Completed, no quiz | "N/A" | "N/A" |
| Unassigned, no quiz | "--" | "--" |
| Has quiz, not completed | "Not Completed" | "Not Completed" |
| Has quiz, completed | "85% (17/20 Correct)" | "85% (17/20 Correct)" |

