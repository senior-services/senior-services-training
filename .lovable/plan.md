

## Refactor PersonSettingsModal and TrainingSettingsModal

### Overview
Refactor both settings modals to use the new `.form-section-header` semantic class, reorder sections in PersonSettingsModal, and add high-visibility attention signaling for admin privilege changes.

### Changes

#### 1. PersonSettingsModal.tsx -- Full Refactor

**A. Replace `<Label>` section headers with `<h3 className="form-section-header">`**
- "Hide Person From Active List" and "Administrative Privileges" become `<h3>` tags with the `.form-section-header` class.
- Remove the `<Label>` import if no longer needed (it is still used for checkbox labels, so it stays).

**B. Layout Reorder**
- Move "Hide Person" section to be first (directly after the person info block).
- Move "Administrative Privileges" section below it.
- Remove both `<Separator />` components and the `<Separator>` import.

**C. Attention Container for Admin Section**
- Wrap the "Administrative Privileges" block in a container styled like the attention banner:
  ```tsx
  <div className="bg-attention/10 border border-attention/20 rounded-lg p-4">
  ```

**D. Staged Badge Logic**
- In the person info header, dynamically render the badge based on staged state:
  - If `stagedAdmin` is `true` and person is NOT currently admin: show `<Badge variant="attention" showIcon>Admin pending</Badge>`
  - If `stagedAdmin` is `false` and person IS currently admin: show `<Badge variant="destructive" showIcon>Admin removal pending</Badge>`
  - If no change from current state and person is admin: show existing `<Badge variant="soft-attention" showIcon>Admin</Badge>`

**E. Typography Cleanup**
- The `<span className="text-body">` for the person name stays (semantic token).
- All `<p>` helper text already uses `.form-helper-text` -- no changes needed.
- Checkbox labels remain as `<Label>` (they are field-level labels, not section headers).

#### 2. TrainingSettingsModal.tsx -- Semantic Cleanup

**A. Replace `<Label>` section header with `<h3 className="form-section-header">`**
- "Hide Training From Active List" becomes `<h3>`.

**B. Remove `<Separator />`**
- Remove the separator between the title and the hide section, along with the `<Separator>` import.

**C. Typography**
- Training title `<p className="text-body">` stays (semantic).
- Helper text already uses `.form-helper-text`.

#### 3. No CSS Changes Required
- `.form-section-header` already exists in `src/index.css`.
- Attention banner colors (`bg-attention/10`, `border-attention/20`) are existing semantic tokens.

### Resulting PersonSettingsModal Layout

```text
+----------------------------------+
| Person Settings          [X]     |
|----------------------------------|
| John Doe  [Admin pending]       |
| john@example.com                |
|                                  |
| <h3> Hide Person From Active... |
| helper text...                   |
| [ ] Hide this person             |
|                                  |
| ┌─ attention container ────────┐ |
| │ <h3> Administrative Privs... │ |
| │ helper text...               │ |
| │ [ ] Grant admin access       │ |
| └──────────────────────────────┘ |
|                                  |
|         [Close] [Save Changes]   |
+----------------------------------+
```

### Design System Audit
- **Typography**: Only `.form-section-header`, `.text-body`, `.form-helper-text` used -- no raw utilities on text elements.
- **Color**: `bg-attention/10`, `border-attention/20` mirror `.banner-attention` using semantic tokens -- no hardcoded hex.
- **Badge variants**: `attention`, `destructive`, `soft-attention` are all existing CVA variants with `showIcon`.
- **Spacing**: `.form-section-header` provides `mt-6 mb-2`; first instance uses `!mt-0` to suppress top margin.
- **Staged save**: Both modals already use local state + footer "Save Changes" -- no logic changes needed beyond badge rendering.

### Review
1. **Top 3 Risks**: (a) Badge "pending" states are visual-only -- no functional impact if user cancels. (b) Attention container is pure CSS composition of existing tokens. (c) Layout reorder changes visual hierarchy but not data flow.
2. **Top 3 Fixes**: (a) Section headers now use semantic class instead of Label primitive. (b) Admin changes get high-visibility signaling before save. (c) Separators removed for cleaner vertical rhythm via `.form-section-header` spacing.
3. **Database Change**: No.
4. **Verdict**: Go -- two-file refactor, no new dependencies.

