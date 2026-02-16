
-- Add referral_code column
ALTER TABLE public.profiles ADD COLUMN referral_code TEXT UNIQUE;

-- Generate unique 6-character referral codes for existing users
UPDATE public.profiles
SET referral_code = UPPER(SUBSTR(MD5(id::text || now()::text), 1, 6))
WHERE referral_code IS NULL;

-- Make it NOT NULL with a default for new users
ALTER TABLE public.profiles ALTER COLUMN referral_code SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN referral_code SET DEFAULT UPPER(SUBSTR(MD5(gen_random_uuid()::text), 1, 6));

-- Update the handle_new_user function to generate referral code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Jagoan'),
    UPPER(SUBSTR(MD5(NEW.id::text || now()::text), 1, 6))
  );
  RETURN NEW;
END;
$function$;
