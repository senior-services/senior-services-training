

## Fix the Heartbeat Write -- Stale Closure + Interval Reset Bug

### Root Cause

The periodic save `useEffect` has `viewingSeconds` in its dependency array. Since the timer increments `viewingSeconds` every 1 second, React tears down and recreates the interval every single second. The interval callback never survives long enough to fire at the 10-second mark. Result: **zero writes ever happen**.

### Fix (single file: `src/components/VideoPlayerFullscreen.tsx`)

**A. Add a ref to track the latest `viewingSeconds`:**

After line 109 (`const [viewingSeconds, setViewingSeconds] = useState(0);`), add:

```tsx
const viewingSecondsRef = useRef(0);
```

Then add a sync effect to keep the ref current:

```tsx
useEffect(() => {
  viewingSecondsRef.current = viewingSeconds;
}, [viewingSeconds]);
```

**B. Rewrite the periodic save `useEffect` (lines 232-245):**

Remove `viewingSeconds` and `progress` from the dependency array. Use the ref inside the interval callback instead. Change interval to 5 seconds. Add success/error logging.

```tsx
useEffect(() => {
  if (!open || !video || video.content_type !== 'presentation' || !user?.email || !videoId) return;

  const saveInterval = setInterval(async () => {
    const currentSeconds = viewingSecondsRef.current;
    if (currentSeconds > 0) {
      console.log('[Timer Sync] Attempting save, seconds:', currentSeconds);
      const result = await progressOperations.updateByEmail(
        user.email!, videoId, 0, undefined, undefined, currentSeconds
      );
      if (result.success) {
        console.log('[Timer Sync] Successfully saved seconds:', currentSeconds);
      } else {
        console.error('[Timer Sync] Failed to save:', result.error);
      }
    }
  }, 5000);

  return () => clearInterval(saveInterval);
}, [open, video, user?.email, videoId]);
```

Key changes:
- `viewingSecondsRef.current` instead of `viewingSeconds` state -- no stale closure, no interval reset
- `progress` argument hardcoded to `0` since we only care about saving `acknowledgment_viewing_seconds`; the DB function uses `COALESCE` so it won't overwrite existing `progress_percent` or `completed_at`
- Interval changed from 10s to 5s
- Success and error logging added
- Dependency array: only `[open, video, user?.email, videoId]` -- stable values that don't change every second

**C. Keep the existing restore logic and debug logs unchanged** -- they are correct and will now have data to read.

### What changes

| Item | Before | After |
|------|--------|-------|
| Interval lifetime | Recreated every 1s (never fires) | Stable, fires every 5s |
| viewingSeconds access | Stale closure (always 0) | Ref (always current) |
| DB writes during viewing | Zero | Every 5 seconds |
| Console feedback | None | `[Timer Sync]` logs |

### Review

1. **Top 3 Risks:** (a) `progress: 0` in the heartbeat -- safe because the DB function uses `COALESCE` and won't overwrite existing higher values. (b) Ref pattern is standard React for intervals. (c) 5-second writes add ~12 writes per minute per user -- acceptable for training app.
2. **Top 3 Fixes:** (a) Ref eliminates stale closure. (b) Stable dependency array prevents interval thrashing. (c) Explicit logging for immediate verification.
3. **Database Change:** No.
4. **Verdict:** Go -- single-file fix.
