

## Remove Quiz Title, Description, and "Questions" Heading from Quiz Editor

Simplify the quiz editing experience by removing three fields admins don't need to manage. Quiz titles will be auto-generated from the course title instead.

### What Changes for Admins

- The **Quiz Title** input, **Description** textarea, and **"Questions"** heading text are removed from the quiz tab in "Edit Course" and from the "Create Quiz" modal.
- The quiz section now starts directly with the "Add Question" button and the question cards.
- Quiz titles are automatically set to match the course title (admins never need to think about it).

### What Changes for Employees

- Nothing visible changes. The quiz screen will continue to show a title (auto-generated from the course name) and questions as before.

### Existing Quizzes

A database migration will update all existing quiz titles to match their linked course title, and clear all existing descriptions.

### Technical Details

**Files Modified:**

1. **`src/components/EditVideoModal.tsx`**
   - Remove Quiz Title input (lines 877-880) and Description textarea (lines 882-885)
   - Remove "Questions" heading text (line 889), keep only the "Add Question" button
   - Auto-set `quizTitle` from the video/course `title` (derive it, don't ask for it)
   - Update `handleCreateQuiz` to use video title instead of requiring manual quiz title input
   - Remove quiz title validation checks (lines 342-351, 706-713) since title is auto-derived
   - Simplify `hasChanges` and `hasQuizChanges` to remove `quizTitle` and `quizDescription` comparisons
   - Remove `quizTitle`, `quizDescription`, `originalQuizTitle`, `originalQuizDescription` state variables (replace with auto-derived value)

2. **`src/components/quiz/CreateQuizModal.tsx`**
   - Remove Quiz Title input (lines 219-227) and Description textarea (lines 229-237)
   - Remove "Questions" heading (line 242), keep "Add Question" button
   - Remove `title` and `description` from `formData` state; auto-set title from video context
   - Update `QuizFormData` interface: keep `title` and `description` fields but auto-populate them
   - Remove `formData.title.trim()` from `canSubmit` check (line 206)

3. **`src/components/quiz/QuizModal.tsx`** (employee-facing)
   - No changes. Continue displaying `quiz.title` (which will now be auto-generated).

**Database Migration:**

```sql
UPDATE quizzes q
SET title = v.title,
    description = NULL,
    updated_at = now()
FROM videos v
WHERE q.video_id = v.id;
```

This updates all existing quiz titles to match their course titles and clears descriptions.

**No schema changes** -- the `title` column stays NOT NULL, just auto-populated instead of manually entered.
