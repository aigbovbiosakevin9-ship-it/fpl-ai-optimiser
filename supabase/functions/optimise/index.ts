import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

const SYSTEM_PROMPT =
  "You are an expert FPL Fantasy Premier League analyst. Given the user's squad, provide: 1) Best captain pick with confidence percentage and reasoning 2) Top transfer recommendation — who to sell and who to buy and why 3) Players to avoid this gameweek with reasons 4) Predicted total points for the gameweek. Be specific, confident and data-driven.";

interface SquadPlayer {
  name: string;
  team: string;
  position: string;
  price: number;
  form: number;
  total_points: number;
  points_per_game: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { squad } = (await req.json()) as { squad: SquadPlayer[] };

    if (!squad || !Array.isArray(squad) || squad.length === 0) {
      return new Response(JSON.stringify({ error: "No squad data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const squadText = squad
      .map(
        (p) =>
          `${p.name} (${p.team}, ${p.position}, £${p.price}m, Form: ${p.form}, Total Points: ${p.total_points}, PPG: ${p.points_per_game})`,
      )
      .join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Here is my FPL squad for the next gameweek:\n\n${squadText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API error (${response.status}): ${errText}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "No response from AI.";

    return new Response(JSON.stringify({ response: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
