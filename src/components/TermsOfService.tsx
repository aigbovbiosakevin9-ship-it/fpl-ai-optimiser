import { Trophy, ArrowLeft, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              FPL <span className="text-emerald-400">AI</span>
            </span>
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        <p className="text-slate-500 text-sm mb-8">Last updated: January 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Entertainment Purposes</h2>
            <p className="text-slate-400 leading-relaxed">
              FPL AI Optimiser is provided for entertainment purposes only. The service is
              designed to help Fantasy Premier League managers make more informed decisions
              using AI-powered analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">No Guaranteed Results</h2>
            <p className="text-slate-400 leading-relaxed">
              AI predictions and recommendations are based on statistical analysis of FPL data
              but are not guaranteed. Fantasy sports outcomes are inherently unpredictable. We
              provide information to help you make better decisions, but we cannot guarantee
              any specific results or league rankings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Subscription</h2>
            <p className="text-slate-400 leading-relaxed">
              The Pro plan costs £15 per month. New subscribers get a 7-day free trial — you will
              not be charged during the trial period. After the trial ends, Stripe automatically
              charges £15 per month until you cancel. You can cancel your subscription at any time
              with no questions asked through your Stripe billing portal. Cancellation takes
              effect at the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">No Affiliation</h2>
            <p className="text-slate-400 leading-relaxed">
              FPL AI Optimiser is not affiliated with, endorsed by, or sponsored by the Premier
              League or the official Fantasy Premier League game. All Premier League and FPL
              trademarks belong to their respective owners. We use publicly available FPL data
              to provide our analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Acceptable Use</h2>
            <p className="text-slate-400 leading-relaxed">
              You agree to use the service for personal, non-commercial purposes. You may not
              scrape, resell, or redistribute the AI analysis provided by the service. Accounts
              are for individual use only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Service Availability</h2>
            <p className="text-slate-400 leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted service.
              The service may be temporarily unavailable during maintenance or due to factors
              outside our control, such as FPL API outages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Changes to Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              We may update these terms from time to time. Continued use of the service after
              changes constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
