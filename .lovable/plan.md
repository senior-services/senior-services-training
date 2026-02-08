

## Update Employee Hide/Show Dialog Descriptions

### What's changing
Updating the confirmation dialog descriptions for hiding and showing employees to use the new wording.

### Changes

**File: `src/components/dashboard/EmployeeManagement.tsx`**

1. **Line 731 -- Hide employee dialog**: Change from
   `{name} will be moved to the hidden section. Their assignments and progress data will be preserved.`
   to
   `This moves {name} to the Hidden section without affecting assignments or progress.`

2. **Line 754 -- Show employee dialog**: Change from
   `{name} will be moved back to the main employee list.`
   to
   `This restores {name} to the main employee list.`

### Review
- **Top 5 Risks**: None -- text-only changes.
- **Top 5 Fixes**: (1) Update hide description. (2) Update show description.
- **Database Change Required**: No
- **Go/No-Go**: Go

