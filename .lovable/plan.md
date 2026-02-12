

## Fix Presentation Dialog Flicker During Quiz Loading

### Problem
When opening a presentation training that has a quiz, there's a visible flicker:
1. Dialog opens with `quiz = null` and `quizLoading = true`
2. The `!quiz` condition passes, briefly showing the attestation section and "Complete Training" button
3. Quiz finishes loading, `quiz` becomes populated, UI updates to hide attestation and show "Start Quiz..." button

The root cause is that the UI renders the "no quiz" state while the quiz is still being fetched.

### Solution
Add `!quizLoading` to the conditions so the "no quiz" UI elements only render once we **know** there is no quiz (loading finished and quiz is still null).

### Changes (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- 2 edits

**Edit 1: Attestation block (line 533)**
Gate the standalone presentation attestation on `!quizLoading` so it doesn't flash while the quiz fetch is in-flight.

| Before | After |
|--------|-------|
| `video.content_type === 'presentation' && !wasEverCompleted && !quiz` | `video.content_type === 'presentation' && !wasEverCompleted && !quiz && !quizLoading` |

**Edit 2: Footer "Complete Training" branch (line 674)**
Gate the no-quiz footer buttons on `!quizLoading` so the "Complete Training" button doesn't flash before switching to "Start Quiz...".

| Before | After |
|--------|-------|
| `{quiz ? (` (line 674, inside the pre-quiz/no-quiz footer branch) | `{quizLoading ? null : quiz ? (` |
| closing `)` of the ternary (line 703) | Add matching `)` to close the new outer ternary |

This means: while `quizLoading` is true, render nothing in that slot; once loaded, render either "Start Quiz..." (if quiz exists) or "Complete Training" (if no quiz).

### Flow After Fix

```text
Dialog opens:
  quizLoading=true --> No attestation shown, no footer action button shown
  quizLoading=false, quiz exists --> "Start Quiz..." button appears (no flicker)
  quizLoading=false, no quiz --> Attestation + "Complete Training" appear (no flicker)
```

### Review
1. **Risks:** Minimal -- during the brief quiz load (~100-300ms), the footer action area will be empty. This is preferable to showing incorrect UI that immediately changes.
2. **Fixes:** Eliminates the attestation/button flicker for presentation trainings with quizzes.
3. **Database Change:** No.
4. **Verdict:** Go -- two condition additions in one file.
