

## Harden Real-Time Sync and Fix Silent Failure in Admin Demotion

### Root Cause Identified
In `AdminService.removeAdminRole` (lines 312-322), the `employees.is_admin = false` update is wrapped in an `if (profile?.email)` guard. If the `profiles` table lookup returns null (e.g., due to RLS timing or a missing row), the `employees` table is **never updated**, leaving the Admin badge visible -- the "Ghost Badge."

The real-time subscription (line 74) correctly listens for `employees` changes, but if no change is written, no event fires.

### Changes

**1. `adminService.ts` -- Fix silent failure and add logging (lines 311-323)**

Replace the `profiles` lookup with the `email` parameter that's already available at the call site. The caller in `PersonSettingsModal.tsx` already has `person.email` -- pass it directly to avoid the redundant lookup.

Alternative (minimal change): Add a `console.warn` when the profile is not found, and also update by `user_id` join as fallback. But the cleanest fix is to accept an optional `email` parameter.

Proposed approach: Add an optional `email` parameter to `removeAdminRole`. When provided, use it directly for the `employees` update instead of looking it up from `profiles`. Add `console.log` after the update to confirm success.

```typescript
static async removeAdminRole(userId: string, isPending: boolean = false, email?: string): Promise<void> {
  // ... existing logic for pending, admin count check, role deletion ...

  // Update employees.is_admin using provided email or profile lookup
  const targetEmail = email || profile?.email;
  if (targetEmail) {
    const { error: empError } = await supabase
      .from('employees')
      .update({ is_admin: false } as any)
      .eq('email', targetEmail);
    console.log(`[AdminService] removeAdminRole employees update for ${targetEmail}:`, empError ? 'FAILED' : 'SUCCESS');
  } else {
    console.warn(`[AdminService] removeAdminRole: No email found for user ${userId}, employees.is_admin NOT updated`);
  }
}
```

**2. `PersonSettingsModal.tsx` -- Pass email to removeAdminRole (line 86)**

Change the call from:
```typescript
await AdminService.removeAdminRole(profile.user_id, false);
```
to:
```typescript
await AdminService.removeAdminRole(profile.user_id, false, person.email);
```

This guarantees the `employees` update always runs, regardless of the `profiles` table lookup.

**3. `PeopleManagement.tsx` -- Add focus-based failsafe refresh**

Add a `useEffect` that listens for window `focus` events and calls `loadPeople()`. This acts as a safety net when real-time subscription events are missed (e.g., network blip, channel drop).

```typescript
useEffect(() => {
  const handleFocus = () => { loadPeople(); };
  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, [loadPeople]);
```

### Files Modified
- `src/services/adminService.ts` (accept optional email param, add console.log confirmation)
- `src/components/dashboard/PersonSettingsModal.tsx` (pass `person.email` to `removeAdminRole`)
- `src/components/dashboard/PeopleManagement.tsx` (add focus-based failsafe refresh)

### Review
1. **Top 3 Risks**: (a) Adding optional param to `removeAdminRole` -- backward compatible, no risk. (b) Focus event could cause frequent re-fetches -- mitigated by Supabase caching and debounce potential. (c) Console.log in production -- acceptable for debugging, can be replaced with `logger.info` for consistency.
2. **Top 3 Fixes**: (a) Eliminates silent failure when profiles lookup returns null. (b) Focus-based refresh ensures eventual consistency even if subscriptions drop. (c) Logging confirms DB write success for audit trail.
3. **Database Change**: No.
4. **Verdict**: Go -- three surgical edits across three files.
