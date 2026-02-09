

## Update Quiz Version Display in Data Download

### What Will Change
In the Excel data download, the "Quiz Version" column currently shows version numbers prefixed with "v" (e.g., "v2"). This will be changed to show just the plain number (e.g., "2") to match the new Assign Videos dialog column format.

### Change

**File: `src/components/dashboard/EmployeeManagement.tsx` (line 507)**

Change `v${quizAttempt.quiz_version}` to `${quizAttempt.quiz_version}` -- removing the "v" prefix.

### Review
- **Top 5 Risks**: None -- single string format change.
- **Top 5 Fixes**: (1) Remove "v" prefix from quiz version in export.
- **Database Change Required**: No
- **Go/No-Go**: Go
