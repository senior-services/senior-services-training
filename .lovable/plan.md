

## Fix: Download Quiz Versions Including All Versions

### Summary

The "Download quiz versions" feature should include all versions (v1, v2, v3, etc.) in the exported Excel file. The user reports that only the latest version (e.g., v2) appears in the download, rather than all historical versions.

### Investigation Findings

The current `getVersionHistory` method in `quizService.ts` queries the `quizzes` table filtered only by `video_id` with no `archived_at` filter, which should return all versions. However, the method does not explicitly handle potential edge cases where archived quizzes might be filtered out by the Supabase client or caching layer. The fix will make the query explicitly inclusive of archived quizzes and add a safeguard.

### What Changes

**File: `src/services/quizService.ts` -- `getVersionHistory` method (lines 356-360)**

Make the query explicitly fetch both archived and non-archived quizzes by removing any ambiguity. Add explicit logging if zero archived versions are returned despite expecting them.

Current query:
```text
supabase.from('quizzes').select('*').eq('video_id', videoId).order('version', { ascending: true })
```

Updated approach -- fetch all quizzes for the video, explicitly not filtering by archived_at, and log the count for debugging:
```text
supabase.from('quizzes').select('*').eq('video_id', videoId).order('version', { ascending: true })
// Add: .is('archived_at', null) should NOT be present
// Add: console log of returned count for debugging
```

If the issue persists, the root cause may be RLS-related at runtime. In that case, we would need to verify the admin's auth token is valid when the download is triggered.

### Risk Assessment

**Top 5 Risks/Issues:**
1. Low -- the existing code logic is correct; this is a defensive improvement
2. If the issue is RLS-related, the fix needs server-side verification
3. No data loss risk -- this is a read-only export operation
4. Excel sheet naming must remain unique per version number
5. Large version histories could slow download but this is unlikely in practice

**Top 5 Fixes/Improvements:**
1. Add a debug log showing how many quiz versions were fetched before building the Excel
2. Verify the Supabase query result includes archived quizzes at runtime
3. No schema or migration changes needed
4. If the query truly returns only 1 version, surface a warning toast to the admin
5. Keep the existing Excel structure (one sheet per version) unchanged

**Database Change Required:** No

**Go/No-Go Verdict:** Go -- minimal defensive change with added logging to diagnose if the issue recurs

