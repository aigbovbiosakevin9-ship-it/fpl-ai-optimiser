import { useState, useEffect, type ComponentType } from 'react';
import {
  Trophy,
  Upload,
  Brain,
  Rocket,
  Star,
  Crown,
  Zap,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  TrendingUp,
  Search,
  Target,
  Calendar,
  Shield,
  Sparkles,
  Lock,
  Gift,
} from 'lucide-react';

const STRIPE_PRO_LINK = 'https://buy.stripe.com/8x27sMbYh7jHfcmcTxdQQ00';

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const navLinks = [
  { label: 'Home', id: 'hero' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Sign Up', id: 'signup' },
  { label: 'Login', id: 'login' },
];

const faqs = [
  {
    q: 'Does the AI actually work?',
    a: 'Yes, our AI analyses real FPL data including form, fixtures and ownership to give you a genuine edge. No tool can guarantee results but our AI gives you better information to make smarter decisions.',
  },
  {
    q: 'How often is data updated?',
    a: 'Player data is synced directly from the official FPL API every 24 hours so prices, form and points are always current.',
  },
  {
    q: 'Do I need FPL experience?',
    a: 'No. Whether you are a beginner or a veteran, our AI explains every recommendation so you understand the reasoning.',
  },
  {
    q: 'Is my squad data safe?',
    a: 'Yes. We use Supabase for secure data storage and never share your data with third parties.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel your Pro subscription anytime with no questions asked through your Stripe billing portal.',
  },
  {
    q: 'How long before I see results?',
    a: 'Most managers notice an improvement within 2 to 3 gameweeks of following the AI recommendations.',
  },
];

const steps = [
  {
    icon: Upload,
    title: 'Take a Screenshot',
    desc: 'Go to the official FPL website or app and take a screenshot of your team.',
    color: 'emerald',
  },
  {
    icon: Brain,
    title: 'Upload to FPL AI',
    desc: 'Drag and drop your screenshot into our analyser.',
    color: 'blue',
  },
  {
    icon: Rocket,
    title: 'Get Your Edge',
    desc: 'Receive AI captain picks, transfer advice and hidden gems instantly.',
    color: 'amber',
  },
];

const features = [
  {
    icon: Crown,
    title: 'AI Captain Picks',
    desc: 'Confidence-rated captain recommendations updated every gameweek.',
    color: 'emerald',
    bg: 'from-emerald-500/20 to-emerald-700/5',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: TrendingUp,
    title: 'Smart Transfers',
    desc: 'Know exactly who to buy and sell before prices change.',
    color: 'blue',
    bg: 'from-blue-500/20 to-blue-700/5',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Search,
    title: 'Hidden Gem Differentials',
    desc: 'Low ownership picks that separate you from your mini-league rivals.',
    color: 'purple',
    bg: 'from-purple-500/20 to-purple-700/5',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Zap,
    title: 'Chip Strategy',
    desc: 'Never waste a chip again with AI-timed wildcard and bench boost advice.',
    color: 'pink',
    bg: 'from-pink-500/20 to-pink-700/5',
    border: 'border-pink-500/30',
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
  },
];

const freeFeatures = [
  { text: 'Basic captain pick only', included: true },
  { text: '1 player analysis per week', included: true },
  { text: 'No transfer advice', included: false },
  { text: 'No hidden gem picks', included: false },
  { text: 'No chip strategy', included: false },
  { text: 'No points predictions', included: false },
];

const proFeatures = [
  { text: 'Top 3 captain picks with full reasoning', included: true },
  { text: 'Transfer recommendations with comparison tables', included: true },
  { text: 'Hidden gem differential pick', included: true },
  { text: 'Full points prediction per player', included: true },
  { text: 'Chip strategy advice', included: true },
  { text: 'Bench order and rotation warnings', included: true },
  { text: '3 gameweek fixture outlook', included: true },
];

function FaqItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/30 transition-colors"
      >
        <span className="text-white font-semibold text-sm sm:text-base">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

function SectionWrapper({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-4 sm:px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
        <Trophy className="w-5 h-5 text-slate-950" />
      </div>
      <span className="text-white font-bold text-lg tracking-tight">
        FPL <span className="text-emerald-400">AI</span>
      </span>
    </div>
  );
}

export default function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToId(link.id)}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
              >
                {link.label}
              </button>
            ))}
          </div>
          <button
            onClick={onEnterApp}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        {/* Background gradients */}
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8 animate-[fadeIn_0.6s_ease-out]">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-xs sm:text-sm font-medium">
              Powered by Claude AI by Anthropic
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            The #1 AI Analyst
            <br />
            To <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Dominate</span> Your FPL League
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Our AI analyses your squad, picks your captain and finds hidden gems — so you climb the ranks every single gameweek
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={onEnterApp}
              className="group w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToId('how-it-works')}
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-slate-700 hover:border-emerald-500/50 text-white font-semibold rounded-xl transition-all hover:bg-slate-800/50"
            >
              See How It Works
            </button>
          </div>

          {/* Stars + trust */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-amber-400 fill-amber-400"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <p className="text-slate-500 text-sm">Trusted by FPL managers across the UK</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-600" />
        </div>
      </section>

      {/* How It Works */}
      <SectionWrapper id="how-it-works" className="py-20 sm:py-28">
        <div className="text-center mb-14">
          <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Three steps between you and your AI advantage. No spreadsheets, no guesswork.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
              emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
              blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
              amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
            };
            const c = colorClasses[step.color];
            return (
              <div
                key={idx}
                className="relative group"
              >
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-slate-700 to-transparent z-0" />
                )}

                <div className={`relative z-10 bg-slate-900/60 backdrop-blur border ${c.border} rounded-2xl p-8 text-center transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 mb-5">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                  </div>
                  <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${c.bg} ${c.text} text-xs font-bold mb-4`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Everything You Need To Win
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four powerful AI tools working together to give you the edge over your mini-league rivals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-gradient-to-br ${f.bg} border ${f.border} rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-all" />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.iconBg} mb-5`}>
                      <Icon className={`w-6 h-6 ${f.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <SectionWrapper id="pricing" className="py-20 sm:py-28">
        <div className="text-center mb-14">
          <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
            Start Free. Upgrade When Ready.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            No hidden fees. Cancel anytime. The Pro plan pays for itself with one good transfer.
          </p>
        </div>

        <div id="signup" className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <p className="text-slate-500 text-sm">Get started with basic AI advice</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">£0</span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  {f.included ? (
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={f.included ? 'text-slate-300 text-sm' : 'text-slate-600 text-sm line-through'}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={onEnterApp}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Start For Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-amber-500/10 to-slate-900/60 border border-amber-500/30 rounded-2xl p-8 flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
                <Crown className="w-3.5 h-3.5" />
                Popular
              </span>
            </div>
            <div className="relative z-10 mb-6">
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-slate-400 text-sm">Unlock the full AI advantage</p>
            </div>
            <div className="relative z-10 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full mb-3">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-bold">7 days free</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">£15</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1 relative z-10">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-sm">{f.text}</span>
                </li>
              ))}
            </ul>
            <a
              href={STRIPE_PRO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 text-center flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Try Pro Free for 7 Days — then £15/month
            </a>
            <p className="relative z-10 text-center text-xs text-slate-500 mt-3">
              No charge for 7 days — cancel anytime
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4">
              Questions? Answered.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FaqItem
                key={idx}
                faq={faq}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <SectionWrapper className="py-16">
        <div className="relative bg-gradient-to-r from-emerald-600/20 via-emerald-700/10 to-slate-900 border border-emerald-500/20 rounded-3xl p-10 sm:p-14 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Stop Guessing. Start Winning.
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join FPL managers using AI to climb their leagues. Your rivals already have the edge — level the playing field.
            </p>
            <button
              onClick={onEnterApp}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/30 hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <footer id="login" className="border-t border-slate-800 px-4 sm:px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Left */}
            <div>
              <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'landing' }))}><Logo /></button>
              <p className="text-slate-400 text-sm mt-4 mb-2">
                AI-powered FPL advice every gameweek
              </p>
              <p className="text-slate-500 text-xs">
                Powered by Claude AI by Anthropic
              </p>
            </div>

            {/* Middle */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToId(link.id)}
                      className="text-slate-400 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'privacy' }))}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'terms' }))}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'blog' }))}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 space-y-3">
            <p className="text-slate-500 text-xs text-center">
              © 2026 FPL AI Optimiser. All rights reserved.
            </p>
            <p className="text-slate-600 text-[11px] text-center max-w-2xl mx-auto leading-relaxed">
              FPL AI Optimiser is not affiliated with the Premier League or the official Fantasy Premier League game.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
