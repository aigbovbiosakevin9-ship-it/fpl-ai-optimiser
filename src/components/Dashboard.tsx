import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import ScreenshotAnalyser from '@/components/ScreenshotAnalyser';
import AIResultsDisplay from '@/components/AIResultsDisplay';
import PaywallModal from '@/components/PaywallModal';
import ReferralPanel from '@/components/ReferralPanel';
import { Crown, LogOut, Loader2, Trophy, UserRound, Zap } from 'lucide-react';

type View = 'analyse' | 'results' | 'profile';

export default function Dashboard() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [view, setView] = useState<View>('analyse');
  const [showPaywall, setShowPaywall] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deadline, setDeadline] = useState({ days: 0, hours: 0, minutes: 0 });
  const isPremium = profile?.is_premium ?? false;
  const firstName = profile?.email?.split('@')[0] ?? 'manager';

  useEffect(() => {
    const updateCountdown = () => {
      const nextDeadline = new Date();
      nextDeadline.setUTCDate(nextDeadline.getUTCDate() + ((5 - nextDeadline.getUTCDay() + 7) % 7 || 7));
      nextDeadline.setUTCHours(18, 30, 0, 0);
      const remaining = Math.max(0, nextDeadline.getTime() - Date.now());
      const totalMinutes = Math.floor(remaining / 60000);
      setDeadline({ days: Math.floor(totalMinutes / 1440), hours: Math.floor((totalMinutes % 1440) / 60), minutes: totalMinutes % 60 });
    };
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 60000);
    return () => window.clearInterval(interval);
  }, []);

  async function deleteAccount() {
    if (!user?.id || !window.confirm('Delete your account and all saved FPL data permanently? This cannot be undone.')) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, { method: 'POST', headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}`, apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } });
      if (!response.ok) throw new Error('Account deletion could not be completed.');
      await supabase.auth.signOut();
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'landing' }));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Account deletion could not be completed.');
    } finally { setDeleting(false); }
  }

  function navigateHome() { window.dispatchEvent(new CustomEvent('navigate', { detail: 'landing' })); }

  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={navigateHome} className="flex items-center gap-3 text-left"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"><Trophy className="w-5 h-5 text-slate-950" /></div><div><span className="text-white font-bold text-lg">FPL <span className="text-emerald-400">AI</span></span><p className="text-[10px] text-slate-500">{isPremium ? 'PRO MEMBER' : 'FREE PLAN'}</p></div></button>
        <div className="flex items-center gap-2"><button onClick={() => setShowPaywall(true)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isPremium ? 'hidden' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'}`}><Crown className="w-4 h-4 inline mr-1" />Upgrade</button><button onClick={signOut} className="p-2 text-slate-400 hover:text-white"><LogOut className="w-5 h-5" /></button></div>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8"><div><p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.18em]">Gameweek advantage</p><h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}</h1><p className="text-slate-400 mt-2">Your next edge is one screenshot away.</p></div><div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-3"><div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase"><Zap className="w-4 h-4" /> Next deadline</div><p className="text-white font-bold mt-1">{deadline.days}d {deadline.hours}h {deadline.minutes}m</p></div></div>
      <div className="flex gap-2 mb-8 bg-slate-900/60 border border-slate-800 rounded-xl p-1 w-fit"><button onClick={() => setView('analyse')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'analyse' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Zap className="w-4 h-4 inline mr-1" />Analyse Team</button><button onClick={() => setView('profile')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'profile' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}><UserRound className="w-4 h-4 inline mr-1" />Profile</button></div>
      {view === 'analyse' && <ScreenshotAnalyser isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />}
      {view === 'results' && <AIResultsDisplay response="Upload a screenshot to start your analysis." isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />}
      {view === 'profile' && <div className="space-y-5"><ReferralPanel userId={user?.id ?? ''} isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} onProfileUpdate={refreshProfile} /><div className="bg-slate-900/70 border border-red-500/20 rounded-2xl p-6"><h2 className="text-white font-bold">Danger zone</h2><p className="text-slate-400 text-sm mt-2">Permanently remove your profile, saved teams and account access.</p><button onClick={deleteAccount} disabled={deleting} className="mt-4 px-4 py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50">{deleting ? <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> : null}{deleting ? 'Deleting account...' : 'Delete Account'}</button>{deleteError && <p className="text-red-300 text-sm mt-3">{deleteError}</p>}</div></div>}
    </main>{showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
  </div>;
}
