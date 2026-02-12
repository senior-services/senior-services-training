

## Fix Assign Videos Dialog: Replace `text-small` with `text-body`

### Problem
The `AssignVideosModal` table cells contain inline `text-small` classes on `<span>` elements, which override the `TableCell` primitive's `text-body` class. This forces row data to render at 13px instead of the 16px senior minimum.

### Changes (1 file)

**`src/components/dashboard/AssignVideosModal.tsx`** -- 4 lines to update:

| Line | Element | Change |
|------|---------|--------|
| 786 | Video title `<span>` | `text-small` to `text-body` |
| 809 | Due date `<span>` | `text-small` to `text-body` |
| 812 | Quiz results `<span>` | `text-small` to `text-body` |
| 815 | Quiz version `<span>` | `text-small` to `text-body` |

Each span currently reads `text-small whitespace-nowrap` and will be updated to `text-body whitespace-nowrap`.

### Review
1. **Risks:** None -- these are purely typographic overrides within a single dialog.
2. **Fixes:** All table row data in the Assign Videos dialog will render at 16px, matching the senior legibility standard.
3. **Database Change:** No.
4. **Verdict:** Go -- four identical find-and-replace edits in one file.

