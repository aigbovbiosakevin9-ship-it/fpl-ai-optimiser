import { supabase } from '@/lib/supabase';
import type { Player } from '@/types';

const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000;
const FPL_PROXY_URL = 'https://fplaipro.netlify.app/.netlify/functions/fpl-proxy';

const POSITION_MAP: Record<number, string> = {
  1: 'GK',
  2: 'DEF',
  3: 'MID',
  4: 'FWD',
};

interface FplElement {
  id: number;
  web_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  form: string;
  total_points: number;
  points_per_game: string;
  selected_by_percent: string;
}

interface FplTeam {
  id: number;
  short_name: string;
}

async function needsSync(): Promise<boolean> {
  const { data } = await supabase
    .from('app_settings')
    .select('last_player_sync')
    .eq('id', 1)
    .maybeSingle();

  if (!data?.last_player_sync) return true;

  const lastSync = new Date(data.last_player_sync).getTime();
  return Date.now() - lastSync > SYNC_INTERVAL_MS;
}

async function syncFromFpl(): Promise<{ synced: boolean; count: number }> {
  try {
    const response = await fetch(FPL_PROXY_URL);

    if (!response.ok) {
      return { synced: false, count: 0 };
    }

    const fplData = await response.json();
    const elements: FplElement[] = fplData.elements ?? [];
    const teams: FplTeam[] = fplData.teams ?? [];

    if (elements.length === 0) {
      return { synced: false, count: 0 };
    }

    const teamMap = new Map<number, string>();
    for (const team of teams) {
      teamMap.set(team.id, team.short_name);
    }

    const players = elements.map((el) => ({
      fpl_id: el.id,
      name: el.web_name,
      team: teamMap.get(el.team) ?? 'UNK',
      position: POSITION_MAP[el.element_type] ?? 'MID',
      price: el.now_cost / 10,
      form: parseFloat(el.form) || 0,
      total_points: el.total_points || 0,
      points_per_game: parseFloat(el.points_per_game) || 0,
      selected_by: parseFloat(el.selected_by_percent) || 0,
      is_recommended: false,
      last_synced: new Date().toISOString(),
    }));

    // Delete all existing players and re-insert
    await supabase.from('players').delete().neq('fpl_id', -1);

    // Insert in batches of 500
    const BATCH_SIZE = 500;
    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabase.from('players').insert(batch);
      if (insertError) {
        console.error('Insert error:', insertError);
        return { synced: false, count: 0 };
      }
    }

    // Update sync timestamp
    const syncTime = new Date().toISOString();
    await supabase
      .from('app_settings')
      .upsert({ id: 1, last_player_sync: syncTime }, { onConflict: 'id' });

    return { synced: true, count: players.length };
  } catch (err) {
    console.error('Sync error:', err);
    return { synced: false, count: 0 };
  }
}

export async function fetchLivePlayers(): Promise<{
  players: Player[];
  synced: boolean;
}> {
  let synced = false;

  if (await needsSync()) {
    const result = await syncFromFpl();
    synced = result.synced;
  }

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('total_points', { ascending: false });

  if (error || !data || data.length === 0) {
    return { players: [], synced };
  }

  return { players: data as Player[], synced };
}

export async function manualSync(): Promise<{ synced: boolean; count: number; message: string }> {
  const result = await syncFromFpl();
  if (result.synced) {
    return { synced: true, count: result.count, message: `Synced ${result.count} players from FPL` };
  }
  return { synced: false, count: 0, message: 'Sync failed — using cached data' };
}
