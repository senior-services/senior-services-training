

## Fix: Google Drive URLs Should Default to Presentation

### Problem

When a Google Drive link like `https://drive.google.com/file/d/...` is entered, the `detectContentTypeFromUrl` function returns `null` (line 224) because it considers Drive URLs "ambiguous." Since `null` means no auto-detection fires, the toggle stays on its default of "Video."

### Root Cause

The detection logic (in `src/utils/videoUtils.ts`) has three tiers:
1. Google Slides URLs --> `'presentation'` (works)
2. YouTube URLs --> `'video'` (works)
3. Generic Google Drive URLs --> `null` (broken -- should be `'presentation'`)

In this app's context, Google Drive links are used for PPSX files (presentations). Google Slides links are already caught separately. So a generic Drive URL should default to `'presentation'`.

### Fix

**File: `src/utils/videoUtils.ts`** (line 224)

Change `return null;` to `return 'presentation';` inside the `isGoogleDriveUrl` branch.

Update the doc comment (line 208) from:
> 3. Generic Google Drive URLs (drive.google.com) --> null (ambiguous, file type unknown)

To:
> 3. Generic Google Drive URLs (drive.google.com) --> 'presentation' (assumed PPSX hosting)

One line change, one comment update. No other files affected.

### Review

- **Top 3 Risks:** (1) If someone hosts a video on Google Drive, it will default to Presentation -- but the toggle is still manually switchable. (2) None structural. (3) None.
- **Top 3 Fixes:** (1) Drive URLs now correctly auto-select Presentation. (2) Matches user expectation from screenshot. (3) No downstream impact.
- **Database Change:** No
- **Verdict:** Go
