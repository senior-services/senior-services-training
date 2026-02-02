

## Move Muted Background to Page Level with White Header

### Overview
Change the page background to muted color while keeping the header white by:
1. Moving `bg-muted/50` from the `<main>` element to the outer `<div>` wrapper
2. Ensuring the Header component keeps its white background (it already has `bg-background`)

---

### Changes Required

**File: `src/pages/AdminDashboard.tsx`**

**Change 1 - Line 38** (add muted background to page wrapper):
```tsx
// Current:
return <div className="min-h-screen bg-background">

// Updated:
return <div className="min-h-screen bg-muted/50">
```

**Change 2 - Line 41** (remove muted background from main):
```tsx
// Current:
<main className="container mx-auto px-4 pb-8 bg-muted/50">

// Updated:
<main className="container mx-auto px-4 pb-8">
```

---

### Why This Works
The Header component already has `bg-background` class (line 21 of Header.tsx), which will render it white and overlay on top of the muted page background. The main content area will show through to the muted background.

