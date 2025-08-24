-- Check if jane.doe@southsoundseniors.org should have admin role based on the trigger function
-- The trigger only assigns admin role to specific emails, let's update it to include jane.doe@southsoundseniors.org

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
    'manager@seniorservices.com',
    'jane.doe@southsoundseniors.org'  -- Adding Jane Doe as admin
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

-- Manually update Jane Doe's role to admin since she's already registered
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = (
  SELECT user_id 
  FROM profiles 
  WHERE email = 'jane.doe@southsoundseniors.org'
);