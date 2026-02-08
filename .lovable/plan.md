

## Fix: Export Quiz Results Should Match Dashboard Display

### Summary

The data download file shows "N/A" for Billy's quiz results and version, while both the employee and admin dashboards correctly show his score. This is because the export checks whether a quiz is "required" before showing results, instead of checking whether the employee actually took a quiz.

### What Changes

Only the export formatting logic in one file needs updating. The status calculation, completion dates, and dashboard displays are already consistent -- the only mismatch is how quiz results and quiz version are displayed in the downloaded Excel file.

### Risk Assessment

**Top 5 Risks/Issues:**
1. The fix is narrowly scoped to export formatting only -- no risk to dashboard displays
2. Must preserve "Not Completed" for employees who have a required quiz but haven't taken it
3. Must preserve "N/A" for videos that genuinely have no quiz and no attempt
4. Single file change, only ~10 lines affected
5. No edge cases with the timeline exemption -- the fix simply prioritizes actual data over the requirement flag

**Top 5 Fixes/Improvements:**
1. Reorder the quiz results logic: check for an actual quiz attempt first, show its score regardless of whether quiz was "required"
2. Same reorder for quiz version: if attempt exists, show the version
3. No database changes
4. No new components
5. Keeps all three views (employee dashboard, admin dashboard, export) showing identical information

**Database Change Required:** No

**Go/No-Go Verdict:** Go -- reorders two conditional checks in the export formatter.

### Technical Detail

**File:** `src/components/dashboard/EmployeeManagement.tsx`

**Change 1 -- Quiz Results (lines 453-461):**

Current:
```
if (!hasQuiz) -> "N/A"
else if (!attempt) -> "Not Completed"
else -> show score
```

New:
```
if (attempt) -> show score           // always show if they took it
else if (!hasQuiz) -> "N/A"          // no quiz exists/required
else -> "Not Completed"              // quiz required but not taken
```

**Change 2 -- Quiz Version (line 485):**

Current: only shows version if `hasQuiz` is true

New: shows version if a quiz attempt exists, regardless of `hasQuiz`

These two changes make the export output identical to what the dashboards display for all employees.

