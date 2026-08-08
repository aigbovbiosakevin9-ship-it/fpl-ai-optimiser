import { useMemo } from 'react';
import { marked } from 'marked';
import { Crown, ArrowRight, AlertTriangle, TrendingUp, Lock, Sparkles } from 'lucide-react';
import type { ComponentType } from 'react';

interface Props {
  response: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

interface Section {
  title: string;
  content: string;
}

const SECTION_META: { icon: ComponentType<{ className?: string }>; color: string; bg: string; border: string }[] = [
  { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { icon: ArrowRight, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
];

function parseSections(text: string): Section[] {
  const lines = text.split('\n');
  const sections: Section[] = [];
  let currentTitle = '';
  let currentContent = '';
  let started = false;

  for (const line of lines) {
    const match = line.match(/^\s*(\d+[\)\.])\s*(.*)/);
    if (match) {
      if (started) {
        sections.push({ title: currentTitle, content: currentContent.trim() });
      }
      currentTitle = match[2].trim() || `Section ${match[1]}`;
      currentContent = '';
      started = true;
    } else if (started) {
      currentContent += line + '\n';
    }
  }
  if (started) {
    sections.push({ title: currentTitle, content: currentContent.trim() });
  }

  return sections.length > 0
    ? sections
    : [{ title: 'AI Analysis', content: text.trim() }];
}

marked.setOptions({
  breaks: true,
  gfm: true,
});

function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => {
    const raw = marked.parse(content, { async: false }) as string;
    return raw;
  }, [content]);

  return (
    <div
      className="ai-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function AIResultsDisplay({ response, isPremium, onUpgrade }: Props) {
  const sections = parseSections(response);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 rounded-2xl border border-emerald-500/20 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">AI Analysis Complete</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Powered by Claude AI — your squad has been analysed for the next gameweek.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section, idx) => {
        const meta = SECTION_META[idx % SECTION_META.length];
        const Icon = meta.icon;
        const locked = !isPremium && idx >= 1;

        return (
          <div
            key={idx}
            className={`relative bg-slate-800/60 backdrop-blur rounded-2xl border ${meta.border} p-6 overflow-hidden`}
          >
            {locked && (
              <div className="absolute inset-0 backdrop-blur-md bg-slate-900/70 rounded-2xl flex flex-col items-center justify-center z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-700/50 mb-4">
                  <Lock className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-200 font-medium mb-1">Pro Feature</p>
                <p className="text-sm text-slate-400 mb-4 text-center max-w-xs px-4">
                  Upgrade to unlock {section.title.toLowerCase()} and all AI recommendations.
                </p>
                <button
                  onClick={onUpgrade}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/30"
                >
                  Upgrade to Pro — £15/mo
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${meta.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
                <span className="text-xs text-slate-500">
                  Recommendation {idx + 1} of {sections.length}
                </span>
              </div>
            </div>

            <MarkdownContent content={section.content} />
          </div>
        );
      })}

      {/* Upgrade banner for free users */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-2xl border border-amber-500/20 p-5 text-center">
          <Crown className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-white font-medium mb-1">Unlock All AI Recommendations</p>
          <p className="text-sm text-slate-400 mb-4">
            Get full transfer suggestions, players to avoid, and predicted points — all powered by Claude AI.
          </p>
          <button
            onClick={onUpgrade}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/30"
          >
            Upgrade to Pro — £15/month
          </button>
        </div>
      )}
    </div>
  );
}
