import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Player, Position } from '@/types';
import { Search, Plus, Check, X, Loader2, Users } from 'lucide-react';

const POSITION_ORDER: Position[] = ['GK', 'DEF', 'MID', 'FWD'];
const POSITION_LIMITS: Record<Position, number> = { GK: 2, DEF: 5, MID: 5, FWD: 3 };
const SQUAD_SIZE = 15;
const BUDGET = 100; // £100m
const MAX_PER_TEAM = 3;

interface Props {
  allPlayers: Player[];
  selectedIds: string[];
  onToggle: (playerId: string) => void;
  onSave: () => void;
  saving: boolean;
}

export default function TeamBuilder({ allPlayers, selectedIds, onToggle, onSave, saving }: Props) {
  const [search, setSearch] = useState('');
  const [filterPos, setFilterPos] = useState<Position | 'ALL'>('ALL');

  const selectedPlayers = useMemo(
    () => allPlayers.filter((p) => selectedIds.includes(p.id)),
    [allPlayers, selectedIds],
  );

  const totalCost = useMemo(
    () => selectedPlayers.reduce((sum, p) => sum + p.price, 0),
    [selectedPlayers],
  );

  const countByPos = useMemo(() => {
    const counts: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    selectedPlayers.forEach((p) => {
      counts[p.position]++;
    });
    return counts;
  }, [selectedPlayers]);

  const countByTeam = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedPlayers.forEach((p) => {
      counts[p.team] = (counts[p.team] || 0) + 1;
    });
    return counts;
  }, [selectedPlayers]);

  const filteredPlayers = useMemo(() => {
    return allPlayers
      .filter((p) => filterPos === 'ALL' || p.position === filterPos)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.team.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.total_points - a.total_points);
  }, [allPlayers, search, filterPos]);

  function canSelect(player: Player): { ok: boolean; reason?: string } {
    if (selectedIds.includes(player.id)) return { ok: true };
    if (selectedIds.length >= SQUAD_SIZE) return { ok: false, reason: 'Squad full' };
    if (countByPos[player.position] >= POSITION_LIMITS[player.position])
      return { ok: false, reason: `${player.position} limit reached` };
    if (totalCost + player.price > BUDGET) return { ok: false, reason: 'Over budget' };
    if ((countByTeam[player.team] || 0) >= MAX_PER_TEAM)
      return { ok: false, reason: `Max 3 from ${player.team}` };
    return { ok: true };
  }

  const budgetLeft = BUDGET - totalCost;
  const isComplete = selectedIds.length === SQUAD_SIZE;

  return (
    <div className="space-y-6">
      {/* Squad summary bar */}
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-semibold">
              {selectedIds.length}/{SQUAD_SIZE} players
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-slate-400">Budget left: </span>
              <span className={`font-semibold ${budgetLeft < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                £{budgetLeft.toFixed(1)}m
              </span>
            </div>
            <div>
              <span className="text-slate-400">Spent: </span>
              <span className="text-white font-semibold">£{totalCost.toFixed(1)}m</span>
            </div>
          </div>
        </div>

        {/* Position counts */}
        <div className="flex gap-2 mt-4">
          {POSITION_ORDER.map((pos) => (
            <div
              key={pos}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${
                countByPos[pos] === POSITION_LIMITS[pos]
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900/50 text-slate-400 border border-slate-700/50'
              }`}
            >
              {pos}: {countByPos[pos]}/{POSITION_LIMITS[pos]}
            </div>
          ))}
        </div>
      </div>

      {/* Selected players */}
      {selectedPlayers.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-5">
          <h3 className="text-white font-semibold mb-3">Your Squad</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {POSITION_ORDER.map((pos) =>
              selectedPlayers
                .filter((p) => p.position === pos)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">
                        {p.team} · £{p.price}m
                      </p>
                    </div>
                    <button
                      onClick={() => onToggle(p.id)}
                      className="ml-2 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )),
            )}
          </div>
          {isComplete && (
            <button
              onClick={onSave}
              disabled={saving}
              className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Squad'}
            </button>
          )}
        </div>
      )}

      {/* Player search & filter */}
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players or teams..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['ALL', ...POSITION_ORDER] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setFilterPos(pos)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filterPos === pos
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Player list */}
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredPlayers.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            const check = canSelect(p);
            return (
              <button
                key={p.id}
                onClick={() => check.ok && onToggle(p.id)}
                disabled={!check.ok && !isSelected}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                  isSelected
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : check.ok
                      ? 'bg-slate-900/30 border border-slate-700/40 hover:border-emerald-500/30 hover:bg-slate-900/60'
                      : 'bg-slate-900/20 border border-slate-800/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      p.position === 'GK'
                        ? 'bg-amber-500/20 text-amber-300'
                        : p.position === 'DEF'
                          ? 'bg-blue-500/20 text-blue-300'
                          : p.position === 'MID'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {p.position}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {p.team} · £{p.price}m · {p.total_points} pts · Form {p.form}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {isSelected ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : !check.ok ? (
                    <span className="text-xs text-slate-600">{check.reason}</span>
                  ) : (
                    <Plus className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </button>
            );
          })}
          {filteredPlayers.length === 0 && (
            <p className="text-center text-slate-500 py-8">No players found</p>
          )}
        </div>
      </div>
    </div>
  );
}
