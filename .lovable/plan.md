

## Update Component Gallery Layout and Navigation

### What Changes

1. **Rename page title** from "Components Gallery" to "Style Guide"
2. **Convert anchor links to a vertical list** instead of multi-column layout
3. **Add missing anchor links** so every section has a corresponding link (currently missing: Component Updates)
4. **Add drag-to-reorder** on the anchor links using HTML5 drag-and-drop, with grab handles (GripVertical icon). Reordering the list also reorders the sections below to match.
5. **Reduce spacing** throughout the page for a more condensed view

### Detailed Changes (1 file)

**`src/pages/ComponentsGallery.tsx`**

**Title**: Change `<h1>` text from "Components Gallery" to "Style Guide"

**Anchor navigation (lines ~206-284)**:
- Replace the multi-column `<ul className="columns-2 sm:columns-3 ...">` with a single-column vertical `<ul>` list
- Add a `GripVertical` icon (from lucide-react) as a drag handle on each list item
- Store the section order in state: `useState` with an array of `{ id, label }` objects representing all sections
- Implement HTML5 drag-and-drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) to allow reordering
- Ensure the list includes all sections: Banners, Badges, Buttons, Calendar, Color Palette, Component Updates, Data Display, Form Controls, Icons, Interactive, Layout, Progress, Toast, Tooltips, Training Cards, Typography (alphabetical default)

**Section rendering**:
- Instead of hardcoded section order in JSX, wrap each section in a lookup map and render them dynamically based on the `sectionOrder` state array. This way reordering the anchor list also reorders the page sections.

**Spacing reductions**:
- Page container: `py-8 space-y-12` changes to `py-4 space-y-4`
- Card headers: tighten padding where needed
- Remove `text-center space-y-4` from page header, use `space-y-2`

**Footer text**: Update "Components Gallery" to "Style Guide"

### Review

- **Top 5 Risks**: (1) Drag-and-drop adds state complexity -- kept simple with HTML5 native API, no extra dependencies. (2) Dynamic section rendering requires refactoring hardcoded JSX into a keyed map -- moderate code change but straightforward. (3) Reorder state is ephemeral (resets on page refresh) -- acceptable for a style guide. (4) No database impact. (5) No security impact.
- **Top 5 Fixes**: (1) Replace columns layout with vertical list. (2) Add GripVertical drag handles. (3) Implement drag-and-drop reorder with section sync. (4) Add missing anchor links. (5) Reduce spacing tokens.
- **Database Change Required**: No
- **Go/No-Go**: Go

