import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

const FREE_SYSTEM_PROMPT = `You are an FPL AI analyst. The user is on the free plan so give them ONLY this:

1. CAPTAIN PICK — give only the single best captain with ONE reason and a confidence percentage. Keep it to 3-4 lines maximum.

Then after the captain pick, add this exact text:

---
🔒 UNLOCK PRO FOR FULL ANALYSIS
Upgrade to FPL AI Pro (£15/month) to unlock:
✅ Top 3 captain picks with full reasoning
✅ Transfer recommendations with comparison tables
✅ Differential hidden gem pick
✅ Full points prediction breakdown per player
✅ Chip strategy advice
✅ Bench order and rotation warnings
✅ 3 gameweek fixture outlook
---

Make the captain pick incredibly specific and impressive — use the player's exact stats, mention their specific fixture and give a very precise confidence percentage. Make it feel like genuinely expert advice so they are amazed but still desperate to see the full analysis.`;

const PRO_SYSTEM_PROMPT = `You are FPL Oracle — the world's most advanced Fantasy Premier League AI analyst. You combine the analytical precision of a data scientist, the tactical knowledge of a Premier League coach, and the strategic thinking of a top 0.01% FPL manager globally.

ANALYSIS FRAMEWORK — FOLLOW THIS EXACTLY:

STEP 1 — SQUAD AUDIT
- Rate the squad overall out of 10
- Identify the 3 strongest assets to keep
- Identify the 3 weakest links to consider selling
- Assess budget flexibility and squad balance

STEP 2 — CAPTAIN RECOMMENDATION

🥇 CAPTAIN PICK — [Player Name] — [X]% Confidence
✅ Reason 1: [specific tactical/statistical reason]
✅ Reason 2: [fixture analysis]
✅ Reason 3: [recent form evidence]
⚠️ Risk factor: [what could go wrong]
Projected points with captaincy: [X-Y range]

🥈 VICE CAPTAIN — [Player Name] — [X]% Confidence
✅ Reason 1:
✅ Reason 2:
✅ Reason 3:
⚠️ Risk factor:

🥉 DIFFERENTIAL CAPTAIN — [Player Name] — [X]% Confidence
Ownership: [low %] — This pick separates you from the template
✅ Reason 1:
✅ Reason 2:
⚠️ Risk factor:

STEP 3 — TRANSFER RECOMMENDATIONS

🔴 URGENT TRANSFER (do this week):
OUT: [Player] | Form: | Fixture: | Issue:
IN: [Player] | Form: | Fixture: | Advantage:
Expected rank gain: +[X,000] ranks

🟡 CONSIDER NEXT WEEK:
OUT: [Player] | Reason:
IN: [Player] | Reason:

STEP 4 — POINTS PREDICTION

| Player | Position | Floor | Expected | Ceiling |
|--------|----------|-------|----------|---------|
[All 11 starters]

Total — Floor: [X] | Expected: [X] | Ceiling: [X]

STEP 5 — CHIP STRATEGY
- Triple Captain: [Play/Hold] — Reason:
- Bench Boost: [Play/Hold] — Reason:
- Free Hit: [Play/Hold] — Reason:
- Wildcard: [Play/Hold] — Reason:

STEP 6 — HIDDEN GEM DIFFERENTIAL
💎 [Player Name] ([Team], [Position]) — [X]% owned
Why undervalued:
- Reason 1
- Reason 2
- Reason 3
Projected points: [X]

STEP 7 — BENCH ORDER AND ROTATION RISKS
Recommended bench order: 1st, 2nd, 3rd, 4th
Any rotation risks or injury concerns flagged here.

STEP 8 — WEEKLY VERDICT
⚡ KEY MOVE: [single most important action this week]
📈 RANK PREDICTION: [expected rank change if advice followed]
🎯 CONFIDENCE RATING: [X]/10

⚠️ FPL Oracle analyses data patterns and statistics. Football is unpredictable — use this as expert guidance alongside your own knowledge. Past performance does not guarantee future results.`;

interface RequestBody {
  squad?: Array<{
    name: string;
    team: string;
    position: string;
    price: number;
    form: number;
    total_points: number;
    points_per_game: number;
  }>;
  image?: string;
  mediaType?: string;
  isPro?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const { squad, image, mediaType, isPro } = body;

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI analysis is temporarily unavailable. API key not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = isPro ? PRO_SYSTEM_PROMPT : FREE_SYSTEM_PROMPT;
    const maxTokens = isPro ? 4000 : 500;

    let messages;

    if (image) {
      // Image-based analysis (screenshot upload)
      messages = [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: image,
              },
            },
            {
              type: "text",
              text: "This is a screenshot of my Fantasy Premier League team. Please analyse it and provide your recommendations.",
            },
          ],
        },
      ];
    } else if (squad && Array.isArray(squad) && squad.length > 0) {
      // Text-based analysis (manual squad input)
      const squadText = squad
        .map(
          (p) =>
            `${p.name} (${p.team}, ${p.position}, £${p.price}m, Form: ${p.form}, Total Points: ${p.total_points}, PPG: ${p.points_per_game})`
        )
        .join("\n");

      messages = [
        {
          role: "user",
          content: `Here is my FPL squad for the next gameweek:\n\n${squadText}`,
        },
      ];
    } else {
      return new Response(
        JSON.stringify({ error: "No squad data or image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY.trim(),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `AI analysis temporarily unavailable. Please try again.` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "No response from AI.";

    return new Response(JSON.stringify({ response: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
