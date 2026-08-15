import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey" };
const freePrompt = `You are an FPL AI analyst. The user is on the free plan so give them ONLY this: 1. CAPTAIN PICK — give only the single best captain with ONE reason and a confidence percentage. Keep it to 3-4 lines maximum. Then after the captain pick, add this exact text: --- 🔒 UNLOCK PRO FOR FULL ANALYSIS Upgrade to FPL AI Pro (£15/month) to unlock: ✅ Top 3 captain picks with full reasoning ✅ Transfer recommendations with comparison tables ✅ Differential hidden gem pick ✅ Full points prediction breakdown per player ✅ Chip strategy advice ✅ Bench order and rotation warnings ✅ 3 gameweek fixture outlook --- Make the captain pick incredibly specific and impressive so they are amazed but still desperate to see the full analysis.`;
const proPrompt = `You are FPL Oracle — the world's most advanced Fantasy Premier League AI analyst. You combine the analytical precision of a data scientist, the tactical knowledge of a Premier League coach, and the strategic thinking of a top 0.01% FPL manager globally. This is a screenshot of a Fantasy Premier League team. Please identify all the players, their positions, prices and points from the image, then provide: 1) Best captain pick with confidence percentage and full reasoning 2) Vice captain recommendation 3) Differential captain pick under 10% ownership 4) Top transfer recommendation — who to sell and who to buy and why with comparison table 5) Players to avoid this gameweek with reasons 6) Predicted total points for all 11 starters with floor and ceiling 7) Chip strategy advice 8) Hidden gem differential pick under 10% ownership. Be specific, confident and data-driven.`;

function json(body: Record<string, string>, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "You must be signed in to analyse a team." }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = auth.replace(/^Bearer\s+/i, "");
    const { data: { user }, error: userError } = await admin.auth.getUser(token);
    if (userError || !user) return json({ error: "Your session has expired. Please sign in again." }, 401);
    const { data: profile } = await admin.from("profiles").select("is_premium").eq("id", user.id).maybeSingle();
    const { image, mediaType } = await req.json() as { image?: string; mediaType?: string };
    if (!image || !["image/jpeg", "image/png"].includes(mediaType ?? "")) return json({ error: "Please provide a JPG or PNG screenshot." }, 400);
    if (image.length > 14_000_000) return json({ error: "That screenshot is too large. Please use an image under 10MB." }, 400);
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) return json({ error: "AI analysis is temporarily unavailable." }, 503);
    const response = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: profile?.is_premium ? 2200 : 500, system: profile?.is_premium ? proPrompt : freePrompt, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mediaType, data: image } }, { type: "text", text: "Analyse this FPL team screenshot." }] }] }) });
    if (!response.ok) return json({ error: "The AI service could not complete the analysis. Please try again." }, 502);
    const data = await response.json() as { content?: Array<{ text?: string }> };
    return json({ response: data.content?.[0]?.text ?? "No analysis was returned." });
  } catch (error) {
    console.error("[analyse-screenshot] request failed", error);
    return json({ error: "Analysis could not be completed. Please try again." }, 500);
  }
});
