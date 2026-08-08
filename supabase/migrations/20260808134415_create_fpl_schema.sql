/*
# FPL AI Optimiser - Core Schema

## Overview
Creates the database schema for the FPL AI Optimiser app. Users sign in with email/password,
build their 15-player Fantasy Premier League squad, and get AI-powered captain picks,
transfer suggestions, and predicted points. A £15/month subscription (tracked in profiles)
unlocks premium features.

## New Tables

1. `profiles`
   - Extends auth.users with app-specific data.
   - `id` (uuid, PK, references auth.users) — one row per user.
   - `email` (text) — cached for convenience.
   - `is_premium` (boolean, default false) — whether the user has an active subscription.
   - `premium_until` (timestamptz, nullable) — when the subscription expires.
   - `created_at` (timestamptz).

2. `players`
   - The master pool of FPL players users can choose from.
   - `id` (uuid, PK).
   - `name` (text) — player display name.
   - `team` (text) — Premier League club short name (e.g. "MCI", "LIV").
   - `position` (text) — one of GK, DEF, MID, FWD.
   - `price` (numeric) — current FPL price in millions.
   - `total_points` (integer) — season points so far.
   - `form` (numeric) — recent form rating (0-10).
   - `points_per_game` (numeric) — average points per game.
   - `selected_by` (numeric) — percentage of FPL managers who own the player.
   - `is_recommended` (boolean) — flagged as a top pick by the AI engine.
   - `created_at` (timestamptz).

3. `user_teams`
   - A user's saved squad (one active team per user).
   - `id` (uuid, PK).
   - `user_id` (uuid, references auth.users, defaults to auth.uid()).
   - `name` (text) — team name chosen by the user.
   - `captain_id` (uuid, nullable) — currently set captain.
   - `vice_captain_id` (uuid, nullable) — currently set vice captain.
   - `free_transfers` (integer, default 1) — available free transfers.
   - `created_at` (timestamptz).
   - `updated_at` (timestamptz).

4. `team_players`
   - Junction table: which players are in which user team.
   - `id` (uuid, PK).
   - `team_id` (uuid, references user_teams ON DELETE CASCADE).
   - `player_id` (uuid, references players).
   - `is_starter` (boolean) — whether the player is in the starting XI.
   - `position_slot` (integer) — ordering within the team.
   - UNIQUE constraint on (team_id, player_id).

## Security (RLS)

- `profiles`: owner-scoped CRUD (authenticated, auth.uid() = id).
- `players`: readable by all authenticated users (shared reference data); writes are
  service-role only (no anon/authenticated INSERT/UPDATE/DELETE policies).
- `user_teams`: owner-scoped CRUD (auth.uid() = user_id).
- `team_players`: owner-scoped through parent — a user can only access rows whose
  team belongs to them (EXISTS check against user_teams).

## Notes

1. All owner columns default to auth.uid() so frontend inserts that omit the owner
   still satisfy WITH CHECK policies.
2. players is read-only from the client — the service role seeds and updates it.
3. updated_at on user_teams is set via a trigger to auto-refresh on UPDATE.
*/

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  is_premium boolean NOT NULL DEFAULT false,
  premium_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- players (shared reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text NOT NULL,
  position text NOT NULL CHECK (position IN ('GK','DEF','MID','FWD')),
  price numeric(5,1) NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  form numeric(4,1) NOT NULL DEFAULT 0,
  points_per_game numeric(4,1) NOT NULL DEFAULT 0,
  selected_by numeric(5,1) NOT NULL DEFAULT 0,
  is_recommended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_players" ON players;
CREATE POLICY "read_players" ON players FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- user_teams
-- ============================================================
CREATE TABLE IF NOT EXISTS user_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Team',
  captain_id uuid REFERENCES players(id) ON DELETE SET NULL,
  vice_captain_id uuid REFERENCES players(id) ON DELETE SET NULL,
  free_transfers integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_teams" ON user_teams;
CREATE POLICY "select_own_teams" ON user_teams FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_teams" ON user_teams;
CREATE POLICY "insert_own_teams" ON user_teams FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_teams" ON user_teams;
CREATE POLICY "update_own_teams" ON user_teams FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_teams" ON user_teams;
CREATE POLICY "delete_own_teams" ON user_teams FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Auto-update updated_at on user_teams
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_teams_updated_at ON user_teams;
CREATE TRIGGER user_teams_updated_at
  BEFORE UPDATE ON user_teams
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- team_players
-- ============================================================
CREATE TABLE IF NOT EXISTS team_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES user_teams(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_starter boolean NOT NULL DEFAULT true,
  position_slot integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, player_id)
);

ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_team_players" ON team_players;
CREATE POLICY "select_own_team_players" ON team_players FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_teams WHERE user_teams.id = team_players.team_id AND user_teams.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_team_players" ON team_players;
CREATE POLICY "insert_own_team_players" ON team_players FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_teams WHERE user_teams.id = team_players.team_id AND user_teams.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_team_players" ON team_players;
CREATE POLICY "update_own_team_players" ON team_players FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_teams WHERE user_teams.id = team_players.team_id AND user_teams.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM user_teams WHERE user_teams.id = team_players.team_id AND user_teams.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_team_players" ON team_players;
CREATE POLICY "delete_own_team_players" ON team_players FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM user_teams WHERE user_teams.id = team_players.team_id AND user_teams.user_id = auth.uid())
  );

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players(team_id);
CREATE INDEX IF NOT EXISTS idx_user_teams_user_id ON user_teams(user_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);