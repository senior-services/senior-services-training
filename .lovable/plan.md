

## Fix Data Consistency: Quiz Scores Across All Views

### Problem
Jane's "Anti-Harassment" training shows three different results across the app:
- **Training card**: 67% (2/3 correct) -- CORRECT, uses stored attempt data
- **Review training dialog**: 50% (2/4 correct) -- BUG
- **Admin view**: "Legacy - No Quiz" -- BUG
- **Data download (Excel)**: Same bug risk as admin view

### Root Causes

**Bug 1: Review dialog shows wrong score (50% instead of 67%)**
The QuizModal badge recounts questions from the quiz definition (`quiz.questions.length = 4`) instead of using the stored attempt record (`total_questions = 3`). A 4th question was added to the archived quiz v1 before versioning occurred, so the question count no longer matches what was recorded at submission time.

**Bug 2: Admin view shows "Legacy - No Quiz" instead of actual score**
The admin modal checks legacy exemption (completed before quiz existed) **before** checking for quiz attempts. Because the active quiz v2 was created in Feb 2026 (after Jane's Sep 2025 completion), the exemption fires -- hiding Jane's actual v1 quiz attempt with a 2/3 score.

**Bug 3: Data download has same priority issue**
The export function uses `hasQuiz` (which is set to false for legacy-exempt employees), so the quiz results column shows "N/A" instead of the actual score when the employee voluntarily completed a quiz.

### What Will Change

**All four views will use the same source of truth**: the stored quiz attempt record (`score` and `total_questions`). If an employee has taken a quiz, their actual score is always shown -- regardless of exemption status.

### Fix 1 -- QuizModal badge (`src/components/quiz/QuizModal.tsx`)

Add optional `storedScore` and `storedTotalQuestions` props. When reviewing a submitted quiz, use these values for the score badge instead of recounting from the current quiz definition. This ensures the badge matches the exact score recorded at submission time.

### Fix 2 -- Pass stored data to QuizModal (`src/components/VideoPlayerFullscreen.tsx`)

When loading a completed quiz for review, pass the attempt's `score` and `total_questions` to QuizModal so it can display the correct badge.

### Fix 3 -- Admin view quiz results (`src/components/dashboard/AssignVideosModal.tsx`)

Reorder the logic in `getQuizResults`: check for quiz attempts **before** the legacy exemption. If the employee has a quiz attempt, always show the actual score. Only show "Legacy - No Quiz" if there is no quiz attempt AND the employee is exempt.

### Fix 4 -- Data download (`src/components/dashboard/EmployeeManagement.tsx`)

Same reordering in `processEmployeesForExport`: check for quiz attempt data **before** the `hasQuiz` flag. If an attempt exists, show the actual score. Only show "N/A" for truly quiz-less courses, and "Legacy - No Quiz" for exempt courses with no attempt.

### Expected Results After Fix

| View | Anti-Harassment (has attempt) | Time Management (no attempt, exempt) |
|------|-------------------------------|--------------------------------------|
| Training card | 67% (2/3) | Completed, no quiz badge |
| Review dialog | 67% (2/3) | No quiz section |
| Admin view | 67% (2/3 Correct) | Legacy - No Quiz |
| Data download | 67% (2/3 Correct) | Legacy - No Quiz |

### Technical Details

**File: `src/components/quiz/QuizModal.tsx`**
- Add `storedScore?: number` and `storedTotalQuestions?: number` to `QuizModalProps`
- In the badge calculation (lines 187-206), when `storedScore` and `storedTotalQuestions` are provided and `isSubmitted`, use those values instead of recounting from `quiz.questions.length` and `quizResults`

**File: `src/components/VideoPlayerFullscreen.tsx`**
- Store the latest attempt's `score` and `total_questions` when loading completed quiz results (around line 210)
- Pass these values to `QuizModal` as `storedScore` and `storedTotalQuestions` (line 565)

**File: `src/components/dashboard/AssignVideosModal.tsx`**
- In `getQuizResults` (lines 595-627): move the `quizAttempt` check (line 617) above the `isLegacyExempt` check (line 612). If `quizAttempt` exists, show the score. Only fall through to "Legacy - No Quiz" when there is no attempt.

**File: `src/components/dashboard/EmployeeManagement.tsx`**
- In `processEmployeesForExport` (lines 465-473): check for `quizAttempt` first. If it exists, always show the score. Add a new branch for legacy-exempt with no attempt: show "Legacy - No Quiz". Only show "N/A" when there truly is no quiz for the course.

### Review

- **Top 5 Risks**: (1) Changing QuizModal props -- low risk, new props are optional with no breaking changes. (2) Reordering admin logic could surface scores for edge cases previously hidden -- this is the desired behavior per reporting data priority rule. (3) Export format change from "N/A" to "Legacy - No Quiz" could affect downstream processes -- acceptable since it provides more accurate information. (4) Date comparison edge cases -- mitigated by strict less-than comparison. (5) Quiz v1 question count mismatch already in database -- handled by using stored attempt data.
- **Top 5 Fixes**: (1) Use stored attempt data in QuizModal badge. (2) Pass attempt data from VideoPlayerFullscreen. (3) Reorder admin quiz results to prioritize attempts. (4) Reorder export quiz results to prioritize attempts. (5) Add "Legacy - No Quiz" label in export for exempt-no-attempt cases.
- **Database Change Required**: No
- **Go/No-Go**: Go

