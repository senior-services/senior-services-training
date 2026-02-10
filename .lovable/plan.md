

## Update Tooltip Style: Dark Background with White Text and Arrow

### What Changes
Restyle the global tooltip to use a dark background (`bg-foreground`) with white text (`text-background`), matching the widely-adopted tooltip convention (used by shadcn/ui defaults, Material UI, and most design systems). This provides high contrast and clear visual distinction from surrounding content. Also adds the arrow from the previous plan.

### Changes (2 files)

**File 1: `src/components/ui/tooltip.tsx`**

Update `TooltipContent` styling:
- Replace `border bg-popover text-popover-foreground` with `bg-foreground text-background border-foreground`
- Remove the border visual (since dark background makes it unnecessary, but keep `border-foreground` so border blends)
- Add `<TooltipPrimitive.Arrow className="fill-foreground" />` inside the content for the directional arrow
- Render `props.children` explicitly so the arrow can be placed after it

Result:
```tsx
const TooltipContent = React.forwardRef<...>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-foreground px-3 py-1.5 text-sm text-background shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {children}
    <TooltipPrimitive.Arrow className="fill-foreground" />
  </TooltipPrimitive.Content>
))
```

**File 2: `STYLEGUIDE.md`**

Add a Tooltip section documenting:
- Dark background (`bg-foreground`) with white text (`text-background`)
- Arrow included by default via `TooltipPrimitive.Arrow`
- High contrast for accessibility compliance

### Review
- **Top 5 Risks**: (1) All existing tooltips update globally -- this is intentional and desirable. (2) Dark mode: `--foreground` flips to light text color, `--background` flips to dark -- tooltip will invert correctly (light bg, dark text in dark mode), maintaining contrast. (3) Arrow color matches background via `fill-foreground` -- consistent. (4) No layout shift. (5) No database impact.
- **Top 5 Fixes**: (1) Swap bg/text classes on TooltipContent. (2) Add Arrow primitive. (3) Update styleguide. (4-5) N/A.
- **Database Change Required**: No
- **Go/No-Go**: Go

