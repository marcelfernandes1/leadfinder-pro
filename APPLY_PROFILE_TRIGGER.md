# Apply Profile Creation Trigger

This trigger will automatically create a profile in the `profiles` table whenever a new user signs up.

## Method 1: Via Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on your project
3. Go to **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy and paste the following SQL:

```sql
-- Create a function that automatically creates a profile when a new user signs up
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

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

6. Click **"Run"** or press `Cmd+Enter`
7. You should see "Success. No rows returned"

## Method 2: Via Supabase CLI

```bash
cd supabase
supabase db push
```

## Verify It's Working

After applying the trigger:

1. **Test with a new user:**
   - Sign up with a new email address
   - Go to Supabase Dashboard → **Table Editor** → `profiles`
   - You should see a new row with your user's email

2. **Check existing users:**
   - If you have users without profiles, you need to create them manually:

```sql
-- Run this in Supabase SQL Editor to create profiles for existing users
INSERT INTO public.profiles (id, email, subscription_tier, leads_used_this_month, billing_cycle_start)
SELECT
  id,
  email,
  'free'::text,
  0,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

## What This Does

- **Automatic Profile Creation:** Every time a user signs up via `supabase.auth.signUp()`, a profile is automatically created
- **Default Values:**
  - `subscription_tier`: 'free'
  - `leads_used_this_month`: 0
  - `billing_cycle_start`: current timestamp
- **No Code Changes Needed:** Works with your existing signup flow

## Troubleshooting

### "permission denied for table profiles"
Run this to fix permissions:
```sql
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
```

### "function handle_new_user() does not exist"
Make sure you ran the function creation part first (the CREATE OR REPLACE FUNCTION block).

### Trigger not firing
1. Check if the trigger exists:
```sql
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

2. If it doesn't exist, recreate it by running the CREATE TRIGGER statement again.

## Next Steps

After applying this trigger:
1. Try signing up with a new account
2. The profile should be created automatically
3. You can now create searches without foreign key errors!
