

## Major Third Typography Utility System and Global Hardcoded Style Cleanup

### Overview

This plan creates heading utility classes (.text-h1 through .text-h4), adds a Utility Classes reference section to the Style Guide, and performs a full audit of all 64 files (1,700+ instances) to strip every hardcoded Tailwind font-size utility and replace it with the correct semantic tag or utility class.

---

### Scale Reference

```text
Utility Class   Rem         Pixels    Mapped From
-----------     ---         ------    -----------
.text-h1        3.052rem    ~49px     text-3xl / text-4xl
.text-h2        1.953rem    ~31px     text-2xl
.text-h3        1.563rem    ~25px     text-xl
.text-h4        1.25rem     20px      text-lg
.text-body      1rem        16px      text-base
.text-small     0.8rem      ~13px     text-sm
.text-xs        0.64rem     ~10px     text-xs (kept as-is, already remapped)
.text-code      0.9375rem   15px      (monospace)
```

---

### Part 1: Create Heading Utility Classes

**File: `src/index.css`** -- Add to `@layer components` block (lines 302-306)

Add four new heading utility classes alongside the existing .text-body, .text-small, .text-caption, .text-code:

```css
/* Heading utility classes -- for visual overrides on non-heading tags */
.text-h1 { font-size: 3.052rem; line-height: 1.2; }
.text-h2 { font-size: 1.953rem; line-height: 1.3; }
.text-h3 { font-size: 1.563rem; line-height: 1.4; }
.text-h4 { font-size: 1.25rem;  line-height: 1.5; }
```

These supplement the existing semantic classes and allow visual size overrides (e.g., an h2 tag styled as h3 visually).

---

### Part 2: Update Style Guide -- Utility Classes Section

**File: `src/pages/ComponentsGallery.tsx`** -- Insert new section after the existing Typography card (after line 607)

Add a new "Typography Utility Classes" card containing:

1. **Reference Table** -- columns: Class Name, Size (rem), Size (px), Usage. Lists all 8 utility classes.
2. **Semantic Tag vs. Visual Style** example -- demonstrates an h2 element using `.text-h3` to show how semantic meaning and visual presentation can be decoupled.
3. **Usage Guidelines** -- brief notes: "Use semantic HTML tags (h1-h4, p) by default. Apply utility classes only when a visual override is needed."

---

### Part 3: Global Hardcoded Style Cleanup

This is the bulk of the work. Every instance of the following Tailwind utilities will be removed and replaced:

**Targets for removal:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-[...]` (arbitrary values), plus conflicting `not-italic` and unnecessary `font-medium` overrides.

**Replacement strategy per context:**

| Current Usage | Replacement |
|---|---|
| Heading text using `text-3xl` / `text-4xl` | Use bare `<h1>` tag (inherits 3.052rem from global CSS) |
| Heading text using `text-2xl` | Use bare `<h2>` tag (inherits 1.953rem) |
| Heading text using `text-xl` | Use bare `<h3>` tag or `.text-h3` if tag differs |
| Heading text using `text-lg` | Use bare `<h4>` tag or `.text-h4` if tag differs |
| Body text using `text-base` | Remove class entirely (body inherits 1rem) |
| Secondary text using `text-sm` | Use `.text-small` class |
| Caption/label text using `text-xs` | Keep as `.text-xs` (already remapped to 0.64rem) or use `.text-small` if 13px is more appropriate |
| Code text | Use `.text-code` class |

**Files requiring changes (64 total, grouped by category):**

**UI Primitives (34 files in src/components/ui/):**
- card.tsx, table.tsx, sortable-table-head.tsx, command.tsx, breadcrumb.tsx, label.tsx, input.tsx, tabs.tsx, tooltip.tsx, badge.tsx, button.tsx, toggle.tsx, select.tsx, accordion.tsx, toast.tsx, dropdown-menu.tsx, banner.tsx, navigation-menu.tsx, context-menu.tsx, menubar.tsx, sidebar.tsx, input-otp.tsx, form.tsx, dialog.tsx, sheet.tsx, drawer.tsx, calendar.tsx, pagination.tsx, alert-dialog.tsx, popover.tsx, hover-card.tsx, option-list.tsx, ComponentUpdateIndicator.tsx, loading-spinner.tsx

**App Components (22 files in src/components/):**
- Header.tsx, TrainingCard.tsx, EditVideoModal.tsx, VideoPlayerFullscreen.tsx, VideoPlayerModal.tsx
- dashboard/: DashboardOverview.tsx, EmployeeManagement.tsx, EmployeeList.tsx, VideoManagement.tsx, VideoTable.tsx, AssignVideosModal.tsx, AddEmployeeModal.tsx, AdminManagement.tsx, DownloadDataModal.tsx
- content/: AddContentModal.tsx, ContentPlayer.tsx
- quiz/: CreateQuizModal.tsx, QuizModal.tsx
- shared/: DueDateSelector.tsx, TrainingAttestation.tsx
- video/: VideoPlayer.tsx, CompletionOverlay.tsx
- auth/: AuthErrorBoundary.tsx
- presentation/: PresentationViewer.tsx

**Pages (8 files in src/pages/):**
- Auth.tsx, EmployeeDashboard.tsx, AdminDashboard.tsx, ComponentsGallery.tsx, Landing.tsx, Index.tsx, NotFound.tsx, VideoPage.tsx

---

### What Will NOT Change

- Color utilities (text-foreground, text-muted-foreground, text-primary, etc.) -- these are color, not size
- Font-weight classes (font-bold, font-semibold) that are semantically correct per the style guide -- only removing those that conflict
- Layout/spacing utilities
- Icon sizes (w-4 h-4, etc.)

### Review

1. **Top 3 Risks:** (1) 1,700+ replacements across 64 files is high-volume; typos or missed context could break layouts. (2) Some `text-sm` instances in UI primitives like card.tsx and form.tsx are consumed by external libraries or shadcn patterns -- changing them requires careful validation. (3) Removing `text-base` from body-level elements that rely on it for specificity could cause inheritance issues in nested components.
2. **Top 3 Fixes:** (1) Every text element will follow the Major Third scale from a single source of truth. (2) New .text-h1 through .text-h4 utilities enable visual overrides without breaking semantic HTML. (3) The Style Guide becomes a complete, referenceable typography system for future prompts.
3. **Database Change:** No
4. **Verdict:** Go -- this is the final cleanup pass that completes the Major Third migration started in Phases 1-3.

