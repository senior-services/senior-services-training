

## Add Helper Text for Multiple Choice Questions

### What's changing
Three small additions to clarify the multiple-choice quiz behavior for both admins and employees, using the newly documented helper text pattern from the style guide.

### Changes (3 files)

**File 1: `src/components/EditVideoModal.tsx`** (Edit Course dialog)
- After the "Answer Options" label (line 1124), add helper text **only when** `question.question_type === 'multiple_choice'`:
  ```
  <p className="text-xs text-muted-foreground mt-1 mb-1.5">
    Mark all correct answers. Employees must select all of these to pass the question.
  </p>
  ```

**File 2: `src/components/quiz/CreateQuizModal.tsx`** (Add New Course dialog)
- After the "Answer Options" label (line 303), add the same helper text **only when** `question.question_type === 'multiple_choice'`:
  ```
  <p className="text-xs text-muted-foreground mt-1 mb-1.5">
    Mark all correct answers. Employees must select all of these to pass the question.
  </p>
  ```

**File 3: `src/components/quiz/QuizModal.tsx`** (Employee quiz)
- After the question title `<h3>` (line 228), add helper text **only when** `question.question_type === 'multiple_choice'`:
  ```
  <p className="text-xs text-muted-foreground">
    Select all correct options for full credit.
  </p>
  ```

### Scoring behavior
The existing quiz scoring logic already requires employees to select **all** correct options and **no** incorrect options to get the question right. No scoring changes needed -- this is purely a UI clarity improvement.

### Review
- **Top 5 Risks**: (1) Minimal -- text-only additions with no logic changes. (2) Helper text must only show for multiple_choice, not single_answer or true_false. (3) Consistent styling with new style guide pattern. (4) No database changes. (5) No accessibility concerns.
- **Top 5 Fixes**: (1) Add admin helper text in EditVideoModal. (2) Add admin helper text in CreateQuizModal. (3) Add employee helper text in QuizModal. (4) Conditionally render only for multiple_choice type. (5) Follow style guide spacing tokens.
- **Database Change Required**: No
- **Go/No-Go**: Go
