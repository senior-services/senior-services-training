

# Implement Two Styling Updates

## 1. Change standard due date badges from `soft-secondary` to `soft-primary`

In `src/components/TrainingCard.tsx`, update 3 occurrences:
- **Line 182**: `'soft-secondary'` to `'soft-primary'` (due within 7 days)
- **Line 191**: `'soft-secondary'` to `'soft-primary'` (due within 30 days)
- **Line 205**: `'soft-secondary'` to `'soft-primary'` (due beyond 30 days)

## 2. Stack completed footer items vertically

In `src/components/TrainingCard.tsx`, **line 327**: change the container class from `flex items-center justify-between` to `flex flex-col gap-1` so the completion date and quiz score appear on separate lines.

## 3. Update Component Gallery

In `src/pages/ComponentsGallery.tsx`, update the Badge Rules Reference table to reflect `soft-primary` for standard due date badges.

| Item | Detail |
|---|---|
| Files changed | 2 |
| Lines changed | 5 |
| Risk | Very low -- styling only |

