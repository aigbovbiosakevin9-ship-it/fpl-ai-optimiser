import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FPL_API_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";
const SYNC_INTERVAL_HOURS = 24;

const POSITION_MAP: Record<number, string> = {
  1: "GK",
  2: "DEF",
  3: "MID",
  4: "FWD",
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Check if we need to sync (24-hour interval)
    const { data: settings } = await supabase
      .from("app_settings")
      .select("last_player_sync")
      .eq("id", 1)
      .maybeSingle();

    const lastSync = settings?.last_player_sync
      ? new Date(settings.last_player_sync)
      : null;
    const hoursSinceSync = lastSync
      ? (Date.now() - lastSync.getTime()) / (1000 * 60 * 60)
      : Infinity;

    if (hoursSinceSync < SYNC_INTERVAL_HOURS) {
      return new Response(
        JSON.stringify({
          synced: false,
          reason: "Recently synced",
          last_sync: lastSync?.toISOString(),
          hours_since_sync: Math.round(hoursSinceSync * 10) / 10,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch live data from FPL API
    const fplResponse = await fetch(FPL_API_URL, {
      headers: {
        "User-Agent": "FPL-AI-Optimiser/1.0",
        Accept: "application/json",
      },
    });

    if (!fplResponse.ok) {
      throw new Error(`FPL API returned ${fplResponse.status}`);
    }

    const fplData = await fplResponse.json();
    const elements: FplElement[] = fplData.elements ?? [];
    const teams: FplTeam[] = fplData.teams ?? [];

    // Build team lookup map
    const teamMap = new Map<number, string>();
    for (const team of teams) {
      teamMap.set(team.id, team.short_name);
    }

    // Map FPL elements to player rows
    const players = elements.map((el) => ({
      fpl_id: el.id,
      name: el.web_name,
      team: teamMap.get(el.team) ?? "UNK",
      position: POSITION_MAP[el.element_type] ?? "MID",
      price: el.now_cost / 10,
      form: parseFloat(el.form) || 0,
      total_points: el.total_points || 0,
      points_per_game: parseFloat(el.points_per_game) || 0,
      selected_by: parseFloat(el.selected_by_percent) || 0,
      is_recommended: false,
      last_synced: new Date().toISOString(),
    }));

    // Delete all existing players and re-insert (clean replacement)
    await supabase.from("players").delete().neq("fpl_id", -1);

    // Insert in batches of 500 (Supabase batch limit)
    const BATCH_SIZE = 500;
    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabase
        .from("players")
        .insert(batch);
      if (insertError) throw insertError;
    }

    // Update sync timestamp
    const syncTime = new Date().toISOString();
    await supabase
      .from("app_settings")
      .upsert({ id: 1, last_player_sync: syncTime }, { onConflict: "id" });

    return new Response(
      JSON.stringify({
        synced: true,
        players_count: players.length,
        last_sync: syncTime,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
        synced: false,
      }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
