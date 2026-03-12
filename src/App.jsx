import { useState, useEffect, useContext, createContext, useMemo, useRef } from "react"
import { Home, BookOpen, User, Check, X, ChevronLeft, ChevronRight, Pencil, Trash2, Plus, Star, Sparkles, TrendingUp, Shield, Lock, LayoutDashboard, Zap, Target } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

/* ══════════════════════════════════════════════════════════════════════════
   GLOBAL CSS — Space / journey theme
   ══════════════════════════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',system-ui,sans-serif;background:#070D1A;-webkit-font-smoothing:antialiased}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type=number]{-moz-appearance:textfield}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1C2D47;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0) rotate(-10deg)}50%{transform:translateY(-16px) rotate(-10deg)}}
@keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.9;transform:scale(1.5)}}
@keyframes slideIn{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(15,191,184,.4)}70%{box-shadow:0 0 0 10px rgba(15,191,184,0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes spin{to{transform:rotate(360deg)}}
.ls-float{animation:float 4s ease-in-out infinite}
.ls-star{animation:twinkle var(--d,2s) ease-in-out var(--dl,0s) infinite}
.ls-fadein{animation:fadeUp .5s ease-out forwards}
.ls-slidein{animation:slideIn .35s ease-out forwards}
.ls-pulse{animation:pulse 2.5s ease-in-out infinite}
.ls-shimmer{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.06) 50%,transparent 100%);background-size:200% 100%;animation:shimmer 2s linear infinite}
`

/* ══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ══════════════════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════════════════
   JOURNEY PROFILES — 5 emotional archetypes each with a 3-card story
   ══════════════════════════════════════════════════════════════════════════ */
const JOURNEYS = [
  {
    id:"starter", character:"Maya", age:23, emoji:"🌱", title:"The Fresh Starter",
    hook:"Starting out — I want to get money right from day one",
    sub:"Student debt or first job. Nobody taught you this stuff. That changes now.",
    color:"#10B981", dim:"rgba(16,185,129,.12)", border:"rgba(16,185,129,.3)",
    story:[
      { tag:"Maya's story", headline:"Maya was 18 months into her career and leaving free money behind every single day.",
        body:"She had £1,800 in savings and felt okay about money. Not great, not terrible. Then a friend asked about her workplace pension. Maya hadn't set one up. She didn't even know she was supposed to.",
        vibe:"Sound like you?" },
      { tag:"The reveal", headline:"Her employer was handing out £1,350 a year. She didn't know to take it.",
        body:"Maya's company would match up to 5% of her salary. Over 18 months she'd left £2,025 unclaimed — gone, unrecoverable, not even mentioned in her onboarding. Not her fault. Just no one told her.",
        stat:"£2,025", statLabel:"Left behind in 18 months of free employer money" },
      { tag:"What changed", headline:"She fixed it in one afternoon. Her pension is now her most powerful asset.",
        body:"Maya set up the pension and redirected £113/month. With employer matching, that becomes £196,000 by 65. Without it? £98,000. Same money. Double the outcome. The only difference was knowing where to look.",
        cta:true }
    ],
    lessonsFirst:["compound_interest","isa_basics","pension_basics"]
  },
  {
    id:"climber", character:"Jordan", age:31, emoji:"🚀", title:"The Ambitious Climber",
    hook:"Decent income but somehow it just disappears",
    sub:"You're earning well. But the month ends and you're not sure where it all went.",
    color:"#3B82F6", dim:"rgba(59,130,246,.12)", border:"rgba(59,130,246,.3)",
    story:[
      { tag:"Jordan's story", headline:"Jordan earned £52,000 and finished every month with £200 to spare. Sometimes less.",
        body:"Not through recklessness — through drift. No big splurges. Just a thousand small decisions that quietly added up to a lifestyle costing almost exactly what he earned. He was ambitious. He just couldn't see the leak.",
        vibe:"Sound familiar?" },
      { tag:"The reveal", headline:"He tracked it for the first time. The results changed how he thought about money.",
        body:"Subscriptions he'd forgotten: £94/mo. Eating out: £340/mo. His car — insurance, fuel, finance — £680/mo all-in. None of it felt excessive. Until he added it up. His lifestyle had inflated to perfectly match his income.",
        stat:"£1,114/mo", statLabel:"Going out the door without Jordan noticing" },
      { tag:"What changed", headline:"He redirected £800/month. Three years later: £34,000 invested and compounding.",
        body:"Jordan still eats well. Still has the car. He just made intentional choices. Every month £800 went into a Stocks & Shares ISA before he could spend it. That's £34k today at 8% growth — and climbing. Let's look at your picture.",
        cta:true }
    ],
    lessonsFirst:["50_30_20","dca_investing","isa_basics"]
  },
  {
    id:"fighter", character:"Sam", age:29, emoji:"⚔️", title:"The Debt Fighter",
    hook:"Fed up with debt holding me back from the life I want",
    sub:"You work hard. But it feels like you're paying for yesterday's decisions.",
    color:"#F87171", dim:"rgba(248,113,113,.12)", border:"rgba(248,113,113,.3)",
    story:[
      { tag:"Sam's story", headline:"Sam had £4,200 on credit cards. It had been roughly the same for two years.",
        body:"She paid the minimum every month. The balance barely moved. She told herself she'd deal with it properly 'soon.' She didn't quite realise the debt was charging her an entry fee — every single month.",
        vibe:"Know the feeling?" },
      { tag:"The reveal", headline:"That 'small' debt was quietly costing her £1,008 a year. Just in interest.",
        body:"At 24% APR, £4,200 in credit card debt costs £84/month — just for the privilege of owing money. Over two years Sam paid £2,880 in minimums and still owed £3,900. She was paying to stay in debt, not to get out of it.",
        stat:"£84/mo", statLabel:"The silent monthly charge on Sam's credit card balance" },
      { tag:"What changed", headline:"She cleared it in 14 months. Then redirected every penny she'd been paying.",
        body:"Sam added £200/month on top of the minimum. Debt gone in 14 months. She saved £890 in interest. Then the £320/month she'd been paying went straight into savings. Her net worth improved faster than she'd ever expected.",
        cta:true }
    ],
    lessonsFirst:["good_bad_debt","avalanche_snowball","savings_accounts"]
  },
  {
    id:"builder", character:"Priya", age:37, emoji:"🏗️", title:"The Wealth Builder",
    hook:"I have assets — I just want to make sure they're working hard enough",
    sub:"Homeowner. Pension building. But is it actually enough? That's the question.",
    color:"#A78BFA", dim:"rgba(167,139,250,.12)", border:"rgba(167,139,250,.3)",
    story:[
      { tag:"Priya's story", headline:"Priya's net worth was over £300,000. She still felt uncertain if she was on track.",
        body:"Homeowner at 36. Growing pension. £12k in a cash ISA. On paper she'd done well. But there was a nagging question: is this actually enough? Is her money working as hard as she is?",
        vibe:"Is this you?" },
      { tag:"The reveal", headline:"87% of her wealth was sitting in her home — and wasn't growing.",
        body:"Priya broke her net worth down for the first time. Property: £270k. Pension: £28k. ISA: £12k. Her home was almost everything. Good to own — but it doesn't compound, doesn't pay income, and can't be touched without moving. Her financial engine was tiny.",
        stat:"£40k", statLabel:"Priya's actual working wealth — vs £270k sitting in property" },
      { tag:"What changed", headline:"She moved £400/month into a Stocks & Shares ISA. Five years later it's worth £31,000.",
        body:"Same income. Same home. Same life. Just a reallocation of where her money grew. Priya's working wealth tripled in five years. The question was never whether she was doing well. It was whether her money was. Let's look at yours.",
        cta:true }
    ],
    lessonsFirst:["isa_basics","dca_investing","uk_tax"]
  },
  {
    id:"seeker", character:"Alex", age:35, emoji:"🔥", title:"The Freedom Seeker",
    hook:"I want to build towards financial independence — on my terms",
    sub:"Not necessarily retire. Just reach the point where you choose — not have to.",
    color:"#F59E0B", dim:"rgba(245,158,11,.12)", border:"rgba(245,158,11,.3)",
    story:[
      { tag:"Alex's story", headline:"Alex had one goal: be financially free before 50. He just didn't have the number.",
        body:"He earned well. Had investments. Thought about this constantly. But he didn't have THE number — the actual amount he needed to reach freedom. The goal was vivid. The maths was murky.",
        vibe:"Is this your goal?" },
      { tag:"The reveal", headline:"The FIRE number is simpler than most people think. It's 25 times your annual spending.",
        body:"If Alex spends £32,000/year, he needs £800,000 invested. At that point, a 4% withdrawal rate covers his spending indefinitely. Alex is 37 with £180k invested. Adding £2k/month, he hits £800k at age 49.",
        stat:"25×", statLabel:"Your annual spending = your financial freedom number" },
      { tag:"What changed", headline:"He put the number on his fridge. Not as a fantasy — as a deadline.",
        body:"Every ISA contribution, every salary increase redirected to investments, got him closer to that number. The goal didn't change. It just got a timeline. And timelines change behaviour. Let's calculate yours.",
        cta:true }
    ],
    lessonsFirst:["nw_basics","dca_investing","pension_basics"]
  }
]

/* ══════════════════════════════════════════════════════════════════════════
   ASSET & DEBT TYPE DEFINITIONS
   ══════════════════════════════════════════════════════════════════════════ */
const ASSET_TYPES = [
  { id:"property",    label:"Property",     icon:"🏠", cat:"primary_residence", desc:"Home, flat, land",         bucket:"life"    },
  { id:"savings",     label:"Savings",      icon:"💰", cat:"savings",           desc:"Cash, ISA, current acct",  bucket:"safety"  },
  { id:"pension",     label:"Pension",      icon:"🏛️", cat:"pension",           desc:"Workplace or personal",    bucket:"wealth"  },
  { id:"investments", label:"Investments",  icon:"📈", cat:"investments",       desc:"Stocks, funds, S&S ISA",   bucket:"wealth"  },
  { id:"vehicle",     label:"Vehicle",      icon:"🚗", cat:"vehicle",           desc:"Car, motorbike",            bucket:"life"    },
  { id:"gold",        label:"Gold / Crypto",icon:"✨", cat:"other",             desc:"Precious metals, crypto",   bucket:"wealth"  },
  { id:"business",    label:"Business",     icon:"💼", cat:"business",          desc:"Business equity / assets",  bucket:"wealth"  },
  { id:"other",       label:"Other",        icon:"📦", cat:"other",             desc:"Art, collectibles, other",  bucket:"life"    },
]

const DEBT_TYPES = [
  { id:"mortgage",    label:"Mortgage",         icon:"🏠", cat:"mortgage",      assumedRate:4.5,  desc:"Home loan" },
  { id:"student",     label:"Student Loan",     icon:"🎓", cat:"student_loan",  assumedRate:7.3,  desc:"Plan 1, 2, or 5" },
  { id:"credit_card", label:"Credit Cards",     icon:"💳", cat:"credit_card",   assumedRate:24.0, desc:"Balance you're carrying" },
  { id:"car_finance", label:"Car Finance",      icon:"🚗", cat:"car_loan",      assumedRate:9.0,  desc:"PCP or HP agreement" },
  { id:"personal",    label:"Personal Loan",    icon:"👤", cat:"personal_loan", assumedRate:11.0, desc:"Bank or P2P loan" },
  { id:"bnpl",        label:"Buy Now Pay Later",icon:"🛍️", cat:"personal_loan", assumedRate:29.0, desc:"Klarna, Laybuy etc." },
  { id:"other_debt",  label:"Other Debt",       icon:"📦", cat:"personal_loan", assumedRate:15.0, desc:"Overdraft, other" },
]

/* ══════════════════════════════════════════════════════════════════════════
   GOAL TYPES & ACTIONS
   ══════════════════════════════════════════════════════════════════════════ */
const GOAL_TYPES = [
  { id:"emergency",   label:"Emergency fund",   icon:"🛡️", color:T.teal,   dim:T.tealDim,   border:T.tealBorder },
  { id:"home",        label:"Buy a home",        icon:"🏠", color:T.blue,   dim:T.blueDim,   border:T.blueBorder },
  { id:"holiday",     label:"Holiday",           icon:"✈️", color:T.amber,  dim:T.amberDim,  border:T.amberBorder },
  { id:"invest",      label:"Start investing",   icon:"📈", color:T.purple, dim:T.purpleDim, border:T.purpleBorder },
  { id:"retirement",  label:"Retirement pot",    icon:"🏖️", color:T.green,  dim:T.greenDim,  border:"rgba(52,211,153,.3)" },
  { id:"debt",        label:"Clear debt",        icon:"💳", color:T.red,    dim:T.redDim,    border:T.redBorder },
  { id:"education",   label:"Education",         icon:"📚", color:"#60A5FA",dim:T.blueDim,   border:T.blueBorder },
  { id:"other_goal",  label:"Something else",    icon:"⭐", color:T.muted,  dim:T.faint,     border:T.border },
]

const ACTION_GOALS = new Set(["invest","retirement"])

const GOAL_ACTIONS = {
  invest:[
    { id:"open_isa",    label:"Open a Stocks & Shares ISA",   desc:"The most tax-efficient way to invest in the UK. No CGT, no income tax on returns.", lessonId:"isa_basics" },
    { id:"choose_fund", label:"Choose a low-cost index fund",  desc:"A global tracker fund gives you exposure to thousands of companies at minimal cost.", lessonId:"dca_investing" },
    { id:"set_dd",      label:"Set up a monthly direct debit", desc:"Automating your investment removes willpower from the equation.", lessonId:"dca_investing" },
    { id:"dca_habit",   label:"Stick to it for 3 months",     desc:"The habit is the hard part. After 90 days, it becomes background noise.", lessonId:"compound_interest" },
  ],
  retirement:[
    { id:"check_pension",     label:"Find your current pension value",    desc:"Log into your pension provider's app or get your latest statement.", lessonId:"pension_basics" },
    { id:"increase_contrib",  label:"Increase your contribution by 1%",   desc:"Even a 1% increase makes a significant difference over decades.", lessonId:"pension_basics" },
    { id:"employer_match",    label:"Check your employer match limit",    desc:"Many employers match more than the default. Are you claiming it all?", lessonId:"pension_basics" },
    { id:"fire_number",       label:"Calculate your retirement number",   desc:"25× your annual spending = the amount you need invested to retire.", lessonId:"nw_basics" },
  ]
}

/* ══════════════════════════════════════════════════════════════════════════
   XP LEVELS & BADGES
   ══════════════════════════════════════════════════════════════════════════ */
const XP_LEVELS = [
  { level:1, label:"Newcomer",  min:0,   emoji:"🌱" },
  { level:2, label:"Explorer",  min:50,  emoji:"🧭" },
  { level:3, label:"Builder",   min:120, emoji:"🏗️" },
  { level:4, label:"Grower",    min:220, emoji:"🌿" },
  { level:5, label:"Achiever",  min:360, emoji:"⭐" },
  { level:6, label:"Free",      min:550, emoji:"🔥" },
]

const BADGES = [
  { id:"first_lesson",   emoji:"📖", label:"First lesson",          desc:"Completed your first lesson",            condition: s => (s.completedLessons||[]).length >= 1 },
  { id:"five_lessons",   emoji:"🎓", label:"Five lessons",           desc:"Completed 5 lessons",                    condition: s => (s.completedLessons||[]).length >= 5 },
  { id:"all_lessons",    emoji:"🏆", label:"Graduate",               desc:"Completed all lessons",                   condition: s => (s.completedLessons||[]).length >= 14 },
  { id:"first_goal",     emoji:"🎯", label:"Goal setter",            desc:"Created your first goal",                condition: s => (s.goals||[]).length >= 1 },
  { id:"three_goals",    emoji:"🚀", label:"Ambitious",              desc:"3 goals created",                        condition: s => (s.goals||[]).length >= 3 },
  { id:"net_worth_pos",  emoji:"💚", label:"In the green",           desc:"Positive net worth",                     condition: s => { const { netWorth } = calcTotals(s.assets||[],s.debts||[]); return netWorth > 0 } },
  { id:"has_investment", emoji:"📈", label:"Investor",               desc:"Have an investment asset",               condition: s => (s.assets||[]).some(a=>a.category==="investments") },
  { id:"has_pension",    emoji:"🏛️", label:"Pension holder",         desc:"Have a pension asset",                   condition: s => (s.assets||[]).some(a=>a.category==="pension") },
  { id:"three_assets",   emoji:"🏦", label:"Asset collector",        desc:"3 or more assets tracked",              condition: s => (s.assets||[]).length >= 3 },
  { id:"streak_3",       emoji:"🔥", label:"3-week streak",          desc:"Checked in 3 weeks in a row",            condition: s => (s.profile?.streakWeeks||0) >= 3 },
]

/* ══════════════════════════════════════════════════════════════════════════
   DEFAULTS & STORAGE
   ══════════════════════════════════════════════════════════════════════════ */
const DEFAULTS = {
  profile: { name:"", age:null, journeyId:null, onboardingComplete:false, points:0, streakWeeks:0, lastCheckIn:null },
  assets:[], debts:[],
  income: { primary:0, primarySource:"Salary", additional:[] },
  spending: { monthly:0, breakdown:{} },
  goals:[], history:[], completedLessons:[], badges:[]
}

const load = () => { try { const s=localStorage.getItem("ls_v1"); return s?{...DEFAULTS,...JSON.parse(s)}:DEFAULTS } catch { return DEFAULTS } }

/* ══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════════════════ */
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

const calcProjection = (nw, surplus, currentAge) => {
  const age = currentAge||35
  const months = Math.max((70-age)*12,12)
  const data=[]; let con=nw,bal=nw,amb=nw
  for(let m=0;m<=months;m++){
    if(m>0){ const s=Math.max(0,surplus); con+=s*.5+con*(0.04/12); bal+=s*1.0+bal*(0.07/12); amb+=s*1.2+amb*(0.10/12) }
    if(m%12===0) data.push({ age:age+m/12, conservative:Math.round(con), balanced:Math.round(bal), ambitious:Math.round(amb) })
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

/* ══════════════════════════════════════════════════════════════════════════
   CONTEXT & PROVIDER
   ══════════════════════════════════════════════════════════════════════════ */
const Ctx = createContext(null)

function AppProvider({ children }) {
  const [state,_set] = useState(load)
  const [tab,setTab] = useState(0)
  const [toastMsg,_toast] = useState(null)
  const timer = useRef(null)
  const save = ns => { _set(ns); localStorage.setItem("ls_v1",JSON.stringify(ns)) }
  const reset = () => { localStorage.removeItem("ls_v1"); _set(DEFAULTS) }
  const showToast = msg => { _toast(msg); clearTimeout(timer.current); timer.current=setTimeout(()=>_toast(null),2600) }
  return (
    <Ctx.Provider value={{ state, save, reset, tab, setTab, toast:showToast }}>
      <style>{G}</style>
      {children}
      {toastMsg && (
        <div style={{ position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,
          background:T.card,color:T.white,fontSize:14,fontWeight:700,padding:"10px 22px",
          borderRadius:999,border:`1px solid ${T.borderLight}`,whiteSpace:"nowrap",
          animation:"fadeUp .25s ease-out",boxShadow:"0 8px 40px rgba(0,0,0,.6)",pointerEvents:"none" }}>
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  )
}
const useApp = () => useContext(Ctx)

/* ══════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */
function Btn({ children, onClick, variant="primary", disabled=false, small=false, style:sx={} }) {
  const base = { padding:small?"9px 18px":"13px 22px",borderRadius:12,fontSize:small?13:15,fontWeight:700,
    cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,transition:"all .15s",width:"100%",fontFamily:"inherit" }
  const vs = {
    primary:  { background:`linear-gradient(135deg,${T.teal} 0%,${T.tealMid} 100%)`,color:"#fff",border:"none",boxShadow:`0 4px 20px rgba(15,191,184,.25)` },
    secondary:{ background:"transparent",color:T.muted,border:`1.5px solid ${T.border}` },
    ghost:    { background:"transparent",color:T.teal,border:"none" },
    danger:   { background:"transparent",color:T.red,border:`1.5px solid ${T.redBorder}` },
    journey:  { background:"transparent",color:T.white,border:`1.5px solid ${T.borderLight}` },
  }
  return <button disabled={disabled} onClick={onClick} style={{...base,...vs[variant],...sx}}>{children}</button>
}

function Input({ label, value, onChange, placeholder, type="text", helper }) {
  return (
    <label style={{ display:"flex",flexDirection:"column",gap:6 }}>
      {label && <span style={{ fontSize:12,color:T.muted,fontWeight:700,letterSpacing:.4,textTransform:"uppercase" }}>{label}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"13px 16px",color:T.white,fontSize:15,outline:"none",fontFamily:"inherit",transition:"border-color .15s",width:"100%" }}
        onFocus={e=>e.target.style.borderColor=T.teal} onBlur={e=>e.target.style.borderColor=T.border}/>
      {helper && <span style={{ fontSize:11,color:T.muted }}>{helper}</span>}
    </label>
  )
}

function CurrencyInput({ label, value, onChange, helper, placeholder="0" }) {
  const [raw,setRaw] = useState(value>0?String(value):"")
  useEffect(()=>{ if(value===0&&raw!=="") {} },[value])
  return (
    <label style={{ display:"flex",flexDirection:"column",gap:6 }}>
      {label && <span style={{ fontSize:12,color:T.muted,fontWeight:700,letterSpacing:.4,textTransform:"uppercase" }}>{label}</span>}
      <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden",transition:"border-color .15s" }}
        onFocus={e=>e.currentTarget.style.borderColor=T.teal} onBlur={e=>e.currentTarget.style.borderColor=T.border} tabIndex={-1}>
        <span style={{ padding:"0 14px",color:T.muted,fontSize:20,fontWeight:700,userSelect:"none",flexShrink:0 }}>£</span>
        <input type="number" min="0" value={raw} placeholder={placeholder}
          onChange={e=>{ setRaw(e.target.value); onChange(e.target.value===""?0:Math.max(0,parseFloat(e.target.value)||0)) }}
          style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:16,fontWeight:600,padding:"13px 14px 13px 0",fontVariantNumeric:"tabular-nums",fontFamily:"inherit" }}/>
      </div>
      {helper && <span style={{ fontSize:11,color:T.muted }}>{helper}</span>}
    </label>
  )
}

function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:T.surface,borderRadius:"20px 20px 0 0",padding:"28px 24px 40px",width:"100%",maxWidth:620,maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s ease-out" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22 }}>
          <h2 style={{ color:T.white,fontSize:18,fontWeight:800 }}>{title}</h2>
          <button onClick={onClose} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"7px 10px",cursor:"pointer",color:T.muted,display:"flex" }}><X size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FloatingAdd({ onClick, label="Add" }) {
  return (
    <button onClick={onClick} style={{ position:"fixed",bottom:88,right:20,zIndex:100,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 24px rgba(15,191,184,.4)` }}>
      <Plus size={22} color="#fff"/>
    </button>
  )
}

/* Star field component — deterministic so no re-render flash */
function StarField({ count=40, style:sx={} }) {
  const stars = useMemo(()=>Array.from({length:count},(_,i)=>({
    x:((i*137.508)%100), y:((i*97.412)%100),
    size:1+(i%3)*.5, dur:`${1.5+(i%4)*.5}s`, dl:`${(i*.2)%3}s`, op:.1+((i%5)*.07)
  })),[count])
  return (
    <div style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",...sx }}>
      {stars.map((s,i)=>(
        <div key={i} className="ls-star" style={{ "--d":s.dur,"--dl":s.dl,position:"absolute",
          left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",
          background:"#fff",opacity:s.op }}/>
      ))}
    </div>
  )
}

/* Small tag chip */
function Chip({ children, color=T.teal, dim=T.tealDim, border=T.tealBorder }) {
  return <span style={{ fontSize:11,fontWeight:700,color,background:dim,border:`1px solid ${border}`,padding:"3px 10px",borderRadius:99 }}>{children}</span>
}

/* Locked insight card */
function LockedCard({ icon, title, description, unlock, onUnlock }) {
  return (
    <div style={{ background:T.card,border:`1.5px dashed ${T.border}`,borderRadius:18,padding:"22px",position:"relative",overflow:"hidden" }}>
      <div className="ls-shimmer" style={{ position:"absolute",inset:0,borderRadius:18 }}/>
      <div style={{ position:"relative",display:"flex",alignItems:"flex-start",gap:14 }}>
        <div style={{ width:42,height:42,borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20 }}>
          {icon}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
            <p style={{ color:T.muted,fontWeight:700,fontSize:14 }}>{title}</p>
            <Lock size={12} color={T.subtle}/>
          </div>
          <p style={{ color:T.subtle,fontSize:12,lineHeight:1.5,marginBottom:12 }}>{description}</p>
          {onUnlock && <button onClick={onUnlock} style={{ background:"transparent",border:`1.5px solid ${T.border}`,borderRadius:9,padding:"6px 14px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>{unlock}</button>}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   ONBOARDING — Welcome → Journey → Story → Assets → Debts → Income → Wow
   ══════════════════════════════════════════════════════════════════════════ */
const HOOKS = [
  "When could you stop working — if you wanted to?",
  "Is your money working as hard as you are?",
  "What would it take to retire 10 years early?",
  "Do you know your financial freedom number?",
  "Are you building wealth, or just earning money?",
]

function Onboarding() {
  const { state, save } = useApp()
  const [screen,  setScreen]  = useState("welcome")
  const [journey, setJourney] = useState(null)
  const [storyIdx,setStoryIdx]= useState(0)
  const [assets,  setAssets]  = useState({})   // { assetTypeId: value }
  const [debts,   setDebts]   = useState({})   // { debtTypeId: value }
  const [income,  setIncome]  = useState(state.income.primary||0)
  const [name,    setName]    = useState(state.profile.name||"")
  const [age,     setAge]     = useState(state.profile.age||"")

  function finishOnboarding() {
    const newAssets = Object.entries(assets).filter(([,v])=>v>0).map(([typeId,val])=>{
      const t = ASSET_TYPES.find(a=>a.id===typeId)
      return { id:`a_${typeId}`,category:t.cat,name:t.label,value:val,monthlyIncome:0,linkedDebtId:null }
    })
    const newDebts = Object.entries(debts).filter(([,v])=>v>0).map(([typeId,bal])=>{
      const t = DEBT_TYPES.find(d=>d.id===typeId)
      return { id:`d_${typeId}`,category:t.cat,name:t.label,balance:bal,interestRate:t.assumedRate,linkedAssetId:null,isAutoCreated:false }
    })
    const ns = {
      ...state,
      profile:{ ...state.profile, name:name||"Friend", age:parseInt(age)||null, journeyId:journey?.id, onboardingComplete:true, points:20, lastCheckIn:new Date().toISOString() },
      assets: newAssets, debts: newDebts,
      income: { ...state.income, primary:income },
    }
    save(ns)
  }

  if(screen==="welcome")  return <WelcomeScreen onNext={()=>setScreen("journey")} />
  if(screen==="journey")  return <JourneySelectScreen onNext={j=>{ setJourney(j); setStoryIdx(0); setScreen("story") }} onBack={()=>setScreen("welcome")} />
  if(screen==="story")    return <StoryScreen journey={journey} idx={storyIdx} onNext={()=>{ if(storyIdx<2) setStoryIdx(i=>i+1); else setScreen("about") }} onBack={()=>{ if(storyIdx>0) setStoryIdx(i=>i-1); else setScreen("journey") }} />
  if(screen==="about")    return <AboutScreen name={name} setName={setName} age={age} setAge={setAge} onNext={()=>setScreen("assets")} onBack={()=>setScreen("story")} />
  if(screen==="assets")   return <AssetChecklistScreen values={assets} setValues={setAssets} onNext={()=>setScreen("debts")} onBack={()=>setScreen("about")} />
  if(screen==="debts")    return <DebtChecklistScreen values={debts} setValues={setDebts} onNext={()=>setScreen("income")} onBack={()=>setScreen("assets")} />
  if(screen==="income")   return <IncomeScreen income={income} setIncome={setIncome} onNext={()=>setScreen("wow")} onBack={()=>setScreen("debts")} />
  if(screen==="wow")      return <WowScreen assets={assets} debts={debts} income={income} journey={journey} name={name} onFinish={finishOnboarding} />
  return null
}

/* ── Welcome ──────────────────────────────────────────────────────────────── */
function WelcomeScreen({ onNext }) {
  const [hookIdx, setHookIdx] = useState(0)
  useEffect(()=>{ const t=setInterval(()=>setHookIdx(i=>(i+1)%HOOKS.length),2800); return ()=>clearInterval(t) },[])
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",position:"relative",overflow:"hidden" }}>
      <StarField count={55}/>
      {/* Gradient nebula blobs */}
      <div style={{ position:"absolute",top:-80,right:-60,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(15,191,184,.12) 0%,transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:-60,left:-80,width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%)",pointerEvents:"none" }}/>

      <div style={{ position:"relative",textAlign:"center",maxWidth:440 }}>
        {/* Rocket */}
        <div className="ls-float" style={{ fontSize:72,marginBottom:32,display:"inline-block" }}>🚀</div>

        {/* Brand */}
        <div style={{ marginBottom:8 }}>
          <span style={{ fontSize:12,fontWeight:700,letterSpacing:3,color:T.teal,textTransform:"uppercase" }}>LifeSmart</span>
        </div>

        {/* Rotating question */}
        <div style={{ minHeight:72,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <h1 key={hookIdx} className="ls-fadein" style={{ fontSize:"clamp(22px,5vw,30px)",fontWeight:900,color:T.white,lineHeight:1.25 }}>
            {HOOKS[hookIdx]}
          </h1>
        </div>

        <p style={{ color:T.muted,fontSize:15,lineHeight:1.7,marginBottom:40 }}>
          Your financial picture, clearly. Built in 3 minutes.
        </p>

        <Btn onClick={onNext} style={{ fontSize:17,padding:"16px 32px" }}>
          Begin my journey →
        </Btn>

        <p style={{ color:T.subtle,fontSize:12,marginTop:20 }}>🔒 Your data stays on your device. No account needed.</p>
      </div>
    </div>
  )
}

/* ── Journey Select ───────────────────────────────────────────────────────── */
function JourneySelectScreen({ onNext, onBack }) {
  const [selected, setSelected] = useState(null)
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",padding:"0 0 40px" }}>
      <StarField count={30}/>
      <div style={{ position:"relative",flex:1,overflowY:"auto",padding:"48px 22px 20px",maxWidth:520,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>Your journey</p>
        <h2 style={{ color:T.white,fontSize:"clamp(22px,5vw,28px)",fontWeight:900,marginBottom:6,lineHeight:1.2 }}>Which sounds most like you right now?</h2>
        <p style={{ color:T.muted,fontSize:14,marginBottom:28,lineHeight:1.6 }}>Be honest — this shapes everything that follows.</p>

        <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:28 }}>
          {JOURNEYS.map(j=>{
            const sel = selected?.id===j.id
            return (
              <button key={j.id} onClick={()=>setSelected(j)} style={{
                background:sel?j.dim:T.card,border:`2px solid ${sel?j.color:T.border}`,borderRadius:18,
                padding:"18px 20px",cursor:"pointer",transition:"all .2s",textAlign:"left",fontFamily:"inherit",width:"100%" }}>
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{ width:48,height:48,borderRadius:14,background:sel?j.dim:`rgba(255,255,255,.04)`,
                    border:`2px solid ${sel?j.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:22,flexShrink:0,transition:"all .2s",boxShadow:sel?`0 0 20px ${j.color}40`:undefined }}>
                    {j.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:sel?j.color:T.white,fontWeight:800,fontSize:15,marginBottom:3 }}>{j.title}</p>
                    <p style={{ color:sel?T.white:T.muted,fontSize:13,lineHeight:1.4 }}>{j.hook}</p>
                  </div>
                  {sel && <Check size={18} color={j.color} style={{ flexShrink:0 }}/>}
                </div>
              </button>
            )
          })}
        </div>

        <Btn onClick={()=>selected&&onNext(selected)} disabled={!selected}>
          {selected ? `Start as ${selected.character} →` : "Pick one to continue"}
        </Btn>
      </div>
    </div>
  )
}

/* ── Story Cards ──────────────────────────────────────────────────────────── */
function StoryScreen({ journey, idx, onNext, onBack }) {
  const card = journey.story[idx]
  const color = journey.color
  return (
    <div key={`${journey.id}-${idx}`} style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden" }}>
      <StarField count={25}/>
      {/* Top gradient */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:220,background:`linear-gradient(180deg,${color}22 0%,transparent 100%)`,pointerEvents:"none" }}/>

      <div className="ls-fadein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 24px 32px",maxWidth:520,margin:"0 auto",width:"100%" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>

        {/* Progress dots */}
        <div style={{ display:"flex",gap:6,marginBottom:32 }}>
          {journey.story.map((_,i)=>(
            <div key={i} style={{ flex:1,height:4,borderRadius:2,background:i<=idx?color:T.border,transition:"background .4s" }}/>
          ))}
        </div>

        {/* Character avatar */}
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
          <div style={{ width:54,height:54,borderRadius:16,background:journey.dim,border:`2px solid ${color}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
            boxShadow:`0 0 24px ${color}40` }}>
            {journey.emoji}
          </div>
          <div>
            <p style={{ color,fontWeight:800,fontSize:13,letterSpacing:.5 }}>{card.tag}</p>
            <p style={{ color:T.muted,fontSize:12 }}>{journey.character}'s story</p>
          </div>
        </div>

        {/* Card content */}
        <h2 style={{ color:T.white,fontSize:"clamp(18px,4vw,24px)",fontWeight:900,lineHeight:1.3,marginBottom:16 }}>
          {card.headline}
        </h2>
        <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.75,marginBottom:card.stat?28:0 }}>
          {card.body}
        </p>

        {/* Big stat */}
        {card.stat && (
          <div style={{ background:journey.dim,border:`1.5px solid ${color}40`,borderRadius:16,padding:"20px 22px",marginBottom:12 }}>
            <p style={{ color,fontWeight:900,fontSize:36,lineHeight:1 }}>{card.stat}</p>
            <p style={{ color:T.muted,fontSize:13,marginTop:4 }}>{card.statLabel}</p>
          </div>
        )}

        {/* "sound like you?" callout */}
        {card.vibe && (
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",marginTop:20,marginBottom:0 }}>
            <p style={{ color:T.muted,fontSize:13,fontStyle:"italic" }}>💭 {card.vibe}</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ position:"relative",padding:"16px 24px 32px",maxWidth:520,margin:"0 auto",width:"100%" }}>
        <Btn onClick={onNext}>
          {card.cta ? `Build my picture →` : idx===0 ? "Show me what happened →" : "And then? →"}
        </Btn>
      </div>
    </div>
  )
}

/* ── About (name + age) ───────────────────────────────────────────────────── */
function AboutScreen({ name, setName, age, setAge, onNext, onBack }) {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={20}/>
      <div style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 24px 32px",maxWidth:520,margin:"0 auto",width:"100%" }} className="ls-fadein">
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>
        <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>Quick intro</p>
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:6,lineHeight:1.2 }}>Let's make this personal</h2>
        <p style={{ color:T.muted,fontSize:14,marginBottom:32,lineHeight:1.6 }}>Just two quick things — we use your age to benchmark your progress.</p>
        <div style={{ display:"flex",flexDirection:"column",gap:18,marginBottom:32 }}>
          <Input label="Your first name" value={name} onChange={setName} placeholder="e.g. Jamie"/>
          <Input label="Your age" type="number" value={age} onChange={setAge} placeholder="e.g. 29" min="16" max="80"/>
        </div>
        <Btn onClick={onNext} disabled={!name||!age}>Let's build my picture →</Btn>
      </div>
    </div>
  )
}

/* ── Asset Checklist ──────────────────────────────────────────────────────── */
function AssetChecklistScreen({ values, setValues, onNext, onBack }) {
  const hasAny = Object.values(values).some(v=>v>0)
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={20}/>
      <div style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 22px 20px",maxWidth:540,margin:"0 auto",width:"100%" }} className="ls-fadein">
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>
        <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>Your assets</p>
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:6,lineHeight:1.2 }}>What do you own?</h2>
        <p style={{ color:T.muted,fontSize:14,marginBottom:28,lineHeight:1.6 }}>Tap each one you have. Rough estimates are completely fine — you can refine later.</p>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:28 }}>
          {ASSET_TYPES.map(t=>{
            const val = values[t.id]||0
            const sel = val > 0
            return (
              <AssetTypeCard key={t.id} type={t} value={val} selected={sel}
                onChange={v=>setValues(prev=>({...prev,[t.id]:v}))}/>
            )
          })}
        </div>

        <Btn onClick={onNext} disabled={!hasAny} style={{ marginBottom:8 }}>
          {hasAny ? "Continue to debts →" : "Tap an asset type above"}
        </Btn>
        {!hasAny && <button onClick={onNext} style={{ background:"none",border:"none",color:T.muted,fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip — I'll add later</button>}
      </div>
    </div>
  )
}

function AssetTypeCard({ type, value, selected, onChange }) {
  const [open, setOpen] = useState(selected)
  const [rawVal, setRawVal] = useState(value>0?String(value):"")

  function handleTap() {
    if(!open) { setOpen(true); return }
  }
  function handleChange(v) {
    const n = parseFloat(v)||0
    setRawVal(v)
    onChange(Math.max(0,n))
    if(n===0) { /* keep open */ }
  }
  function handleClose() {
    if(value===0) setOpen(false)
  }

  return (
    <div style={{ background:selected?`rgba(15,191,184,.07)`:T.card,border:`2px solid ${selected?T.teal:T.border}`,
      borderRadius:16,padding:"14px 14px",transition:"all .2s",cursor:!open?"pointer":"default" }}
      onClick={!open?handleTap:undefined}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:open?12:0 }}>
        <span style={{ fontSize:22 }}>{type.icon}</span>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:selected?T.teal:T.white,fontWeight:700,fontSize:13 }}>{type.label}</p>
          <p style={{ color:T.muted,fontSize:11,lineHeight:1.3 }}>{type.desc}</p>
        </div>
        {selected&&<Check size={14} color={T.teal} style={{ flexShrink:0 }}/>}
      </div>
      {open && (
        <div style={{ display:"flex",alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden" }}>
          <span style={{ padding:"0 10px",color:T.muted,fontSize:16,fontWeight:700,userSelect:"none" }}>£</span>
          <input type="number" min="0" value={rawVal} placeholder="0" autoFocus
            onChange={e=>handleChange(e.target.value)}
            onBlur={handleClose}
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"10px 10px 10px 0",fontFamily:"inherit",fontVariantNumeric:"tabular-nums" }}/>
        </div>
      )}
    </div>
  )
}

/* ── Debt Checklist ───────────────────────────────────────────────────────── */
function DebtChecklistScreen({ values, setValues, onNext, onBack }) {
  const hasAny = Object.values(values).some(v=>v>0)
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={20}/>
      <div style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 22px 20px",maxWidth:540,margin:"0 auto",width:"100%" }} className="ls-fadein">
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>
        <p style={{ fontSize:12,fontWeight:700,color:T.red,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>Your liabilities</p>
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:6,lineHeight:1.2 }}>What do you owe?</h2>
        <p style={{ color:T.muted,fontSize:14,marginBottom:8,lineHeight:1.6 }}>Tap each one that applies. We'll assume a typical interest rate — you can update it in Track later.</p>
        <div style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:10,padding:"9px 14px",marginBottom:24 }}>
          <p style={{ color:T.red,fontSize:12,fontWeight:600 }}>If you have no debt — great! Just tap Continue below.</p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:28 }}>
          {DEBT_TYPES.map(t=>{
            const val = values[t.id]||0
            const sel = val > 0
            return <DebtTypeCard key={t.id} type={t} value={val} selected={sel} onChange={v=>setValues(prev=>({...prev,[t.id]:v}))}/>
          })}
        </div>

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
    <div style={{ background:selected?T.redDim:T.card,border:`2px solid ${selected?T.red:T.border}`,borderRadius:16,padding:"14px 14px",transition:"all .2s",cursor:!open?"pointer":"default" }}
      onClick={!open?()=>setOpen(true):undefined}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:open?10:0 }}>
        <span style={{ fontSize:22 }}>{type.icon}</span>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:selected?T.red:T.white,fontWeight:700,fontSize:13 }}>{type.label}</p>
          <p style={{ color:T.muted,fontSize:11,lineHeight:1.3 }}>~{type.assumedRate}% APR</p>
        </div>
        {selected&&<Check size={14} color={T.red} style={{ flexShrink:0 }}/>}
      </div>
      {open && (
        <div style={{ display:"flex",alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden" }}>
          <span style={{ padding:"0 10px",color:T.muted,fontSize:16,fontWeight:700,userSelect:"none" }}>£</span>
          <input type="number" min="0" value={rawVal} placeholder="0" autoFocus
            onChange={e=>handleChange(e.target.value)}
            onBlur={()=>{ if(value===0) setOpen(false) }}
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"10px 10px 10px 0",fontFamily:"inherit",fontVariantNumeric:"tabular-nums" }}/>
        </div>
      )}
    </div>
  )
}

/* ── Income ───────────────────────────────────────────────────────────────── */
function IncomeScreen({ income, setIncome, onNext, onBack }) {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }}>
      <StarField count={20}/>
      <div style={{ position:"relative",flex:1,overflowY:"auto",padding:"52px 24px 32px",maxWidth:520,margin:"0 auto",width:"100%" }} className="ls-fadein">
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600,marginBottom:32,padding:0 }}>
          <ChevronLeft size={16}/> Back
        </button>
        <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>Almost there</p>
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:6,lineHeight:1.2 }}>What's your monthly take-home?</h2>
        <p style={{ color:T.muted,fontSize:14,marginBottom:32,lineHeight:1.6 }}>After tax. Your rough estimate is completely fine — this unlocks your surplus and safety net calculations.</p>

        <div style={{ marginBottom:32 }}>
          <CurrencyInput label="Monthly take-home pay" value={income} onChange={setIncome} placeholder="e.g. 2800"/>
        </div>

        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",marginBottom:28 }}>
          <p style={{ color:T.muted,fontSize:13,lineHeight:1.6 }}>💡 Not sure? Divide your annual salary by 12, then take off roughly 20–30% for tax and National Insurance.</p>
        </div>

        <Btn onClick={onNext} disabled={income<=0}>See my picture →</Btn>
      </div>
    </div>
  )
}

/* ── Wow Screen ───────────────────────────────────────────────────────────── */
function WowScreen({ assets, debts, income, journey, name, onFinish }) {
  const totalAssets = Object.values(assets).reduce((s,v)=>s+v,0)
  const totalDebts  = Object.values(debts).reduce((s,v)=>s+v,0)
  const netWorth    = totalAssets - totalDebts
  const nwPos       = netWorth >= 0
  const jColor      = journey?.color||T.teal

  const getMessage = () => {
    if(netWorth > 100000) return "You've built significant wealth. Now let's make sure it's working hard for you."
    if(netWorth > 10000)  return "A solid foundation. Here's how to build on it — fast."
    if(netWorth > 0)      return "You're in the green. Every step from here compounds."
    if(netWorth > -10000) return "Everyone starts somewhere. Here's your clear path forward."
    return "You're not behind — you just have more runway. Let's use it."
  }

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",position:"relative",overflow:"hidden" }}>
      <StarField count={50}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:280,background:`radial-gradient(ellipse at 50% 0%,${jColor}22 0%,transparent 70%)`,pointerEvents:"none" }}/>

      <div className="ls-fadein" style={{ position:"relative",textAlign:"center",maxWidth:440,width:"100%" }}>
        <div style={{ fontSize:56,marginBottom:20 }}>
          {nwPos ? "🎯" : "📊"}
        </div>

        <p style={{ fontSize:12,fontWeight:700,color:jColor,letterSpacing:2,textTransform:"uppercase",marginBottom:14 }}>
          {name ? `${name}'s financial picture` : "Your financial picture"}
        </p>

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:"clamp(44px,10vw,64px)",fontWeight:900,lineHeight:1,
            color:nwPos?T.teal:T.red, letterSpacing:-1,
            textShadow:nwPos?`0 0 60px ${T.teal}60`:`0 0 60px ${T.red}40` }}>
            {fmt(netWorth)}
          </div>
          <p style={{ color:T.muted,fontSize:14,marginTop:6,fontWeight:600 }}>Net worth right now</p>
        </div>

        <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.7,marginBottom:32,maxWidth:360,margin:"0 auto 32px" }}>
          {getMessage()}
        </p>

        {/* Quick stats */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:36 }}>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px" }}>
            <p style={{ color:T.green,fontWeight:900,fontSize:22 }}>{fmtK(totalAssets)}</p>
            <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>Total assets</p>
          </div>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px" }}>
            <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:900,fontSize:22 }}>{fmtK(totalDebts)}</p>
            <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>Total debts</p>
          </div>
        </div>

        <Btn onClick={onFinish} style={{ fontSize:16,padding:"16px 28px" }}>
          Explore my picture →
        </Btn>

        <p style={{ color:T.subtle,fontSize:11,marginTop:14 }}>You can refine your numbers anytime in Track</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   HOME TAB — Net worth hero, goals, locked/unlocked insights, lesson rec
   ══════════════════════════════════════════════════════════════════════════ */
function HomeTab() {
  const { state, save, setTab, toast, reset } = useApp()
  const { assets, debts, income, spending, goals, profile, completedLessons } = state
  const { netWorth, totalAssets, totalDebts } = calcTotals(assets, debts)
  const surplus = calcSurplus(income, assets, spending)
  const journey = JOURNEYS.find(j=>j.id===profile?.journeyId)
  const jColor  = journey?.color || T.teal

  const bk = buckets(assets)
  const drag = totalInterestDrag(debts)
  const hasSpending = (spending?.monthly||0) > 0
  const hasIncome   = (income?.primary||0) > 0
  const safetyMonths = (bk.safetyNet > 0 && spending.monthly > 0) ? Math.floor(bk.safetyNet / spending.monthly) : null
  const fireNumber  = hasSpending ? spending.monthly * 12 * 25 : null

  // Recommended lesson
  const doneSet = new Set(completedLessons||[])
  const recLesson = journey?.lessonsFirst.map(id=>LESSONS.find(l=>l.id===id)).filter(Boolean).find(l=>!doneSet.has(l.id)) || LESSONS.find(l=>!doneSet.has(l.id))

  const [showUpdateHint, setShowUpdateHint] = useState(false)

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{ position:"relative",background:`linear-gradient(180deg,${jColor}15 0%,transparent 100%)`,padding:"36px 22px 28px" }}>
        <StarField count={15} style={{ opacity:.5 }}/>
        <div style={{ position:"relative",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
            <div>
              <p style={{ fontSize:12,fontWeight:700,color:jColor,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>
                {journey?.emoji} {profile.name ? `${profile.name}'s picture` : "Your picture"}
              </p>
              <div style={{ fontSize:"clamp(36px,8vw,52px)",fontWeight:900,lineHeight:1,
                color:netWorth>=0?T.teal:T.red,
                textShadow:netWorth>=0?`0 0 40px ${T.teal}40`:`0 0 40px ${T.red}30` }}>
                {fmt(netWorth)}
              </div>
              <p style={{ color:T.muted,fontSize:13,marginTop:6,fontWeight:500 }}>Net worth</p>
            </div>
            <button onClick={()=>setShowUpdateHint(!showUpdateHint)}
              style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",cursor:"pointer",color:T.muted,fontSize:12,fontWeight:700,fontFamily:"inherit",marginTop:4 }}>
              Update ✎
            </button>
          </div>

          {/* Asset / debt strip */}
          <div style={{ display:"flex",gap:20,marginTop:16 }}>
            <div>
              <p style={{ color:T.green,fontWeight:800,fontSize:16 }}>{fmtK(totalAssets)}</p>
              <p style={{ color:T.muted,fontSize:11,marginTop:1 }}>Assets</p>
            </div>
            <div style={{ width:1,background:T.border }}/>
            <div>
              <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:800,fontSize:16 }}>{fmtK(totalDebts)}</p>
              <p style={{ color:T.muted,fontSize:11,marginTop:1 }}>Debts</p>
            </div>
            {surplus!==0 && <>
              <div style={{ width:1,background:T.border }}/>
              <div>
                <p style={{ color:surplus>0?T.teal:T.red,fontWeight:800,fontSize:16 }}>{fmtK(Math.abs(surplus))}/mo</p>
                <p style={{ color:T.muted,fontSize:11,marginTop:1 }}>{surplus>0?"Surplus":"Shortfall"}</p>
              </div>
            </>}
          </div>

          {showUpdateHint && (
            <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",marginTop:14 }}>
              <p style={{ color:T.muted,fontSize:13,lineHeight:1.5,marginBottom:10 }}>Go to <strong style={{ color:T.white }}>Me → Track</strong> to update your assets, debts, or income.</p>
              <button onClick={()=>{ if(window.confirm("Restart the onboarding from scratch? Your current data will be cleared.")) reset() }}
                style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 14px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                🔄 Restart onboarding
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 18px" }}>

        {/* ── Goals section ─────────────────────────────────────────── */}
        <HomeGoalsSection goals={goals} surplus={surplus} setTab={setTab} save={save} state={state} toast={toast}/>

        {/* ── Section label ─────────────────────────────────────────── */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,marginTop:8 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Your insights</p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14,marginBottom:24 }}>

          {/* Safety net — always shown if savings exist */}
          {bk.safetyNet > 0 && (
            <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                <div style={{ width:38,height:38,borderRadius:11,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🛡️</div>
                <div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>Safety net</p>
                  <p style={{ color:T.muted,fontSize:12 }}>Liquid savings</p>
                </div>
              </div>
              <p style={{ color:T.teal,fontWeight:900,fontSize:28,marginBottom:2 }}>{fmt(bk.safetyNet)}</p>
              {safetyMonths!=null ? (
                <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>
                  That's roughly <strong style={{ color:safetyMonths>=3?T.green:T.amber }}>{safetyMonths} month{safetyMonths!==1?"s":""}</strong> of expenses covered.
                  {safetyMonths<3 && " Aim for 3–6 months."}
                </p>
              ) : (
                <p style={{ color:T.muted,fontSize:13 }}>Add monthly spending in Track to see how many months this covers.</p>
              )}
            </div>
          )}

          {/* Wealth allocation — if assets exist */}
          {totalAssets > 0 && (
            <WealthAllocationCard bk={bk} totalAssets={totalAssets}/>
          )}

          {/* Interest drag — if debts exist */}
          {totalDebts > 0 && drag > 0 && (
            <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                <div style={{ width:38,height:38,borderRadius:11,background:T.redDim,border:`1px solid ${T.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>💸</div>
                <div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>Interest drag</p>
                  <p style={{ color:T.muted,fontSize:12 }}>What debt costs you</p>
                </div>
              </div>
              <p style={{ color:T.red,fontWeight:900,fontSize:28,marginBottom:4 }}>{fmt(Math.round(drag/12))}<span style={{ fontSize:16,fontWeight:600 }}>/mo</span></p>
              <p style={{ color:T.muted,fontSize:13,lineHeight:1.5 }}>
                {fmt(Math.round(drag))}/year quietly leaving your net worth. <span style={{ color:T.white,fontWeight:600 }}>Paying off high-rate debt first is a guaranteed return.</span>
              </p>
            </div>
          )}

          {/* FIRE card — locked if no spending */}
          {fireNumber ? (
            <div style={{ background:T.card,border:`1px solid ${T.amberBorder}`,borderRadius:18,padding:"20px 22px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                <div style={{ width:38,height:38,borderRadius:11,background:T.amberDim,border:`1px solid ${T.amberBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🔥</div>
                <div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>Financial freedom number</p>
                  <p style={{ color:T.muted,fontSize:12 }}>25× annual spending (4% rule)</p>
                </div>
              </div>
              <p style={{ color:T.amber,fontWeight:900,fontSize:28,marginBottom:4 }}>{fmtK(fireNumber)}</p>
              {bk.wealthBuilders > 0 && (
                <>
                  <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden",marginBottom:6 }}>
                    <div style={{ width:`${Math.min(100,(bk.wealthBuilders/fireNumber)*100)}%`,height:"100%",background:T.amber,borderRadius:99 }}/>
                  </div>
                  <p style={{ color:T.muted,fontSize:12 }}>{Math.round((bk.wealthBuilders/fireNumber)*100)}% of the way there — {fmt(bk.wealthBuilders)} invested</p>
                </>
              )}
            </div>
          ) : (
            <LockedCard icon="🔥" title="Financial freedom number"
              description="Add your monthly spending to unlock your FIRE number — the amount you need to never have to work again."
              unlock="Add spending in Track →" onUnlock={()=>setTab(2)}/>
          )}

          {/* Net worth projection — always shown if any data */}
          {netWorth !== 0 && hasIncome && <ProjectionCard nw={netWorth} surplus={surplus} age={profile?.age}/>}
          {(netWorth === 0 || !hasIncome) && (
            <LockedCard icon="📈" title="Net worth projection"
              description="Complete your income and assets to see where your wealth could be by retirement."
              unlock="Add income →" onUnlock={()=>setTab(2)}/>
          )}
        </div>

        {/* ── Continue learning ──────────────────────────────────────── */}
        {recLesson && (
          <div style={{ marginBottom:24 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Continue your journey</p>
            <LessonRecommendation lesson={recLesson} journey={journey} onLearn={()=>setTab(1)}/>
          </div>
        )}
      </div>
    </div>
  )
}

/* Wealth allocation breakdown */
function WealthAllocationCard({ bk, totalAssets }) {
  const segments = [
    { label:"Safety net",      value:bk.safetyNet,      color:T.teal,   icon:"🛡️" },
    { label:"Wealth builders", value:bk.wealthBuilders, color:T.purple, icon:"📈" },
    { label:"Life assets",     value:bk.lifeAssets,     color:T.amber,  icon:"🏠" },
  ].filter(s=>s.value>0)
  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <div style={{ width:38,height:38,borderRadius:11,background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🗂️</div>
        <div>
          <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>Wealth breakdown</p>
          <p style={{ color:T.muted,fontSize:12 }}>How your assets are split</p>
        </div>
      </div>
      {/* Bar */}
      <div style={{ display:"flex",borderRadius:8,overflow:"hidden",height:10,marginBottom:16,background:T.surface }}>
        {segments.map(s=>(
          <div key={s.label} style={{ width:`${(s.value/totalAssets)*100}%`,background:s.color,transition:"width .6s ease" }}/>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {segments.map(s=>(
          <div key={s.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:10,height:10,borderRadius:3,background:s.color,flexShrink:0 }}/>
              <span style={{ fontSize:13,color:T.muted }}>{s.icon} {s.label}</span>
            </div>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:13,fontWeight:700,color:T.white }}>{fmtK(s.value)}</span>
              <span style={{ fontSize:11,color:T.muted,marginLeft:4 }}>{Math.round((s.value/totalAssets)*100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Mini projection card */
function ProjectionCard({ nw, surplus, age }) {
  const data = useMemo(()=>calcProjection(nw,surplus,age).filter((_,i)=>i%5===0||i===0),[nw,surplus,age])
  const fmtAx = v => v>=1e6?`£${(v/1e6).toFixed(1)}M`:v>=1000?`£${(v/1000).toFixed(0)}k`:''
  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 22px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <div style={{ width:38,height:38,borderRadius:11,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📈</div>
        <div>
          <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>Net worth projection</p>
          <p style={{ color:T.muted,fontSize:12 }}>Where you could be by age 70</p>
        </div>
      </div>
      <div style={{ height:140,marginBottom:10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4,right:4,bottom:0,left:0 }}>
            <defs>
              <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.teal} stopOpacity={.25}/>
                <stop offset="95%" stopColor={T.teal} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gCon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.purple} stopOpacity={.12}/>
                <stop offset="95%" stopColor={T.purple} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="age" tick={{ fontSize:10,fill:T.muted }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:9,fill:T.subtle }} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={38}/>
            <Tooltip formatter={(v,name)=>[fmt(v),name==="balanced"?"Likely (7%/yr)":"Conservative (4%/yr)"]} labelFormatter={v=>`Age ${Math.round(v)}`} contentStyle={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white }}/>
            <Area type="monotone" dataKey="conservative" stroke={T.purple} strokeWidth={1.5} strokeDasharray="5 3" fill="url(#gCon)" dot={false}/>
            <Area type="monotone" dataKey="balanced" stroke={T.teal} strokeWidth={2.5} fill="url(#gBal)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display:"flex",gap:16,marginBottom:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:18,height:2,background:T.teal,borderRadius:1 }}/><span style={{ color:T.muted,fontSize:11 }}>Likely (7%/yr)</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:18,height:2,background:T.purple,borderRadius:1 }}/><span style={{ color:T.muted,fontSize:11 }}>Conservative (4%/yr)</span></div>
      </div>
      <p style={{ color:T.muted,fontSize:12,lineHeight:1.5 }}>Based on your current surplus invested monthly. <span style={{ color:T.white,fontWeight:600 }}>Not financial advice.</span></p>
    </div>
  )
}

/* Goals section on home */
function HomeGoalsSection({ goals, surplus, setTab, save, state, toast }) {
  const [showSheet, setShowSheet] = useState(false)
  const activeGoals = goals.filter(g=>!ACTION_GOALS.has(g.type)?calcGoalProgress(g,surplus).pct<100:true)
  const displayed = activeGoals.slice(0,2)

  function saveGoal(data) {
    const existing = goals.find(g=>g.id===data.id)
    const newGoals = existing ? goals.map(g=>g.id===data.id?data:g) : [...goals,data]
    save({ ...state, goals:newGoals })
    toast(existing?"✓ Goal updated":"✓ Goal created")
    setShowSheet(false)
  }

  return (
    <div style={{ marginBottom:24,paddingTop:12 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Your goals</p>
        <div style={{ display:"flex",gap:10 }}>
          {goals.length>0 && <button onClick={()=>setTab(2)} style={{ background:"none",border:"none",color:T.teal,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>See all →</button>}
          <button onClick={()=>setShowSheet(true)} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 12px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4 }}>
            <Plus size={12}/>Add
          </button>
        </div>
      </div>

      {displayed.length===0 ? (
        <button onClick={()=>setShowSheet(true)} style={{ width:"100%",background:T.tealDim,border:`1.5px dashed ${T.tealBorder}`,borderRadius:16,padding:"20px",cursor:"pointer",textAlign:"center",fontFamily:"inherit" }}>
          <p style={{ color:T.teal,fontWeight:700,fontSize:15,marginBottom:4 }}>🎯 Set your first goal</p>
          <p style={{ color:T.muted,fontSize:13 }}>Holiday, emergency fund, clear debt — people who set goals save 2× faster.</p>
        </button>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12 }}>
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
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
          <span style={{ fontSize:20 }}>{cfg.icon}</span>
          <div>
            <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{goal.name}</p>
            <p style={{ color:T.muted,fontSize:11 }}>{checked.size}/{actions.length} steps</p>
          </div>
        </div>
        <div style={{ background:T.surface,borderRadius:99,height:5,overflow:"hidden" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:cfg.color,borderRadius:99 }}/>
        </div>
      </div>
    )
  }
  const { pct, current, eta } = calcGoalProgress(goal, surplus)
  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
        <span style={{ fontSize:20 }}>{cfg.icon}</span>
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

function LessonRecommendation({ lesson, journey, onLearn }) {
  return (
    <button onClick={onLearn} style={{ width:"100%",background:T.card,border:`1.5px solid ${lesson.trackColor||T.teal}40`,borderRadius:18,padding:"18px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .2s",display:"flex",alignItems:"center",gap:16 }}>
      <div style={{ width:52,height:52,borderRadius:16,background:`${lesson.trackColor}20`,border:`1.5px solid ${lesson.trackColor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
        {lesson.emoji}
      </div>
      <div style={{ flex:1,textAlign:"left" }}>
        <p style={{ color:lesson.trackColor||T.teal,fontWeight:700,fontSize:11,letterSpacing:.5,textTransform:"uppercase",marginBottom:4 }}>
          Next mission · {lesson.track}
        </p>
        <p style={{ color:T.white,fontWeight:700,fontSize:14,lineHeight:1.3,marginBottom:4 }}>{lesson.title}</p>
        <p style={{ color:T.muted,fontSize:12 }}>~{lesson.cards?.length*1} min · +{lesson.xp} XP</p>
      </div>
      <ChevronRight size={18} color={T.muted}/>
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   GOAL SHEET & ACTION GOAL SHEET
   ══════════════════════════════════════════════════════════════════════════ */
function GoalSheet({ goal, onClose, onSave }) {
  const { state } = useApp()
  const surplus = calcSurplus(state.income, state.assets, state.spending)
  const editing = !!goal
  const [type,    setType]    = useState(goal?.type||null)
  const [name,    setName]    = useState(goal?.name||"")
  const [target,  setTarget]  = useState(goal?.targetAmount||0)
  const [start,   setStart]   = useState(goal?.startAmount||0)
  const [monthly, setMonthly] = useState(goal?.monthlyAmount||Math.round(Math.max(0,surplus*0.3)))
  const [err,     setErr]     = useState("")
  const [goAction,setGoAction]= useState(editing && ACTION_GOALS.has(goal?.type))

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
    <Sheet title={editing?"Edit goal":"New goal"} onClose={onClose}>
      <p style={{ fontSize:12,color:T.muted,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:12 }}>What are you saving towards?</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:22 }}>
        {GOAL_TYPES.map(g=>{
          const sel = type===g.id
          const isAct = ACTION_GOALS.has(g.id)
          return (
            <button key={g.id} onClick={()=>{ setType(g.id); setName(name||g.label); if(isAct) setGoAction(true) }}
              style={{ padding:"12px 6px",borderRadius:13,border:`2px solid ${sel?g.color:T.border}`,background:sel?g.dim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .15s",position:"relative" }}>
              <span style={{ fontSize:22 }}>{g.icon}</span>
              <span style={{ fontSize:10,fontWeight:700,color:sel?g.color:T.muted,textAlign:"center",lineHeight:1.3 }}>{g.label}</span>
              {sel&&<div style={{ position:"absolute",top:6,right:6,width:14,height:14,borderRadius:"50%",background:g.color,display:"flex",alignItems:"center",justifyContent:"center" }}><Check size={9} color="#fff"/></div>}
            </button>
          )
        })}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:20 }}>
        <Input label="Goal name" value={name} onChange={setName} placeholder={cfg?.label||"e.g. Europe trip"}/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <CurrencyInput label="Target amount" value={target} onChange={setTarget}/>
          <CurrencyInput label="Already saved" value={start} onChange={setStart}/>
        </div>
        <CurrencyInput label="Monthly contribution" value={monthly} onChange={setMonthly} helper={`Your current surplus is ${fmt(Math.max(0,surplus))}/mo`}/>
      </div>
      {eta && target>0 && (
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:13,padding:"12px 16px",marginBottom:16 }}>
          <p style={{ color:T.teal,fontWeight:700,fontSize:14 }}>At {fmt(monthly)}/mo → reach this by <strong>{eta}</strong></p>
        </div>
      )}
      {err && <p style={{ color:T.red,fontSize:13,marginBottom:12 }}>{err}</p>}
      <Btn onClick={save}>{editing?"Save changes":"Create goal"}</Btn>
    </Sheet>
  )
}

function ActionGoalSheet({ type, goal, onClose, onSave }) {
  const cfg = GOAL_TYPES.find(g=>g.id===type)||GOAL_TYPES[GOAL_TYPES.length-1]
  const actions = GOAL_ACTIONS[type]||[]
  const [checked, setChecked] = useState(()=>new Set(goal?.checkedActions||[]))
  const [name, setName] = useState(goal?.name||cfg?.label||"")
  const [monthly, setMonthly] = useState(goal?.monthlyAmount||0)
  function toggle(id) { setChecked(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n }) }
  function save() {
    onSave({ id:goal?.id||Date.now().toString(), type, name, targetAmount:0, startAmount:0, monthlyAmount:monthly, checkedActions:[...checked], createdAt:goal?.createdAt||new Date().toISOString() })
    onClose()
  }
  const donePct = actions.length>0?Math.round((checked.size/actions.length)*100):0
  return (
    <Sheet title={`Set up: ${cfg.label}`} onClose={onClose}>
      <div style={{ background:cfg.dim,border:`1px solid ${cfg.border}`,borderRadius:14,padding:"14px 18px",marginBottom:18,display:"flex",gap:12,alignItems:"center" }}>
        <span style={{ fontSize:28 }}>{cfg.icon}</span>
        <p style={{ color:cfg.color,fontWeight:700,fontSize:14 }}>Tick each step as you complete it</p>
      </div>
      <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden",marginBottom:16 }}>
        <div style={{ width:`${donePct}%`,height:"100%",background:cfg.color,borderRadius:99,transition:"width .4s" }}/>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
        {actions.map(a=>{
          const done=checked.has(a.id)
          return (
            <div key={a.id} onClick={()=>toggle(a.id)} style={{ background:done?cfg.dim:T.card,border:`1.5px solid ${done?cfg.color:T.border}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all .15s" }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",background:done?cfg.color:T.surface,border:`2px solid ${done?cfg.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                  {done&&<Check size={12} color="#fff"/>}
                </div>
                <div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:3 }}>{a.label}</p>
                  <p style={{ color:T.muted,fontSize:12,lineHeight:1.55 }}>{a.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:20 }}>
        <Input label="Goal name (optional)" value={name} onChange={setName} placeholder={cfg.label}/>
        <CurrencyInput label="Monthly amount towards this" value={monthly} onChange={setMonthly}/>
      </div>
      <Btn onClick={save}>Save goal</Btn>
    </Sheet>
  )
}

/* ── Goals Card ─────────────────────────────────────────────────────────── */
function GoalCard({ goal, onEdit, onDelete, surplus }) {
  const cfg = GOAL_TYPES.find(g=>g.id===goal.type)||GOAL_TYPES[GOAL_TYPES.length-1]
  const isAction = ACTION_GOALS.has(goal.type)
  if(isAction) {
    const actions = GOAL_ACTIONS[goal.type]||[]
    const checked = new Set(goal.checkedActions||[])
    const donePct = actions.length>0?Math.round((checked.size/actions.length)*100):0
    return (
      <div style={{ background:T.card,border:`1px solid ${donePct===100?cfg.color:T.border}`,borderRadius:18,padding:"20px 22px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:44,height:44,borderRadius:14,background:cfg.dim,border:`1px solid ${cfg.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{cfg.icon}</div>
            <div><p style={{ color:T.white,fontWeight:800,fontSize:15 }}>{goal.name}</p><p style={{ color:T.muted,fontSize:12 }}>{checked.size}/{actions.length} steps done</p></div>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            <button onClick={onEdit}   style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
            <button onClick={onDelete} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>
          </div>
        </div>
        <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:12 }}>
          <div style={{ width:`${donePct}%`,height:"100%",background:donePct===100?"#34D399":cfg.color,borderRadius:99,transition:"width .6s" }}/>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          {actions.map(a=>{ const done=checked.has(a.id); return (
            <div key={a.id} style={{ display:"flex",alignItems:"center",gap:10,opacity:done?1:.55 }}>
              <div style={{ width:16,height:16,borderRadius:"50%",background:done?cfg.color:T.surface,border:`2px solid ${done?cfg.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{done&&<Check size={9} color="#fff"/>}</div>
              <p style={{ color:done?T.white:T.muted,fontSize:13,textDecoration:done?"line-through":"none" }}>{a.label}</p>
            </div>
          )})}
        </div>
      </div>
    )
  }
  const { current, pct, eta, monthly } = calcGoalProgress(goal, surplus)
  const done = pct>=100
  return (
    <div style={{ background:T.card,border:`1px solid ${done?cfg.color:T.border}`,borderRadius:18,padding:"20px 22px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
        <div style={{ display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ width:44,height:44,borderRadius:14,background:cfg.dim,border:`1px solid ${cfg.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{cfg.icon}</div>
          <div><p style={{ color:T.white,fontWeight:800,fontSize:15 }}>{goal.name}</p><p style={{ color:T.muted,fontSize:12 }}>{fmt(current)} of {fmt(goal.targetAmount)}</p></div>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          <button onClick={onEdit}   style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Pencil size={13}/></button>
          <button onClick={onDelete} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:T.muted,display:"flex" }}><Trash2 size={13}/></button>
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
        <span style={{ color:done?"#34D399":cfg.color,fontWeight:800,fontSize:14 }}>{pct}% {done&&"🎉"}</span>
        {eta&&!done&&<span style={{ color:T.muted,fontSize:12 }}>Est. {eta}</span>}
      </div>
      <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:12 }}>
        <div style={{ width:`${pct}%`,height:"100%",background:done?"#34D399":cfg.color,borderRadius:99,transition:"width .8s",maxWidth:"100%" }}/>
      </div>
      <div style={{ display:"flex",gap:16,paddingTop:10,borderTop:`1px solid ${T.border}` }}>
        <div><p style={{ color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>Monthly</p><p style={{ color:T.white,fontSize:13,fontWeight:700,marginTop:2 }}>{fmt(monthly)}</p></div>
        <div><p style={{ color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>Remaining</p><p style={{ color:T.white,fontSize:13,fontWeight:700,marginTop:2 }}>{fmt(Math.max(0,goal.targetAmount-current))}</p></div>
      </div>
    </div>
  )
}

/* ── Goals Tab ──────────────────────────────────────────────────────────── */
function GoalsTab() {
  const { state, save, toast } = useApp()
  const surplus = calcSurplus(state.income, state.assets, state.spending)
  const [sheet, setSheet] = useState(null)
  const [editGoal, setEditGoal] = useState(null)

  function saveGoal(data) {
    const existing = state.goals.find(g=>g.id===data.id)
    const newGoals = existing ? state.goals.map(g=>g.id===data.id?data:g) : [...state.goals,data]
    save({ ...state, goals:newGoals, profile:{ ...state.profile, points:(state.profile.points||0)+(existing?0:15) } })
    toast(existing?"✓ Goal updated":"✓ Goal created — +15 XP")
    setSheet(null); setEditGoal(null)
  }

  function deleteGoal(id) {
    if(!window.confirm("Delete this goal?")) return
    save({ ...state, goals:state.goals.filter(g=>g.id!==id) })
  }

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100,padding:"28px 18px 100px",maxWidth:1100,margin:"0 auto",width:"100%" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <div>
          <h2 style={{ color:T.white,fontSize:22,fontWeight:900,marginBottom:3 }}>Your goals</h2>
          <p style={{ color:T.muted,fontSize:14 }}>What are you building towards?</p>
        </div>
        <button onClick={()=>{ setEditGoal(null); setSheet("goal") }}
          style={{ background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:12,padding:"10px 16px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontFamily:"inherit" }}>
          <Plus size={15}/>New goal
        </button>
      </div>

      {state.goals.length===0 ? (
        <div style={{ textAlign:"center",padding:"60px 24px" }}>
          <div style={{ fontSize:52,marginBottom:16 }}>🎯</div>
          <h3 style={{ color:T.white,fontSize:20,fontWeight:800,marginBottom:8 }}>Goals make everything faster</h3>
          <p style={{ color:T.muted,fontSize:14,lineHeight:1.7,marginBottom:28,maxWidth:340,margin:"0 auto 28px" }}>People who set specific goals save 2× faster. Your first goal takes 30 seconds.</p>
          <Btn onClick={()=>setSheet("goal")} style={{ maxWidth:260,margin:"0 auto" }}>Set my first goal</Btn>
        </div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
          {state.goals.map(g=>(
            <GoalCard key={g.id} goal={g} surplus={surplus}
              onEdit={()=>{ setEditGoal(g); setSheet("goal") }}
              onDelete={()=>deleteGoal(g.id)}/>
          ))}
        </div>
      )}

      {sheet==="goal" && <GoalSheet goal={editGoal} onClose={()=>{ setSheet(null); setEditGoal(null) }} onSave={saveGoal}/>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   TRACK TAB — Assets, Debts, Income, Spending
   ══════════════════════════════════════════════════════════════════════════ */
function TrackTab() {
  const { state, save, toast } = useApp()
  const [section, setSection] = useState("assets")
  const [sheet, setSheet]     = useState(null)
  const [editItem, setEditItem]= useState(null)

  const tabs = [
    { id:"assets",   label:"Assets",   icon:"📈" },
    { id:"debts",    label:"Debts",    icon:"💳" },
    { id:"income",   label:"Income",   icon:"💰" },
    { id:"spending", label:"Spending", icon:"🏷️" },
  ]

  function saveAsset(data) {
    let assets = [...state.assets], debts = [...state.debts]
    if(data.existingId) {
      if(data.hasLoan&&data.loanBal>0&&data.existingLinkedDebtId) {
        debts=debts.map(d=>d.id!==data.existingLinkedDebtId?d:{ ...d,balance:data.loanBal,interestRate:data.loanRate||DEFAULT_RATES[d.category]||10 })
      } else if(data.hasLoan&&data.loanBal>0&&!data.existingLinkedDebtId) {
        const did=data.existingId+"_d"+Date.now()
        debts.push({ id:did,category:"mortgage",name:`${data.name} loan`,balance:data.loanBal,interestRate:data.loanRate||4.5,linkedAssetId:data.existingId,isAutoCreated:true })
        assets=assets.map(a=>a.id!==data.existingId?a:{ ...a,linkedDebtId:did })
      } else if(!data.hasLoan&&data.existingLinkedDebtId) {
        debts=debts.filter(d=>d.id!==data.existingLinkedDebtId)
      }
      assets=assets.map(a=>a.id!==data.existingId?a:{ ...a,category:data.cat,name:data.name,value:data.val,monthlyIncome:data.monthlyIncome })
    } else {
      const aid=Date.now().toString(); let linkedDebtId=null
      if(data.hasLoan&&data.loanBal>0){ const did=aid+"_d"; linkedDebtId=did; debts.push({ id:did,category:"mortgage",name:`${data.name} loan`,balance:data.loanBal,interestRate:data.loanRate||4.5,linkedAssetId:aid,isAutoCreated:true }) }
      assets.push({ id:aid,category:data.cat,name:data.name,value:data.val,monthlyIncome:data.monthlyIncome,linkedDebtId })
    }
    save({ ...state,assets,debts }); toast("✓ Asset saved"); setSheet(null); setEditItem(null)
  }

  function deleteAsset(a) {
    if(!window.confirm(`Delete "${a.name}"?`)) return
    const linked = a.linkedDebtId?state.debts.find(d=>d.id===a.linkedDebtId):null
    save({ ...state,assets:state.assets.filter(x=>x.id!==a.id),debts:linked?state.debts.filter(d=>d.id!==linked.id):state.debts })
  }

  function saveDebt(data) {
    if(data.existingId) {
      save({ ...state,debts:state.debts.map(d=>d.id!==data.existingId?d:{ ...d,category:data.cat,name:data.name,balance:data.bal,interestRate:data.rate||DEFAULT_RATES[data.cat]||10 }) })
    } else {
      save({ ...state,debts:[...state.debts,{ id:Date.now().toString(),category:data.cat,name:data.name,balance:data.bal,interestRate:data.rate||DEFAULT_RATES[data.cat]||10,linkedAssetId:null,isAutoCreated:false }] })
    }
    toast("✓ Debt saved"); setSheet(null); setEditItem(null)
  }

  function deleteDebt(d) {
    if(!window.confirm(`Delete "${d.name}"?`)) return
    save({ ...state,debts:state.debts.filter(x=>x.id!==d.id) })
  }

  function saveIncome(inc) { save({ ...state,income:inc }); toast("✓ Income updated"); setSheet(null) }
  function saveSpending(sp) { save({ ...state,spending:sp }); toast("✓ Spending updated"); setSheet(null) }

  const { totalAssets, totalDebts } = calcTotals(state.assets, state.debts)
  const inc = calcIncome(state.income, state.assets)
  const drag = totalInterestDrag(state.debts)

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      {/* Section tabs */}
      <div style={{ display:"flex",gap:0,background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 18px",overflowX:"auto" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setSection(t.id)}
            style={{ background:"none",border:"none",borderBottom:`3px solid ${section===t.id?T.teal:"transparent"}`,padding:"14px 16px",color:section===t.id?T.teal:T.muted,fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,transition:"color .15s" }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"24px 18px",maxWidth:1100,margin:"0 auto",width:"100%" }}>
        {/* ASSETS */}
        {section==="assets" && (
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div>
                <p style={{ color:T.green,fontWeight:900,fontSize:22 }}>{fmt(totalAssets)}</p>
                <p style={{ color:T.muted,fontSize:13 }}>Total assets</p>
              </div>
              <button onClick={()=>{ setEditItem(null); setSheet("asset") }}
                style={{ background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:11,padding:"9px 16px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
                <Plus size={14}/>Add asset
              </button>
            </div>
            {state.assets.length===0 ? (
              <EmptyState icon="📊" title="No assets yet" body="Add your home, savings, investments, pension, and anything else you own." cta="Add first asset" onClick={()=>setSheet("asset")}/>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {state.assets.map(a=>{
                  const linked=a.linkedDebtId?state.debts.find(d=>d.id===a.linkedDebtId):null
                  const t = ASSET_TYPES.find(x=>x.cat===a.category)||ASSET_TYPES[ASSET_TYPES.length-1]
                  return (
                    <div key={a.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:14 }}>
                      <div style={{ width:44,height:44,borderRadius:13,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t.icon}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.name}</p>
                        <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>{t.label}{linked?` · Linked loan`:""}{ a.monthlyIncome>0?` · ${fmt(a.monthlyIncome)}/mo`:""}</p>
                      </div>
                      <p style={{ color:T.teal,fontWeight:800,fontSize:15,whiteSpace:"nowrap",marginRight:4 }}>{fmt(a.value)}</p>
                      <button onClick={()=>{ setEditItem(a); setSheet("asset") }} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={14}/></button>
                      <button onClick={()=>deleteAsset(a)} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={14}/></button>
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
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
              <div>
                <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:900,fontSize:22 }}>{fmt(totalDebts)}</p>
                <p style={{ color:T.muted,fontSize:13 }}>Total debts · {fmt(Math.round(drag))}/yr in interest</p>
              </div>
              <button onClick={()=>{ setEditItem(null); setSheet("debt") }}
                style={{ background:T.redDim,border:`1.5px solid ${T.redBorder}`,borderRadius:11,padding:"9px 16px",color:T.red,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
                <Plus size={14}/>Add debt
              </button>
            </div>
            {drag > 0 && (
              <div style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"10px 16px",marginBottom:16 }}>
                <p style={{ color:T.red,fontSize:13,fontWeight:600 }}>💸 Your debts cost you {fmt(Math.round(drag/12))}/month in interest. Clearing high-rate debt first is your highest guaranteed return.</p>
              </div>
            )}
            {state.debts.length===0 ? (
              <EmptyState icon="💳" title="No debts added" body="No debt? That's great — skip this. Or add any debts you're carrying." cta="Add a debt" onClick={()=>setSheet("debt")}/>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {state.debts.map(d=>{
                  const t = DEBT_TYPES.find(x=>x.cat===d.category)||DEBT_TYPES[DEBT_TYPES.length-1]
                  const interest = annualInterest(d)
                  return (
                    <div key={d.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:14 }}>
                      <div style={{ width:44,height:44,borderRadius:13,background:T.redDim,border:`1px solid ${T.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t?.icon||"💳"}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</p>
                        <p style={{ color:T.muted,fontSize:12,marginTop:2 }}>{d.interestRate||t?.assumedRate||10}% APR · costing {fmt(Math.round(interest/12))}/mo in interest</p>
                      </div>
                      <p style={{ color:T.red,fontWeight:800,fontSize:15,whiteSpace:"nowrap",marginRight:4 }}>{fmt(d.balance)}</p>
                      <button onClick={()=>{ setEditItem(d); setSheet("debt") }} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={14}/></button>
                      {!d.isAutoCreated&&<button onClick={()=>deleteDebt(d)} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={14}/></button>}
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
        {section==="spending" && <SpendingSection spending={state.spending} onSave={saveSpending}/>}
      </div>

      {sheet==="asset" && <TrackAssetSheet asset={editItem} onClose={()=>{ setSheet(null); setEditItem(null) }} onSave={saveAsset}/>}
      {sheet==="debt"  && <TrackDebtSheet  debt={editItem}  onClose={()=>{ setSheet(null); setEditItem(null) }} onSave={saveDebt}/>}
    </div>
  )
}

function EmptyState({ icon, title, body, cta, onClick }) {
  return (
    <div style={{ textAlign:"center",padding:"48px 24px",background:T.card,border:`1.5px dashed ${T.border}`,borderRadius:18 }}>
      <div style={{ fontSize:40,marginBottom:14 }}>{icon}</div>
      <p style={{ color:T.white,fontWeight:700,fontSize:16,marginBottom:6 }}>{title}</p>
      <p style={{ color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:24,maxWidth:280,margin:"0 auto 24px" }}>{body}</p>
      <button onClick={onClick} style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:11,padding:"10px 20px",color:T.teal,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>{cta}</button>
    </div>
  )
}

function IncomeSection({ income, assets, onSave }) {
  const [primary, setPrimary] = useState(income.primary||0)
  const [source, setSource]   = useState(income.primarySource||"Salary")
  const totalInc = calcIncome({ primary, primarySource:source, additional:income.additional||[] }, assets)
  return (
    <div>
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px",marginBottom:16 }}>
        <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:16 }}>Primary income</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
          <CurrencyInput label="Monthly take-home pay (after tax)" value={primary} onChange={setPrimary} helper="After all tax and NI deductions"/>
          <Input label="Income type" value={source} onChange={setSource} placeholder="e.g. Salary, Freelance"/>
        </div>
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:11,padding:"10px 16px",display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <span style={{ color:T.muted,fontSize:13 }}>Total monthly income</span>
          <span style={{ color:T.teal,fontWeight:800,fontSize:15 }}>{fmt(totalInc)}/mo</span>
        </div>
        <Btn onClick={()=>onSave({ ...income,primary,primarySource:source })}>Save income</Btn>
      </div>
    </div>
  )
}

function SpendingSection({ spending, onSave }) {
  const [monthly, setMonthly] = useState(spending.monthly||0)
  return (
    <div>
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px",marginBottom:16 }}>
        <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:6 }}>Monthly spending</p>
        <p style={{ color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:16 }}>Your total monthly outgoings — rent/mortgage, food, transport, bills, everything. Rough is fine.</p>
        <CurrencyInput label="Monthly total spending" value={monthly} onChange={setMonthly} helper="Include all regular outgoings — bills, rent, food, subscriptions"/>
        <div style={{ marginTop:16 }}>
          <Btn onClick={()=>onSave({ ...spending,monthly })}>
            {spending.monthly>0?"Update spending":"Save spending"}
          </Btn>
        </div>
      </div>
      {spending.monthly===0 && (
        <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:12,padding:"12px 16px" }}>
          <p style={{ color:T.amber,fontSize:13,fontWeight:600 }}>💡 Add your monthly spending to unlock safety net months, surplus calculation, and your FIRE number.</p>
        </div>
      )}
    </div>
  )
}

function TrackAssetSheet({ asset, onClose, onSave }) {
  const editing = !!asset
  const existingLoanCats = new Set(["primary_residence","other_property","vehicle","business"])
  const [cat,setCat]       = useState(asset?.category||null)
  const [name,setName]     = useState(asset?.name||"")
  const [val,setVal]       = useState(asset?.value||0)
  const [hasLoan,setHasLoan]=useState(!!asset?.linkedDebtId)
  const [loanBal,setLoanBal]=useState(0)
  const [hasInc,setHasInc] = useState((asset?.monthlyIncome||0)>0)
  const [inc,setInc]       = useState(asset?.monthlyIncome||0)
  const [err,setErr]       = useState("")

  function go() {
    if(!cat)  { setErr("Please choose a category."); return }
    if(val<=0){ setErr("Please enter a value."); return }
    setErr("")
    onSave({ cat, name:name||(ASSET_TYPES.find(t=>t.cat===cat)?.label||"Asset"), val, monthlyIncome:hasInc?inc:0, hasLoan, loanBal:hasLoan?loanBal:0, loanRate:null, existingId:asset?.id, existingLinkedDebtId:asset?.linkedDebtId })
  }

  return (
    <Sheet title={editing?"Edit asset":"Add asset"} onClose={onClose}>
      <p style={{ fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:10 }}>Category</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20 }}>
        {ASSET_TYPES.map(t=>{ const sel=cat===t.cat; return (
          <button key={t.id} onClick={()=>{ setCat(t.cat); if(existingLoanCats.has(t.cat)&&!editing) setHasLoan(true) }}
            style={{ padding:"12px 6px",borderRadius:13,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.tealDim:T.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .15s" }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:700,color:sel?T.teal:T.muted,textAlign:"center" }}>{t.label}</span>
          </button>
        )})}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:16 }}>
        <Input label="Asset name" value={name} onChange={setName} placeholder={ASSET_TYPES.find(t=>t.cat===cat)?.desc||"e.g. My home"}/>
        <CurrencyInput label="Estimated value" value={val} onChange={setVal}/>
      </div>
      {cat&&existingLoanCats.has(cat)&&(
        <div style={{ marginBottom:14 }}>
          <p style={{ color:T.muted,fontSize:13,fontWeight:600,marginBottom:8 }}>Does this asset have a loan/mortgage against it?</p>
          <div style={{ display:"flex",gap:8,marginBottom:hasLoan?12:0 }}>
            {[true,false].map(o=>(
              <button key={String(o)} onClick={()=>setHasLoan(o)} style={{ flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${hasLoan===o?T.teal:T.border}`,background:hasLoan===o?T.tealDim:T.card,color:hasLoan===o?T.teal:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>{o?"Yes":"No"}</button>
            ))}
          </div>
          {hasLoan&&<CurrencyInput label="Outstanding loan balance" value={loanBal} onChange={setLoanBal} helper="We'll estimate the interest rate from the category"/>}
        </div>
      )}
      <div style={{ marginBottom:14 }}>
        <p style={{ color:T.muted,fontSize:13,fontWeight:600,marginBottom:8 }}>Does this asset generate monthly income?</p>
        <div style={{ display:"flex",gap:8,marginBottom:hasInc?12:0 }}>
          {[true,false].map(o=>(
            <button key={String(o)} onClick={()=>setHasInc(o)} style={{ flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${hasInc===o?T.teal:T.border}`,background:hasInc===o?T.tealDim:T.card,color:hasInc===o?T.teal:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>{o?"Yes":"No"}</button>
          ))}
        </div>
        {hasInc&&<CurrencyInput label="Monthly income from this asset" value={inc} onChange={setInc}/>}
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:12 }}>{err}</p>}
      <Btn onClick={go}>Save asset</Btn>
    </Sheet>
  )
}

function TrackDebtSheet({ debt, onClose, onSave }) {
  const editing = !!debt
  const [cat,setCat] = useState(debt?.category||null)
  const [name,setName]=useState(debt?.name||"")
  const [bal,setBal]  =useState(debt?.balance||0)
  const [rate,setRate]=useState(debt?.interestRate||"")
  const [err,setErr]  =useState("")
  function go() {
    if(!cat)  { setErr("Please choose a category."); return }
    if(bal<=0){ setErr("Please enter a balance."); return }
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
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:16 }}>
        <Input label="Debt name" value={name} onChange={setName} placeholder={DEBT_TYPES.find(t=>t.cat===cat)?.desc||"e.g. HSBC credit card"}/>
        <CurrencyInput label="Outstanding balance" value={bal} onChange={setBal}/>
        <div>
          <p style={{ fontSize:12,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Interest rate (optional — we'll estimate if left blank)</p>
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

const TRACKS_ORDER = [
  { id:"Foundations",   color:T.teal,    dim:T.tealDim,    border:T.tealBorder,   icon:"🌍" },
  { id:"Tax & Income",  color:T.amber,   dim:T.amberDim,   border:T.amberBorder,  icon:"⚡" },
  { id:"Saving",        color:T.blue,    dim:T.blueDim,    border:T.blueBorder,   icon:"🪐" },
  { id:"Debt",          color:T.red,     dim:T.redDim,     border:T.redBorder,    icon:"☄️" },
  { id:"Investing",     color:T.purple,  dim:T.purpleDim,  border:T.purpleBorder, icon:"🌟" },
  { id:"Big Decisions", color:"#34D399", dim:T.greenDim,   border:"rgba(52,211,153,.3)", icon:"🏆" },
  { id:"Mindset",       color:T.muted,   dim:T.faint,      border:T.border,       icon:"🧠" },
  { id:"Islamic Finance",color:"#10B981",dim:"rgba(16,185,129,.12)",border:"rgba(16,185,129,.3)", icon:"☪️" },
]

function LearnTab() {
  const { state, save, toast } = useApp()
  const [activeLesson, setActiveLesson] = useState(null)
  const done = new Set(state.completedLessons||[])
  const journey = JOURNEYS.find(j=>j.id===state.profile?.journeyId)

  function completeLesson(lesson) {
    if(done.has(lesson.id)) { setActiveLesson(null); return }
    const newDone = [...(state.completedLessons||[]), lesson.id]
    const newPoints = (state.profile.points||0) + (lesson.xp||10)
    save({ ...state, completedLessons:newDone, profile:{ ...state.profile, points:newPoints } })
    toast(`✓ Mission complete! +${lesson.xp} XP`)
    setActiveLesson(null)
  }

  if(activeLesson) return <LessonPlayer lesson={activeLesson} onComplete={()=>completeLesson(activeLesson)} onBack={()=>setActiveLesson(null)} journey={journey}/>

  // Group lessons by track
  const byTrack = {}
  LESSONS.forEach(l=>{ if(!byTrack[l.track]) byTrack[l.track]=[]; byTrack[l.track].push(l) })
  const totalDone = done.size
  const totalLessons = LESSONS.length

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      {/* Hero header */}
      <div style={{ position:"relative",background:`linear-gradient(180deg,rgba(15,191,184,.12) 0%,transparent 100%)`,padding:"36px 22px 28px",overflow:"hidden" }}>
        <StarField count={20} style={{ opacity:.4 }}/>
        <div style={{ position:"relative",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:8 }}>Your journey</p>
              <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,28px)",fontWeight:900,marginBottom:6,lineHeight:1.2 }}>
                {journey ? `${journey.emoji} ${journey.character}'s mission` : "Financial missions"}
              </h2>
              <p style={{ color:T.muted,fontSize:14 }}>{totalDone} of {totalLessons} missions complete</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ width:56,height:56,borderRadius:"50%",background:T.card,border:`2px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",marginBottom:6 }}>
                <span style={{ fontSize:24 }}>🚀</span>
              </div>
              <p style={{ color:T.teal,fontWeight:800,fontSize:14 }}>{state.profile.points||0} XP</p>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop:16,background:T.surface,borderRadius:99,height:8,overflow:"hidden" }}>
            <div style={{ width:`${totalLessons>0?(totalDone/totalLessons)*100:0}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.tealMid})`,borderRadius:99,transition:"width .6s" }}/>
          </div>

          {/* Journey recommended missions */}
          {journey && (
            <div style={{ marginTop:22 }}>
              <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Recommended for you</p>
              <div style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:4 }}>
                {journey.lessonsFirst.slice(0,3).map(id=>{
                  const l = LESSONS.find(x=>x.id===id)
                  if(!l) return null
                  const isDone = done.has(l.id)
                  return (
                    <button key={id} onClick={()=>setActiveLesson(l)}
                      style={{ background:isDone?T.card:`${journey.color}18`,border:`2px solid ${isDone?T.border:journey.color}60`,borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",minWidth:180,flexShrink:0,transition:"all .2s" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                        <span style={{ fontSize:22 }}>{l.emoji}</span>
                        {isDone&&<Check size={14} color={T.green}/>}
                      </div>
                      <p style={{ color:isDone?T.muted:T.white,fontWeight:700,fontSize:13,lineHeight:1.3,marginBottom:4 }}>{l.title}</p>
                      <p style={{ color:T.subtle,fontSize:11 }}>+{l.xp} XP · {l.cards?.length} cards</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Track sections */}
      <div style={{ padding:"20px 18px",maxWidth:1100,margin:"0 auto",width:"100%" }}>
        {TRACKS_ORDER.map(track=>{
          const lessons = byTrack[track.id]
          if(!lessons?.length) return null
          const trackDone = lessons.filter(l=>done.has(l.id)).length
          const allDone = trackDone===lessons.length
          return (
            <div key={track.id} style={{ marginBottom:32 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                <div style={{ width:36,height:36,borderRadius:10,background:track.dim,border:`1.5px solid ${track.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{track.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ color:allDone?track.color:T.white,fontWeight:800,fontSize:15 }}>{track.id} {allDone&&"✓"}</p>
                  <p style={{ color:T.muted,fontSize:12 }}>{trackDone}/{lessons.length} complete</p>
                </div>
                <div style={{ background:T.surface,borderRadius:99,height:4,width:80,overflow:"hidden" }}>
                  <div style={{ width:`${(trackDone/lessons.length)*100}%`,height:"100%",background:track.color,borderRadius:99 }}/>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {lessons.map((l,i)=>{
                  const isDone = done.has(l.id)
                  const isLocked = !isDone && i>0 && !done.has(lessons[i-1]?.id) && trackDone===0
                  return (
                    <button key={l.id} onClick={()=>!isLocked&&setActiveLesson(l)}
                      style={{ background:isDone?`${track.color}10`:T.card,border:`1.5px solid ${isDone?track.color+"50":isLocked?T.border:T.borderLight}`,borderRadius:16,padding:"16px 18px",cursor:isLocked?"default":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14,transition:"all .2s",opacity:isLocked?.5:1 }}>
                      <div style={{ width:44,height:44,borderRadius:14,background:isDone?`${track.color}25`:isLocked?T.surface:track.dim,border:`1.5px solid ${isDone?track.color+"60":isLocked?T.border:track.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
                        {isDone?"✅":isLocked?<Lock size={16} color={T.subtle}/>:l.emoji}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ color:isDone?T.muted:isLocked?T.subtle:T.white,fontWeight:700,fontSize:14,lineHeight:1.3,marginBottom:4 }}>{l.title}</p>
                        <div style={{ display:"flex",gap:10 }}>
                          <span style={{ color:T.subtle,fontSize:11 }}>{l.cards?.length||"?"} cards</span>
                          <span style={{ color:isDone?"#34D399":track.color,fontSize:11,fontWeight:700 }}>{isDone?"✓ Done":`+${l.xp} XP`}</span>
                        </div>
                      </div>
                      {!isDone&&!isLocked&&<ChevronRight size={16} color={T.muted}/>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Lesson Player ────────────────────────────────────────────────────────── */
function LessonPlayer({ lesson, onComplete, onBack, journey }) {
  const [cardIdx, setCardIdx] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [ranked, setRanked]   = useState([])
  const [matchSel, setMatchSel] = useState(null)
  const [matchDone, setMatchDone] = useState(new Set())
  const [sliderVal, setSliderVal] = useState(null)
  const [shuffledDefs, setShuffledDefs] = useState([])

  const card = lesson.cards[cardIdx]
  const isLast = cardIdx === lesson.cards.length - 1
  const color = lesson.trackColor || T.teal

  useEffect(()=>{
    setAnswered(null)
    setMatchSel(null)
    setMatchDone(new Set())
    setRanked([])
    if(card?.type==="slider") setSliderVal(card.defaultVal)
    if(card?.type==="match") {
      const defs = [...card.pairs.map(p=>p.def)]
      // Fisher-Yates shuffle
      for(let i=defs.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1));[defs[i],defs[j]]=[defs[j],defs[i]] }
      setShuffledDefs(defs)
    }
  },[cardIdx])

  function next() {
    if(isLast) { onComplete(); return }
    setCardIdx(i=>i+1)
  }

  function handleAnswer(idx) {
    if(answered!==null) return
    setAnswered(idx)
  }

  const sliderResult = useMemo(()=>{
    if(card?.type==="slider"&&sliderVal!=null&&card.compute) { try { return card.compute(sliderVal) } catch { return null } }
    return null
  },[card,sliderVal])

  const sliderInsight = useMemo(()=>{
    if(card?.type==="slider"&&sliderVal!=null&&card.insight) { try { return card.insight(sliderVal) } catch { return null } }
    return null
  },[card,sliderVal])

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden" }}>
      <StarField count={25}/>
      {/* Top gradient for colour theme */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:200,background:`linear-gradient(180deg,${color}18 0%,transparent 100%)`,pointerEvents:"none" }}/>

      {/* Header */}
      <div style={{ position:"relative",display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:`1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",display:"flex",padding:4 }}><ChevronLeft size={20}/></button>
        <div style={{ flex:1 }}>
          <p style={{ color,fontWeight:700,fontSize:12,letterSpacing:.5 }}>{lesson.track}</p>
          <p style={{ color:T.white,fontWeight:700,fontSize:13,lineHeight:1.2 }}>{lesson.title}</p>
        </div>
        <span style={{ color:T.muted,fontSize:12 }}>{cardIdx+1}/{lesson.cards.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ background:T.surface,height:4,overflow:"hidden" }}>
        <div style={{ width:`${((cardIdx+1)/lesson.cards.length)*100}%`,height:"100%",background:color,transition:"width .5s ease" }}/>
      </div>

      {/* Card content */}
      <div key={cardIdx} className="ls-slidein" style={{ position:"relative",flex:1,overflowY:"auto",padding:"24px 22px 20px",maxWidth:560,margin:"0 auto",width:"100%" }}>

        {/* FACT card */}
        {card.type==="fact" && (
          <FactCard card={card} color={color} journey={journey}/>
        )}

        {/* SCENARIO card */}
        {card.type==="scenario" && (
          <ScenarioCard card={card} color={color} answered={answered} onAnswer={handleAnswer}/>
        )}

        {/* QUIZ card */}
        {card.type==="quiz" && (
          <QuizCard card={card} color={color} answered={answered} onAnswer={handleAnswer}/>
        )}

        {/* MATCH card */}
        {card.type==="match" && (
          <MatchCard card={card} color={color} shuffledDefs={shuffledDefs} matchSel={matchSel} setMatchSel={setMatchSel} matchDone={matchDone} setMatchDone={setMatchDone}/>
        )}

        {/* SLIDER card */}
        {card.type==="slider" && (
          <SliderCard card={card} color={color} sliderVal={sliderVal} setSliderVal={setSliderVal} result={sliderResult} insight={sliderInsight}/>
        )}

        {/* INTERACTIVE (growth chart) */}
        {card.type==="interactive" && card.id==="growth_chart" && (
          <GrowthChartCard color={color} hint={card.hint}/>
        )}

        {/* RANK card */}
        {card.type==="rank" && (
          <RankCard card={card} color={color} ranked={ranked} setRanked={setRanked}/>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"relative",padding:"12px 22px 32px",maxWidth:560,margin:"0 auto",width:"100%" }}>
        {card.type==="quiz"||card.type==="scenario" ? (
          answered!==null && (
            <Btn onClick={next}>
              {isLast ? "Complete mission 🎉" : "Continue →"}
            </Btn>
          )
        ) : card.type==="match" ? (
          matchDone.size===card.pairs?.length&&(
            <Btn onClick={next}>{isLast?"Complete mission 🎉":"Continue →"}</Btn>
          )
        ) : card.type==="rank" ? (
          ranked.length===card.items?.length&&(
            <Btn onClick={next}>{isLast?"Complete mission 🎉":"Continue →"}</Btn>
          )
        ) : (
          <Btn onClick={next}>
            {isLast ? "Complete mission 🎉" : "Next →"}
          </Btn>
        )}
      </div>
    </div>
  )
}

/* ── Individual Card Types ─────────────────────────────────────────────── */

function FactCard({ card, color, journey }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div>
      {/* Character / emoji badge */}
      {journey && (
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
          <div style={{ width:42,height:42,borderRadius:13,background:journey.dim,border:`2px solid ${journey.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 0 16px ${journey.color}30` }}>
            {journey.emoji}
          </div>
          <div>
            <p style={{ color:journey.color,fontWeight:700,fontSize:12,letterSpacing:.5 }}>{journey.character}</p>
            <p style={{ color:T.muted,fontSize:11 }}>Your guide</p>
          </div>
        </div>
      )}

      <h2 style={{ color:T.white,fontSize:"clamp(18px,4vw,24px)",fontWeight:900,lineHeight:1.3,marginBottom:16 }}>{card.headline}</h2>
      <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.8,marginBottom:card.highlight||card.facts?20:0 }}>
        {card.body}
      </p>

      {card.highlight && (
        <div style={{ background:`${color}15`,border:`1.5px solid ${color}40`,borderRadius:14,padding:"14px 18px",marginBottom:card.facts?20:0 }}>
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
      {card.context && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",marginBottom:18 }}>
          <p style={{ color:T.muted,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Scenario</p>
          <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.7 }}>{card.context}</p>
        </div>
      )}
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:20 }}>{card.prompt}</h2>
      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
        {card.choices.map((c,i)=>{
          const sel = answered===i
          const good = sel && c.best
          const bad  = sel && !c.best
          const showResult = answered!==null
          const isBest = showResult && c.best
          return (
            <button key={i} onClick={()=>onAnswer(i)}
              style={{ background:isBest?"rgba(52,211,153,.12)":bad?T.redDim:T.card,border:`2px solid ${isBest?"#34D399":bad?T.red:sel?color:T.border}`,borderRadius:14,padding:"16px 18px",cursor:answered===null?"pointer":"default",textAlign:"left",fontFamily:"inherit",transition:"all .2s" }}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                <div style={{ width:26,height:26,borderRadius:"50%",border:`2px solid ${isBest?"#34D399":bad?T.red:T.border}`,background:isBest?"rgba(52,211,153,.2)":bad?T.redDim:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                  {isBest&&<Check size={13} color="#34D399"/>}
                  {bad&&<X size={13} color={T.red}/>}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,lineHeight:1.4,marginBottom:showResult?6:0 }}>{c.label}</p>
                  {showResult&&(isBest||bad)&&<p style={{ color:isBest?"#34D399":T.muted,fontSize:13,lineHeight:1.6 }}>{c.outcome}</p>}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      {answered!==null&&card.explanation&&(
        <div style={{ background:`${color}12`,border:`1px solid ${color}30`,borderRadius:14,padding:"14px 18px" }}>
          <p style={{ color,fontWeight:700,fontSize:13,lineHeight:1.6 }}>💡 {card.explanation}</p>
        </div>
      )}
    </div>
  )
}

function QuizCard({ card, color, answered, onAnswer }) {
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:22 }}>{card.question}</h2>
      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
        {card.options.map((opt,i)=>{
          const sel = answered===i
          const correct = i===card.correct
          const showResult = answered!==null
          const isGood = showResult&&correct
          const isBad  = showResult&&sel&&!correct
          return (
            <button key={i} onClick={()=>onAnswer(i)}
              style={{ background:isGood?"rgba(52,211,153,.12)":isBad?T.redDim:T.card,border:`2px solid ${isGood?"#34D399":isBad?T.red:sel?color:T.border}`,borderRadius:13,padding:"14px 18px",cursor:answered===null?"pointer":"default",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,transition:"all .2s" }}>
              <div style={{ width:26,height:26,borderRadius:"50%",border:`2px solid ${isGood?"#34D399":isBad?T.red:T.border}`,background:isGood?"rgba(52,211,153,.2)":isBad?T.redDim:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                {isGood&&<Check size={13} color="#34D399"/>}
                {isBad&&<X size={13} color={T.red}/>}
                {!showResult&&<span style={{ color:T.subtle,fontSize:12,fontWeight:700 }}>{String.fromCharCode(65+i)}</span>}
              </div>
              <p style={{ color:T.white,fontWeight:600,fontSize:14,lineHeight:1.4 }}>{opt}</p>
            </button>
          )
        })}
      </div>
      {answered!==null&&(
        <div style={{ background:`${color}12`,border:`1px solid ${color}30`,borderRadius:14,padding:"14px 18px" }}>
          <p style={{ color,fontWeight:700,fontSize:13,lineHeight:1.6 }}>{answered===card.correct?"✅":"❌"} {card.explanation}</p>
        </div>
      )}
    </div>
  )
}

function MatchCard({ card, color, shuffledDefs, matchSel, setMatchSel, matchDone, setMatchDone }) {
  // matchDone = Set of termIdx strings that are matched
  function handleTerm(i) {
    if(matchDone.has(String(i))) return
    setMatchSel({ type:"term", idx:i })
  }
  function handleDef(defPos) {
    if(matchSel?.type==="term") {
      // find which term belongs to this def position
      const defText = shuffledDefs[defPos]
      const termIdx = card.pairs.findIndex(p=>p.def===defText)
      if(termIdx===matchSel.idx) {
        // correct
        setMatchDone(s=>{ const n=new Set(s); n.add(String(termIdx)); return n })
        setMatchSel(null)
      } else {
        // wrong flash
        setMatchSel({ type:"wrong", defPos, termIdx:matchSel.idx })
        setTimeout(()=>setMatchSel(null),800)
      }
    }
  }
  const allDone = matchDone.size===card.pairs?.length

  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:6 }}>{card.prompt}</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:22 }}>Tap a term, then tap the matching definition.</p>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
        {/* Terms */}
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>Terms</p>
          {card.pairs.map((p,i)=>{
            const matched = matchDone.has(String(i))
            const sel = matchSel?.type==="term"&&matchSel?.idx===i
            return (
              <button key={i} onClick={()=>handleTerm(i)}
                style={{ background:matched?"rgba(52,211,153,.12)":sel?`${color}20`:T.card,border:`2px solid ${matched?"#34D399":sel?color:T.border}`,borderRadius:12,padding:"12px 14px",cursor:matched?"default":"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s",opacity:matched?.7:1 }}>
                <p style={{ color:matched?"#34D399":sel?T.white:T.muted,fontWeight:700,fontSize:13 }}>{p.term}</p>
              </button>
            )
          })}
        </div>
        {/* Shuffled definitions */}
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>Definitions</p>
          {shuffledDefs.map((def,pos)=>{
            const termIdx = card.pairs.findIndex(p=>p.def===def)
            const matched = matchDone.has(String(termIdx))
            const wrong = matchSel?.type==="wrong"&&matchSel?.defPos===pos
            return (
              <button key={pos} onClick={()=>handleDef(pos)}
                style={{ background:matched?"rgba(52,211,153,.12)":wrong?T.redDim:matchSel?.type==="term"?`${color}08`:T.card,border:`2px solid ${matched?"#34D399":wrong?T.red:matchSel?.type==="term"?color+"30":T.border}`,borderRadius:12,padding:"12px 14px",cursor:matched?"default":"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s",opacity:matched?.7:1 }}>
                <p style={{ color:matched?"#34D399":T.muted,fontWeight:600,fontSize:12,lineHeight:1.4 }}>{def}</p>
              </button>
            )
          })}
        </div>
      </div>
      {allDone&&(
        <div style={{ background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.3)",borderRadius:14,padding:"14px 18px" }}>
          <p style={{ color:"#34D399",fontWeight:700,fontSize:14,marginBottom:4 }}>All matched! 🎉</p>
          {card.explanation&&<p style={{ color:T.muted,fontSize:13,lineHeight:1.6 }}>{card.explanation}</p>}
        </div>
      )}
    </div>
  )
}

function SliderCard({ card, color, sliderVal, setSliderVal, result, insight }) {
  const pct = sliderVal!=null&&card.max&&card.min ? ((sliderVal-card.min)/(card.max-card.min))*100 : 50
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:20 }}>{card.prompt}</h2>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
          <p style={{ color:T.muted,fontSize:13 }}>{card.label}</p>
          <p style={{ color,fontWeight:800,fontSize:16 }}>{card.prefix||""}{sliderVal?.toLocaleString("en-GB")||0}</p>
        </div>
        <input type="range" min={card.min} max={card.max} step={card.step||1000} value={sliderVal||card.min}
          onChange={e=>setSliderVal(Number(e.target.value))}
          style={{ width:"100%",accentColor:color,height:6,cursor:"pointer" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
          <span style={{ color:T.subtle,fontSize:11 }}>{card.prefix||""}{card.min?.toLocaleString("en-GB")}</span>
          <span style={{ color:T.subtle,fontSize:11 }}>{card.prefix||""}{card.max?.toLocaleString("en-GB")}</span>
        </div>
      </div>
      {result&&(
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 18px",marginBottom:16 }}>
          {result.map((r,i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<result.length-1?`1px solid ${T.border}`:undefined }}>
              <p style={{ color:T.muted,fontSize:13 }}>{r.label}</p>
              <p style={{ color:r.highlight?color:T.white,fontWeight:r.highlight?800:600,fontSize:13 }}>{r.value}</p>
            </div>
          ))}
        </div>
      )}
      {insight&&<div style={{ background:`${color}12`,border:`1px solid ${color}30`,borderRadius:14,padding:"14px 18px" }}><p style={{ color,fontWeight:600,fontSize:13,lineHeight:1.6 }}>💡 {insight}</p></div>}
    </div>
  )
}

function RankCard({ card, color, ranked, setRanked }) {
  const remaining = card.items?.filter(x=>!ranked.includes(x))||[]
  const allDone = ranked.length===card.items?.length
  function pick(item) { if(!ranked.includes(item)) setRanked(r=>[...r,item]) }
  function remove(item) { setRanked(r=>r.filter(x=>x!==item)) }
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:6 }}>{card.prompt}</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Tap in your preferred order — tap to add, tap again to remove.</p>
      {ranked.length>0&&(
        <div style={{ marginBottom:16 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Your ranking</p>
          {ranked.map((item,i)=>(
            <div key={item} onClick={()=>remove(item)} style={{ display:"flex",alignItems:"center",gap:10,background:`${color}12`,border:`1px solid ${color}30`,borderRadius:11,padding:"10px 14px",marginBottom:6,cursor:"pointer" }}>
              <span style={{ color,fontWeight:900,fontSize:15,width:24 }}>#{i+1}</span>
              <p style={{ color:T.white,fontSize:13,fontWeight:600,flex:1 }}>{item}</p>
              <X size={13} color={T.muted}/>
            </div>
          ))}
        </div>
      )}
      {remaining.length>0&&(
        <div>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Options</p>
          {remaining.map(item=>(
            <button key={item} onClick={()=>pick(item)} style={{ width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:"11px 14px",marginBottom:6,cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:T.muted,fontSize:13,fontWeight:600 }}>{item}</button>
          ))}
        </div>
      )}
      {allDone&&(
        <div style={{ background:`${color}12`,border:`1px solid ${color}30`,borderRadius:14,padding:"14px 18px",marginTop:12 }}>
          <p style={{ color:T.muted,fontSize:13,lineHeight:1.7 }}>{card.answer}</p>
        </div>
      )}
    </div>
  )
}

function GrowthChartCard({ color, hint }) {
  const [monthly, setMonthly] = useState(200)
  const [years, setYears]     = useState(20)
  const data = useMemo(()=>{
    const d=[]; let total=0,invested=0
    for(let y=0;y<=years;y++){ invested=monthly*12*y; total=y===0?0:monthly*12*((Math.pow(1.07,y)-1)/0.07); d.push({ year:y,invested:Math.round(invested),total:Math.round(total) }) }
    return d
  },[monthly,years])
  const fmtAx = v => v>=1000?`£${(v/1000).toFixed(0)}k`:''
  const interest = data[data.length-1]?.total - data[data.length-1]?.invested
  return (
    <div>
      <h2 style={{ color:T.white,fontSize:"clamp(17px,3.5vw,22px)",fontWeight:900,lineHeight:1.3,marginBottom:6 }}>See compound growth in action</h2>
      <p style={{ color:T.muted,fontSize:13,marginBottom:20 }}>Adjust the sliders to see how time and amount affect your outcome.</p>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <p style={{ color:T.muted,fontSize:12 }}>Monthly</p>
            <p style={{ color,fontWeight:800,fontSize:14 }}>£{monthly}</p>
          </div>
          <input type="range" min="50" max="2000" step="50" value={monthly} onChange={e=>setMonthly(Number(e.target.value))} style={{ width:"100%",accentColor:color }}/>
        </div>
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <p style={{ color:T.muted,fontSize:12 }}>Years</p>
            <p style={{ color,fontWeight:800,fontSize:14 }}>{years}y</p>
          </div>
          <input type="range" min="5" max="40" step="5" value={years} onChange={e=>setYears(Number(e.target.value))} style={{ width:"100%",accentColor:color }}/>
        </div>
      </div>
      <div style={{ height:160,marginBottom:16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4,right:4,bottom:0,left:0 }}>
            <defs>
              <linearGradient id="gTot" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={.25}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient>
              <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.muted} stopOpacity={.15}/><stop offset="95%" stopColor={T.muted} stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fontSize:10,fill:T.muted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}y`}/>
            <YAxis tick={{ fontSize:9,fill:T.subtle }} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={36}/>
            <Tooltip formatter={(v,n)=>[fmt(v),n==="total"?"With compound growth":"Amount invested"]} contentStyle={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white }}/>
            <Area type="monotone" dataKey="invested" stroke={T.muted} strokeWidth={1.5} fill="url(#gInv)" dot={false}/>
            <Area type="monotone" dataKey="total" stroke={color} strokeWidth={2} fill="url(#gTot)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background:`${color}12`,border:`1px solid ${color}30`,borderRadius:12,padding:"12px 16px",marginBottom:12 }}>
        <p style={{ color,fontWeight:800,fontSize:15,marginBottom:3 }}>£{fmt(interest)} in compound growth</p>
        <p style={{ color:T.muted,fontSize:12 }}>vs £{fmt(data[data.length-1]?.invested||0)} you actually put in</p>
      </div>
      {hint&&<p style={{ color:T.muted,fontSize:13,lineHeight:1.6,fontStyle:"italic" }}>{hint}</p>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   ME TAB — Profile, XP level, badges
   ══════════════════════════════════════════════════════════════════════════ */
function MeTab() {
  const { state, reset, save, toast } = useApp()
  const xp = state.profile.points||0
  const lvl = getLevelInfo(xp)
  const nextLvl = getNextLevel(xp)
  const pctToNext = nextLvl ? Math.round(((xp-lvl.min)/(nextLvl.min-lvl.min))*100) : 100
  const earned = BADGES.filter(b=>b.condition(state))
  const locked = BADGES.filter(b=>!b.condition(state))
  const journey = JOURNEYS.find(j=>j.id===state.profile?.journeyId)
  const { netWorth, totalAssets, totalDebts } = calcTotals(state.assets, state.debts)
  const completedLessons = state.completedLessons||[]

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      <div style={{ padding:"28px 18px",maxWidth:900,margin:"0 auto",width:"100%" }}>

        {/* Profile hero */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"24px",marginBottom:20,position:"relative",overflow:"hidden" }}>
          <StarField count={15} style={{ opacity:.3 }}/>
          <div style={{ position:"relative",display:"flex",alignItems:"flex-start",gap:16 }}>
            <div style={{ width:60,height:60,borderRadius:18,background:journey?journey.dim:T.tealDim,border:`2px solid ${journey?journey.color:T.teal}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:journey?`0 0 24px ${journey.color}30`:undefined }}>
              {journey?.emoji||"🚀"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
                <p style={{ color:T.white,fontWeight:900,fontSize:20 }}>{state.profile.name||"Your profile"}</p>
                {state.profile.age && <span style={{ color:T.muted,fontSize:14 }}>· {state.profile.age}</span>}
              </div>
              {journey && <p style={{ color:journey.color,fontWeight:700,fontSize:13,marginBottom:4 }}>{journey.title}</p>}
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:14 }}>{lvl.emoji}</span>
                <span style={{ color:T.muted,fontSize:13 }}>Level {lvl.level} · {lvl.label}</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:T.teal,fontWeight:900,fontSize:24 }}>{xp}</p>
              <p style={{ color:T.muted,fontSize:11 }}>XP</p>
            </div>
          </div>

          {/* XP progress */}
          {nextLvl && (
            <div style={{ position:"relative",marginTop:20 }}>
              <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:6 }}>
                <div style={{ width:`${pctToNext}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.tealMid})`,borderRadius:99,transition:"width .8s ease" }}/>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between" }}>
                <span style={{ color:T.subtle,fontSize:11 }}>{xp} XP</span>
                <span style={{ color:T.muted,fontSize:11 }}>{nextLvl.emoji} {nextLvl.label} at {nextLvl.min} XP · {nextLvl.min-xp} to go</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20 }}>
          {[
            { l:"Net worth",  v:fmtK(netWorth),            c:netWorth>=0?T.teal:T.red },
            { l:"Lessons",    v:`${completedLessons.length}/${LESSONS.length}`, c:T.purple },
            { l:"Badges",     v:`${earned.length}/${BADGES.length}`,             c:T.amber  },
          ].map(k=>(
            <div key={k.l} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px",textAlign:"center" }}>
              <p style={{ color:k.c,fontWeight:900,fontSize:20,fontVariantNumeric:"tabular-nums" }}>{k.v}</p>
              <p style={{ color:T.muted,fontSize:11,marginTop:3 }}>{k.l}</p>
            </div>
          ))}
        </div>

        {/* Journey progress roadmap */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"22px",marginBottom:20 }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:16 }}>Level roadmap</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {XP_LEVELS.map((l,i)=>{
              const curr = getLevelInfo(xp).level === l.level
              const done = xp >= l.min
              return (
                <div key={l.level} style={{ display:"flex",alignItems:"center",gap:12,background:curr?`${T.teal}10`:undefined,border:`1px solid ${curr?T.tealBorder:T.border}`,borderRadius:11,padding:"11px 14px",transition:"all .2s" }}>
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

        {/* Badges earned */}
        {earned.length>0 && (
          <div style={{ marginBottom:20 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Badges earned</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10 }}>
              {earned.map(b=>(
                <div key={b.id} style={{ background:T.card,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"16px 14px",textAlign:"center" }}>
                  <div style={{ fontSize:28,marginBottom:8 }}>{b.emoji}</div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:12,marginBottom:3 }}>{b.label}</p>
                  <p style={{ color:T.muted,fontSize:10,lineHeight:1.4 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges */}
        {locked.length>0 && (
          <div style={{ marginBottom:24 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Locked</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10 }}>
              {locked.map(b=>(
                <div key={b.id} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 14px",textAlign:"center",opacity:.6 }}>
                  <div style={{ fontSize:28,marginBottom:8,filter:"grayscale(1)" }}>{b.emoji}</div>
                  <p style={{ color:T.subtle,fontWeight:700,fontSize:12,marginBottom:3 }}>{b.label}</p>
                  <p style={{ color:T.subtle,fontSize:10,lineHeight:1.4 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings / reset */}
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

/* ══════════════════════════════════════════════════════════════════════════
   BOTTOM NAV
   ══════════════════════════════════════════════════════════════════════════ */
function BottomNav() {
  const { tab, setTab, state } = useApp()
  const completedLessons = state.completedLessons||[]
  const hasNewLesson = completedLessons.length < LESSONS.length

  const TABS = [
    { icon:Home,      label:"Home",    idx:0 },
    { icon:BookOpen,  label:"Learn",   idx:1, dot:hasNewLesson },
    { icon:Target,    label:"Goals",   idx:2 },
    { icon:TrendingUp,label:"Track",   idx:3 },
    { icon:User,      label:"Me",      idx:4 },
  ]

  return (
    <nav style={{ background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",height:68,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)",paddingLeft:4,paddingRight:4 }}>
      {TABS.map(t=>{
        const active = tab===t.idx
        const Icon = t.icon
        return (
          <button key={t.idx} onClick={()=>setTab(t.idx)}
            style={{ flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"8px 0",position:"relative",transition:"all .15s" }}>
            <div style={{ position:"relative" }}>
              <Icon size={22} color={active?T.teal:T.muted} strokeWidth={active?2.5:1.8}/>
              {t.dot && !active && (
                <div style={{ position:"absolute",top:-2,right:-2,width:8,height:8,borderRadius:"50%",background:T.teal,border:`2px solid ${T.surface}` }}/>
              )}
            </div>
            <span style={{ fontSize:10,fontWeight:active?700:500,color:active?T.teal:T.muted,transition:"color .15s",letterSpacing:.2 }}>{t.label}</span>
            {active && <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:20,height:3,borderRadius:"3px 3px 0 0",background:T.teal }}/>}
          </button>
        )
      })}
    </nav>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   APP SHELL
   ══════════════════════════════════════════════════════════════════════════ */
function AppShell() {
  const { tab, state } = useApp()
  const xp = state.profile.points||0
  const lvl = getLevelInfo(xp)
  const journey = JOURNEYS.find(j=>j.id===state.profile?.journeyId)

  const CONTENT = [<HomeTab/>, <LearnTab/>, <GoalsTab/>, <TrackTab/>, <MeTab/>]

  return (
    <div style={{ height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden" }}>
      {/* Top bar */}
      <header style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"relative",zIndex:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:18 }}>🚀</span>
          <span style={{ color:T.teal,fontSize:12,fontWeight:800,letterSpacing:2.5 }}>LIFESMART</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          {journey && (
            <div style={{ background:journey.dim,border:`1px solid ${journey.border}`,borderRadius:99,padding:"4px 10px",display:"flex",alignItems:"center",gap:5 }}>
              <span style={{ fontSize:11 }}>{journey.emoji}</span>
              <span style={{ color:journey.color,fontWeight:700,fontSize:11 }}>{journey.character}</span>
            </div>
          )}
          <div style={{ display:"flex",alignItems:"center",gap:5,background:T.card,border:`1px solid ${T.border}`,borderRadius:99,padding:"4px 12px" }}>
            <span style={{ fontSize:12 }}>{lvl.emoji}</span>
            <span style={{ color:T.teal,fontWeight:800,fontSize:12 }}>{xp} XP</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0 }}>
        {CONTENT[tab]}
      </div>

      <BottomNav/>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT
   ══════════════════════════════════════════════════════════════════════════ */
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
