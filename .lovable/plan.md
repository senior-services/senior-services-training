

## Fix: Button font-weight Override

### Problem
The composite `text-body` token includes `fontWeight: 400` baked in. On `.button-base`, `@apply text-body` (line 200) appears **after** `font-medium` (line 193), so the 400 weight wins due to CSS cascade order. The inspector confirms buttons render at 400 instead of the intended 500.

### Solution
Move `font-medium` **after** `text-body` so it overrides the token's baked-in weight. This is a single-line reorder within `.button-base`.

**`src/index.css`** -- lines 191-201

Before:
```css
.button-base {
    @apply inline-flex items-center justify-center gap-2 whitespace-nowrap
      rounded-md font-medium ring-offset-background transition-all duration-200
      ...
    @apply text-body;
}
```

After:
```css
.button-base {
    @apply inline-flex items-center justify-center gap-2 whitespace-nowrap
      rounded-md ring-offset-background transition-all duration-200
      ...
    @apply text-body font-medium;
}
```

`font-medium` moves from line 193 to line 200 (after `text-body`), ensuring weight 500 takes precedence. This is the correct application of the 80/20 override rule: buttons are a permitted override context.

### Review
1. **Top 3 Risks:** (a) None -- purely a cascade reorder within one class. (b) No other components affected. (c) Aligns with documented override clause.
2. **Top 3 Fixes:** (a) Restores intended 500 weight on all buttons project-wide. (b) Zero component file changes needed. (c) Follows existing override pattern.
3. **Database Change:** No.
4. **Verdict:** Go -- single-line cascade fix.
