-- Phase 2: Database Policy Improvements
-- Ensure new employees can be created during signup process

-- Drop existing policy if it exists and recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create their own employee record" ON public.employees;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add policy to allow authenticated users to create their own employee record
CREATE POLICY "Users can create their own employee record"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (
  email = (auth.jwt() ->> 'email'::text)
);

-- Drop and recreate profiles insert policy
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);