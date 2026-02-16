

## Fix: Vertically Align Dialog Close Button in Header

### Problem

The close "X" button is rendered as a separate absolutely-positioned element overlaying the `DialogHeader`, rather than participating in the header's flex layout. This causes vertical misalignment -- the button doesn't center against the title's line-height.

### Approach

Move the close button **into** the `DialogHeader` component and use flexbox alignment (`items-center`) instead of absolute positioning. Remove the auto-rendered close buttons from both `DialogContent` and `FullscreenDialogContent`.

### Changes

**File: `src/components/ui/dialog.tsx`**

**1. Remove the auto-rendered close button from `DialogContent` (lines 45-48):**
Delete the `<DialogPrimitive.Close>` block so the content no longer renders its own close button.

**2. Remove the auto-rendered close button from `FullscreenDialogContent` (lines 69-75):**
Same deletion.

**3. Restructure `DialogHeader` (lines 81-93):**

Change from vertical-only layout to a row layout with the close button integrated:

```tsx
const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between bg-background px-6 py-4 border-b border-border-secondary flex-shrink-0 sm:rounded-t-lg",
      className
    )}
    data-dialog-header
    {...props}
  >
    <div className="flex flex-col space-y-1.5 text-center sm:text-left flex-1 min-w-0">
      {children}
    </div>
    <DialogPrimitive.Close className="flex items-center justify-center h-10 w-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground flex-shrink-0">
      <X className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  </div>
)
```

Key details:
- The header becomes a **row** flex container with `items-center justify-between`
- Title/description content is wrapped in an inner `flex-col` div to preserve multi-line support
- The close button uses `flex` (not `inline-flex`), `h-10 w-10` tap target, no absolute positioning
- `flex-shrink-0` on the button prevents it from collapsing; `min-w-0` on the content allows text truncation

### Impact

- **Zero consumer changes needed** -- all existing usages (`DialogHeader > DialogTitle`) continue to work identically
- Every dialog (standard and fullscreen) automatically gets the aligned close button
- The `h-10 w-10` tap target meets WCAG 2.1 AA minimum (44x44 CSS px approximation)

### Review

1. **Top 3 Risks:** (a) Dialogs that pass extra className to DialogHeader may need minor adjustment. (b) `text-center` on mobile is preserved in the inner wrapper. (c) No risk to fullscreen dialog scroll/footer pinning since only the header structure changes.
2. **Top 3 Fixes:** (a) Proper vertical alignment via flexbox. (b) Eliminates absolute positioning hack. (c) Single source of truth for the close button.
3. **Database Change:** No.
4. **Verdict:** Go -- structural improvement, no consumer-facing API change.

