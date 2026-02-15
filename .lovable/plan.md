

## Add "Form Section Header" to Style Guide

### Overview
Add a new semantic element demonstration called "Form Section Header" to the Form Controls section of the Components Gallery. This element standardizes the typography for grouping related form fields (e.g., "Contact Information", "Administrative Settings").

### Specification
- **Typography**: `.text-body` (16px, inherited weight/leading from the composite token)
- **Weight override**: `font-bold` (permitted under the 80/20 rule for form contexts)
- **Color**: `text-foreground` (semantic token, no hardcoded hex)
- **Spacing**: `mt-6` top margin to separate from previous group, `mb-2` bottom margin above the fields it labels

### Changes

**File: `src/pages/ComponentsGallery.tsx`**

Insert a new subsection at the top of the Form Controls `CardContent` area (after line 825, before the existing rounded-lg container). The new block will contain:

1. A descriptive sub-heading: "Form Section Header"
2. A live preview showing two form section headers, each above a sample text input, separated to demonstrate the spacing pattern:

```
-- Live Preview --
[Form Section Header: "Contact Information"]
  [Text Input: "Enter your email..."]

[Form Section Header: "Administrative Settings"]  (with mt-6)
  [Text Input: "Enter department..."]
```

The markup for each header element:

```tsx
<h3 className="text-body font-bold text-foreground mt-6 mb-2">
  Contact Information
</h3>
```

### Design System Audit
- **Typography**: Uses only `.text-body` composite token. `font-bold` is a permitted override per the 80/20 rule for form layout contexts.
- **Color**: `text-foreground` is a semantic CSS custom property -- no hardcoded hex values.
- **Spacing**: `mt-6` and `mb-2` are standard Tailwind steps on the 4px grid -- no arbitrary bracket values.
- **No new CSS classes required**: This is a composition of existing tokens, not a new primitive.

### Review
1. **Top 3 Risks**: (a) None -- additive-only change to the gallery page. (b) No new primitives or CSS classes introduced. (c) No impact on production components.
2. **Top 3 Fixes**: (a) Documents a previously informal pattern. (b) Provides a live reference for developers. (c) Prevents future "class soup" by establishing the canonical markup.
3. **Database Change**: No.
4. **Verdict**: Go -- single-file, gallery-only addition.

