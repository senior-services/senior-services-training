-- Create a helper function to update video progress by email that works even when RLS blocks direct selects or when employee doesn't exist yet
-- This function finds or creates the employee by email (case-insensitive) and delegates to update_video_progress

CREATE OR REPLACE FUNCTION public.update_video_progress_by_email(
  p_email text,
  p_video_id uuid,
  p_progress_percent integer,
  p_completed_at timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_employee_id uuid;
  v_full_name text;
BEGIN
  -- Try to find employee by email (case-insensitive)
  SELECT id INTO v_employee_id
  FROM public.employees
  WHERE lower(email) = lower(p_email)
  LIMIT 1;

  -- If not found, attempt to get a name from profiles and create the employee row
  IF v_employee_id IS NULL THEN
    SELECT full_name INTO v_full_name
    FROM public.profiles
    WHERE lower(email) = lower(p_email)
    LIMIT 1;

    INSERT INTO public.employees (email, full_name)
    VALUES (p_email, v_full_name)
    RETURNING id INTO v_employee_id;
  END IF;

  -- Clamp progress between 0 and 100 and delegate to existing function
  PERFORM public.update_video_progress(
    v_employee_id,
    p_video_id,
    GREATEST(0, LEAST(100, p_progress_percent)),
    p_completed_at
  );
END;
$$;

-- Performance index for case-insensitive lookups on employees.email
CREATE INDEX IF NOT EXISTS idx_employees_lower_email ON public.employees (lower(email));