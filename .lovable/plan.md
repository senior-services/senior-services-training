

## Fix: X Button Should Trigger Same Confirmation as Cancel

### Problem
The X button in `DialogHeader` (line 86 of `dialog.tsx`) uses `DialogPrimitive.Close`, which immediately closes the dialog, bypassing the confirmation flow that the Cancel button uses.

### Approach
Intercept the close in `handleDialogOpenChange` within `VideoPlayerFullscreen.tsx`. When the dialog tries to close (i.e., `open === false`) and the training is incomplete, prevent the close and instead open the appropriate confirmation dialog. This catches the X button, overlay click, and Escape key — all of which trigger `onOpenChange(false)`.

### Changes

**1. `src/components/VideoPlayerFullscreen.tsx`** — Update `handleDialogOpenChange` (lines 459-464):

```typescript
const handleDialogOpenChange = useCallback(
  (newOpen: boolean) => {
    if (!newOpen && !wasEverCompleted && !quizSubmitted) {
      // Intercept close — show the appropriate confirmation dialog
      if (quizStarted) {
        setShowCancelConfirmation(true);
      } else {
        setCancelDialogOpen(true);
      }
      return; // Don't close
    }
    onOpenChange(newOpen);
  },
  [onOpenChange, wasEverCompleted, quizSubmitted, quizStarted],
);
```

This reuses the existing `AlertDialog` instances already rendered in the footer, so no UI duplication is needed. The X button, overlay click, and Escape key will all show the same confirmation as Cancel.

### Files Changed

| File | Change |
|------|--------|
| `VideoPlayerFullscreen.tsx` | Gate `handleDialogOpenChange` to show confirmation when incomplete |

No database or schema changes.

