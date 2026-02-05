

## Change Unassigned Badge to Ghost-Tertiary Variant

### Summary

Update the "Unassigned" status badge in the Edit Assignments modal to use the `ghost-tertiary` variant instead of `soft-tertiary` for a more subtle appearance.

---

### Change Required

**File:** `src/components/dashboard/AssignVideosModal.tsx`

Update line 505:

| Before | After |
|--------|-------|
| `return "soft-tertiary";` | `return "ghost-tertiary";` |

---

### Visual Change

**Before:** Unassigned badge has a muted gray background (soft style)

**After:** Unassigned badge has no background, just gray text (ghost style)

---

### Context

The `getStatusBadgeVariant` function now maps statuses to:
- Completed → `soft-success` (green with background)
- Overdue → `soft-destructive` (red with background)
- Pending (To-do) → `soft-primary` (blue with background)
- **Unassigned** → `soft-tertiary` → **`ghost-tertiary`** (gray text, no background)

This makes "Unassigned" items appear more subtle/de-emphasized compared to actionable statuses.

