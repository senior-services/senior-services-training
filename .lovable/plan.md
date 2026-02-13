

## Revised Plan: Always-Visible Footer with Cancel Button for Video Trainings

### Problem

The video footer only appears when `videoReady` (progress >= 99). For trainings at 0% progress, no footer renders. Additionally, the footer needs a "Cancel" button matching the presentation pattern, with context-aware confirmation dialogs.

### File: `src/components/VideoPlayerFullscreen.tsx`

---

### Change 1 -- Remove `videoReady` gate from footer (line 458)

Replace:
```tsx
{!isPresentation && !wasEverCompleted && videoReady && !quizStarted && (
```
With:
```tsx
{!isPresentation && !wasEverCompleted && !quizStarted && (
```

This makes the footer always visible for uncompleted video trainings (before the quiz starts).

---

### Change 2 -- Add Cancel button and restructure footer layout (lines 460-478)

Replace the current `justify-end` single-button div with a `justify-between` layout containing a Cancel button on the left and the action button on the right:

```tsx
<div className="flex w-full items-center justify-between gap-4">
  {/* Left: Cancel */}
  <AlertDialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
    <AlertDialogTrigger asChild>
      <Button variant="outline" onClick={handleCancelClick}>
        Cancel
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {quiz ? 'Exit training?' : 'Exit training?'}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <AlertDialogDescription>
          {quiz
            ? "You haven't finished the quiz yet. You'll need to submit it to mark this training as complete."
            : "Your training progress will be saved, but the training will remain incomplete."}
        </AlertDialogDescription>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Return to Training</AlertDialogCancel>
        <AlertDialogAction onClick={handleConfirmedCancel}>
          Exit Training
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  {/* Right: Action button */}
  {quizLoading ? null : !videoReady ? (
    <ButtonWithTooltip
      tooltip="Please watch the video to continue."
      disabled
    >
      {quiz ? 'Start Quiz to Complete Training' : 'Complete Training'}
    </ButtonWithTooltip>
  ) : quiz ? (
    <Button onClick={handleStartQuiz}>
      Start Quiz to Complete Training
    </Button>
  ) : videoAttestationChecked ? (
    <Button onClick={handleCompleteTraining}>
      Complete Training
    </Button>
  ) : (
    <ButtonWithTooltip
      tooltip="Please check the acknowledgment checkbox above to proceed."
      disabled
    >
      Complete Training
    </ButtonWithTooltip>
  )}
</div>
```

The Cancel button reuses the existing `handleCancelClick`, `showCancelConfirmation`, and `handleConfirmedCancel` handlers. The confirmation copy is context-aware: if a quiz exists, it tells the user they need to submit it; if no quiz, it explains progress is saved but training remains incomplete.

---

### Change 3 -- Add completed training footer (after line 640, before `</FullscreenDialogContent>`)

```tsx
{wasEverCompleted && (
  <DialogFooter>
    <div className="flex w-full items-center justify-between gap-4">
      <Banner variant="success" size="compact" className="w-fit shrink-0">
        Training Completed
      </Banner>
      <DialogClose asChild>
        <Button>Close</Button>
      </DialogClose>
    </div>
  </DialogFooter>
)}
```

---

### Footer State Matrix

| State | Left Side | Right Side |
|-------|-----------|------------|
| Video not watched (< 99%) | Cancel (with confirmation) | Disabled: "Please watch the video" |
| Video watched, no quiz, unchecked | Cancel (with confirmation) | Disabled: "Check acknowledgment" |
| Video watched, no quiz, checked | Cancel (with confirmation) | Enabled: "Complete Training" |
| Video watched, has quiz | Cancel (with confirmation) | Enabled: "Start Quiz to Complete Training" |
| Quiz in progress | Cancel (existing quiz footer) | Submit Quiz (existing) |
| Already completed | "Training Completed" banner | "Close" button |

### Confirmation Dialog Copy

| Context | Title | Body | Stay | Leave |
|---------|-------|------|------|-------|
| Has quiz (pre-quiz) | Exit training? | You haven't finished the quiz yet. You'll need to submit it to mark this training as complete. | Return to Training | Exit Training |
| No quiz | Exit training? | Your training progress will be saved, but the training will remain incomplete. | Return to Training | Exit Training |
| Quiz started, no changes | Exit training? | (existing copy) | Return to Quiz | Exit Training |
| Quiz started, has changes | Discard unsaved progress? | (existing copy) | Continue Editing | Discard & Exit Training |

### Review

1. **Top 3 Risks:** (a) The `AlertDialog` state (`showCancelConfirmation`) is shared between the pre-quiz and in-quiz footers -- but only one footer renders at a time due to mutually exclusive conditions, so no conflict. (b) Cancel confirmation copy for the "has quiz" pre-quiz state differs from the in-quiz state -- this is intentional since the user hasn't started the quiz yet. (c) No risk of double footers since all conditions are mutually exclusive.
2. **Top 3 Fixes:** (a) Footer always visible from the moment a training opens. (b) Cancel button with context-aware confirmation across all states. (c) Completed trainings get a proper footer.
3. **Database Change:** No.
4. **Verdict:** Go.

