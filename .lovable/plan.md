
## Add Attestation Checkbox to Training Completion Flows

### What's changing
Adding a mandatory attestation checkbox ("I certify that I have read and understood this content") to both completion paths: quiz-based trainings and no-quiz trainings.

### Path 1: Trainings WITH Quizzes

**File: `src/components/quiz/QuizModal.tsx`**
- Add `attestationChecked` state (boolean, default false).
- After the questions list (after line 506's closing `</div>`), render a new attestation section:
  - A `Checkbox` + label reading "I certify that I have read and understood this content."
  - Disabled until all questions are answered (`allQuestionsAnswered`).
  - Styled as a distinct card/separator at the bottom of the scrollable content area (NOT in the dialog footer).
- Update `onResponsesChange` callback to also pass attestation status, so parent components can gate the Submit button.

**File: `src/components/VideoPlayerFullscreen.tsx`**
- Update `allQuestionsAnswered` gating on the "Submit Quiz" button (line 591) to also require attestation: `disabled={!allQuestionsAnswered || !attestationChecked}`.
- Pass attestation state through from `QuizModal` via `onResponsesChange` (extend its signature to include attestation boolean).

**File: `src/pages/VideoPage.tsx`**
- Same change for the quiz dialog at line 328-338 if it has a submit button (currently it delegates to `QuizModal.onSubmit` directly -- will need to gate submission on attestation).

### Path 2: Trainings WITHOUT Quizzes

**File: `src/components/video/CompletionOverlay.tsx`**
- Add `attestationChecked` local state (boolean, default false).
- Below the "You've finished watching..." text and above the "Complete Training" button, add a `Checkbox` + label: "I certify that I have read and understood this content."
- Disable the "Complete Training" button until `attestationChecked` is true.
- The "Start Quiz to Complete Training" path is unaffected here (attestation happens in quiz modal instead).

### Technical Details

- `QuizModal`'s `onResponsesChange` signature changes from `(responses, allAnswered)` to `(responses, allAnswered, attestationChecked)`.
- Both `VideoPlayerFullscreen.tsx` and `VideoPage.tsx` need to track the new third parameter.
- Attestation checkbox resets when `QuizModal` re-renders with new quiz data (via state initialization).
- For submitted/review mode (`isSubmitted=true`), the attestation checkbox should show as checked and disabled.

### Review

- **Top 5 Risks**: (1) Changing `onResponsesChange` signature requires updating all callers -- two files identified. (2) Attestation state must reset properly when dialog reopens. (3) No risk to existing quiz grading logic. (4) No database changes. (5) Minimal complexity added.
- **Top 5 Fixes**: (1) Add checkbox to QuizModal content area. (2) Add checkbox to CompletionOverlay. (3) Gate submit/complete buttons on attestation. (4) Update callback signature. (5) Handle submitted/review state.
- **Database Change Required**: No
- **Go/No-Go**: Go
