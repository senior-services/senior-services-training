

## Update Download Data Modal Layout

### Summary

Simplify the dialog layout by removing the description text, repositioning the toggle to the left of the label, and showing the hidden employee count inline with the label.

---

### Changes

**File:** `src/components/dashboard/DownloadDataModal.tsx`

1. **Remove description text** (line 50-52)
   - Delete "Choose which employees to include in the export."

2. **Remove helper text** (line 60-62)
   - Delete "{hiddenCount} hidden employee(s) will be added"

3. **Rearrange the toggle row** (lines 55-71)
   - Move Switch to the left
   - Label "Include hidden employees" in the middle
   - Add count badge `<{hiddenCount}>` to the right

---

### New Layout

```
┌────────────────────────────────────────────┐
│  Download Employee Data                  ✕ │
├────────────────────────────────────────────┤
│                                            │
│  [○] Include hidden employees        <1>   │
│                                            │
├────────────────────────────────────────────┤
│                    Cancel    [Download]    │
└────────────────────────────────────────────┘
```

---

### Code Changes

**Lines 48-53** (DialogHeader):
```tsx
<DialogHeader>
  <DialogTitle>Download Employee Data</DialogTitle>
</DialogHeader>
```

**Lines 55-71** (Toggle row):
```tsx
<div className="flex items-center gap-3 py-4">
  <Switch
    id={switchId}
    checked={includeHidden}
    onCheckedChange={setIncludeHidden}
    disabled={isLoading}
  />
  <Label htmlFor={switchId} className="text-base cursor-pointer flex-1">
    Include hidden employees
  </Label>
  <span className="text-sm text-muted-foreground">
    &lt;{hiddenCount}&gt;
  </span>
</div>
```

