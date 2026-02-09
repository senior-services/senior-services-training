
-- Update get_all_employee_assignments to also include completed videos without formal assignments
CREATE OR REPLACE FUNCTION public.get_all_employee_assignments()
 RETURNS TABLE(employee_id uuid, employee_email text, employee_full_name text, assignments json)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as employee_id,
    e.email as employee_email,
    e.full_name as employee_full_name,
    COALESCE(
      json_agg(row_data ORDER BY row_data->>'video_title'),
      '[]'::json
    ) as assignments
  FROM employees e
  LEFT JOIN LATERAL (
    -- Source 1: videos with formal assignments
    SELECT json_build_object(
      'assignment_id', va.id,
      'video_id', v.id,
      'video_title', v.title,
      'video_description', v.description,
      'video_type', v.type,
      'due_date', va.due_date,
      'assigned_at', va.created_at,
      'assigned_by', va.assigned_by,
      'progress_percent', COALESCE(vp.progress_percent, 0),
      'completed_at', vp.completed_at
    ) as row_data
    FROM video_assignments va
    JOIN videos v ON va.video_id = v.id
    LEFT JOIN video_progress vp ON va.video_id = vp.video_id AND va.employee_id = vp.employee_id
    WHERE va.employee_id = e.id

    UNION ALL

    -- Source 2: completed videos WITHOUT a formal assignment
    SELECT json_build_object(
      'assignment_id', NULL,
      'video_id', v2.id,
      'video_title', v2.title,
      'video_description', v2.description,
      'video_type', v2.type,
      'due_date', NULL,
      'assigned_at', vp2.created_at,
      'assigned_by', NULL,
      'progress_percent', vp2.progress_percent,
      'completed_at', vp2.completed_at
    ) as row_data
    FROM video_progress vp2
    JOIN videos v2 ON vp2.video_id = v2.id
    WHERE vp2.employee_id = e.id
      AND NOT EXISTS (
        SELECT 1 FROM video_assignments va2
        WHERE va2.employee_id = e.id AND va2.video_id = vp2.video_id
      )
  ) sub ON true
  WHERE e.archived_at IS NULL
  GROUP BY e.id, e.email, e.full_name;
END;
$function$;

-- Update get_hidden_employee_assignments with the same logic
CREATE OR REPLACE FUNCTION public.get_hidden_employee_assignments()
 RETURNS TABLE(employee_id uuid, employee_email text, employee_full_name text, archived_at timestamp with time zone, assignments json)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as employee_id,
    e.email as employee_email,
    e.full_name as employee_full_name,
    e.archived_at,
    COALESCE(
      json_agg(row_data ORDER BY row_data->>'video_title'),
      '[]'::json
    ) as assignments
  FROM employees e
  LEFT JOIN LATERAL (
    -- Source 1: videos with formal assignments
    SELECT json_build_object(
      'assignment_id', va.id,
      'video_id', v.id,
      'video_title', v.title,
      'video_description', v.description,
      'video_type', v.type,
      'due_date', va.due_date,
      'assigned_at', va.created_at,
      'assigned_by', va.assigned_by,
      'progress_percent', COALESCE(vp.progress_percent, 0),
      'completed_at', vp.completed_at
    ) as row_data
    FROM video_assignments va
    JOIN videos v ON va.video_id = v.id
    LEFT JOIN video_progress vp ON va.video_id = vp.video_id AND va.employee_id = vp.employee_id
    WHERE va.employee_id = e.id

    UNION ALL

    -- Source 2: completed videos WITHOUT a formal assignment
    SELECT json_build_object(
      'assignment_id', NULL,
      'video_id', v2.id,
      'video_title', v2.title,
      'video_description', v2.description,
      'video_type', v2.type,
      'due_date', NULL,
      'assigned_at', vp2.created_at,
      'assigned_by', NULL,
      'progress_percent', vp2.progress_percent,
      'completed_at', vp2.completed_at
    ) as row_data
    FROM video_progress vp2
    JOIN videos v2 ON vp2.video_id = v2.id
    WHERE vp2.employee_id = e.id
      AND NOT EXISTS (
        SELECT 1 FROM video_assignments va2
        WHERE va2.employee_id = e.id AND va2.video_id = vp2.video_id
      )
  ) sub ON true
  WHERE e.archived_at IS NOT NULL
  GROUP BY e.id, e.email, e.full_name, e.archived_at
  ORDER BY e.archived_at DESC;
END;
$function$;
