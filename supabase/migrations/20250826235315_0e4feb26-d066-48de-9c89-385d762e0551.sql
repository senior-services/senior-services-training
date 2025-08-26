-- Grant admin role to jeri.vibe.test@gmail.com
INSERT INTO public.user_roles (user_id, role) 
VALUES ('31a47c39-e524-4c24-a6eb-47362ab5a994', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;