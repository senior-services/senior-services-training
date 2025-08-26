-- Create the missing trigger to call handle_new_user when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Manually add the existing user to employees table since they missed the trigger
INSERT INTO public.employees (email, full_name)
VALUES ('jeri.vibe.test@gmail.com', 'Jeri')
ON CONFLICT (email) DO NOTHING;