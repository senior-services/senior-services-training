-- Create a function to automatically assign admin role to specific emails
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'admin@seniorservices.com',
    'manager@seniorservices.com'
    -- Add more admin emails here as needed
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

-- Create trigger to run after a user is created and their profile is set up
CREATE TRIGGER on_auth_user_admin_check
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.assign_admin_role();