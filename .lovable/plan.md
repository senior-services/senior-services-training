

## Add Confirmation Prompts Before Hiding Training or Employee

### What's changing
Currently, clicking the "Hide" button on a training or employee immediately performs the action with no confirmation. This plan adds a confirmation dialog (using the existing `AlertDialog` pattern already used throughout the app) before hiding.

### Changes

**1. VideoManagement.tsx** -- Add hide confirmation for trainings
- Add state to track the video pending hide (`pendingHideVideo`)
- Instead of calling `handleHideVideo` directly, set the pending video to open a confirmation dialog
- Add an `AlertDialog` that asks "Hide this training?" with the video title, explaining it will be moved to the hidden section
- On confirm, proceed with the existing hide logic; on cancel, clear the pending state

**2. EmployeeManagement.tsx** -- Add hide confirmation for employees
- Add state to track the employee pending hide (`pendingHideEmployee`)
- Instead of calling `handleHideEmployee` directly, set the pending employee to open a confirmation dialog
- Add an `AlertDialog` that asks "Hide this employee?" with the employee name, explaining they will be moved to the hidden section
- On confirm, proceed with the existing hide logic; on cancel, clear the pending state

### Pattern
Both follow the same pattern already used for the "Assign to All" confirmation in `VideoManagement.tsx` and the "Unassign" confirmation in `AssignVideosModal.tsx`:

```
state variable -> click sets pending item -> AlertDialog opens -> confirm runs action + clears state -> cancel clears state
```

No new components or dependencies needed.

### Review

- **Top 5 Risks**: (1) None significant -- follows an established pattern used 4+ times in the same codebase.
- **Top 5 Fixes**: (1) Add confirmation state + AlertDialog to VideoManagement. (2) Add confirmation state + AlertDialog to EmployeeManagement.
- **Database Change Required**: No
- **Go/No-Go**: Go -- straightforward addition using existing patterns, prevents accidental hides.
