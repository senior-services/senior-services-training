-- Update the admin emails list to include admin@gmail.com
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'admin@gmail.com',           -- User's actual admin email
    'admin@seniorservices.com',  -- Additional admin emails
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
$$;

-- Manually update the existing user to admin role
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');