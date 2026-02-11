

## Fix: Viewing Timer Input Behavior

### Problem

The `onChange` handler on line 342 uses `Math.max(60, ...)` which clamps every keystroke to a minimum of 60. This means:
- You cannot select all and type a new number (e.g., typing "9" immediately becomes "60")
- You cannot clear the field to retype

### Fix

**File: `src/components/content/AddContentModal.tsx`** (line 342)

Change the `onChange` to allow free typing, storing the raw value. Move the minimum enforcement to `onBlur` so validation only happens when the user leaves the field.

Before:
```
onChange={(e) => setMinViewingTime(Math.max(60, parseInt(e.target.value) || 60))}
```

After:
```
onChange={(e) => setMinViewingTime(parseInt(e.target.value) || 0)}
onBlur={() => { if (minViewingTime < 60) setMinViewingTime(60); }}
```

This lets the user type freely, and snaps to 60 only if they leave the field with a value below 60. The `min={60}` HTML attribute remains for accessibility/semantics.

### Review

- **Top 3 Risks:** (1) Briefly allows sub-60 values while typing -- acceptable since blur enforces it. (2) None. (3) None.
- **Top 3 Fixes:** (1) Users can select-all and retype. (2) Validation still enforced on blur. (3) No other files affected.
- **Database Change:** No
- **Verdict:** Go
