import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileImage, Loader2, Sparkles, Trophy, Upload, Zap } from 'lucide-react';
import AIResultsDisplay from '@/components/AIResultsDisplay';

interface Props {
  isPremium: boolean;
  onUpgrade: () => void;
}

const analysisStages = ['Reading your squad', 'Analysing fixtures', 'Finding your hidden gem'];

export default function ScreenshotAnalyser({ isPremium, onUpgrade }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(nextFile: File | undefined) {
    if (!nextFile) return;
    if (!['image/jpeg', 'image/png'].includes(nextFile.type)) {
      setError('Please upload a JPG or PNG screenshot.');
      return;
    }
    if (nextFile.size > 10 * 1024 * 1024) {
      setError('Please choose an image smaller than 10MB.');
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setResponse(null);
    setError(null);
  }

  async function analyseTeam() {
    if (!file) {
      setError('Upload your FPL team screenshot first.');
      return;
    }
    setAnalysing(true);
    setError(null);
    setResponse(null);
    setStage(0);
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, analysisStages.length - 1)), 1800);
    try {
      const { data: sessionData } = await (await import('@/lib/supabase')).supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const image = await fileToBase64(file);
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyse-screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ image, mediaType: file.type }),
      });
      const body = await res.json().catch(() => ({})) as { response?: string; error?: string };
      if (!res.ok || typeof body.response !== 'string') throw new Error(body.error || 'Analysis could not be completed.');
      setResponse(body.response);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Analysis could not be completed.');
    } finally {
      window.clearInterval(timer);
      setAnalysing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em]">FPL AI Oracle</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Upload your team. Get your edge.</h2>
        <p className="text-slate-400 mt-2">No manual player selection. Just one screenshot.</p>
      </div>
      <div className="bg-slate-800/70 rounded-3xl border border-slate-700/60 p-5 sm:p-8 shadow-2xl">
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}
          className="min-h-[300px] rounded-2xl border-2 border-dashed border-slate-600 hover:border-emerald-400/70 bg-slate-950/60 flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all hover:bg-slate-950/80"
        >
          {preview ? (
            <img src={preview} alt="FPL team screenshot preview" className="max-h-56 max-w-full rounded-xl object-contain" />
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center mb-5">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Drop a screenshot of your FPL team</h3>
              <p className="text-slate-400 max-w-md mt-3 leading-relaxed">Our AI reads it and tells you the best captain pick, transfers and hidden gems in seconds</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
          <button type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-xl transition-all">
            <Upload className="w-4 h-4" /> Upload Screenshot
          </button>
          <p className="text-xs text-slate-500 mt-3">JPG or PNG · max 10MB</p>
        </div>
        <button onClick={analyseTeam} disabled={analysing} className="w-full mt-5 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-lg rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
          {analysing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
          {analysing ? 'Analysing your team...' : 'Analyse My Team'}
        </button>
        {analysing && <div className="mt-5 space-y-3"><div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${((stage + 1) / analysisStages.length) * 100}%` }} /></div><p className="text-center text-sm text-emerald-300 animate-pulse">{analysisStages[stage]}</p></div>}
        {error && <div className="mt-4 flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
        {file && !analysing && !error && <p className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="w-4 h-4" />{file.name} ready to analyse</p>}
      </div>
      {response && <div className="animate-[fadeIn_0.5s_ease-out]"><div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-amber-400" /><h3 className="text-xl font-bold text-white">Your FPL AI analysis</h3><FileImage className="w-4 h-4 text-slate-500 ml-auto" /></div><AIResultsDisplay response={response} isPremium={isPremium} onUpgrade={onUpgrade} /></div>}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') reject(new Error('Could not read the image.'));
      else resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
}
