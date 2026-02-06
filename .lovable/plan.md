

# Update Training Cards Gallery Section

## What Changes

Simplify the Training Cards section in the Component Gallery from 4 example cards down to **2 cards** (one incomplete, one completed), and add a **badge rules reference** documenting all possible badge states and when they appear.

## Changes (1 file: `src/pages/ComponentsGallery.tsx`)

### 1. Reduce example cards to 2

Replace the current 4-card grid with 2 cards side by side:

- **Not Started** -- 0% progress, due date set (shows a "Due in X days" badge)
- **Completed** -- 100% progress with quiz summary (shows green "Completed" badge + quiz score badge)

### 2. Add badge rules reference below the cards

A clearly formatted reference section documenting every badge state the TrainingCard can display, grouped into two categories:

**Status Badges** (top-right of card, based on due date and completion):

| Badge | Appears When | Style |
|---|---|---|
| Completed | Training is 100% done | Green (success) |
| Overdue | Due date has passed, not 100% done | Red (destructive) |
| Due Today | Due date is today, not 100% done | Amber (warning) |
| Due in X days | Due within 30 days, not 100% done | Gray (secondary) |
| Due MMM d | Due date is 30+ days away, not 100% done | Gray (secondary) |
| No badge | No due date set and not completed | -- |

**Quiz Score Badges** (below title, only when training is completed with quiz data):

| Badge | Appears When | Style |
|---|---|---|
| Quiz: X% (N/M) | Score is 80% or above | Soft green |
| Quiz: X% (N/M) | Score is 60-79% | Soft amber |
| Quiz: X% (N/M) | Score is below 60% | Soft red |

**Other Indicators:**

| Indicator | Appears When |
|---|---|
| Quiz Pending label | `quizPending: true` -- video watched but quiz not taken |
| Progress bar | Always shown; color shifts based on completion percentage |

This reference section uses existing design-system primitives (Badge components rendered inline as visual examples alongside the rule text) so the styles are shown, not just described.

### Summary

| Item | Detail |
|---|---|
| Files changed | 1 (`ComponentsGallery.tsx`) |
| Example cards | 2 (down from 4) |
| Badge rules reference | Added below cards |
| New components | None |
| New dependencies | None |

