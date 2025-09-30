-- Add test admin to pending_admins table
INSERT INTO public.pending_admins (email)
VALUES ('admin@southsoundseniors.org')
ON CONFLICT (email) DO NOTHING;