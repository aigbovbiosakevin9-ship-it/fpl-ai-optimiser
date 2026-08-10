-- ============================================================
-- 1. Allow authenticated users to write to players table
--    (frontend now syncs FPL data via Netlify proxy + direct insert)
-- ============================================================

DROP POLICY IF EXISTS "insert_players" ON players;
CREATE POLICY "insert_players" ON players FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_players" ON players;
CREATE POLICY "update_players" ON players FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_players" ON players;
CREATE POLICY "delete_players" ON players FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. Allow authenticated users to update app_settings sync timestamp
-- ============================================================

DROP POLICY IF EXISTS "insert_app_settings" ON app_settings;
CREATE POLICY "insert_app_settings" ON app_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_app_settings" ON app_settings;
CREATE POLICY "update_app_settings" ON app_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 3. Referrals table
-- ============================================================

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  converted boolean NOT NULL DEFAULT false,
  UNIQUE (referrer_id, referred_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_referrals" ON referrals;
CREATE POLICY "select_own_referrals" ON referrals FOR SELECT
  TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "insert_referral" ON referrals;
CREATE POLICY "insert_referral" ON referrals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = referred_id);

DROP POLICY IF EXISTS "update_referral" ON referrals;
CREATE POLICY "update_referral" ON referrals FOR UPDATE
  TO authenticated USING (auth.uid() = referred_id OR auth.uid() = referrer_id)
  WITH CHECK (auth.uid() = referred_id OR auth.uid() = referrer_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);

-- ============================================================
-- 4. SECURITY DEFINER function for referral conversion
--    (referred user triggers it; it updates the referrer's profile
--     which the referred user cannot do directly due to RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION convert_referral(p_referred_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_id uuid;
  v_current_premium_until timestamptz;
BEGIN
  SELECT referrer_id INTO v_referrer_id
  FROM referrals
  WHERE referred_id = p_referred_id AND converted = false;

  IF v_referrer_id IS NOT NULL THEN
    UPDATE referrals SET converted = true
    WHERE referred_id = p_referred_id AND converted = false;

    SELECT premium_until INTO v_current_premium_until
    FROM profiles WHERE id = v_referrer_id;

    IF v_current_premium_until IS NOT NULL AND v_current_premium_until > now() THEN
      UPDATE profiles SET premium_until = v_current_premium_until + interval '30 days'
      WHERE id = v_referrer_id;
    ELSE
      UPDATE profiles SET
        is_premium = true,
        premium_until = now() + interval '30 days'
      WHERE id = v_referrer_id;
    END IF;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION convert_referral(uuid) TO authenticated;