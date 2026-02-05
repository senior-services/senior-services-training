

## Add --muted Back and Update Admin Dashboard Background

### Summary

1. Add the `--muted` color swatch back to the UI Colors section in Components Gallery
2. Change the AdminDashboard page background from `bg-muted/50` to `bg-background` (consistent with the DashboardLayout pattern)

---

### Changes Required

#### 1. Add --muted Back to UI Colors

**File:** `src/pages/ComponentsGallery.tsx` - After line 385 (after the Card entry)

Add the `--muted` swatch:

```jsx
<div className="flex items-center gap-3">
  <div className="w-12 h-12 rounded-lg bg-muted border border-border-primary shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"></div>
  <div>
    <div className="text-sm font-medium">Muted</div>
    <div className="text-xs text-muted-foreground">--muted</div>
  </div>
</div>
```

---

#### 2. Remove --muted from Admin Dashboard Background

**File:** `src/pages/AdminDashboard.tsx` - Line 38

| Before | After |
|--------|-------|
| `min-h-screen bg-muted/50` | `min-h-screen bg-background` |

This aligns with the `DashboardLayout` component pattern which uses `bg-background`.

---

### Files Modified

| File | Change |
|------|--------|
| `src/pages/ComponentsGallery.tsx` | Add `--muted` swatch back to UI Colors section |
| `src/pages/AdminDashboard.tsx` | Change background from `bg-muted/50` to `bg-background` |

---

### Visual Result

- **UI Colors Section**: Will show 6 background-related swatches including `--muted`
- **Admin Dashboard**: Will use the main background color instead of the muted tint, matching the DashboardLayout standard

