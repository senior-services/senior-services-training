

## Fix RadioGroup Style Guide Violation

### Overview
Remove the `className="space-y-3"` attribute from the RadioGroup component to comply with the project's STYLEGUIDE.md, which prohibits passing className to RadioGroup.

---

### File to Modify

**`src/components/dashboard/AssignVideosModal.tsx`**

---

### Single Change Required

Around line 523, remove the `className` prop from the RadioGroup:

**Before:**
```tsx
<RadioGroup 
  value={noDueDateRequired ? 'none' : (dueDateOption || '')}
  onValueChange={handleDueDateSelection}
  disabled={isSubmitting}
  className="space-y-3"
>
```

**After:**
```tsx
<RadioGroup 
  value={noDueDateRequired ? 'none' : (dueDateOption || '')}
  onValueChange={handleDueDateSelection}
  disabled={isSubmitting}
>
```

---

### Why This Change

The RadioGroup component already has built-in spacing (`space-y-3`) defined in `src/components/ui/radio-group.tsx`. Adding a className externally violates the project's style guide rules for component consistency.

