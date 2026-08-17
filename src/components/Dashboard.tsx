import { useState } from "react";

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const Icon = ({ d, className = "w-5 h-5", fill = "none", strokeWidth = 2 }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const CrownIcon    = ({ className }) => <Icon className={className} d="M2 20h20M5 20V10l7-7 7 7v10" />;
const LogOutIcon   = ({ className }) => <Icon className={className} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const Loader2Icon  = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg>;
const TrophyIcon   = ({ className }) => <Icon className={className} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />;
const UserRoundIcon= ({ className }) => <Icon className={className} d="M18 20a6 6 0 0 0-12 0M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />;
const ZapIcon      = ({ className }) => <Icon className={className} d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />;
const CreditCardIcon=({ className }) => <Icon className={className} d="M2 10h20M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" />;
const AlertTriIcon = ({ className }) => <Icon className={className} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />;
const XIcon        = ({ className }) => <Icon className={className} d="M18 6 6 18M6 6l12 12" />;
const UploadIcon   = ({ className }) => <Icon className={className} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const CheckIcon    = ({ className }) => <Icon className={className} d="M20 6 9 17l-5-5" />;
const CopyIcon     = ({ className }) => <Icon className={className} d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.911 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866M10 21h8c1.105 0 2-.911 2-2.036V9.107c0-1.124-.895-2.036-2-2.036h-8c-1.104 0-2 .912-2 2.036V18.964C8 20.089 8.895 21 10 21Z" />;
const BoltIcon     = ({ className }) => <Icon className={className} fill="currentColor" strokeWidth={0} d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />;

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER    = { id: "user-123", email: "manager@fplai.com" };
const MOCK_PROFILE = { email: "manager@fplai.com", is_premium: false };
const STRIPE_LINK  = "https://billing.stripe.com/p/login/8x27sMbYh7jHfcmcTxdQQ00";

// ─── PaywallModal ─────────────────────────────────────────────────────────────
function PaywallModal({ onClose }) {
  const perks = [
    "Unlimited AI team analyses",
    "Captain & vice-captain picks",
    "Transfer recommendations",
    "Chip timing strategy",
    "Differential & mini-league edge",
  ];
  return (
    <div style={{ position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ position:"absolute",inset:0,background:"rgba(2,6,23,0.85)",backdropFilter:"blur(6px)" }} onClick={onClose} />
      <div style={{ position:"relative",zIndex:10,width:"100%",maxWidth:420,background:"#0f172a",border:"1px solid rgba(245,158,11,0.3)",borderRadius:20,padding:32,boxShadow:"0 25px 60px rgba(0,0,0,0.6)" }}>
        <button onClick={onClose} style={{ position:"absolute",top:16,right:16,color:"#64748b",background:"none",border:"none",cursor:"pointer" }}>
          <XIcon className="w-5 h-5" />
        </button>
        <div style={{ textAlign:"center",marginBottom:24 }}>
          <div style={{ width:56,height:56,borderRadius:16,background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
            <CrownIcon className="w-7 h-7" style={{ color:"#f59e0b" }} />
          </div>
          <h2 style={{ color:"#fff",fontSize:22,fontWeight:700,margin:"0 0 4px" }}>Upgrade to Pro</h2>
          <p style={{ color:"#64748b",fontSize:13,margin:0 }}>Unlock your full FPL edge</p>
        </div>
        <ul style={{ listStyle:"none",padding:0,margin:"0 0 24px",display:"flex",flexDirection:"column",gap:10 }}>
          {perks.map(p => (
            <li key={p} style={{ display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#cbd5e1" }}>
              <span style={{ width:20,height:20,borderRadius:"50%",background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <CheckIcon className="w-3 h-3" style={{ color:"#34d399" }} />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div style={{ textAlign:"center",marginBottom:16 }}>
          <span style={{ fontSize:30,fontWeight:800,color:"#fff" }}>£3.99</span>
          <span style={{ color:"#64748b",fontSize:13 }}> / month</span>
        </div>
        <button onClick={onClose}
          style={{ width:"100%",padding:"13px 0",borderRadius:12,background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#1a0a00",fontWeight:700,fontSize:14,border:"none",cursor:"pointer" }}>
          Start Pro — £3.99/mo
        </button>
        <p style={{ color:"#475569",fontSize:11,textAlign:"center",marginTop:10 }}>Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  );
}

// ─── AIResultsDisplay ─────────────────────────────────────────────────────────
function AIResultsDisplay({ result, isPremium, onUpgrade }) {
  if (!result) return null;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12,marginTop:16 }}>
      {/* Summary */}
      <div style={{ background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:14,padding:"16px 20px" }}>
        <p style={{ color:"#34d399",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0 0 6px" }}>AI Summary</p>
        <p style={{ color:"#e2e8f0",fontSize:14,lineHeight:1.6,margin:0 }}>{result.summary}</p>
      </div>
      {/* Transfers */}
      <div style={{ background:"rgba(15,23,42,0.6)",border:"1px solid rgba(51,65,85,0.8)",borderRadius:14,padding:"16px 20px" }}>
        <p style={{ color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0 0 12px" }}>Recommended Transfers</p>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {result.transfers.map((t,i) => (
            <div key={i} style={{ display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,background:"rgba(30,41,59,0.6)",borderRadius:10,padding:"10px 14px" }}>
              <span style={{ color:"#f87171",fontSize:13,fontWeight:600,textDecoration:"line-through",opacity:0.75,minWidth:130 }}>{t.out}</span>
              <span style={{ color:"#475569",fontSize:12 }}>→</span>
              <span style={{ color:"#4ade80",fontSize:13,fontWeight:700,minWidth:130 }}>{t.in}</span>
              <span style={{ color:"#64748b",fontSize:12,flex:1 }}>{t.reason}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Captain – gated */}
      <div style={{ background:"rgba(15,23,42,0.6)",border:"1px solid rgba(51,65,85,0.8)",borderRadius:14,padding:"16px 20px",position:"relative",overflow:"hidden" }}>
        <p style={{ color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",margin:"0 0 8px" }}>Captain & Chip Strategy</p>
        {isPremium ? (
          <>
            <p style={{ color:"#e2e8f0",fontSize:14,margin:"0 0 6px" }}><span style={{ color:"#fbbf24",fontWeight:700 }}>Captain:</span> {result.captain}</p>
            <p style={{ color:"#e2e8f0",fontSize:14,margin:0 }}><span style={{ color:"#a78bfa",fontWeight:700 }}>Chip tip:</span> {result.chip}</p>
          </>
        ) : (
          <div style={{ position:"relative" }}>
            <p style={{ color:"#e2e8f0",fontSize:14,filter:"blur(5px)",userSelect:"none",margin:0 }}>Captain: Cole Palmer — home vs Brentford, great form & set-piece threat. Save your Triple Captain for GW32.</p>
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <button onClick={onUpgrade} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,background:"#f59e0b",color:"#1a0a00",fontWeight:700,fontSize:12,border:"none",cursor:"pointer" }}>
                <CrownIcon className="w-3 h-3" /> Unlock with Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ScreenshotAnalyser — styled to match the reference screenshot ─────────────
function ScreenshotAnalyser({ isPremium, onUpgrade }) {
  const [dragging, setDragging]     = useState(false);
  const [image, setImage]           = useState(null);
  const [analysing, setAnalysing]   = useState(false);
  const [result, setResult]         = useState(null);
  const [usedCount, setUsedCount]   = useState(0);
  const FREE_LIMIT = 2;

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (!isPremium && usedCount >= FREE_LIMIT) { onUpgrade(); return; }
    setImage(URL.createObjectURL(file));
    setResult(null);
  }

  async function analyse() {
    if (!image) return;
    setAnalysing(true);
    await new Promise(r => setTimeout(r, 2200));
    setUsedCount(c => c + 1);
    setResult({
      summary: "Your squad has strong underlying stats but is over-reliant on City assets ahead of a tricky fixture run.",
      transfers: [
        { out:"Salah (MID)", in:"Palmer (MID)", reason:"Better fixture swing GW28–31" },
        { out:"Haaland (FWD)", in:"Watkins (FWD)", reason:"3 home games in next 4 GWs" },
      ],
      captain: "Cole Palmer — home vs Brentford, great form & set-piece threat.",
      chip: "Save your Triple Captain for the GW32 double gameweek.",
    });
    setAnalysing(false);
  }

  // ── outer card background matches the screenshot's dark panel
  return (
    <div style={{ maxWidth:680,margin:"0 auto",width:"100%" }}>
      {/* Header text above the card */}
      <div style={{ textAlign:"center",marginBottom:28 }}>
        <p style={{ color:"#34d399",fontSize:12,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 10px" }}>FPL AI ORACLE</p>
        <h1 style={{ color:"#fff",fontSize:"clamp(26px,5vw,40px)",fontWeight:800,margin:"0 0 10px",lineHeight:1.15 }}>
          Upload your team. Get your edge.
        </h1>
        <p style={{ color:"#94a3b8",fontSize:15,margin:0 }}>No manual player selection. Just one screenshot.</p>
      </div>

      {/* Outer panel */}
      <div style={{
        background:"rgba(15,23,42,0.85)",
        borderRadius:20,
        padding:12,
        boxShadow:"0 8px 40px rgba(0,0,0,0.45)",
        border:"1px solid rgba(51,65,85,0.6)",
      }}>
        {/* Dashed inner drop zone */}
        <div
          onClick={() => { if (!image) document.getElementById("fpl-inp").click(); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          style={{
            border:`2px dashed ${dragging ? "#34d399" : "rgba(51,65,85,0.9)"}`,
            borderRadius:14,
            padding: image ? 0 : "52px 24px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center",
            textAlign:"center",
            cursor: image ? "default" : "pointer",
            transition:"border-color 0.2s",
            background: dragging ? "rgba(52,211,153,0.04)" : "transparent",
            overflow:"hidden",
          }}
        >
          <input id="fpl-inp" type="file" accept="image/*" style={{ display:"none" }}
            onChange={e => handleFile(e.target.files[0])} />

          {!image ? (
            <>
              {/* Trophy icon in rounded square — matching the screenshot */}
              <div style={{
                width:64,height:64,borderRadius:16,
                background:"linear-gradient(135deg,#92400e,#78350f)",
                display:"flex",alignItems:"center",justifyContent:"center",
                marginBottom:20,
                boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
              }}>
                <TrophyIcon className="w-8 h-8" style={{ color:"#fbbf24" }} />
              </div>
              <h2 style={{ color:"#fff",fontSize:20,fontWeight:700,margin:"0 0 8px" }}>
                Drop a screenshot of your FPL team
              </h2>
              <p style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6,maxWidth:340,margin:"0 0 24px" }}>
                Our AI reads it and tells you the best captain pick, transfers and hidden gems in seconds
              </p>
              {/* Upload Screenshot button — dark pill */}
              <button
                onClick={e => { e.stopPropagation(); document.getElementById("fpl-inp").click(); }}
                style={{
                  display:"flex",alignItems:"center",gap:8,
                  padding:"11px 22px",borderRadius:10,
                  background:"rgba(30,41,59,0.9)",
                  border:"1px solid rgba(71,85,105,0.7)",
                  color:"#fff",fontSize:14,fontWeight:600,
                  cursor:"pointer",marginBottom:12,
                }}
              >
                <UploadIcon className="w-4 h-4" /> Upload Screenshot
              </button>
              <p style={{ color:"#475569",fontSize:12,margin:0 }}>JPG or PNG · max 10MB</p>
              {!isPremium && (
                <p style={{ color:"#f59e0b",fontSize:12,marginTop:10 }}>
                  {FREE_LIMIT - usedCount} free {FREE_LIMIT - usedCount === 1 ? "analysis" : "analyses"} remaining
                </p>
              )}
            </>
          ) : (
            <img src={image} alt="FPL screenshot"
              style={{ width:"100%",maxHeight:280,objectFit:"contain",borderRadius:10 }} />
          )}
        </div>

        {/* Analyse My Team — big green button */}
        <button
          onClick={image ? analyse : () => document.getElementById("fpl-inp").click()}
          disabled={analysing}
          style={{
            width:"100%",
            marginTop:10,
            padding:"16px 0",
            borderRadius:12,
            background: analysing
              ? "rgba(52,211,153,0.4)"
              : "linear-gradient(135deg,#22c55e,#16a34a)",
            color:"#052e16",
            fontSize:16,
            fontWeight:800,
            border:"none",
            cursor: analysing ? "default" : "pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            gap:8,
            boxShadow: analysing ? "none" : "0 4px 20px rgba(34,197,94,0.3)",
            transition:"all 0.2s",
            letterSpacing:"0.01em",
          }}
        >
          {analysing
            ? <><Loader2Icon className="w-5 h-5" style={{ animation:"spin 1s linear infinite" }} />Analysing…</>
            : <><BoltIcon className="w-5 h-5" />Analyse My Team</>
          }
        </button>
      </div>

      {/* Results below the card */}
      {result && <AIResultsDisplay result={result} isPremium={isPremium} onUpgrade={onUpgrade} />}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── ReferralPanel ────────────────────────────────────────────────────────────
function ReferralPanel({ userId, isPremium, onUpgrade }) {
  const [copied, setCopied] = useState(false);
  const link = `https://fplai.app/ref/${userId.slice(0, 8)}`;
  function copy() {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div style={{ background:"rgba(15,23,42,0.7)",border:"1px solid rgba(51,65,85,0.7)",borderRadius:18,padding:24 }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}>
        <div style={{ width:40,height:40,borderRadius:12,background:"rgba(52,211,153,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <TrophyIcon className="w-5 h-5" style={{ color:"#34d399" }} />
        </div>
        <div>
          <h2 style={{ color:"#fff",fontWeight:700,margin:0 }}>Refer a friend</h2>
          <p style={{ color:"#34d399",fontSize:12,margin:0 }}>Earn a free month of Pro for every referral</p>
        </div>
      </div>
      <p style={{ color:"#64748b",fontSize:14,margin:"12px 0 14px" }}>Share your link. When a friend subscribes, you both get a free month.</p>
      <div style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(30,41,59,0.7)",border:"1px solid rgba(51,65,85,0.7)",borderRadius:12,padding:"10px 16px" }}>
        <span style={{ color:"#cbd5e1",fontSize:13,flex:1,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{link}</span>
        <button onClick={copy} style={{ background:"none",border:"none",cursor:"pointer",color: copied ? "#34d399" : "#34d399",flexShrink:0 }}>
          {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
        </button>
      </div>
      {copied && <p style={{ color:"#34d399",fontSize:12,marginTop:8 }}>Link copied!</p>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const user = MOCK_USER;
  const [profile]           = useState(MOCK_PROFILE);
  const [view, setView]     = useState("analyse");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const isPremium = profile.is_premium;
  const firstName = profile.email?.split("@")[0] ?? "manager";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  async function deleteAccount() {
    setDeleting(true); setDeleteError(null);
    await new Promise(r => setTimeout(r, 1500));
    setDeleting(false); setShowDeleteModal(false);
    alert("Account deletion simulated. In production this calls your Supabase edge function.");
  }

  const S = {
    page:   { minHeight:"100vh", background:"linear-gradient(135deg,#020617 0%,#0f172a 55%,#052e16 100%)", fontFamily:"system-ui,sans-serif" },
    header: { position:"sticky",top:0,zIndex:40,background:"rgba(2,6,23,0.88)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(51,65,85,0.5)" },
    hInner: { maxWidth:1080,margin:"0 auto",padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between" },
    logo:   { display:"flex",alignItems:"center",gap:12 },
    logoBox:{ width:36,height:36,borderRadius:12,background:"linear-gradient(135deg,#34d399,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(52,211,153,0.25)" },
    main:   { maxWidth:1080,margin:"0 auto",padding:"40px 20px" },
    tabBar: { display:"inline-flex",gap:6,background:"rgba(15,23,42,0.7)",border:"1px solid rgba(51,65,85,0.6)",borderRadius:14,padding:4,marginBottom:32 },
  };

  function Tab({ id, Icon_, label }) {
    const active = view === id;
    return (
      <button onClick={() => setView(id)} style={{
        display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,border:"none",
        background: active ? "#22c55e" : "transparent",
        color: active ? "#052e16" : "#94a3b8",
        fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.15s",
      }}>
        <Icon_ className="w-4 h-4" />{label}
      </button>
    );
  }

  return (
    <div style={S.page}>
      {/* Delete modal */}
      {showDeleteModal && (
        <div style={{ position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
          <div style={{ position:"absolute",inset:0,background:"rgba(2,6,23,0.85)",backdropFilter:"blur(6px)" }} onClick={() => setShowDeleteModal(false)} />
          <div style={{ position:"relative",zIndex:10,width:"100%",maxWidth:420,background:"#0f172a",border:"1px solid rgba(239,68,68,0.3)",borderRadius:20,padding:32,boxShadow:"0 25px 60px rgba(0,0,0,0.6)" }}>
            <button onClick={() => setShowDeleteModal(false)} style={{ position:"absolute",top:16,right:16,background:"none",border:"none",color:"#64748b",cursor:"pointer" }}>
              <XIcon className="w-5 h-5" />
            </button>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center" }}>
              <div style={{ width:64,height:64,borderRadius:"50%",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20 }}>
                <AlertTriIcon className="w-8 h-8" style={{ color:"#f87171" }} />
              </div>
              <h2 style={{ color:"#fff",fontSize:20,fontWeight:700,margin:"0 0 10px" }}>Delete Your Account?</h2>
              <p style={{ color:"#64748b",fontSize:13,lineHeight:1.6,margin:"0 0 24px" }}>
                This action is permanent and cannot be undone. All your data including analysis history and subscription will be deleted immediately.
              </p>
              {deleteError && <p style={{ color:"#fca5a5",fontSize:13,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 12px",width:"100%",marginBottom:16 }}>{deleteError}</p>}
              <div style={{ display:"flex",gap:10,width:"100%" }}>
                <button onClick={() => setShowDeleteModal(false)} style={{ flex:1,padding:"10px 0",borderRadius:12,border:"1px solid rgba(71,85,105,0.7)",background:"none",color:"#94a3b8",fontWeight:600,fontSize:13,cursor:"pointer" }}>Cancel</button>
                <button onClick={deleteAccount} disabled={deleting} style={{ flex:1,padding:"10px 0",borderRadius:12,background:"#ef4444",color:"#fff",fontWeight:700,fontSize:13,border:"none",cursor:deleting?"default":"pointer",opacity:deleting?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                  {deleting && <Loader2Icon className="w-4 h-4" style={{ animation:"spin 1s linear infinite" }} />}
                  {deleting ? "Deleting…" : "Yes, Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={S.header}>
        <div style={S.hInner}>
          <div style={S.logo}>
            <div style={S.logoBox}><TrophyIcon className="w-5 h-5" style={{ color:"#052e16" }} /></div>
            <div>
              <span style={{ color:"#fff",fontWeight:800,fontSize:17 }}>FPL <span style={{ color:"#34d399" }}>AI</span></span>
              <p style={{ color:"#475569",fontSize:10,margin:0,lineHeight:1,letterSpacing:"0.08em",textTransform:"uppercase" }}>{isPremium ? "PRO MEMBER" : "FREE PLAN"}</p>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            {!isPremium && (
              <button onClick={() => setShowPaywall(true)} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,background:"#f59e0b",color:"#1a0a00",fontWeight:700,fontSize:13,border:"none",cursor:"pointer" }}>
                <CrownIcon className="w-4 h-4" /> Upgrade
              </button>
            )}
            <button onClick={() => alert("Sign out — connect Supabase for real auth")} style={{ padding:8,background:"none",border:"none",color:"#64748b",cursor:"pointer" }}>
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={S.main}>
        {/* Greeting — only shown on profile tab to keep analyse tab clean */}
        {view === "profile" && (
          <div style={{ marginBottom:28 }}>
            <p style={{ color:"#34d399",fontSize:12,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 6px" }}>Gameweek advantage</p>
            <h1 style={{ color:"#fff",fontSize:"clamp(24px,4vw,34px)",fontWeight:800,margin:"0 0 6px" }}>Good {greeting}, {firstName}</h1>
            <p style={{ color:"#64748b",fontSize:15,margin:0 }}>Your next edge is one screenshot away.</p>
          </div>
        )}

        {/* Tab bar */}
        <div style={S.tabBar}>
          <Tab id="analyse" Icon_={ZapIcon} label="Analyse Team" />
          <Tab id="profile" Icon_={UserRoundIcon} label="Profile" />
        </div>

        {/* Views */}
        {view === "analyse" && (
          <ScreenshotAnalyser isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
        )}

        {view === "profile" && (
          <div style={{ display:"flex",flexDirection:"column",gap:16,maxWidth:600 }}>
            <ReferralPanel userId={user.id} isPremium={isPremium} onUpgrade={() => setShowPaywall(true)} />
            {isPremium && (
              <div style={{ background:"rgba(15,23,42,0.7)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:18,padding:24 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}>
                  <div style={{ width:40,height:40,borderRadius:12,background:"rgba(245,158,11,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <CrownIcon className="w-5 h-5" style={{ color:"#f59e0b" }} />
                  </div>
                  <div>
                    <h2 style={{ color:"#fff",fontWeight:700,margin:0 }}>FPL AI Pro</h2>
                    <p style={{ color:"#f59e0b",fontSize:12,margin:0,fontWeight:600 }}>Active subscription</p>
                  </div>
                </div>
                <p style={{ color:"#64748b",fontSize:14,margin:"12px 0 16px",lineHeight:1.6 }}>
                  Manage your subscription, update payment details or cancel anytime. You keep Pro access until the end of your billing period.
                </p>
                <button onClick={() => window.open(STRIPE_LINK, "_blank")} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:12,border:"1px solid rgba(245,158,11,0.3)",background:"none",color:"#fbbf24",fontWeight:600,fontSize:13,cursor:"pointer" }}>
                  <CreditCardIcon className="w-4 h-4" /> Manage Subscription
                </button>
              </div>
            )}
            <div style={{ background:"rgba(15,23,42,0.7)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:18,padding:24 }}>
              <h2 style={{ color:"#fff",fontWeight:700,margin:"0 0 6px" }}>Danger zone</h2>
              <p style={{ color:"#64748b",fontSize:14,margin:"0 0 14px" }}>Permanently remove your profile, saved teams and account access.</p>
              <button onClick={() => setShowDeleteModal(true)} style={{ padding:"10px 18px",borderRadius:12,border:"1px solid rgba(239,68,68,0.4)",background:"none",color:"#f87171",fontWeight:600,fontSize:13,cursor:"pointer" }}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
