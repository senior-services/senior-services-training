

## Revised: Update Helper Text Patterns in Style Guide

### What Changes

1. Remove "additional context" from Radio Button Group and Checkbox Group examples (they only support optional helper text between label and fields).
2. Ensure Select Dropdown, Text Input (the Email field), and Textarea all demonstrate both optional patterns: helper text (above) and additional context (below).

### Detailed Changes

**File: `src/pages/ComponentsGallery.tsx`**

**1. Remove additional context from Radio Button Group (lines 819-821)**

Delete the paragraph: "Select the size that best fits your needs."

**2. Remove additional context from Checkbox Group (lines 838-840)**

Delete the paragraph: "You can select multiple options. Changes take effect immediately."

**3. Select Dropdown already has additional context -- keep it as-is** (lines 855-857)

Already shows: "You can change this selection at any time." No change needed.

**4. Email Address field already shows both patterns -- keep as-is** (lines 734-745)

Already demonstrates helper text above and additional context below. No change needed.

**5. Add helper text to Textarea (above the textarea control)**

Currently the Textarea only has a label. Add helper text between label and control:

```
Helper text: "Provide as much detail as possible."
```
Styled as `text-xs text-foreground mt-0 mb-1.5`, wrapped with label in a `div`.

**6. Add additional context below Textarea**

```
Additional context: "Maximum 500 characters recommended."
```
Styled as `text-xs text-muted-foreground italic mt-1.5`.

**7. Add helper text to Select Dropdown (above the Select control)**

Currently the Select only has a label and additional context below. Add helper text between label and control:

```
Helper text: "Choose from the available options."
```
Styled as `text-xs text-foreground mt-0 mb-1.5`, wrapped with label in a `div`.

### Updated Helper Text Rules Summary

| Field Type | Helper Text (above) | Additional Context (below) |
|------------|---------------------|---------------------------|
| Text Input | Optional | Optional |
| Textarea | Optional | Optional |
| Select Dropdown | Optional | Optional |
| Radio Button Group | Optional | Not used |
| Checkbox Group | Optional | Not used |

### What Stays the Same

- Email Address field unchanged (already shows both)
- Disabled input unchanged
- Switches, toggles, single checkbox unchanged
- Section header and card layout unchanged
- No new components or imports needed

### Review

- **Top 5 Risks:** (1) Adding helper text to Textarea and Select increases visual density -- intentional for documentation purposes. (2) No accessibility regression -- all text maintains WCAG AA contrast. (3) Style guide only -- no production form changes. (4) No functional impact. (5) No data or security impact.
- **Top 5 Fixes:** (1) Consistent documentation of both optional patterns across text input, textarea, and select. (2) Radio and checkbox groups simplified to helper text only. (3) Clear visual hierarchy maintained. (4) Wrapper pattern applied consistently. (5) Each field type's supported patterns clearly demonstrated.
- **Database Change Required:** No
- **Go/No-Go:** Go

