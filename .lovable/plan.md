

# Compact Quiz Completion Banner

## What changes

The quiz completion banner becomes shorter and more streamlined: reduced padding, "Your final score" text removed, percentage and score badge aligned side-by-side, and three small quality fixes added (accessibility label, zero-question guard, consistent icon sizes).

## How

**File: `src/components/quiz/QuizScoreSummary.tsx`**

1. **Guard against zero questions** -- add an early check so dividing by zero won't produce "NaN%"
2. **Update icon sizes** in `getScoreIcon()` from `w-6 h-6` to `w-5 h-5`
3. **Add `role="status"` and `aria-label`** to the outer `Card` for screen readers
4. **Use `cn()` utility** for merging dynamic classes on `Card`
5. **Reduce `CardContent` padding** from `p-6` to `p-3`
6. **Reduce icon container padding** from `p-3` to `p-2`
7. **Remove "Your final score" subtitle**
8. **Remove "Quiz Complete!" heading** (icon + score speak for themselves)
9. **Flatten right side** -- put percentage and badge in a single `flex items-center gap-2` row

### Resulting component (simplified view):

```
[icon] [XX%] [N of M correct]
```

| Item | Detail |
|---|---|
| Files changed | 1 |
| Lines changed | ~20 |
| Risk | Minimal -- visual and accessibility-only changes |

