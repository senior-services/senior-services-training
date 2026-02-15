

## Fix State Persistence Bug in Admin Self-Revocation

### Overview
Ensure atomic database writes during admin demotion, eliminate redundant DB calls, and guarantee immediate data refresh for all admin viewers after a save.

### Problem Analysis
1. **Redundant employees update**: `handleToggleAdmin` (line 90-93) updates `employees.is_admin` manually, but `AdminService.removeAdminRole` (line 318-323 in adminService.ts) already does the same update. This creates a race condition where the second write could fail silently.
2. **No explicit reload after non-self saves**: `onAdminToggled` calls `loadPeople()`, which is correct, but doesn't `await` before closing the modal -- the modal closes optimistically.
3. **Self-revocation redirect fires before confirming DB write completion**: The `await handleToggleAdmin(stagedAdmin)` does await, but the redundant second write at lines 90-93 could still be in-flight.

### Changes

**1. `PersonSettingsModal.tsx` -- Remove redundant employees update from `handleToggleAdmin`**

In the demotion branch (lines 77-88), `AdminService.removeAdminRole` already:
- Deletes the `admin` role from `user_roles`
- Inserts `employee` role back
- Updates `employees.is_admin = false`

Remove the redundant `supabase.from('employees').update(...)` call at lines 90-93 for the demotion case (keep it for the promotion case where `AdminService.addAdminByEmail` handles it similarly).

Refactor `handleToggleAdmin` so the shared employees update (lines 90-93) only runs for the **promotion** path, since `removeAdminRole` already handles the demotion path's employees update internally.

**2. `PersonSettingsModal.tsx` -- Ensure self-revocation waits for full completion**

Move the self-revocation check to run only after all DB operations have fully resolved. The current order is correct (await then check), but make it explicit by restructuring:

```text
handleSave:
  1. Compute wasDemoted flag
  2. await handleToggleAdmin(stagedAdmin)  // DB writes complete here
  3. if (stagedHidden) onHide(person)
  4. Check self-revocation -> toast + onSelfDemote + return
  5. Otherwise -> onAdminToggled() + close modal
```

This is already the current order, so no structural change needed -- just the cleanup in step 1.

**3. `PeopleManagement.tsx` -- Make `onAdminToggled` await `loadPeople`**

Change `onAdminToggled={() => loadPeople()}` to ensure the people list is refreshed before the modal closes. Currently `loadPeople` is called but not awaited before the modal state updates. The real-time subscription provides eventual consistency, but an explicit refresh is more reliable.

Update the `onSelfDemote` callback to also invalidate any cached state before redirecting.

### Files Modified
- `src/components/dashboard/PersonSettingsModal.tsx` (refactor `handleToggleAdmin` to remove redundant employees write on demotion)
- `src/components/dashboard/PeopleManagement.tsx` (ensure `loadPeople` completes on admin toggle callback)

### Review
1. **Top 3 Risks**: (a) Removing the redundant employees write relies on `AdminService.removeAdminRole` always updating `employees.is_admin` -- verified it does at lines 318-323. (b) `loadPeople` is async; if it fails, modal still closes -- acceptable since real-time sub provides backup. (c) No new risk to self-revocation flow.
2. **Top 3 Fixes**: (a) Eliminates race condition from duplicate DB writes. (b) Explicit data refresh ensures badge sync for other admins. (c) Self-revocation pathway is cleaner with single atomic write path.
3. **Database Change**: No.
4. **Verdict**: Go -- surgical cleanup in two files.

