

## Unified People Model, Settings Pattern, and Admin Routing Refactor

### Overview

This refactor consolidates the separate "Employees" and "Admins" management into a unified "People" model, adds dedicated admin routing (`/admin`), introduces environmental header signaling, and standardizes management actions behind a Settings modal pattern.

---

### 1. Database Changes

**A. Add `is_admin` column to `employees` table**

```sql
ALTER TABLE employees ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
```

**B. Backfill existing admins into employees table**

Insert rows for any admin users who don't already have an employee record, and set `is_admin = true` for those who do:

```sql
-- Insert missing admin users into employees
INSERT INTO employees (email, full_name, is_admin)
SELECT p.email, p.full_name, true
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.user_id
WHERE ur.role = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM employees e WHERE lower(e.email) = lower(p.email)
  );

-- Mark existing employee rows that are also admins
UPDATE employees e
SET is_admin = true
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.user_id
WHERE lower(e.email) = lower(p.email)
  AND ur.role = 'admin';
```

**C. Update `handle_new_user()` trigger**

Modify so that ALL users (including admins) get an employee row. Admins get `is_admin = true`:

```sql
-- Key change: always insert into employees, set is_admin based on role
INSERT INTO public.employees (email, full_name, is_admin)
VALUES (NEW.email, NEW.raw_user_meta_data->>'full_name', user_role = 'admin')
ON CONFLICT (email) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      is_admin = EXCLUDED.is_admin
  WHERE employees.full_name IS NULL OR employees.full_name = '';
```

**D. Update `promote_user_to_admin()` function**

Instead of deleting from employees, set `is_admin = true`:

```sql
-- Replace: DELETE FROM employees WHERE email = p_email
-- With:
UPDATE employees SET is_admin = true WHERE lower(email) = p_email;
-- If no row exists, insert one
INSERT INTO employees (email, is_admin) VALUES (p_email, true)
ON CONFLICT (email) DO UPDATE SET is_admin = true;
```

**E. Update `get_all_employee_assignments()` function**

Add `is_admin` to the returned columns so the People tab can display the admin badge.

**F. Update `get_hidden_employee_assignments()` similarly**

**G. Security note**: The `user_roles` table and `has_role()` function remain the authoritative source for RLS enforcement. The `is_admin` column on `employees` is a convenience/display field only -- all security policies continue to use `has_role()`.

---

### 2. Routing Changes

**`src/App.tsx`**

- Add `/admin` route that renders `AdminDashboard` (guarded: only if `role === 'admin'`)
- Change `/dashboard` to always render `EmployeeDashboard` (personal training view) for all authenticated users
- Auth redirect after login: admins go to `/admin`, employees go to `/dashboard`
- Non-admins visiting `/admin` get redirected to `/dashboard`

```text
/ or /auth       --> Auth page (if not logged in)
/dashboard       --> EmployeeDashboard (all users see their personal trainings)
/admin           --> AdminDashboard (admin-only, guarded)
```

---

### 3. Header Refactor

**`src/components/Header.tsx`**

- Accept `isAdmin` boolean prop (in addition to current `userRole`)
- Accept `currentView` prop: `'admin'` or `'dashboard'`
- **Dynamic background**:
  - `/dashboard` (employee view): `bg-background-header` (current navy)
  - `/admin` (admin view): Use `--attention` variable (orange)
- **Admin badge**: If `isAdmin`, render the orange "Admin" badge to the left of the user icon
- **User dropdown** (replace plain Logout link):
  - Standard user: `Logout` only
  - Admin user: `My Personal Trainings` (link to `/dashboard`), `Admin Dashboard` (link to `/admin`), `Logout`
- Uses a `DropdownMenu` component from the existing UI library

---

### 4. Admin Dashboard Tab Refactor

**`src/pages/AdminDashboard.tsx`**

- Remove the "Admins" tab
- Rename "Employees" tab to "People"
- Two tabs remain: "Trainings" and "People"

**New: `src/components/dashboard/PeopleManagement.tsx`**

Replaces both `EmployeeManagement` and `AdminManagement`. Single unified table:

- **Columns**: Name (email below, orange "Admin" badge if `is_admin`), Status (assignment count + overdue badges), Actions
- **Actions column**: `[Edit Assignments]` button + `[Settings]` icon button
- **Settings modal** (new component): Opens on settings icon click
  - Toggle for "Administrative Privileges" (calls service to toggle `is_admin` + `user_roles`)
  - "Hide Person" button (triggers existing hide confirmation dialog)
- **Add Person** button replaces separate "Add Employee" / "Add Admin" buttons
- Hidden section accordion remains, merged from both previous hidden lists

---

### 5. Training Settings Modal

**`src/components/dashboard/VideoManagement.tsx`** and **`src/components/dashboard/VideoTable.tsx`**

- Replace the standalone eye/hide icon with a Settings (gear) icon
- Settings icon opens a new `TrainingSettingsModal` containing:
  - "Hide Training" option (existing hide logic moved here)
  - Future extensibility for other training settings

**New: `src/components/dashboard/TrainingSettingsModal.tsx`**

- Receives the video object
- Contains the "Hide Training" action with existing confirmation pattern

---

### 6. Service Layer Updates

**`src/services/adminService.ts`**

- `addAdminByEmail()`: No longer deletes from employees. Instead updates `is_admin = true` on the employee row and adds `admin` role to `user_roles`
- `removeAdminRole()`: Sets `is_admin = false` on employee row, removes admin role, adds employee role
- `grantAdminToUserId()`: Same pattern -- update employee row, don't delete

**`src/services/api.ts`**

- `employeeOperations.getAll()`: Now returns all people (employees + admins) with `is_admin` field
- Add `toggleAdmin(employeeId, isAdmin)` method

---

### 7. New Components Summary

| Component | Purpose |
|-----------|---------|
| `PeopleManagement.tsx` | Unified People tab replacing Employees + Admins tabs |
| `PersonSettingsModal.tsx` | Settings modal for a person (admin toggle, hide) |
| `TrainingSettingsModal.tsx` | Settings modal for a training (hide action) |

---

### 8. Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Add `/admin` route, change redirect logic |
| `src/components/Header.tsx` | Dynamic background, admin badge, dropdown menu |
| `src/pages/AdminDashboard.tsx` | Replace 3 tabs with 2 (Trainings, People) |
| `src/components/dashboard/VideoTable.tsx` | Replace eye icon with settings icon |
| `src/components/dashboard/VideoManagement.tsx` | Integrate TrainingSettingsModal |
| `src/services/adminService.ts` | Stop deleting employees on promotion |
| `src/services/api.ts` | Add is_admin to employee operations |
| `src/types/employee.ts` | Add `is_admin` field |
| `src/hooks/useUserRole.ts` | No change (still uses user_roles) |
| Database functions | 4 functions updated |

---

### 9. Review

1. **Top 3 Risks**:
   (a) The `is_admin` column on `employees` could theoretically be manipulated if RLS policies allow employee self-update -- mitigated because current RLS only allows admins to manage employees, employees can only SELECT their own record.
   (b) Existing admins will get fresh employee records with no training history (per your decision).
   (c) Large number of files touched simultaneously increases regression risk.

2. **Top 3 Fixes**:
   (a) Unified People model eliminates the destructive employee-to-admin promotion that deleted training data.
   (b) Dual-route architecture with header color provides clear environmental signaling.
   (c) Settings modal pattern standardizes all management actions.

3. **Database Change**: Yes -- add column, backfill data, update 4+ database functions.

4. **Verdict**: Go -- significant but well-scoped refactor that resolves the core identity fragmentation issue.

