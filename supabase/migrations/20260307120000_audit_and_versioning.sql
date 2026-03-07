-- =============================================================================
-- Compliance: Audit Logs, Video Versioning, and Attribution
-- =============================================================================

-- ─── 1. Audit Logs Table ────────────────────────────────────────────────────

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  user_id uuid, -- auth.uid() of the actor
  user_email text, -- denormalized for easy querying
  action_type text NOT NULL, -- 'created', 'updated', 'deleted', 'assigned', 'unassigned', 'archived', 'restored', 'login', 'logout'
  resource_type text NOT NULL, -- 'training', 'employee', 'assignment', 'quiz', 'quiz_version'
  resource_id text, -- UUID of the affected resource
  resource_title text, -- denormalized title for readability
  old_values jsonb, -- previous state (for updates)
  new_values jsonb, -- new state (for creates/updates)
  ip_address text, -- client IP if available
  user_agent text, -- browser user agent if available
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs (timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs (action_type);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can insert audit logs (their own actions)
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);


-- ─── 2. Video Versions Table ────────────────────────────────────────────────

CREATE TABLE public.video_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text,
  video_url text,
  video_file_name text,
  thumbnail_url text,
  content_type text,
  duration_seconds integer,
  changed_by uuid, -- auth.uid() of admin who triggered this version
  changed_by_email text, -- denormalized
  change_reason text, -- optional description of what changed
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_video_versions_video_id ON public.video_versions (video_id, version DESC);

ALTER TABLE public.video_versions ENABLE ROW LEVEL SECURITY;

-- Only admins can read video version history
CREATE POLICY "Admins can read video versions"
ON public.video_versions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can insert video versions (triggered by update flow)
CREATE POLICY "Authenticated users can insert video versions"
ON public.video_versions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);


-- ─── 3. Add created_by / updated_by to videos table ────────────────────────

ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS updated_by uuid,
  ADD COLUMN IF NOT EXISTS created_by_email text,
  ADD COLUMN IF NOT EXISTS updated_by_email text;


-- ─── 4. Auth Activity Table (login/logout tracking) ────────────────────────

CREATE TABLE public.auth_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_email text,
  event_type text NOT NULL, -- 'login', 'logout', 'token_refresh'
  provider text, -- 'google', 'email', etc.
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_activity_user ON public.auth_activity (user_id, created_at DESC);
CREATE INDEX idx_auth_activity_event ON public.auth_activity (event_type, created_at DESC);

ALTER TABLE public.auth_activity ENABLE ROW LEVEL SECURITY;

-- Admins can read all auth activity
CREATE POLICY "Admins can read auth activity"
ON public.auth_activity
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can insert their own auth activity
CREATE POLICY "Users can insert own auth activity"
ON public.auth_activity
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());


-- ─── 5. RPC: Snapshot video before update ───────────────────────────────────
-- Called before updating a video to preserve the current state

CREATE OR REPLACE FUNCTION public.snapshot_video_version(
  p_video_id uuid,
  p_changed_by uuid,
  p_changed_by_email text,
  p_change_reason text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current_version integer;
  v_video record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Get current max version for this video
  SELECT COALESCE(MAX(version), 0) INTO v_current_version
  FROM public.video_versions
  WHERE video_id = p_video_id;

  -- Get current video state
  SELECT * INTO v_video
  FROM public.videos
  WHERE id = p_video_id;

  IF v_video IS NULL THEN
    RAISE EXCEPTION 'Video not found';
  END IF;

  -- Insert snapshot of current state
  INSERT INTO public.video_versions (
    video_id, version, title, description, video_url,
    video_file_name, thumbnail_url, content_type, duration_seconds,
    changed_by, changed_by_email, change_reason
  ) VALUES (
    p_video_id, v_current_version + 1, v_video.title, v_video.description,
    v_video.video_url, v_video.video_file_name, v_video.thumbnail_url,
    v_video.content_type::text, v_video.duration_seconds,
    p_changed_by, p_changed_by_email, p_change_reason
  );

  -- Update the video's updated_by
  UPDATE public.videos
  SET updated_by = p_changed_by, updated_by_email = p_changed_by_email
  WHERE id = p_video_id;

  RETURN v_current_version + 1;
END;
$$;


-- ─── 6. RPC: Write audit log entry ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.write_audit_log(
  p_action_type text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_resource_title text DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_user_email text;
  v_log_id uuid;
BEGIN
  v_user_id := auth.uid();
  v_user_email := auth.jwt() ->> 'email';

  INSERT INTO public.audit_logs (
    user_id, user_email, action_type, resource_type,
    resource_id, resource_title, old_values, new_values,
    ip_address, user_agent
  ) VALUES (
    v_user_id, v_user_email, p_action_type, p_resource_type,
    p_resource_id, p_resource_title, p_old_values, p_new_values,
    p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;


-- ─── 7. RPC: Log auth activity ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.log_auth_activity(
  p_event_type text,
  p_provider text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN; -- silently skip if not authenticated
  END IF;

  INSERT INTO public.auth_activity (
    user_id, user_email, event_type, provider,
    ip_address, user_agent
  ) VALUES (
    auth.uid(),
    auth.jwt() ->> 'email',
    p_event_type,
    p_provider,
    p_ip_address,
    p_user_agent
  );
END;
$$;
