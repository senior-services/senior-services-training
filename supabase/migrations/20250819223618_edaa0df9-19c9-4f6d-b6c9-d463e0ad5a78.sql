-- Drop any triggers or functions related to domain extraction
DROP TRIGGER IF EXISTS set_employee_domain_trigger ON public.employees CASCADE;
DROP FUNCTION IF EXISTS public.set_employee_domain() CASCADE;
DROP FUNCTION IF EXISTS public.extract_domain_from_email(text) CASCADE;