import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Crown, Check, X, Sparkles, TrendingUp, ArrowRight, Gift } from 'lucide-react';

const STRIPE_PRO_LINK = 'https://buy.stripe.com/8x27sMbYh7jHfcmcTxdQQ00';

interface Props {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: Props) {
  const { user } = useAuth();
  void user;

  const features = [
    { icon: Crown, title: 'Full Captain Picks', desc: 'Top 3 captain & vice-captain picks with AI reasoning' },
    { icon: ArrowRight, title: 'Transfer Suggestions', desc: 'AI-powered transfer recommendations with projected gains' },
    { icon: TrendingUp, title: 'Full Squad Predictions', desc: 'Predicted points for all 15 players, not just the top 3' },
    { icon: Sparkles, title: 'Confidence Scores', desc: 'AI confidence ratings for every recommendation' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-transparent p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-lg shadow-amber-500/30">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">FPL AI Pro</h2>
          <p className="text-slate-400 mt-1">Unlock the full power of AI optimisation</p>
        </div>

        {/* Features */}
        <div className="p-8 space-y-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">{f.title}</p>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
              <Check className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0 mt-2" />
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="p-8 pt-0">
          {/* Free trial badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">7 days free then £15/month</span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mb-5">
            Try Pro free for 7 days — cancel anytime
          </p>

          <a
            href={STRIPE_PRO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Start 7-Day Free Trial
          </a>
          <p className="text-center text-xs text-slate-600 mt-4">
            You'll be charged £15/month after your 7-day trial ends. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
