

## Persist Presentation Timer Progress Across Dialog Sessions

### Problem

When a user meets the minimum viewing time for a presentation, closes the dialog, and reopens it, the timer resets to zero and they must wait again. The database already stores `acknowledgment_viewing_seconds` but it is not fetched or used on dialog mount.

### Changes

**File 1: `src/services/api.ts` -- line 1092**

Add `acknowledgment_viewing_seconds` to the SELECT query and update the return type:

```tsx
// Return type changes from:
Promise<ApiResult<{ progress_percent: number; completed_at: string | null } | null>>
// To:
Promise<ApiResult<{ progress_percent: number; completed_at: string | null; acknowledgment_viewing_seconds: number | null } | null>>

// Select changes from:
.select('progress_percent, completed_at')
// To:
.select('progress_percent, completed_at, acknowledgment_viewing_seconds')
```

**File 2: `src/hooks/useVideoProgress.ts` -- `loadExistingProgress` (line 162)**

Return `acknowledgmentViewingSeconds` from the loaded data:

```tsx
// In the progressResult.data branch, add to the return:
return {
  completedAt: progressData.completed_at || null,
  progressPercent,
  acknowledgmentViewingSeconds: progressData.acknowledgment_viewing_seconds || null
};

// In the "no data" branch:
return { completedAt: null, progressPercent: 0, acknowledgmentViewingSeconds: null };
```

**File 3: `src/components/VideoPlayerFullscreen.tsx`**

1. **Initialize effect (lines 154-170)**: Capture the returned `acknowledgmentViewingSeconds` from `loadExistingProgress` and, if it meets the minimum, immediately set `viewingSeconds` and `checkboxEnabled`:

```tsx
const existingProgress = await loadExistingProgress();
if (existingProgress?.acknowledgmentViewingSeconds != null
    && existingProgress.acknowledgmentViewingSeconds >= presentationMinSecondsRef) {
  setViewingSeconds(existingProgress.acknowledgmentViewingSeconds);
  setCheckboxEnabled(true);
}
```

Note: `presentationMinSeconds` depends on `video` which loads in the same init function, so we will compute the threshold inline using the loaded video data (`loadResult.video`).

2. **Timer effect (line 193)**: Already short-circuits when `checkboxEnabled` is true -- no change needed.

3. **Reset effect (line 217-227)**: No change needed -- it correctly resets on close, so reopening triggers re-init which will restore from DB.

### Sequencing Detail

The init effect already calls `loadVideoData` first (which gives us `video.duration_seconds`) then `loadExistingProgress`. We will compute the minimum seconds threshold using the loaded video data before checking `acknowledgmentViewingSeconds`:

```tsx
const loadResult = await loadVideoData(videoId, initialVideo);
// ... error handling ...

if (user?.email) {
  const existingProgress = await loadExistingProgress();
  
  // Restore timer if presentation time was previously met
  const loadedVideo = loadResult.video;
  if (loadedVideo?.content_type === 'presentation' && existingProgress?.acknowledgmentViewingSeconds != null) {
    const minSeconds = loadedVideo.duration_seconds && loadedVideo.duration_seconds >= 60
      ? loadedVideo.duration_seconds : 60;
    if (existingProgress.acknowledgmentViewingSeconds >= minSeconds) {
      setViewingSeconds(existingProgress.acknowledgmentViewingSeconds);
      setCheckboxEnabled(true);
    }
  }
}
```

This requires `loadVideoData` to return the loaded video object. If it doesn't currently, we'll access it from the `video` state set by the hook (which is available by the time we process the progress).

### What the user sees

- First visit: Timer counts down normally, acknowledgment unlocks after minimum time.
- Close and reopen: Timer shows "Minimum time met" badge immediately, checkbox is enabled, attestation section is in the active (white/full-contrast) state.
- Already-completed trainings: No change -- `wasEverCompleted` still hides the footer entirely.

### Review

1. **Top 3 Risks:** (a) `loadVideoData` may not return the video object directly -- need to verify and adjust. (b) Race condition if `loadExistingProgress` resolves before video state is set -- mitigated by using `loadResult` directly. (c) `acknowledgment_viewing_seconds` is only written on final submission, not during the timer -- the timer itself does not persist partial seconds.
2. **Top 3 Fixes:** (a) Fetch stored viewing seconds from DB. (b) Skip timer when requirement already met. (c) Zero consumer-facing API changes.
3. **Database Change:** No.
4. **Verdict:** Go -- 3-file change, no schema changes needed.
