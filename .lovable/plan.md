

## Relocate Timer from Footer to Content Area

### What Changes

Move the timer display from the presentation footer up into the content area, right-aligned next to the training description. Switch from Badge to the Banner component (compact, inline) with content-hugging width. Clean up the footer to only contain action buttons.

---

### 1. Add Timer Banner Next to Description (Lines 498-503)

Wrap the description and timer in a flex row. The timer banner sits to the right, width hugging its content via `w-fit`.

```tsx
// Before (lines 498-503)
{video?.description && video.description.trim() && <div className="pb-4" id="video-description">
    <p className="text-sm text-foreground font-normal leading-relaxed">
      {video.description}
    </p>
  </div>}

// After
<div className="flex items-start justify-between gap-4 pb-4">
  {video?.description && video.description.trim() && (
    <div className="flex-1" id="video-description">
      <p className="text-sm text-foreground font-normal leading-relaxed">
        {video.description}
      </p>
    </div>
  )}
  {isPresentation && !wasEverCompleted && (
    timerActive ? (
      <Banner variant="information" size="compact" icon={Clock} className="w-fit shrink-0">
        <span className="tabular-nums whitespace-nowrap">Time Remaining: {formattedTime}</span>
      </Banner>
    ) : (
      <Banner variant="success" size="compact" className="w-fit shrink-0">
        Minimum time met
      </Banner>
    )
  )}
</div>
```

The `Banner` with `size="compact"` gives reduced padding (`py-2 px-3`). The `information` variant uses the Info icon automatically. The `success` variant uses the CheckCircle icon automatically. `w-fit` ensures the banner hugs its content.

---

### 2. Remove Timer from Footer (Lines 670-682)

Remove the Badge-based timer from the footer. Change footer alignment from `sm:justify-between` to `sm:justify-end` since only buttons remain.

```tsx
// Before (lines 670-682)
<DialogFooter className="sm:justify-between">
  {/* Left: Countdown clock */}
  {timerActive ? (
    <Badge variant="soft-attention">
      <Clock className="w-3 h-3 mr-1" />
      <span className="tabular-nums">Time Remaining: {formattedTime}</span>
    </Badge>
  ) : (
    <Badge variant="soft-success" showIcon>
      Timer Complete
    </Badge>
  )}

  {/* Right: Action buttons */}
  <div className="flex gap-2">

// After
<DialogFooter className="sm:justify-end">
  <div className="flex gap-2">
```

---

### 3. Import Update (Line 9)

Replace `Badge` import with `Banner`:

```tsx
// Before
import { Badge } from "@/components/ui/badge";

// After
import { Banner } from "@/components/ui/banner";
```

The `Badge` import can be removed since no other usage remains in this file. The `Clock` import stays (used by the active timer Banner's `icon` prop).

---

### Files Changed

| File | Change |
|------|--------|
| `src/components/VideoPlayerFullscreen.tsx` | Move timer to content area, clean footer, swap Badge for Banner |

### What Stays the Same

- Timer logic, countdown, and state management
- Footer action buttons (Cancel, Complete Training, Start Quiz, Submit Quiz)
- Acknowledgment section positioning and behavior
- Quiz flow and attestation logic

### Review

- **Top 3 Risks:** (1) If no description exists, the timer still renders alone in the flex row -- acceptable layout. (2) On narrow viewports the flex-row may wrap -- `shrink-0` on the banner prevents it from compressing. (3) None structural.
- **Top 3 Fixes:** (1) Timer is now prominently visible at content level. (2) Footer is simplified to action buttons only. (3) Uses design-system Banner component with proper compact variant.
- **Database Change:** No
- **Verdict:** Go
