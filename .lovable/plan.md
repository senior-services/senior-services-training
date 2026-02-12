

## Fix Tooltip Font Size Override

### Problem
The `TooltipContent` component has `text-small` in its className, but the rendered text displays at 16px (body size) instead of 13px. This is a CSS specificity issue: `.text-small` is defined in `@layer components`, which can be overridden by inherited body styles or other cascade rules.

### Root Cause
The `.text-small` class (0.8rem / 13px) is in `@layer components`. While `font-size` is inherited, there may be a cascade conflict causing the tooltip's child `<p>` elements to render at body size (1rem / 16px).

### Fix (1 file)

**`src/index.css`** -- Add a dedicated tooltip semantic class with explicit font-size

Add a `.tooltip-content` semantic class in the `@layer components` section:

```css
.tooltip-content {
  font-size: 0.8rem;
  line-height: 1.5;
}
```

Then update **`src/components/ui/tooltip.tsx`** to use this class, replacing the `text-small` reference with `tooltip-content` to ensure the font-size is locked in at the component level and cannot be overridden by inheritance.

Alternatively, the simpler surgical fix: just add `[font-size:0.8rem]` as an arbitrary Tailwind property on the TooltipContent className to force the size with higher specificity. But per the design system rules (no arbitrary values), the semantic class approach is cleaner.

### Recommended Approach (2 files)

1. **`src/index.css`** -- Add `.tooltip-content` with `font-size: 0.8rem; line-height: 1.5;` in the components layer.
2. **`src/components/ui/tooltip.tsx`** -- Replace `text-small` with `tooltip-content` in the `TooltipContent` className.

### Review
1. **Risks:** None -- tooltip styling is isolated; no other components reference this class.
2. **Fixes:** Tooltip text renders at the correct 13px size system-wide.
3. **Database Change:** No.
4. **Verdict:** Go -- two small edits.
