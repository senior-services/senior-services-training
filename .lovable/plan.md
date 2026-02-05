
## Update Attention Color to Teal/Cyan

### Summary

Update the `--attention` design token from gold to a **teal/cyan** color to match the screenshot reference. The screenshot shows "Attention" as a teal/cyan variant, distinct from the gold "Warning" variant.

---

### Color Changes

**File:** `src/index.css`

#### Light Mode (:root)

| Token | Current Value | New Value |
|-------|---------------|-----------|
| --attention | `38 77% 59%` (gold) | `174 72% 40%` (teal) |
| --attention-foreground | `0 0% 100%` | `0 0% 100%` (no change) |

#### Dark Mode (.dark)

| Token | Current Value | New Value |
|-------|---------------|-----------|
| --attention | `38 77% 70%` (bright gold) | `174 72% 60%` (bright teal) |
| --attention-foreground | `219 79% 6%` | `219 79% 6%` (no change) |

---

### Color Reference

The new teal color (`174 72% 40%`) approximates:
- **RGB**: rgb(28, 175, 165)
- **Hex**: #1CAF A5

This creates clear visual distinction between:
- **Warning** (gold/yellow) - for caution/alerts
- **Attention** (teal/cyan) - for informational highlights

---

### Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Update `--attention` token in both light and dark modes |

---

### Components Affected

All components using the `attention` token will automatically update:
- Badge (solid, hollow, soft, ghost variants)
- Banner (attention variant)
- Any other UI elements referencing `bg-attention`, `text-attention`, `border-attention`
