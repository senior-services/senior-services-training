

## Align Ghost Badge Diagnostics -- Two Minor Tweaks

### Overview
Both core fixes are already deployed. Two small alignment changes bring the code to the exact specification requested.

### Changes

**1. `src/services/adminService.ts` (line 333) -- Update error message wording**

Current:
```
'Employee admin status update matched zero rows -- possible email mismatch or RLS rejection'
```

Replace with:
```
'Database rejected update: zero rows affected. This is likely an RLS policy issue.'
```

This matches the exact error string requested, making toast messages consistent with the diagnostic playbook.

**2. `src/components/dashboard/PeopleManagement.tsx` (line 94) -- Case-insensitive diagnostic log**

Current:
```typescript
console.log('[PeopleManagement] Jane data from DB:', data.data?.find(p => p.email === 'jane.doe@southsoundseniors.org'));
```

Replace with:
```typescript
console.log('[PeopleManagement] Jane DB is_admin:', data.data?.find(p => p.email?.toLowerCase() === 'jane.doe@southsoundseniors.org')?.is_admin);
```

This isolates the `is_admin` boolean directly and uses case-insensitive matching to avoid false negatives in the diagnostic output.

### Files Modified
- `src/services/adminService.ts` (line 333: error message text)
- `src/components/dashboard/PeopleManagement.tsx` (line 94: log format + case-insensitive match)

### Review
1. **Top 3 Risks**: None -- cosmetic text changes only. No logic or query changes.
2. **Top 3 Fixes**: (a) Exact error wording aligns with diagnostic playbook. (b) Case-insensitive log prevents false negatives. (c) Isolating `is_admin` in the log output makes it instantly scannable.
3. **Database Change**: No.
4. **Verdict**: Go -- two lines changed, zero risk.

