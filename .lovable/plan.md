

## Add Background Color Tokens and Rename Background

### Summary

Add three new background color tokens (`--background-header`, `--background-primary`, `--background-muted`) and rename `--background` to `--background-main` for better semantic clarity.

---

### Color Conversions (RGB to HSL)

| Token | RGB Value | HSL Value |
|-------|-----------|-----------|
| --background-header | rgb(29, 69, 100) | `207 55% 25%` |
| --background-primary | rgb(23, 101, 161) | `206 75% 36%` |
| --background-muted | rgb(218, 233, 245) | `207 52% 91%` |

---

### Changes Required

#### 1. Update `src/index.css`

**Light Mode (:root)** - Lines 12-13:
```css
/* Before */
--background: 0 0% 100%;

/* After */
--background-main: 0 0% 100%;
--background-header: 207 55% 25%;
--background-primary: 206 75% 36%;
--background-muted: 207 52% 91%;
```

**Dark Mode (.dark)** - Lines 93-94:
```css
/* Before */
--background: 219 79% 6%;

/* After */
--background-main: 219 79% 6%;
--background-header: 207 55% 18%;
--background-primary: 206 75% 28%;
--background-muted: 207 52% 15%;
```

**Body selector** - Line 161:
```css
/* Before */
@apply bg-background text-foreground ...

/* After */
@apply bg-background-main text-foreground ...
```

#### 2. Update `tailwind.config.ts`

**Colors section** - Line 53:
```typescript
/* Before */
background: 'hsl(var(--background))',

/* After */
background: 'hsl(var(--background-main))',
'background-main': 'hsl(var(--background-main))',
'background-header': 'hsl(var(--background-header))',
'background-primary': 'hsl(var(--background-primary))',
'background-muted': 'hsl(var(--background-muted))',
```

---

### Important Note

The `bg-background` class will continue to work because Tailwind's `background` color key maps to `--background-main`. All 196 existing usages of `bg-background` across 29 files will work without modification.

The new tokens will be available as:
- `bg-background-header` - Dark navy for headers
- `bg-background-primary` - Deep blue (matches primary)
- `bg-background-muted` - Light blue tint

---

### Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Rename `--background` to `--background-main`, add 3 new tokens in both light and dark modes |
| `tailwind.config.ts` | Update background mapping and add new color utilities |

