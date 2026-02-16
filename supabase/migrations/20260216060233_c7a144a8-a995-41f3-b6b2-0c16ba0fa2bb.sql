-- Allow all authenticated users to read all profiles (for leaderboard)
CREATE POLICY "Authenticated users can read all profiles"
ON public.profiles
FOR SELECT
USING (auth.role() = 'authenticated');
