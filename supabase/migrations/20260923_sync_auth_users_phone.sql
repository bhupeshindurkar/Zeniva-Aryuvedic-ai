-- Supabase Auth: Synchronize Phone Column from raw_user_meta_data
-- File: supabase/migrations/20260923_sync_auth_users_phone.sql

-- 1. Trigger function on auth.users to auto-populate phone column in E.164 format (+91XXXXXXXXXX)
CREATE OR REPLACE FUNCTION public.sync_user_phone_from_meta()
RETURNS TRIGGER AS $$
DECLARE
  v_phone text;
  v_clean text;
BEGIN
  -- If phone is empty or null, check raw_user_meta_data
  IF NEW.phone IS NULL OR NEW.phone = '' THEN
    v_phone := NEW.raw_user_meta_data->>'phone';
    IF v_phone IS NOT NULL AND v_phone <> '' THEN
      -- Extract digits
      v_clean := regexp_replace(v_phone, '\D', '', 'g');
      IF length(v_clean) = 10 THEN
        NEW.phone := '+91' || v_clean;
      ELSIF length(v_clean) = 12 AND v_clean LIKE '91%' THEN
        NEW.phone := '+' || v_clean;
      ELSIF length(v_clean) > 0 THEN
        NEW.phone := '+' || v_clean;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach trigger before insert or update on auth.users
DROP TRIGGER IF EXISTS trigger_sync_user_phone ON auth.users;
CREATE TRIGGER trigger_sync_user_phone
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_phone_from_meta();

-- 3. Backfill existing patient accounts in auth.users whose phone column is currently empty
UPDATE auth.users
SET phone = CASE
  WHEN length(regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')) = 10 
    THEN '+91' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
  WHEN length(regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')) = 12 AND regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g') LIKE '91%'
    THEN '+' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
  ELSE '+' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
END
WHERE (phone IS NULL OR phone = '')
  AND raw_user_meta_data->>'phone' IS NOT NULL
  AND raw_user_meta_data->>'phone' <> '';

-- 4. Also ensure public.profiles table has phone synchronized
UPDATE public.profiles p
SET phone = u.phone
FROM auth.users u
WHERE p.id = u.id
  AND (p.phone IS NULL OR p.phone = '')
  AND u.phone IS NOT NULL;
