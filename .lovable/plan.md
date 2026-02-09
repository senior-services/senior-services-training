

## Fix: Reset Add New Course Dialog on Every Open

### Problem
When the dialog closes after saving a course (and subsequently deleting it), the form fields retain their previous values because the state is only reset in `handleClose` (the Cancel button handler). The `onOpenChange` prop is passed directly to the Dialog without resetting state.

### Solution
Add a reset effect that clears all form fields whenever the dialog opens, ensuring a clean form every time.

**File: `src/components/content/AddContentModal.tsx`**

1. Add a `useEffect` that watches the `open` prop. When `open` becomes `true`, reset all form state to defaults (title, description, url, contentType, errors, assignToAll, dueDateOption, noDueDateRequired).

### Review
- **Top 5 Risks**: None -- straightforward state reset on open.
- **Top 5 Fixes**: (1) Add useEffect to reset form on open.
- **Database Change Required**: No
- **Go/No-Go**: Go
