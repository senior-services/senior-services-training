

## Update Hidden Employee Count Position

### Summary

Move the hidden employee count from a separate element on the right to inline with the label text in parentheses.

---

### Current vs New Layout

**Before:**
```
[○] Include hidden employees                    <1>
```

**After:**
```
[○] Include hidden employees (1)
```

---

### Changes

**File:** `src/components/dashboard/DownloadDataModal.tsx`

Update the toggle row (lines 50-62):

1. Remove the separate `<span>` element for the count
2. Add the count directly inside the Label with parentheses format

**Updated Code:**
```tsx
<div className="flex items-center gap-3 py-4">
  <Switch
    id={switchId}
    checked={includeHidden}
    onCheckedChange={setIncludeHidden}
    disabled={isLoading}
  />
  <Label htmlFor={switchId} className="text-base cursor-pointer">
    Include hidden employees ({hiddenCount})
  </Label>
</div>
```

