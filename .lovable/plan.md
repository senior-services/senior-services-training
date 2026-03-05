

## Investigate "Save Quiz?" Dialog Not Appearing

### Analysis

The code logic at lines 401–406 appears correct:

```typescript
const isCreatingNewQuizForSave = !quiz && questions.length > 0;
if (isCreatingNewQuizForSave && !hasAssignments) {
  setSaveQuizConfirmDialogOpen(true);
  return;
}
```

**Possible failure points:**
1. **`quiz` is not null** — If `loadQuiz` returns an existing quiz object for this training, `!quiz` evaluates to `false`. This would mean the training already has a quiz (not a first-time creation).
2. **`hasAssignments` is `true`** — The async call to `quizOperations.hasAssignments(video.id)` at line 153 might be returning `true` unexpectedly (e.g., stale assignment data in `video_assignments`).
3. **Early return before line 401** — Validation failure at line 378 or a caught error in the version check block could prevent reaching line 401, though this would also prevent the save from happening at all.
4. **`questions.length === 0`** — If questions array is empty when Save is clicked, the condition fails. This seems unlikely but worth confirming.

### Plan — `src/components/EditVideoModal.tsx`

Add temporary `console.log` statements inside `handleSave` to trace all relevant values:

1. **At the top of `handleSave`** (after line 361): Log `quiz`, `questions.length`, and `hasAssignments`.

2. **Just before the new-quiz confirmation check** (before line 402): Log the computed `isCreatingNewQuizForSave` value and the final condition result.

3. **Inside the version check block** (line 388): Log that the version check is being entered, to confirm whether an early return is happening there.

This is a single-file, diagnostic-only change — no logic modifications.

### Files Changed

| File | Change |
|------|--------|
| `src/components/EditVideoModal.tsx` | Add 3 `console.log` statements in `handleSave` for debugging |

