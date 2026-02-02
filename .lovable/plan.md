

## Remove Gradient Background Styles from Header and Dialog Components

### Overview
Remove the gradient background styling (`bg-gradient-card`) from the site header and dialog header/footer components, leaving them with a clean, flat background.

---

### Changes Required

#### 1. Site Header
**File: `src/components/Header.tsx`**  
**Line 21**

**Current:**
```tsx
<header className="bg-gradient-card border-b border-border-primary shadow-card">
```

**Updated:**
```tsx
<header className="bg-background border-b border-border-primary shadow-card">
```

*Replaces gradient with a solid `bg-background` color*

---

#### 2. Dialog Header
**File: `src/components/ui/dialog.tsx`**  
**Line 84**

**Current:**
```tsx
"flex flex-col space-y-1.5 text-center sm:text-left bg-gradient-card px-6 py-4 border-b border-border-secondary flex-shrink-0 sm:rounded-t-lg"
```

**Updated:**
```tsx
"flex flex-col space-y-1.5 text-center sm:text-left bg-background px-6 py-4 border-b border-border-secondary flex-shrink-0 sm:rounded-t-lg"
```

*Replaces gradient with a solid `bg-background` color*

---

#### 3. Dialog Footer
**File: `src/components/ui/dialog.tsx`**  
**Line 114**

**Current:**
```tsx
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 bg-gradient-card px-6 py-4 border-t border-border-secondary flex-shrink-0 sm:rounded-b-lg"
```

**Updated:**
```tsx
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 bg-background px-6 py-4 border-t border-border-secondary flex-shrink-0 sm:rounded-b-lg"
```

*Replaces gradient with a solid `bg-background` color*

---

### Summary

| Component | File | Change |
|-----------|------|--------|
| Site Header | `Header.tsx` | `bg-gradient-card` → `bg-background` |
| DialogHeader | `dialog.tsx` | `bg-gradient-card` → `bg-background` |
| DialogFooter | `dialog.tsx` | `bg-gradient-card` → `bg-background` |

**Result:** All three areas will display with a clean, solid background color instead of a gradient effect.

