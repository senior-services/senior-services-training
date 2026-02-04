

## Fix Badge and Toggle Font Sizes for Senior Accessibility

### Issue Identified

The Badge and Toggle components use hardcoded font size classes that don't align with the senior accessibility guidelines. According to the tailwind config, the minimum text size for senior accessibility should be `text-base` (16px), but both components use smaller sizes:

| Component | Current Font Size | Expected Size |
|-----------|------------------|---------------|
| Badge | `text-xs` (14px) | `text-sm` (15px) |
| Toggle | `text-sm` (15px) | `text-sm` (15px) |

Looking at the Typography section in ComponentsGallery, the hierarchy shows:
- Body text uses `text-base` (16px) - minimum for seniors
- Small text uses `text-sm` (15px) - secondary information
- Extra small uses `text-xs` (14px) - captions and labels only

### Recommended Changes

**File 1: `src/components/ui/badge.tsx`**

Update the base font size from `text-xs` to `text-sm` (15px) for better readability:

```tsx
// Line 8 - Change base class
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap",
  // ... rest unchanged
);
```

**File 2: `src/components/ui/toggle.tsx`**

The Toggle component already uses `text-sm` in all its variants, which matches the 15px guideline. However, the `text-sm` is redundantly specified in multiple places. We can clean this up by moving it to the base class:

```tsx
// Lines 7-28 - Clean up and consolidate font-size
const toggleVariants = cva(
  "btn-toggle inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground w-fit",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        pill: "bg-transparent rounded-full hover:bg-white/60 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:font-semibold data-[state=on]:shadow-sm transition-all duration-200 h-8 px-4",
      },
      // ... size variants unchanged
    },
    // ... rest unchanged
  }
);
```

### Summary of Changes

| Component | Before | After | Pixel Size |
|-----------|--------|-------|------------|
| Badge | `text-xs` | `text-sm` | 14px → 15px |
| Toggle | `text-sm` (duplicated) | `text-sm` (consolidated in base) | 15px (no change) |

This ensures both components follow the senior accessibility guideline of using at minimum 15px font sizes for interactive elements.

