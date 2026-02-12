

## Add Recovery Effect for Non-Quiz Video Completions

### Single Change: `src/components/VideoPlayerFullscreen.tsx`

**Insert a new `useEffect` after line 266** (after the auto-start quiz effect), before `handleVideoEnded`:

```tsx
// Re-show completion overlay for non-quiz videos reopened at 99%+
useEffect(() => {
  if (!open || wasEverCompleted || quizLoading) return;
  if (!quiz && !quizStarted && progress >= 99 && overlayDismissed) {
    setShowCompletionOverlay(true);
  }
}, [open, progress, quiz, quizLoading, quizStarted, wasEverCompleted, overlayDismissed]);
```

**No other changes.** The DialogFooter, flex container spacing, and CompletionOverlay component remain untouched.

### How It Works

- When a non-quiz video training is reopened at 99%+ progress with no `completed_at`, the initialization code sets `overlayDismissed = true`.
- This new effect detects that state and forces `showCompletionOverlay(true)`, re-displaying the overlay with the attestation checkbox and "Complete Training" button.
- The `!quizLoading` guard prevents the effect from firing before quiz data resolves, avoiding conflicts with the auto-start quiz effect above it.
- Once the user completes attestation, `markComplete()` sets `completed_at`, which updates `wasEverCompleted = true`, preventing the overlay from reappearing on future reopens and hiding the footer.

### Review

1. **Top 3 Risks:** None significant -- this mirrors the existing auto-start quiz pattern.
2. **Top 3 Fixes:** (a) Non-quiz videos at 99%+ always show a completion path. (b) No layout changes. (c) Completion state correctly persists.
3. **Database Change:** No.
4. **Verdict:** Go.

