

## Root Cause: Footer Missing for "Workplace Learning" Training

### The Problem

The footer is missing because `wasEverCompleted` is incorrectly set to `true` for this training. Here is why:

In `src/hooks/useVideoProgress.ts` (line 189), the completion check is:

```
progressPercent >= 100 || !!progressData.completed_at
```

The "Workplace Learning" training has `progress_percent: 100` but `completed_at: null`. The `>= 100` check alone causes `wasEverCompleted = true`, which hides both footer blocks (lines 489 and 547 of VideoPlayerFullscreen).

This is a false positive -- the employee watched 100% of the video but never submitted the quiz or attestation. The system incorrectly treats it as "completed."

### The Fix (single file: `src/hooks/useVideoProgress.ts`)

**Change line 189** to only consider `completed_at` as the source of truth for completion:

```tsx
// Before
const isVideoCompleted = progressPercent >= 100 || !!progressData.completed_at;

// After
const isVideoCompleted = !!progressData.completed_at;
```

This ensures `wasEverCompleted` is only `true` when the training was explicitly completed via attestation or quiz submission (which sets `completed_at`). Reaching 100% watch progress alone no longer falsely marks a training as done.

### Impact Analysis

- **Videos without quiz**: The `CompletionOverlay` will correctly appear at 100% progress, prompting attestation. After attestation, `markComplete()` sets `completed_at`, and `wasEverCompleted` becomes `true`.
- **Videos with quiz**: Progress is capped at 99% until quiz submission (line 117). Even if progress is manually 100%, the footer now correctly renders because `completed_at` is the sole gate.
- **Already completed trainings**: No change -- they have `completed_at` set, so `wasEverCompleted` remains `true` and the footer stays hidden as intended.
- **Re-opened trainings at 100%**: The CompletionOverlay or quiz CTA will correctly reappear, giving the user a path to actually complete the training.

### Review

1. **Top 3 Risks:** (a) If any code path relies on `progressPercent >= 100` to mean "completed," it will break. All completion paths go through `markComplete()` which sets `completed_at`, so this is safe. (b) Existing trainings with 100% progress but no `completed_at` will now correctly show as incomplete -- this is the desired behavior. (c) The `isLocked` flag is also set by the same condition, so progress regression protection changes. However, `isLocked` is only meaningful during the current session and `markComplete()` also sets it independently.
2. **Top 3 Fixes:** (a) Root cause fix -- `completed_at` is the single source of truth. (b) Footer renders correctly for all non-completed trainings. (c) No UI or layout changes needed.
3. **Database Change:** No.
4. **Verdict:** Go.

