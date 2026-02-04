

## Apply No-Wrap Styling to Date and Quiz Results Columns

### Changes to Make

**File: `src/components/dashboard/AssignVideosModal.tsx`**

**Lines 718-723** - Add `whitespace-nowrap` to both columns:

```tsx
<TableCell>
  <span className="text-sm whitespace-nowrap">{formatDueDate(video.id)}</span>
</TableCell>
<TableCell>
  <span className="text-sm whitespace-nowrap">{getQuizResults(video.id)}</span>
</TableCell>
```

### Result

| Column | Wrapping |
|--------|----------|
| Course | Allowed |
| Status | No wrap (badge) |
| Date | No wrap ✓ |
| Quiz Results | No wrap ✓ |

Click **Approve** to implement these changes.

