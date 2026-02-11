

## Comprehensive Form Text Refactor: Remaining Files

### What Changes

Apply standardized `.form-helper-text` and `.form-additional-text` CSS classes to the four remaining files that contain form field text using inline styles.

### Audit Results

All `text-xs text-muted-foreground` instances were reviewed. Here is the classification:

| File | Line | Position | Classification | Action |
|------|------|----------|---------------|--------|
| AddEmployeeModal.tsx | 138 | Below email input | Additional text | Update class |
| Auth.tsx | 227 | Below sign-in email | Additional text | Update class |
| Auth.tsx | 278 | Below sign-up email | Additional text | Update class |
| AddContentModal.tsx | 287 | Below URL input | Additional text | Update class |
| QuizModal.tsx | 232 | Between heading and options | Helper text | Update class |
| Auth.tsx | 202, 253 | Inside Label element | Label annotation | No change |
| DashboardOverview.tsx | 44, 59, 74, 89 | Card stat descriptions | Not form text | No change |
| EmployeeManagement.tsx | 633, 675, 701 | Table cells / badges | Not form text | No change |
| VideoManagement.tsx | 432, 455 | Table cells / badges | Not form text | No change |
| EditVideoModal.tsx | 1006 | Content source label | Not form text | No change |

### File Changes

**1. `src/components/dashboard/AddEmployeeModal.tsx` (line 138)**

Replace: `className="text-xs text-muted-foreground"`
With: `className="form-additional-text not-italic"`

The `not-italic` override preserves the current non-italic appearance since `.form-additional-text` includes italic by default.

**2. `src/pages/Auth.tsx` (lines 227 and 278)**

Two instances -- both are hint text below email inputs.

Line 227 replace: `className="text-xs text-muted-foreground"`
With: `className="form-additional-text not-italic"`

Line 278 replace: `className="text-xs text-muted-foreground"`
With: `className="form-additional-text not-italic"`

Note: These use `<div>` tags (not `<p>`), which is correct since they are tied to `aria-describedby`. Tag type stays unchanged.

**3. `src/components/content/AddContentModal.tsx` (line 287)**

Replace: `className="text-xs text-muted-foreground mt-1 flex items-center gap-1"`
With: `className="form-additional-text not-italic flex items-center gap-1"`

The `flex items-center gap-1` is kept for the inline icon layout. The `mt-1` is dropped since `.form-additional-text` provides `mt-1.5` (negligible visual difference).

**4. `src/components/quiz/QuizModal.tsx` (line 232)**

Replace: `className="text-xs text-muted-foreground"`
With: `className="form-helper-text"`

This text appears between the question heading and answer options, matching the helper text pattern. This will change the color from `text-muted-foreground` to `text-foreground` to align with the standard.

### What Stays the Same

- Label annotations inside `<Label>` elements (Auth.tsx lines 202, 253) -- not form field text
- Dashboard card descriptions -- not form field text
- Table cell text and status badges -- not form field text
- Content source metadata -- not form field text
- All HTML element types (`<p>`, `<div>`) stay as they are
- All `aria-describedby` relationships unchanged
- No layout or structural changes

### Review

- **Top 5 Risks:** (1) Minor spacing shift on AddContentModal from `mt-1` to `mt-1.5` -- negligible. (2) QuizModal helper text changes from muted to foreground color -- aligns with standard. (3) `not-italic` overrides on additional text preserve current non-italic appearance. (4) No accessibility regression -- ARIA attributes unchanged. (5) No functional or data impact.
- **Top 5 Fixes:** (1) Completes the refactor across 100% of form field text in the app. (2) All form text now governed by two centralized CSS classes. (3) Future style changes are single-point updates. (4) Clear audit trail of what qualifies as form text vs. other UI text. (5) Consistent naming convention throughout the codebase.
- **Database Change Required:** No
- **Go/No-Go:** Go

