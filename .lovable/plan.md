

## Revised: Attestation Background Color When Active

### What Changes
Update the attestation card container to show a white background (`bg-background`) when the checkbox is enabled (all questions answered), matching the quiz question card styling. When disabled, it stays transparent.

### Change (1 file)

**File: `src/components/VideoPlayerFullscreen.tsx`**

In the attestation container `div` (the one with `mt-6 border border-border rounded-lg p-6`), add a conditional background class:

```tsx
<div className={`mt-6 border border-border rounded-lg p-6 ${allQuestionsAnswered ? 'bg-background' : ''}`}>
```

This applies `bg-background` (white) only when `allQuestionsAnswered` is true, visually matching the quiz question `Card` components. When questions are incomplete, the container remains transparent to reinforce the disabled/inactive state.

### Review
- **Top 5 Risks**: (1) None -- purely visual, no logic change. (2) Consistent with existing Card styling in quiz questions. (3) No accessibility impact -- contrast remains the same. (4) No layout shift. (5) No database impact.
- **Top 5 Fixes**: (1) Add conditional `bg-background` class. (2-5) N/A.
- **Database Change Required**: No
- **Go/No-Go**: Go

