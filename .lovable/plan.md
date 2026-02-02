

## Update Filter Toggle to 4 Options

### Overview
Adding "Completed" and "All" filter options to the video assignment toggle, plus mobile-friendly wrapping.

---

### File to Modify

**`src/components/dashboard/AssignVideosModal.tsx`**

---

### Change 1: Update Filter Mode Type (Line 96)

**Current:**
```tsx
const [filterMode, setFilterMode] = useState<'unassigned' | 'assigned'>('unassigned');
```

**New:**
```tsx
const [filterMode, setFilterMode] = useState<'unassigned' | 'assigned' | 'completed' | 'all'>('unassigned');
```

---

### Change 2: Update Filter Logic (Lines 354-370)

**Current:**
```tsx
// Filter videos based on current filter mode
const getFilteredVideos = () => {    
  switch (filterMode) {
    case 'unassigned':
      // Show videos that are not assigned and not completed, sorted alphabetically
      return videos
        .filter(v => !assignedVideoIds.has(v.id) && !completedVideoIds.has(v.id))
        .sort((a, b) => a.title.localeCompare(b.title));
    case 'assigned':
      // Show videos currently assigned to employee (excluding completed), sorted alphabetically
      return videos
        .filter(v => assignedVideoIds.has(v.id) && !completedVideoIds.has(v.id))
        .sort((a, b) => a.title.localeCompare(b.title));
    default:
      return videos;
  }
};
```

**New:**
```tsx
// Filter videos based on current filter mode
const getFilteredVideos = () => {    
  switch (filterMode) {
    case 'unassigned':
      // Show videos that are not assigned and not completed
      return videos
        .filter(v => !assignedVideoIds.has(v.id) && !completedVideoIds.has(v.id))
        .sort((a, b) => a.title.localeCompare(b.title));
    case 'assigned':
      // Show videos currently assigned to employee (excluding completed)
      return videos
        .filter(v => assignedVideoIds.has(v.id) && !completedVideoIds.has(v.id))
        .sort((a, b) => a.title.localeCompare(b.title));
    case 'completed':
      // Show only completed videos
      return videos
        .filter(v => completedVideoIds.has(v.id))
        .sort((a, b) => a.title.localeCompare(b.title));
    case 'all':
      // Show all videos
      return videos
        .sort((a, b) => a.title.localeCompare(b.title));
    default:
      return videos;
  }
};
```

---

### Change 3: Add Toggle Options + Flex-Wrap (Lines 403-416)

**Current:**
```tsx
<ToggleGroup 
  type="single" 
  value={filterMode} 
  onValueChange={(value) => setFilterMode(value as typeof filterMode || 'unassigned')}
  variant="pill"
  className="justify-start"
>
  <ToggleGroupItem value="unassigned" className="text-xs px-3 py-1" aria-label="Filter by unassigned videos">
    Unassigned
  </ToggleGroupItem>
  <ToggleGroupItem value="assigned" className="text-xs px-3 py-1" aria-label="Filter by assigned videos">
    Assigned
  </ToggleGroupItem>
</ToggleGroup>
```

**New:**
```tsx
<ToggleGroup 
  type="single" 
  value={filterMode} 
  onValueChange={(value) => setFilterMode(value as typeof filterMode || 'unassigned')}
  variant="pill"
  className="justify-start flex-wrap"
>
  <ToggleGroupItem value="unassigned" className="text-xs px-3 py-1" aria-label="Filter by unassigned videos">
    Unassigned
  </ToggleGroupItem>
  <ToggleGroupItem value="assigned" className="text-xs px-3 py-1" aria-label="Filter by assigned videos">
    Assigned
  </ToggleGroupItem>
  <ToggleGroupItem value="completed" className="text-xs px-3 py-1" aria-label="Filter by completed videos">
    Completed
  </ToggleGroupItem>
  <ToggleGroupItem value="all" className="text-xs px-3 py-1" aria-label="Show all videos">
    All
  </ToggleGroupItem>
</ToggleGroup>
```

---

### Change 4: Update Empty State Messages (Lines 447-450)

**Current:**
```tsx
<p>
  {filterMode === 'unassigned' && 'No unassigned videos available'}
  {filterMode === 'assigned' && 'No assigned videos found'}
</p>
```

**New:**
```tsx
<p>
  {filterMode === 'unassigned' && 'No unassigned videos available'}
  {filterMode === 'assigned' && 'No assigned videos found'}
  {filterMode === 'completed' && 'No completed videos found'}
  {filterMode === 'all' && 'No videos available'}
</p>
```

---

### Filter Behavior Summary

| Filter | Shows |
|--------|-------|
| Unassigned | Videos not assigned and not completed |
| Assigned | Videos assigned but not yet completed |
| Completed | Only completed videos |
| All | All videos regardless of status |

---

### Items NOT Included (Per Request)

- Status badges on video items
- Shorter toggle labels

