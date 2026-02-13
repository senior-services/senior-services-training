

## Fix: Button Flash -- Race Between Quiz Load and Progress Load

### Root Cause (updated)

The previous guard (`progress >= 99 && quiz && !quizLoading && !quizStarted`) fails because of a race condition in `initializeVideo`:

```text
1. open=true --> initializeVideo() starts
2. loadVideoData() resolves --> quiz loaded, quizLoading=false
   ** React re-renders here **
   progress is still 0, guard doesn't match
   --> "Start Quiz to Complete Training" button FLASHES (disabled, but visible)
3. loadExistingProgress() resolves --> progress=99
   ** React re-renders here **
   guard now matches, button suppressed --> null
4. Auto-start effect fires --> quizStarted=true
   --> Footer switches to quiz-active with "Submit Quiz"
```

The flash happens at step 2: quiz data arrives before progress data.

### Solution

Add an `isInitializing` state that is `true` while `initializeVideo` is running. Suppress the entire primary button in the "content" footer while initializing. This eliminates the flash regardless of which async call resolves first.

### Changes

**`src/components/VideoPlayerFullscreen.tsx`**

1. Add state (near line 84):
   ```typescript
   const [isInitializing, setIsInitializing] = useState(false);
   ```

2. Wrap `initializeVideo` (lines 138-165): Set `isInitializing = true` at start, `false` at end (in a `finally` block or after both loads complete).

3. Update the primary button guard (line 611): Replace the complex condition with a simpler one:
   ```typescript
   {quizLoading || isInitializing || (!isPresentation && progress >= 99 && quiz && !quizLoading && !quizStarted) ? null : ...}
   ```

This way, while video data and progress are both loading, no primary button renders at all -- preventing any flash. Once initialization completes, the existing guard handles the auto-start transition frame.

### Review
1. **Top 3 Risks:** (a) Button might be hidden slightly longer during slow loads -- acceptable since the user sees loading content anyway. (b) No impact on presentation or completed states. (c) No logic change to auto-start effect.
2. **Top 3 Fixes:** (a) Eliminates the root cause (async race). (b) Simple boolean guard. (c) Works for all timing scenarios.
3. **Database Change:** No.
4. **Verdict:** Go -- addresses the actual race condition the previous fix missed.

