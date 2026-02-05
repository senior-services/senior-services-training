
# Plan: Simplify Cancel Admin Invitation Dialog

## Current State

When cancelling a pending admin invitation, the dialog shows:
- A question asking if you want to cancel
- A bulleted list with "Cancel their pending admin invitation"
- A bold statement about the invitation being permanently cancelled

This is overly verbose for a simple action.

## What Changes

**File: `src/components/dashboard/AdminManagement.tsx`**

Simplify the dialog description for pending invitations to show only:

> "Are you sure you want to cancel the invitation for **email@example.com**? The invitation will be permanently cancelled."

The dialog for removing existing admins (non-pending) will remain unchanged since that action has more consequences worth explaining.

## How It Will Work

| Admin Type | Dialog Message |
|------------|----------------|
| Pending invitation | "Are you sure you want to cancel the invitation for **{email}**? The invitation will be permanently cancelled." |
| Active admin | (unchanged) Full list of consequences |

## Changes

**Lines 373-389** - Replace the complex conditional description with a simpler version:

```jsx
<AlertDialogDescription>
  {deleteConfirmAdmin?.isPending ? (
    <>
      Are you sure you want to cancel the invitation for <strong>{deleteConfirmAdmin?.email}</strong>? The invitation will be permanently cancelled.
    </>
  ) : (
    <>
      Are you sure you want to remove admin privileges from "{deleteConfirmAdmin?.email}"?
      <br />
      <br />
      This will:
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Remove their admin access to the system</li>
        <li>Restrict them to employee-level permissions</li>
        <li>Prevent them from managing other users</li>
      </ul>
      <br />
      <strong>
        This action can be reversed by adding them as an admin again.
      </strong>
    </>
  )}
</AlertDialogDescription>
```

## Summary

| File | Change |
|------|--------|
| `src/components/dashboard/AdminManagement.tsx` | Simplify pending invitation cancellation message (lines 373-389) |
