

## Replace `Button` with Native `<button>` in SortableTableHead

### Problem
The `Button` component's `button-base` class forces `font-size: 1rem` (16px), overriding the 13px `text-small` inherited from `TableHead`. The previous `button-compact` fix did not resolve the cascade conflict.

### Change (1 file)

**`src/components/ui/sortable-table-head.tsx`**

1. **Remove** the `Button` import (line 2)
2. **Replace** `<Button variant="ghost" ...>` (lines 59-79) with `<button type="button" ...>`
3. **Apply** direct styling that inherits font-size from parent `TableHead`

Final className:
```
cn(
  "inline-flex items-center bg-transparent border-none cursor-pointer",
  "uppercase text-muted-foreground",
  "hover:text-primary group",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  isActive ? "font-bold" : "font-medium"
)
```

No `font-size` class needed -- the native `<button>` inherits `text-small` (13px) from the `<th>` parent since there is no `button-base` to override it.

### Review

1. **Top 3 Risks:** (1) Focus ring previously came from `button-base` -- explicitly added via `focus-visible:ring-2 focus-visible:ring-ring`. (2) No visual regression -- every Button ghost style was already overridden. (3) Zero impact on non-sortable headers.
2. **Top 3 Fixes:** (1) Permanently eliminates the `button-base` 16px override. (2) Sortable headers inherit 13px from `TableHead`. (3) Cleaner markup, no unnecessary abstraction.
3. **Database Change:** No
4. **Verdict:** Go -- removes the conflicting layer entirely.

