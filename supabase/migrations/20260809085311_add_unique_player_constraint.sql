-- Add unique constraint to prevent duplicate players
ALTER TABLE players ADD CONSTRAINT unique_player UNIQUE (name, team, position);
