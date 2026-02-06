

# Add TrainingCard to Component Gallery + Fix Border

## Changes

### 1. Fix double border — TrainingCard.tsx (line 261)

Add `border-0` to the inner `Card` so only the outer `.training-card` wrapper provides the single 1px border. One class added, nothing else changes.

### 2. Add Training Cards section — ComponentsGallery.tsx

**Import** `TrainingCard` and `TrainingVideo` type from `@/components/TrainingCard` (line ~2). The `useToast` import is already present (line 33).

**Nav link**: Add a "Training Cards" entry to the anchor navigation list (after "Toast", around line 265).

**New section**: Insert before the "Component Updates" card (line 1665). Four example cards in a responsive grid showing all states:

- **Not Started** — 0% progress, due date set, no quiz
- **In Progress** — 45% progress, no quiz
- **Quiz Pending** — video watched (progress shown as in-progress since quiz not done), `quizPending: true`
- **Completed** — 100% progress with quiz summary (correct/total/passed)

Each card's `onPlay` triggers a toast so the interaction is visible in the gallery. Sample data uses inline `TrainingVideo` objects with placeholder thumbnails.

### Files changed

| File | Change |
|------|--------|
| `src/components/TrainingCard.tsx` | Add `border-0` to inner Card (line 261) |
| `src/pages/ComponentsGallery.tsx` | Add import, nav link, and 4-card Training Cards section |

### No database changes required

