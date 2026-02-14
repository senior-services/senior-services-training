

## Fix: Completion Date Badge + Footer Flash (John + Jane + All Affected)

This is the same plan previously approved, confirmed to cover both users.

### Affected Records

| Employee | Training | progress_percent | completed_at |
|----------|----------|-----------------|--------------|
| John | Workplace Violence Prevention | 100 | NULL |
| Jane | PPSX | 100 | NULL |

Both have the identical data gap: 100% progress but no completion timestamp.

### Changes

**1. Database Backfill** (run once in Supabase SQL editor)

```sql
UPDATE video_progress
SET completed_at = updated_at
WHERE progress_percent = 100 AND completed_at IS NULL;
```

This fixes the badge for all affected employees in one pass. The badge will then show the actual date instead of just "Completed".

**2. `src/components/VideoPlayerFullscreen.tsx`** -- prevent footer flash on reopen

- Line 85: Change `useState(false)` to `useState(true)` so `isInitializing` starts as `true`.
- Line 149 (cleanup branch): Change `setIsInitializing(false)` to `setIsInitializing(true)` so the guard remains active between dialog close and reopen.

This ensures the footer (and its border) never renders for completed trainings, even for a single frame.

### Review
1. **Top 3 Risks:** (a) Backfill uses `updated_at` as proxy for completion time -- acceptable for legacy data. (b) `isInitializing = true` by default delays footer by one effect cycle for fresh opens -- invisible since content loads simultaneously. (c) No impact on incomplete trainings.
2. **Top 3 Fixes:** (a) Fixes badge date for all affected employees. (b) Eliminates footer flash on reopen. (c) Minimal code change -- two lines.
3. **Database Change:** Yes -- backfill `completed_at` for rows with 100% progress but no timestamp.
4. **Verdict:** Go -- confirmed to resolve both John's and Jane's issues plus any other affected records.
