-- Complete rollback migration: Remove all archive functionality (with CASCADE)

-- Drop database functions first
DROP FUNCTION IF EXISTS public.archive_employee(uuid);
DROP FUNCTION IF EXISTS public.unarchive_employee(uuid);
DROP FUNCTION IF EXISTS public.get_archived_employees();
DROP FUNCTION IF EXISTS public.get_active_employee_assignments();

-- Drop any indexes that might have been created for archived columns
DROP INDEX IF EXISTS idx_employees_archived;
DROP INDEX IF EXISTS idx_employees_archived_at;

-- Remove archive-related RLS policies first (this fixes the dependency issue)
DROP POLICY IF EXISTS "Admins can view archived employees" ON public.employees;

-- Remove archive-related columns from employees table (CASCADE will handle dependencies)
ALTER TABLE public.employees 
DROP COLUMN IF EXISTS archived CASCADE,
DROP COLUMN IF EXISTS archived_at CASCADE,
DROP COLUMN IF EXISTS archived_by CASCADE;

-- Restore original get_all_employee_assignments function for backward compatibility
CREATE OR REPLACE FUNCTION public.get_all_employee_assignments()
RETURNS TABLE(employee_id uuid, employee_email text, employee_full_name text, assignments json)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as employee_id,
    e.email as employee_email,
    e.full_name as employee_full_name,
    COALESCE(
      json_agg(
        json_build_object(
          'assignment_id', va.id,
          'video_id', va.video_id,
          'video_title', v.title,
          'video_description', v.description,
          'video_type', v.type,
          'due_date', va.due_date,
          'assigned_at', va.created_at,
          'assigned_by', va.assigned_by,
          'progress_percent', COALESCE(vp.progress_percent, 0),
          'completed_at', vp.completed_at
        ) ORDER BY va.created_at DESC
      ) FILTER (WHERE va.id IS NOT NULL),
      '[]'::json
    ) as assignments
  FROM employees e
  LEFT JOIN video_assignments va ON e.id = va.employee_id
  LEFT JOIN videos v ON va.video_id = v.id
  LEFT JOIN video_progress vp ON (e.id = vp.employee_id AND va.video_id = vp.video_id)
  GROUP BY e.id, e.email, e.full_name
  ORDER BY e.created_at DESC;
END;
$$;