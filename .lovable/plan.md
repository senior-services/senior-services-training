
# Plan: Show Due Date Badges for All Required Courses (with Year Handling)

## Problem
Training cards with due dates more than 30 days away don't show any badge because the current logic returns `null` for those cases.

## Solution
Add a fallback case that displays the formatted due date, including the year when the due date is in a different year than today.

## Change

**File:** `src/components/TrainingCard.tsx` (lines 194-195)

```tsx
// Before
    return null;
  }, [sanitizedVideo.dueDate, trainingStatus.isCompleted]);

// After  
    // Show formatted date for due dates beyond 30 days
    const currentYear = new Date().getFullYear();
    const dueYear = due.getFullYear();
    const showYear = dueYear !== currentYear;
    
    return {
      variant: 'secondary' as const,
      className: '',
      text: showYear ? `Due ${format(due, 'MMM d, yyyy')}` : `Due ${format(due, 'MMM d')}`,
      ariaLabel: showYear 
        ? `Training is due on ${format(due, 'MMMM d, yyyy')}` 
        : `Training is due on ${format(due, 'MMMM d')}`,
      priority: 'low' as const
    };
  }, [sanitizedVideo.dueDate, trainingStatus.isCompleted]);
```

## Updated Badge Logic

| Due Date Range | Variant | Badge Text | Example |
|----------------|---------|------------|---------|
| Completed | `success` (green) | "Completed" | Completed |
| Overdue | `destructive` (red) | "Overdue" | Overdue |
| Due today | `warning` (orange) | "Due Today" | Due Today |
| 1-7 days | `secondary` | "Due in X days" | Due in 5 days |
| 8-30 days | `secondary` | "Due in X days" | Due in 21 days |
| 30+ days (same year) | `secondary` | "Due MMM d" | Due Feb 28 |
| 30+ days (different year) | `secondary` | "Due MMM d, yyyy" | Due Feb 28, 2027 |

## Result
All required training courses with a due date will now display a badge. Dates in a different year will clearly show the year to avoid confusion.
