

# TrainingCard Layout Restructuring

## Changes Overview

Three layout adjustments to completed training cards, plus full-width buttons for all states.

---

## 1. Move completion date next to "Completed" badge

The completion date (e.g., "Jan 6, 2025") will appear as small text right beside the green "Completed" badge, instead of down in the footer. The checkmark icon before the date will be removed.

**Before:** Badge on one line, date in footer with icon
**After:** `[Completed] Jan 6, 2025` on one line, small text

## 2. Quiz results below description

Quiz score (e.g., "Quiz: 80% (8/10)") will move from the footer up to sit directly under the training description. This keeps related info together and lets the button float independently at the bottom.

## 3. Full-width action buttons

"Review Training", "Continue Training", and "Start Training" buttons will stretch to fill the card width.

---

## Technical Details

### File: `src/components/TrainingCard.tsx`

**Lines 298-311** -- Update both completed badge blocks to include date inline:

```tsx
{dueDateInfo && dueDateInfo.text === 'Completed' && (
  <div className="mb-1 flex items-center gap-2">
    <Badge variant={dueDateInfo.variant} className={cn('text-xs font-medium', dueDateInfo.className)} aria-label={dueDateInfo.ariaLabel} role="status" showIcon={dueDateInfo.priority === 'high'}>
      {dueDateInfo.text}
    </Badge>
    {sanitizedVideo.completedAt && (
      <span className="text-xs text-muted-foreground">
        {format(new Date(sanitizedVideo.completedAt), 'MMM d, yyyy')}
      </span>
    )}
  </div>
)}
{trainingStatus.isCompleted && !dueDateInfo && (
  <div className="mb-1 flex items-center gap-2">
    <Badge variant="soft-success" className="text-xs font-medium" aria-label="Training completed successfully" role="status" showIcon>
      Completed
    </Badge>
    {sanitizedVideo.completedAt && (
      <span className="text-xs text-muted-foreground">
        {format(new Date(sanitizedVideo.completedAt), 'MMM d, yyyy')}
      </span>
    )}
  </div>
)}
```

**After line 321** (after description, still inside CardHeader) -- Add quiz results:

```tsx
{trainingStatus.isCompleted && sanitizedVideo.quizSummary && (
  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1" role="status" aria-label={`Quiz score: ${sanitizedVideo.quizSummary.percent}% (${sanitizedVideo.quizSummary.correct} out of ${sanitizedVideo.quizSummary.total} correct)`}>
    <ClipboardList className="w-4 h-4" aria-hidden="true" />
    <span>Quiz: {sanitizedVideo.quizSummary.percent}% ({sanitizedVideo.quizSummary.correct}/{sanitizedVideo.quizSummary.total})</span>
  </div>
)}
```

**Lines 325-344** -- Replace entire completed footer with simplified version (just the button):

```tsx
<CardFooter className="flex-none mt-auto">
  <Button variant="outline" className="w-full min-h-touch" onClick={handlePlay} onKeyDown={handleCardKeyPress} aria-label={ariaLabels.actionButton}>
    Review Training
  </Button>
</CardFooter>
```

**Lines 346-350** -- Add `w-full` to non-completed button:

```tsx
<CardFooter className="flex-none mt-auto">
  <Button variant="outline" className="w-full min-h-touch" onClick={handlePlay} onKeyDown={handleCardKeyPress} aria-label={ariaLabels.actionButton}>
    {trainingStatus.hasStarted ? "Continue Training" : "Start Training"}
  </Button>
</CardFooter>
```

**Line 11** -- Remove `CheckCircle` from imports (no longer used).

### File: `src/pages/ComponentsGallery.tsx`

**Line 1757** -- Update quiz score description from "card footer" to "below the description":

```
Displayed below the description when training is completed and quiz data is available.
```

### Cleanup

Remove `CheckCircle` from the lucide-react import in TrainingCard.tsx since it is no longer used there (it is still used in ComponentsGallery.tsx via its own import).

| Item | Detail |
|---|---|
| Files changed | 2 |
| Lines changed | ~20 |
| Risk | Low -- layout restructuring, no logic changes |

