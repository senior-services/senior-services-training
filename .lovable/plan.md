

## Fix: Quiz Results Flash as "Incorrect" Before Showing Correct

### What's Happening

After submitting a quiz, the answers briefly flash as "Incorrect" (red) before correcting to "Correct" (green). This happens because the submission code updates the screen in two separate steps with a gap between them:

1. First, it saves the employee's answers and shows results -- but at this point, the system doesn't yet know which answers are the "right" ones
2. Then, it fetches the correct answers and updates the screen again

In that brief gap, the screen shows everything as wrong because it doesn't have the correct answers to compare against yet.

### The Fix

Fetch both pieces of data (the employee's results AND the correct answers) before updating the screen. This way, the screen only updates once with all the information it needs, eliminating the flash.

### Risk Assessment

**Top 5 Risks/Issues:**
1. If either fetch fails, the quiz results won't display at all (same as current behavior -- error toast is shown)
2. Slight delay before results appear (both fetches must complete) -- negligible in practice
3. Must ensure the same fix pattern is applied consistently if similar logic exists elsewhere
4. No change to what data is fetched, only the ordering of state updates
5. No database or API changes needed

**Top 5 Fixes/Improvements:**
1. Move `getCorrectOptionsForQuiz` call before `setQuizResults` so both are ready before any re-render
2. Batch both state updates together so React renders once with complete data
3. No new dependencies or functions needed
4. No database changes
5. Same fix pattern could be applied to `VideoPage.tsx` if it has the same issue

**Database Change Required:** No
**Go/No-Go Verdict:** Go -- minimal reordering of two lines in one function.

### Technical Detail

**File:** `src/components/VideoPlayerFullscreen.tsx`, `handleQuizSubmit` function (around lines 310-328)

**Current order:**
```text
1. submitQuiz()
2. getUserAttempts() -> setQuizResults()    <-- triggers render with empty correctOptions
3. getCorrectOptionsForQuiz() -> setCorrectOptions()  <-- triggers second render
4. setQuizSubmitted(true)
```

**New order:**
```text
1. submitQuiz()
2. getUserAttempts()
3. getCorrectOptionsForQuiz()
4. setQuizResults()          <-- all three state updates happen together
5. setCorrectOptions()
6. setQuizSubmitted(true)
```

By collecting both async results before calling any state setters, React batches all three updates into a single render with complete data -- no flash.

