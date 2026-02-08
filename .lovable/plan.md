

## Fix: Employees Can't See Their Completed Quiz After Versioning

### What's Happening

Jane completed the quiz (Version 1). An admin then edited the quiz, which created Version 2 and archived Version 1. Now when Jane looks at her completed training, her quiz results are gone because the database security rules block her from seeing any archived quiz.

### What Should Happen

Jane should still see her Version 1 quiz results exactly as she completed them. The archive should only hide the old quiz from employees who haven't taken it yet -- not from employees who already finished it.

### The Fix

A single database security rule update. No code changes needed.

**Current rule:** Employees can only see quizzes that are not archived.

**Updated rule:** Employees can see quizzes that are not archived, OR any archived quiz they have already completed.

### Risk Assessment

**Top 5 Risks/Issues:**
1. The updated rule must not accidentally expose all archived quizzes to all employees -- the EXISTS check scopes it to only quizzes the specific employee has attempted
2. The subquery joins `quiz_attempts` and `employees` tables, which are both RLS-protected, but since the subquery runs inside the `quizzes` policy (not referencing `quizzes` again), there is no recursion risk
3. Slight query overhead from the EXISTS check, but it only runs for archived rows and is indexed
4. Must verify the fix works for both the quiz results view and the employee dashboard training list
5. No impact on admin access or new quiz-taking flow

**Top 5 Fixes/Improvements:**
1. Update the single RLS policy on the `quizzes` table (drop old, create new)
2. No application code changes required
3. No new database functions needed
4. Backward compatible with all existing queries
5. Solves the problem at the data access layer, so every UI surface benefits automatically

**Database Change Required:** Yes -- one RLS policy update on the `quizzes` table
**Go/No-Go Verdict:** Go -- minimal, targeted fix for a clear data visibility bug.

### Technical Detail

**Database migration** -- drop and recreate the employee SELECT policy on `quizzes`:

```text
DROP POLICY "Employees can view active quizzes" ON public.quizzes;

CREATE POLICY "Employees can view active quizzes"
  ON public.quizzes FOR SELECT
  USING (
    has_role(auth.uid(), 'employee'::app_role)
    AND (
      archived_at IS NULL
      OR EXISTS (
        SELECT 1 FROM quiz_attempts qa
        JOIN employees e ON qa.employee_id = e.id
        WHERE qa.quiz_id = quizzes.id
          AND e.email = (auth.jwt() ->> 'email'::text)
      )
    )
  );
```

This allows employees to see:
- All active (non-archived) quizzes -- for taking new quizzes
- Any archived quiz they personally completed -- for reviewing their results

No changes to application code or other files are needed.

