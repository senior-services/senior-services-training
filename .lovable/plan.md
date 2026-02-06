

# Fix: Align Employee Dashboard Completion Logic (with Review Fixes)

## What This Fixes

When a video has a quiz attached, the employee dashboard was showing it as "Completed" after just watching the video. The admin dashboard correctly required both the video AND the quiz to be done. This fix makes them match.

## Changes

### 1. TrainingVideo interface (TrainingCard.tsx)

Add an optional `quizPending` field to the `TrainingVideo` interface so the data model explicitly signals "this video's quiz hasn't been taken yet" instead of using a misleading 99% progress hack.

```tsx
// Add to TrainingVideo interface:
quizPending?: boolean;
```

No other changes to TrainingCard — when `progress < 100`, the card already shows the correct "in progress" or "not started" state.

### 2. EmployeeDashboard.tsx — Fetch quiz video IDs (reuse admin pattern)

Inside `loadAssignedVideos`, after the existing quiz attempts fetch, add a lightweight query to find which videos have quizzes. This is the same pattern the admin dashboard already uses.

```tsx
// After the quiz attempts fetch block (around line 129):
let quizVideoIds = new Set<string>();
try {
  const { data: quizzesData } = await supabase.from("quizzes").select("video_id");
  quizVideoIds = new Set(quizzesData?.map(q => q.video_id) || []);
} catch (error) {
  logger.warn("Failed to load quiz video IDs", { error });
}
```

Store this in a new state variable:
```tsx
const [videoIdsWithQuizzes, setVideoIdsWithQuizzes] = useState<Set<string>>(new Set());
```

### 3. EmployeeDashboard.tsx — Update completion logic in transformToTrainingVideo

Replace lines 234-244 with quiz-aware logic using `null` (not `undefined`) for cleared dates:

```tsx
const videoMarkedComplete = assignment?.completed_at || assignment?.progress_percent === 100;
const hasQuiz = videoIdsWithQuizzes.has(video.id);
const quizDone = quizAttemptsByVideo[video.id] != null;

let effectiveProgress: number;
let effectiveCompletedAt: string | null = assignment?.completed_at ?? null;
let quizPending = false;

if (hasQuiz) {
  if (videoMarkedComplete && quizDone) {
    effectiveProgress = 100;
    effectiveCompletedAt = effectiveCompletedAt || quizAttemptsByVideo[video.id]?.completed_at || null;
  } else {
    effectiveProgress = Math.max(0, Math.min(100, assignment?.progress_percent || 0));
    effectiveCompletedAt = null;
    if (videoMarkedComplete && !quizDone) {
      quizPending = true;
    }
  }
} else {
  effectiveProgress = videoMarkedComplete
    ? 100
    : Math.max(0, Math.min(100, assignment?.progress_percent || 0));
}
```

Pass `quizPending` into the returned `TrainingVideo` object.

Add `videoIdsWithQuizzes` to the `useOptimizedCallback` dependency array for `transformToTrainingVideo`.

## What's Different from the Original Plan

| Original Plan | This Version |
|---|---|
| Used 99% progress as a workaround | Uses explicit `quizPending` flag |
| Used `undefined` for cleared dates | Uses `null` for consistency with DB conventions |
| Added a new separate DB query | Same query, but minimal and mirrors admin pattern |

## Summary

- 2 files changed: `EmployeeDashboard.tsx`, `TrainingCard.tsx` (interface only)
- 1 small query added (same pattern admin already uses)
- No database migration needed
- No new dependencies

