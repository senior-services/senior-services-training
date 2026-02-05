

## Add Padding to Header Logo

### Summary

Add 5px top and bottom padding to the logo image in the header component.

---

### Changes Required

**File:** `src/components/Header.tsx` - Line 26

Add `py-[5px]` class to the logo `<img>` element to apply 5px vertical padding.

| Before | After |
|--------|-------|
| `className="h-12 w-auto object-cover"` | `className="h-12 w-auto object-cover py-[5px]"` |

---

### Files Modified

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Add `py-[5px]` class to logo image |

---

### Visual Result

The logo will have 5px of padding on both the top and bottom, giving it slightly more breathing room within the header.

