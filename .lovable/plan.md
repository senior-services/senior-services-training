

## Fix: Footer Container Visible for Completed Trainings

### Problem
The `DialogFooter` wrapper always renders, even when its child content is `null`. This means the border-top of the footer is still visible (as shown in the screenshot). Additionally, there's a flash of the Close button because `wasEverCompleted` is `false` during initialization -- it only becomes `true` after `loadExistingProgress` resolves.

Two issues to fix:
1. The `DialogFooter` container renders its border even when content is `null`.
2. During `isInitializing`, the footer falls through to a non-completed state and briefly shows buttons.

### Changes

**`src/components/VideoPlayerFullscreen.tsx`** -- wrap the `DialogFooter` in a conditional

Move the completed/initializing check **outside** the `DialogFooter` so the entire element (including its border) is suppressed:

```typescript
{/* Unified Footer */}
{!wasEverCompleted && !isInitializing && (
  <DialogFooter>
    {(() => {
      // State: quiz-done
      if (quizSubmitted) {
        // ... existing code
      }
      // State: quiz-active
      // ... existing code
      // State: content
      // ... existing code
    })()}
  </DialogFooter>
)}
```

This:
- Removes the `if (wasEverCompleted) return null` branch inside the IIFE (no longer needed).
- Adds `!isInitializing` to prevent any footer flash during the async load.
- Ensures the `DialogFooter` element itself (and its border) never renders for completed trainings or during initialization.

### Review
1. **Top 3 Risks:** (a) Footer hidden during initialization -- acceptable, content is still loading anyway. (b) No regression on incomplete trainings since the guard only blocks completed + initializing. (c) No logic changes to quiz or attestation flows.
2. **Top 3 Fixes:** (a) Eliminates border flash. (b) Eliminates button flash. (c) Single conditional wrapping.
3. **Database Change:** No.
4. **Verdict:** Go -- clean fix addressing both the container border and the button flash.
