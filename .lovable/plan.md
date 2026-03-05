

## Fix: Re-render Loop in Training Dialog

### Root Cause

`flushLastPosition` in `useVideoProgress.ts` (line 195) depends on `progress` state:

```ts
}, [userEmail, videoId, progress]);
```

Every time `progress` updates (which happens continuously during video playback), `flushLastPosition` gets a **new function reference**. Since `flushLastPosition` is in the dependency array of the `initializeVideo` useEffect (line 198), each progress tick re-triggers that effect, causing the infinite re-render loop.

### Fix

**`src/hooks/useVideoProgress.ts`** — Use a `progressRef` to read the current progress value inside `flushLastPosition` without depending on the `progress` state:

1. Add a `progressRef = useRef(progress)` and keep it synced via a small effect (`progressRef.current = progress`).
2. Change `flushLastPosition` to read `progressRef.current` instead of `progress`, removing `progress` from its dependency array:

```ts
}, [userEmail, videoId]);  // no longer depends on progress
```

This stabilizes the function reference so the useEffect no longer re-fires on every progress tick.

### Files Changed

| File | Change |
|------|--------|
| `src/hooks/useVideoProgress.ts` | Add `progressRef`, use it in `flushLastPosition`, remove `progress` from its deps |

### Database Change
**No.**

