-- Create a function to get video assignments for a user by email
-- This bypasses the RLS complexity by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_user_video_assignments(user_email TEXT)
RETURNS TABLE (
  video json,
  assignment json
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    row_to_json(v.*) as video,
    json_build_object(
      'due_date', va.due_date,
      'assigned_at', va.created_at,
      'assignment_id', va.id
    ) as assignment
  FROM video_assignments va
  JOIN videos v ON va.video_id = v.id
  JOIN employees e ON va.employee_id = e.id
  WHERE e.email = user_email;
END;
$$;