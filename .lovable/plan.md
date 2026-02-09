

## Remove Top Margin from Helper Text Pattern

### What's changing
Removing `mt-1` from the helper text pattern everywhere it appears, so the helper text sits closer to the label above it. The bottom margin `mb-1.5` remains to keep spacing before the input.

### Changes (5 files)

**File 1: `STYLEGUIDE.md`**
- Update the helper text pattern from `mt-1 mb-1.5` to `mb-1.5`
- Update the guideline note from "Spacing: `mt-1` below label, `mb-1.5` above input" to "Spacing: `mb-1.5` above input"

**File 2: `src/pages/ComponentsGallery.tsx`**
- Change the helper text example class from `text-xs text-muted-foreground mt-1 mb-1.5` to `text-xs text-muted-foreground mb-1.5`

**File 3: `src/components/EditVideoModal.tsx`**
- Change the multiple choice helper text class from `mt-1 mb-1.5` to `mb-1.5`

**File 4: `src/components/quiz/CreateQuizModal.tsx`**
- Change the multiple choice helper text class from `mt-1 mb-1.5` to `mb-1.5`

**File 5: `src/components/quiz/QuizModal.tsx`**
- No change needed -- this helper text already has no `mt-1`

### Review
- **Top 5 Risks**: (1) None -- purely cosmetic spacing tweak. (2) All instances must be updated consistently. (3) No logic changes. (4) No database changes. (5) Minimal risk.
- **Top 5 Fixes**: (1) Update STYLEGUIDE.md pattern. (2) Update gallery example. (3) Update EditVideoModal. (4) Update CreateQuizModal. (5) Keep QuizModal as-is.
- **Database Change Required**: No
- **Go/No-Go**: Go
