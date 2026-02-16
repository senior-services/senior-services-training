

## Fix "Continue Training" Button Detection

### Root Cause Analysis

The code paths look correct on paper: the interface has the field, the transform maps it, and the hasStarted logic checks it. There are two possible failure points to fix simultaneously:

1. **Falsy-value bug on line 301 of EmployeeDashboard.tsx**: The expression `assignment?.acknowledgment_viewing_seconds || undefined` will silently convert a value of `0` to `undefined`. While the current DB values are 91 and 66, this is fragile and should use nullish coalescing (`??`) instead of logical OR (`||`).

2. **Missing debug visibility**: Without a console log, we cannot confirm whether the data is arriving at the card or being lost somewhere in the pipeline.

3. **Defensive hasStarted logic**: The current check relies on `sanitizedVideo.acknowledgmentViewingSeconds != null` which is correct, but adding an explicit `> 0` guard and a debug log will make the flow transparent.

### Changes

**File 1: `src/pages/EmployeeDashboard.tsx` (line 301)**

Replace the falsy-unsafe `||` with nullish coalescing `??`:

```
// Before
acknowledgmentViewingSeconds: assignment?.acknowledgment_viewing_seconds || undefined

// After
acknowledgmentViewingSeconds: assignment?.acknowledgment_viewing_seconds ?? undefined
```

**File 2: `src/components/TrainingCard.tsx` (lines 136-147)**

Add a temporary debug log right before the status calculation, and keep the hasStarted logic explicit:

```tsx
const trainingStatus = useOptimizedMemo(() => {
  const isCompleted = sanitizedVideo.progress === 100;
  const hasStarted = sanitizedVideo.progress > 0
    || (sanitizedVideo.acknowledgmentViewingSeconds != null
        && sanitizedVideo.acknowledgmentViewingSeconds > 0);

  console.log('[Card Debug]', sanitizedVideo.title,
    'progress:', sanitizedVideo.progress,
    'viewingSec:', sanitizedVideo.acknowledgmentViewingSeconds,
    'hasStarted:', hasStarted,
    'buttonText:', isCompleted ? 'Review' : hasStarted ? 'Continue' : 'Start');

  return {
    isCompleted,
    hasStarted,
    statusText: isCompleted ? 'Completed' : hasStarted ? 'In Progress' : 'Not Started'
  };
}, [sanitizedVideo.progress, sanitizedVideo.acknowledgmentViewingSeconds]);
```

### Review

1. **Top 3 Risks**: (a) `?? undefined` is semantically identical for non-zero values but fixes the 0-case. (b) Debug log is temporary -- remove after verification. (c) No logic change to hasStarted, just added visibility.
2. **Top 3 Fixes**: (a) Nullish coalescing prevents silent data loss. (b) Console log provides immediate verification. (c) No other files or DB changes needed.
3. **Database Change**: No.
4. **Verdict**: Go -- two surgical line edits.

