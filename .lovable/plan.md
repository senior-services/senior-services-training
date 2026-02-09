
## Fix Completed Video Data Display in Assign Videos Dialog

### Problem
"Social Media and Communications Policy" for John shows "Completed" status but displays "--" for Date, Quiz Results, and Quiz Version. The Excel export correctly shows the data (Sep 10, 2025 / 0% (0/1 Correct) / 3). The discrepancy exists because the video has progress data (making it "completed") but may not be in the active assignments list, causing all display helpers to treat it as unassigned.

### Root Cause
The completion status check (`getCompletionStatus`) correctly identifies a video as "Completed" by checking `completedVideoIds` first. However, the three data display functions -- `getQuizResults`, `getQuizVersion`, and `formatDueDate` -- only check `assignedVideoIds` (and `selectedVideoIds`) to decide whether to show data or "--". A completed video that is not in `assignedVideoIds` gets the correct "Completed" badge but "--" everywhere else.

### Change

**File: `src/components/dashboard/AssignVideosModal.tsx`**

Update the three display helper functions to treat completed videos the same as assigned videos:

1. **`getQuizResults`** (line 608): Change `isAssigned` to also include `completedVideoIds`:
   ```
   const isAssigned = assignedVideoIds.has(videoId) || completedVideoIds.has(videoId);
   ```

2. **`getQuizVersion`** (line 643): Same change:
   ```
   const isAssigned = assignedVideoIds.has(videoId) || selectedVideoIds.has(videoId) || completedVideoIds.has(videoId);
   ```

3. **`formatDueDate`** (line 478): Add a check for completed videos early in the function so they show the completion date instead of "--":
   ```
   // Completed videos: show completion date regardless of assignment status
   if (completedVideoIds.has(videoId)) {
     const progressData = videoProgressData.get(videoId);
     if (progressData?.completed_at) {
       return format(new Date(progressData.completed_at), "MMM dd, yyyy");
     }
   }
   ```
   This should be placed before the existing unassigned check.

### Review
- **Top 5 Risks**: (1) Edge case where a completed video was never formally assigned -- showing data is still correct since the employee did complete it. (2) No other significant risks.
- **Top 5 Fixes**: (1) Include `completedVideoIds` in assignment checks across all three display helpers. (2) Prioritize completion date display for completed videos in `formatDueDate`.
- **Database Change Required**: No
- **Go/No-Go**: Go
