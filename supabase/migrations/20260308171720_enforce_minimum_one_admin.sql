-- Enforce that at least one active admin always exists.
-- "Active admin" = has admin role in user_roles AND is either not in
-- the employees table or has archived_at IS NULL in employees.

-- Helper: count active admins
CREATE OR REPLACE FUNCTION public.count_active_admins()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(*)::integer
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.profiles p ON p.email = e.email
      WHERE p.user_id = ur.user_id
        AND e.archived_at IS NOT NULL
    );
$$;


-- Trigger function: prevent removing the last admin role
CREATE OR REPLACE FUNCTION public.prevent_last_admin_role_removal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_remaining integer;
BEGIN
  -- Only care about admin role removals
  IF OLD.role != 'admin' THEN
    RETURN OLD;
  END IF;

  -- Count how many active admins will remain after this deletion
  SELECT count(*)::integer INTO v_remaining
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
    AND ur.id != OLD.id
    AND NOT EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.profiles p ON p.email = e.email
      WHERE p.user_id = ur.user_id
        AND e.archived_at IS NOT NULL
    );

  IF v_remaining < 1 THEN
    RAISE EXCEPTION 'Cannot remove the last active admin. At least one admin must remain.';
  END IF;

  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_prevent_last_admin_role_removal
  BEFORE DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_last_admin_role_removal();


-- Trigger function: prevent archiving the last admin employee
CREATE OR REPLACE FUNCTION public.prevent_last_admin_archive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_remaining integer;
BEGIN
  -- Only fire when archived_at is being set (was null, now not null)
  IF OLD.archived_at IS NOT NULL OR NEW.archived_at IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check if this employee is an admin via user_roles
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.user_id = ur.user_id
    WHERE p.email = NEW.email
      AND ur.role = 'admin'
  ) THEN
    RETURN NEW;
  END IF;

  -- Count active admins excluding this employee being archived
  SELECT count(*)::integer INTO v_remaining
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.profiles p ON p.email = e.email
      WHERE p.user_id = ur.user_id
        AND (
          e.archived_at IS NOT NULL
          OR e.id = NEW.id
        )
    );

  IF v_remaining < 1 THEN
    RAISE EXCEPTION 'Cannot archive the last active admin. At least one admin must remain.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_last_admin_archive
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_last_admin_archive();
