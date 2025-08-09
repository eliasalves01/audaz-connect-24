-- Insert admin profile for the logged in user
INSERT INTO public.profiles (user_id, role, created_at, updated_at)
VALUES ('cc9479c3-ff00-480a-98f1-fe5309b22312', 'admin', NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Also add the trigger for auto-creating profiles for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();