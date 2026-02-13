

## Fix: Radio Group Label Typography Mismatch

### Problem
Two typography violations against the design system's senior-legibility rule (16px minimum for labels):

1. **`src/components/shared/DueDateSelector.tsx`** -- The four radio option labels (lines 85, 91, 97, 103) use `text-small font-normal`, rendering at 13px instead of the required 16px.
2. **`src/pages/ComponentsGallery.tsx`** -- The "Radio Button Group" heading label (line 903) uses `text-small font-medium`, also rendering at 13px instead of 16px.

### Fix

**File 1: `src/components/shared/DueDateSelector.tsx`**

Remove `text-small font-normal` from all four radio option Labels. The `Label` primitive already defaults to `text-body font-medium`, so only `cursor-pointer` needs to remain:

- Line 85: `className="text-small font-normal cursor-pointer"` becomes `className="font-normal cursor-pointer"`
- Line 91: same change
- Line 97: same change
- Line 103: same change

The labels will inherit `text-body` (16px) from the Label primitive's base class.

**File 2: `src/pages/ComponentsGallery.tsx`**

Remove `text-small` from the group heading Label on line 903:

- `className="text-small font-medium mb-2 block"` becomes `className="font-medium mb-2 block"`

The label will inherit `text-body` (16px) from the Label primitive.

### Review

1. **Top 3 Risks:** (a) None -- restoring the primitive's default is the correct behavior. (b) Visual shift from 13px to 16px in the due date selector dialog -- this is the intended senior-legibility standard. (c) No downstream components affected.
2. **Top 3 Fixes:** (a) Radio labels meet 16px senior-legibility minimum. (b) Gallery reference matches production usage. (c) Label primitive's locked typography is no longer overridden.
3. **Database Change:** No.
4. **Verdict:** Go.

