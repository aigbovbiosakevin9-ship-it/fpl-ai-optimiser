import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Player } from '@/types';
import TeamBuilder from '@/components/TeamBuilder';
import AIResultsDisplay from '@/components/AIResultsDisplay';
import PaywallModal from '@/components/PaywallModal';
import { Trophy, Sparkles, Crown, LogOut, Loader2, Users, TrendingUp, AlertCircle } from 'lucide-react';

type View = 'team' | 'results';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [view, setView] = useState<View>('team');
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const isPremium = profile?.is_premium ?? false;

  // Load players + existing team
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: players }, { data: team }] = await Promise.all([
        supabase.from('players').select('*').order('total_points', { ascending: false }),
        supabase
          .from('user_teams')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle(),
      ]);

      if (players) setAllPlayers(players as Player[]);
      if (team) {
        setTeamId(team.id);
        const { data: tp } = await supabase
          .from('team_players')
          .select('player_id')
          .eq('team_id', team.id);
        if (tp) setSelectedIds(tp.map((t: { player_id: string }) => t.player_id));
      }
      setLoading(false);
    })();
  }, [user?.id]);

  const handleToggle = useCallback((playerId: string) => {
    setSelectedIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      let currentTeamId = teamId;

      if (!currentTeamId) {
        const { data: newTeam, error } = await supabase
          .from('user_teams')
          .insert({ user_id: user.id, name: 'My Team' })
          .select()
          .single();
        if (error) throw error;
        currentTeamId = newTeam.id;
        setTeamId(newTeam.id);
      } else {
        // Clear existing team_players
        await supabase.from('team_players').delete().eq('team_id', currentTeamId);
      }

      // Insert new team_players
      if (selectedIds.length > 0 && currentTeamId) {
        const rows = selectedIds.map((player_id, idx) => ({
          team_id: currentTeamId,
          player_id,
          is_starter: idx < 11,
          position_slot: idx,
        }));
        const { error: insertError } = await supabase
          .from('team_players')
          .insert(rows);
        if (insertError) throw insertError;
      }

      setView('results');
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }, [user?.id, teamId, selectedIds]);

  const handleOptimize = useCallback(async () => {
    if (selectedIds.length !== 15) return;
    setOptimizing(true);
    setAiError(null);
    setAiResponse(null);

    const squad = allPlayers.filter((p) => selectedIds.includes(p.id));
    const squadPayload = squad.map((p) => ({
      name: p.name,
      team: p.team,
      position: p.position,
      price: p.price,
      form: p.form,
      total_points: p.total_points,
      points_per_game: p.points_per_game,
    }));

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/optimise`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ squad: squadPayload }),
        },
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${response.status})`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (!data.response || typeof data.response !== 'string') {
        throw new Error('Unexpected response format from AI');
      }

      setAiResponse(data.response);
      setView('results');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to get AI analysis');
    } finally {
      setOptimizing(false);
    }
  }, [selectedIds, allPlayers]);

  const squadPlayers = useMemo(
    () => allPlayers.filter((p) => selectedIds.includes(p.id)),
    [allPlayers, selectedIds],
  );

  const squadValue = useMemo(
    () => squadPlayers.reduce((sum, p) => sum + p.price, 0),
    [squadPlayers],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">FPL AI Optimiser</h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                {isPremium ? (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Pro Member
                  </span>
                ) : (
                  'Free Plan'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex bg-slate-900/50 rounded-xl p-1 border border-slate-800/50">
              <button
                onClick={() => setView('team')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  view === 'team'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                My Team
              </button>
              <button
                onClick={() => setView('results')}
                disabled={selectedIds.length !== 15}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed ${
                  view === 'results'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                AI Results
              </button>
            </div>

            {!isPremium && (
              <button
                onClick={() => setShowPaywall(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Upgrade</span>
                <span className="sm:hidden">Pro</span>
              </button>
            )}

            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile tab switch */}
        <div className="flex sm:hidden gap-2 mb-6 bg-slate-900/50 rounded-xl p-1 border border-slate-800/50">
          <button
            onClick={() => setView('team')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'team' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            My Team
          </button>
          <button
            onClick={() => setView('results')}
            disabled={selectedIds.length !== 15}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 ${
              view === 'results' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            AI Results
          </button>
        </div>

        {view === 'team' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Build Your Squad</h2>
              <p className="text-slate-400 mt-1">
                Select 15 players within a £100m budget, then run the AI optimiser.
              </p>
            </div>
            <TeamBuilder
              allPlayers={allPlayers}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onSave={handleSave}
              saving={saving}
            />
            {selectedIds.length === 15 && (
              <div className="mt-6">
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI analysing your squad...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Optimise My Team
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">AI Optimisation</h2>
                <p className="text-slate-400 mt-1">
                  Squad value: £{squadValue.toFixed(1)}m · {squadPlayers.length} players
                </p>
              </div>
              {!aiResponse && !aiError && (
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center gap-2"
                >
                  {optimizing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {optimizing ? 'Analysing...' : 'Run AI Optimiser'}
                </button>
              )}
              {aiResponse && (
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 border border-slate-600/50"
                >
                  {optimizing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Re-run
                </button>
              )}
            </div>
            {optimizing ? (
              <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-300 font-medium mb-1">Claude AI is analysing your squad...</p>
                <p className="text-sm text-slate-500">
                  Reviewing form, fixtures, and ownership trends for your 15 players.
                </p>
              </div>
            ) : aiError ? (
              <div className="bg-red-500/10 backdrop-blur rounded-2xl border border-red-500/20 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-red-300 font-medium mb-1">AI Analysis Failed</p>
                <p className="text-sm text-red-400/70 mb-4">{aiError}</p>
                <button
                  onClick={handleOptimize}
                  className="px-5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium rounded-lg text-sm transition-all border border-red-500/30"
                >
                  Try Again
                </button>
              </div>
            ) : aiResponse ? (
              <AIResultsDisplay
                response={aiResponse}
                isPremium={isPremium}
                onUpgrade={() => setShowPaywall(true)}
              />
            ) : (
              <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-12 text-center">
                <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-300 font-medium mb-1">Ready to optimise</p>
                <p className="text-sm text-slate-500">
                  Click "Run AI Optimiser" and Claude AI will analyse your squad for captain
                  picks, transfer suggestions, players to avoid, and predicted points.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
