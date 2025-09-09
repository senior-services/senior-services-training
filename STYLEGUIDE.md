# UI Components Style Guide

## Form Controls Spacing Guidelines

### RadioGroup Components

RadioGroup components should use the default spacing provided by the component. Do not override with custom `className` attributes for spacing.

**✅ Correct Usage:**
```tsx
<RadioGroup value={selectedValue} onValueChange={setValue}>
  <OptionRow>
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </OptionRow>
  <OptionRow>
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </OptionRow>
</RadioGroup>
```

**❌ Incorrect Usage:**
```tsx
<RadioGroup value={selectedValue} onValueChange={setValue} className="space-y-3">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>
```

### Checkbox Groups

Use the `OptionList` wrapper for consistent spacing between checkbox groups.

**✅ Correct Usage:**
```tsx
<OptionList>
  <OptionRow>
    <Checkbox id="checkbox1" />
    <Label htmlFor="checkbox1">Option 1</Label>
  </OptionRow>
  <OptionRow>
    <Checkbox id="checkbox2" />
    <Label htmlFor="checkbox2">Option 2</Label>
  </OptionRow>
</OptionList>
```

**❌ Incorrect Usage:**
```tsx
<div className="space-y-3">
  <div className="flex items-center space-x-2">
    <Checkbox id="checkbox1" className="..." />
    <Label htmlFor="checkbox1">Option 1</Label>
  </div>
</div>
```

### OptionList and OptionRow Components

Use these wrapper components to maintain consistent spacing:

- `OptionList`: Provides vertical spacing between options (`space-y-3`)
- `OptionRow`: Provides horizontal spacing within each option (`flex items-center space-x-2`)

These components ensure consistent spacing across all form controls throughout the application and align with the Component Gallery design standards.

### ESLint Rules

The following ESLint rules are enforced to maintain consistency:

- No `className` attribute allowed on `RadioGroup` components
- No `className` attribute allowed on individual `Checkbox` components

Use the wrapper components instead to achieve proper spacing and styling.