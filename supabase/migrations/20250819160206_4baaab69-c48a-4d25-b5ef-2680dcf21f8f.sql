-- Ensure test employee gets employee role when created
-- Update the existing trigger to handle test employee account

CREATE OR REPLACE FUNCTION public.assign_employee_role_to_test()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- For test employee, ensure they get employee role
  IF NEW.email = 'test@gmail.com' THEN
    -- Update their role to employee (in case they were created without proper role)
    UPDATE public.user_roles 
    SET role = 'employee'::app_role 
    WHERE user_id = NEW.id;
    
    -- If no role exists, insert employee role
    IF NOT FOUND THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'employee'::app_role);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$

-- Create trigger to assign proper role to test employee
DROP TRIGGER IF EXISTS on_test_user_created ON auth.users;
CREATE TRIGGER on_test_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.assign_employee_role_to_test();