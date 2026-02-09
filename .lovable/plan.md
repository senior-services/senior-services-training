

## Remove "Assign to All Employees" from Add New Course Dialog

### What Changes
Hide the "Assign this course to all active employees" checkbox and its due-date picker from the Add New Course dialog. The code stays in the file (commented out) so it can be re-enabled later.

### Change (1 file)

**File: `src/components/content/AddContentModal.tsx`**

1. **Comment out the UI section** (lines 289-322): Wrap the entire "Assign to all employees" block in a comment so it no longer renders, but the code is preserved for future use.

2. **Neutralize the form data**: In the `handleSave` function, hardcode `assignToAll` to `false` and `dueDate` to `undefined` in the submitted data object, so even if the state variables exist, nothing is sent.

3. **Keep all state and handler code intact**: The `assignToAll` state, `handleAssignToAllChange`, and due-date logic remain in the file untouched -- they just won't be triggered since the UI is hidden.

### Review
- **Top 5 Risks**: (1) Must ensure the form submission doesn't accidentally pass `assignToAll: true` -- mitigated by hardcoding `false`. (2) No other components reference this checkbox. (3) No database impact. (4) No effect on existing assignments. (5) Commented code should have a clear note explaining why.
- **Top 5 Fixes**: (1) Comment out UI block. (2) Hardcode `assignToAll: false` in submission. (3) Add "TODO" comment for future restoration. (4-5) N/A.
- **Database Change Required**: No
- **Go/No-Go**: Go

