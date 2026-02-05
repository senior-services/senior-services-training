

## Use ButtonWithTooltip Component for Delete Button

### Summary

Refactor the delete button in the Edit Video dialog to use the existing `ButtonWithTooltip` component instead of manually implementing tooltip markup. This improves code reuse and ensures consistent behavior across the application.

---

### Current State

The delete button (lines 1087-1099) manually wraps a Button with Tooltip components. The tooltip content changes based on whether the video can be deleted:
- If deletable: "Delete Video" or "Delete Video and Quiz"
- If not deletable: "Cannot delete: Assigned to X user(s). Use Hide on Trainings tab instead."

---

### Change

Replace the manual Tooltip wrapper with the `ButtonWithTooltip` component, which already handles the disabled button hover pattern correctly.

**File:** `src/components/EditVideoModal.tsx`

**Before (lines 1086-1100):**
```tsx
<div className="flex items-center space-x-4">
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="link" onClick={...} className={...} disabled={...}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Video
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {videoUsage?.canDelete ? ... : ...}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
```

**After:**
```tsx
<div className="flex items-center space-x-4">
  <ButtonWithTooltip
    variant="link"
    onClick={() => videoUsage?.canDelete && setDeleteDialogOpen(true)}
    className={cn(
      "text-destructive hover:text-destructive p-0 h-auto font-normal transition-none",
      videoUsage && !videoUsage.canDelete && "opacity-50"
    )}
    disabled={!videoUsage?.canDelete || usageLoading}
    tooltip={
      videoUsage?.canDelete
        ? quiz
          ? "Delete Video and Quiz"
          : "Delete Video"
        : `Cannot delete: Assigned to ${videoUsage?.assignedCount} user${videoUsage?.assignedCount !== 1 ? 's' : ''}. Use Hide on Trainings tab instead.`
    }
    aria-label={
      videoUsage?.canDelete
        ? quiz
          ? "Delete Video and Quiz"
          : "Delete Video"
        : `Cannot delete: Assigned to ${videoUsage?.assignedCount} user(s). Use Hide on Trainings tab instead.`
    }
  >
    <Trash2 className="w-4 h-4 mr-2" />
    Delete Video
  </ButtonWithTooltip>
</div>
```

**Also add import at the top of the file:**
```tsx
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip";
```

---

### Benefits

| Aspect | Improvement |
|--------|-------------|
| Code Reuse | Uses existing component instead of duplicating pattern |
| Consistency | Same hover behavior as other disabled buttons with tooltips |
| Maintainability | Future improvements to ButtonWithTooltip apply everywhere |
| Fewer Lines | Reduces ~14 lines of markup to ~18 lines (but cleaner, single component) |
| Accessibility | Built-in keyboard and screen reader support from component |

