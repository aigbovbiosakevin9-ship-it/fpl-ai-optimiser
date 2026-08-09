import { supabase } from '@/lib/supabase';
import type { Player } from '@/types';

const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000;

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

async function triggerSync(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-fpl-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      },
    );

    if (!response.ok) return false;
    const data = await response.json();
    return data.synced === true;
  } catch {
    return false;
  }
}

export async function fetchLivePlayers(accessToken: string): Promise<{
  players: Player[];
  synced: boolean;
}> {
  let synced = false;

  if (await needsSync()) {
    synced = await triggerSync(accessToken);
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
