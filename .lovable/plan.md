

## Add "Form Section Header" to Style Guide

### Overview
Add a new "Form Section Header" live preview to the Form Controls section of the Components Gallery, placed directly above the existing "Text Input" field demonstration.

### Specification
- **Typography**: `.text-body` composite token (16px)
- **Weight override**: `font-bold` (permitted under the 80/20 rule for form contexts)
- **Color**: `text-foreground` (semantic token)
- **Spacing**: `mt-6` top margin, `mb-2` bottom margin

### Changes

**File: `src/pages/ComponentsGallery.tsx`**

Insert a new block inside the Form Controls `CardContent` (line 825), **before** the existing `rounded-lg` container (line 826). The new block demonstrates two form section headers, each above a sample text input:

```tsx
{/* Form Section Header */}
<div className="rounded-lg p-6 border border-border-primary/50 shadow-md space-y-1">
  <h4 className="text-body font-bold text-foreground mb-3">Form Section Header</h4>
  <p className="text-body-sm text-muted-foreground mb-4">
    Use to label groups of related form fields. Combines the <code className="text-code bg-muted px-1 py-0.5 rounded">.text-body</code> token with a <code className="text-code bg-muted px-1 py-0.5 rounded">font-bold</code> override.
  </p>
  <div className="rounded-md bg-card/50 p-4">
    <h3 className="text-body font-bold text-foreground mb-2">Contact Information</h3>
    <Input placeholder="Enter your email..." className="shadow-sm" />

    <h3 className="text-body font-bold text-foreground mt-6 mb-2">Administrative Settings</h3>
    <Input placeholder="Enter department..." className="shadow-sm" />
  </div>
</div>
```

### Design System Audit
- **Typography**: Uses only `.text-body` composite token. `font-bold` is a permitted override per the 80/20 rule.
- **Color**: `text-foreground` is a semantic CSS custom property -- no hardcoded hex values.
- **Spacing**: `mt-6` and `mb-2` are standard Tailwind steps on the 4px grid -- no arbitrary bracket values.
- **No new CSS classes required**: Composition of existing tokens only.

### Review
1. **Top 3 Risks**: (a) None -- additive-only gallery change. (b) No new primitives. (c) No production impact.
2. **Top 3 Fixes**: (a) Documents a previously informal pattern. (b) Provides live reference. (c) Prevents class soup.
3. **Database Change**: No.
4. **Verdict**: Go -- single-file, gallery-only addition.

