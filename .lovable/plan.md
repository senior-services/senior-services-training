

## Add Visibility Column to Employee Export

### Summary

Add a new "Visibility" column on the far right of the Excel export that shows "Active" for regular employees and "Hidden" for hidden employees.

---

### Changes

**File:** `src/components/dashboard/EmployeeManagement.tsx`

1. **Update `processEmployeesForExport` function signature** (line 384-388)
   - Add a fourth parameter: `hiddenEmployeeIds: Set<string>`
   - This set will contain the IDs of all hidden employees

2. **Add Visibility column to export data** (lines 397-405 and 461-469)
   - For employees with no assignments: add `'Visibility': hiddenEmployeeIds.has(employee.id) ? 'Hidden' : 'Active'`
   - For employees with assignments: add the same Visibility column to each row

3. **Update the function call in `exportToExcel`** (line 497)
   - Create a Set of hidden employee IDs
   - Pass it as the fourth argument to `processEmployeesForExport`

---

### Code Changes

**Update function signature (lines 384-388):**
```tsx
const processEmployeesForExport = useCallback((
  employeesToExport: EmployeeWithAssignments[],
  videosMap: Map<string, any[]>,
  quizzesMap: Map<string, Map<string, any>>,
  hiddenEmployeeIds: Set<string>
): any[] => {
```

**Add Visibility to "no assignments" case (lines 396-405):**
```tsx
if (videos.length === 0) {
  exportData.push({
    Name: employeeName,
    Email: employeeEmail,
    'Course': 'No assignments',
    'Status': STATUS_LABELS.unassigned,
    'Due Date': '--',
    'Completion Date': '--',
    'Quiz Results': '--',
    'Visibility': hiddenEmployeeIds.has(employee.id) ? 'Hidden' : 'Active'
  });
}
```

**Add Visibility to assignments case (lines 461-469):**
```tsx
exportData.push({
  Name: employeeName,
  Email: employeeEmail,
  'Course': assignment.video_title || '',
  'Status': status,
  'Due Date': dueDate,
  'Completion Date': completionDate,
  'Quiz Results': quizResults,
  'Visibility': hiddenEmployeeIds.has(employee.id) ? 'Hidden' : 'Active'
});
```

**Update call in `exportToExcel` (line 497):**
```tsx
const hiddenEmployeeIds = new Set(hiddenEmployees.map(e => e.id));
const exportData = processEmployeesForExport(allEmployees, allVideos, allQuizzes, hiddenEmployeeIds);
```

---

### Result

The exported Excel file will have these columns in order:
1. Name
2. Email
3. Course
4. Status
5. Due Date
6. Completion Date
7. Quiz Results
8. **Visibility** (new - "Active" or "Hidden")

