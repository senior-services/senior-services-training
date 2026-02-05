

## Unify Border Tokens with Input Color

### Summary

Update `--border-primary` to match the `--input` color value in both light and dark modes. The `--border-secondary` already matches `--input`.

---

### Changes

**File:** `src/index.css`

#### Light Mode (:root)

| Line | Token | Current Value | New Value |
|------|-------|---------------|-----------|
| 44 | --border-primary | `210 20% 65%` | `210 20% 77%` |
| 45 | --border-secondary | `210 20% 77%` | (no change - already matches) |
| 46 | --input | `210 20% 77%` | (no change) |

#### Dark Mode (.dark)

| Line | Token | Current Value | New Value |
|------|-------|---------------|-----------|
| 120 | --border-primary | `219 79% 35%` | `219 79% 25%` |
| 121 | --border-secondary | `219 79% 25%` | (no change - already matches) |
| 122 | --input | `219 79% 25%` | (no change) |

---

### Result

All three tokens will have the same value:

| Mode | Unified Value |
|------|---------------|
| Light | `210 20% 77%` |
| Dark | `219 79% 25%` |

---

### Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Update `--border-primary` in both light and dark modes |

---

### Components Affected

All components using `border-border-primary` will have softer borders matching input fields, creating a more consistent visual appearance across forms and containers.

