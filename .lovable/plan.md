

## Add Training Type Segmented Control to Create Training Form

### What Changes

Add an explicit "Training Type" segmented control (Video / Presentation) to the Add New Training form, with URL-based auto-detection and a conditional "Minimum Viewing Time" field when Presentation is active.

### UI Layout (top to bottom)

1. Training Title (existing)
2. Description (existing)
3. Video or Presentation Link (existing)
4. **Training Type** -- NEW segmented control (Video | Presentation), unselected by default
5. **Minimum Viewing Time** -- NEW input, visible only when Presentation is active
6. Footer buttons (existing)

### File Changes

**1. `src/utils/videoUtils.ts` -- Update `detectContentTypeFromUrl`**

Add `.ppsx` extension detection. Update `drive.google.com` handling to return `null` (already does). Add a check: if the URL path ends in `.ppsx`, return `'presentation'`.

Current logic returns `null` for Google Drive URLs. The new logic adds:
- URLs ending in `.ppsx` return `'presentation'`

No other detection changes needed -- YouTube and Google Slides detection already works.

**2. `src/components/content/AddContentModal.tsx` -- Main form changes**

State additions:
- `contentType` initial value changes from `"video"` to `""` (empty string = unselected). Type widens to `ContentType | ""`.
- New state: `minViewingTime` (number, default `60`)

New UI elements (inserted after the URL field block, before the commented-out "Assign to All" section):

**Training Type segmented control:**
- Uses the existing `ToggleGroup` / `ToggleGroupItem` components with `variant="pill"` and `size="pill"`
- Two options: "Video" and "Presentation"
- Value bound to `contentType` state
- Manual selection always wins (user can override auto-detection)

**Minimum Viewing Time input:**
- Conditionally rendered when `contentType === "presentation"`
- Label: "Minimum Viewing Time (seconds)"
- `form-helper-text` below the label: "How long the employee must view the presentation before they can mark it complete."
- Number input, default value `60`, min `1`

**Auto-detection logic update:**
- In `handleUrlChange`, after `detectContentTypeFromUrl` returns a value, set `contentType` to that value
- If detection returns `null`, leave `contentType` unchanged (preserves manual selection)

**Validation update:**
- `isValid` adds check: `contentType !== ""` (must select a type)
- `handleSave` includes `contentType` (already does) and adds `duration_seconds: contentType === 'presentation' ? minViewingTime : undefined` to `formData`

**Reset logic:**
- Both `useEffect` (on open) and `handleClose` reset `contentType` to `""` and `minViewingTime` to `60`

**3. `src/components/content/AddContentModal.tsx` -- `ContentFormData` interface update**

Add optional field: `duration_seconds?: number`

### Auto-Detection Rules

| URL Pattern | Auto-Set Type |
|---|---|
| `youtube.com` or `youtu.be` | Video |
| `docs.google.com/presentation` | Presentation |
| URL path ends in `.ppsx` | Presentation |
| `drive.google.com` (generic) | No change (ambiguous) |
| Anything else | No change |

### What Stays the Same

- All existing form fields, labels, and error handling
- The `form-additional-text` privacy hint below the URL field
- The commented-out "Assign to All" section
- The `handleSave` flow and parent modal control
- All other files unchanged

### Review

- **Top 3 Risks:** (1) Widening `contentType` to include `""` requires the save handler to validate before submitting. (2) The `duration_seconds` field needs the parent `onSave` handler to pass it through to the database -- if the parent ignores it, it silently drops. (3) The ToggleGroup `variant="pill"` style is already proven in ComponentsGallery so no visual risk.
- **Top 3 Fixes:** (1) Admins get clear visual feedback on which training mode is active. (2) Auto-detection reduces manual effort and errors. (3) Minimum viewing time is only shown when relevant, keeping the form clean.
- **Database Change:** No -- the `videos` table already has `duration_seconds` and `content_type` columns.
- **Verdict:** Go -- focused feature addition with no structural changes.
