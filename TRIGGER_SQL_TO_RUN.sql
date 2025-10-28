-- COPY AND PASTE THIS INTO SUPABASE SQL EDITOR
-- Then click "Run" or press Cmd+Enter

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, leads_used_this_month, billing_cycle_start)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    0,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Create profiles for existing users (if any)
INSERT INTO public.profiles (id, email, subscription_tier, leads_used_this_month, billing_cycle_start)
SELECT
  id,
  email,
  'free'::text,
  0,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
