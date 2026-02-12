

## Refactor: Shared Training Attestation Component

### Current State

There are **three separate attestation implementations**, each with different styling, text, and structure:

1. **CompletionOverlay** (video without quiz) -- `CompletionOverlay.tsx` lines 51-65
2. **Presentation acknowledgment** (presentation without quiz) -- `VideoPlayerFullscreen.tsx` lines 534-574
3. **Quiz attestation** (video/presentation with quiz) -- `VideoPlayerFullscreen.tsx` lines 581-625

### New Shared Component

Create `src/components/shared/TrainingAttestation.tsx` with unified content, styling, and enablement logic.

**Standardized Content:**
- **Title (bold):** "Training Acknowledgment"
- **Body text:** "Please review all training content carefully. By acknowledging, you confirm you've read and understood the material -- your confirmation will be recorded for compliance."
- **Checkbox label:** "I certify that I have read and understood this content."

**Standardized Styling:**
- Disabled state: transparent/no background, disabled checkbox, muted text
- Enabled state: `bg-background` with standard `border border-border rounded-lg p-6`, active checkbox, `text-foreground` on all text
- No utility classes like `not-italic`, `flex`, `items-center`, `gap-1` on text elements
- Title and checkbox label use `text-foreground`

**Props interface:**

```text
enabled        boolean    Whether the checkbox can be interacted with
checked        boolean    Current checked state
onCheckedChange (checked: boolean) => void
disabledTooltip string    Tooltip text shown when disabled
```

**Enablement logic is handled by the parent** -- the component simply receives `enabled`:
- For videos with quiz: enabled when all questions answered
- For presentations without quiz: enabled when timer reaches 0:00
- For videos without quiz (CompletionOverlay): always enabled

**Tooltip integration:** When `enabled` is false, the entire attestation section is wrapped in a Tooltip (reusing existing pattern) with the `disabledTooltip` message.

---

### Files Changed

| File | Change |
|------|--------|
| `src/components/shared/TrainingAttestation.tsx` | **New** -- shared attestation component |
| `src/components/VideoPlayerFullscreen.tsx` | Replace presentation attestation (lines 534-574) and quiz attestation (lines 581-625) with `TrainingAttestation` |
| `src/components/video/CompletionOverlay.tsx` | Replace inline attestation (lines 51-65) with `TrainingAttestation` |

---

### Detailed Changes

#### 1. New File: `src/components/shared/TrainingAttestation.tsx`

- Renders a card container (`border border-border rounded-lg p-6`)
- Background toggles: transparent when disabled, `bg-background` when enabled
- Title: `<p>` with `font-semibold text-sm text-foreground`
- Body: `<p>` with `text-sm text-foreground`
- Checkbox + label section with proper `id` and `htmlFor` linkage
- When disabled: wraps in `Tooltip` with `disabledTooltip` text, checkbox is disabled, label uses `text-muted-foreground cursor-not-allowed`
- When enabled: checkbox is active, label uses `text-foreground cursor-pointer`
- Includes screen reader live region for accessibility announcements
- All text elements use only semantic classes -- no `flex`, `items-center`, `gap-1`, `not-italic` on text

#### 2. Update `VideoPlayerFullscreen.tsx`

- **Remove** presentation attestation block (lines 534-574) and replace with:
  ```
  <TrainingAttestation
    enabled={checkboxEnabled}
    checked={presentationAcknowledged}
    onCheckedChange={setPresentationAcknowledged}
    disabledTooltip="Please wait for the viewing timer to complete."
  />
  ```
- **Remove** quiz attestation block (lines 581-625) and replace with:
  ```
  <TrainingAttestation
    enabled={allQuestionsAnswered}
    checked={quizAttestationChecked}
    onCheckedChange={setQuizAttestationChecked}
    disabledTooltip="Complete the questions above to enable this checkbox."
  />
  ```
- Remove now-unused inline Checkbox/Label imports if no longer needed elsewhere in the file (they are still used elsewhere, so imports stay)

#### 3. Update `CompletionOverlay.tsx`

- Replace the inline attestation block (lines 51-65) with:
  ```
  <TrainingAttestation
    enabled={true}
    checked={attestationChecked}
    onCheckedChange={setAttestationChecked}
    disabledTooltip=""
  />
  ```
- The overlay context is always-enabled (video finished, no quiz), so `enabled={true}`

---

### What Stays the Same

- All timer logic, quiz flow, and button gating logic in `VideoPlayerFullscreen.tsx`
- `ButtonWithTooltip` usage on action buttons
- `CompletionOverlay` structure (only the attestation internals change)
- Screen reader announcements (moved into the shared component)

### Review

1. **Top 3 Risks:** (1) The CompletionOverlay has a more compact layout -- the shared component's card style may feel large inside the overlay. Mitigated by passing an optional `compact` prop or letting the overlay's existing container handle spacing. (2) Removing the a11y announcement state from the parent -- the shared component will manage its own announcements. (3) Tooltip portal rendering inside the overlay's absolute-positioned container -- already handled by TooltipPrimitive.Portal per existing standards.
2. **Top 3 Fixes:** (1) Single source of truth for attestation text, eliminating drift. (2) Consistent disabled/enabled visual states across all flows. (3) Clean semantic styling with no stray utility classes on text.
3. **Database Change:** No
4. **Verdict:** Go -- consolidates three duplicated patterns into one reusable component with consistent UX.
