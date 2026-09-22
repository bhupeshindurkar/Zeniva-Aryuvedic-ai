-- Supabase Auth: Synchronize Phone Column from raw_user_meta_data (Deduplicated & Safe)
-- File: supabase/migrations/20260923_sync_auth_users_phone.sql

-- 1. Trigger function on auth.users with duplicate phone conflict protection
CREATE OR REPLACE FUNCTION public.sync_user_phone_from_meta()
RETURNS TRIGGER AS $$
DECLARE
  v_phone text;
  v_clean text;
  v_candidate text;
BEGIN
  -- If phone is empty or null, check raw_user_meta_data
  IF NEW.phone IS NULL OR NEW.phone = '' THEN
    v_phone := NEW.raw_user_meta_data->>'phone';
    IF v_phone IS NOT NULL AND v_phone <> '' THEN
      -- Extract digits only
      v_clean := regexp_replace(v_phone, '\D', '', 'g');
      IF length(v_clean) = 10 THEN
        v_candidate := '+91' || v_clean;
      ELSIF length(v_clean) = 12 AND v_clean LIKE '91%' THEN
        v_candidate := '+' || v_clean;
      ELSIF length(v_clean) > 0 THEN
        v_candidate := '+' || v_clean;
      END IF;

      -- Only assign if not already used by another user in auth.users (prevents 23505 duplicate key error)
      IF v_candidate IS NOT NULL THEN
        IF NOT EXISTS (
          SELECT 1 FROM auth.users 
          WHERE phone = v_candidate 
            AND id <> NEW.id
        ) THEN
          NEW.phone := v_candidate;
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing trigger if any, then create trigger on auth.users
DROP TRIGGER IF EXISTS trigger_sync_user_phone ON auth.users;
CREATE TRIGGER trigger_sync_user_phone
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_phone_from_meta();

-- 3. Safely backfill existing accounts without duplicate key violations
WITH ranked_users AS (
  SELECT 
    id,
    CASE
      WHEN length(regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')) = 10 
        THEN '+91' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
      WHEN length(regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')) = 12 AND regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g') LIKE '91%'
        THEN '+' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
      ELSE '+' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
    END AS candidate_phone,
    ROW_NUMBER() OVER (
      PARTITION BY 
        CASE
          WHEN length(regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')) = 10 
            THEN '+91' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
          WHEN length(regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')) = 12 AND regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g') LIKE '91%'
            THEN '+' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
          ELSE '+' || regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g')
        END
      ORDER BY created_at DESC
    ) AS rn
  FROM auth.users
  WHERE (phone IS NULL OR phone = '')
    AND raw_user_meta_data->>'phone' IS NOT NULL
    AND regexp_replace(raw_user_meta_data->>'phone', '\D', '', 'g') <> ''
)
UPDATE auth.users u
SET phone = r.candidate_phone
FROM ranked_users r
WHERE u.id = r.id
  AND r.rn = 1
  AND NOT EXISTS (
    SELECT 1 FROM auth.users existing 
    WHERE existing.phone = r.candidate_phone 
      AND existing.id <> u.id
  );

-- 4. Also ensure public.profiles table has phone synchronized
UPDATE public.profiles p
SET phone = u.phone
FROM auth.users u
WHERE p.id = u.id
  AND (p.phone IS NULL OR p.phone = '')
  AND u.phone IS NOT NULL;
