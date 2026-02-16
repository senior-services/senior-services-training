

## Fix: Completed Training Showing "Completed" Instead of Date

### Root Cause

A race condition between two database writes:

1. **`markComplete()`** fires `updateProgressToDatabase(100, true)` -- sets `progress_percent = 100` AND `completed_at = now()`. Correct.
2. **Debounced progress update** (1-second timer from line 128) fires `updateProgressToDatabase(100)` without `forceComplete` -- sets `progress_percent = 100` AND `completed_at = NULL`.

If call #2 arrives at the database **after** call #1, the `ON CONFLICT` clause unconditionally overwrites `completed_at` back to NULL:

```sql
ON CONFLICT (employee_id, video_id)
DO UPDATE SET
  completed_at = EXCLUDED.completed_at,  -- Overwrites with NULL!
```

This is why Jane's PPSX record shows `progress_percent = 100` but `completed_at = NULL`.

### Fix (Two Parts)

**Part A -- Database Function (defense in depth):**

In `update_video_progress_by_email`, change the `ON CONFLICT` clause so `completed_at` is never overwritten with NULL once it has a value:

```sql
completed_at = COALESCE(EXCLUDED.completed_at, video_progress.completed_at),
```

This ensures that even if a stale/debounced call arrives with `completed_at = NULL`, the existing timestamp is preserved.

**Part B -- Client-side guard (prevent the race):**

In `src/hooks/useVideoProgress.ts`, the `markComplete` function already clears the pending timeout (lines 134-136). However, the debounced `updateProgress` call at line 128 can still fire `updateProgressToDatabase(100)` if the video reaches 100% naturally before the user clicks "Complete Training." Add a guard so that once `isLocked` is true, the debounced write is skipped. The current guard at line 108 only checks `progressPercent < 100`, so a 100% debounced write slips through.

**Part C -- Data fix:**

Run a one-time SQL update to fix Jane's PPSX record (and any other affected records):

```sql
UPDATE video_progress
SET completed_at = updated_at
WHERE progress_percent = 100
  AND completed_at IS NULL;
```

### Files Changed

| File | Change |
|---|---|
| DB function `update_video_progress_by_email` | `COALESCE` guard on `completed_at` in ON CONFLICT |
| `src/hooks/useVideoProgress.ts` | Skip debounced DB write when `isLocked` is true |

### Review

1. **Top 3 Risks:** (a) The `COALESCE` change means `completed_at` can never be explicitly cleared -- acceptable since completion is permanent per business rules. (b) The backfill sets `completed_at = updated_at` which may not be the exact completion moment, but is the best available approximation. (c) Must verify the same pattern in the 4-parameter overload of `update_video_progress_by_email`.
2. **Top 3 Fixes:** (a) Eliminates the race condition permanently at the DB layer. (b) Client guard prevents unnecessary writes. (c) Backfill restores correct badge display immediately.
3. **Database Change:** Yes -- `COALESCE` guard in function + one-time data backfill.
4. **Verdict:** Go.
