
# Plan: Clean Up "Archive" Terminology to "Hidden"

## Overview
Update log messages, operation tracker keys, and comments to consistently use "hidden" terminology instead of "archive" throughout the codebase. Internal function names will remain unchanged to avoid breaking existing code.

## Changes

### 1. `src/services/api.ts` — Video Operations (Lines 115-400)

**Log message updates:**
| Line | Current | Updated |
|------|---------|---------|
| 116 | `'video.getArchived'` | `'video.getHidden'` |
| 127 | `'Failed to fetch archived videos'` | `'Failed to fetch hidden videos'` |
| 131 | `'Archived videos fetched successfully'` | `'Hidden videos fetched successfully'` |
| 134 | `'Unexpected error fetching archived videos'` | `'Unexpected error fetching hidden videos'` |
| 135 | `'Failed to fetch archived videos'` | `'Failed to fetch hidden videos'` |
| 329 | `'video.archive'` | `'video.hide'` |
| 339 | `'Failed to archive video'` | `'Failed to hide video'` |
| 343 | `'Video archived successfully'` | `'Video hidden successfully'` |
| 346 | `'Unexpected error archiving video'` | `'Unexpected error hiding video'` |
| 347 | `'Failed to archive video'` | `'Failed to hide video'` |
| 354 | `'video.unarchive'` | `'video.show'` |
| 364 | `'Failed to unarchive video'` | `'Failed to show video'` |
| 368 | `'Video unarchived successfully'` | `'Video shown successfully'` |
| 371 | `'Unexpected error unarchiving video'` | `'Unexpected error showing video'` |
| 372 | `'Failed to unarchive video'` | `'Failed to show video'` |

**Comment updates:**
| Line | Current | Updated |
|------|---------|---------|
| 378-379 | Wrapper method comments | Update to clarify these are primary implementations |
| 382 | `semantic wrapper for archive` | `uses archived_at column` |
| 388 | `semantic wrapper for unarchive` | `clears archived_at column` |
| 396 | `semantic wrapper for getArchived` | `queries videos with archived_at set` |

### 2. `src/services/api.ts` — Employee Operations (Lines 569-633)

**Log message updates:**
| Line | Current | Updated |
|------|---------|---------|
| 570 | `'employee.archive'` | `'employee.hide'` |
| 580 | `'Failed to archive employee'` | `'Failed to hide employee'` |
| 584 | `'Employee archived successfully'` | `'Employee hidden successfully'` |
| 587 | `'Unexpected error archiving employee'` | `'Unexpected error hiding employee'` |
| 588 | `'Failed to archive employee'` | `'Failed to hide employee'` |
| 595 | `'employee.unarchive'` | `'employee.show'` |
| 605 | `'Failed to unarchive employee'` | `'Failed to show employee'` |
| 609 | `'Employee unarchived successfully'` | `'Employee shown successfully'` |
| 612 | `'Unexpected error unarchiving employee'` | `'Unexpected error showing employee'` |
| 613 | `'Failed to unarchive employee'` | `'Failed to show employee'` |

**Comment updates:**
| Line | Current | Updated |
|------|---------|---------|
| 622 | `semantic wrapper for archive` | `uses archived_at column` |
| 629 | `semantic wrapper for unarchive` | `clears archived_at column` |

### 3. `src/components/dashboard/VideoManagement.tsx`

**Comment updates:**
| Line | Current | Updated |
|------|---------|---------|
| 89 | `// Only get non-archived videos` | `// Only get visible (non-hidden) videos` |
| 368 | `(semantic wrapper for archive)` | `(stored via archived_at column)` |
| 382 | `(semantic wrapper for unarchive)` | `(clears archived_at column)` |

### 4. `src/components/dashboard/AssignVideosModal.tsx`

**Comment update:**
| Line | Current | Updated |
|------|---------|---------|
| 141 | `// Track hidden videos (videos with archived_at)` | `// Track hidden videos (stored via archived_at column)` |

### 5. `src/types/index.ts`

**Add clarifying comment on line 42:**
```typescript
archived_at?: string | null; // Controls visibility - when set, item is "hidden" from active lists
```

## Summary

| Category | Count |
|----------|-------|
| Log message updates | 20 |
| Operation tracker updates | 4 |
| Comment updates | 8 |
| **Total changes** | **32** |

## What Stays the Same
- Function names (`archive()`, `unarchive()`, `getArchived()`) remain unchanged
- Database column `archived_at` unchanged
- External behavior unchanged
- All existing callers continue to work
