import { useState, useEffect, useContext, createContext, useMemo, useRef } from "react"
import { Home, BookOpen, User, Check, X, ChevronLeft, ChevronRight, Pencil, Trash2, Plus, Star, Sparkles, TrendingUp, Shield, Lock, Target, Zap, Info } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from "recharts"

const G = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',system-ui,sans-serif;background:#070D1A;-webkit-font-smoothing:antialiased}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type=number]{-moz-appearance:textfield}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1C2D47;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes twinkle{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.85;transform:scale(1.5)}}
@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(15,191,184,.4)}70%{box-shadow:0 0 0 10px rgba(15,191,184,0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes countUp{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
@keyframes slideCard{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(15,191,184,.2)}50%{box-shadow:0 0 40px rgba(15,191,184,.5)}}
.ls-float{animation:float 4s ease-in-out infinite}
.ls-star{animation:twinkle var(--d,2s) ease-in-out var(--dl,0s) infinite}
.ls-fadein{animation:fadeUp .5s ease-out forwards}
.ls-slidein{animation:slideIn .35s ease-out forwards}
.ls-slidecard{animation:slideCard .4s ease-out forwards}
.ls-countup{animation:countUp .6s cubic-bezier(.34,1.56,.64,1) forwards}
.ls-pulse{animation:pulse 2.5s ease-in-out infinite}
.ls-shimmer{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.06) 50%,transparent 100%);background-size:200% 100%;animation:shimmer 2s linear infinite}
.ls-glow{animation:glow 3s ease-in-out infinite}
`

const T = {
  bg:"#070D1A", surface:"#0B1424", card:"#0F1D32", cardHover:"#142240",
  border:"#1B2C45", borderLight:"#223A5E",
  teal:"#0FBFB8", tealMid:"#14D4CC", tealDim:"rgba(15,191,184,.10)", tealBorder:"rgba(15,191,184,.30)",
  amber:"#F59E0B", amberDim:"rgba(245,158,11,.10)", amberBorder:"rgba(245,158,11,.28)",
  red:"#F87171", redDim:"rgba(248,113,113,.10)", redBorder:"rgba(248,113,113,.28)",
  purple:"#A78BFA", purpleDim:"rgba(167,139,250,.12)", purpleBorder:"rgba(167,139,250,.3)",
  green:"#34D399", greenDim:"rgba(52,211,153,.10)", blue:"#60A5FA", blueDim:"rgba(96,165,250,.1)", blueBorder:"rgba(96,165,250,.3)",
  white:"#F0F6FF", muted:"#7A8FA8", subtle:"#344D68", faint:"#162038"
}

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════════ */
const ASSET_TYPES = [
  { id:"property",    label:"Property",     icon:"🏠", cat:"primary_residence", desc:"Home, flat, land",         hint:"Check Zoopla or Rightmove",          bucket:"life"   },
  { id:"savings",     label:"Savings",      icon:"💰", cat:"savings",           desc:"Cash, ISA, current acct",  hint:"Check your banking app",             bucket:"safety" },
  { id:"pension",     label:"Pension",      icon:"🏛️", cat:"pension",           desc:"Workplace or personal",    hint:"Your pension provider app or letter", bucket:"wealth" },
  { id:"investments", label:"Investments",  icon:"📈", cat:"investments",       desc:"Stocks, funds, S&S ISA",   hint:"Your ISA or investment platform",    bucket:"wealth" },
  { id:"vehicle",     label:"Vehicle",      icon:"🚗", cat:"vehicle",           desc:"Car, motorbike",           hint:"Check AutoTrader with your reg plate",bucket:"life"   },
  { id:"gold",        label:"Gold/Crypto",  icon:"✨", cat:"other",             desc:"Precious metals, crypto",  hint:"Your exchange or wallet balance",     bucket:"wealth" },
  { id:"business",    label:"Business",     icon:"💼", cat:"business",          desc:"Business equity",          hint:"Estimated value of your stake",       bucket:"wealth" },
  { id:"other",       label:"Other",        icon:"📦", cat:"other",             desc:"Art, collectibles, other", hint:"Estimated resale value",              bucket:"life"   },
]

const DEBT_TYPES = [
  { id:"mortgage",    label:"Mortgage",          icon:"🏠", cat:"mortgage",      assumedRate:4.5,  desc:"Home loan" },
  { id:"credit_card", label:"Credit Cards",      icon:"💳", cat:"credit_card",   assumedRate:24.0, desc:"Balance you're carrying" },
  { id:"car_finance", label:"Car Finance",       icon:"🚗", cat:"car_loan",      assumedRate:9.0,  desc:"PCP or HP agreement" },
  { id:"personal",    label:"Personal Loan",     icon:"👤", cat:"personal_loan", assumedRate:11.0, desc:"Bank or P2P loan" },
  { id:"bnpl",        label:"Buy Now Pay Later", icon:"🛍️", cat:"personal_loan", assumedRate:29.0, desc:"Klarna, Laybuy etc." },
  { id:"overdraft",   label:"Overdraft",         icon:"🏦", cat:"personal_loan", assumedRate:19.0, desc:"Bank overdraft" },
  { id:"other_debt",  label:"Other Debt",        icon:"📦", cat:"personal_loan", assumedRate:15.0, desc:"Any other borrowing" },
]

const PRIORITY_GOALS = [
  { id:"pay_debt",   icon:"💳", label:"Pay off debt",              color:T.red,    lesson:"good_bad_debt" },
  { id:"invest",     icon:"📈", label:"Start investing",           color:T.purple, lesson:"isa_basics" },
  { id:"net_worth",  icon:"📊", label:"Grow my net worth",         color:T.teal,   lesson:"nw_basics" },
  { id:"save",       icon:"🎯", label:"Save for something",        color:T.green,  lesson:"nw_basics" },
  { id:"pension",    icon:"🏛️", label:"Sort my pension",           color:T.blue,   lesson:"nw_basics" },
  { id:"budget",     icon:"🥧", label:"Budget better",             color:T.amber,  lesson:"nw_basics" },
  { id:"calm",       icon:"😌", label:"Stop worrying about money", color:"#F9A8D4",lesson:"nw_basics" },
  { id:"learn",      icon:"💡", label:"Learn how money works",     color:T.teal,   lesson:"compound_interest" },
  { id:"house",      icon:"🏠", label:"Buy a house",               color:T.amber,  lesson:"isa_basics" },
]

const GOAL_TYPES = [
  { id:"emergency",   label:"Emergency fund",   icon:"🛡️", color:T.teal,   dim:T.tealDim,   border:T.tealBorder },
  { id:"home",        label:"Buy a home",        icon:"🏠", color:T.blue,   dim:T.blueDim,   border:T.blueBorder },
  { id:"holiday",     label:"Holiday",           icon:"✈️", color:T.amber,  dim:T.amberDim,  border:T.amberBorder },
  { id:"invest",      label:"Start investing",   icon:"📈", color:T.purple, dim:T.purpleDim, border:T.purpleBorder },
  { id:"retirement",  label:"Retirement pot",    icon:"🏖️", color:T.green,  dim:T.greenDim,  border:"rgba(52,211,153,.3)" },
  { id:"debt",        label:"Clear debt",        icon:"💳", color:T.red,    dim:T.redDim,    border:T.redBorder },
  { id:"education",   label:"Education",         icon:"📚", color:T.blue,   dim:T.blueDim,   border:T.blueBorder },
  { id:"other_goal",  label:"Something else",    icon:"⭐", color:T.muted,  dim:T.faint,     border:T.border },
]

const ACTION_GOALS = new Set(["invest","retirement"])

const GOAL_ACTIONS = {
  invest:[
    { id:"open_isa",    label:"Open a Stocks & Shares ISA",    desc:"The most tax-efficient way to invest in the UK.", lessonId:"isa_basics" },
    { id:"choose_fund", label:"Choose a low-cost index fund",  desc:"A global tracker gives you thousands of companies at minimal cost.", lessonId:"nw_basics" },
    { id:"set_dd",      label:"Set up a monthly direct debit", desc:"Automate it so you never miss.", lessonId:"nw_basics" },
    { id:"dca_habit",   label:"Keep it going for 3 months",    desc:"After 90 days it becomes automatic.", lessonId:"compound_interest" },
  ],
  retirement:[
    { id:"check_pension",    label:"Find your current pension value",   desc:"Log in to your pension provider.", lessonId:"nw_basics" },
    { id:"increase_contrib", label:"Increase your contribution by 1%",  desc:"Even 1% extra makes a significant difference over decades.", lessonId:"nw_basics" },
    { id:"employer_match",   label:"Check your employer match limit",   desc:"You may be leaving free money on the table.", lessonId:"nw_basics" },
    { id:"fire_number",      label:"Calculate your retirement number",  desc:"25× annual spending = the amount you need invested.", lessonId:"nw_basics" },
  ]
}

const XP_LEVELS = [
  { level:1, label:"Newcomer",  min:0,   emoji:"🌱" },
  { level:2, label:"Explorer",  min:50,  emoji:"🧭" },
  { level:3, label:"Builder",   min:120, emoji:"🏗️" },
  { level:4, label:"Grower",    min:220, emoji:"🌿" },
  { level:5, label:"Achiever",  min:360, emoji:"⭐" },
  { level:6, label:"Free",      min:550, emoji:"🔥" },
]

const BADGES = [
  { id:"first_lesson",   emoji:"📖", label:"First lesson",    desc:"Completed your first lesson",       condition: s => (s.completedLessons||[]).length >= 1 },
  { id:"five_lessons",   emoji:"🎓", label:"Five lessons",    desc:"Completed 5 lessons",                condition: s => (s.completedLessons||[]).length >= 5 },
  { id:"first_goal",     emoji:"🎯", label:"Goal setter",     desc:"Created your first goal",           condition: s => (s.goals||[]).length >= 1 },
  { id:"net_worth_pos",  emoji:"💚", label:"In the green",    desc:"Positive net worth",                 condition: s => { const { netWorth } = calcTotals(s.assets||[],s.debts||[]); return netWorth > 0 } },
  { id:"has_investment", emoji:"📈", label:"Investor",        desc:"Have an investment asset",           condition: s => (s.assets||[]).some(a=>a.category==="investments") },
  { id:"has_pension",    emoji:"🏛️", label:"Pension holder",  desc:"Have a pension asset",               condition: s => (s.assets||[]).some(a=>a.category==="pension") },
  { id:"three_assets",   emoji:"🏦", label:"Asset collector", desc:"3 or more assets tracked",          condition: s => (s.assets||[]).length >= 3 },
  { id:"streak_3",       emoji:"🔥", label:"3-week streak",   desc:"Checked in 3 weeks running",        condition: s => (s.profile?.streakWeeks||0) >= 3 },
  { id:"picked_goals",   emoji:"🧭", label:"Goal seeker",     desc:"Picked your priorities",            condition: s => (s.priorityGoals||[]).length > 0 },
]

const DEFAULTS = {
  profile: { name:"", age:null, onboardingComplete:false, points:0, streakWeeks:0, lastCheckIn:null },
  assets:[], debts:[],
  income: { primary:0, primarySource:"Salary", additional:[] },
  spending: { monthly:0, breakdown:{} },
  goals:[], history:[], completedLessons:[], badges:[],
  priorityGoals: [],
  dashboardTiles: []
}

const load = () => { try { const s=localStorage.getItem("ls_v1"); return s?{...DEFAULTS,...JSON.parse(s)}:DEFAULTS } catch { return DEFAULTS } }

/* ════════════════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════════════════ */
const fmt  = v => { if(v==null||isNaN(v)) return "£0"; const a=Math.abs(Math.round(v)).toLocaleString("en-GB"); return v<0?`-£${a}`:`£${a}` }
const fmtK = v => { if(v==null||isNaN(v)) return "£0"; const a=Math.abs(v); return a>=1000000?`£${(a/1e6).toFixed(1)}M`:a>=1000?`£${(a/1000).toFixed(0)}k`:`£${Math.round(a)}` }

const calcTotals  = (assets,debts) => {
  const ta=assets.reduce((s,a)=>s+(a.value||0),0)
  const td=debts.reduce((s,d)=>s+(d.balance||0),0)
  return { totalAssets:ta, totalDebts:td, netWorth:ta-td }
}
const calcIncome  = (inc,assets) => (inc.primary||0)+(inc.additional||[]).reduce((s,i)=>s+(i.amount||0),0)+assets.reduce((s,a)=>s+(a.monthlyIncome||0),0)
const calcSurplus = (inc,assets,sp) => calcIncome(inc,assets)-(sp.monthly||0)

const DEFAULT_RATES = { mortgage:4.5, credit_card:24, personal_loan:11, car_loan:9, student_loan:7.3, business_loan:8, other:15 }
const annualInterest    = d => (d.balance||0)*((d.interestRate ?? DEFAULT_RATES[d.category] ?? 10)/100)
const totalInterestDrag = debts => debts.reduce((s,d)=>s+annualInterest(d),0)

const buckets = assets => ({
  safetyNet:      assets.filter(a=>a.category==="savings").reduce((s,a)=>s+(a.value||0),0),
  wealthBuilders: assets.filter(a=>["investments","pension","business"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0),
  lifeAssets:     assets.filter(a=>["primary_residence","other_property","vehicle","other"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0),
})

/* Jagged projection — realistic market-style noise using seeded LCG */
const calcProjection = (nw, surplus, currentAge) => {
  const age = currentAge || 35
  const years = Math.max(70 - age, 5)
  const data = []
  // Seeded deterministic noise
  let seed = (Math.abs(Math.round(nw)) % 9973) + 1
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed / 0xffffffff) - 0.5 }

  // Generate smooth baselines first
  const balBase = [nw], conBase = [nw]
  let b = nw, c = nw
  for (let y = 1; y <= years; y++) {
    const s = Math.max(0, surplus) * 12
    b = (b + s) * 1.07
    c = (c + s) * 1.04
    balBase.push(b)
    conBase.push(c)
  }

  // Apply mean-reverting random walk noise
  let bNoise = 0, cNoise = 0
  for (let y = 0; y <= years; y++) {
    bNoise = bNoise * 0.6 + rand() * 0.12  // ±6% noise with persistence
    cNoise = cNoise * 0.6 + rand() * 0.08
    const jBal = Math.round(balBase[y] * (1 + bNoise))
    const jCon = Math.round(conBase[y] * (1 + cNoise))
    data.push({ age: age + y, balanced: Math.max(-500000, jBal), conservative: Math.max(-500000, jCon) })
  }
  return data
}

function calcGoalProgress(goal, surplus) {
  const now = new Date()
  const start = goal.createdAt ? new Date(goal.createdAt) : now
  const monthsElapsed = Math.max(0,(now-start)/(1000*60*60*24*30.4))
  const monthly = goal.monthlyAmount || Math.max(0,surplus*0.3)
  const current = Math.min(goal.startAmount+monthly*monthsElapsed, goal.targetAmount)
  const pct = goal.targetAmount>0 ? Math.min((current/goal.targetAmount)*100,100) : 0
  const remaining = Math.max(0,goal.targetAmount-current)
  const monthsLeft = monthly>0 ? Math.ceil(remaining/monthly) : null
  const eta = monthsLeft!=null ? (()=>{ const d=new Date(); d.setMonth(d.getMonth()+monthsLeft); return d.toLocaleDateString("en-GB",{month:"short",year:"numeric"}) })() : null
  return { current:Math.round(current), pct:Math.round(pct), monthsLeft, eta, monthly }
}

function getLevelInfo(xp) { return XP_LEVELS.slice().reverse().find(l=>xp>=l.min)||XP_LEVELS[0] }
function getNextLevel(xp) { const i=XP_LEVELS.findIndex(l=>l===getLevelInfo(xp)); return i<XP_LEVELS.length-1?XP_LEVELS[i+1]:null }

/* Age-based net worth benchmark (non-judgmental framing) */
function ageBenchmark(age) {
  if (!age) return null
  const a = parseInt(age)
  if (a < 25) return { median: 5000,   tracked: 18000  }
  if (a < 30) return { median: 25000,  tracked: 52000  }
  if (a < 35) return { median: 60000,  tracked: 105000 }
  if (a < 40) return { median: 110000, tracked: 185000 }
  if (a < 50) return { median: 185000, tracked: 290000 }
  if (a < 60) return { median: 310000, tracked: 460000 }
  return        { median: 420000, tracked: 610000 }
}

/* ════════════════════════════════════════════════════════════════════
   CONTEXT
   ════════════════════════════════════════════════════════════════════ */
const AppCtx = createContext(null)
const useApp = () => useContext(AppCtx)

function AppProvider({ children }) {
  const [state, setState] = useState(load)
  const [tab, setTab] = useState(0)
  const [toastMsg, setToastMsg] = useState(null)

  function save(ns) {
    const merged = { ...DEFAULTS, ...ns }
    setState(merged)
    try { localStorage.setItem("ls_v1", JSON.stringify(merged)) } catch {}
  }

  function reset() {
    setState(DEFAULTS)
    try { localStorage.removeItem("ls_v1") } catch {}
  }

  function toast(msg, dur=2400) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), dur)
  }

  return (
    <AppCtx.Provider value={{ state, save, reset, tab, setTab, toast }}>
      <style>{G}</style>
      {children}
      {toastMsg && (
        <div className="ls-fadein" style={{ position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:T.teal,color:"#070D1A",fontWeight:700,fontSize:14,padding:"10px 20px",borderRadius:99,zIndex:9999,whiteSpace:"nowrap",pointerEvents:"none" }}>
          {toastMsg}
        </div>
      )}
    </AppCtx.Provider>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SHARED UI
   ════════════════════════════════════════════════════════════════════ */
function Btn({ children, onClick, disabled, variant="primary", style:sx={} }) {
  const base = { width:"100%", padding:"15px 20px", borderRadius:14, fontFamily:"inherit", fontWeight:700, fontSize:15, cursor:disabled?"not-allowed":"pointer", opacity:disabled?.5:1, transition:"all .15s", border:"none" }
  const styles = {
    primary:   { background:disabled?T.subtle:`linear-gradient(135deg,${T.teal},${T.tealMid})`, color:"#070D1A" },
    secondary: { background:T.card, border:`1.5px solid ${T.border}`, color:T.muted },
    danger:    { background:T.redDim, border:`1.5px solid ${T.redBorder}`, color:T.red },
  }
  return <button onClick={disabled?undefined:onClick} style={{ ...base, ...styles[variant], ...sx }}>{children}</button>
}

function Input({ label, value, onChange, placeholder, type="text", min, max, helper }) {
  return (
    <div>
      {label && <p style={{ fontSize:12,color:T.muted,fontWeight:600,marginBottom:7,letterSpacing:.3 }}>{label}</p>}
      <input type={type} value={value} placeholder={placeholder||""} min={min} max={max}
        onChange={e=>onChange(type==="number"?e.target.value:e.target.value)}
        style={{ width:"100%",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,outline:"none",color:T.white,fontSize:15,padding:"12px 14px",fontFamily:"inherit",transition:"border-color .15s" }}
        onFocus={e=>e.target.style.borderColor=T.teal}
        onBlur={e=>e.target.style.borderColor=T.border}
      />
      {helper && <p style={{ fontSize:11,color:T.subtle,marginTop:5 }}>{helper}</p>}
    </div>
  )
}

function CurrencyInput({ label, value, onChange, placeholder, helper }) {
  const [raw, setRaw] = useState(value>0?String(value):"")
  useEffect(()=>{ if(value===0&&raw!=="0") setRaw("") },[value])
  function handle(v) { setRaw(v); const n=parseFloat(v)||0; onChange(Math.max(0,n)) }
  return (
    <div>
      {label && <p style={{ fontSize:12,color:T.muted,fontWeight:600,marginBottom:7 }}>{label}</p>}
      <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden",transition:"border-color .15s" }}
        onFocus={()=>{}} tabIndex={-1}>
        <span style={{ padding:"0 12px",color:T.muted,fontSize:17,fontWeight:700,userSelect:"none",flexShrink:0 }}>£</span>
        <input type="number" min="0" value={raw} placeholder={placeholder||"0"}
          onChange={e=>handle(e.target.value)}
          style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"12px 12px 12px 0",fontFamily:"inherit",fontVariantNumeric:"tabular-nums" }}/>
      </div>
      {helper && <p style={{ fontSize:11,color:T.subtle,marginTop:5 }}>{helper}</p>}
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px" }}>
      <p style={{ color:T.white,fontSize:14,fontWeight:600,flex:1,marginRight:12 }}>{label}</p>
      <button onClick={()=>onChange(!value)} style={{ width:48,height:26,borderRadius:13,background:value?T.teal:T.surface,border:`2px solid ${value?T.teal:T.border}`,cursor:"pointer",position:"relative",transition:"all .2s",flexShrink:0 }}>
        <div style={{ position:"absolute",top:2,left:value?24:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s" }}/>
      </button>
    </div>
  )
}

function Tag({ children, color="teal" }) {
  const cols = { teal:{ bg:T.tealDim,border:T.tealBorder,c:T.teal }, amber:{ bg:T.amberDim,border:T.amberBorder,c:T.amber }, red:{ bg:T.redDim,border:T.redBorder,c:T.red } }
  const s = cols[color]||cols.teal
  return <span style={{ display:"inline-flex",alignItems:"center",background:s.bg,border:`1px solid ${s.border}`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,color:s.c }}>{children}</span>
}

function Sheet({ title, onClose, children }) {
  return (
    <div className="ls-fadein" style={{ position:"fixed",inset:0,background:"rgba(7,13,26,.75)",backdropFilter:"blur(6px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div className="ls-fadein" style={{ background:T.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:600,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:`1px solid ${T.border}`,flexShrink:0 }}>
          <p style={{ color:T.white,fontWeight:800,fontSize:16 }}>{title}</p>
          <button onClick={onClose} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4 }}><X size={20}/></button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"20px" }}>{children}</div>
      </div>
    </div>
  )
}

function StarField({ count=40 }) {
  const stars = useMemo(()=>Array.from({length:count},(_,i)=>({
    x: (i*137.508)%100, y: (i*93.7+17)%100,
    size: ((i*31)%3)+1, delay: (i*0.4)%4, dur: 1.5+((i*0.7)%2.5)
  })),[count])
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
      {stars.map((s,i)=>(
        <div key={i} className="ls-star" style={{ position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:"#fff","--d":`${s.dur}s`,"--dl":`${s.delay}s` }}/>
      ))}
    </div>
  )
}

function LockedCard({ icon, title, description, unlock, onUnlock }) {
  return (
    <div className="ls-shimmer" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px",position:"relative",overflow:"hidden" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
        <div style={{ width:38,height:38,borderRadius:11,background:T.faint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,filter:"grayscale(1)",opacity:.5 }}>{icon}</div>
        <div>
          <p style={{ color:T.subtle,fontWeight:700,fontSize:14 }}>{title}</p>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}><Lock size={11} color={T.subtle}/><span style={{ color:T.subtle,fontSize:11 }}>Locked</span></div>
        </div>
      </div>
      <p style={{ color:T.subtle,fontSize:13,lineHeight:1.6,marginBottom:14 }}>{description}</p>
      {onUnlock && <button onClick={onUnlock} style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 14px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>{unlock}</button>}
    </div>
  )
}

function InfoTooltip({ text, color=T.teal }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position:"relative",display:"inline-flex" }}>
      <button onClick={()=>setOpen(!open)} style={{ background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center" }}>
        <div style={{ width:20,height:20,borderRadius:"50%",background:`${color}20`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ fontSize:10,color,fontWeight:800 }}>?</span>
        </div>
      </button>
      {open && (
        <>
          <div style={{ position:"fixed",inset:0,zIndex:99 }} onClick={()=>setOpen(false)}/>
          <div style={{ position:"absolute",bottom:"calc(100% + 8px)",right:0,width:220,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",zIndex:100,boxShadow:"0 8px 32px rgba(0,0,0,.4)" }}>
            <p style={{ color:T.muted,fontSize:12,lineHeight:1.6 }}>{text}</p>
          </div>
        </>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   ONBOARDING CONTROLLER
   ════════════════════════════════════════════════════════════════════ */
function Onboarding() {
  const { state, save } = useApp()
  const [screen,   setScreen]  = useState("welcome")
  const [assets,   setAssets]  = useState({})
  const [debts,    setDebts]   = useState({})
  const [income,   setIncome]  = useState(state.income.primary||0)
  const [spending, setSpending]= useState(state.spending.monthly||0)
  const [name,     setName]    = useState(state.profile.name||"")
  const [age,      setAge]     = useState(state.profile.age||"")

  function finishOnboarding() {
    const newAssets = Object.entries(assets).filter(([,v])=>v>0).map(([typeId,val])=>{
      const t = ASSET_TYPES.find(a=>a.id===typeId)
      return { id:`a_${typeId}`, category:t.cat, name:t.label, value:val, monthlyIncome:0, linkedDebtId:null }
    })
    const newDebts = Object.entries(debts).filter(([,v])=>v>0).map(([typeId,bal])=>{
      const t = DEBT_TYPES.find(d=>d.id===typeId)
      return { id:`d_${typeId}`, category:t.cat, name:t.label, balance:bal, interestRate:t.assumedRate, linkedAssetId:null, isAutoCreated:false }
    })
    save({
      ...state,
      profile:{ ...state.profile, name:name||"Friend", age:parseInt(age)||null, onboardingComplete:true, points:20, lastCheckIn:new Date().toISOString() },
      assets: newAssets, debts: newDebts,
      income: { ...state.income, primary:income },
      spending: { ...state.spending, monthly:spending },
    })
  }

  if(screen==="welcome")   return <WelcomeScreen  onNext={()=>setScreen("about")} />
  if(screen==="about")     return <AboutScreen    name={name} setName={setName} age={age} setAge={setAge} onNext={()=>setScreen("greeting")} onBack={()=>setScreen("welcome")} />
  if(screen==="greeting")  return <GreetingScreen name={name} onNext={()=>setScreen("assets")} onBack={()=>setScreen("about")} />
  if(screen==="assets")    return <AssetChecklistScreen values={assets} setValues={setAssets} onNext={()=>setScreen("debts")} onBack={()=>setScreen("greeting")} />
  if(screen==="debts")     return <DebtChecklistScreen values={debts} setValues={setDebts} assets={assets} age={age} onNext={()=>setScreen("income")} onBack={()=>setScreen("assets")} />
  if(screen==="income")    return <IncomeOnboardScreen income={income} setIncome={setIncome} onNext={()=>setScreen("spending")} onBack={()=>setScreen("debts")} />
  if(screen==="spending")  return <SpendingOnboardScreen spending={spending} setSpending={setSpending} income={income} onNext={()=>setScreen("wow")} onBack={()=>setScreen("income")} />
  if(screen==="wow")       return <WowScreen assets={assets} debts={debts} income={income} spending={spending} name={name} onFinish={finishOnboarding} />
  return null
}

/* ── Welcome — 4 story slides ─────────────────────────────────────── */
const WELCOME_SLIDES = [
  {
    emoji:"🤔", color:T.teal,
    headline:"Do you actually know what you're worth?",
    sub:"Most people have no idea. And that's the problem.",
    stat:null,
  },
  {
    emoji:"📊", color:T.purple,
    headline:"Net worth = what you own minus what you owe",
    sub:"It's the one number that tells the real story of your finances.",
    stat:{ label:"Assets", minus:"Debts", eq:"= Net Worth" },
  },
  {
    emoji:"🚀", color:T.amber,
    headline:"People who track build 4× more wealth",
    sub:"Same income. Same opportunities. The only difference is knowing your numbers.",
    stat:{ label:"Same income. Different habits.", sub2:"Life-changing results." },
  },
  {
    emoji:"🎯", color:T.green,
    headline:"LifeSmart builds your full picture",
    sub:"Takes 3 minutes. Stays private. Completely free.",
    bullets:["📊 Your net worth today", "🔮 Where you could be at 70", "🎯 A plan to get there"],
  },
]

function WelcomeScreen({ onNext }) {
  const [idx, setIdx] = useState(0)
  const [exiting, setExiting] = useState(false)
  const slide = WELCOME_SLIDES[idx]
  const isLast = idx === WELCOME_SLIDES.length - 1

  function advance() {
    if (isLast) { onNext(); return }
    setExiting(true)
    setTimeout(() => { setIdx(i=>i+1); setExiting(false) }, 200)
  }

  // Auto-advance first 3 slides on tap/click of slide area
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden" }}>
      <StarField count={50}/>
      {/* Gradient blob */}
      <div style={{ position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${slide.color}14 0%,transparent 70%)`,pointerEvents:"none",transition:"background .5s" }}/>

      {/* Progress dots */}
      <div style={{ position:"relative",display:"flex",gap:8,justifyContent:"center",padding:"40px 20px 0" }}>
        {WELCOME_SLIDES.map((_,i)=>(
          <div key={i} onClick={()=>setIdx(i)} style={{ height:4,borderRadius:2,background:i===idx?slide.color:T.border,transition:"all .4s",cursor:"pointer",flex:i===idx?2:1 }}/>
        ))}
      </div>

      {/* Slide content */}
      <div key={idx} className={exiting?"ls-fadein":"ls-slidecard"} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 32px",textAlign:"center",maxWidth:440,margin:"0 auto",width:"100%" }}>

        <div className="ls-float" style={{ fontSize:80,marginBottom:28,filter:`drop-shadow(0 0 24px ${slide.color}50)` }}>{slide.emoji}</div>

        <h1 style={{ fontSize:"clamp(22px,5vw,28px)",fontWeight:900,color:T.white,lineHeight:1.25,marginBottom:14,maxWidth:340 }}>{slide.headline}</h1>
        <p style={{ color:T.muted,fontSize:15,lineHeight:1.7,marginBottom:28,maxWidth:300 }}>{slide.sub}</p>

        {/* Slide 2: equation visual */}
        {slide.stat?.minus && (
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap",justifyContent:"center" }}>
            {[
              { label:"🏠 Assets", color:T.green },
              { label:"−", color:T.muted, plain:true },
              { label:"💳 Debts", color:T.red },
              { label:"=", color:T.muted, plain:true },
              { label:"💰 Net Worth", color:T.teal },
            ].map((item,i)=>(
              item.plain
              ? <span key={i} style={{ color:item.color,fontSize:22,fontWeight:900 }}>{item.label}</span>
              : <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 16px" }}>
                  <p style={{ color:item.color,fontWeight:800,fontSize:14 }}>{item.label}</p>
                </div>
            ))}
          </div>
        )}

        {/* Slide 3: stat */}
        {slide.stat?.sub2 && (
          <div style={{ background:T.card,border:`1px solid ${T.amberBorder}`,borderRadius:16,padding:"16px 20px",marginBottom:24,width:"100%" }}>
            <p style={{ color:T.amber,fontWeight:800,fontSize:15,marginBottom:4 }}>{slide.stat.label}</p>
            <p style={{ color:T.muted,fontSize:13 }}>{slide.stat.sub2}</p>
          </div>
        )}

        {/* Slide 4: bullets */}
        {slide.bullets && (
          <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24,width:"100%",maxWidth:280 }}>
            {slide.bullets.map((b,i)=>(
              <div key={i} className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",textAlign:"left",animationDelay:`${i*0.1}s`,opacity:0,animationFillMode:"forwards" }}>
                <p style={{ color:T.white,fontWeight:600,fontSize:14 }}>{b}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position:"relative",padding:"0 24px 48px",maxWidth:440,margin:"0 auto",width:"100%" }}>
        <Btn onClick={advance} style={{ fontSize:17,padding:"16px" }}>
          {isLast ? "Let's build my picture →" : "Next →"}
        </Btn>
        <p style={{ color:T.subtle,fontSize:11,textAlign:"center",marginTop:12 }}>🔒 Private to you · No account needed</p>
      </div>
    </div>
  )
}

/* ── About — name + age ───────────────────────────────────────────── */
function AboutScreen({ name, setName, age, setAge, onNext, onBack }) {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={20}/>
      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 24px 32px",maxWidth:480,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:36,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        <div style={{ fontSize:48,marginBottom:20,textAlign:"center" }}>✋</div>
        <h2 style={{ color:T.white,fontSize:"clamp(22px,5vw,30px)",fontWeight:900,marginBottom:8,lineHeight:1.2,textAlign:"center" }}>Let's make it personal</h2>
        <p style={{ color:T.muted,fontSize:14,marginBottom:32,lineHeight:1.6,textAlign:"center" }}>Just two quick things — we use your age to benchmark your journey.</p>

        <div style={{ display:"flex",flexDirection:"column",gap:18,marginBottom:32 }}>
          <Input label="Your first name" value={name} onChange={setName} placeholder="e.g. Jamie"/>
          <Input label="Your age" type="number" value={age} onChange={setAge} placeholder="e.g. 29" min="16" max="80"
            helper="We use this to show you how your numbers compare — never judgemental, always useful."/>
        </div>

        <Btn onClick={onNext} disabled={!name||!age}>Let's go, {name||"..."}! →</Btn>
      </div>
    </div>
  )
}

/* ── Greeting — personalised bridge ──────────────────────────────── */
const GREETING_STEPS = [
  { icon:"📊", title:"Your net worth picture", sub:"A single number that tells the real story", color:T.teal },
  { icon:"🔮", title:"Where you could be at 70", sub:"Based on what you already have and earn", color:T.purple },
  { icon:"🎯", title:"Your personal priorities", sub:"Goals and lessons built around what matters to you", color:T.amber },
]

function GreetingScreen({ name, onNext, onBack }) {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={25}/>
      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 24px 32px",maxWidth:480,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        <h2 style={{ color:T.white,fontSize:"clamp(24px,5vw,32px)",fontWeight:900,marginBottom:8,lineHeight:1.2 }}>
          Hi {name}! 👋
        </h2>
        <p style={{ color:T.muted,fontSize:15,marginBottom:28,lineHeight:1.6 }}>
          Here's what we're building together in the next few minutes:
        </p>

        <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:28 }}>
          {GREETING_STEPS.map((s,i)=>(
            <div key={i} className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,animationDelay:`${i*0.15}s`,opacity:0,animationFillMode:"forwards" }}>
              <div style={{ width:46,height:46,borderRadius:14,background:`${s.color}20`,border:`1.5px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:2 }}>{s.title}</p>
                <p style={{ color:T.muted,fontSize:12,lineHeight:1.4 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Net worth explainer */}
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"14px 16px",marginBottom:28 }}>
          <p style={{ color:T.teal,fontWeight:700,fontSize:13,marginBottom:4 }}>💡 What is net worth?</p>
          <p style={{ color:T.muted,fontSize:13,lineHeight:1.6 }}>
            Everything you <strong style={{ color:T.green }}>own</strong> (home, savings, pension, investments) <strong style={{ color:T.muted }}>minus</strong> everything you <strong style={{ color:T.red }}>owe</strong> (mortgage, loans, credit cards). <strong style={{ color:T.white }}>That's it.</strong>
          </p>
        </div>

        <p style={{ color:T.muted,fontSize:13,marginBottom:24,textAlign:"center",lineHeight:1.6 }}>
          Rough estimates are completely fine. You can refine everything later.
        </p>

        <Btn onClick={onNext} style={{ fontSize:16 }}>Start building →</Btn>
      </div>
    </div>
  )
}

/* ── Asset Checklist ──────────────────────────────────────────────── */
function AssetChecklistScreen({ values, setValues, onNext, onBack }) {
  const hasAny = Object.values(values).some(v=>v>0)
  const total  = Object.entries(values).reduce((s,[,v])=>s+(v||0),0)

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={15}/>
      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"44px 22px 20px",maxWidth:540,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:28,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        {/* Step indicator */}
        <div style={{ display:"flex",gap:6,marginBottom:24 }}>
          {["Assets","Debts","Income","Spending"].map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4,borderRadius:2,background:i===0?T.teal:T.border,marginBottom:4 }}/>
              <p style={{ color:i===0?T.teal:T.subtle,fontSize:10,fontWeight:700,textAlign:"center" }}>{s}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6 }}>
          <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,lineHeight:1.2 }}>What do you own?</h2>
          {total>0 && <p style={{ color:T.teal,fontWeight:800,fontSize:16 }}>{fmtK(total)}</p>}
        </div>
        <p style={{ color:T.muted,fontSize:13,marginBottom:6,lineHeight:1.5 }}>Tap each one. Rough estimates are totally fine.</p>

        {/* Helpful hint */}
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"9px 14px",marginBottom:22,display:"flex",gap:8,alignItems:"flex-start" }}>
          <span style={{ fontSize:14,flexShrink:0 }}>💡</span>
          <p style={{ color:T.teal,fontSize:12,lineHeight:1.5 }}>Not sure of exact values? Estimates work fine. Tap any asset type to see where to check.</p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:28 }}>
          {ASSET_TYPES.map(t=>(
            <AssetTypeCard key={t.id} type={t} value={values[t.id]||0} selected={(values[t.id]||0)>0}
              onChange={v=>setValues(prev=>({...prev,[t.id]:v}))}/>
          ))}
        </div>

        <Btn onClick={onNext} disabled={!hasAny} style={{ marginBottom:8 }}>
          {hasAny ? `Continue with ${fmtK(total)} in assets →` : "Tap an asset type above"}
        </Btn>
        {!hasAny && <button onClick={onNext} style={{ background:"none",border:"none",color:T.muted,fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip — add later</button>}
      </div>
    </div>
  )
}

function AssetTypeCard({ type, value, selected, onChange }) {
  const [open, setOpen] = useState(selected)
  const [rawVal, setRawVal] = useState(value>0?String(value):"")

  function handleChange(v) { const n=parseFloat(v)||0; setRawVal(v); onChange(Math.max(0,n)) }

  return (
    <div style={{ background:selected?`rgba(15,191,184,.08)`:T.card, border:`2px solid ${selected?T.teal:T.border}`,borderRadius:16,padding:"14px",transition:"all .2s",cursor:!open?"pointer":"default" }}
      onClick={!open?()=>setOpen(true):undefined}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:open?10:0 }}>
        <span style={{ fontSize:24 }}>{type.icon}</span>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:selected?T.teal:T.white,fontWeight:700,fontSize:13 }}>{type.label}</p>
          <p style={{ color:T.muted,fontSize:10,lineHeight:1.3 }}>{type.desc}</p>
        </div>
        {selected && <Check size={13} color={T.teal} style={{ flexShrink:0 }}/>}
      </div>
      {open && (
        <>
          <div style={{ display:"flex",alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden" }}>
            <span style={{ padding:"0 10px",color:T.muted,fontSize:15,fontWeight:700,userSelect:"none" }}>£</span>
            <input type="number" min="0" value={rawVal} placeholder="0" autoFocus
              onChange={e=>handleChange(e.target.value)}
              onBlur={()=>{ if(!value) setOpen(false) }}
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"10px 8px 10px 0",fontFamily:"inherit",fontVariantNumeric:"tabular-nums" }}/>
          </div>
          {type.hint && <p style={{ color:T.subtle,fontSize:10,marginTop:5 }}>🔍 {type.hint}</p>}
        </>
      )}
    </div>
  )
}

/* ── Debt Checklist ───────────────────────────────────────────────── */
function DebtChecklistScreen({ values, setValues, assets, age, onNext, onBack }) {
  const hasAny = Object.values(values).some(v=>v>0)
  const totalAssets = Object.values(assets).reduce((s,v)=>s+(v||0),0)
  const totalDebts  = Object.values(values).reduce((s,v)=>s+(v||0),0)
  const netWorth    = totalAssets - totalDebts
  const bench       = ageBenchmark(age)

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={15}/>
      <div style={{ position:"relative",padding:"14px 22px 0",maxWidth:540,margin:"0 auto",width:"100%",flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>
      </div>
      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"16px 22px 20px",maxWidth:540,margin:"0 auto",width:"100%" }}>

        {/* Step indicator */}
        <div style={{ display:"flex",gap:6,marginBottom:24 }}>
          {["Assets","Debts","Income","Spending"].map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4,borderRadius:2,background:i===1?T.red:i<1?T.teal:T.border,marginBottom:4 }}/>
              <p style={{ color:i===1?T.red:i<1?T.teal:T.subtle,fontSize:10,fontWeight:700,textAlign:"center" }}>{s}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6 }}>
          <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,lineHeight:1.2 }}>What do you owe?</h2>
          {totalDebts>0 && <p style={{ color:T.red,fontWeight:800,fontSize:16 }}>{fmtK(totalDebts)}</p>}
        </div>
        <p style={{ color:T.muted,fontSize:13,marginBottom:6,lineHeight:1.5 }}>Tap what applies. No debt? Great — just hit Continue.</p>

        <div style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 14px",marginBottom:22,display:"flex",gap:8,alignItems:"flex-start" }}>
          <span style={{ fontSize:14,flexShrink:0 }}>💡</span>
          <p style={{ color:T.muted,fontSize:12,lineHeight:1.5 }}>Knowing your debts is the first step to clearing them. We use assumed interest rates — you can update them in Track later.</p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16 }}>
          {DEBT_TYPES.map(t=>{
            const val = values[t.id]||0
            const sel = val > 0
            return <DebtTypeCard key={t.id} type={t} value={val} selected={sel} onChange={v=>setValues(prev=>({...prev,[t.id]:v}))}/>
          })}
        </div>

        {/* Net worth preview + benchmark */}
        {totalAssets > 0 && (
          <div style={{ background:T.card,border:`1px solid ${netWorth>=0?T.tealBorder:T.redBorder}`,borderRadius:16,padding:"16px 18px",marginBottom:20 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10 }}>Your picture so far</p>
            <div style={{ display:"flex",gap:20,marginBottom:bench?12:0 }}>
              <div><p style={{ color:T.green,fontWeight:800,fontSize:16 }}>{fmtK(totalAssets)}</p><p style={{ color:T.muted,fontSize:11 }}>Assets</p></div>
              <div style={{ width:1,background:T.border }}/>
              <div><p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:800,fontSize:16 }}>{fmtK(totalDebts)}</p><p style={{ color:T.muted,fontSize:11 }}>Debts</p></div>
              <div style={{ width:1,background:T.border }}/>
              <div><p style={{ color:netWorth>=0?T.teal:T.red,fontWeight:800,fontSize:16 }}>{fmtK(netWorth)}</p><p style={{ color:T.muted,fontSize:11 }}>Net worth</p></div>
            </div>
            {bench && (
              <div style={{ background:T.surface,borderRadius:10,padding:"10px 12px" }}>
                <p style={{ color:T.muted,fontSize:12,lineHeight:1.6 }}>
                  💭 At your age, people who actively track their finances typically have around <strong style={{ color:T.teal }}>{fmtK(bench.tracked)}</strong>. The fact you're measuring puts you ahead of those who don't.
                </p>
              </div>
            )}
          </div>
        )}

        <Btn onClick={onNext}>
          {hasAny ? "Continue →" : "No debt — continue →"}
        </Btn>
      </div>
    </div>
  )
}

function DebtTypeCard({ type, value, selected, onChange }) {
  const [open, setOpen] = useState(selected)
  const [rawVal, setRawVal] = useState(value>0?String(value):"")
  function handleChange(v) { const n=parseFloat(v)||0; setRawVal(v); onChange(Math.max(0,n)) }
  return (
    <div style={{ background:selected?T.redDim:T.card,border:`2px solid ${selected?T.red:T.border}`,borderRadius:16,padding:"14px",transition:"all .2s",cursor:!open?"pointer":"default" }}
      onClick={!open?()=>setOpen(true):undefined}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:open?10:0 }}>
        <span style={{ fontSize:22 }}>{type.icon}</span>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:selected?T.red:T.white,fontWeight:700,fontSize:13 }}>{type.label}</p>
          <p style={{ color:T.muted,fontSize:10 }}>~{type.assumedRate}% APR</p>
        </div>
        {selected && <Check size={13} color={T.red} style={{ flexShrink:0 }}/>}
      </div>
      {open && (
        <div style={{ display:"flex",alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden" }}>
          <span style={{ padding:"0 10px",color:T.muted,fontSize:15,fontWeight:700,userSelect:"none" }}>£</span>
          <input type="number" min="0" value={rawVal} placeholder="0" autoFocus
            onChange={e=>handleChange(e.target.value)}
            onBlur={()=>{ if(!value) setOpen(false) }}
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"10px 8px 10px 0",fontFamily:"inherit",fontVariantNumeric:"tabular-nums" }}/>
        </div>
      )}
    </div>
  )
}

/* ── Income ───────────────────────────────────────────────────────── */
function IncomeOnboardScreen({ income, setIncome, onNext, onBack }) {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={15}/>
      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"44px 24px 32px",maxWidth:480,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:28,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        {/* Step indicator */}
        <div style={{ display:"flex",gap:6,marginBottom:28 }}>
          {["Assets","Debts","Income","Spending"].map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4,borderRadius:2,background:i<=1?T.teal:i===2?T.amber:T.border,marginBottom:4 }}/>
              <p style={{ color:i<=1?T.teal:i===2?T.amber:T.subtle,fontSize:10,fontWeight:700,textAlign:"center" }}>{s}</p>
            </div>
          ))}
        </div>

        <div style={{ fontSize:42,textAlign:"center",marginBottom:16 }}>💼</div>
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:8,lineHeight:1.2,textAlign:"center" }}>What's your monthly take-home?</h2>
        <p style={{ color:T.muted,fontSize:13,marginBottom:24,lineHeight:1.6,textAlign:"center" }}>After tax. This powers your surplus and projection calculations.</p>

        <div style={{ marginBottom:20 }}>
          <CurrencyInput label="Monthly take-home pay (after tax)" value={income} onChange={setIncome} placeholder="e.g. 2,800"/>
        </div>

        {/* Helpful context */}
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:28 }}>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontSize:18 }}>📱</span>
            <p style={{ color:T.white,fontSize:14,lineHeight:1.4,fontWeight:600 }}>Check your banking app or last payslip — it's the amount that lands in your account each month.</p>
          </div>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontSize:18 }}>📊</span>
            <p style={{ color:T.muted,fontSize:14,lineHeight:1.4 }}>This unlocks your monthly surplus — the gap that builds your wealth.</p>
          </div>
        </div>

        {income > 0 && (
          <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"center" }}>
            <p style={{ color:T.teal,fontWeight:700,fontSize:15 }}>{fmt(income)}/month</p>
            <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>{fmt(income*12)}/year take-home</p>
          </div>
        )}

        <Btn onClick={onNext} disabled={income<=0}>Continue →</Btn>
      </div>
    </div>
  )
}

/* ── Spending ─────────────────────────────────────────────────────── */
const SPENDING_HINTS = [
  { icon:"🏠", label:"Housing", ex:"Rent or mortgage" },
  { icon:"🛒", label:"Food", ex:"Groceries + eating out" },
  { icon:"🚗", label:"Transport", ex:"Car, fuel, or public transport" },
  { icon:"⚡", label:"Bills", ex:"Utilities, phone, internet" },
  { icon:"📱", label:"Subscriptions", ex:"Netflix, gym, etc." },
  { icon:"🎉", label:"Fun & personal", ex:"Clothes, hobbies, socialising" },
]

function SpendingOnboardScreen({ spending, setSpending, income, onNext, onBack }) {
  const surplus = income > 0 ? income - spending : null

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={15}/>
      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"44px 24px 32px",maxWidth:480,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:28,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        {/* Step indicator */}
        <div style={{ display:"flex",gap:6,marginBottom:28 }}>
          {["Assets","Debts","Income","Spending"].map((s,i)=>(
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:4,borderRadius:2,background:i<=3?T.teal:T.border,marginBottom:4 }}/>
              <p style={{ color:i<=3?T.teal:T.subtle,fontSize:10,fontWeight:700,textAlign:"center" }}>{s}</p>
            </div>
          ))}
        </div>

        <div style={{ fontSize:42,textAlign:"center",marginBottom:16 }}>🛒</div>
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:8,lineHeight:1.2,textAlign:"center" }}>Monthly spending — total</h2>
        <p style={{ color:T.muted,fontSize:13,marginBottom:20,lineHeight:1.6,textAlign:"center" }}>Everything that goes out. Rent, food, bills, fun — the lot.</p>

        <p style={{ color:T.muted,fontSize:12,marginBottom:10,fontWeight:600 }}>What to include:</p>
        {/* Category hints — reference only */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:20 }}>
          {SPENDING_HINTS.map((h,i)=>(
            <div key={i} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:99,padding:"6px 12px",display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:14 }}>{h.icon}</span>
              <p style={{ color:T.muted,fontWeight:600,fontSize:12 }}>{h.label}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <CurrencyInput label="Total monthly spending" value={spending} onChange={setSpending} placeholder="e.g. 1,800"
            helper="Add up rent/mortgage, food, transport, bills, subscriptions, and fun spending."/>
        </div>

        {/* Live surplus preview */}
        {surplus !== null && spending > 0 && (
          <div style={{ background:surplus>0?T.tealDim:T.redDim, border:`1px solid ${surplus>0?T.tealBorder:T.redBorder}`,borderRadius:12,padding:"14px 16px",marginBottom:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <p style={{ color:T.muted,fontSize:13 }}>{fmt(income)} income − {fmt(spending)} spending</p>
              <p style={{ color:surplus>0?T.teal:T.red,fontWeight:800,fontSize:16 }}>{fmt(Math.abs(surplus))}</p>
            </div>
            <p style={{ color:surplus>0?T.teal:T.red,fontSize:12,fontWeight:700 }}>
              {surplus>0 ? `✓ ${fmt(surplus)}/mo surplus — the fuel for your future` : `⚠ ${fmt(Math.abs(surplus))}/mo shortfall — we'll help you fix this`}
            </p>
          </div>
        )}

        {income > 0 && spending > 0 && surplus > 0 && (
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",marginBottom:20,display:"flex",gap:10 }}>
            <span style={{ fontSize:14 }}>💡</span>
            <p style={{ color:T.muted,fontSize:12,lineHeight:1.5 }}>
              That surplus of <strong style={{ color:T.teal }}>{fmt(surplus)}/month</strong> is what builds your net worth. Invested at 7%/yr over 20 years, it could grow to <strong style={{ color:T.teal }}>{fmtK(surplus*12*52.7)}</strong>.
            </p>
          </div>
        )}

        <Btn onClick={onNext} disabled={spending<=0}>Build my picture →</Btn>
        {spending<=0 && <button onClick={onNext} style={{ background:"none",border:"none",color:T.muted,fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip — add later</button>}
      </div>
    </div>
  )
}

/* ── Wow screen ───────────────────────────────────────────────────── */
function WowScreen({ assets, debts, income, spending, name, onFinish }) {
  const totalAssets = Object.values(assets).reduce((s,v)=>s+(v||0),0)
  const totalDebts  = Object.values(debts).reduce((s,v)=>s+(v||0),0)
  const netWorth    = totalAssets - totalDebts
  const surplus     = income > 0 && spending > 0 ? income - spending : null
  const nwPos       = netWorth >= 0

  const getMessage = () => {
    if(netWorth > 200000) return "Serious wealth. Now let's make every pound work harder."
    if(netWorth > 50000)  return "A solid foundation. Here's how to build on it fast."
    if(netWorth > 0)      return "You're in the green. Every step from here compounds."
    if(netWorth > -20000) return "Everyone starts somewhere. Here's your clear path forward."
    return "You're not behind — you just have more runway. Let's use it."
  }

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",position:"relative",overflow:"hidden" }}>
      <StarField count={60}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:300,background:`radial-gradient(ellipse at 50% 0%,${nwPos?T.teal:T.red}18 0%,transparent 70%)`,pointerEvents:"none" }}/>

      <div className="ls-fadein" style={{ position:"relative",textAlign:"center",maxWidth:440,width:"100%" }}>
        <div className="ls-float" style={{ fontSize:64,marginBottom:20 }}>{nwPos?"🎯":"📊"}</div>

        <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:12 }}>
          {name ? `${name}'s financial picture` : "Your financial picture"}
        </p>

        <div className="ls-countup" style={{ marginBottom:12 }}>
          <div style={{ fontSize:"clamp(44px,10vw,68px)",fontWeight:900,lineHeight:1,
            color:nwPos?T.teal:T.red, letterSpacing:-1,
            textShadow:nwPos?`0 0 60px ${T.teal}60`:`0 0 60px ${T.red}40` }}>
            {fmt(netWorth)}
          </div>
          <p style={{ color:T.muted,fontSize:14,marginTop:6,fontWeight:600 }}>Net worth</p>
        </div>

        <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.7,marginBottom:28,maxWidth:340,margin:"0 auto 28px" }}>
          {getMessage()}
        </p>

        <div style={{ display:"grid",gridTemplateColumns:surplus!==null?"repeat(3,1fr)":"repeat(2,1fr)",gap:10,marginBottom:36 }}>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 10px" }}>
            <p style={{ color:T.green,fontWeight:900,fontSize:20 }}>{fmtK(totalAssets)}</p>
            <p style={{ color:T.muted,fontSize:11,marginTop:2 }}>Assets</p>
          </div>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 10px" }}>
            <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:900,fontSize:20 }}>{fmtK(totalDebts)}</p>
            <p style={{ color:T.muted,fontSize:11,marginTop:2 }}>Debts</p>
          </div>
          {surplus!==null && (
            <div style={{ background:T.card,border:`1px solid ${surplus>=0?T.tealBorder:T.redBorder}`,borderRadius:14,padding:"14px 10px" }}>
              <p style={{ color:surplus>=0?T.teal:T.red,fontWeight:900,fontSize:20 }}>{fmtK(Math.abs(surplus))}</p>
              <p style={{ color:T.muted,fontSize:11,marginTop:2 }}>{surplus>=0?"Surplus/mo":"Shortfall/mo"}</p>
            </div>
          )}
        </div>

        <Btn onClick={onFinish} style={{ fontSize:16,padding:"16px 28px" }}>
          Explore my picture →
        </Btn>
        <p style={{ color:T.subtle,fontSize:11,marginTop:14 }}>You'll be able to set goals and explore insights on your dashboard</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   HOME TAB
   ════════════════════════════════════════════════════════════════════ */
function HomeTab() {
  const { state, save, setTab, toast, reset } = useApp()
  const { assets, debts, income, spending, goals, profile, completedLessons, priorityGoals } = state
  const { netWorth, totalAssets, totalDebts } = calcTotals(assets, debts)
  const surplus    = calcSurplus(income, assets, spending)
  const bk         = buckets(assets)
  const drag       = totalInterestDrag(debts)
  const hasSpending= (spending?.monthly||0) > 0
  const hasIncome  = (income?.primary||0) > 0
  const safetyMonths = (bk.safetyNet > 0 && spending.monthly > 0) ? Math.floor(bk.safetyNet / spending.monthly) : null
  const fireNumber   = hasSpending ? spending.monthly * 12 * 25 : null
  const [showEdit, setShowEdit] = useState(false)

  const hasPriorities = (priorityGoals||[]).length > 0

  // Recommended lesson — first one from priority goals not yet done
  const doneSet = new Set(completedLessons||[])
  const priorityLessonId = (priorityGoals||[]).map(id => PRIORITY_GOALS.find(g=>g.id===id)?.lesson).find(lid=>lid&&!doneSet.has(lid))
  const recLesson = LESSONS.find(l=>l.id===(priorityLessonId||LESSONS.find(l=>!doneSet.has(l.id))?.id))

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>

      {/* ── Hero strip ──────────────────────────────────────────────── */}
      <div style={{ position:"relative",background:`linear-gradient(180deg,${T.teal}12 0%,transparent 100%)`,padding:"32px 20px 22px" }}>
        <StarField count={12}/>
        <div style={{ position:"relative",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div>
              <p style={{ fontSize:11,fontWeight:700,color:T.teal,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>
                {profile.name ? `${profile.name}'s net worth` : "Your net worth"}
              </p>
              <div style={{ fontSize:"clamp(34px,8vw,52px)",fontWeight:900,lineHeight:1,
                color:netWorth>=0?T.teal:T.red,
                textShadow:netWorth>=0?`0 0 40px ${T.teal}40`:`0 0 40px ${T.red}30` }}>
                {fmt(netWorth)}
              </div>
            </div>
            <button onClick={()=>setShowEdit(!showEdit)}
              style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",cursor:"pointer",color:T.muted,fontSize:12,fontWeight:700,fontFamily:"inherit",marginTop:4,flexShrink:0 }}>
              Update ✎
            </button>
          </div>

          {/* Assets / debts / surplus strip */}
          <div style={{ display:"flex",gap:18,flexWrap:"wrap" }}>
            {[
              { val:fmtK(totalAssets), label:"Assets", color:T.green },
              { val:fmtK(totalDebts),  label:"Debts",  color:totalDebts>0?T.red:T.muted },
              ...(surplus!==0?[{ val:`${fmtK(Math.abs(surplus))}/mo`, label:surplus>0?"Surplus":"Shortfall", color:surplus>0?T.teal:T.red }]:[]),
            ].map((item,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:6 }}>
                {i>0 && <div style={{ width:1,height:28,background:T.border }}/>}
                <div style={{ paddingLeft:i>0?6:0 }}>
                  <p style={{ color:item.color,fontWeight:800,fontSize:15 }}>{item.val}</p>
                  <p style={{ color:T.muted,fontSize:11 }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {showEdit && (
            <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginTop:14 }}>
              <p style={{ color:T.muted,fontSize:13,lineHeight:1.5,marginBottom:10 }}>
                Update your numbers in <strong style={{ color:T.white }}>Track</strong>. Use <strong style={{ color:T.white }}>Goals</strong> to set targets.
              </p>
              <div style={{ display:"flex",gap:10 }}>
                <button onClick={()=>{setTab(3);setShowEdit(false)}} style={{ flex:1,background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:8,padding:"8px 12px",color:T.teal,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Go to Track →</button>
                <button onClick={()=>{ if(window.confirm("Restart from scratch? All data will be cleared.")) reset() }}
                  style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>🔄 Restart</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 18px" }}>

        {/* ── Projection — the big hook ───────────────────────────── */}
        {netWorth!==0 && hasIncome && (
          <div style={{ marginBottom:20,marginTop:8 }}>
            <ProjectionHeroCard nw={netWorth} surplus={surplus} age={profile?.age} />
          </div>
        )}
        {(netWorth===0 || !hasIncome) && (
          <div style={{ marginTop:8,marginBottom:20 }}>
            <LockedCard icon="🔮" title="Your wealth at 70 — projection locked"
              description="Add your assets and income to unlock your personalised wealth projection."
              unlock="Complete setup in Track →" onUnlock={()=>setTab(3)}/>
          </div>
        )}

        {/* ── Priority goals picker ───────────────────────────────── */}
        {!hasPriorities && (
          <GoalPickerSection state={state} save={save} toast={toast}/>
        )}

        {/* ── Mini goals + recommended lessons ───────────────────── */}
        {hasPriorities && (
          <>
            <HomeGoalsSection goals={goals} surplus={surplus} setTab={setTab} save={save} state={state} toast={toast} priorityGoals={priorityGoals}/>
            <GoalLinkedLessons priorityGoals={priorityGoals} completedLessons={state.completedLessons||[]} setTab={setTab}/>
          </>
        )}

        {/* ── Insights label ─────────────────────────────────────── */}
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,marginTop:4 }}>Your top insights</p>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14,marginBottom:24 }}>

          {/* Safety net */}
          {bk.safetyNet > 0 && (
            <InsightCard icon="🛡️" title="Safety net" sub="Liquid savings" iconBg={T.tealDim} iconBorder={T.tealBorder}
              infoText="Your easy-access savings — cash, current accounts, ISA savings. The rule of thumb is 3–6 months of expenses.">
              <p style={{ color:T.teal,fontWeight:900,fontSize:28,marginBottom:8 }}>{fmt(bk.safetyNet)}</p>
              {safetyMonths!=null ? (
                <>
                  <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:8 }}>
                    <div style={{ width:`${Math.min(100,(safetyMonths/6)*100)}%`,height:"100%",background:`linear-gradient(90deg,${safetyMonths>=3?T.green:T.amber},${safetyMonths>=6?"#86EFAC":T.amber})`,borderRadius:99,transition:"width .8s ease" }}/>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                    <p style={{ color:T.muted,fontSize:11 }}>0 months</p>
                    <p style={{ color:T.muted,fontSize:11 }}>6 months</p>
                  </div>
                  <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>
                    <strong style={{ color:safetyMonths>=3?T.green:T.amber }}>{safetyMonths} month{safetyMonths!==1?"s":""}</strong> of expenses covered.
                    {safetyMonths<3 && " Aim for 3–6 months as your first target."}
                    {safetyMonths>=6 && " Well covered — consider investing the excess."}
                  </p>
                </>
              ) : (
                <p style={{ color:T.muted,fontSize:13 }}>Add monthly spending to see months covered.</p>
              )}
            </InsightCard>
          )}

          {/* Wealth breakdown */}
          {totalAssets > 0 && (
            <WealthBreakdownCard bk={bk} totalAssets={totalAssets}/>
          )}

          {/* Interest drag */}
          {totalDebts > 0 && drag > 0 && (
            <InsightCard icon="💸" title="Interest drag" sub="What debt costs you yearly" iconBg={T.redDim} iconBorder={T.redBorder}
              infoText="The total annual interest cost across all your debts. Paying off high-rate debt first (the Avalanche method) gives you a guaranteed return equal to the interest rate you eliminate.">
              <p style={{ color:T.red,fontWeight:900,fontSize:28,marginBottom:4 }}>
                {fmt(Math.round(drag/12))}<span style={{ fontSize:16,fontWeight:600 }}>/mo</span>
              </p>
              <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>
                {fmt(Math.round(drag))}/yr quietly leaving your net worth.{" "}
                <span style={{ color:T.white,fontWeight:600 }}>Paying off high-rate debt first is a guaranteed return.</span>
              </p>
            </InsightCard>
          )}

          {/* FIRE number */}
          {fireNumber ? (
            <InsightCard icon="🔥" title="Financial freedom number" sub="25× annual spending · 4% rule" iconBg={T.amberDim} iconBorder={T.amberBorder}
              infoText="The amount you need invested to never have to work again — based on the 4% safe withdrawal rate. At this number, 4% of your portfolio covers a full year's spending, indefinitely.">
              <p style={{ color:T.amber,fontWeight:900,fontSize:28,marginBottom:6 }}>{fmtK(fireNumber)}</p>
              {bk.wealthBuilders > 0 && (
                <>
                  <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:6 }}>
                    <div style={{ width:`${Math.min(100,(bk.wealthBuilders/fireNumber)*100)}%`,height:"100%",background:`linear-gradient(90deg,${T.amber},#FCD34D)`,borderRadius:99,transition:"width .8s ease" }}/>
                  </div>
                  <p style={{ color:T.muted,fontSize:12 }}>
                    {Math.round((bk.wealthBuilders/fireNumber)*100)}% there · {fmt(bk.wealthBuilders)} working for you now
                  </p>
                </>
              )}
              {bk.wealthBuilders===0 && <p style={{ color:T.muted,fontSize:13 }}>Add investments or pension to track progress.</p>}
            </InsightCard>
          ) : (
            <LockedCard icon="🔥" title="Financial freedom number"
              description="Add monthly spending to unlock — the exact amount you need to achieve financial freedom."
              unlock="Add spending →" onUnlock={()=>setTab(3)}/>
          )}
        </div>

        {/* ── Build your dashboard ─────────────────────────────── */}
        <DashboardBuilder state={state} save={save} setTab={setTab} toast={toast}/>

        {/* ── Lesson recommendation ─────────────────────────────── */}
        {recLesson && (
          <div style={{ marginBottom:28 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>
              {hasPriorities ? "Recommended for your goals" : "Start learning"}
            </p>
            <button onClick={()=>setTab(1)} style={{ width:"100%",background:T.card,border:`1.5px solid ${recLesson.trackColor||T.teal}40`,borderRadius:18,padding:"18px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:16 }}>
              <div style={{ width:52,height:52,borderRadius:16,background:`${recLesson.trackColor||T.teal}20`,border:`1.5px solid ${recLesson.trackColor||T.teal}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>
                {recLesson.emoji}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:recLesson.trackColor||T.teal,fontWeight:700,fontSize:11,letterSpacing:.5,textTransform:"uppercase",marginBottom:4 }}>Next lesson · {recLesson.track}</p>
                <p style={{ color:T.white,fontWeight:700,fontSize:14,lineHeight:1.3,marginBottom:4 }}>{recLesson.title}</p>
                <p style={{ color:T.muted,fontSize:12 }}>~{recLesson.cards?.length} min · +{recLesson.xp} XP</p>
              </div>
              <ChevronRight size={18} color={T.muted}/>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Dashboard builder ───────────────────────────────────────────── */
const DASHBOARD_TILES = [
  { id:"budget", icon:"🗂️", label:"Budget breakdown", color:T.teal, colorDim:T.tealDim, colorBorder:T.tealBorder,
    desc:"See where your money goes — a visual split of your spending categories.",
    requires:"spending breakdown", unlock:"You'll answer a few questions about your spending categories." },
  { id:"debt_plan", icon:"🎯", label:"Debt payoff plan", color:T.red, colorDim:T.redDim, colorBorder:T.redBorder,
    desc:"See exactly when each debt clears and how much interest you'll save.",
    requires:"debts", unlock:"We'll use your debt balances to build a payoff timeline." },
  { id:"investment", icon:"📈", label:"Investment tracker", color:T.purple, colorDim:T.purpleDim, colorBorder:T.purpleBorder,
    desc:"Track your portfolio performance and compare against benchmarks.",
    requires:"investments", unlock:"Add your investment accounts to get started." },
  { id:"pension", icon:"🏛️", label:"Pension projector", color:T.amber, colorDim:T.amberDim, colorBorder:T.amberBorder,
    desc:"Forecast your pension pot at retirement based on current contributions.",
    requires:"pension", unlock:"We'll need your pension value and monthly contributions." },
]

function DashboardBuilder({ state, save, setTab, toast }) {
  const added = state.dashboardTiles || []
  const [expanded, setExpanded] = useState(null)

  const available = DASHBOARD_TILES.filter(t=>!added.includes(t.id))
  if(available.length===0) return null

  function addTile(id) {
    save({ ...state, dashboardTiles:[...(state.dashboardTiles||[]),id] })
    toast("✓ Added to your dashboard")
    setExpanded(null)
  }

  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Build your dashboard</p>
      </div>
      <p style={{ color:T.subtle,fontSize:13,lineHeight:1.5,marginBottom:14 }}>
        Add charts and analysis to get deeper insights — each one helps you reach your goals faster.
      </p>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {available.map(t=>(
          <div key={t.id} style={{ background:T.card,border:`1px solid ${expanded===t.id?t.colorBorder:T.border}`,borderRadius:16,overflow:"hidden",transition:"all .2s" }}>
            <button onClick={()=>setExpanded(expanded===t.id?null:t.id)}
              style={{ width:"100%",background:"none",border:"none",padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14,textAlign:"left" }}>
              <div style={{ width:40,height:40,borderRadius:12,background:t.colorDim,border:`1px solid ${t.colorBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{t.label}</p>
                <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>{t.desc}</p>
              </div>
              <Plus size={16} color={T.subtle} style={{ flexShrink:0,transform:expanded===t.id?"rotate(45deg)":"none",transition:"transform .2s" }}/>
            </button>
            {expanded===t.id && (
              <div style={{ padding:"0 16px 16px",borderTop:`1px solid ${T.border}` }}>
                <p style={{ color:T.muted,fontSize:13,lineHeight:1.5,marginTop:12,marginBottom:12 }}>
                  💡 {t.unlock}
                </p>
                <Btn onClick={()=>addTile(t.id)}>Add to dashboard →</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Reusable insight card wrapper ──────────────────────────────── */
function InsightCard({ icon, title, sub, iconBg, iconBorder, infoText, children }) {
  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
        <div style={{ width:38,height:38,borderRadius:11,background:iconBg,border:`1px solid ${iconBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{icon}</div>
        <div style={{ flex:1 }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{title}</p>
          <p style={{ color:T.muted,fontSize:12 }}>{sub}</p>
        </div>
        {infoText && <InfoTooltip text={infoText}/>}
      </div>
      {children}
    </div>
  )
}

/* ── Projection hero card — big, jagged, exciting ─────────────── */
function ProjectionHeroCard({ nw, surplus, age }) {
  const data = useMemo(()=>calcProjection(nw,surplus,age),[nw,surplus,age])
  const targetAge = 70
  const atTarget  = data.find(d=>Math.round(d.age)===targetAge)
  const fmtAx = v => v>=1e6?`£${(v/1e6).toFixed(1)}M`:v>=1000?`£${(v/1000).toFixed(0)}k`:v<0?`-£${Math.abs(Math.round(v/1000))}k`:""

  return (
    <div style={{ background:T.card,border:`1.5px solid ${T.tealBorder}`,borderRadius:20,padding:"20px 22px" }} className="ls-glow">
      {/* Header */}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6 }}>
        <div>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>🔮 Your wealth at 70</p>
          {atTarget && (
            <p style={{ fontSize:"clamp(28px,6vw,40px)",fontWeight:900,lineHeight:1,color:T.teal,textShadow:`0 0 30px ${T.teal}50` }}>
              {fmtK(atTarget.balanced)}
            </p>
          )}
          <p style={{ color:T.muted,fontSize:12,marginTop:4 }}>Likely scenario · assumes 7%/yr avg return</p>
        </div>
        {atTarget?.conservative && (
          <div style={{ textAlign:"right",flexShrink:0,marginLeft:12 }}>
            <p style={{ color:T.purple,fontWeight:800,fontSize:18 }}>{fmtK(atTarget.conservative)}</p>
            <p style={{ color:T.muted,fontSize:11 }}>Conservative</p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height:160,margin:"16px 0 10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:5,right:4,bottom:0,left:0 }}>
            <defs>
              <linearGradient id="gBal10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.teal}   stopOpacity={.25}/>
                <stop offset="95%" stopColor={T.teal}   stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gCon10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.purple} stopOpacity={.12}/>
                <stop offset="95%" stopColor={T.purple} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="age" tick={{ fontSize:10,fill:T.muted }} axisLine={false} tickLine={false} interval={5}/>
            <YAxis tick={{ fontSize:9,fill:T.subtle }} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={42}/>
            <Tooltip
              formatter={(v,name)=>[fmt(v), name==="balanced"?"Likely (7%/yr)":"Conservative (4%/yr)"]}
              labelFormatter={v=>`Age ${Math.round(v)}`}
              contentStyle={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white }}/>
            <Area type="monotone" dataKey="conservative" stroke={T.purple} strokeWidth={1.5} strokeDasharray="4 3" fill="url(#gCon10)" dot={false}/>
            <Area type="monotone" dataKey="balanced"     stroke={T.teal}   strokeWidth={2.5} fill="url(#gBal10)"  dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + context */}
      <div style={{ display:"flex",gap:16,marginBottom:10,flexWrap:"wrap" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:20,height:3,background:T.teal,borderRadius:2 }}/><span style={{ color:T.muted,fontSize:11 }}>Likely (7%/yr)</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:18,height:2,background:T.purple,borderRadius:1,borderBottom:"2px dashed "+T.purple }}/><span style={{ color:T.muted,fontSize:11 }}>Conservative (4%/yr)</span></div>
      </div>
      <p style={{ color:T.subtle,fontSize:11,lineHeight:1.5 }}>
        Jagged lines reflect real market volatility — growth isn't smooth, but the direction matters. <strong style={{ color:T.muted }}>Not financial advice.</strong>
      </p>
    </div>
  )
}

/* ── Wealth breakdown — no bar, use visual blocks ─────────────── */
function WealthBreakdownCard({ bk, totalAssets }) {
  const segments = [
    {
      label:"Safety net", value:bk.safetyNet, color:T.teal, icon:"🛡️",
      info:"Liquid savings you can access immediately — cash, easy-access accounts. This is your financial cushion. Goal: 3–6 months of expenses."
    },
    {
      label:"Working wealth", value:bk.wealthBuilders, color:T.purple, icon:"📈",
      info:"Investments, pension, and business assets that actively grow over time. This is the engine of long-term wealth — money that compounds while you sleep."
    },
    {
      label:"Life assets", value:bk.lifeAssets, color:T.amber, icon:"🏠",
      info:"Property, vehicles, and other physical assets. These have real value but can't be easily accessed, don't generate income, and typically appreciate slowly."
    },
  ].filter(s=>s.value>0)

  if(segments.length===0) return null

  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div>
          <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>Wealth breakdown</p>
          <p style={{ color:T.muted,fontSize:12 }}>How your {fmtK(totalAssets)} is split</p>
        </div>
        <InfoTooltip text="A healthy wealth breakdown shifts over time: start by building a safety net, then grow your working wealth. Life assets (like property) have value but don't actively compound."/>
      </div>

      {/* Visual blocks — proportional height bars */}
      <div style={{ display:"grid",gridTemplateColumns:`repeat(${segments.length},1fr)`,gap:8,marginBottom:16,height:80,alignItems:"flex-end" }}>
        {segments.map(s=>{
          const pct = Math.max(8, (s.value/totalAssets)*100)
          return (
            <div key={s.label} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
              <p style={{ color:s.color,fontWeight:800,fontSize:12,textAlign:"center" }}>{Math.round(s.value/totalAssets*100)}%</p>
              <div style={{ width:"100%",height:`${pct * 0.7}px`,minHeight:12,maxHeight:56,background:s.color,borderRadius:"6px 6px 2px 2px",opacity:.85,transition:"height .6s ease" }}/>
            </div>
          )
        })}
      </div>

      {/* Legend with info */}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {segments.map(s=>(
          <div key={s.label} style={{ display:"flex",alignItems:"center",gap:10,background:T.surface,borderRadius:10,padding:"10px 12px" }}>
            <span style={{ fontSize:18,flexShrink:0 }}>{s.icon}</span>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{s.label}</p>
              <p style={{ color:T.subtle,fontSize:11,lineHeight:1.4 }}>{s.info.slice(0,60)}…</p>
            </div>
            <div style={{ textAlign:"right",flexShrink:0 }}>
              <p style={{ color:s.color,fontWeight:800,fontSize:14 }}>{fmtK(s.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Goal priority picker ──────────────────────────────────────── */
function GoalPickerSection({ state, save, toast }) {
  const [selected, setSelected] = useState([])

  function toggle(id) {
    setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
  }

  function confirm() {
    if(selected.length===0) return
    save({ ...state, priorityGoals:selected, profile:{ ...state.profile, points:(state.profile.points||0)+10 } })
    toast("✓ Priorities set! +10 XP")
  }

  return (
    <div style={{ marginBottom:24,paddingTop:4 }}>
      <div style={{ marginBottom:14 }}>
        <p style={{ color:T.white,fontWeight:800,fontSize:18,marginBottom:4 }}>What matters most to you?</p>
        <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>Pick your priorities — we'll tailor your lessons and goals around them.</p>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10,marginBottom:16 }}>
        {PRIORITY_GOALS.map(g=>{
          const sel = selected.includes(g.id)
          return (
            <button key={g.id} onClick={()=>toggle(g.id)}
              style={{ background:sel?`${g.color}15`:T.card,border:`2px solid ${sel?g.color:T.border}`,borderRadius:14,padding:"14px 12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s",display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:20 }}>{g.icon}</span>
              <p style={{ color:sel?T.white:T.muted,fontWeight:700,fontSize:13,flex:1,lineHeight:1.3 }}>{g.label}</p>
              {sel && <Check size={14} color={g.color} style={{ flexShrink:0 }}/>}
            </button>
          )
        })}
      </div>

      <Btn onClick={confirm} disabled={selected.length===0}>
        {selected.length===0 ? "Pick at least one →" : `Set ${selected.length} priorit${selected.length===1?"y":"ies"} →`}
      </Btn>
    </div>
  )
}

function GoalLinkedLessons({ priorityGoals, completedLessons, setTab }) {
  const doneSet = new Set(completedLessons)
  const linked = LESSONS.filter(l=>l.goalLinks?.some(g=>priorityGoals.includes(g)) && !doneSet.has(l.id)).slice(0,2)
  if(linked.length===0) return null
  return (
    <div style={{ marginBottom:22 }}>
      <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Lessons for your goals</p>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {linked.map(l=>(
          <button key={l.id} onClick={()=>setTab(1)} style={{ background:T.card,border:`1.5px solid ${l.trackColor||T.teal}30`,borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:`${l.trackColor||T.teal}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{l.emoji}</div>
            <div style={{ flex:1 }}>
              <p style={{ color:l.trackColor||T.teal,fontWeight:700,fontSize:10,letterSpacing:.5,textTransform:"uppercase",marginBottom:3 }}>{l.track} · {l.xp} XP</p>
              <p style={{ color:T.white,fontWeight:700,fontSize:13,lineHeight:1.3 }}>{l.title}</p>
            </div>
            <ChevronRight size={16} color={T.subtle}/>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Goals on home ─────────────────────────────────────────────── */
function HomeGoalsSection({ goals, surplus, setTab, save, state, toast, priorityGoals }) {
  const [showSheet, setShowSheet] = useState(false)
  const activeGoals = goals.filter(g=>!ACTION_GOALS.has(g.type)?calcGoalProgress(g,surplus).pct<100:true)
  const displayed = activeGoals.slice(0,3)

  function saveGoal(data) {
    const existing = goals.find(g=>g.id===data.id)
    const newGoals = existing ? goals.map(g=>g.id===data.id?data:g) : [...goals,data]
    save({ ...state, goals:newGoals })
    toast(existing?"✓ Goal updated":"✓ Goal created")
    setShowSheet(false)
  }

  return (
    <div style={{ marginBottom:22,paddingTop:8 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Your goals</p>
        <div style={{ display:"flex",gap:10 }}>
          {goals.length>0 && <button onClick={()=>setTab(2)} style={{ background:"none",border:"none",color:T.teal,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>See all →</button>}
          <button onClick={()=>setShowSheet(true)} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 12px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4 }}>
            <Plus size={12}/>Add
          </button>
        </div>
      </div>

      {displayed.length===0 ? (
        <button onClick={()=>setShowSheet(true)} style={{ width:"100%",background:T.tealDim,border:`1.5px dashed ${T.tealBorder}`,borderRadius:16,padding:"18px",cursor:"pointer",textAlign:"center",fontFamily:"inherit" }}>
          <p style={{ color:T.teal,fontWeight:700,fontSize:14,marginBottom:4 }}>🎯 Set your first goal</p>
          <p style={{ color:T.muted,fontSize:12 }}>Holiday, emergency fund, clear debt — people with goals save 2× faster.</p>
        </button>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10 }}>
          {displayed.map(g=><MiniGoalCard key={g.id} goal={g} surplus={surplus}/>)}
        </div>
      )}

      {showSheet && <GoalSheet goal={null} onClose={()=>setShowSheet(false)} onSave={saveGoal}/>}
    </div>
  )
}

function MiniGoalCard({ goal, surplus }) {
  const cfg = GOAL_TYPES.find(g=>g.id===goal.type)||GOAL_TYPES[GOAL_TYPES.length-1]
  const isAction = ACTION_GOALS.has(goal.type)
  if(isAction) {
    const actions = GOAL_ACTIONS[goal.type]||[]
    const checked = new Set(goal.checkedActions||[])
    const pct = actions.length>0 ? Math.round(checked.size/actions.length*100) : 0
    return (
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:10 }}>
          <span style={{ fontSize:18 }}>{cfg.icon}</span>
          <div><p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{goal.name}</p><p style={{ color:T.muted,fontSize:11 }}>{checked.size}/{actions.length} steps</p></div>
        </div>
        <div style={{ background:T.surface,borderRadius:99,height:5,overflow:"hidden" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:cfg.color,borderRadius:99 }}/>
        </div>
      </div>
    )
  }
  const { pct, current, eta } = calcGoalProgress(goal, surplus)
  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:10 }}>
        <span style={{ fontSize:18 }}>{cfg.icon}</span>
        <div style={{ flex:1 }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{goal.name}</p>
          <p style={{ color:T.muted,fontSize:11 }}>{fmt(current)} of {fmt(goal.targetAmount)}</p>
        </div>
        <span style={{ color:cfg.color,fontWeight:800,fontSize:13 }}>{pct}%</span>
      </div>
      <div style={{ background:T.surface,borderRadius:99,height:5,overflow:"hidden" }}>
        <div style={{ width:`${pct}%`,height:"100%",background:cfg.color,borderRadius:99,transition:"width .6s ease" }}/>
      </div>
      {eta && <p style={{ color:T.muted,fontSize:11,marginTop:6 }}>On track for {eta}</p>}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   GOAL SHEET
   ════════════════════════════════════════════════════════════════════ */
function GoalSheet({ goal, onClose, onSave }) {
  const editing = !!goal
  const [type,   setType]   = useState(goal?.type||null)
  const [name,   setName]   = useState(goal?.name||"")
  const [target, setTarget] = useState(goal?.targetAmount||0)
  const [monthly,setMonthly]= useState(goal?.monthlyAmount||0)
  const [err,    setErr]    = useState("")

  const cfg = GOAL_TYPES.find(g=>g.id===type)
  const isAction = ACTION_GOALS.has(type)

  function go() {
    if(!type)         { setErr("Pick a goal type."); return }
    if(!isAction && target<=0) { setErr("Enter a target amount."); return }
    setErr("")
    onSave({
      id: goal?.id || `goal_${Date.now()}`,
      type, name: name||(cfg?.label||"Goal"),
      targetAmount: isAction ? 0 : target,
      startAmount: goal?.startAmount||0,
      monthlyAmount: monthly,
      createdAt: goal?.createdAt||new Date().toISOString(),
      checkedActions: goal?.checkedActions||[],
    })
  }

  return (
    <Sheet title={editing?"Edit goal":"Add a goal"} onClose={onClose}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
        {GOAL_TYPES.map(t=>{ const sel=type===t.id; return (
          <button key={t.id} onClick={()=>{ setType(t.id); setName(t.label) }}
            style={{ padding:"12px 6px",borderRadius:13,border:`2px solid ${sel?t.color:T.border}`,background:sel?t.dim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:7,transition:"all .15s" }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:700,color:sel?t.color:T.muted,textAlign:"center",lineHeight:1.3 }}>{t.label}</span>
          </button>
        )})}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:16 }}>
        <Input label="Goal name" value={name} onChange={setName} placeholder={cfg?.label||"e.g. Emergency fund"}/>
        {!isAction && (
          <>
            <CurrencyInput label="Target amount" value={target} onChange={setTarget}/>
            <CurrencyInput label="Monthly contribution (optional)" value={monthly} onChange={setMonthly} helper="How much you plan to put towards this each month"/>
          </>
        )}
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:12 }}>{err}</p>}
      <Btn onClick={go}>{editing?"Save changes":"Add goal"}</Btn>
    </Sheet>
  )
}

/* ── Action goal sheet (checklist-based) ─────────────────────── */
function ActionGoalSheet({ goal, onClose, onSave, setLearnTab }) {
  const actions = GOAL_ACTIONS[goal.type]||[]
  const [checked, setChecked] = useState(new Set(goal.checkedActions||[]))
  const cfg = GOAL_TYPES.find(g=>g.id===goal.type)

  function toggle(id) {
    setChecked(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  }

  function save() {
    onSave({ ...goal, checkedActions:[...checked] })
  }

  return (
    <Sheet title={goal.name} onClose={onClose}>
      <p style={{ color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:20 }}>Tick each step off as you complete it. Each one moves you closer to your goal.</p>
      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
        {actions.map(a=>{
          const done = checked.has(a.id)
          return (
            <div key={a.id} style={{ background:done?T.tealDim:T.card,border:`1.5px solid ${done?T.tealBorder:T.border}`,borderRadius:14,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start",transition:"all .2s" }}>
              <button onClick={()=>toggle(a.id)} style={{ width:24,height:24,borderRadius:7,border:`2px solid ${done?T.teal:T.border}`,background:done?T.teal:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .2s" }}>
                {done&&<Check size={13} color="#070D1A"/>}
              </button>
              <div style={{ flex:1 }}>
                <p style={{ color:done?T.teal:T.white,fontWeight:700,fontSize:14,marginBottom:3,textDecoration:done?"line-through":undefined }}>{a.label}</p>
                <p style={{ color:T.muted,fontSize:12,lineHeight:1.5 }}>{a.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
      <Btn onClick={save}>Save progress</Btn>
    </Sheet>
  )
}

function GoalCard({ goal, surplus, onEdit, onDelete }) {
  const cfg = GOAL_TYPES.find(g=>g.id===goal.type)||GOAL_TYPES[GOAL_TYPES.length-1]
  const isAction = ACTION_GOALS.has(goal.type)
  const { pct, current, eta, monthsLeft } = isAction ? { pct:0,current:0,eta:null,monthsLeft:null } : calcGoalProgress(goal,surplus)
  const actions = isAction ? GOAL_ACTIONS[goal.type]||[] : []
  const checkedCount = isAction ? (goal.checkedActions||[]).length : 0
  const actionPct = isAction && actions.length>0 ? Math.round(checkedCount/actions.length*100) : 0

  const displayPct = isAction ? actionPct : pct

  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px",position:"relative" }}>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:14 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:cfg.dim,border:`1.5px solid ${cfg.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{cfg.icon}</div>
        <div style={{ flex:1 }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:15 }}>{goal.name}</p>
          {!isAction && <p style={{ color:T.muted,fontSize:12 }}>Target: {fmt(goal.targetAmount)}</p>}
          {isAction && <p style={{ color:T.muted,fontSize:12 }}>{checkedCount}/{actions.length} steps completed</p>}
        </div>
        <div style={{ display:"flex",gap:6 }}>
          <button onClick={onEdit} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4 }}><Pencil size={14}/></button>
          <button onClick={onDelete} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4 }}><Trash2 size={14}/></button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:8 }}>
        <div style={{ width:`${displayPct}%`,height:"100%",background:`linear-gradient(90deg,${cfg.color},${cfg.color}bb)`,borderRadius:99,transition:"width .8s ease" }}/>
      </div>

      {!isAction && (
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <p style={{ color:cfg.color,fontWeight:800,fontSize:14 }}>{displayPct}%</p>
          <p style={{ color:T.muted,fontSize:12 }}>{fmt(current)} saved{eta?` · ${eta}`:""}</p>
        </div>
      )}
      {isAction && (
        <p style={{ color:cfg.color,fontWeight:800,fontSize:13 }}>{displayPct}% complete</p>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   GOALS TAB
   ════════════════════════════════════════════════════════════════════ */
function GoalsTab() {
  const { state, save, toast, setTab } = useApp()
  const { goals, income, assets, spending } = state
  const surplus = calcSurplus(income, assets, spending)
  const [sheet, setSheet]     = useState(null)
  const [editGoal, setEditGoal] = useState(null)

  function saveGoal(data) {
    const existing = goals.find(g=>g.id===data.id)
    const newGoals = existing ? goals.map(g=>g.id===data.id?data:g) : [...goals,data]
    save({ ...state, goals:newGoals })
    toast(existing?"✓ Goal updated":"✓ Goal added")
    setSheet(null); setEditGoal(null)
  }

  function deleteGoal(g) {
    if(!window.confirm(`Remove "${g.name}"?`)) return
    save({ ...state, goals:goals.filter(x=>x.id!==g.id) })
    toast("Goal removed")
  }

  const active    = goals.filter(g=>!ACTION_GOALS.has(g.type)?calcGoalProgress(g,surplus).pct<100:true)
  const completed = goals.filter(g=>!ACTION_GOALS.has(g.type)&&calcGoalProgress(g,surplus).pct>=100)

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      <div style={{ padding:"24px 18px",maxWidth:900,margin:"0 auto",width:"100%" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
          <div>
            <h2 style={{ color:T.white,fontWeight:900,fontSize:22 }}>Your goals</h2>
            <p style={{ color:T.muted,fontSize:13,marginTop:2 }}>{active.length} active · {completed.length} completed</p>
          </div>
          <button onClick={()=>{ setEditGoal(null); setSheet("new") }}
            style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:11,padding:"10px 16px",color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
            <Plus size={14}/>New goal
          </button>
        </div>

        {active.length===0 && completed.length===0 ? (
          <div style={{ textAlign:"center",padding:"56px 24px",background:T.card,border:`1.5px dashed ${T.border}`,borderRadius:20 }}>
            <div style={{ fontSize:48,marginBottom:16 }}>🎯</div>
            <p style={{ color:T.white,fontWeight:700,fontSize:17,marginBottom:8 }}>No goals yet</p>
            <p style={{ color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24,maxWidth:280,margin:"0 auto 24px" }}>
              People with written goals save and invest significantly more. Set your first one — it only takes 30 seconds.
            </p>
            <Btn onClick={()=>setSheet("new")} style={{ maxWidth:240,margin:"0 auto" }}>Set my first goal</Btn>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,marginBottom:24 }}>
            {active.map(g=>(
              <GoalCard key={g.id} goal={g} surplus={surplus}
                onEdit={()=>{ setEditGoal(g); setSheet(ACTION_GOALS.has(g.type)?"action":"edit") }}
                onDelete={()=>deleteGoal(g)}/>
            ))}
          </div>
        )}

        {completed.length>0 && (
          <>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Completed 🎉</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12 }}>
              {completed.map(g=>(
                <div key={g.id} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",opacity:.7,display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:20 }}>✅</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:T.subtle,fontWeight:700,fontSize:13 }}>{g.name}</p>
                    <p style={{ color:T.subtle,fontSize:11 }}>{fmt(g.targetAmount)} reached</p>
                  </div>
                  <button onClick={()=>deleteGoal(g)} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:4 }}><Trash2 size={13}/></button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {sheet==="new"    && <GoalSheet goal={null} onClose={()=>setSheet(null)} onSave={saveGoal}/>}
      {sheet==="edit"   && <GoalSheet goal={editGoal} onClose={()=>{ setSheet(null); setEditGoal(null) }} onSave={saveGoal}/>}
      {sheet==="action" && <ActionGoalSheet goal={editGoal} onClose={()=>{ setSheet(null); setEditGoal(null) }} onSave={saveGoal}/>}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   TRACK TAB
   ════════════════════════════════════════════════════════════════════ */
function TrackTab() {
  const { state, save, toast } = useApp()
  const [section, setSection] = useState("assets")
  const [sheet, setSheet]     = useState(null)
  const [editItem, setEditItem]= useState(null)

  const { totalAssets, totalDebts } = calcTotals(state.assets, state.debts)
  const drag = totalInterestDrag(state.debts)

  function saveAsset({ cat, name, val, monthlyIncome, hasLoan, loanBal, existingId, existingLinkedDebtId }) {
    let newAssets = [...state.assets]
    let newDebts  = [...state.debts]
    const assetId = existingId || `a_${Date.now()}`
    const assetObj = { id:assetId, category:cat, name, value:val, monthlyIncome:monthlyIncome||0, linkedDebtId:existingLinkedDebtId||null }

    if(existingId) newAssets = newAssets.map(a=>a.id===existingId?assetObj:a)
    else           newAssets.push(assetObj)

    if(hasLoan && loanBal>0) {
      const t = DEBT_TYPES.find(x=>["mortgage","car_loan"].includes(x.cat) && x.cat===cat) || DEBT_TYPES[0]
      const debtId = existingLinkedDebtId || `d_linked_${Date.now()}`
      const debtObj = { id:debtId, category:cat==="primary_residence"?"mortgage":cat, name:`${name} loan`, balance:loanBal, interestRate:t?.assumedRate||4.5, linkedAssetId:assetId, isAutoCreated:true }
      newAssets = newAssets.map(a=>a.id===assetId?{...a,linkedDebtId:debtId}:a)
      if(existingLinkedDebtId) newDebts = newDebts.map(d=>d.id===existingLinkedDebtId?debtObj:d)
      else newDebts.push(debtObj)
    }

    save({ ...state, assets:newAssets, debts:newDebts })
    toast(existingId?"✓ Asset updated":"✓ Asset added")
    setSheet(null); setEditItem(null)
  }

  function deleteAsset(a) {
    if(!window.confirm(`Remove "${a.name}"?`)) return
    const newAssets = state.assets.filter(x=>x.id!==a.id)
    const newDebts  = a.linkedDebtId ? state.debts.filter(d=>d.id!==a.linkedDebtId) : state.debts
    save({ ...state, assets:newAssets, debts:newDebts })
    toast("Asset removed")
  }

  function saveDebt({ cat, name, bal, rate, existingId }) {
    const debtId = existingId || `d_${Date.now()}`
    const t = DEBT_TYPES.find(x=>x.cat===cat)
    const debtObj = { id:debtId, category:cat, name, balance:bal, interestRate:rate||t?.assumedRate||10, linkedAssetId:null, isAutoCreated:false }
    const newDebts = existingId ? state.debts.map(d=>d.id===existingId?debtObj:d) : [...state.debts, debtObj]
    save({ ...state, debts:newDebts })
    toast(existingId?"✓ Debt updated":"✓ Debt added")
    setSheet(null); setEditItem(null)
  }

  function deleteDebt(d) {
    if(d.isAutoCreated) { toast("Remove the linked asset to remove this debt"); return }
    if(!window.confirm(`Remove "${d.name}"?`)) return
    save({ ...state, debts:state.debts.filter(x=>x.id!==d.id) })
    toast("Debt removed")
  }

  function saveIncome(inc) { save({ ...state, income:inc }); toast("✓ Income updated") }
  function saveSpending(sp){ save({ ...state, spending:sp }); toast("✓ Spending updated") }

  const SECTIONS = [
    { id:"assets",   label:"Assets",  color:T.teal  },
    { id:"debts",    label:"Debts",   color:T.red   },
    { id:"income",   label:"Income",  color:T.amber },
    { id:"spending", label:"Spending",color:T.purple},
  ]

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      {/* Section tabs */}
      <div style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 18px",display:"flex",gap:0,flexShrink:0,overflowX:"auto" }}>
        {SECTIONS.map(s=>{
          const active = section===s.id
          return (
            <button key={s.id} onClick={()=>setSection(s.id)}
              style={{ background:"none",border:"none",padding:"14px 16px",color:active?s.color:T.muted,fontWeight:active?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",position:"relative",flexShrink:0 }}>
              {s.label}
              {active && <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:20,height:3,borderRadius:"3px 3px 0 0",background:s.color }}/>}
            </button>
          )
        })}
      </div>

      <div style={{ padding:"22px 18px",maxWidth:900,margin:"0 auto",width:"100%" }}>

        {/* ASSETS */}
        {section==="assets" && (
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <div>
                <p style={{ color:T.green,fontWeight:900,fontSize:22 }}>{fmt(totalAssets)}</p>
                <p style={{ color:T.muted,fontSize:12 }}>Total assets</p>
              </div>
              <button onClick={()=>{ setEditItem(null); setSheet("asset") }}
                style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:11,padding:"9px 16px",color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
                <Plus size={14}/>Add asset
              </button>
            </div>
            {state.assets.length===0 ? (
              <EmptyState icon="💰" title="No assets tracked" body="Add your savings, pension, investments, property — anything of value." cta="Add an asset" onClick={()=>setSheet("asset")}/>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {state.assets.map(a=>{
                  const t = ASSET_TYPES.find(x=>x.cat===a.category)||ASSET_TYPES[ASSET_TYPES.length-1]
                  return (
                    <div key={a.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:13,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t?.icon||"📦"}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{a.name}</p>
                        <p style={{ color:T.muted,fontSize:12 }}>
                          {t?.label}
                          {a.monthlyIncome>0 && ` · generates ${fmt(a.monthlyIncome)}/mo`}
                        </p>
                      </div>
                      <p style={{ color:T.green,fontWeight:800,fontSize:15,marginRight:4 }}>{fmt(a.value)}</p>
                      <button onClick={()=>{ setEditItem(a); setSheet("asset") }} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6 }}><Pencil size={14}/></button>
                      <button onClick={()=>deleteAsset(a)} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6 }}><Trash2 size={14}/></button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* DEBTS */}
        {section==="debts" && (
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:drag>0?8:12 }}>
              <div>
                <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:900,fontSize:22 }}>{fmt(totalDebts)}</p>
                <p style={{ color:T.muted,fontSize:12 }}>Total debts{drag>0?` · ${fmt(Math.round(drag))}/yr in interest`:""}</p>
              </div>
              <button onClick={()=>{ setEditItem(null); setSheet("debt") }}
                style={{ background:T.redDim,border:`1.5px solid ${T.redBorder}`,borderRadius:11,padding:"9px 16px",color:T.red,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
                <Plus size={14}/>Add debt
              </button>
            </div>
            {drag > 0 && (
              <div style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:14 }}>
                <p style={{ color:T.red,fontSize:13,fontWeight:600 }}>💸 Costing {fmt(Math.round(drag/12))}/month in interest. Paying off high-rate debt first is your best guaranteed return.</p>
              </div>
            )}
            {state.debts.length===0 ? (
              <EmptyState icon="💳" title="No debts" body="No debt? Great. Or add what you owe to track interest and see your real net worth." cta="Add a debt" onClick={()=>setSheet("debt")}/>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {state.debts.map(d=>{
                  const t = DEBT_TYPES.find(x=>x.cat===d.category)||DEBT_TYPES[DEBT_TYPES.length-1]
                  const interest = annualInterest(d)
                  return (
                    <div key={d.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:13,background:T.redDim,border:`1px solid ${T.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t?.icon||"💳"}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{d.name}</p>
                        <p style={{ color:T.muted,fontSize:12 }}>{d.interestRate||t?.assumedRate||10}% APR · {fmt(Math.round(interest/12))}/mo in interest</p>
                      </div>
                      <p style={{ color:T.red,fontWeight:800,fontSize:15,marginRight:4 }}>{fmt(d.balance)}</p>
                      <button onClick={()=>{ setEditItem(d); setSheet("debt") }} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6 }}><Pencil size={14}/></button>
                      {!d.isAutoCreated && <button onClick={()=>deleteDebt(d)} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6 }}><Trash2 size={14}/></button>}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* INCOME */}
        {section==="income" && <IncomeSection income={state.income} assets={state.assets} onSave={saveIncome}/>}

        {/* SPENDING */}
        {section==="spending" && <SpendingSection spending={state.spending} income={state.income} assets={state.assets} onSave={saveSpending}/>}
      </div>

      {sheet==="asset" && <TrackAssetSheet asset={editItem} onClose={()=>{ setSheet(null); setEditItem(null) }} onSave={saveAsset}/>}
      {sheet==="debt"  && <TrackDebtSheet  debt={editItem}  onClose={()=>{ setSheet(null); setEditItem(null) }} onSave={saveDebt}/>}
    </div>
  )
}

function EmptyState({ icon, title, body, cta, onClick }) {
  return (
    <div style={{ textAlign:"center",padding:"44px 24px",background:T.card,border:`1.5px dashed ${T.border}`,borderRadius:18 }}>
      <div style={{ fontSize:38,marginBottom:12 }}>{icon}</div>
      <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:6 }}>{title}</p>
      <p style={{ color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:20,maxWidth:260,margin:"0 auto 20px" }}>{body}</p>
      <button onClick={onClick} style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:11,padding:"10px 20px",color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>{cta}</button>
    </div>
  )
}

function IncomeSection({ income, assets, onSave }) {
  const [primary, setPrimary] = useState(income.primary||0)
  const [source, setSource]   = useState(income.primarySource||"Salary")
  const totalInc = calcIncome({ primary, primarySource:source, additional:income.additional||[] }, assets)
  return (
    <div>
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px",marginBottom:14 }}>
        <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:16 }}>Primary income</p>
        <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:16 }}>
          <CurrencyInput label="Monthly take-home pay (after tax)" value={primary} onChange={setPrimary} helper="After all tax and NI"/>
          <Input label="Income type" value={source} onChange={setSource} placeholder="e.g. Salary, Freelance"/>
        </div>
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:11,padding:"10px 14px",display:"flex",justifyContent:"space-between",marginBottom:14 }}>
          <span style={{ color:T.muted,fontSize:13 }}>Monthly total</span>
          <span style={{ color:T.teal,fontWeight:800,fontSize:15 }}>{fmt(totalInc)}/mo</span>
        </div>
        <Btn onClick={()=>onSave({ ...income,primary,primarySource:source })}>Save income</Btn>
      </div>
    </div>
  )
}

function SpendingSection({ spending, income, assets, onSave }) {
  const [monthly, setMonthly] = useState(spending.monthly||0)
  const totalInc = calcIncome(income, assets)
  const surplus = monthly > 0 && totalInc > 0 ? totalInc - monthly : null
  return (
    <div>
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px",marginBottom:14 }}>
        <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:6 }}>Monthly spending</p>
        <p style={{ color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:14 }}>Total monthly outgoings — rent, food, transport, bills, subscriptions, everything.</p>
        <CurrencyInput label="Monthly total spending" value={monthly} onChange={setMonthly}/>
        {surplus !== null && (
          <div style={{ background:surplus>0?T.tealDim:T.redDim,border:`1px solid ${surplus>0?T.tealBorder:T.redBorder}`,borderRadius:11,padding:"10px 14px",display:"flex",justifyContent:"space-between",marginTop:12 }}>
            <span style={{ color:T.muted,fontSize:13 }}>{surplus>0?"Monthly surplus":"Monthly shortfall"}</span>
            <span style={{ color:surplus>0?T.teal:T.red,fontWeight:800,fontSize:15 }}>{fmt(Math.abs(surplus))}/mo</span>
          </div>
        )}
        <div style={{ marginTop:14 }}>
          <Btn onClick={()=>onSave({ ...spending,monthly })}>Save spending</Btn>
        </div>
      </div>
    </div>
  )
}

function TrackAssetSheet({ asset, onClose, onSave }) {
  const editing = !!asset
  const existingLoanCats = new Set(["primary_residence","other_property","vehicle","business"])
  const [cat,setCat]     = useState(asset?.category||null)
  const [name,setName]   = useState(asset?.name||"")
  const [val,setVal]     = useState(asset?.value||0)
  const [hasLoan,setHasLoan] = useState(!!asset?.linkedDebtId)
  const [loanBal,setLoanBal] = useState(0)
  const [hasInc,setHasInc]   = useState((asset?.monthlyIncome||0)>0)
  const [inc,setInc]         = useState(asset?.monthlyIncome||0)
  const [err,setErr]         = useState("")

  function go() {
    if(!cat)  { setErr("Choose a category."); return }
    if(val<=0){ setErr("Enter a value."); return }
    setErr("")
    onSave({ cat, name:name||(ASSET_TYPES.find(t=>t.cat===cat)?.label||"Asset"), val, monthlyIncome:hasInc?inc:0, hasLoan, loanBal:hasLoan?loanBal:0, existingId:asset?.id, existingLinkedDebtId:asset?.linkedDebtId })
  }

  return (
    <Sheet title={editing?"Edit asset":"Add asset"} onClose={onClose}>
      <p style={{ fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:10 }}>Category</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
        {ASSET_TYPES.map(t=>{ const sel=cat===t.cat; return (
          <button key={t.id} onClick={()=>{ setCat(t.cat); if(existingLoanCats.has(t.cat)&&!editing) setHasLoan(true) }}
            style={{ padding:"12px 6px",borderRadius:13,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.tealDim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .15s" }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:700,color:sel?T.teal:T.muted,textAlign:"center",lineHeight:1.2 }}>{t.label}</span>
          </button>
        )})}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:14 }}>
        <Input label="Asset name" value={name} onChange={setName} placeholder={ASSET_TYPES.find(t=>t.cat===cat)?.desc||"e.g. My home"}/>
        <CurrencyInput label="Estimated value" value={val} onChange={setVal}/>
      </div>
      {cat&&existingLoanCats.has(cat)&&(
        <div style={{ marginBottom:14 }}>
          <p style={{ color:T.muted,fontSize:13,fontWeight:600,marginBottom:8 }}>Loan or mortgage against this?</p>
          <div style={{ display:"flex",gap:8,marginBottom:hasLoan?12:0 }}>
            {[true,false].map(o=>(
              <button key={String(o)} onClick={()=>setHasLoan(o)} style={{ flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${hasLoan===o?T.teal:T.border}`,background:hasLoan===o?T.tealDim:T.card,color:hasLoan===o?T.teal:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>{o?"Yes":"No"}</button>
            ))}
          </div>
          {hasLoan&&<CurrencyInput label="Outstanding loan balance" value={loanBal} onChange={setLoanBal}/>}
        </div>
      )}
      <div style={{ marginBottom:14 }}>
        <p style={{ color:T.muted,fontSize:13,fontWeight:600,marginBottom:8 }}>Generates monthly income?</p>
        <div style={{ display:"flex",gap:8,marginBottom:hasInc?12:0 }}>
          {[true,false].map(o=>(
            <button key={String(o)} onClick={()=>setHasInc(o)} style={{ flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${hasInc===o?T.teal:T.border}`,background:hasInc===o?T.tealDim:T.card,color:hasInc===o?T.teal:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>{o?"Yes":"No"}</button>
          ))}
        </div>
        {hasInc&&<CurrencyInput label="Monthly income" value={inc} onChange={setInc}/>}
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:12 }}>{err}</p>}
      <Btn onClick={go}>Save asset</Btn>
    </Sheet>
  )
}

function TrackDebtSheet({ debt, onClose, onSave }) {
  const editing = !!debt
  const [cat,setCat]  = useState(debt?.category||null)
  const [name,setName]= useState(debt?.name||"")
  const [bal,setBal]  = useState(debt?.balance||0)
  const [rate,setRate]= useState(debt?.interestRate||"")
  const [err,setErr]  = useState("")
  function go() {
    if(!cat)  { setErr("Choose a category."); return }
    if(bal<=0){ setErr("Enter a balance."); return }
    setErr("")
    onSave({ cat, name:name||(DEBT_TYPES.find(t=>t.cat===cat)?.label||"Debt"), bal, rate:rate?Number(rate):null, existingId:debt?.id })
  }
  return (
    <Sheet title={editing?"Edit debt":"Add debt"} onClose={onClose}>
      <p style={{ fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:10 }}>Category</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
        {DEBT_TYPES.map(t=>{ const sel=cat===t.cat; return (
          <button key={t.id} onClick={()=>setCat(t.cat)}
            style={{ padding:"12px 6px",borderRadius:13,border:`2px solid ${sel?T.red:T.border}`,background:sel?T.redDim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:7,transition:"all .15s" }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:700,color:sel?T.red:T.muted,textAlign:"center" }}>{t.label}</span>
            <span style={{ fontSize:9,color:T.subtle }}>{t.assumedRate}% APR</span>
          </button>
        )})}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:14 }}>
        <Input label="Debt name" value={name} onChange={setName} placeholder={DEBT_TYPES.find(t=>t.cat===cat)?.desc||"e.g. HSBC credit card"}/>
        <CurrencyInput label="Outstanding balance" value={bal} onChange={setBal}/>
        <div>
          <p style={{ fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Interest rate (optional)</p>
          <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
            <input type="number" min="0" max="100" value={rate} placeholder={cat?String(DEBT_TYPES.find(t=>t.cat===cat)?.assumedRate||10):"e.g. 21.9"} onChange={e=>setRate(e.target.value)}
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:14,padding:"12px 14px",fontFamily:"inherit" }}/>
            <span style={{ padding:"0 14px",color:T.muted,fontSize:14,fontWeight:700 }}>%</span>
          </div>
        </div>
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:12 }}>{err}</p>}
      <Btn onClick={go}>Save debt</Btn>
    </Sheet>
  )
}

/* ════════════════════════════════════════════════════════════════════
   LESSONS — 2 fully working lessons, goal-linked
   ════════════════════════════════════════════════════════════════════ */
const LESSONS = [
  /* ── Lesson 1: Net Worth — linked to grow_nw, calm, learn ─────── */
  {
    id:"nw_basics",
    track:"Foundations",
    trackColor:T.teal, trackDim:T.tealDim, trackBorder:T.tealBorder,
    title:"What net worth actually is — and why it changes everything",
    emoji:"📊", xp:15,
    goalLinks:["net_worth","calm","learn","budget"],
    cards:[
      {
        type:"fact",
        headline:"One number. The whole story.",
        icon:"🎯",
        body:"Income tells you how much flows in. Spending tells you how much flows out. Net worth tells you what's actually left after a lifetime of both. It's the only number that really matters.",
        highlight:"Net worth = everything you own − everything you owe",
        visual:"equation",
      },
      {
        type:"fact",
        headline:"Why most people have no idea what theirs is",
        icon:"🤷",
        body:"Nobody teaches this. Schools don't cover it. Banks don't show it. Most people feel vaguely okay or vaguely worried — but they're flying blind.",
        facts:[
          { icon:"😰", label:"Flying blind", text:"Without a net worth number, financial decisions feel like guesswork. You don't know if you're ahead or behind, or what's actually moving the needle." },
          { icon:"📊", label:"Measurement = momentum", text:"People who track their net worth consistently make better decisions, save more, and reach financial goals faster. The act of measuring creates accountability." },
          { icon:"🔮", label:"It predicts the future", text:"Your net worth today, combined with your monthly surplus and investment rate, tells you with surprising accuracy where you'll be in 10, 20, or 30 years." },
        ]
      },
      {
        type:"scenario",
        prompt:"Two people both earn £45k. After 20 years, who has more?",
        context:"Alex saves £400/month in an ISA from age 28. Jordan earns the same but spends it all — nicer car, better holidays.",
        choices:[
          { label:"Jordan — lifestyle choices reflect financial confidence", best:false, outcome:"Lifestyle spending leaves no wealth trail. Jordan's car depreciated and the holidays produced no financial return. Net worth after 20 years: roughly £0 invested." },
          { label:"Alex — tracking and investing consistently wins", best:true, outcome:"At 7% average return, Alex's £400/month over 20 years grows to roughly £208,000. Same income. Dramatically different net worth. The only difference was measuring and acting." },
        ],
        explanation:"Identical incomes, identical starting points, radically different outcomes. The gap is entirely explained by one person measuring — and acting on — their net worth."
      },
      {
        type:"fact",
        headline:"The four levers that grow your number",
        icon:"🎛️",
        body:"There are only four ways to improve net worth. Every financial decision hits at least one.",
        facts:[
          { icon:"⬆️", label:"Earn more", text:"A pay rise is the highest-leverage move for most people under 40. Even a 10% increase compounds dramatically over a career." },
          { icon:"⬇️", label:"Spend less", text:"Every £1 not spent is a £1 that builds assets. The gap between spending 80% and 100% of income over 30 years is hundreds of thousands of pounds." },
          { icon:"📈", label:"Grow assets faster", text:"Money in a current account earning 0% vs an ISA growing at 7% — the difference over 20 years on £10,000 is £27,000." },
          { icon:"💳", label:"Eliminate bad debt", text:"Paying off a 22% credit card is a guaranteed 22% return. Nothing reliably beats that." },
        ]
      },
      {
        type:"quiz",
        question:"What does net worth measure?",
        options:["Your monthly income minus your monthly spending","Everything you own minus everything you owe","Your credit score and financial health","How much you've earned over your lifetime"],
        correct:1,
        explanation:"Net worth = total assets minus total liabilities. It's a snapshot of your financial position right now, and the truest measure of financial progress."
      },
    ]
  },

  /* ── Lesson 2: Compound interest — linked to invest, learn, pension ── */
  {
    id:"compound_interest",
    track:"Investing",
    trackColor:T.purple, trackDim:T.purpleDim, trackBorder:T.purpleBorder,
    title:"Compound interest — the force that works for or against you",
    emoji:"🌱", xp:15,
    goalLinks:["invest","learn","pension","net_worth"],
    cards:[
      {
        type:"fact",
        headline:"Interest on interest — it's exponential, not linear",
        icon:"📈",
        body:"Compound interest means you earn returns not just on what you put in — but on every pound of returns you've already earned. It starts slow. Then it accelerates dramatically.",
        highlight:"Time in the market > amount invested",
        visual:"compound_explainer",
      },
      {
        type:"interactive",
        id:"growth_chart",
        headline:"See the compound curve",
        prompt:"Drag to see how your monthly investment grows over time",
        hint:"Notice how the gap between what you put in (grey) and what you end up with (teal) widens dramatically in the later years. That gap is pure compound interest doing its work.",
      },
      {
        type:"fact",
        headline:"The Rule of 72 — how fast does your money double?",
        icon:"⚡",
        body:"Divide 72 by your annual return to find how long it takes to double your money.",
        facts:[
          { icon:"🏦", label:"Savings account at 4%", text:"72 ÷ 4 = 18 years to double. £10,000 becomes £20,000." },
          { icon:"📈", label:"Index fund at 7%", text:"72 ÷ 7 = ~10 years to double. £10,000 becomes £80,000 in 30 years." },
          { icon:"💳", label:"Credit card at 24%", text:"72 ÷ 24 = 3 years to double. A £1,000 balance left unpaid becomes £2,000, then £4,000." },
        ]
      },
      {
        type:"scenario",
        prompt:"Sarah invests £200/mo from age 25. Tom invests £400/mo from age 35. Both stop at 65 with 7% returns. Who wins?",
        context:"Sarah starts 10 years earlier with half the monthly amount. Tom invests twice as much but starts later.",
        choices:[
          { label:"Tom — he invested twice as much every month", best:false, outcome:"Tom's total invested: £144,000. Final value: ~£524,000. Starting later is brutally expensive." },
          { label:"Sarah — starting 10 years earlier wins", best:true, outcome:"Sarah's total invested: £96,000 (less than Tom). Final value: ~£527,000. Starting earlier wins — even investing less. Time is the most powerful variable." },
          { label:"They end up roughly equal", best:false, outcome:"They're very close, but Sarah wins — having invested £48,000 less. That's the power of starting early." },
        ],
        explanation:"Starting a decade earlier effectively doubles your money — even if you invest half as much each month. This is why starting now, even with small amounts, beats waiting until you earn more."
      },
      {
        type:"quiz",
        question:"Using the Rule of 72, money invested at 7%/yr doubles roughly every:",
        options:["5 years","10 years","15 years","20 years"],
        correct:1,
        explanation:"72 ÷ 7 = 10.3 years. So £5,000 invested today at 7% becomes ~£10,000 in 10 years, ~£20,000 in 20 years, and ~£40,000 in 30 years — without adding a single pound more."
      },
    ]
  },
]

/* ════════════════════════════════════════════════════════════════════
   LEARN TAB
   ════════════════════════════════════════════════════════════════════ */
function LearnTab() {
  const { state, save, toast } = useApp()
  const [activeLesson, setActiveLesson] = useState(null)
  const completedLessons = state.completedLessons||[]
  const doneSet = new Set(completedLessons)
  const priorityGoals = state.priorityGoals||[]

  function completeLesson(lessonId) {
    if(doneSet.has(lessonId)) return
    const newCompleted = [...completedLessons, lessonId]
    const lesson = LESSONS.find(l=>l.id===lessonId)
    const xpGain = lesson?.xp || 10
    save({
      ...state,
      completedLessons: newCompleted,
      profile: { ...state.profile, points:(state.profile.points||0)+xpGain }
    })
    toast(`🎉 +${xpGain} XP`)
    setActiveLesson(null)
  }

  if(activeLesson) {
    const lesson = LESSONS.find(l=>l.id===activeLesson)
    if(!lesson) { setActiveLesson(null); return null }
    return <LessonPlayer lesson={lesson} onComplete={()=>completeLesson(lesson.id)} onBack={()=>setActiveLesson(null)}/>
  }

  // Sort: priority-linked lessons first, then undone first
  const sorted = [...LESSONS].sort((a,b)=>{
    const aLinked = a.goalLinks?.some(g=>priorityGoals.includes(g))
    const bLinked = b.goalLinks?.some(g=>priorityGoals.includes(g))
    if(aLinked && !bLinked) return -1
    if(!aLinked && bLinked) return 1
    const aDone = doneSet.has(a.id)
    const bDone = doneSet.has(b.id)
    if(!aDone && bDone) return -1
    if(aDone && !bDone) return 1
    return 0
  })

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      <div style={{ padding:"28px 18px 10px",maxWidth:700,margin:"0 auto",width:"100%" }}>

        {/* Header */}
        <h2 style={{ color:T.white,fontWeight:900,fontSize:22,marginBottom:4 }}>Learn</h2>
        <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>
          {completedLessons.length}/{LESSONS.length} completed · {completedLessons.length*15} XP earned
        </p>

        {/* XP bar */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",marginBottom:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>Your progress</p>
            <p style={{ color:T.teal,fontWeight:800,fontSize:13 }}>{completedLessons.length}/{LESSONS.length} lessons</p>
          </div>
          <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden" }}>
            <div style={{ width:`${LESSONS.length>0?Math.round(completedLessons.length/LESSONS.length*100):0}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width .6s ease" }}/>
          </div>
        </div>

        {/* Lessons */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {sorted.map(lesson=>{
            const done   = doneSet.has(lesson.id)
            const linked = lesson.goalLinks?.some(g=>priorityGoals.includes(g))
            return (
              <button key={lesson.id} onClick={()=>setActiveLesson(lesson.id)}
                style={{ background:T.card,border:`1.5px solid ${linked&&!done?lesson.trackColor+"40":T.border}`,borderRadius:18,padding:"18px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",gap:14,alignItems:"center",opacity:done?.75:1,transition:"all .15s" }}>
                <div style={{ width:54,height:54,borderRadius:16,background:done?"rgba(52,211,153,.15)":`${lesson.trackColor}20`,border:`1.5px solid ${done?"rgba(52,211,153,.3)":lesson.trackColor+"40"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>
                  {done ? "✅" : lesson.emoji}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  {linked && !done && <p style={{ color:lesson.trackColor,fontWeight:700,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:3 }}>★ Matches your goals</p>}
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,lineHeight:1.3,marginBottom:4 }}>{lesson.title}</p>
                  <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
                    <span style={{ background:`${lesson.trackColor}20`,color:lesson.trackColor,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,border:`1px solid ${lesson.trackColor}30` }}>{lesson.track}</span>
                    <span style={{ color:T.muted,fontSize:11 }}>{lesson.cards?.length} cards · +{lesson.xp} XP</span>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {done ? <span style={{ color:T.green,fontSize:11,fontWeight:700 }}>Done ✓</span> : <ChevronRight size={18} color={T.muted}/>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Teaser for more */}
        <div style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginTop:14,textAlign:"center" }}>
          <p style={{ fontSize:28,marginBottom:8 }}>🚀</p>
          <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:4 }}>More lessons coming</p>
          <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>Investing, debt strategy, pensions, ISAs, budgeting — complete these two first to unlock what's next.</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   LESSON PLAYER
   ════════════════════════════════════════════════════════════════════ */
function LessonPlayer({ lesson, onComplete, onBack }) {
  const [cardIdx,  setCardIdx]   = useState(0)
  const [answered, setAnswered]  = useState(null)
  const [ranked,   setRanked]    = useState([])
  const [matchSel, setMatchSel]  = useState(null)
  const [matchDone,setMatchDone] = useState(new Set())
  const [shuffledDefs, setShuffledDefs] = useState([])

  const card  = lesson.cards[cardIdx]
  const isLast= cardIdx === lesson.cards.length - 1
  const color = lesson.trackColor || T.teal

  useEffect(()=>{
    setAnswered(null)
    setMatchSel(null)
    setMatchDone(new Set())
    setRanked([])
    if(card?.type==="match") {
      const defs = [...card.pairs.map(p=>p.def)]
      for(let i=defs.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1));[defs[i],defs[j]]=[defs[j],defs[i]] }
      setShuffledDefs(defs)
    }
  },[cardIdx])

  function next() {
    if(isLast) { onComplete(); return }
    setCardIdx(i=>i+1)
  }

  const canProceed = () => {
    if(card.type==="quiz"||card.type==="scenario") return answered !== null
    if(card.type==="match") return matchDone.size === card.pairs?.length
    if(card.type==="rank")  return ranked.length === card.items?.length
    return true
  }

  return (
    <div style={{ height:"100%",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden" }}>
      <StarField count={20}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:180,background:`linear-gradient(180deg,${color}15 0%,transparent 100%)`,pointerEvents:"none" }}/>

      {/* Header */}
      <div style={{ position:"relative",display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:`1px solid ${T.border}`,flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",padding:4 }}><ChevronLeft size={20}/></button>
        <div style={{ flex:1 }}>
          <p style={{ color,fontWeight:700,fontSize:11,letterSpacing:.8,textTransform:"uppercase" }}>{lesson.track}</p>
          <p style={{ color:T.white,fontWeight:700,fontSize:13,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:260 }}>{lesson.title}</p>
        </div>
        <span style={{ color:T.muted,fontSize:12,flexShrink:0 }}>{cardIdx+1}/{lesson.cards.length}</span>
      </div>

      {/* Progress */}
      <div style={{ background:T.surface,height:4,flexShrink:0,overflow:"hidden" }}>
        <div style={{ width:`${((cardIdx+1)/lesson.cards.length)*100}%`,height:"100%",background:color,transition:"width .5s ease" }}/>
      </div>

      {/* Card */}
      <div key={`card-${cardIdx}`} className="ls-slidecard" style={{ position:"relative",flex:1,overflowY:"auto",padding:"24px 22px 20px",maxWidth:560,margin:"0 auto",width:"100%" }}>

        {card.type==="fact"        && <FactCard        card={card} color={color}/>}
        {card.type==="scenario"    && <ScenarioCard    card={card} color={color} answered={answered} onAnswer={setAnswered}/>}
        {card.type==="quiz"        && <QuizCard        card={card} color={color} answered={answered} onAnswer={setAnswered}/>}
        {card.type==="match"       && <MatchCard       card={card} color={color} shuffledDefs={shuffledDefs} matchSel={matchSel} setMatchSel={setMatchSel} matchDone={matchDone} setMatchDone={setMatchDone}/>}
        {card.type==="interactive" && card.id==="growth_chart" && <GrowthChartCard color={color} hint={card.hint}/>}
        {card.type==="rank"        && <RankCard        card={card} color={color} ranked={ranked} setRanked={setRanked}/>}

      </div>

      {/* CTA */}
      <div style={{ position:"relative",padding:"10px 22px 32px",maxWidth:560,margin:"0 auto",width:"100%",flexShrink:0 }}>
        {canProceed() ? (
          <Btn onClick={next}>
            {isLast ? "Complete lesson 🎉" : "Next →"}
          </Btn>
        ) : (
          <div style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",textAlign:"center" }}>
            <p style={{ color:T.subtle,fontSize:13 }}>
              {card.type==="quiz"||card.type==="scenario" ? "Choose an answer to continue" : "Complete the exercise to continue"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Card type renderers ────────────────────────────────────────── */
function FactCard({ card, color }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div>
      {/* Icon badge */}
      {card.icon && (
        <div style={{ width:52,height:52,borderRadius:16,background:`${color}20`,border:`1.5px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:18 }}>
          {card.icon}
        </div>
      )}

      <h2 style={{ color:T.white,fontSize:"clamp(18px,4vw,24px)",fontWeight:900,lineHeight:1.3,marginBottom:14 }}>{card.headline}</h2>
      <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.8,marginBottom:card.highlight||card.facts?18:0 }}>{card.body}</p>

      {/* Equation visual */}
      {card.visual==="equation" && (
        <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:18,padding:"16px",background:T.faint,borderRadius:16 }}>
          {[
            { label:"🏠 Assets", color:T.green },
            { label:"−", plain:true },
            { label:"💳 Debts", color:T.red },
            { label:"=", plain:true },
            { label:"💰 Net Worth", color:T.teal },
          ].map((item,i)=>(
            item.plain
            ? <span key={i} style={{ color:T.muted,fontSize:22,fontWeight:900 }}>{item.label}</span>
            : <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 12px" }}>
                <p style={{ color:item.color,fontWeight:800,fontSize:13 }}>{item.label}</p>
              </div>
          ))}
        </div>
      )}

      {card.highlight && (
        <div style={{ background:`${color}12`,border:`1.5px solid ${color}35`,borderRadius:14,padding:"14px 18px",marginBottom:card.facts?18:0 }}>
          <p style={{ color,fontWeight:700,fontSize:14,lineHeight:1.5 }}>💡 {card.highlight}</p>
        </div>
      )}

      {card.facts && (
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {card.facts.map((f,i)=>{
            const open = expanded===i
            return (
              <div key={i} onClick={()=>setExpanded(open?null:i)}
                style={{ background:open?`${color}10`:T.card,border:`1.5px solid ${open?color+"40":T.border}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all .2s" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:20 }}>{f.icon}</span>
                  <p style={{ color:open?T.white:T.muted,fontWeight:700,fontSize:14,flex:1 }}>{f.label}</p>
                  <ChevronRight size={14} color={T.subtle} style={{ transform:open?"rotate(90deg)":"none",transition:"transform .2s",flexShrink:0 }}/>
                </div>
                {open && <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.7,marginTop:12,paddingTop:10,borderTop:`1px solid ${T.border}` }}>{f.text}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ScenarioCard({ card, color, answered, onAnswer }) {
  return (
    <div>
      <div style={{ background:`${color}12`,border:`1.5px solid ${color}35`,borderRadius:14,padding:"16px 18px",marginBottom:20 }}>
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Scenario</p>
        <p style={{ color:T.white,fontWeight:700,fontSize:16,lineHeight:1.4,marginBottom:8 }}>{card.prompt}</p>
        <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6 }}>{card.context}</p>
      </div>

      <p style={{ color:T.muted,fontSize:12,marginBottom:12,fontWeight:600 }}>What would you do?</p>

      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
        {card.choices.map((c,i)=>{
          const picked = answered===i
          const wrong  = answered!==null && picked && !c.best
          const right  = answered!==null && c.best
          let bg = T.card, border = T.border, textColor = T.muted
          if(right)  { bg=`rgba(52,211,153,.1)`; border=`rgba(52,211,153,.4)`; textColor=T.green }
          if(wrong)  { bg=T.redDim; border=T.redBorder; textColor=T.red }
          if(answered===null) { bg=T.card; border=T.border; textColor=T.muted }
          if(answered===null&&picked) { bg=`${color}15`; border=`${color}40`; textColor=T.white }

          return (
            <button key={i} onClick={()=>answered===null&&onAnswer(i)}
              style={{ background:bg,border:`2px solid ${border}`,borderRadius:14,padding:"14px 16px",cursor:answered!==null?"default":"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .2s" }}>
              <p style={{ color:answered!==null?textColor:T.white,fontWeight:600,fontSize:14,lineHeight:1.4,marginBottom:answered!==null&&picked?8:0 }}>{c.label}</p>
              {answered!==null && picked && c.outcome && (
                <p style={{ color:textColor,fontSize:12,lineHeight:1.5,opacity:.9 }}>{c.outcome}</p>
              )}
              {answered!==null && !picked && c.best && (
                <p style={{ color:T.green,fontSize:12,lineHeight:1.5,marginTop:4 }}>{c.outcome}</p>
              )}
            </button>
          )
        })}
      </div>

      {answered!==null && card.explanation && (
        <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px" }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:6 }}>The takeaway</p>
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.7 }}>{card.explanation}</p>
        </div>
      )}
    </div>
  )
}

function QuizCard({ card, color, answered, onAnswer }) {
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:20 }}>{card.question}</h2>

      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
        {card.options.map((opt,i)=>{
          const picked  = answered===i
          const correct = card.correct===i
          let bg=T.card, border=T.border, textColor=T.muted
          if(answered!==null && correct)        { bg="rgba(52,211,153,.1)"; border="rgba(52,211,153,.4)"; textColor=T.green }
          if(answered!==null && picked&&!correct){ bg=T.redDim; border=T.redBorder; textColor=T.red }

          return (
            <button key={i} onClick={()=>answered===null&&onAnswer(i)}
              style={{ background:bg,border:`2px solid ${border}`,borderRadius:14,padding:"14px 16px",cursor:answered!==null?"default":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,transition:"all .2s" }}>
              <div style={{ width:28,height:28,borderRadius:8,background:answered!==null?(correct?"rgba(52,211,153,.2)":(picked?T.redDim:`${color}10`)):`${color}15`,border:`1.5px solid ${answered!==null?(correct?"rgba(52,211,153,.4)":(picked?T.redBorder:`${color}30`)):T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <span style={{ color:answered!==null?(correct?T.green:(picked?T.red:T.muted)):color,fontWeight:800,fontSize:11 }}>
                  {answered!==null ? (correct?"✓":(picked?"✗":String.fromCharCode(65+i))) : String.fromCharCode(65+i)}
                </span>
              </div>
              <p style={{ color:answered!==null?textColor:T.white,fontWeight:600,fontSize:14,flex:1,lineHeight:1.4 }}>{opt}</p>
            </button>
          )
        })}
      </div>

      {answered!==null && card.explanation && (
        <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px" }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:6 }}>Why</p>
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.7 }}>{card.explanation}</p>
        </div>
      )}
    </div>
  )
}

function MatchCard({ card, color, shuffledDefs, matchSel, setMatchSel, matchDone, setMatchDone }) {
  function handleTerm(i) {
    if(matchDone.has(String(i))) return
    setMatchSel({ type:"term", idx:i })
  }
  function handleDef(defPos) {
    if(matchSel?.type==="term") {
      const defText = shuffledDefs[defPos]
      const termIdx = card.pairs.findIndex(p=>p.def===defText)
      if(termIdx===matchSel.idx) {
        setMatchDone(s=>{ const n=new Set(s); n.add(String(termIdx)); return n })
        setMatchSel(null)
      } else {
        setMatchSel({ type:"wrong", defPos, termIdx:matchSel.idx })
        setTimeout(()=>setMatchSel(null),800)
      }
    }
  }
  const allDone = matchDone.size===card.pairs?.length
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,marginBottom:6 }}>{card.prompt}</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Tap a term, then its matching definition.</p>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2 }}>Terms</p>
          {card.pairs.map((p,i)=>{
            const matched=matchDone.has(String(i)); const sel=matchSel?.type==="term"&&matchSel?.idx===i
            return <button key={i} onClick={()=>handleTerm(i)} style={{ background:matched?"rgba(52,211,153,.1)":sel?`${color}20`:T.card,border:`2px solid ${matched?"#34D399":sel?color:T.border}`,borderRadius:12,padding:"12px 14px",cursor:matched?"default":"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s" }}>
              <p style={{ color:matched?"#34D399":sel?T.white:T.muted,fontWeight:700,fontSize:13 }}>{p.term}</p>
            </button>
          })}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2 }}>Definitions</p>
          {shuffledDefs.map((def,pos)=>{
            const termIdx=card.pairs.findIndex(p=>p.def===def); const matched=matchDone.has(String(termIdx)); const wrong=matchSel?.type==="wrong"&&matchSel?.defPos===pos
            return <button key={pos} onClick={()=>handleDef(pos)} style={{ background:matched?"rgba(52,211,153,.1)":wrong?T.redDim:matchSel?.type==="term"?`${color}08`:T.card,border:`2px solid ${matched?"#34D399":wrong?T.red:matchSel?.type==="term"?color+"30":T.border}`,borderRadius:12,padding:"12px 14px",cursor:matched?"default":"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s" }}>
              <p style={{ color:matched?"#34D399":T.muted,fontWeight:600,fontSize:12,lineHeight:1.4 }}>{def}</p>
            </button>
          })}
        </div>
      </div>
      {allDone && (
        <div className="ls-fadein" style={{ background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.3)",borderRadius:14,padding:"14px 18px" }}>
          <p style={{ color:"#34D399",fontWeight:700,fontSize:14,marginBottom:4 }}>All matched! 🎉</p>
          {card.explanation && <p style={{ color:T.muted,fontSize:13,lineHeight:1.6 }}>{card.explanation}</p>}
        </div>
      )}
    </div>
  )
}

function RankCard({ card, color, ranked, setRanked }) {
  const remaining = card.items?.filter(x=>!ranked.includes(x))||[]
  const allDone   = ranked.length===card.items?.length
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,marginBottom:6 }}>{card.prompt}</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Tap in your preferred order.</p>
      {ranked.length>0 && (
        <div style={{ marginBottom:14 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Your ranking</p>
          {ranked.map((item,i)=>(
            <div key={item} onClick={()=>setRanked(r=>r.filter(x=>x!==item))} style={{ display:"flex",alignItems:"center",gap:10,background:`${color}12`,border:`1px solid ${color}30`,borderRadius:11,padding:"10px 14px",marginBottom:6,cursor:"pointer" }}>
              <span style={{ color,fontWeight:900,fontSize:14,width:22 }}>#{i+1}</span>
              <p style={{ color:T.white,fontSize:13,fontWeight:600,flex:1 }}>{item}</p>
              <X size={12} color={T.muted}/>
            </div>
          ))}
        </div>
      )}
      {remaining.length>0 && (
        <div>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Options</p>
          {remaining.map(item=>(
            <div key={item} onClick={()=>setRanked(r=>[...r,item])} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:"10px 14px",marginBottom:6,cursor:"pointer" }}>
              <p style={{ color:T.muted,fontSize:13,fontWeight:600 }}>{item}</p>
            </div>
          ))}
        </div>
      )}
      {allDone && card.answer && (
        <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",marginTop:12 }}>
          <p style={{ color:T.muted,fontSize:12,lineHeight:1.7 }}>{card.answer}</p>
        </div>
      )}
    </div>
  )
}

function GrowthChartCard({ color, hint }) {
  const [monthly, setMonthly] = useState(300)
  const years = 30
  const data = useMemo(()=>{
    const pts = []
    let total=0, balance=0
    for(let y=0;y<=years;y++){
      if(y>0){ total+=monthly*12; balance=(balance+monthly*12)*1.07 }
      pts.push({ year:y, contributed:Math.round(total), growth:Math.round(balance) })
    }
    return pts
  },[monthly])
  const fmtAx = v => v>=1e6?`£${(v/1e6).toFixed(1)}M`:v>=1000?`£${(v/1000).toFixed(0)}k`:""
  const finalBal = data[years]?.growth||0
  const finalCon = data[years]?.contributed||0

  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,marginBottom:6 }}>See compound interest in action</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20,lineHeight:1.5 }}>Adjust your monthly investment to see what compound interest does over 30 years.</p>

      {/* Slider */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
          <p style={{ color:T.muted,fontSize:13 }}>Monthly investment</p>
          <p style={{ color,fontWeight:800,fontSize:16 }}>£{monthly.toLocaleString("en-GB")}</p>
        </div>
        <input type="range" min="50" max="2000" step="50" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}
          style={{ width:"100%",accentColor:color,height:6,cursor:"pointer" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
          <span style={{ color:T.subtle,fontSize:11 }}>£50</span>
          <span style={{ color:T.subtle,fontSize:11 }}>£2,000</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px" }}>
          <p style={{ color:T.muted,fontSize:12,marginBottom:2 }}>You put in</p>
          <p style={{ color:T.white,fontWeight:800,fontSize:18 }}>{fmtK(finalCon)}</p>
        </div>
        <div style={{ background:`${color}12`,border:`1.5px solid ${color}35`,borderRadius:12,padding:"12px 14px" }}>
          <p style={{ color:T.muted,fontSize:12,marginBottom:2 }}>You end up with</p>
          <p style={{ color,fontWeight:800,fontSize:18 }}>{fmtK(finalBal)}</p>
        </div>
      </div>
      <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:16 }}>
        <p style={{ color:T.amber,fontWeight:700,fontSize:13 }}>💡 Compound interest adds {fmtK(finalBal-finalCon)} on top of what you invested</p>
      </div>

      {/* Chart */}
      <div style={{ height:160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4,right:4,bottom:0,left:0 }}>
            <defs>
              <linearGradient id="gGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.muted} stopOpacity={.2}/>
                <stop offset="95%" stopColor={T.muted} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fontSize:10,fill:T.muted }} axisLine={false} tickLine={false} interval={5}/>
            <YAxis tick={{ fontSize:9,fill:T.subtle }} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={42}/>
            <Tooltip formatter={(v,name)=>[fmt(v),name==="growth"?"Total value":"Amount contributed"]} labelFormatter={v=>`Year ${v}`} contentStyle={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white }}/>
            <Area type="monotone" dataKey="contributed" stroke={T.muted}   strokeWidth={1.5} strokeDasharray="4 3" fill="url(#gContrib)" dot={false}/>
            <Area type="monotone" dataKey="growth"      stroke={color}      strokeWidth={2.5} fill="url(#gGrowth)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {hint && <p style={{ color:T.subtle,fontSize:12,lineHeight:1.6,marginTop:12 }}>💡 {hint}</p>}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   ME TAB
   ════════════════════════════════════════════════════════════════════ */
function MeTab() {
  const { state, reset, save, toast } = useApp()
  const xp      = state.profile.points||0
  const lvl     = getLevelInfo(xp)
  const nextLvl = getNextLevel(xp)
  const pctToNext = nextLvl ? Math.round(((xp-lvl.min)/(nextLvl.min-lvl.min))*100) : 100
  const earned  = BADGES.filter(b=>b.condition(state))
  const locked  = BADGES.filter(b=>!b.condition(state))
  const { netWorth } = calcTotals(state.assets, state.debts)
  const completedLessons = state.completedLessons||[]
  const priorityGoals = (state.priorityGoals||[]).map(id=>PRIORITY_GOALS.find(g=>g.id===id)).filter(Boolean)

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      <div style={{ padding:"24px 18px",maxWidth:900,margin:"0 auto",width:"100%" }}>

        {/* Profile hero */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"24px",marginBottom:16,position:"relative",overflow:"hidden" }}>
          <StarField count={12}/>
          <div style={{ position:"relative",display:"flex",alignItems:"flex-start",gap:16,marginBottom:20 }}>
            <div style={{ width:60,height:60,borderRadius:18,background:T.tealDim,border:`2px solid ${T.teal}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:`0 0 24px ${T.teal}30` }}>
              🚀
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:T.white,fontWeight:900,fontSize:20,marginBottom:2 }}>{state.profile.name||"Your profile"}</p>
              {state.profile.age && <p style={{ color:T.muted,fontSize:13,marginBottom:4 }}>Age {state.profile.age}</p>}
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:14 }}>{lvl.emoji}</span>
                <span style={{ color:T.muted,fontSize:13 }}>Level {lvl.level} — {lvl.label}</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:T.teal,fontWeight:900,fontSize:24 }}>{xp}</p>
              <p style={{ color:T.muted,fontSize:11 }}>XP</p>
            </div>
          </div>
          {nextLvl && (
            <div>
              <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:5 }}>
                <div style={{ width:`${pctToNext}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.tealMid})`,borderRadius:99,transition:"width .8s ease" }}/>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between" }}>
                <span style={{ color:T.subtle,fontSize:11 }}>{xp} XP</span>
                <span style={{ color:T.muted,fontSize:11 }}>{nextLvl.emoji} {nextLvl.label} at {nextLvl.min} XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
          {[
            { l:"Net worth",  v:fmtK(netWorth),            c:netWorth>=0?T.teal:T.red },
            { l:"Lessons",    v:`${completedLessons.length}/${LESSONS.length}`, c:T.purple },
            { l:"Badges",     v:`${earned.length}/${BADGES.length}`,            c:T.amber  },
          ].map(k=>(
            <div key={k.l} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",textAlign:"center" }}>
              <p style={{ color:k.c,fontWeight:900,fontSize:20 }}>{k.v}</p>
              <p style={{ color:T.muted,fontSize:11,marginTop:3 }}>{k.l}</p>
            </div>
          ))}
        </div>

        {/* Priorities */}
        {priorityGoals.length > 0 && (
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px",marginBottom:16 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Your priorities</p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {priorityGoals.map(g=>(
                <div key={g.id} style={{ background:`${g.color}15`,border:`1px solid ${g.color}40`,borderRadius:99,padding:"5px 12px",display:"flex",alignItems:"center",gap:6 }}>
                  <span style={{ fontSize:14 }}>{g.icon}</span>
                  <span style={{ color:T.white,fontWeight:700,fontSize:12 }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level roadmap */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Level roadmap</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {XP_LEVELS.map(l=>{
              const curr = getLevelInfo(xp).level===l.level
              const done = xp >= l.min
              return (
                <div key={l.level} style={{ display:"flex",alignItems:"center",gap:12,background:curr?`${T.teal}10`:undefined,border:`1px solid ${curr?T.tealBorder:T.border}`,borderRadius:11,padding:"11px 14px" }}>
                  <div style={{ width:34,height:34,borderRadius:10,background:done?`${T.teal}20`:"transparent",border:`2px solid ${done?T.teal:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>
                    {done?l.emoji:"🔒"}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:done?T.white:T.subtle,fontWeight:700,fontSize:13 }}>Level {l.level}: {l.label}</p>
                    <p style={{ color:T.subtle,fontSize:11 }}>{l.min} XP</p>
                  </div>
                  {curr&&<span style={{ background:T.tealDim,color:T.teal,fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:99,border:`1px solid ${T.tealBorder}` }}>You</span>}
                  {done&&!curr&&<Check size={14} color="#34D399"/>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Badges */}
        {earned.length>0 && (
          <div style={{ marginBottom:16 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Badges earned</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10 }}>
              {earned.map(b=>(
                <div key={b.id} style={{ background:T.card,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"14px",textAlign:"center" }}>
                  <div style={{ fontSize:26,marginBottom:6 }}>{b.emoji}</div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:12,marginBottom:2 }}>{b.label}</p>
                  <p style={{ color:T.muted,fontSize:10,lineHeight:1.4 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {locked.length>0 && (
          <div style={{ marginBottom:20 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Locked</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10 }}>
              {locked.map(b=>(
                <div key={b.id} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",textAlign:"center",opacity:.6 }}>
                  <div style={{ fontSize:26,marginBottom:6,filter:"grayscale(1)" }}>{b.emoji}</div>
                  <p style={{ color:T.subtle,fontWeight:700,fontSize:12,marginBottom:2 }}>{b.label}</p>
                  <p style={{ color:T.subtle,fontSize:10,lineHeight:1.4 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden" }}>
          <button onClick={()=>{ if(window.confirm("Reset all data? This cannot be undone.")) reset() }}
            style={{ width:"100%",background:"none",border:"none",padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"inherit",color:T.red }}>
            <Trash2 size={16}/>
            <span style={{ fontWeight:700,fontSize:14 }}>Reset all data</span>
          </button>
        </div>

        <p style={{ color:T.subtle,fontSize:11,textAlign:"center",marginTop:16 }}>🔒 Your data stays on your device · LifeSmart</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   BOTTOM NAV
   ════════════════════════════════════════════════════════════════════ */
function BottomNav() {
  const { tab, setTab, state } = useApp()
  const completedLessons = state.completedLessons||[]
  const hasNewLesson = completedLessons.length < LESSONS.length

  const TABS = [
    { icon:Home,       label:"Home",  idx:0 },
    { icon:BookOpen,   label:"Learn", idx:1, dot:hasNewLesson },
    { icon:Target,     label:"Goals", idx:2 },
    { icon:TrendingUp, label:"Track", idx:3 },
    { icon:User,       label:"Me",    idx:4 },
  ]

  return (
    <nav style={{ background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",height:66,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
      {TABS.map(t=>{
        const active = tab===t.idx
        const Icon = t.icon
        return (
          <button key={t.idx} onClick={()=>setTab(t.idx)}
            style={{ flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"8px 0",position:"relative" }}>
            <div style={{ position:"relative" }}>
              <Icon size={21} color={active?T.teal:T.muted} strokeWidth={active?2.5:1.8}/>
              {t.dot && !active && (
                <div style={{ position:"absolute",top:-2,right:-2,width:7,height:7,borderRadius:"50%",background:T.teal,border:`2px solid ${T.surface}` }}/>
              )}
            </div>
            <span style={{ fontSize:10,fontWeight:active?700:500,color:active?T.teal:T.muted,letterSpacing:.2 }}>{t.label}</span>
            {active && <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:18,height:3,borderRadius:"3px 3px 0 0",background:T.teal }}/>}
          </button>
        )
      })}
    </nav>
  )
}

/* ════════════════════════════════════════════════════════════════════
   APP SHELL
   ════════════════════════════════════════════════════════════════════ */
function AppShell() {
  const { tab } = useApp()
  const CONTENT = [<HomeTab/>, <LearnTab/>, <GoalsTab/>, <TrackTab/>, <MeTab/>]

  return (
    <div style={{ height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden" }}>
      {/* Top bar */}
      <header style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 20px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"relative",zIndex:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:18 }}>🚀</span>
          <span style={{ color:T.teal,fontSize:12,fontWeight:800,letterSpacing:2.5 }}>LIFESMART</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <XPBadge/>
        </div>
      </header>

      {/* Tab content */}
      <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0 }}>
        {CONTENT[tab]}
      </div>

      <BottomNav/>
    </div>
  )
}

function XPBadge() {
  const { state } = useApp()
  const xp  = state.profile.points||0
  const lvl = getLevelInfo(xp)
  return (
    <div style={{ display:"flex",alignItems:"center",gap:6,background:T.card,border:`1px solid ${T.border}`,borderRadius:99,padding:"4px 12px" }}>
      <span style={{ fontSize:13 }}>{lvl.emoji}</span>
      <span style={{ color:T.teal,fontWeight:800,fontSize:12 }}>{xp} XP</span>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   ROUTER + EXPORT
   ════════════════════════════════════════════════════════════════════ */
function Router() {
  const { state } = useApp()
  if(state.profile.onboardingComplete) return <AppShell/>
  return <Onboarding/>
}

export default function App() {
  return (
    <AppProvider>
      <Router/>
    </AppProvider>
  )
}
