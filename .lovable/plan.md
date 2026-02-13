

## Update Badge Base Typography to Small Text Medium

### What Changes

The badge base class in `src/index.css` currently uses `text-body font-semibold` (16px, weight 600). This update changes it to `text-body-sm font-medium` (~14px, weight 500) for a more proportionate badge size consistent with the design system's accessibility minimum of 13px.

### File to Edit

**`src/index.css`** (line 227)

Replace:
```css
@apply inline-flex items-center rounded-full border px-2.5 py-0.5 text-body font-semibold transition-all ...
```

With:
```css
@apply inline-flex items-center rounded-full border px-2.5 py-0.5 text-body-sm font-medium transition-all ...
```

This is a single-line change. All badge variants inherit from `.badge-base`, so every badge in the app updates automatically.

### Review

1. **Top 3 Risks:** (a) Badges shrink from 16px to ~14px -- intentional per request. (b) Weight drops from semibold (600) to medium (500) -- slightly lighter but still distinct from body text. (c) No risk of breaking variant styles since they only override color/border, not typography.
2. **Top 3 Fixes:** (a) Single-line change propagates to all badge variants. (b) Stays above 13px accessibility minimum. (c) `font-medium` is a permitted override per the 80/20 rule.
3. **Database Change:** No.
4. **Verdict:** Go -- one CSS line, zero component file edits.
