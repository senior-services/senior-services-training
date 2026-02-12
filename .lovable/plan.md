

## Hide Presentation Attestation When Quiz Exists

### Problem
For presentation trainings **with** a quiz, the standalone attestation section (below the content player) appears immediately -- gated only by the timer. The correct flow should be:

1. Timer counts down
2. User clicks "Start Quiz..."
3. Quiz questions appear
4. Attestation appears **below the last quiz question** (reusing the existing quiz attestation block)

The standalone presentation attestation should only appear for presentations **without** a quiz.

### Change (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- line 533

Add `&& !quiz` to the existing condition so the presentation-specific attestation only renders when there is no quiz attached.

| Before | After |
|--------|-------|
| `video && video.content_type === 'presentation' && !wasEverCompleted` | `video && video.content_type === 'presentation' && !wasEverCompleted && !quiz` |

The quiz attestation block (lines 549-558) already renders for any content type when `quizStarted` is true, so no other changes are needed.

### Flow After Fix

```text
Presentation + Quiz:
  Timer counting --> "Start Quiz..." button unlocks --> Click --> Quiz + Attestation appear below last question --> Submit Quiz

Presentation + No Quiz:
  Timer counting --> Attestation unlocks below content --> Check attestation --> Complete Training
```

### Review
1. **Risks:** None -- the quiz attestation block already covers presentations with quizzes; we're just removing a duplicate/premature attestation.
2. **Fixes:** Attestation only appears after "Start Quiz" is clicked, matching the video training pattern.
3. **Database Change:** No.
4. **Verdict:** Go -- single condition addition.

