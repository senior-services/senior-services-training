
## Debug + Fix: Fullscreen dialog “X” is now more misaligned

### What’s actually causing the misalignment (root cause)
In `FullscreenDialogContent`, there’s a layout rule that automatically adds **large padding** (`px-6 py-6`) to *most direct children* so the dialog body content is nicely spaced.

The close button (`DialogPrimitive.Close`) is also a direct child, and it **accidentally gets that same padding**. Because the button is absolutely positioned, that extra padding makes the clickable box large and pushes the “X” icon down and inward. When we changed `top-2` → `top-4`, we moved the already-padded button even further down, which is why it looks *more* misaligned now.

### Goals (stay in scope)
- Keep the “auto-padding for body content” behavior.
- Prevent the close button from being treated like body content.
- Position the “X” so it visually centers with the header row (like the regular dialog).
- Keep this consistent for both the Assign Videos fullscreen dialog and the Component Gallery fullscreen dialog example.

---

## Minimal, clean implementation

### 1) Exclude the close button from the auto-padding rule
**File:** `src/components/ui/dialog.tsx`  
**Change:** Update the selector on `FullscreenDialogContent` so it does **not** apply padding to elements marked as close buttons.

- Current selector:
  - Applies padding to any direct child that is not header/footer/scroll-area.
- Update selector:
  - Also exclude `[data-dialog-close]`.

**Planned update (conceptual):**
- From:
  - `[&>:not([data-dialog-header]):not([data-dialog-footer]):not([data-dialog-scroll-area])]:px-6`
- To:
  - `[&>:not([data-dialog-header]):not([data-dialog-footer]):not([data-dialog-scroll-area]):not([data-dialog-close])]:px-6`

### 2) Mark the close button so it’s excluded
**File:** `src/components/ui/dialog.tsx`  
Add `data-dialog-close` to the `DialogPrimitive.Close` inside `FullscreenDialogContent`.

### 3) Position the close button based on header geometry (not the old padded box)
Once the close button is no longer receiving `py-6`, we should set it to a predictable size and position so it centers with the header row:

- Give it an explicit tap target size (better UX/accessibility): `h-10 w-10` and center the icon.
- Move to a consistent inset: `right-4 top-3.5` (14px from top works well with the header’s `py-4` and the title’s taller line-height).
- Keep existing visual behaviors (opacity/hover/open-state) and z-index.

**Planned close button class direction (conceptual):**
- `absolute right-4 top-3.5 h-10 w-10 inline-flex items-center justify-center ... z-10`

---

## Why this is the best fix (non-fragile)
- It fixes the real cause (the close button unintentionally inheriting the dialog-body padding rule).
- It avoids “magic-number tuning” that will break if header padding or typography changes later.
- It improves consistency between the app’s fullscreen dialogs and the Component Gallery example.
- It keeps the existing design-system pattern intact (header/footer full width; body auto padded).

---

## Acceptance checks (quick QA)
1. Open **Assign Videos** fullscreen dialog:
   - “X” is vertically aligned with the header/title row (not too high/low).
   - “X” is comfortably clickable (not tiny).
2. Open **Components Gallery → Open Fullscreen Dialog**:
   - Same alignment behavior.
3. Keyboard check:
   - Tab to the close button and press Enter/Space to close.

---

## Files touched
- `src/components/ui/dialog.tsx`
  - Adjust auto-padding selector for fullscreen content
  - Add `data-dialog-close` to the fullscreen close button
  - Update fullscreen close button positioning/sizing classes
