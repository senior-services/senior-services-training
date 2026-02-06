
# Plan: Update Admin Header Background and Add Admin Badge

## Changes

### File: `src/components/Header.tsx`

**1. Change admin header background color (line 20)**

Replace the conditional background class so both admin and employee headers use the same `bg-background-header` color:

Current:
```tsx
className={`${userRole === 'admin' ? 'bg-destructive' : 'bg-background-header'} border-b ...`}
```

Updated:
```tsx
className="bg-background-header border-b border-border-primary shadow-card"
```

**2. Add Admin badge next to "Admin Dashboard" text (lines 29-32)**

Import the `Badge` component at the top of the file, then add the badge inline after the dashboard title text:

```tsx
import { Badge } from "@/components/ui/badge";
```

Update the title area to include the badge when `userRole === 'admin'`:

```tsx
<h1 className="text-xl text-primary-foreground">
  <span className="font-bold">Learning Hub</span>{' '}
  <span className="font-normal">/ {userRole === 'admin' ? 'Admin' : 'Employee'} Dashboard</span>
  {userRole === 'admin' && (
    <Badge variant="soft-attention" showIcon className="ml-2 text-xs align-middle">
      Admin
    </Badge>
  )}
</h1>
```

This uses the same `variant="soft-attention"` with `showIcon` (shield icon) as the Admin Management table badge.

## Summary

| Change | Detail |
|--------|--------|
| Header background | Both roles now use `bg-background-header` (deep navy) |
| Admin badge | `soft-attention` badge with shield icon added after "Admin Dashboard" |
| Files modified | 1 (`src/components/Header.tsx`) |
