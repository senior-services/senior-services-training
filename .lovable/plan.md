

## Remove Box-Shadow from All Banner Components

### Problem
The `.banner-size-default` class on line 503 of `src/index.css` applies `shadow-card hover:shadow-lg`, giving banners a box-shadow and a hover shadow effect. This needs to be removed.

### Changes

| File | Line | Before | After |
|------|------|--------|-------|
| `src/index.css` | 503 | `@apply p-4 shadow-card hover:shadow-lg;` | `@apply p-4;` |

That single change removes box-shadow from all default-size banners globally. Compact banners (`.banner-size-compact`) have no shadow, so no change needed there.

The `.banner-base` class also has `transition-shadow duration-300` which becomes unnecessary — remove it:

| File | Line | Before | After |
|------|------|--------|-------|
| `src/index.css` | 476 | `@apply relative w-full rounded-lg border transition-shadow duration-300;` | `@apply relative w-full rounded-lg border;` |

No changes needed in `STYLEGUIDE.md` — the banner section documents variants and usage patterns but does not reference shadow properties. The `Banner` component (`banner.tsx`) uses CVA referencing these CSS classes, so it will inherit the update automatically.

### Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Remove `shadow-card hover:shadow-lg` from `.banner-size-default`; remove `transition-shadow duration-300` from `.banner-base` |

