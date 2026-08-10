import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Crown, Copy, Check, Users, Gift, TrendingUp, Loader2 } from 'lucide-react';

interface Props {
  userId: string;
  isPremium: boolean;
  onUpgrade: () => void;
  onProfileUpdate: () => Promise<void>;
}

interface ReferralData {
  count: number;
  converted: number;
}

export default function ReferralPanel({ userId, isPremium, onUpgrade, onProfileUpdate }: Props) {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData>({ count: 0, converted: 0 });
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [convertMsg, setConvertMsg] = useState<string | null>(null);

  const referralLink = `https://fplaipro.netlify.app/ref/${userId}`;

  const fetchReferrals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('converted')
        .eq('referrer_id', userId);

      if (error) throw error;

      const referrals = data ?? [];
      setReferralData({
        count: referrals.length,
        converted: referrals.filter((r: { converted: boolean }) => r.converted).length,
      });
    } catch {
      setReferralData({ count: 0, converted: 0 });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Check if this user was referred and auto-convert when they become premium
  useEffect(() => {
    if (!userId || !isPremium) return;

    (async () => {
      setConverting(true);
      try {
        const { data: referral } = await supabase
          .from('referrals')
          .select('converted')
          .eq('referred_id', userId)
          .maybeSingle();

        if (referral && !referral.converted) {
          const { error } = await supabase.rpc('convert_referral', {
            p_referred_id: userId,
          });

          if (!error) {
            setConvertMsg('Welcome to Pro! Your referrer earned 30 free days.');
            await onProfileUpdate();
            await fetchReferrals();
          }
        }
      } catch {
        // Silently fail — referral conversion is best-effort
      } finally {
        setConverting(false);
        setTimeout(() => setConvertMsg(null), 5000);
      }
    })();
  }, [userId, isPremium, onProfileUpdate, fetchReferrals]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [referralLink]);

  const premiumUntil = profile?.premium_until ? new Date(profile.premium_until) : null;
  const daysLeft = premiumUntil
    ? Math.max(0, Math.ceil((premiumUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      {/* Account overview */}
      <div className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Account</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/40">
            <span className="text-slate-400 text-sm">Email</span>
            <span className="text-white text-sm font-medium">{profile?.email ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/40">
            <span className="text-slate-400 text-sm">Plan</span>
            <span className={`text-sm font-medium ${isPremium ? 'text-amber-400' : 'text-slate-300'}`}>
              {isPremium ? 'Pro' : 'Free'}
            </span>
          </div>
          {isPremium && premiumUntil && (
            <div className="flex justify-between items-center py-2 border-b border-slate-700/40">
              <span className="text-slate-400 text-sm">Premium expires</span>
              <span className="text-white text-sm font-medium">
                {premiumUntil.toLocaleDateString()} ({daysLeft} days left)
              </span>
            </div>
          )}
        </div>

        {!isPremium && (
          <button
            onClick={onUpgrade}
            className="mt-5 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Start 7-Day Free Trial
          </button>
        )}

        {convertMsg && (
          <p className="mt-3 text-sm text-emerald-400 text-center">{convertMsg}</p>
        )}
      </div>

      {/* Referral programme */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-slate-800/60 backdrop-blur rounded-2xl border border-emerald-500/20 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Gift className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Refer & Earn</h2>
            <p className="text-sm text-slate-400">Get 30 days of Pro free for every friend who upgrades</p>
          </div>
        </div>

        {/* Referral link */}
        <div className="mb-5">
          <label className="text-sm text-slate-400 mb-2 block">Your unique referral link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 rounded-xl p-4 text-center border border-slate-700/40">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500 mx-auto" />
            ) : (
              <>
                <Users className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{referralData.count}</p>
                <p className="text-xs text-slate-500">Total referrals</p>
              </>
            )}
          </div>
          <div className="bg-slate-900/40 rounded-xl p-4 text-center border border-slate-700/40">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500 mx-auto" />
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-400">{referralData.converted}</p>
                <p className="text-xs text-slate-500">Converted to Pro</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
          <Gift className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
          <p>
            When someone signs up via your link and upgrades to Pro, you automatically receive
            30 days of Pro free. Share your link with friends, family, and mini-league rivals!
          </p>
        </div>
      </div>
    </div>
  );
}
