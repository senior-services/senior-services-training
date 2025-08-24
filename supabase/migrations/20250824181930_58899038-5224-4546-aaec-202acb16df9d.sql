-- Remove jane.doe@southsoundseniors.org from admin emails and revert her role to employee

CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'admin@gmail.com',
    'admin@seniorservices.com',
    'manager@seniorservices.com'
  ];
BEGIN
  -- Check if the new user's email is in the admin list
  IF NEW.email = ANY(admin_emails) THEN
    -- Update their role to admin (this will override the default employee role)
    UPDATE public.user_roles 
    SET role = 'admin'::app_role 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Revert Jane Doe's role back to employee
UPDATE public.user_roles 
SET role = 'employee'::app_role 
WHERE user_id = (
  SELECT user_id 
  FROM profiles 
  WHERE email = 'jane.doe@southsoundseniors.org'
);