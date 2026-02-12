

## Part 2: Style Guide Utility Classes Section + Remaining App-Level Cleanup

### Overview

This continues the approved plan. Part 1 (heading utility classes in index.css + UI primitive cleanup) is done. This part covers:
1. Adding the Typography Utility Classes reference section to the Style Guide
2. Cleaning all remaining hardcoded font-size utilities across app components and pages

---

### A. Style Guide -- Typography Utility Classes Section

**File: `src/pages/ComponentsGallery.tsx`** -- Insert new card after the Typography card (after line 607)

Add a "Typography Utility Classes" card containing:

1. **Reference Table** with columns: Class, Size (rem), Size (px), Usage
   - `.text-h1` / 3.052rem / ~49px / Page titles (visual override)
   - `.text-h2` / 1.953rem / ~31px / Section headings (visual override)
   - `.text-h3` / 1.563rem / ~25px / Subsection headings (visual override)
   - `.text-h4` / 1.25rem / 20px / Minor headings (visual override)
   - `.text-body` / 1rem / 16px / Body text
   - `.text-small` / 0.8rem / ~13px / Secondary info
   - `.text-caption` / 0.64rem / ~10px / Captions and labels
   - `.text-code` / 0.9375rem / 15px / Code snippets

2. **Semantic Tag vs. Visual Style Example** -- an `<h2>` element with class `.text-h3` to demonstrate decoupling semantic meaning from visual presentation

3. **Usage Guidelines** -- "Use semantic HTML tags (h1-h4, p) by default. Apply utility classes only when a visual override is needed."

Also clean the remaining `text-sm` and `text-xs` instances in the existing Gallery sections (lines 653, 665, 674, 683, 692, 701, 710, 776, 786, 800, and throughout the rest of the file).

---

### B. Remaining App Component Cleanup (22 files)

Each file gets the same treatment: remove hardcoded Tailwind font-size utilities, replace with semantic tags or utility classes.

| File | Changes |
|---|---|
| **CompletionOverlay.tsx** | `text-2xl` on h3 -- remove (h3 inherits 1.563rem) |
| **VideoTable.tsx** | `text-xl` on h3 -- remove; `text-sm` on spans/p -- replace with `text-small`; `text-sm` on TableHead -- remove (inherits from primitive) |
| **DashboardOverview.tsx** | `text-sm` on CardTitle -- replace with `text-small`; `text-2xl` on stat values -- replace with `text-h2`; `text-sm` on p -- replace with `text-small` |
| **AssignVideosModal.tsx** | `text-xs` on ToggleGroupItem -- remove (inherits); `text-sm` on spans -- replace with `text-small` |
| **DownloadDataModal.tsx** | `text-base` on Label -- remove (Label inherits 1rem) |
| **AddContentModal.tsx** | `text-sm` on error/label text -- replace with `text-small`; `text-xs` on char count -- keep (caption-level) |
| **CreateQuizModal.tsx** | `text-base` on CardTitle -- remove; `text-sm` on error divs -- replace with `text-small`; `text-lg` on h3 -- remove (h3 inherits) |
| **QuizModal.tsx** | `text-2xl` on h2 -- remove (h2 inherits); `text-lg` on h3 -- remove (h3 inherits) |
| **DueDateSelector.tsx** | `text-sm` on Labels -- remove (Label inherits 1rem) |
| **AuthErrorBoundary.tsx** | `text-xl` on CardTitle -- remove; `text-sm` on p -- replace with `text-small`; `text-xs` on details -- keep (dev-only caption) |
| **PresentationViewer.tsx** | `text-sm` on p/span -- replace with `text-small` |
| **ErrorBoundary.tsx (ui)** | `text-2xl` on CardTitle -- remove; `text-sm` on p/summary -- replace with `text-small`; `text-xs` on pre -- keep (dev-only) |
| **EditVideoModal.tsx** | Audit and replace any remaining `text-sm`/`text-xs` |
| **VideoPlayerFullscreen.tsx** | Audit and replace any remaining hardcoded sizes |
| **VideoPlayerModal.tsx** | Audit and replace any remaining hardcoded sizes |
| **EmployeeList.tsx** | Audit and replace `text-sm`/`text-xs` with `text-small` |
| **AdminManagement.tsx** | Audit and replace any remaining hardcoded sizes |

### C. Remaining Page Cleanup (8 files)

| File | Changes |
|---|---|
| **Auth.tsx** | `text-2xl` on h1 -- remove (h1 inherits); `text-sm` throughout -- replace with `text-small` |
| **AuthCallback.tsx** | `text-xl` on h2 -- remove; `text-lg` on span -- remove; `text-sm` on div -- replace with `text-small` |
| **EmployeeDashboard.tsx** | `text-2xl`/`text-3xl` responsive on h1/h2 -- remove (use bare tags); `text-base`/`text-lg` responsive on p -- remove; `text-sm` -- replace with `text-small` |
| **AdminDashboard.tsx** | Audit and replace any remaining hardcoded sizes |
| **ComponentsGallery.tsx** | Clean all remaining `text-sm`/`text-xs` in non-Typography sections |
| **Landing.tsx** | Audit and replace any remaining hardcoded sizes |
| **Index.tsx** | `text-4xl` on h1 -- remove (h1 inherits); `text-xl` on p -- replace with `text-h4` or remove |
| **NotFound.tsx** | `text-4xl` on h1 -- remove; `text-xl` on p -- replace with `text-h4` |

### D. Remaining UI Primitive Stragglers

| File | Changes |
|---|---|
| **badge.tsx** | `text-sm` still in cva base -- remove (badge should inherit its own size) |
| **table.tsx** | `text-sm` on TableHead -- replace with `text-small` |
| **sortable-table-head.tsx** | `text-sm` -- replace with `text-small` |
| **menubar.tsx** | `text-xs` on shortcut span -- keep (caption-level keyboard shortcut) |
| **sidebar.tsx** | `text-sm` on group label -- replace with `text-small` |

---

### Review

1. **Top 3 Risks:** (1) Removing responsive font-size classes (e.g., `sm:text-2xl`) on EmployeeDashboard headings means mobile and desktop will use the same size -- verify readability on small screens. (2) Badge losing `text-sm` from its cva base could affect badge sizing if no other size mechanism is in place. (3) High file count (30+ files) means careful validation is needed.
2. **Top 3 Fixes:** (1) Style Guide gets a complete, referenceable utility class table. (2) All app components will use the Major Third scale consistently. (3) Zero hardcoded Tailwind font-size utilities remain after this pass.
3. **Database Change:** No
4. **Verdict:** Go -- completes the global typography migration.

