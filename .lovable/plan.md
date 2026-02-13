

## Fix: Data Discrepancy Between Admin and Employee Dashboard Counts

### Root Cause

The `get_user_video_assignments` database function only queries `video_assignments`. It does not include the `UNION ALL` block that `get_all_employee_assignments` uses to surface `video_progress` records without a formal assignment.

John has 2 Required trainings where he watched the video (99% progress) but was never formally assigned. The admin dashboard sees them (via the UNION ALL); the employee dashboard does not.

### Fix

**Database function: `get_user_video_assignments`**

Add a `UNION ALL` block (matching the pattern already established in `get_all_employee_assignments` and `get_hidden_employee_assignments`) to include video progress records that have no corresponding assignment row.

Current query (simplified):
```text
SELECT v.*, va.due_date, va.created_at, vp.*
FROM video_assignments va
JOIN videos v ON va.video_id = v.id
JOIN employees e ON va.employee_id = e.id
LEFT JOIN video_progress vp ON ...
WHERE e.email = user_email
```

Updated query adds after the main SELECT:
```text
UNION ALL

SELECT v2.*, NULL as due_date, vp2.created_at, vp2.*
FROM video_progress vp2
JOIN videos v2 ON vp2.video_id = v2.id
JOIN employees e2 ON vp2.employee_id = e2.id
WHERE e2.email = user_email
  AND NOT EXISTS (
    SELECT 1 FROM video_assignments va2
    WHERE va2.employee_id = e2.id AND va2.video_id = vp2.video_id
  )
```

This is the exact same pattern used in `get_all_employee_assignments` (lines referencing Source 2 in the existing function). No application code changes are needed -- the return shape (`video json, assignment json`) remains identical.

### Migration SQL

```sql
CREATE OR REPLACE FUNCTION public.get_user_video_assignments(user_email text)
 RETURNS TABLE(video json, assignment json)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY

  -- Source 1: videos with formal assignments
  SELECT 
    row_to_json(v.*) as video,
    json_build_object(
      'due_date', va.due_date,
      'assigned_at', va.created_at,
      'assignment_id', va.id,
      'progress_percent', COALESCE(vp.progress_percent, 0),
      'completed_at', vp.completed_at
    ) as assignment
  FROM video_assignments va
  JOIN videos v ON va.video_id = v.id
  JOIN employees e ON va.employee_id = e.id
  LEFT JOIN video_progress vp ON (e.id = vp.employee_id AND va.video_id = vp.video_id)
  WHERE e.email = user_email

  UNION ALL

  -- Source 2: completed/in-progress videos WITHOUT a formal assignment
  SELECT 
    row_to_json(v2.*) as video,
    json_build_object(
      'due_date', NULL,
      'assigned_at', vp2.created_at,
      'assignment_id', NULL,
      'progress_percent', vp2.progress_percent,
      'completed_at', vp2.completed_at
    ) as assignment
  FROM video_progress vp2
  JOIN videos v2 ON vp2.video_id = v2.id
  JOIN employees e2 ON vp2.employee_id = e2.id
  WHERE e2.email = user_email
    AND NOT EXISTS (
      SELECT 1 FROM video_assignments va2
      WHERE va2.employee_id = e2.id AND va2.video_id = vp2.video_id
    );
END;
$function$;
```

### Files Changed

Only a new Supabase migration file. No application code changes needed -- the JSON return shape is preserved.

### Review

1. **Top 3 Risks:** (a) The UNION ALL may surface unexpected old progress records -- this is intentional and matches the admin pattern. (b) The employee dashboard sorts by due date; progress-only records have `NULL` due dates, so they sort to the end -- correct behavior. (c) No schema change, only function replacement.
2. **Top 3 Fixes:** (a) Employee and admin counts now match. (b) Aligns with the established reporting-data-consistency architecture. (c) Single migration, zero app code changes.
3. **Database Change:** Yes -- replaces the `get_user_video_assignments` function to add the UNION ALL block for progress-only records.
4. **Verdict:** Go.
