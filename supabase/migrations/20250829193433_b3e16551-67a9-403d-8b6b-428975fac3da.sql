-- Update promote_user_to_admin function to remove from employees table
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(p_user_id uuid, p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Normalize email
  p_email := lower(p_email);

  -- Remove any existing employee role
  DELETE FROM public.user_roles 
  WHERE user_id = p_user_id AND role = 'employee';

  -- Remove from employees table since they're becoming admin
  DELETE FROM public.employees 
  WHERE lower(email) = p_email;

  -- Grant admin role
  INSERT INTO public.user_roles(user_id, role)
  VALUES (p_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Remove from pending admins if present
  DELETE FROM public.pending_admins WHERE lower(email) = p_email;
END;
$function$;