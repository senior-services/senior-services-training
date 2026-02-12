

## Badge Legibility Update: `text-caption` to `text-small`

### Problem
Badges currently use `.text-caption` (0.64rem / ~10px), which is too small for senior users. We need to bump them to `.text-small` (0.8rem / ~13px) with an explicit `line-height: 1.5`.

---

### Changes

#### 1. Update `.badge-base` in `src/index.css` (line 233)

Replace `text-caption` with `text-small` and add explicit `font-size` and `line-height` declarations:

```css
.badge-base {
  @apply inline-flex items-center rounded-full border px-2.5 py-0.5 text-small font-semibold transition-all duration-200 whitespace-nowrap;
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
  font-size: 0.8rem;
  line-height: 1.5;
}
```

This single change propagates to all 28 variants (Solid, Hollow, Soft, Ghost) automatically.

#### 2. Remove `text-caption` Overrides from Badge Consumers

Three files manually set `text-caption` on Badge components, which would now fight the updated base. These must be stripped:

| File | Line | Before | After |
|------|------|--------|-------|
| `AdminManagement.tsx` | 256 | `className="ml-2 text-caption"` | `className="ml-2"` |
| `ComponentUpdateIndicator.tsx` | 90 | `className="text-caption"` | *(remove className)* |
| `ComponentUpdateIndicator.tsx` | 107 | `className="text-caption"` | *(remove className)* |

#### 3. Update Style Guide Documentation in `ComponentsGallery.tsx` (lines 748-751)

Update the code snippet that documents `.badge-base` to reflect the new `text-small` utility instead of `text-caption`.

---

### Files Changed Summary

| File | Change |
|------|--------|
| `src/index.css` | `.badge-base`: `text-caption` to `text-small`, add explicit `font-size: 0.8rem` and `line-height: 1.5` |
| `src/components/dashboard/AdminManagement.tsx` | Remove `text-caption` from Badge className |
| `src/components/ui/ComponentUpdateIndicator.tsx` | Remove `text-caption` from 2 Badge classNames |
| `src/pages/ComponentsGallery.tsx` | Update documentation snippet |

**Total: 4 files**

---

### Review

1. **Top 3 Risks:** (1) Badge size increase from 10px to 13px may cause minor layout shifts in tight table cells or inline contexts -- visually negligible. (2) The explicit `font-size`/`line-height` declarations after `@apply` will take precedence, ensuring the values are locked even if `.text-small` is redefined. (3) No risk to variant styling -- all 28 variants inherit from `.badge-base`.
2. **Top 3 Fixes:** (1) Improves legibility for senior users by increasing badge text 30%. (2) Eliminates 3 page-level `text-caption` overrides that would have fought the new base. (3) Documentation stays in sync.
3. **Database Change:** No
4. **Verdict:** Go -- surgical, low-risk typography update with full propagation.

