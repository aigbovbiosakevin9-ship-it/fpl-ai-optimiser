import { Trophy, ArrowLeft, Shield } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: Props) {
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
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Data We Collect</h2>
            <p className="text-slate-400 leading-relaxed">
              We collect your email address for the purpose of authentication and account
              management. When you upload your FPL team screenshot, we process it temporarily
              to provide AI analysis. We do not collect any personal data beyond what is
              necessary to run the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Data Storage</h2>
            <p className="text-slate-400 leading-relaxed">
              Your data is stored securely using Supabase, a PostgreSQL-based platform with
              row-level security enabled. Your profile is only accessible by you. We use
              industry-standard encryption for data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">We Never Sell Your Data</h2>
            <p className="text-slate-400 leading-relaxed">
              We do not sell, rent, or share your personal data with third parties. Your email
              address and data are used solely to provide the FPL AI Optimiser service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Account Deletion</h2>
            <p className="text-slate-400 leading-relaxed">
              You can delete your account at any time directly from your profile page. Upon
              deletion, all your personal data, including your email, profile, and analysis
              history, is permanently and immediately removed from our database. No action
              required from us — it happens instantly when you confirm deletion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Payment Data</h2>
            <p className="text-slate-400 leading-relaxed">
              Payment processing is handled by Stripe. We do not store your card details or
              payment information on our servers. Stripe manages all billing securely and
              independently. You can cancel your subscription at any time directly from your
              profile page — no need to contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Cookies</h2>
            <p className="text-slate-400 leading-relaxed">
              We use essential cookies to maintain your authentication session. We do not use
              tracking cookies or third-party advertising networks.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
