-- Phase 2: Database Policy Improvements
-- Ensure new employees can be created during signup process

-- Drop and recreate policy to allow authenticated users to create their own employee record
DROP POLICY IF EXISTS "Users can create their own employee record" ON public.employees;
CREATE POLICY "Users can create their own employee record"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (
  email = (auth.jwt() ->> 'email'::text)
);

-- Drop and recreate policy to ensure profiles can be created for new users
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Add indexes for performance (these support IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);