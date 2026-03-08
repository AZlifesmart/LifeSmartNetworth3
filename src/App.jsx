import { createContext, useContext, useState, useEffect, useRef, useMemo } from "react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Home, Car, PiggyBank, TrendingUp, TrendingDown, Briefcase, Building2, Plus, ChevronLeft, Check, Lock, Trash2, Pencil, LayoutDashboard, Layers, Target, BookOpen, Star, User, X, Sparkles, Shield, AlertTriangle, RefreshCw, GitBranch, Bell, Calendar, ChevronRight, ArrowUp, ArrowDown } from "lucide-react"

/* ── TOKENS ─────────────────────────────────────────────────────────────── */
const T = {
  bg:"#080E1A", surface:"#0F1829", card:"#141E30", cardHover:"#1A2540",
  border:"#1E2D47", borderLight:"#263550",
  teal:"#0EA5A0", tealMid:"#14B8B2", tealDim:"rgba(14,165,160,0.10)", tealBorder:"rgba(14,165,160,0.30)",
  amber:"#F59E0B", amberDim:"rgba(245,158,11,0.10)", amberBorder:"rgba(245,158,11,0.28)",
  red:"#F87171", redDim:"rgba(248,113,113,0.10)", redBorder:"rgba(248,113,113,0.28)",
  purple:"#8B5CF6", purpleDim:"rgba(139,92,246,0.12)",
  green:"#22C55E", greenDim:"rgba(34,197,94,0.10)",
  blue:"#3B82F6",
  white:"#EFF6FF", muted:"#8898B0", subtle:"#3E5070", faint:"#1A2540",
}

/* ── GLOBAL CSS ─────────────────────────────────────────────────────────── */
const G = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: ${T.white}; -webkit-font-smoothing: antialiased; }
  input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.subtle}; border-radius: 6px; }
  @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  @keyframes confetti{ from{transform:translateY(-10px) rotate(0deg);opacity:1} to{transform:translateY(105vh) rotate(800deg);opacity:0} }
  @keyframes tealGlow{ 0%,100%{text-shadow:0 0 40px rgba(14,165,160,0.4)} 50%{text-shadow:0 0 80px rgba(14,165,160,0.7),0 0 140px rgba(14,165,160,0.2)} }
  @keyframes pulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.08)} }
  @keyframes barGrow { from{width:0} to{width:var(--bar-w)} }
  .fade-up { animation: fadeUp 0.35s ease-out both; }
  .scale-in{ animation: scaleIn 0.3s ease-out both; }
`

/* ── CALCULATIONS ───────────────────────────────────────────────────────── */
const DEFAULTS = {
  profile:{ name:"", age:null, onboardingComplete:false, points:0, streakWeeks:0, lastCheckIn:null, checkInFrequency:"monthly", nextCheckIn:null },
  assets:[], debts:[], income:{ primary:0, primarySource:"", additional:[] }, spending:{ monthly:0 },
  goals:[], history:[], completedLessons:[], badges:[],
}
const load = () => { try { const s=localStorage.getItem("ls_v1"); return s?{ ...DEFAULTS,...JSON.parse(s) }:DEFAULTS } catch{ return DEFAULTS } }

const fmt = v => { if(v==null||isNaN(v)) return "£0"; const a=Math.abs(Math.round(v)).toLocaleString("en-GB"); return v<0?`-£${a}`:`£${a}` }
const fmtK = v => { if(v==null||isNaN(v)) return "£0"; const a=Math.abs(v); return a>=1000?`£${(a/1000).toFixed(0)}k`:`£${Math.round(a)}` }

const calcTotals   = (assets,debts) => { const ta=assets.reduce((s,a)=>s+(a.value||0),0), td=debts.reduce((s,d)=>s+(d.balance||0),0); return { totalAssets:ta,totalDebts:td,netWorth:ta-td } }
const calcIncome   = (inc,assets)   => (inc.primary||0)+(inc.additional||[]).reduce((s,i)=>s+(i.amount||0),0)+assets.reduce((s,a)=>s+(a.monthlyIncome||0),0)
const calcSurplus  = (inc,assets,sp)=> calcIncome(inc,assets)-(sp.monthly||0)
const debtCatFrom  = c => ({primary_residence:"mortgage",other_property:"mortgage",vehicle:"car_loan",business:"business_loan"}[c]||"personal_loan")
const mockHistory  = (nw,ta,td) => { const out=[]; for(let i=5;i>=1;i--){ const j=1+(Math.random()*.04-.02),d=new Date(); d.setMonth(d.getMonth()-i); out.push({ date:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`, netWorth:Math.round(nw*j),totalAssets:Math.round(ta*j),totalDebts:Math.round(td*(2-j)) }) } return out }

// Asset buckets
const buckets = assets => ({
  safetyNet:     assets.filter(a=>a.category==="savings").reduce((s,a)=>s+(a.value||0),0),
  wealthBuilders:assets.filter(a=>["investments","pension","business"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0),
  lifeAssets:    assets.filter(a=>["primary_residence","other_property","vehicle","other"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0),
})

// Interest drag
const DEFAULT_RATES = { mortgage:3.5, credit_card:21.9, personal_loan:12, car_loan:8, student_loan:5.4, business_loan:8, other:10 }
const annualInterest = d => (d.balance||0) * ((d.interestRate ?? DEFAULT_RATES[d.category] ?? 10) / 100)
const totalInterestDrag = debts => debts.reduce((s,d)=>s+annualInterest(d),0)

// Income resilience (% from primary)
const incomeResilience = (inc,assets) => { const t=calcIncome(inc,assets); return t>0?Math.round((inc.primary||0)/t*100):100 }

// Projection to age 70
const calcProjection = (nw, surplus, currentAge) => {
  const age = currentAge || 35
  const totalMonths = Math.max((70 - age) * 12, 12)
  const data=[]; let con=nw, bal=nw, amb=nw
  for(let m=0;m<=totalMonths;m++){
    if(m>0){
      const s=Math.max(0,surplus)
      con += s*0.5  + con*(0.04/12)
      bal += s*1.0  + bal*(0.07/12)
      amb += s*1.2  + amb*(0.10/12)
    }
    data.push({ month:m, conservative:Math.round(con), balanced:Math.round(bal), ambitious:Math.round(amb) })
  }
  return data
}

// Age benchmarks (UK approximate medians)
const BENCHMARKS = [
  { min:18,max:24,label:"18–24",median:3000 },   { min:25,max:29,label:"25–29",median:14000 },
  { min:30,max:34,label:"30–34",median:38000 },   { min:35,max:39,label:"35–39",median:67000 },
  { min:40,max:44,label:"40–44",median:110000 },  { min:45,max:49,label:"45–49",median:155000 },
  { min:50,max:54,label:"50–54",median:200000 },  { min:55,max:59,label:"55–59",median:250000 },
  { min:60,max:99,label:"60+",  median:310000 },
]
const getAgeBenchmark = age => BENCHMARKS.find(b=>age>=b.min&&age<=b.max)||BENCHMARKS[BENCHMARKS.length-1]

/* ── CONTEXT ────────────────────────────────────────────────────────────── */
const Ctx = createContext(null)
function buildDemoState() {
  const d={
    ...DEFAULTS,
    profile:{ ...DEFAULTS.profile,name:"Alex",age:34,onboardingComplete:true,points:340,streakWeeks:3 },
    assets:[
      { id:"d1",category:"primary_residence",name:"My home",            value:320000,monthlyIncome:0,linkedDebtId:"dl1" },
      { id:"d2",category:"savings",          name:"Emergency fund",     value:8500,  monthlyIncome:0,linkedDebtId:null },
      { id:"d3",category:"investments",      name:"Stocks & shares ISA",value:22000, monthlyIncome:0,linkedDebtId:null },
      { id:"d4",category:"pension",          name:"Workplace pension",  value:45000, monthlyIncome:0,linkedDebtId:null },
      { id:"d5",category:"vehicle",          name:"My car",             value:12000, monthlyIncome:0,linkedDebtId:null },
    ],
    debts:[
      { id:"dl1",category:"mortgage",   name:"My home loan",balance:210000,interestRate:3.5, linkedAssetId:"d1",isAutoCreated:true  },
      { id:"dl2",category:"credit_card",name:"Visa card",   balance:2400,  interestRate:21.9,linkedAssetId:null,isAutoCreated:false },
    ],
    income:{ primary:4200,primarySource:"Salary",additional:[] },
    spending:{ monthly:2900 },
  }
  const { netWorth:nw,totalAssets:ta,totalDebts:td }=calcTotals(d.assets,d.debts)
  d.history=mockHistory(nw,ta,td)
  return d
}
function AppProvider({ children }) {
  const [state,_set] = useState(load)
  const [view,setView]  = useState(()=>load().profile.onboardingComplete?"app":"welcome")
  const [tab,setTab]    = useState(0)
  const [toast,_toast]  = useState(null)
  const timer = useRef(null)
  const save  = ns => { _set(ns); localStorage.setItem("ls_v1",JSON.stringify(ns)) }
  const reset = ()  => { localStorage.removeItem("ls_v1"); _set(DEFAULTS); setView("welcome"); setTab(0) }
  const loadDemo = () => { const d=buildDemoState(); save(d); setView("app") }
  const showToast = msg => { _toast(msg); clearTimeout(timer.current); timer.current=setTimeout(()=>_toast(null),2500) }
  return (
    <Ctx.Provider value={{ state,save,reset,view,setView,tab,setTab,toast:showToast,loadDemo }}>
      <style>{G}</style>
      {children}
      {toast && <div style={{ position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:T.card,color:T.white,fontSize:14,fontWeight:600,padding:"10px 22px",borderRadius:999,border:`1px solid ${T.borderLight}`,whiteSpace:"nowrap",animation:"fadeUp .25s ease-out",boxShadow:"0 8px 40px rgba(0,0,0,.5)",pointerEvents:"none" }}>{toast}</div>}
    </Ctx.Provider>
  )
}
const useApp = () => useContext(Ctx)

/* ── PRIMITIVES ─────────────────────────────────────────────────────────── */
function Btn({ children, onClick, variant="primary", disabled=false, style={} }) {
  const vs = {
    primary:  { background:T.teal,       color:"#fff", border:"none" },
    secondary:{ background:"transparent",color:T.muted,border:`1.5px solid ${T.border}` },
    ghost:    { background:"transparent",color:T.teal, border:"none" },
    danger:   { background:"transparent",color:T.red,  border:`1.5px solid ${T.redBorder}` },
  }
  return <button disabled={disabled} onClick={onClick} style={{ ...vs[variant],padding:"13px 24px",borderRadius:12,fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,transition:"all .15s",width:"100%",fontFamily:"inherit",...style }}>{children}</button>
}

function Input({ label, value, onChange, placeholder, type="text", min, max, helper }) {
  return (
    <label style={{ display:"flex",flexDirection:"column",gap:7 }}>
      {label && <span style={{ fontSize:12,color:T.muted,fontWeight:600,letterSpacing:.3 }}>{label}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} min={min} max={max}
        style={{ background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"12px 15px",color:T.white,fontSize:15,outline:"none",fontFamily:"inherit",transition:"border-color .15s",width:"100%" }}
        onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border} />
      {helper && <span style={{ fontSize:11,color:T.subtle }}>{helper}</span>}
    </label>
  )
}

function CurrencyInput({ label, value, onChange, helper }) {
  const [raw,setRaw] = useState(value>0?String(value):"")
  useEffect(()=>{ if(value===0) setRaw("") },[value])
  return (
    <label style={{ display:"flex",flexDirection:"column",gap:7 }}>
      {label && <span style={{ fontSize:12,color:T.muted,fontWeight:600,letterSpacing:.3 }}>{label}</span>}
      <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}
        onFocus={e=>e.currentTarget.style.borderColor=T.teal} onBlur={e=>e.currentTarget.style.borderColor=T.border} tabIndex={-1}>
        <span style={{ padding:"0 14px",color:T.subtle,fontSize:19,fontWeight:700,userSelect:"none",flexShrink:0 }}>£</span>
        <input type="number" min="0" value={raw} placeholder="0"
          onChange={e=>{ setRaw(e.target.value); onChange(e.target.value===""?0:Math.max(0,parseFloat(e.target.value)||0)) }}
          style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:16,fontWeight:600,padding:"12px 14px 12px 0",fontVariantNumeric:"tabular-nums",fontFamily:"inherit" }} />
      </div>
      {helper && <span style={{ fontSize:11,color:T.subtle }}>{helper}</span>}
    </label>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <div>
      {label && <p style={{ fontSize:13,color:T.muted,marginBottom:9,fontWeight:500 }}>{label}</p>}
      <div style={{ display:"flex",gap:8 }}>
        {[false,true].map(opt=>(
          <button key={String(opt)} onClick={()=>onChange(opt)}
            style={{ flex:1,padding:"11px",borderRadius:11,border:`1.5px solid ${value===opt?T.teal:T.border}`,background:value===opt?T.tealDim:T.card,color:value===opt?T.teal:T.subtle,fontWeight:700,fontSize:14,cursor:"pointer",transition:"all .15s",fontFamily:"inherit" }}>
            {opt?"Yes":"No"}
          </button>
        ))}
      </div>
    </div>
  )
}

function Dots({ total, current }) {
  return (
    <div style={{ display:"flex",justifyContent:"center",gap:7 }}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{ width:i<=current?22:8,height:7,borderRadius:4,background:i<=current?T.teal:T.subtle,transition:"all .35s" }}/>
      ))}
    </div>
  )
}

function Tag({ children, color="teal" }) {
  const cc = { teal:[T.teal,T.tealDim,T.tealBorder],amber:[T.amber,T.amberDim,T.amberBorder],red:[T.red,T.redDim,T.redBorder] }
  const [c,bg,b] = cc[color]||cc.teal
  return <span style={{ fontSize:11,fontWeight:700,color:c,background:bg,border:`1px solid ${b}`,padding:"3px 9px",borderRadius:99 }}>{children}</span>
}

/* ── CATEGORY CONFIG ────────────────────────────────────────────────────── */
const CAT = {
  primary_residence:{ label:"Primary home",  Icon:Home,       c:T.amber,  bg:"rgba(245,158,11,.14)" },
  other_property:   { label:"Other property",Icon:Building2,  c:T.amber,  bg:"rgba(245,158,11,.14)" },
  vehicle:          { label:"Vehicle",       Icon:Car,        c:T.muted,  bg:"rgba(136,152,176,.12)" },
  savings:          { label:"Savings",       Icon:PiggyBank,  c:T.teal,   bg:T.tealDim },
  investments:      { label:"Investments",   Icon:TrendingUp, c:T.purple, bg:T.purpleDim },
  pension:          { label:"Pension",       Icon:Briefcase,  c:T.purple, bg:T.purpleDim },
  business:         { label:"Business",      Icon:Building2,  c:T.purple, bg:T.purpleDim },
  other:            { label:"Other",         Icon:Plus,       c:T.muted,  bg:"rgba(136,152,176,.12)" },
  mortgage:         { label:"Mortgage",      Icon:Home,       c:T.red,    bg:T.redDim },
  credit_card:      { label:"Credit card",   Icon:TrendingUp, c:T.red,    bg:T.redDim },
  personal_loan:    { label:"Personal loan", Icon:Building2,  c:T.red,    bg:T.redDim },
  car_loan:         { label:"Car loan",      Icon:Car,        c:T.red,    bg:T.redDim },
  student_loan:     { label:"Student loan",  Icon:Briefcase,  c:T.red,    bg:T.redDim },
  business_loan:    { label:"Business loan", Icon:Building2,  c:T.red,    bg:T.redDim },
}
function CatIcon({ cat, size=38 }) {
  const cfg=CAT[cat]||CAT.other; const {Icon}=cfg
  return (
    <div style={{ width:size,height:size,borderRadius:size*.28,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      <Icon size={size*.44} color={cfg.c} strokeWidth={2}/>
    </div>
  )
}

/* ── BOTTOM NAV ─────────────────────────────────────────────────────────── */
const NAV=[{Icon:LayoutDashboard,label:"Home"},{Icon:Layers,label:"Track"},{Icon:Target,label:"Goals"},{Icon:BookOpen,label:"Learn"},{Icon:Star,label:"Rewards"}]
function BottomNav() {
  const { tab,setTab } = useApp()
  return (
    <nav style={{ position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
      {NAV.map(({Icon,label},i)=>{ const on=tab===i; return (
        <button key={i} onClick={()=>setTab(i)} style={{ flex:1,padding:"11px 4px 9px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
          <Icon size={21} color={on?T.teal:T.subtle} strokeWidth={on?2.5:2}/>
          <span style={{ fontSize:10,fontWeight:on?700:500,color:on?T.teal:T.subtle }}>{label}</span>
        </button>
      )})}
    </nav>
  )
}

/* ── SHEET ──────────────────────────────────────────────────────────────── */
function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:400,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div style={{ background:T.surface,borderRadius:"22px 22px 0 0",maxHeight:"93vh",overflowY:"auto",animation:"slideUp .3s cubic-bezier(.32,.72,0,1)" }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"13px 0 5px" }}>
          <div style={{ width:42,height:5,borderRadius:3,background:T.subtle }}/>
        </div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 24px 18px" }}>
          <h2 style={{ color:T.white,fontSize:20,fontWeight:800 }}>{title}</h2>
          <button onClick={onClose} style={{ background:T.card,border:"none",borderRadius:9,padding:"7px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><X size={16}/></button>
        </div>
        <div style={{ padding:"0 24px 44px" }}>{children}</div>
      </div>
    </div>
  )
}

/* ── ASSET SHEET (FIXED: preCat auto-selects; loan question first) ──────── */
const ASSET_KEYS=["primary_residence","other_property","vehicle","savings","investments","pension","business","other"]
const ASSET_PH={ primary_residence:"e.g. My home",other_property:"e.g. Rental flat",vehicle:"e.g. My car",savings:"e.g. ISA, Emergency fund",investments:"e.g. Stocks & shares ISA",pension:"e.g. Workplace pension",business:"e.g. My business",other:"e.g. Jewellery, Art" }
const LOAN_CATS = new Set(["primary_residence","other_property","vehicle","business"])

function AssetSheet({ asset, preCat, onClose, onSave }) {
  const { state } = useApp()
  const editing = !!asset
  const existingDebt = asset?.linkedDebtId ? state.debts.find(d=>d.id===asset.linkedDebtId) : null
  // preCat is guaranteed fresh via key prop — useState picks it up on mount
  const [cat,setCat]           = useState(asset?.category || preCat || null)
  const [hasLoan,setHasLoan]   = useState(!!asset?.linkedDebtId)
  const [loanBal,setLoanBal]   = useState(existingDebt?.balance||0)
  const [loanRate,setLoanRate] = useState(existingDebt?.interestRate||"")
  const [name,setName]         = useState(asset?.name||"")
  const [val,setVal]           = useState(asset?.value||0)
  const [hasInc,setHasInc]     = useState((asset?.monthlyIncome||0)>0)
  const [inc,setInc]           = useState(asset?.monthlyIncome||0)
  const [err,setErr]           = useState("")

  // Auto-suggest loan toggle for property/vehicle/business
  useEffect(()=>{ if(cat && LOAN_CATS.has(cat) && !editing) setHasLoan(true) },[cat])

  function go(addAnother=false) {
    if(!cat)   { setErr("Please select a category."); return }
    if(val<=0) { setErr("Please enter a value greater than zero."); return }
    setErr("")
    onSave({ cat, name:name||(ASSET_PH[cat].replace("e.g. ","")), val, monthlyIncome:hasInc?inc:0, hasLoan, loanBal:hasLoan?loanBal:0, loanRate:hasLoan&&loanRate?Number(loanRate):null, existingId:asset?.id, existingLinkedDebtId:asset?.linkedDebtId }, addAnother)
    if(addAnother){ setCat(null);setHasLoan(false);setLoanBal(0);setLoanRate("");setName("");setVal(0);setHasInc(false);setInc(0) }
    else onClose()
  }

  return (
    <Sheet title={editing?"Edit asset":"Add an asset"} onClose={onClose}>
      {/* 1. Category */}
      <p style={{ fontSize:12,color:T.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:10 }}>Category</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
        {ASSET_KEYS.map(k=>{ const cfg=CAT[k]; const {Icon}=cfg; const sel=cat===k; return (
          <button key={k} onClick={()=>setCat(k)} style={{ padding:"13px 8px",borderRadius:13,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.tealDim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:9,position:"relative",transition:"all .15s" }}>
            <div style={{ width:34,height:34,borderRadius:10,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon size={16} color={cfg.c}/></div>
            <span style={{ fontSize:11,fontWeight:600,color:sel?T.teal:T.muted,textAlign:"center",lineHeight:1.3 }}>{cfg.label}</span>
            {sel && <div style={{ position:"absolute",top:7,right:7,width:16,height:16,borderRadius:"50%",background:T.teal,display:"flex",alignItems:"center",justifyContent:"center" }}><Check size={10} color="#fff"/></div>}
          </button>
        )})}
      </div>

      {/* 2. Name + Value FIRST */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
        <Input label="Asset name" value={name} onChange={setName} placeholder={cat?ASSET_PH[cat]:"e.g. My home"}/>
        <CurrencyInput label="Estimated value" value={val} onChange={setVal}/>
      </div>

      {/* 3. Loan question */}
      <div style={{ marginBottom:16 }}>
        <Toggle label="Does this asset have a loan or mortgage against it?" value={hasLoan} onChange={setHasLoan}/>
      </div>
      {hasLoan && (
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"16px",marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:14 }}>
            <Shield size={13} color={T.teal}/><p style={{ fontSize:12,color:T.teal,fontWeight:700 }}>Linked loan details</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <CurrencyInput label="Outstanding loan balance" value={loanBal} onChange={setLoanBal}/>
            <div>
              <p style={{ fontSize:12,color:T.muted,fontWeight:600,marginBottom:7 }}>Interest rate (optional)</p>
              <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
                <input type="number" min="0" max="100" value={loanRate} placeholder="e.g. 3.5" onChange={e=>setLoanRate(e.target.value)} style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:14,padding:"12px 14px",fontFamily:"inherit" }}/>
                <span style={{ padding:"0 14px",color:T.subtle,fontSize:14 }}>%</span>
              </div>
              <p style={{ fontSize:11,color:T.subtle,marginTop:5 }}>Leave blank and we will estimate.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Income */}
      <div style={{ marginBottom:16 }}>
        <Toggle label="Does this asset generate monthly income?" value={hasInc} onChange={setHasInc}/>
      </div>
      {hasInc && <div style={{ marginBottom:16 }}><CurrencyInput label="Monthly income from this asset" value={inc} onChange={setInc}/></div>}

      {err && <p style={{ color:T.red,fontSize:13,fontWeight:500,marginBottom:12 }}>{err}</p>}
      <div style={{ display:"flex",gap:10 }}>
        <Btn onClick={()=>go(false)}>Save asset</Btn>
        <Btn onClick={()=>go(true)} variant="secondary">Save and add another</Btn>
      </div>
    </Sheet>
  )
}

/* ── DEBT SHEET ─────────────────────────────────────────────────────────── */
const DEBT_KEYS=["mortgage","credit_card","personal_loan","car_loan","student_loan","business_loan","other"]
function DebtSheet({ debt, onClose, onSave }) {
  const editing=!!debt
  const [cat,setCat]   = useState(debt?.category||null)
  const [name,setName] = useState(debt?.name||"")
  const [bal,setBal]   = useState(debt?.balance||0)
  const [rate,setRate] = useState(debt?.interestRate||"")
  const [err,setErr]   = useState("")
  function go(addAnother=false) {
    if(!cat)  { setErr("Please select a category."); return }
    if(bal<=0){ setErr("Please enter a balance greater than zero."); return }
    setErr("")
    onSave({ cat, name:name||(CAT[cat]?.label||"Debt"), bal, rate:rate?Number(rate):null, existingId:debt?.id }, addAnother)
    if(addAnother){ setCat(null);setName("");setBal(0);setRate("") } else onClose()
  }
  return (
    <Sheet title={editing?"Edit debt":"Add a debt"} onClose={onClose}>
      <p style={{ fontSize:12,color:T.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:10 }}>Category</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:22 }}>
        {DEBT_KEYS.map(k=>{ const cfg=CAT[k]||CAT.other; const {Icon}=cfg; const sel=cat===k; return (
          <button key={k} onClick={()=>setCat(k)} style={{ padding:"13px 8px",borderRadius:13,border:`2px solid ${sel?T.red:T.border}`,background:sel?T.redDim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:9,position:"relative",transition:"all .15s" }}>
            <div style={{ width:34,height:34,borderRadius:10,background:sel?"rgba(248,113,113,.18)":cfg.bg,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon size={16} color={sel?T.red:cfg.c}/></div>
            <span style={{ fontSize:11,fontWeight:600,color:sel?T.red:T.muted,textAlign:"center",lineHeight:1.3 }}>{cfg.label}</span>
            {sel && <div style={{ position:"absolute",top:7,right:7,width:16,height:16,borderRadius:"50%",background:T.red,display:"flex",alignItems:"center",justifyContent:"center" }}><Check size={10} color="#fff"/></div>}
          </button>
        )})}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
        <Input label="Debt name" value={name} onChange={setName} placeholder="e.g. Barclays credit card"/>
        <CurrencyInput label="Outstanding balance" value={bal} onChange={setBal}/>
      </div>
      <div style={{ maxWidth:260,marginBottom:20 }}>
        <p style={{ fontSize:12,color:T.muted,fontWeight:600,marginBottom:7 }}>Interest rate (optional)</p>
        <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
          <input type="number" min="0" max="100" value={rate} placeholder="e.g. 21.9" onChange={e=>setRate(e.target.value)} style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:14,padding:"12px 14px",fontFamily:"inherit" }}/>
          <span style={{ padding:"0 14px",color:T.subtle,fontSize:14 }}>%</span>
        </div>
      </div>
      {err && <p style={{ color:T.red,fontSize:13,fontWeight:500,marginBottom:12 }}>{err}</p>}
      <div style={{ display:"flex",gap:10 }}>
        <Btn onClick={()=>go(false)}>Save debt</Btn>
        <Btn onClick={()=>go(true)} variant="secondary">Save & add another</Btn>
      </div>
    </Sheet>
  )
}

/* ── ONBOARDING WRAPPER ─────────────────────────────────────────────────── */
function OnboardWrap({ children, back, step, steps, footer }) {
  return (
    <div style={{ minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 32px 0" }}>
        {back
          ? <button onClick={back} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontFamily:"inherit" }}><ChevronLeft size={17}/> Back</button>
          : <div style={{ display:"flex",alignItems:"center",gap:7 }}><div style={{ width:7,height:7,borderRadius:"50%",background:T.teal }}/><span style={{ color:T.teal,fontSize:12,fontWeight:800,letterSpacing:2.5 }}>LIFESMART</span></div>
        }
        {step && <span style={{ color:T.subtle,fontSize:13 }}>Step {step} of {steps}</span>}
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"24px 32px 32px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>{children}</div>
      </div>
      {footer && <div style={{ padding:"0 32px 36px",background:`linear-gradient(transparent, ${T.bg} 50%)` }}><div style={{ maxWidth:1100,margin:"0 auto" }}>{footer}</div></div>}
    </div>
  )
}

/* ── ONBOARDING SCREENS ─────────────────────────────────────────────────── */
function WelcomeScreen() {
  const { setView, loadDemo } = useApp()
  return (
    <div style={{ minHeight:"100dvh",background:`radial-gradient(ellipse 60% 50% at 20% 35%,rgba(14,165,160,.09) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 80% 70%,rgba(139,92,246,.07) 0%,transparent 70%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 32px",position:"relative",overflow:"hidden" }}>
      {[{x:"5%",y:"15%",s:400,c:"rgba(14,165,160,.05)"},{x:"75%",y:"65%",s:350,c:"rgba(139,92,246,.05)"},{x:"55%",y:"5%",s:280,c:"rgba(14,165,160,.04)"}].map((b,i)=>(
        <div key={i} style={{ position:"absolute",left:b.x,top:b.y,width:b.s,height:b.s,borderRadius:"50%",background:b.c,filter:"blur(60px)",animation:`pulse ${3.5+i}s ease-in-out infinite alternate`,pointerEvents:"none" }}/>
      ))}
      <div style={{ maxWidth:680,width:"100%",position:"relative" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(14,165,160,.1)",border:`1px solid ${T.tealBorder}`,borderRadius:99,padding:"7px 18px",marginBottom:32 }}>
          <div style={{ width:7,height:7,borderRadius:"50%",background:T.teal }}/><span style={{ color:T.teal,fontSize:12,fontWeight:800,letterSpacing:2.5 }}>LIFESMART</span>
        </div>
        <h1 style={{ fontSize:"clamp(40px,7vw,72px)",fontWeight:900,lineHeight:1.08,marginBottom:22,letterSpacing:-1.5 }}>Build your<br/><span style={{ color:T.teal }}>life dashboard</span></h1>
        <p style={{ color:T.muted,fontSize:"clamp(16px,2vw,19px)",lineHeight:1.7,marginBottom:44,maxWidth:480 }}>Track what you own, what you owe, and where you're heading. Estimates are always fine.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:12,maxWidth:360 }}>
          <Btn onClick={()=>setView("why")} style={{ fontSize:17,padding:"16px 28px" }}>Get started →</Btn>
          <button onClick={loadDemo} style={{ background:"none",border:"none",color:T.subtle,fontSize:14,cursor:"pointer",textAlign:"left",fontFamily:"inherit",padding:"4px 0" }}>See an example dashboard first</button>
        </div>
        <div style={{ display:"flex",gap:40,marginTop:60,flexWrap:"wrap" }}>
          {[["Net worth tracking","No spreadsheets needed"],["Goal tracking","See your progress"],["Smart insights","Plain English only"]].map(([h,s])=>(
            <div key={h}><p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{h}</p><p style={{ color:T.subtle,fontSize:13,marginTop:3 }}>{s}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WhyScreen() {
  const { setView } = useApp()
  return (
    <OnboardWrap back={()=>setView("welcome")} footer={<div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:480 }}><Dots total={3} current={0}/><Btn onClick={()=>setView("profile")}>Continue →</Btn></div>}>
      <div style={{ display:"grid",gridTemplateColumns:"minmax(0,3fr) minmax(0,2fr)",gap:32,alignItems:"start",maxWidth:900,paddingTop:16 }}>
        <div>
          <h1 style={{ color:T.white,fontSize:"clamp(26px,4vw,40px)",fontWeight:900,marginBottom:20,lineHeight:1.15 }}>Why this matters</h1>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,cursor:"pointer",marginBottom:28,overflow:"hidden",position:"relative" }}>
            <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(14,165,160,.06) 0%,transparent 70%)" }}/>
            <div style={{ width:68,height:68,borderRadius:"50%",border:`2.5px solid ${T.teal}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
              <div style={{ width:0,height:0,borderTop:"12px solid transparent",borderBottom:"12px solid transparent",borderLeft:`20px solid ${T.teal}`,marginLeft:5 }}/>
            </div>
            <p style={{ color:T.muted,fontSize:13,position:"relative" }}>Why financial clarity changes everything · 90 seconds</p>
          </div>
          {[["See the full picture","Most people have a vague sense of their finances. This makes it concrete."],["Stop avoiding, start acting","Clarity removes anxiety. When you can see it, you can improve it."],["Small steps compound","You don't need to change everything. Just know where you stand."]].map(([h,b])=>(
            <div key={h} style={{ display:"flex",gap:14,marginBottom:18 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:T.teal,flexShrink:0,marginTop:7 }}/>
              <div><p style={{ color:T.white,fontWeight:700,fontSize:15 }}>{h}</p><p style={{ color:T.muted,fontSize:14,lineHeight:1.65,marginTop:3 }}>{b}</p></div>
            </div>
          ))}
        </div>
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"24px 22px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18 }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:T.tealDim,border:`2px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center" }}><User size={22} color={T.teal}/></div>
            <div><p style={{ color:T.white,fontWeight:800,fontSize:15 }}>LifeSmart Guide</p><p style={{ color:T.subtle,fontSize:12 }}>Your financial companion</p></div>
          </div>
          <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.75 }}>"Most people avoid money because it feels overwhelming. We make it simple.<br/><br/>You'll build your picture step by step — then we'll show you exactly how to improve it."</p>
        </div>
      </div>
    </OnboardWrap>
  )
}

function ProfileScreen() {
  const { setView,state,save } = useApp()
  const [name,setName] = useState(state.profile.name||"")
  const [age,setAge]   = useState(state.profile.age||"")
  return (
    <OnboardWrap back={()=>setView("why")} footer={<div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:480 }}><Dots total={3} current={1}/><Btn onClick={()=>{ save({ ...state,profile:{ ...state.profile,name:name.trim(),age:age?Number(age):null } }); setView("assets") }}>Continue →</Btn></div>}>
      <div style={{ maxWidth:640,paddingTop:16 }}>
        <h1 style={{ color:T.white,fontSize:"clamp(26px,4vw,40px)",fontWeight:900,marginBottom:8 }}>A bit about you</h1>
        <p style={{ color:T.muted,fontSize:16,marginBottom:36 }}>Both fields are optional — they personalise your dashboard.</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
          <Input label="Your first name (optional)" value={name} onChange={setName} placeholder="e.g. Alex"/>
          <Input label="Your age (optional)" value={age} onChange={setAge} type="number" min="16" max="100" placeholder="e.g. 34" helper="Enables an age-group benchmark on your dashboard."/>
        </div>
      </div>
    </OnboardWrap>
  )
}

const ASSET_TILES=[{label:"Home",cat:"primary_residence"},{label:"Car",cat:"vehicle"},{label:"Savings",cat:"savings"},{label:"Investments",cat:"investments"},{label:"Pension",cat:"pension"},{label:"Business",cat:"business"},{label:"Other",cat:"other"}]

function AssetsScreen() {
  const { setView,state,save,toast } = useApp()
  const [sheetOpen,setSheetOpen] = useState(false)
  const [editAsset,setEditAsset] = useState(null)
  const [preCat,setPreCat]       = useState(null)
  const { totalAssets } = calcTotals(state.assets,state.debts)

  function saveAsset(data,addAnother) {
    let assets=[...state.assets],debts=[...state.debts]
    if(data.existingId) {
      let linkedDebtId = data.existingLinkedDebtId || null
      if(data.hasLoan&&data.loanBal>0&&data.existingLinkedDebtId) {
        debts=debts.map(d=>d.id!==data.existingLinkedDebtId?d:{ ...d,balance:data.loanBal,interestRate:data.loanRate })
      } else if(data.hasLoan&&data.loanBal>0&&!data.existingLinkedDebtId) {
        const did=data.existingId+"_d"+Date.now(); linkedDebtId=did
        debts.push({ id:did,category:debtCatFrom(data.cat),name:`${data.name} loan`,balance:data.loanBal,interestRate:data.loanRate,linkedAssetId:data.existingId,isAutoCreated:true })
      } else if(!data.hasLoan&&data.existingLinkedDebtId) {
        debts=debts.filter(d=>d.id!==data.existingLinkedDebtId); linkedDebtId=null
      }
      assets=assets.map(a=>a.id!==data.existingId?a:{ ...a,category:data.cat,name:data.name,value:data.val,monthlyIncome:data.monthlyIncome,linkedDebtId })
    } else {
      const aid=Date.now().toString(); let linkedDebtId=null
      if(data.hasLoan&&data.loanBal>0){ const did=aid+"_d"; linkedDebtId=did; debts.push({ id:did,category:debtCatFrom(data.cat),name:`${data.name} loan`,balance:data.loanBal,interestRate:data.loanRate,linkedAssetId:aid,isAutoCreated:true }) }
      assets.push({ id:aid,category:data.cat,name:data.name,value:data.val,monthlyIncome:data.monthlyIncome,linkedDebtId })
    }
    save({ ...state,assets,debts }); toast("Asset saved")
    if(!addAnother){ setSheetOpen(false);setEditAsset(null);setPreCat(null) }
  }

  function deleteAsset(a) {
    const linked=a.linkedDebtId?state.debts.find(d=>d.id===a.linkedDebtId):null
    if(!window.confirm(linked?`Delete "${a.name}" and its linked loan "${linked.name}"?`:`Delete "${a.name}"?`)) return
    save({ ...state,assets:state.assets.filter(x=>x.id!==a.id),debts:linked?state.debts.filter(d=>d.id!==linked.id):state.debts })
  }

  return (
    <OnboardWrap back={()=>setView("profile")} step={1} steps={3}
      footer={<div style={{ display:"flex",gap:12,maxWidth:600 }}><Btn onClick={()=>setView("debts")}>Continue to debts →</Btn>{state.assets.length===0&&<Btn variant="secondary" onClick={()=>setView("debts")} style={{ maxWidth:140,fontSize:13 }}>Skip</Btn>}</div>}>
      <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"12px 18px",marginBottom:28,display:"flex",alignItems:"center",gap:10 }}>
        <Sparkles size={14} color={T.teal}/><p style={{ color:T.teal,fontSize:14,fontWeight:500 }}>Assets are things you own that have value.</p>
      </div>
      <h2 style={{ color:T.white,fontSize:"clamp(22px,3.5vw,32px)",fontWeight:900,marginBottom:20 }}>What do you own?</h2>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:10,marginBottom:14 }}>
        {ASSET_TILES.map(t=>(
          <button key={t.cat}
            onClick={()=>{ setPreCat(t.cat); setEditAsset(null); setSheetOpen(true) }}
            style={{ background:T.card,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,cursor:"pointer",transition:"all .15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.teal;e.currentTarget.style.background=T.cardHover }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.card }}>
            <CatIcon cat={t.cat} size={40}/><span style={{ color:T.muted,fontSize:12,fontWeight:600,textAlign:"center" }}>{t.label}</span>
          </button>
        ))}
      </div>
      <button onClick={()=>{ setPreCat(null);setEditAsset(null);setSheetOpen(true) }}
        style={{ width:"100%",background:"none",border:`1.5px dashed ${T.border}`,borderRadius:13,padding:"11px 18px",color:T.subtle,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit",marginBottom:36 }}>
        <Plus size={15}/> Add an asset manually
      </button>
      {state.assets.length>0 && (
        <>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
            <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Added so far</p>
            <p style={{ color:T.teal,fontWeight:700,fontSize:14 }}>Total: {fmt(totalAssets)}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:10 }}>
            {state.assets.map(a=>{
              const linked=a.linkedDebtId?state.debts.find(d=>d.id===a.linkedDebtId):null
              return (
                <div key={a.id} className="fade-up" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:13 }}>
                  <CatIcon cat={a.category} size={42}/>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.name}</p>
                    <p style={{ color:T.subtle,fontSize:12,marginTop:2 }}>{CAT[a.category]?.label}</p>
                    <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
                      {linked&&<Tag color="amber">Linked loan</Tag>}
                      {a.monthlyIncome>0&&<Tag color="teal">£{a.monthlyIncome}/mo</Tag>}
                    </div>
                  </div>
                  <p style={{ color:T.teal,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",marginRight:4 }}>{fmt(a.value)}</p>
                  <button onClick={()=>{ setEditAsset(a);setPreCat(null);setSheetOpen(true) }} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={15}/></button>
                  <button onClick={()=>deleteAsset(a)} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={15}/></button>
                </div>
              )
            })}
          </div>
        </>
      )}
      {/* KEY includes preCat so sheet remounts with correct category pre-selected */}
      {sheetOpen && <AssetSheet asset={editAsset} preCat={preCat} onClose={()=>{ setSheetOpen(false);setEditAsset(null);setPreCat(null) }} onSave={saveAsset} key={editAsset?.id || preCat || "new"}/>}
    </OnboardWrap>
  )
}

function DebtsScreen() {
  const { setView,state,save,toast } = useApp()
  const [sheetOpen,setSheetOpen] = useState(false)
  const [editDebt,setEditDebt]   = useState(null)
  const autoDebts=state.debts.filter(d=>d.isAutoCreated), manualDebts=state.debts.filter(d=>!d.isAutoCreated)
  const totalD=state.debts.reduce((s,d)=>s+(d.balance||0),0)

  function saveDebt(data,addAnother) {
    let debts=[...state.debts]
    if(data.existingId) debts=debts.map(d=>d.id!==data.existingId?d:{ ...d,category:data.cat,name:data.name,balance:data.bal,interestRate:data.rate })
    else debts.push({ id:Date.now().toString(),category:data.cat,name:data.name,balance:data.bal,interestRate:data.rate,linkedAssetId:null,isAutoCreated:false })
    save({ ...state,debts }); toast("✓  Debt saved")
    if(!addAnother){ setSheetOpen(false);setEditDebt(null) }
  }

  function DebtRow({ debt, isAuto }) {
    const linkedAsset=isAuto?state.assets.find(a=>a.id===debt.linkedAssetId):null
    return (
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:13 }}>
        <CatIcon cat={debt.category} size={42}/>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{debt.name}</p>
          <p style={{ color:T.subtle,fontSize:12,marginTop:2 }}>{CAT[debt.category]?.label||"Debt"}</p>
          {isAuto&&linkedAsset&&<div style={{ display:"flex",alignItems:"center",gap:5,marginTop:5 }}><Lock size={10} color={T.amber}/><span style={{ color:T.amber,fontSize:11,fontWeight:600 }}>Edit via {linkedAsset.name}</span></div>}
        </div>
        <div style={{ textAlign:"right",marginRight:4 }}>
          <p style={{ color:T.red,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums" }}>{fmt(debt.balance)}</p>
          {debt.interestRate!=null&&<p style={{ color:T.subtle,fontSize:11,marginTop:2 }}>{debt.interestRate}% p.a.</p>}
        </div>
        {!isAuto&&<>
          <button onClick={()=>{ setEditDebt(debt);setSheetOpen(true) }} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={15}/></button>
          <button onClick={()=>{ if(!window.confirm(`Delete "${debt.name}"?`)) return; save({ ...state,debts:state.debts.filter(x=>x.id!==debt.id) }) }} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={15}/></button>
        </>}
      </div>
    )
  }

  return (
    <OnboardWrap back={()=>setView("assets")} step={2} steps={3}
      footer={<div style={{ display:"flex",gap:12,maxWidth:600 }}><Btn onClick={()=>setView("income")}>Continue to income →</Btn>{state.debts.length===0&&<Btn variant="secondary" onClick={()=>setView("income")} style={{ maxWidth:140,fontSize:13 }}>Skip</Btn>}</div>}>
      <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:14,padding:"12px 18px",marginBottom:28,display:"flex",alignItems:"center",gap:10 }}>
        <Shield size={14} color={T.amber}/><p style={{ color:T.amber,fontSize:14,fontWeight:500 }}>Debts are money you owe. This is about clarity, not judgement.</p>
      </div>
      <h2 style={{ color:T.white,fontSize:"clamp(22px,3.5vw,32px)",fontWeight:900,marginBottom:20 }}>Your debts</h2>
      {autoDebts.length>0&&<div style={{ marginBottom:24 }}><p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Found from your assets</p><div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10 }}>{autoDebts.map(d=><DebtRow key={d.id} debt={d} isAuto/>)}</div></div>}
      {manualDebts.length>0&&<div style={{ marginBottom:20 }}>{autoDebts.length>0&&<p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Other debts</p>}<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10 }}>{manualDebts.map(d=><DebtRow key={d.id} debt={d} isAuto={false}/>)}</div></div>}
      {totalD>0&&<p style={{ color:T.subtle,fontSize:13,marginBottom:20 }}>Total: <span style={{ color:T.red,fontWeight:700 }}>{fmt(totalD)}</span></p>}
      <button onClick={()=>{ setEditDebt(null);setSheetOpen(true) }} style={{ background:"none",border:`1.5px dashed ${T.border}`,borderRadius:13,padding:"11px 18px",color:T.subtle,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit" }}>
        <Plus size={15}/> {state.debts.length===0?"Add a debt":"Add another debt"}
      </button>
      {sheetOpen&&<DebtSheet debt={editDebt} onClose={()=>{ setSheetOpen(false);setEditDebt(null) }} onSave={saveDebt} key={editDebt?.id||"new"}/>}
    </OnboardWrap>
  )
}

function IncomeScreen() {
  const { setView,state,save } = useApp()
  const [primary,setPrimary]   = useState(state.income.primary||0)
  const [source,setSource]     = useState(state.income.primarySource||"")
  const [spending,setSpending] = useState(state.spending.monthly||0)
  const [addls,setAddls]       = useState(state.income.additional||[])
  const totalInc=primary+addls.reduce((s,a)=>s+(a.amount||0),0)
  const surplusVal=totalInc-spending

  return (
    <OnboardWrap back={()=>setView("debts")} step={3} steps={3}
      footer={<div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:480 }}><Dots total={3} current={2}/><Btn onClick={()=>{ save({ ...state,income:{ ...state.income,primary,primarySource:source,additional:addls },spending:{ monthly:spending } }); setView("reveal") }} disabled={primary===0&&spending===0} style={{ fontSize:17,padding:"16px 28px" }}>Reveal my net worth →</Btn></div>}>
      <h2 style={{ color:T.white,fontSize:"clamp(24px,4vw,40px)",fontWeight:900,marginBottom:6 }}>Your monthly picture</h2>
      <p style={{ color:T.muted,fontSize:16,marginBottom:32 }}>A rough estimate is absolutely fine.</p>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,maxWidth:900 }}>
        <div>
          <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:16 }}>What comes in</p>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <CurrencyInput label="Monthly income after tax" value={primary} onChange={setPrimary}/>
            <Input label="Primary income source" value={source} onChange={setSource} placeholder="e.g. Salary, Freelance"/>
            {addls.map(a=>(
              <div key={a.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:13,padding:14,display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10,alignItems:"end" }}>
                <Input label="Source" value={a.label} onChange={v=>setAddls(addls.map(x=>x.id===a.id?{...x,label:v}:x))} placeholder="e.g. Rental income"/>
                <CurrencyInput label="Amount" value={a.amount} onChange={v=>setAddls(addls.map(x=>x.id===a.id?{...x,amount:v}:x))}/>
                <button onClick={()=>setAddls(addls.filter(x=>x.id!==a.id))} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:"0 4px",marginBottom:3,fontFamily:"inherit" }}><X size={15}/></button>
              </div>
            ))}
            {addls.length<3&&<button onClick={()=>setAddls([...addls,{ id:Date.now().toString(),label:"",amount:0 }])} style={{ background:"none",border:`1.5px dashed ${T.border}`,borderRadius:12,padding:"10px 16px",color:T.subtle,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontFamily:"inherit" }}><Plus size={14}/> Add another income source</button>}
          </div>
        </div>
        <div>
          <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:16 }}>What goes out</p>
          <CurrencyInput label="Monthly spending (all outgoings)" value={spending} onChange={setSpending}/>
          <p style={{ fontSize:12,color:T.subtle,marginTop:6,marginBottom:20 }}>Include rent/mortgage, bills, food, subscriptions, everything.</p>
          {(primary>0||spending>0)&&(
            <div style={{ background:surplusVal>=0?T.tealDim:T.amberDim,border:`1px solid ${surplusVal>=0?T.tealBorder:T.amberBorder}`,borderRadius:18,padding:"22px 24px" }}>
              <p style={{ color:T.muted,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>Your monthly position</p>
              <p style={{ color:surplusVal>=0?T.teal:T.amber,fontSize:"clamp(26px,4vw,36px)",fontWeight:900,fontVariantNumeric:"tabular-nums" }}>
                {surplusVal>=0?"+":""}{fmt(surplusVal)}<span style={{ fontSize:15,fontWeight:500,marginLeft:8,opacity:.7 }}>{surplusVal>=0?"surplus":"shortfall"}</span>
              </p>
              <p style={{ color:T.muted,fontSize:14,marginTop:10,lineHeight:1.6 }}>{surplusVal>0?`Keep this up and your net worth could grow by around ${fmt(surplusVal*12)} this year.`:"We'll show you how to turn this around."}</p>
            </div>
          )}
        </div>
      </div>
    </OnboardWrap>
  )
}

function RevealScreen() {
  const { setView,state,save } = useApp()
  const [display,setDisplay] = useState(0)
  const [done,setDone]       = useState(false)
  const { totalAssets:ta,totalDebts:td,netWorth:nw } = calcTotals(state.assets,state.debts)
  const surplusVal = calcSurplus(state.income,state.assets,state.spending)
  const pos = nw>=0

  useEffect(()=>{
    const now=new Date(), key=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`
    let hist=state.history.length>0?[...state.history]:mockHistory(nw,ta,td)
    if(!hist.find(h=>h.date===key)) hist.push({ date:key,netWorth:nw,totalAssets:ta,totalDebts:td })
    save({ ...state,profile:{ ...state.profile,onboardingComplete:true,points:(state.profile.points||0)+50,lastCheckIn:now.toISOString() },history:hist,badges:[{ id:"first_entry",unlockedAt:now.toISOString() }] })
    const dur=1700, start=performance.now()
    const ease=t=>t>=1?1:1-Math.pow(2,-10*t)
    const tick=t=>{ const p=Math.min((t-start)/dur,1); setDisplay(Math.round(ease(p)*nw)); if(p<1) requestAnimationFrame(tick); else setDone(true) }
    requestAnimationFrame(tick)
  },[])

  const msg = nw>0?"You have built something real. Now let's grow it.":nw<0?"You are not behind. You are getting clarity. Now we build forward.":"You are starting from here. That is exactly the right place."
  return (
    <div style={{ minHeight:"100dvh",background:`radial-gradient(ellipse 60% 50% at 50% 40%,${pos?"rgba(14,165,160,.1)":"rgba(245,158,11,.07)"} 0%,transparent 65%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 32px",position:"relative",overflow:"hidden" }}>
      {pos&&done&&<div style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden" }}>{Array.from({length:40}).map((_,i)=>{ const cols=[T.teal,T.purple,T.amber,"#EC4899","#22C55E"],x=Math.random()*100,delay=Math.random()*1,size=3+Math.random()*7; return <div key={i} style={{ position:"absolute",left:`${x}%`,top:-10,width:size,height:size,background:cols[i%cols.length],borderRadius:"50%",animation:`confetti 3s ${delay}s ease-in forwards` }}/> })}</div>}
      <div style={{ textAlign:"center",position:"relative",zIndex:1,maxWidth:600,width:"100%" }}>
        <p style={{ color:T.subtle,fontSize:11,fontWeight:800,letterSpacing:5,textTransform:"uppercase",marginBottom:20 }}>YOUR NET WORTH</p>
        <div style={{ fontSize:"clamp(60px,12vw,100px)",fontWeight:900,color:pos?T.teal:T.amber,fontVariantNumeric:"tabular-nums",lineHeight:1,marginBottom:24,animation:done?`tealGlow 2.5s ease-in-out infinite`:undefined }}>{fmt(display)}</div>
        <p style={{ color:T.white,fontSize:"clamp(17px,2.5vw,21px)",lineHeight:1.65,marginBottom:44,maxWidth:420,margin:"0 auto 44px" }}>{msg}</p>
        <div style={{ display:"flex",gap:14,justifyContent:"center",marginBottom:52,flexWrap:"wrap" }}>
          {[["Assets",fmt(ta),T.teal],["Debts",fmt(td),T.red],["Monthly",`${surplusVal>=0?"+":""}${fmt(surplusVal)}`,surplusVal>=0?T.teal:T.amber]].map(([l,v,c])=>(
            <div key={l} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"13px 24px",textAlign:"center",minWidth:120 }}>
              <p style={{ color:T.subtle,fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase" }}>{l}</p>
              <p style={{ color:c,fontSize:20,fontWeight:800,fontVariantNumeric:"tabular-nums",marginTop:5 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ maxWidth:340,margin:"0 auto",display:"flex",flexDirection:"column",gap:12 }}>
          <Btn onClick={()=>setView("app")} style={{ fontSize:17,padding:"16px 28px" }}>Go to my dashboard →</Btn>
          <button onClick={()=>setView("income")} style={{ background:"none",border:"none",color:T.subtle,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>Edit my numbers</button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD 2 — DASHBOARD COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

// Shared card wrapper with stagger animation
function DCard({ children, index=0, style={} }) {
  return (
    <div className="fade-up" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"22px 24px",animationDelay:`${index*70}ms`,...style }}>
      {children}
    </div>
  )
}

function CardTitle({ children, chip }) {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
      <p style={{ color:T.white,fontSize:16,fontWeight:700 }}>{children}</p>
      {chip && <span style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:99,padding:"3px 10px",fontSize:11,color:T.subtle,fontWeight:600 }}>{chip}</span>}
    </div>
  )
}

// Custom recharts tooltip
function DarkTooltip({ active, payload, label, labelFormatter }) {
  if(!active||!payload?.length) return null
  return (
    <div style={{ background:"#0A1020",border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",boxShadow:"0 8px 32px rgba(0,0,0,.6)" }}>
      {label!=null && <p style={{ color:T.muted,fontSize:11,marginBottom:7,fontWeight:600 }}>{labelFormatter?labelFormatter(label):label}</p>}
      {payload.map((p,i)=>(
        <p key={i} style={{ color:p.color||T.white,fontSize:12,fontWeight:600,marginBottom:2 }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

/* ── KPI ROW ─────────────────────────────────────────────────────────────── */
function KPIRow({ nw, ta, td, surplusVal, assetCount, debtCount, history, index }) {
  const prev = history?.length >= 2 ? history[history.length-2] : null
  const nwDelta = prev ? nw - prev.netWorth : null

  const kpis = [
    { l:"NET WORTH",    v:fmt(nw),           c:nw>=0?T.teal:T.amber, sub:nw>=0?"Total position":"Review needed", delta:nwDelta },
    { l:"TOTAL ASSETS", v:fmt(ta),           c:T.teal,               sub:`${assetCount} asset${assetCount!==1?"s":""}` },
    { l:"TOTAL DEBTS",  v:fmt(td),           c:T.red,                sub:`${debtCount} debt${debtCount!==1?"s":""}` },
    { l:"MONTHLY",      v:(surplusVal>=0?"+":"")+fmt(surplusVal), c:surplusVal>=0?T.teal:T.amber, sub:surplusVal>=0?"Surplus":"Shortfall" },
  ]
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
      {kpis.map((k,i)=>(
        <DCard key={k.l} index={index+i}>
          <p style={{ color:T.subtle,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>{k.l}</p>
          <p style={{ color:k.c,fontSize:"clamp(20px,2.5vw,28px)",fontWeight:900,fontVariantNumeric:"tabular-nums",lineHeight:1 }}>{k.v}</p>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:8 }}>
            <p style={{ color:T.subtle,fontSize:12,fontWeight:500 }}>{k.sub}</p>
            {k.delta!=null && (
              <span style={{ display:"flex",alignItems:"center",gap:2,fontSize:11,fontWeight:700,color:k.delta>=0?T.teal:T.red }}>
                {k.delta>=0?<ArrowUp size={10}/>:<ArrowDown size={10}/>}{fmtK(Math.abs(k.delta))}
              </span>
            )}
          </div>
        </DCard>
      ))}
    </div>
  )
}

/* ── FREEDOM RUNWAY ──────────────────────────────────────────────────────── */
function FreedomRunwayCard({ months, index }) {
  const low=months<3, high=months>12
  const [col,bg,border_] = low?[T.amber,T.amberDim,T.amberBorder]:high?[T.blue,"rgba(59,130,246,.1)","rgba(59,130,246,.3)"]:[T.teal,T.tealDim,T.tealBorder]
  const sub = low?"Building this to 3 months would give you a real safety net.":high?"Strong position. Some of this cash could be working harder for you.":"You have a solid buffer. Keep it healthy."
  const display = months===0?"—":months>=100?"99+":months.toFixed(1)
  return (
    <div className="fade-up" style={{ background:bg,border:`1px solid ${border_}`,borderRadius:20,padding:"22px 28px",animationDelay:`${index*70}ms`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:24 }}>
      <div style={{ flex:1 }}>
        <p style={{ color:T.muted,fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>Freedom runway</p>
        <p style={{ color:T.white,fontSize:15,lineHeight:1.6,marginBottom:months===0?8:0 }}>{sub}</p>
        {months===0 && <p style={{ color:T.subtle,fontSize:12,fontStyle:"italic" }}>Add savings assets for an accurate figure.</p>}
      </div>
      <div style={{ textAlign:"right",flexShrink:0 }}>
        <p style={{ color:col,fontSize:"clamp(36px,4vw,52px)",fontWeight:900,fontVariantNumeric:"tabular-nums",lineHeight:1 }}>{display}</p>
        <p style={{ color:T.muted,fontSize:13,marginTop:4 }}>months</p>
      </div>
    </div>
  )
}

/* ── PROJECTION CHART ────────────────────────────────────────────────────── */
function ProjectionChart({ nw, surplus, currentAge, index }) {
  const age = currentAge || 35
  const data = useMemo(()=>calcProjection(nw,surplus,age),[nw,surplus,age])
  const LINES=[
    { key:"conservative", label:"Conservative", sublabel:"4%/yr returns", color:"#64748B", dash:"6 3", w:2 },
    { key:"balanced",     label:"Balanced",     sublabel:"7%/yr returns", color:T.teal,    dash:undefined, w:2.5 },
    { key:"ambitious",    label:"Ambitious",    sublabel:"10%/yr returns", color:T.purple,  dash:undefined, w:2.5 },
  ]
  const last   = data[data.length-1]
  const yMin   = nw > 0 ? Math.floor(nw * 0.95 / 1000) * 1000 : Math.floor(nw * 1.05 / 1000) * 1000
  const endAge = Math.min(70, age + Math.floor(data.length / 12))

  // Smart number format — millions when >= 1M
  const fmtBig = v => {
    const a = Math.abs(v)
    if(a >= 1_000_000) return `£${(v/1_000_000).toFixed(2)}M`
    if(a >= 1_000)     return `£${(v/1_000).toFixed(0)}k`
    return `£${Math.round(v)}`
  }
  const fmtAxis = v => {
    if(Math.abs(v) >= 1_000_000) return `£${(v/1_000_000).toFixed(1)}M`
    return `£${(v/1_000).toFixed(0)}k`
  }

  // Scenario explanations (personalised to the numbers)
  const howToReach = [
    { key:"conservative", color:"#64748B", text:`Save around half your monthly surplus (£${Math.round(Math.max(0,surplus)*0.5)}/mo) into a cash ISA or low-risk fund returning roughly 4% a year.` },
    { key:"balanced",     color:T.teal,    text:`Invest your full surplus (£${Math.round(Math.max(0,surplus))}/mo) into a diversified stocks & shares ISA or index funds — the historic average for global equities.` },
    { key:"ambitious",    color:T.purple,  text:`Invest surplus (£${Math.round(Math.max(0,surplus))}/mo) and grow your income or contributions over time. 10%/yr is achievable with a growth-focused global index fund over long periods.` },
  ]

  return (
    <DCard index={index}>
      <div style={{ marginBottom:14 }}>
        <p style={{ color:T.white,fontSize:16,fontWeight:700 }}>Net worth projection</p>
        <p style={{ color:T.subtle,fontSize:12,marginTop:3 }}>Ages {age}–{endAge} · three scenarios</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top:5,right:16,bottom:5,left:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A2540" vertical={false}/>
          <XAxis
            dataKey="month"
            tickFormatter={m=>{ const a=age+Math.round(m/12); return (a%5===0&&m>0)?String(a):"" }}
            tick={{ fill:T.subtle,fontSize:10 }} axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={fmtAxis}
            tick={{ fill:T.subtle,fontSize:10 }} axisLine={false} tickLine={false}
            width={58} domain={[yMin,"auto"]}
          />
          <Tooltip content={<DarkTooltip labelFormatter={m=>{ const a=age+Math.round(m/12); return `Age ${a}` }}/>}/>
          {LINES.map(l=>(
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={l.w} strokeDasharray={l.dash} dot={false} activeDot={{ r:4,fill:l.color }}/>
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Final figures */}
      {last && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}` }}>
          {LINES.map(l=>(
            <div key={l.key} style={{ background:T.surface,borderRadius:12,padding:"12px 14px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:5 }}>
                <div style={{ width:10,height:2,background:l.color,borderRadius:1 }}/>
                <span style={{ color:T.subtle,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5 }}>{l.label}</span>
              </div>
              <p style={{ color:l.color,fontSize:20,fontWeight:900,fontVariantNumeric:"tabular-nums",letterSpacing:-.5 }}>{fmtBig(last[l.key])}</p>
              <p style={{ color:T.subtle,fontSize:10,marginTop:2 }}>at age {endAge} · {l.sublabel}</p>
            </div>
          ))}
        </div>
      )}

      {/* How to reach each scenario */}
      <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}` }}>
        <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2 }}>How to reach each scenario</p>
        {howToReach.map(h=>(
          <div key={h.key} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:h.color,flexShrink:0,marginTop:4 }}/>
            <p style={{ color:T.muted,fontSize:12,lineHeight:1.65 }}>{h.text}</p>
          </div>
        ))}
      </div>

      <p style={{ color:T.subtle,fontSize:11,fontStyle:"italic",marginTop:10 }}>Illustrative only. Returns are not guaranteed. Not financial advice.</p>
    </DCard>
  )
}

/* ── ASSET DONUT + BAR GRID ──────────────────────────────────────────────── */
function AssetDonutChart({ ta, safetyNet, wealthBuilders, lifeAssets, index }) {
  const slices = [
    { name:"Safety net",      value:safetyNet,     color:T.teal   },
    { name:"Wealth builders", value:wealthBuilders, color:T.purple },
    { name:"Life assets",     value:lifeAssets,    color:T.amber  },
  ].filter(s=>s.value>0)

  return (
    <DCard index={index} style={{ display:"flex",flexDirection:"column" }}>
      <CardTitle>Asset breakdown</CardTitle>
      <div style={{ position:"relative",margin:"0 auto" }}>
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie data={slices.length>0?slices:[{ name:"None",value:1 }]} cx="50%" cy="50%" innerRadius={52} outerRadius={74} paddingAngle={slices.length>1?3:0} dataKey="value" stroke="none">
              {slices.length>0 ? slices.map((s,i)=><Cell key={i} fill={s.color}/>) : <Cell fill={T.faint}/>}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none" }}>
          <p style={{ color:T.subtle,fontSize:10,fontWeight:600 }}>Total</p>
          <p style={{ color:T.white,fontSize:14,fontWeight:800,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap" }}>{fmtK(ta)}</p>
        </div>
      </div>
      <div style={{ marginTop:12,display:"flex",flexDirection:"column",gap:7 }}>
        {[{name:"Safety net",value:safetyNet,c:T.teal},{name:"Wealth builders",value:wealthBuilders,c:T.purple},{name:"Life assets",value:lifeAssets,c:T.amber}].map(r=>(
          <div key={r.name} style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:7 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:r.c,flexShrink:0 }}/>
              <span style={{ color:T.muted,fontSize:12 }}>{r.name}</span>
            </div>
            <span style={{ color:r.value>0?T.white:T.subtle,fontSize:12,fontWeight:700,fontVariantNumeric:"tabular-nums" }}>{fmtK(r.value)}</span>
          </div>
        ))}
        {wealthBuilders===0&&ta>0&&<p style={{ color:T.amber,fontSize:11,marginTop:4 }}>No wealth builders yet — consider investing.</p>}
      </div>
    </DCard>
  )
}

/* ── NET WORTH HERO (replaces old 3-bar AssetsDebtsBar) ─────────────────── */
function NetWorthHero({ nw, ta, td, assetCount, debtCount, history, index }) {
  const prev = history?.length >= 2 ? history[history.length-2] : null
  const nwDelta = prev ? nw - prev.netWorth : null
  const isNeg = nw < 0
  return (
    <DCard index={index} style={{ padding:"28px 28px 24px" }}>
      <p style={{ color:T.subtle,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12 }}>YOUR NET WORTH</p>
      <div style={{ display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap",marginBottom:22 }}>
        <p style={{ color:isNeg?T.amber:T.teal,fontSize:"clamp(32px,4vw,52px)",fontWeight:900,fontVariantNumeric:"tabular-nums",lineHeight:1 }}>{fmt(nw)}</p>
        {nwDelta!=null && (
          <span style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:13,fontWeight:700,color:nwDelta>=0?T.teal:T.red,background:nwDelta>=0?T.tealDim:T.redDim,border:`1px solid ${nwDelta>=0?T.tealBorder:T.redBorder}`,borderRadius:99,padding:"4px 12px",flexShrink:0 }}>
            {nwDelta>=0?<ArrowUp size={11}/>:<ArrowDown size={11}/>}{fmtK(Math.abs(nwDelta))} vs last month
          </span>
        )}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {[
          { l:"Total assets", v:fmt(ta), c:T.teal, bg:T.tealDim, b:T.tealBorder, sub:`${assetCount} asset${assetCount!==1?"s":""}` },
          { l:"Total debts",  v:fmt(td), c:T.red,  bg:T.redDim,  b:T.redBorder,  sub:`${debtCount} debt${debtCount!==1?"s":""}` },
        ].map(k=>(
          <div key={k.l} style={{ background:k.bg,border:`1px solid ${k.b}`,borderRadius:14,padding:"14px 16px" }}>
            <p style={{ color:T.subtle,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>{k.l}</p>
            <p style={{ color:k.c,fontSize:20,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{k.v}</p>
            <p style={{ color:T.subtle,fontSize:11,marginTop:3 }}>{k.sub}</p>
          </div>
        ))}
      </div>
    </DCard>
  )
}

/* ── SAFETY NET GAUGE (custom SVG) ───────────────────────────────────────── */
function polarPt(cx,cy,r,deg){ return { x:cx+r*Math.cos(deg*Math.PI/180), y:cy-r*Math.sin(deg*Math.PI/180) } }
function arcPath(cx,cy,r,startDeg,endDeg){
  const s=polarPt(cx,cy,r,startDeg), e=polarPt(cx,cy,r,endDeg)
  const large=(startDeg-endDeg)>180?1:0
  return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${r} ${r} 0 ${large} 0 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`
}

function SafetyNetGauge({ months, spending, index }) {
  const [needleDeg, setNeedleDeg] = useState(180)
  const targetDeg = 180-(Math.min(months,9)/9)*180

  useEffect(()=>{
    const dur=1200, start=performance.now()
    const ease=t=>1-Math.pow(1-t,3)
    const tick=now=>{ const p=Math.min((now-start)/dur,1); setNeedleDeg(180-ease(p)*(180-targetDeg)); if(p<1) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  },[targetDeg])

  const cx=150, cy=140, r=105, sw=14
  const zones=[
    { from:180, to:160, color:"#EF4444" },  // 0–1mo
    { from:160, to:120, color:T.amber  },   // 1–3mo
    { from:120, to:60,  color:T.green  },   // 3–6mo
    { from:60,  to:0,   color:T.amber  },   // 6–9mo
  ]
  const zoneColor = months<1?"#EF4444":months<3?T.amber:months<=6?T.green:T.amber
  const sub = months<3 ? `Adding ${fmt(Math.max(0,3*spending-months*spending))} to savings would reach the safe zone.` : months<=6 ? "You are in the optimal range. Well done." : "Some of this cash could be working harder as investments."

  const needlePt = polarPt(cx,cy,88,needleDeg)

  return (
    <DCard index={index}>
      <CardTitle>Safety net</CardTitle>
      <div style={{ maxWidth:360,margin:"0 auto" }}>
        <svg viewBox="0 0 300 155" width="100%" style={{ display:"block" }}>
          {/* Background arc */}
          <path d={arcPath(cx,cy,r,180,0)} fill="none" stroke={T.faint} strokeWidth={sw} strokeLinecap="round"/>
          {/* Zone arcs */}
          {zones.map((z,i)=><path key={i} d={arcPath(cx,cy,r,z.from,z.to)} fill="none" stroke={z.color} strokeWidth={sw} strokeLinecap={i===0?"round":i===3?"round":"butt"} opacity={.85}/>)}
          {/* Needle */}
          <line x1={cx} y1={cy} x2={needlePt.x.toFixed(1)} y2={needlePt.y.toFixed(1)} stroke={T.white} strokeWidth={2.5} strokeLinecap="round"/>
          <circle cx={cx} cy={cy} r={5} fill={T.white}/>
          {/* Labels */}
          <text x="18" y="148" fill="#EF4444" fontSize="9" fontWeight="600">Too low</text>
          <text x="150" y="16" textAnchor="middle" fill={T.green} fontSize="9" fontWeight="600">3–6 months</text>
          <text x="150" y="27" textAnchor="middle" fill={T.green} fontSize="9">Optimal</text>
          <text x="282" y="148" textAnchor="end" fill={T.amber} fontSize="9" fontWeight="600">Too high</text>
        </svg>
        <div style={{ textAlign:"center",marginTop:4 }}>
          <p style={{ color:zoneColor,fontSize:36,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>
            {months===0?"0":months.toFixed(1)} <span style={{ fontSize:16,fontWeight:500,color:T.muted }}>months</span>
          </p>
          <p style={{ color:T.muted,fontSize:14,marginTop:8,lineHeight:1.6 }}>{sub}</p>
          {months===0 && <p style={{ color:T.subtle,fontSize:11,fontStyle:"italic",marginTop:4 }}>Estimated — add savings assets for accuracy.</p>}
        </div>
      </div>
    </DCard>
  )
}

/* ── INCOME TREND CHART ──────────────────────────────────────────────────── */
function IncomeTrendChart({ totalIncome, spending, index }) {
  // useMemo with [] so jitter is stable across renders
  const data = useMemo(()=>{
    const months=[]
    for(let i=5;i>=0;i--){
      const ji = i===0?1:(1+(Math.random()*.10-.05))
      const js = i===0?1:(1+(Math.random()*.16-.08))
      const d=new Date(); d.setMonth(d.getMonth()-i)
      const label=d.toLocaleDateString("en-GB",{ month:"short" })
      const inc=Math.round(totalIncome*ji), sp=Math.round(spending*js)
      months.push({ label, income:inc, spending:sp, surplus:inc-sp })
    }
    return months
  },[])

  return (
    <DCard index={index}>
      <div style={{ marginBottom:18 }}>
        <p style={{ color:T.white,fontSize:16,fontWeight:700 }}>Income & spending trend</p>
        <p style={{ color:T.subtle,fontSize:12,fontStyle:"italic",marginTop:3 }}>Illustrative — based on your current figures</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top:5,right:5,bottom:5,left:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A2540" vertical={false}/>
          <XAxis dataKey="label" tick={{ fill:T.subtle,fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis tickFormatter={v=>`£${(v/1000).toFixed(1)}k`} tick={{ fill:T.subtle,fontSize:10 }} width={40} axisLine={false} tickLine={false}/>
          <Tooltip content={<DarkTooltip/>}/>
          <Line type="monotone" dataKey="income"   name="Income"   stroke={T.teal}  strokeWidth={2} dot={false} activeDot={{ r:4 }}/>
          <Line type="monotone" dataKey="spending" name="Spending" stroke={T.red}   strokeWidth={2} dot={false} activeDot={{ r:4 }}/>
          <Line type="monotone" dataKey="surplus"  name="Surplus"  stroke={T.muted} strokeWidth={1.5} strokeDasharray="4 4" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display:"flex",gap:20,marginTop:10,flexWrap:"wrap" }}>
        {[["Income",T.teal],["Spending",T.red],["Surplus",T.muted]].map(([l,c])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:6 }}>
            <div style={{ width:10,height:2,background:c,borderRadius:1 }}/>
            <span style={{ color:T.subtle,fontSize:11 }}>{l}</span>
          </div>
        ))}
      </div>
    </DCard>
  )
}

/* ── INCOME RESILIENCE BAR ───────────────────────────────────────────────── */
function IncomeResilienceBar({ resilience, hasAdditional, index }) {
  const [width,setWidth] = useState(0)
  useEffect(()=>{ const t=setTimeout(()=>setWidth(resilience),200); return ()=>clearTimeout(t) },[resilience])
  const label = resilience>=95?"Almost all income comes from one source.":resilience>=80?"Moderate reliance on your primary income.":"Your income is diversified. Nice work."
  const labelCol = resilience>=95?T.amber:resilience>=80?T.amber:T.teal

  return (
    <DCard index={index}>
      <CardTitle>Income resilience</CardTitle>
      <div style={{ background:T.faint,borderRadius:99,height:10,overflow:"hidden",marginBottom:12 }}>
        <div style={{ width:`${width}%`,height:"100%",background:resilience>=80?T.amber:T.teal,borderRadius:99,transition:"width .8s cubic-bezier(.16,1,.3,1)" }}/>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <p style={{ color:labelCol,fontSize:13,fontWeight:500 }}>{label}</p>
        <p style={{ color:T.subtle,fontSize:13,fontWeight:700,fontVariantNumeric:"tabular-nums" }}>{resilience}%</p>
      </div>
      {!hasAdditional && <p style={{ color:T.subtle,fontSize:12,fontStyle:"italic",marginTop:6 }}>A second income stream could reduce your reliance on one source.</p>}
    </DCard>
  )
}

/* ── INTEREST DRAG CHART ─────────────────────────────────────────────────── */
function InterestDragChart({ debts, totalDrag, index }) {
  const comparable = totalDrag<500?"roughly the cost of a weekend away each year":totalDrag<1200?"roughly the cost of a new laptop each year":totalDrag<2500?"roughly the cost of a family holiday each year":totalDrag<5000?"roughly the cost of a year of dining out":totalDrag<10000?"roughly the cost of a new car deposit":"a very significant ongoing cost"

  const topDebts = [...debts]
    .map(d=>({ name:d.name.length>16?d.name.slice(0,14)+"…":d.name, cost:Math.round(annualInterest(d)) }))
    .sort((a,b)=>b.cost-a.cost)

  const highest = debts.reduce((best,d)=>(!best||annualInterest(d)>annualInterest(best)?d:best),null)

  return (
    <DCard index={index}>
      <CardTitle chip="Estimated">Cost of debt</CardTitle>
      <p style={{ color:T.white,fontSize:28,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{fmt(Math.round(totalDrag))} <span style={{ fontSize:14,color:T.muted,fontWeight:500 }}>per year</span></p>
      <p style={{ color:T.muted,fontSize:13,marginTop:4,marginBottom:debts.length>1?16:8 }}>That's {comparable}.</p>
      {debts.length>1 && (
        <ResponsiveContainer width="100%" height={Math.min(debts.length*36+20,140)}>
          <BarChart layout="vertical" data={topDebts} margin={{ top:0,right:40,bottom:0,left:0 }}>
            <XAxis type="number" hide/>
            <YAxis type="category" dataKey="name" tick={{ fill:T.muted,fontSize:11 }} width={110} axisLine={false} tickLine={false}/>
            <Tooltip content={({active,payload})=>{ if(!active||!payload?.length) return null; return <div style={{ background:"#0A1020",border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 12px" }}><p style={{ color:T.red,fontSize:12,fontWeight:700 }}>{fmt(payload[0].value)}/yr</p></div> }}/>
            <Bar dataKey="cost" fill={T.red} radius={[0,6,6,0]}/>
          </BarChart>
        </ResponsiveContainer>
      )}
      {highest && <p style={{ color:T.teal,fontSize:13,marginTop:12 }}>Clearing your highest-rate debt could free up {fmt(Math.round(annualInterest(highest)/12))} per month.</p>}
    </DCard>
  )
}

/* ── DEBT PAYOFF CARD ────────────────────────────────────────────────────── */
function DebtPayoffCard({ debts, surplus, index }) {
  if(surplus<=0) return (
    <DCard index={index}>
      <CardTitle>Debt-free outlook</CardTitle>
      <p style={{ color:T.amber,fontSize:14,lineHeight:1.6 }}>Improving your monthly surplus would accelerate your debt payoff significantly.</p>
    </DCard>
  )
  const sorted = [...debts].sort((a,b)=>(b.balance||0)-(a.balance||0))
  const primary = sorted[0]
  const rest = sorted.slice(1)
  const monthsTo = d => Math.round((d.balance||0)/Math.max(surplus*0.4,1))
  const payoffLabel = d => { const dt=new Date(); dt.setMonth(dt.getMonth()+monthsTo(d)); return dt.toLocaleDateString("en-GB",{ month:"long",year:"numeric" }) }

  return (
    <DCard index={index}>
      <CardTitle>Debt-free outlook</CardTitle>
      <p style={{ color:T.white,fontSize:15,lineHeight:1.65,marginBottom:14 }}>
        At your current pace, you could clear <span style={{ color:T.teal,fontWeight:700 }}>{primary.name}</span> by {payoffLabel(primary)}.
      </p>
      {rest.length>0 && (
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          {rest.map(d=>(
            <p key={d.id} style={{ color:T.muted,fontSize:13 }}>{d.name} — <span style={{ color:T.white,fontWeight:600 }}>{payoffLabel(d)}</span></p>
          ))}
        </div>
      )}
      <p style={{ color:T.subtle,fontSize:11,fontStyle:"italic",marginTop:12 }}>Assumes 40% of surplus goes toward debt repayment.</p>
    </DCard>
  )
}

/* ── AGE BENCHMARK ───────────────────────────────────────────────────────── */
function AgeBenchmarkCard({ age, nw, index }) {
  const bench = getAgeBenchmark(age)
  const maxVal = Math.max(bench.median, Math.abs(nw), 1)
  const typicalW = (bench.median/maxVal)*100
  const youW = Math.min((Math.abs(nw)/maxVal)*100, 100)
  const framing = nw<0?"Your balance is currently negative. That is a starting point, not a destination.":nw<bench.median?"You are building. Everyone starts somewhere, and you have started.":"You are ahead of where many people are at your age."
  const framingCol = nw<0?T.amber:nw<bench.median?T.muted:T.teal

  return (
    <DCard index={index}>
      <CardTitle>How you compare</CardTitle>
      <p style={{ color:T.muted,fontSize:14,marginBottom:18 }}>People aged <strong style={{ color:T.white }}>{bench.label}</strong> typically have a net worth of around <strong style={{ color:T.white }}>{fmt(bench.median)}</strong>.</p>
      {[["Typical",typicalW,T.tealDim,T.tealBorder,fmt(bench.median)],["You",Math.max(youW,2),nw>=0?T.tealDim:T.amberDim,nw>=0?T.tealBorder:T.amberBorder,fmt(nw)]].map(([l,w,bg,bord,val])=>(
        <div key={l} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
            <span style={{ color:T.subtle,fontSize:12,fontWeight:600 }}>{l}</span>
            <span style={{ color:T.white,fontSize:12,fontWeight:700,fontVariantNumeric:"tabular-nums" }}>{val}</span>
          </div>
          <div style={{ background:T.faint,borderRadius:99,height:8,overflow:"hidden" }}>
            <div style={{ width:`${w}%`,height:"100%",background:bg,border:`1px solid ${bord}`,borderRadius:99,transition:"width 1s ease-out" }}/>
          </div>
        </div>
      ))}
      <p style={{ color:framingCol,fontSize:13,lineHeight:1.6,marginTop:10 }}>{framing}</p>
      <p style={{ color:T.subtle,fontSize:11,fontStyle:"italic",marginTop:6 }}>Approximate UK figures, for context only.</p>
    </DCard>
  )
}

/* ── NEXT BEST ACTIONS ───────────────────────────────────────────────────── */
function NextBestActions({ safetyNetMonths, interestDrag, wealthBuilders, totalAssets, resilience, surplus, index }) {
  const actions = []
  if(safetyNetMonths<3) actions.push({ Icon:Shield, title:"Build your safety net", benefit:"Three months of buffer changes everything. Start small.", cta:"Set a goal →" })
  if(interestDrag>1200) actions.push({ Icon:TrendingDown, title:"Cut your interest drag", benefit:"Clearing high-rate debt is the safest guaranteed return.", cta:"See debts →" })
  if(wealthBuilders/Math.max(totalAssets,1)<0.1&&totalAssets>5000) actions.push({ Icon:TrendingUp, title:"Put your money to work", benefit:"Even a small amount in growth assets shifts your trajectory.", cta:"Open Learn →" })
  if(resilience>95) actions.push({ Icon:GitBranch, title:"Diversify your income", benefit:"A second stream reduces your reliance on one source.", cta:"Open Learn →" })
  while(actions.length<3) actions.push({ Icon:RefreshCw, title:"Keep your picture sharp", benefit:"Updating monthly keeps your plan accurate and your goals on track.", cta:"Track →" })
  const show = actions.slice(0,3)

  return (
    <div className="fade-up" style={{ animationDelay:`${index*70}ms` }}>
      <p style={{ color:T.white,fontSize:16,fontWeight:700,marginBottom:14 }}>Next best actions</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
        {show.map((a,i)=>(
          <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 20px 16px" }}>
            <div style={{ width:40,height:40,borderRadius:12,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}>
              <a.Icon size={20} color={T.teal}/>
            </div>
            <p style={{ color:T.white,fontSize:14,fontWeight:700,marginBottom:8 }}>{a.title}</p>
            <p style={{ color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:12 }}>{a.benefit}</p>
            <p style={{ color:T.teal,fontSize:12,fontWeight:700 }}>{a.cta}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── FULL HOME TAB ───────────────────────────────────────────────────────── */
const BOOSTS=["You've already done the hardest part — starting.","Every update makes this picture sharper.","Small consistent actions compound. This is how wealth is built.","Clarity is the first step. You've taken it.","You are building something future you will thank you for."]

function HomeTab() {
  const { state, setView } = useApp()
  const { assets, debts, income, spending, profile, history } = state
  const { totalAssets:ta, totalDebts:td, netWorth:nw } = calcTotals(assets,debts)
  const surplusVal = calcSurplus(income,assets,spending)
  const totalInc   = calcIncome(income,assets)
  const { safetyNet, wealthBuilders, lifeAssets } = buckets(assets)
  const runwayMonths = spending.monthly>0 ? safetyNet/spending.monthly : 0
  const resilience   = incomeResilience(income,assets)
  const interestDrag = totalInterestDrag(debts)
  const boost = BOOSTS[new Date().getDate()%BOOSTS.length]

  if(assets.length===0&&debts.length===0) return (
    <div style={{ flex:1,overflowY:"auto",padding:"48px 40px 120px" }}>
      <div style={{ maxWidth:680 }}>
        <h1 style={{ color:T.white,fontSize:"clamp(24px,4vw,36px)",fontWeight:900,marginBottom:10 }}>Hi {profile.name||"there"} 👋</h1>
        <p style={{ color:T.muted,fontSize:16,marginBottom:36,lineHeight:1.6 }}>Your dashboard is empty. Add your assets and debts to see your full financial picture.</p>
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:20,padding:"28px 32px",maxWidth:520 }}>
          <p style={{ color:T.teal,fontWeight:800,fontSize:17,marginBottom:8 }}>Ready to get started?</p>
          <p style={{ color:T.muted,fontSize:15,lineHeight:1.65,marginBottom:24 }}>It only takes a few minutes. Estimates are absolutely fine.</p>
          <Btn onClick={()=>setView("assets")} style={{ maxWidth:260 }}>Add my first asset →</Btn>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"32px 40px 120px" }}>
      <div style={{ maxWidth:1200,margin:"0 auto",display:"flex",flexDirection:"column",gap:16 }}>

        {/* Header */}
        <div className="fade-up" style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
          <div>
            <h1 style={{ color:T.white,fontSize:"clamp(20px,3vw,30px)",fontWeight:900 }}>Hi {profile.name||"there"} 👋</h1>
            <p style={{ color:T.muted,fontSize:14,marginTop:4 }}>Your financial freedom picture — {new Date().toLocaleDateString("en-GB",{ day:"numeric",month:"long",year:"numeric" })}</p>
          </div>
          <button onClick={()=>setView("assets")} style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"8px 14px",cursor:"pointer",color:T.teal,fontSize:12,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap" }}>Update figures →</button>
        </div>

        {/* "Come back and update" prompt — shows after 60 days */}
        {profile.lastCheckIn && (() => {
          const daysSince = Math.floor((Date.now() - new Date(profile.lastCheckIn)) / 86400000)
          if(daysSince < 60) return null
          return (
            <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:14,padding:"14px 20px",display:"flex",alignItems:"center",gap:12 }}>
              <span style={{ fontSize:18,flexShrink:0 }}>📅</span>
              <div style={{ flex:1 }}>
                <p style={{ color:T.amber,fontWeight:700,fontSize:14,marginBottom:2 }}>Time for a refresh</p>
                <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>It has been {daysSince} days since your last update. Asset values and debt balances change — keeping them current gives you a much more accurate picture of where you are heading.</p>
              </div>
              <button onClick={()=>setView("assets")} style={{ background:T.amber,border:"none",borderRadius:9,padding:"8px 14px",cursor:"pointer",color:"#000",fontWeight:700,fontSize:12,fontFamily:"inherit",flexShrink:0 }}>Update now</button>
            </div>
          )
        })()}

        {/* Net worth hero — first thing user sees */}
        <NetWorthHero nw={nw} ta={ta} td={td} assetCount={assets.length} debtCount={debts.length} history={history} index={1}/>

        {/* KPIs — monthly surplus + donut */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <DCard index={2} style={{ display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <p style={{ color:T.subtle,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>MONTHLY</p>
            <p style={{ color:surplusVal>=0?T.teal:T.amber,fontSize:"clamp(22px,3vw,34px)",fontWeight:900,fontVariantNumeric:"tabular-nums",lineHeight:1 }}>{surplusVal>=0?"+":""}{fmt(surplusVal)}</p>
            <p style={{ color:T.subtle,fontSize:13,marginTop:8 }}>{surplusVal>=0?"Monthly surplus":"Monthly shortfall"}</p>
            {surplusVal>0&&<p style={{ color:T.muted,fontSize:12,marginTop:4 }}>~{fmt(surplusVal*12)}/yr potential</p>}
          </DCard>
          <DCard index={3} style={{ padding:"18px 20px" }}>
            <p style={{ color:T.subtle,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14 }}>Your assets broken down</p>
            <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:16 }}>
              <div style={{ position:"relative",flexShrink:0 }}>
                <PieChart width={80} height={80}>
                  <Pie data={(() => { const sl=[{name:"Safety net",value:safetyNet,color:T.teal},{name:"Wealth",value:wealthBuilders,color:T.purple},{name:"Life assets",value:lifeAssets,color:T.amber}].filter(s=>s.value>0); return sl.length>0?sl:[{name:"None",value:1,color:T.border}] })()} cx="50%" cy="50%" innerRadius={24} outerRadius={38} paddingAngle={2} dataKey="value" stroke="none">
                    {[{value:safetyNet,color:T.teal},{value:wealthBuilders,color:T.purple},{value:lifeAssets,color:T.amber}].filter(s=>s.value>0).map((s,i)=><Cell key={i} fill={s.color}/>)}
                  </Pie>
                </PieChart>
              </div>
              <div style={{ flex:1,display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  { label:"Safety net", sub:"Savings you can access quickly", value:safetyNet, color:T.teal },
                  { label:"Wealth builders", sub:"Investments growing over time", value:wealthBuilders, color:T.purple },
                  { label:"Life assets", sub:"Property, vehicles, business", value:lifeAssets, color:T.amber },
                ].map(r=>(
                  <div key={r.label} style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:8,height:8,borderRadius:"50%",background:r.color,flexShrink:0,marginTop:1 }}/>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline" }}>
                        <span style={{ color:T.white,fontSize:12,fontWeight:700 }}>{r.label}</span>
                        <span style={{ color:r.value>0?r.color:T.subtle,fontSize:12,fontWeight:800,fontVariantNumeric:"tabular-nums" }}>{fmtK(r.value)}</span>
                      </div>
                      <p style={{ color:T.subtle,fontSize:10,marginTop:1 }}>{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DCard>
        </div>

        {/* FIRE number */}
        {spending.monthly > 0 && (() => {
          const annualSpend = spending.monthly * 12
          const fireNum = annualSpend * 25
          const pct = Math.min(100, Math.round((nw / fireNum) * 100))
          const yearsLeft = surplusVal > 0 ? Math.round((fireNum - nw) / (surplusVal * 12)) : null
          return (
            <DCard index={5} style={{ background:`linear-gradient(135deg,${T.card},${T.faint})`,border:`1px solid ${T.tealBorder}` }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12 }}>
                <div>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                    <span style={{ fontSize:16 }}>🔥</span>
                    <p style={{ color:T.teal,fontSize:11,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase" }}>Financial freedom number</p>
                  </div>
                  <p style={{ color:T.white,fontSize:"clamp(22px,3vw,32px)",fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{fmt(fireNum)}</p>
                  <p style={{ color:T.muted,fontSize:13,marginTop:4 }}>The amount that lets your money work so you don't have to</p>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <p style={{ color:pct>=100?"#22C55E":T.teal,fontSize:24,fontWeight:900 }}>{pct}%</p>
                  <p style={{ color:T.subtle,fontSize:11 }}>of the way there</p>
                </div>
              </div>
              <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:8 }}>
                <div style={{ width:`${pct}%`,height:"100%",background:pct>=100?"#22C55E":T.teal,borderRadius:99,transition:"width 1s ease-out" }}/>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <p style={{ color:T.subtle,fontSize:12 }}>Current net worth {fmt(nw)}</p>
                {yearsLeft !== null && yearsLeft > 0 && <p style={{ color:T.muted,fontSize:12 }}>~{yearsLeft} year{yearsLeft!==1?"s":""} at current pace</p>}
                {pct >= 100 && <p style={{ color:"#22C55E",fontWeight:700,fontSize:13 }}>You have reached it 🎉</p>}
              </div>
              <div style={{ background:T.faint,borderRadius:10,padding:"10px 14px",marginTop:12 }}>
                <p style={{ color:T.subtle,fontSize:12,lineHeight:1.6 }}>Based on the 4% rule: invest 25x your annual spending and you can live off returns without touching the principal. Your spending: {fmt(annualSpend)}/year.</p>
              </div>
            </DCard>
          )
        })()}
        <div className="fade-up" style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"13px 20px",display:"flex",alignItems:"center",gap:11,animationDelay:"360ms" }}>
          <Sparkles size={15} color={T.teal} style={{ flexShrink:0 }}/><p style={{ color:"#CBD5E1",fontSize:14,fontStyle:"italic" }}>{boost}</p>
        </div>

        {/* Freedom runway */}
        <FreedomRunwayCard months={runwayMonths} index={6}/>

        {/* Projection */}
        <ProjectionChart nw={nw} surplus={surplusVal} currentAge={profile.age} index={7}/>

        {/* Safety net gauge */}
        <SafetyNetGauge months={runwayMonths} spending={spending.monthly||0} index={8}/>

        {/* Income trend */}
        {totalInc>0 && <IncomeTrendChart totalIncome={totalInc} spending={spending.monthly||0} index={9}/>}

        {/* Resilience */}
        {totalInc>0 && <IncomeResilienceBar resilience={resilience} hasAdditional={(income.additional||[]).length>0} index={10}/>}

        {/* Debt cards — conditional */}
        {debts.length>0 && <InterestDragChart debts={debts} totalDrag={interestDrag} index={11}/>}
        {debts.length>0 && <DebtPayoffCard debts={debts} surplus={surplusVal} index={12}/>}

        {/* Age benchmark — conditional */}
        {profile.age && <AgeBenchmarkCard age={profile.age} nw={nw} index={13}/>}

        {/* Next best actions */}
        <NextBestActions safetyNetMonths={runwayMonths} interestDrag={interestDrag} wealthBuilders={wealthBuilders} totalAssets={ta} resilience={resilience} surplus={surplusVal} index={14}/>

      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD 3 — TRACK TAB
═══════════════════════════════════════════════════════════════════════════ */

function SegmentedControl({ options, active, onChange }) {
  return (
    <div style={{ display:"flex",background:T.surface,borderRadius:14,padding:4,gap:3,margin:"0 0 16px" }}>
      {options.map(o=>(
        <button key={o} onClick={()=>onChange(o)}
          style={{ flex:1,padding:"10px 8px",borderRadius:11,border:"none",background:active===o?T.teal:"transparent",color:active===o?"#fff":T.muted,fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s",fontFamily:"inherit" }}>
          {o}
        </button>
      ))}
    </div>
  )
}

function FloatingAdd({ onClick }) {
  return (
    <button onClick={onClick} style={{ position:"fixed",bottom:82,right:24,width:52,height:52,borderRadius:"50%",background:T.teal,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(14,165,160,.5)",zIndex:90,transition:"transform .15s" }}
      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
      <Plus size={22} color="#fff"/>
    </button>
  )
}

/* Assets view */
function AssetsView() {
  const { state, save, toast } = useApp()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editAsset, setEditAsset] = useState(null)
  const sorted = [...state.assets].sort((a,b)=>(b.value||0)-(a.value||0))
  const { totalAssets } = calcTotals(state.assets, state.debts)

  function saveAsset(data, addAnother) {
    let assets=[...state.assets], debts=[...state.debts]
    if(data.existingId) {
      // Determine new linkedDebtId
      let linkedDebtId = data.existingLinkedDebtId || null
      if(data.hasLoan && data.loanBal>0 && data.existingLinkedDebtId) {
        // Update existing linked debt
        debts = debts.map(d=>d.id!==data.existingLinkedDebtId?d:{ ...d,balance:data.loanBal,interestRate:data.loanRate })
      } else if(data.hasLoan && data.loanBal>0 && !data.existingLinkedDebtId) {
        // Adding a loan to an asset that didn't have one
        const did = data.existingId+"_d"+Date.now()
        linkedDebtId = did
        debts.push({ id:did,category:debtCatFrom(data.cat),name:`${data.name} loan`,balance:data.loanBal,interestRate:data.loanRate,linkedAssetId:data.existingId,isAutoCreated:true })
      } else if(!data.hasLoan && data.existingLinkedDebtId) {
        // Removing a loan
        debts = debts.filter(d=>d.id!==data.existingLinkedDebtId)
        linkedDebtId = null
      }
      assets = assets.map(a=>a.id!==data.existingId?a:{ ...a,category:data.cat,name:data.name,value:data.val,monthlyIncome:data.monthlyIncome,linkedDebtId })
    } else {
      const aid=Date.now().toString(); let linkedDebtId=null
      if(data.hasLoan&&data.loanBal>0){ const did=aid+"_d"; linkedDebtId=did; debts.push({ id:did,category:debtCatFrom(data.cat),name:`${data.name} loan`,balance:data.loanBal,interestRate:data.loanRate,linkedAssetId:aid,isAutoCreated:true }) }
      assets.push({ id:aid,category:data.cat,name:data.name,value:data.val,monthlyIncome:data.monthlyIncome,linkedDebtId })
    }
    save({ ...state,assets,debts }); toast("Asset saved")
    if(!addAnother){ setSheetOpen(false); setEditAsset(null) }
  }

  function deleteAsset(a) {
    const linked=a.linkedDebtId?state.debts.find(d=>d.id===a.linkedDebtId):null
    if(!window.confirm(linked?`Delete "${a.name}" and its linked loan?`:`Delete "${a.name}"?`)) return
    save({ ...state, assets:state.assets.filter(x=>x.id!==a.id), debts:linked?state.debts.filter(d=>d.id!==linked.id):state.debts })
    toast("Deleted")
  }

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"0 32px 120px" }}>
      {sorted.length===0 ? (
        <div style={{ textAlign:"center",padding:"60px 20px" }}>
          <div style={{ width:64,height:64,borderRadius:20,background:T.tealDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}><PiggyBank size={28} color={T.teal}/></div>
          <p style={{ color:T.white,fontWeight:700,fontSize:16,marginBottom:6 }}>No assets yet</p>
          <p style={{ color:T.muted,fontSize:14 }}>Tap + to add something you own.</p>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {sorted.map(a=>{
            const linked=a.linkedDebtId?state.debts.find(d=>d.id===a.linkedDebtId):null
            return (
              <div key={a.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:13 }}>
                <CatIcon cat={a.category} size={44}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.name}</p>
                  <p style={{ color:T.subtle,fontSize:12,marginTop:2 }}>{CAT[a.category]?.label}</p>
                  <div style={{ display:"flex",gap:6,marginTop:5,flexWrap:"wrap" }}>
                    {linked && <Tag color="amber">Linked loan: {fmt(linked.balance)}</Tag>}
                    {a.monthlyIncome>0 && <Tag color="teal">{fmt(a.monthlyIncome)}/mo income</Tag>}
                  </div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <p style={{ color:T.teal,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums" }}>{fmt(a.value)}</p>
                  <div style={{ display:"flex",gap:4,marginTop:6,justifyContent:"flex-end" }}>
                    <button onClick={()=>{ setEditAsset(a); setSheetOpen(true) }} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
                    <button onClick={()=>deleteAsset(a)} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>
                  </div>
                </div>
              </div>
            )
          })}
          <p style={{ color:T.subtle,fontSize:13,textAlign:"center",paddingTop:4 }}>Total: <span style={{ color:T.teal,fontWeight:700 }}>{fmt(totalAssets)}</span> across {sorted.length} asset{sorted.length!==1?"s":""}</p>
        </div>
      )}
      <FloatingAdd onClick={()=>{ setEditAsset(null); setSheetOpen(true) }}/>
      {sheetOpen && <AssetSheet asset={editAsset} preCat={null} onClose={()=>{ setSheetOpen(false); setEditAsset(null) }} onSave={saveAsset} key={editAsset?.id||"new"}/>}
    </div>
  )
}

/* Debts view */
function DebtsView() {
  const { state, save, toast } = useApp()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editDebt, setEditDebt]   = useState(null)
  const autoDebts   = state.debts.filter(d=>d.isAutoCreated).sort((a,b)=>b.balance-a.balance)
  const manualDebts = state.debts.filter(d=>!d.isAutoCreated).sort((a,b)=>b.balance-a.balance)
  const totalD = state.debts.reduce((s,d)=>s+(d.balance||0),0)
  const drag   = totalInterestDrag(state.debts)

  function saveDebt(data, addAnother) {
    let debts=[...state.debts]
    if(data.existingId) debts=debts.map(d=>d.id!==data.existingId?d:{ ...d,category:data.cat,name:data.name,balance:data.bal,interestRate:data.rate })
    else debts.push({ id:Date.now().toString(),category:data.cat,name:data.name,balance:data.bal,interestRate:data.rate,linkedAssetId:null,isAutoCreated:false })
    save({ ...state,debts }); toast("✓  Debt saved")
    if(!addAnother){ setSheetOpen(false); setEditDebt(null) }
  }

  function DebtRow({ debt, isAuto }) {
    const linkedAsset = isAuto ? state.assets.find(a=>a.id===debt.linkedAssetId) : null
    const rate = debt.interestRate ?? DEFAULT_RATES[debt.category] ?? 10
    return (
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:13 }}>
        <CatIcon cat={debt.category} size={44}/>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{debt.name}</p>
          <p style={{ color:T.subtle,fontSize:12,marginTop:2 }}>
            {debt.interestRate!=null ? `${debt.interestRate}% p.a.` : `~${rate}% p.a. (estimated)`}
          </p>
          {isAuto && linkedAsset && (
            <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:4 }}>
              <Lock size={10} color={T.amber}/><span style={{ color:T.amber,fontSize:11,fontWeight:600 }}>Edit via "{linkedAsset.name}"</span>
            </div>
          )}
        </div>
        <div style={{ textAlign:"right",flexShrink:0 }}>
          <p style={{ color:T.red,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums" }}>{fmt(debt.balance)}</p>
          {!isAuto && (
            <div style={{ display:"flex",gap:4,marginTop:6,justifyContent:"flex-end" }}>
              <button onClick={()=>{ setEditDebt(debt); setSheetOpen(true) }} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
              <button onClick={()=>{ if(!window.confirm(`Delete "${debt.name}"?`)) return; save({ ...state,debts:state.debts.filter(x=>x.id!==debt.id) }); toast("Deleted") }} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"0 32px 120px" }}>
      {state.debts.length===0 ? (
        <div style={{ textAlign:"center",padding:"60px 20px" }}>
          <div style={{ width:64,height:64,borderRadius:20,background:T.redDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}><TrendingDown size={28} color={T.red}/></div>
          <p style={{ color:T.white,fontWeight:700,fontSize:16,marginBottom:6 }}>No debts recorded</p>
          <p style={{ color:T.muted,fontSize:14 }}>Add any money you owe for a complete picture.</p>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {autoDebts.length>0 && <>
            <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2 }}>Linked to assets</p>
            {autoDebts.map(d=><DebtRow key={d.id} debt={d} isAuto/>)}
          </>}
          {manualDebts.length>0 && <>
            {autoDebts.length>0 && <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginTop:8,marginBottom:2 }}>Other debts</p>}
            {manualDebts.map(d=><DebtRow key={d.id} debt={d} isAuto={false}/>)}
          </>}
          <div style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:14,padding:"12px 16px",marginTop:4,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
            <p style={{ color:T.muted,fontSize:13 }}>Total: <span style={{ color:T.red,fontWeight:700 }}>{fmt(totalD)}</span></p>
            <p style={{ color:T.muted,fontSize:13 }}>Est. annual interest: <span style={{ color:T.red,fontWeight:700 }}>{fmt(Math.round(drag))}</span></p>
          </div>
        </div>
      )}
      <FloatingAdd onClick={()=>{ setEditDebt(null); setSheetOpen(true) }}/>
      {sheetOpen && <DebtSheet debt={editDebt} onClose={()=>{ setSheetOpen(false); setEditDebt(null) }} onSave={saveDebt} key={editDebt?.id||"new"}/>}
    </div>
  )
}

/* Income view */
/* ── SPENDING BREAKDOWN DATA ─────────────────────────────────────────────── */
const SPENDING_CATS = [
  { id:"housing",    label:"Housing",          hint:"Rent or mortgage, insurance, council tax",  bucket:"needs",   icon:"🏠" },
  { id:"food",       label:"Groceries",        hint:"Supermarket, fresh food",                    bucket:"needs",   icon:"🛒" },
  { id:"transport",  label:"Transport",        hint:"Fuel, public transport, car costs",          bucket:"needs",   icon:"🚗" },
  { id:"bills",      label:"Bills & utilities",hint:"Gas, electric, broadband, phone",            bucket:"needs",   icon:"💡" },
  { id:"eating_out", label:"Eating out",       hint:"Restaurants, cafés, takeaways",              bucket:"wants",   icon:"🍕" },
  { id:"subscriptions",label:"Subscriptions", hint:"Netflix, Spotify, gym, apps",                bucket:"wants",   icon:"📱" },
  { id:"shopping",   label:"Shopping",         hint:"Clothes, household, Amazon",                 bucket:"wants",   icon:"🛍️" },
  { id:"entertainment",label:"Entertainment",  hint:"Nights out, events, hobbies",               bucket:"wants",   icon:"🎉" },
  { id:"savings_inv",label:"Savings & investing",hint:"ISA contributions, savings pots",         bucket:"savings", icon:"💰" },
  { id:"pension_extra",label:"Extra pension",  hint:"Voluntary contributions above employer",    bucket:"savings", icon:"🏦" },
  { id:"other",      label:"Other",            hint:"Anything else",                              bucket:"needs",   icon:"📋" },
]
const BUCKET_CFG = {
  needs:   { label:"Needs",   color:T.blue,   dim:"rgba(59,130,246,.12)", border:"rgba(59,130,246,.3)",  ideal:50, desc:"Essential living costs" },
  wants:   { label:"Wants",   color:T.purple, dim:T.purpleDim,            border:"rgba(139,92,246,.3)",  ideal:30, desc:"Lifestyle spending" },
  savings: { label:"Savings", color:T.teal,   dim:T.tealDim,              border:T.tealBorder,            ideal:20, desc:"Future you" },
}

function genSpendingInsights(breakdown, totalSpending) {
  const insights = []
  const eating  = breakdown.eating_out  || 0
  const subs    = breakdown.subscriptions || 0
  const shopping = breakdown.shopping   || 0
  const savings  = breakdown.savings_inv || 0
  const housing  = breakdown.housing    || 0
  if(eating > totalSpending * 0.12)    insights.push({ icon:"🍕", type:"wants",   text:`Eating out is £${Math.round(eating)}/mo — ${Math.round(eating/totalSpending*100)}% of spending. Cutting back by half could free £${Math.round(eating*0.5)}/mo.` })
  if(subs > 120)                        insights.push({ icon:"📱", type:"wants",   text:`You're spending £${Math.round(subs)}/mo on subscriptions. Auditing these once a year typically saves £30–60/mo.` })
  if(shopping > totalSpending * 0.15)  insights.push({ icon:"🛍️", type:"wants",   text:`Shopping at £${Math.round(shopping)}/mo is above average. A spending audit could reveal easy wins.` })
  if(savings < totalSpending * 0.1)    insights.push({ icon:"💰", type:"savings", text:`You're saving less than 10% of spending. Even £${Math.round(totalSpending*0.05)}/mo extra into an ISA compounds significantly over time.` })
  if(housing > totalSpending * 0.4)    insights.push({ icon:"🏠", type:"needs",   text:`Housing is taking ${Math.round(housing/totalSpending*100)}% of spending. The rule of thumb is under 30% of take-home income.` })
  if(insights.length === 0)            insights.push({ icon:"✅", type:"positive", text:"Your spending looks well balanced. Keep reviewing it monthly to catch any drift." })
  return insights
}

function SpendingBreakdownSheet({ spending, existing, onSave, onClose }) {
  const [vals, setVals] = useState(() => {
    const init = {}
    SPENDING_CATS.forEach(c=>{ init[c.id] = existing?.[c.id] || 0 })
    return init
  })
  const set = (id, v) => setVals(p=>({ ...p, [id]:v }))
  const total = Object.values(vals).reduce((s,v)=>s+(v||0), 0)
  const diff  = spending - total

  return (
    <Sheet title="Spending breakdown" onClose={onClose}>
      <p style={{ color:T.muted,fontSize:14,lineHeight:1.65,marginBottom:20 }}>Break your total spending of <strong style={{ color:T.white }}>{fmt(spending)}/mo</strong> into categories. Estimates are fine — this helps us give you useful suggestions.</p>
      <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:20 }}>
        {SPENDING_CATS.map(c=>{
          const cfg = BUCKET_CFG[c.bucket]
          return (
            <div key={c.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:13,padding:"12px 14px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                <span style={{ fontSize:18 }}>{c.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:T.white,fontSize:13,fontWeight:700 }}>{c.label}</p>
                  <p style={{ color:T.subtle,fontSize:11 }}>{c.hint}</p>
                </div>
                <span style={{ fontSize:10,fontWeight:700,color:cfg.color,background:cfg.dim,border:`1px solid ${cfg.border}`,borderRadius:99,padding:"2px 8px" }}>{cfg.label}</span>
              </div>
              <div style={{ display:"flex",alignItems:"center",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,overflow:"hidden" }}>
                <span style={{ padding:"0 12px",color:T.subtle,fontSize:15,fontWeight:700 }}>£</span>
                <input type="number" min="0" value={vals[c.id]||""} placeholder="0"
                  onChange={e=>set(c.id, Math.max(0,parseFloat(e.target.value)||0))}
                  style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:14,fontWeight:600,padding:"10px 12px 10px 0",fontFamily:"inherit" }}/>
                <span style={{ padding:"0 12px",color:T.subtle,fontSize:12 }}>/mo</span>
              </div>
            </div>
          )
        })}
      </div>
      {/* Running total */}
      <div style={{ background:Math.abs(diff)<50?T.tealDim:T.amberDim,border:`1px solid ${Math.abs(diff)<50?T.tealBorder:T.amberBorder}`,borderRadius:13,padding:"14px 16px",marginBottom:16 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <p style={{ color:T.muted,fontSize:13 }}>Allocated: <strong style={{ color:T.white }}>{fmt(total)}</strong></p>
          <p style={{ color:T.muted,fontSize:13 }}>Total: <strong style={{ color:T.white }}>{fmt(spending)}</strong></p>
        </div>
        <p style={{ color:Math.abs(diff)<50?T.teal:T.amber,fontSize:12,marginTop:5 }}>
          {Math.abs(diff)<50?"✓ Roughly matched":`${diff>0?`£${Math.round(diff)} unallocated`:`£${Math.round(-diff)} over budget`}`}
        </p>
      </div>
      <Btn onClick={()=>onSave(vals)}>Save breakdown & see insights</Btn>
    </Sheet>
  )
}

function IncomeView() {
  const { state, save, toast } = useApp()
  const [editing, setEditing]       = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const totalIncome = calcIncome(state.income, state.assets)
  const surplus     = calcSurplus(state.income, state.assets, state.spending)
  const breakdown   = state.spending.breakdown || null
  const totalSpending = state.spending.monthly || 0

  function handleSave(data) {
    let inc = { ...state.income }, sp = { ...state.spending }
    if(data.type==="primary")   { inc.primary=data.primary; inc.primarySource=data.primarySource }
    else if(data.type==="spending") { sp.monthly=data.spending }
    else if(data.type==="additional") {
      const existing = inc.additional.find(a=>a.id===data.id)
      if(existing) inc.additional=inc.additional.map(a=>a.id===data.id?{ ...a,label:data.label,amount:data.amount }:a)
      else inc.additional=[...inc.additional,{ id:data.id,label:data.label,amount:data.amount }]
    }
    save({ ...state,income:inc,spending:sp }); toast("✓  Saved"); setEditing(null)
  }

  function saveBreakdown(vals) {
    save({ ...state,spending:{ ...state.spending,breakdown:vals } })
    setShowBreakdown(false); toast("✓  Breakdown saved")
  }

  // Bucket totals from breakdown
  const bucketTotals = breakdown ? Object.entries(breakdown).reduce((acc,[id,v])=>{
    const cat = SPENDING_CATS.find(c=>c.id===id)
    if(cat) acc[cat.bucket] = (acc[cat.bucket]||0) + (v||0)
    return acc
  }, {}) : null

  const insights = breakdown ? genSpendingInsights(breakdown, totalSpending) : []

  const incomeRows = [
    { label:state.income.primarySource||"Primary income", value:state.income.primary, editKey:"primary", icon:TrendingUp, color:T.teal },
    ...state.income.additional.map(a=>({ label:a.label||"Additional income", value:a.amount, editKey:a, icon:TrendingUp, color:T.teal, isAdditional:true })),
    { label:"Monthly spending", value:totalSpending, editKey:"spending", icon:TrendingDown, color:T.red },
  ]

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"0 32px 120px" }}>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {incomeRows.map((r,i)=>(
          <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:40,height:40,borderRadius:12,background:r.color===T.teal?T.tealDim:T.redDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <r.icon size={18} color={r.color}/>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{r.label}</p>
              <p style={{ color:T.subtle,fontSize:12,marginTop:2 }}>{r.color===T.teal?"Income":"Spending"}</p>
            </div>
            <p style={{ color:r.color,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums",marginRight:8 }}>{fmt(r.value)}</p>
            <button onClick={()=>setEditing(r.editKey)} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
            {r.isAdditional && <button onClick={()=>{ save({ ...state,income:{ ...state.income,additional:state.income.additional.filter(a=>a.id!==r.editKey.id) } }); toast("Removed") }} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>}
          </div>
        ))}

        <button onClick={()=>setEditing({ id:null, label:"", amount:0 })}
          style={{ background:"none",border:`1.5px dashed ${T.border}`,borderRadius:13,padding:"12px 18px",color:T.subtle,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit" }}>
          <Plus size={14}/> Add income source
        </button>

        {/* Monthly position */}
        <div style={{ background:surplus>=0?T.tealDim:T.amberDim,border:`1px solid ${surplus>=0?T.tealBorder:T.amberBorder}`,borderRadius:16,padding:"18px 20px" }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>Monthly position</p>
          <p style={{ color:surplus>=0?T.teal:T.amber,fontSize:28,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>
            {surplus>=0?"+":""}{fmt(surplus)} <span style={{ fontSize:14,fontWeight:500,color:T.muted }}>{surplus>=0?"surplus":"shortfall"}</span>
          </p>
          <p style={{ color:T.muted,fontSize:13,marginTop:6 }}>Total in: {fmt(totalIncome)} / month</p>
        </div>

        {/* Spending breakdown section */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:breakdown?14:0 }}>
            <div>
              <p style={{ color:T.white,fontWeight:700,fontSize:15 }}>Spending breakdown</p>
              <p style={{ color:T.subtle,fontSize:12,marginTop:3 }}>Needs · Wants · Savings</p>
            </div>
            <button onClick={()=>setShowBreakdown(true)}
              style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"8px 14px",color:T.teal,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0 }}>
              {breakdown?"Edit":"Break it down →"}
            </button>
          </div>

          {/* Bucket bars */}
          {bucketTotals && (
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
              {Object.entries(BUCKET_CFG).map(([key,cfg])=>{
                const v   = bucketTotals[key] || 0
                const pct = totalSpending > 0 ? Math.round(v/totalSpending*100) : 0
                const idealPct = cfg.ideal
                const over = pct > idealPct + 5
                return (
                  <div key={key}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                        <div style={{ width:8,height:8,borderRadius:"50%",background:cfg.color }}/>
                        <span style={{ color:T.white,fontSize:13,fontWeight:600 }}>{cfg.label}</span>
                        <span style={{ color:T.subtle,fontSize:12 }}>{cfg.desc}</span>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ color:over?T.amber:T.muted,fontSize:11 }}>ideal ~{idealPct}%</span>
                        <span style={{ color:cfg.color,fontWeight:700,fontSize:13 }}>{pct}% · {fmt(v)}</span>
                      </div>
                    </div>
                    <div style={{ background:T.surface,borderRadius:6,height:7,overflow:"hidden" }}>
                      <div style={{ width:`${Math.min(pct,100)}%`,height:"100%",background:over?T.amber:cfg.color,borderRadius:6,transition:"width .8s ease-out" }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2 }}>Insights</p>
              {insights.map((ins,i)=>(
                <div key={i} style={{ background:ins.type==="positive"?T.tealDim:ins.type==="savings"?T.tealDim:T.amberDim,border:`1px solid ${ins.type==="positive"||ins.type==="savings"?T.tealBorder:T.amberBorder}`,borderRadius:11,padding:"10px 14px",display:"flex",gap:10,alignItems:"flex-start" }}>
                  <span style={{ fontSize:16,flexShrink:0,marginTop:1 }}>{ins.icon}</span>
                  <p style={{ color:T.white,fontSize:13,lineHeight:1.6 }}>{ins.text}</p>
                </div>
              ))}
            </div>
          )}

          {!breakdown && (
            <p style={{ color:T.subtle,fontSize:13,lineHeight:1.6,marginTop:4 }}>Split your spending across categories to unlock personalised insights — like where you could cut back and how much it could save you.</p>
          )}
        </div>
      </div>

      {editing!=null && (
        <IncomeEditSheet mode={editing} incomeData={state.income} spendingData={state.spending} onSave={handleSave} onClose={()=>setEditing(null)}/>
      )}
      {showBreakdown && (
        <SpendingBreakdownSheet spending={totalSpending} existing={breakdown} onSave={saveBreakdown} onClose={()=>setShowBreakdown(false)}/>
      )}
    </div>
  )
}

/* Income edit sheet */
function IncomeEditSheet({ mode, incomeData, spendingData, onSave, onClose }) {
  const [primary,setPrimary]   = useState(incomeData?.primary||0)
  const [source,setSource]     = useState(incomeData?.primarySource||"")
  const [label,setLabel]       = useState(typeof mode==="object"?mode.label||"":"")
  const [amount,setAmount]     = useState(typeof mode==="object"&&mode.id?mode.amount||0:0)
  const [spending,setSpending] = useState(spendingData?.monthly||0)

  if(mode==="primary") return (
    <Sheet title="Edit income" onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        <CurrencyInput label="Monthly income after tax" value={primary} onChange={setPrimary}/>
        <Input label="Income source" value={source} onChange={setSource} placeholder="e.g. Salary, Freelance"/>
        <Btn onClick={()=>onSave({ type:"primary",primary,primarySource:source })}>Save</Btn>
      </div>
    </Sheet>
  )
  if(mode==="spending") return (
    <Sheet title="Edit spending" onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        <CurrencyInput label="Monthly spending" value={spending} onChange={setSpending}/>
        <p style={{ fontSize:12,color:T.subtle }}>Include rent/mortgage, bills, food, everything.</p>
        <Btn onClick={()=>onSave({ type:"spending",spending })}>Save</Btn>
      </div>
    </Sheet>
  )
  return (
    <Sheet title={mode?.id?"Edit income source":"Add income source"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        <Input label="Source name" value={label} onChange={setLabel} placeholder="e.g. Rental income, Freelance"/>
        <CurrencyInput label="Monthly amount" value={amount} onChange={setAmount}/>
        <Btn onClick={()=>onSave({ type:"additional",id:mode?.id||Date.now().toString(),label,amount })}>Save</Btn>
      </div>
    </Sheet>
  )
}

/* Track tab summary + segmented control */
function TrackTab() {
  const { state } = useApp()
  const [seg, setSeg] = useState("Assets")
  const { totalAssets, totalDebts, netWorth } = calcTotals(state.assets, state.debts)

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      {/* Summary row */}
      <div style={{ padding:"20px 32px 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0 }}>
        <div style={{ display:"flex",gap:12,marginBottom:14 }}>
          {[["Assets",totalAssets,T.teal,T.tealDim,T.tealBorder],["Debts",totalDebts,T.red,T.redDim,T.redBorder]].map(([l,v,c,bg,b])=>(
            <div key={l} style={{ flex:1,background:bg,border:`1px solid ${b}`,borderRadius:14,padding:"12px 16px",textAlign:"center" }}>
              <p style={{ color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5 }}>{l}</p>
              <p style={{ color:c,fontSize:18,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{fmt(v)}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center" }}>
          <span style={{ color:T.muted,fontSize:13 }}>Net worth </span>
          <span style={{ color:netWorth>=0?T.teal:T.amber,fontSize:17,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{fmt(netWorth)}</span>
        </div>
      </div>
      {/* Segmented control */}
      <div style={{ padding:"14px 32px 0",flexShrink:0 }}>
        <SegmentedControl options={["Assets","Debts","Income"]} active={seg} onChange={setSeg}/>
      </div>
      {/* Content */}
      {seg==="Assets"  && <AssetsView/>}
      {seg==="Debts"   && <DebtsView/>}
      {seg==="Income"  && <IncomeView/>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD 4 — GOALS TAB
═══════════════════════════════════════════════════════════════════════════ */

const GOAL_TYPES = [
  { id:"emergency_fund",  label:"Emergency fund",   icon:"🛡️",  color:T.teal,   dim:T.tealDim,   border:T.tealBorder,   hint:"Build a safety net of 3–6 months of expenses" },
  { id:"pay_off_debt",    label:"Pay off debt",      icon:"💳",  color:T.red,    dim:T.redDim,    border:T.redBorder,    hint:"Clear a specific debt faster" },
  { id:"house_deposit",   label:"House deposit",     icon:"🏠",  color:T.amber,  dim:T.amberDim,  border:T.amberBorder,  hint:"Save towards buying a home" },
  { id:"invest",          label:"Start investing",   icon:"📈",  color:T.purple, dim:T.purpleDim, border:"rgba(139,92,246,.3)", hint:"Build a regular investing habit" },
  { id:"travel",          label:"Travel fund",       icon:"✈️",  color:T.blue,   dim:"rgba(59,130,246,.1)", border:"rgba(59,130,246,.3)", hint:"Save for a trip or sabbatical" },
  { id:"retirement",      label:"Retirement pot",    icon:"🏖️",  color:T.teal,   dim:T.tealDim,   border:T.tealBorder,   hint:"Grow your pension or SIPP" },
  { id:"custom",          label:"Something else",    icon:"⭐",  color:T.muted,  dim:T.faint,     border:T.border,       hint:"Name your own goal" },
]

const ACTION_GOALS = new Set(["invest","retirement"])

const GOAL_ACTIONS = {
  invest: [
    { id:"open_isa",     label:"Open a Stocks and Shares ISA",       desc:"The most tax-efficient way to invest in the UK. All growth is tax free.",                         lessonId:"isa_basics"    },
    { id:"choose_fund",  label:"Choose a low-cost index fund",       desc:"A global index fund (e.g. MSCI All World) gives instant diversification at under 0.2%/year.",     lessonId:"dca_investing" },
    { id:"set_dd",       label:"Set up a monthly direct debit",      desc:"Automate on payday so you invest before you can spend it. Even £50/month compounds significantly.", lessonId:"compound_interest" },
    { id:"dca_habit",    label:"Keep investing through market falls", desc:"Do not stop your standing order when markets drop. Falls are buying opportunities for long-term investors.", lessonId:"dca_investing" },
  ],
  retirement: [
    { id:"check_pension", label:"Find and review all existing pensions",    desc:"Many people have lost pensions from old jobs. Check via the government's pension tracing service.",  lessonId:"pension_basics" },
    { id:"increase_contrib", label:"Increase your pension contribution",    desc:"Even 1% more per month compounds significantly over a 20 to 30 year timeframe.",                    lessonId:"pension_basics" },
    { id:"employer_match", label:"Make sure you are getting full employer match", desc:"Never leave free employer contributions on the table. This is part of your compensation.", lessonId:"pension_basics" },
    { id:"fire_number",  label:"Calculate your FIRE number",               desc:"Your financial freedom number is 25x your annual spending. Track it on your LifeSmart dashboard.",   lessonId:null            },
  ],
}

function ActionGoalSheet({ type, goal, onClose, onSave }) {
  const { state, setTab } = useApp()
  const cfg = GOAL_TYPES.find(g=>g.id===type)
  const actions = GOAL_ACTIONS[type] || []
  const editing = !!goal
  const [checked, setChecked] = useState(() => {
    const saved = goal?.checkedActions || []
    return new Set(saved)
  })
  const [name, setName] = useState(goal?.name || cfg?.label || "")
  const [monthly, setMonthly] = useState(goal?.monthlyAmount || 0)

  function toggle(id) { setChecked(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n }) }

  function save() {
    onSave({
      id: goal?.id || Date.now().toString(),
      type, name,
      targetAmount: 0, startAmount: 0, monthlyAmount: monthly,
      checkedActions: [...checked],
      createdAt: goal?.createdAt || new Date().toISOString(),
    })
    onClose()
  }

  const donePct = actions.length > 0 ? Math.round((checked.size / actions.length) * 100) : 0

  return (
    <Sheet title={editing ? "Edit goal" : "Set up: " + cfg.label} onClose={onClose}>
      <div style={{ background:cfg.dim,border:`1px solid ${cfg.border}`,borderRadius:14,padding:"14px 18px",marginBottom:20,display:"flex",gap:12,alignItems:"center" }}>
        <span style={{ fontSize:28 }}>{cfg.icon}</span>
        <div>
          <p style={{ color:cfg.color,fontWeight:800,fontSize:15 }}>{cfg.label}</p>
          <p style={{ color:T.muted,fontSize:13,marginTop:2 }}>{cfg.hint}</p>
        </div>
      </div>

      <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:4 }}>Your action plan</p>
      <p style={{ color:T.muted,fontSize:13,marginBottom:14 }}>Work through these steps. Tick each one as you complete it.</p>

      {/* Progress */}
      <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden",marginBottom:16 }}>
        <div style={{ width:`${donePct}%`,height:"100%",background:cfg.color,borderRadius:99,transition:"width .4s ease-out" }}/>
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
        {actions.map(a=>{
          const done = checked.has(a.id)
          return (
            <div key={a.id} onClick={()=>toggle(a.id)} style={{ background:done?cfg.dim:T.card,border:`1.5px solid ${done?cfg.color:T.border}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all .15s" }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",background:done?cfg.color:T.surface,border:`2px solid ${done?cfg.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .15s" }}>
                  {done && <Check size={12} color="#fff"/>}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:done?T.white:"#CBD5E1",fontWeight:700,fontSize:14,marginBottom:4 }}>{a.label}</p>
                  <p style={{ color:T.muted,fontSize:12,lineHeight:1.6 }}>{a.desc}</p>
                  {a.lessonId && (
                    <button onClick={e=>{ e.stopPropagation(); setTab(3); onClose() }}
                      style={{ background:"none",border:"none",color:cfg.color,fontSize:12,fontWeight:700,cursor:"pointer",padding:"4px 0 0 0",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,marginTop:4 }}>
                      <BookOpen size={11}/>Learn more in the Learn tab
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Input label="Give this goal a name (optional)" value={name} onChange={setName} placeholder={cfg.label}/>
      <div style={{ marginTop:14,marginBottom:20 }}>
        <CurrencyInput label="Monthly amount you plan to put towards this" value={monthly} onChange={setMonthly}/>
      </div>

      {donePct===100 && (
        <div style={{ background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",borderRadius:12,padding:"12px 16px",marginBottom:16 }}>
          <p style={{ color:"#22C55E",fontWeight:700,fontSize:14 }}>All steps complete. You are on the right track. 🎉</p>
        </div>
      )}
      <Btn onClick={save}>{editing ? "Save changes" : "Save goal"}</Btn>
    </Sheet>
  )
}

function calcGoalProgress(goal, surplus) {
  const now = new Date()
  const start = goal.createdAt ? new Date(goal.createdAt) : now
  const monthsElapsed = Math.max(0, (now - start) / (1000 * 60 * 60 * 24 * 30.4))
  const monthly = goal.monthlyAmount || Math.max(0, surplus * 0.3)
  const current = Math.min(goal.startAmount + monthly * monthsElapsed, goal.targetAmount)
  const pct = goal.targetAmount > 0 ? Math.min((current / goal.targetAmount) * 100, 100) : 0
  const remaining = Math.max(0, goal.targetAmount - current)
  const monthsLeft = monthly > 0 ? Math.ceil(remaining / monthly) : null
  const eta = monthsLeft != null ? (() => { const d = new Date(); d.setMonth(d.getMonth() + monthsLeft); return d.toLocaleDateString("en-GB",{month:"short",year:"numeric"}) })() : null
  return { current:Math.round(current), pct:Math.round(pct), monthsLeft, eta, monthly }
}

/* Goal creation sheet — routes to action sheet for invest/retire */
function GoalSheet({ goal, onClose, onSave }) {
  const { state } = useApp()
  const surplus = calcSurplus(state.income, state.assets, state.spending)
  const editing = !!goal
  const [type,    setType]    = useState(goal?.type || null)
  const [name,    setName]    = useState(goal?.name || "")
  const [target,  setTarget]  = useState(goal?.targetAmount || 0)
  const [start,   setStart]   = useState(goal?.startAmount  || 0)
  const [monthly, setMonthly] = useState(goal?.monthlyAmount || Math.round(Math.max(0,surplus*0.3)))
  const [err,     setErr]     = useState("")
  const [goAction,setGoAction]= useState(editing && ACTION_GOALS.has(goal?.type))

  // Route to action sheet once type confirmed
  if(goAction && type && ACTION_GOALS.has(type)) {
    return <ActionGoalSheet type={type} goal={goal} onClose={onClose} onSave={onSave}/>
  }

  const cfg = GOAL_TYPES.find(g=>g.id===type)
  const monthsNeeded = (monthly>0 && target>start) ? Math.ceil((target-start)/monthly) : null
  const eta = monthsNeeded ? (()=>{ const d=new Date(); d.setMonth(d.getMonth()+monthsNeeded); return d.toLocaleDateString("en-GB",{month:"short",year:"numeric"}) })() : null

  function save() {
    if(!type)    { setErr("Please choose a goal type."); return }
    if(target<=0){ setErr("Please enter a target amount."); return }
    setErr("")
    onSave({ id:goal?.id||Date.now().toString(), type, name:name||cfg?.label||"My goal", targetAmount:target, startAmount:start, monthlyAmount:monthly, createdAt:goal?.createdAt||new Date().toISOString() })
    onClose()
  }

  return (
    <Sheet title={editing ? "Edit goal" : "New goal"} onClose={onClose}>
      <p style={{ fontSize:12,color:T.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:10 }}>What are you saving towards?</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
        {GOAL_TYPES.map(g=>{
          const sel = type===g.id
          const isAction = ACTION_GOALS.has(g.id)
          return (
            <button key={g.id} onClick={()=>{
              const newName = (!name||name===cfg?.label) ? g.label : name
              setType(g.id); setName(newName)
              if(isAction) setGoAction(true)
            }}
              style={{ padding:"12px 6px",borderRadius:13,border:`2px solid ${sel?g.color:T.border}`,background:sel?g.dim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,position:"relative",transition:"all .15s" }}>
              <span style={{ fontSize:22 }}>{g.icon}</span>
              <span style={{ fontSize:11,fontWeight:600,color:sel?g.color:T.muted,textAlign:"center",lineHeight:1.3 }}>{g.label}</span>
              {isAction && <span style={{ fontSize:9,color:T.muted,fontWeight:600 }}>Action plan</span>}
              {sel && <div style={{ position:"absolute",top:6,right:6,width:14,height:14,borderRadius:"50%",background:g.color,display:"flex",alignItems:"center",justifyContent:"center" }}><Check size={9} color="#fff"/></div>}
            </button>
          )
        })}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:20 }}>
        <Input label="Goal name" value={name} onChange={setName} placeholder={cfg?.label||"e.g. Europe trip"}/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <CurrencyInput label="Target amount" value={target} onChange={setTarget}/>
          <CurrencyInput label="Already saved (optional)" value={start} onChange={setStart}/>
        </div>
        <CurrencyInput label="Monthly contribution" value={monthly} onChange={setMonthly} helper={`Your current surplus is ${fmt(Math.max(0,surplus))}/mo`}/>
      </div>

      {eta && target>0 && (
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:13,padding:"14px 16px",marginBottom:16 }}>
          <p style={{ color:T.teal,fontWeight:700,fontSize:14 }}>At {fmt(monthly)}/mo you will reach this by <strong>{eta}</strong></p>
          <p style={{ color:T.muted,fontSize:12,marginTop:4 }}>{monthsNeeded} month{monthsNeeded!==1?"s":""} away.</p>
        </div>
      )}

      {err && <p style={{ color:T.red,fontSize:13,marginBottom:12 }}>{err}</p>}
      <Btn onClick={save}>{editing ? "Save changes" : "Create goal"}</Btn>
    </Sheet>
  )
}

/* Goal card */
function GoalCard({ goal, onEdit, onDelete, surplus }) {
  const cfg = GOAL_TYPES.find(g=>g.id===goal.type) || GOAL_TYPES[GOAL_TYPES.length-1]
  const isAction = ACTION_GOALS.has(goal.type)

  if(isAction) {
    const actions = GOAL_ACTIONS[goal.type] || []
    const checked = new Set(goal.checkedActions || [])
    const donePct = actions.length > 0 ? Math.round((checked.size / actions.length) * 100) : 0
    return (
      <div style={{ background:T.card,border:`1px solid ${donePct===100?cfg.color:T.border}`,borderRadius:18,padding:"20px 22px",position:"relative",overflow:"hidden" }}>
        {donePct===100 && <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:cfg.color,borderRadius:"18px 18px 0 0" }}/>}
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:44,height:44,borderRadius:14,background:cfg.dim,border:`1px solid ${cfg.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{cfg.icon}</div>
            <div>
              <p style={{ color:T.white,fontWeight:800,fontSize:15 }}>{goal.name}</p>
              <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>{checked.size} of {actions.length} steps complete</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            <button onClick={onEdit}   style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
            <button onClick={onDelete} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>
          </div>
        </div>
        <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:12 }}>
          <div style={{ width:`${donePct}%`,height:"100%",background:donePct===100?"#22C55E":cfg.color,borderRadius:99,transition:"width .6s ease-out" }}/>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
          {actions.map(a=>{
            const done = checked.has(a.id)
            return (
              <div key={a.id} style={{ display:"flex",alignItems:"center",gap:10,opacity:done?1:.6 }}>
                <div style={{ width:18,height:18,borderRadius:"50%",background:done?cfg.color:T.surface,border:`2px solid ${done?cfg.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {done && <Check size={10} color="#fff"/>}
                </div>
                <p style={{ color:done?T.white:T.muted,fontSize:13,fontWeight:done?600:400,textDecoration:done?"line-through":"none" }}>{a.label}</p>
              </div>
            )
          })}
        </div>
        {donePct===100 && <p style={{ color:"#22C55E",fontWeight:700,fontSize:13,marginTop:12 }}>All steps done. 🎉</p>}
        {goal.monthlyAmount > 0 && (
          <div style={{ marginTop:12,paddingTop:10,borderTop:`1px solid ${T.border}` }}>
            <p style={{ color:T.muted,fontSize:12 }}>Putting aside {fmt(goal.monthlyAmount)}/mo towards this</p>
          </div>
        )}
      </div>
    )
  }

  const { current, pct, eta, monthly } = calcGoalProgress(goal, surplus)
  const milestones = [25, 50, 75]
  const done = pct >= 100

  return (
    <div style={{ background:T.card,border:`1px solid ${done?cfg.color:T.border}`,borderRadius:18,padding:"20px 22px",position:"relative",overflow:"hidden" }}>
      {done && <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:cfg.color,borderRadius:"18px 18px 0 0" }}/>}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:14,background:cfg.dim,border:`1px solid ${cfg.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{cfg.icon}</div>
          <div>
            <p style={{ color:T.white,fontWeight:800,fontSize:15 }}>{goal.name}</p>
            <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>{cfg.label}</p>
          </div>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          <button onClick={onEdit}   style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
          <button onClick={onDelete} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>
        </div>
      </div>
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
          <span style={{ color:T.muted,fontSize:13 }}>{fmt(current)} saved</span>
          <span style={{ color:T.white,fontWeight:700,fontSize:13 }}>{fmt(goal.targetAmount)} target</span>
        </div>
        <div style={{ background:T.surface,borderRadius:8,height:10,position:"relative",overflow:"visible" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:done?"#22C55E":cfg.color,borderRadius:8,transition:"width 1s ease-out",maxWidth:"100%" }}/>
          {milestones.map(m=>(
            <div key={m} style={{ position:"absolute",left:`${m}%`,top:-3,width:2,height:16,background:pct>=m?T.card:T.subtle,borderRadius:1,opacity:.6 }}/>
          ))}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:5 }}>
          <span style={{ color:done?"#22C55E":cfg.color,fontWeight:800,fontSize:13 }}>{pct}% {done?"🎉 Complete!":"(Projected)"}</span>
          {!done && eta && <span style={{ color:T.muted,fontSize:12 }}>Est. {eta}</span>}
        </div>
      </div>
      <div style={{ display:"flex",gap:16,paddingTop:10,borderTop:`1px solid ${T.border}` }}>
        <div>
          <p style={{ color:T.muted,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:1 }}>Monthly</p>
          <p style={{ color:T.white,fontSize:13,fontWeight:700,marginTop:2 }}>{fmt(monthly)}</p>
        </div>
        <div>
          <p style={{ color:T.muted,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:1 }}>Remaining</p>
          <p style={{ color:T.white,fontSize:13,fontWeight:700,marginTop:2 }}>{fmt(Math.max(0,goal.targetAmount-current))}</p>
        </div>
        {eta && !done && <div>
          <p style={{ color:T.muted,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:1 }}>Target date</p>
          <p style={{ color:T.white,fontSize:13,fontWeight:700,marginTop:2 }}>{eta}</p>
        </div>}
      </div>
    </div>
  )
}

/* Goals summary bar */
function GoalsSummary({ goals, surplus }) {
  const active   = goals.filter(g=>calcGoalProgress(g,surplus).pct<100)
  const complete  = goals.filter(g=>calcGoalProgress(g,surplus).pct>=100)
  const totalMonthly = goals.reduce((s,g)=>s+(g.monthlyAmount||0),0)
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20 }}>
      {[
        { l:"Active goals",   v:active.length,        c:T.teal,  bg:T.tealDim,  b:T.tealBorder },
        { l:"Completed",      v:complete.length,       c:"#22C55E",bg:"rgba(34,197,94,.1)", b:"rgba(34,197,94,.3)" },
        { l:"Total monthly",  v:fmt(totalMonthly),     c:T.purple, bg:T.purpleDim,b:"rgba(139,92,246,.3)" },
      ].map(k=>(
        <div key={k.l} style={{ background:k.bg,border:`1px solid ${k.b}`,borderRadius:14,padding:"14px 16px",textAlign:"center" }}>
          <p style={{ color:T.subtle,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>{k.l}</p>
          <p style={{ color:k.c,fontSize:20,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{k.v}</p>
        </div>
      ))}
    </div>
  )
}

function GoalsTab() {
  const { state, save, toast } = useApp()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editGoal,  setEditGoal]  = useState(null)
  const surplus = calcSurplus(state.income, state.assets, state.spending)
  const goals   = state.goals || []

  function saveGoal(data) {
    const existing = goals.find(g=>g.id===data.id)
    const newGoals = existing ? goals.map(g=>g.id===data.id?data:g) : [...goals,data]
    save({ ...state, goals:newGoals })
    toast(existing ? "✓  Goal updated" : "✓  Goal created")
  }

  function deleteGoal(id) {
    if(!window.confirm("Delete this goal?")) return
    save({ ...state, goals:goals.filter(g=>g.id!==id) })
    toast("Goal deleted")
  }

  const activeGoals    = goals.filter(g=> ACTION_GOALS.has(g.type) ? true  : calcGoalProgress(g,surplus).pct<100)
  const completedGoals = goals.filter(g=>!ACTION_GOALS.has(g.type) && calcGoalProgress(g,surplus).pct>=100)

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"24px 32px 120px" }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>

        {goals.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign:"center",paddingTop:60 }}>
            <div style={{ fontSize:64,marginBottom:20 }}>🎯</div>
            <h2 style={{ color:T.white,fontWeight:900,fontSize:24,marginBottom:10 }}>No goals yet</h2>
            <p style={{ color:T.muted,fontSize:15,lineHeight:1.65,maxWidth:400,margin:"0 auto 32px" }}>Goals turn your surplus into a plan. Set one and watch the progress build.</p>
            <div style={{ maxWidth:260,margin:"0 auto" }}>
              <Btn onClick={()=>{ setEditGoal(null); setSheetOpen(true) }}>Create my first goal →</Btn>
            </div>
            {/* Suggestion chips */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginTop:32 }}>
              {GOAL_TYPES.slice(0,4).map(g=>(
                <button key={g.id} onClick={()=>{ setEditGoal(null); setSheetOpen(true) }}
                  style={{ background:g.dim,border:`1px solid ${g.border}`,borderRadius:99,padding:"8px 18px",color:g.color,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6 }}>
                  <span>{g.icon}</span>{g.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <GoalsSummary goals={goals} surplus={surplus}/>

            {/* Surplus allocation tip */}
            {surplus > 0 && (
              <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"13px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:10 }}>
                <Sparkles size={14} color={T.teal} style={{ flexShrink:0 }}/>
                <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>
                  You have <strong style={{ color:T.teal }}>{fmt(surplus)}/mo</strong> surplus. Allocating this across goals would reach them faster.
                </p>
              </div>
            )}

            {/* Active goals */}
            {activeGoals.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Active</p>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:14 }}>
                  {activeGoals.map(g=>(
                    <GoalCard key={g.id} goal={g} surplus={surplus}
                      onEdit={()=>{ setEditGoal(g); setSheetOpen(true) }}
                      onDelete={()=>deleteGoal(g.id)}/>
                  ))}
                </div>
              </div>
            )}

            {/* Completed goals */}
            {completedGoals.length > 0 && (
              <div>
                <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Completed 🎉</p>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:14 }}>
                  {completedGoals.map(g=>(
                    <GoalCard key={g.id} goal={g} surplus={surplus}
                      onEdit={()=>{ setEditGoal(g); setSheetOpen(true) }}
                      onDelete={()=>deleteGoal(g.id)}/>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <FloatingAdd onClick={()=>{ setEditGoal(null); setSheetOpen(true) }}/>
      {sheetOpen && <GoalSheet goal={editGoal} onClose={()=>{ setSheetOpen(false); setEditGoal(null) }} onSave={saveGoal} key={editGoal?.id||"new"}/>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD 5 — LEARN TAB
   Real UK personal finance content. Bite-sized. Gamified.
═══════════════════════════════════════════════════════════════════════════ */

const LESSONS = [
  /* ── TRACK 1: Foundations ─────────────────────────────────────────────── */
  {
    id:"nw_basics", track:"Foundations", trackColor:T.teal, trackDim:T.tealDim, trackBorder:T.tealBorder,
    title:"What actually grows your net worth — and what doesn't",
    emoji:"📊", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"You know your number. Now let's grow it.", body:"Net worth is assets minus debts. You have already tracked yours. The next question is: what actually moves that number over time? Most people do things that feel financially sensible but make very little difference. A few things make an enormous difference.", highlight:"Small habits, compounded over years, create dramatic results." },
      { type:"fact", headline:"The four levers that grow net worth", body:"There are only four ways to grow your net worth. Every financial decision you make affects one or more of them.",
        facts:[
          { icon:"⬆️", label:"Increase your income", text:"More income means more fuel to allocate. A 10% pay rise is the equivalent of spending 10% less forever — but without the sacrifice. This is the highest-leverage lever for most people under 40." },
          { icon:"⬇️", label:"Reduce your spending", text:"Every £1 not spent on consumption is a £1 that can build assets. The difference between 'spending everything' and 'spending 80%' across a 30-year career is typically hundreds of thousands of pounds." },
          { icon:"📈", label:"Grow your assets faster", text:"Assets invested at 7% double roughly every 10 years. Assets in a current account earning nothing barely keep pace with inflation. Where your money sits matters enormously." },
          { icon:"💳", label:"Eliminate high-interest debt", text:"Paying off a credit card at 22% APR is a guaranteed 22% return. No investment reliably beats that. High-interest debt is the single biggest drag on net worth growth for most UK adults." },
        ]
      },
      { type:"fact", headline:"The wealth gap is almost entirely behavioural", body:"UK data consistently shows that income explains only a fraction of the difference in net worth between people of the same age. Two people earning the same salary for 30 years can end up with net worths that differ by a factor of ten. The difference is almost entirely explained by savings rate, investment choices, and debt management. Not luck. Not background.", highlight:"Your net worth in 20 years is mostly determined by habits, not income." },
      { type:"scenario", prompt:"Two colleagues both earn £45,000. Which one will have the higher net worth at age 50?",
        context:"Alex puts £400/month into a stocks and shares ISA from age 28. Jamie spends everything but owns a more expensive car and goes on better holidays.",
        choices:[
          { label:"Jamie — lifestyle choices signal financial confidence", best:false, outcome:"Lifestyle spending leaves no trail of wealth. Jamie's car depreciates and the holidays produce no financial return." },
          { label:"Alex — consistent investing wins over time", best:true, outcome:"At 7% average return, Alex's £400/month over 22 years grows to roughly £270,000. Jamie ends the same career with close to zero investable net worth." },
        ],
        explanation:"This is the core lesson: identical incomes, identical starting points, radically different outcomes. The gap is entirely explained by one person choosing to invest consistently."
      },
      { type:"quiz", question:"Which action has the highest impact on net worth over a 20-year period for a typical UK employee?",
        options:["Buying a new car on finance","Investing a fixed amount monthly into an ISA","Taking more holidays to improve wellbeing","Switching energy suppliers each year"], correct:1,
        explanation:"Monthly investing into an ISA grows through compounding over 20 years. A £300/month ISA at 7% growth is worth around £195,000 after 20 years. The other choices either cost money, are depreciating assets, or produce very small savings compared to investing consistently."
      },
    ]
  },
  {
    id:"compound_interest", track:"Foundations", trackColor:T.teal, trackDim:T.tealDim, trackBorder:T.tealBorder,
    title:"Compound interest: the force that works for or against you",
    emoji:"🌱", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"Interest on interest — exponential not linear", body:"Compound interest means you earn returns not just on what you put in, but on all the returns you have already earned. It starts slowly and accelerates dramatically over time. This is why starting early matters so much more than investing large amounts later.", highlight:null },
      { type:"fact", headline:"The Rule of 72", body:"Divide 72 by your expected annual return to find how many years it takes to double your money. At 7% returns: 72 divided by 7 equals roughly 10 years to double. £10,000 today becomes £20,000 in 10 years, £40,000 in 20 years. Without adding a single pound.", highlight:"72 divided by your return rate = years to double your money" },
      { type:"interactive", id:"growth_chart", prompt:"See the compound curve — drag to change your monthly investment",
        hint:"The gap between what you put in and what you end up with is pure compound interest. It grows slowly at first, then accelerates dramatically."
      },
      { type:"fact", headline:"How debt compounds against you", body:"A £5,000 credit card at 22% APR with minimum-only payments takes 27 years to clear and costs over £8,000 in interest. The same compounding maths that builds wealth destroys it when it is working against you. This is why high-interest debt is the first thing to eliminate.", highlight:null },
      { type:"quiz", question:"Sarah invests £200/mo from age 25. Tom invests £400/mo from age 35. Both stop at 65 with 7% returns. Who has more?",
        options:["Tom — he invested twice as much per month","Sarah — she started 10 years earlier","They end up roughly equal","It depends on what they invested in"], correct:1,
        explanation:"Starting early beats investing more. Sarah's extra decade means compound growth does far more work for her. Time in the market is the single most powerful variable in wealth building."
      },
    ]
  },
  {
    id:"50_30_20", track:"Foundations", trackColor:T.teal, trackDim:T.tealDim, trackBorder:T.tealBorder,
    title:"How to budget: the framework that actually sticks",
    emoji:"🥧", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"The classic split: 50% Needs, 30% Wants, 20% Savings", body:"One of the most widely used budget frameworks. Take-home pay split three ways. The idea is not to be rigid — it is to give you an anchor. If your actual split looks radically different, that is the insight. Not the target itself.", highlight:null },
      { type:"match", prompt:"Match each category to its correct definition",
        pairs:[
          { term:"Needs",   def:"Rent, groceries, utilities, insurance, minimum debt payments" },
          { term:"Wants",   def:"Eating out, subscriptions, holidays, new clothes beyond necessity" },
          { term:"Savings", def:"ISA contributions, pension top-ups, emergency fund, extra debt repayment" },
        ],
        explanation:"Needs are non-negotiable. Wants improve your life but are optional. Savings pay future you. If needs are over 60% of take-home, the priority is reducing fixed costs — housing and transport move the needle most."
      },
      { type:"fact", headline:"The LifeSmart method: Needs first, then save a third, spend the rest guilt free",
        body:"Rather than splitting everything into percentages upfront, this approach works sequentially. Pay all your essential needs first. Then move a third of whatever is left directly to savings. Whatever remains after that is yours to spend completely guilt free — no tracking, no spreadsheet, no stress.",
        highlight:"Pay needs. Save a third of the rest. Spend freely with zero guilt.",
        facts:[
          { icon:"1️⃣", label:"Pay needs first", text:"Cover everything non-negotiable — rent or mortgage, utilities, food, insurance, minimum debt payments. These come out immediately on payday." },
          { icon:"2️⃣", label:"Save a third of what remains", text:"Whatever is left after needs, move a third to savings or investments automatically. This is your future self's share. Automate it so you never see it." },
          { icon:"3️⃣", label:"Spend the rest guilt free", text:"Everything left is yours. No categories, no tracking, no guilt. You have already paid your needs and your future. Enjoy what remains." },
        ]
      },
      { type:"fact", headline:"Why guilt-free spending is actually the point", body:"Most budgeting approaches fail because they create anxiety around every purchase. The LifeSmart method removes that. If you have covered your needs and moved your savings share, every pound left is pre-approved. You do not need permission to enjoy it.", highlight:null },
      { type:"scenario", prompt:"You just got a £3,500 per year pay rise. What do you do?",
        context:"Your lifestyle is comfortable. The extra is roughly £250 per month after tax. No specific immediate needs.",
        choices:[
          { label:"Upgrade your lifestyle — you earned it", best:false, outcome:"This is lifestyle inflation. Within 6 months the extra income disappears into spending and your savings rate stays the same." },
          { label:"Automate the extra savings before your spending adjusts", best:true, outcome:"You lock in the increase before lifestyle adapts. Over 5 years at 7% that is over £19,000 — without feeling a thing." },
          { label:"Wait and see what happens naturally", best:false, outcome:"Spending fills available income automatically. Without a deliberate action on payday, the money will be absorbed within weeks." },
        ],
        explanation:"The LifeSmart method handles this naturally — when income rises, your savings third rises with it automatically, before you ever get to spend it."
      },
      { type:"quiz", question:"Under the LifeSmart method, your take-home is £2,400/mo. Needs come to £1,200. How much goes to savings?",
        options:["£240 — 10% of take-home","£400 — a third of what remains after needs","£480 — 20% of take-home","£600 — half of what remains"], correct:1,
        explanation:"After needs (£1,200), you have £1,200 remaining. A third of £1,200 = £400 to savings. The remaining £800 is yours to spend guilt free."
      },
      { type:"fact", headline:"Now: understand where your money actually goes",
        body:"Knowing the framework is step one. Step two is seeing your own numbers. The spending breakdown in the Track tab lets you categorise your monthly spending — needs, wants, and savings — so LifeSmart can show you exactly where you sit and where the biggest opportunities are.",
        highlight:"Head to Track → Income → Break it down to see your personal split.",
        facts:[
          { icon:"🔍", label:"See your real split", text:"Most people discover their actual needs are eating well over 50% — usually because housing and transport are underestimated." },
          { icon:"💡", label:"Get personalised insights", text:"Once you categorise, LifeSmart flags the biggest opportunities — like eating out costs that could free £200 to £400 per month if reduced." },
          { icon:"🎯", label:"Connect it to your goals", text:"Knowing your surplus clearly makes it far easier to set realistic goal contribution amounts." },
        ]
      },
    ]
  },

  /* ── TRACK 2: Tax & Income ────────────────────────────────────────────── */
  {
    id:"uk_tax", track:"Tax & Income", trackColor:T.amber, trackDim:T.amberDim, trackBorder:T.amberBorder,
    title:"UK tax explained — what you actually pay and on what",
    emoji:"🧾", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"Tax is not a single thing — there are several types", body:"Most people only think about income tax, but there are multiple taxes that affect your financial life. Understanding each one helps you make better decisions about where to keep money, when to sell investments, and how to plan your estate.", highlight:null,
        facts:[
          { icon:"💼", label:"Income Tax", text:"Paid on earnings above your Personal Allowance (£12,570/year tax free). 20% on £12,571 to £50,270, 40% on £50,271 to £125,140, 45% above £125,140." },
          { icon:"📈", label:"Capital Gains Tax (CGT)", text:"Tax on profit when you sell assets like shares or property (not your main home). First £3,000/year is tax free. Basic rate taxpayers pay 10% on investments, higher rate pay 20%." },
          { icon:"🏪", label:"VAT", text:"Value Added Tax added to goods and services. In the UK it is 20%. You pay this without realising on most purchases — it is included in the shelf price." },
          { icon:"🏡", label:"Inheritance Tax (IHT)", text:"Charged on the estate of someone who has died. The standard threshold is £325,000. Above this, 40% is charged. The estate pays — not the beneficiaries directly." },
        ]
      },
      { type:"slider", prompt:"How does income tax work on a UK salary?",
        label:"Annual gross salary", prefix:"£", min:10000, max:150000, step:1000, defaultVal:45000,
        compute: v => {
          const personalAllowance = v > 125140 ? 0 : v > 100000 ? Math.max(0, 12570 - (v-100000)/2) : 12570
          const basicBand = Math.max(0, Math.min(v, 50270) - personalAllowance)
          const higherBand = Math.max(0, Math.min(v, 125140) - 50270)
          const addBand = Math.max(0, v - 125140)
          const incomeTax = basicBand*0.20 + higherBand*0.40 + addBand*0.45
          const ni = v > 12570 ? Math.min(v,50270)*0.08 + Math.max(0,v-50270)*0.02 - 12570*0.08 : 0
          const takeHome = v - incomeTax - Math.max(0,ni)
          const effectiveRate = v > 0 ? Math.round((incomeTax/v)*100) : 0
          return [
            { label:"Personal allowance (tax free)", value:`£${personalAllowance.toLocaleString("en-GB")}` },
            { label:"Income tax", value:`£${Math.round(incomeTax).toLocaleString("en-GB")}` },
            { label:"National Insurance (est.)", value:`£${Math.round(Math.max(0,ni)).toLocaleString("en-GB")}` },
            { label:"Estimated take-home/year", value:`£${Math.round(takeHome).toLocaleString("en-GB")}`, highlight:true },
            { label:"Effective tax rate", value:`${effectiveRate}%` },
          ]
        },
        insight: v => v > 100000
          ? "Warning: between £100,000 and £125,140 your effective tax rate is 60% because your personal allowance is withdrawn. Pension contributions are very effective here."
          : v > 50270
          ? "You are a higher rate taxpayer. Pension contributions get 40% tax relief — every £600 you put in costs you only £600 but £1,000 goes into your pension."
          : "You are a basic rate taxpayer. Every £800 you put into a pension becomes £1,000 thanks to 20% tax relief added automatically."
      },
      { type:"quiz", question:"You earn £55,000. Your employer offers a salary sacrifice pension scheme. Reducing your salary to £50,000 would:",
        options:["Cost you £5,000 — bad idea","Save you income tax and National Insurance","Only help if you are a higher rate taxpayer","Have no effect on your take-home pay"], correct:1,
        explanation:"Salary sacrifice reduces your gross salary before tax. On £5,000 at the 40% band, you save £2,000 in income tax. You also save National Insurance on that amount. The pension receives £5,000 but your take-home drops by much less."
      },
      { type:"quiz", question:"What is the UK personal allowance — the amount you can earn before paying any income tax?",
        options:["£10,000","£12,570","£15,000","£20,000"], correct:1,
        explanation:"The personal allowance is £12,570 per year (2024/25 tax year). Everyone gets this tax free regardless of what they earn, unless their income exceeds £100,000, at which point it is gradually withdrawn."
      },
    ]
  },
  {
    id:"increase_income", track:"Tax & Income", trackColor:T.amber, trackDim:T.amberDim, trackBorder:T.amberBorder,
    title:"Ways to increase your income — a practical guide",
    emoji:"💡", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"There are five ways to earn more — most people only use one", body:"Most people rely entirely on their primary employment income. But income is not fixed. There are real, practical routes to increasing it. Some take months. Some can start this week.", highlight:null,
        facts:[
          { icon:"💼", label:"Maximise your current role", text:"Overtime, extra shifts, or performance bonuses are the fastest routes. Many people never ask for a pay review — research shows those who do get one more often than not." },
          { icon:"🚀", label:"Move to a higher-paying role", text:"Switching employers typically delivers a 15 to 20% pay increase versus staying put. The UK labour market rewards mobility more than loyalty." },
          { icon:"🛠️", label:"Additional flexible work", text:"Freelancing, consulting, tutoring, or gig work. Platforms like Upwork, Fiverr, or your professional network. Even 5 hours a week at £25/hour = £500/month extra." },
          { icon:"🔄", label:"Reselling and side projects", text:"Selling unused items, buying and reselling, creating digital products. Lower income ceiling but immediate start." },
          { icon:"💤", label:"Passive income", text:"Savings interest, rental income, dividends. These compound slowly but require less ongoing time. An emergency fund earning 5% is not passive income — it is just good financial practice." },
        ]
      },
      { type:"rank", prompt:"Rank these income-boosting strategies by likely return on time invested",
        items:["Ask for a pay review in your current role","Start freelancing in your area of expertise","Sell items you already own but do not use","Build a passive income stream from scratch","Switch to a higher-paying employer"],
        answer:"Best order by return on time: (1) Salary review — lowest effort, highest impact. (2) Switch employer — a move typically yields 15 to 20% more. (3) Freelancing — leverages existing skills with good hourly rates. (4) Selling items — quick wins but limited ceiling. (5) Passive income from scratch — takes the longest to build but compounds over time."
      },
      { type:"fact", headline:"Cashback and comparison sites — money for nothing", body:"Price comparison and cashback sites reduce what you spend without cutting anything. Over a year, regular use typically saves £200 to £600. Check topcashback.co.uk or Quidco for purchases. Use Confused.com or GoCompare.com at every insurance renewal — most people overpay by £100 to £300 by staying with their existing insurer.", highlight:"Switching insurance at renewal typically saves £100 to £300 a year." },
      { type:"quiz", question:"The most reliably effective way to increase income for most employed people is:",
        options:["Starting a side hustle immediately","Investing in stocks","Negotiating a pay rise or changing employer","Building passive income streams"], correct:2,
        explanation:"For most employed people, increasing earned income through negotiation or a job change delivers the fastest and largest return. Side hustles and passive income are valuable supplements but typically take longer to build to meaningful income levels."
      },
    ]
  },

  /* ── TRACK 3: Saving & Safety Net ───────────────────────────────────────── */
  {
    id:"savings_accounts", track:"Saving", trackColor:T.blue, trackDim:"rgba(59,130,246,.1)", trackBorder:"rgba(59,130,246,.3)",
    title:"Savings accounts and the FSCS: keeping your money safe",
    emoji:"🏦", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"A savings account is not your current account", body:"A savings account is designed to store money you do not need for everyday spending. It pays you interest for keeping the money there. Keeping savings separate from daily transactions makes them easier to protect and grow.", highlight:null },
      { type:"fact", headline:"How to choose a savings account — five things to check",
        body:"Not all savings accounts are equal. The best one depends on when you might need the money and how the rate is structured.", highlight:null,
        facts:[
          { icon:"📊", label:"Interest rate", text:"Compare the AER (Annual Equivalent Rate). Check whether it applies to the full balance or only to a limit, and whether it is variable, introductory, or conditional." },
          { icon:"📋", label:"Terms and conditions", text:"Is the rate guaranteed for a fixed period (fixed-rate)? Does it require regular deposits (regular saver)? Can you access the money freely or are there notice periods?" },
          { icon:"📱", label:"Access and app", text:"Can you move money in and out instantly? Does the app allow separate pots or named savings goals? Does it integrate with your current account?" },
          { icon:"🛡️", label:"FSCS protection", text:"The Financial Services Compensation Scheme protects up to £85,000 per person per banking licence. Some banks share a single licence even if they operate under different brand names — worth checking." },
        ]
      },
      { type:"quiz", question:"You have £90,000 in savings and split it across two accounts: £50,000 with Bank A and £40,000 with Bank B. Bank A fails. How much do you get back?",
        options:["Nothing — savings are not insured","£50,000 — the full amount in that bank","£85,000 — up to the FSCS limit","£90,000 — all of it"], correct:1,
        explanation:"The FSCS protects up to £85,000 per person per banking licence. You have £50,000 with Bank A, which is under the £85,000 limit, so you get all £50,000 back. The £40,000 with Bank B is also fully protected. Spreading money across different banking licences is important for amounts over £85,000."
      },
      { type:"match", prompt:"Match each savings account type to what it is best for",
        pairs:[
          { term:"Easy access account",  def:"Emergency fund — withdraw any time, lower interest" },
          { term:"Fixed-rate bond",       def:"Money you will not need for 1 to 5 years — higher interest but locked" },
          { term:"Regular saver",         def:"Building a habit — deposit fixed amount monthly, often highest rates" },
          { term:"Cash ISA",              def:"Long-term savings where you want all interest completely tax free" },
        ],
        explanation:"Each account type suits a different purpose. An emergency fund needs instant access. For money you can lock away, fixed-rate bonds pay more. Regular savers often offer the best rates but require consistent monthly deposits."
      },
    ]
  },

  /* ── TRACK 4: Debt ────────────────────────────────────────────────────── */
  {
    id:"good_bad_debt", track:"Debt", trackColor:T.red, trackDim:T.redDim, trackBorder:T.redBorder,
    title:"Good debt vs bad debt: not all borrowing is equal",
    emoji:"💳", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"Debt is a tool. Tools can build or destroy.", body:"A mortgage helps you own an asset that typically appreciates. A student loan funds future earning power. A credit card balance at 22% for a holiday is simply expensive consumption debt. The key question: does this debt help you build something, or does it fund spending?", highlight:null },
      { type:"fact", headline:"The real cost of a credit card balance", body:"£3,000 on a credit card at 22% APR. If you pay only the minimum (around £60/month), it takes over 8 years to clear and costs £1,900 in interest on top of the original £3,000. Pay £200/month instead and it clears in 17 months at a total interest cost of around £350.", highlight:"Paying 3x the minimum on a credit card saves years and thousands." },
      { type:"fact", headline:"UK student loans are different to commercial debt", body:"Post-2012 UK student loans are not standard consumer debt. You repay only 9% of earnings above the threshold (around £27,295). After 30 years, any remaining balance is written off entirely. For most graduates, they function more like a graduate tax than a traditional loan. Do not prioritise repaying them over building savings.", highlight:"UK student loans: repay only above threshold, written off after 30 years." },
      { type:"scenario", prompt:"You have £2,500 spare. You have a credit card at 19% APR and £2,500 in a savings account earning 4.8%. What do you do?",
        context:"You are debt-free except for this credit card balance of £2,500. Your emergency fund is separate and already fully funded.",
        choices:[
          { label:"Keep the savings — rates might rise", best:false, outcome:"You are paying 19% interest on debt and earning 4.8% on savings. The net cost to you every year is about £353." },
          { label:"Pay off the credit card in full", best:true, outcome:"Paying off 19% debt is a guaranteed 19% return. Nothing in savings comes close to this." },
          { label:"Split it half and half", best:false, outcome:"You still pay 19% interest on £1,250 — that is £237/year wasted. The full payoff is clearly better maths." },
        ],
        explanation:"Always pay off high-interest debt before optimising savings. Paying off a 19% debt is a guaranteed 19% return. A savings account at 4.8% cannot compete with that."
      },
      { type:"quiz", question:"Which debt should you prioritise paying off first according to the Avalanche method?",
        options:["Mortgage at 4.5%","Car finance at 9%","Credit card at 22.9%","Student loan at 5.4%"], correct:2,
        explanation:"The Avalanche method targets the highest interest rate first. At 22.9%, the credit card costs you the most money per pound owed. Every £1,000 of credit card balance costs you £229/year in interest."
      },
    ]
  },
  {
    id:"avalanche_snowball", track:"Debt", trackColor:T.red, trackDim:T.redDim, trackBorder:T.redBorder,
    title:"Avalanche vs Snowball: how to clear debt methodically",
    emoji:"🏔️", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"Two methods. Both work. Pick the one you will actually stick to.", body:"The Avalanche targets the highest interest rate first. It is mathematically optimal and saves the most money. The Snowball targets the smallest balance first. It is psychologically optimal and research shows higher completion rates. Both are vastly better than making minimum payments.", highlight:null },
      { type:"interactive", id:"debt_sorter", prompt:"See the difference in action — toggle between strategies",
        debtExample:[ { name:"Credit card", balance:2400, rate:22.9 }, { name:"Car loan", balance:8000, rate:9.0 }, { name:"Personal loan", balance:5000, rate:14.5 } ]
      },
      { type:"fact", headline:"The debt-free date calculation that motivates", body:"Take your highest-interest debt. Divide the balance by how much you can throw at it monthly. That is your months to freedom. Then roll that same payment onto the next debt — this is the snowball or avalanche effect. Each debt cleared speeds up the next one.", highlight:null },
      { type:"quiz", question:"The Snowball method typically costs more money overall than the Avalanche. Why might someone still choose it?",
        options:["It is always cheaper in the long run","The early wins build momentum and reduce the chance of giving up","It works better for mortgages","It is recommended by UK financial regulators"], correct:1,
        explanation:"Research on debt repayment behaviour shows that psychological momentum matters. Getting a debt to zero quickly creates a win that motivates continued effort. For people who have tried and failed before, the Snowball may result in them actually finishing — which beats the Avalanche mathematically if you would otherwise give up."
      },
    ]
  },

  /* ── TRACK 5: Investing ────────────────────────────────────────────────── */
  {
    id:"isa_basics", track:"Investing", trackColor:T.purple, trackDim:T.purpleDim, trackBorder:"rgba(139,92,246,.3)",
    title:"ISAs: the UK's most powerful tax-free wrapper",
    emoji:"🛡️", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"What is an ISA — in plain English?", body:"ISA stands for Individual Savings Account. It is a special type of account offered by UK banks and investment platforms that has one superpower: everything inside it is completely protected from tax. Interest, dividends, and investment gains inside an ISA are yours to keep in full. HMRC gets nothing. You can put up to £20,000 in each tax year.", highlight:"Any money inside an ISA grows 100% tax free. Forever." },
      { type:"fact", headline:"ISA vs normal account — the tax difference in real numbers", body:"You invest £10,000 and it grows to £40,000 over 20 years. In a regular account, you would pay capital gains tax on the £30,000 gain — potentially £7,200 at the 24% rate. In an ISA, you pay zero. The same investment in an ISA and a normal account starts identically. Over decades, the ISA version pulls significantly ahead because gains are never eroded by tax.", highlight:"£30,000 gain in a regular account: ~£7,200 tax. Same gain in an ISA: £0." },
      { type:"match", prompt:"Match each ISA type to its best use case",
        pairs:[
          { term:"Cash ISA",              def:"Tax-free interest on savings — best for short to medium term goals" },
          { term:"Stocks and Shares ISA", def:"Investing in funds and shares — best for 5+ year goals" },
          { term:"Lifetime ISA (LISA)",   def:"First home purchase or retirement — government adds 25% bonus up to £1,000/year" },
          { term:"Junior ISA",            def:"Saving for a child — locked until age 18" },
        ],
        explanation:"Each ISA type has a specific purpose. The Stocks and Shares ISA is the most powerful long-term wealth building tool for most people. The LISA bonus is genuinely free money if you are buying your first home under £450,000 or saving for retirement under 40."
      },
      { type:"fact", headline:"Index funds: the simplest investment inside an ISA", body:"Once you have opened a Stocks and Shares ISA, you need to decide what to invest in. For most people, a global index fund is the clearest answer. An index fund simply buys a small slice of hundreds or thousands of companies in one go — like buying the market as a whole rather than trying to pick individual winners. Annual fees of 0.1 to 0.2%. No expertise required.", highlight:null,
        facts:[
          { icon:"🌍", label:"Global index fund (e.g. MSCI All World)", text:"Tracks the performance of approximately 3,000 companies across 23 countries. Instant global diversification. Available on all major UK platforms." },
          { icon:"🇬🇧", label:"UK index fund (e.g. FTSE All Share)", text:"UK-focused. Simpler and popular but concentrates your investment in one country's economy." },
          { icon:"🏦", label:"Where to open one", text:"Vanguard, Hargreaves Lansdown, AJ Bell, and Freetrade all offer ISAs with access to index funds. Charges vary — typically 0.15 to 0.45% platform fee plus the fund's ongoing charges." },
        ]
      },
      { type:"quiz", question:"You invest £15,000 into a Stocks and Shares ISA. After 25 years it grows to £87,000. How much Capital Gains Tax do you owe?",
        options:["£14,400 at 20%","Depends on your income tax bracket","£0 — ISA gains are completely tax free","£3,600 on the first £18,000 of gain"], correct:2,
        explanation:"Zero. ISA gains are completely tax free regardless of the amount. No income tax on dividends either. This is why maximising your ISA allowance every year — especially in your 20s and 30s — is one of the most impactful financial decisions you can make."
      },
    ]
  },
  {
    id:"dca_investing", track:"Investing", trackColor:T.purple, trackDim:T.purpleDim, trackBorder:"rgba(139,92,246,.3)",
    title:"Dollar Cost Averaging: why regular investing beats timing",
    emoji:"📅", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"DCA: invest a fixed amount on a fixed schedule, always", body:"Dollar Cost Averaging means investing the same amount of money at regular intervals — weekly, monthly, regardless of what the market is doing. When prices are high, your fixed amount buys fewer units. When prices fall, it buys more. Over time this averages out your cost and removes the stress of timing.", highlight:null },
      { type:"fact", headline:"Why timing the market fails almost everyone", body:"Professional fund managers consistently underperform index funds over 15+ years. Retail investors do worse still — research shows the average investor earns significantly less than the funds they invest in, because they buy when things look good and sell when they fall. DCA removes the temptation to act on emotion.", highlight:"Time in the market beats timing the market. Almost every time." },
      { type:"fact", headline:"How to set up a regular contribution in 3 steps",
        body:"The setup takes 20 minutes. The discipline is then automatic.",
        facts:[
          { icon:"1️⃣", label:"Choose an amount", text:"Set an amount you can commit to every month without thinking about it. Even £50/month builds meaningful wealth over a decade." },
          { icon:"2️⃣", label:"Set a standing order for payday", text:"Schedule the transfer on the day you are paid so it leaves before you can spend it. Most ISA providers support direct debits." },
          { icon:"3️⃣", label:"Keep allocations the same", text:"Do not adjust your investments based on news or market movements. Stick to your chosen fund. Changing strategy when markets fall is the single most common investing mistake." },
        ]
      },
      { type:"scenario", prompt:"Markets have fallen 20% in the last three months. You have a monthly standing order investing into a global index fund. What do you do?",
        context:"You have been investing £300/month for 2 years. Your portfolio is now worth less than you put in.",
        choices:[
          { label:"Pause the standing order until markets recover", best:false, outcome:"You would miss buying units at a 20% discount. This is exactly when DCA works in your favour — more units for the same money." },
          { label:"Keep investing — maybe increase the amount if possible", best:true, outcome:"A 20% fall means your £300 buys 25% more units than before. This is the DCA advantage in action." },
          { label:"Sell and wait to buy back lower", best:false, outcome:"Trying to time a re-entry is notoriously difficult. Most investors who sell during falls buy back later at higher prices, locking in their losses." },
        ],
        explanation:"Market falls are buying opportunities for long-term investors with regular contributions. Every pound invested during a downturn buys more of a recovery. The worst thing to do is stop — the best thing is to continue or increase."
      },
      { type:"quiz", question:"Which of these best describes why DCA reduces risk compared to lump-sum investing?",
        options:["It guarantees higher returns","It removes the risk of investing everything right before a market peak","It is protected by the FSCS","It avoids capital gains tax"], correct:1,
        explanation:"DCA spreads your entry point over time. If you invested a lump sum right before a market crash, you face a large immediate loss. With DCA, you invest through the crash, buying cheaper units along the way, which lowers your average cost."
      },
    ]
  },
  {
    id:"pension_basics", track:"Investing", trackColor:T.purple, trackDim:T.purpleDim, trackBorder:"rgba(139,92,246,.3)",
    title:"Pensions: the most tax-efficient investment most people underuse",
    emoji:"🏖️", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"A pension is a tax-advantaged investment account — nothing more", body:"Your pension is your money, in your name, invested. The key difference from an ISA: contributions attract tax relief. The government effectively adds 20% for basic rate taxpayers, 40% for higher rate. The trade-off: you cannot access the money until age 57.", highlight:null },
      { type:"fact", headline:"Auto-enrolment: never leave your employer match on the table", body:"Employers must contribute at least 3% of qualifying earnings to your pension. If you contribute the minimum 5%, you get 3% free on top. If you opt out, you are declining part of your compensation — it is as if you refused part of your salary.", highlight:"Never opt out of a pension with employer matching — it is free money." },
      { type:"slider", prompt:"See how tax relief makes pension contributions more powerful",
        label:"Gross contribution to pension", prefix:"£", min:100, max:2000, step:50, defaultVal:500,
        compute: v => {
          const basicCost  = Math.round(v * 0.80)
          const higherCost = Math.round(v * 0.60)
          const additionalCost = Math.round(v * 0.55)
          return [
            { label:"Pension receives", value:`£${v.toLocaleString("en-GB")}`, highlight:true },
            { label:"Costs you (basic rate, 20%)", value:`£${basicCost.toLocaleString("en-GB")}` },
            { label:"Costs you (higher rate, 40%)", value:`£${higherCost.toLocaleString("en-GB")}` },
            { label:"Costs you (additional rate, 45%)", value:`£${additionalCost.toLocaleString("en-GB")}` },
          ]
        },
        insight: v => `A £${v.toLocaleString("en-GB")} pension contribution costs a basic rate taxpayer only £${Math.round(v*0.8).toLocaleString("en-GB")}. A higher rate taxpayer who claims the extra relief through self-assessment pays just £${Math.round(v*0.6).toLocaleString("en-GB")}. The pension receives the full £${v.toLocaleString("en-GB")} either way.`
      },
      { type:"quiz", question:"Your employer matches pension contributions up to 5%. You earn £42,000/year but only contribute 3%. How much free money are you leaving each year?",
        options:["£252","£504","£840","£1,260"], correct:2,
        explanation:"5% of £42,000 is £2,100. Your employer would contribute £2,100 if you put in 5%. At 3%, your employer contributes £1,260. The gap is £840/year of employer contribution you are forfeiting — just by not increasing your own contribution by 2%."
      },
    ]
  },

  /* ── TRACK 6: Big Life Decisions ─────────────────────────────────────────── */
  {
    id:"mortgage_guide", track:"Big Decisions", trackColor:"#22C55E", trackDim:"rgba(34,197,94,.1)", trackBorder:"rgba(34,197,94,.3)",
    title:"Buying your first home: how mortgages actually work",
    emoji:"🏠", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"Before you apply — the three things that matter most", body:"Mortgage lenders are assessing one question: how likely are you to repay? Your credit score, recent spending behaviour, and deposit size are the three biggest factors. You can influence all three in the 3 to 6 months before applying.", highlight:null,
        facts:[
          { icon:"📋", label:"Check and improve your credit score", text:"Use ClearScore, Experian, or Equifax (all free). Improve by paying off outstanding debt, closing unused credit cards, and avoiding new credit applications in the 3 months before applying." },
          { icon:"💰", label:"Demonstrate responsible spending", text:"Lenders typically review 3 to 6 months of bank statements. Reduce lifestyle spending. Avoid large unexplained transactions. Look like a sensible spender for the period leading up to the application." },
          { icon:"🏦", label:"Understand how much you can borrow", text:"Most lenders offer 4 to 5 times your annual salary. At £50,000 salary, that is £200,000 to £250,000. A higher deposit (lower LTV) unlocks better interest rates and more lender options." },
        ]
      },
      { type:"fact", headline:"LTV — the number that determines your interest rate", body:"Loan to Value (LTV) is the mortgage amount as a percentage of the property value. If you borrow £180,000 on a £225,000 property, your LTV is 80%. The lower your LTV, the less risk to the lender, and the better the interest rate. A 10% deposit (90% LTV) gives you far fewer options than a 25% deposit (75% LTV).", highlight:"Lower LTV = better rate + more lender choice. Every extra percent of deposit helps." },
      { type:"slider", prompt:"How does your deposit size affect how much you can buy?",
        label:"Annual gross salary", prefix:"£", min:20000, max:120000, step:1000, defaultVal:45000,
        compute: v => {
          const max4x = v*4, max5x = v*5
          const dep10 = Math.round(max4x * 0.111), dep15 = Math.round(max4x * 0.176), dep25 = Math.round(max4x * 0.333)
          return [
            { label:"Borrow up to (4x salary)", value:`£${max4x.toLocaleString("en-GB")}` },
            { label:"Borrow up to (5x salary)", value:`£${max5x.toLocaleString("en-GB")}`, highlight:true },
            { label:"Property at 90% LTV (10% dep)", value:`£${Math.round(max4x/0.90).toLocaleString("en-GB")} — need £${dep10.toLocaleString("en-GB")} deposit` },
            { label:"Property at 85% LTV (15% dep)", value:`£${Math.round(max4x/0.85).toLocaleString("en-GB")} — need £${dep15.toLocaleString("en-GB")} deposit` },
            { label:"Property at 75% LTV (25% dep)", value:`£${Math.round(max4x/0.75).toLocaleString("en-GB")} — need £${dep25.toLocaleString("en-GB")} deposit` },
          ]
        },
        insight: v => `At £${v.toLocaleString("en-GB")} salary, saving an extra 5% deposit could unlock better mortgage rates and save you thousands over the mortgage term. The jump from 90% to 85% LTV is often where the biggest rate improvements occur.`
      },
      { type:"quiz", question:"What is an Agreement in Principle (AIP) and why does it matter?",
        options:["A legally binding mortgage offer from a lender","A soft assessment showing how much a lender would likely offer — needed before making an offer","Proof that your deposit is ready to transfer","A government scheme for first-time buyers"], correct:1,
        explanation:"An AIP is a soft check showing a lender would likely lend to you. Estate agents take buyers more seriously when they have one. Importantly, getting an AIP from one lender does not commit you to using them — you can still shop around for the best rate once an offer is accepted."
      },
    ]
  },

  /* ── TRACK 7: Mindset ────────────────────────────────────────────────── */
  {
    id:"money_psychology", track:"Mindset", trackColor:T.muted, trackDim:T.faint, trackBorder:T.border,
    title:"Why your brain is wired to make bad financial decisions",
    emoji:"🧠", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"Present bias: why future you does not feel real", body:"Humans are hardwired to value immediate reward over future reward. A £100 reward today feels worth more than £130 guaranteed in a year — even though rationally it is not. This is why saving feels painful and spending feels good. The antidote is automation: remove the decision entirely.", highlight:null },
      { type:"fact", headline:"Lifestyle inflation: the silent wealth killer", body:"You get a £5,000 pay rise. Within 6 months, your spending rises by £5,000. Sound familiar? Humans adapt to new normals quickly. The antidote: every time your income rises, raise your savings first, on the same day, then spend whatever remains.", highlight:"When income rises, raise savings on the same day. Then spend the rest." },
      { type:"fact", headline:"Loss aversion: losses hurt twice as much as gains feel good", body:"Daniel Kahneman won the Nobel Prize for proving that losing £100 feels roughly twice as painful as gaining £100 feels good. This leads to holding losing investments too long and selling winners too early. In practice: check your portfolio quarterly, not daily. Do not let short-term pain drive long-term decisions.", highlight:null },
      { type:"rank", prompt:"Rank these financial behaviours from most to least wealth-building over 20 years",
        items:["Investing 15% of income consistently regardless of market conditions","Spending several hours researching individual stocks each week","Checking and reacting to your portfolio daily","Increasing your savings rate each time your income rises","Keeping a 6-month emergency fund to avoid needing debt"],
        answer:"Best order: (1) Consistent investing at 15% — this alone outperforms almost any other behaviour. (2) Increasing savings rate when income rises — prevents lifestyle inflation. (3) Emergency fund — prevents debt when life happens. (4) Researching stocks — some value but high time cost, index funds usually win long-term. (5) Checking portfolio daily — shown to lead to worse returns through emotional decisions."
      },
      { type:"quiz", question:"Loss aversion means most people feel more pain losing £500 than pleasure gaining £500. The main investment mistake this causes is:",
        options:["Investing too much too early","Holding losing investments too long to avoid 'making the loss real'","Diversifying too widely","Checking account balances too rarely"], correct:1,
        explanation:"Loss aversion causes investors to hold losing positions far too long because selling would make the loss 'real'. This is irrational — the loss already exists whether you sell or not. The question is always whether you expect the investment to recover, not whether selling feels painful."
      },
    ]
  },

  /* ── TRACK 8: Islamic Finance ───────────────────────────────────────────── */
  {
    id:"islamic_foundations", track:"Islamic Finance", trackColor:"#10B981", trackDim:"rgba(16,185,129,.1)", trackBorder:"rgba(16,185,129,.3)",
    title:"Islamic finance: the core principles",
    emoji:"☪️", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"What makes Islamic finance different", body:"Islamic finance operates under Sharia law, which prohibits riba (interest), excessive uncertainty, and investment in businesses deemed harmful such as alcohol, gambling, tobacco, and weapons. The underlying principle is that money should not generate money simply through the passage of time. Financial returns must be linked to real economic activity and shared risk.", highlight:"Money must be linked to real activity. Profit requires shared risk." },
      { type:"fact", headline:"Riba — why interest is prohibited", body:"Riba means any guaranteed, predetermined return on money lent or borrowed. This applies to both paying and receiving interest. A conventional savings account, a mortgage, or a credit card all involve riba. Islamic alternatives replace interest with profit-sharing, leasing, or cost-plus structures that tie returns to real assets or trade.", highlight:null,
        facts:[
          { icon:"🏦", label:"Murabaha (cost-plus financing)", text:"The bank buys an asset you want and sells it to you at a disclosed markup, payable in instalments. No interest — you pay a fixed agreed profit to the bank instead." },
          { icon:"🤝", label:"Diminishing Musharakah (partnership)", text:"Bank and customer jointly own an asset. The customer gradually buys out the bank's share while paying rent on the bank's portion. Used widely for home purchases in the UK." },
          { icon:"🌱", label:"Mudarabah (profit-sharing)", text:"One party provides capital, the other provides expertise and labour. Profits are shared at an agreed ratio. Losses fall only on the capital provider unless negligence is proven." },
        ]
      },
      { type:"match", prompt:"Match each Islamic finance concept to its description",
        pairs:[
          { term:"Riba",       def:"Prohibited interest or guaranteed return on money alone" },
          { term:"Murabaha",   def:"Bank buys asset and sells at disclosed markup with no interest" },
          { term:"Sukuk",      def:"Islamic bond backed by real assets, not debt obligations" },
          { term:"Zakat",      def:"Obligatory annual wealth contribution of 2.5% on qualifying assets" },
        ],
        explanation:"Riba is the core prohibition. Murabaha is the most common financing alternative. Sukuk replaces conventional bonds for borrowing and investing. Zakat is the financial pillar of Islam that redistributes wealth across the community."
      },
      { type:"quiz", question:"A UK Muslim wants to buy a home without a conventional interest-bearing mortgage. What is the most common Sharia-compliant structure?",
        options:["Rent permanently to avoid the market","Diminishing Musharakah — bank and buyer co-own, buyer gradually buys out the bank","Take a conventional mortgage but donate the interest to charity","A standard ISA-backed purchase plan"], correct:1,
        explanation:"Diminishing Musharakah is offered by UK Islamic banks including Al Rayan, Gatehouse, and HSBC Amanah. The bank and buyer co-own the property. The buyer pays rent on the bank's share while gradually buying it out over time. No interest is charged — the bank earns rental income instead."
      },
    ]
  },
  {
    id:"islamic_investing", track:"Islamic Finance", trackColor:"#10B981", trackDim:"rgba(16,185,129,.1)", trackBorder:"rgba(16,185,129,.3)",
    title:"Halal investing: ISAs, pensions, and Zakat",
    emoji:"📿", xp:10, type:"mixed",
    cards:[
      { type:"fact", headline:"ISAs and pensions are permissible wrappers — screen what is inside them", body:"An ISA or pension is just a tax-efficient account structure. There is nothing impermissible about the wrapper itself. What matters is what you hold inside it. A Stocks and Shares ISA containing a Sharia-compliant global ETF is entirely permissible. The same ISA holding shares in a conventional bank or tobacco company is not.", highlight:"Use the ISA wrapper — just choose Sharia-compliant funds to hold inside it." },
      { type:"fact", headline:"Sharia-compliant funds available in the UK",
        body:"A growing number of funds apply Sharia screening with oversight from Islamic scholar boards. These are available through mainstream ISA platforms.", highlight:null,
        facts:[
          { icon:"🌍", label:"HSBC Islamic Global Equity Index", text:"Tracks the MSCI World Islamic Index. Low cost and broadly diversified across global markets with interest-based companies screened out." },
          { icon:"📊", label:"iShares MSCI World Islamic UCITS ETF", text:"BlackRock's Sharia-compliant global equity ETF. Available on most UK platforms including Hargreaves Lansdown and AJ Bell." },
          { icon:"🏦", label:"Wahed Invest", text:"A UK-regulated Sharia-compliant investment platform. Offers ready-made halal portfolios and an ISA wrapper. Designed specifically for Muslim investors." },
        ]
      },
      { type:"fact", headline:"Zakat on investments — the 2.5% annual obligation", body:"Zakat is one of the five pillars of Islam: an annual obligation to contribute 2.5% of qualifying wealth above the nisab threshold — approximately the value of 85 grams of gold, currently around £4,500 to £5,000. Investment holdings and cash savings above this threshold are zakatable. Your primary home, vehicles for personal use, and basic household goods are generally exempt.", highlight:"Zakat: 2.5% of qualifying wealth above the nisab threshold, paid each year." },
      { type:"scenario", prompt:"You receive £400 in dividends from a Sharia-screened ETF. The fund's purification report states 3% of income came from impermissible sources. What do you do?",
        context:"Your ISA performed well. The ETF is certified Sharia-compliant but like all diversified funds, a small percentage of income came from borderline sources.",
        choices:[
          { label:"Exit the investment — it is not fully pure", best:false, outcome:"This is overly cautious. Minor impurities in diversified Sharia funds are normal and addressed through purification, not exit." },
          { label:"Donate 3% of the £400 (£12) to charity as purification", best:true, outcome:"Correct. Purification removes the impermissible portion. The remaining £388 is permissible to keep. This is standard practice." },
          { label:"Do nothing — the ETF is Sharia-certified so all income is clean", best:false, outcome:"Sharia certification means the fund is broadly compliant, not that zero purification is ever needed. The certification actually requires purification." },
        ],
        explanation:"Purification is standard in Islamic investing. Most Sharia fund providers publish annual purification ratios. You donate that percentage of your income to charity. It is typically a very small amount and takes a few minutes to calculate each year."
      },
      { type:"quiz", question:"What is the nisab threshold — the minimum wealth level at which Zakat becomes obligatory?",
        options:["A fixed £10,000 set annually by UK scholars","The value of approximately 85 grams of gold, around £4,500 to £5,000","£2,500 — one year of minimum savings","There is no fixed amount; it is at personal discretion"], correct:1,
        explanation:"The nisab is pegged to the value of 85 grams of gold (or 595 grams of silver — scholars use the lower). At current gold prices this is roughly £4,500 to £5,000, but it changes with the gold price. If your total qualifying wealth exceeds this for a full lunar year, Zakat of 2.5% is due."
      },
    ]
  },
]

/* ── LEARN: XP & progress helpers ────────────────────────────────────────── */
const totalLessons = LESSONS.length
function getLessonProgress(state, lessonId) { return state.completedLessons?.includes(lessonId) }

/* ── Compound interest calculator card ───────────────────────────────────── */
/* ── Growth chart card (compound interest visual) ────────────────────────── */
function GrowthChartCard() {
  const [monthly, setMonthly] = useState(200)

  const chartData = useMemo(() => {
    const points = []
    for (let yr = 0; yr <= 30; yr += 1) {
      let b4 = 0, b7 = 0, b10 = 0
      for (let m = 0; m < yr * 12; m++) {
        b4  = b4  * (1 + 0.04 / 12) + monthly
        b7  = b7  * (1 + 0.07 / 12) + monthly
        b10 = b10 * (1 + 0.10 / 12) + monthly
      }
      points.push({
        yr,
        contributed: Math.round(monthly * yr * 12),
        at4:  Math.round(b4),
        at7:  Math.round(b7),
        at10: Math.round(b10),
      })
    }
    return points
  }, [monthly])

  const fmtK = v => v >= 1_000_000 ? `£${(v/1_000_000).toFixed(2)}M` : `£${(v/1000).toFixed(0)}k`
  const last = chartData[chartData.length - 1]

  return (
    <div style={{ background:T.surface, borderRadius:16, padding:"18px 18px 14px" }}>
      {/* Monthly slider */}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ color:T.muted, fontSize:13 }}>Monthly investment</span>
          <span style={{ color:T.teal, fontWeight:900, fontSize:18, fontVariantNumeric:"tabular-nums" }}>£{monthly}/mo</span>
        </div>
        <input type="range" min={25} max={1000} step={25} value={monthly}
          onChange={e => setMonthly(Number(e.target.value))}
          style={{ width:"100%", accentColor:T.teal, cursor:"pointer" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ color:T.subtle, fontSize:11 }}>£25</span>
          <span style={{ color:T.subtle, fontSize:11 }}>£1,000</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={chartData} margin={{ top:4, right:8, bottom:0, left:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A2540" vertical={false}/>
          <XAxis dataKey="yr" tick={{ fill:T.subtle, fontSize:10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v % 5 === 0 && v > 0 ? `${v}yr` : ""}/>
          <YAxis tickFormatter={fmtK} tick={{ fill:T.subtle, fontSize:10 }} axisLine={false} tickLine={false} width={52}/>
          <Tooltip
            formatter={(val, name) => [fmtK(val), name]}
            contentStyle={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, fontSize:12 }}
            labelFormatter={yr => `Year ${yr}`}
            itemStyle={{ color:T.white }}
          />
          <Line dataKey="contributed" name="Contributed" stroke={T.subtle} strokeWidth={1.5} strokeDasharray="4 3" dot={false}/>
          <Line dataKey="at4"  name="4% (cash/bonds)"  stroke="#64748B" strokeWidth={2}   dot={false}/>
          <Line dataKey="at7"  name="7% (stocks ISA)"  stroke={T.teal}   strokeWidth={2.5} dot={false}/>
          <Line dataKey="at10" name="10% (ambitious)"  stroke={T.purple} strokeWidth={2}   dot={false}/>
        </LineChart>
      </ResponsiveContainer>

      {/* Final values at 30 yrs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
        {[
          { label:"Put in",    value:fmtK(last.contributed), color:T.subtle },
          { label:"At 4%",     value:fmtK(last.at4),         color:"#64748B" },
          { label:"At 7%",     value:fmtK(last.at7),         color:T.teal },
          { label:"At 10%",    value:fmtK(last.at10),        color:T.purple },
        ].map(r => (
          <div key={r.label} style={{ textAlign:"center", background:T.card, borderRadius:10, padding:"10px 6px" }}>
            <p style={{ color:T.muted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{r.label}</p>
            <p style={{ color:r.color, fontSize:13, fontWeight:900, fontVariantNumeric:"tabular-nums" }}>{r.value}</p>
            <p style={{ color:T.muted, fontSize:9, marginTop:2 }}>30 yrs</p>
          </div>
        ))}
      </div>

      <p style={{ color:T.muted, fontSize:12, marginTop:10, lineHeight:1.6 }}>
        The gap between the dashed line (what you put in) and the coloured lines is entirely interest on interest. That gap widens every single year.
      </p>
    </div>
  )
}

function CompoundCalcCard() {
  const [vals, setVals] = useState({ principal:1000, monthly:200, rate:7, years:20 })
  const set = (k,v) => setVals(p=>({...p,[k]:Math.max(0,v)}))
  const total = useMemo(()=>{
    let bal = vals.principal
    const monthlyRate = vals.rate / 100 / 12
    for(let m=0;m<vals.years*12;m++){ bal = bal*(1+monthlyRate) + vals.monthly }
    return Math.round(bal)
  },[vals])
  const contributed = Math.round(vals.principal + vals.monthly*vals.years*12)
  const growth = total - contributed

  return (
    <div style={{ background:T.surface,borderRadius:16,padding:"18px" }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
        {[
          { id:"principal",label:"Starting amount",prefix:"£",suffix:"" },
          { id:"monthly",  label:"Monthly addition",prefix:"£",suffix:"" },
          { id:"rate",     label:"Annual return",   prefix:"",  suffix:"%" },
          { id:"years",    label:"Years",           prefix:"",  suffix:"yrs" },
        ].map(f=>(
          <div key={f.id}>
            <p style={{ color:T.subtle,fontSize:11,fontWeight:600,marginBottom:5 }}>{f.label}</p>
            <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:10,overflow:"hidden" }}>
              {f.prefix&&<span style={{ padding:"0 10px",color:T.subtle,fontSize:14,fontWeight:700 }}>{f.prefix}</span>}
              <input type="number" min="0" value={vals[f.id]} onChange={e=>set(f.id,parseFloat(e.target.value)||0)}
                style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:14,fontWeight:600,padding:"10px 10px 10px 0",fontFamily:"inherit" }}/>
              {f.suffix&&<span style={{ padding:"0 10px",color:T.subtle,fontSize:13 }}>{f.suffix}</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
        {[
          { l:"You put in", v:`£${contributed.toLocaleString("en-GB")}`, c:T.muted },
          { l:"Interest earned", v:`£${growth.toLocaleString("en-GB")}`, c:T.teal },
          { l:"Total value", v:`£${total.toLocaleString("en-GB")}`, c:T.white },
        ].map(k=>(
          <div key={k.l} style={{ background:T.card,borderRadius:10,padding:"10px 12px",textAlign:"center" }}>
            <p style={{ color:T.subtle,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4 }}>{k.l}</p>
            <p style={{ color:k.c,fontSize:14,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{k.v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Debt sorter interactive ─────────────────────────────────────────────── */
function DebtSorterCard({ debts }) {
  const avalanche = [...debts].sort((a,b)=>b.rate-a.rate)
  const snowball  = [...debts].sort((a,b)=>a.balance-b.balance)
  const [mode, setMode] = useState("avalanche")
  const ordered = mode==="avalanche" ? avalanche : snowball

  // Very rough interest saved calculation
  const calcInterest = (sorted) => sorted.reduce((total,d,i)=>{
    const monthsWait = sorted.slice(0,i).reduce((s,x)=>s+x.balance/200,0)
    return total + d.balance * (d.rate/100) * (monthsWait/12 + d.balance/2400)
  },0)
  const avaInt = Math.round(calcInterest(avalanche))
  const snoInt = Math.round(calcInterest(snowball))

  return (
    <div style={{ background:T.surface,borderRadius:16,padding:"18px" }}>
      <div style={{ display:"flex",background:T.card,borderRadius:10,padding:3,gap:3,marginBottom:14 }}>
        {["avalanche","snowball"].map(m=>(
          <button key={m} onClick={()=>setMode(m)}
            style={{ flex:1,padding:"8px",borderRadius:8,border:"none",background:mode===m?T.teal:"transparent",color:mode===m?"#fff":T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",textTransform:"capitalize" }}>
            {m === "avalanche" ? "⛏️ Avalanche" : "⛄ Snowball"}
          </button>
        ))}
      </div>
      <p style={{ color:T.muted,fontSize:12,marginBottom:12 }}>
        {mode==="avalanche"?"Highest interest rate first — saves the most money":"Smallest balance first — fastest early wins"}
      </p>
      {ordered.map((d,i)=>(
        <div key={d.name} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,background:T.card,borderRadius:10,padding:"10px 14px" }}>
          <div style={{ width:24,height:24,borderRadius:"50%",background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <span style={{ color:T.teal,fontSize:11,fontWeight:800 }}>{i+1}</span>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{d.name}</p>
            <p style={{ color:T.subtle,fontSize:11 }}>{d.rate}% APR · £{d.balance.toLocaleString("en-GB")}</p>
          </div>
          <span style={{ color:mode==="avalanche"?T.red:T.purple,fontWeight:700,fontSize:12 }}>
            {mode==="avalanche"?`${d.rate}% rate`:`£${d.balance.toLocaleString("en-GB")} balance`}
          </span>
        </div>
      ))}
      <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"10px 14px",marginTop:10 }}>
        <p style={{ color:T.teal,fontSize:12,fontWeight:700 }}>
          {mode==="avalanche"
            ? `Avalanche saves roughly £${(snoInt-avaInt).toLocaleString("en-GB")} more vs snowball on these debts`
            : `Snowball gives you your first win ${Math.round(snowball[0].balance/200)} months sooner`}
        </p>
      </div>
    </div>
  )
}

/* ── Lesson player ────────────────────────────────────────────────────────── */
function LessonPlayer({ lesson, onBack }) {
  const { state, save } = useApp()
  const [cardIdx,  setCardIdx]  = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [rankOrder,setRankOrder]= useState(null)
  const [matched,  setMatched]  = useState({})
  const [matchSel, setMatchSel] = useState(null)
  const [matchDone,setMatchDone]= useState(false)
  const [shuffledDefs,setShuffledDefs] = useState(null)
  const [sliderVal,setSliderVal]= useState(null)
  const [scenPick, setScenPick] = useState(null)
  const [xpShown,  setXpShown]  = useState(false)
  const cards = lesson.cards
  const card  = cards[cardIdx]
  const isLast = cardIdx === cards.length - 1

  // Reset AND init all card state in one effect — prevents rank/slider init being wiped by the reset
  useEffect(()=>{
    setSelected(null); setAnswered(false)
    setMatched({}); setMatchSel(null); setMatchDone(false); setScenPick(null)
    setRankOrder(card?.type==="rank" ? card.items.map((_,i)=>i) : null)
    setSliderVal(card?.type==="slider" ? (card.defaultVal ?? Math.round((card.min+card.max)/2)) : null)
    if(card?.type==="match") {
      const order = card.pairs.map((_,i)=>i)
      for(let i=order.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]] }
      setShuffledDefs(order)
    } else { setShuffledDefs(null) }
  },[cardIdx]) // card is derived from cardIdx so no separate dep needed

  function canAdvance() {
    if(card.type==="quiz")     return answered
    if(card.type==="match")    return matchDone
    if(card.type==="scenario") return scenPick !== null
    return true
  }

  function advance() {
    if(isLast) {
      if(!state.completedLessons?.includes(lesson.id)) {
        const pts = (state.profile.points||0) + lesson.xp
        save({ ...state, completedLessons:[...(state.completedLessons||[]),lesson.id], profile:{ ...state.profile,points:pts } })
      }
      setXpShown(true)
    } else setCardIdx(i=>i+1)
  }

  if(xpShown) return (
    <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 32px",flexDirection:"column",textAlign:"center",overflowY:"auto" }}>
      <div style={{ fontSize:72,marginBottom:16 }}>🎉</div>
      <p style={{ color:T.white,fontSize:26,fontWeight:900,marginBottom:10 }}>Lesson complete!</p>
      <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"14px 32px",marginBottom:24 }}>
        <p style={{ color:T.teal,fontSize:22,fontWeight:900 }}>+{lesson.xp} XP</p>
      </div>
      <p style={{ color:T.muted,fontSize:15,lineHeight:1.7,maxWidth:380,marginBottom:32 }}>Knowledge only matters when you act on it. Head to Track or Goals to put this into practice.</p>
      <div style={{ maxWidth:280,width:"100%",marginBottom:80 }}><Btn onClick={onBack}>Back to Learn</Btn></div>
    </div>
  )

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",minHeight:0 }}>
      {/* Progress header */}
      <div style={{ padding:"14px 20px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0,background:T.bg }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"inherit",fontSize:13,padding:"4px 0",flexShrink:0 }}>
          <ChevronLeft size={16}/>Back
        </button>
        <div style={{ flex:1,background:T.surface,borderRadius:99,height:6,overflow:"hidden" }}>
          <div style={{ width:`${((cardIdx+1)/cards.length)*100}%`,height:"100%",background:lesson.trackColor,borderRadius:99,transition:"width .4s ease-out" }}/>
        </div>
        <span style={{ color:T.subtle,fontSize:12,fontWeight:700,flexShrink:0 }}>{cardIdx+1} / {cards.length}</span>
      </div>

      {/* Scrollable card area */}
      <div style={{ flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch" }}>
        <div style={{ padding:"24px 24px 16px",maxWidth:660,margin:"0 auto" }}>

          {/* FACT card */}
          {card.type==="fact" && (
            <div>
              <div style={{ background:lesson.trackDim,border:`1px solid ${lesson.trackBorder}`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span style={{ fontSize:15 }}>{lesson.emoji}</span>
                <span style={{ color:lesson.trackColor,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>{lesson.track}</span>
              </div>
              <h2 style={{ color:T.white,fontSize:"clamp(17px,2.5vw,24px)",fontWeight:900,lineHeight:1.25,marginBottom:16 }}>{card.headline}</h2>
              <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.85 }}>{card.body}</p>
              {card.highlight && (
                <div style={{ background:`linear-gradient(135deg,${lesson.trackDim},rgba(0,0,0,0))`,border:`1px solid ${lesson.trackBorder}`,borderLeft:`4px solid ${lesson.trackColor}`,borderRadius:"0 12px 12px 0",padding:"14px 18px",marginTop:16 }}>
                  <p style={{ color:lesson.trackColor,fontSize:14,fontWeight:700,lineHeight:1.6 }}>{card.highlight}</p>
                </div>
              )}
              {card.facts && (
                <div style={{ display:"flex",flexDirection:"column",gap:10,marginTop:18 }}>
                  {card.facts.map((f,i)=>(
                    <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:13,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start" }}>
                      <span style={{ fontSize:20,flexShrink:0 }}>{f.icon}</span>
                      <div>
                        <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:3 }}>{f.label}</p>
                        <p style={{ color:T.muted,fontSize:13,lineHeight:1.6 }}>{f.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUIZ card */}
          {card.type==="quiz" && (
            <div>
              <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span>❓</span>
                <span style={{ color:T.amber,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>Quick check</span>
              </div>
              <h2 style={{ color:T.white,fontSize:"clamp(15px,2vw,20px)",fontWeight:800,lineHeight:1.4,marginBottom:20 }}>{card.question}</h2>
              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
                {card.options.map((opt,i)=>{
                  const isCorrect=i===card.correct, isSel=selected===i
                  let bg=T.card,bord=T.border,col=T.white
                  if(answered){ if(isCorrect){bg="rgba(34,197,94,.12)";bord="#22C55E";col="#22C55E"} else if(isSel){bg=T.redDim;bord=T.redBorder;col=T.red} else col=T.subtle }
                  else if(isSel){ bg=T.tealDim;bord=T.teal }
                  return (
                    <button key={i} disabled={answered} onClick={()=>{ setSelected(i); setAnswered(true) }}
                      style={{ background:bg,border:`2px solid ${bord}`,borderRadius:13,padding:"13px 16px",cursor:answered?"default":"pointer",textAlign:"left",color:col,fontSize:14,fontWeight:600,fontFamily:"inherit",transition:"all .15s",display:"flex",alignItems:"center",gap:10 }}>
                      <span style={{ width:26,height:26,borderRadius:"50%",background:answered&&isCorrect?"#22C55E":answered&&isSel&&!isCorrect?T.red:T.surface,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:800,color:answered&&(isCorrect||isSel)?"#fff":T.subtle,transition:"all .15s" }}>
                        {answered&&isCorrect?"✓":answered&&isSel&&!isCorrect?"✗":String.fromCharCode(65+i)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
              {answered && (
                <div style={{ background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.28)",borderRadius:13,padding:"14px 16px" }}>
                  <p style={{ color:"#22C55E",fontWeight:700,fontSize:13,marginBottom:5 }}>{selected===card.correct?"Correct ✓":"Not quite — here is why:"}</p>
                  <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.7 }}>{card.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* RANK card */}
          {card.type==="rank" && rankOrder && (
            <div>
              <div style={{ background:T.purpleDim,border:`1px solid rgba(139,92,246,.3)`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span>🔢</span>
                <span style={{ color:T.purple,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>Rank it</span>
              </div>
              <h2 style={{ color:T.white,fontSize:"clamp(15px,2vw,20px)",fontWeight:800,lineHeight:1.4,marginBottom:6 }}>{card.prompt}</h2>
              <p style={{ color:T.muted,fontSize:13,marginBottom:18 }}>Tap to move items up or down.</p>
              <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:16 }}>
                {rankOrder.map((origIdx,pos)=>(
                  <div key={origIdx} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <span style={{ color:T.teal,fontWeight:800,fontSize:12 }}>{pos+1}</span>
                    </div>
                    <p style={{ flex:1,color:T.white,fontSize:14,fontWeight:600 }}>{card.items[origIdx]}</p>
                    <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                      {pos>0 && <button onClick={()=>setRankOrder(o=>{ const n=[...o]; [n[pos-1],n[pos]]=[n[pos],n[pos-1]]; return n })}
                        style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><ChevronUp size={13}/></button>}
                      {pos<rankOrder.length-1 && <button onClick={()=>setRankOrder(o=>{ const n=[...o]; [n[pos],n[pos+1]]=[n[pos+1],n[pos]]; return n })}
                        style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><ChevronDown size={13}/></button>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"12px 16px" }}>
                <p style={{ color:T.teal,fontWeight:700,fontSize:13,marginBottom:4 }}>Recommended order:</p>
                <p style={{ color:T.muted,fontSize:13,lineHeight:1.65 }}>{card.answer}</p>
              </div>
            </div>
          )}

          {/* MATCH card */}
          {card.type==="match" && shuffledDefs && (
            <div>
              <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span>🔗</span>
                <span style={{ color:T.amber,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>Match it</span>
              </div>
              <h2 style={{ color:T.white,fontSize:"clamp(15px,2vw,19px)",fontWeight:800,lineHeight:1.4,marginBottom:6 }}>{card.prompt}</h2>
              <p style={{ color:T.muted,fontSize:13,marginBottom:18 }}>Tap a term, then tap its definition to match them.</p>
              {(() => {
                const pairs = card.pairs
                // shuffledDefs[displayPos] = original pair index shown at that position
                return (
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                      <p style={{ color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2 }}>Terms</p>
                      {pairs.map((_,termOrigIdx)=>{
                        const isMatched = Object.values(matched).includes(termOrigIdx)
                        const isSel = matchSel?.side==="term"&&matchSel?.idx===termOrigIdx
                        return (
                          <button key={termOrigIdx} disabled={isMatched||matchDone} onClick={()=>{
                            if(matchSel?.side==="def") {
                              const newMatched={...matched,[matchSel.displayPos]:termOrigIdx}
                              setMatched(newMatched); setMatchSel(null)
                              if(Object.keys(newMatched).length===pairs.length) setMatchDone(true)
                            } else setMatchSel({side:"term",idx:termOrigIdx})
                          }} style={{ background:isMatched?"rgba(34,197,94,.1)":isSel?T.tealDim:T.card,border:`2px solid ${isMatched?"#22C55E":isSel?T.teal:T.border}`,borderRadius:11,padding:"10px 12px",cursor:isMatched?"default":"pointer",color:isMatched?"#22C55E":T.white,fontSize:12,fontWeight:600,fontFamily:"inherit",textAlign:"left",transition:"all .15s" }}>
                            {pairs[termOrigIdx].term}
                          </button>
                        )
                      })}
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                      <p style={{ color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2 }}>Definitions</p>
                      {shuffledDefs.map((origIdx,displayPos)=>{
                        const isMatched = matched[displayPos]!==undefined
                        const isSel = matchSel?.side==="def"&&matchSel?.displayPos===displayPos
                        const isCorrect = isMatched && matched[displayPos]===origIdx
                        return (
                          <button key={displayPos} disabled={isMatched||matchDone} onClick={()=>{
                            if(matchSel?.side==="term") {
                              const newMatched={...matched,[displayPos]:matchSel.idx}
                              setMatched(newMatched); setMatchSel(null)
                              if(Object.keys(newMatched).length===pairs.length) setMatchDone(true)
                            } else setMatchSel({side:"def",displayPos})
                          }} style={{ background:isMatched?(isCorrect?"rgba(34,197,94,.1)":T.redDim):isSel?T.amberDim:T.card,border:`2px solid ${isMatched?(isCorrect?"#22C55E":T.red):isSel?T.amber:T.border}`,borderRadius:11,padding:"10px 12px",cursor:isMatched?"default":"pointer",color:isMatched?(isCorrect?"#22C55E":T.red):T.muted,fontSize:12,fontWeight:500,fontFamily:"inherit",textAlign:"left",lineHeight:1.4,transition:"all .15s" }}>
                            {pairs[origIdx].def}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
              {matchDone && (
                <div style={{ background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.28)",borderRadius:12,padding:"12px 16px",marginTop:14 }}>
                  <p style={{ color:"#22C55E",fontWeight:700,fontSize:13,marginBottom:4 }}>
                    {Object.entries(matched).filter(([dp,termIdx])=>shuffledDefs[parseInt(dp)]===termIdx).length===card.pairs.length ? "Perfect match ✓" : "Good effort — check the correct pairings above"}
                  </p>
                  <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.65 }}>{card.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* SLIDER card */}
          {card.type==="slider" && sliderVal!==null && (
            <div>
              <div style={{ background:T.purpleDim,border:`1px solid rgba(139,92,246,.3)`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span>🎚️</span>
                <span style={{ color:T.purple,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>Explore</span>
              </div>
              <h2 style={{ color:T.white,fontSize:"clamp(15px,2vw,20px)",fontWeight:800,lineHeight:1.4,marginBottom:20 }}>{card.prompt}</h2>
              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                  <span style={{ color:T.subtle,fontSize:13 }}>{card.label}</span>
                  <span style={{ color:T.teal,fontWeight:900,fontSize:18,fontVariantNumeric:"tabular-nums" }}>{card.prefix||""}{sliderVal.toLocaleString("en-GB")}{card.suffix||""}</span>
                </div>
                <input type="range" min={card.min} max={card.max} step={card.step||1} value={sliderVal} onChange={e=>setSliderVal(Number(e.target.value))}
                  style={{ width:"100%",accentColor:T.teal,marginBottom:14,cursor:"pointer" }}/>
                <div style={{ background:T.surface,borderRadius:12,padding:"14px 16px" }}>
                  {card.compute(sliderVal).map((row,i)=>(
                    <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:i<card.compute(sliderVal).length-1?`1px solid ${T.border}`:"none" }}>
                      <span style={{ color:T.muted,fontSize:13 }}>{row.label}</span>
                      <span style={{ color:row.highlight?T.teal:T.white,fontWeight:700,fontSize:13,fontVariantNumeric:"tabular-nums" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color:T.muted,fontSize:12,marginTop:10,lineHeight:1.6 }}>{card.insight(sliderVal)}</p>
              </div>
            </div>
          )}

          {/* SCENARIO card */}
          {card.type==="scenario" && (
            <div>
              <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span>🤔</span>
                <span style={{ color:T.amber,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>Your call</span>
              </div>
              <h2 style={{ color:T.white,fontSize:"clamp(15px,2vw,20px)",fontWeight:800,lineHeight:1.4,marginBottom:6 }}>{card.prompt}</h2>
              <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.65,marginBottom:20 }}>{card.context}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
                {card.choices.map((c,i)=>{
                  const isSel=scenPick===i
                  return (
                    <button key={i} onClick={()=>setScenPick(i)}
                      style={{ background:isSel?(c.best?T.tealDim:T.amberDim):T.card,border:`2px solid ${isSel?(c.best?T.teal:T.amber):T.border}`,borderRadius:13,padding:"14px 16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s" }}>
                      <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:isSel?6:0 }}>{c.label}</p>
                      {isSel && <p style={{ color:c.best?T.teal:T.amber,fontSize:13,lineHeight:1.6 }}>{c.outcome}</p>}
                    </button>
                  )
                })}
              </div>
              {scenPick!==null && (
                <div style={{ background:card.choices[scenPick].best?"rgba(34,197,94,.08)":T.amberDim,border:`1px solid ${card.choices[scenPick].best?"rgba(34,197,94,.28)":T.amberBorder}`,borderRadius:12,padding:"14px 16px" }}>
                  <p style={{ color:card.choices[scenPick].best?"#22C55E":T.amber,fontWeight:700,fontSize:13,marginBottom:5 }}>
                    {card.choices[scenPick].best?"Smart move ✓":"There is a better option"}
                  </p>
                  <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.7 }}>{card.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* INTERACTIVE card */}
          {card.type==="interactive" && (
            <div>
              <div style={{ background:T.purpleDim,border:`1px solid rgba(139,92,246,.3)`,borderRadius:10,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,marginBottom:16 }}>
                <span>🎮</span>
                <span style={{ color:T.purple,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:.8 }}>Interactive</span>
              </div>
              <h2 style={{ color:T.white,fontSize:18,fontWeight:800,marginBottom:14 }}>{card.prompt}</h2>
              {card.id==="growth_chart"  && <GrowthChartCard/>}
              {card.id==="compound_calc" && <CompoundCalcCard/>}
              {card.id==="debt_sorter"   && <DebtSorterCard debts={card.debtExample}/>}
            </div>
          )}

        </div>

        {/* CTA inside scroll area so it's always reachable */}
        <div style={{ padding:"12px 24px 100px",maxWidth:660,margin:"0 auto" }}>
          <button onClick={canAdvance()?advance:undefined}
            style={{ width:"100%",padding:"16px",borderRadius:14,border:"none",background:canAdvance()?T.teal:"#1E2D47",color:canAdvance()?"#fff":T.subtle,fontSize:15,fontWeight:800,cursor:canAdvance()?"pointer":"default",fontFamily:"inherit",transition:"all .2s",letterSpacing:.3 }}>
            {card.type==="quiz"&&!answered ? "Choose an answer above" : card.type==="match"&&!matchDone ? "Match all pairs above" : card.type==="scenario"&&scenPick===null ? "Make your choice above" : isLast ? "Complete lesson →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Lesson card (grid item) ─────────────────────────────────────────────── */
function LessonCard({ lesson, completed, locked, onClick }) {
  return (
    <button onClick={!locked?onClick:undefined}
      style={{ background:T.card,border:`1.5px solid ${completed?lesson.trackColor:locked?"transparent":T.border}`,borderRadius:18,padding:"20px 22px",cursor:locked?"default":"pointer",textAlign:"left",opacity:locked?.5:1,fontFamily:"inherit",position:"relative",overflow:"hidden",transition:"all .2s",width:"100%",display:"block" }}
      onMouseEnter={e=>{ if(!locked&&!completed) e.currentTarget.style.borderColor=lesson.trackColor }}
      onMouseLeave={e=>{ if(!locked&&!completed) e.currentTarget.style.borderColor=T.border }}>
      {completed && <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:lesson.trackColor }}/>}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
        <span style={{ fontSize:28,flexShrink:0 }}>{lesson.emoji}</span>
        <div style={{ display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end" }}>
          {completed
            ? <span style={{ background:"rgba(34,197,94,.12)",border:"1px solid rgba(34,197,94,.3)",borderRadius:99,padding:"3px 10px",color:"#22C55E",fontSize:10,fontWeight:700 }}>✓ Done</span>
            : locked
            ? <span style={{ color:T.subtle,fontSize:12 }}>🔒</span>
            : <span style={{ background:lesson.trackDim,border:`1px solid ${lesson.trackBorder}`,borderRadius:99,padding:"3px 10px",color:lesson.trackColor,fontSize:10,fontWeight:700 }}>+{lesson.xp} XP</span>
          }
          <span style={{ background:lesson.trackDim,borderRadius:99,padding:"2px 8px",fontSize:10,color:lesson.trackColor,fontWeight:600 }}>{lesson.track}</span>
        </div>
      </div>
      <p style={{ color:T.white,fontWeight:800,fontSize:14,lineHeight:1.4,marginTop:12,marginBottom:6 }}>{lesson.title}</p>
      <p style={{ color:T.subtle,fontSize:12 }}>{lesson.cards.filter(c=>c.type==="quiz").length} questions · {lesson.cards.length} cards</p>
    </button>
  )
}

/* ── Learn tab ───────────────────────────────────────────────────────────── */
function LearnTab() {
  const { state } = useApp()
  const [activeLesson, setActiveLesson] = useState(null)
  const completed = state.completedLessons || []
  const totalXP   = completed.reduce((s,id)=>{ const l=LESSONS.find(x=>x.id===id); return s+(l?.xp||0) },0)
  const pct       = Math.round((completed.length/LESSONS.length)*100)

  const tracks = [...new Set(LESSONS.map(l=>l.track))]

  if(activeLesson) return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <LessonPlayer lesson={activeLesson} onBack={()=>setActiveLesson(null)} onComplete={()=>setActiveLesson(null)}/>
    </div>
  )

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"24px 32px 120px" }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>

        {/* Header progress */}
        <div className="fade-up" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"22px 26px",marginBottom:20 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
            <div>
              <p style={{ color:T.white,fontWeight:800,fontSize:17 }}>Your learning progress</p>
              <p style={{ color:T.subtle,fontSize:13,marginTop:2 }}>{completed.length} of {LESSONS.length} lessons complete</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:T.teal,fontWeight:900,fontSize:22,fontVariantNumeric:"tabular-nums" }}>{totalXP} XP</p>
              <p style={{ color:T.subtle,fontSize:11 }}>earned so far</p>
            </div>
          </div>
          <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden" }}>
            <div style={{ width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width 1s ease-out" }}/>
          </div>
          <p style={{ color:T.subtle,fontSize:12,marginTop:6 }}>{pct}% complete · {LESSONS.length-completed.length} lesson{LESSONS.length-completed.length!==1?"s":""} to go</p>
        </div>

        {/* Track sections */}
        {tracks.map(track=>{
          const trackLessons = LESSONS.filter(l=>l.track===track)
          const cfg = trackLessons[0]
          return (
            <div key={track} style={{ marginBottom:28 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                <div style={{ width:10,height:10,borderRadius:"50%",background:cfg.trackColor }}/>
                <p style={{ color:T.white,fontWeight:800,fontSize:15 }}>{track}</p>
                <span style={{ color:T.subtle,fontSize:12 }}>{trackLessons.filter(l=>completed.includes(l.id)).length}/{trackLessons.length} done</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12 }}>
                {trackLessons.map((lesson,i)=>(
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    completed={completed.includes(lesson.id)}
                    locked={false}
                    onClick={()=>setActiveLesson(lesson)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD 6 — REWARDS TAB + SETTINGS + POLISH
═══════════════════════════════════════════════════════════════════════════ */

const XP_LEVELS = [
  { level:1, label:"Newcomer",   min:0,   color:"#64748B", emoji:"🌱" },
  { level:2, label:"Explorer",   min:50,  color:T.teal,    emoji:"🧭" },
  { level:3, label:"Builder",    min:120, color:T.blue,    emoji:"🏗️"  },
  { level:4, label:"Grower",     min:220, color:T.purple,  emoji:"🌿" },
  { level:5, label:"Achiever",   min:360, color:T.amber,   emoji:"⭐" },
  { level:6, label:"Free",       min:550, color:"#22C55E", emoji:"🆓" },
]

const BADGES = [
  /* Behaviour */
  { id:"first_lesson",   label:"First lesson",     emoji:"📚", desc:"Complete your first lesson",        condition:s=>(s.completedLessons||[]).length>=1 },
  { id:"track_complete", label:"Track complete",    emoji:"🎓", desc:"Complete all lessons in one track", condition:s=>{ const tracks=[...new Set(LESSONS.map(l=>l.track))]; return tracks.some(t=>LESSONS.filter(l=>l.track===t).every(l=>(s.completedLessons||[]).includes(l.id))) }},
  { id:"half_lessons",   label:"Halfway there",     emoji:"🏅", desc:"Complete 6 or more lessons",        condition:s=>(s.completedLessons||[]).length>=6 },
  { id:"all_lessons",    label:"Graduate",          emoji:"🎓", desc:"Complete every lesson",              condition:s=>(s.completedLessons||[]).length>=LESSONS.length },
  { id:"first_goal",     label:"Goal setter",       emoji:"🎯", desc:"Create your first goal",            condition:s=>(s.goals||[]).length>=1 },
  { id:"three_goals",    label:"Planner",           emoji:"📋", desc:"Set three or more goals",           condition:s=>(s.goals||[]).length>=3 },
  { id:"breakdown_done", label:"Spending analyst",  emoji:"🔍", desc:"Complete the spending breakdown",   condition:s=>!!(s.spending?.breakdown) },
  { id:"positive_nw",    label:"In the black",      emoji:"✅", desc:"Achieve a positive net worth",      condition:s=>{ const {netWorth}=calcTotals(s.assets,s.debts); return netWorth>0 } },
  /* Outcome */
  { id:"nw_10k",         label:"£10k club",         emoji:"💰", desc:"Reach £10,000 net worth",           condition:s=>{ const {netWorth}=calcTotals(s.assets,s.debts); return netWorth>=10000 } },
  { id:"nw_50k",         label:"£50k milestone",    emoji:"🏆", desc:"Reach £50,000 net worth",           condition:s=>{ const {netWorth}=calcTotals(s.assets,s.debts); return netWorth>=50000 } },
  { id:"no_debt",        label:"Debt free",         emoji:"🗑️", desc:"Have zero total debts",             condition:s=>s.debts.length===0||s.debts.reduce((t,d)=>t+d.balance,0)===0 },
  { id:"has_investment", label:"Investor",          emoji:"📈", desc:"Have a wealth-builder asset",       condition:s=>s.assets.some(a=>["isa","pension","investment","stocks"].includes(a.category)) },
  { id:"emergency_fund", label:"Safety net",        emoji:"🛡️", desc:"Have 3+ months expenses in savings",condition:s=>{ const monthly=s.spending.monthly||0; const savings=s.assets.filter(a=>a.category==="savings").reduce((t,a)=>t+a.value,0); return monthly>0&&savings>=monthly*3 } },
  { id:"isa_lesson",     label:"ISA fluent",        emoji:"🧠", desc:"Complete the ISA lesson",           condition:s=>(s.completedLessons||[]).includes("isa_basics") },
]

function getLevelInfo(xp) {
  let lvl = XP_LEVELS[0]
  for(const l of XP_LEVELS) if(xp>=l.min) lvl=l
  return lvl
}
function getNextLevel(xp) {
  return XP_LEVELS.find(l=>l.min>xp) || null
}

function RewardsTab() {
  const { state } = useApp()
  const xp = state.profile.points || 0
  const lvl = getLevelInfo(xp)
  const nextLvl = getNextLevel(xp)
  const pctToNext = nextLvl ? Math.round(((xp - lvl.min)/(nextLvl.min - lvl.min))*100) : 100
  const earned = BADGES.filter(b=>b.condition(state))
  const locked = BADGES.filter(b=>!b.condition(state))
  const completedLessons = state.completedLessons || []
  const totalXP = completedLessons.reduce((s,id)=>{ const l=LESSONS.find(x=>x.id===id); return s+(l?.xp||0) },0)

  return (
    <div style={{ flex:1,overflowY:"auto",padding:"24px 32px 120px" }}>
      <div style={{ maxWidth:900,margin:"0 auto" }}>

        {/* Level card */}
        <div style={{ background:`linear-gradient(135deg,${T.card},${T.surface})`,border:`1.5px solid ${lvl.color}33`,borderRadius:22,padding:"24px 28px",marginBottom:20,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:140,height:140,borderRadius:"50%",background:`${lvl.color}0A` }}/>
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:20 }}>
            <div style={{ width:60,height:60,borderRadius:20,background:`${lvl.color}22`,border:`2px solid ${lvl.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0 }}>{lvl.emoji}</div>
            <div style={{ flex:1 }}>
              <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>Level {lvl.level}</p>
              <p style={{ color:lvl.color,fontSize:24,fontWeight:900 }}>{lvl.label}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:T.white,fontSize:28,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{xp}</p>
              <p style={{ color:T.subtle,fontSize:11 }}>total XP</p>
            </div>
          </div>
          {nextLvl ? (
            <>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
                <span style={{ color:T.muted,fontSize:12 }}>{xp} XP</span>
                <span style={{ color:T.muted,fontSize:12 }}>{nextLvl.label} at {nextLvl.min} XP</span>
              </div>
              <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden" }}>
                <div style={{ width:`${pctToNext}%`,height:"100%",background:lvl.color,borderRadius:99,transition:"width 1s ease-out" }}/>
              </div>
              <p style={{ color:T.subtle,fontSize:12,marginTop:6 }}>{nextLvl.min-xp} XP until {nextLvl.emoji} {nextLvl.label}</p>
            </>
          ) : (
            <div style={{ background:`${lvl.color}15`,border:`1px solid ${lvl.color}33`,borderRadius:12,padding:"10px 16px" }}>
              <p style={{ color:lvl.color,fontWeight:700,fontSize:13 }}>Maximum level reached. You are financially free. 🎉</p>
            </div>
          )}
        </div>

        {/* XP breakdown */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24 }}>
          {[
            { l:"Lessons done",  v:`${completedLessons.length}/${LESSONS.length}`, c:T.teal   },
            { l:"Badges earned", v:`${earned.length}/${BADGES.length}`,            c:T.purple },
            { l:"XP earned",     v:totalXP,                                        c:T.amber  },
          ].map(k=>(
            <div key={k.l} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",textAlign:"center" }}>
              <p style={{ color:T.subtle,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>{k.l}</p>
              <p style={{ color:k.c,fontSize:20,fontWeight:900,fontVariantNumeric:"tabular-nums" }}>{k.v}</p>
            </div>
          ))}
        </div>

        {/* Level roadmap */}
        <div style={{ marginBottom:28 }}>
          <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Level roadmap</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {XP_LEVELS.map((l,i)=>{
              const isCurrentLevel = getLevelInfo(xp).level === l.level
              const isDone = xp >= l.min
              const isNext = !isDone && (i===0||xp>=XP_LEVELS[i-1].min)
              return (
                <div key={l.level} style={{ display:"flex",alignItems:"center",gap:12,background:isCurrentLevel?`${l.color}0F`:T.card,border:`1px solid ${isCurrentLevel?l.color:T.border}`,borderRadius:13,padding:"12px 16px" }}>
                  <div style={{ width:36,height:36,borderRadius:12,background:isDone?`${l.color}22`:"transparent",border:`2px solid ${isDone?l.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
                    {isDone ? l.emoji : "🔒"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <p style={{ color:isDone?T.white:T.subtle,fontWeight:700,fontSize:14 }}>Level {l.level}: {l.label}</p>
                      {isCurrentLevel && <span style={{ background:`${l.color}22`,color:l.color,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99 }}>Current</span>}
                    </div>
                    <p style={{ color:T.subtle,fontSize:12,marginTop:2 }}>{l.min} XP {i<XP_LEVELS.length-1?`· next at ${XP_LEVELS[i+1].min}`:""}</p>
                  </div>
                  {isDone && <span style={{ color:"#22C55E",fontSize:16 }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Badges earned */}
        {earned.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Badges earned ({earned.length})</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
              {earned.map(b=>(
                <div key={b.id} style={{ background:T.card,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"16px",textAlign:"center" }}>
                  <div style={{ fontSize:32,marginBottom:8 }}>{b.emoji}</div>
                  <p style={{ color:T.white,fontWeight:800,fontSize:13,marginBottom:4 }}>{b.label}</p>
                  <p style={{ color:T.subtle,fontSize:11,lineHeight:1.5 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges locked */}
        {locked.length > 0 && (
          <div>
            <p style={{ color:T.subtle,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Locked ({locked.length})</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
              {locked.map(b=>(
                <div key={b.id} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px",textAlign:"center",opacity:.7 }}>
                  <div style={{ fontSize:32,marginBottom:8,filter:"grayscale(1)" }}>{b.emoji}</div>
                  <p style={{ color:T.subtle,fontWeight:700,fontSize:13,marginBottom:4 }}>{b.label}</p>
                  <p style={{ color:T.subtle,fontSize:11,lineHeight:1.5 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── PLACEHOLDER TABS ───────────────────────────────────────────────────── */
function PlaceholderTab({ name, build, desc }) {
  return (
    <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:48 }}>
      <div style={{ textAlign:"center",maxWidth:440 }}>
        <div style={{ width:76,height:76,borderRadius:24,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}><Star size={32} color={T.teal}/></div>
        <h2 style={{ color:T.white,fontSize:26,fontWeight:900,marginBottom:10 }}>{name}</h2>
        <p style={{ color:T.muted,fontSize:15,lineHeight:1.65,marginBottom:24 }}>{desc}</p>
        <span style={{ background:T.tealDim,color:T.teal,fontSize:13,fontWeight:700,padding:"7px 18px",borderRadius:99,border:`1px solid ${T.tealBorder}` }}>Coming in {build}</span>
      </div>
    </div>
  )
}

/* ── APP SHELL ──────────────────────────────────────────────────────────── */
function AppShell() {
  const { tab, state, reset, loadDemo } = useApp()
  const [settingsOpen,setSettingsOpen] = useState(false)
  const name = state.profile.name
  const xp = state.profile.points || 0
  const lvl = getLevelInfo(xp)
  const completedLessons = state.completedLessons || []

  const CONTENT=[
    <HomeTab/>,
    <TrackTab/>,
    <GoalsTab/>,
    <LearnTab/>,
    <RewardsTab/>,
  ]
  return (
    <div style={{ height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden" }}>
      <style>{`
        *::-webkit-scrollbar{display:none}
        *{-ms-overflow-style:none;scrollbar-width:none}
        input[type=range]{height:6px;-webkit-appearance:none;appearance:none;background:transparent}
        input[type=range]::-webkit-slider-runnable-track{background:${T.border};height:6px;border-radius:99px}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:${T.teal};margin-top:-7px;cursor:pointer}
        input[type=range]::-moz-range-track{background:${T.border};height:6px;border-radius:99px}
        input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:${T.teal};border:none;cursor:pointer}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
      `}</style>
      <header style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:T.teal }}/><span style={{ color:T.teal,fontSize:12,fontWeight:800,letterSpacing:2.5 }}>LIFESMART</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:99,padding:"5px 12px" }}>
            <span style={{ fontSize:13 }}>{lvl.emoji}</span>
            <span style={{ color:lvl.color,fontWeight:800,fontSize:12 }}>{xp} XP</span>
          </div>
          <button onClick={()=>setSettingsOpen(s=>!s)} style={{ width:36,height:36,borderRadius:"50%",background:T.card,border:`1.5px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            {name?<span style={{ color:T.teal,fontWeight:800,fontSize:14 }}>{name[0].toUpperCase()}</span>:<User size={16} color={T.muted}/>}
          </button>
        </div>
      </header>
      <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0 }}>{CONTENT[tab]}</div>
      <BottomNav/>

      {/* Settings slide-over */}
      {settingsOpen && (
        <div style={{ position:"fixed",inset:0,zIndex:500 }} onClick={()=>setSettingsOpen(false)}>
          <div style={{ position:"absolute",top:60,right:16,background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"0",minWidth:300,maxWidth:360,boxShadow:"0 24px 80px rgba(0,0,0,.7)",animation:"scaleIn .2s ease-out",overflow:"hidden" }} onClick={e=>e.stopPropagation()}>
            {/* Profile header */}
            <div style={{ background:T.card,padding:"20px 22px 16px",borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:14,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ color:T.teal,fontWeight:900,fontSize:18 }}>{name?name[0].toUpperCase():"?"}</span>
                </div>
                <div>
                  <p style={{ color:T.white,fontWeight:800,fontSize:16 }}>{name||"Your profile"}</p>
                  <p style={{ color:T.subtle,fontSize:13,marginTop:2 }}>Age {state.profile.age||"?"} · {lvl.emoji} {lvl.label}</p>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div style={{ padding:"16px 22px",borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
                {[
                  { l:"XP",      v:xp,                       c:T.teal   },
                  { l:"Lessons", v:`${completedLessons.length}/${LESSONS.length}`, c:T.purple },
                  { l:"Goals",   v:(state.goals||[]).length,  c:T.amber  },
                ].map(k=>(
                  <div key={k.l} style={{ textAlign:"center",background:T.card,borderRadius:10,padding:"10px 8px" }}>
                    <p style={{ color:k.c,fontWeight:900,fontSize:17,fontVariantNumeric:"tabular-nums" }}>{k.v}</p>
                    <p style={{ color:T.subtle,fontSize:10,marginTop:2 }}>{k.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Actions */}
            <div style={{ padding:"16px 22px",display:"flex",flexDirection:"column",gap:10 }}>
              <button onClick={()=>{ loadDemo(); setSettingsOpen(false) }}
                style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"12px 16px",color:T.teal,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:10 }}>
                <Sparkles size={15}/>Load example data (Alex, 34)
              </button>
              <button onClick={()=>{ if(window.confirm("Reset all data? This cannot be undone.")) { reset();setSettingsOpen(false) } }}
                style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"12px 16px",color:T.red,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:10 }}>
                <Trash2 size={15}/>Reset all data
              </button>
            </div>
            <p style={{ color:T.subtle,fontSize:11,textAlign:"center",padding:"0 22px 16px" }}>LifeSmart · Your data stays on your device</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── ROOT ───────────────────────────────────────────────────────────────── */
const SCREENS={ welcome:WelcomeScreen,why:WhyScreen,profile:ProfileScreen,assets:AssetsScreen,debts:DebtsScreen,income:IncomeScreen,reveal:RevealScreen }
function Router() { const { view }=useApp(); if(view==="app") return <AppShell/>; const Screen=SCREENS[view]||WelcomeScreen; return <Screen/> }
export default function App() { return <AppProvider><Router/></AppProvider> }
