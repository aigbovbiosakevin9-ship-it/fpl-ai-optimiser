import { Trophy, ArrowLeft, Shield } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              FPL <span className="text-emerald-400">AI</span>
            </span>
          </div>
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

        <p className="text-slate-500 text-sm mb-8">Last updated: January 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Data We Collect</h2>
            <p className="text-slate-400 leading-relaxed">
              We collect your email address for the purpose of authentication and account
              management. When you build your FPL squad, we store your selected players so we
              can provide AI analysis. We do not collect any personal data beyond what is
              necessary to run the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Data Storage</h2>
            <p className="text-slate-400 leading-relaxed">
              Your data is stored securely using Supabase, a PostgreSQL-based platform with
              row-level security enabled. Your squad data and profile are only accessible by
              you. We use industry-standard encryption for data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">We Never Sell Your Data</h2>
            <p className="text-slate-400 leading-relaxed">
              We do not sell, rent, or share your personal data with third parties. Your email
              address and squad data are used solely to provide the FPL AI Optimiser service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Account Deletion</h2>
            <p className="text-slate-400 leading-relaxed">
              You can delete your account at any time. Upon deletion, all your personal data,
              including your email, profile, and squad information, is permanently removed from
              our database. To delete your account, contact us and we will process the request
              promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Payment Data</h2>
            <p className="text-slate-400 leading-relaxed">
              Payment processing is handled by Stripe. We do not store your card details or
              payment information on our servers. Stripe manages all billing securely and
              independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Cookies</h2>
            <p className="text-slate-400 leading-relaxed">
              We use essential cookies to maintain your authentication session. We do not use
              tracking cookies or third-party advertising networks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-400">Contact</h2>
            <p className="text-slate-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through the
              links in our website footer.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
