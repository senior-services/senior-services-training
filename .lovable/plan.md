

## Fix Download Data in PeopleManagement

### Problem
The "Download Data" button in PeopleManagement opens the modal but the `onConfirm` callback is a no-op (`() => { setShowDownloadModal(false); }`). There is no `exportToExcel` function in this component. The working export logic exists in `EmployeeManagement.tsx` and needs to be replicated.

### Root Cause
When PeopleManagement was created as the unified replacement for EmployeeManagement, the download/export logic was never wired up -- only the modal shell was added.

### Changes

**1. `src/components/dashboard/PeopleManagement.tsx`**

Add the missing export pipeline by porting the three functions from `EmployeeManagement.tsx`:

- **Add missing imports**: `isLegacyExempt`, `hasActiveQuizRequirement`, `getDisplayQuizResults`, `getDisplayQuizVersion`, `getCompletionDate`, `isTrainingCompleted`, `QuizAttemptData` from `@/utils/quizHelpers`.

- **Add state**: `isExporting` boolean state variable.

- **Add `loadHiddenPeopleQuizData`**: Async function that fetches quiz creation dates and loads quiz attempts for each hidden person (mirrors `loadHiddenEmployeeQuizData` in EmployeeManagement).

- **Add `processEmployeesForExport`**: Transforms employee + video + quiz data into flat rows for the Excel sheet, including conditional "Visibility" column when hidden employees are included.

- **Add `exportToExcel`**: Orchestrates the export -- merges hidden data if requested, fetches quiz metadata, calls `processEmployeesForExport`, generates the XLSX file, and shows success/error toasts.

- **Add `handleDownloadClick`**: If no hidden people exist, directly call `exportToExcel(false)`. Otherwise, open the download modal.

- **Wire up the modal**: Change `onConfirm` from the no-op to `exportToExcel`, pass `isExporting` to `isLoading`, and update the button `onClick` to use `handleDownloadClick`.

### Technical Detail

The key wiring fix on the modal (line 471-477):

```tsx
// Before (broken):
<DownloadDataModal
  onConfirm={() => { setShowDownloadModal(false); }}
  isLoading={false}
/>

// After (working):
<DownloadDataModal
  onConfirm={exportToExcel}
  isLoading={isExporting}
/>
```

And the button (line 306):
```tsx
// Before: always opens modal
onClick={() => setShowDownloadModal(true)}

// After: direct download when no hidden people
onClick={handleDownloadClick}
```

### Files Modified
- `src/components/dashboard/PeopleManagement.tsx` (add export functions, wire modal, add state)

### Review
1. **Top 3 Risks**: (a) Data consistency -- porting the identical logic from EmployeeManagement ensures reports match. (b) Quiz data for hidden people is loaded on-demand during export, consistent with the existing pattern. (c) No database changes needed.
2. **Top 3 Fixes**: (a) Wire `exportToExcel` to `onConfirm`. (b) Add `handleDownloadClick` for direct-download when no hidden people. (c) Pass `isExporting` state to show loading indicator.
3. **Database Change**: No.
4. **Verdict**: Go -- single file, porting proven logic from sibling component.

