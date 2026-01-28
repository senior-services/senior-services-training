

## Implement Employee Table: Email Under Name with Truncation

### Summary
Remove the separate "Email" column and display the employee's email directly below their name, using extra small text (14px) with truncation to prevent layout issues on long email addresses.

---

### Changes Overview

**File:** `src/components/dashboard/EmployeeManagement.tsx`

| Change | Description |
|--------|-------------|
| Remove EMAIL column header | Delete line 503 to remove the separate column |
| Update Name cell | Add email below name with truncation styling |
| Remove Email cell | Delete lines 526-528 (now redundant) |
| Fix expanded row colspan | Change from 4 to 3 columns |

---

### Detailed Changes

**1. Remove EMAIL column header (line 503)**
- Delete: `<TableHead className="...">EMAIL</TableHead>`
- Result: Table goes from 4 columns to 3 columns

**2. Update Name cell to include email (lines 518-525)**

New structure:
```
┌─────────────────────────────────┐
│ ▼ John Smith                    │
│   johnsmith@longcompany...      │  ← Extra small text (14px), truncated
└─────────────────────────────────┘
```

- Wrap name and email in a vertical layout
- Email styled with `text-xs text-muted-foreground font-normal`
- Add `truncate max-w-[200px]` for long emails
- Add `title` attribute to show full email on hover

**3. Remove separate Email cell (lines 526-528)**
- Delete the standalone email TableCell
- Information now lives under the name

**4. Update expanded row colspan (line 549)**
- Change `colSpan={4}` to `colSpan={3}`
- Ensures expanded content spans all remaining columns

---

### Visual Before/After

**Before (4 columns):**
| NAME | EMAIL | STATUS | ACTIONS |
|------|-------|--------|---------|
| John Smith | john.smith@company.com | Active | [Buttons] |

**After (3 columns):**
| NAME | STATUS | ACTIONS |
|------|--------|---------|
| John Smith | Active | [Buttons] |
| john.smith@company.com | | |

---

### Accessibility Considerations
- Email remains visible to screen readers within the same cell
- Existing `aria-label` on row already announces employee name/email
- `title` attribute provides full email for mouse users on truncated text

---

### Technical Notes
- Uses `text-xs` class (14px per tailwind.config.ts)
- `truncate` class adds `overflow-hidden text-overflow-ellipsis whitespace-nowrap`
- `max-w-[200px]` prevents email from pushing layout on very long addresses
- Conditional rendering: email only shown if `employee.email` exists

