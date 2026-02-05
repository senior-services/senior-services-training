
# Plan: Update Header for Role-Based Title and Admin Background Color

## Changes

### 1. Dynamic Title Based on User Role
The Header currently hardcodes "/ Admin Dashboard". Change it to show the correct title based on `userRole`:
- Admin: "Learning Hub / Admin Dashboard"  
- Employee: "Learning Hub / Employee Dashboard"

### 2. Red Background for Admin Dashboard Header
Add conditional styling so the admin header uses `bg-destructive` instead of `bg-background-header`.

---

## File Changes

**`src/components/Header.tsx`**

| Line | Change |
|------|--------|
| 20 | Add conditional background: `bg-destructive` for admin, `bg-background-header` for employee |
| 30 | Make title dynamic: "/ Admin Dashboard" or "/ Employee Dashboard" based on `userRole` |

### Code Changes

**Line 20 - Conditional background color:**
```jsx
// Before
<header className="bg-background-header border-b border-border-primary shadow-card">

// After
<header className={`${userRole === 'admin' ? 'bg-destructive' : 'bg-background-header'} border-b border-border-primary shadow-card`}>
```

**Line 30 - Dynamic title:**
```jsx
// Before
<h1 className="text-xl text-primary-foreground">
  <span className="font-bold">Learning Hub</span> 
  <span className="font-normal">/ Admin Dashboard</span>
</h1>

// After
<h1 className="text-xl text-primary-foreground">
  <span className="font-bold">Learning Hub</span> 
  <span className="font-normal">/ {userRole === 'admin' ? 'Admin' : 'Employee'} Dashboard</span>
</h1>
```

---

## Result

| View | Header Title | Background Color |
|------|--------------|------------------|
| Employee Dashboard | Learning Hub / Employee Dashboard | Dark navy (`--background-header`) |
| Admin Dashboard | Learning Hub / Admin Dashboard | Red (`--destructive`) |
