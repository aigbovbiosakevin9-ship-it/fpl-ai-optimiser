export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  team: string;
  position: Position;
  price: number;
  total_points: number;
  form: number;
  points_per_game: number;
  selected_by: number;
  is_recommended: boolean;
  created_at: string;
}

export interface UserTeam {
  id: string;
  user_id: string;
  name: string;
  captain_id: string | null;
  vice_captain_id: string | null;
  free_transfers: number;
  created_at: string;
  updated_at: string;
}

export interface TeamPlayer {
  id: string;
  team_id: string;
  player_id: string;
  is_starter: boolean;
  position_slot: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  is_premium: boolean;
  premium_until: string | null;
  created_at: string;
}

export interface CaptainPick {
  player: Player;
  predictedPoints: number;
  confidence: number;
  reasoning: string;
}

export interface TransferSuggestion {
  out: Player;
  in: Player;
  netPointsGain: number;
  reasoning: string;
}

export interface PlayerPrediction {
  player: Player;
  predictedPoints: number;
  confidence: number;
  factors: string[];
}

export interface OptimizationResult {
  captainPicks: CaptainPick[];
  transferSuggestions: TransferSuggestion[];
  predictions: PlayerPrediction[];
  totalPredictedPoints: number;
  generatedAt: string;
}
