

## Edit Course Quiz Tab UI Updates

### Changes

**1. Quiz tab badge: show version number instead of question count**

Replace the badge next to "Quiz" that currently shows the number of questions. Instead, show the quiz version number (e.g., "v3"). Only display this badge when the version is greater than 1.

**2. Add "{N} Questions" header above the first question**

Add a text header like "4 Questions" above the questions list, using the actual count of questions.

**3. Change "Download quiz versions" to outline button style, align with questions header**

Change the button from `variant="link"` to `variant="outline"`. Place both the "{N} Questions" header and the download button on the same row, horizontally aligned (header left, button right).

**4. Update versioning notice text**

Change the banner description to: "This training is already assigned. Editing the quiz will create a new version for future employees. Completed trainings won't be affected."

### Technical Details

All changes are in **`src/components/EditVideoModal.tsx`**:

**Lines 991-996** (tab badge): Replace `questions.length` badge with version badge showing `v{quiz.version}`, only when `versionCount > 1`.

**Lines 1033-1055** (quiz tab content): Restructure to:
- Keep the versioning banner as-is but update text (line 1037)
- Replace the download button wrapper and questions start with a single row containing "{N} Questions" on the left and the outline-styled download button on the right
- Remove the old `<div className="flex justify-end">` wrapper

**Line 1036-1038** (banner text): Update to the new wording.

### Review

- **Top 5 Risks**: (1) Quiz version number must be available from the `quiz` state object. (2) Badge visibility condition change is straightforward. (3) Layout alignment uses standard flex. (4) No logic changes. (5) No accessibility concerns with these visual updates.
- **Top 5 Fixes**: (1) Swap badge content from count to version. (2) Add conditional rendering for badge. (3) Add questions count header. (4) Change button variant. (5) Update banner copy.
- **Database Change Required**: No
- **Go/No-Go**: Go -- purely visual changes within a single file

