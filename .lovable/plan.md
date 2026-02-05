

## Update Color Tokens to New Values

### Summary

Update four color tokens in `src/index.css` with the specified hex values, converted to HSL format for the design system.

---

### Color Conversions

| Token | Hex Value | HSL Value (Light Mode) | HSL Value (Dark Mode) |
|-------|-----------|------------------------|----------------------|
| --success | #059669 | `161 93% 30%` | `161 93% 45%` |
| --attention | #D97706 | `32 94% 44%` | `32 94% 58%` |
| --warning | #EA580C | `21 90% 48%` | `21 90% 62%` |
| --destructive | #DC2626 | `0 72% 51%` | `0 72% 65%` |

---

### Changes to Make

**File:** `src/index.css`

#### Light Mode (:root)

| Line | Current | New |
|------|---------|-----|
| 34 | `--success: 142 71% 35%;` | `--success: 161 93% 30%;` |
| 36 | `--warning: 25 95% 50%;` | `--warning: 21 90% 48%;` |
| 38 | `--attention: 174 72% 40%;` | `--attention: 32 94% 44%;` |
| 40 | `--destructive: 0 70% 61%;` | `--destructive: 0 72% 51%;` |

#### Dark Mode (.dark)

| Line | Current | New |
|------|---------|-----|
| 111 | `--success: 142 71% 55%;` | `--success: 161 93% 45%;` |
| 113 | `--warning: 25 95% 65%;` | `--warning: 21 90% 62%;` |
| 115 | `--attention: 174 72% 60%;` | `--attention: 32 94% 58%;` |
| 117 | `--destructive: 0 70% 75%;` | `--destructive: 0 72% 65%;` |

---

### Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Update success, attention, warning, and destructive tokens in both light and dark modes |

---

### Visual Reference

| Token | Color Description |
|-------|-------------------|
| Success (#059669) | Deep emerald green |
| Attention (#D97706) | Amber/gold |
| Warning (#EA580C) | Orange |
| Destructive (#DC2626) | Red |

---

### Components Affected

All components using these tokens will automatically update:
- Badges (solid, hollow, soft, ghost variants)
- Banners (success, attention, warning, error variants)
- Toast notifications
- Quiz feedback (correct/incorrect)
- Progress indicators
- Status indicators

