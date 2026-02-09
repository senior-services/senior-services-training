
## Align "Also Correct" Badge Icon with Attention Banner

### Problem
The compact attention banner uses the **AlertTriangle** icon, but the "Also Correct" badge (soft-attention variant) uses a **Shield** icon. They should match for visual consistency.

### Change (1 file)

**File: `src/components/ui/badge.tsx`** (line ~99)
- Change the icon used for attention badge variants from `Shield` to `AlertTriangle`
- Update the import to include `AlertTriangle` (and remove `Shield` if no longer used elsewhere)

### Review
- **Top 5 Risks**: (1) Must verify Shield icon isn't used by other badge variants. (2) No logic changes. (3) No layout impact -- same icon size. (4) No database changes. (5) No accessibility impact.
- **Top 5 Fixes**: (1) Swap Shield for AlertTriangle in attention badge icon render. (2) Update imports. (3-5) N/A -- single change.
- **Database Change Required**: No
- **Go/No-Go**: Go
