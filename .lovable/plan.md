

## Implement STATUS_LABELS Centralization

### Summary

Add a centralized `STATUS_LABELS` constant to the constants file and update both components to use it, ensuring consistent status terminology throughout the application.

---

### Changes

**1. Add STATUS_LABELS to constants file**

**File:** `src/constants/index.ts`

Add after `USER_ROLES` (around line 19):

```typescript
// Assignment status display labels
export const STATUS_LABELS = {
  pending: 'To-do',
  overdue: 'Overdue',
  completed: 'Completed',
  unassigned: 'Unassigned',
} as const;
```

---

**2. Update EmployeeManagement.tsx**

**File:** `src/components/dashboard/EmployeeManagement.tsx`

| Change | Location | From | To |
|--------|----------|------|-----|
| Add import | Line 22 | (after XLSX import) | Add `STATUS_LABELS` import |
| Badge text | Line 281 | `{pendingCount} To-do` | `{pendingCount} {STATUS_LABELS.pending}` |
| Export - unassigned | Line 295 | `'Unassigned'` | `STATUS_LABELS.unassigned` |
| Export - default | Line 307 | `'To-do'` | `STATUS_LABELS.pending` |
| Export - completed | Line 320 | `'Completed'` | `STATUS_LABELS.completed` |
| Export - overdue | Line 327 | `'Overdue'` | `STATUS_LABELS.overdue` |
| Export - pending (due date) | Line 329 | `'To-do'` | `STATUS_LABELS.pending` |
| Export - pending (no due) | Line 332 | `'To-do'` | `STATUS_LABELS.pending` |

Also fixes the indentation issue on line 329.

---

**3. Update AssignVideosModal.tsx**

**File:** `src/components/dashboard/AssignVideosModal.tsx`

| Change | Location | From | To |
|--------|----------|------|-----|
| Add import | Line 30 | (after Employee import) | Add `STATUS_LABELS` import |
| Badge text | Line 793 | `{status.charAt(0).toUpperCase() + status.slice(1)}` | `{STATUS_LABELS[status]}` |

---

### Files Modified

| File | Changes |
|------|---------|
| `src/constants/index.ts` | Add `STATUS_LABELS` constant (5 lines) |
| `src/components/dashboard/EmployeeManagement.tsx` | Update import + 7 status references |
| `src/components/dashboard/AssignVideosModal.tsx` | Update import + 1 status reference |

