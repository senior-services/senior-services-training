

## Enlarge Dialog Close "X" Icon

### Overview

Increase the Lucide `X` icon size in the shared Dialog component from `h-4 w-4` (16px) to a larger size for better visibility and tap-target accessibility.

### Change

**File: `src/components/ui/dialog.tsx`**

Two lines need updating:

1. **Line 46** (standard `DialogContent`):
   ```tsx
   // Before
   <X className="h-4 w-4" />
   // After
   <X className="h-5 w-5" />
   ```

2. **Line 73** (`FullscreenDialogContent`):
   ```tsx
   // Before
   <X className="h-4 w-4" />
   // After
   <X className="h-5 w-5" />
   ```

Use `h-5 w-5` (20px) for a balanced increase. If you prefer even larger, `h-6 w-6` (24px) is also an option.

The close button's hit area on `FullscreenDialogContent` is already `h-10 w-10`, so the larger icon fits comfortably. On `DialogContent`, the button container is minimal -- consider also adding padding (e.g., `p-2`) to increase the tap target for accessibility compliance.

### Review

1. **Top 3 Risks:** None -- icon sizing only, no layout shift.
2. **Top 3 Fixes:** (a) Improved visibility for senior users. (b) Consistent icon size across both dialog variants. (c) Better WCAG tap-target compliance.
3. **Database Change:** No.
4. **Verdict:** Go.

