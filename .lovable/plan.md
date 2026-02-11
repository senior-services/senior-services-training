

## Style Guide + Add Training Modal Updates

### 1. Toggle Font Size -- Global Change

**File: `src/components/ui/toggle.tsx`** (line 8)

Change `text-sm` to `text-xs` in the base `toggleVariants` CVA string. This is the single source of truth for all Toggle and ToggleGroup items across the app, so every instance updates automatically.

Before: `"btn-toggle ... text-sm font-medium ..."`
After: `"btn-toggle ... text-xs font-medium ..."`

**File: `STYLEGUIDE.md`** -- Add a note under a new "Toggle Components" section documenting that toggles use `text-xs` (14px) for consistency with Labels, Badge, and Tooltip.

### 2. Reorder Privacy Hint Text

**File: `src/components/content/AddContentModal.tsx`** (line 294)

Change:
> Set Google Slides (saved as .ppsx) to 'Anyone with the link' and YouTube to 'Unlisted' so your team can see it.

To:
> Set YouTube to 'Unlisted' and Google Slides (saved as .ppsx) to 'Anyone with the link' so your team can see it.

### 3. Move Helper Text Below the Input (as Additional Text)

**File: `src/components/content/AddContentModal.tsx`** (lines 329-343)

Restructure the Minimum Viewing Time block:
- Remove the `<p className="form-helper-text">` from between the label and input
- Add the input directly after the label (with `max-width: 100px` via `className="max-w-[100px]"`)
- Add a `<p className="form-additional-text">` **after** the input with updated text:
  > Minimum 60 seconds recommended -- necessary for compliance to ensure review, as progress cannot be tracked for presentation files.

Note the text changes: "required" becomes "recommended", "PPSX" becomes "presentation", and the dash style is an em-dash.

### Summary of Files Changed

| File | Change |
|---|---|
| `src/components/ui/toggle.tsx` | `text-sm` to `text-xs` in base CVA |
| `STYLEGUIDE.md` | Add Toggle section documenting `text-xs` |
| `src/components/content/AddContentModal.tsx` | Reorder privacy text, move helper to additional text below input, set input max-width 100px |

### Review

- **Top 3 Risks:** (1) Changing toggle font globally -- low risk since `text-xs` is already the standard for labels/badges per the typography memory. (2) None structural. (3) None.
- **Top 3 Fixes:** (1) Consistent typography across all toggle instances. (2) Privacy hint reads in logical order (YouTube first, more common). (3) Compliance text repositioned as additional text per form conventions.
- **Database Change:** No
- **Verdict:** Go
