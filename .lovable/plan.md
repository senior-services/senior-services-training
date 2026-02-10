

## Fix Tooltip Arrow Clipped Inside Dialog Scroll Areas

### Problem
The tooltip arrow is visible in normal page contexts (like the Components Gallery) but gets clipped when the tooltip is inside a `DialogScrollArea`, which has `overflow-y-auto`. This is because the `TooltipContent` component renders inline in the DOM -- it does not use a Radix Portal. Any parent container with overflow clipping will hide the arrow SVG that extends outside the tooltip box.

### Root Cause
The `TooltipContent` component in `src/components/ui/tooltip.tsx` renders `TooltipPrimitive.Content` directly without wrapping it in `TooltipPrimitive.Portal`. Without portaling, the tooltip is a child of whatever DOM container it's placed in. Inside `DialogScrollArea` (which has `overflow-y-auto`), the arrow -- which visually extends beyond the content box -- gets clipped.

### Fix (1 file)

**`src/components/ui/tooltip.tsx`**
- Wrap `TooltipPrimitive.Content` inside `TooltipPrimitive.Portal` so the tooltip renders at the document root, outside any overflow-clipping containers.

Before:
```tsx
<TooltipPrimitive.Content ...>
  {children}
  <TooltipPrimitive.Arrow ... />
</TooltipPrimitive.Content>
```

After:
```tsx
<TooltipPrimitive.Portal>
  <TooltipPrimitive.Content ...>
    {children}
    <TooltipPrimitive.Arrow ... />
  </TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
```

### Review
- **Top 5 Risks**: (1) Portaling changes the stacking context -- mitigated by `z-50` already on the tooltip. (2) No visual change for tooltips outside dialogs since they already render correctly. (3) No impact on tooltip positioning logic (Radix handles portal positioning). (4) No database impact. (5) No security impact.
- **Top 5 Fixes**: (1) Add `TooltipPrimitive.Portal` wrapper. (2-5) N/A -- single targeted fix.
- **Database Change Required**: No
- **Go/No-Go**: Go
