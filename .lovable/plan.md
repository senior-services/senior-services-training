

## Fix: Jane Doe Missing Admin Role in `user_roles`

### Problem
Jane Doe (`jane.doe@southsoundseniors.org`) is marked as `is_admin = true` in the `employees` table, which lets her see the Admin Dashboard. However, she has no corresponding row in the `user_roles` table. All database security policies check `user_roles` to verify admin access, so every admin action (like granting admin to someone else) is blocked with "new row violates row-level security policy."

### Root Cause
A data inconsistency: `employees.is_admin` was set to `true` without a matching `user_roles` entry being created. The other three admins all have both records in sync.

### Fix (Database Migration)
A single SQL statement to insert the missing admin role for Jane:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('b8f92745-f8c0-48ab-a22b-86aa6d39d604', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### No Code Changes Required
The application code and RLS policies are functioning correctly. This is purely a data sync issue for one user.

### Review
1. **Top 3 Risks:** (a) None -- ON CONFLICT ensures idempotency. (b) No schema changes. (c) No code changes.
2. **Top 3 Fixes:** (a) Restores Jane's ability to perform all admin operations. (b) Aligns `user_roles` with `employees.is_admin`. (c) Single-row insert with no side effects.
3. **Database Change:** Yes -- one row inserted into `user_roles`.
4. **Verdict:** Go -- minimal, targeted data fix.
