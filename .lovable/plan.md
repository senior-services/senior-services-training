

## Fix Header Typography and Ghost Button Hover Visibility

### Two Changes

**1. `src/components/Header.tsx` (line 50)** -- Revert title typography back to `text-h4`:

```
text-body  -->  text-h4
```

**2. `src/components/Header.tsx` (line 70)** -- Add `hover:text-inherit` utility to the dropdown button:

```tsx
// Before
<Button variant="ghost" className={`button-ghost-dark ${headerTextColor}`}>

// After
<Button variant="ghost" className={`button-ghost-dark hover:text-inherit ${headerTextColor}`}>
```

### Why This Works

Tailwind utilities always outrank `@layer components` rules. Adding `hover:text-inherit` as a utility class guarantees it beats `.button-ghost`'s `@apply hover:text-primary` -- no `!important`, no complex selectors, no cascade guessing.

The `.button-ghost-dark` class in CSS still handles the hover background (`white/10`) and shadow. The text color override is handled by the utility.

### No Other Files Changed

- `src/index.css`: `.button-ghost-dark` stays as-is (handles background/shadow on hover)
- `src/pages/ComponentsGallery.tsx`: Add `hover:text-inherit` to the dark-background example button to match

### Review
1. **Top 3 Risks:** (a) None -- utility-over-layer is a guaranteed Tailwind specificity rule. (b) `text-inherit` resolves to white because the parent sets `headerTextColor`. (c) Gallery example stays in sync.
2. **Top 3 Fixes:** (a) Header title restored to `text-h4`. (b) Dropdown text stays white on hover. (c) Uses CSS best practice (utility layer precedence) instead of `!important` or complex selectors.
3. **Database Change:** No.
4. **Verdict:** Go -- two lines changed in Header.tsx, one in ComponentsGallery.tsx.
