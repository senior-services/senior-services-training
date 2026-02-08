

## Fix: Respect Completion Timeline When Quiz Is Added Later

### What's Happening

When an admin assigns a course (no quiz) to Jane, she completes it. Later, the admin adds quiz questions to that course. Both the admin and employee dashboards now see that the video "has a quiz" and require a quiz attempt for completion -- retroactively marking Jane's training as incomplete/overdue.

Jane completed the course under Version 1 rules (no quiz required). The newly added quiz should only apply to employees who haven't yet completed the course, or to future assignments.

### What Should Happen

If an employee's `completed_at` timestamp on `video_progress` is earlier than the quiz's `created_at` timestamp, the system should treat that training as completed -- the employee finished under the rules that existed at the time. The quiz requirement should only apply to employees who complete (or haven't yet completed) the video after the quiz was created.

### The Fix

Both dashboards need to fetch the quiz `created_at` timestamp (not just `video_id`) and compare it against each employee's `completed_at` date when deciding if a quiz is required.

### Risk Assessment

**Top 5 Risks/Issues:**
1. Must apply consistently across three locations: employee dashboard, admin employee list (active), and admin employee list (hidden/archived)
2. Edge case: employee started but didn't finish the video before quiz was added -- they should still need the quiz since they weren't "completed"
3. The `get_all_employee_assignments` and `get_hidden_employee_assignments` RPCs return `completed_at` per assignment, so the data is already available
4. The quiz `created_at` query is a small addition to existing queries (just adding one more column to the SELECT)
5. No risk of breaking existing quiz-required flows -- the check only exempts employees who were already done

**Top 5 Fixes/Improvements:**
1. Change quiz query from `select('video_id')` to `select('video_id, created_at')` in all three locations
2. Store quiz creation dates in a Map alongside video IDs
3. In the `hasQuiz` / completion check, compare employee's `completed_at` against the quiz `created_at` -- if completed before quiz existed, treat as no quiz required
4. No database migration needed -- all required data already exists in the tables
5. No new components or APIs needed

**Database Change Required:** No

**Go/No-Go Verdict:** Go -- adds a simple date comparison to existing completion logic in three places.

### Technical Detail

**Files to modify:**

1. **`src/pages/EmployeeDashboard.tsx`** (employee side)
   - Line ~134: Change `select('video_id')` to `select('video_id, created_at')`
   - Store as a `Map<string, string>` (video_id to created_at) instead of a `Set`
   - Line ~245: In `transformToTrainingVideo`, compare `assignment.completed_at` against the quiz's `created_at`. If `completed_at < quiz.created_at`, treat `hasQuiz` as false for this employee

2. **`src/components/dashboard/EmployeeManagement.tsx`** (admin side - active employees)
   - Line ~119: Change `select('video_id')` to `select('video_id, created_at')`
   - Store quiz creation dates alongside video IDs
   - Line ~127: When setting `hasQuiz`, also consider the employee's `completed_at` for that assignment. If completed before quiz was created, set `hasQuiz: false`
   - Line ~338: Same change for hidden employees section

**Logic (pseudocode):**
```text
quizCreatedAt = quizCreationDates[video_id]
employeeCompletedAt = assignment.completed_at

if (quizCreatedAt AND employeeCompletedAt AND employeeCompletedAt < quizCreatedAt):
    hasQuiz = false   // Employee finished before quiz existed
else:
    hasQuiz = true    // Quiz applies to this employee
```

This preserves the existing behavior for all employees who complete after a quiz is added, while correctly exempting those who finished before the quiz existed.

