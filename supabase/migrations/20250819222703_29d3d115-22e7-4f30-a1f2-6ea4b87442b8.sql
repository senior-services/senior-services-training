-- Remove white-label/generic functionality from database

-- Drop the employee_assignments_with_videos view first (it depends on is_generic)
DROP VIEW IF EXISTS public.employee_assignments_with_videos CASCADE;

-- Remove is_generic column from employees table
ALTER TABLE public.employees DROP COLUMN IF EXISTS is_generic CASCADE;