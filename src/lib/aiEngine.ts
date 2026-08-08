import type {
  Player,
  CaptainPick,
  TransferSuggestion,
  PlayerPrediction,
  OptimizationResult,
} from '@/types';

// Weights for the prediction model
const WEIGHTS = {
  form: 0.35,
  pointsPerGame: 0.30,
  totalPoints: 0.15,
  selectedBy: 0.10,
  recommendation: 0.10,
};

// Fixture difficulty multiplier — in a real app this would come from the FPL API.
// Here we derive a pseudo fixture difficulty from the player's team to add variance.
const TEAM_FIXTURE_STRENGTH: Record<string, number> = {
  MCI: 1.25,
  LIV: 1.20,
  ARS: 1.18,
  TOT: 1.10,
  NEW: 1.08,
  AVL: 1.05,
  WHU: 1.02,
  CHE: 1.00,
  MUN: 0.98,
  BHA: 0.97,
  BRE: 0.95,
  FUL: 0.93,
  CRY: 0.90,
  EVE: 0.88,
  WOL: 0.85,
  NFO: 0.82,
  BOU: 0.80,
  LUT: 0.72,
};

function fixtureMultiplier(team: string): number {
  return TEAM_FIXTURE_STRENGTH[team] ?? 0.90;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Predicts points for a single player in the next gameweek.
 * The model blends form, points per game, total points, ownership,
 * and a fixture-difficulty multiplier to produce a predicted score.
 */
export function predictPlayerPoints(player: Player): number {
  const fixture = fixtureMultiplier(player.team);

  const formScore = player.form * fixture * 1.2;
  const ppgScore = player.points_per_game * fixture;
  const totalScore = (player.total_points / 38) * fixture;
  const ownershipScore = (player.selected_by / 10) * 0.3;
  const recBonus = player.is_recommended ? 1.5 : 0;

  const predicted =
    formScore * WEIGHTS.form +
    ppgScore * WEIGHTS.pointsPerGame +
    totalScore * WEIGHTS.totalPoints +
    ownershipScore * WEIGHTS.selectedBy +
    recBonus * WEIGHTS.recommendation;

  return round1(clamp(predicted, 0, 20));
}

function confidenceFor(player: Player): number {
  // Higher confidence for players with strong form and high ownership
  const formConf = clamp(player.form / 10, 0, 1);
  const ownershipConf = clamp(player.selected_by / 60, 0, 1);
  const ppgConf = clamp(player.points_per_game / 8, 0, 1);
  return Math.round(((formConf * 0.4) + (ownershipConf * 0.3) + (ppgConf * 0.3)) * 100);
}

function buildFactors(player: Player): string[] {
  const factors: string[] = [];
  if (player.form >= 7) factors.push('Outstanding recent form');
  else if (player.form >= 5) factors.push('Strong recent form');
  else if (player.form < 3) factors.push('Below-average form');

  if (player.points_per_game >= 6) factors.push('Elite points-per-game output');
  else if (player.points_per_game >= 4) factors.push('Solid points-per-game output');

  if (player.selected_by >= 40) factors.push('Highly owned by FPL managers');
  else if (player.selected_by >= 15) factors.push('Popular pick');

  if (player.is_recommended) factors.push('Flagged as AI top pick');

  const fixture = fixtureMultiplier(player.team);
  if (fixture >= 1.15) factors.push('Favourable upcoming fixture');
  else if (fixture <= 0.85) factors.push('Tough upcoming fixture');

  return factors.length > 0 ? factors : ['Limited data available'];
}

/**
 * Generate captain picks — the top 3 predicted point scorers from the squad.
 */
export function generateCaptainPicks(squad: Player[]): CaptainPick[] {
  const predictions = squad.map((p) => ({
    player: p,
    predictedPoints: predictPlayerPoints(p),
  }));

  const sorted = [...predictions].sort((a, b) => b.predictedPoints - a.predictedPoints);
  const top = sorted.slice(0, 3);

  return top.map((entry, idx) => {
    const confidence = confidenceFor(entry.player);
    const reasonParts: string[] = [];

    if (idx === 0) reasonParts.push('Highest predicted points in your squad');
    else if (idx === 1) reasonParts.push('Strong alternative captain option');
    else reasonParts.push('Vice-captain candidate');

    if (entry.player.form >= 7) reasonParts.push('in blistering form');
    if (entry.player.selected_by >= 40) reasonParts.push('widely owned by top managers');
    if (entry.player.is_recommended) reasonParts.push('flagged as an AI recommended pick');

    return {
      player: entry.player,
      predictedPoints: entry.predictedPoints,
      confidence,
      reasoning: reasonParts.join(', '),
    };
  });
}

/**
 * Generate transfer suggestions — compare each squad member against the best
 * alternative in the same position within a similar price bracket.
 */
export function generateTransferSuggestions(
  squad: Player[],
  allPlayers: Player[],
  freeTransfers: number,
): TransferSuggestion[] {
  const suggestions: TransferSuggestion[] = [];
  const squadIds = new Set(squad.map((p) => p.id));

  for (const member of squad) {
    // Find candidates in the same position, not already in squad, within ±1.5 price
    const candidates = allPlayers.filter(
      (p) =>
        p.id !== member.id &&
        !squadIds.has(p.id) &&
        p.position === member.position &&
        Math.abs(p.price - member.price) <= 1.5,
    );

    if (candidates.length === 0) continue;

    const memberPredicted = predictPlayerPoints(member);
    const bestCandidate = candidates
      .map((c) => ({ player: c, predicted: predictPlayerPoints(c) }))
      .sort((a, b) => b.predicted - a.predicted)[0];

    const gain = round1(bestCandidate.predicted - memberPredicted);

    if (gain > 0.5) {
      const reasonParts: string[] = [
        `+${gain} pts projected gain`,
      ];
      if (bestCandidate.player.form > member.form) reasonParts.push('better recent form');
      if (bestCandidate.player.points_per_game > member.points_per_game)
        reasonParts.push('higher points per game');
      if (bestCandidate.player.is_recommended) reasonParts.push('AI recommended pick');
      if (fixtureMultiplier(bestCandidate.player.team) > fixtureMultiplier(member.team))
        reasonParts.push('better upcoming fixture');

      suggestions.push({
        out: member,
        in: bestCandidate.player,
        netPointsGain: gain,
        reasoning: reasonParts.join(', '),
      });
    }
  }

  return suggestions
    .sort((a, b) => b.netPointsGain - a.netPointsGain)
    .slice(0, Math.max(1, freeTransfers));
}

/**
 * Generate per-player predictions for the whole squad.
 */
export function generatePredictions(squad: Player[]): PlayerPrediction[] {
  return squad
    .map((p) => ({
      player: p,
      predictedPoints: predictPlayerPoints(p),
      confidence: confidenceFor(p),
      factors: buildFactors(p),
    }))
    .sort((a, b) => b.predictedPoints - a.predictedPoints);
}

/**
 * Run the full optimization pipeline.
 */
export function runOptimization(
  squad: Player[],
  allPlayers: Player[],
  freeTransfers: number,
): OptimizationResult {
  const captainPicks = generateCaptainPicks(squad);
  const transferSuggestions = generateTransferSuggestions(squad, allPlayers, freeTransfers);
  const predictions = generatePredictions(squad);
  const totalPredictedPoints = round1(
    predictions.reduce((sum, p) => sum + p.predictedPoints, 0),
  );

  return {
    captainPicks,
    transferSuggestions,
    predictions,
    totalPredictedPoints,
    generatedAt: new Date().toISOString(),
  };
}
