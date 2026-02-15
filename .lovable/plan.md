

## Add Separator Between Modal Sections

### Overview
Add horizontal rule separators between the main sections in both PersonSettingsModal and TrainingSettingsModal using the existing `Separator` component from `@/components/ui/separator`.

### Changes

**File 1: `src/components/dashboard/PersonSettingsModal.tsx`**
- Import `Separator` from `@/components/ui/separator`.
- Add `<Separator />` between the Person info section and the Admin toggle section.
- Add `<Separator />` between the Admin toggle section and the Hide person section.

**File 2: `src/components/dashboard/TrainingSettingsModal.tsx`**
- Import `Separator` from `@/components/ui/separator`.
- Add `<Separator />` between the Training info section and the Hide training section.

### Technical Detail
The `Separator` component renders a semantic `<hr>` with `bg-border` styling. The parent `space-y-6` handles vertical spacing around each separator automatically, so no additional margin classes are needed.

### Review
1. **Top 3 Risks:** None -- purely additive visual change.
2. **Top 3 Fixes:** (a) Restores visual section boundaries. (b) Uses the design system `Separator` primitive instead of raw border utilities. (c) Consistent across both modals.
3. **Database Change:** No.
4. **Verdict:** Go -- two-file, minimal change.
