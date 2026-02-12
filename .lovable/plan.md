

## QA Audit Report: CSS-as-the-Brain Compliance

### Audit Summary

57 files inspected. 5 files with CVA definitions still contain raw Tailwind utility strings in their base and/or variant objects. The 4 core primitives (badge, button, input, card, toggle) are CLEAN. The failures are in secondary CVA components that were not addressed in the previous refactors.

---

### CLEAN Files (52 of 57) -- No Action Required

**Core Primitives (fully semantic):**
- `badge.tsx` -- base: `"badge-base"`, all 28 variants semantic
- `button.tsx` -- base: `"button-base"`, 6 variants + 4 sizes semantic
- `input.tsx` -- `"input-base"` only
- `card.tsx` -- `"card-base"` only (sub-components use layout utilities, acceptable)
- `toggle.tsx` -- base: `"button-toggle"`, 3 variants + 4 sizes semantic

**Typography compliance (zero `text-xs`/`text-sm`/`text-base`):**
- All files use exclusively `text-small`, `text-caption`, `text-code`, `text-h1`-`text-h4`, or `text-body`

**Layout-only files (no CVA, inline layout utilities acceptable):**
accordion, alert-dialog, aspect-ratio, avatar, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, label, loading-spinner, menubar, navigation-menu (partial -- see below), option-list, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, skeleton, slider, sonner, sortable-table-head, switch, table, tabs, textarea, toaster, tooltip, button-with-tooltip, icon-button-with-tooltip, ComponentUpdateIndicator, ErrorBoundary, error-boundary

---

### FAILED Files (5 of 57) -- Require Purge

#### 1. `banner.tsx` (CRITICAL)

**CVA base string (line 9):** `"relative w-full rounded-lg border transition-shadow duration-300"` -- 6 raw utilities.

**Variant objects (lines 13-21):** 8 variants with raw utilities like `"bg-primary/10 text-primary border-primary/20"`.

**Size objects (lines 23-25):** 2 sizes with raw utilities like `"p-4 shadow-card hover:shadow-lg"`.

**Fix:** Create `.banner-base`, `.banner-default`, `.banner-info`, `.banner-success`, `.banner-warning`, `.banner-error`, `.banner-destructive`, `.banner-attention`, `.banner-size-default`, `.banner-size-compact` in `index.css`. Strip all utilities from `banner.tsx` CVA.

#### 2. `sheet.tsx` (MODERATE)

**CVA base string (line 32):** `"fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in ..."` -- 15+ raw utilities.

**Side variants (lines 36-42):** 4 variants with raw animation/position utilities.

**Fix:** Create `.sheet-base`, `.sheet-top`, `.sheet-bottom`, `.sheet-left`, `.sheet-right` in `index.css`.

#### 3. `toast.tsx` (MODERATE)

**CVA base string (line 26):** `"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg ..."` -- 20+ raw utilities.

**Variant objects (lines 30-35):** 3 variants with raw utilities.

**Fix:** Create `.toast-base`, `.toast-default`, `.toast-destructive`, `.toast-success` in `index.css`.

#### 4. `toggle-group.tsx` (LOW)

**CVA base string (line 9):** `"flex items-center w-fit"` -- 3 raw utilities.

**Variant objects (lines 13-14):** 2 variants with raw utilities.

**Fix:** Create `.toggle-group-base`, `.toggle-group-default`, `.toggle-group-pill` in `index.css`.

#### 5. `navigation-menu.tsx` (LOW)

**CVA base string (line 44):** `navigationMenuTriggerStyle` has `"group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium ..."` -- 15+ raw utilities.

**Fix:** Create `.nav-menu-trigger` in `index.css`.

---

### Remediation Plan

#### Phase 1: Add CSS Classes to `src/index.css`

Add the following semantic classes after the existing Master Templates section:

```css
/* ── Banner Master Template ── */
.banner-base {
  @apply relative w-full rounded-lg border transition-shadow duration-300;
}
.banner-default     { @apply bg-background text-foreground; }
.banner-info        { @apply bg-primary/10 text-primary border-primary/20; }
.banner-information { @apply bg-primary/10 text-primary border-primary/20; }
.banner-success     { @apply bg-success/10 text-success border-success/20; }
.banner-warning     { @apply bg-warning/10 text-warning border-warning/20; }
.banner-error       { @apply bg-destructive/10 text-destructive border-destructive/20; }
.banner-destructive { @apply bg-destructive/10 text-destructive border-destructive/20; }
.banner-attention   { @apply bg-attention/10 text-attention border-attention/20; }
.banner-size-default { @apply p-4 shadow-card hover:shadow-lg; }
.banner-size-compact { @apply py-2 px-3; }

/* ── Sheet Master Template ── */
.sheet-base {
  @apply fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out
    data-[state=open]:animate-in data-[state=closed]:animate-out
    data-[state=closed]:duration-300 data-[state=open]:duration-500;
}
.sheet-top    { @apply inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top; }
.sheet-bottom { @apply inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom; }
.sheet-left   { @apply inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm; }
.sheet-right  { @apply inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm; }

/* ── Toast Master Template ── */
.toast-base {
  @apply group pointer-events-auto relative flex w-full items-center justify-between
    space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all
    data-[swipe=cancel]:translate-x-0
    data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
    data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
    data-[swipe=move]:transition-none
    data-[state=open]:animate-in data-[state=closed]:animate-out
    data-[swipe=end]:animate-out data-[state=closed]:fade-out-80
    data-[state=closed]:slide-out-to-top-full
    data-[state=open]:slide-in-from-top-full;
}
.toast-default     { @apply border bg-background text-foreground; }
.toast-destructive { @apply destructive border-destructive bg-destructive text-destructive-foreground; }
.toast-success     { @apply success border-success bg-background text-success; }

/* ── Toggle Group Master Template ── */
.toggle-group-base    { @apply flex items-center w-fit; }
.toggle-group-default { @apply gap-1; }
.toggle-group-pill    { @apply gap-0 bg-muted rounded-full p-1.5; }

/* ── Navigation Menu Trigger ── */
.nav-menu-trigger {
  @apply group inline-flex h-10 w-max items-center justify-center rounded-md
    bg-background px-4 py-2 font-medium transition-colors
    hover:bg-accent hover:text-accent-foreground
    focus:bg-accent focus:text-accent-foreground focus:outline-none
    disabled:pointer-events-none disabled:opacity-50
    data-[active]:bg-accent/50 data-[state=open]:bg-accent/50;
}
```

#### Phase 2: Strip Utilities from Component CVA Definitions

**`banner.tsx`** -- Replace CVA base and all variants with semantic classes:
```tsx
const bannerVariants = cva("banner-base", {
  variants: {
    variant: {
      default: "banner-default",
      info: "banner-info",
      information: "banner-information",
      success: "banner-success",
      warning: "banner-warning",
      error: "banner-error",
      destructive: "banner-destructive",
      attention: "banner-attention",
    },
    size: {
      default: "banner-size-default",
      compact: "banner-size-compact",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

**`sheet.tsx`** -- Replace CVA:
```tsx
const sheetVariants = cva("sheet-base", {
  variants: {
    side: {
      top: "sheet-top",
      bottom: "sheet-bottom",
      left: "sheet-left",
      right: "sheet-right",
    },
  },
  defaultVariants: { side: "right" },
});
```

**`toast.tsx`** -- Replace CVA:
```tsx
const toastVariants = cva("toast-base", {
  variants: {
    variant: {
      default: "toast-default",
      destructive: "toast-destructive",
      success: "toast-success",
    },
  },
  defaultVariants: { variant: "default" },
});
```

**`toggle-group.tsx`** -- Replace CVA:
```tsx
const toggleGroupVariants = cva("toggle-group-base", {
  variants: {
    variant: {
      default: "toggle-group-default",
      pill: "toggle-group-pill",
    },
  },
  defaultVariants: { variant: "default" },
});
```

**`navigation-menu.tsx`** -- Replace CVA:
```tsx
const navigationMenuTriggerStyle = cva("nav-menu-trigger");
```

#### Phase 3: Update Style Guide (`ComponentsGallery.tsx`)

Add Banner, Sheet, Toast, Toggle Group, and Nav Menu Trigger to the Master Templates section alongside the existing Button, Badge, Input, and Card definitions.

---

### Files Changed Summary

| File | Change |
|---|---|
| `src/index.css` | Add ~25 new semantic CSS classes for banner, sheet, toast, toggle-group, nav-menu |
| `src/components/ui/banner.tsx` | Strip all CVA utilities, replace with semantic classes |
| `src/components/ui/sheet.tsx` | Strip all CVA utilities, replace with semantic classes |
| `src/components/ui/toast.tsx` | Strip all CVA utilities, replace with semantic classes |
| `src/components/ui/toggle-group.tsx` | Strip all CVA utilities, replace with semantic classes |
| `src/components/ui/navigation-menu.tsx` | Strip CVA trigger utilities, replace with semantic class |
| `src/pages/ComponentsGallery.tsx` | Add new Master Templates to Style Guide |

**Total: 7 files**

---

### Verification Report

| File | Status | Notes |
|---|---|---|
| badge.tsx | CLEAN | base: "badge-base", 28 semantic variants |
| button.tsx | CLEAN | base: "button-base", 6+4 semantic variants |
| input.tsx | CLEAN | "input-base" |
| card.tsx | CLEAN | "card-base" |
| toggle.tsx | CLEAN | base: "button-toggle", 3+4 semantic variants |
| banner.tsx | PURGE | 6 raw base + 10 raw variant utilities |
| sheet.tsx | PURGE | 15+ raw base + 4 raw side utilities |
| toast.tsx | PURGE | 20+ raw base + 3 raw variant utilities |
| toggle-group.tsx | PURGE | 3 raw base + 2 raw variant utilities |
| navigation-menu.tsx | PURGE | 15+ raw trigger utilities |
| All other 47 files | CLEAN | No CVA violations, typography compliant |

### Review

1. **Top 3 Risks:** (1) Toast uses `group` class with `group-[.destructive]` selectors in ToastAction/ToastClose -- moving `destructive` into CSS means the group selector still needs the `destructive` class on the element, which is preserved via `.toast-destructive` applying it. (2) Sheet animation classes are complex with Tailwind data-attribute selectors -- must verify `@apply` handles these correctly. (3) Adding 25 new CSS classes increases the global stylesheet, but each is 1-3 lines.
2. **Top 3 Fixes:** (1) Eliminates all remaining CVA utility stacking across the entire codebase. (2) 100% of CVA components now use semantic class references. (3) Inspector will show only 2-3 classes on any CVA-rendered element.
3. **Database Change:** No
4. **Verdict:** Go -- completes the full 100% compliance audit.

