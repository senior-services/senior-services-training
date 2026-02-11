

## Clean Utility Class Overrides from Form Text Elements

### What Changes

Remove all extra Tailwind utility classes from `form-helper-text` and `form-additional-text` elements so the global CSS classes are the sole source of styling. No CSS definitions change -- only the usage sites are cleaned.

### The Problem

Three files have leftover utility classes attached alongside the semantic class:

- `not-italic` on 4 elements (overriding the global italic style)
- `flex items-center gap-1` on 1 element (layout for an inline icon)

### File Changes

**1. `src/components/dashboard/AddEmployeeModal.tsx` (line 138)**

`className="form-additional-text not-italic"` becomes `className="form-additional-text"`

**2. `src/pages/Auth.tsx` (line 227)**

`className="form-additional-text not-italic"` becomes `className="form-additional-text"`

**3. `src/pages/Auth.tsx` (line 278)**

`className="form-additional-text not-italic"` becomes `className="form-additional-text"`

**4. `src/components/content/AddContentModal.tsx` (line 287)**

`className="form-additional-text not-italic flex items-center gap-1"` becomes `className="form-additional-text"`

The inline icon (Info tooltip button on line 291) already has `inline-flex` on itself, so it will still render inline with the text. The `gap-1` spacing between text and icon will be handled by natural inline flow.

### Visual Impact

- All four additional text instances will now render in **italic** (matching the global `.form-additional-text` standard). Previously `not-italic` was overriding this.
- The AddContentModal icon spacing may tighten slightly without `gap-1`, but the button's own `inline-flex` keeps it inline.

### No Changes Needed

- `form-helper-text` usages in EditVideoModal, CreateQuizModal, QuizModal, and ComponentsGallery are already clean (single class only).
- `form-additional-text` usages in ComponentsGallery are already clean.
- CSS class definitions in `src/index.css` stay the same.

### Review

- **Top 3 Risks:** (1) Four additional text elements gain italic -- intentional alignment with the design system. (2) AddContentModal icon spacing slightly changes -- minimal impact. (3) No functional or accessibility regression.
- **Top 3 Fixes:** (1) Eliminates all utility class overrides on form text. (2) Global classes are now the single source of truth. (3) Four single-line edits, zero logic changes.
- **Database Change:** No
- **Verdict:** Go

