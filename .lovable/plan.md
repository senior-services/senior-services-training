

## Refactor PersonSettingsModal and TrainingSettingsModal: Staged Save, Checkboxes, Aligned Patterns

### Overview
Two files changed to implement a staged save pattern with checkboxes, consistent across both modals.

---

### File 1: `src/components/dashboard/PersonSettingsModal.tsx`

**1. Staged State and Save Logic**

- Add `useEffect` to React import.
- Add local state: `stagedAdmin` (init from `person.is_admin`) and `stagedHidden` (init `false`).
- Reset staged state when `person` changes or modal opens.
- Checkbox interactions update local state only -- no API calls on click.
- Derive `hasChanges = stagedAdmin !== person.is_admin || stagedHidden`.
- On "Save Changes": commit admin change if dirty, commit hide if checked, then close modal and refresh list.
- Remove `AlertDialog` confirmation (the Save button is the intentional action).

**2. Admin Privileges: Switch to Checkbox, stacked layout**

Remove `Switch` import, add `Checkbox` import. Layout becomes:

```
Administrative Privileges (label)
Grant this person full admin access... (description)
[Checkbox] Grant admin access
```

Remove `border-t border-b border-border-primary` from the section wrapper. Use simple stacked `div` instead of `flex justify-between`.

**3. Hide Person: Button to Label/Description/Checkbox**

Remove `EyeOff` import. Replace button with:

```
Hide Person From Active List (label)
Moves to the Hidden section without affecting assignments or progress. (description)
[Checkbox] (checked = stagedHidden)
```

Order: label first, then description text, then checkbox below.

**4. Footer**

```
[Close (outline)]  [Save Changes (primary, disabled when !hasChanges)]
```

**5. Import Changes**

- Add: `Checkbox` from `@/components/ui/checkbox`, `useEffect` from React.
- Remove: `Switch`, `EyeOff`, all `AlertDialog` sub-components.
- Keep: `Badge`, `Label`.

---

### File 2: `src/components/dashboard/TrainingSettingsModal.tsx`

**1. Staged State and Save Logic**

- Add `useEffect`, `useState` already present.
- Add local state: `stagedHidden` (init `false`). Reset on modal open.
- Derive `hasChanges = stagedHidden`.
- On "Save Changes": commit hide if checked, then close modal.
- Remove `AlertDialog` confirmation.

**2. Training Info Section**

- Keep training title display.
- Remove training description (`video.description` paragraph).

**3. Hide Training: Button to Label/Description/Checkbox**

Replace button with same pattern as PersonSettings:

```
Hide Training From Active List (label)
Moves to the Hidden section without affecting existing assignments or progress. (description)
[Checkbox] (checked = stagedHidden)
```

**4. Footer**

```
[Close (outline)]  [Save Changes (primary, disabled when !hasChanges)]
```

**5. Import Changes**

- Add: `Checkbox` from `@/components/ui/checkbox`, `Label` from `@/components/ui/label`.
- Remove: `EyeOff`, all `AlertDialog` sub-components.

---

### Review
1. **Top 3 Risks:** (a) Removing hide confirmation -- mitigated by explicit Save action. (b) Training modal currently has no other staged fields -- if more settings are added later the pattern is ready. (c) Label-then-description-then-checkbox order is less common than checkbox-label but matches the user's request.
2. **Top 3 Fixes:** (a) Consistent staged save across both modals. (b) No accidental immediate API calls. (c) Aligned component patterns between People and Trainings tabs.
3. **Database Change:** No.
4. **Verdict:** Go -- two-file refactor with aligned patterns.

