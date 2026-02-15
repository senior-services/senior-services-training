

## Prevent Admin Self-Demotion and Clean Up Diagnostics

### Overview
Disable the admin toggle when editing one's own account, add contextual guidance, and remove obsolete self-demotion logic and diagnostic logs.

### Changes

**1. `src/components/dashboard/PersonSettingsModal.tsx` -- Disable self-demotion + helper text**

- Compute `isSelf` from `currentUserEmail` and `person.email` (case-insensitive).
- Set the admin checkbox `disabled` to `true` when `isSelf` (or when `isSaving`).
- Add a `<p className="form-additional-text">` below the checkbox with the guidance message when `isSelf`.
- Remove the `onSelfDemote` prop from the interface and all internal references (the self-demotion block in `handleSave` at lines 117-125, and the prop declaration at line 32/42).

```tsx
// Computed near top of component body:
const isSelf = !!(currentUserEmail && person?.email &&
  person.email.toLowerCase() === currentUserEmail.toLowerCase());

// Checkbox:
<Checkbox
  id="admin-toggle"
  checked={stagedAdmin}
  onCheckedChange={(checked) => setStagedAdmin(checked === true)}
  disabled={isSaving || isSelf}
  aria-label="Toggle administrative privileges"
/>

// Below the checkbox Label, conditionally:
{isSelf && (
  <p className="form-additional-text">
    Admins cannot remove their own administrative privileges. To change your access level, please contact another administrator.
  </p>
)}
```

**2. `src/components/dashboard/PeopleManagement.tsx` -- Remove self-demotion callback + diagnostic log**

- Line 94: Remove the `console.log('[PeopleManagement] Jane DB is_admin:...')` diagnostic.
- Lines 489-492: Remove `onSelfDemote` prop from `<PersonSettingsModal>`.
- The `useNavigate` import and `navigate` variable can also be removed if no other code uses them (will verify during implementation).

**3. `src/services/adminService.ts` -- Remove diagnostic log, keep error guards**

- Line 329: Remove `console.log('[AdminService] removeAdminRole employees update...')`.
- Line 336: Remove `console.warn('[AdminService] removeAdminRole: No email found...')`.
- Keep the `throw` statements on lines 331-333 and 337 -- these are production-grade error guards.

### Files Modified
- `src/components/dashboard/PersonSettingsModal.tsx` (disable checkbox for self, add helper text, remove `onSelfDemote` prop and logic)
- `src/components/dashboard/PeopleManagement.tsx` (remove `onSelfDemote` callback, remove diagnostic log)
- `src/services/adminService.ts` (remove diagnostic console.log/warn, keep throws)

### Review
1. **Top 3 Risks**: (a) Removing `onSelfDemote` is safe because the checkbox is now disabled for self -- the code path is unreachable. (b) `isSelf` uses case-insensitive comparison, consistent with the `.ilike()` fix. (c) Helper text uses only `.form-additional-text` -- no utility classes.
2. **Top 3 Fixes**: (a) UI-level prevention of self-demotion aligns with HR best practices. (b) Diagnostic logs removed to keep production console clean. (c) Error throws retained as permanent safety guards.
3. **Database Change**: No.
4. **Verdict**: Go -- three files, clean removal of obsolete code plus one UX addition.

