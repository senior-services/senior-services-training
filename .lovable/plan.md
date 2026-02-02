

## Remove Accordion Functionality from Employee Rows

### Overview
The Employees tab in `EmployeeManagement.tsx` has an accordion-style expand/collapse feature for each employee row. Clicking on an employee row expands it to show their video assignments with status, completion date, and quiz results. This plan removes the entire accordion functionality while keeping the employee list as a simple, static table.

---

### Changes Required

**File: `src/components/dashboard/EmployeeManagement.tsx`**

---

#### 1. Remove Unused Imports (Line 7)
Remove `ChevronDown` and `ChevronUp` icons from lucide-react import.

---

#### 2. Remove State Variable (Line 30)
Remove `expandedEmployees` state that tracks which rows are expanded.

---

#### 3. Remove Toggle Function (Lines 225-235)
Remove `toggleEmployeeExpanded` callback function that handles expand/collapse.

---

#### 4. Remove Helper Functions (Lines 293-366)
Remove three helper functions only used in the expanded accordion content:
- `getVideoStatus()` - Displays status badges in expanded view
- `getQuizResults()` - Displays quiz results in expanded view  
- `getCompletionDate()` - Displays dates in expanded view

---

#### 5. Simplify Table Body (Lines 512-586)
Replace the complex expandable table rows with simple static rows:
- Remove `isExpanded` variable and `React.Fragment` wrapper
- Remove click handlers, keyboard handlers, and ARIA attributes
- Remove chevron icons from the name cell
- Remove the entire expanded content section showing video assignments
- Remove `pointer-events` CSS workarounds that were needed for clickable rows
- Clean up the layout to a simple row structure

---

### What Stays the Same
- Employee name, email, and status badge display
- "Edit Assignments" button (opens modal with full details)
- Delete button functionality
- Sorting by name
- Export to Excel functionality (has its own inline logic)
- Real-time updates via Supabase subscriptions

---

### Result
Employee rows become simple, static display rows showing name, email, status badge, and action buttons. Users can still view and manage detailed training assignments via the "Edit Assignments" modal.

