

## Fix Inconsistent Text Color in AssignVideosModal Table

### Problem
The Due Date column in the Assign Videos modal applies a muted (dimmed) color to all values, including actual due dates. This is inconsistent with how other columns display data - where only placeholder values like "--" or "Not Completed" should appear muted, while actual data values should use the standard text color.

### Current Behavior
| Column | Actual Data | Placeholder |
|--------|-------------|-------------|
| Course | Normal color | N/A |
| Status | Badge styling | N/A |
| Due Date | **Muted (wrong)** | Muted |
| Quiz Results | Normal color | Muted |

### Expected Behavior
| Column | Actual Data | Placeholder |
|--------|-------------|-------------|
| Course | Normal color | N/A |
| Status | Badge styling | N/A |
| Due Date | **Normal color** | Muted |
| Quiz Results | Normal color | Muted |

---

### Solution

**File: `src/components/dashboard/AssignVideosModal.tsx`**

**Change (Lines 702-706):**

Current code applies muted color to all due date values:
```tsx
<TableCell>
  <span className="text-sm text-muted-foreground">
    {formatDueDate(video.id)}
  </span>
</TableCell>
```

Updated code - apply muted color only when there's no actual due date:
```tsx
<TableCell>
  <span className={cn(
    "text-sm",
    !videoDeadlines.get(video.id) && "text-muted-foreground"
  )}>
    {formatDueDate(video.id)}
  </span>
</TableCell>
```

---

### Technical Details
- Uses the existing `cn()` utility for conditional class merging
- Only applies `text-muted-foreground` when `videoDeadlines.get(video.id)` returns no value (meaning "No due date" placeholder is shown)
- Actual due dates will now display in the standard foreground color, matching the Quiz Results column behavior
- ~1 line change

