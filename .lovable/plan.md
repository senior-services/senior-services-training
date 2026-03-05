

## Restore YouTube Keyboard Controls

### Root Cause

When `new YT.Player('yt-player-ID', { playerVars: {...} })` is called on an **existing iframe element**, passing `playerVars` causes the API to **destroy and recreate** the iframe. The new iframe loses focus context and keyboard interactivity. Since `rel=0`, `modestbranding=1`, `enablejsapi=1`, etc. are already baked into the iframe `src` URL (line 148), the `playerVars` in the constructor are redundant and harmful.

### Fix — `src/components/video/VideoPlayer.tsx`

**Remove `playerVars` from the `YT.Player` constructor** (lines 163–169). The iframe `src` URL already contains all necessary parameters. The constructor should only attach event handlers to the existing iframe:

```typescript
ytPlayerRef.current = new YTGlobal.Player(`yt-player-${id}`, {
  events: {
    onReady: (e: any) => { ... },
    onStateChange: (e: any) => { ... }
  }
});
```

### Why This Works

- `rel=0` and `modestbranding=1` remain in the iframe `src` query string — YouTube respects them.
- Without `playerVars`, the API wraps the existing iframe instead of replacing it, preserving keyboard focus and native controls (spacebar, arrow keys, etc.).
- Anti-skip tracking and all event handlers remain unchanged.

### Files Changed

| File | Change |
|------|--------|
| `src/components/video/VideoPlayer.tsx` | Remove `playerVars` block from `YT.Player` constructor (lines 163–169) |

