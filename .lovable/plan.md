

## Refactor: Training Player Timer and UI Enhancements

### What Changes

Five targeted updates to `src/components/VideoPlayerFullscreen.tsx` to make the timer dynamic, use Badge components for the timer display, fix text colors in the acknowledgment section, and add tooltip logic to the "Complete Training" button.

---

### 1. Dynamic Timer Duration (Line 127)

**Current:** Hardcoded `PRESENTATION_MIN_SECONDS = 60`

**Fix:** Read from `video.duration_seconds` (the value saved via AddContentModal), falling back to 60 if unset.

```typescript
// Before
const PRESENTATION_MIN_SECONDS = 60;

// After
const presentationMinSeconds = (video?.duration_seconds && video.duration_seconds >= 60)
  ? video.duration_seconds
  : 60;
```

Update all references from `PRESENTATION_MIN_SECONDS` to `presentationMinSeconds` (lines 129, 180, 182).

---

### 2. Dynamic Timer Badge Styling (Lines 670-675)

**Current:** Plain text with a Clock icon and inline `style={{ color: 'hsl(var(--success))' }}`.

**Fix:** Replace with the `Badge` component using soft variants:
- **In-Progress:** `<Badge variant="soft-attention" showIcon>Time Remaining: {formattedTime}</Badge>` (renders Clock icon automatically via Badge's attention icon mapping -- but attention uses AlertTriangle; we need Clock. So we use a custom approach: render Badge without showIcon and manually include Clock.)
- **Completed:** `<Badge variant="soft-success" showIcon>Review Complete</Badge>` (renders Check icon automatically)

```tsx
// Before
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Clock className="h-4 w-4" />
  {timerActive
    ? <span className="tabular-nums">Time Remaining: {formattedTime}</span>
    : <span className="font-medium" style={{ color: 'hsl(var(--success))' }}>Review complete</span>
  }
</div>

// After
{timerActive ? (
  <Badge variant="soft-attention">
    <Clock className="w-3 h-3 mr-1" />
    <span className="tabular-nums">Time Remaining: {formattedTime}</span>
  </Badge>
) : (
  <Badge variant="soft-success" showIcon>
    Review Complete
  </Badge>
)}
```

Import `Badge` at the top of the file.

---

### 3. Acknowledgment Section Text Colors (Lines 527-551)

**Current:** "Training Acknowledgment" header and description use `text-muted-foreground`. Checkbox label conditionally uses `text-muted-foreground` when disabled.

**Fix:**
- Change header `<p>` from `text-muted-foreground` to `text-foreground`
- Change description `<p>` from `text-muted-foreground` to `text-foreground`
- Change checkbox label: always use `text-foreground` (keep `cursor-not-allowed` and `opacity-50` when disabled instead of muted color)

```tsx
// Header
<p className="font-medium mb-2 text-sm text-foreground">Training Acknowledgment</p>

// Description
<p className="text-sm text-foreground">...</p>

// Label (disabled state uses opacity instead of muted color)
className={cn(
  "text-sm font-medium leading-relaxed cursor-pointer select-none text-foreground",
  !checkboxEnabled && "opacity-60 cursor-not-allowed"
)}
```

---

### 4. Button and Tooltip Logic (Lines 729-753)

**Current:** The "Complete Training" button uses `disabled={timerActive || !presentationAcknowledged}` with no tooltip explaining why it is disabled.

**Fix:** Replace with `ButtonWithTooltip` when disabled, with a context-aware tooltip message:

```tsx
// When either condition not met, show ButtonWithTooltip
{quiz ? (
  // Start Quiz button (existing logic, unchanged)
  ...
) : (
  (timerActive || !presentationAcknowledged) ? (
    <ButtonWithTooltip
      tooltip={timerActive
        ? "Please wait for the viewing timer to complete."
        : "Please check the acknowledgment checkbox above to proceed."
      }
      disabled
      className={cn("transition-all duration-500")}
    >
      Complete Training
    </ButtonWithTooltip>
  ) : (
    <Button
      onClick={handleCompleteTraining}
      className={cn("transition-all duration-500 animate-scale-in")}
    >
      Complete Training
    </Button>
  )
)}
```

The `ButtonWithTooltip` component is already imported (line 5). The tooltip provides clear guidance on what is blocking the action.

---

### 5. Strict Styling Enforcement

- Remove inline `style={{ color: 'hsl(var(--success))' }}` (replaced by Badge variant)
- Remove raw `Clock` icon import usage in footer (handled by Badge children)
- All text elements use class-based styling only (`text-foreground`, `text-sm`, `font-medium`)

---

### Files Changed

| File | Change |
|------|--------|
| `src/components/VideoPlayerFullscreen.tsx` | All 5 items above |

### What Stays the Same

- Quiz flow, attestation logic, cancel confirmation dialogs
- CompletionOverlay component
- PresentationViewer component
- Database schema (no changes)
- AddContentModal save logic (already saves `duration_seconds`)

### Review

- **Top 3 Risks:** (1) If `duration_seconds` is 0 or null in existing records, fallback to 60s handles it safely. (2) Badge children with manual Clock icon is non-standard but necessary since Badge's attention icon is AlertTriangle, not Clock. (3) None structural.
- **Top 3 Fixes:** (1) Timer now respects admin-configured duration. (2) Badge-based timer display matches design system. (3) Tooltip on disabled button improves UX clarity.
- **Database Change:** No
- **Verdict:** Go

