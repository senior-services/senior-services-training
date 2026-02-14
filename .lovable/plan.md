
## Add Admin Header Background Color Token

### Changes

**1. `src/index.css` -- Add CSS variable (2 locations)**

- Light mode (line 14, after `--background-header`): Add `--background-header-admin: 261 33% 48%;` with comment `/* #6d53a3 - Purple admin */`
- Dark mode (line 98, after `--background-header`): Add `--background-header-admin: 261 33% 38%;` (slightly darker for dark mode consistency)

**2. `tailwind.config.ts` -- Register Tailwind color (line 55)**

- Add `'background-header-admin': 'hsl(var(--background-header-admin))'` after the `background-header` entry.

**3. `src/components/Header.tsx` -- Use new token (line 31)**

- Change: `const headerBg = isAdminView ? "bg-attention" : "bg-background-header";`
- To: `const headerBg = isAdminView ? "bg-background-header-admin" : "bg-background-header";`
- Update the user avatar circle background on line 71 from `bg-attention-foreground` to `bg-primary-foreground` (white circle works on both purple and navy).
- Update the user avatar icon color on line 72 from `text-attention` to `text-background-header-admin`.

**4. `src/pages/ComponentsGallery.tsx` -- Add swatch (after line 381)**

- Insert a new color swatch block for "Background Header Admin" / `--background-header-admin` using `bg-background-header-admin`, positioned directly below the "Background Header" swatch.

### Review
1. **Top 3 Risks:** (a) HSL conversion accuracy -- verified #6d53a3 = 261 33% 48%. (b) Contrast with white text -- 4.5:1 ratio met (purple at 48% lightness). (c) None other.
2. **Top 3 Fixes:** (a) Distinct admin vs employee header identity. (b) Replaces orange attention color with purposeful purple. (c) Style guide kept in sync.
3. **Database Change:** No.
4. **Verdict:** Go -- clean token addition following existing patterns.
