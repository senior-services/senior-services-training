

## Refactor: Conditional Reveal for Training Type + Timer

### What Changes

The Training Type toggle and Viewing Timer sections will be hidden until a URL is entered. Auto-detection sets the toggle value. The timer label, helper text, and additional text are updated to match the specified class names and copy. All utility classes are stripped from the text elements.

### Behavior

1. User opens modal -- sees Title, Description, URL fields only
2. User enters a valid URL -- Training Type toggle appears (auto-set to Video or Presentation based on URL; defaults to Video if ambiguous)
3. If Presentation is active -- Viewing Timer input appears below the toggle

### File: `src/components/content/AddContentModal.tsx`

**Conditional visibility for Training Type block (lines 309-327):**
Wrap in `{url.trim() && !urlError && ( ... )}` so it only renders when a non-empty, error-free URL is present.

**Conditional visibility for Viewing Timer block (lines 329-345):**
Keep existing `contentType === "presentation"` guard, but nest it inside the URL check (or keep separate since the toggle itself is hidden, so Presentation can never be active without a URL).

**Rename label (line 331):**
Change `"Minimum Viewing Time (seconds)"` to `"Viewing Timer"`

**Restructure timer text elements (lines 331-343):**
Replace the current block with:
- Label: `Viewing Timer`
- Helper text (between label and input): `<p className="form-helper-text">Enter the time required for review.</p>` -- no additional utility classes
- Input: unchanged (`max-w-[100px]`, type number, min 60)
- Additional text (below input): `<p className="form-additional-text">Minimum 60 seconds recommended. Necessary for compliance to ensure review, as progress cannot be tracked for presentation files.</p>` -- no additional utility classes, uses period instead of dash

**Reset logic:**
No change needed -- `contentType` already resets to `"video"` and `minViewingTime` to `60` on open/close. When URL is cleared, the toggle hides and the default "video" remains ready for next URL entry.

### What Stays the Same

- All other form fields, validation, save logic, privacy hint text
- Auto-detection logic in `handleUrlChange`
- `ContentFormData` interface
- Global toggle styling (`text-xs` in toggle.tsx)
- No database changes

### Review

- **Top 3 Risks:** (1) If user clears URL after selecting Presentation, the toggle hides but `contentType` stays as "presentation" -- acceptable since the toggle reappears on next URL entry and auto-detection overrides. (2) None structural. (3) None.
- **Top 3 Fixes:** (1) Cleaner UX -- fewer fields visible until needed. (2) Semantic class usage enforced (no utility overrides). (3) Helper/additional text placement matches style guide conventions.
- **Database Change:** No
- **Verdict:** Go
