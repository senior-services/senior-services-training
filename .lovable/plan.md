
# Plan: Update Admin Badge to Solid Variant

## Change

### File: `src/components/Header.tsx` (line 34)

Change the badge variant from `soft-attention` to `attention`:

**Before:**
```tsx
<Badge variant="soft-attention" showIcon className="ml-2 text-xs align-middle">
```

**After:**
```tsx
<Badge variant="attention" showIcon className="ml-2 text-xs align-middle">
```

This switches from a transparent amber background to a solid amber background with white text, while keeping the Shield icon (`showIcon`). The badge will now look consistent regardless of what background it sits on.

## Summary

- 1 file changed, 1 line modified
- No new dependencies, no database changes
