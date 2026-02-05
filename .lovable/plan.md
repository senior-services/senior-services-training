

## Update Design System Colors in Component Gallery

### Summary

Update four color tokens in `src/index.css` to match the new RGB values you've specified. These colors will automatically apply throughout the app, including banners, badges, and buttons.

---

### Color Conversions

| Token | New RGB | New HSL Value |
|-------|---------|---------------|
| --attention | rgb(231, 172, 70) | `38 77% 59%` |
| --destructive | rgb(225, 85, 84) | `0 70% 61%` |
| --primary | rgb(23, 101, 161) | `206 75% 36%` |
| --secondary | rgb(107, 168, 213) | `205 52% 63%` |

---

### Changes to Make

**File:** `src/index.css`

#### Light Mode (:root) Updates

| Line | Current | New |
|------|---------|-----|
| 22 | `--primary: 219 79% 22%;` | `--primary: 206 75% 36%;` |
| 26 | `--secondary: 206 73% 55%;` | `--secondary: 205 52% 63%;` |
| 38 | `--attention: 41 96% 40%;` | `--attention: 38 77% 59%;` |
| 40 | `--destructive: 0 84% 50%;` | `--destructive: 0 70% 61%;` |

#### Related Light Mode Updates (to maintain consistency)

| Line | Current | New |
|------|---------|-----|
| 49 | `--ring: 219 79% 22%;` | `--ring: 206 75% 36%;` |
| 62 | `--progress-fill: 219 79% 22%;` | `--progress-fill: 206 75% 36%;` |
| 63 | `--deadline-overdue: 0 84% 50%;` | `--deadline-overdue: 0 70% 61%;` |

#### Hero Gradient Update (Line 277)

```css
/* Before */
background: linear-gradient(135deg, hsl(219, 79%, 22%), hsl(206, 73%, 55%));

/* After */
background: linear-gradient(135deg, hsl(206, 75%, 36%), hsl(205, 52%, 63%));
```

---

### Dark Mode Considerations

Dark mode values should be adjusted to be brighter versions for visibility. Recommended updates:

| Token | Current Dark | Suggested Dark |
|-------|--------------|----------------|
| --primary | `206 73% 70%` | `206 75% 70%` (minor hue alignment) |
| --secondary | `219 79% 25%` | `205 52% 35%` (match new hue) |
| --attention | `41 96% 55%` | `38 77% 70%` (brighter for dark mode) |
| --destructive | `0 84% 75%` | `0 70% 75%` (match new saturation) |

---

### Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Update color tokens for primary, secondary, attention, and destructive in both light and dark modes |

---

### Visual Impact

These changes will update colors for:
- All buttons using primary/secondary variants
- Banners (info, success, warning, error, attention)
- Badges with destructive/attention variants
- Progress bars
- Status indicators
- Hero gradients

