

## Fix: Admin Not Recognized on Employee Dashboard

### Problem
The `EmployeeDashboard` component hardcodes `userRole="employee"` when rendering the `Header`. This means when an admin visits `/dashboard` (their personal training view), the Header shows no Admin badge and the dropdown only shows "Logout" instead of the admin navigation options.

### Root Cause
The user's role is determined in `App.tsx` via `useUserRole()`, but it is never passed as a prop to `EmployeeDashboard`. The dashboard then passes a hardcoded `"employee"` string to the Header.

### Changes

**1. `src/pages/EmployeeDashboard.tsx`**

- Add `userRole` prop to the `EmployeeDashboardProps` interface (type: `"admin" | "employee"`, default: `"employee"`).
- Pass `userRole` to the `Header` component in both render locations (error state at line 492 and main render at line 525) instead of the hardcoded `"employee"`.

**2. `src/App.tsx`**

- Pass `userRole={isAdmin ? "admin" : "employee"}` to the `EmployeeDashboard` component at line 119.

### Result
- Admins visiting `/dashboard` will see the orange "Admin" badge and the full dropdown (My Personal Trainings, Admin Dashboard, Logout).
- Standard employees see no badge and only "Logout" -- unchanged behavior.
- Header background stays navy on `/dashboard` for both roles (the orange background is reserved for `/admin`).

### Review
1. **Top 3 Risks:** (a) None significant -- two-line prop threading. (b) No database change. (c) No security implication since role is already fetched server-side via `user_roles` table.
2. **Top 3 Fixes:** (a) Admin badge appears on personal dashboard. (b) Dropdown navigation restored. (c) Minimal change footprint.
3. **Database Change:** No.
4. **Verdict:** Go -- straightforward prop pass-through fix.
