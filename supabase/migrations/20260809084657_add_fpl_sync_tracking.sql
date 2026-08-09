-- Add fpl_id column to players for mapping to FPL API elements
-- and a last_synced timestamp for 24-hour refresh tracking.

ALTER TABLE players ADD COLUMN IF NOT EXISTS fpl_id integer;
ALTER TABLE players ADD COLUMN IF NOT EXISTS last_synced timestamptz;

-- Create an index on fpl_id for upsert lookups
CREATE INDEX IF NOT EXISTS idx_players_fpl_id ON players(fpl_id);

-- Allow the service role (used by edge functions) to do bulk upserts.
-- The existing RLS policy only allows SELECT for authenticated users.
-- Edge functions run with the service role key which bypasses RLS,
-- so no additional policy changes are needed.

-- Add a settings table to track the last global sync time
CREATE TABLE IF NOT EXISTS app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  last_player_sync timestamptz,
  CHECK (id = 1)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read the sync status
DROP POLICY IF EXISTS "read_app_settings" ON app_settings;
CREATE POLICY "read_app_settings" ON app_settings FOR SELECT
  TO authenticated USING (true);
