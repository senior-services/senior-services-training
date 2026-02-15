

## Fix Ghost Badge: Case-Safe Email Update and Self-Demotion Verification

### Problem
The `employees` table update in `removeAdminRole` uses `.eq('email', targetEmail)`, which is case-sensitive in PostgreSQL. If the email stored in `employees` differs in casing from the one passed in (e.g., `Jane.Doe@...` vs `jane.doe@...`), the update matches zero rows -- Supabase returns success with no error, but nothing changes.

### Why `.eq('user_id', userId)` Won't Work
The `employees` table has **no `user_id` column**. Its columns are: `id, email, full_name, created_at, updated_at, archived_at, is_admin`. There is no foreign key to `auth.users`. The email is the only link between `employees` and authenticated users.

### Changes

**1. `src/services/adminService.ts` -- Case-insensitive email match + row-count verification**

Replace the current update block (lines 322-332) with:
- Use a Supabase RPC or `.ilike()` filter (Supabase JS does not natively support case-insensitive `.eq()`).
- After the update, add `.select()` to verify rows were actually affected.
- If zero rows returned, throw an error (catches silent RLS filtering or email mismatch).

```typescript
if (targetEmail) {
  const { data: updatedRows, error: empError } = await supabase
    .from('employees')
    .update({ is_admin: false } as any)
    .ilike('email', targetEmail)
    .select('id, email, is_admin');

  console.log(`[AdminService] removeAdminRole employees update for ${targetEmail}:`, empError ? 'FAILED' : 'SUCCESS', 'rows affected:', updatedRows?.length ?? 0);

  if (empError) throw new Error('Failed to update employee admin status: ' + empError.message);
  if (!updatedRows || updatedRows.length === 0) {
    throw new Error('Employee admin status update matched zero rows -- possible email mismatch or RLS rejection');
  }
} else {
  console.warn(`[AdminService] removeAdminRole: No email found for user ${userId}`);
  throw new Error('No email found for user, cannot update admin status');
}
```

Key improvements:
- `.ilike('email', targetEmail)` -- case-insensitive match eliminates casing mismatches.
- `.select()` after `.update()` -- returns affected rows so we can verify the write actually landed.
- Zero-row check -- catches the scenario where Supabase returns no error but RLS silently filters the update.

**2. `src/components/dashboard/PeopleManagement.tsx` -- Self-demotion failsafe (no change needed)**

Already correctly implemented at line 489-491:
```typescript
onSelfDemote={() => {
  navigate('/dashboard');
  setTimeout(() => window.location.reload(), 100);
}}
```
This navigates away and forces a full page reload, purging cached admin state.

### Files Modified
- `src/services/adminService.ts` (lines 322-332: `.ilike()` + `.select()` + zero-row guard)

### Review
1. **Top 3 Risks**: (a) `.ilike()` uses LIKE semantics -- exact email strings won't have wildcard issues since emails don't contain `%` or `_`. (b) `.select()` after `.update()` adds one extra field to the response -- negligible overhead. (c) No schema change required.
2. **Top 3 Fixes**: (a) Case-insensitive match eliminates the most likely root cause. (b) Row-count verification catches silent RLS filtering. (c) Thrown errors surface failures to the user via toast.
3. **Database Change**: No.
4. **Verdict**: Go -- single file, one block replaced.

