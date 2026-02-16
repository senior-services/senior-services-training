

## Add Border Below Video Thumbnail on Training Card

### Overview

Add a 1px horizontal rule using `--border-primary` directly beneath the video thumbnail (the `<header>` element) to visually separate the image from the card content below.

### Change

**File: `src/components/TrainingCard.tsx`** (line 221)

Add a bottom border to the `<header>` element wrapping the thumbnail:

```tsx
// Before
<header className="relative">

// After
<header className="relative border-b" style={{ borderColor: 'var(--border-primary)' }}>
```

This places a single `--border-primary` rule directly below the video, cleanly separating thumbnail from badge/title content. No other files need editing.

### Review

1. **Top 3 Risks:** None -- purely visual, single-line change.
2. **Top 3 Fixes:** (a) Clear visual separation between thumbnail and metadata. (b) Uses the centralized `--border-primary` token for consistency. (c) Zero impact on layout or accessibility.
3. **Database Change:** No.
4. **Verdict:** Go.

