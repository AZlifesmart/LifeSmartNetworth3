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
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes slideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
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
    sub:"Invest, buy a home, clear debt — get a clear plan",
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
      { label:"I contribute the minimum — retirement feels far away", scores:{ present_future:15 } },
      { label:"I contribute what I can but don't maximise",          scores:{ present_future:50 } },
      { label:"I maximise contributions — it is a real priority",    scores:{ present_future:90 } },
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
    sub:"Be honest — which is actually true?",
    options:[
      { label:"I have a clear budget and I follow it",               scores:{ systematic_intuitive:10 } },
      { label:"I have a rough idea and check in occasionally",       scores:{ systematic_intuitive:45 } },
      { label:"I track spending after the fact, loosely",            scores:{ systematic_intuitive:65 } },
      { label:"I do not track — I just know if I am okay",          scores:{ systematic_intuitive:90 } },
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
      { label:"I feel good — I work hard for this",                 scores:{ abundance_scarcity:90 } },
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
      { label:"Rarely — I feel broadly on track",                   scores:{ abundance_scarcity:85 } },
      { label:"Sometimes, depending on my mood",                    scores:{ abundance_scarcity:55 } },
      { label:"Often — I worry I have not done enough",             scores:{ abundance_scarcity:30 } },
      { label:"Almost always — it is a persistent anxiety",         scores:{ abundance_scarcity:10 } },
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
      { label:"Money is safety — having enough lets me stop worrying",  scores:{ security_growth:15, abundance_scarcity:25 } },
      { label:"Money is a tool — I want it working efficiently",        scores:{ security_growth:55, systematic_intuitive:30 } },
      { label:"Money is opportunity — I want to grow it aggressively",  scores:{ security_growth:85, abundance_scarcity:80 } },
      { label:"Money is complicated — I wish I understood it better",   scores:{ abundance_scarcity:30, security_growth:40 } },
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
      summary:"Your core belief is that financial security is freedom. You sleep better when the safety net is full, the bills are covered, and there are no nasty surprises waiting. You are methodical, careful, and consistent — which means you build slowly but you build durably.",
      traits:["Values certainty over upside","Fully funds emergency reserves before investing","Prefers guaranteed returns to market exposure","Tracks spending carefully","Finds financial surprises deeply uncomfortable"],
      scenarios:["You are very likely to keep 6+ months of expenses in cash savings","You probably feel anxious when your bank balance drops below a mental threshold","An IFA offering a cautious managed portfolio would suit you well","The 50/30/20 budgeting rule would feel natural and reassuring to follow","You would choose a lower fixed-rate mortgage over a cheaper variable rate"],
      blind_spot:"Your caution protects you but may cost you significantly in long-term returns. The risk of being too safe is real.",
      next_step:"Consider putting anything above 6 months emergency fund into a low-cost global index fund." },

    "security-future-systematic":    { id:"cultivator",   name:"The Cultivator",   emoji:"🌱", color:"#0FBFB8",
      headline:"Building carefully, for the long run.",
      summary:"You have patience and discipline — a rare combination. You think ahead, contribute consistently, and feel most secure when you know the future is being taken care of. You may not be the most adventurous investor but you are one of the most reliable.",
      traits:["Consistent long-term saver and investor","Prioritises pension and future security","Prefers structured plans over gut feel","Values financial stability deeply","Methodical — you follow through on financial commitments"],
      scenarios:["You are likely already contributing regularly to a pension or ISA","A financial adviser who provides a clear structured long-term plan would suit you","You would benefit from automated contributions so you never have to decide each month","You probably use a spreadsheet or budgeting app","You are uncomfortable with debt and likely pay more than the minimum"],
      blind_spot:"Your focus on security can mean you under-invest in growth assets. Your future self would likely be fine with more equity exposure.",
      next_step:"Review whether your pension contribution rate is genuinely maximising your employer match." },

    "growth-future-intuitive":       { id:"accelerator",  name:"The Accelerator",  emoji:"🚀", color:"#0FBFB8",
      headline:"Long game. High conviction.",
      summary:"You think in decades. Short-term noise does not worry you — you see market drops as opportunities and compound growth as the most powerful force in finance. You move decisively and back yourself. Your risk is moving fast without building proper foundations underneath.",
      traits:["Comfortable with investment volatility","Thinks in long timeframes","Makes financial decisions with confidence","Attracted to growth assets and investment opportunities","Less focused on day-to-day spending tracking"],
      scenarios:["You have or are actively considering a Stocks and Shares ISA or self-invested pension","You would consider individual stocks or thematic ETFs as well as index funds","You are unlikely to want a financial adviser telling you what to do — but a good one as a sounding board could add real value","During market crashes you either hold firm or buy more","You find detailed budgeting constraining but probably have a strong income-to-investment ratio"],
      blind_spot:"Your conviction is a strength but can lead to concentrated positions or skipping fundamentals like wills, insurance, or an adequate emergency fund.",
      next_step:"Check your emergency fund is 3 months covered before adding more to investments." },

    "growth-future-systematic":      { id:"navigator",    name:"The Navigator",    emoji:"🧭", color:"#A78BFA",
      headline:"Methodical. Growth-focused. In control.",
      summary:"You have the rare combination of growth ambition and systematic discipline. You research before you act, build structured plans, and then actually follow through. This makes you one of the most effective personal finance profiles — the main risk is over-engineering at the expense of action.",
      traits:["Research-led investor","Clear financial goals with plans attached","Comfortable with risk when it is well understood","Tracks net worth and financial metrics regularly","Balances short-term structure with long-term growth thinking"],
      scenarios:["You probably compare ISA platforms before switching and have read about index funds vs active management","You would get real value from a detailed financial plan produced by an IFA","You are the type of person who finds this quiz interesting rather than annoying","You likely already track your net worth or are attracted to doing so","You balance lifestyle spending with serious long-term saving"],
      blind_spot:"Analysis paralysis is your main risk. You can research indefinitely when taking a reasonable action earlier would have been better.",
      next_step:"Pick one financial goal and set an automated monthly contribution towards it this week." },

    "growth-present-intuitive":      { id:"grower",       name:"The Grower",       emoji:"⚡", color:"#F59E0B",
      headline:"Momentum, instinct, opportunity.",
      summary:"You are entrepreneurial with money. You back yourself, spot opportunities, and are not afraid to act. You live well now and want to grow your wealth too. The tension in your profile is between enjoying the present and building for the future — you are working on getting the balance right.",
      traits:["Acts on financial instinct rather than lengthy research","Enjoys the present while also thinking about growth","Comfortable with risk and uncertainty","Attracted to investment opportunities and new financial tools","Less likely to follow rigid budgets — prefers to earn more"],
      scenarios:["You are likely interested in or already have exposure to a range of investments including possibly crypto or individual stocks","You probably spend generously on experiences and lifestyle and feel broadly fine about it","A financial coach rather than a traditional IFA might suit you better","You would benefit from automating your savings so they happen before you can spend","You may have several financial accounts across different apps and platforms"],
      blind_spot:"Without structure, income can disappear into lifestyle even at high earning levels. Automating savings removes this risk.",
      next_step:"Set up an automated transfer to a Stocks and Shares ISA on payday before spending decisions happen." },

    "security-future-intuitive":     { id:"architect",    name:"The Architect",    emoji:"🏗️", color:"#60A5FA",
      headline:"Strong foundations. Deep knowledge.",
      summary:"You have done the reading. You understand pensions, tax wrappers, compound interest, and the mechanics of personal finance — often better than people earning far more than you. Your challenge is that knowledge does not always translate into action. You can over-analyse or wait for the perfect moment.",
      traits:["High financial literacy","Security-focused but intellectually curious about growth","Likely researches financial products in depth before choosing","Understands the importance of the long game","Can be slowed by a desire for certainty before acting"],
      scenarios:["You have probably compared multiple ISA providers or pension platforms","You know what a SIPP is and have considered one","You would find real value in a financial adviser but would interrogate their recommendations rigorously","You are drawn to detailed financial models and projections","You understand the tax efficiency of pensions better than most"],
      blind_spot:"Knowledge without action is just expensive inaction. The perfect plan started late loses to the good plan started now.",
      next_step:"Identify the one financial decision you have been researching for more than 3 months and make it this month." },

    "freedom-present-intuitive":     { id:"opportunist",  name:"The Opportunist",  emoji:"🌊", color:"#F59E0B",
      headline:"Bold. Fast-moving. Opportunity-first.",
      summary:"You see financial freedom as the goal and you are willing to move decisively to get there. You are not especially interested in rules or conventional wisdom — you back your own judgement. The risk is that ambition without foundation can leave gaps that become expensive later.",
      traits:["High confidence in financial decision-making","Moves quickly when an opportunity feels right","Less attached to conventional financial planning","Values financial independence and optionality","Can underestimate the importance of boring fundamentals"],
      scenarios:["You have likely made at least one significant financial move others would consider bold","You are attracted to investments with high upside potential","You find traditional financial planning advice cautious to the point of being unhelpful","You would benefit most from a financial adviser who challenges you rather than validates you","Your emergency fund may not be fully funded because the money feels better deployed elsewhere"],
      blind_spot:"A single bad financial decision without adequate foundations underneath can undo years of bold gains. Foundations are not boring — they are leverage.",
      next_step:"Check: do you have 3 months expenses in accessible cash? If not, build that first." },

    "freedom-present-systematic":    { id:"learner",      name:"The Learner",      emoji:"💡", color:"#A78BFA",
      headline:"Curious. Growing. Getting started.",
      summary:"You are building your financial foundations and you are doing it with self-awareness, which puts you ahead of most people who never examine their money relationship at all. You are at the most important stage — the habits you build now will compound for decades.",
      traits:["Open to learning and improving financial knowledge","May feel behind peers financially — though often this is not true","Values simplicity and clear guidance over complexity","Wants a plan but is not sure where to start","Responds well to encouragement and small wins"],
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
          <div style={{ display:"flex",alignItems:"center",gap:5 }}><Lock size={11} color={T.subtle}/><span style={{ color:"#7A8FA8",fontSize:12 }}>Locked</span></div>
        </div>
      </div>
      <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6,marginBottom:14 }}>{description}</p>
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
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6,fontWeight:500 }}>{text}</p>
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

  if(screen==="welcome")   return <WelcomeScreen  onNext={(mode)=>{ save({...state,profile:{...state.profile,mode:mode||"grow"}}); setScreen("about") }} />
  if(screen==="about")     return <AboutScreen    name={name} setName={setName} age={age} setAge={setAge} onNext={()=>setScreen("greeting")} onBack={()=>setScreen("welcome")} />
  if(screen==="greeting")  return <GreetingScreen name={name} onNext={()=>setScreen("assets")} onBack={()=>setScreen("about")} />
  if(screen==="assets")    return <AssetChecklistScreen values={assets} setValues={setAssets} onNext={()=>setScreen("debts")} onBack={()=>setScreen("greeting")} />
  if(screen==="debts")     return <DebtChecklistScreen values={debts} setValues={setDebts} assets={assets} age={age} onNext={()=>setScreen("income")} onBack={()=>setScreen("assets")} />
  if(screen==="income")    return <IncomeOnboardScreen income={income} setIncome={setIncome} onNext={()=>setScreen("spending")} onBack={()=>setScreen("debts")} />
  if(screen==="spending")  return <SpendingOnboardScreen spending={spending} setSpending={setSpending} income={income} onNext={()=>setScreen("wow")} onBack={()=>setScreen("income")} />
  if(screen==="wow")       return <WowScreen assets={assets} debts={debts} income={income} spending={spending} name={name} onFinish={finishOnboarding} />
  return null
}

/* ── Welcome Brilliant-inspired witty onboarding flow ─────────── */
const WELCOME_STEPS = [
  {
    id: "nw_question",
    headline: "What's your net worth?",
    sub: "Your net worth is everything you own, minus everything you owe. It's the single number that tells you your true financial position. Do you know yours?",
    choices: [
      { id:"yes",   label:"Yes, I track it",          response:"Brilliant. Let's sharpen it." },
      { id:"rough", label:"Roughly, maybe",            response:"Let's make it exact." },
      { id:"no",    label:"Honestly, no idea",         response:"Most people don't. That changes right now." },
    ],
  },
  {
    id: "why_it_matters",
    isInfoSlide: true,
    headline: "Here is what knowing your net worth does.",
    bullets: [
      { icon:"📈", title:"People who track it build 4x more wealth", body:"Not because they earn more. Because measuring creates better decisions, automatically." },
      { icon:"🔮", title:"See exactly where you will be at age 70", body:"Based on what you have today. Real numbers, not guesses." },
      { icon:"🎯", title:"A plan built around your actual situation", body:"Goals, lessons and insights matched to where you are right now, not some generic template." },
    ],
  },
  {
    id: "situation",
    headline: null,
    sub: "Quick one. Which best describes you right now?",
    choices: [
      { id:"starting", label:"Just getting started with money",          response:"Perfect time to start. The earlier, the better." },
      { id:"building", label:"Got some savings and some debt",           response:"The messy middle. We will bring total clarity." },
      { id:"growing",  label:"Investing and building steadily",          response:"Let's make sure that growth is optimised." },
      { id:"sorted",   label:"Pretty sorted, want to go further",       response:"Good. Let's find the gaps you might be missing." },
    ],
  },
  {
    id: "mode",
    isModeSelect: true,
    headline: "What matters most to you right now?",
    sub: "This shapes how LifeSmart works for you. You can always change it later.",
  },
  {
    id: "ready",
    isFinal: true,
    headline: null,
    sub: "Your full financial picture takes about 3 minutes to build.",
    finalCards: [
      { icon:"📊", title:"Your net worth today", body:"The real number. Assets minus debts. Updated whenever you want." },
      { icon:"🚀", title:"A projection to age 70", body:"See how your wealth grows with conservative and optimistic paths." },
      { icon:"🎯", title:"Lessons built for you", body:"Short, clear, actionable. Matched to your goals and situation." },
    ],
  }
]

const SITUATION_RESPONSES = {
  starting: "Perfect time to start. The earlier, the better.",
  building: "The messy middle. We will bring total clarity.",
  growing:  "Let's make sure that growth is optimised.",
  sorted:   "Good. Let's find the gaps you might be missing.",
}

function WelcomeScreen({ onNext }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [responses, setResponses] = useState({})
  const [exiting, setExiting] = useState(false)

  const step = WELCOME_STEPS[stepIdx]
  const totalSteps = WELCOME_STEPS.length
  const progress = (stepIdx / (totalSteps - 1)) * 100

  function getHeadline() {
    if(step.headline) return step.headline
    if(step.id === "situation") {
      const nwChoice = WELCOME_STEPS[0].choices.find(c=>c.id===responses.nw_question)
      return nwChoice?.response || "Good."
    }
    if(step.id === "ready") {
      const selMode = PRIORITY_MODES.find(m=>m.id===responses.mode)
      return selMode ? selMode.tagline("") || "Let's build your picture." : "Let's build your picture."
    }
    return ""
  }

  function advance() {
    if(step.isFinal) { onNext(responses.mode||"grow"); return }
    const needsChoice = step.choices && !step.isModeSelect
    if(needsChoice && !selected) return
    if(step.isModeSelect && !selected) return
    const newResponses = { ...responses, [step.id]: selected }
    setResponses(newResponses)
    setExiting(true)
    setTimeout(()=>{
      setStepIdx(i=>i+1)
      setSelected(null)
      setExiting(false)
    }, 160)
  }

  const canContinue = step.isFinal || step.isInfoSlide || !!selected

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden" }}>
      <StarField count={40}/>

      {/* Top bar */}
      <div style={{ position:"relative",display:"flex",alignItems:"center",gap:12,padding:"44px 20px 0",zIndex:1 }}>
        {stepIdx > 0 && (
          <button onClick={()=>{ setStepIdx(i=>i-1); setSelected(null) }}
            style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center",flexShrink:0 }}>
            <ChevronLeft size={20} color={T.white}/>
          </button>
        )}
        <div style={{ flex:1,height:4,background:T.surface,borderRadius:99,overflow:"hidden" }}>
          <div style={{ width:`${progress}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width .4s ease" }}/>
        </div>
        <span style={{ color:T.teal,fontSize:11,fontWeight:700,flexShrink:0 }}>🚀 LifeSmart</span>
      </div>

      {/* Content */}
      <div key={stepIdx} style={{ flex:1,display:"flex",flexDirection:"column",padding:"32px 24px 20px",maxWidth:480,margin:"0 auto",width:"100%" }}>

        <div style={{ marginBottom:24 }}>
          <h1 style={{ color:T.white,fontWeight:900,fontSize:"clamp(22px,5vw,28px)",lineHeight:1.25,marginBottom:10 }}>
            {getHeadline()}
          </h1>
          {step.sub && <p style={{ color:"#CBD5E1",fontSize:15,lineHeight:1.65,fontWeight:500 }}>{step.sub}</p>}
        </div>

        {/* Choice step */}
        {step.choices && !step.isModeSelect && (
          <div style={{ display:"flex",flexDirection:"column",gap:10,flex:1 }}>
            {step.choices.map(c=>{
              const sel = selected===c.id
              return (
                <button key={c.id} onClick={()=>setSelected(c.id)}
                  style={{
                    background: sel ? `linear-gradient(135deg,${T.tealDim},${T.purpleDim})` : T.card,
                    border: `2px solid ${sel ? T.teal : T.border}`,
                    borderRadius:16, padding:"15px 20px",
                    color: sel ? T.white : "#CBD5E1",
                    fontWeight: sel ? 700 : 500,
                    fontSize:15, cursor:"pointer",
                    textAlign:"left", fontFamily:"inherit",
                    transition:"all .15s",
                    boxShadow: sel ? `0 0 20px ${T.teal}25` : "none"
                  }}>
                  {c.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Mode select step */}
        {step.isModeSelect && (
          <div style={{ display:"flex",flexDirection:"column",gap:10,flex:1 }}>
            {PRIORITY_MODES.map(m=>{
              const sel = selected===m.id
              return (
                <button key={m.id} onClick={()=>setSelected(m.id)}
                  style={{
                    background: sel ? `${m.dim}` : T.card,
                    border: `2px solid ${sel ? m.color : T.border}`,
                    borderRadius:16, padding:"16px 20px",
                    cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                    transition:"all .15s",
                    boxShadow: sel ? `0 0 20px ${m.color}25` : "none",
                    display:"flex", alignItems:"center", gap:14
                  }}>
                  <div style={{ width:44,height:44,borderRadius:12,background:sel?`${m.color}25`:`${m.color}12`,border:`1.5px solid ${sel?m.color:m.color+"30"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
                    {m.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:sel?T.white:"#CBD5E1",fontWeight:700,fontSize:15,marginBottom:3 }}>{m.label}</p>
                    <p style={{ color:sel?"#CBD5E1":"#7A8FA8",fontSize:13,lineHeight:1.4 }}>{m.sub}</p>
                  </div>
                  {sel && <div style={{ width:20,height:20,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Check size={12} color={T.bg}/></div>}
                </button>
              )
            })}
          </div>
        )}

        {/* Info slide */}
        {step.isInfoSlide && (
          <div style={{ display:"flex",flexDirection:"column",gap:12,flex:1 }}>
            {step.bullets.map((b,i)=>(
              <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start" }}>
                <span style={{ fontSize:26,flexShrink:0,marginTop:2 }}>{b.icon}</span>
                <div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:4 }}>{b.title}</p>
                  <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.55 }}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Final summary cards */}
        {step.finalCards && (
          <div style={{ display:"flex",flexDirection:"column",gap:10,flex:1 }}>
            {step.finalCards.map((c,i)=>(
              <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start" }}>
                <span style={{ fontSize:24,flexShrink:0,marginTop:2 }}>{c.icon}</span>
                <div>
                  <p style={{ color:T.white,fontWeight:700,fontSize:14,marginBottom:3 }}>{c.title}</p>
                  <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue */}
      <div style={{ position:"relative",padding:"0 24px 48px",maxWidth:480,margin:"0 auto",width:"100%",zIndex:1 }}>
        <button onClick={advance}
          style={{
            width:"100%", padding:"17px",
            background: canContinue ? `linear-gradient(135deg,${T.teal},${T.purple})` : T.surface,
            border:"none", borderRadius:16,
            color: canContinue ? T.bg : T.muted,
            fontWeight:900, fontSize:17,
            cursor: canContinue ? "pointer" : "default",
            fontFamily:"inherit",
            transition:"all .2s",
            opacity: canContinue ? 1 : 0.55,
          }}>
          {step.isFinal ? "Build my financial picture" : "Continue"}
        </button>
        <p style={{ color:"#7A8FA8",fontSize:12,textAlign:"center",marginTop:12 }}>🔒 Private to you. No account needed. Free forever.</p>
      </div>
    </div>
  )
}


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
        <p style={{ color:"#CBD5E1",fontSize:14,marginBottom:32,lineHeight:1.6,textAlign:"center" }}>Just two quick things we use your age to benchmark your journey.</p>

        <div style={{ display:"flex",flexDirection:"column",gap:18,marginBottom:32 }}>
          <Input label="Your first name" value={name} onChange={setName} placeholder="e.g. Jamie"/>
          <Input label="Your age" type="number" value={age} onChange={setAge} placeholder="e.g. 29" min="16" max="80"
            helper="We use this to show you how your numbers compare never judgemental, always useful."/>
        </div>

        <Btn onClick={onNext} disabled={!name||!age}>Let's go, {name||"..."}! →</Btn>
      </div>
    </div>
  )
}

/* ── Greeting personalised bridge ──────────────────────────────── */
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
        <p style={{ color:"#CBD5E1",fontSize:15,marginBottom:28,lineHeight:1.6 }}>
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
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6 }}>
            Everything you <strong style={{ color:T.green }}>own</strong> (home, savings, pension, investments) <strong style={{ color:T.muted }}>minus</strong> everything you <strong style={{ color:T.red }}>owe</strong> (mortgage, loans, credit cards). <strong style={{ color:T.white }}>That's it.</strong>
          </p>
        </div>

        <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:24,textAlign:"center",lineHeight:1.6 }}>
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
        <p style={{ color:"#CBD5E1",fontSize:14,marginBottom:6,lineHeight:1.5 }}>Tap each one. Rough estimates are totally fine.</p>

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
        {!hasAny && <button onClick={onNext} style={{ background:"none",border:"none",color:"#CBD5E1",fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip add later</button>}
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
            <span style={{ padding:"0 10px",color:"#CBD5E1",fontSize:15,fontWeight:700,userSelect:"none" }}>£</span>
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
        <p style={{ color:"#CBD5E1",fontSize:14,marginBottom:6,lineHeight:1.5 }}>Tap what applies. No debt? Great just hit Continue.</p>

        <div style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 14px",marginBottom:22,display:"flex",gap:8,alignItems:"flex-start" }}>
          <span style={{ fontSize:14,flexShrink:0 }}>💡</span>
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>Knowing your debts is the first step to clearing them. We use assumed interest rates you can update them in Track later.</p>
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
              <div><p style={{ color:T.green,fontWeight:800,fontSize:16 }}>{fmtK(totalAssets)}</p><p style={{ color:"#7A8FA8",fontSize:12 }}>Assets</p></div>
              <div style={{ width:1,background:T.border }}/>
              <div><p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:800,fontSize:16 }}>{fmtK(totalDebts)}</p><p style={{ color:"#7A8FA8",fontSize:12 }}>Debts</p></div>
              <div style={{ width:1,background:T.border }}/>
              <div><p style={{ color:netWorth>=0?T.teal:T.red,fontWeight:800,fontSize:16 }}>{fmtK(netWorth)}</p><p style={{ color:"#7A8FA8",fontSize:12 }}>Net worth</p></div>
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
          <span style={{ padding:"0 10px",color:"#CBD5E1",fontSize:15,fontWeight:700,userSelect:"none" }}>£</span>
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
        <p style={{ color:"#CBD5E1",fontSize:15,marginBottom:24,lineHeight:1.6,textAlign:"center" }}>After tax. This powers your surplus and projection calculations.</p>

        <div style={{ marginBottom:20 }}>
          <CurrencyInput label="Monthly take-home pay (after tax)" value={income} onChange={setIncome} placeholder="e.g. 2,800"/>
        </div>

        {/* Helpful context */}
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:28 }}>
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontSize:18 }}>📱</span>
            <p style={{ color:T.white,fontSize:14,lineHeight:1.4,fontWeight:600 }}>Check your banking app or last payslip it's the amount that lands in your account each month.</p>
          </div>
        </div>

        {income > 0 && (
          <div style={{ background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"center" }}>
            <p style={{ color:T.teal,fontWeight:700,fontSize:15 }}>{fmt(income)}/month</p>
            <p style={{ color:"#CBD5E1",fontSize:13,marginTop:2 }}>{fmt(income*12)}/year take-home</p>
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
        <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:20,lineHeight:1.6,textAlign:"center" }}>Everything that goes out. Rent, food, bills, fun the lot.</p>

        <p style={{ color:"#CBD5E1",fontSize:14,marginBottom:10,fontWeight:600 }}>What to include:</p>
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
              <p style={{ color:"#CBD5E1",fontSize:13 }}>{fmt(income)} income − {fmt(spending)} spending</p>
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
            <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>
              That surplus of <strong style={{ color:T.teal }}>{fmt(surplus)}/month</strong> is what builds your net worth. Invested at 7%/yr over 20 years, it could grow to <strong style={{ color:T.teal }}>{fmtK(surplus*12*52.7)}</strong>.
            </p>
          </div>
        )}

        <Btn onClick={onNext} disabled={spending<=0}>Build my picture →</Btn>
        {spending<=0 && <button onClick={onNext} style={{ background:"none",border:"none",color:"#CBD5E1",fontSize:13,cursor:"pointer",width:"100%",padding:"8px",fontFamily:"inherit" }}>Skip add later</button>}
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
    return "You're not behind you just have more runway. Let's use it."
  }

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",position:"relative",overflow:"hidden" }}>
      <StarField count={60}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:300,background:`radial-gradient(ellipse at 50% 0%,${nwPos?T.teal:T.red}18 0%,transparent 70%)`,pointerEvents:"none" }}/>

      <div className="ls-fadein" style={{ position:"relative",textAlign:"center",maxWidth:440,width:"100%" }}>
        <div className="ls-float" style={{ fontSize:64,marginBottom:20 }}>{nwPos?"🚀":"📊"}</div>

        <p style={{ fontSize:12,fontWeight:700,color:T.teal,letterSpacing:2,textTransform:"uppercase",marginBottom:12 }}>
          {name ? `${name}'s financial picture` : "Your financial picture"}
        </p>

        <div className="ls-countup" style={{ marginBottom:12 }}>
          <div style={{ fontSize:"clamp(44px,10vw,68px)",fontWeight:900,lineHeight:1,
            color:nwPos?T.teal:T.red, letterSpacing:-1,
            textShadow:nwPos?`0 0 60px ${T.teal}60`:`0 0 60px ${T.red}40` }}>
            {fmt(netWorth)}
          </div>
          <p style={{ color:"#CBD5E1",fontSize:15,marginTop:6,fontWeight:700 }}>Net worth</p>
        </div>

        <p style={{ color:"#CBD5E1",fontSize:16,lineHeight:1.7,marginBottom:28,maxWidth:340,margin:"0 auto 28px",fontWeight:500 }}>
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

        {/* Personality teaser */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 20px",marginBottom:24,textAlign:"left" }}>
          <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8 }}>Your money personality</p>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <span style={{ fontSize:32 }}>✨</span>
            <div>
              <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:2 }}>Calculating your profile...</p>
              <p style={{ color:"#CBD5E1",fontSize:13 }}>Based on your figures, we will reveal your money personality type on your dashboard.</p>
            </div>
          </div>
        </div>

        <Btn onClick={onFinish} style={{ fontSize:16,padding:"16px 28px" }}>
          See my full picture
        </Btn>
        <p style={{ color:"#CBD5E1",fontSize:13,marginTop:14 }}>Your personality type, insights and goals are waiting on your dashboard</p>
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
  const [showQuiz, setShowQuiz] = useState(false)

  const mode = PRIORITY_MODES.find(m=>m.id===(profile?.mode||"grow")) || PRIORITY_MODES[0]
  const quizResult = profile?.personalityResult
  const arch = quizResult?.archetype

  const doneSet = new Set(completedLessons||[])
  const hasPriorities = (priorityGoals||[]).length > 0
  const priorityLessonId = (priorityGoals||[]).map(id => PRIORITY_GOALS.find(g=>g.id===id)?.lesson).find(lid=>lid&&!doneSet.has(lid))
  const modePrimaryLesson = mode.primaryLesson
  const recLessonId = priorityLessonId || (doneSet.has(modePrimaryLesson)?null:modePrimaryLesson) || LESSONS.find(l=>!doneSet.has(l.id))?.id
  const recLesson = LESSONS.find(l=>l.id===recLessonId)

  // Action checklist
  const hasNumbers  = totalAssets > 0 || totalDebts > 0
  const hasSpendInc = hasSpending && hasIncome
  const lessonsCount = (completedLessons||[]).length
  const actions = [
    { id:"numbers", done: hasNumbers && hasSpendInc,  emoji:"📊", label:"Add your assets, debts, income and spending", sub:"Takes 5 minutes — gives you your real financial picture", onClick:()=>setTab(2) },
    { id:"lessons", done: lessonsCount >= 3,           emoji:"📚", label:"Complete 3 lessons",                           sub:`${lessonsCount}/3 done — builds the knowledge that changes decisions`, onClick:()=>setTab(1) },
    { id:"quiz",    done: !!quizResult,                emoji:"🧠", label:"Discover your money personality",             sub:"4-minute quiz — reveals your archetype and blind spots",  onClick:()=>setShowQuiz(true) },
  ]
  const allDone = actions.every(a=>a.done)

  if(showQuiz) return <PersonalityQuiz state={state} save={save} onClose={()=>setShowQuiz(false)}/>

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>

      {/* ── Hero strip ──────────────────────────────────────────────── */}
      <div style={{ position:"relative",background:`linear-gradient(180deg,${mode.color}14 0%,transparent 100%)`,padding:"28px 20px 20px" }}>
        <StarField count={10}/>
        <div style={{ position:"relative",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div>
              <p style={{ fontSize:11,fontWeight:700,color:mode.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>
                {mode.tagline(profile.name||"")}
              </p>
              <div style={{ fontSize:"clamp(34px,8vw,52px)",fontWeight:900,lineHeight:1,
                color:netWorth>=0?T.teal:T.red,
                textShadow:netWorth>=0?`0 0 40px ${T.teal}40`:`0 0 40px ${T.red}30` }}>
                {fmt(netWorth)}
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end" }}>
              <button onClick={()=>setShowEdit(!showEdit)}
                style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",color:T.muted,fontSize:12,fontWeight:700,fontFamily:"inherit" }}>
                Update ✎
              </button>
              {/* Personality badge */}
              {arch && (
                <button onClick={()=>setShowQuiz(true)}
                  style={{ background:`${arch.color}18`,border:`1px solid ${arch.color}40`,borderRadius:10,padding:"6px 10px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5 }}>
                  <span style={{ fontSize:14 }}>{arch.emoji}</span>
                  <span style={{ color:arch.color,fontSize:11,fontWeight:700 }}>{arch.name}</span>
                </button>
              )}
            </div>
          </div>

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
                  <p style={{ color:"#7A8FA8",fontSize:12 }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {showEdit && (
            <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginTop:14 }}>
              <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5,marginBottom:10 }}>
                Update your numbers in <strong style={{ color:T.white }}>Track</strong>. Use <strong style={{ color:T.white }}>Goals</strong> to set targets.
              </p>
              <div style={{ display:"flex",gap:10 }}>
                <button onClick={()=>{setTab(2);setShowEdit(false)}} style={{ flex:1,background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:8,padding:"8px 12px",color:T.teal,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Go to Track →</button>
                <button onClick={()=>{ if(window.confirm("Restart from scratch? All data will be cleared.")) reset() }}
                  style={{ background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>🔄 Restart</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 18px" }}>

        {/* ── Track + Learn dual theme ────────────────────────────── */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14,marginBottom:20 }}>
          <button onClick={()=>setTab(2)} style={{ background:T.card,border:`1.5px solid ${T.tealBorder}`,borderRadius:14,padding:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left" }}>
            <div style={{ fontSize:22,marginBottom:6 }}>📊</div>
            <p style={{ color:T.teal,fontWeight:800,fontSize:14,marginBottom:3 }}>Track</p>
            <p style={{ color:"#7A8FA8",fontSize:11,lineHeight:1.4 }}>Update numbers monthly. 10 minutes keeps your picture accurate.</p>
          </button>
          <button onClick={()=>setTab(1)} style={{ background:T.card,border:`1.5px solid ${T.purpleBorder}`,borderRadius:14,padding:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left" }}>
            <div style={{ fontSize:22,marginBottom:6 }}>💡</div>
            <p style={{ color:T.purple,fontWeight:800,fontSize:14,marginBottom:3 }}>Learn</p>
            <p style={{ color:"#7A8FA8",fontSize:11,lineHeight:1.4 }}>Complete lessons to optimise every financial decision you make.</p>
          </button>
        </div>

        {/* ── Action checklist ────────────────────────────────────── */}
        {!allDone && (
          <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px",marginBottom:20 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Getting started</p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {actions.map(a=>(
                <button key={a.id} onClick={a.done ? undefined : a.onClick}
                  style={{ display:"flex",alignItems:"flex-start",gap:12,background:a.done?`${T.teal}08`:T.surface,border:`1px solid ${a.done?T.tealBorder:T.border}`,borderRadius:12,padding:"12px 14px",cursor:a.done?"default":"pointer",fontFamily:"inherit",textAlign:"left" }}>
                  <div style={{ width:26,height:26,borderRadius:"50%",flexShrink:0,background:a.done?T.teal:T.surface,border:`2px solid ${a.done?T.teal:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1 }}>
                    {a.done
                      ? <span style={{ color:T.bg,fontSize:13,fontWeight:900 }}>✓</span>
                      : <span style={{ fontSize:13 }}>{a.emoji}</span>
                    }
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:a.done?T.muted:T.white,fontWeight:700,fontSize:13,marginBottom:2,textDecoration:a.done?"line-through":"none" }}>{a.label}</p>
                    <p style={{ color:"#7A8FA8",fontSize:11,lineHeight:1.4 }}>{a.sub}</p>
                  </div>
                  {!a.done && <span style={{ color:T.teal,fontSize:12,fontWeight:700,flexShrink:0,marginTop:3 }}>→</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Projection ──────────────────────────────────────────── */}
        {netWorth!==0 && hasIncome && (
          <div style={{ marginBottom:20 }}>
            <ProjectionHeroCard nw={netWorth} surplus={surplus} age={profile?.age} />
          </div>
        )}
        {(netWorth===0 || !hasIncome) && (
          <div style={{ marginBottom:20 }}>
            <LockedCard icon="🔮" title="Your wealth at 70 projection locked"
              description="Add your assets and income to unlock your personalised wealth projection."
              unlock="Complete setup in Track →" onUnlock={()=>setTab(2)}/>
          </div>
        )}

        {/* ── Personality quiz prompt (if not done) ───────────────── */}
        {!quizResult && (
          <button onClick={()=>setShowQuiz(true)}
            style={{ width:"100%",background:`linear-gradient(135deg,${T.purpleDim},${T.tealDim})`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:18,padding:"20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:20,display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:52,height:52,borderRadius:16,background:`${T.purple}20`,border:`1.5px solid ${T.purpleBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>
              🧠
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:T.purple,fontWeight:700,fontSize:11,letterSpacing:.5,textTransform:"uppercase",marginBottom:4 }}>4 minute quiz</p>
              <p style={{ color:T.white,fontWeight:800,fontSize:15,marginBottom:3 }}>Discover your money personality</p>
              <p style={{ color:"#7A8FA8",fontSize:12 }}>Find out your archetype, blind spots and what they mean</p>
            </div>
            <div style={{ background:T.purple,borderRadius:99,padding:"6px 14px",flexShrink:0 }}>
              <p style={{ color:T.bg,fontSize:12,fontWeight:800 }}>Start</p>
            </div>
          </button>
        )}

        {/* ── Personality result card (if done) ───────────────────── */}
        {quizResult && arch && (
          <button onClick={()=>setShowQuiz(true)}
            style={{ width:"100%",background:`${arch.color}12`,border:`1.5px solid ${arch.color}35`,borderRadius:18,padding:"16px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:20,display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:`${arch.color}20`,border:`1.5px solid ${arch.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
              {arch.emoji}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:arch.color,fontWeight:700,fontSize:11,letterSpacing:.5,textTransform:"uppercase",marginBottom:3 }}>Your money personality</p>
              <p style={{ color:T.white,fontWeight:800,fontSize:15,marginBottom:2 }}>{arch.name}</p>
              <p style={{ color:"#7A8FA8",fontSize:12 }}>{arch.headline}</p>
            </div>
            <span style={{ color:arch.color,fontSize:12,fontWeight:700 }}>View →</span>
          </button>
        )}

        {/* ── Priority goals ──────────────────────────────────────── */}
        {!hasPriorities && (
          <GoalPickerSection state={state} save={save} toast={toast}/>
        )}
        {hasPriorities && (
          <>
            <GoalLinkedLessons priorityGoals={priorityGoals} completedLessons={state.completedLessons||[]} setTab={setTab}/>
            <HomeGoalsSection goals={goals} surplus={surplus} setTab={setTab} save={save} state={state} toast={toast} priorityGoals={priorityGoals}/>
          </>
        )}

        {/* ── Insights label ──────────────────────────────────────── */}
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,marginTop:4 }}>Your top insights</p>

        <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:24 }}>

          {/* 1. FIRE number */}
          {fireNumber ? (
            <InsightCard icon="🔥" title="Your financial freedom number" sub="The amount you need to never have to work again" iconBg={T.amberDim} iconBorder={T.amberBorder}
              infoText="Based on the 4% rule: if your invested wealth is 25x your annual spending, you can withdraw 4% per year forever without running out.">
              <p style={{ color:T.amber,fontWeight:900,fontSize:36,marginBottom:4,lineHeight:1 }}>{fmtK(fireNumber)}</p>
              <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:10 }}>25x your annual spending of {fmt(spending.monthly*12)}</p>
              {bk.wealthBuilders > 0 ? (
                <>
                  <div style={{ background:T.surface,borderRadius:99,height:10,overflow:"hidden",marginBottom:8 }}>
                    <div style={{ width:`${Math.min(100,(bk.wealthBuilders/fireNumber)*100)}%`,height:"100%",background:`linear-gradient(90deg,${T.amber},#FCD34D)`,borderRadius:99,transition:"width .8s ease" }}/>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <p style={{ color:"#CBD5E1",fontSize:13 }}>
                      <strong style={{ color:T.amber }}>{Math.round((bk.wealthBuilders/fireNumber)*100)}%</strong> of the way there
                    </p>
                    <p style={{ color:"#7A8FA8",fontSize:12 }}>{fmt(bk.wealthBuilders)} working now</p>
                  </div>
                </>
              ) : (
                <p style={{ color:"#CBD5E1",fontSize:13 }}>Add your investments or pension in Track to see progress.</p>
              )}
            </InsightCard>
          ) : (
            <LockedCard icon="🔥" title="Your financial freedom number"
              description="Add your monthly spending to unlock this."
              unlock="Add spending" onUnlock={()=>setTab(2)}/>
          )}

          {/* 2. Safety net */}
          {bk.safetyNet > 0 && (
            <InsightCard icon="🛡️" title={mode.id==="safety"?"Your financial safety net":"Safety net"} sub="Easy-access savings" iconBg={T.tealDim} iconBorder={T.tealBorder}
              infoText="Your liquid savings. The rule of thumb is 3 to 6 months of expenses.">
              <p style={{ color:T.teal,fontWeight:900,fontSize:28,marginBottom:8 }}>{fmt(bk.safetyNet)}</p>
              {safetyMonths!=null ? (
                <>
                  <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:8 }}>
                    <div style={{ width:`${Math.min(100,(safetyMonths/6)*100)}%`,height:"100%",background:`linear-gradient(90deg,${safetyMonths>=3?T.green:T.amber},${safetyMonths>=6?"#86EFAC":T.amber})`,borderRadius:99,transition:"width .8s ease" }}/>
                  </div>
                  <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>
                    <strong style={{ color:safetyMonths>=3?T.green:T.amber }}>{safetyMonths} month{safetyMonths!==1?"s":""}</strong> of expenses covered.
                    {safetyMonths<3 && " Aim for 3 to 6 months as your first target."}
                    {safetyMonths>=3 && safetyMonths<6 && " You have the foundation. Keep building."}
                    {safetyMonths>=6 && " Fully covered. Consider putting excess to work in investments."}
                  </p>
                </>
              ) : (
                <p style={{ color:"#CBD5E1",fontSize:13 }}>Add monthly spending in Track to see months covered.</p>
              )}
            </InsightCard>
          )}

          {/* 3. Wealth breakdown */}
          {totalAssets > 0 && (
            <WealthBreakdownCard bk={bk} totalAssets={totalAssets}/>
          )}

          {/* 4. Interest drag */}
          {totalDebts > 0 && drag > 0 && (
            <InsightCard icon="💸" title="Interest drag" sub="What debt costs you each year" iconBg={T.redDim} iconBorder={T.redBorder}
              infoText="Total annual interest across all debts. Paying highest-rate debt first is a guaranteed return equal to that rate.">
              <p style={{ color:T.red,fontWeight:900,fontSize:28,marginBottom:4 }}>
                {fmt(Math.round(drag/12))}<span style={{ fontSize:16,fontWeight:600 }}>/mo</span>
              </p>
              <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>
                {fmt(Math.round(drag))}/yr leaving your net worth.{" "}
                <span style={{ color:T.white,fontWeight:600 }}>Clear high-rate debt first.</span>
              </p>
            </InsightCard>
          )}
        </div>

        {/* ── Dashboard builder ────────────────────────────────────── */}
        <DashboardBuilder state={state} save={save} setTab={setTab} toast={toast}/>

        {/* ── Next lesson recommendation ───────────────────────────── */}
        {recLesson && !doneSet.has(recLesson.id) && (
          <div style={{ marginBottom:28 }}>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12 }}>Next lesson</p>
            <button onClick={()=>setTab(1)} style={{ width:"100%",background:T.card,border:`1.5px solid ${recLesson.trackColor||T.teal}40`,borderRadius:18,padding:"16px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:50,height:50,borderRadius:14,background:`${recLesson.trackColor||T.teal}20`,border:`1.5px solid ${recLesson.trackColor||T.teal}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
                {recLesson.emoji}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:recLesson.trackColor||T.teal,fontWeight:700,fontSize:11,letterSpacing:.5,textTransform:"uppercase",marginBottom:3 }}>{recLesson.track}</p>
                <p style={{ color:T.white,fontWeight:700,fontSize:14,lineHeight:1.3,marginBottom:3 }}>{recLesson.title}</p>
                <p style={{ color:T.muted,fontSize:12 }}>{recLesson.cards?.length} cards · +{recLesson.xp} XP</p>
              </div>
              <div style={{ background:`${recLesson.trackColor||T.teal}20`,borderRadius:99,padding:"6px 14px",flexShrink:0 }}>
                <p style={{ color:recLesson.trackColor||T.teal,fontSize:12,fontWeight:800 }}>Start</p>
              </div>
            </button>
          </div>
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
              <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.5,fontWeight:500 }}>{g.text}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setTab(2)} style={{ background:T.teal,border:"none",borderRadius:10,padding:"10px 20px",color:T.bg,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:14,width:"100%" }}>
          Update my figures in Track →
        </button>
      </div>

      <p style={{ color:"#CBD5E1",fontWeight:700,fontSize:14,marginBottom:12 }}>🔒 Unlock more insights</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
        {LOCKED.map(t=>(
          <button key={t.label} onClick={()=>setTab(t.tab)}
            style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 14px",textAlign:"left",fontFamily:"inherit",cursor:"pointer",opacity:.75,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:8,right:10 }}><Lock size={12} color={T.subtle}/></div>
            <div style={{ width:36,height:36,borderRadius:10,background:t.colorDim,border:`1px solid ${t.colorBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:8 }}>{t.icon}</div>
            <p style={{ color:"#CBD5E1",fontWeight:700,fontSize:13,marginBottom:4,lineHeight:1.3 }}>{t.label}</p>
            <p style={{ color:"#7A8FA8",fontSize:12,lineHeight:1.4 }}>{t.req}</p>
          </button>
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

/* ── Projection hero card big, jagged, exciting ─────────────── */
function ProjectionHeroCard({ nw, surplus, age }) {
  const data = useMemo(()=>calcProjection(nw,surplus,age),[nw,surplus,age])
  const targetAge = 70
  const atTarget  = data.find(d=>Math.round(d.age)===targetAge)
  const fmtAx = v => v>=1e6?`£${(v/1e6).toFixed(1)}M`:v>=1000?`£${(v/1000).toFixed(0)}k`:v<0?`-£${Math.abs(Math.round(v/1000))}k`:""

  return (
    <div style={{ background:T.card,border:`1.5px solid ${T.tealBorder}`,borderRadius:20,padding:"20px 22px" }} className="ls-glow">
      <p style={{ color:T.teal,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10 }}>Wealth projection to age 70</p>

      {atTarget && (
        <div style={{ marginBottom:16 }}>
          <p style={{ fontSize:"clamp(28px,6vw,40px)",fontWeight:900,lineHeight:1,color:T.teal,textShadow:`0 0 30px ${T.teal}50`,marginBottom:8 }}>
            {fmtK(atTarget.conservative)}
          </p>
          <p style={{ color:"#CBD5E1",fontSize:14,fontWeight:600,marginBottom:6 }}>
            At a conservative 5%/yr roughly what a balanced global index fund has historically delivered you're on track for <strong style={{ color:T.teal }}>{fmtK(atTarget.conservative)}</strong>.
          </p>
          {atTarget.optimistic > atTarget.conservative && (
            <div style={{ background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.25)",borderRadius:10,padding:"10px 14px",marginTop:8 }}>
              <p style={{ color:T.amber,fontSize:14,fontWeight:700 }}>
                ✨ Or {fmtK(atTarget.optimistic)} if you make the right financial moves just 8%/yr gets you there.
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
            <XAxis dataKey="age" tick={{ fontSize:10,fill:"#7A8FA8" }} axisLine={false} tickLine={false} interval={5}/>
            <YAxis tick={{ fontSize:9,fill:"#344D68" }} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={42}/>
            <Tooltip
              formatter={(v,name)=>[fmt(v), name==="conservative"?"Realistic (5%/yr)":"Optimistic (8%/yr)"]}
              labelFormatter={v=>`Age ${Math.round(v)}`}
              contentStyle={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white }}/>
            <Area type="monotone" dataKey="optimistic"   stroke={T.amber} strokeWidth={1.5} strokeDasharray="5 4" fill="url(#gOpt12)" dot={false} strokeOpacity={0.5}/>
            <Area type="monotone" dataKey="conservative" stroke={T.teal}  strokeWidth={2.5} fill="url(#gCon12)"  dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:20,height:3,background:T.teal,borderRadius:2 }}/><span style={{ color:"#CBD5E1",fontSize:12,fontWeight:600 }}>Realistic (5%/yr)</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:18,height:0,borderTop:`2px dashed ${T.amber}`,opacity:.7 }}/><span style={{ color:"#CBD5E1",fontSize:12 }}>Optimistic (8%/yr)</span></div>
      </div>
    </div>
  )
}

/* ── Wealth breakdown no bar, use visual blocks ─────────────── */
function WealthBreakdownCard({ bk, totalAssets }) {
  const segments = [
    {
      label:"Safety net", value:bk.safetyNet, color:T.teal, icon:"🛡️",
      info:"Liquid savings you can access immediately cash, easy-access accounts. This is your financial cushion. Goal: 3–6 months of expenses."
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
              <p style={{ color:"#7A8FA8",fontSize:12,lineHeight:1.4 }}>{s.info.slice(0,60)}…</p>
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
        <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>Pick your priorities we'll tailor your lessons and goals around them.</p>
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
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Your goals</p>
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
          <div><p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{goal.name}</p><p style={{ color:"#7A8FA8",fontSize:12 }}>{checked.size}/{actions.length} steps</p></div>
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
          <p style={{ color:"#7A8FA8",fontSize:12 }}>{fmt(current)} of {fmt(goal.targetAmount)}</p>
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
            <span style={{ fontSize:10,fontWeight:700,color:sel?t.color:"#CBD5E1",textAlign:"center",lineHeight:1.3 }}>{t.label}</span>
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
      <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6,marginBottom:20 }}>Tick each step off as you complete it. Each one moves you closer to your goal.</p>
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
                <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>{a.desc}</p>
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
          <p style={{ color:"#CBD5E1",fontWeight:700,fontSize:16 }}>Goals</p>
          <button onClick={()=>{ setEditGoal(null); setSheet("new") }}
            style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:10,padding:"8px 14px",color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
            <Plus size={13}/>Add goal
          </button>
        </div>

        {active.length===0 && completed.length===0 ? (
          <button onClick={()=>setSheet("new")} style={{ width:"100%",background:T.tealDim,border:`1.5px dashed ${T.tealBorder}`,borderRadius:16,padding:"20px",cursor:"pointer",textAlign:"center",fontFamily:"inherit" }}>
            <p style={{ color:T.teal,fontWeight:700,fontSize:15,marginBottom:4 }}>Set your first goal</p>
            <p style={{ color:"#CBD5E1",fontSize:13 }}>Holiday, house deposit, clear debt people with written goals build 2x more wealth.</p>
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
            <p style={{ color:"#CBD5E1",fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,marginTop:16 }}>Completed</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {completed.map(g=>(
                <div key={g.id} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:18 }}>✅</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:"#CBD5E1",fontWeight:700,fontSize:14 }}>{g.name}</p>
                    <p style={{ color:"#7A8FA8",fontSize:12 }}>{fmt(g.targetAmount)} reached</p>
                  </div>
                  <button onClick={()=>deleteGoal(g)} style={{ background:"none",border:"none",color:"#7A8FA8",cursor:"pointer",padding:4 }}><Trash2 size={13}/></button>
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


function TrackTab() {
  const { state, save, toast } = useApp()
  const [section, setSection] = useState("net_worth")
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

  const SECTIONS = [
    { id:"net_worth", label:"Net Worth", icon:"📊" },
    { id:"assets",    label:"Assets",    icon:"💰" },
    { id:"debts",     label:"Debts",     icon:"💳" },
    { id:"income",    label:"Income",    icon:"💼" },
  ]

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      {/* Header */}
      <div style={{ background:T.surface,padding:"20px 18px 0",borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          <p style={{ color:T.teal,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>Financial MOT</p>
          <h2 style={{ color:T.white,fontWeight:900,fontSize:20,marginBottom:2 }}>Your complete financial picture</h2>
          <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:14 }}>Keep this updated monthly to watch your net worth grow in real time.</p>

          {/* Net worth summary bar */}
          <div style={{ display:"flex",gap:12,marginBottom:16,overflowX:"auto",paddingBottom:4 }}>
            {[
              { label:"Net Worth", value:fmt(netWorth), color:netWorth>=0?T.teal:T.red },
              { label:"Total Assets", value:fmt(totalAssets), color:T.green },
              { label:"Total Debts", value:fmt(totalDebts), color:totalDebts>0?T.red:T.muted },
              ...(surplus!==null?[{ label:"Monthly Surplus", value:`${fmt(surplus)}/mo`, color:surplus>=0?T.teal:T.red }]:[]),
            ].map((s,i)=>(
              <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 16px",flexShrink:0 }}>
                <p style={{ color:s.color,fontWeight:900,fontSize:16,whiteSpace:"nowrap" }}>{s.value}</p>
                <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Section tabs */}
          <div style={{ display:"flex",gap:0,overflowX:"auto" }}>
            {SECTIONS.map(s=>{
              const active = section===s.id
              return (
                <button key={s.id} onClick={()=>setSection(s.id)}
                  style={{ background:"none",border:"none",padding:"12px 16px",color:active?T.teal:"#CBD5E1",fontWeight:active?700:500,fontSize:14,cursor:"pointer",fontFamily:"inherit",position:"relative",flexShrink:0,display:"flex",alignItems:"center",gap:6 }}>
                  {s.icon} {s.label}
                  {active && <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"80%",height:3,borderRadius:"3px 3px 0 0",background:T.teal }}/>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 18px",maxWidth:900,margin:"0 auto",width:"100%" }}>

        {/* ── NET WORTH OVERVIEW ── */}
        {section==="net_worth" && (
          <NetWorthOverviewSection state={state} setSection={setSection} setSheet={setSheet} setEditItem={setEditItem}/>
        )}

        {/* ── ASSETS ── */}
        {section==="assets" && (
          <AssetsSection assets={state.assets} totalAssets={totalAssets}
            onAdd={()=>{ setEditItem(null); setSheet("asset") }}
            onEdit={a=>{ setEditItem(a); setSheet("asset") }}
            onDelete={deleteAsset}/>
        )}

        {/* ── DEBTS ── */}
        {section==="debts" && (
          <DebtsSection debts={state.debts} totalDebts={totalDebts} drag={drag}
            onAdd={()=>{ setEditItem(null); setSheet("debt") }}
            onEdit={d=>{ setEditItem(d); setSheet("debt") }}
            onDelete={deleteDebt}/>
        )}

        {/* ── INCOME ── */}
        {section==="income" && <IncomeSection income={state.income} assets={state.assets} onSave={saveIncome}/>}

      </div>

      {sheet==="asset" && <AssetSheet item={editItem} onClose={()=>{ setSheet(null); setEditItem(null) }} onSave={saveAsset}/>}
      {sheet==="debt"  && <DebtSheet  item={editItem} onClose={()=>{ setSheet(null); setEditItem(null) }} onSave={saveDebt}/>}
    </div>
  )
}

function NetWorthOverviewSection({ state, setSection, setSheet, setEditItem }) {
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
      <div style={{ background:T.card,border:`1.5px solid ${netWorth>=0?T.tealBorder:T.redBorder}`,borderRadius:20,padding:"22px 22px",marginBottom:16,textAlign:"center" }}>
        <p style={{ color:"#CBD5E1",fontSize:14,fontWeight:600,marginBottom:4 }}>Your net worth right now</p>
        <p style={{ fontSize:"clamp(36px,8vw,56px)",fontWeight:900,color:netWorth>=0?T.teal:T.red,lineHeight:1,textShadow:`0 0 40px ${netWorth>=0?T.teal:T.red}40` }}>{fmt(netWorth)}</p>
        <p style={{ color:"#7A8FA8",fontSize:12,marginTop:6 }}>Last updated: {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center",marginTop:14 }}>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:T.green,fontWeight:800,fontSize:17 }}>{fmt(totalAssets)}</p>
            <p style={{ color:"#7A8FA8",fontSize:11 }}>Assets</p>
          </div>
          <div style={{ width:1,background:T.border }}/>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:totalDebts>0?T.red:T.muted,fontWeight:800,fontSize:17 }}>{fmt(totalDebts)}</p>
            <p style={{ color:"#7A8FA8",fontSize:11 }}>Debts</p>
          </div>
          {surplus!==null && <><div style={{ width:1,background:T.border }}/><div style={{ textAlign:"center" }}>
            <p style={{ color:surplus>=0?T.teal:T.red,fontWeight:800,fontSize:17 }}>{fmt(surplus)}/mo</p>
            <p style={{ color:"#7A8FA8",fontSize:11 }}>Surplus</p>
          </div></>}
        </div>
      </div>

      {/* Accuracy prompt */}
      <div style={{ background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start" }}>
        <span style={{ fontSize:20,flexShrink:0 }}>🎯</span>
        <div>
          <p style={{ color:T.amber,fontWeight:700,fontSize:14,marginBottom:4 }}>Keep your figures accurate</p>
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>Update your asset values and debt balances monthly even a rough update takes 2 minutes and keeps your projections meaningful.</p>
        </div>
      </div>

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
                  <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600 }}>{g.label}</p>
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
                  <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600 }}>{d.name}</p>
                  <p style={{ color:"#7A8FA8",fontSize:12 }}>{d.interestRate||t?.assumedRate}% APR {fmt(Math.round(interest/12))}/mo interest</p>
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

function AssetsSection({ assets, totalAssets, onAdd, onEdit, onDelete }) {
  const BUCKETS = [
    { id:"savings",   label:"Cash & Savings",  icon:"💰", color:T.teal   },
    { id:"invest",    label:"Investments",      icon:"📈", color:T.purple },
    { id:"pension",   label:"Pension",          icon:"🏛️", color:T.amber  },
    { id:"property",  label:"Property",         icon:"🏠", color:T.green  },
    { id:"other",     label:"Other Assets",     icon:"📦", color:T.blue   },
  ]

  const getBucket = a => {
    if(a.category==="savings") return "savings"
    if(a.category==="investments") return "invest"
    if(a.category==="pension") return "pension"
    if(["primary_residence","investment_property"].includes(a.category)) return "property"
    return "other"
  }

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <div>
          <p style={{ color:T.green,fontWeight:900,fontSize:22 }}>{fmt(totalAssets)}</p>
          <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600 }}>Total assets</p>
        </div>
        <button onClick={onAdd} style={{ background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:11,padding:"10px 18px",color:T.teal,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
          <Plus size={15}/>Add asset
        </button>
      </div>

      {assets.length===0 ? (
        <EmptyState icon="💰" title="No assets tracked" body="Add your savings, pension, investments, property everything of value." cta="Add an asset" onClick={onAdd}/>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8,padding:"8px 14px",marginBottom:4 }}>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Asset</p>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:70 }}>Rate/Rtn</p>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:80 }}>Value</p>
            <p style={{ color:"transparent",fontSize:11,minWidth:54 }}>...</p>
          </div>

          {BUCKETS.map(b=>{
            const bAssets = assets.filter(a=>getBucket(a)===b.id)
            if(bAssets.length===0) return null
            const bTotal = bAssets.reduce((s,a)=>s+(a.value||0),0)
            return (
              <div key={b.id} style={{ marginBottom:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"6px 14px",background:T.faint,borderRadius:10 }}>
                  <span style={{ fontSize:16 }}>{b.icon}</span>
                  <p style={{ color:b.color,fontWeight:700,fontSize:13,flex:1 }}>{b.label}</p>
                  <p style={{ color:b.color,fontWeight:800,fontSize:13 }}>{fmt(bTotal)}</p>
                </div>
                {bAssets.map(a=>{
                  const t = ASSET_TYPES.find(x=>x.cat===a.category)||ASSET_TYPES[ASSET_TYPES.length-1]
                  return (
                    <div key={a.id} style={{ display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8,alignItems:"center",padding:"12px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:6 }}>
                      <div style={{ minWidth:0 }}>
                        <p style={{ color:T.white,fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.name}</p>
                        <p style={{ color:"#7A8FA8",fontSize:12 }}>{t?.label}{a.monthlyIncome>0?` ${fmt(a.monthlyIncome)}/mo income`:""}</p>
                      </div>
                      <p style={{ color:a.annualReturn?T.purple:"#7A8FA8",fontWeight:700,fontSize:13,textAlign:"right",minWidth:70 }}>
                        {a.annualReturn?`${a.annualReturn}%/yr`:" "}
                      </p>
                      <p style={{ color:T.green,fontWeight:800,fontSize:14,textAlign:"right",minWidth:80 }}>{fmt(a.value)}</p>
                      <div style={{ display:"flex",gap:4,minWidth:54,justifyContent:"flex-end" }}>
                        <button onClick={()=>onEdit(a)} style={{ background:"none",border:"none",color:T.teal,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={14}/></button>
                        <button onClick={()=>onDelete(a)} style={{ background:"none",border:"none",color:"#7A8FA8",cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={14}/></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </>
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
          <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600 }}>Total debts</p>
        </div>
        <button onClick={onAdd} style={{ background:T.redDim,border:`1.5px solid ${T.redBorder}`,borderRadius:11,padding:"10px 18px",color:T.red,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit" }}>
          <Plus size={15}/>Add debt
        </button>
      </div>

      {drag>0 && (
        <div style={{ background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"12px 16px",marginBottom:16 }}>
          <p style={{ color:T.red,fontSize:14,fontWeight:700 }}>💸 {fmt(Math.round(drag/12))}/month ({fmt(Math.round(drag))}/yr) lost to interest</p>
          <p style={{ color:"#CBD5E1",fontSize:13,marginTop:4 }}>Paying off highest-rate debt first (avalanche method) is a guaranteed return equal to the rate you eliminate.</p>
        </div>
      )}

      {debts.length===0 ? (
        <EmptyState icon="💳" title="No debts" body="Add what you owe to track interest costs and see your true net worth." cta="Add a debt" onClick={onAdd}/>
      ) : (
        <>
          {/* Table header */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:8,padding:"8px 14px",marginBottom:4 }}>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Debt</p>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:55 }}>APR</p>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:70 }}>Interest/mo</p>
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,textAlign:"right",minWidth:80 }}>Balance</p>
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
                  <p style={{ color:"#7A8FA8",fontSize:12 }}>{t?.label}{d.minPayment>0?` min ${fmt(d.minPayment)}/mo`:""}</p>
                </div>
                <div style={{ background:`${rateColor}20`,border:`1px solid ${rateColor}40`,borderRadius:8,padding:"3px 8px",minWidth:55,textAlign:"center" }}>
                  <p style={{ color:rateColor,fontWeight:800,fontSize:12 }}>{rate}%</p>
                </div>
                <p style={{ color:T.red,fontWeight:700,fontSize:13,textAlign:"right",minWidth:70 }}>{fmt(Math.round(interest/12))}</p>
                <p style={{ color:T.red,fontWeight:800,fontSize:14,textAlign:"right",minWidth:80 }}>{fmt(d.balance)}</p>
                <div style={{ display:"flex",gap:4,minWidth:54,justifyContent:"flex-end" }}>
                  <button onClick={()=>onEdit(d)} style={{ background:"none",border:"none",color:T.teal,cursor:"pointer",padding:6,borderRadius:8 }}><Pencil size={14}/></button>
                  {!d.isAutoCreated && <button onClick={()=>onDelete(d)} style={{ background:"none",border:"none",color:"#7A8FA8",cursor:"pointer",padding:6,borderRadius:8 }}><Trash2 size={14}/></button>}
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
              <p style={{ color:"#7A8FA8",fontSize:11 }}>{x.hint}</p>
            </div>
          </button>
        )})}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:14 }}>
        <Input label="Name / label" value={name} onChange={setName} placeholder={t?.label||"e.g. Vanguard ISA"}/>
        <CurrencyInput label="Current value" value={val} onChange={setVal}/>
        <div>
          <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600,marginBottom:6 }}>Annual return / interest rate (optional)</p>
          <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
            <input type="number" min="0" max="30" step="0.1" value={ret} onChange={e=>setRet(e.target.value)}
              placeholder="e.g. 7"
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"14px 16px",fontFamily:"inherit" }}/>
            <span style={{ padding:"0 16px",color:"#7A8FA8",fontWeight:700 }}>%/yr</span>
          </div>
          <p style={{ color:"#7A8FA8",fontSize:12,marginTop:4 }}>Helps unlock better growth projections</p>
        </div>
        {["investment_property","rental"].includes(cat) && (
          <CurrencyInput label="Monthly rental income" value={income} onChange={setIncome}/>
        )}
        {canHaveLoan && (
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:hasLoan?10:0 }}>
              <Toggle value={hasLoan} onChange={setHasLoan}/>
              <p style={{ color:"#CBD5E1",fontSize:14,fontWeight:600 }}>Has a mortgage / loan</p>
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
              <p style={{ color:"#7A8FA8",fontSize:11 }}>~{x.assumedRate}% typical</p>
            </div>
          </button>
        )})}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:14 }}>
        <Input label="Name / label" value={name} onChange={setName} placeholder={t?.label||"e.g. HSBC credit card"}/>
        <CurrencyInput label="Current balance owed" value={bal} onChange={setBal}/>
        <div>
          <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600,marginBottom:6 }}>Interest rate (APR)</p>
          <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
            <input type="number" min="0" max="100" step="0.1" value={rate} onChange={e=>setRate(e.target.value)}
              placeholder={t?String(t.assumedRate):"10"}
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"14px 16px",fontFamily:"inherit" }}/>
            <span style={{ padding:"0 16px",color:"#7A8FA8",fontWeight:700 }}>% APR</span>
          </div>
          <p style={{ color:"#7A8FA8",fontSize:12,marginTop:4 }}>Check your statement or account online</p>
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
        <p style={{ color:"#CBD5E1",fontSize:14,fontWeight:600,marginBottom:4 }}>Total monthly income</p>
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
        <p style={{ color:"#CBD5E1",fontSize:13,marginTop:8,fontWeight:500 }}>📱 Check your banking app or last payslip</p>
      </div>

      {rentalIncome>0 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <p style={{ color:"#CBD5E1",fontSize:14,fontWeight:600 }}>🏠 Rental income (from assets)</p>
          <p style={{ color:T.green,fontWeight:800,fontSize:15 }}>{fmt(rentalIncome)}/mo</p>
        </div>
      )}

      {extras.length>0 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px" }}>
          <p style={{ color:T.white,fontWeight:700,fontSize:15,marginBottom:12 }}>Other income</p>
          {extras.map((e,i)=>(
            <div key={e.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <p style={{ color:"#CBD5E1",fontSize:14 }}>{e.label}</p>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <p style={{ color:T.green,fontWeight:700 }}>{fmt(e.amount)}/mo</p>
                <button onClick={()=>setExtras(prev=>prev.filter(x=>x.id!==e.id))} style={{ background:"none",border:"none",color:"#7A8FA8",cursor:"pointer",padding:4 }}><Trash2 size={14}/></button>
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
   LESSONS 5 fully working lessons, goal-linked
   ════════════════════════════════════════════════════════════════════ */
const LESSONS = [
  /* ── Lesson 1: Net Worth linked to grow_nw, calm, learn ─────── */
  {
    id:"nw_basics",
    track:"Foundations",
    trackColor:T.teal, trackDim:T.tealDim, trackBorder:T.tealBorder,
    title:"What net worth actually is and why it changes everything",
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
        body:"Nobody teaches this. Schools don't cover it. Banks don't show it. Most people feel vaguely okay or vaguely worried but they're flying blind.",
        facts:[
          { icon:"😰", label:"Flying blind", text:"Without a net worth number, financial decisions feel like guesswork. You don't know if you're ahead or behind, or what's actually moving the needle." },
          { icon:"📊", label:"Measurement = momentum", text:"People who track their net worth consistently make better decisions, save more, and reach financial goals faster. The act of measuring creates accountability." },
          { icon:"🔮", label:"It predicts the future", text:"Your net worth today, combined with your monthly surplus and investment rate, tells you with surprising accuracy where you'll be in 10, 20, or 30 years." },
        ]
      },
      {
        type:"scenario",
        prompt:"Two people both earn £45k. After 20 years, who has more?",
        context:"Alex saves £400/month in an ISA from age 28. Jordan earns the same but spends it all nicer car, better holidays.",
        choices:[
          { label:"Jordan lifestyle choices reflect financial confidence", best:false, outcome:"Lifestyle spending leaves no wealth trail. Jordan's car depreciated and the holidays produced no financial return. Net worth after 20 years: roughly £0 invested." },
          { label:"Alex tracking and investing consistently wins", best:true, outcome:"At 7% average return, Alex's £400/month over 20 years grows to roughly £208,000. Same income. Dramatically different net worth. The only difference was measuring and acting." },
        ],
        explanation:"Identical incomes, identical starting points, radically different outcomes. The gap is entirely explained by one person measuring and acting on their net worth."
      },
      {
        type:"fact",
        headline:"The four levers that grow your number",
        icon:"🎛️",
        body:"There are only four ways to improve net worth. Every financial decision hits at least one.",
        facts:[
          { icon:"⬆️", label:"Earn more", text:"A pay rise is the highest-leverage move for most people under 40. Even a 10% increase compounds dramatically over a career." },
          { icon:"⬇️", label:"Spend less", text:"Every £1 not spent is a £1 that builds assets. The gap between spending 80% and 100% of income over 30 years is hundreds of thousands of pounds." },
          { icon:"📈", label:"Grow assets faster", text:"Money in a current account earning 0% vs an ISA growing at 7% the difference over 20 years on £10,000 is £27,000." },
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

  /* ── Lesson 2: Compound interest linked to invest, learn, pension ── */
  {
    id:"compound_interest",
    track:"Investing",
    trackColor:T.purple, trackDim:T.purpleDim, trackBorder:T.purpleBorder,
    title:"How your money grows by itself (and why starting today beats waiting)",
    emoji:"🌱", xp:15,
    goalLinks:["invest","learn","pension","net_worth"],
    cards:[
      {
        type:"fact",
        headline:"First, what is a return?",
        icon:"💡",
        body:"A return is simply the profit your money makes. If you put £1,000 in an investment and it grows to £1,070 after a year, your return is £70. That's a 7% annual return.",
        highlight:"Return = profit on your money",
        sub:"This return can come from interest (like a savings account), dividends (companies sharing profits), or the investment growing in value.",
      },
      {
        type:"fact",
        headline:"Now, what makes it compound?",
        icon:"📈",
        body:"Compound return means your returns earn returns. In year one, you earn £70 on your £1,000. In year two, you earn 7% on £1,070   so £74.90, not £70. In year three, 7% on £1,144.90. Every year, the base grows, so the return grows too.",
        highlight:"You are earning returns on your returns   not just on what you put in",
        facts:[
          { icon:"📅", label:"Simple return (not compounding)", text:"£1,000 at 7%: you earn £70 every single year. After 10 years: £1,700 total." },
          { icon:"📈", label:"Compound return (the real thing)", text:"£1,000 at 7% compounding: after 10 years you have £1,967. After 30 years: £7,612. Same money, dramatically different outcome." },
        ]
      },
      {
        type:"interactive",
        id:"growth_chart",
        headline:"See the compound curve yourself",
        prompt:"Move the slider to see how a monthly investment grows over time",
        hint:"The grey area is what you actually paid in. The teal area on top is your compound return doing its work   notice how it gets bigger and bigger relative to what you put in. That gap is free money, generated by time.",
      },
      {
        type:"fact",
        headline:"The Rule of 72: how fast does money double?",
        icon:"⚡",
        body:"This is a simple shortcut. Divide 72 by your annual return rate and that tells you roughly how many years it takes to double your money.",
        facts:[
          { icon:"🏦", label:"Savings account at 4%/yr", text:"72 ÷ 4 = 18 years to double. Safe, but slow." },
          { icon:"📈", label:"Index fund at 7%/yr (historical average)", text:"72 ÷ 7 = about 10 years to double. £10,000 becomes £80,000 in 30 years." },
          { icon:"💳", label:"Credit card debt at 24%/yr", text:"72 ÷ 24 = 3 years to double what you owe. A £1,000 balance becomes £2,000, then £4,000. This is compound working against you." },
        ]
      },
      {
        type:"scenario",
        prompt:"Emma invests £200 per month from age 25. Jake invests £400 per month from age 35. Both stop at 65. Both earn 7% per year. Who ends up with more?",
        context:"Emma puts in half the money but starts 10 years earlier. Jake puts in twice as much but starts later.",
        choices:[
          { label:"Jake. He invested twice as much each month.", best:false, outcome:"Jake invested £144,000 total and ends up with around £524,000. Starting late is expensive." },
          { label:"Emma. Starting earlier wins even with less money.", best:true, outcome:"Emma invested only £96,000 total   £48,000 less than Jake   and ends up with around £527,000. Time beats amount. This is compound return doing its job over a longer runway." },
          { label:"They end up about the same.", best:false, outcome:"Very close actually, but Emma wins having invested £48,000 less. That difference is pure compound return from starting 10 years earlier." },
        ],
        explanation:"Starting a decade earlier is worth more than doubling your monthly investment. This is why financial advisers always say the best time to start is now, even with a small amount."
      },
      {
        type:"quiz",
        question:"Using the Rule of 72, money invested at 7% per year doubles roughly every:",
        options:["5 years","10 years","15 years","20 years"],
        correct:1,
        explanation:"72 ÷ 7 = about 10 years. So £5,000 today at 7% becomes around £10,000 in 10 years, £20,000 in 20 years, and £40,000 in 30 years. Without adding a single pound more. That is compound return."
      },
    ]
  },

  /* ── Lesson 3: Paying off debt linked to pay_debt, calm, budget ── */
  {
    id:"pay_off_debt",
    track:"Debt",
    trackColor:T.red, trackDim:T.redDim, trackBorder:T.redBorder,
    title:"Clear your debt faster and save thousands",
    emoji:"💳", xp:20,
    goalLinks:["pay_debt","calm","budget","net_worth"],
    cards:[
      {
        type:"fact",
        headline:"Debt isn't just a number it's a monthly tax",
        icon:"💸",
        body:"Every pound you owe at 20% APR costs you 20p a year in interest. On a £5,000 credit card balance, that's £1,000 a year just for having it. The fastest way to grow your net worth is to eliminate this invisible drain first.",
        highlight:"Paying off 20% debt = a guaranteed 20% return",
      },
      {
        type:"fact",
        headline:"Two methods both work, pick your style",
        icon:"🎯",
        body:"There are two proven strategies for clearing debt. The one you'll actually stick with is the right one.",
        facts:[
          { icon:"🏔️", label:"Avalanche (mathematically best)", text:"Pay minimums on everything. Throw every extra pound at the highest-rate debt first. Saves the most money in interest. Best for disciplined people who want the optimal outcome." },
          { icon:"⛄", label:"Snowball (psychologically best)", text:"Pay minimums on everything. Throw every extra pound at the smallest balance first. Less optimal mathematically, but the quick wins keep you motivated. Research shows higher completion rates." },
          { icon:"🏆", label:"Which wins?", text:"The one you actually do. Either strategy destroys more debt than making minimum payments. Choose based on what keeps you going." },
        ]
      },
      {
        type:"scenario",
        prompt:"You have £500 extra per month. £3,000 credit card at 22%, £8,000 car loan at 7%. What should you do?",
        context:"After paying minimums on both, you have £500 spare to put towards clearing debt.",
        choices:[
          { label:"Split £250 between both debts equally", best:false, outcome:"Splitting feels balanced but is the slowest approach. You're paying interest on the credit card for longer costing you an extra £400-600 vs the avalanche method." },
          { label:"Pay the car loan it's the bigger debt", best:false, outcome:"Bigger balance, but at 7% APR this debt costs far less. Prioritising it over the 22% card means you're paying more in total interest." },
          { label:"Clear the credit card first (avalanche)", best:true, outcome:"22% vs 7% the difference is massive. Clearing the credit card first saves you roughly £600 in interest and frees up that payment sooner. Every month you delay costs money." },
        ],
        explanation:"Rate matters more than balance size. Always attack the most expensive debt first the maths are clear."
      },
      {
        type:"fact",
        headline:"The minimum payment trap",
        icon:"⚠️",
        body:"Credit cards are designed so that minimum payments keep you in debt for decades. On a £5,000 balance at 22%, paying the minimum (about £100/month) will take you 7+ years to clear and cost over £3,500 in interest alone.",
        highlight:"Minimum payments = maximum profit for lenders",
        facts:[
          { icon:"📅", label:"Time to clear £5k at minimums", text:"7-8 years. That's thousands of pounds in interest on a manageable debt." },
          { icon:"⚡", label:"Add £100 extra per month", text:"Clear in 2.5 years. Save over £2,500 in interest. One small change, massive impact." },
        ]
      },
      {
        type:"quiz",
        question:"You have two debts: £2,000 at 24% APR and £6,000 at 5% APR. Which should you pay off first?",
        options:["The £6,000 debt it's larger","The £2,000 debt it's smaller and easier to clear","The 24% debt the rate is what matters","Pay them off equally"],
        correct:2,
        explanation:"Rate is what matters. The 24% debt costs you £480/year in interest. The 5% debt costs £300/year. Clearing the high-rate debt first is mathematically optimal regardless of the balance size."
      },
    ]
  },

  /* ── Lesson 4: Growing your pension ── */
  {
    id:"pension_basics",
    track:"Pensions",
    trackColor:T.amber, trackDim:T.amberDim, trackBorder:T.amberBorder,
    title:"Your pension: the most tax-efficient investment you'll ever have",
    emoji:"🏛️", xp:20,
    goalLinks:["pension","invest","net_worth","house"],
    cards:[
      {
        type:"fact",
        headline:"A pension is just an investment account with a bonus",
        icon:"🎁",
        body:"When you put money into a pension, the government adds 20-45% on top, depending on your tax rate. A basic rate taxpayer puts in £80 and ends up with £100 in their pension. That's an instant 25% return before a single investment is made.",
        highlight:"25–81% instant return from tax relief",
      },
      {
        type:"fact",
        headline:"The compound effect inside your pension",
        icon:"📈",
        body:"Because pension money grows tax-free, compound interest works harder inside a pension than in almost any other account.",
        facts:[
          { icon:"💷", label:"£200/month from age 25", text:"At 7%/yr by age 65: roughly £528,000. Of that, you put in £96,000. The rest is compound growth tax-free." },
          { icon:"⏰", label:"Start at 35 instead", text:"Same £200/month, same 7%/yr: roughly £243,000 by 65. Starting 10 years later costs you £285,000 in growth." },
          { icon:"🏢", label:"Employer match = free money", text:"If your employer matches contributions, always contribute enough to get the full match. It's an instant 100% return on that portion." },
        ]
      },
      {
        type:"scenario",
        prompt:"Your employer offers 5% pension match. You currently contribute 3%. What should you do?",
        context:"You earn £35,000. Your employer will match up to 5% of your salary into your pension.",
        choices:[
          { label:"Keep contributing 3% 5% feels like a lot", best:false, outcome:"You're leaving £700/year of free employer money on the table. Over 30 years at 7% growth, that missed match compounds to over £66,000 in lost pension value." },
          { label:"Increase to 5% to get the full match", best:true, outcome:"By increasing from 3% to 5% (£58/month extra), you unlock £1,750/year in employer contributions. Over 30 years at 7%, that employer money alone grows to roughly £175,000." },
          { label:"Stop contributing entirely to save cash", best:false, outcome:"You'd lose the employer match, the tax relief, and the compound growth all at once. This is the most expensive financial decision most people make." },
        ],
        explanation:"Employer match is the only genuinely free money in personal finance. Never leave it unclaimed."
      },
      {
        type:"quiz",
        question:"A basic rate taxpayer contributes £80 to their pension. How much ends up in the pension?",
        options:["£80 what you put in","£96 with a small top-up","£100 government adds 25%","£120 double matched"],
        correct:2,
        explanation:"Basic rate tax relief means the government adds 25% (20% of the grossed-up amount). £80 from you → £100 in your pension. Higher rate taxpayers can claim even more back through their tax return."
      },
    ]
  },

  /* ── Lesson 5: Building wealth ── */
  {
    id:"building_wealth",
    track:"Investing",
    trackColor:T.purple, trackDim:T.purpleDim, trackBorder:T.purpleBorder,
    title:"How to actually build wealth on a normal salary",
    emoji:"🌱", xp:20,
    goalLinks:["invest","net_worth","learn","house"],
    cards:[
      {
        type:"fact",
        headline:"Wealth isn't about earning more it's about the gap",
        icon:"💰",
        body:"The wealth gap is simple: income minus spending. Every pound in that gap, invested consistently, builds net worth. A person earning £30k with a £300 monthly surplus can outperform someone earning £80k who spends everything.",
        highlight:"Surplus invested consistently > high income spent",
      },
      {
        type:"fact",
        headline:"The four assets that build real wealth",
        icon:"🏗️",
        body:"Most wealth comes from a small number of asset types. Understanding them lets you make better allocation decisions.",
        facts:[
          { icon:"📊", label:"Index funds / ISA", text:"Low-cost funds that track the market. Historically 7-10% annual returns. The single best vehicle for most people. Start here." },
          { icon:"🏛️", label:"Pension", text:"Tax-advantaged and often employer-matched. Should be your second priority after an emergency fund." },
          { icon:"🏠", label:"Property", text:"Leveraged asset your deposit controls a larger asset. Works well long-term but needs maintenance, insurance, and isn't liquid." },
          { icon:"💼", label:"Business / side income", text:"Highest potential return, highest risk. Income generated can be redirected into the above three to compound faster." },
        ]
      },
      {
        type:"scenario",
        prompt:"You have £500/month surplus. Emergency fund is sorted. What's the best order of priorities?",
        context:"You have 3 months expenses saved, a workplace pension with 5% employer match, and no high-interest debt.",
        choices:[
          { label:"Max out ISA first, then increase pension", best:false, outcome:"Not wrong, but you might be leaving employer match on the table. Always capture the full employer match before contributing more elsewhere it's a 100% return on that money." },
          { label:"Max pension match first, then ISA, then extra pension", best:true, outcome:"Perfect order: (1) Employer match = free money, always take it. (2) ISA = tax-free growth, flexible access. (3) Additional pension for long-term tax efficiency. This order maximises every pound." },
          { label:"Put everything into property saving for a deposit", best:false, outcome:"Property is a valid goal but not at the expense of tax-advantaged accounts. You can save for a deposit inside a Lifetime ISA (25% government bonus) while still capturing the employer match." },
        ],
        explanation:"Priority order: emergency fund → employer match → ISA → additional pension → other investing. This maximises free money, tax efficiency, and flexibility."
      },
      {
        type:"quiz",
        question:"Which investment vehicle gives you the most tax advantages for long-term wealth building in the UK?",
        options:["Premium Bonds government-backed and flexible","Pension + ISA together for different time horizons","A high-interest savings account","Buy-to-let property"],
        correct:1,
        explanation:"Pension and ISA together give you the full picture: pension for tax relief on contributions (25-81% boost) plus tax-free growth, and ISA for flexible tax-free growth you can access any time. Together they're hard to beat."
      },
    ]
  },

]

/* ════════════════════════════════════════════════════════════════════
   LEARN TAB
   ════════════════════════════════════════════════════════════════════ */
// Confetti component for lesson completion
function Confetti({ active }) {
  if(!active) return null
  const pieces = Array.from({length:30},(_,i)=>({
    id:i,
    x: Math.random()*100,
    color: [T.teal,T.purple,T.amber,T.green,T.blue,"#F472B6"][Math.floor(Math.random()*6)],
    delay: Math.random()*0.4,
    size: 6+Math.random()*6,
    spin: Math.random()*360,
  }))
  return (
    <div style={{ position:"fixed",inset:0,zIndex:999,pointerEvents:"none",overflow:"hidden" }}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute",
          left:`${p.x}%`,top:"-20px",
          width:p.size,height:p.size,
          background:p.color,
          borderRadius:Math.random()>0.5?"50%":"2px",
          animation:`confettiFall 1.4s ${p.delay}s ease-in forwards`,
          transform:`rotate(${p.spin}deg)`,
        }}/>
      ))}
    </div>
  )
}

const COMING_SOON_LESSONS = [
  { emoji:"🏠", title:"How to build wealth through property", track:"Property", trackColor:T.amber, desc:"Mortgages, equity, and whether buying beats renting" },
  { emoji:"📊", title:"ISAs explained: the best tax-free wrapper in the UK", track:"Tax", trackColor:T.teal, desc:"Stocks and Shares ISA vs Cash ISA and how to use them" },
  { emoji:"🤝", title:"Investing your first £1,000 step by step", track:"Investing", trackColor:T.purple, desc:"Index funds, platforms, and exactly how to start" },
  { emoji:"💰", title:"The 50/30/20 rule: a budget that actually works", track:"Budgeting", trackColor:T.green, desc:"A simple framework used by millions worldwide" },
  { emoji:"🧮", title:"How to pay off your mortgage 10 years early", track:"Property", trackColor:T.amber, desc:"Overpayments, offset accounts and the maths behind it" },
  { emoji:"🌍", title:"Why global index funds beat almost everything", track:"Investing", trackColor:T.purple, desc:"The evidence behind passive investing and why it works" },
]

function LearnTab() {
  const { state, save, toast } = useApp()
  const [activeLesson, setActiveLesson] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(null)
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
    setJustCompleted(lessonId)
    setShowConfetti(true)
    setTimeout(()=>setShowConfetti(false), 1800)
    setTimeout(()=>setJustCompleted(null), 3000)
    setActiveLesson(null)
  }

  if(activeLesson) {
    const lesson = LESSONS.find(l=>l.id===activeLesson)
    if(!lesson) { setActiveLesson(null); return null }
    return <LessonPlayer lesson={lesson} onComplete={()=>completeLesson(lesson.id)} onBack={()=>setActiveLesson(null)}/>
  }

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

  const doneCount = completedLessons.length
  const encouragement = doneCount===0
    ? "Every lesson you complete moves your net worth in the right direction."
    : doneCount===1
    ? "One lesson done. You already know more than most people ever learn about money."
    : doneCount < LESSONS.length
    ? `${doneCount} lessons completed. You are building the knowledge that most people never get.`
    : "You have completed every lesson. Your financial knowledge is genuinely rare."

  return (
    <div style={{ flex:1,overflowY:"auto",paddingBottom:100 }}>
      <Confetti active={showConfetti}/>

      {/* Completion banner */}
      {justCompleted && (
        <div style={{ position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",zIndex:500,background:`linear-gradient(135deg,${T.teal},${T.purple})`,borderRadius:16,padding:"14px 24px",boxShadow:"0 8px 32px rgba(0,0,0,.5)",textAlign:"center",animation:"slideDown .3s ease" }}>
          <p style={{ color:T.bg,fontWeight:900,fontSize:15 }}>🎉 Lesson complete!</p>
          <p style={{ color:T.bg,fontSize:13,opacity:.85,marginTop:2 }}>You are one step closer to growing your net worth</p>
        </div>
      )}

      <div style={{ padding:"28px 18px 10px",maxWidth:700,margin:"0 auto",width:"100%" }}>

        <h2 style={{ color:T.white,fontWeight:900,fontSize:22,marginBottom:4 }}>Learn</h2>
        <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:4 }}>
          {doneCount}/{LESSONS.length} completed
        </p>
        <p style={{ color:T.purple,fontSize:13,fontWeight:600,marginBottom:20 }}>{encouragement}</p>

        {/* Track + Learn dual prompt */}
        <div style={{ background:`linear-gradient(135deg,${T.purpleDim},${T.tealDim})`,border:`1px solid ${T.purpleBorder}`,borderRadius:16,padding:"16px",marginBottom:20 }}>
          <p style={{ color:T.white,fontWeight:800,fontSize:14,marginBottom:4 }}>Two ways to build wealth here</p>
          <div style={{ display:"flex",gap:14,marginTop:8 }}>
            <div style={{ flex:1 }}>
              <p style={{ color:T.purple,fontWeight:700,fontSize:12,marginBottom:3 }}>📚 Learn</p>
              <p style={{ color:"#7A8FA8",fontSize:12,lineHeight:1.5 }}>Complete lessons to make smarter decisions. Each one pays for itself.</p>
            </div>
            <div style={{ width:1,background:T.border }}/>
            <div style={{ flex:1 }}>
              <p style={{ color:T.teal,fontWeight:700,fontSize:12,marginBottom:3 }}>📊 Track</p>
              <p style={{ color:"#7A8FA8",fontSize:12,lineHeight:1.5 }}>Update your numbers monthly in Track. 10 minutes. Keeps everything accurate.</p>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",marginBottom:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>Progress</p>
            <p style={{ color:T.teal,fontWeight:800,fontSize:13 }}>{state.profile?.points||0} XP earned</p>
          </div>
          <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden" }}>
            <div style={{ width:`${LESSONS.length>0?Math.round(doneCount/LESSONS.length*100):0}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width .6s ease" }}/>
          </div>
        </div>

        {/* Lessons — square grid cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}>
          {sorted.map(lesson=>{
            const done     = doneSet.has(lesson.id)
            const linked   = lesson.goalLinks?.some(g=>priorityGoals.includes(g))
            const justDone = justCompleted===lesson.id
            return (
              <button key={lesson.id} onClick={()=>setActiveLesson(lesson.id)}
                style={{
                  background: done
                    ? `linear-gradient(145deg,${lesson.trackColor}22,${lesson.trackColor}08)`
                    : T.card,
                  border: `1.5px solid ${done ? lesson.trackColor+"55" : linked ? lesson.trackColor+"35" : T.border}`,
                  borderRadius:18, padding:"18px 14px",
                  cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                  display:"flex", flexDirection:"column", gap:0,
                  transition:"all .2s",
                  boxShadow: done ? `0 0 24px ${lesson.trackColor}18` : justDone ? `0 0 30px ${T.teal}40` : "none",
                  minHeight:140, position:"relative",
                }}>
                {/* Track badge */}
                <span style={{ position:"absolute",top:12,right:12,background:`${lesson.trackColor}25`,color:lesson.trackColor,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:99,letterSpacing:.6,textTransform:"uppercase",border:`1px solid ${lesson.trackColor}30` }}>
                  {lesson.track}
                </span>
                {/* Emoji */}
                <div style={{ fontSize:30,marginBottom:10 }}>
                  {done ? "✅" : lesson.emoji}
                </div>
                {/* Title */}
                <p style={{ color:T.white,fontWeight:800,fontSize:13,lineHeight:1.3,marginBottom:"auto",paddingRight:8 }}>
                  {lesson.title}
                </p>
                {/* Footer */}
                <div style={{ marginTop:12,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ color:T.muted,fontSize:11 }}>{lesson.cards?.length} cards · +{lesson.xp} XP</span>
                  {done
                    ? <span style={{ color:lesson.trackColor,fontSize:11,fontWeight:800 }}>Done ✓</span>
                    : linked
                    ? <span style={{ color:lesson.trackColor,fontSize:11,fontWeight:700 }}>★ Goal</span>
                    : <span style={{ color:T.muted,fontSize:16 }}>→</span>
                  }
                </div>
              </button>
            )
          })}
        </div>

        {/* Coming soon greyed lessons */}
        <div style={{ marginTop:24 }}>
          <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14 }}>Coming soon</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {COMING_SOON_LESSONS.map((l,i)=>(
              <div key={i} style={{ background:T.faint,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",display:"flex",gap:12,alignItems:"center",opacity:0.5 }}>
                <div style={{ width:48,height:48,borderRadius:14,background:`${l.trackColor}12`,border:`1px solid ${l.trackColor}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
                  {l.emoji}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ color:T.white,fontWeight:700,fontSize:13,marginBottom:3 }}>{l.title}</p>
                  <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                    <span style={{ background:`${l.trackColor}15`,color:l.trackColor,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6 }}>{l.track}</span>
                    <span style={{ color:"#7A8FA8",fontSize:11 }}>{l.desc}</span>
                  </div>
                </div>
                <div style={{ background:T.surface,borderRadius:8,padding:"4px 10px" }}>
                  <span style={{ color:"#7A8FA8",fontSize:11,fontWeight:700 }}>Soon</span>
                </div>
              </div>
            ))}
          </div>
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
            <p style={{ color:"#CBD5E1",fontSize:13 }}>
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
        <div style={{ background:`${color}12`,border:`1.5px solid ${color}35`,borderRadius:14,padding:"14px 18px",marginBottom:card.sub||card.facts?14:0 }}>
          <p style={{ color,fontWeight:700,fontSize:14,lineHeight:1.5 }}>💡 {card.highlight}</p>
        </div>
      )}
      {card.sub && (
        <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.65,marginBottom:card.facts?18:0 }}>{card.sub}</p>
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
      <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:20 }}>Tap a term, then its matching definition.</p>
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
          {card.explanation && <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6 }}>{card.explanation}</p>}
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
      <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:20 }}>Tap in your preferred order.</p>
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
              <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:600 }}>{item}</p>
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
      <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:20,lineHeight:1.5 }}>Adjust your monthly investment to see what compound interest does over 30 years.</p>

      {/* Slider */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
          <p style={{ color:"#CBD5E1",fontSize:13 }}>Monthly investment</p>
          <p style={{ color,fontWeight:800,fontSize:16 }}>£{monthly.toLocaleString("en-GB")}</p>
        </div>
        <input type="range" min="50" max="2000" step="50" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}
          style={{ width:"100%",accentColor:color,height:6,cursor:"pointer" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
          <span style={{ color:"#7A8FA8",fontSize:12 }}>£50</span>
          <span style={{ color:"#7A8FA8",fontSize:12 }}>£2,000</span>
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
/* ════════════════════════════════════════════════════════════════════
   MONEY PERSONALITY CARD
   ════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════
   PERSONALITY QUIZ — full interactive UI
   ════════════════════════════════════════════════════════════════════ */
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
            <p style={{ color:"#CBD5E1",fontSize:15,textAlign:"center",lineHeight:1.7,marginBottom:32 }}>
              12 scenario questions. No right answers. Takes about 4 minutes.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:32 }}>
              {[
                { icon:"🎯", text:"Your money archetype — one of 8 types" },
                { icon:"📊", text:"How you make financial decisions" },
                { icon:"💡", text:"Your specific blind spots and strengths" },
                { icon:"🗺️", text:"What this means in real-life scenarios" },
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px" }}>
                  <span style={{ fontSize:20 }}>{item.icon}</span>
                  <p style={{ color:"#CBD5E1",fontSize:13,fontWeight:500 }}>{item.text}</p>
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
            <p style={{ color:"#7A8FA8",fontSize:14,marginBottom:28 }}>{q.sub}</p>

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
                      color: sel ? T.white : "#CBD5E1",
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
        <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.7 }}>{arch.summary}</p>
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
              <div key={d.key} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px" }}>
                <p style={{ color:"#7A8FA8",fontSize:13 }}>{d.key}</p>
                <p style={{ color:d.color,fontWeight:700,fontSize:13 }}>{d.val}</p>
              </div>
            ))}
          </div>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>Strengths</p>
          <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
            {(arch.traits||[]).map((t,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
                <span style={{ color:arch.color,fontSize:14,marginTop:1 }}>✓</span>
                <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenarios tab */}
      {tab==="scenarios" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.6,marginBottom:16 }}>Based on your profile, here is how you are likely to think and act with money:</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {(arch.scenarios||[]).map((s,i)=>(
              <div key={i} style={{ background:T.card,border:`1px solid ${arch.color}25`,borderRadius:12,padding:"13px 15px",display:"flex",gap:10,alignItems:"flex-start" }}>
                <span style={{ fontSize:15,marginTop:1 }}>→</span>
                <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.55 }}>{s}</p>
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
            <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.65 }}>{arch.blind_spot}</p>
          </div>
          <div style={{ background:`${arch.color}12`,border:`1.5px solid ${arch.color}30`,borderRadius:16,padding:"18px" }}>
            <p style={{ color:arch.color,fontWeight:700,fontSize:13,marginBottom:8 }}>→ Your next move</p>
            <p style={{ color:"#CBD5E1",fontSize:14,lineHeight:1.65 }}>{arch.next_step}</p>
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
            <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4 }}>Your money personality</p>
            <p style={{ color:T.white,fontWeight:900,fontSize:20,marginBottom:4 }}>{arch.name}</p>
            <p style={{ color:"#CBD5E1",fontSize:13,lineHeight:1.55 }}>{arch.summary}</p>
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
              <p style={{ color:"#7A8FA8",fontSize:10,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:3 }}>{d.label}</p>
              <p style={{ color:d.color,fontWeight:800,fontSize:12 }}>{d.val}</p>
            </div>
          ))}
        </div>

        {/* Locked insights */}
        <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:14 }}>
          <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10 }}>Deeper insights</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {PERSONALITY_LOCKED.map(l=>{
              const done = l.check(state)
              return (
                <div key={l.id} style={{ display:"flex",alignItems:"center",gap:10,background:done?`${arch.color}10`:T.faint,borderRadius:10,padding:"10px 12px",border:`1px solid ${done?arch.color+"30":T.border}` }}>
                  <span style={{ fontSize:16,flexShrink:0 }}>{l.icon}</span>
                  <p style={{ color:done?T.white:"#7A8FA8",fontWeight:done?700:500,fontSize:13,flex:1 }}>{l.label}</p>
                  {done
                    ? <span style={{ color:arch.color,fontSize:11,fontWeight:700 }}>Unlocked ✓</span>
                    : <span style={{ color:"#7A8FA8",fontSize:11 }}>{l.unlock}</span>
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ marginTop:12 }}>
        <button onClick={()=>setShowMode(v=>!v)}
          style={{ width:"100%",background:T.card,border:`1px solid ${mode.border}`,borderRadius:14,padding:"13px 18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:18 }}>{mode.icon}</span>
            <div style={{ textAlign:"left" }}>
              <p style={{ color:"#7A8FA8",fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:1 }}>Your focus mode</p>
              <p style={{ color:T.white,fontWeight:700,fontSize:13 }}>{mode.label}</p>
            </div>
          </div>
          <p style={{ color:mode.color,fontSize:12,fontWeight:700 }}>Change</p>
        </button>

        {showMode && (
          <div className="ls-fadein" style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px",marginTop:8 }}>
            <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:12,fontWeight:500 }}>What do you want LifeSmart to focus on?</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {PRIORITY_MODES.map(m=>{
                const sel = m.id===(state.profile?.mode||"grow")
                return (
                  <button key={m.id} onClick={()=>{ save({...state,profile:{...state.profile,mode:m.id}}); setShowMode(false) }}
                    style={{ background:sel?m.dim:T.faint,border:`1.5px solid ${sel?m.color:T.border}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left" }}>
                    <span style={{ fontSize:20 }}>{m.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ color:sel?T.white:"#CBD5E1",fontWeight:700,fontSize:14 }}>{m.label}</p>
                      <p style={{ color:sel?"#CBD5E1":"#7A8FA8",fontSize:12 }}>{m.sub}</p>
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
  const [showQuiz, setShowQuiz] = useState(false)
  if(showQuiz) return <PersonalityQuiz state={state} save={save} onClose={()=>setShowQuiz(false)}/>
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
              {state.profile.age && <p style={{ color:"#CBD5E1",fontSize:13,marginBottom:4 }}>Age {state.profile.age}</p>}
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:14 }}>{lvl.emoji}</span>
                <span style={{ color:"#CBD5E1",fontSize:13 }}>Level {lvl.level} {lvl.label}</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:T.teal,fontWeight:900,fontSize:24 }}>{xp}</p>
              <p style={{ color:"#7A8FA8",fontSize:12 }}>XP</p>
            </div>
          </div>
          {nextLvl && (
            <div>
              <div style={{ background:T.surface,borderRadius:99,height:8,overflow:"hidden",marginBottom:5 }}>
                <div style={{ width:`${pctToNext}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.tealMid})`,borderRadius:99,transition:"width .8s ease" }}/>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between" }}>
                <span style={{ color:"#7A8FA8",fontSize:12 }}>{xp} XP</span>
                <span style={{ color:"#7A8FA8",fontSize:12 }}>{nextLvl.emoji} {nextLvl.label} at {nextLvl.min} XP</span>
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

        {/* Money Personality Card */}
        <MoneyPersonalityCard state={state} save={save} onOpenQuiz={()=>setShowQuiz(true)}/>

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
                    <p style={{ color:"#7A8FA8",fontSize:12 }}>{l.min} XP</p>
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

        <p style={{ color:"#7A8FA8",fontSize:12,textAlign:"center",marginTop:16 }}>🔒 Your data stays on your device LifeSmart</p>
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
    { icon:TrendingUp, label:"Track", idx:2 },
    { icon:User,       label:"Me",    idx:3 },
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
  const CONTENT = [<HomeTab/>, <LearnTab/>, <TrackTab/>, <MeTab/>]

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
