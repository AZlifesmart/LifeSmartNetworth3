import { useState, useEffect, useContext, createContext, useMemo, useRef } from "react"
import { Home, BookOpen, User, Check, X, ChevronLeft, ChevronRight, Pencil, Trash2, Plus, Star, Sparkles, TrendingUp, BarChart2, Shield, Lock, Target, Zap, Info, Clock } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from "recharts"

const G = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',system-ui,sans-serif;background:#070D1A;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type=number]{-moz-appearance:textfield}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1C2D47;border-radius:99px}

/* ── Keyframes ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes twinkle{0%,100%{opacity:.08;transform:scale(1)}50%{opacity:.9;transform:scale(1.6)}}
@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(15,191,184,.35)}70%{box-shadow:0 0 0 12px rgba(15,191,184,0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes countUp{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes slideCard{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes slideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(15,191,184,.15)}50%{box-shadow:0 0 50px rgba(15,191,184,.45)}}
@keyframes rocketFly{0%{transform:translate(-120px,60px) rotate(-20deg);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translate(calc(100vw + 120px),-60px) rotate(-20deg);opacity:0}}
@keyframes rocketBob{0%,100%{transform:translateY(0) rotate(-18deg)}50%{transform:translateY(-8px) rotate(-18deg)}}
@keyframes nebulaPulse{0%,100%{opacity:.18;transform:scale(1)}50%{opacity:.28;transform:scale(1.05)}}
@keyframes numberPop{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}

/* ── Utility classes ── */
.ls-float{animation:float 5s ease-in-out infinite}
.ls-star{animation:twinkle var(--d,2.5s) ease-in-out var(--dl,0s) infinite}
.ls-fadein{animation:fadeUp .5s ease-out forwards}
.ls-slidein{animation:slideIn .35s ease-out forwards}
.ls-slidecard{animation:slideCard .4s ease-out forwards}
.ls-countup{animation:countUp .65s cubic-bezier(.34,1.56,.64,1) forwards}
.ls-pulse{animation:pulse 2.5s ease-in-out infinite}
.ls-shimmer{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.05) 50%,transparent 100%);background-size:200% 100%;animation:shimmer 2.5s linear infinite}
.ls-glow{animation:glow 4s ease-in-out infinite}
.ls-rocket-fly{animation:rocketFly 6s ease-in-out forwards}
.ls-rocket-bob{animation:rocketBob 3s ease-in-out infinite}
.ls-nebula{animation:nebulaPulse 8s ease-in-out infinite}
.ls-numpop{animation:numberPop .5s cubic-bezier(.34,1.56,.64,1) forwards}

.ls-card-glass{
  background: linear-gradient(145deg, rgba(13,25,44,.97) 0%, rgba(9,17,32,.99) 100%);
  box-shadow: 0 1px 0 rgba(255,255,255,.04) inset, 0 8px 32px rgba(0,0,0,.4);
}
.ls-card-lift{
  transition: transform .18s ease, box-shadow .18s ease;
}
.ls-card-lift:hover{
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
}
button{-webkit-tap-highlight-color:transparent}
`

const T = {
  bg:"#070D1A", surface:"#0B1424", card:"#0F1D32", cardHover:"#142240",
  border:"#1B2C45", borderLight:"#223A5E",
  teal:"#0FBFB8", tealMid:"#14D4CC", tealDim:"rgba(15,191,184,.10)", tealBorder:"rgba(15,191,184,.30)",
  amber:"#F59E0B", amberDim:"rgba(245,158,11,.10)", amberBorder:"rgba(245,158,11,.28)",
  red:"#F87171", redDim:"rgba(248,113,113,.10)", redBorder:"rgba(248,113,113,.28)",
  purple:"#A78BFA", purpleDim:"rgba(167,139,250,.12)", purpleBorder:"rgba(167,139,250,.3)",
  green:"#34D399", greenDim:"rgba(52,211,153,.10)", blue:"#60A5FA", blueDim:"rgba(96,165,250,.1)", blueBorder:"rgba(96,165,250,.3)",
  white:"#F0F6FF", muted:"#8FA3BE", subtle:"#344D68", faint:"#162038"
}

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════
   PRIORITY MODES
   ════════════════════════════════════════════════════════════════════ */
const PRIORITY_MODES = [
  {
    id:"grow",   icon:"📈", label:"Grow my wealth",
    sub:"Track everything, grow your net worth, beat the numbers",
    color:T.teal, dim:T.tealDim, border:T.tealBorder,
    tagline:(n)=>`${n?n+", your":"Your"} wealth is compounding.`,
    encouragement:"Every figure you track is a decision made better.",
    primaryLesson:"compound_interest",
  },
  {
    id:"safety", icon:"🛡️", label:"Feel financially secure",
    sub:"Understand your safety net, reduce money stress, sleep better",
    color:T.green, dim:"rgba(52,211,153,.10)", border:"rgba(52,211,153,.30)",
    tagline:(n)=>`${n?n+", you're":"You're"} more secure than you think.`,
    encouragement:"Knowing your numbers is the cure for money anxiety.",
    primaryLesson:"nw_basics",
  },
  {
    id:"learn",  icon:"💡", label:"Learn about money",
    sub:"Build real financial knowledge from scratch, no jargon",
    color:T.purple, dim:T.purpleDim, border:T.purpleBorder,
    tagline:(n)=>`${n?n+", you're":"You're"} building knowledge that pays forever.`,
    encouragement:"Every lesson makes your next financial decision a better one.",
    primaryLesson:"nw_basics",
  },
  {
    id:"action", icon:"🎯", label:"Take action on my finances",
    sub:"Invest, buy a home, clear debt, get a clear plan",
    color:T.amber, dim:T.amberDim, border:T.amberBorder,
    tagline:(n)=>`${n?n+", your":"Your"} plan is taking shape.`,
    encouragement:"A clear plan is worth more than any individual financial decision.",
    primaryLesson:"pay_off_debt",
  },
]

/* ════════════════════════════════════════════════════════════════════
   MONEY PERSONALITY
   ════════════════════════════════════════════════════════════════════ */
function calcPersonality(state) {
  const assets  = state.assets||[]
  const debts   = state.debts||[]
  const mode    = state.profile?.mode||"grow"
  const age     = state.profile?.age||35
  const totalA  = assets.reduce((s,a)=>s+(a.value||0),0)
  const savings = assets.filter(a=>["savings","cash"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0)
  const invested= assets.filter(a=>["investment","stocks"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0)
  const pension = assets.filter(a=>a.category==="pension").reduce((s,a)=>s+(a.value||0),0)
  const property= assets.filter(a=>a.category==="property").reduce((s,a)=>s+(a.value||0),0)

  let mindset  = mode==="safety"?"security":mode==="learn"||mode==="action"?"freedom":"growth"
  if(mindset==="growth" && savings>invested*2) mindset="security"

  let behaviour = "starter"
  if(totalA>0){
    const ir = (invested+pension)/Math.max(totalA,1)
    if(property>0&&(invested+pension)>10000) behaviour="builder"
    else if(ir>0.5) behaviour="investor"
    else if(savings>5000) behaviour="saver"
  }

  let risk = "balanced"
  const ip = totalA>0?(invested+pension)/totalA:0
  if(ip>0.6&&age<50) risk="adventurous"
  else if(ip<0.2&&savings>0&&invested===0) risk="cautious"

  const ARCHETYPES = {
    "security-saver-cautious":     {name:"The Guardian",    emoji:"🛡️",color:T.green,  summary:"Your priority is protection. You build carefully and steadily and that discipline is a strength most people never develop."},
    "security-builder-balanced":   {name:"The Cultivator",  emoji:"🌱",color:T.teal,   summary:"You are building solid foundations while staying grounded. Growth is happening even when it feels slow."},
    "growth-investor-adventurous": {name:"The Accelerator", emoji:"🚀",color:T.teal,   summary:"You think long-term and are not fazed by short-term noise. Your money works as hard as you do."},
    "freedom-builder-balanced":    {name:"The Navigator",   emoji:"🧭",color:T.purple, summary:"You are working towards options. Every smart decision brings financial independence a step closer."},
    "freedom-starter-cautious":    {name:"The Learner",     emoji:"💡",color:T.purple, summary:"You are at the start of the journey and you know it. That self-awareness is rarer and more valuable than you think."},
    "growth-builder-balanced":     {name:"The Grower",      emoji:"⚡",color:T.amber,  summary:"You have real momentum and the habits are forming. The opportunity now is to make sure they are pointed the right way."},
    "growth-saver-balanced":       {name:"The Architect",   emoji:"🏗️",color:T.blue,   summary:"Strong foundations, but your money is not working hard enough yet. There is a clear and exciting next step available."},
    "freedom-investor-adventurous":{name:"The Opportunist", emoji:"🌊",color:T.amber,  summary:"You move decisively and back yourself. The opportunity is to make sure your foundations match your ambition."},
  }
  const key = `${mindset}-${behaviour}-${risk}`
  return { mindset, behaviour, risk, archetype:ARCHETYPES[key]||ARCHETYPES["freedom-starter-cautious"] }
}

const PERSONALITY_LOCKED = [
  {id:"risk",    icon:"🎯", label:"Your full risk profile",           unlock:"Complete 1 lesson",       check:(s)=>(s.completedLessons||[]).length>=1},
  {id:"balance", icon:"⚖️", label:"Saving vs investing balance",      unlock:"Add 3 or more assets",    check:(s)=>(s.assets||[]).length>=3},
  {id:"peers",   icon:"👥", label:"How you compare to your age group", unlock:"Update your figures 3 times", check:(s)=>(s.history||[]).length>=3},
  {id:"blindspot",icon:"🔍",label:"Your biggest financial blind spot", unlock:"Complete 3 lessons",      check:(s)=>(s.completedLessons||[]).length>=3},
]


/* ════════════════════════════════════════════════════════════════════
   FINANCIAL PERSONALITY QUIZ
   12 scenario questions · 6 dimensions · 8 archetypes
   ════════════════════════════════════════════════════════════════════ */
const PERSONALITY_QUIZ = [
  {
    id:"q1", dimension:"security_growth",
    headline:"You receive an unexpected £5,000.",
    sub:"What feels most natural?",
    options:[
      { label:"Add it straight to savings for security",             scores:{ security_growth:10, present_future:30, abundance_scarcity:30 } },
      { label:"Split it: half saved, half invested",                 scores:{ security_growth:45, present_future:60, abundance_scarcity:60 } },
      { label:"Invest most of it for long-term growth",             scores:{ security_growth:80, present_future:80, abundance_scarcity:80 } },
      { label:"Use it for something I've been putting off",         scores:{ security_growth:40, present_future:10, abundance_scarcity:70 } },
    ]
  },
  {
    id:"q2", dimension:"security_growth",
    headline:"Your investments drop 28% in three months.",
    sub:"What do you actually do?",
    options:[
      { label:"Sell some to limit further losses",                   scores:{ security_growth:10, emotional_risk:15 } },
      { label:"Do nothing and wait it out",                          scores:{ security_growth:55, emotional_risk:55 } },
      { label:"Buy more while prices are lower",                     scores:{ security_growth:90, emotional_risk:90 } },
      { label:"Check obsessively but don't act",                    scores:{ security_growth:35, emotional_risk:30 } },
    ]
  },
  {
    id:"q3", dimension:"present_future",
    headline:"You could either...",
    sub:"Which feels right for you?",
    options:[
      { label:"Have £500/month more to enjoy life now",              scores:{ present_future:10 } },
      { label:"Have £500/month more going into your pension",        scores:{ present_future:90 } },
      { label:"Pay off debts faster each month",                     scores:{ present_future:50, security_growth:30 } },
      { label:"Invest it in a Stocks and Shares ISA",               scores:{ present_future:75, security_growth:75 } },
    ]
  },
  {
    id:"q4", dimension:"present_future",
    headline:"Pension contributions.",
    sub:"Which is closest to how you think about yours?",
    options:[
      { label:"I contribute the minimum, retirement feels far away", scores:{ present_future:15 } },
      { label:"I contribute what I can but don't maximise",          scores:{ present_future:50 } },
      { label:"I maximise contributions, it is a real priority",    scores:{ present_future:90 } },
      { label:"I have not set one up yet",                           scores:{ present_future:10, abundance_scarcity:25 } },
    ]
  },
  {
    id:"q5", dimension:"systematic_intuitive",
    headline:"How do you make big financial decisions?",
    sub:"Like buying a car, switching mortgage, or making an investment.",
    options:[
      { label:"Research thoroughly, compare options, then decide",   scores:{ systematic_intuitive:10, simplicity_complexity:80 } },
      { label:"Get a gut feel for it and commit fairly quickly",     scores:{ systematic_intuitive:85, simplicity_complexity:30 } },
      { label:"Ask someone I trust first",                           scores:{ systematic_intuitive:40, independent_collaborative:20 } },
      { label:"Delay until I feel completely certain",               scores:{ systematic_intuitive:25, abundance_scarcity:25 } },
    ]
  },
  {
    id:"q6", dimension:"systematic_intuitive",
    headline:"Your relationship with budgeting.",
    sub:"Be honest, which is actually true?",
    options:[
      { label:"I have a clear budget and I follow it",               scores:{ systematic_intuitive:10 } },
      { label:"I have a rough idea and check in occasionally",       scores:{ systematic_intuitive:45 } },
      { label:"I track spending after the fact, loosely",            scores:{ systematic_intuitive:65 } },
      { label:"I do not track, I just know if I am okay",          scores:{ systematic_intuitive:90 } },
    ]
  },
  {
    id:"q7", dimension:"independent_collaborative",
    headline:"When it comes to financial advice.",
    sub:"What feels most true?",
    options:[
      { label:"I research everything myself and decide alone",        scores:{ independent_collaborative:10 } },
      { label:"I like a sounding board but make my own calls",       scores:{ independent_collaborative:45 } },
      { label:"I would value a trusted adviser to guide me",         scores:{ independent_collaborative:80 } },
      { label:"I discuss money openly with my partner or close friends", scores:{ independent_collaborative:65 } },
    ]
  },
  {
    id:"q8", dimension:"abundance_scarcity",
    headline:"When you spend money on yourself.",
    sub:"A meal out, a holiday, something you want.",
    options:[
      { label:"I feel good, I work hard for this",                 scores:{ abundance_scarcity:90 } },
      { label:"Fine, but I am conscious of the cost",               scores:{ abundance_scarcity:60 } },
      { label:"I often feel slightly guilty afterwards",             scores:{ abundance_scarcity:30 } },
      { label:"I find it genuinely difficult to justify",            scores:{ abundance_scarcity:10 } },
    ]
  },
  {
    id:"q9", dimension:"abundance_scarcity",
    headline:"Do you feel financially behind?",
    sub:"Compared to where you think you should be at your age.",
    options:[
      { label:"Rarely, I feel broadly on track",                   scores:{ abundance_scarcity:85 } },
      { label:"Sometimes, depending on my mood",                    scores:{ abundance_scarcity:55 } },
      { label:"Often, I worry I have not done enough",             scores:{ abundance_scarcity:30 } },
      { label:"Almost always, it is a persistent anxiety",         scores:{ abundance_scarcity:10 } },
    ]
  },
  {
    id:"q10", dimension:"simplicity_complexity",
    headline:"Your ideal financial setup.",
    sub:"If you could design it from scratch.",
    options:[
      { label:"One account, one fund, one simple plan",             scores:{ simplicity_complexity:10 } },
      { label:"A few accounts, clearly organised",                  scores:{ simplicity_complexity:40 } },
      { label:"Multiple accounts optimised for different purposes", scores:{ simplicity_complexity:75 } },
      { label:"A fully detailed portfolio I manage actively",        scores:{ simplicity_complexity:95 } },
    ]
  },
  {
    id:"q11", dimension:"emotional_risk",
    headline:"You have £20,000 to invest for 15 years.",
    sub:"Which option would you actually choose?",
    options:[
      { label:"Guaranteed 3.5% per year in a cash ISA",            scores:{ emotional_risk:10, security_growth:10 } },
      { label:"A cautious fund: expected 5%, could drop 15%",      scores:{ emotional_risk:35, security_growth:35 } },
      { label:"A balanced fund: expected 7%, could drop 30%",      scores:{ emotional_risk:65, security_growth:65 } },
      { label:"An adventurous fund: expected 9%, could drop 45%",  scores:{ emotional_risk:90, security_growth:90 } },
    ]
  },
  {
    id:"q12", dimension:"security_growth",
    headline:"Your honest relationship with money.",
    sub:"Which comes closest to how you actually feel?",
    options:[
      { label:"Money is safety, having enough lets me stop worrying",  scores:{ security_growth:15, abundance_scarcity:25 } },
      { label:"Money is a tool, I want it working efficiently",        scores:{ security_growth:55, systematic_intuitive:30 } },
      { label:"Money is opportunity, I want to grow it aggressively",  scores:{ security_growth:85, abundance_scarcity:80 } },
      { label:"Money is complicated, I wish I understood it better",   scores:{ abundance_scarcity:30, security_growth:40 } },
    ]
  },
]

// Dimension score ranges 0=fully first pole, 100=fully second pole
// security_growth:    0=security   100=growth
// present_future:     0=present    100=future
// systematic_intuitive: 0=systematic 100=intuitive
// independent_collaborative: 0=independent 100=collaborative
// abundance_scarcity: 0=scarcity   100=abundance
// simplicity_complexity: 0=simplicity 100=complexity
// emotional_risk:     0=cautious   100=adventurous

function calcQuizPersonality(answers, state) {
  // answers = { q1: optionIndex, q2: optionIndex, ... }
  const scores = {
    security_growth:0, present_future:0, systematic_intuitive:0,
    independent_collaborative:0, abundance_scarcity:0, simplicity_complexity:0, emotional_risk:0
  }
  const counts = { ...scores }

  PERSONALITY_QUIZ.forEach(q => {
    const ai = answers[q.id]
    if(ai === undefined || ai === null) return
    const option = q.options[ai]
    if(!option) return
    Object.entries(option.scores).forEach(([dim, val]) => {
      scores[dim] = (scores[dim]||0) + val
      counts[dim] = (counts[dim]||0) + 1
    })
  })

  // Normalise to 0-100
  const norm = {}
  Object.keys(scores).forEach(dim => {
    norm[dim] = counts[dim] > 0 ? Math.round(scores[dim] / counts[dim]) : 50
  })

  // Overlay behavioural data from actual assets/debts
  const assets  = state.assets||[]
  const totalA  = assets.reduce((s,a)=>s+(a.value||0),0)
  const savings = assets.filter(a=>["savings","cash"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0)
  const invested= assets.filter(a=>["investment","stocks"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0)
  const pension = assets.filter(a=>a.category==="pension").reduce((s,a)=>s+(a.value||0),0)
  const debts   = state.debts||[]
  const highRateDebt = debts.filter(d=>(d.interestRate||0)>15).reduce((s,d)=>s+(d.balance||0),0)

  // Blend quiz score with behavioural signal (70% quiz, 30% behaviour)
  if(totalA > 0) {
    const investRatio = (invested+pension)/totalA
    const behaviouralGrowth = Math.round(investRatio*100)
    norm.security_growth = Math.round(norm.security_growth*0.7 + behaviouralGrowth*0.3)
  }
  if(assets.length >= 3) {
    // Many accounts → complexity leaning
    norm.simplicity_complexity = Math.min(100, norm.simplicity_complexity + 10)
  }

  // Classify each dimension
  const sg  = norm.security_growth > 55 ? "growth" : norm.security_growth < 45 ? "security" : "balanced"
  const pf  = norm.present_future  > 55 ? "future" : norm.present_future  < 45 ? "present"  : "balanced"
  const si  = norm.systematic_intuitive > 55 ? "intuitive" : norm.systematic_intuitive < 45 ? "systematic" : "balanced"
  const ic  = norm.independent_collaborative > 55 ? "collaborative" : "independent"
  const as  = norm.abundance_scarcity > 55 ? "abundance" : norm.abundance_scarcity < 45 ? "scarcity" : "balanced"
  const sc  = norm.simplicity_complexity > 55 ? "complexity" : "simplicity"
  const er  = norm.emotional_risk > 65 ? "adventurous" : norm.emotional_risk < 40 ? "cautious" : "balanced"

  // Derive archetype from primary 3 dimensions
  const ARCHETYPES = {
    "security-present-systematic":   { id:"guardian",     name:"The Guardian",     emoji:"🛡️", color:"#34D399",
      headline:"Protection first. Always.",
      summary:"Your core belief is that financial security is freedom. You sleep better when the safety net is full, the bills are covered, and there are no nasty surprises waiting. You are methodical, careful, and consistent, which means you build slowly but you build durably.",
      traits:["Values certainty over upside","Fully funds emergency reserves before investing","Prefers guaranteed returns to market exposure","Tracks spending carefully","Finds financial surprises deeply uncomfortable"],
      scenarios:["You are very likely to keep 6+ months of expenses in cash savings","You probably feel anxious when your bank balance drops below a mental threshold","An IFA offering a cautious managed portfolio would suit you well","The 50/30/20 budgeting rule would feel natural and reassuring to follow","You would choose a lower fixed-rate mortgage over a cheaper variable rate"],
      blind_spot:"Your caution protects you but may cost you significantly in long-term returns. The risk of being too safe is real.",
      next_step:"Consider putting anything above 6 months emergency fund into a low-cost global index fund." },

    "security-future-systematic":    { id:"cultivator",   name:"The Cultivator",   emoji:"🌱", color:"#0FBFB8",
      headline:"Building carefully, for the long run.",
      summary:"You have patience and discipline, a rare combination. You think ahead, contribute consistently, and feel most secure when you know the future is being taken care of. You may not be the most adventurous investor but you are one of the most reliable.",
      traits:["Consistent long-term saver and investor","Prioritises pension and future security","Prefers structured plans over gut feel","Values financial stability deeply","Methodical, you follow through on financial commitments"],
      scenarios:["You are likely already contributing regularly to a pension or ISA","A financial adviser who provides a clear structured long-term plan would suit you","You would benefit from automated contributions so you never have to decide each month","You probably use a spreadsheet or budgeting app","You are uncomfortable with debt and likely pay more than the minimum"],
      blind_spot:"Your focus on security can mean you under-invest in growth assets. Your future self would likely be fine with more equity exposure.",
      next_step:"Review whether your pension contribution rate is genuinely maximising your employer match." },

    "growth-future-intuitive":       { id:"accelerator",  name:"The Accelerator",  emoji:"🚀", color:"#0FBFB8",
      headline:"Long game. High conviction.",
      summary:"You think in decades. Short-term noise does not worry you, you see market drops as opportunities and compound growth as the most powerful force in finance. You move decisively and back yourself. Your risk is moving fast without building proper foundations underneath.",
      traits:["Comfortable with investment volatility","Thinks in long timeframes","Makes financial decisions with confidence","Attracted to growth assets and investment opportunities","Less focused on day-to-day spending tracking"],
      scenarios:["You have or are actively considering a Stocks and Shares ISA or self-invested pension","You would consider individual stocks or thematic ETFs as well as index funds","You are unlikely to want a financial adviser telling you what to do, but a good one as a sounding board could add real value","During market crashes you either hold firm or buy more","You find detailed budgeting constraining but probably have a strong income-to-investment ratio"],
      blind_spot:"Your conviction is a strength but can lead to concentrated positions or skipping fundamentals like wills, insurance, or an adequate emergency fund.",
      next_step:"Check your emergency fund is 3 months covered before adding more to investments." },

    "growth-future-systematic":      { id:"navigator",    name:"The Navigator",    emoji:"🧭", color:"#A78BFA",
      headline:"Methodical. Growth-focused. In control.",
      summary:"You have the rare combination of growth ambition and systematic discipline. You research before you act, build structured plans, and then actually follow through. This makes you one of the most effective personal finance profiles, the main risk is over-engineering at the expense of action.",
      traits:["Research-led investor","Clear financial goals with plans attached","Comfortable with risk when it is well understood","Tracks net worth and financial metrics regularly","Balances short-term structure with long-term growth thinking"],
      scenarios:["You probably compare ISA platforms before switching and have read about index funds vs active management","You would get real value from a detailed financial plan produced by an IFA","You are the type of person who finds this quiz interesting rather than annoying","You likely already track your net worth or are attracted to doing so","You balance lifestyle spending with serious long-term saving"],
      blind_spot:"Analysis paralysis is your main risk. You can research indefinitely when taking a reasonable action earlier would have been better.",
      next_step:"Pick one financial goal and set an automated monthly contribution towards it this week." },

    "growth-present-intuitive":      { id:"grower",       name:"The Grower",       emoji:"⚡", color:"#F59E0B",
      headline:"Momentum, instinct, opportunity.",
      summary:"You are entrepreneurial with money. You back yourself, spot opportunities, and are not afraid to act. You live well now and want to grow your wealth too. The tension in your profile is between enjoying the present and building for the future, you are working on getting the balance right.",
      traits:["Acts on financial instinct rather than lengthy research","Enjoys the present while also thinking about growth","Comfortable with risk and uncertainty","Attracted to investment opportunities and new financial tools","Less likely to follow rigid budgets, prefers to earn more"],
      scenarios:["You are likely interested in or already have exposure to a range of investments including possibly crypto or individual stocks","You probably spend generously on experiences and lifestyle and feel broadly fine about it","A financial coach rather than a traditional IFA might suit you better","You would benefit from automating your savings so they happen before you can spend","You may have several financial accounts across different apps and platforms"],
      blind_spot:"Without structure, income can disappear into lifestyle even at high earning levels. Automating savings removes this risk.",
      next_step:"Set up an automated transfer to a Stocks and Shares ISA on payday before spending decisions happen." },

    "security-future-intuitive":     { id:"architect",    name:"The Architect",    emoji:"🏗️", color:"#60A5FA",
      headline:"Strong foundations. Deep knowledge.",
      summary:"You have done the reading. You understand pensions, tax wrappers, compound interest, and the mechanics of personal finance, often better than people earning far more than you. Your challenge is that knowledge does not always translate into action. You can over-analyse or wait for the perfect moment.",
      traits:["High financial literacy","Security-focused but intellectually curious about growth","Likely researches financial products in depth before choosing","Understands the importance of the long game","Can be slowed by a desire for certainty before acting"],
      scenarios:["You have probably compared multiple ISA providers or pension platforms","You know what a SIPP is and have considered one","You would find real value in a financial adviser but would interrogate their recommendations rigorously","You are drawn to detailed financial models and projections","You understand the tax efficiency of pensions better than most"],
      blind_spot:"Knowledge without action is just expensive inaction. The perfect plan started late loses to the good plan started now.",
      next_step:"Identify the one financial decision you have been researching for more than 3 months and make it this month." },

    "freedom-present-intuitive":     { id:"opportunist",  name:"The Opportunist",  emoji:"🌊", color:"#F59E0B",
      headline:"Bold. Fast-moving. Opportunity-first.",
      summary:"You see financial freedom as the goal and you are willing to move decisively to get there. You are not especially interested in rules or conventional wisdom, you back your own judgement. The risk is that ambition without foundation can leave gaps that become expensive later.",
      traits:["High confidence in financial decision-making","Moves quickly when an opportunity feels right","Less attached to conventional financial planning","Values financial independence and optionality","Can underestimate the importance of boring fundamentals"],
      scenarios:["You have likely made at least one significant financial move others would consider bold","You are attracted to investments with high upside potential","You find traditional financial planning advice cautious to the point of being unhelpful","You would benefit most from a financial adviser who challenges you rather than validates you","Your emergency fund may not be fully funded because the money feels better deployed elsewhere"],
      blind_spot:"A single bad financial decision without adequate foundations underneath can undo years of bold gains. Foundations are not boring, they are leverage.",
      next_step:"Check: do you have 3 months expenses in accessible cash? If not, build that first." },

    "freedom-present-systematic":    { id:"learner",      name:"The Learner",      emoji:"💡", color:"#A78BFA",
      headline:"Curious. Growing. Getting started.",
      summary:"You are building your financial foundations and you are doing it with self-awareness, which puts you ahead of most people who never examine their money relationship at all. You are at the most important stage, the habits you build now will compound for decades.",
      traits:["Open to learning and improving financial knowledge","May feel behind peers financially, though often this is not true","Values simplicity and clear guidance over complexity","Wants a plan but is not sure where to start","Responds well to encouragement and small wins"],
      scenarios:["This app and a book like The Psychology of Money would genuinely shift your thinking","You would benefit enormously from a basic financial plan even a simple one","A financial adviser who specialises in early-stage financial planning would be valuable","Automating savings even £50 per month would build a habit that compounds significantly","Understanding ISAs and pension basics is the single best use of your financial education time right now"],
      blind_spot:"Waiting until you understand everything perfectly before acting. Starting small and imperfectly now beats a perfect plan started later.",
      next_step:"Open a Stocks and Shares ISA this month, even with a small amount. The habit matters more than the amount right now." },
  }

  // Match archetype by primary signals
  const key = `${sg === "balanced" ? "growth" : sg}-${pf === "balanced" ? "future" : pf}-${si === "balanced" ? "systematic" : si}`
  const archetype = ARCHETYPES[key] || ARCHETYPES["freedom-present-systematic"]

  return {
    scores: norm,
    dimensions: { sg, pf, si, ic, as, sc, er },
    archetype,
    completedAt: new Date().toISOString(),
  }
}


const ASSET_TYPES = [
  { id:"property",    label:"Primary Home",  icon:"🏠", cat:"primary_residence", desc:"Your main residenced",         hint:"Check Zoopla or Rightmove",          bucket:"life"   },
  { id:"savings",     label:"Savings",      icon:"💰", cat:"savings",           desc:"Cash, ISA, current acct",  hint:"Check your banking app",             bucket:"safety" },
  { id:"pension",     label:"Pension",      icon:"🏛️", cat:"pension",           desc:"Workplace or personal",    hint:"Your pension provider app or letter", bucket:"wealth" },
  { id:"investments", label:"Investments",  icon:"📈", cat:"investments",       desc:"Stocks, funds, S&S ISA",   hint:"Your ISA or investment platform",    bucket:"wealth" },
  { id:"vehicle",     label:"Vehicle",      icon:"🚗", cat:"vehicle",           desc:"Car, motorbike",           hint:"Check AutoTrader with your reg plate",bucket:"life"   },
  { id:"gold",        label:"Gold",          icon:"✨", cat:"other",             desc:"Physical gold, precious metals, crypto",  hint:"Your exchange or wallet balance",     bucket:"wealth" },
  { id:"business",    label:"Business",     icon:"💼", cat:"business",          desc:"Business equity",          hint:"Estimated value of your stake",       bucket:"wealth" },
  { id:"other",       label:"Other Assets", icon:"📦", cat:"other",             desc:"Crypto, art, jewellery, collectibleses, other", hint:"Estimated resale value",              bucket:"life"   },
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
  goals:[], history:[], completedLessons:[], completedLevels:[], currentLevel:1, pendingLearnLevel:null, badges:[],
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

/* Jagged projection realistic market-style noise using seeded LCG */
const calcProjection = (nw, surplus, currentAge) => {
  const age = currentAge || 35
  const years = Math.max(70 - age, 5)
  const data = []
  let seed = (Math.abs(Math.round(nw)) % 9973) + 1
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed / 0xffffffff) - 0.5 }

  // Baselines: optimistic 8%, conservative 5%
  const optBase = [nw], conBase = [nw]
  let o = nw, c = nw
  for (let y = 1; y <= years; y++) {
    const s = Math.max(0, surplus) * 12
    o = (o + s) * 1.08
    c = (c + s) * 1.05
    optBase.push(o)
    conBase.push(c)
  }

  // More jagged noise mean-reverting random walk with higher amplitude
  let oNoise = 0, cNoise = 0
  for (let y = 0; y <= years; y++) {
    oNoise = oNoise * 0.55 + rand() * 0.18  // ±9% noise with persistence
    cNoise = cNoise * 0.55 + rand() * 0.13  // ±6.5%
    const jOpt = Math.round(optBase[y] * (1 + oNoise))
    const jCon = Math.round(conBase[y] * (1 + cNoise))
    data.push({ age: age + y, optimistic: Math.max(-500000, jOpt), conservative: Math.max(-500000, jCon) })
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
  // Deterministic but visually sparse and spaced, no flying rocket
  const stars = useMemo(()=>Array.from({length:Math.min(count,28)},(_,i)=>({
    x: (i*137.508)%100, y: (i*93.7+17)%100,
    size: i%9===0 ? 2.2 : i%5===0 ? 1.6 : 1,
    delay: (i*0.6)%6, dur: 2+((i*0.9)%4),
    tint: i%13===0 ? "rgba(15,191,184,.7)" : i%9===0 ? "rgba(167,139,250,.6)" : "rgba(255,255,255,.7)"
  })),[count])
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
      {/* Subtle nebula, very soft, just depth */}
      <div className="ls-nebula" style={{ position:"absolute",top:"-30%",left:"-20%",width:"80%",height:"80%",
        background:"radial-gradient(ellipse,rgba(167,139,250,.06) 0%,transparent 65%)",pointerEvents:"none" }}/>
      <div className="ls-nebula" style={{ position:"absolute",bottom:"-25%",right:"-15%",width:"70%",height:"70%",
        background:"radial-gradient(ellipse,rgba(15,191,184,.04) 0%,transparent 65%)",pointerEvents:"none",animationDelay:"5s" }}/>
      {stars.map((s,i)=>(
        <div key={i} className="ls-star" style={{ position:"absolute",left:`${s.x}%`,top:`${s.y}%`,
          width:s.size,height:s.size,borderRadius:"50%",background:s.tint,
          "--d":`${s.dur}s`,"--dl":`${s.delay}s` }}/>
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
          <div style={{ display:"flex",alignItems:"center",gap:5 }}><Lock size={11} color={T.subtle}/><span style={{ color:"#8FA3BE",fontSize:12 }}>Locked</span></div>
        </div>
      </div>
      <p style={{ color:"#D8E8F8",fontSize:14,lineHeight:1.65,marginBottom:14 }}>{description}</p>
      {onUnlock && <button onClick={onUnlock} style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 14px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>{unlock}</button>}
    </div>
  )
}

function InfoTooltip({ text, color=T.teal }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(()=>{
    if(!open) return
    function handler(e) {
      if(ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler, true)
    document.addEventListener("touchstart", handler, true)
    return ()=>{ document.removeEventListener("mousedown", handler, true); document.removeEventListener("touchstart", handler, true) }
  },[open])

  return (
    <div ref={ref} style={{ position:"relative",display:"inline-flex" }}>
      <button onClick={e=>{ e.stopPropagation(); setOpen(v=>!v) }} style={{ background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center" }}>
        <div style={{ width:20,height:20,borderRadius:"50%",background:`${color}20`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ fontSize:10,color,fontWeight:800 }}>?</span>
        </div>
      </button>
      {open && (
        <div style={{ position:"absolute",bottom:"calc(100% + 8px)",right:0,width:240,background:T.card,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"14px 16px",zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,.6)",pointerEvents:"auto" }}>
          <p style={{ color:"#D8E8F8",fontSize:14,lineHeight:1.65,fontWeight:500 }}>{text}</p>
        </div>
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
      profile:{ ...state.profile, name:name||"Friend", age:parseInt(age)||null, onboardingComplete:true, points:20, lastCheckIn:new Date().toISOString(), mode:state.profile?.mode||"grow" },
      assets: newAssets, debts: newDebts,
      income: { ...state.income, primary:income },
      spending: { ...state.spending, monthly:spending },
    })
  }

  if(screen==="welcome")   return <WelcomeScreen  onNext={({mode,name:n,age:a})=>{ save({...state,profile:{...state.profile,mode:mode||"grow"}}); if(n) setName(n); if(a) setAge(a); setScreen("assets") }} />
  if(screen==="assets")    return <AssetChecklistScreen values={assets} setValues={setAssets} onNext={()=>setScreen("debts")} onBack={()=>setScreen("welcome")} />
  if(screen==="debts")     return <DebtChecklistScreen values={debts} setValues={setDebts} assets={assets} age={age} onNext={()=>setScreen("income")} onBack={()=>setScreen("assets")} />
  if(screen==="income")    return <IncomeOnboardScreen income={income} setIncome={setIncome} onNext={()=>setScreen("spending")} onBack={()=>setScreen("debts")} />
  if(screen==="spending")  return <SpendingOnboardScreen spending={spending} setSpending={setSpending} income={income} onNext={()=>setScreen("wow")} onBack={()=>setScreen("income")} />
  if(screen==="wow")       return <WowScreen assets={assets} debts={debts} income={income} spending={spending} name={name} onFinish={finishOnboarding} />
  return null
}

/* ════════════════════════════════════════════════════════════════════
   WELCOME SCREENS (Splash + About/Name combined)
   ════════════════════════════════════════════════════════════════════ */

function WelcomeScreen({ onNext }) {
  const [screen, setScreen] = useState("splash")
  const [name, setNameLocal] = useState("")
  const [age, setAgeLocal] = useState("")
  const [mode, setMode] = useState(null)
  const [aboutTags, setAboutTags] = useState([])

  const MODES = [
    { id:"grow",   icon:"📈", label:"Grow my money",               sub:"Build wealth over time",                    color:T.teal   },
    { id:"safety", icon:"🛡️", label:"Feel secure",                 sub:"Reduce stress and build a safety net",     color:T.blue   },
    { id:"learn",  icon:"💡", label:"Learn the basics",            sub:"Understand money properly",                 color:T.purple },
    { id:"action", icon:"🎯", label:"Take action",                 sub:"Get a clear plan and move forward",         color:T.amber  },
  ]

  if(screen === "splash") return (
    <div style={{ minHeight:"100dvh", background:T.bg, display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden", alignItems:"center", justifyContent:"center" }}>
      <StarField count={28}/>
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)",
        width:300, height:300, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(15,191,184,.15) 0%, transparent 70%)",
        pointerEvents:"none" }}/>
      <div className="ls-fadein" style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 36px", maxWidth:420 }}>
        <div className="ls-float" style={{ fontSize:72, marginBottom:24, lineHeight:1,
          filter:"drop-shadow(0 0 40px rgba(15,191,184,.5))" }}>🚀</div>
        <p style={{ color:T.teal, fontSize:12, fontWeight:800, letterSpacing:5,
          textTransform:"uppercase", marginBottom:16 }}>LifeSmart</p>
        <h1 style={{ color:"#FFFFFF", fontWeight:900, fontSize:"clamp(34px,9vw,48px)",
          lineHeight:1.05, marginBottom:14, letterSpacing:-1 }}>
          Finance.<br/>For everyone.
        </h1>
        <p style={{ color:"#8FA3BE", fontSize:16, lineHeight:1.5, marginBottom:48, fontWeight:400 }}>
          The financial knowledge you were never taught.
        </p>
        <button onClick={()=>setScreen("priority")} style={{ background:`linear-gradient(135deg,${T.teal},${T.purple})`,
          border:"none", borderRadius:20, padding:"18px 52px", color:"#FFFFFF",
          fontWeight:900, fontSize:17, cursor:"pointer", fontFamily:"inherit",
          boxShadow:"0 8px 40px rgba(15,191,184,.35)", letterSpacing:.3 }}>
          Get started
        </button>
      </div>
    </div>
  )

  if(screen === "priority") return (
    <div style={{ minHeight:"100dvh", background:T.bg, display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden" }}>
      <StarField count={18}/>
      <div className="ls-fadein" style={{ position:"relative", zIndex:1, flex:1, overflowY:"auto",
        padding:"50px 28px 20px", maxWidth:460, margin:"0 auto", width:"100%" }}>
        <h1 style={{ color:"#FFFFFF", fontWeight:900, fontSize:"clamp(26px,6vw,34px)",
          lineHeight:1.1, marginBottom:10, letterSpacing:-.5 }}>
          What do you want to improve?
        </h1>
        <p style={{ color:"#8FA3BE", fontSize:15, lineHeight:1.55, marginBottom:8 }}>
          People who track their finances build <strong style={{ color:T.teal }}>4× more wealth</strong>. Not because they earn more, because they make better decisions.
        </p>
        <p style={{ color:"#8FA3BE", fontSize:15, lineHeight:1.55, marginBottom:28 }}>
          Pick one to start. You can change this later.
        </p>
        <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:15, marginBottom:14 }}>
          
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {MODES.map(m=>{
            const sel = mode === m.id
            return (
              <button key={m.id} onClick={()=>setMode(m.id)}
                style={{
                  background: sel ? `linear-gradient(135deg,${m.color}15,${m.color}08)` : "rgba(255,255,255,.03)",
                  border: `2px solid ${sel ? m.color : "rgba(255,255,255,.06)"}`,
                  borderRadius:18, padding:"16px 18px",
                  cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                  transition:"all .15s",
                  display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:44,height:44,borderRadius:13,background:sel?`${m.color}20`:"rgba(255,255,255,.04)",
                  border:`1px solid ${sel?`${m.color}40`:"rgba(255,255,255,.06)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
                  transition:"all .15s" }}>
                  {m.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:sel?"#FFFFFF":"#C8D8EC", fontWeight:700, fontSize:15, marginBottom:2 }}>
                    {m.label}
                  </p>
                  <p style={{ color:sel?"#8FA3BE":"#4A6080", fontSize:12, lineHeight:1.35 }}>{m.sub}</p>
                </div>
                {sel && <div style={{ width:22,height:22,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <Check size={13} color="#060C18"/>
                </div>}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{ position:"relative", zIndex:1, padding:"0 28px 48px", maxWidth:460, margin:"0 auto", width:"100%" }}>
        <button onClick={()=>{ if(mode) setScreen("about") }}
          disabled={!mode}
          style={{ width:"100%", padding:"17px",
            background: mode ? `linear-gradient(135deg,${T.teal},${T.purple})` : "rgba(255,255,255,.05)",
            border:"none", borderRadius:18,
            color: mode ? "#FFFFFF" : "#344D68",
            fontWeight:900, fontSize:17,
            cursor: mode ? "pointer" : "default",
            fontFamily:"inherit",
            boxShadow: mode ? "0 4px 24px rgba(15,191,184,.3)" : "none",
            transition:"all .2s" }}>
          Continue
        </button>
        <button onClick={()=>setScreen("splash")} style={{ background:"none", border:"none", color:"#344D68",
          fontSize:13, cursor:"pointer", fontFamily:"inherit", width:"100%", marginTop:12, padding:8, fontWeight:500 }}>
          Back
        </button>
      </div>
    </div>
  )

    const ABOUT_OPTIONS = [
    { id:"employed",   icon:"💼", label:"Full time job" },
    { id:"selfempl",   icon:"🏢", label:"Self employed" },
    { id:"student",    icon:"🎓", label:"Student" },
    { id:"seeking",    icon:"🔍", label:"Seeking a job or want to move" },
    { id:"stress",     icon:"😟", label:"I have had financial stress recently" },
    { id:"faith",      icon:"🌙", label:"Faith guides my financial decisions" },
    { id:"lifeevent",  icon:"🎯", label:"Big life event coming up or recently" },
  ]

  if(screen === "about") return (
    <div style={{ minHeight:"100dvh", background:T.bg, display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden" }}>
      <StarField count={16}/>
      <div className="ls-fadein" style={{ position:"relative", zIndex:1, flex:1, overflowY:"auto",
        padding:"50px 28px 20px", maxWidth:460, margin:"0 auto", width:"100%" }}>
        <h1 style={{ color:"#FFFFFF", fontWeight:900, fontSize:"clamp(26px,6vw,34px)",
          lineHeight:1.1, marginBottom:8, letterSpacing:-.5 }}>Which of these apply to you?</h1>
        <p style={{ color:"#8FA3BE", fontSize:15, lineHeight:1.5, marginBottom:28 }}>
          Choose all that apply. This helps us personalise your experience.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ABOUT_OPTIONS.map(opt => {
            const sel = aboutTags.includes(opt.id)
            return (
              <button key={opt.id}
                onClick={() => setAboutTags(prev => sel ? prev.filter(x=>x!==opt.id) : [...prev, opt.id])}
                style={{ display:"flex", alignItems:"center", gap:14,
                  background: sel ? "rgba(15,191,184,.12)" : "rgba(255,255,255,.03)",
                  border:`2px solid ${sel ? T.teal : "rgba(255,255,255,.08)"}`,
                  borderRadius:16, padding:"15px 18px", cursor:"pointer",
                  fontFamily:"inherit", textAlign:"left", transition:"all .15s" }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{opt.icon}</span>
                <p style={{ color: sel ? "#FFFFFF" : "#C8D8EC", fontWeight: sel ? 700 : 500,
                  fontSize:15, flex:1 }}>{opt.label}</p>
                {sel && <div style={{ width:22, height:22, borderRadius:"50%", background:T.teal,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Check size={13} color="#060C18"/>
                </div>}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{ position:"relative", zIndex:1, padding:"0 28px 48px", maxWidth:460, margin:"0 auto", width:"100%" }}>
        <button onClick={() => setScreen("name")}
          style={{ width:"100%", padding:"17px",
            background:`linear-gradient(135deg,${T.teal},${T.purple})`,
            border:"none", borderRadius:18, color:"#FFFFFF",
            fontWeight:900, fontSize:17, cursor:"pointer",
            fontFamily:"inherit", boxShadow:"0 4px 24px rgba(15,191,184,.3)" }}>
          Continue
        </button>
        <button onClick={() => setScreen("priority")} style={{ background:"none", border:"none",
          color:"#4A6080", fontSize:13, cursor:"pointer", fontFamily:"inherit",
          width:"100%", marginTop:12, padding:8 }}>Back</button>
      </div>
    </div>
  )

  if(screen === "name") return (
    <div style={{ minHeight:"100dvh", background:T.bg, display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden" }}>
      <StarField count={16}/>
      <div className="ls-fadein" style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"50px 28px 20px", maxWidth:460, margin:"0 auto", width:"100%" }}>
        <h1 style={{ color:"#FFFFFF", fontWeight:900, fontSize:"clamp(26px,6vw,34px)",
          lineHeight:1.1, marginBottom:6, letterSpacing:-.5 }}>
          About you
        </h1>
        <p style={{ color:"#5A7A9A", fontSize:14, marginBottom:28, fontWeight:500 }}>
          We will personalise everything to you.
        </p>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <input type="text" value={name} onChange={e=>setNameLocal(e.target.value)}
            placeholder="First name" autoFocus
            style={{ width:"100%", background:"rgba(255,255,255,.04)",
              border:`2px solid ${name ? T.teal : "rgba(255,255,255,.08)"}`,
              borderRadius:16, padding:"17px 20px", color:"#FFFFFF",
              fontSize:19, fontWeight:700, fontFamily:"inherit",
              outline:"none", transition:"border .15s" }}/>
          <input type="number" value={age} onChange={e=>setAgeLocal(e.target.value)}
            placeholder="Your age" min="16" max="80"
            style={{ width:"100%", background:"rgba(255,255,255,.04)",
              border:`2px solid ${age ? T.teal : "rgba(255,255,255,.08)"}`,
              borderRadius:16, padding:"17px 20px", color:"#FFFFFF",
              fontSize:19, fontWeight:700, fontFamily:"inherit",
              outline:"none", transition:"border .15s" }}/>
          <p style={{ color:"#3A5575", fontSize:12, paddingLeft:4 }}>Used to compare you against your age group.</p>
        </div>
      </div>
      <div style={{ position:"relative", zIndex:1, padding:"0 28px 48px", maxWidth:460, margin:"0 auto", width:"100%" }}>
        <button onClick={()=>{ if(name && age) onNext({ mode:mode||"grow", name, age }) }}
          disabled={!name || !age}
          style={{ width:"100%", padding:"17px",
            background: (name && age) ? `linear-gradient(135deg,${T.teal},${T.purple})` : "rgba(255,255,255,.05)",
            border:"none", borderRadius:18,
            color: (name && age) ? "#FFFFFF" : "#344D68",
            fontWeight:900, fontSize:17,
            cursor: (name && age) ? "pointer" : "default",
            fontFamily:"inherit",
            boxShadow: (name && age) ? "0 4px 24px rgba(15,191,184,.3)" : "none",
            transition:"all .2s" }}>
          {name ? `Let's go, ${name}` : "Enter your details"}
        </button>
        <button onClick={()=>setScreen("priority")} style={{ background:"none", border:"none", color:"#344D68",
          fontSize:13, cursor:"pointer", fontFamily:"inherit", width:"100%", marginTop:12, padding:8, fontWeight:500 }}>
          Back
        </button>
      </div>
    </div>
  )

  return null
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
        <p style={{ color:"#E2EAF6",fontSize:14,marginBottom:6,lineHeight:1.5 }}>Tap each one. Rough estimates are totally fine.</p>

        {/* Helpful hint */}
        <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"8px 14px",marginBottom:18,display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ fontSize:13,flexShrink:0 }}>💡</span>
          <p style={{ color:T.teal,fontSize:12 }}>Estimates are fine. Tap any type to see where to find the number.</p>
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
        {!hasAny && <button onClick={onNext} style={{ background:"none",border:"none",color:"#E2EAF6",fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip add later</button>}
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
            <span style={{ padding:"0 10px",color:"#E2EAF6",fontSize:15,fontWeight:700,userSelect:"none" }}>£</span>
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
        <p style={{ color:"#E2EAF6",fontSize:14,marginBottom:6,lineHeight:1.5 }}>Tap what applies. No debt? Just hit Continue.</p>

        <div style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",marginBottom:18,display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ fontSize:13,flexShrink:0 }}>💡</span>
          <p style={{ color:T.muted,fontSize:12 }}>Knowing your debts is the first step to clearing them. We use estimated rates, update any time.</p>
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
              <div><p style={{ color:T.green,fontWeight:800,fontSize:16 }}>{fmtK(totalAssets)}</p><p style={{ color:"#8FA3BE",fontSize:12 }}>Assets</p></div>
              <div style={{ width:1,background:T.border }}/>
              <div><p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:800,fontSize:16 }}>{fmtK(totalDebts)}</p><p style={{ color:"#8FA3BE",fontSize:12 }}>Debts</p></div>
              <div style={{ width:1,background:T.border }}/>
              <div><p style={{ color:netWorth>=0?T.teal:T.red,fontWeight:800,fontSize:16 }}>{fmtK(netWorth)}</p><p style={{ color:"#8FA3BE",fontSize:12 }}>Net worth</p></div>
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
          {hasAny ? "Continue →" : "No debt continue →"}
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
          <span style={{ padding:"0 10px",color:"#E2EAF6",fontSize:15,fontWeight:700,userSelect:"none" }}>£</span>
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
        <p style={{ color:"#E2EAF6",fontSize:15,marginBottom:24,lineHeight:1.6,textAlign:"center" }}>After tax. This powers your projections.</p>

        <div style={{ marginBottom:20 }}>
          <CurrencyInput label="Monthly take-home pay (after tax)" value={income} onChange={setIncome} placeholder="e.g. 2,800"/>
        </div>

        {/* Helpful context */}
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:28 }}>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontSize:18 }}>📱</span>
            <p style={{ color:T.white,fontSize:14,lineHeight:1.4,fontWeight:600 }}>Check your banking app or last payslip, the amount that hits your account each month.</p>
          </div>
        </div>

        {income > 0 && (
          <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"center" }}>
            <p style={{ color:T.teal,fontWeight:700,fontSize:15 }}>{fmt(income)}/month</p>
            <p style={{ color:"#E2EAF6",fontSize:13,marginTop:2 }}>{fmt(income*12)}/year take-home</p>
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
        <h2 style={{ color:T.white,fontSize:"clamp(20px,4vw,26px)",fontWeight:900,marginBottom:8,lineHeight:1.2,textAlign:"center" }}>Monthly spending total</h2>
        <p style={{ color:"#E2EAF6",fontSize:13,marginBottom:20,lineHeight:1.6,textAlign:"center" }}>Everything out each month, rent, food, bills, fun.</p>

        <p style={{ color:"#E2EAF6",fontSize:14,marginBottom:10,fontWeight:600 }}>What to include:</p>
        {/* Category hints reference only */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:20 }}>
          {SPENDING_HINTS.map((h,i)=>(
            <div key={i} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:99,padding:"6px 12px",display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:14 }}>{h.icon}</span>
              <p style={{ color:T.muted,fontWeight:600,fontSize:12 }}>{h.label}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <CurrencyInput label="Total monthly spending" value={spending} onChange={setSpending} placeholder="e.g. 1,800"/>
        </div>

        {/* Live surplus preview */}
        {surplus !== null && spending > 0 && (
          <div style={{ background:surplus>0?T.tealDim:T.redDim, border:`1px solid ${surplus>0?T.tealBorder:T.redBorder}`,borderRadius:12,padding:"14px 16px",marginBottom:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <p style={{ color:"#E2EAF6",fontSize:13 }}>{fmt(income)} income − {fmt(spending)} spending</p>
              <p style={{ color:surplus>0?T.teal:T.red,fontWeight:800,fontSize:16 }}>{fmt(Math.abs(surplus))}</p>
            </div>
            <p style={{ color:surplus>0?T.teal:T.red,fontSize:12,fontWeight:700 }}>
              {surplus>0 ? `✓ ${fmt(surplus)}/mo surplus the fuel for your future` : `⚠ ${fmt(Math.abs(surplus))}/mo shortfall we'll help you fix this`}
            </p>
          </div>
        )}

        {income > 0 && spending > 0 && surplus > 0 && (
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",marginBottom:20,display:"flex",gap:10 }}>
            <span style={{ fontSize:14 }}>💡</span>
            <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.5 }}>
              That surplus of <strong style={{ color:T.teal }}>{fmt(surplus)}/month</strong> is what builds your net worth. Invested at 7%/yr over 20 years, it could grow to <strong style={{ color:T.teal }}>{fmtK(surplus*12*52.7)}</strong>.
            </p>
          </div>
        )}

        <Btn onClick={onNext} disabled={spending<=0}>Build my picture →</Btn>
        {spending<=0 && <button onClick={onNext} style={{ background:"none",border:"none",color:"#E2EAF6",fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip add later</button>}
      </div>
    </div>
  )
}

/* ── Wow screen ───────────────────────────────────────────────────── */
function WowScreen({ assets, debts, income, spending, name, onFinish }) {
  const totalAssets = Object.values(assets).reduce((s,v)=>s+(v||0),0)
  const totalDebts  = Object.values(debts).reduce((s,v)=>s+(v||0),0)
  const netWorth    = totalAssets - totalDebts
  const nwPos       = netWorth >= 0

  const dynamicMsg = netWorth > 50000
    ? "You are in a strong position to build from here."
    : netWorth > 0
      ? "You have a solid starting point. From here it compounds."
      : "This is where you start. It can improve quickly with the right moves."

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative", overflow:"hidden" }}>
      <StarField count={50}/>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:320,
        background:`radial-gradient(ellipse at 50% 0%,${nwPos?T.teal:T.red}20 0%,transparent 70%)`,
        pointerEvents:"none" }}/>

      <div className="ls-fadein" style={{ position:"relative", textAlign:"center", maxWidth:420, width:"100%" }}>
        <div className="ls-float" style={{ fontSize:64, marginBottom:16 }}>
          {nwPos ? "🚀" : "📊"}
        </div>

        <p style={{ fontSize:12, fontWeight:700, color:T.teal, letterSpacing:2,
          textTransform:"uppercase", marginBottom:6 }}>
          This is your starting point
        </p>

        <div className="ls-numpop" style={{ marginBottom:8 }}>
          <div style={{ fontSize:"clamp(52px,12vw,72px)", fontWeight:900, lineHeight:1,
            color:nwPos?T.teal:T.red, letterSpacing:-2,
            textShadow:nwPos?`0 0 60px ${T.teal}60`:`0 0 60px ${T.red}40` }}>
            {fmt(netWorth)}
          </div>
          <p style={{ color:"#E2EAF6", fontSize:14, marginTop:6, fontWeight:600 }}>Net worth</p>
        </div>

        <p style={{ color:"#E2EAF6", fontSize:15, lineHeight:1.65, marginBottom:6,
          maxWidth:340, margin:"0 auto 6px" }}>
          From here, everything you do compounds.
        </p>
        <p style={{ color:nwPos?T.teal:"#8FA3BE", fontSize:14, lineHeight:1.5,
          marginBottom:28, maxWidth:320, margin:"0 auto 28px", fontWeight:500 }}>
          {dynamicMsg}
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"14px" }}>
            <p style={{ color:T.green, fontWeight:900, fontSize:22 }}>{fmtK(totalAssets)}</p>
            <p style={{ color:"#8FA3BE", fontSize:12, marginTop:2 }}>Assets</p>
          </div>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"14px" }}>
            <p style={{ color:totalDebts>0?T.red:"#8FA3BE", fontWeight:900, fontSize:22 }}>{fmtK(totalDebts)}</p>
            <p style={{ color:"#8FA3BE", fontSize:12, marginTop:2 }}>Debts</p>
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,.15),rgba(15,191,184,.08))",
          border:"1px solid rgba(167,139,250,.25)", borderRadius:18, padding:"18px 20px", marginBottom:24 }}>
          <p style={{ color:"rgba(167,139,250,.7)", fontSize:11, fontWeight:700,
            letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>What people say</p>
          <p style={{ color:"#FFFFFF", fontWeight:700, fontSize:16, fontStyle:"italic",
            lineHeight:1.55, marginBottom:6 }}>
            "I wish I started tracking this earlier."
          </p>
          <p style={{ color:"#8FA3BE", fontSize:14 }}>
            You are starting now. That already puts you ahead.
          </p>
        </div>

        <Btn onClick={onFinish} style={{ fontSize:16, padding:"18px", width:"100%" }}>
          See your next steps →
        </Btn>
        <p style={{ color:"#6B8CB8", fontSize:13, marginTop:12 }}>Your projection and guide are ready</p>
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
  const drag       = totalInterestDrag(debts)
  const bk         = buckets(assets)
  const hasSpending= (spending?.monthly||0) > 0
  const hasIncome  = (income?.primary||0) > 0
  const safetyMonths = (bk.safetyNet > 0 && spending.monthly > 0) ? parseFloat((bk.safetyNet / spending.monthly).toFixed(1)) : null
  const fireNumber   = hasSpending ? spending.monthly * 12 * 25 : null
  const [showEdit, setShowEdit] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [expandNW, setExpandNW] = useState(false)
  const [expandProj, setExpandProj] = useState(false)

  const mode      = PRIORITY_MODES.find(m=>m.id===(profile?.mode||"grow")) || PRIORITY_MODES[0]
  const quizResult= profile?.personalityResult
  const arch      = quizResult?.archetype

  const doneSet   = new Set(completedLessons||[])
  const hasPriorities = (priorityGoals||[]).length > 0
  const priorityLessonId = (priorityGoals||[]).map(id => PRIORITY_GOALS.find(g=>g.id===id)?.lesson).find(lid=>lid&&!doneSet.has(lid))
  const modePrimaryLesson = mode.primaryLesson
  const recLessonId = null // level journey replaces lesson recommendations //ind(l=>!doneSet.has(l.id))?.id
  const recLesson = null // replaced by level journey in Learn tab

  // Action checklist
  const hasNumbers  = totalAssets > 0 || totalDebts > 0
  const hasSpendInc = hasSpending && hasIncome
  const lessonsCount = (completedLessons||[]).length
  const actions = [
    { id:"numbers", done: hasNumbers && hasSpendInc,  emoji:"📊", label:"Add your assets, debts, income and spending", sub:"Takes 5 minutes, gives you your real financial picture", onClick:()=>setTab(2) },
    { id:"lessons", done: lessonsCount >= 3,           emoji:"📚", label:"Complete 3 lessons",                           sub:`${lessonsCount}/3 done, builds the knowledge that changes decisions`, onClick:()=>setTab(1) },
    { id:"quiz",    done: !!quizResult,                emoji:"🧠", label:"Discover your money personality",             sub:"4-minute quiz, reveals your archetype and blind spots",  onClick:()=>setShowQuiz(true) },
  ]
  const allDone = actions.every(a=>a.done)

  // Compact asset groups for dashboard snapshot
  const assetRows = [
    { label:"Savings & Cash",     color:T.teal,   value: assets.filter(a=>["savings","cash"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0) },
    { label:"Investments & ISA",  color:T.purple, value: assets.filter(a=>["investments","stocks"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0) },
    { label:"Pension",            color:T.amber,  value: assets.filter(a=>a.category==="pension").reduce((s,a)=>s+(a.value||0),0) },
    { label:"Property",           color:T.green,  value: assets.filter(a=>["primary_residence","investment_property"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0) },
    { label:"Other assets",       color:T.blue,   value: assets.filter(a=>!["savings","cash","investments","stocks","pension","primary_residence","investment_property"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0) },
  ].filter(r=>r.value>0)

  const debtRows = [
    { label:"Mortgage",           color:T.amber,  value: debts.filter(d=>["mortgage","primary_residence"].includes(d.category)).reduce((s,d)=>s+(d.balance||0),0) },
    { label:"Personal loans",     color:T.red,    value: debts.filter(d=>["personal_loan","loan"].includes(d.category)).reduce((s,d)=>s+(d.balance||0),0) },
    { label:"Credit cards",       color:T.red,    value: debts.filter(d=>["credit_card","credit"].includes(d.category)).reduce((s,d)=>s+(d.balance||0),0) },
    { label:"Student loan",       color:T.muted,  value: debts.filter(d=>["student_loan","student"].includes(d.category)).reduce((s,d)=>s+(d.balance||0),0) },
    { label:"Other debts",        color:T.muted,  value: debts.filter(d=>!["mortgage","primary_residence","personal_loan","loan","credit_card","credit","student_loan","student"].includes(d.category)).reduce((s,d)=>s+(d.balance||0),0) },
  ].filter(r=>r.value>0)

  if(showQuiz)   return <PersonalityQuiz state={state} save={save} onClose={()=>setShowQuiz(false)}/>
  if(showResult) return <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:300,overflowY:"auto" }}>
    <div style={{ padding:"24px 20px 60px",maxWidth:520,margin:"0 auto" }}>
      <button onClick={()=>setShowResult(false)} style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:20,padding:4,marginBottom:16 }}>←</button>
      <PersonalityResult result={quizResult} onClose={()=>setShowResult(false)}/>
    </div>
  </div>


  const TOOLTIPS = {
    networth:   { title:"Net Worth",               body:"Everything you own minus everything you owe. Assets (savings, pension, property, investments) minus liabilities (mortgage, loans, credit cards). This is the only number that tells the full story of your financial position." },
    projection: { title:"Wealth Projection",       body:"Based on your current net worth, monthly surplus and age. The conservative line assumes modest growth. The optimistic line shows what happens with the right decisions: opening an ISA, maximising your pension match, completing lessons." },
    freedom:    { title:"Financial Freedom Number", body:"The portfolio size that could cover your essential spending forever without you working. Calculated as 25x your annual essential costs, based on the 4% rule. A well-invested portfolio can sustain 4% withdrawals indefinitely. A target, not a promise." },
    safety:     { title:"Safety Net",               body:"How many months of essential spending your liquid savings would cover if your income stopped tomorrow. 3 months is the minimum. 6 is solid. This is your financial floor: it determines whether a setback stays manageable or becomes a debt spiral." },
    drag:       { title:"Interest Drag",            body:"The total annual cost of your debts in interest payments. Every pound here is money leaving your wealth and going to lenders. Clearing high-interest debt is the highest guaranteed return you can get." }
  }

  const TooltipModal = ({ id }) => {
    const t = TOOLTIPS[id]
    if(!t) return null
    return (
      <div onClick={() => setActiveTooltip(null)} style={{
        position:"fixed", inset:0, zIndex:500,
        background:"rgba(7,13,26,.85)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"flex-end", justifyContent:"center", padding:"0 0 20px"
      }}>
        <div onClick={e => e.stopPropagation()} className="ls-fadein" style={{
          background:T.card, border:`1px solid ${T.borderLight}`,
          borderRadius:24, padding:"28px 24px", maxWidth:480, width:"calc(100% - 32px)"
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p style={{ color:T.white, fontWeight:900, fontSize:18 }}>{t.title}</p>
            <button onClick={() => setActiveTooltip(null)} style={{
              background:T.surface, border:`1px solid ${T.border}`, borderRadius:99,
              width:30, height:30, cursor:"pointer", color:T.muted,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:16
            }}>×</button>
          </div>
          <p style={{ color:"#C8D8EC", fontSize:15, lineHeight:1.7 }}>{t.body}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:100 }}>
      {activeTooltip && <TooltipModal id={activeTooltip}/>}

      {/* ── GREETING ── */}
      <div style={{ background:`linear-gradient(180deg,${mode.color}12 0%,transparent 100%)`,
        padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", position:"relative" }}>
        <StarField count={6}/>
        <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:mode.color, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:3 }}>{mode.tagline(profile.name||"")}</p>
            <p style={{ color:"#C8D8EC", fontSize:15, fontWeight:500 }}>Your financial picture</p>
          </div>
          <button onClick={() => setShowEdit(!showEdit)}
            style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10,
              padding:"8px 14px", cursor:"pointer", color:"#C8D8EC", fontSize:13,
              fontWeight:600, fontFamily:"inherit" }}>Edit ✎</button>
        </div>
        {showEdit && (
          <div className="ls-fadein" style={{ background:T.card, border:`1px solid ${T.border}`,
            borderRadius:14, padding:"16px", marginTop:12 }}>
            <p style={{ color:"#E2EAF6", fontSize:14, lineHeight:1.6, marginBottom:12 }}>
              Update your numbers in <strong style={{ color:T.white }}>Analytics</strong>, or reset and start fresh.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setTab(2); setShowEdit(false) }}
                style={{ flex:1, background:T.tealDim, border:`1px solid ${T.tealBorder}`,
                  borderRadius:10, padding:"10px", color:T.teal, fontWeight:700,
                  fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Go to Analytics →</button>
              <button onClick={() => { if(window.confirm("Restart? All data will be cleared.")) reset() }}
                style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:10,
                  padding:"10px 14px", color:"#8FA3BE", fontWeight:600, fontSize:13,
                  cursor:"pointer", fontFamily:"inherit" }}>Reset</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"0 16px" }}>

        {/* ══ SECTION 1: TWO TAPPABLE TILES ══ */}
        <div style={{ marginTop:18, marginBottom:12 }}>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>

            {/* NET WORTH */}
            <div>
              <button onClick={() => setExpandNW(!expandNW)} className="ls-pulse"
                style={{ width:"100%",
                  background:`linear-gradient(145deg,${netWorth>=0?"rgba(15,191,184,.18)":"rgba(248,113,113,.18)"},${T.card})`,
                  border:`2px solid ${netWorth>=0 ? T.teal : T.red}`,
                  borderRadius: expandNW ? "20px 20px 0 0" : 20,
                  padding:"18px 16px", cursor:"pointer", fontFamily:"inherit",
                  textAlign:"left", transition:"all .2s", minHeight:148,
                  boxShadow:`0 0 20px ${netWorth>=0?T.teal:T.red}25` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <p style={{ color:netWorth>=0?T.teal:T.red, fontSize:11, fontWeight:800,
                    letterSpacing:1.2, textTransform:"uppercase" }}>Net Worth</p>
                  <div style={{ background:`${netWorth>=0?T.teal:T.red}20`, borderRadius:99,
                    padding:"3px 8px", display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ color:netWorth>=0?T.teal:T.red, fontSize:11, fontWeight:700 }}>
                      {expandNW ? "▴ Close" : "▾ Expand"}
                    </span>
                  </div>
                </div>
                <p style={{ color:netWorth>=0?T.teal:T.red, fontWeight:900,
                  fontSize:"clamp(24px,6vw,36px)", lineHeight:1, marginBottom:10,
                  textShadow:netWorth>=0?`0 0 30px ${T.teal}60`:`0 0 30px ${T.red}50` }}>
                  {fmt(netWorth)}
                </p>
                <div style={{ display:"flex", gap:14 }}>
                  <div>
                    <p style={{ color:T.green, fontWeight:800, fontSize:14 }}>{fmtK(totalAssets)}</p>
                    <p style={{ color:"#8FA3BE", fontSize:11 }}>you own</p>
                  </div>
                  <div style={{ width:1, background:T.border }}/>
                  <div>
                    <p style={{ color:totalDebts>0?T.red:"#8FA3BE", fontWeight:800, fontSize:14 }}>{fmtK(totalDebts)}</p>
                    <p style={{ color:"#8FA3BE", fontSize:11 }}>you owe</p>
                  </div>
                </div>
              </button>
              {expandNW && (
                <div className="ls-fadein" style={{ background:T.card,
                  border:`2px solid ${netWorth>=0?T.teal:T.red}`, borderTop:"none",
                  borderRadius:"0 0 20px 20px", padding:"16px" }}>
                  {assetRows.length > 0 && (
                    <p style={{ color:"#8FA3BE", fontSize:11, fontWeight:700, letterSpacing:1,
                      textTransform:"uppercase", marginBottom:8 }}>Assets</p>
                  )}
                  {assetRows.map((r,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center", paddingBottom:8, marginBottom:8,
                      borderBottom: i<assetRows.length-1 ? `1px solid ${T.border}` : "none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:r.color, flexShrink:0 }}/>
                        <p style={{ color:"#E2EAF6", fontSize:14 }}>{r.label}</p>
                      </div>
                      <p style={{ color:T.white, fontWeight:700, fontSize:14 }}>{fmtK(r.value)}</p>
                    </div>
                  ))}
                  {debtRows.length > 0 && (
                    <p style={{ color:"#8FA3BE", fontSize:11, fontWeight:700, letterSpacing:1,
                      textTransform:"uppercase", margin:"8px 0 8px" }}>Debts</p>
                  )}
                  {debtRows.map((r,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center", paddingBottom:8, marginBottom:8,
                      borderBottom: i<debtRows.length-1 ? `1px solid ${T.border}` : "none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:r.color, flexShrink:0 }}/>
                        <p style={{ color:"#E2EAF6", fontSize:14 }}>{r.label}</p>
                      </div>
                      <p style={{ color:T.red, fontWeight:700, fontSize:14 }}>{fmtK(r.value)}</p>
                    </div>
                  ))}
                  {assetRows.length===0 && debtRows.length===0 && (
                    <p style={{ color:"#8FA3BE", fontSize:14, textAlign:"center", padding:"8px 0" }}>No numbers added yet</p>
                  )}
                  <button onClick={() => { setTab(2); setExpandNW(false) }}
                    style={{ width:"100%", background:T.tealDim, border:`1px solid ${T.tealBorder}`,
                      borderRadius:12, padding:"11px", color:T.teal, fontWeight:700,
                      fontSize:14, cursor:"pointer", fontFamily:"inherit", marginTop:10 }}>
                    Update in Analytics →
                  </button>
                </div>
              )}
            </div>

            {/* PROJECTION */}
            {(() => {
              const projData = (netWorth!==0 && hasIncome) ? calcProjection(netWorth, surplus, profile?.age) : null
              const at70 = projData?.find(d => Math.round(d.age) === 70)
              return (
                <div>
                  <button onClick={() => setExpandProj(!expandProj)}
                    style={{ width:"100%",
                      background:"linear-gradient(145deg,rgba(245,158,11,.18),rgba(15,13,26,.8))",
                      border:`2px solid ${T.amber}`,
                      borderRadius: expandProj ? "20px 20px 0 0" : 20,
                      padding:"18px 16px", cursor:"pointer", fontFamily:"inherit",
                      textAlign:"left", transition:"all .2s", minHeight:148,
                      boxShadow:`0 0 20px ${T.amber}25` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <p style={{ color:T.amber, fontSize:11, fontWeight:800,
                        letterSpacing:1.2, textTransform:"uppercase" }}>By age 70</p>
                      <div style={{ background:"rgba(245,158,11,.2)", borderRadius:99,
                        padding:"3px 8px", display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ color:T.amber, fontSize:11, fontWeight:700 }}>
                          {expandProj ? "▴ Close" : "▾ Chart"}
                        </span>
                      </div>
                    </div>
                    {at70 ? (
                      <>
                        <p style={{ color:T.amber, fontWeight:900,
                          fontSize:"clamp(24px,6vw,36px)", lineHeight:1, marginBottom:10,
                          textShadow:`0 0 30px ${T.amber}50` }}>{fmtK(at70.conservative)}</p>
                        <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.4 }}>conservative estimate</p>
                        {at70.optimistic > at70.conservative && (
                          <p style={{ color:T.amber, fontSize:13, fontWeight:700, marginTop:6 }}>
                            ✨ Up to {fmtK(at70.optimistic)} with the right moves
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p style={{ color:"#8FA3BE", fontWeight:900, fontSize:28, lineHeight:1, marginBottom:8 }}>—</p>
                        <p style={{ color:"#8FA3BE", fontSize:13 }}>Add your numbers to unlock</p>
                      </>
                    )}
                  </button>
                  {expandProj && (
                    <div className="ls-fadein" style={{ background:T.card,
                      border:`2px solid ${T.amber}`, borderTop:"none",
                      borderRadius:"0 0 20px 20px", padding:"16px" }}>
                      {projData
                        ? <ProjectionHeroCard nw={netWorth} surplus={surplus} age={profile?.age}/>
                        : <LockedCard icon="🔮" title="Wealth Projection"
                            description="Add your assets and income to unlock your projection."
                            unlock="Go to Analytics →" onUnlock={() => setTab(2)}/>
                      }
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
        <p style={{ color:"#6B8CB8", fontSize:12, textAlign:"center", marginTop:8, marginBottom:6 }}>
          ↑ Tap either number to expand the detail
        </p>
        <p style={{ color:"#8FA3BE", fontSize:14, lineHeight:1.65, textAlign:"center",
          marginBottom:16, padding:"0 8px" }}>
          This is your starting point. What you do next matters more than this number.
        </p>

        {/* ══ SECTION 2: THREE METRIC TILES ══ */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:22 }}>

          {/* FREEDOM NUMBER */}
          {(() => {
            const target = fireNumber || 0
            const current = Math.max(0, netWorth)
            const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
            return (
              <button onClick={() => setActiveTooltip("freedom")}
                style={{ background:`linear-gradient(160deg,rgba(245,158,11,.14),${T.card})`,
                  border:`1.5px solid ${T.amberBorder}`, borderRadius:20,
                  padding:"16px 12px 14px", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>🏁</span>
                  <span style={{ color:"#8FA3BE", fontSize:12, background:"rgba(255,255,255,.06)",
                    borderRadius:99, width:20, height:20, display:"flex", alignItems:"center",
                    justifyContent:"center" }}>?</span>
                </div>
                <p style={{ color:"#E2EAF6", fontWeight:800, fontSize:12, lineHeight:1.3, marginBottom:4 }}>
                  Freedom number
                </p>
                <p style={{ color:T.amber, fontWeight:900, fontSize:20, lineHeight:1, marginBottom:6 }}>
                  {target > 0 ? fmtK(target) : "—"}
                </p>
                <div style={{ position:"relative", marginBottom:4 }}>
                  <div style={{ background:T.faint, borderRadius:99, height:8, overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`, height:"100%", borderRadius:99,
                      background:`linear-gradient(90deg,${T.amber}70,${T.amber})`,
                      minWidth: pct > 0 ? 10 : 0, transition:"width .5s" }}/>
                  </div>
                </div>
                <p style={{ color:"#8FA3BE", fontSize:11 }}>
                  {pct > 0 ? `${pct}% of target` : "Add spending to calculate"}
                </p>
              </button>
            )
          })()}

          {/* SAFETY NET — semi-circle dial */}
          {(() => {
            const months = safetyMonths || 0
            const scale = 6
            const f = Math.min(months, scale) / scale
            const cx = 60, cy = 56, r = 44
            const needleR = 36
            const nx = cx - needleR * Math.cos(f * Math.PI)
            const ny = cy - needleR * Math.sin(f * Math.PI)
            const p1x = cx - r * Math.cos(1/3 * Math.PI)
            const p1y = cy - r * Math.sin(1/3 * Math.PI)
            const p2x = cx - r * Math.cos(2/3 * Math.PI)
            const p2y = cy - r * Math.sin(2/3 * Math.PI)
            const dialColor = months >= 5 ? T.green : months >= 3 ? T.teal : months >= 1 ? T.amber : T.red
            return (
              <button onClick={() => setActiveTooltip("safety")}
                style={{ background:`linear-gradient(160deg,${dialColor}10,${T.card})`,
                  border:`1.5px solid ${dialColor}40`, borderRadius:20,
                  padding:"16px 10px 14px", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:2 }}>
                  <span style={{ fontSize:20 }}>🛡️</span>
                  <span style={{ color:"#8FA3BE", fontSize:12, background:"rgba(255,255,255,.06)",
                    borderRadius:99, width:20, height:20, display:"flex", alignItems:"center",
                    justifyContent:"center" }}>?</span>
                </div>
                <svg width="100%" viewBox="0 0 120 66" style={{ display:"block", margin:"2px 0 4px" }}>
                  <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${p1x.toFixed(1)},${p1y.toFixed(1)}`}
                    fill="none" stroke={T.red} strokeWidth="10" strokeLinecap="butt"/>
                  <path d={`M ${p1x.toFixed(1)},${p1y.toFixed(1)} A ${r},${r} 0 0,1 ${p2x.toFixed(1)},${p2y.toFixed(1)}`}
                    fill="none" stroke={T.amber} strokeWidth="10" strokeLinecap="butt"/>
                  <path d={`M ${p2x.toFixed(1)},${p2y.toFixed(1)} A ${r},${r} 0 0,1 ${cx+r},${cy}`}
                    fill="none" stroke={T.green} strokeWidth="10" strokeLinecap="butt"/>
                  <line x1={cx} y1={cy} x2={nx.toFixed(1)} y2={ny.toFixed(1)}
                    stroke={dialColor} strokeWidth="3" strokeLinecap="round"/>
                  <circle cx={cx} cy={cy} r="5" fill={dialColor}/>
                  <circle cx={cx} cy={cy} r="2.5" fill={T.bg}/>
                </svg>
                <p style={{ color:dialColor, fontWeight:900, fontSize:16, lineHeight:1, marginBottom:2 }}>
                  {months > 0 ? `${months} months` : "0 months"}
                </p>
                <p style={{ color:"#E2EAF6", fontWeight:700, fontSize:12, marginBottom:2 }}>Safety net</p>
                <p style={{ color:"#8FA3BE", fontSize:11 }}>target: 3 to 6 months</p>
              </button>
            )
          })()}

          {/* INTEREST DRAG */}
          {(() => {
            const monthly = drag > 0 ? Math.round(drag / 12) : 0
            const isGood = drag === 0
            return (
              <button onClick={() => setActiveTooltip("drag")}
                style={{ background:`linear-gradient(160deg,${isGood?"rgba(52,211,153,.10)":T.redDim},${T.card})`,
                  border:`1.5px solid ${isGood?"rgba(52,211,153,.3)":T.redBorder}`,
                  borderRadius:20, padding:"16px 12px 14px", cursor:"pointer",
                  fontFamily:"inherit", textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{isGood ? "✅" : "💸"}</span>
                  <span style={{ color:"#8FA3BE", fontSize:12, background:"rgba(255,255,255,.06)",
                    borderRadius:99, width:20, height:20, display:"flex", alignItems:"center",
                    justifyContent:"center" }}>?</span>
                </div>
                <p style={{ color:isGood?T.green:T.red, fontWeight:900, fontSize:22,
                  lineHeight:1, marginBottom:2 }}>
                  {isGood ? "£0" : `${fmt(monthly)}`}
                </p>
                <p style={{ color:"#E2EAF6", fontWeight:700, fontSize:12, lineHeight:1.3, marginBottom:2 }}>
                  Interest drag
                </p>
                <p style={{ color:"#8FA3BE", fontSize:11 }}>
                  {isGood ? "No interest costs" : "per month to lenders"}
                </p>
              </button>
            )
          })()}
        </div>

        {/* Metric explanations */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
          <p style={{ color:"#8FA3BE", fontSize:11, lineHeight:1.5, textAlign:"center" }}>
            You're {fireNumber ? `${Math.min(100,Math.round((Math.max(0,netWorth)/fireNumber)*100))}% of the way` : "building toward"} financial freedom. Keep going.
          </p>
          <p style={{ color:"#8FA3BE", fontSize:11, lineHeight:1.5, textAlign:"center" }}>
            {safetyMonths != null ? `You have ${safetyMonths} months covered.` : "Add your savings."} Aim for 3 to 6 months.
          </p>
          <p style={{ color:drag>0?"#F87171":"#8FA3BE", fontSize:11, lineHeight:1.5, textAlign:"center" }}>
            {drag>0 ? `£${Math.round(drag/12).toLocaleString("en-GB")} lost monthly. This is slowing you down.` : "No interest drag. Good position."}
          </p>
        </div>

        {/* ══ SECTION 3: PERSONALITY ══ */}
        {!quizResult && (
          <button onClick={() => setShowQuiz(true)}
            style={{ width:"100%",
              background:"linear-gradient(145deg,rgba(88,28,252,.20),rgba(15,191,184,.10))",
              border:"1.5px solid rgba(167,139,250,.4)", borderRadius:22,
              padding:"20px", cursor:"pointer", fontFamily:"inherit",
              textAlign:"left", marginBottom:20, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100,
              borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,.25) 0%,transparent 70%)",
              pointerEvents:"none" }}/>
            <div style={{ position:"relative", display:"flex", alignItems:"center",
              justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:28 }}>🧠</span>
                <div>
                  <p style={{ color:"rgba(167,139,250,.8)", fontSize:11, fontWeight:700,
                    letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Money Personality</p>
                  <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:16, marginBottom:2 }}>
                    What type of investor are you?
                  </p>
                  <p style={{ color:"rgba(167,139,250,.65)", fontSize:13 }}>8 archetypes · 12 questions</p>
                </div>
              </div>
              <div style={{ background:T.purple, borderRadius:12, padding:"10px 16px", flexShrink:0 }}>
                <p style={{ color:"#FFFFFF", fontSize:13, fontWeight:800 }}>Start →</p>
              </div>
            </div>
          </button>
        )}
        {quizResult && arch && (
          <button onClick={() => setShowResult(true)}
            style={{ width:"100%", background:`${arch.color}12`,
              border:`1.5px solid ${arch.color}35`, borderRadius:22,
              padding:"18px 20px", cursor:"pointer", fontFamily:"inherit",
              textAlign:"left", display:"flex", alignItems:"center",
              gap:14, marginBottom:20 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${arch.color}22`,
              border:`1.5px solid ${arch.color}45`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:24, flexShrink:0 }}>{arch.emoji}</div>
            <div style={{ flex:1 }}>
              <p style={{ color:arch.color, fontWeight:700, fontSize:11, letterSpacing:.5,
                textTransform:"uppercase", marginBottom:3 }}>Your money personality</p>
              <p style={{ color:T.white, fontWeight:800, fontSize:16 }}>{arch.name}</p>
              <p style={{ color:"#C8D8EC", fontSize:13, marginTop:2 }}>{arch.headline}</p>
            </div>
            <span style={{ color:arch.color, fontSize:18, fontWeight:700, flexShrink:0 }}>›</span>
          </button>
        )}

        {/* ══ SECTION 4: LEARNING PATH ══ */}
        {(() => {
          const completedLevels = state.completedLevels || []
          const doneSet2 = new Set(completedLevels)
          const lvData = [
            {n:1, phase:"Foundations", color:T.red,   grad:"linear-gradient(135deg,#8B0000,#C0392B)", emoji:"📊", title:"Know Your Net Worth",       hook:"See your real financial position for the very first time. Most people never do this."},
            {n:2, phase:"Foundations", color:T.red,   grad:"linear-gradient(135deg,#7B1A1A,#E74C3C)", emoji:"💼", title:"Income and Spending",        hook:"Find the gap between what comes in and what quietly leaves every month."},
            {n:3, phase:"Foundations", color:T.red,   grad:"linear-gradient(135deg,#6B1111,#C0392B)", emoji:"🎯", title:"Budget That Works",           hook:"Give every pound a job. Stop money disappearing without a trace."},
            {n:4, phase:"Foundations", color:T.red,   grad:"linear-gradient(135deg,#5C0A0A,#A93226)", emoji:"📋", title:"Payslip and Tax",             hook:"Most people overpay tax without ever knowing it."},
            {n:5, phase:"Stabilise",   color:T.amber, grad:"linear-gradient(135deg,#7D4000,#E67E22)", emoji:"⚔️", title:"Destroy Bad Debt",            hook:"High-interest debt costs you 29p for every pound, every year. Kill it first."},
            {n:6, phase:"Stabilise",   color:T.amber, grad:"linear-gradient(135deg,#6E3600,#CA6F1E)", emoji:"🛡️", title:"Build Your Safety Net",       hook:"The fund that stops any setback from becoming a debt spiral."},
            {n:7, phase:"Optimise",    color:T.blue,  grad:"linear-gradient(135deg,#1A3C5C,#2980B9)", emoji:"💰", title:"Capture Free Money",          hook:"Your employer is offering money you are not claiming. Today that changes."},
            {n:8, phase:"Grow",        color:T.green, grad:"linear-gradient(135deg,#0A4A2A,#27AE60)", emoji:"📦", title:"Open Your ISA",               hook:"A legal tax-free wrapper. Every pound that grows here is yours to keep."},
            {n:9, phase:"Grow",        color:T.green, grad:"linear-gradient(135deg,#083D22,#1E8449)", emoji:"📈", title:"Make Your First Investment",   hook:"Time in the market beats timing the market. Start now, start small."},
          ]
          const nextLv = lvData.find(l => !doneSet2.has(l.n)) || lvData[lvData.length-1]
          const pct = Math.round((completedLevels.length / 9) * 100)

          return (
            <div style={{ marginBottom:24 }}>
              {/* Header */}
              {/* Strong action intro */}
              <div style={{ background:"linear-gradient(135deg,rgba(15,191,184,.10),rgba(167,139,250,.08))",
                border:"1.5px solid rgba(15,191,184,.20)", borderRadius:20, padding:"20px",
                marginBottom:18 }}>
                <p style={{ color:T.teal, fontSize:11, fontWeight:800, letterSpacing:1.2,
                  textTransform:"uppercase", marginBottom:10 }}>Your path to financial freedom</p>
                <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:17, lineHeight:1.4, marginBottom:10 }}>
                  Most people are never taught the basics of money — and spend years wishing they had been.
                </p>
                <p style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.65, marginBottom:12 }}>
                  These 9 levels are your guide. Work through them, implement the small changes they suggest, and your financial position will compound faster than you think.
                </p>
                <p style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.65, marginBottom:12 }}>
                  No one else can fix your finances until you take charge. It is easier than you think. And time matters more than what you have right now — so start today.
                </p>
                <div style={{ background:"rgba(255,255,255,.05)", borderRadius:14, padding:"14px 16px" }}>
                  <p style={{ color:T.purple, fontWeight:800, fontSize:14, marginBottom:4 }}>
                    Most people never complete this.
                  </p>
                  <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.55 }}>
                    If you do, you will be ahead of 90% of people financially. Start now.
                  </p>
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <p style={{ color:T.white, fontWeight:900, fontSize:20 }}>Your financial guide</p>
                  <button onClick={() => setTab(1)}
                    style={{ background:"rgba(167,139,250,.15)", border:"1px solid rgba(167,139,250,.35)",
                      borderRadius:10, padding:"6px 14px", cursor:"pointer", fontFamily:"inherit",
                      color:T.purple, fontSize:13, fontWeight:700 }}>View all →</button>
                </div>
                <p style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.6, marginBottom:12 }}>
                  {completedLevels.length === 0
                    ? "Nine steps to financial freedom. We walk you through each one — and by the end, your money works for you."
                    : completedLevels.length < 9
                      ? `Step ${nextLv.n} of 9. Every lesson is something concrete you can act on today.`
                      : "Every step complete. You have done what most people never do."
                  }
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, background:T.surface, borderRadius:99, height:6, overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`, height:"100%",
                      background:`linear-gradient(90deg,${T.teal},${T.purple})`,
                      borderRadius:99, transition:"width .5s ease" }}/>
                  </div>
                  <p style={{ color:"#8FA3BE", fontSize:12, fontWeight:700, flexShrink:0 }}>
                    {completedLevels.length}/9
                  </p>
                </div>
              </div>

              {/* 2-column portrait tile grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {lvData.map((lv, idx) => {
                  const isDone = doneSet2.has(lv.n)
                  const isCurrent = lv.n === nextLv.n && !isDone
                  const isLocked = !isDone && !isCurrent && lv.n > nextLv.n
                  const showPhaseDivider = idx === 4 || idx === 6 || idx === 7
                  return (
                    <div key={lv.n}>
                      {showPhaseDivider && idx % 2 === 0 && (
                        <div style={{ gridColumn:"1 / -1" }}/>
                      )}
                      <button onClick={() => { save({...state, pendingLearnLevel:lv.n}); setTab(1) }} className="ls-card-lift"
                        style={{ width:"100%", background:T.card,
                          border:`2px solid ${isCurrent ? lv.color : isDone ? T.green+"35" : T.border}`,
                          borderRadius:22, overflow:"hidden", cursor:"pointer",
                          fontFamily:"inherit", textAlign:"left",
                          opacity: isLocked && lv.n > nextLv.n + 2 ? 0.5 : 1,
                          boxShadow: isCurrent ? `0 4px 24px ${lv.color}25` : "none" }}>

                        {/* Image area — colored gradient with big emoji */}
                        <div style={{ height:110, background:isDone
                            ? "linear-gradient(135deg,rgba(52,211,153,.25),rgba(52,211,153,.08))"
                            : lv.grad,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          position:"relative", overflow:"hidden" }}>
                          {/* Background texture */}
                          <div style={{ position:"absolute", inset:0,
                            background:"radial-gradient(circle at 70% 30%,rgba(255,255,255,.08) 0%,transparent 60%)" }}/>
                          {/* Phase label top-left */}
                          <div style={{ position:"absolute", top:10, left:10,
                            background:"rgba(0,0,0,.35)", borderRadius:99, padding:"3px 9px" }}>
                            <p style={{ color:"rgba(255,255,255,.85)", fontSize:10, fontWeight:700,
                              letterSpacing:.5, textTransform:"uppercase" }}>{lv.phase}</p>
                          </div>
                          {/* State badge top-right */}
                          <div style={{ position:"absolute", top:10, right:10,
                            background: isDone ? "rgba(52,211,153,.3)" : isCurrent ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.35)",
                            borderRadius:99, padding:"3px 9px" }}>
                            <p style={{ color:"#FFFFFF", fontSize:10, fontWeight:800 }}>
                              {isDone ? "✓ Done" : isCurrent ? "Current" : `Step ${lv.n}`}
                            </p>
                          </div>
                          {/* Big emoji */}
                          <span style={{ fontSize:44, filter: isDone ? "grayscale(0.3)" : "none",
                            position:"relative", zIndex:1 }}>{isDone ? "✅" : lv.emoji}</span>
                        </div>

                        {/* Text area */}
                        <div style={{ padding:"14px 14px 16px" }}>
                          <p style={{ color:isDone ? "#6A8098" : T.white, fontWeight:800,
                            fontSize:14, lineHeight:1.3, marginBottom:6,
                            textDecoration:isDone ? "line-through" : "none" }}>{lv.title}</p>
                          <p style={{ color:isDone ? "#4A6080" : "#C8D8EC",
                            fontSize:12, lineHeight:1.5, marginBottom:10 }}>{lv.hook}</p>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <p style={{ color:isCurrent ? lv.color : isDone ? T.green : "#8FA3BE",
                              fontSize:11, fontWeight:700 }}>
                              {isDone ? "Completed" : isCurrent ? "Continue →" : "Coming up"}
                            </p>
                            {!isDone && (
                              <div style={{ background:`${lv.color}20`, borderRadius:99,
                                padding:"2px 8px" }}>
                                <p style={{ color:lv.color, fontSize:10, fontWeight:700 }}>+{lv.n <= 4 ? 20 : lv.n <= 6 ? 20 : lv.n <= 7 ? 15 : 25} XP</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* ══ SECTION 5: GOALS ══ */}
        <DashboardGoals goals={goals} surplus={surplus} save={save} state={state} toast={toast} setTab={setTab}/>
        {!hasPriorities && <GoalPickerSection state={state} save={save} toast={toast}/>}
        {hasPriorities && (
          <>
            <GoalLinkedLessons priorityGoals={priorityGoals} completedLessons={state.completedLessons||[]} setTab={setTab}/>
          </>
        )}
      </div>
    </div>
  )
}


/* ── Dashboard guidance + locked insights ────────────────────────── */
function DashboardBuilder({ state, setTab }) {
  const assets = state.assets || []
  const hasDetailed = assets.some(a=>a.interestRate!==undefined||a.annualReturn!==undefined)

  const LOCKED = [
    { icon:"📊", label:"Budget breakdown", color:T.teal, colorDim:T.tealDim, colorBorder:T.tealBorder,
      desc:"How your money is actually split housing, food, fun and more.",
      req:"Add spending categories in Track →", tab:3 },
    { icon:"🎯", label:"Debt payoff timeline", color:T.red, colorDim:T.redDim, colorBorder:T.redBorder,
      desc:"See exactly when each debt clears and how much interest you'll save.",
      req:"Add your debts with exact rates in Track →", tab:3 },
    { icon:"📈", label:"Investment growth tracker", color:T.purple, colorDim:T.purpleDim, colorBorder:T.purpleBorder,
      desc:"Portfolio performance vs benchmarks, with compound projections.",
      req:"Add investment assets with values in Track →", tab:3 },
    { icon:"🏛️", label:"Pension projector", color:T.amber, colorDim:T.amberDim, colorBorder:T.amberBorder,
      desc:"Your pension pot at retirement based on current contributions.",
      req:"Add your pension in Track →", tab:3 },
  ]

  return (
    <div style={{ marginBottom:28 }}>
      {/* Guidance card */}
      <div style={{ background:`linear-gradient(135deg,${T.tealDim},${T.purpleDim})`,border:`1px solid ${T.tealBorder}`,borderRadius:18,padding:"18px 20px",marginBottom:20 }}>
        <p style={{ color:T.teal,fontWeight:800,fontSize:15,marginBottom:8 }}>💡 Get more from LifeSmart</p>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {[
            { icon:"📝", text:"Enter your accurate asset and debt figures to get reliable projections approximate numbers give approximate results." },
            { icon:"📚", text:"Complete the lessons linked to your goals each one gives you a practical edge." },
            { icon:"📅", text:"Update your figures every month to watch your net worth chart update in real time." },
            { icon:"🏆", text:"See how you compare to others your age people who track consistently pull ahead." },
          ].map((g,i)=>(
            <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
              <span style={{ fontSize:16,flexShrink:0,marginTop:1 }}>{g.icon}</span>
              <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.5,fontWeight:500 }}>{g.text}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setTab(2)} style={{ background:T.teal,border:"none",borderRadius:10,padding:"10px 20px",color:T.bg,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:14,width:"100%" }}>
          Update my figures in Track →
        </button>
      </div>

      <p style={{ color:"#E2EAF6",fontWeight:700,fontSize:14,marginBottom:12 }}>🔒 Unlock more insights</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
        {LOCKED.map(t=>(
          <button key={t.label} onClick={()=>setTab(t.tab)}
            style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 14px",textAlign:"left",fontFamily:"inherit",cursor:"pointer",opacity:.75,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:8,right:10 }}><Lock size={12} color={T.subtle}/></div>
            <div style={{ width:36,height:36,borderRadius:10,background:t.colorDim,border:`1px solid ${t.colorBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:8 }}>{t.icon}</div>
            <p style={{ color:"#E2EAF6",fontWeight:700,fontSize:13,marginBottom:4,lineHeight:1.3 }}>{t.label}</p>
            <p style={{ color:"#8FA3BE",fontSize:12,lineHeight:1.4 }}>{t.req}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Reusable insight card wrapper ──────────────────────────────── */
function InsightCard({ icon, title, sub, iconBg, iconBorder, infoText, children }) {
  return (
    <div className="ls-card-glass" style={{ border:`1px solid ${T.border}`,borderRadius:20,padding:"20px 22px",boxShadow:"0 4px 24px rgba(0,0,0,.25)" }}>
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

/* ── Projection hero card big, jagged, exciting ─────────────── */
function ProjectionHeroCard({ nw, surplus, age }) {
  const data = useMemo(()=>calcProjection(nw,surplus,age),[nw,surplus,age])
  const targetAge = 70
  const atTarget  = data.find(d=>Math.round(d.age)===targetAge)
  const fmtAx = v => v>=1e6?`£${(v/1e6).toFixed(1)}M`:v>=1000?`£${(v/1000).toFixed(0)}k`:v<0?`-£${Math.abs(Math.round(v/1000))}k`:""

  return (
    <div className="ls-card-glass ls-glow" style={{ border:`1.5px solid ${T.tealBorder}`,borderRadius:22,padding:"22px 24px",boxShadow:"0 0 40px rgba(15,191,184,.12), 0 8px 32px rgba(0,0,0,.3)" }}>
      <p style={{ color:T.teal,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>LifeSmart Wealth Projection</p>

      {atTarget && (
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:"clamp(28px,6vw,40px)",fontWeight:900,lineHeight:1,color:T.teal,textShadow:`0 0 30px ${T.teal}50`,marginBottom:8 }}>
            {fmtK(atTarget.conservative)}
          </p>
          <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.6,marginBottom:6 }}>
            Based on your current assets, a conservative growth estimate and your financial profile. As you add more information, complete lessons and build your assets, this number will grow.
          </p>
          {atTarget.optimistic > atTarget.conservative && (
            <div style={{ background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.25)",borderRadius:10,padding:"10px 14px",marginTop:8 }}>
              <p style={{ color:T.amber,fontSize:14,fontWeight:700 }}>
                ✨ Or {fmtK(atTarget.optimistic)} with the right money decisions, optimising your investments and pension could get you there.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div style={{ height:160,margin:"16px 0 10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:5,right:4,bottom:0,left:0 }}>
            <defs>
              <linearGradient id="gCon12" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.teal}  stopOpacity={.3}/>
                <stop offset="95%" stopColor={T.teal}  stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gOpt12" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.amber} stopOpacity={.08}/>
                <stop offset="95%" stopColor={T.amber} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="age" tick={{ fontSize:10,fill:"#8FA3BE" }} axisLine={false} tickLine={false} interval={5}/>
            <YAxis tick={{ fontSize:9,fill:"#344D68" }} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={42}/>
            <Tooltip
              formatter={(v,name)=>[fmt(v), name==="conservative"?"Realistic (conservative)":"Optimistic (right decisions)"]}
              labelFormatter={v=>`Age ${Math.round(v)}`}
              contentStyle={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white }}/>
            <Area type="monotone" dataKey="optimistic"   stroke={T.amber} strokeWidth={1.5} strokeDasharray="5 4" fill="url(#gOpt12)" dot={false} strokeOpacity={0.5}/>
            <Area type="monotone" dataKey="conservative" stroke={T.teal}  strokeWidth={2.5} fill="url(#gCon12)"  dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:20,height:3,background:T.teal,borderRadius:2 }}/><span style={{ color:"#E2EAF6",fontSize:12,fontWeight:600 }}>Realistic (conservative)</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:18,height:0,borderTop:`2px dashed ${T.amber}`,opacity:.7 }}/><span style={{ color:"#E2EAF6",fontSize:12 }}>Optimistic (right decisions)</span></div>
      </div>
    </div>
  )
}

/* ── Wealth breakdown no bar, use visual blocks ─────────────── */
function WealthBreakdownCard({ bk, totalAssets }) {
  const segments = [
    {
      label:"Safety net", value:bk.safetyNet, color:T.teal, icon:"🛡️",
      info:"Liquid savings you can access immediately cash, easy-access accounts. This is your financial cushion. Goal: 3to6 months of expenses."
    },
    {
      label:"Working wealth", value:bk.wealthBuilders, color:T.purple, icon:"📈",
      info:"Investments, pension, and business assets that actively grow over time. This is the engine of long-term wealth money that compounds while you sleep."
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

      {/* Visual blocks proportional height bars */}
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
              <p style={{ color:"#8FA3BE",fontSize:12,lineHeight:1.4 }}>{s.info.slice(0,60)}…</p>
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

/* ── Dashboard Goals (prominent, 3 types) ────────────────────────── */
function DashboardGoals({ goals, surplus, save, state, toast, setTab }) {
  const [showSheet, setShowSheet] = useState(null) // "save"|"action"|"learn"|"edit"
  const [editGoal, setEditGoal] = useState(null)
  const [saveName, setSaveName] = useState("")
  const [saveTarget, setSaveTarget] = useState(0)
  const [saveSaved, setSaveSaved] = useState(0)
  const [saveMonthly, setSaveMonthly] = useState(0)
  const [saveType, setSaveType] = useState(null)
  const [actionType, setActionType] = useState(null)

  const SAVE_OPTIONS = [
    { id:"emergency", icon:"🛡️", label:"Emergency fund" },
    { id:"holiday",   icon:"✈️", label:"Holiday" },
    { id:"home",      icon:"🏠", label:"Buy a home" },
    { id:"education", icon:"📚", label:"Education" },
    { id:"other_goal",icon:"⭐", label:"Something else" },
  ]

  const ACTION_OPTIONS = [
    { id:"invest",     icon:"📈", label:"Start investing", steps:[
      "Open a Stocks & Shares ISA",
      "Choose a low cost global index fund",
      "Set up a monthly direct debit",
      "Keep it going for 3 months",
      "Review and increase when you can",
    ]},
    { id:"pension",    icon:"🏛️", label:"Sort my pension", steps:[
      "Find your current pension value",
      "Check your employer match limit",
      "Increase your contribution by 1%",
      "Consolidate any old pensions",
    ]},
    { id:"debt_clear", icon:"💳", label:"Clear my debt", steps:[
      "List all debts with interest rates",
      "Pay minimums on everything",
      "Put extra money into the highest rate debt",
      "Once cleared, move to the next highest rate",
    ]},
    { id:"account",    icon:"🏦", label:"Open an account", steps:[
      "Research the best accounts for your needs",
      "Gather your ID and proof of address",
      "Apply online or in branch",
      "Set up your direct debits and standing orders",
    ]},
  ]

  const LEARN_OPTIONS = [
    { id:"budgeting",   icon:"🥧", label:"I want to budget better" },
    { id:"investing",   icon:"📈", label:"I want to understand investing" },
    { id:"pensions",    icon:"🏛️", label:"I want to understand pensions" },
    { id:"debt_learn",  icon:"💳", label:"I want to manage debt better" },
    { id:"tax",         icon:"📋", label:"I want to understand tax wrappers" },
    { id:"property",    icon:"🏠", label:"I want to learn about property" },
  ]

  const activeGoals = goals.filter(g=>!ACTION_GOALS.has(g.type)?calcGoalProgress(g,surplus).pct<100:true)

  function saveNewGoal() {
    if(!saveType || saveTarget<=0) return
    const cfg = SAVE_OPTIONS.find(o=>o.id===saveType) || SAVE_OPTIONS[4]
    const newGoal = {
      id:`goal_${Date.now()}`, type:saveType, name:saveName||cfg.label,
      targetAmount:saveTarget, startAmount:saveSaved, monthlyAmount:saveMonthly,
      createdAt:new Date().toISOString(), checkedActions:[]
    }
    save({ ...state, goals:[...goals, newGoal] })
    toast("✓ Goal created")
    setShowSheet(null); setSaveName(""); setSaveTarget(0); setSaveSaved(0); setSaveMonthly(0); setSaveType(null)
  }

  function saveActionGoal() {
    if(!actionType) return
    const cfg = ACTION_OPTIONS.find(o=>o.id===actionType)
    const newGoal = {
      id:`goal_${Date.now()}`, type:actionType, name:cfg?.label||"Action",
      targetAmount:0, startAmount:0, monthlyAmount:0,
      createdAt:new Date().toISOString(), checkedActions:[]
    }
    save({ ...state, goals:[...goals, newGoal] })
    toast("✓ Action plan created")
    setShowSheet(null); setActionType(null)
  }

  // Dynamic time calculation
  const monthsNeeded = saveMonthly > 0 && saveTarget > saveSaved ? Math.ceil((saveTarget - saveSaved) / saveMonthly) : null
  const etaDate = monthsNeeded ? (()=>{ const d = new Date(); d.setMonth(d.getMonth()+monthsNeeded); return d.toLocaleDateString("en-GB",{month:"short",year:"numeric"}) })() : null

  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
        <p style={{ color:"#FFFFFF",fontWeight:800,fontSize:17 }}>Your Goals</p>
      </div>

      {/* Existing goals */}
      {activeGoals.length > 0 && (
        <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:14 }}>
          {activeGoals.slice(0,3).map(g=>{
            const cfg = GOAL_TYPES.find(t=>t.id===g.type) || GOAL_TYPES[GOAL_TYPES.length-1]
            const isAction = ACTION_GOALS.has(g.type) || ACTION_OPTIONS.some(a=>a.id===g.type)
            const actions = GOAL_ACTIONS[g.type] || ACTION_OPTIONS.find(a=>a.id===g.type)?.steps?.map((s,i)=>({id:`step_${i}`,label:s})) || []
            const checked = new Set(g.checkedActions||[])
            const { pct, current, eta } = isAction ? { pct:actions.length>0?Math.round(checked.size/actions.length*100):0, current:0, eta:null } : calcGoalProgress(g, surplus)
            return (
              <div key={g.id} style={{ background:T.card,border:`1.5px solid ${cfg.border||T.border}`,borderRadius:18,padding:"16px 18px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{cfg.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{g.name}</p>
                    {!isAction && <p style={{ color:T.muted,fontSize:12 }}>{fmt(current)} of {fmt(g.targetAmount)}{eta?` · on track for ${eta}`:""}</p>}
                    {isAction && <p style={{ color:T.muted,fontSize:12 }}>{checked.size}/{actions.length} steps done</p>}
                  </div>
                  <span style={{ color:cfg.color||T.teal,fontWeight:900,fontSize:14 }}>{pct}%</span>
                </div>
                <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`,height:"100%",background:cfg.color||T.teal,borderRadius:99,transition:"width .6s ease" }}/>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add goal buttons (3 types) */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
        <button onClick={()=>setShowSheet("save")}
          style={{ background:`linear-gradient(145deg,${T.tealDim},rgba(15,191,184,.02))`,border:`1.5px solid ${T.tealBorder}`,borderRadius:18,padding:"18px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
          <span style={{ fontSize:24,display:"block",marginBottom:6 }}>🎯</span>
          <p style={{ color:T.teal,fontWeight:800,fontSize:13 }}>Save for</p>
          <p style={{ color:T.teal,fontWeight:800,fontSize:13 }}>something</p>
        </button>
        <button onClick={()=>setShowSheet("action")}
          style={{ background:`linear-gradient(145deg,${T.amberDim},rgba(245,158,11,.02))`,border:`1.5px solid ${T.amberBorder}`,borderRadius:18,padding:"18px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
          <span style={{ fontSize:24,display:"block",marginBottom:6 }}>⚡</span>
          <p style={{ color:T.amber,fontWeight:800,fontSize:13 }}>Take an</p>
          <p style={{ color:T.amber,fontWeight:800,fontSize:13 }}>action</p>
        </button>
        <button onClick={()=>setShowSheet("learn")}
          style={{ background:`linear-gradient(145deg,${T.purpleDim},rgba(167,139,250,.02))`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:18,padding:"18px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
          <span style={{ fontSize:24,display:"block",marginBottom:6 }}>💡</span>
          <p style={{ color:T.purple,fontWeight:800,fontSize:13 }}>Learn about</p>
          <p style={{ color:T.purple,fontWeight:800,fontSize:13 }}>an area</p>
        </button>
      </div>

      {/* Save for something sheet */}
      {showSheet==="save" && (
        <Sheet title="Save for something" onClose={()=>setShowSheet(null)}>
          {!saveType ? (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
              {SAVE_OPTIONS.map(o=>(
                <button key={o.id} onClick={()=>{ setSaveType(o.id); setSaveName(o.label) }}
                  style={{ background:T.card,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all .15s" }}>
                  <span style={{ fontSize:28,display:"block",marginBottom:6 }}>{o.icon}</span>
                  <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{o.label}</p>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <Input label="Goal name" value={saveName} onChange={setSaveName} placeholder="e.g. Holiday to Spain"/>
              <div style={{ height:12 }}/>
              <CurrencyInput label="Target amount" value={saveTarget} onChange={setSaveTarget}/>
              <div style={{ height:12 }}/>
              <CurrencyInput label="Already saved" value={saveSaved} onChange={setSaveSaved}/>
              <div style={{ height:12 }}/>
              <CurrencyInput label="Monthly contribution" value={saveMonthly} onChange={setSaveMonthly}/>

              {/* Dynamic time calculation */}
              {saveTarget > 0 && saveMonthly > 0 && (
                <div style={{ background:`linear-gradient(135deg,${T.tealDim},${T.purpleDim})`,border:`1px solid ${T.tealBorder}`,borderRadius:16,padding:"16px",marginTop:16,textAlign:"center" }}>
                  {monthsNeeded && (
                    <>
                      <p style={{ color:T.teal,fontWeight:900,fontSize:28,lineHeight:1 }}>
                        {monthsNeeded < 12 ? `${monthsNeeded} months` : `${Math.floor(monthsNeeded/12)} yr ${monthsNeeded%12} mo`}
                      </p>
                      <p style={{ color:"#C8D8EC",fontSize:13,marginTop:6 }}>
                        At {fmt(saveMonthly)}/month you will reach {fmt(saveTarget)} by <strong style={{ color:T.teal }}>{etaDate}</strong>
                      </p>
                    </>
                  )}
                </div>
              )}

              <div style={{ height:16 }}/>
              <Btn onClick={saveNewGoal} disabled={saveTarget<=0}>Create goal</Btn>
              <button onClick={()=>setSaveType(null)} style={{ background:"none",border:"none",color:T.muted,fontSize:13,cursor:"pointer",width:"100%",padding:8,marginTop:8,fontFamily:"inherit" }}>
                Back to options
              </button>
            </div>
          )}
        </Sheet>
      )}

      {/* Take an action sheet */}
      {showSheet==="action" && (
        <Sheet title="Take an action" onClose={()=>setShowSheet(null)}>
          {!actionType ? (
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {ACTION_OPTIONS.map(o=>(
                <button key={o.id} onClick={()=>setActionType(o.id)}
                  style={{ background:T.card,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all .15s" }}>
                  <span style={{ fontSize:24 }}>{o.icon}</span>
                  <div>
                    <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{o.label}</p>
                    <p style={{ color:T.muted,fontSize:12 }}>{o.steps.length} steps</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {(()=>{
                const cfg = ACTION_OPTIONS.find(o=>o.id===actionType)
                return (
                  <>
                    <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:20 }}>
                      <span style={{ fontSize:28 }}>{cfg.icon}</span>
                      <p style={{ color:T.white,fontWeight:800,fontSize:17 }}>{cfg.label}</p>
                    </div>
                    <p style={{ color:T.muted,fontSize:13,marginBottom:16 }}>Here is your step by step plan. Tick each one off as you go.</p>
                    <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:20 }}>
                      {cfg.steps.map((step,i)=>(
                        <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
                          <div style={{ width:24,height:24,borderRadius:7,border:`2px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.muted,fontSize:11,fontWeight:800 }}>{i+1}</div>
                          <p style={{ color:"#C8D8EC",fontSize:14,fontWeight:600 }}>{step}</p>
                        </div>
                      ))}
                    </div>
                    <Btn onClick={saveActionGoal}>Add this to my goals</Btn>
                    <button onClick={()=>setActionType(null)} style={{ background:"none",border:"none",color:T.muted,fontSize:13,cursor:"pointer",width:"100%",padding:8,marginTop:8,fontFamily:"inherit" }}>
                      Back to options
                    </button>
                  </>
                )
              })()}
            </div>
          )}
        </Sheet>
      )}

      {/* Learn about an area sheet */}
      {showSheet==="learn" && (
        <Sheet title="Learn about an area" onClose={()=>setShowSheet(null)}>
          <p style={{ color:T.muted,fontSize:13,marginBottom:16 }}>Choose what you want to learn about and we will build a personalised plan.</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {LEARN_OPTIONS.map(o=>(
              <button key={o.id} onClick={()=>{ setTab(1); setShowSheet(null); toast("Head to Learn to start your journey") }}
                style={{ background:T.card,border:`1.5px solid ${T.purpleBorder}`,borderRadius:16,padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all .15s" }}>
                <div style={{ width:40,height:40,borderRadius:12,background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{o.icon}</div>
                <p style={{ color:T.white,fontWeight:700,fontSize:14 }}>{o.label}</p>
                <div style={{ marginLeft:"auto" }}>
                  <ChevronRight size={16} color={T.purple}/>
                </div>
              </button>
            ))}
          </div>
        </Sheet>
      )}
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
        <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.5 }}>Pick your priorities we'll tailor your lessons and goals around them.</p>
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
  const linked = [] // lessons replaced by level journey
  if(linked.length===0) return null
  return (
    <div style={{ marginBottom:22 }}>
      <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Lessons for your goals</p>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {linked.map(l=>(
          <button key={l.id} onClick={()=>setTab(1)} style={{ background:T.card,border:`1.5px solid ${l.trackColor||T.teal}30`,borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:`${l.trackColor||T.teal}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{l.emoji}</div>
            <div style={{ flex:1 }}>
              <p style={{ color:l.trackColor||T.teal,fontWeight:700,fontSize:10,letterSpacing:.5,textTransform:"uppercase",marginBottom:3 }}>{l.track} {l.xp} XP</p>
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
        <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Your goals</p>
        <div style={{ display:"flex",gap:10 }}>
          {goals.length>0 && <button onClick={()=>setTab(0)} style={{ background:"none",border:"none",color:T.teal,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>See all →</button>}
          <button onClick={()=>setShowSheet(true)} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 12px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4 }}>
            <Plus size={12}/>Add
          </button>
        </div>
      </div>

      {displayed.length===0 ? (
        <button onClick={()=>setShowSheet(true)} style={{ width:"100%",background:T.tealDim,border:`1.5px dashed ${T.tealBorder}`,borderRadius:16,padding:"18px",cursor:"pointer",textAlign:"center",fontFamily:"inherit" }}>
          <p style={{ color:T.teal,fontWeight:700,fontSize:14,marginBottom:4 }}>🎯 Set your first goal</p>
          <p style={{ color:T.muted,fontSize:12 }}>Holiday, emergency fund, clear debt people with goals save 2× faster.</p>
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
          <div><p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{goal.name}</p><p style={{ color:"#8FA3BE",fontSize:12 }}>{checked.size}/{actions.length} steps</p></div>
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
          <p style={{ color:"#8FA3BE",fontSize:12 }}>{fmt(current)} of {fmt(goal.targetAmount)}</p>
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
  const [saved,  setSaved]  = useState(goal?.startAmount||0)
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
      startAmount: saved||0,
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
            <span style={{ fontSize:10,fontWeight:700,color:sel?t.color:"#E2EAF6",textAlign:"center",lineHeight:1.3 }}>{t.label}</span>
          </button>
        )})}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:16 }}>
        <Input label="Goal name" value={name} onChange={setName} placeholder={cfg?.label||"e.g. Emergency fund"}/>
        {!isAction && (
          <>
            <CurrencyInput label="Target amount" value={target} onChange={setTarget}/>
            <CurrencyInput label="Already saved towards this" value={saved} onChange={setSaved} helper="How much you've already put aside for this goal"/>
            <CurrencyInput label="Monthly contribution (optional)" value={monthly} onChange={setMonthly} helper="How much you plan to add each month"/>
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
      <p style={{ color:"#D8E8F8",fontSize:14,lineHeight:1.65,marginBottom:20 }}>Tick each step off as you complete it. Each one moves you closer to your goal.</p>
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
                <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.5 }}>{a.desc}</p>
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
          <p style={{ color:T.muted,fontSize:12 }}>{fmt(current)} saved{eta?` ${eta}`:""}</p>
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
    <div style={{ flex:1,overflowY:"auto",paddingBottom:20 }}>
      <div style={{ padding:"0 18px 24px",maxWidth:900,margin:"0 auto",width:"100%" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <p style={{ color:"#E2EAF6",fontWeight:700,fontSize:16 }}>Goals</p>
          <button onClick={()=>{ setEditGoal(null); setSheet("new") }}
            style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:10,padding:"8px 14px",color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
            <Plus size={13}/>Add goal
          </button>
        </div>

        {active.length===0 && completed.length===0 ? (
          <button onClick={()=>setSheet("new")} style={{ width:"100%",background:T.tealDim,border:`1.5px dashed ${T.tealBorder}`,borderRadius:16,padding:"20px",cursor:"pointer",textAlign:"center",fontFamily:"inherit" }}>
            <p style={{ color:T.teal,fontWeight:700,fontSize:15,marginBottom:4 }}>Set your first goal</p>
            <p style={{ color:"#E2EAF6",fontSize:13 }}>Holiday, house deposit, clear debt people with written goals build 2x more wealth.</p>
          </button>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:goals.length>0?16:0 }}>
            {active.map(g=>(
              <GoalCard key={g.id} goal={g} surplus={surplus}
                onEdit={()=>{ setEditGoal(g); setSheet(ACTION_GOALS.has(g.type)?"action":"edit") }}
                onDelete={()=>deleteGoal(g)}/>
            ))}
          </div>
        )}

        {completed.length>0 && (
          <>
            <p style={{ color:"#E2EAF6",fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,marginTop:16 }}>Completed</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {completed.map(g=>(
                <div key={g.id} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:18 }}>✅</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:"#E2EAF6",fontWeight:700,fontSize:14 }}>{g.name}</p>
                    <p style={{ color:"#8FA3BE",fontSize:12 }}>{fmt(g.targetAmount)} reached</p>
                  </div>
                  <button onClick={()=>deleteGoal(g)} style={{ background:"none",border:"none",color:"#8FA3BE",cursor:"pointer",padding:4 }}><Trash2 size={13}/></button>
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


function AnalyticsTab() {
  const { state, save, toast } = useApp()
  const [sheet, setSheet]     = useState(null)
  const [editItem, setEditItem]= useState(null)

  const { totalAssets, totalDebts } = calcTotals(state.assets, state.debts)
  const netWorth = totalAssets - totalDebts
  const drag = totalInterestDrag(state.debts)
  const surplus = calcSurplus(state.income, state.assets, state.spending)

  function saveAsset({ cat, name, val, monthlyIncome, hasLoan, loanBal, annualReturn, existingId, existingLinkedDebtId }) {
    let newAssets = [...state.assets]
    let newDebts  = [...state.debts]
    const assetId = existingId || `a_${Date.now()}`
    const assetObj = { id:assetId, category:cat, name, value:val, monthlyIncome:monthlyIncome||0, linkedDebtId:existingLinkedDebtId||null, annualReturn:annualReturn||null }

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

  function saveDebt({ cat, name, bal, rate, minPayment, existingId }) {
    const debtId = existingId || `d_${Date.now()}`
    const t = DEBT_TYPES.find(x=>x.cat===cat)
    const debtObj = { id:debtId, category:cat, name, balance:bal, interestRate:rate||t?.assumedRate||10, minPayment:minPayment||0, linkedAssetId:null, isAutoCreated:false }
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

  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:100 }}>

      {/* Sheet panels */}
      {sheet==="asset" && <Sheet title={editItem?"Edit asset":"Add asset"} onClose={()=>{setSheet(null);setEditItem(null)}}><AssetSheet item={editItem} onClose={()=>{setSheet(null);setEditItem(null)}} onSave={saveAsset}/></Sheet>}
      {sheet==="debt"  && <Sheet title={editItem?"Edit debt":"Add debt"}   onClose={()=>{setSheet(null);setEditItem(null)}}><DebtSheet  item={editItem} onClose={()=>{setSheet(null);setEditItem(null)}} onSave={saveDebt}/></Sheet>}

      {/* ── HERO HEADER ── */}
      <div style={{ background:"rgba(10,19,34,.97)", backdropFilter:"blur(16px)",
        padding:"20px 20px 0", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ color:T.white, fontWeight:900, fontSize:22, marginBottom:4, letterSpacing:-.3 }}>
            Track and Grow
          </h2>
          <p style={{ color:"#8FA3BE", fontSize:13, lineHeight:1.6, marginBottom:14 }}>
            Wealth does not grow by accident. The simple act of tracking it changes how you think about every financial decision.
          </p>

          {/* Net worth banner */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            background:`${netWorth>=0?T.tealDim:T.redDim}`, border:`1.5px solid ${netWorth>=0?T.tealBorder:T.redBorder}`,
            borderRadius:"16px 16px 0 0", padding:"14px 16px" }}>
            <div>
              <p style={{ color:netWorth>=0?T.teal:T.red, fontSize:11, fontWeight:700,
                letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Net worth</p>
              <p style={{ color:netWorth>=0?T.teal:T.red, fontWeight:900, fontSize:32, lineHeight:1,
                textShadow:netWorth>=0?`0 0 20px ${T.teal}50`:`0 0 20px ${T.red}40` }}>
                {fmt(netWorth)}
              </p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ marginBottom:6 }}>
                <p style={{ color:T.green, fontWeight:800, fontSize:16 }}>{fmt(totalAssets)}</p>
                <p style={{ color:"#6B8CB8", fontSize:11 }}>assets</p>
              </div>
              <div>
                <p style={{ color:totalDebts>0?T.red:"#6B8CB8", fontWeight:800, fontSize:16 }}>{fmt(totalDebts)}</p>
                <p style={{ color:"#6B8CB8", fontSize:11 }}>debts</p>
              </div>
            </div>
          </div>

          {/* Unlock insights strip */}
          <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,.15),rgba(15,191,184,.08))",
            border:"1px solid rgba(167,139,250,.25)", borderTop:"none",
            borderRadius:"0 0 16px 16px", padding:"12px 16px",
            display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <p style={{ color:"#C8D8EC", fontSize:13 }}>
              <span style={{ color:T.purple, fontWeight:700 }}>Unlock deeper insights</span> — add spending breakdown
            </p>
            <button onClick={()=>{/* TODO */}} style={{ background:T.purple, border:"none",
              borderRadius:10, padding:"7px 14px", color:"#FFFFFF", fontWeight:700,
              fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Unlock →</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"16px 18px" }}>

        {/* ── NARRATIVE ── */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
          padding:"16px", marginBottom:18 }}>
          <p style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.7, marginBottom:10 }}>
            <span style={{ color:T.white, fontWeight:700 }}>Most people never track this.</span> If you do, you will make better decisions and stay in control of your money.
          </p>
          <p style={{ color:"#8FA3BE", fontSize:13, lineHeight:1.65 }}>
            Once this is accurate, you can start making smarter moves — from budgeting to investing and long-term planning. You can even walk into a financial advisor meeting with a clear snapshot of your position. You cannot improve what you do not track.
          </p>
        </div>

        {/* ── ASSETS ── */}
        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:16 }}>Assets</p>
              <p style={{ color:T.green, fontWeight:700, fontSize:13 }}>{fmt(totalAssets)}</p>
            </div>
            <button onClick={() => { setEditItem(null); setSheet("asset") }}
              style={{ background:T.tealDim, border:`1px solid ${T.tealBorder}`, borderRadius:10,
                padding:"8px 14px", color:T.teal, fontWeight:700, fontSize:13,
                cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
          </div>
          {state.assets.length === 0 ? (
            <div style={{ background:T.faint, border:`1px dashed ${T.border}`, borderRadius:14,
              padding:"20px", textAlign:"center" }}>
              <p style={{ color:"#6B8CB8", fontSize:14 }}>No assets added yet</p>
              <p style={{ color:"#4A6080", fontSize:12, marginTop:4 }}>Add your savings, pension, property and more</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {state.assets.map(a => (
                <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12,
                  background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"12px 14px" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(52,211,153,.12)",
                    border:"1px solid rgba(52,211,153,.2)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:16, flexShrink:0 }}>
                    {ASSET_TYPES.find(t=>t.cat===a.category||t.id===a.category)?.icon || "📦"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:"#FFFFFF", fontWeight:700, fontSize:14 }}>{a.name}</p>
                    {a.monthlyIncome > 0 && (
                      <p style={{ color:T.teal, fontSize:11 }}>+{fmt(a.monthlyIncome)}/mo income</p>
                    )}
                  </div>
                  <p style={{ color:T.green, fontWeight:800, fontSize:15, flexShrink:0 }}>{fmt(a.value)}</p>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => { setEditItem(a); setSheet("asset") }}
                      style={{ background:"rgba(255,255,255,.06)", border:"none", borderRadius:8,
                        padding:"6px 10px", color:"#8FA3BE", fontSize:12, cursor:"pointer",
                        fontFamily:"inherit" }}>Edit</button>
                    <button onClick={() => deleteAsset(a)}
                      style={{ background:"rgba(248,113,113,.1)", border:"none", borderRadius:8,
                        padding:"6px 10px", color:T.red, fontSize:12, cursor:"pointer",
                        fontFamily:"inherit" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DEBTS ── */}
        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:16 }}>Debts</p>
              <p style={{ color:totalDebts>0?T.red:"#6B8CB8", fontWeight:700, fontSize:13 }}>{fmt(totalDebts)}</p>
            </div>
            <button onClick={() => { setEditItem(null); setSheet("debt") }}
              style={{ background:T.redDim, border:`1px solid ${T.redBorder}`, borderRadius:10,
                padding:"8px 14px", color:T.red, fontWeight:700, fontSize:13,
                cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
          </div>
          {state.debts.length === 0 ? (
            <div style={{ background:T.faint, border:`1px dashed ${T.border}`, borderRadius:14,
              padding:"20px", textAlign:"center" }}>
              <p style={{ color:"#6B8CB8", fontSize:14 }}>No debts recorded</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {state.debts.map(d => (
                <div key={d.id} style={{ display:"flex", alignItems:"center", gap:12,
                  background:T.card, border:`1px solid ${d.interestRate>15?T.redBorder:T.border}`,
                  borderRadius:14, padding:"12px 14px" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"rgba(248,113,113,.10)",
                    border:"1px solid rgba(248,113,113,.2)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:16, flexShrink:0 }}>
                    {DEBT_TYPES.find(t=>t.cat===d.category||t.id===d.category)?.icon || "💳"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:"#FFFFFF", fontWeight:700, fontSize:14 }}>{d.name}</p>
                    <p style={{ color: d.interestRate>15?T.red:"#8FA3BE", fontSize:11 }}>
                      {d.interestRate}% APR
                      {d.interestRate > 15 && " · high interest"}
                    </p>
                  </div>
                  <p style={{ color:T.red, fontWeight:800, fontSize:15, flexShrink:0 }}>{fmt(d.balance)}</p>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => { setEditItem(d); setSheet("debt") }}
                      style={{ background:"rgba(255,255,255,.06)", border:"none", borderRadius:8,
                        padding:"6px 10px", color:"#8FA3BE", fontSize:12, cursor:"pointer",
                        fontFamily:"inherit" }}>Edit</button>
                    {!d.isAutoCreated && <button onClick={() => deleteDebt(d)}
                      style={{ background:"rgba(248,113,113,.1)", border:"none", borderRadius:8,
                        padding:"6px 10px", color:T.red, fontSize:12, cursor:"pointer",
                        fontFamily:"inherit" }}>✕</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── INCOME ── */}
        <div style={{ marginBottom:18 }}>
          <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:16, marginBottom:10 }}>Income and Spending</p>
          <IncomeSection income={state.income} assets={state.assets} onSave={saveIncome}/>
        </div>

        {/* ── SPENDING BREAKDOWN ── */}
        <SpendingBreakdownChart state={state} save={saveSpending}/>

        {/* ── NET WORTH HISTORY ── */}
        <NetWorthMomentumChart state={state}/>

        {/* ── ASSET BREAKDOWN CHART ── */}
        <AssetBreakdownChart assets={state.assets} totalAssets={totalAssets} onConfirmAssets={()=>{}}/>

        {/* ── COMPARE ── */}
        <div style={{ background:`linear-gradient(135deg,${T.tealDim},${T.purpleDim})`,
          border:`1px solid ${T.tealBorder}`, borderRadius:18, padding:"18px",
          marginTop:8, marginBottom:8 }}>
          <p style={{ color:T.teal, fontWeight:800, fontSize:15, marginBottom:6 }}>
            How do you compare?
          </p>
          <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.65 }}>
            Come back regularly to update these numbers. The more accurate this snapshot is, the better every financial decision you make will be — from how you budget to what you invest in.
          </p>
        </div>
        <NetWorthOverviewSection state={state} save={save} setSection={()=>{}} setSheet={setSheet} setEditItem={setEditItem}/>

      </div>
    </div>
  )
}
}

function NetWorthOverviewSection({ state, save, setSection, setSheet, setEditItem }) {
  function saveFromOverview(newState){ save(newState) }
  const { totalAssets, totalDebts } = calcTotals(state.assets, state.debts)
  const netWorth = totalAssets - totalDebts
  const surplus  = calcSurplus(state.income, state.assets, state.spending)
  const drag     = totalInterestDrag(state.debts)

  // Asset breakdown
  const assetGroups = [
    { label:"Savings & Cash", icon:"💰", color:T.teal,   value: state.assets.filter(a=>a.category==="savings").reduce((s,a)=>s+(a.value||0),0) },
    { label:"Investments & ISA", icon:"📈", color:T.purple, value: state.assets.filter(a=>a.category==="investments").reduce((s,a)=>s+(a.value||0),0) },
    { label:"Pension", icon:"🏛️", color:T.amber,  value: state.assets.filter(a=>a.category==="pension").reduce((s,a)=>s+(a.value||0),0) },
    { label:"Property", icon:"🏠", color:T.green,  value: state.assets.filter(a=>["primary_residence","investment_property"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0) },
    { label:"Other Assets", icon:"📦", color:T.blue,   value: state.assets.filter(a=>!["savings","investments","pension","primary_residence","investment_property"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0) },
  ].filter(g=>g.value>0)

  return (
    <div>
      {/* Big net worth number */}
      <div className="ls-card-glass" style={{ border:`1.5px solid ${netWorth>=0?T.tealBorder:T.redBorder}`,borderRadius:22,padding:"22px",marginBottom:16,textAlign:"center",boxShadow:`0 8px 32px rgba(0,0,0,.3)` }}>
        <p style={{ color:"#E2EAF6",fontSize:14,fontWeight:600,marginBottom:4 }}>Your net worth right now</p>
        <p style={{ fontSize:"clamp(36px,8vw,56px)",fontWeight:900,color:netWorth>=0?T.teal:T.red,lineHeight:1,textShadow:`0 0 40px ${netWorth>=0?T.teal:T.red}40` }}>{fmt(netWorth)}</p>
        <p style={{ color:"#8FA3BE",fontSize:12,marginTop:6 }}>Last updated: {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center",marginTop:14 }}>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:T.green,fontWeight:800,fontSize:17 }}>{fmt(totalAssets)}</p>
            <p style={{ color:"#8FA3BE",fontSize:11 }}>Assets</p>
          </div>
          <div style={{ width:1,background:T.border }}/>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:800,fontSize:17 }}>{fmt(totalDebts)}</p>
            <p style={{ color:"#8FA3BE",fontSize:11 }}>Debts</p>
          </div>
          {surplus!==null && <><div style={{ width:1,background:T.border }}/><div style={{ textAlign:"center" }}>
            <p style={{ color:surplus>=0?T.teal:T.red,fontWeight:800,fontSize:17 }}>{fmt(surplus)}/mo</p>
            <p style={{ color:"#8FA3BE",fontSize:11 }}>Surplus</p>
          </div></>}
        </div>
      </div>

      {/* Accuracy prompt */}
      <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:14,padding:"14px 16px",marginBottom:20,display:"flex",gap:12,alignItems:"flex-start" }}>
        <span style={{ fontSize:20,flexShrink:0 }}>🎯</span>
        <div>
          <p style={{ color:T.amber,fontWeight:700,fontSize:14,marginBottom:4 }}>Keep your figures accurate</p>
          <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.5 }}>Update your asset values and debt balances monthly, even a rough update takes 2 minutes and keeps your projections meaningful.</p>
        </div>
      </div>

      {/* ── Analytics Charts ───────────────────────────────────────── */}
      <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Analytics</p>

      <AssetBreakdownChart assets={state.assets} totalAssets={totalAssets} onConfirmAssets={()=>{}}/>
      <SpendingBreakdownChart state={state} save={saveFromOverview}/>
      <NetWorthMomentumChart state={state}/>

      <div style={{ height:1,background:T.border,marginBottom:20 }}/>
      <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Your assets & liabilities</p>

      {/* Asset breakdown */}
      {assetGroups.length>0 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px",marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <p style={{ color:T.white,fontWeight:700,fontSize:15 }}>Assets breakdown</p>
            <button onClick={()=>setSection("assets")} style={{ background:"none",border:"none",color:T.teal,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Edit →</button>
          </div>
          {assetGroups.map((g,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
              <span style={{ fontSize:18,width:26,textAlign:"center" }}>{g.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                  <p style={{ color:"#E2EAF6",fontSize:13,fontWeight:600 }}>{g.label}</p>
                  <p style={{ color:g.color,fontWeight:800,fontSize:13 }}>{fmt(g.value)}</p>
                </div>
                <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden" }}>
                  <div style={{ width:`${totalAssets>0?Math.min(100,(g.value/totalAssets)*100):0}%`,height:"100%",background:g.color,borderRadius:99,transition:"width .6s ease" }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debt summary */}
      {state.debts.length>0 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px",marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <p style={{ color:T.white,fontWeight:700,fontSize:15 }}>Debts overview</p>
            <button onClick={()=>setSection("debts")} style={{ background:"none",border:"none",color:T.red,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Edit →</button>
          </div>
          {state.debts.map((d,i)=>{
            const t = DEBT_TYPES.find(x=>x.cat===d.category)||DEBT_TYPES[DEBT_TYPES.length-1]
            const interest = annualInterest(d)
            return (
              <div key={d.id} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:i<state.debts.length-1?12:0,paddingBottom:i<state.debts.length-1?12:0,borderBottom:i<state.debts.length-1?`1px solid ${T.border}`:"none" }}>
                <span style={{ fontSize:18 }}>{t?.icon||"💳"}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:"#E2EAF6",fontSize:13,fontWeight:600 }}>{d.name}</p>
                  <p style={{ color:"#8FA3BE",fontSize:12 }}>{d.interestRate||t?.assumedRate}% APR {fmt(Math.round(interest/12))}/mo interest</p>
                </div>
                <p style={{ color:T.red,fontWeight:800,fontSize:14 }}>{fmt(d.balance)}</p>
              </div>
            )
          })}
          {drag>0 && <p style={{ color:T.red,fontSize:13,fontWeight:700,marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}` }}>💸 {fmt(Math.round(drag))}/yr leaving your net worth in interest</p>}
        </div>
      )}

      {/* Quick add buttons */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        <button onClick={()=>{ setEditItem(null); setSection("assets"); setSheet("asset") }}
          style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:14,padding:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
          <p style={{ fontSize:22,marginBottom:4 }}>💰</p>
          <p style={{ color:T.teal,fontWeight:700,fontSize:13 }}>Add asset</p>
        </button>
        <button onClick={()=>{ setEditItem(null); setSection("debts"); setSheet("debt") }}
          style={{ background:T.redDim,border:`1.5px solid ${T.redBorder}`,borderRadius:14,padding:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"center" }}>
          <p style={{ fontSize:22,marginBottom:4 }}>💳</p>
          <p style={{ color:T.red,fontWeight:700,fontSize:13 }}>Add debt</p>
        </button>
      </div>
    </div>
  )
}


/* ════════════════════════════════════════════════════════════════════
   ANALYTICS CHARTS, Asset Breakdown, Spending Breakdown, NW Momentum
   ════════════════════════════════════════════════════════════════════ */

// PieChart-style donut using SVG (no extra recharts imports needed)
function DonutChart({ segments, size=120 }) {
  const total = segments.reduce((s,x)=>s+x.value,0)
  if(total===0) return null
  const cx=size/2, cy=size/2, r=size*0.38, strokeW=size*0.18
  let cumAngle=-90
  const arcs = segments.map(seg=>{
    const pct = seg.value/total
    const startAngle = cumAngle
    const sweep = pct*360
    cumAngle += sweep
    const start = polarToXY(cx,cy,r,startAngle)
    const end   = polarToXY(cx,cy,r,startAngle+sweep-0.5)
    const large = sweep>180?1:0
    return { ...seg, d:`M${start.x},${start.y} A${r},${r} 0 ${large},1 ${end.x},${end.y}`, pct }
  })
  return (
    <svg width={size} height={size} style={{ overflow:"visible" }}>
      {arcs.map((a,i)=>(
        <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={strokeW} strokeLinecap="butt"/>
      ))}
    </svg>
  )
}
function polarToXY(cx,cy,r,angleDeg){
  const rad=((angleDeg-0)*Math.PI)/180
  return { x: cx+r*Math.cos(rad), y: cy+r*Math.sin(rad) }
}

/* ── 1. Asset Breakdown Chart ─────────────────────────────────────── */
function AssetBreakdownChart({ assets, totalAssets, onConfirmAssets }) {
  const [confirmed, setConfirmed] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const productive = assets.filter(a=>["savings","investments","pension"].includes(a.category))
    .reduce((s,a)=>s+(a.value||0),0)
  const lifestyle  = assets.filter(a=>["primary_residence","investment_property","vehicle","other"].includes(a.category)||
    !["savings","investments","pension"].includes(a.category))
    .reduce((s,a)=>s+(a.value||0),0)

  const segments = [
    { label:"Productive assets", value:productive, color:T.teal,   desc:"Cash, investments, pension, grows over time" },
    { label:"Lifestyle assets",  value:lifestyle,  color:T.amber,  desc:"Property, vehicles, valuable but tied up" },
  ].filter(s=>s.value>0)

  const hasData = assets.length>0 && totalAssets>0

  return (
    <div style={{ background:T.card,border:`1.5px solid ${hasData&&confirmed?T.tealBorder:T.border}`,borderRadius:20,marginBottom:14,overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"18px 20px",cursor:hasData&&!confirmed?"pointer":"default" }}
        onClick={()=>{ if(hasData&&!confirmed) setShowConfirm(true) }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📊</div>
            <div>
              <p style={{ color:T.white,fontWeight:800,fontSize:14 }}>Asset breakdown</p>
              <p style={{ color:T.muted,fontSize:11 }}>Productive vs lifestyle assets</p>
            </div>
          </div>
          {!hasData && <span style={{ background:T.surface,color:T.muted,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,border:`1px solid ${T.border}` }}>Add assets first</span>}
          {hasData && !confirmed && <span style={{ background:T.tealDim,color:T.teal,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,border:`1px solid ${T.tealBorder}` }}>Tap to unlock</span>}
        </div>
      </div>

      {/* Blurred preview when not confirmed */}
      {!confirmed && (
        <div style={{ padding:"0 20px 18px",position:"relative" }}>
          <div style={{ filter:"blur(6px)",opacity:.5,pointerEvents:"none",userSelect:"none" }}>
            <div style={{ display:"flex",alignItems:"center",gap:20 }}>
              <div style={{ position:"relative",width:100,height:100 }}>
                <DonutChart segments={[{value:60,color:T.teal},{value:40,color:T.amber}]} size={100}/>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <p style={{ color:T.white,fontWeight:900,fontSize:12,textAlign:"center" }}>£, </p>
                </div>
              </div>
              <div style={{ flex:1 }}>
                {[{label:"Productive",color:T.teal,pct:60},{label:"Lifestyle",color:T.amber,pct:40}].map(s=>(
                  <div key={s.label} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <div style={{ width:8,height:8,borderRadius:"50%",background:s.color }}/>
                        <p style={{ color:"#E2EAF6",fontSize:12 }}>{s.label}</p>
                      </div>
                      <p style={{ color:s.color,fontWeight:700,fontSize:12 }}>{s.pct}%</p>
                    </div>
                    <div style={{ background:T.surface,borderRadius:99,height:6 }}>
                      <div style={{ width:`${s.pct}%`,height:"100%",background:s.color,borderRadius:99 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {hasData && (
            <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10 }}>
              <button onClick={()=>setShowConfirm(true)}
                style={{ background:T.teal,border:"none",borderRadius:12,padding:"10px 22px",color:T.bg,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
                Confirm assets to unlock →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmed, show real chart */}
      {confirmed && segments.length>0 && (
        <div style={{ padding:"0 20px 20px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <div style={{ position:"relative",width:110,height:110,flexShrink:0 }}>
              <DonutChart segments={segments} size={110}/>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                <p style={{ color:T.white,fontWeight:900,fontSize:11,textAlign:"center",lineHeight:1.2 }}>
                  {totalAssets>=1e6?`£${(totalAssets/1e6).toFixed(1)}M`:totalAssets>=1000?`£${Math.round(totalAssets/1000)}k`:fmt(totalAssets)}
                </p>
                <p style={{ color:T.muted,fontSize:9 }}>total</p>
              </div>
            </div>
            <div style={{ flex:1 }}>
              {segments.map(s=>(
                <div key={s.label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0 }}/>
                      <p style={{ color:"#E2EAF6",fontSize:12 }}>{s.label}</p>
                    </div>
                    <p style={{ color:s.color,fontWeight:800,fontSize:12 }}>{Math.round(s.value/totalAssets*100)}%</p>
                  </div>
                  <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden" }}>
                    <div style={{ width:`${Math.round(s.value/totalAssets*100)}%`,height:"100%",background:s.color,borderRadius:99,transition:"width .6s" }}/>
                  </div>
                  <p style={{ color:T.muted,fontSize:11,marginTop:2 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {productive>0 && lifestyle>0 && (
            <div style={{ background:T.surface,borderRadius:12,padding:"10px 14px",marginTop:12 }}>
              <p style={{ color:"#E2EAF6",fontSize:12,lineHeight:1.5 }}>
                <strong style={{ color:T.teal }}>{Math.round(productive/totalAssets*100)}%</strong> of your wealth is actively working for you.{" "}
                {productive/totalAssets<0.4
                  ? <span>Building your productive assets, savings, investments, pension, is the fastest route to financial freedom.</span>
                  : <span>A healthy balance. Keep growing the productive side through regular contributions.</span>
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(7,13,26,.85)",zIndex:200,display:"flex",alignItems:"flex-end",padding:20 }}>
          <div className="ls-fadein" style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:480,margin:"0 auto" }}>
            <p style={{ color:T.white,fontWeight:900,fontSize:17,marginBottom:6 }}>Confirm your assets are correct</p>
            <p style={{ color:"#D8E8F8",fontSize:14,lineHeight:1.65,marginBottom:16 }}>
              This breakdown is most useful when your figures are up to date. Are your current asset values roughly accurate?
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:18 }}>
              {assets.map(a=>(
                <div key={a.id} style={{ display:"flex",justifyContent:"space-between",padding:"8px 12px",background:T.card,borderRadius:10 }}>
                  <p style={{ color:"#E2EAF6",fontSize:13 }}>{a.name}</p>
                  <p style={{ color:T.teal,fontWeight:700,fontSize:13 }}>{fmt(a.value)}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>{setShowConfirm(false); onConfirmAssets && onConfirmAssets(); setConfirmed(true)}}
                style={{ flex:1,background:T.teal,border:"none",borderRadius:12,padding:"12px",color:T.bg,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
                Yes, these look right
              </button>
              <button onClick={()=>setShowConfirm(false)}
                style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",color:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
                Edit first
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── 2. Spending Breakdown Chart ──────────────────────────────────── */
const SPEND_CATS = [
  { id:"housing",   label:"Housing",         icon:"🏠", bucket:"needs" },
  { id:"food",      label:"Food & groceries", icon:"🛒", bucket:"needs" },
  { id:"transport", label:"Transport",        icon:"🚗", bucket:"needs" },
  { id:"bills",     label:"Bills & utilities",icon:"⚡", bucket:"needs" },
  { id:"health",    label:"Health",           icon:"💊", bucket:"needs" },
  { id:"eating_out",label:"Eating out",       icon:"🍽️", bucket:"wants" },
  { id:"subs",      label:"Subscriptions",    icon:"📺", bucket:"wants" },
  { id:"shopping",  label:"Shopping",         icon:"🛍️", bucket:"wants" },
  { id:"leisure",   label:"Leisure & hobbies",icon:"🎮", bucket:"wants" },
  { id:"savings_invest",label:"Savings & investing",icon:"📈", bucket:"savings" },
  { id:"other",     label:"Other",            icon:"📦", bucket:"wants" },
]
const BUCKET_COLORS = { needs:T.amber, wants:T.purple, savings:T.teal }
const BUCKET_LABELS = { needs:"Needs", wants:"Wants", savings:"Savings & Investment" }

function SpendingBreakdownChart({ state, save }) {
  const [phase, setPhase] = useState("locked") // locked | demo | input | chart
  const [amounts, setAmounts] = useState({})
  const savedBreakdown = state.spending?.breakdown || null

  // Load saved breakdown on mount
  useState(()=>{ if(savedBreakdown){ setAmounts(savedBreakdown); setPhase("chart") } },[])

  const totalInput = Object.values(amounts).reduce((s,v)=>s+(parseFloat(v)||0),0)
  const monthly = state.spending?.monthly || 0

  const bucketTotals = { needs:0, wants:0, savings:0 }
  SPEND_CATS.forEach(c=>{ bucketTotals[c.bucket] += parseFloat(amounts[c.id])||0 })

  const chartSegs = Object.entries(bucketTotals)
    .filter(([,v])=>v>0)
    .map(([k,v])=>({ label:BUCKET_LABELS[k], value:v, color:BUCKET_COLORS[k] }))

  function saveBreakdown(){
    save({ ...state, spending:{ ...state.spending, breakdown:amounts } })
    setPhase("chart")
  }

  // DEMO PIE data
  const demoSegs = [
    { label:"Needs",   value:50, color:T.amber  },
    { label:"Wants",   value:30, color:T.purple  },
    { label:"Savings", value:20, color:T.teal    },
  ]

  return (
    <div style={{ background:T.card,border:`1.5px solid ${phase==="chart"?T.purpleBorder:T.border}`,borderRadius:20,marginBottom:14,overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"18px 20px",cursor:phase==="locked"?"pointer":"default" }}
        onClick={()=>{ if(phase==="locked") setPhase("demo") }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🥧</div>
            <div>
              <p style={{ color:T.white,fontWeight:800,fontSize:14 }}>Spending breakdown</p>
              <p style={{ color:T.muted,fontSize:11 }}>Needs · Wants · Savings</p>
            </div>
          </div>
          {phase==="locked" && <span style={{ background:T.purpleDim,color:T.purple,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,border:`1px solid ${T.purpleBorder}` }}>Tap to unlock</span>}
          {phase==="chart" && <button onClick={()=>setPhase("input")} style={{ background:"none",border:"none",color:T.purple,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Edit →</button>}
        </div>
      </div>

      {/* LOCKED, blurred preview */}
      {phase==="locked" && (
        <div style={{ padding:"0 20px 18px",position:"relative" }}>
          <div style={{ filter:"blur(6px)",opacity:.4,pointerEvents:"none",userSelect:"none",display:"flex",alignItems:"center",gap:16 }}>
            <DonutChart segments={demoSegs} size={90}/>
            <div style={{ flex:1 }}>
              {demoSegs.map(s=>(
                <div key={s.label} style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <p style={{ color:"#E2EAF6",fontSize:12 }}>{s.label}</p>
                  <p style={{ color:s.color,fontWeight:700,fontSize:12 }}>{s.value}%</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8 }}>
            <p style={{ color:T.white,fontWeight:700,fontSize:13,textAlign:"center" }}>Categorise your spending to unlock</p>
            <button onClick={()=>setPhase("demo")}
              style={{ background:T.purple,border:"none",borderRadius:12,padding:"8px 18px",color:T.bg,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              See how it works →
            </button>
          </div>
        </div>
      )}

      {/* DEMO, show example chart, explain, then offer to start */}
      {phase==="demo" && (
        <div className="ls-fadein" style={{ padding:"0 20px 20px" }}>
          <p style={{ color:"#D8E8F8",fontSize:14,lineHeight:1.65,marginBottom:16 }}>
            The 50/30/20 rule is a simple way to see if your money is working well. Here's what a healthy split looks like:
          </p>
          <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:16 }}>
            <div style={{ position:"relative",width:110,height:110,flexShrink:0 }}>
              <DonutChart segments={demoSegs} size={110}/>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                <p style={{ color:T.white,fontWeight:900,fontSize:11 }}>50/30/20</p>
              </div>
            </div>
            <div style={{ flex:1 }}>
              {[
                { label:"50% Needs",   desc:"Housing, food, bills, transport",  color:T.amber  },
                { label:"30% Wants",   desc:"Eating out, shopping, leisure",    color:T.purple },
                { label:"20% Savings", desc:"Investments, pension, emergency",  color:T.teal   },
              ].map(s=>(
                <div key={s.label} style={{ marginBottom:10 }}>
                  <p style={{ color:s.color,fontWeight:700,fontSize:12,marginBottom:2 }}>{s.label}</p>
                  <p style={{ color:T.muted,fontSize:11 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ color:"#8FA3BE",fontSize:12,marginBottom:14 }}>Takes 2 minutes. You only need rough numbers.</p>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>setPhase("input")}
              style={{ flex:1,background:T.purple,border:"none",borderRadius:12,padding:"11px",color:T.bg,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              Categorise my spending →
            </button>
            <button onClick={()=>setPhase("locked")}
              style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.muted,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              Later
            </button>
          </div>
        </div>
      )}

      {/* INPUT, category entry */}
      {phase==="input" && (
        <div className="ls-fadein" style={{ padding:"0 20px 20px" }}>
          <p style={{ color:"#E2EAF6",fontSize:13,marginBottom:4 }}>Enter your rough monthly amounts. Estimates are fine.</p>
          {monthly>0 && <p style={{ color:T.teal,fontSize:12,fontWeight:700,marginBottom:14 }}>Your total monthly spend: {fmt(monthly)}</p>}
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:16 }}>
            {SPEND_CATS.map(cat=>(
              <div key={cat.id} style={{ display:"flex",alignItems:"center",gap:12,background:T.surface,borderRadius:12,padding:"10px 14px" }}>
                <span style={{ fontSize:16,width:22,textAlign:"center" }}>{cat.icon}</span>
                <p style={{ flex:1,color:"#E2EAF6",fontSize:13 }}>{cat.label}</p>
                <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <span style={{ color:T.muted,fontSize:14 }}>£</span>
                  <input type="number" min="0" placeholder="0"
                    value={amounts[cat.id]||""}
                    onChange={e=>setAmounts(v=>({...v,[cat.id]:e.target.value}))}
                    style={{ width:70,background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 8px",color:T.white,fontSize:13,fontFamily:"inherit",textAlign:"right" }}/>
                </div>
                <div style={{ width:8,height:8,borderRadius:"50%",background:BUCKET_COLORS[cat.bucket],flexShrink:0 }}/>
              </div>
            ))}
          </div>
          {totalInput>0 && (
            <div style={{ background:T.surface,borderRadius:12,padding:"10px 14px",marginBottom:14 }}>
              <p style={{ color:"#E2EAF6",fontSize:12 }}>Total entered: <strong style={{ color:T.white }}>{fmt(totalInput)}/mo</strong></p>
            </div>
          )}
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={saveBreakdown}
              style={{ flex:1,background:T.purple,border:"none",borderRadius:12,padding:"11px",color:T.bg,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              Save breakdown
            </button>
            <button onClick={()=>setPhase(savedBreakdown?"chart":"locked")}
              style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.muted,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CHART, real breakdown */}
      {phase==="chart" && chartSegs.length>0 && (
        <div className="ls-fadein" style={{ padding:"0 20px 20px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:14 }}>
            <div style={{ position:"relative",width:110,height:110,flexShrink:0 }}>
              <DonutChart segments={chartSegs} size={110}/>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                <p style={{ color:T.white,fontWeight:900,fontSize:11 }}>{fmt(totalInput)}</p>
                <p style={{ color:T.muted,fontSize:9 }}>/month</p>
              </div>
            </div>
            <div style={{ flex:1 }}>
              {chartSegs.map(s=>(
                <div key={s.label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0 }}/>
                      <p style={{ color:"#E2EAF6",fontSize:12 }}>{s.label}</p>
                    </div>
                    <p style={{ color:s.color,fontWeight:800,fontSize:12 }}>{Math.round(s.value/totalInput*100)}%</p>
                  </div>
                  <div style={{ background:T.surface,borderRadius:99,height:6,overflow:"hidden" }}>
                    <div style={{ width:`${Math.round(s.value/totalInput*100)}%`,height:"100%",background:s.color,borderRadius:99,transition:"width .6s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 50/30/20 nudge */}
          {(() => {
            const needsPct = Math.round((bucketTotals.needs||0)/totalInput*100)||0
            const wantsPct = Math.round((bucketTotals.wants||0)/totalInput*100)||0
            const savePct  = Math.round((bucketTotals.savings||0)/totalInput*100)||0
            if(totalInput===0) return null
            const msgs = []
            if(needsPct>60) msgs.push("Your needs are over 60%, look for ways to reduce fixed costs like rent or subscriptions.")
            if(wantsPct>35) msgs.push("Wants are high. Even trimming £100/mo here adds £1,200/yr to your savings.")
            if(savePct<10)  msgs.push("Less than 10% going to savings. Aim for 20% as a long-term goal.")
            if(msgs.length===0) msgs.push("Your split looks healthy. Keep it up.")
            return <div style={{ background:T.surface,borderRadius:12,padding:"10px 14px" }}>
              <p style={{ color:"#E2EAF6",fontSize:12,lineHeight:1.55 }}>{msgs[0]}</p>
            </div>
          })()}
        </div>
      )}
    </div>
  )
}

/* ── 3. Net Worth Momentum Chart ──────────────────────────────────── */
function NetWorthMomentumChart({ state }) {
  const history = state.history || []
  const hasThreeMonths = history.length >= 3

  // Demo sparkline data
  const demoData = [
    {month:"Jan",nw:18000},{month:"Feb",nw:19200},{month:"Mar",nw:20100},
    {month:"Apr",nw:21800},{month:"May",nw:22400},{month:"Jun",nw:24000},
  ]

  if(!hasThreeMonths) {
    return (
      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:20,marginBottom:14,overflow:"hidden" }}>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:T.blueDim,border:`1px solid ${T.blueBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📈</div>
              <div>
                <p style={{ color:T.white,fontWeight:800,fontSize:14 }}>Net worth momentum</p>
                <p style={{ color:T.muted,fontSize:11 }}>Monthly growth over time</p>
              </div>
            </div>
            <span style={{ background:T.surface,color:T.muted,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,border:`1px solid ${T.border}` }}>Locked</span>
          </div>
          {/* Blurred demo chart */}
          <div style={{ position:"relative" }}>
            <div style={{ filter:"blur(5px)",opacity:.35,pointerEvents:"none",height:80,userSelect:"none" }}>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={demoData} margin={{top:5,right:0,bottom:0,left:0}}>
                  <defs>
                    <linearGradient id="gMom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.blue} stopOpacity={.3}/>
                      <stop offset="95%" stopColor={T.blue} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="nw" stroke={T.blue} strokeWidth={2} fill="url(#gMom)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6 }}>
              <p style={{ color:T.white,fontWeight:800,fontSize:13,textAlign:"center" }}>🔒 Unlocks after 3 monthly updates</p>
              <p style={{ color:T.muted,fontSize:12,textAlign:"center" }}>You have {history.length} of 3. Update your figures each month.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Real momentum chart
  const chartData = history.slice(-12).map(h=>({
    month: new Date(h.date).toLocaleDateString("en-GB",{month:"short"}),
    nw: h.netWorth
  }))
  const first = chartData[0]?.nw||0
  const last  = chartData[chartData.length-1]?.nw||0
  const change= last-first
  const pct   = first!==0 ? Math.round((change/Math.abs(first))*100) : 0

  return (
    <div style={{ background:T.card,border:`1.5px solid ${T.blueBorder}`,borderRadius:20,marginBottom:14,overflow:"hidden" }}>
      <div style={{ padding:"18px 20px 0" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:T.blueDim,border:`1px solid ${T.blueBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📈</div>
            <div>
              <p style={{ color:T.white,fontWeight:800,fontSize:14 }}>Net worth momentum</p>
              <p style={{ color:T.blue,fontSize:12,fontWeight:700 }}>
                {change>=0?"↑":"↓"} {fmt(Math.abs(change))} ({pct>0?"+":""}{pct}%) over {chartData.length} months
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding:"0 8px 16px",height:120 }}>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{top:5,right:8,bottom:0,left:0}}>
            <defs>
              <linearGradient id="gMomReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={change>=0?T.blue:T.red} stopOpacity={.3}/>
                <stop offset="95%" stopColor={change>=0?T.blue:T.red} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{fontSize:10,fill:"#8FA3BE"}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip
              formatter={v=>[fmt(v),"Net worth"]}
              contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white}}/>
            <Area type="monotone" dataKey="nw" stroke={change>=0?T.blue:T.red} strokeWidth={2.5} fill="url(#gMomReal)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function AssetsSection({ assets, totalAssets, onAdd, onEdit, onDelete }) {
  const getBucket = a => {
    if(a.category==="savings") return { icon:"💰", color:T.teal, label:"Cash & Savings" }
    if(a.category==="investments") return { icon:"📈", color:T.purple, label:"Investments" }
    if(a.category==="pension") return { icon:"🏛️", color:T.amber, label:"Pension" }
    if(["primary_residence","investment_property"].includes(a.category)) return { icon:"🏠", color:T.green, label:"Property" }
    return { icon:"📦", color:T.blue, label:"Other" }
  }

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <div>
          <p style={{ color:T.green,fontWeight:900,fontSize:22 }}>{fmt(totalAssets)}</p>
          <p style={{ color:"#C8D8EC",fontSize:13,fontWeight:600 }}>Total assets</p>
        </div>
        <button onClick={onAdd} style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:12,padding:"10px 18px",color:T.teal,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
          <Plus size={15}/>Add asset
        </button>
      </div>

      {assets.length===0 ? (
        <EmptyState icon="💰" title="No assets tracked" body="Add your savings, pension, investments, property. Everything of value." cta="Add an asset" onClick={onAdd}/>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {assets.map(a=>{
            const b = getBucket(a)
            const t = ASSET_TYPES.find(x=>x.cat===a.category)||ASSET_TYPES[ASSET_TYPES.length-1]
            return (
              <div key={a.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:40,height:40,borderRadius:12,background:`${b.color}12`,border:`1px solid ${b.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{b.icon}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.name}</p>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:2 }}>
                    <span style={{ color:b.color,fontSize:11,fontWeight:600 }}>{b.label}</span>
                    {a.annualReturn && <span style={{ color:T.purple,fontSize:11,fontWeight:600 }}>{a.annualReturn}%/yr</span>}
                    {a.monthlyIncome>0 && <span style={{ color:T.muted,fontSize:11 }}>{fmt(a.monthlyIncome)}/mo</span>}
                  </div>
                </div>
                <p style={{ color:T.green,fontWeight:900,fontSize:16,flexShrink:0 }}>{fmt(a.value)}</p>
                <div style={{ display:"flex",gap:2,flexShrink:0 }}>
                  <button onClick={()=>onEdit(a)} style={{ background:"none",border:"none",color:T.teal,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={14}/></button>
                  <button onClick={()=>onDelete(a)} style={{ background:"none",border:"none",color:T.subtle,cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={14}/></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DebtsSection({ debts, totalDebts, drag, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:drag>0?8:16 }}>
        <div>
          <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:900,fontSize:22 }}>{fmt(totalDebts)}</p>
          <p style={{ color:"#E2EAF6",fontSize:13,fontWeight:600 }}>Total debts</p>
        </div>
        <button onClick={onAdd} style={{ background:T.redDim,border:`1.5px solid ${T.redBorder}`,borderRadius:11,padding:"10px 18px",color:T.red,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
          <Plus size={15}/>Add debt
        </button>
      </div>

      {drag>0 && (
        <div style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"12px 16px",marginBottom:16 }}>
          <p style={{ color:T.red,fontSize:14,fontWeight:700 }}>💸 {fmt(Math.round(drag/12))}/month ({fmt(Math.round(drag))}/yr) lost to interest</p>
          <p style={{ color:"#E2EAF6",fontSize:13,marginTop:4 }}>Paying off highest-rate debt first (avalanche method) is a guaranteed return equal to the rate you eliminate.</p>
        </div>
      )}

      {debts.length===0 ? (
        <EmptyState icon="💳" title="No debts" body="Add what you owe to track interest costs and see your true net worth." cta="Add a debt" onClick={onAdd}/>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:8,padding:"8px 14px",marginBottom:4 }}>
            <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Debt</p>
            <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:55 }}>APR</p>
            <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:70 }}>Interest/mo</p>
            <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:80 }}>Balance</p>
            <p style={{ color:"transparent",fontSize:11,minWidth:54 }}>...</p>
          </div>

          {debts.map(d=>{
            const t = DEBT_TYPES.find(x=>x.cat===d.category)||DEBT_TYPES[DEBT_TYPES.length-1]
            const interest = annualInterest(d)
            const rate = d.interestRate||t?.assumedRate||10
            const rateColor = rate>15?T.red:rate>8?T.amber:T.green
            return (
              <div key={d.id} style={{ display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:8,alignItems:"center",padding:"12px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:8 }}>
                <div style={{ minWidth:0 }}>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</p>
                  <p style={{ color:"#8FA3BE",fontSize:12 }}>{t?.label}{d.minPayment>0?` min ${fmt(d.minPayment)}/mo`:""}</p>
                </div>
                <div style={{ background:`${rateColor}20`,border:`1px solid ${rateColor}40`,borderRadius:8,padding:"3px 8px",minWidth:55,textAlign:"center" }}>
                  <p style={{ color:rateColor,fontWeight:800,fontSize:12 }}>{rate}%</p>
                </div>
                <p style={{ color:T.red,fontWeight:700,fontSize:13,textAlign:"right",minWidth:70 }}>{fmt(Math.round(interest/12))}</p>
                <p style={{ color:T.red,fontWeight:800,fontSize:14,textAlign:"right",minWidth:80 }}>{fmt(d.balance)}</p>
                <div style={{ display:"flex",gap:4,minWidth:54,justifyContent:"flex-end" }}>
                  <button onClick={()=>onEdit(d)} style={{ background:"none",border:"none",color:T.teal,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={14}/></button>
                  {!d.isAutoCreated && <button onClick={()=>onDelete(d)} style={{ background:"none",border:"none",color:"#8FA3BE",cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={14}/></button>}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

/* ── Asset Sheet detailed ───────────────────────────────────── */
function AssetSheet({ item, onClose, onSave }) {
  const editing = !!item
  const [cat,     setCat]     = useState(item?.category||null)
  const [name,    setName]    = useState(item?.name||"")
  const [val,     setVal]     = useState(item?.value||0)
  const [income,  setIncome]  = useState(item?.monthlyIncome||0)
  const [ret,     setRet]     = useState(item?.annualReturn||"")
  const [hasLoan, setHasLoan] = useState(false)
  const [loanBal, setLoanBal] = useState(0)
  const [err,     setErr]     = useState("")

  const t = ASSET_TYPES.find(x=>x.cat===cat)
  const canHaveLoan = ["primary_residence","investment_property","vehicle"].includes(cat)

  function go() {
    if(!cat)   { setErr("Select an asset type."); return }
    if(val<=0) { setErr("Enter a value greater than zero."); return }
    setErr("")
    onSave({ cat, name:name||(t?.label||"Asset"), val, monthlyIncome:income, annualReturn:ret?parseFloat(ret):null, hasLoan, loanBal, existingId:item?.id, existingLinkedDebtId:item?.linkedDebtId })
  }

  return (
    <Sheet title={editing?"Edit asset":"Add an asset"} onClose={onClose}>
      {/* Asset type grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:18 }}>
        {ASSET_TYPES.map(x=>{ const sel=cat===x.cat; return (
          <button key={x.cat} onClick={()=>{ setCat(x.cat); setName(x.label) }}
            style={{ padding:"12px 10px",borderRadius:13,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.tealDim:T.card,cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"all .15s" }}>
            <span style={{ fontSize:22,flexShrink:0 }}>{x.icon}</span>
            <div>
              <p style={{ color:sel?T.teal:T.white,fontWeight:700,fontSize:13 }}>{x.label}</p>
              <p style={{ color:"#8FA3BE",fontSize:11 }}>{x.hint}</p>
            </div>
          </button>
        )})}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:14 }}>
        <Input label="Name / label" value={name} onChange={setName} placeholder={t?.label||"e.g. Vanguard ISA"}/>
        <CurrencyInput label="Current value" value={val} onChange={setVal}/>
        <div>
          <p style={{ color:"#E2EAF6",fontSize:13,fontWeight:600,marginBottom:6 }}>Annual return / interest rate (optional)</p>
          <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
            <input type="number" min="0" max="30" step="0.1" value={ret} onChange={e=>setRet(e.target.value)}
              placeholder="e.g. 7"
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"14px 16px",fontFamily:"inherit" }}/>
            <span style={{ padding:"0 16px",color:"#8FA3BE",fontWeight:700 }}>%/yr</span>
          </div>
          <p style={{ color:"#8FA3BE",fontSize:12,marginTop:4 }}>Helps unlock better growth projections</p>
        </div>
        {["investment_property","rental"].includes(cat) && (
          <CurrencyInput label="Monthly rental income" value={income} onChange={setIncome}/>
        )}
        {canHaveLoan && (
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:hasLoan?10:0 }}>
              <Toggle value={hasLoan} onChange={setHasLoan}/>
              <p style={{ color:"#E2EAF6",fontSize:14,fontWeight:600 }}>Has a mortgage / loan</p>
            </div>
            {hasLoan && <CurrencyInput label="Outstanding loan balance" value={loanBal} onChange={setLoanBal}/>}
          </div>
        )}
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:10 }}>{err}</p>}
      <Btn onClick={go}>{editing?"Save changes":"Add asset"}</Btn>
    </Sheet>
  )
}

/* ── Debt Sheet detailed ────────────────────────────────────── */
function DebtSheet({ item, onClose, onSave }) {
  const editing = !!item
  const [cat,   setCat]   = useState(item?.category||null)
  const [name,  setName]  = useState(item?.name||"")
  const [bal,   setBal]   = useState(item?.balance||0)
  const [rate,  setRate]  = useState(item?.interestRate||"")
  const [min,   setMin]   = useState(item?.minPayment||0)
  const [err,   setErr]   = useState("")

  const t = DEBT_TYPES.find(x=>x.cat===cat)

  function go() {
    if(!cat)  { setErr("Select a debt type."); return }
    if(bal<=0){ setErr("Enter a balance greater than zero."); return }
    setErr("")
    onSave({ cat, name:name||(t?.label||"Debt"), bal, rate:rate?parseFloat(rate):(t?.assumedRate||10), minPayment:min, existingId:item?.id })
  }

  return (
    <Sheet title={editing?"Edit debt":"Add a debt"} onClose={onClose}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:18 }}>
        {DEBT_TYPES.map(x=>{ const sel=cat===x.cat; return (
          <button key={x.cat} onClick={()=>{ setCat(x.cat); if(!rate) setRate(String(x.assumedRate)); setName(x.label) }}
            style={{ padding:"12px 10px",borderRadius:13,border:`2px solid ${sel?T.red:T.border}`,background:sel?T.redDim:T.card,cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"all .15s" }}>
            <span style={{ fontSize:22,flexShrink:0 }}>{x.icon}</span>
            <div>
              <p style={{ color:sel?T.red:T.white,fontWeight:700,fontSize:13 }}>{x.label}</p>
              <p style={{ color:"#8FA3BE",fontSize:11 }}>~{x.assumedRate}% typical</p>
            </div>
          </button>
        )})}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:14 }}>
        <Input label="Name / label" value={name} onChange={setName} placeholder={t?.label||"e.g. HSBC credit card"}/>
        <CurrencyInput label="Current balance owed" value={bal} onChange={setBal}/>
        <div>
          <p style={{ color:"#E2EAF6",fontSize:13,fontWeight:600,marginBottom:6 }}>Interest rate (APR)</p>
          <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
            <input type="number" min="0" max="100" step="0.1" value={rate} onChange={e=>setRate(e.target.value)}
              placeholder={t?String(t.assumedRate):"10"}
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"14px 16px",fontFamily:"inherit" }}/>
            <span style={{ padding:"0 16px",color:"#8FA3BE",fontWeight:700 }}>% APR</span>
          </div>
          <p style={{ color:"#8FA3BE",fontSize:12,marginTop:4 }}>Check your statement or account online</p>
        </div>
        <CurrencyInput label="Minimum monthly payment (optional)" value={min} onChange={setMin}/>
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:10 }}>{err}</p>}
      <Btn onClick={go}>{editing?"Save changes":"Add debt"}</Btn>
    </Sheet>
  )
}

/* ── Income Section (in Track tab) ──────────────────────────────── */
function IncomeSection({ income, assets, onSave }) {
  const [primary, setPrimary]   = useState(income?.primary||0)
  const [source,  setSource]    = useState(income?.primarySource||"employment")
  const [extras,  setExtras]    = useState(income?.additional||[])
  const [addLabel,setAddLabel]  = useState("")
  const [addAmt,  setAddAmt]    = useState(0)

  const rentalIncome = assets?.filter(a=>a.monthlyIncome>0).reduce((s,a)=>s+(a.monthlyIncome||0),0)||0
  const totalIncome  = primary + extras.reduce((s,e)=>s+(e.amount||0),0) + rentalIncome

  function save() {
    onSave({ primary, primarySource:source, additional:extras })
  }

  function addExtra() {
    if(!addLabel||addAmt<=0) return
    setExtras(prev=>[...prev,{ id:`extra_${Date.now()}`, label:addLabel, amount:addAmt }])
    setAddLabel(""); setAddAmt(0)
  }

  const SOURCES = [
    { id:"employment", label:"Employment", icon:"💼" },
    { id:"self_employed", label:"Self-employed", icon:"🧑‍💻" },
    { id:"freelance", label:"Freelance", icon:"🎯" },
    { id:"retired", label:"Pension/Retired", icon:"🏛️" },
  ]

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div style={{ background:T.card,border:`1px solid ${T.tealBorder}`,borderRadius:18,padding:"18px 20px",textAlign:"center" }}>
        <p style={{ color:"#E2EAF6",fontSize:14,fontWeight:600,marginBottom:4 }}>Total monthly income</p>
        <p style={{ color:T.teal,fontWeight:900,fontSize:32 }}>{fmt(totalIncome)}</p>
      </div>

      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px" }}>
        <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:12 }}>Primary income</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:14 }}>
          {SOURCES.map(s=>{ const sel=source===s.id; return (
            <button key={s.id} onClick={()=>setSource(s.id)}
              style={{ padding:"10px",borderRadius:11,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.tealDim:T.faint,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:16 }}>{s.icon}</span>
              <span style={{ color:sel?T.teal:T.white,fontWeight:700,fontSize:13 }}>{s.label}</span>
            </button>
          )})}
        </div>
        <CurrencyInput label="Monthly take-home pay" value={primary} onChange={setPrimary}/>
        <p style={{ color:"#E2EAF6",fontSize:13,marginTop:8,fontWeight:500 }}>📱 Check your banking app or last payslip</p>
      </div>

      {rentalIncome>0 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <p style={{ color:"#E2EAF6",fontSize:14,fontWeight:600 }}>🏠 Rental income (from assets)</p>
          <p style={{ color:T.green,fontWeight:800,fontSize:15 }}>{fmt(rentalIncome)}/mo</p>
        </div>
      )}

      {extras.length>0 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px" }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:12 }}>Other income</p>
          {extras.map((e,i)=>(
            <div key={e.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <p style={{ color:"#E2EAF6",fontSize:14 }}>{e.label}</p>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <p style={{ color:T.green,fontWeight:700 }}>{fmt(e.amount)}/mo</p>
                <button onClick={()=>setExtras(prev=>prev.filter(x=>x.id!==e.id))} style={{ background:"none",border:"none",color:"#8FA3BE",cursor:"pointer",padding:4 }}><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px" }}>
        <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:12 }}>Add other income source</p>
        <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:12 }}>
          <Input label="Source (e.g. freelance, dividends)" value={addLabel} onChange={setAddLabel}/>
          <CurrencyInput label="Monthly amount" value={addAmt} onChange={setAddAmt}/>
        </div>
        <button onClick={addExtra} style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:10,padding:"10px 16px",color:T.teal,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6 }}>
          <Plus size={14}/>Add income source
        </button>
      </div>

      <Btn onClick={save}>Save income →</Btn>
    </div>
  )
}



/* ════════════════════════════════════════════════════════════════════
   9-LEVEL LEARNING JOURNEY
   ════════════════════════════════════════════════════════════════════ */

const PC = { Foundations:T.red, Stabilise:T.amber, Optimise:T.blue, Grow:T.green }

const LEVELS = [
{n:1,phase:"Foundations",title:"Your Net Worth: The Only Number That Really Matters",hook:"Nobody builds wealth by accident. You have to track it.",time:15,
 sections:[
  {emoji:"📊",title:"Why net worth is the real measure",stat:"Income is vanity. Net worth is reality.",
   content:"Most people measure their financial life by salary. But salary is just money coming in. Net worth is what you have actually built.\n\nNet worth is one sum: add up everything you own, subtract everything you owe. That number is your score. Not your income. Not your lifestyle. Your actual position.\n\nNo one builds real wealth by accident. Every person who reaches financial freedom tracked their net worth, understood what was driving it, and made deliberate decisions to grow it."},
  {emoji:"🌱",title:"Not all assets are equal — the most important thing to understand",stat:"Productive assets build freedom. Lifestyle assets do not.",
   content:"You can have a high net worth on paper and still be building the wrong thing.\n\nProductive assets grow or earn without you working: pension, savings, Stocks and Shares ISA, investment property. These build financial freedom.\n\nLifestyle assets feel like assets but rarely grow: your car depreciates the moment you drive it. Jewellery, gadgets, watches. Including them is honest — but the goal is to shift more net worth into productive assets over time.",
   columns:[{label:"Productive",color:T.green,items:["Pension","Cash savings","Stocks and ISA","Investment property","Business equity"]},{label:"Lifestyle",color:T.amber,items:["Car (depreciates)","Jewellery","Gadgets","Personal property"]}]},
  {emoji:"🏠",title:"Your home: a life decision, not a financial one",stat:"Your equity is the asset — not the full property value.",
   content:"Whether you own or rent depends on where you are in life. Roots or mobility. Family stability or freedom to move. Permanence or flexibility. These are personal questions, not financial ones.\n\nIf you own, include it correctly: your equity is the asset, not the full property value. A home worth £300,000 with £240,000 left on the mortgage means £60,000 of equity. That is what you own. The rest belongs to the bank.\n\nYour home is not a substitute for a pension or ISA. Productive financial assets still need to exist alongside it."},
  {emoji:"💳",title:"Liabilities and a note on student loans",stat:"High-interest debt compounds against you the same way investing compounds for you.",
   content:"Debt reduces your net worth directly. High-interest debt — credit cards at 24 to 34 percent — compounds against you every month.\n\n£2,000 on a card at 29% APR, minimum payments only: 11 years to clear, £1,400 in extra interest.\n\nStudent loans work differently. You only repay when income crosses a threshold, payments are a fixed percentage of earnings above it, and the debt is written off after 30 years regardless. It behaves much more like an income-contingent tax than a debt. We track it separately rather than treating it as a standard liability."},
  {emoji:"🔍",title:"How to find your numbers in 10 minutes",stat:"A rough number updated regularly beats a perfect one calculated once.",
   content:"Cash and savings: open your bank app. Pension: log into your pension provider — Nest, PensionBee, or your employer's portal. Stocks and ISA: Vanguard, Trading 212, Freetrade — home screen. Property: Zoopla or Rightmove estimate. Car: Autotrader part-exchange.\n\nCredit cards and loans: log into each provider for the current balance. Mortgage remaining: your lender's app or most recent statement.\n\nEstimates are completely fine. The goal is a number that is roughly right, not perfect. You will refine it over time."}
 ],
 goalLinks:["net_worth","grow_nw","learn","calm"],xp:20},

{n:2,phase:"Foundations",title:"Income and Spending: Your Complete Financial Picture",hook:"Without this, every financial decision is based on a guess.",time:12,
 sections:[
  {emoji:"💼",title:"Income: one source vs multiple vs passive",stat:"Passive income covering your costs is what financial freedom actually looks like.",
   content:"Active income is what most people have: a salary. If you stop working, it stops. Multiple streams reduce risk — a second income of even £300 a month is £3,600 a year.\n\nPassive income earns while you sleep: rental income, dividends, interest on savings. This is the goal. Everything in this programme works toward making your passive income number real and growing."},
  {emoji:"📉",title:"Why we always underestimate spending",stat:"People underestimate variable spending by 30 to 40 percent on average.",
   content:"We remember big purchases. We forget the coffee, the Deliveroo, the impulse buy. Your mental estimate of what you spend is almost always wrong.\n\nThe only way to know is to look at actual bank statements. Banking apps like Monzo, Starling, and Chase categorise this automatically. Review the last three months and average it. That is your real baseline — not your ideal version of it."},
  {emoji:"📱",title:"The needs, growth, wants order",stat:"Most people cover needs, spend on wants, and save what is left. There is usually nothing left.",
   content:"The order that builds wealth: cover your needs first (rent, food, transport, utilities). Then build productive assets — clear high-interest debt, build your emergency fund, contribute to pension and ISA. Then spend on wants from what remains.\n\nWhen step two happens automatically on payday, before you can spend it, your productive assets grow every single month whether you think about them or not. That is the whole game."}
 ],
 goalLinks:["budget","calm","learn"],xp:15},

{n:3,phase:"Foundations",title:"Budgeting: Give Every Pound a Job",hook:"A budget is not a restriction. It is a decision about what matters.",time:10,
 sections:[
  {emoji:"🎯",title:"Needs vs wants vs waste",stat:"Waste is not a want. It is money leaving without your permission.",
   content:"50 percent to needs (must-haves: rent, food, transport). 30 percent to wants (chosen: eating out, holidays). 20 percent to savings and debt repayment.\n\nWaste is different from wants. A want is consciously chosen and enjoyed. Waste is money spent without realising — auto-renewals, forgotten subscriptions, impulse purchases you regretted. Eliminating waste feels like getting your money back, not losing something."},
  {emoji:"💡",title:"Pay yourself first — the only method that requires no willpower",stat:"Savings leave your account on payday before you can spend them.",
   content:"Pay yourself first: savings and investments leave your account the day you are paid, before spending. You live on what remains. The simplest method — automated, requiring no daily decisions.\n\nSet up a standing order on payday that moves your savings and investment amount out immediately. The rest becomes your spending budget. Done."}
 ],
 goalLinks:["budget","calm"],xp:15},

{n:4,phase:"Foundations",title:"Your Payslip and How Tax Actually Works",hook:"The most common tax misconception costs people real money.",time:10,
 sections:[
  {emoji:"📋",title:"Every payslip line explained",stat:"National Insurance is not income tax. It funds your state pension.",
   content:"Gross salary: your total pay before anything is deducted. Income tax (PAYE): taken at source by your employer — depends on your tax code. National Insurance: 12% on earnings between £12,570 and £50,270, separate from income tax, funds your state pension entitlement.\n\nPension contribution: leaves before you see it, shown as a percentage of gross. Your employer also contributes — this is money on top of your salary. Net pay: what actually arrives in your account. This is what you budget from."},
  {emoji:"🧮",title:"How tax bands actually work",stat:"Getting a pay rise into the 40% bracket never makes you worse off.",
   content:"Tax bands are marginal. You only pay the higher rate on the portion of income above the threshold — not on all your income.\n\n£0 to £12,570: 0% personal allowance. £12,571 to £50,270: 20% basic rate. £50,271 to £125,140: 40% only on this slice.\n\nSomeone earning £55,000 pays 40% only on £4,730 above £50,270. Their effective rate is around 17% — not 40%. A pay rise always means more money in your pocket."},
  {emoji:"🔢",title:"Your tax code and why it matters",stat:"A wrong tax code costs real money. HMRC will not always tell you.",
   content:"Your tax code controls how much income tax is taken from your pay. 1257L is standard — it means you get £12,570 of tax-free personal allowance.\n\nW1 or M1 is an emergency code, often applied when starting a new job — can mean overpaying tax. BR means 20% is taken on all income with no personal allowance — common mistake when a second job code applies to your main job.\n\nCheck yours at gov.uk/check-income-tax. If it is wrong, HMRC recalculates and refunds any overpayment."}
 ],
 goalLinks:["learn","calm"],xp:15},

{n:5,phase:"Stabilise",title:"Debt: Stop Letting Your Past Control Your Present",hook:"Interest compounds against you the same way investing compounds for you.",time:15,
 sections:[
  {emoji:"⚖️",title:"Why debt is the biggest drag on future wealth",stat:"£2,000 at 34% APR, minimum payments only: 11 years and £1,400 extra in interest.",
   content:"High-interest debt is not just a financial problem — it is a time machine. Every payment on a credit card is paying for something bought months ago. That money cannot build your future at the same time.\n\nBeyond the financial cost: the low-level anxiety that does not go away, avoiding opening statements, the relationship stress it creates. Clearing debt changes how people feel every day."},
  {emoji:"💡",title:"Paying off debt vs investing — when each wins",stat:"Paying 29% APR debt gives you a guaranteed 29% return. The stock market cannot promise that.",
   content:"If your debt costs 29% APR, paying it off gives you a guaranteed 29% return — better than any investment can reliably promise. The stock market averages 7 to 10% per year, but that is not guaranteed.\n\nThe one exception: employer pension match. That is a guaranteed 100% return — contribute enough to capture that first. But all other investing waits until high-interest debt is cleared."},
  {emoji:"❄️",title:"Avalanche vs Snowball — pick one and stick to it",stat:"A completed Snowball beats an abandoned Avalanche every time.",
   content:"Avalanche (highest interest first): mathematically optimal, costs least total interest. Best if you are motivated by numbers.\n\nSnowball (smallest balance first): costs more interest but research shows higher completion rates because early wins build momentum.\n\nBoth work. Pick the one you will actually stick to. That is the only thing that matters."}
 ],
 goalLinks:["debt","calm","net_worth"],xp:20},

{n:6,phase:"Stabilise",title:"Savings Pots: A Place for Everything",hook:"An emergency fund is not savings. It is insurance.",time:10,
 sections:[
  {emoji:"🛡️",title:"Emergency fund: your first financial priority",stat:"Start with £1,000. That covers most common emergencies.",
   content:"An emergency fund exists so that when something goes wrong — a boiler breaks, you lose a client, a car needs work — you do not reach for a credit card.\n\nStart with £1,000. Then build to 3 to 6 months of essential spending using your income and spending numbers. Keep it in a high-interest easy-access account — Monzo pots, Starling Spaces, or Marcus. Not your current account. Accessible within 24 hours but not accidentally spent."},
  {emoji:"📅",title:"Sinking funds: saving in advance for predictable costs",stat:"Car insurance at £800 a year means £67 a month set aside now.",
   content:"A sinking fund is money set aside gradually for a cost you know is coming. Car insurance, holiday, Christmas, home maintenance, a new phone.\n\nIf you can predict it, save for it in advance. Everything that ends up on a credit card out of nowhere was actually predictable — it just was not planned for."},
  {emoji:"🚀",title:"The investing pot — where wealth building begins",stat:"Once your emergency fund is in place, this is where the game changes.",
   content:"Once your emergency fund is funded and high-interest debt is being cleared, the investing pot is where you shift from stabilising your finances to actively building wealth.\n\nThis pot is money you will not need for at least five years — money that goes to work growing your net worth. Setting it up now, even empty, means it is there when you are ready to fill it. Levels 8 and 9 explain exactly what to put in it."}
 ],
 goalLinks:["calm","net_worth","budget"],xp:15},

{n:7,phase:"Optimise",title:"Capture Free Money: Tax, Pension Match, Allowances",hook:"Your employer is offering money you are not taking.",time:10,
 sections:[
  {emoji:"💰",title:"Employer pension match: a guaranteed 100% return",stat:"Not contributing enough to match your employer is turning down a pay rise.",
   content:"If your employer matches up to 5% and you contribute 3%, on a £32,000 salary you are leaving £640 a year on the table. Just by not ticking a box.\n\nSalary sacrifice makes it better: contributions come from gross salary before tax or National Insurance is calculated. On £35,000 contributing 5% via salary sacrifice, you save approximately £350 a year in NI on top."},
  {emoji:"🎁",title:"Tax allowances most people never claim",stat:"Marriage allowance: £252 a year, backdatable four years.",
   content:"Working from home: £6 a week (£312 a year) without needing receipts — claim at gov.uk/tax-relief-for-employees.\n\nMarriage allowance: if one partner earns under £12,570 and the other is a basic rate taxpayer, transfer £1,260 of personal allowance. Up to £252 a year, backdatable four years.\n\nProfessional fees, uniform cleaning, Gift Aid on charity donations — each one is free money left unclaimed by most people."}
 ],
 goalLinks:["learn","net_worth","invest"],xp:15},

{n:8,phase:"Grow",title:"Open Your ISA: The Tax-Free Wrapper",hook:"Every year you delay costs you. The allowance does not roll over.",time:10,
 sections:[
  {emoji:"📦",title:"What an ISA actually is",stat:"£20,000 a year, no tax on growth, no tax on withdrawal. Ever.",
   content:"An ISA is a tax wrapper — an account where money grows without being taxed. No capital gains tax. No income tax on dividends. No tax when you withdraw.\n\nEvery adult has a £20,000 per year allowance. Use it or lose it — it does not roll over to next year. Fill an ISA before investing anywhere else. Why pay tax on growth when there is a legal wrapper that prevents it?"},
  {emoji:"🗂️",title:"Which ISA is right for you?",stat:"Stocks and Shares ISA: historically 7 to 10 percent a year long term.",
   content:"Cash ISA: like a savings account, 4 to 5% tax-free interest. Good for money needed within 5 years. Not suitable for long-term wealth building — inflation erodes real value over time.\n\nStocks and Shares ISA: invest in funds inside the wrapper. Best for money you will not need for 5 or more years. This is the one that builds wealth.\n\nLifetime ISA (LISA): under-40s only. 25% government bonus on up to £4,000 a year — that is £1,000 free. For a first home or retirement after 60. If eligible, open one before you turn 40."},
  {emoji:"🏦",title:"Where to open one",stat:"Vanguard: lowest costs overall. Trading 212: zero platform fee.",
   content:"Vanguard: lowest overall costs, great for beginners (0.15% platform fee). Trading 212: 0% platform fee, good for starting small. Freetrade: popular for first-time investors. For LISA: Moneybox or AJ Bell.\n\nHalal users: shariah-compliant funds are available inside a standard Stocks and Shares ISA. The wrapper is identical — only the fund choice changes."}
 ],
 goalLinks:["invest","net_worth"],xp:20},

{n:9,phase:"Grow",title:"Make Your First Investment: Let Time Do the Work",hook:"Starting at 25 vs 35 on £200 a month is a £282,000 difference at 65.",time:10,
 sections:[
  {emoji:"⏰",title:"Compound growth: the most important concept in personal finance",stat:"£200 a month from age 25 vs 35 — same money, same fund, £282,000 difference at 65.",
   content:"Compound growth means your returns earn returns. £10,000 growing at 7% a year becomes £76,000 over 30 years without any additional contributions.\n\nStart at 25 with £200 a month: £525,000 by 65. Start at 35: £243,000 by 65. Same investment. Same fund. The 10-year head start is worth £282,000. Start now, start small."},
  {emoji:"📈",title:"Index funds: why simple wins",stat:"90% of professional fund managers underperform a simple index fund over 10 years.",
   content:"An index fund tracks a market like the S&P 500 or FTSE Global All Cap — you own a tiny slice of hundreds of companies at once. Instant diversification.\n\nActive fund at 1.5% per year vs index fund at 0.2% on £100,000 over 10 years — the difference is approximately £15,000 that goes to the fund manager instead of you.\n\nRecommended starting point: Vanguard FTSE Global All Cap (0.23%) inside a Stocks and Shares ISA. Set a monthly direct debit. Do not watch it daily."},
  {emoji:"⚖️",title:"Risk and time horizon — matching them correctly",stat:"Money needed in 5 or more years: global equity index fund is appropriate for most people.",
   content:"Under 3 years: keep in cash savings, not stocks. 3 to 5 years: cautious mix. 5 or more years: global equity index fund. 10 or more years: higher equity allocation.\n\nThe most common mistake: investing money you might need and being forced to sell when markets are down. The emergency fund from Level 6 exists so your investments can stay invested through volatile periods."}
 ],
 goalLinks:["invest","retirement","net_worth"],xp:25},
]

/* ════════════════════════════════════════════════════════════════════
   SECTION CARD PLAYER — swipeable lesson cards
   ════════════════════════════════════════════════════════════════════ */
function SectionCardPlayer({ sections, phaseColor, onDone }) {
  const [card, setCard] = useState(0)
  const total = sections.length
  const s = sections[card]

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display:"flex", gap:4, marginBottom:20 }}>
        {sections.map((_,i) => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2,
            background: i <= card ? phaseColor : T.border,
            transition:"background .25s" }}/>
        ))}
      </div>

      {/* Card */}
      <div key={card} className="ls-slidein" style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:22, overflow:"hidden", marginBottom:14 }}>
        {/* Header */}
        <div style={{ background:`${phaseColor}14`, borderBottom:`1px solid ${phaseColor}20`, padding:"20px 22px 16px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>{s.emoji}</div>
          <p style={{ color:phaseColor, fontWeight:700, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", marginBottom:6 }}>
            {card + 1} of {total}
          </p>
          <h3 style={{ color:T.white, fontWeight:900, fontSize:17, lineHeight:1.25 }}>{s.title}</h3>
        </div>

        {/* Key stat */}
        <div style={{ background:`${phaseColor}08`, borderBottom:`1px solid ${phaseColor}12`, padding:"11px 20px" }}>
          <p style={{ color:phaseColor, fontWeight:700, fontSize:13, textAlign:"center", lineHeight:1.4 }}>💡 {s.stat}</p>
        </div>

        {/* Content */}
        <div style={{ padding:"18px 20px 20px" }}>
          {s.content.split("\n\n").map((para, j) => (
            <p key={j} style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.65,
              marginBottom: j < s.content.split("\n\n").length - 1 ? 12 : 0 }}>{para}</p>
          ))}
          {s.columns && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
              {s.columns.map((col, ci) => (
                <div key={ci} style={{ background:T.surface, borderRadius:14, padding:"13px 12px", border:`1px solid ${col.color}25` }}>
                  <p style={{ color:col.color, fontWeight:700, fontSize:11, marginBottom:9, letterSpacing:.4 }}>{col.label}</p>
                  {col.items.map((item, ii) => (
                    <div key={ii} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:col.color, flexShrink:0 }}/>
                      <p style={{ color:"#C8D8EC", fontSize:12 }}>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ display:"flex", gap:10 }}>
        {card > 0 && (
          <button onClick={() => setCard(c => c - 1)} style={{
            flex:"0 0 50px", background:T.card, border:`1px solid ${T.border}`,
            borderRadius:14, padding:"12px", color:T.muted, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <ChevronLeft size={18}/>
          </button>
        )}
        {card < total - 1
          ? <button onClick={() => setCard(c => c + 1)} style={{
              flex:1, background:phaseColor, border:"none", borderRadius:14,
              padding:"13px", color:"#070D1A", fontWeight:800, fontSize:14, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6
            }}>
              Next <ChevronRight size={16}/>
            </button>
          : <button onClick={onDone} style={{
              flex:1, background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,
              border:"none", borderRadius:14, padding:"13px", color:"#070D1A",
              fontWeight:800, fontSize:14, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6
            }}>
              Got it — show me my plan →
            </button>
        }
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   CONFETTI
   ════════════════════════════════════════════════════════════════════ */
function Confetti({ active }) {
  if(!active) return null
  const pieces = Array.from({length:30},(_,i)=>({
    id:i, x:Math.random()*100,
    color:[T.teal,T.purple,T.amber,T.green,T.blue,"#F472B6"][Math.floor(Math.random()*6)],
    delay:Math.random()*0.4, size:6+Math.random()*6, spin:Math.random()*360,
  }))
  return (
    <div style={{ position:"fixed",inset:0,zIndex:999,pointerEvents:"none",overflow:"hidden" }}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:"-20px",
          width:p.size, height:p.size, background:p.color,
          borderRadius:Math.random()>0.5?"50%":"2px",
          animation:`confettiFall 1.4s ${p.delay}s ease-in forwards`,
          transform:`rotate(${p.spin}deg)`,
        }}/>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   LEARN TAB — 9-level journey
   ════════════════════════════════════════════════════════════════════ */
function LearnTab() {
  const { state, save, toast } = useApp()
  const [activeLevel, setActiveLevel] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const completedLevels = state.completedLevels || []
  const doneSet = new Set(completedLevels)
  const currentLevel = state.currentLevel || 1

  function completeLevel(n) {
    if(doneSet.has(n)) return
    const newCompleted = [...completedLevels, n]
    const nextLevel = Math.min(Math.max(n + 1, currentLevel), 9)
    const xpGain = LEVELS.find(l=>l.n===n)?.xp || 15
    save({
      ...state,
      completedLevels: newCompleted,
      currentLevel: nextLevel,
      profile: { ...state.profile, points:(state.profile.points||0)+xpGain }
    })
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1800)
    toast(`🎉 Level ${n} complete! +${xpGain} XP`)
    setActiveLevel(null)
  }

  // Auto-open pending level from HomeTab
  const { save: saveCtx } = useApp()
  React.useEffect(() => {
    const pending = state.pendingLearnLevel
    if(pending && activeLevel === null) {
      save({ ...state, pendingLearnLevel:null })
      setActiveLevel(pending)
    }
  }, [])

  if(activeLevel !== null) {
    const lv = LEVELS.find(l => l.n === activeLevel)
    if(!lv) { setActiveLevel(null); return null }
    return <LevelPlayer level={lv} onBack={() => setActiveLevel(null)} onComplete={() => completeLevel(lv.n)}/>
  }

  const phases = ["Foundations","Stabilise","Optimise","Grow"]

  const [activeCourse, setActiveCourse] = useState("main")

  const COURSES = [
    { id:"main",    label:"Financial Freedom",   emoji:"🚀", desc:"Your complete 9-step guide to financial independence",   color:T.teal   },
    { id:"ibd",     label:"IBD and PE",          emoji:"🏦", desc:"3 x 90-minute webinars on investment banking and PE",     color:T.purple },
    { id:"extra",   label:"Money Knowledge",     emoji:"💡", desc:"History of money, basic economics, and broader context",  color:T.amber  },
  ]

  const IBD_CONTENT = [
    { n:1, title:"Breaking into Investment Banking",   hook:"The market, the roles, and how to position yourself",   emoji:"🏦", done:false },
    { n:2, title:"Private Equity Fundamentals",        hook:"How PE funds work, deal structures, and career paths",  emoji:"📊", done:false },
    { n:3, title:"Interview Prep and Case Studies",    hook:"Technicals, modelling, and what interviewers really want", emoji:"🎯", done:false },
  ]

  const EXTRA_CONTENT = [
    { n:1, title:"The History of Money",               hook:"From barter to Bitcoin — how money evolved",                emoji:"📜", done:false },
    { n:2, title:"Basic Economics",                    hook:"Supply, demand, inflation — the forces shaping your money",  emoji:"📈", done:false },
    { n:3, title:"The Psychology of Money",            hook:"Why we make irrational financial decisions and how to stop",  emoji:"🧠", done:false },
    { n:4, title:"Global Finance",                     hook:"How central banks, bonds and markets connect to your wallet", emoji:"🌍", done:false },
  ]

  const lvGrads = [
    "linear-gradient(135deg,#8B0000,#C0392B)",
    "linear-gradient(135deg,#7B1A1A,#E74C3C)",
    "linear-gradient(135deg,#6B1111,#C0392B)",
    "linear-gradient(135deg,#5C0A0A,#A93226)",
    "linear-gradient(135deg,#7D4000,#E67E22)",
    "linear-gradient(135deg,#6E3600,#CA6F1E)",
    "linear-gradient(135deg,#1A3C5C,#2980B9)",
    "linear-gradient(135deg,#0A4A2A,#27AE60)",
    "linear-gradient(135deg,#083D22,#1E8449)",
  ]

  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:100 }}>
      <Confetti active={showConfetti}/>

      {/* Header */}
      <div style={{ padding:"20px 20px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ color:T.white, fontWeight:900, fontSize:22, letterSpacing:-.3, marginBottom:4 }}>
            Courses
          </h2>
          <p style={{ color:"#8FA3BE", fontSize:13, marginBottom:14 }}>
            Start with Financial Freedom — the guide that changes everything.
          </p>

          {/* Course selector tabs */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:14,
            scrollbarWidth:"none", WebkitOverflowScrolling:"touch" }}>
            {COURSES.map(c => {
              const active = activeCourse === c.id
              return (
                <button key={c.id} onClick={() => setActiveCourse(c.id)}
                  style={{ flexShrink:0, display:"flex", alignItems:"center", gap:8,
                    background: active ? c.color+"20" : "rgba(255,255,255,.04)",
                    border:`2px solid ${active ? c.color : "rgba(255,255,255,.08)"}`,
                    borderRadius:14, padding:"10px 16px", cursor:"pointer",
                    fontFamily:"inherit", transition:"all .15s" }}>
                  <span style={{ fontSize:16 }}>{c.emoji}</span>
                  <p style={{ color: active ? "#FFFFFF" : "#8FA3BE", fontWeight: active ? 700 : 500,
                    fontSize:13, whiteSpace:"nowrap" }}>{c.label}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 18px", maxWidth:600, margin:"0 auto" }}>

        {/* ── MAIN COURSE: Financial Freedom ── */}
        {activeCourse === "main" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <p style={{ color:"#FFFFFF", fontWeight:800, fontSize:17 }}>Financial Freedom Guide</p>
              <p style={{ color:"#8FA3BE", fontSize:13 }}>{completedLevels.length}/9 done</p>
            </div>
            <div style={{ background:T.surface, borderRadius:99, height:4, overflow:"hidden", marginBottom:18 }}>
              <div style={{ width:`${(completedLevels.length/9)*100}%`, height:"100%",
                background:`linear-gradient(90deg,${T.teal},${T.purple})`,
                borderRadius:99, transition:"width .5s ease" }}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {LEVELS.map((lv, idx) => {
                const isDone = doneSet.has(lv.n)
                const isCurrent = lv.n === currentLevel && !isDone
                return (
                  <button key={lv.n} onClick={() => setActiveLevel(lv.n)}
                    className="ls-card-lift"
                    style={{ background:T.card,
                      border:`2px solid ${isCurrent ? (PC[lv.phase]||T.teal)+"60" : isDone ? T.green+"30" : T.border}`,
                      borderRadius:22, overflow:"hidden", cursor:"pointer",
                      fontFamily:"inherit", textAlign:"left",
                      boxShadow: isCurrent ? `0 4px 24px ${PC[lv.phase]||T.teal}20` : "none" }}>
                    <div style={{ height:110, background: isDone
                        ? "linear-gradient(135deg,rgba(52,211,153,.25),rgba(52,211,153,.08))"
                        : lvGrads[idx % lvGrads.length],
                      display:"flex", alignItems:"center", justifyContent:"center",
                      position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", inset:0,
                        background:"radial-gradient(circle at 70% 30%,rgba(255,255,255,.10) 0%,transparent 60%)" }}/>
                      <div style={{ position:"absolute", top:8, left:10,
                        background:"rgba(0,0,0,.35)", borderRadius:99, padding:"3px 9px" }}>
                        <p style={{ color:"rgba(255,255,255,.9)", fontSize:10, fontWeight:700,
                          letterSpacing:.5, textTransform:"uppercase" }}>{lv.phase}</p>
                      </div>
                      <div style={{ position:"absolute", top:8, right:10,
                        background: isDone ? "rgba(52,211,153,.35)" : isCurrent ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.4)",
                        borderRadius:99, padding:"3px 9px" }}>
                        <p style={{ color:"#FFFFFF", fontSize:10, fontWeight:800 }}>
                          {isDone ? "✓ Done" : isCurrent ? "Current" : `Step ${lv.n}`}
                        </p>
                      </div>
                      <span style={{ fontSize:44, position:"relative", zIndex:1 }}>
                        {isDone ? "✅" : lv.sections[0]?.emoji || "📊"}
                      </span>
                    </div>
                    <div style={{ padding:"14px 13px 16px" }}>
                      <p style={{ color:isDone?"#6A8098":T.white, fontWeight:800, fontSize:14,
                        lineHeight:1.3, marginBottom:6,
                        textDecoration:isDone?"line-through":"none" }}>{lv.title}</p>
                      <p style={{ color:isDone?"#4A6080":"#C8D8EC", fontSize:12, lineHeight:1.5,
                        marginBottom:10 }}>{lv.hook}</p>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <p style={{ color:isCurrent?(PC[lv.phase]||T.teal):isDone?T.green:"#6B8CB8",
                          fontSize:11, fontWeight:700 }}>
                          {isDone ? "Completed" : isCurrent ? "Continue →" : "Start →"}
                        </p>
                        <div style={{ background:`${PC[lv.phase]||T.teal}18`, borderRadius:99, padding:"2px 8px" }}>
                          <p style={{ color:PC[lv.phase]||T.teal, fontSize:10, fontWeight:700 }}>+{lv.xp} XP</p>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── IBD / PE COURSE ── */}
        {activeCourse === "ibd" && (
          <div>
            <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,.15),rgba(15,191,184,.08))",
              border:"1px solid rgba(167,139,250,.25)", borderRadius:18, padding:"18px", marginBottom:18 }}>
              <p style={{ color:T.purple, fontWeight:800, fontSize:15, marginBottom:6 }}>
                Investment Banking and Private Equity
              </p>
              <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.65 }}>
                3 live webinars of 90 minutes each, covering how to break into IBD and PE, understand deal structures, and ace your interviews.
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {IBD_CONTENT.map((item, idx) => (
                <button key={item.n} className="ls-card-lift"
                  style={{ background:T.card, border:`2px solid rgba(167,139,250,.25)`,
                    borderRadius:22, overflow:"hidden", cursor:"pointer",
                    fontFamily:"inherit", textAlign:"left" }}>
                  <div style={{ height:110,
                    background:`linear-gradient(135deg,rgba(88,28,252,.35),rgba(167,139,250,.15))`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:8, left:10, background:"rgba(0,0,0,.4)",
                      borderRadius:99, padding:"3px 9px" }}>
                      <p style={{ color:"rgba(255,255,255,.9)", fontSize:10, fontWeight:700 }}>Webinar {item.n}</p>
                    </div>
                    <span style={{ fontSize:44 }}>{item.emoji}</span>
                  </div>
                  <div style={{ padding:"14px 13px 16px" }}>
                    <p style={{ color:T.white, fontWeight:800, fontSize:14, lineHeight:1.3, marginBottom:6 }}>{item.title}</p>
                    <p style={{ color:"#C8D8EC", fontSize:12, lineHeight:1.5 }}>{item.hook}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── EXTRA KNOWLEDGE COURSE ── */}
        {activeCourse === "extra" && (
          <div>
            <div style={{ background:"linear-gradient(135deg,rgba(245,158,11,.12),rgba(15,191,184,.06))",
              border:"1px solid rgba(245,158,11,.25)", borderRadius:18, padding:"18px", marginBottom:18 }}>
              <p style={{ color:T.amber, fontWeight:800, fontSize:15, marginBottom:6 }}>
                Broaden your money knowledge
              </p>
              <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.65 }}>
                Context that makes everything else click — from why money exists to how global markets affect your pocket.
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {EXTRA_CONTENT.map((item) => (
                <button key={item.n} className="ls-card-lift"
                  style={{ background:T.card, border:`2px solid rgba(245,158,11,.22)`,
                    borderRadius:22, overflow:"hidden", cursor:"pointer",
                    fontFamily:"inherit", textAlign:"left" }}>
                  <div style={{ height:110,
                    background:"linear-gradient(135deg,rgba(180,100,0,.35),rgba(245,158,11,.15))",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:8, left:10, background:"rgba(0,0,0,.4)",
                      borderRadius:99, padding:"3px 9px" }}>
                      <p style={{ color:"rgba(255,255,255,.9)", fontSize:10, fontWeight:700 }}>Module {item.n}</p>
                    </div>
                    <span style={{ fontSize:44 }}>{item.emoji}</span>
                  </div>
                  <div style={{ padding:"14px 13px 16px" }}>
                    <p style={{ color:T.white, fontWeight:800, fontSize:14, lineHeight:1.3, marginBottom:6 }}>{item.title}</p>
                    <p style={{ color:"#C8D8EC", fontSize:12, lineHeight:1.5 }}>{item.hook}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

}

/* ════════════════════════════════════════════════════════════════════
   LEVEL PLAYER — teaches and tracks completion
   ════════════════════════════════════════════════════════════════════ */
function LevelPlayer({ level, onBack, onComplete }) {
  const { state } = useApp()
  const [view, setView] = useState("learn") // "learn" | "action"
  const [taughtAll, setTaughtAll] = useState(false)
  const pc = PC[level.phase] || T.teal
  const isComplete = (state.completedLevels || []).includes(level.n)

  return (
    <div style={{ minHeight:"100dvh", background:T.bg, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"rgba(11,20,36,.95)", backdropFilter:"blur(20px)",
        padding:"14px 20px", display:"flex", alignItems:"center", gap:12,
        borderBottom:`1px solid rgba(255,255,255,.05)`, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", padding:4 }}>
          <ChevronLeft size={22}/>
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ color:pc, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>
            {level.phase} · Level {level.n}
          </p>
          <p style={{ color:T.white, fontWeight:800, fontSize:14, lineHeight:1.2,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{level.title}</p>
        </div>
        {isComplete && (
          <span style={{ background:T.greenDim, color:T.green, fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:99 }}>✓ Done</span>
        )}
      </div>

      {/* Tab row */}
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, background:T.surface, flexShrink:0 }}>
        {[{id:"learn",label:"📖 Learn"},{id:"action",label:"✅ Action"}].map(t => {
          const active = view === t.id
          return (
            <button key={t.id} onClick={() => setView(t.id)}
              style={{ flex:1, background:"none", border:"none", padding:"12px 8px",
                cursor:"pointer", fontFamily:"inherit", position:"relative",
                color: active ? T.teal : T.muted, fontWeight: active ? 700 : 500, fontSize:13 }}>
              {t.label}
              {active && <div style={{ position:"absolute", bottom:0, left:"10%", right:"10%", height:2, borderRadius:2, background:T.teal }}/>}
            </button>
          )
        })}
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:40 }}>
        <div style={{ maxWidth:600, margin:"0 auto", padding:"20px 18px" }}>
          {view === "learn" && (
            <div className="ls-fadein">
              <div style={{ background:`${pc}12`, border:`1px solid ${pc}22`, borderRadius:14, padding:"12px 16px", marginBottom:20 }}>
                <p style={{ color:pc, fontWeight:700, fontSize:14, lineHeight:1.5 }}>{level.hook}</p>
              </div>
              <SectionCardPlayer
                sections={level.sections}
                phaseColor={pc}
                onDone={() => { setTaughtAll(true); setView("action") }}
              />
            </div>
          )}

          {view === "action" && (
            <div className="ls-fadein">
              {!taughtAll && !isComplete && (
                <div style={{ background:T.amberDim, border:`1px solid ${T.amberBorder}`, borderRadius:14, padding:"12px 14px", marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
                  <Info size={16} color={T.amber}/>
                  <p style={{ color:T.amber, fontSize:13 }}>Read the lesson first for the full picture — but you can complete the action any time.</p>
                </div>
              )}

              <div style={{ background:`${pc}10`, border:`1.5px solid ${pc}30`, borderRadius:20, padding:"24px", marginBottom:16 }}>
                <p style={{ color:pc, fontWeight:800, fontSize:12, letterSpacing:.5, textTransform:"uppercase", marginBottom:10 }}>Level {level.n} action</p>

                {/* Level-specific action text */}
                <div style={{ color:"#E2EAF6", fontSize:15, lineHeight:1.7, marginBottom:20 }}>
                  {level.n === 1 && <p>Open your banking app, pension portal, and any investment accounts. Get rough numbers for what you own and what you owe. Enter them in the Analytics tab. Your net worth number — even a rough one — is waiting for you.</p>}
                  {level.n === 2 && <p>Check your last three months of bank statements. Note your average monthly spending. Subtract it from your take-home. That gap is your surplus. Enter your income and spending numbers in the Analytics tab if you have not already.</p>}
                  {level.n === 3 && <p>Set up a standing order on payday that moves a fixed amount to savings before you can spend it. Even £50. The habit matters more than the amount. What is your pay-yourself-first number?</p>}
                  {level.n === 4 && <p>Find your payslip and check your tax code. If it is not 1257L, look up what yours means at gov.uk/check-income-tax. Confirm every deduction makes sense. This takes 10 minutes and could save you real money.</p>}
                  {level.n === 5 && <p>List every debt you have: balance, interest rate, minimum payment. Rank them highest APR first. That is your payoff order. The debt at the top of the list gets every spare pound after minimums are paid on the rest.</p>}
                  {level.n === 6 && <p>Open a named easy-access savings account (Monzo pot, Marcus, Starling Space) and label it Emergency Fund. Set up a standing order to it. Even £50 a month. The goal is £1,000 first, then three months of essential costs.</p>}
                  {level.n === 7 && <p>Log into your workplace pension portal and check what percentage you contribute and what your employer matches. If you are not contributing enough to get the full employer match, increase it today. That is a pay rise you are currently refusing.</p>}
                  {level.n === 8 && <p>Open a Stocks and Shares ISA if you do not have one. Vanguard and Trading 212 both take about 10 minutes to set up. You do not need to put money in yet — just get the account open before the tax year ends.</p>}
                  {level.n === 9 && <p>Set up a monthly direct debit into a global index fund inside your ISA. Vanguard FTSE Global All Cap or similar. Even £25 counts. Automation is the whole point — it should happen without you having to think about it.</p>}
                </div>

                <div style={{ background:"rgba(0,0,0,.2)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
                  <p style={{ color:T.muted, fontSize:12, fontWeight:700, marginBottom:4 }}>Done when:</p>
                  <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.5 }}>
                    {level.n === 1 && "You have entered your assets and liabilities and seen your net worth number for the first time."}
                    {level.n === 2 && "You know your monthly surplus — what is actually left after all spending."}
                    {level.n === 3 && "A pay-yourself-first standing order is running on payday."}
                    {level.n === 4 && "You have confirmed your tax code is correct and understand every line of your payslip."}
                    {level.n === 5 && "Every debt is listed with its APR. Payoff order is written down."}
                    {level.n === 6 && "A named emergency fund account exists with a standing order running into it."}
                    {level.n === 7 && "You are contributing enough to capture your full employer pension match."}
                    {level.n === 8 && "A Stocks and Shares ISA is open, even with £0 in it."}
                    {level.n === 9 && "A monthly direct debit is running into a global index fund inside your ISA."}
                  </p>
                </div>

                {!isComplete
                  ? <button onClick={onComplete} style={{
                      width:"100%", background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,
                      border:"none", borderRadius:14, padding:"16px", color:"#070D1A",
                      fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit"
                    }}>I have done this ✓</button>
                  : <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center" }}>
                      <Check size={20} color={T.green}/>
                      <p style={{ color:T.green, fontWeight:800, fontSize:16 }}>Level {level.n} complete!</p>
                    </div>
                }
              </div>

              {/* Nudge to learn tab if not read */}
              {!taughtAll && !isComplete && (
                <button onClick={() => setView("learn")} style={{
                  width:"100%", background:"none", border:`1px solid ${T.border}`,
                  borderRadius:14, padding:"12px", color:T.muted, fontSize:13,
                  cursor:"pointer", fontFamily:"inherit"
                }}>
                  ← Read the lesson first
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



function PersonalityQuiz({ state, save, onClose }) {
  const [step, setStep]       = useState(0)         // 0 = intro, 1-12 = questions, 13 = result
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [result, setResult]   = useState(null)
  const [animDir, setAnimDir] = useState("in")

  const total = PERSONALITY_QUIZ.length
  const q     = PERSONALITY_QUIZ[step - 1]
  const isIntro  = step === 0
  const isResult = step > total

  function next() {
    if(isIntro) { setStep(1); return }
    if(selected === null) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setAnimDir("out")
    setTimeout(() => {
      if(step >= total) {
        const r = calcQuizPersonality(newAnswers, state)
        setResult(r)
        save({ ...state, profile: { ...state.profile, personalityResult: r } })
        setStep(total + 1)
      } else {
        setStep(s => s + 1)
        setSelected(null)
      }
      setAnimDir("in")
    }, 180)
  }

  function back() {
    if(step <= 1) { onClose(); return }
    setAnimDir("out")
    setTimeout(() => {
      setStep(s => s - 1)
      const prevQ = PERSONALITY_QUIZ[step - 2]
      setSelected(answers[prevQ?.id] ?? null)
      setAnimDir("in")
    }, 180)
  }

  const pct = step === 0 ? 0 : Math.round((step / total) * 100)

  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:300,display:"flex",flexDirection:"column",overflowY:"auto" }}>
      <style>{`@keyframes quizIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Top bar */}
      <div style={{ padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.bg,zIndex:10 }}>
        <button onClick={isResult ? onClose : back} style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,padding:4,fontFamily:"inherit" }}>
          {isResult ? <span style={{ fontSize:13,fontWeight:700 }}>Done</span> : <span style={{ fontSize:20 }}>←</span>}
        </button>
        <div style={{ flex:1 }}>
          {!isIntro && !isResult && (
            <>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                <p style={{ color:T.muted,fontSize:11,fontWeight:700 }}>Question {step} of {total}</p>
                <p style={{ color:T.teal,fontSize:11,fontWeight:700 }}>{pct}%</p>
              </div>
              <div style={{ background:T.surface,borderRadius:99,height:4,overflow:"hidden" }}>
                <div style={{ width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width .4s ease" }}/>
              </div>
            </>
          )}
          {(isIntro || isResult) && <p style={{ color:T.muted,fontSize:12,fontWeight:600 }}>Money Personality</p>}
        </div>
      </div>

      <div style={{ flex:1,padding:"28px 20px 40px",maxWidth:520,margin:"0 auto",width:"100%" }}>

        {/* INTRO */}
        {isIntro && (
          <div style={{ animation:"quizIn .3s ease" }}>
            <div style={{ fontSize:56,marginBottom:20,textAlign:"center" }}>🧠</div>
            <h1 style={{ color:T.white,fontWeight:900,fontSize:26,textAlign:"center",marginBottom:12,lineHeight:1.2 }}>
              Find out your money personality
            </h1>
            <p style={{ color:"#E2EAF6",fontSize:15,textAlign:"center",lineHeight:1.7,marginBottom:32 }}>
              12 scenario questions. No right answers. Takes about 4 minutes.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:32 }}>
              {[
                { icon:"🎯", text:"Your money archetype, one of 8 types" },
                { icon:"📊", text:"How you make financial decisions" },
                { icon:"💡", text:"Your specific blind spots and strengths" },
                { icon:"🗺️", text:"What this means in real-life scenarios" },
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px" }}>
                  <span style={{ fontSize:20 }}>{item.icon}</span>
                  <p style={{ color:"#E2EAF6",fontSize:13,fontWeight:500 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <button onClick={next} style={{ width:"100%",background:`linear-gradient(135deg,${T.teal},${T.purple})`,border:"none",borderRadius:16,padding:"16px",color:T.bg,fontWeight:900,fontSize:16,cursor:"pointer",fontFamily:"inherit" }}>
              Start the quiz
            </button>
          </div>
        )}

        {/* QUESTION */}
        {!isIntro && !isResult && q && (
          <div key={step} style={{ animation:"quizIn .25s ease" }}>
            <div style={{ marginBottom:8 }}>
              <span style={{ background:T.purpleDim,color:T.purple,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99,border:`1px solid ${T.purpleBorder}`,letterSpacing:.8,textTransform:"uppercase" }}>
                {q.dimension.replace(/_/g," ")}
              </span>
            </div>
            <h2 style={{ color:T.white,fontWeight:900,fontSize:21,lineHeight:1.25,marginBottom:6,marginTop:14 }}>{q.headline}</h2>
            <p style={{ color:"#8FA3BE",fontSize:14,marginBottom:28 }}>{q.sub}</p>

            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:32 }}>
              {q.options.map((opt, oi) => {
                const sel = selected === oi
                return (
                  <button key={oi} onClick={()=>setSelected(oi)}
                    style={{
                      background: sel ? `linear-gradient(135deg,${T.tealDim},${T.purpleDim})` : T.card,
                      border: `2px solid ${sel ? T.teal : T.border}`,
                      borderRadius:14, padding:"15px 18px",
                      cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                      color: sel ? T.white : "#E2EAF6",
                      fontWeight: sel ? 700 : 500, fontSize:14, lineHeight:1.4,
                      transition:"all .15s",
                      boxShadow: sel ? `0 0 20px ${T.teal}20` : "none",
                      display:"flex", alignItems:"center", gap:12
                    }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:sel?T.bg:T.muted,transition:"all .15s" }}>
                      {sel ? "✓" : String.fromCharCode(65+oi)}
                    </div>
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <button onClick={next} disabled={selected===null}
              style={{ width:"100%",background:selected!==null?`linear-gradient(135deg,${T.teal},${T.purple})`:`${T.surface}`,border:`1px solid ${selected!==null?T.teal:T.border}`,borderRadius:16,padding:"15px",color:selected!==null?T.bg:T.muted,fontWeight:900,fontSize:15,cursor:selected!==null?"pointer":"default",fontFamily:"inherit",transition:"all .2s" }}>
              {step < total ? "Next question" : "See my result"}
            </button>
          </div>
        )}

        {/* RESULT */}
        {isResult && result && (
          <PersonalityResult result={result} onClose={onClose}/>
        )}
      </div>
    </div>
  )
}

function PersonalityResult({ result, onClose }) {
  const arch = result.archetype
  const [tab, setTab] = useState("overview") // overview | scenarios | blindspot

  const DIM_LABELS = {
    sg:  { security:"Security-focused", balanced:"Security-leaning", growth:"Growth-focused" },
    pf:  { present:"Present-focused",   balanced:"Balanced",         future:"Future-focused" },
    si:  { systematic:"Systematic",     balanced:"Balanced",         intuitive:"Intuitive" },
    ic:  { independent:"Independent",   collaborative:"Collaborative" },
    as_: { scarcity:"Scarcity mindset", balanced:"Balanced",         abundance:"Abundance mindset" },
    sc:  { simplicity:"Simplicity-first",complexity:"Complexity-comfortable" },
    er:  { cautious:"Cautious",         balanced:"Balanced",         adventurous:"Adventurous" },
  }
  const dims = result.dimensions
  const DIM_TIPS = {
    "Risk appetite":      "How comfortable you are with investment risk and potential losses. High = comfortable seeing portfolio drops. Low = prefers certainty.",
    "Time horizon":       "Whether you naturally think short-term (next few months) or long-term (decades). Affects how you should invest your pension and savings.",
    "Decision style":     "Data-driven = researches thoroughly before deciding. Intuitive = trusts gut feel and moves faster. Neither is better, both have blind spots.",
    "Advice preference":  "Whether you prefer to decide independently or value trusted guidance. Affects whether a financial adviser would genuinely help you.",
    "Money mindset":      "Abundance = believes there will always be enough. Scarcity-cautious = carries background worry about money running out, even when it won't.",
    "Complexity comfort": "Simplicity = wants one account, one plan, no fuss. Loves detail = enjoys understanding every layer of a financial product or portfolio.",
  }
  const [activeTip, setActiveTip] = useState(null)
  const dimRows = [
    { key:"Risk appetite",        val: dims.sg==="growth"?"High":dims.sg==="security"?"Low":"Medium",          color: dims.sg==="growth"?T.teal:dims.sg==="security"?T.amber:T.muted },
    { key:"Time horizon",         val: dims.pf==="future"?"Long-term":"Short-term",                             color: dims.pf==="future"?T.teal:T.amber },
    { key:"Decision style",       val: dims.si==="systematic"?"Data-driven":"Intuitive",                        color: T.purple },
    { key:"Advice preference",    val: dims.ic==="collaborative"?"Seeks guidance":"Self-directed",              color: T.blue },
    { key:"Money mindset",        val: dims.as_==="abundance"?"Abundance":"Scarcity-cautious",                  color: dims.as_==="abundance"?T.green:T.red },
    { key:"Complexity comfort",   val: dims.sc==="complexity"?"Loves detail":"Wants simplicity",               color: T.muted },
  ]

  return (
    <div style={{ animation:"quizIn .3s ease" }}>
      {/* Archetype hero */}
      <div style={{ textAlign:"center",marginBottom:28 }}>
        <div style={{ width:80,height:80,borderRadius:24,background:`${arch.color}20`,border:`2px solid ${arch.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 16px",boxShadow:`0 0 40px ${arch.color}30` }}>
          {arch.emoji}
        </div>
        <p style={{ color:arch.color,fontWeight:700,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>Your money personality</p>
        <h2 style={{ color:T.white,fontWeight:900,fontSize:28,marginBottom:8 }}>{arch.name}</h2>
        <p style={{ color:arch.headline?arch.color:T.muted,fontWeight:700,fontSize:15,marginBottom:14 }}>{arch.headline}</p>
        <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.7 }}>{arch.summary}</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex",gap:6,marginBottom:20,background:T.surface,borderRadius:12,padding:4 }}>
        {[["overview","Overview"],["scenarios","What this means"],["blindspot","Blind spot"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ flex:1,background:tab===id?T.card:"transparent",border:`1px solid ${tab===id?T.border:"transparent"}`,borderRadius:9,padding:"8px 4px",cursor:"pointer",fontFamily:"inherit",color:tab===id?T.white:T.muted,fontWeight:tab===id?700:500,fontSize:12,transition:"all .15s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab==="overview" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>Your financial profile</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:20 }}>
            {dimRows.map(d=>(
              <div key={d.key} style={{ background:T.card,border:`1px solid ${activeTip===d.key?arch.color+"50":T.border}`,borderRadius:10,padding:"10px 14px",transition:"border .15s" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <p style={{ color:"#8FA3BE",fontSize:13 }}>{d.key}</p>
                    <button onClick={()=>setActiveTip(activeTip===d.key?null:d.key)}
                      style={{ background:`${arch.color}20`,border:`1px solid ${arch.color}30`,borderRadius:"50%",width:16,height:16,cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:800,color:arch.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>?</button>
                  </div>
                  <p style={{ color:d.color,fontWeight:700,fontSize:13 }}>{d.val}</p>
                </div>
                {activeTip===d.key && (
                  <p className="ls-fadein" style={{ color:"#E2EAF6",fontSize:12,lineHeight:1.55,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}` }}>{DIM_TIPS[d.key]}</p>
                )}
              </div>
            ))}
          </div>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>Strengths</p>
          <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
            {(arch.traits||[]).map((t,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
                <span style={{ color:arch.color,fontSize:14,marginTop:1 }}>✓</span>
                <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenarios tab */}
      {tab==="scenarios" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <p style={{ color:"#D8E8F8",fontSize:14,lineHeight:1.65,marginBottom:16 }}>Based on your profile, here is how you are likely to think and act with money:</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {(arch.scenarios||[]).map((s,i)=>(
              <div key={i} style={{ background:T.card,border:`1px solid ${arch.color}25`,borderRadius:12,padding:"13px 15px",display:"flex",gap:10,alignItems:"flex-start" }}>
                <span style={{ fontSize:15,marginTop:1 }}>→</span>
                <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.55 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blind spot tab */}
      {tab==="blindspot" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <div style={{ background:T.amberDim,border:`1.5px solid ${T.amberBorder}`,borderRadius:16,padding:"18px",marginBottom:20 }}>
            <p style={{ color:T.amber,fontWeight:700,fontSize:13,marginBottom:8 }}>⚠ Your main blind spot</p>
            <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.65 }}>{arch.blind_spot}</p>
          </div>
          <div style={{ background:`${arch.color}12`,border:`1.5px solid ${arch.color}30`,borderRadius:16,padding:"18px" }}>
            <p style={{ color:arch.color,fontWeight:700,fontSize:13,marginBottom:8 }}>→ Your next move</p>
            <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.65 }}>{arch.next_step}</p>
          </div>
        </div>
      )}

      <button onClick={onClose} style={{ width:"100%",marginTop:28,background:`linear-gradient(135deg,${T.teal},${T.purple})`,border:"none",borderRadius:16,padding:"15px",color:T.bg,fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>
        Back to dashboard
      </button>
    </div>
  )
}

function MoneyPersonalityCard({ state, save, onOpenQuiz }) {
  // Prefer quiz result; fallback to behavioural inference
  const quizResult = state.profile?.personalityResult
  const p = quizResult || calcPersonality(state)
  const arch = p.archetype
  const [showMode, setShowMode] = useState(false)
  const mode = PRIORITY_MODES.find(m=>m.id===(state.profile?.mode||"grow"))||PRIORITY_MODES[0]

  const DIM_LABELS = {
    mindset:   { security:"Security-focused", growth:"Growth-focused",   freedom:"Freedom-focused" },
    behaviour: { starter:"Starter",           saver:"Saver",             builder:"Builder",         investor:"Investor" },
    risk:      { cautious:"Cautious",          balanced:"Balanced",       adventurous:"Adventurous" },
  }

  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ background:T.card,border:`1.5px solid ${arch.color}35`,borderRadius:20,padding:"22px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,right:0,width:120,height:120,background:`radial-gradient(circle at 100% 0%,${arch.color}15,transparent 70%)`,pointerEvents:"none" }}/>

        <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:16,position:"relative" }}>
          <div style={{ width:56,height:56,borderRadius:16,background:`${arch.color}20`,border:`2px solid ${arch.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0 }}>
            {arch.emoji}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4 }}>Your money personality</p>
            <p style={{ color:T.white,fontWeight:900,fontSize:20,marginBottom:4 }}>{arch.name}</p>
            <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.55 }}>{arch.summary}</p>
          </div>
        </div>

        {/* 3 dimensions */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16 }}>
          {[
            { label:"Mindset",  val:DIM_LABELS.mindset[p.mindset],   color:T.teal },
            { label:"Behaviour",val:DIM_LABELS.behaviour[p.behaviour],color:T.purple },
            { label:"Risk",     val:DIM_LABELS.risk[p.risk],          color:T.amber },
          ].map(d=>(
            <div key={d.label} style={{ background:T.surface,borderRadius:12,padding:"10px 10px" }}>
              <p style={{ color:"#8FA3BE",fontSize:10,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:3 }}>{d.label}</p>
              <p style={{ color:d.color,fontWeight:800,fontSize:12 }}>{d.val}</p>
            </div>
          ))}
        </div>

        {/* Locked insights */}
        <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:14 }}>
          <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10 }}>Deeper insights</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {PERSONALITY_LOCKED.map(l=>{
              const done = l.check(state)
              return (
                <div key={l.id} style={{ display:"flex",alignItems:"center",gap:10,background:done?`${arch.color}10`:T.faint,borderRadius:10,padding:"10px 12px",border:`1px solid ${done?arch.color+"30":T.border}` }}>
                  <span style={{ fontSize:16,flexShrink:0 }}>{l.icon}</span>
                  <p style={{ color:done?T.white:"#8FA3BE",fontWeight:done?700:500,fontSize:13,flex:1 }}>{l.label}</p>
                  {done
                    ? <span style={{ color:arch.color,fontSize:11,fontWeight:700 }}>Unlocked ✓</span>
                    : <span style={{ color:"#8FA3BE",fontSize:11 }}>{l.unlock}</span>
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mode selector */}
      {/* Retake / view result buttons */}
      <div style={{ display:"flex",gap:8,marginBottom:8 }}>
        {quizResult
          ? <button onClick={onOpenQuiz} style={{ flex:1,background:`${arch.color}15`,border:`1px solid ${arch.color}35`,borderRadius:10,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",color:arch.color,fontWeight:700,fontSize:12 }}>View full result →</button>
          : <button onClick={onOpenQuiz} style={{ flex:1,background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:10,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",color:T.purple,fontWeight:700,fontSize:12 }}>Take the quiz →</button>
        }
      </div>

      <div style={{ marginTop:4 }}>
        <button onClick={()=>setShowMode(v=>!v)}
          style={{ width:"100%",background:T.card,border:`1px solid ${mode.border}`,borderRadius:14,padding:"13px 18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:18 }}>{mode.icon}</span>
            <div style={{ textAlign:"left" }}>
              <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:1 }}>Your focus mode</p>
              <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{mode.label}</p>
            </div>
          </div>
          <p style={{ color:mode.color,fontSize:12,fontWeight:700 }}>Change</p>
        </button>

        {showMode && (
          <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px",marginTop:8 }}>
            <p style={{ color:"#E2EAF6",fontSize:13,marginBottom:12,fontWeight:500 }}>What do you want LifeSmart to focus on?</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {PRIORITY_MODES.map(m=>{
                const sel = m.id===(state.profile?.mode||"grow")
                return (
                  <button key={m.id} onClick={()=>{ save({...state,profile:{...state.profile,mode:m.id}}); setShowMode(false) }}
                    style={{ background:sel?m.dim:T.faint,border:`1.5px solid ${sel?m.color:T.border}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left" }}>
                    <span style={{ fontSize:20 }}>{m.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ color:sel?T.white:"#E2EAF6",fontWeight:700,fontSize:14 }}>{m.label}</p>
                      <p style={{ color:sel?"#E2EAF6":"#8FA3BE",fontSize:12 }}>{m.sub}</p>
                    </div>
                    {sel && <Check size={16} color={m.color}/>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MeTab() {
  const { state, reset, save, toast } = useApp()
  const [showQuiz,   setShowQuiz]   = useState(false)
  const [showResult, setShowResult] = useState(false)
  const quizResult = state.profile?.personalityResult
  if(showQuiz)   return <PersonalityQuiz state={state} save={save} onClose={()=>setShowQuiz(false)}/>
  if(showResult && quizResult) return <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:300,overflowY:"auto" }}>
    <div style={{ padding:"24px 20px 60px",maxWidth:520,margin:"0 auto" }}>
      <button onClick={()=>setShowResult(false)} style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:20,padding:4,marginBottom:16 }}>←</button>
      <PersonalityResult result={quizResult} onClose={()=>setShowResult(false)}/>
    </div>
  </div>
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
            {(()=>{ const ar = state.profile?.personalityResult?.archetype; return (
            <div style={{ width:60,height:60,borderRadius:18,background:ar?`${ar.color}20`:T.tealDim,border:`2px solid ${ar?ar.color:T.teal}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:`0 0 24px ${ar?ar.color:T.teal}30` }}>
              {ar?ar.emoji:"🚀"}
            </div>
            )})()}
            <div style={{ flex:1 }}>
              <p style={{ color:T.white,fontWeight:900,fontSize:20,marginBottom:2 }}>{state.profile.name||"Your profile"}</p>
              {state.profile.age && <p style={{ color:"#E2EAF6",fontSize:13,marginBottom:4 }}>Age {state.profile.age}</p>}
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:14 }}>{lvl.emoji}</span>
                <span style={{ color:"#E2EAF6",fontSize:13 }}>Level {lvl.level} {lvl.label}</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:T.teal,fontWeight:900,fontSize:24 }}>{xp}</p>
              <p style={{ color:"#8FA3BE",fontSize:12 }}>XP</p>
            </div>
          </div>
          {nextLvl && (
            <div>
              <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:5 }}>
                <div style={{ width:`${pctToNext}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.tealMid})`,borderRadius:99,transition:"width .8s ease" }}/>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between" }}>
                <span style={{ color:"#8FA3BE",fontSize:12 }}>{xp} XP</span>
                <span style={{ color:"#8FA3BE",fontSize:12 }}>{nextLvl.emoji} {nextLvl.label} at {nextLvl.min} XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
          {[
            { l:"Net worth",  v:fmtK(netWorth),            c:netWorth>=0?T.teal:T.red },
            { l:"Levels",     v:`${(state.completedLevels||[]).length}/9`,      c:T.purple },
            { l:"Badges",     v:`${earned.length}/${BADGES.length}`,            c:T.amber  },
          ].map(k=>(
            <div key={k.l} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",textAlign:"center" }}>
              <p style={{ color:k.c,fontWeight:900,fontSize:20 }}>{k.v}</p>
              <p style={{ color:T.muted,fontSize:11,marginTop:3 }}>{k.l}</p>
            </div>
          ))}
        </div>

        {/* Money Personality Card */}
        <MoneyPersonalityCard state={state} save={save}
          onOpenQuiz={quizResult ? ()=>setShowResult(true) : ()=>setShowQuiz(true)}/>

        {/* Priorities */}
        {priorityGoals.length > 0 && (
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px",marginBottom:16 }}>
            <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Your priorities</p>
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
          <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Level roadmap</p>
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
                    <p style={{ color:"#8FA3BE",fontSize:12 }}>{l.min} XP</p>
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
            <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Badges earned</p>
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
            <p style={{ color:"#6B8CB8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Locked</p>
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

        <p style={{ color:"#8FA3BE",fontSize:12,textAlign:"center",marginTop:16 }}>🔒 Your data stays on your device LifeSmart</p>
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
  const hasNewLesson = (state.completedLevels||[]).length < 9

  const TABS = [
    { icon:Home,       label:"Home",      idx:0 },
    { icon:BookOpen,   label:"Learn",     idx:1, dot:hasNewLesson },
    { icon:BarChart2,  label:"Analytics", idx:2 },
    { icon:User,       label:"Me",        idx:3 },
  ]

  return (
    <nav style={{ background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",height:66,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 32px rgba(0,0,0,.3)" }}>
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
  const CONTENT = [<HomeTab/>, <LearnTab/>, <AnalyticsTab/>, <MeTab/>]

  return (
    <div style={{ height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden" }}>
      {/* Top bar */}
      <header style={{ background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 20px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"relative",zIndex:10,boxShadow:"0 4px 24px rgba(0,0,0,.25)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,rgba(15,191,184,.3),rgba(167,139,250,.3))",border:"1px solid rgba(15,191,184,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>🚀</div>
          <span style={{ color:"#FFFFFF",fontSize:13,fontWeight:800,letterSpacing:2 }}>LIFESMART</span>
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
  useEffect(()=>{
    // Ensure correct mobile viewport, prevents slight zoom-in on mobile
    let meta = document.querySelector('meta[name="viewport"]')
    if(!meta){ meta = document.createElement('meta'); meta.name='viewport'; document.head.appendChild(meta) }
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
  },[])
  return (
    <AppProvider>
      <Router/>
    </AppProvider>
  )
}
