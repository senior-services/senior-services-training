

## Add Tooltip to Disabled "Start Quiz to Complete Training" Button

### Problem
When the presentation timer is still running, the "Start Quiz to Complete Training" button is disabled but provides no tooltip explaining why. The no-quiz variant ("Complete Training") already uses `ButtonWithTooltip` with the message "Please wait for the viewing timer to complete." -- this same pattern should apply here.

### Fix (1 file)

**`src/components/VideoPlayerFullscreen.tsx`** -- lines 673-683

Replace the plain `<Button>` with a conditional that uses `ButtonWithTooltip` when `timerActive` is true, and a regular `<Button>` when the timer is done:

```text
Before:  <Button disabled={timerActive} onClick={handleStartQuiz}>
After:   timerActive
           ? <ButtonWithTooltip tooltip="Please wait for the viewing timer to complete." disabled>
           : <Button onClick={handleStartQuiz} className="animate-scale-in">
```

This reuses the exact same tooltip copy from the no-quiz path (line 687).

### Review
1. **Risks:** None -- same pattern already used 10 lines below.
2. **Fixes:** Disabled quiz-start button now explains itself via tooltip.
3. **Database Change:** No.
4. **Verdict:** Go.

