

## Update Date Selection Dialog to Radio Button Style

### Overview
Replace the current toggle button + checkbox layout with a clean vertical radio button list, matching the reference design. All four options (1 week, 2 weeks, 1 month, No due date required) will be unified into a single radio group.

---

### File to Modify

**`src/components/dashboard/AssignVideosModal.tsx`**

---

### Change 1: Update Imports

Replace the ToggleGroup import with RadioGroup:

```tsx
// Remove
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Add
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
```

Also remove the Checkbox import if no longer used elsewhere in the file.

---

### Change 2: Simplify Handler Functions

Combine the two separate handlers (`handleDueDateOptionChange` and `handleNoDueDateChange`) into one:

```tsx
const handleDueDateSelection = (value: string) => {
  if (value === 'none') {
    setDueDateOption(null);
    setNoDueDateRequired(true);
  } else {
    setDueDateOption(value as '1week' | '2weeks' | '1month');
    setNoDueDateRequired(false);
  }
};
```

---

### Change 3: Replace Dialog Content UI

Replace the toggle group and checkbox layout with a vertical radio group:

```tsx
<div className={cn("space-y-4 py-4", isSubmitting && "opacity-50 pointer-events-none")}>
  <Label className="text-sm font-medium">Select due date</Label>
  <RadioGroup 
    value={noDueDateRequired ? 'none' : (dueDateOption || '')}
    onValueChange={handleDueDateSelection}
    disabled={isSubmitting}
    className="space-y-3"
  >
    <div className="flex items-center space-x-3">
      <RadioGroupItem value="1week" id="due-1week" />
      <Label htmlFor="due-1week" className="text-base font-normal cursor-pointer">
        1 week
      </Label>
    </div>
    <div className="flex items-center space-x-3">
      <RadioGroupItem value="2weeks" id="due-2weeks" />
      <Label htmlFor="due-2weeks" className="text-base font-normal cursor-pointer">
        2 weeks
      </Label>
    </div>
    <div className="flex items-center space-x-3">
      <RadioGroupItem value="1month" id="due-1month" />
      <Label htmlFor="due-1month" className="text-base font-normal cursor-pointer">
        1 month
      </Label>
    </div>
    <div className="flex items-center space-x-3">
      <RadioGroupItem value="none" id="due-none" />
      <Label htmlFor="due-none" className="text-base font-normal cursor-pointer">
        No due date required
      </Label>
    </div>
  </RadioGroup>
</div>
```

---

### Summary of Changes

| Area | Before | After |
|------|--------|-------|
| Layout | Horizontal toggles + separate checkbox | Vertical radio button list |
| Options | Split across two UI patterns | Unified in one RadioGroup |
| Handlers | Two separate functions | One combined handler |
| Accessibility | Multiple focus groups | Single focus group with arrow key navigation |

---

### Benefits

- Matches the reference design exactly
- Better accessibility with native keyboard navigation (arrow keys)
- Simpler code with one handler instead of two
- Consistent interaction pattern for all options

