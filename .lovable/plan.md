

## Fix Presentation Timer Persistence -- 3 Issues

### Root Cause Analysis

There are **two bugs** and **one missing feature** preventing timer persistence:

1. **The Write is Missing**: `acknowledgment_viewing_seconds` is only saved when the user clicks "Complete Training" (line 313 of `VideoPlayerFullscreen.tsx`). During the countdown, the timer value is never synced to the database. So if a user watches for 60 seconds and closes without completing, reopening always shows zero.

2. **The Read Has a Shape Bug**: Line 169 uses `('data' in loadResult ? loadResult.data : null)`. When `initialVideo` is provided (the common case from employee dashboard), `loadVideoData` returns `{ success: true, data: initialVideo }` -- this works. But when `initialVideo` is `undefined`, the `withErrorHandler` wrapper returns `{ success: true, data: videoData }` -- also works. However, if `loadResult` is `{ success: false, error: '...' }`, there is no `data` key, so `'data' in loadResult` is `false` and `initialVideo` fallback kicks in. This path is fine. **The real issue is #1 above -- there's simply no data to read.**

3. **Partial Progress Not Restored**: Even once the write is fixed, the current logic only restores the timer if `acknowledgmentViewingSeconds >= minSeconds`. If a user watched 30 of 60 seconds, closed, and reopened, they'd still start at zero. The user wants partial progress restored too.

### Changes

**File 1: `src/components/VideoPlayerFullscreen.tsx`**

A. **Add a periodic save of `viewingSeconds`** -- new `useEffect` after the timer effect (after line 226). Every 10 seconds of viewing, sync the current `viewingSeconds` to the database:

```tsx
// Periodic save of viewing seconds for presentations
useEffect(() => {
  if (!open || !video || video.content_type !== 'presentation' || !user?.email || !videoId) return;
  
  const saveInterval = setInterval(() => {
    if (viewingSeconds > 0) {
      progressOperations.updateByEmail(
        user.email!, videoId, progress, undefined, undefined, viewingSeconds
      );
    }
  }, 10000); // Save every 10 seconds
  
  return () => clearInterval(saveInterval);
}, [open, video, user?.email, videoId, viewingSeconds, progress]);
```

B. **Loosen the restore logic** (lines 170-177) -- restore `viewingSeconds` if any positive value exists, then check threshold separately:

```tsx
if (loadedVideo?.content_type === 'presentation'
    && existingProgress?.acknowledgmentViewingSeconds != null
    && existingProgress.acknowledgmentViewingSeconds > 0) {
  setViewingSeconds(existingProgress.acknowledgmentViewingSeconds);
  const minSeconds = loadedVideo.duration_seconds && loadedVideo.duration_seconds >= 60
    ? loadedVideo.duration_seconds : 60;
  if (existingProgress.acknowledgmentViewingSeconds >= minSeconds) {
    setCheckboxEnabled(true);
  }
}
```

C. **Add debug logging** (temporary, inside the init block) so we can verify values on next test:

```tsx
console.log('[Timer Debug] loadedVideo:', loadedVideo?.content_type, 'duration:', loadedVideo?.duration_seconds);
console.log('[Timer Debug] existingProgress:', existingProgress?.acknowledgmentViewingSeconds);
```

### What the User Sees

| Scenario | Before | After |
|----------|--------|-------|
| Watch 30s of 60s, close, reopen | Timer resets to 0:00 | Timer resumes at 0:30 |
| Meet 60s requirement, close, reopen | Timer resets to 0:00 | "Minimum time met" badge, checkbox enabled immediately |
| Complete training, reopen | Footer hidden (unchanged) | Footer hidden (unchanged) |

### Review

1. **Top 3 Risks:** (a) The 10-second save interval adds DB writes -- acceptable for a training app with low concurrency. (b) `updateByEmail` with `undefined` for `completedAt` and `acknowledgedAt` uses `COALESCE` in the DB function, so it won't overwrite existing completion data. (c) Progress save during timer doesn't mark as complete -- only saves the seconds column.
2. **Top 3 Fixes:** (a) Periodic heartbeat ensures viewing seconds survive dialog close. (b) Loosened restore logic handles both partial and full progress. (c) Debug logging for immediate verification.
3. **Database Change:** No.
4. **Verdict:** Go -- single-file change.

