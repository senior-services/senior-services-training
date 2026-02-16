

## Update Training Acknowledgment Styling

### Changes

**File 1: `src/components/VideoPlayerFullscreen.tsx` -- line 494**

Remove the `mt-4` class from the wrapper `div` around the presentation TrainingAttestation:

```tsx
// Before
<div className="mt-4">

// After
<div>
```

**File 2: `src/components/shared/TrainingAttestation.tsx`**

Two updates:

1. **Line 50** -- Swap disabled background from `bg-transparent` to `bg-muted`:
```tsx
// Before
enabled ? "bg-background" : "bg-transparent"
// After
enabled ? "bg-background" : "bg-muted"
```

2. **Line 58** -- Make the title color state-aware:
```tsx
// Before
<h3 className="form-section-header !mt-0">
// After
<h3 className={cn("form-section-header !mt-0", enabled ? "text-foreground" : "text-muted-foreground")}>
```

### Visual States

| State | Background | Title | Body/Label |
|-------|-----------|-------|------------|
| Disabled | `bg-muted` (light gray) | `text-muted-foreground` | `text-muted-foreground` (already done) |
| Enabled | `bg-background` (white) | `text-foreground` | `text-foreground` (already done) |

### Review

1. **Top 3 Risks:** None -- cosmetic only.
2. **Top 3 Fixes:** (a) Remove extra top margin. (b) Clear disabled/active visual distinction. (c) Muted title reinforces inactive state.
3. **Database Change:** No.
4. **Verdict:** Go.

