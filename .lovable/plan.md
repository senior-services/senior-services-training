

## Quiz Tab UI Revisions + Badge Icon Support

### Changes

**1. Make "{N} Questions" a proper heading**

Change `text-sm font-semibold` to `text-base font-semibold` on the questions count header so it reads as a proper `<h3>`.

**2. Add version badge next to "{N} Questions" header**

Place a version badge (e.g., "v3") to the right of the questions header text. Only show when `versionCount > 1`. Uses `soft-tertiary` variant.

**3. Revert Quiz tab badge back to question count with icon**

Change the Quiz tab badge back to showing the number of questions (e.g., "4") instead of the version. Use `soft-tertiary` variant with `showIcon` enabled. The icon will be a chat/message icon (MessageSquare from Lucide).

**4. Add icon support for primary, secondary, and tertiary badge variants**

Update the Badge component to render icons for these three variants when `showIcon` is true:
- **Primary**: a default/generic icon (e.g., Info)
- **Secondary**: a secondary icon (e.g., Info)  
- **Tertiary**: a chat-style icon (e.g., MessageSquare)

**5. Update Component Gallery with new icon examples**

Add `showIcon` examples for primary, secondary, and tertiary badges across all style groups (solid, hollow, soft, ghost) in the gallery.

### Technical Details

**File: `src/components/ui/badge.tsx`**

- Import `MessageSquare` and `Info` from lucide-react
- Add icon rendering for primary/secondary/tertiary variants (and their hollow/ghost/soft counterparts):
  - Primary and secondary: `Info` icon
  - Tertiary: `MessageSquare` icon

**File: `src/components/EditVideoModal.tsx`**

- Line 991-996 (Quiz tab badge): Revert to showing `questions.length` with `showIcon` enabled
- Line 1042: Change `text-sm` to `text-base` on the header
- Add a version badge (`soft-tertiary`, e.g., "v3") next to the header text, conditionally shown when `versionCount > 1`

**File: `src/pages/ComponentsGallery.tsx`**

- Lines 901-903: Add `showIcon` variants for primary, secondary, tertiary in solid section
- Repeat for hollow, soft, and ghost sections

### Review

- **Top 5 Risks**: (1) Adding icons to primary/secondary/tertiary is a new pattern -- needs to look right at small badge sizes. (2) MessageSquare icon must be visually appropriate at 12px (w-3 h-3). (3) No logic changes, purely visual. (4) Gallery updates are additive. (5) No accessibility concerns.
- **Top 5 Fixes**: (1) Add 3 new icon mappings in Badge component. (2) Revert tab badge to question count. (3) Resize header. (4) Add version badge to header row. (5) Update gallery examples.
- **Database Change Required**: No
- **Go/No-Go**: Go -- additive styling changes across 3 files
