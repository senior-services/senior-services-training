

## Fix Tab Spacing Without Changing Badge Appearance

### Problem
The badge inside the Quiz tab trigger is making that trigger taller than the Details trigger, creating a visible gap between the text and the underline. The previous fix (`py-0 leading-none`) wasn't enough because the badge still has intrinsic height from its icon and text.

### Solution
Use **negative vertical margins** on the badge to offset its height contribution without changing how the badge itself looks. This pulls the badge back into the vertical space so it doesn't stretch the trigger.

### Fix

**File: `src/components/EditVideoModal.tsx`** (line 993)

Add `-my-1` alongside the existing classes:

```tsx
<Badge variant="soft-tertiary" showIcon className="py-0 leading-none -my-1">
  {questions.length}
</Badge>
```

The `-my-1` (negative 4px top and bottom margin) compensates for the badge's intrinsic height so the tab trigger stays the same height as the Details tab.

### Why This Works
- The badge keeps its natural visual appearance (same size, same padding)
- The negative margins pull it "into" the available space rather than pushing the container outward
- Both tab labels will now sit at the same distance from the underline

### Review

- **Top 5 Risks**: None — single CSS class addition, purely layout adjustment
- **Top 5 Fixes**: (1) Add `-my-1` to neutralize badge height contribution
- **Database Change Required**: No
- **Go/No-Go**: Go — minimal styling fix, badge appearance unchanged

