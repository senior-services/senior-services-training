

## Remaining Typography Cleanup -- Final Pass

### Overview

The audit found **~560 remaining hardcoded instances** across 10 files. The vast majority (~550) are in `ComponentsGallery.tsx`. The rest are 6 quick fixes in app components and 3 intentional keeps in UI primitives.

---

### A. App Component Fixes (6 changes)

| File | Line | Current | Replacement |
|---|---|---|---|
| `EmployeeList.tsx` | 155 | `<h3 className="text-xl font-semibold">` | `<h3 className="font-semibold">` (h3 inherits 1.563rem) |
| `EmployeeManagement.tsx` | 587 | `<h3 className="text-xl font-semibold">` | `<h3 className="font-semibold">` |
| `EmployeeManagement.tsx` | 670 | `<span className="text-lg font-semibold">` | `<span className="text-h4 font-semibold">` |
| `AdminManagement.tsx` | 195 | `<h3 className="text-xl font-semibold">` | `<h3 className="font-semibold">` |
| `ThumbnailTest.tsx` | 26 | `<h3 className="text-lg font-bold">` | `<h3 className="font-bold">` |
| `ErrorBoundary.tsx` | 121 | `<CardTitle className="text-2xl ...">` | `<CardTitle className="text-h2 ...">` |

### B. ComponentsGallery.tsx Cleanup (~550 instances)

This is the bulk of remaining work. The Gallery is the style reference page itself, so it must demonstrate the system correctly.

**Changes by section:**

1. **Page heading (line 202):** `text-4xl` on h1 -- remove (h1 inherits 3.052rem)

2. **Anchor navigation (lines 209-287):** ~16 anchor links each with `text-xs` -- replace all with `text-caption`

3. **Color Palette section (lines 300-500+):** ~60 instances
   - Category headers `<h4 className="text-sm ...">` -- replace with `text-small`
   - Color name labels `<div className="text-sm ...">` -- replace with `text-small`
   - CSS variable labels `<div className="text-xs ...">` -- replace with `text-caption`

4. **Spacing Tokens section:** Similar pattern -- `text-sm` on labels becomes `text-small`, `text-xs` on values becomes `text-caption`

5. **Typography section:** Some `text-sm`/`text-xs` used as demonstration examples -- these should use the semantic classes they are demonstrating

6. **Data Display, Form Controls, Interactive, Badge Rules sections (lines 1180-2056):** ~200 instances
   - Section sub-headers `<h3 className="text-lg ...">` -- remove `text-lg` (h3 inherits)
   - Description/label text `text-sm` -- replace with `text-small`
   - Caption/metadata text `text-xs` -- replace with `text-caption`

### C. Intentional Keeps (No Changes)

These are correct as-is and will NOT be changed:

| File | Reason |
|---|---|
| `dropdown-menu.tsx` (text-xs on shortcut) | Caption-level keyboard shortcut display |
| `command.tsx` (text-xs on group heading + shortcut) | Caption-level, matches shadcn pattern |
| `chart.tsx` (text-xs on recharts container) | Required by Recharts library for axis labels |
| `AddContentModal.tsx` (text-xs on char count) | Caption-level character counter |
| `calendar.tsx` (text-small on cells) | Already migrated to text-small |

---

### Review

1. **Top 3 Risks:** (1) ComponentsGallery is ~2,056 lines with ~550 replacements -- high volume in a single file. (2) Some Gallery text-sm/text-xs instances are intentional demonstrations of the typography scale; these must be handled carefully to avoid removing the examples. (3) The nav anchors at 0.64rem (text-caption) may feel small for clickable links -- but this matches the approved scale.
2. **Top 3 Fixes:** (1) Eliminates all remaining hardcoded font-size utilities outside of intentional keeps. (2) The Gallery itself becomes a living example of the Major Third system. (3) After this pass, zero non-exempt hardcoded sizes remain.
3. **Database Change:** No
4. **Verdict:** Go -- final cleanup pass to reach zero hardcoded font-size utilities.

