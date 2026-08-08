import type { OptimizationResult } from '@/types';
import { Crown, ArrowRight, TrendingUp, Sparkles, Lock } from 'lucide-react';

interface Props {
  result: OptimizationResult;
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function OptimizationResults({ result, isPremium, onUpgrade }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 rounded-2xl border border-emerald-500/20 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">AI Optimisation Results</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Predicted total for next gameweek:{' '}
          <span className="text-emerald-400 font-bold text-lg">
            {result.totalPredictedPoints} pts
          </span>
        </p>
      </div>

      {/* Captain Picks — free preview (top 1) + premium (full 3) */}
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Captain Picks</h3>
        </div>

        <div className="space-y-3">
          {result.captainPicks.map((pick, idx) => {
            const locked = !isPremium && idx >= 1;
            return (
              <div
                key={pick.player.id}
                className={`relative rounded-xl border p-4 transition-all ${
                  locked
                    ? 'bg-slate-900/40 border-slate-700/50'
                    : idx === 0
                      ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-amber-500/30'
                      : 'bg-slate-900/50 border-slate-700/50'
                }`}
              >
                {locked && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 rounded-xl flex items-center justify-center z-10">
                    <button
                      onClick={onUpgrade}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/30"
                    >
                      <Lock className="w-4 h-4" />
                      Unlock with Pro
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      {idx === 0 ? 'C' : idx === 1 ? 'VC' : '3rd'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{pick.player.name}</p>
                      <p className="text-xs text-slate-400">
                        {pick.player.team} · {pick.player.position} · Form {pick.player.form}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">
                      {pick.predictedPoints}
                    </p>
                    <p className="text-xs text-slate-500">pred. pts</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-slate-400">{pick.reasoning}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        style={{ width: `${pick.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {pick.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transfer Suggestions — premium only */}
      <div className="relative bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Transfer Suggestions</h3>
        </div>

        {!isPremium ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 mb-4">
              <Lock className="w-7 h-7 text-blue-400" />
            </div>
            <p className="text-slate-300 font-medium mb-1">Pro Feature</p>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              Get AI-powered transfer recommendations that project net point gains based on
              form, fixtures and ownership trends.
            </p>
            <button
              onClick={onUpgrade}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/30"
            >
              Unlock Transfers
            </button>
          </div>
        ) : result.transferSuggestions.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No beneficial transfers found for your current squad. Your team is well-optimised!
          </p>
        ) : (
          <div className="space-y-3">
            {result.transferSuggestions.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                      OUT
                    </span>
                    <span className="text-white font-medium truncate">{s.out.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {s.out.team} · {s.out.position} · £{s.out.price}m
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      IN
                    </span>
                    <span className="text-white font-medium truncate">{s.in.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {s.in.team} · {s.in.position} · £{s.in.price}m
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-emerald-400">+{s.netPointsGain}</p>
                  <p className="text-xs text-slate-500">pts</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-500 mt-2">{s_transferReason(result)}</p>
          </div>
        )}
      </div>

      {/* Predicted Points — free preview (top 3) + premium (full squad) */}
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Predicted Points — Next Gameweek</h3>
        </div>

        <div className="space-y-2">
          {result.predictions.map((pred, idx) => {
            const locked = !isPremium && idx >= 3;
            return (
              <div
                key={pred.player.id}
                className={`relative flex items-center justify-between rounded-lg px-4 py-3 ${
                  locked
                    ? 'bg-slate-900/30 border border-slate-700/30'
                    : 'bg-slate-900/50 border border-slate-700/50'
                }`}
              >
                {locked && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 rounded-lg flex items-center justify-right justify-end pr-4 z-10">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                )}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-slate-500 w-5 text-right">{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {pred.player.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {pred.player.team} · {pred.player.position}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5">
                    {pred.factors.slice(0, 2).map((f, i) => (
                      <span
                        key={i}
                        className="text-xs text-slate-400 bg-slate-700/40 px-2 py-0.5 rounded"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-emerald-400 w-12 text-right">
                    {pred.predictedPoints}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {!isPremium && (
          <p className="text-center text-xs text-slate-500 mt-3">
            Showing top 3 predictions. <button onClick={onUpgrade} className="text-emerald-400 hover:text-emerald-300 font-medium">Upgrade to Pro</button> to see all 15.
          </p>
        )}
      </div>
    </div>
  );
}

function s_transferReason(result: OptimizationResult): string {
  if (result.transferSuggestions.length === 0) return '';
  return 'Suggestions ranked by projected net point gain over the next gameweek.';
}
