import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import ScreenshotAnalyser from '@/components/ScreenshotAnalyser';
import AIResultsDisplay from '@/components/AIResultsDisplay';
import PaywallModal from '@/components/PaywallModal';
import ReferralPanel from '@/components/ReferralPanel';
import { Crown, LogOut, Loader2, Trophy, UserRound, Zap, CreditCard, AlertTriangle, X } from 'lucide-react';

type View = 'analyse' | 'results' | 'profile';

const STRIPE_PORTAL_LINK = 'https://billing.stripe.com/p/login/8x27sMbYh7jHfcmcTxdQQ00';

export default function Dashboard() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [view, setView] = useState<View>('analyse');
  const [showPaywall, setShowPaywall] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isPremium = profile?.is_premium ?? false;
  const firstName = profile?.email?.split('@')[0] ?? 'manager';

  async function deleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.session?.access_token ?? ''}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });
      if (!response.ok) throw new Error('Account deletion could not be completed.');
      await supabase.auth.signOut();
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'landing' }));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Account deletion could not be completed.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  function navigateHome() {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'landing' }));
  }

  function handleCancelSubscription() {
    window.open(STRIPE_PORTAL_LINK, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Your Account?</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                This action is permanent and cannot be undone. All your data including your analysis history and subscription will be deleted immediately.
              </p>
              {deleteError && (
                <p className="text-red-300 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 w-full">
                  {deleteError}
                </p>
              )}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={navigateHome} className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-white font-bold text-lg">FPL <span className="text-emerald-400">AI</span></span>
              <p className="text-[10px] text-slate-500">{isPremium ? 'PRO MEMBER' : 'FREE PLAN'}</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPaywall(true)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isPremium ? 'hidden' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'}`}
            >
              <Crown className="w-4 h-4 inline mr-1" />Upgrade
            </button>
            <button onClick={signOut} className="p-2 text-slate-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.18em]">Gameweek advantage</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}
            </h1>
            <p className="text-slate-400 mt-2">Your next edge is one screenshot away.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 bg-slate-900/60 border border-slate-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setView('analyse')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'analyse' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            <Zap className="w-4 h-4 inline mr-1" />Analyse Team
          </button>
          <button
            onClick={() => setView('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'profile' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            <UserRound className="w-4 h-4 inline mr-1" />Profile
          </button>
        </div>

        {view === 'analyse' && (
          <ScreenshotAnalyser isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
        )}
        {view === 'results' && (
          <AIResultsDisplay response="Upload a screenshot to start your analysis." isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
        )}
        {view === 'profile' && (
          <div className="space-y-5">
            <ReferralPanel userId={user?.id ?? ''} isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} onProfileUpdate={refreshProfile} />

            {/* Subscription Management */}
            {isPremium && (
              <div className="bg-slate-900/70 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold">FPL AI Pro</h2>
                    <p className="text-amber-400 text-xs font-semibold">Active subscription</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-3 mb-4">
                  Manage your subscription, update payment details or cancel anytime. You will keep Pro access until the end of your current billing period.
                </p>
                <button
                  onClick={handleCancelSubscription}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all text-sm font-semibold"
                >
                  <CreditCard className="w-4 h-4" />
                  Manage Subscription
                </button>
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-slate-900/70 border border-red-500/20 rounded-2xl p-6">
              <h2 className="text-white font-bold">Danger zone</h2>
              <p className="text-slate-400 text-sm mt-2">
                Permanently remove your profile, saved teams and account access.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-4 px-4 py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-all text-sm font-semibold"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
