

## Create Reusable SuffixInput Component

### Overview
Create a new `SuffixInput` component that wraps an input with an inline suffix label (e.g., "seconds"), then apply it to the existing Viewing Timer and add it to the Style Guide.

**Note:** The "Viewing Timer" input is located in `AddContentModal.tsx` (not `EditVideoModal.tsx`). The plan updates the correct file.

### Changes

**1. New file: `src/components/ui/SuffixInput.tsx`**

A forwardRef component that:
- Accepts all standard `Input` props plus a `suffix` string prop
- Wraps the existing `Input` in a `relative` container
- Positions the suffix text `absolute right-3`, vertically centered, with `pointer-events-none`
- Uses `text-muted-foreground` and `text-sm` for the suffix
- Adds right padding to the input to prevent text overlap with the suffix

```tsx
interface SuffixInputProps extends React.ComponentProps<"input"> {
  suffix: string;
}
```

**2. Edit: `src/components/content/AddContentModal.tsx` (lines 337-343)**

Replace the plain `Input` with `SuffixInput`:
- Import `SuffixInput` from `@/components/ui/SuffixInput`
- Remove the `(Seconds)` text from the label (the suffix handles it)
- Swap `<Input ... />` for `<SuffixInput suffix="seconds" ... />`

Before:
```tsx
<Label htmlFor="min-viewing-time">Viewing Timer (Seconds)</Label>
...
<Input id="min-viewing-time" type="number" ... />
```

After:
```tsx
<Label htmlFor="min-viewing-time">Viewing Timer</Label>
...
<SuffixInput id="min-viewing-time" type="number" suffix="seconds" ... />
```

**3. Edit: `src/pages/ComponentsGallery.tsx` (after textarea block, ~line 1062)**

- Import `SuffixInput`
- Add a new example block below the Textarea section:

```
Label: "Input with Suffix"
Helper text: "Appends a unit label inside the field."
Example: <SuffixInput suffix="seconds" placeholder="60" />
Additional text: "Use for numeric fields that require a unit indicator."
```

### Review
1. **Top 3 Risks**: (a) None -- additive component, no existing behavior changes. (b) Suffix overlap on very small widths -- mitigated by `max-w-[100px]` already on the timer input. (c) None.
2. **Top 3 Fixes**: (a) Cleaner UI with inline unit label. (b) Reusable for future numeric inputs. (c) Removes parenthetical from label text.
3. **Database Change**: No.
4. **Verdict**: Go.
