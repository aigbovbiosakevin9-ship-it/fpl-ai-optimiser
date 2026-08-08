/*
# FPL Player Pool Seed Data

Populates the `players` table with a realistic pool of ~60 Premier League players
across all four positions (GK, DEF, MID, FWD), with realistic FPL-style stats:
price, total_points, form, points_per_game, and selected_by percentage.
Top performers are flagged with is_recommended = true.

This is reference data shared across all users — inserted once via service role.
*/

INSERT INTO players (name, team, position, price, total_points, form, points_per_game, selected_by, is_recommended) VALUES
-- === GOALKEEPERS ===
('Alisson', 'LIV', 'GK', 5.8, 165, 5.2, 4.8, 28.5, true),
('Ederson', 'MCI', 'GK', 5.5, 142, 4.5, 4.2, 12.0, false),
('Pope', 'NEW', 'GK', 5.3, 138, 4.8, 4.1, 8.5, false),
('Raya', 'ARS', 'GK', 5.5, 150, 5.0, 4.5, 18.2, true),
('Pickford', 'EVE', 'GK', 5.0, 120, 3.8, 3.5, 6.0, false),
('Onana', 'MUN', 'GK', 5.0, 95, 2.5, 2.8, 3.2, false),
('Flekken', 'BRE', 'GK', 4.8, 110, 4.0, 3.2, 4.5, false),
('Henderson', 'CRY', 'GK', 4.9, 105, 3.5, 3.0, 3.0, false),

-- === DEFENDERS ===
('Alexander-Arnold', 'LIV', 'DEF', 8.5, 185, 6.8, 5.5, 45.2, true),
('Saliba', 'ARS', 'DEF', 6.2, 150, 5.5, 4.8, 22.0, true),
('Van Dijk', 'LIV', 'DEF', 6.5, 160, 5.8, 5.0, 30.5, true),
('Walker', 'MCI', 'DEF', 5.5, 120, 4.2, 3.8, 8.0, false),
('Trippier', 'NEW', 'DEF', 6.0, 140, 5.0, 4.5, 15.0, true),
('Robertson', 'LIV', 'DEF', 6.0, 135, 4.8, 4.2, 10.5, false),
('Gvardiol', 'MCI', 'DEF', 5.8, 130, 4.5, 4.0, 12.0, false),
('Gabriel', 'ARS', 'DEF', 5.5, 125, 4.5, 3.8, 8.5, false),
('Cash', 'AVL', 'DEF', 5.2, 105, 4.0, 3.2, 5.0, false),
('Estupinan', 'BHA', 'DEF', 5.0, 100, 3.8, 3.0, 4.5, false),
('Doughty', 'LUT', 'DEF', 4.8, 95, 3.5, 2.8, 3.0, false),
('Konsa', 'AVL', 'DEF', 5.0, 90, 3.2, 2.5, 2.5, false),
('Scharr', 'WOL', 'DEF', 4.5, 85, 3.0, 2.5, 2.0, false),
('Botman', 'NEW', 'DEF', 5.2, 88, 3.5, 2.8, 3.5, false),
('White', 'ARS', 'DEF', 5.8, 115, 4.2, 3.5, 6.0, false),

-- === MIDFIELDERS ===
('Salah', 'LIV', 'MID', 13.0, 295, 9.5, 8.8, 58.5, true),
('Saka', 'ARS', 'MID', 9.5, 220, 7.5, 6.8, 42.0, true),
('Foden', 'MCI', 'MID', 9.0, 210, 7.2, 6.5, 35.0, true),
('Haaland', 'MCI', 'MID', 14.0, 280, 9.0, 8.2, 65.0, true),
('Son', 'TOT', 'MID', 10.0, 195, 6.8, 6.0, 28.0, true),
('Bowen', 'WHU', 'MID', 7.5, 165, 5.8, 5.0, 18.0, true),
('Gordon', 'NEW', 'MID', 7.0, 150, 5.5, 4.8, 15.0, true),
('Maddison', 'TOT', 'MID', 8.0, 145, 5.2, 4.5, 12.0, false),
('Eze', 'CRY', 'MID', 6.5, 130, 4.8, 4.0, 8.0, false),
('Olise', 'CRY', 'MID', 6.8, 125, 4.5, 3.8, 6.5, false),
('Mbeumo', 'BRE', 'MID', 6.5, 120, 4.5, 3.5, 5.0, false),
('Rashford', 'MUN', 'MID', 8.5, 140, 5.0, 4.2, 10.0, false),
('Mac Allister', 'LIV', 'MID', 6.0, 115, 4.2, 3.5, 5.5, false),
('Rice', 'ARS', 'MID', 6.5, 120, 4.5, 3.8, 7.0, false),
('Odegaard', 'ARS', 'MID', 8.5, 160, 5.8, 4.8, 14.0, false),
('Wataru', 'LIV', 'MID', 5.5, 95, 3.5, 2.8, 3.0, false),
('McNeil', 'EVE', 'MID', 5.8, 100, 3.8, 3.0, 4.0, false),
('Doughty', 'LUT', 'MID', 5.2, 90, 3.5, 2.8, 2.5, false),
('Gallagher', 'CHE', 'MID', 6.0, 105, 4.0, 3.2, 4.5, false),
('Neto', 'WOL', 'MID', 6.2, 110, 4.2, 3.5, 5.0, false),

-- === FORWARDS ===
('Haaland', 'MCI', 'FWD', 14.0, 280, 9.0, 8.2, 65.0, true),
('Watkins', 'AVL', 'FWD', 9.0, 195, 7.0, 6.0, 30.0, true),
('Isak', 'NEW', 'FWD', 8.5, 175, 6.5, 5.5, 22.0, true),
('Nunez', 'LIV', 'FWD', 7.5, 140, 5.0, 4.2, 12.0, false),
('Jesus', 'ARS', 'FWD', 7.5, 130, 4.8, 4.0, 8.0, false),
('Wilson', 'NEW', 'FWD', 7.0, 125, 4.5, 3.8, 6.0, false),
('Solanke', 'BOU', 'FWD', 6.5, 145, 5.5, 4.5, 10.0, true),
('Toney', 'BRE', 'FWD', 8.0, 135, 4.8, 4.0, 7.0, false),
('Muniz', 'FUL', 'FWD', 5.5, 95, 4.0, 3.0, 3.5, false),
('Wood', 'NFO', 'FWD', 5.8, 100, 4.2, 3.2, 4.0, false),
('Ferguson', 'BHA', 'FWD', 6.0, 90, 3.5, 2.8, 3.0, false),
('Broja', 'CHE', 'FWD', 5.5, 70, 2.5, 2.0, 1.5, false)
ON CONFLICT DO NOTHING;