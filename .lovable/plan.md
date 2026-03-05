

## Furthest-Point Tracking for Training Videos

### Overview
Implement anti-skip protection on video trainings by tracking the furthest timestamp watched, preventing forward seeks beyond that point, and persisting this value in the database for session continuity.

### Database Change

**Add column to `video_progress`:**
```sql
ALTER TABLE video_progress ADD COLUMN furthest_watched_seconds integer DEFAULT 0;
```

**Update `update_video_progress_by_email` function** to accept a new `p_furthest_watched_seconds` parameter and persist it using `GREATEST` to never regress:
```sql
furthest_watched_seconds = GREATEST(
  COALESCE(EXCLUDED.furthest_watched_seconds, 0),
  COALESCE(video_progress.furthest_watched_seconds, 0)
)
```

### Files Changed

| File | Change |
|------|--------|
| DB migration | Add `furthest_watched_seconds` column; update RPC function |
| `src/services/api.ts` | Add `furthestWatchedSeconds` param to `updateByEmail`; return it from `getByEmailAndVideo` |
| `src/hooks/useVideoProgress.ts` | Track `furthestWatchedSeconds` state; persist on every debounced write; expose it and a setter; restore on `loadExistingProgress` |
| `src/components/video/VideoPlayer.tsx` | Accept `furthestWatchedSeconds` + `onFurthestUpdate` props; enforce seek restriction in YouTube polling loop (snap back if `currentTime > furthest + 2s buffer`); enforce on HTML5 via `seeking` event; update furthest on each tick |
| `src/components/content/ContentPlayer.tsx` | Pass through new props from parent |
| `src/components/VideoPlayerFullscreen.tsx` | Wire `furthestWatchedSeconds` from `useVideoProgress` through `ContentPlayer` → `VideoPlayer` |

### Behavior Details

**YouTube videos** (primary use case):
- In the 1-second polling interval, compare `getCurrentTime()` to `furthestWatchedSeconds`
- If `currentTime > furthestWatched + 2` (2s buffer for natural playback), call `player.seekTo(furthestWatched, true)`
- Otherwise, update `furthestWatched = max(furthestWatched, currentTime)`
- Report furthest point upward for persistence

**HTML5 videos:**
- Listen to `seeking` event; if `currentTime > furthestWatchedSeconds`, snap to `furthestWatchedSeconds`
- Update furthest on `timeupdate`

**Persistence:**
- `useVideoProgress.updateProgressToDatabase` sends `furthestWatchedSeconds` alongside progress
- `loadExistingProgress` restores it so reopening the dialog resumes with the correct cap
- DB function uses `GREATEST` guard to prevent regression

**Unlock logic** (already exists):
- The `videoReady` flag (`progress >= 99`) already gates the attestation/quiz section — no change needed there

### Risk Assessment
1. **YouTube API seek enforcement** (Medium) — 2-second buffer prevents false triggers from normal playback jitter
2. **GREATEST guard on DB** (Low) — Mirrors existing `COALESCE` pattern for `completed_at`
3. **Google Drive videos** (N/A) — These use estimated watch-time tracking without seek control; restriction not enforceable on opaque iframes. No change.

