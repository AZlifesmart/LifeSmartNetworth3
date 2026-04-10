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
   12 scenario questions · 7 dimensions · 10 archetypes
   ════════════════════════════════════════════════════════════════════ */
const PERSONALITY_QUIZ = [
  {
    id:"q1",
    headline:"You receive an unexpected bonus at work.",
    sub:"What is your very first thought?",
    options:[
      { label:"That is going straight into savings", scores:{ security_growth:15, present_future:55, planned_spontaneous:20 } },
      { label:"I have been wanting something for a while, now I can get it", scores:{ present_future:15, abundance_scarcity:75, planned_spontaneous:70 } },
      { label:"Let me figure out the smartest thing to do with it", scores:{ security_growth:60, emotional_analytical:80, planned_spontaneous:10 } },
      { label:"I will enjoy some of it now and put the rest to good use", scores:{ security_growth:55, abundance_scarcity:70, present_future:50 } },
    ]
  },
  {
    id:"q2",
    headline:"A friend tells you about an investment that doubled their money.",
    sub:"What is your gut reaction?",
    options:[
      { label:"Good for them but that sounds too risky for me", scores:{ security_growth:10, planned_spontaneous:25, abundance_scarcity:45 } },
      { label:"I want to understand exactly what it was and how it worked", scores:{ security_growth:60, emotional_analytical:80, independent_social:40 } },
      { label:"Tell me more, I want in", scores:{ security_growth:90, planned_spontaneous:75, abundance_scarcity:80 } },
      { label:"I would check with a few other people I trust before doing anything", scores:{ security_growth:45, independent_social:80, emotional_analytical:40 } },
    ]
  },
  {
    id:"q3",
    headline:"You could have an extra £500 a month.",
    sub:"Which would you choose?",
    options:[
      { label:"More money to enjoy life right now", scores:{ present_future:10, abundance_scarcity:65, planned_spontaneous:60 } },
      { label:"More going toward my future and retirement", scores:{ present_future:90, security_growth:40, planned_spontaneous:25 } },
      { label:"Pay off debts or bills faster", scores:{ present_future:50, security_growth:20, abundance_scarcity:35 } },
      { label:"Invest it so it grows over time", scores:{ present_future:75, security_growth:75, emotional_analytical:60 } },
    ]
  },
  {
    id:"q4",
    headline:"How do you make big financial decisions?",
    sub:"Things like a major purchase, switching provider, or choosing where to put your money.",
    options:[
      { label:"Research everything, compare all the options, then decide", scores:{ planned_spontaneous:5, emotional_analytical:85, independent_social:20 } },
      { label:"Go with my gut and commit fairly quickly", scores:{ planned_spontaneous:80, emotional_analytical:20, independent_social:25 } },
      { label:"Ask someone I trust for their opinion first", scores:{ planned_spontaneous:40, independent_social:85, emotional_analytical:35 } },
      { label:"Put it off until I feel completely sure", scores:{ planned_spontaneous:25, emotional_analytical:45, abundance_scarcity:25 } },
    ]
  },
  {
    id:"q5",
    headline:"How often do you check your bank balance?",
    sub:"Pick whichever is closest to reality.",
    options:[
      { label:"Most days, I like knowing exactly where things stand", scores:{ planned_spontaneous:10, abundance_scarcity:35, emotional_analytical:75 } },
      { label:"Once a week or so, just to keep a rough eye on things", scores:{ planned_spontaneous:55, abundance_scarcity:55, emotional_analytical:50 } },
      { label:"Honestly I avoid it, it makes me anxious", scores:{ planned_spontaneous:80, abundance_scarcity:10, emotional_analytical:20 } },
      { label:"Only after spending a lot, just to make sure everything is fine", scores:{ planned_spontaneous:40, abundance_scarcity:50, emotional_analytical:60 } },
    ]
  },
  {
    id:"q6",
    headline:"When you spend money on yourself.",
    sub:"A nice meal, a holiday, something you have wanted for a while.",
    options:[
      { label:"I feel great, I have earned this", scores:{ abundance_scarcity:90, status_freedom:55, present_future:20 } },
      { label:"I enjoy it but I am always aware of the cost", scores:{ abundance_scarcity:55, emotional_analytical:50, planned_spontaneous:30 } },
      { label:"I often feel a bit guilty afterwards", scores:{ abundance_scarcity:25, status_freedom:50, emotional_analytical:30 } },
      { label:"I find it genuinely hard to justify spending on myself", scores:{ abundance_scarcity:10, status_freedom:65, planned_spontaneous:15 } },
    ]
  },
  {
    id:"q7",
    headline:"Someone your age mentions they are doing really well financially.",
    sub:"What is your honest internal reaction?",
    options:[
      { label:"Good for them, I do not really compare myself to others on money", scores:{ status_freedom:85, abundance_scarcity:80, independent_social:20 } },
      { label:"It makes me want to check my own situation and see where I stand", scores:{ status_freedom:40, abundance_scarcity:45, emotional_analytical:55 } },
      { label:"I feel a bit behind and it bothers me more than I would admit", scores:{ status_freedom:20, abundance_scarcity:15, emotional_analytical:25 } },
      { label:"I want to know what they are doing differently so I can learn", scores:{ status_freedom:65, abundance_scarcity:60, independent_social:70 } },
    ]
  },
  {
    id:"q8",
    headline:"Your investments drop 30% in a market crash.",
    sub:"A few months later they are still down. What do you actually do?",
    options:[
      { label:"I had already moved things to safety when it started dropping", scores:{ security_growth:10, emotional_analytical:60, planned_spontaneous:15 } },
      { label:"I feel awful about it but I know I should not sell", scores:{ security_growth:40, emotional_analytical:25, abundance_scarcity:45 } },
      { label:"I do not look, I set it up for the long term and I trust the process", scores:{ security_growth:65, emotional_analytical:55, present_future:80 } },
      { label:"I see it as a buying opportunity while everything is cheap", scores:{ security_growth:90, emotional_analytical:70, abundance_scarcity:85 } },
    ]
  },
  {
    id:"q9",
    headline:"Do you feel financially behind?",
    sub:"Compared to where you think you should be at your age.",
    options:[
      { label:"Rarely, I feel broadly on track", scores:{ abundance_scarcity:85, status_freedom:65 } },
      { label:"Sometimes, depending on my mood", scores:{ abundance_scarcity:55, status_freedom:45 } },
      { label:"Quite often, I worry I have not done enough", scores:{ abundance_scarcity:25, status_freedom:30 } },
      { label:"Almost always, it is a persistent background feeling", scores:{ abundance_scarcity:10, status_freedom:25 } },
    ]
  },
  {
    id:"q10",
    headline:"Someone close to you wants to start a business together.",
    sub:"The idea is genuinely good and they need you to put in £15,000.",
    options:[
      { label:"I would need a proper plan and written agreement before anything", scores:{ planned_spontaneous:5, emotional_analytical:85, security_growth:45 } },
      { label:"If I believe in the person and the idea then I am in", scores:{ planned_spontaneous:80, emotional_analytical:15, security_growth:70, independent_social:65 } },
      { label:"I would want to but that is too much to risk on something uncertain", scores:{ security_growth:20, abundance_scarcity:30, emotional_analytical:50 } },
      { label:"I would suggest starting smaller first to test whether it works", scores:{ planned_spontaneous:30, emotional_analytical:65, security_growth:55 } },
    ]
  },
  {
    id:"q11",
    headline:"When you think about retirement, what comes to mind first?",
    sub:"Pick whichever feels most true.",
    options:[
      { label:"I worry I will not have saved enough no matter what I do", scores:{ security_growth:15, abundance_scarcity:20, present_future:75 } },
      { label:"It totally depends on the lifestyle I want, there is no fixed number", scores:{ emotional_analytical:70, abundance_scarcity:55, status_freedom:60 } },
      { label:"I do not need much, a simple life with no money stress sounds perfect", scores:{ abundance_scarcity:70, status_freedom:80, present_future:45 } },
      { label:"I have got plenty of time to grow my money before then", scores:{ security_growth:80, present_future:65, emotional_analytical:60 } },
    ]
  },
  {
    id:"q12",
    headline:"Your honest relationship with money.",
    sub:"Which comes closest to how you actually feel?",
    options:[
      { label:"Money is safety, having enough means I can stop worrying", scores:{ security_growth:15, abundance_scarcity:25, status_freedom:55 } },
      { label:"Money is a tool, I want it working hard and growing", scores:{ security_growth:65, emotional_analytical:55, status_freedom:60 } },
      { label:"Money is freedom, I want enough to live life on my own terms", scores:{ security_growth:50, abundance_scarcity:65, status_freedom:90 } },
      { label:"Money is complicated, I wish I felt more confident with it", scores:{ abundance_scarcity:30, security_growth:35, independent_social:60 } },
    ]
  },
]

// Dimensions: 0-100 scale
// security_growth:      0=security-first    100=growth-seeking
// present_future:       0=present-focused   100=future-focused
// planned_spontaneous:  0=methodical        100=spontaneous
// independent_social:   0=self-reliant      100=socially-oriented
// abundance_scarcity:   0=scarcity-minded   100=abundance-minded
// emotional_analytical: 0=emotion-led       100=data-led
// status_freedom:       0=status-driven     100=freedom-driven

function calcQuizPersonality(answers, state) {
  const scores = { security_growth:0, present_future:0, planned_spontaneous:0, independent_social:0, abundance_scarcity:0, emotional_analytical:0, status_freedom:0 }
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

  const norm = {}
  Object.keys(scores).forEach(dim => { norm[dim] = counts[dim] > 0 ? Math.round(scores[dim] / counts[dim]) : 50 })

  // Blend with behavioural data (30% weight)
  const assets = state.assets||[], debts = state.debts||[]
  const totalA = assets.reduce((s,a)=>s+(a.value||0),0)
  const invested = assets.filter(a=>["investments","stocks"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0)
  const pension = assets.filter(a=>a.category==="pension").reduce((s,a)=>s+(a.value||0),0)
  if(totalA > 0) {
    const investRatio = (invested+pension)/totalA
    norm.security_growth = Math.round(norm.security_growth*0.7 + (investRatio*100)*0.3)
  }
  if(assets.length >= 4) norm.planned_spontaneous = Math.max(0, norm.planned_spontaneous - 8)

  // Classify
  const sg = norm.security_growth > 58 ? "growth" : norm.security_growth < 42 ? "security" : "balanced"
  const pf = norm.present_future > 58 ? "future" : norm.present_future < 42 ? "present" : "balanced"
  const ps = norm.planned_spontaneous > 58 ? "spontaneous" : norm.planned_spontaneous < 42 ? "planned" : "balanced"
  const is_ = norm.independent_social > 55 ? "social" : "independent"
  const as_ = norm.abundance_scarcity > 58 ? "abundance" : norm.abundance_scarcity < 42 ? "scarcity" : "balanced"
  const ea = norm.emotional_analytical > 58 ? "analytical" : norm.emotional_analytical < 42 ? "emotional" : "balanced"
  const sf = norm.status_freedom > 58 ? "freedom" : norm.status_freedom < 42 ? "status" : "balanced"

  // 10 archetypes from primary 3 dimensions
  const ARCHETYPES = {
    "security-planned": { id:"sentinel", name:"The Sentinel", emoji:"🛡️", color:T.green,
      headline:"Careful, consistent, always prepared.",
      summary:"You build financial security methodically. Emergency funds, insurance, fixed rates \u2014 you want certainty before growth. This discipline is rare and genuinely valuable. The risk is that excessive caution costs you significant returns over decades.",
      traits:["Maintains a well-funded emergency reserve","Prefers guaranteed returns over uncertain gains","Researches thoroughly before any financial commitment","Uncomfortable with debt of any kind","Strong financial discipline and consistency"],
      scenarios:["You have a mental number your bank balance must never drop below","When someone suggests something risky your first instinct is to think about what could go wrong","You find it hard to spend freely on yourself even when you can clearly afford it","You feel a sense of unease when you do not have a clear financial plan","You would rather miss an opportunity than make a mistake"],
      advice:["Your biggest risk is actually not taking enough risk. Inflation quietly eats away at cash savings every year.","Consider separating your money into safety money and growth money. The safety portion gives you peace of mind while the growth portion works harder.","Try to distinguish between genuine financial danger and discomfort with uncertainty. They feel the same but they are very different."],
      blind_spot:"Your caution may be your most expensive financial habit. Over 30 years, the difference between 2% savings and 7% investment growth on \u00A3500/month is over \u00A3300,000. Safety has a price.",
      next_step:"Try moving a small amount beyond your safety net into something with higher growth potential. Start small enough that it does not keep you up at night." },

    "security-spontaneous": { id:"guardian", name:"The Guardian", emoji:"🏠", color:"#60A5FA",
      headline:"Protective instincts, flexible approach.",
      summary:"You want security but you do not overthink the path to get there. You trust your instincts more than spreadsheets and value feeling safe over optimising returns. Money is primarily about protection for yourself and the people you care about.",
      traits:["Prioritises financial safety for family and loved ones","Makes decisions based on gut feel rather than data","Values owning things you can see and touch","Generous with money when people need help","Less interested in tracking performance numbers"],
      scenarios:["You would lend money to someone you care about without needing a written agreement","You trust how a decision feels more than what a spreadsheet says","You are probably the person others come to when they need financial help","You have a general sense your finances are fine without knowing the exact details","You value peace of mind over maximum returns"],
      advice:["Your generosity is a strength but make sure your own foundations are solid before helping others.","Write down roughly how much you have saved for retirement and compare it to a basic target for your age. The answer might surprise you.","Consider whether the financial decisions you are avoiding out of discomfort are actually the most important ones to make."],
      blind_spot:"Generosity without structure can leave you exposed. Helping others financially before securing your own foundation is a pattern worth examining.",
      next_step:"Check what percentage of your income is going toward your future. If you are not sure, that is the first thing to find out." },

    "growth-planned": { id:"navigator", name:"The Navigator", emoji:"🧭", color:T.purple,
      headline:"Strategic, research-driven, building with intention.",
      summary:"You combine growth ambition with genuine discipline, the most effective financial personality in research. You research before you act, build structured plans, and follow through. The danger is analysis paralysis. The cost of delayed action often exceeds the cost of an imperfect decision.",
      traits:["Research-led decision maker who compares options thoroughly","Clear financial goals with timelines attached","Comfortable with calculated risk","Tracks progress and metrics regularly","Balances present lifestyle with long-term wealth building"],
      scenarios:["You probably have multiple tabs open right now comparing options for something","You find this kind of quiz genuinely interesting rather than annoying","You have a clear picture of where you want to be financially in 5 to 10 years","You enjoy optimising things and finding the best strategy","You have probably spent longer researching a decision than it would take to just try it"],
      advice:["Set yourself a research deadline for any financial decision. Two weeks of research is enough for almost anything.","Your tendency to optimise is powerful but remember that a good decision made now beats a perfect decision made in six months.","You are probably further ahead than you think. Make sure you take time to appreciate the progress you have already made."],
      blind_spot:"You can research indefinitely when taking a reasonable action six months ago would have been better. The perfect plan started late loses to the good one started now.",
      next_step:"Identify the financial decision you have been sitting on the longest and commit to it this week." },

    "growth-spontaneous": { id:"accelerator", name:"The Accelerator", emoji:"🚀", color:T.teal,
      headline:"Bold moves, high conviction, long game.",
      summary:"You think big and move fast. Market drops do not scare you, they excite you. You back your own judgement and are comfortable with significant financial risk. Your confidence is genuinely an asset but without proper foundations, a single bad decision can set you back years.",
      traits:["Comfortable with volatility and uncertainty","Makes financial decisions with speed and conviction","Attracted to growth opportunities","Less interested in detailed budgeting or tracking","High financial confidence, sometimes overconfidence"],
      scenarios:["When things go wrong financially your instinct is opportunity rather than panic","You have probably made at least one financial move that others thought was too bold","Detailed budgeting feels pointless to you because you would rather earn more than cut back","You back your own judgement over most advice you receive","You are comfortable with levels of financial uncertainty that would keep other people awake at night"],
      advice:["Your confidence is an asset but make sure you have a proper safety net before making bold moves. Foundations let you take bigger risks.","Ask yourself whether you are genuinely diversified or just feel diversified. Concentrated bets feel exciting but they are the most common way confident people lose big.","Consider finding one person whose financial judgement you respect and using them as a sounding board."],
      blind_spot:"Confidence without diversification is gambling dressed up as strategy. Check whether you have adequate insurance, an emergency fund, and a will.",
      next_step:"Verify your foundations: 3 months emergency fund, no single asset over 20% of your wealth, and basic protection in place." },

    "balanced-planned": { id:"architect", name:"The Architect", emoji:"🏗️", color:"#60A5FA",
      headline:"Foundations first, then build upward.",
      summary:"You take a balanced, methodical approach to money. Neither reckless nor overly cautious, you want to understand things properly before committing. You probably have solid foundations but may be leaving returns on the table by staying too middle of the road.",
      traits:["Balanced risk tolerance, neither aggressive nor very conservative","Methodical decision-making process","Good financial foundations already in place","Values understanding before acting","Comfortable with mainstream approaches to money"],
      scenarios:["You probably have savings, a pension, and a general sense that things are in order","A balanced approach feels more natural to you than anything extreme","You would happily use professional advice if you found someone you genuinely trusted","You are more likely to increase existing contributions than to try something completely new","You tend to read the details before signing up to anything financial"],
      advice:["Being balanced is safe but ask yourself whether your current approach genuinely matches your time horizon or just your comfort zone.","If you are under 45, you can almost certainly afford to take more growth risk than you currently are. Time is on your side.","Consider setting one ambitious financial goal that pushes you slightly outside your comfort zone. Growth happens at the edges."],
      blind_spot:"Being balanced everywhere can mean being exceptional nowhere. Your allocation may reflect your comfort zone rather than your actual time horizon.",
      next_step:"Review whether your current approach is appropriate for your age and goals. If you are young, more growth exposure is almost always worth considering." },

    "balanced-spontaneous": { id:"freestyler", name:"The Freestyler", emoji:"🌊", color:T.amber,
      headline:"Adaptable, instinctive, opportunity-aware.",
      summary:"You are financially adaptable. You do not follow rigid plans but you are not reckless either. You trust your instincts, adjust as life changes, and generally land on your feet. The risk is that without structure, money quietly leaks through lifestyle inflation.",
      traits:["Financially adaptable and comfortable with uncertainty","Trusts intuition over detailed financial analysis","Does not follow rigid budgets but generally manages fine","Responds to opportunities as they arise","Comfortable talking about money with people close to you"],
      scenarios:["You do not have a detailed budget but have a rough sense of your finances","You probably have money sitting somewhere earning almost nothing because you have not got around to sorting it","You deal with financial admin in bursts rather than consistently","You are more likely to say yes to a spontaneous plan than check your budget first","You generally land on your feet financially but could not explain exactly how"],
      advice:["The single most powerful thing you can do is automate your savings. Set up a transfer on payday before the money hits your spending account.","You are probably losing more to inaction than to bad decisions. Spending 30 minutes moving idle cash could be worth thousands over time.","Your flexibility is a genuine strength. Combine it with just one or two automated habits and you will be in a very strong position."],
      blind_spot:"Without automation, your financial future depends entirely on willpower, and willpower is unreliable. Automate the important things and your natural adaptability handles the rest.",
      next_step:"Set up one automated transfer on payday. Even 10% of your income moved automatically will transform your finances over time." },

    "scarcity-any": { id:"steward", name:"The Steward", emoji:"⚖️", color:T.amber,
      headline:"Watchful, careful, deeply aware of money.",
      summary:"Money carries significant emotional weight for you. You think about it more than most people and that vigilance has likely kept you out of trouble. But it may also be holding you back from enjoying what you have earned, from investing for growth, or from feeling at peace even when your numbers are actually fine.",
      traits:["Highly aware of your financial position at all times","Tends to save rather than spend or invest","Feels genuine anxiety about money even when things are stable","May feel behind peers regardless of actual position","Strong aversion to financial risk and debt"],
      scenarios:["You probably know your bank balance within a small margin right now","Spending on yourself triggers guilt more often than enjoyment","You check prices on things even when the purchase is well within your means","You would always choose certainty over a better expected outcome","The thought of not having savings set aside causes you real discomfort"],
      advice:["Write down the specific fear you have about money. Then look at your actual numbers and check whether that fear is supported by reality.","Give yourself a guilt-free spending budget, a specific amount each month that you are allowed to enjoy without justifying it.","Being too cautious carries its own risk. Keeping everything in cash means inflation is quietly reducing your purchasing power every year."],
      blind_spot:"Your vigilance protects you from risks that may not be real while exposing you to the very real risk of under-growing your wealth. Inflation is the silent tax on caution.",
      next_step:"Write down your specific money worry. Then check whether your actual numbers support it. Seeing the gap between fear and reality is the first step to financial peace." },

    "status-growth": { id:"competitor", name:"The Competitor", emoji:"🏆", color:T.amber,
      headline:"Driven, ambitious, measuring progress.",
      summary:"You are motivated by financial progress and you benchmark yourself against others, whether you fully admit it or not. This competitive drive can fuel excellent outcomes. The risk is that enough never feels like enough and the goalpost keeps moving.",
      traits:["Financially ambitious and goal-oriented","Benchmarks progress against peers or targets","Attracted to high-growth opportunities and advancement","Values financial success as proof of capability","May link self-worth to financial performance"],
      scenarios:["You have a rough idea of what people in your field earn and where you sit","Hearing about someone else doing well financially makes you want to check your own position","You are the type to negotiate hard or push for more","Financial setbacks feel personal, not just practical","You feel a sense of achievement when you see your numbers go up"],
      advice:["Define what enough actually means to you. Write down a specific number. Without it you are running a race with no finish line.","Try to separate your self-worth from your net worth. Financial progress is great but it should not be the only measure of a life well lived.","Channel your competitive energy into beating your own previous performance rather than comparing to others. That is a race you can actually win."],
      blind_spot:"If your financial self-worth is tied to a number, no number will ever be enough. Success without a clear definition of enough becomes an endless race.",
      next_step:"Define your personal enough number, the point at which you would feel genuinely secure. Write it down and build toward it with intention." },

    "freedom-growth": { id:"pioneer", name:"The Pioneer", emoji:"⚡", color:T.teal,
      headline:"Freedom-focused, growth-oriented, unconventional.",
      summary:"Money means options to you. You are not interested in impressing anyone, you want the freedom to live on your own terms. You are willing to take financial risks to get there and you think long-term. Your independence is genuine and your instincts are often good.",
      traits:["Motivated by financial independence above all else","Comfortable with unconventional strategies","Values time freedom over material status","Thinks long-term about wealth and compounding","Prefers self-directed learning to outside advice"],
      scenarios:["You have thought seriously about what it would take to never need to work again","You would take a pay cut for significantly more freedom over your time","You question conventional financial wisdom rather than just following it","You spend less than you earn not because you are frugal but because status spending does not interest you","You prefer figuring things out yourself over paying someone else"],
      advice:["Your independence is a strength but it can become isolation. Getting a second opinion does not mean giving up control.","Make sure your pursuit of freedom is not causing you to skip important foundations like insurance, a will, or proper tax planning.","The fastest path to freedom might involve temporarily accepting help from someone who has already achieved what you want."],
      blind_spot:"Independence can become isolation. A good adviser is not someone who tells you what to do, they are a stress test for your own thinking.",
      next_step:"Find one person whose financial judgement you respect and share your plan with them. Not to follow their advice, but to pressure-test your thinking." },

    "freedom-planned": { id:"cultivator", name:"The Cultivator", emoji:"🌱", color:T.green,
      headline:"Patient, purposeful, quietly building.",
      summary:"You are building financial freedom methodically and patiently. No flashy moves, no panic decisions, just consistent, deliberate progress. You understand that wealth is built in decades, not days. Your patience is genuinely rare and powerful.",
      traits:["Consistent long-term saver and investor","Values financial independence as the ultimate goal","Patient with compound growth","Prefers automated, systematic approaches","Does not need external validation of financial progress"],
      scenarios:["You are the kind of person who sets something up once and lets it run for years","You find more comfort in slow steady progress than in dramatic wins","You would rather be consistently good than occasionally brilliant with money","You do not feel the need to tell people about your financial progress","You trust time more than timing when it comes to building wealth"],
      advice:["Your consistency is rare and powerful. Make sure you are reviewing your approach at least once a year to check it still fits your life stage.","Patience can sometimes become passivity. Set a calendar reminder to review your plan annually.","You are probably in a stronger position than most people your age. Take a moment to appreciate that."],
      blind_spot:"Patience is your superpower but it can become passivity. Review your plan annually to make sure it still fits your life stage and goals.",
      next_step:"Set an annual review date in your calendar. Check whether your contributions, approach, and protection are still right for where you are now." },
  }
  // Match archetype
  const priSG = sg === "balanced" ? "balanced" : sg
  const priPS = ps === "balanced" ? "planned" : ps
  let key

  // Scarcity mindset is a strong enough signal to be its own archetype
  if(as_ === "scarcity" && norm.abundance_scarcity < 35) key = "scarcity-any"
  // Status + growth combination
  else if(sf === "status" && sg !== "security") key = "status-growth"
  // Freedom + growth
  else if(sf === "freedom" && sg !== "security" && ps !== "planned") key = "freedom-growth"
  // Freedom + planned
  else if(sf === "freedom" && ps === "planned") key = "freedom-planned"
  // Primary: security/growth × planned/spontaneous
  else key = `${priSG}-${priPS}`

  const archetype = ARCHETYPES[key] || ARCHETYPES["balanced-planned"]

  return {
    scores: norm,
    dimensions: { sg, pf, ps, is_, as_, ea, sf },
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


const NORTH_STAR_OPTIONS = [
  { id:"own_home",     emoji:"🏠", label:"Own my own home",             sub:"Stop paying someone else's mortgage. A place that's truly yours.",           color:T.green,  defaultTarget:40000 },
  { id:"retire_early", emoji:"🏖️", label:"Retire on my own terms",      sub:"Work because you want to, not because you have to.",                         color:T.teal,   defaultTarget:null },
  { id:"debt_free",    emoji:"💳", label:"Become completely debt free",  sub:"Never owe anyone anything again. Total financial clarity.",                  color:T.red,    defaultTarget:null },
  { id:"peace",        emoji:"🛡️", label:"Never worry about money",     sub:"Sleep soundly knowing you and your family are financially secure.",          color:T.blue,   defaultTarget:null },
  { id:"freedom",      emoji:"🌍", label:"Total financial freedom",      sub:"Have enough that every day is yours to choose how to spend.",                color:T.purple, defaultTarget:null },
  { id:"business",     emoji:"🚀", label:"Build something of my own",   sub:"Go freelance, start a business, bet on yourself.",                           color:T.amber,  defaultTarget:20000 },
  { id:"family",       emoji:"💛", label:"Give my family a better life", sub:"Break the cycle. Build something that lasts beyond you.",                    color:T.green,  defaultTarget:null },
  { id:"wedding",      emoji:"💍", label:"Get married",                  sub:"The celebration you deserve without the financial stress.",                   color:"#F9A8D4",defaultTarget:25000 },
  { id:"custom",       emoji:"⭐", label:"Something else",               sub:"You know what drives you. Name it.",                                         color:T.muted,  defaultTarget:null },
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
  goals:[], history:[], completedLessons:[], completedLevels:[], currentLevel:1, pendingLearnLevel:null, pendingLessonN:null, lessonReturnTab:null, badges:[],
  priorityGoals: [],
  northStar: null,
  dashboardTiles: []
}

const load = () => { try { const s=localStorage.getItem("ls_v1"); return s?{...DEFAULTS,...JSON.parse(s)}:DEFAULTS } catch { return DEFAULTS } }

/* ════════════════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════════════════ */
let CURRENCY_SYMBOL = "£"
const CURRENCY_OPTIONS = [
  { code:"GBP", symbol:"£", country:"United Kingdom", flag:"🇬🇧" },
  { code:"USD", symbol:"$", country:"United States",  flag:"🇺🇸" },
  { code:"EUR", symbol:"€", country:"Europe",         flag:"🇪🇺" },
  { code:"AUD", symbol:"A$",country:"Australia",      flag:"🇦🇺" },
  { code:"CHF", symbol:"CHF", country:"Switzerland",  flag:"🇨🇭" },
  { code:"AED", symbol:"د.إ", country:"UAE",          flag:"🇦🇪" },
  { code:"PKR", symbol:"₨", country:"Pakistan",       flag:"🇵🇰" },
  { code:"ZAR", symbol:"R", country:"South Africa",   flag:"🇿🇦" },
  { code:"SGD", symbol:"S$",country:"Singapore",      flag:"🇸🇬" },
  { code:"KES", symbol:"KSh", country:"Kenya",        flag:"🇰🇪" },
  { code:"VND", symbol:"₫", country:"Vietnam",        flag:"🇻🇳" },
  { code:"CAD", symbol:"C$",country:"Canada",         flag:"🇨🇦" },
  { code:"INR", symbol:"₹", country:"India",          flag:"🇮🇳" },
]
function setCurrencySymbol(s) { if(s) CURRENCY_SYMBOL = s }
const fmt  = v => { if(v==null||isNaN(v)) return `${CURRENCY_SYMBOL}0`; const a=Math.abs(Math.round(v)).toLocaleString("en-GB"); return v<0?`-${CURRENCY_SYMBOL}${a}`:`${CURRENCY_SYMBOL}${a}` }
const fmtK = v => { if(v==null||isNaN(v)) return `${CURRENCY_SYMBOL}0`; const a=Math.abs(v); return a>=1000000?`${CURRENCY_SYMBOL}${(a/1e6).toFixed(1)}M`:a>=1000?`${CURRENCY_SYMBOL}${(a/1000).toFixed(0)}k`:`${CURRENCY_SYMBOL}${Math.round(a)}` }

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

  // Keep currency symbol in sync with profile setting
  useEffect(() => {
    const code = state.profile?.currency
    if (code) {
      const opt = CURRENCY_OPTIONS.find(c => c.code === code)
      if (opt) setCurrencySymbol(opt.symbol)
    }
  }, [state.profile?.currency])

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

  if(screen==="welcome")   return <WelcomeScreen  onNext={({mode,name:n,age:a,currency})=>{ save({...state,profile:{...state.profile,mode:mode||"grow",currency:currency||"GBP"}}); if(n) setName(n); if(a) setAge(a); setScreen("assets") }} />
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
  const [currency, setCurrencyLocal] = useState("GBP")
  const [showCurrency, setShowCurrency] = useState(false)

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

      {/* Currency picker (top-right) */}
      <div style={{ position:"absolute", top:18, right:18, zIndex:5 }}>
        <button onClick={()=>setShowCurrency(true)} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:99, padding:"7px 12px", color:"#FFFFFF", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
          {(CURRENCY_OPTIONS.find(c=>c.code===currency)||CURRENCY_OPTIONS[0]).flag} {currency}
          <span style={{ opacity:.6, fontSize:10 }}>▾</span>
        </button>
      </div>

      {showCurrency && (
        <div onClick={()=>setShowCurrency(false)} style={{ position:"fixed", inset:0, background:"rgba(7,13,26,.85)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"22px 18px", maxWidth:380, width:"100%", maxHeight:"80vh", overflowY:"auto" }}>
            <p style={{ color:T.white, fontWeight:900, fontSize:17, marginBottom:6 }}>Choose your currency</p>
            <p style={{ color:"#8FA3BE", fontSize:12, marginBottom:14, lineHeight:1.5 }}>This sets the symbol used for your figures. Lessons and benchmarks remain UK-based.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {CURRENCY_OPTIONS.map(c => {
                const sel = currency === c.code
                return (
                  <button key={c.code} onClick={()=>{ setCurrencyLocal(c.code); setShowCurrency(false) }}
                    style={{ background:sel?T.tealDim:T.surface, border:`1.5px solid ${sel?T.teal:T.border}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                    <span style={{ fontSize:20 }}>{c.flag}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ color:sel?T.teal:T.white, fontWeight:800, fontSize:13 }}>{c.country}</p>
                      <p style={{ color:"#8FA3BE", fontSize:11 }}>{c.code} · {c.symbol}</p>
                    </div>
                    {sel && <Check size={14} color={T.teal}/>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

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
        <button onClick={()=>{ if(name && age) onNext({ mode:mode||"grow", name, age, currency }) }}
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

function NorthStarSelector({ onSelect, onClose }) {
  const [selected, setSelected] = useState(null)
  const [customLabel, setCustomLabel] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentSaved, setCurrentSaved] = useState("")
  const ns = NORTH_STAR_OPTIONS.find(n => n.id === selected)

  function confirm() {
    if (!selected) return
    const star = {
      id: selected,
      label: selected === "custom" ? (customLabel || "My goal") : ns.label,
      emoji: ns.emoji,
      color: ns.color,
      targetAmount: targetAmount ? parseFloat(targetAmount) : ns.defaultTarget,
      currentSaved: currentSaved ? parseFloat(currentSaved) : 0,
      createdAt: new Date().toISOString(),
    }
    onSelect(star)
  }

  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:300,overflowY:"auto" }}>
      <div style={{ maxWidth:520,margin:"0 auto",padding:"24px 20px 60px" }}>
        {onClose && <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:20,padding:4,marginBottom:12 }}>←</button>}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <p style={{ fontSize:40,marginBottom:12 }}>🌟</p>
          <h1 style={{ color:T.white,fontWeight:900,fontSize:24,lineHeight:1.2,marginBottom:8 }}>What is your North Star?</h1>
          <p style={{ color:"#C8D8EC",fontSize:14,lineHeight:1.6 }}>The one thing you want more than anything else financially. Everything in this app will help you get there.</p>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:24 }}>
          {NORTH_STAR_OPTIONS.filter(opt => !selected || selected === opt.id).map(ns => {
            const sel = selected === ns.id
            return (
              <button key={ns.id} onClick={() => setSelected(sel ? null : ns.id)}
                style={{ background:sel ? `${ns.color}12` : T.card, border:`2px solid ${sel ? ns.color : T.border}`,
                  borderRadius:16, padding:"16px 18px", cursor:"pointer", fontFamily:"inherit",
                  display:"flex", alignItems:"center", gap:14, textAlign:"left", transition:"all .15s" }}>
                <span style={{ fontSize:26,flexShrink:0 }}>{ns.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:sel ? T.white : "#E2EAF6", fontWeight:800, fontSize:15 }}>{ns.label}</p>
                  <p style={{ color:sel ? "#C8D8EC" : "#6B8CB8", fontSize:12, lineHeight:1.4, marginTop:2 }}>{ns.sub}</p>
                </div>
                {sel && <p style={{ color:ns.color,fontSize:11,fontWeight:700,flexShrink:0 }}>Change</p>}
              </button>
            )
          })}
        </div>

        {selected && (
          <div className="ls-fadein" style={{ marginBottom:24 }}>
            {selected === "custom" && (
              <div style={{ marginBottom:12 }}>
                <p style={{ color:T.muted,fontSize:12,fontWeight:600,marginBottom:6 }}>Name your goal</p>
                <input type="text" value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder="e.g. Travel the world"
                  style={{ width:"100%",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"12px 14px",color:T.white,fontSize:15,fontFamily:"inherit",outline:"none" }}/>
              </div>
            )}
            {(ns?.defaultTarget || selected === "custom") && (
              <div>
                <p style={{ color:T.muted,fontSize:12,fontWeight:600,marginBottom:6 }}>How much do you need? (optional)</p>
                <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
                  <span style={{ padding:"0 12px",color:T.muted,fontSize:17,fontWeight:700 }}>£</span>
                  <input type="number" min="0" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder={ns?.defaultTarget ? String(ns.defaultTarget) : "0"}
                    style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"12px 12px 12px 0",fontFamily:"inherit" }}/>
                </div>
                <p style={{ color:"#6B8CB8",fontSize:11,marginTop:4 }}>You can always change this later</p>
              </div>
            )}
            {(ns?.defaultTarget || selected === "custom") && (
              <div style={{ marginTop:14 }}>
                <p style={{ color:T.muted,fontSize:12,fontWeight:600,marginBottom:6 }}>How much have you already saved toward this? (optional)</p>
                <div style={{ display:"flex",alignItems:"center",background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
                  <span style={{ padding:"0 12px",color:T.muted,fontSize:17,fontWeight:700 }}>£</span>
                  <input type="number" min="0" value={currentSaved} onChange={e => setCurrentSaved(e.target.value)} placeholder="0"
                    style={{ flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"12px 12px 12px 0",fontFamily:"inherit" }}/>
                </div>
                <p style={{ color:"#6B8CB8",fontSize:11,marginTop:4 }}>Only count money you have specifically set aside for this goal</p>
              </div>
            )}
          </div>
        )}

        <button onClick={confirm} disabled={!selected}
          style={{ width:"100%",background:selected ? `linear-gradient(135deg,${T.teal},${T.tealMid})` : T.subtle,
            border:"none",borderRadius:16,padding:"16px",color:selected ? T.bg : T.muted,
            fontWeight:900,fontSize:16,cursor:selected ? "pointer" : "not-allowed",fontFamily:"inherit" }}>
          Set my North Star
        </button>
      </div>
    </div>
  )
}

function NorthStarCard({ star, netWorth, surplus, savings, onEdit }) {
  if (!star) return null
  const ns = NORTH_STAR_OPTIONS.find(n => n.id === star.id) || NORTH_STAR_OPTIONS[8]
  const color = star.color || ns.color || T.teal
  const hasTarget = star.targetAmount && star.targetAmount > 0
  // Use what they explicitly told us they've saved toward this goal, plus any surplus accumulated since they set it
  const monthsSinceCreated = star.createdAt ? Math.max(0, Math.floor((Date.now() - new Date(star.createdAt).getTime()) / (1000*60*60*24*30))) : 0
  const accumulated = (star.currentSaved || 0) + Math.max(0, (surplus || 0) * monthsSinceCreated)
  const progress = hasTarget ? Math.min(100, Math.round(accumulated / star.targetAmount * 100)) : null
  const monthsLeft = hasTarget && surplus > 0 ? Math.max(0, Math.ceil((star.targetAmount - accumulated) / surplus)) : null
  const etaDate = monthsLeft ? (() => { const d = new Date(); d.setMonth(d.getMonth() + monthsLeft); return d.toLocaleDateString("en-GB",{month:"short",year:"numeric"}) })() : null

  return (
    <div style={{ background:`linear-gradient(135deg, ${color}10, ${color}05)`, border:`1.5px solid ${color}30`,
      borderRadius:20, padding:"18px 20px", marginBottom:14, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,right:0,width:100,height:100,background:`radial-gradient(circle at 100% 0%,${color}12,transparent 70%)`,pointerEvents:"none" }}/>
      <div style={{ display:"flex",alignItems:"flex-start",gap:12,position:"relative" }}>
        <div style={{ width:44,height:44,borderRadius:14,background:`${color}20`,border:`1.5px solid ${color}35`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
          {star.emoji || ns.emoji}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:"#6B8CB8",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:3 }}>My North Star</p>
          <p style={{ color:T.white,fontWeight:900,fontSize:17,lineHeight:1.2,marginBottom:2 }}>{star.label}</p>
          {hasTarget && (
            <div style={{ marginTop:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <p style={{ color:"#C8D8EC",fontSize:12,fontWeight:600 }}>{fmt(accumulated)} of {fmt(star.targetAmount)}</p>
                <p style={{ color:color,fontWeight:800,fontSize:12 }}>{progress}%</p>
              </div>
              <div style={{ background:`${color}15`,borderRadius:6,height:8,overflow:"hidden" }}>
                <div style={{ width:`${progress}%`,height:"100%",background:`linear-gradient(90deg,${color}80,${color})`,borderRadius:6,transition:"width .8s" }}/>
              </div>
              {etaDate && <p style={{ color:"#6B8CB8",fontSize:10,marginTop:4 }}>At your current rate: {etaDate}</p>}
            </div>
          )}
          {!hasTarget && (
            <p style={{ color:"#8FA3BE",fontSize:11,marginTop:4,lineHeight:1.4 }}>{ns.sub}</p>
          )}
        </div>
        <button onClick={onEdit} style={{ background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0 }}>
          <Pencil size={13} color="#6B8CB8"/>
        </button>
      </div>
    </div>
  )
}

function ProjectionInfoModal({ onClose, nw, surplus, age }) {
  const yearsLeft = Math.max(0, 70 - (age || 30))
  const annualSavings = (surplus || 0) * 12

  function Section({ icon, color, title, children }) {
    return (
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"16px 18px", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{icon}</div>
          <p style={{ color:T.white, fontWeight:900, fontSize:14, lineHeight:1.2 }}>{title}</p>
        </div>
        <div style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.6 }}>{children}</div>
      </div>
    )
  }

  function Lever({ emoji, title, body, color }) {
    return (
      <div style={{ background:`${color}08`, border:`1px solid ${color}25`, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
          <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{emoji}</span>
          <div>
            <p style={{ color:color, fontWeight:800, fontSize:12, marginBottom:3 }}>{title}</p>
            <p style={{ color:"#C8D8EC", fontSize:12, lineHeight:1.55 }}>{body}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(7,13,26,.92)", backdropFilter:"blur(8px)", zIndex:500, overflowY:"auto", padding:"0" }}>
      <div onClick={e => e.stopPropagation()} className="ls-fadein" style={{ minHeight:"100%", maxWidth:560, margin:"0 auto", background:T.bg, padding:"20px 18px 60px" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <button onClick={onClose} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:99, width:34, height:34, cursor:"pointer", color:T.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontFamily:"inherit" }}>←</button>
          <p style={{ color:"#6B8CB8", fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}>The methodology</p>
          <div style={{ width:34 }}/>
        </div>

        <div style={{ textAlign:"center", marginBottom:24 }}>
          <p style={{ fontSize:38, marginBottom:10 }}>📊</p>
          <h1 style={{ color:T.white, fontWeight:900, fontSize:24, lineHeight:1.2, marginBottom:8, letterSpacing:-.3 }}>How we got to your projection</h1>
          <p style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.6 }}>These are not random numbers. They are the most likely outcome based on the figures you have entered, run through the same assumptions financial planners use.</p>
        </div>

        <Section icon="🧮" color={T.amber} title="The maths behind it">
          <p style={{ marginBottom:8 }}>We take your current net worth, add the surplus you save every month, and grow the productive part of it at <strong style={{ color:T.amber }}>5% per year</strong> for the conservative figure and <strong style={{ color:T.amber }}>7% per year</strong> for the optimistic figure. Both are below the long term average of UK and US stock markets after inflation.</p>
          <p>For you: starting with {fmtK(nw)} today, saving roughly {fmtK(annualSavings)} per year, compounded over {yearsLeft} years until age 70.</p>
        </Section>

        <div style={{ background:`linear-gradient(135deg,${T.teal}18,${T.purple}10)`, border:`1.5px solid ${T.tealBorder}`, borderRadius:16, padding:"18px 20px", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:`${T.teal}22`, border:`1px solid ${T.tealBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💡</div>
            <p style={{ color:T.white, fontWeight:900, fontSize:15, lineHeight:1.2 }}>This number is yours to change</p>
          </div>
          <p style={{ color:"#C8D8EC", fontSize:13, lineHeight:1.65, marginBottom:12 }}>Your salary alone will never make you wealthy. The number you reach by 70 is decided by how much of your money is actually working for you, and that comes down to a small set of decisions repeated over decades.</p>
          <p style={{ color:T.teal, fontSize:11, fontWeight:800, letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Two habits will get you there</p>
          <div style={{ display:"flex", gap:10, marginBottom:8 }}>
            <div style={{ width:24, height:24, borderRadius:99, background:`${T.teal}25`, border:`1px solid ${T.tealBorder}`, color:T.teal, fontWeight:900, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>1</div>
            <p style={{ color:"#E2EAF6", fontSize:13, lineHeight:1.55, flex:1 }}><strong style={{ color:T.white }}>Update your numbers in Analytics every month.</strong> One minute keeps the picture honest and your trajectory accurate.</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ width:24, height:24, borderRadius:99, background:`${T.purple}25`, border:`1px solid ${T.purple}40`, color:T.purple, fontWeight:900, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>2</div>
            <p style={{ color:"#E2EAF6", fontSize:13, lineHeight:1.55, flex:1 }}><strong style={{ color:T.white }}>Work through the Learn tab one lesson at a time.</strong> Each one is short and ends with one small action. Within weeks you have the systems in place.</p>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ color:"#6B8CB8", fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10, paddingLeft:4 }}>The five levers that change your number</p>
          <Lever emoji="📈" color={T.green} title="Build productive assets" body="Money sitting in a current account does nothing. Money in a pension, ISA, or investments grows quietly while you sleep. Shifting your wealth into productive assets is the single biggest accelerator." />
          <Lever emoji="💳" color={T.red} title="Wipe out high interest debt" body="A 24% credit card balance grows faster than almost any investment. Paying it off is a guaranteed 24% return. Always the highest priority move." />
          <Lever emoji="🏛️" color={T.purple} title="Maximise your pension match" body="If your employer matches contributions and you do not claim it, you are turning down a pay rise. This is the closest thing to free money in finance." />
          <Lever emoji="🧾" color={T.blue} title="Optimise your tax" body="Tax wrappers (ISA, pension), correct tax codes, and using your allowances can save thousands a year. None of it is complicated once you understand it." />
          <Lever emoji="🎯" color={T.amber} title="Know your spending and set clear goals" body="People with vague goals reach vague outcomes. People who track and budget end up well ahead of those who do not. Small consistency beats big ambition." />
        </div>

        <Section icon="🌟" color={T.purple} title="The honest part">
          <p style={{ marginBottom:8 }}>The higher numbers in your projection do not happen by accident. They happen because someone, at some point, decided to take charge of their money instead of letting it drift.</p>
          <p><strong style={{ color:T.purple }}>The good news:</strong> it is not about earning more, working harder, or being smarter than anyone else. It is about small simple consistent steps, taken over years.</p>
        </Section>

        <button onClick={onClose} style={{ width:"100%", background:`linear-gradient(135deg,${T.teal},${T.tealMid})`, border:"none", borderRadius:14, padding:"15px", color:T.bg, fontWeight:900, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:8 }}>
          Got it, let's go
        </button>
      </div>
    </div>
  )
}

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
  const runwayMonths = (bk.safetyNet > 0 && spending.monthly > 0) ? parseFloat((bk.safetyNet / spending.monthly).toFixed(1)) : 0
  const [showEdit, setShowEdit] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [expandNW, setExpandNW] = useState(false)
  const [expandProj, setExpandProj] = useState(false)
  const [showProjectionInfo, setShowProjectionInfo] = useState(false)
  const [showNorthStar, setShowNorthStar] = useState(false)
  const northStar = state.profile?.northStar || state.northStar

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

  if(showNorthStar) return <NorthStarSelector onSelect={(star) => { save({...state, northStar: star}); setShowNorthStar(false) }} onClose={() => setShowNorthStar(false)}/>
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
        display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"
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
      {showProjectionInfo && <ProjectionInfoModal onClose={() => setShowProjectionInfo(false)} nw={netWorth} surplus={surplus} age={profile?.age}/>}

      <div style={{ maxWidth:600, margin:"0 auto", padding:"18px 16px 0" }}>

        {profile?.name && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:14 }}>
            <div>
              <p style={{ color:"#6B8CB8", fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Welcome back</p>
              <p style={{ color:T.white, fontWeight:900, fontSize:20, lineHeight:1.2, letterSpacing:-.3 }}>{profile.name}'s financial dashboard</p>
            </div>
            <XPBadge/>
          </div>
        )}

        {/* ══ NORTH STAR ══ */}
        {northStar && <NorthStarCard star={northStar} netWorth={netWorth} surplus={surplus} savings={bk.safetyNet} onEdit={() => setShowNorthStar(true)}/>}
        {!northStar && hasNumbers && (
          <button onClick={() => setShowNorthStar(true)} style={{ width:"100%",background:`linear-gradient(135deg,${T.teal}12,${T.purple}12)`,border:`1.5px solid ${T.tealBorder}`,borderRadius:18,padding:"18px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:14,display:"flex",alignItems:"center",gap:14 }}>
            <span style={{ fontSize:28 }}>🌟</span>
            <div style={{ flex:1 }}>
              <p style={{ color:T.white,fontWeight:900,fontSize:15,marginBottom:2 }}>Set your North Star</p>
              <p style={{ color:"#C8D8EC",fontSize:12,lineHeight:1.4 }}>What are you working toward? Pick the one thing that matters most and we will help you track your progress.</p>
            </div>
            <ChevronRight size={18} color={T.teal}/>
          </button>
        )}

        {/* TRACKING STREAK / UPDATE REMINDER */}
        {hasNumbers && (() => {
          const history = state.history || []
          const monthsTracked = history.length
          const currentMonth = new Date().toISOString().slice(0,7)
          const hasThisMonth = history.some(h => h.month === currentMonth)
          const lastUpdate = monthsTracked > 0 ? history[history.length-1].month : null
          const daysSinceLast = lastUpdate ? Math.floor((Date.now() - new Date(lastUpdate+"-01").getTime()) / (1000*60*60*24)) : null
          const needsUpdate = !hasThisMonth && daysSinceLast > 25
          if (needsUpdate) {
            return (
              <div onClick={() => setTab(2)} style={{ background:`${T.amber}10`,border:`1.5px solid ${T.amberBorder}`,borderRadius:14,padding:"12px 16px",marginBottom:12,cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ fontSize:22 }}>📸</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:T.white,fontWeight:800,fontSize:13 }}>Time for your monthly update</p>
                  <p style={{ color:"#C8D8EC",fontSize:11 }}>Takes 30 seconds. Keeps your progress chart accurate and your streak alive.</p>
                </div>
                <span style={{ color:T.amber,fontWeight:800,fontSize:16 }}>›</span>
              </div>
            )
          }
          if (monthsTracked >= 2) {
            return (
              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:18 }}>🔥</span>
                <p style={{ color:"#C8D8EC",fontSize:12,flex:1 }}>You are on a <strong style={{ color:T.teal }}>{monthsTracked} month tracking streak</strong>. Consistency is what builds wealth.</p>
              </div>
            )
          }
          return null
        })()}

        {/* ══ SECTION 1: NW NOW + NW PROJECTION (side by side, chart below) ══ */}
        {(() => {
          const projData = (netWorth!==0 && hasIncome) ? calcProjection(netWorth, surplus, profile?.age) : null
          const at70 = projData?.find(d => Math.round(d.age) === 70)
          return (
            <div style={{ marginTop:18, marginBottom:18 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>

                {/* NET WORTH NOW */}
                <div style={{ background:`linear-gradient(145deg,${netWorth>=0?"rgba(15,191,184,.18)":"rgba(248,113,113,.18)"},${T.card})`, border:`2px solid ${netWorth>=0?T.teal:T.red}`, borderRadius:20, padding:"18px 16px", boxShadow:`0 0 20px ${netWorth>=0?T.teal:T.red}25`, display:"flex", flexDirection:"column" }}>
                  <p style={{ color:netWorth>=0?T.teal:T.red, fontSize:11, fontWeight:800, letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Net Worth Now</p>
                  <p style={{ color:netWorth>=0?T.teal:T.red, fontWeight:900, fontSize:"clamp(24px,6vw,36px)", lineHeight:1, marginBottom:12, textShadow:netWorth>=0?`0 0 30px ${T.teal}60`:`0 0 30px ${T.red}50` }}>
                    {fmtK(netWorth)}
                  </p>
                  <div style={{ display:"flex", gap:14, marginTop:"auto" }}>
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
                </div>

                {/* NET WORTH PROJECTION */}
                <div style={{ background:"linear-gradient(145deg,rgba(245,158,11,.18),rgba(15,13,26,.8))", border:`2px solid ${T.amber}`, borderRadius:20, padding:"18px 16px", boxShadow:`0 0 20px ${T.amber}25`, display:"flex", flexDirection:"column" }}>
                  <p style={{ color:T.amber, fontSize:11, fontWeight:800, letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Net Worth Projection</p>
                  {at70 ? (
                    <>
                      <p style={{ color:T.amber, fontWeight:900, fontSize:"clamp(24px,6vw,36px)", lineHeight:1, marginBottom:4, textShadow:`0 0 30px ${T.amber}50` }}>
                        {fmtK(at70.conservative)}
                      </p>
                      <p style={{ color:"#C8D8EC", fontSize:12, marginBottom:10 }}>at age 70</p>
                      {at70.optimistic > at70.conservative && (
                        <p style={{ color:T.amber, fontSize:12, fontWeight:700, marginTop:"auto", lineHeight:1.35 }}>
                          ✨ Get up to {fmtK(at70.optimistic)} with the right moves
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p style={{ color:"#8FA3BE", fontWeight:900, fontSize:28, lineHeight:1, marginBottom:8 }}>—</p>
                      <p style={{ color:"#8FA3BE", fontSize:12 }}>Add your numbers to unlock</p>
                    </>
                  )}
                </div>
              </div>

              {/* Wide projection chart toggle */}
              {at70 && (
                <div style={{ marginTop:10 }}>
                  <button onClick={() => setExpandProj(!expandProj)} style={{ width:"100%", background:`${T.amber}10`, border:`1px solid ${T.amber}30`, borderRadius:14, padding:"12px", color:T.amber, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <span>{expandProj ? "▴" : "▾"}</span>
                    {expandProj ? "Hide projection chart" : "See projection chart"}
                  </button>
                  {expandProj && (
                    <div className="ls-fadein" style={{ marginTop:10 }}>
                      <ProjectionHeroCard nw={netWorth} surplus={surplus} age={profile?.age} onShowInfo={() => setShowProjectionInfo(true)}/>
                    </div>
                  )}
                </div>
              )}
              {!at70 && (
                <div style={{ marginTop:10 }}>
                  <button onClick={() => setTab(2)} style={{ width:"100%", background:T.tealDim, border:`1px solid ${T.tealBorder}`, borderRadius:14, padding:"12px", color:T.teal, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    Go to Analytics →
                  </button>
                </div>
              )}
            </div>
          )
        })()}

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
                  <div style={{ background:"rgba(255,255,255,.10)", borderRadius:99, height:8, overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`, height:"100%", borderRadius:99,
                      background:`linear-gradient(90deg,#F59E0B,#FBBF24)`,
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
            const scale = 9
            const f = Math.min(months, scale) / scale
            const cx = 60, cy = 56, r = 44
            const needleR = 36
            const nx = cx - needleR * Math.cos(f * Math.PI)
            const ny = cy - needleR * Math.sin(f * Math.PI)
            // Boundaries: 0-3 red, 3-6 green, 6-9 amber (too much idle cash)
            const p1x = cx - r * Math.cos(1/3 * Math.PI)
            const p1y = cy - r * Math.sin(1/3 * Math.PI)
            const p2x = cx - r * Math.cos(2/3 * Math.PI)
            const p2y = cy - r * Math.sin(2/3 * Math.PI)
            const dialColor = months > 6 ? T.amber : months >= 3 ? T.green : T.red
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
                    fill="none" stroke={T.green} strokeWidth="10" strokeLinecap="butt"/>
                  <path d={`M ${p2x.toFixed(1)},${p2y.toFixed(1)} A ${r},${r} 0 0,1 ${cx+r},${cy}`}
                    fill="none" stroke={T.amber} strokeWidth="10" strokeLinecap="butt"/>
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
                  <p style={{ color:"rgba(167,139,250,.65)", fontSize:13 }}>10 types · 12 questions</p>
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

        {/* ══ SECTION 4: LEARNING PATH (chapter-based journey) ══ */}
        {(() => {
          const completedLessons = state.completedLessons || []
          const doneSetL = new Set(completedLessons)
          const totalLessons = LESSONS.length
          const doneCount = LESSONS.filter(l => doneSetL.has(l.n)).length
          const nextLesson = LESSONS.find(l => !doneSetL.has(l.n)) || LESSONS[0]
          const overallPct = Math.round((doneCount / totalLessons) * 100)

          // One-line description of what each lesson helps with
          const LESSON_HINTS = {
            1:  "The number that actually shows how you're doing",
            2:  "The simple pattern wealthy people follow",
            3:  "Build a budget system that finally sticks",
            4:  "Understand every line of your payslip",
            5:  "How interest works and why it traps people",
            6:  "A clear plan to wipe out bad debt",
            7:  "The fund that stops a setback becoming a spiral",
            8:  "Save with purpose for every future goal",
            9:  "How tax actually works and how to pay less",
            10: "The tax-free wrapper everyone should use",
            11: "Set financial goals that actually happen",
            12: "The free money your employer is offering",
            13: "A private pension you fully own and control",
            14: "What investing actually means in practice",
            15: "The main asset classes explained simply",
            16: "How to start investing the right way",
            17: "Spread your money to reduce risk",
            18: "Property, gold and crypto, the honest take",
            19: "What Sharia compliant finance really means",
            20: "Islamic mortgages, loans and insurance explained",
            21: "How to invest the halal way",
          }

          // Chapter definitions (frame phases as a journey)
          const CHAPTERS = [
            { phase:"Foundations", num:"01", title:"Foundations", emoji:"🌱", color:T.green,
              promise:"See your real financial picture and understand how wealth actually builds." },
            { phase:"Stabilise",   num:"02", title:"Stabilise",   emoji:"🛡️", color:T.amber,
              promise:"Wipe out bad debt and build the safety net that protects everything you do next." },
            { phase:"Optimise",    num:"03", title:"Optimise",    emoji:"⚡", color:T.blue,
              promise:"Stop overpaying tax, claim the free money you are owed, and set goals that actually happen." },
            { phase:"Invest",      num:"04", title:"Invest",      emoji:"📈", color:T.purple,
              promise:"Put your money to work so it earns while you sleep and compounds for decades." },
            { phase:"Islamic Finance", num:"05", title:"Islamic Finance", emoji:"☪️", color:T.teal,
              promise:"An optional path covering Sharia compliant alternatives for every financial decision." },
          ]

          return (
            <div style={{ marginBottom:24 }}>
              {/* Hero intro */}
              <div style={{ marginBottom:18 }}>
                <p style={{ color:T.teal, fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Your guide to financial freedom</p>
                <p style={{ color:"#FFFFFF", fontWeight:900, fontSize:22, lineHeight:1.2, marginBottom:10, letterSpacing:-.3 }}>The complete path, taught one idea at a time</p>
                <p style={{ color:"#C8D8EC", fontSize:14, lineHeight:1.65, marginBottom:6 }}>This is everything you need to sort your financial life out for good. Five chapters. Each one builds on the last. Each lesson is short, teaches a single idea, and ends with one small action you can take today.</p>
                <p style={{ color:"#8FA3BE", fontSize:13, lineHeight:1.6, marginBottom:14 }}>Work through it in order. By the end you will have the knowledge and the systems to reach the goals you set in this app.</p>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <div style={{ flex:1, background:"rgba(255,255,255,.08)", borderRadius:99, height:6, overflow:"hidden" }}>
                    <div style={{ width:`${overallPct}%`, height:"100%", background:`linear-gradient(90deg,${T.teal},${T.purple})`, borderRadius:99, transition:"width .5s ease" }}/>
                  </div>
                  <p style={{ color:"#C8D8EC", fontSize:12, fontWeight:700, flexShrink:0 }}>{doneCount} of {totalLessons} done</p>
                </div>
              </div>

              {/* Continue card */}
              {nextLesson && doneCount > 0 && (
                <button onClick={() => { save({...state, pendingLessonN: nextLesson.n, lessonReturnTab: 0}); setTab(1) }} style={{ width:"100%", background:`linear-gradient(135deg,${T.teal}18,${T.purple}10)`, border:`1.5px solid ${T.tealBorder}`, borderRadius:18, padding:"16px 18px", cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:18, display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:50, height:50, borderRadius:14, background:`${T.teal}25`, border:`1.5px solid ${T.tealBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{nextLesson.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ color:T.teal, fontSize:9, fontWeight:800, letterSpacing:1.2, textTransform:"uppercase", marginBottom:3 }}>Continue your journey</p>
                    <p style={{ color:T.white, fontWeight:900, fontSize:15, lineHeight:1.2 }}>Lesson {nextLesson.n}: {nextLesson.title}</p>
                    <p style={{ color:"#C8D8EC", fontSize:11, marginTop:2 }}>{LESSON_HINTS[nextLesson.n] || nextLesson.subtitle} · {nextLesson.time} min</p>
                  </div>
                  <span style={{ color:T.teal, fontWeight:800, fontSize:18 }}>›</span>
                </button>
              )}

              {/* Chapter cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {CHAPTERS.map(ch => {
                  const chLessons = LESSONS.filter(l => l.phase === ch.phase)
                  if (chLessons.length === 0) return null
                  const chDone = chLessons.filter(l => doneSetL.has(l.n)).length
                  const chPct = Math.round((chDone / chLessons.length) * 100)
                  const allDone = chDone === chLessons.length
                  return (
                    <div key={ch.phase} style={{ background:`linear-gradient(180deg,${ch.color}10 0%,${T.card} 100%)`, border:`1.5px solid ${ch.color}30`, borderRadius:20, overflow:"hidden", boxShadow:`0 2px 24px ${ch.color}08` }}>
                      {/* Chapter header */}
                      <div style={{ padding:"16px 18px 14px", borderBottom:`1px solid ${ch.color}15`, position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:0, right:0, width:120, height:120, background:`radial-gradient(circle at 100% 0%,${ch.color}18,transparent 60%)`, pointerEvents:"none" }}/>
                        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8, position:"relative" }}>
                          <div style={{ width:46, height:46, borderRadius:14, background:`${ch.color}22`, border:`1.5px solid ${ch.color}45`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{ch.emoji}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ color:ch.color, fontSize:9, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Chapter {ch.num}</p>
                            <p style={{ color:T.white, fontWeight:900, fontSize:18, lineHeight:1.1 }}>{ch.title}</p>
                          </div>
                          {allDone && <div style={{ background:T.green+"20", border:`1px solid ${T.green}40`, borderRadius:99, padding:"4px 10px", display:"flex", alignItems:"center", gap:4 }}>
                            <span style={{ fontSize:10 }}>✓</span><span style={{ color:T.green, fontSize:10, fontWeight:800 }}>Done</span>
                          </div>}
                        </div>
                        <p style={{ color:"#C8D8EC", fontSize:12, lineHeight:1.5, marginBottom:10, position:"relative" }}>{ch.promise}</p>
                        <div style={{ display:"flex", alignItems:"center", gap:8, position:"relative" }}>
                          <div style={{ flex:1, background:"rgba(255,255,255,.06)", borderRadius:99, height:4, overflow:"hidden" }}>
                            <div style={{ width:`${chPct}%`, height:"100%", background:ch.color, borderRadius:99, transition:"width .5s ease" }}/>
                          </div>
                          <p style={{ color:ch.color, fontSize:10, fontWeight:800, flexShrink:0 }}>{chDone}/{chLessons.length}</p>
                        </div>
                      </div>

                      {/* Lesson tiles */}
                      <div style={{ display:"flex", flexDirection:"column", gap:8, padding:"14px 14px 16px" }}>
                        {chLessons.map((lesson) => {
                          const isDone = doneSetL.has(lesson.n)
                          return (
                            <button key={lesson.n} onClick={() => { save({...state, pendingLessonN: lesson.n, lessonReturnTab: 0}); setTab(1) }} style={{ width:"100%", background:isDone ? `linear-gradient(135deg,${T.green}15,${T.green}06)` : `${ch.color}06`, border:`1.5px solid ${isDone ? T.green+"45" : ch.color+"22"}`, borderRadius:14, padding:"12px 14px", cursor:"pointer", fontFamily:"inherit", textAlign:"left", display:"flex", alignItems:"center", gap:12, transition:"all .15s" }}>
                              <div style={{ width:38, height:38, borderRadius:11, background:isDone ? `${T.green}25` : `${ch.color}18`, border:`1.5px solid ${isDone ? T.green+"55" : ch.color+"35"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{lesson.emoji}</div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                                  <p style={{ color:isDone ? T.green : T.white, fontWeight:800, fontSize:13, lineHeight:1.25 }}>Lesson {lesson.n}: {lesson.title}</p>
                                  {isDone && <span style={{ background:T.green+"25", borderRadius:99, padding:"1px 6px", color:T.green, fontSize:9, fontWeight:800 }}>✓ Done</span>}
                                </div>
                                <p style={{ color:"#8FA3BE", fontSize:11, lineHeight:1.4 }}>{LESSON_HINTS[lesson.n] || lesson.subtitle}</p>
                              </div>
                              <span style={{ color:isDone ? T.green : ch.color, fontWeight:800, fontSize:16, flexShrink:0, opacity:.7 }}>›</span>
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
        })()}


        {/* ══ SECTION 5: GOALS ══ */}
        <DashboardGoals goals={goals} surplus={surplus} save={save} state={state} toast={toast} setTab={setTab}/>
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
function ProjectionHeroCard({ nw, surplus, age, onShowInfo }) {
  const data = useMemo(()=>calcProjection(nw,surplus,age),[nw,surplus,age])
  const targetAge = 70
  const atTarget  = data.find(d=>Math.round(d.age)===targetAge)
  const fmtAx = v => v>=1e6?`£${(v/1e6).toFixed(1)}M`:v>=1000?`£${(v/1000).toFixed(0)}k`:v<0?`-£${Math.abs(Math.round(v/1000))}k`:""

  return (
    <div className="ls-card-glass ls-glow" style={{ border:`1.5px solid ${T.tealBorder}`,borderRadius:22,padding:"22px 24px",boxShadow:"0 0 40px rgba(15,191,184,.12), 0 8px 32px rgba(0,0,0,.3)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <p style={{ color:T.teal,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>LifeSmart Projection</p>
        {onShowInfo && (
          <button onClick={onShowInfo} style={{ background:`${T.teal}15`, border:`1px solid ${T.tealBorder}`, borderRadius:99, padding:"5px 12px", color:T.teal, fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
            How this works →
          </button>
        )}
      </div>

      {atTarget && (
        <div style={{ marginBottom:10, display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <p style={{ fontSize:"clamp(28px,6vw,40px)",fontWeight:900,lineHeight:1,color:T.teal,textShadow:`0 0 30px ${T.teal}50` }}>
            {fmtK(atTarget.conservative)}
          </p>
          {atTarget.optimistic > atTarget.conservative && (
            <p style={{ color:T.amber, fontSize:13, fontWeight:700, lineHeight:1.2 }}>
              ✨ Get up to {fmtK(atTarget.optimistic)}
            </p>
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
  const { state, save, toast, setTab } = useApp()
  const [sheet, setSheet] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [showHealthQ, setShowHealthQ] = useState(false)
  const [showRefineSheet, setShowRefineSheet] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [assetsConfirmed, setAssetsConfirmed] = useState(false)
  const [spendingPhase, setSpendingPhase] = useState(state.spending?.breakdown && Object.keys(state.spending.breakdown).length > 0 ? "chart" : "locked")
  const [whatIfExtra, setWhatIfExtra] = useState(100)

  const { totalAssets, totalDebts } = calcTotals(state.assets, state.debts)
  const netWorth = totalAssets - totalDebts
  const drag = totalInterestDrag(state.debts)
  const totalIncome = calcIncome(state.income || {}, state.assets || [])
  const totalSpending = state.spending?.monthly || 0
  const surplus = totalIncome - totalSpending
  const age = state.profile?.age || 30
  const bench = ageBenchmark(age)
  const hq = state.healthAnswers || {}
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((surplus / totalIncome) * 100)) : 0
  const productive = state.assets.filter(a => ["savings","investments","pension"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0)
  const productivePct = totalAssets > 0 ? Math.round(productive / totalAssets * 100) : 0
  const savingsVal = state.assets.filter(a => a.category === "savings").reduce((s,a)=>s+(a.value||0),0)
  const emergencyMonths = totalSpending > 0 ? Math.round(savingsVal / totalSpending * 10) / 10 : 0
  const interestEarned = state.assets.reduce((s,a)=>s+((a.value||0)*((a.annualReturn||0)/100)),0)

  function calcHealthScore(){let s=0,m=0,ans=0;m+=15;if(netWorth>0)s+=15;m+=10;if(totalDebts===0)s+=10;else if(!state.debts.some(d=>d.interestRate>15))s+=5;m+=10;if(surplus>0)s+=Math.min(10,Math.round(surplus/Math.max(totalIncome,1)*20));m+=5;if(totalAssets>0)s+=5;if(hq.emergencyFund!==undefined){ans++;m+=15;if(hq.emergencyFund==="yes")s+=15;else if(hq.emergencyFund==="partial")s+=8}if(hq.pensionMatch!==undefined){ans++;m+=12;if(hq.pensionMatch==="yes")s+=12;else if(hq.pensionMatch==="partial")s+=6}if(hq.investsMonthly!==undefined){ans++;m+=12;if(hq.investsMonthly==="yes")s+=12}if(hq.hasBudget!==undefined){ans++;m+=8;if(hq.hasBudget==="yes")s+=8}if(hq.hasWill!==undefined){ans++;m+=6;if(hq.hasWill==="yes")s+=6}if(hq.hasProtection!==undefined){ans++;m+=6;if(hq.hasProtection==="yes")s+=6}return{score:m>0?Math.round((s/m)*100):0,isPartial:ans<6,answered:ans,total:6}}
  const health = calcHealthScore()
  const healthColor = health.score >= 80 ? T.teal : health.score >= 60 ? T.green : health.score >= 35 ? T.amber : T.red
  const ratio = bench && bench.median > 0 ? netWorth / bench.median : 0
  const percentile = ratio <= 0 ? 15 : ratio < 0.5 ? 25 : ratio < 0.8 ? 35 : ratio < 1 ? 45 : ratio < 1.5 ? 60 : ratio < 2 ? 72 : ratio < 3 ? 82 : 90

  // CRUD
  function saveAsset({cat,name,val,monthlyIncome,hasLoan,loanBal,annualReturn,existingId,existingLinkedDebtId}){let nA=[...state.assets],nD=[...state.debts];const aid=existingId||`a_${Date.now()}`;const ao={id:aid,category:cat,name,value:val,monthlyIncome:monthlyIncome||0,linkedDebtId:existingLinkedDebtId||null,annualReturn:annualReturn||null};if(existingId)nA=nA.map(a=>a.id===existingId?ao:a);else nA.push(ao);if(hasLoan&&loanBal>0){const t=DEBT_TYPES.find(x=>["mortgage","car_loan"].includes(x.cat)&&x.cat===cat)||DEBT_TYPES[0];const did=existingLinkedDebtId||`d_linked_${Date.now()}`;const dobj={id:did,category:cat==="primary_residence"?"mortgage":cat,name:`${name} loan`,balance:loanBal,interestRate:t?.assumedRate||4.5,linkedAssetId:aid,isAutoCreated:true};nA=nA.map(a=>a.id===aid?{...a,linkedDebtId:did}:a);if(existingLinkedDebtId)nD=nD.map(d=>d.id===existingLinkedDebtId?dobj:d);else nD.push(dobj)}const h=[...(state.history||[])];const mk=new Date().toISOString().slice(0,7);const nw2=nA.reduce((s,a)=>s+(a.value||0),0)-nD.reduce((s,d)=>s+(d.balance||0),0);const ex=h.findIndex(x=>x.month===mk);if(ex>=0)h[ex]={month:mk,netWorth:nw2};else h.push({month:mk,netWorth:nw2});save({...state,assets:nA,debts:nD,history:h});toast("Saved");setSheet(null);setEditItem(null)}
  function deleteAsset(a){if(!window.confirm(`Remove "${a.name}"?`))return;save({...state,assets:state.assets.filter(x=>x.id!==a.id),debts:a.linkedDebtId?state.debts.filter(d=>d.id!==a.linkedDebtId):state.debts});toast("Removed")}
  function saveDebt({cat,name,bal,rate,minPayment,existingId}){const t=DEBT_TYPES.find(x=>x.cat===cat);const dobj={id:existingId||`d_${Date.now()}`,category:cat,name,balance:bal,interestRate:rate||t?.assumedRate||10,minPayment:minPayment||0,linkedAssetId:null,isAutoCreated:false};save({...state,debts:existingId?state.debts.map(d=>d.id===existingId?dobj:d):[...state.debts,dobj]});toast("Saved");setSheet(null);setEditItem(null)}
  function deleteDebt(d){if(d.isAutoCreated){toast("Remove the linked asset instead");return};if(!window.confirm(`Remove "${d.name}"?`))return;save({...state,debts:state.debts.filter(x=>x.id!==d.id)});toast("Removed")}

  const lastVisit=state.lastDashboardVisit||null;const today=new Date().toDateString();const streak=state.dashboardStreak||0
  useEffect(()=>{if(lastVisit!==today){const y=new Date();y.setDate(y.getDate()-1);save({...state,lastDashboardVisit:today,dashboardStreak:lastVisit===y.toDateString()?streak+1:1})}},[])

  // What-if
  const wiMax = Math.max(30,70-(age||35)); const wiData = []
  for(let y=0;y<=wiMax;y+=(wiMax>25?2:1)){const aS=Math.max(0,surplus)*12,aB=(Math.max(0,surplus)+whatIfExtra)*12;wiData.push({year:y,age:(age||35)+y,current:Math.round(netWorth*Math.pow(1.07,y)+aS*((Math.pow(1.07,y)-1)/0.07)),boosted:Math.round(netWorth*Math.pow(1.07,y)+aB*((Math.pow(1.07,y)-1)/0.07))})}
  const fmtAx=v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1000?`${(v/1000).toFixed(0)}k`:`${v}`

  // FI
  const fiNum=totalSpending>0?totalSpending*12*25:0;const fiProg=fiNum>0?Math.min(100,Math.round(productive/fiNum*100)):0
  const coastFI=fiNum>0?Math.round(fiNum/Math.pow(1.07,Math.max(1,65-(age||35)))):0
  let yearsToFI=null;if(surplus>0&&fiNum>productive)yearsToFI=Math.ceil(Math.log(1+(fiNum-productive)*0.07/(surplus*12))/Math.log(1.07))

  // HQ Sheet
  function HQSheet(){const[ans,setAns]=useState({...hq});const QS=[{id:"emergencyFund",q:"Emergency fund (3+ months expenses)?",opts:[{v:"yes",l:"Yes"},{v:"partial",l:"Building"},{v:"no",l:"Not yet"}]},{id:"pensionMatch",q:"Employer pension match maximised?",opts:[{v:"yes",l:"Yes"},{v:"partial",l:"Partly"},{v:"no",l:"No / unsure"}]},{id:"investsMonthly",q:"Do you invest monthly?",opts:[{v:"yes",l:"Yes"},{v:"no",l:"Not yet"}]},{id:"hasBudget",q:"Track spending or follow a budget?",opts:[{v:"yes",l:"Yes"},{v:"no",l:"Not really"}]},{id:"hasWill",q:"Do you have a will?",opts:[{v:"yes",l:"Yes"},{v:"no",l:"No"}]},{id:"hasProtection",q:"Income protection or life insurance?",opts:[{v:"yes",l:"Yes"},{v:"no",l:"No"}]}];return(<Sheet title="Complete your health score" onClose={()=>setShowHealthQ(false)}><p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.6,marginBottom:20}}>Six quick questions. Under a minute.</p>{QS.map((q,qi)=>(<div key={q.id} style={{marginBottom:16}}><p style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:8}}>{qi+1}. {q.q}</p><div style={{display:"flex",gap:8}}>{q.opts.map(o=>(<button key={o.v} onClick={()=>setAns(p=>({...p,[q.id]:o.v}))} style={{flex:1,background:ans[q.id]===o.v?T.tealDim:T.card,border:`2px solid ${ans[q.id]===o.v?T.teal:T.border}`,borderRadius:12,padding:"10px 6px",cursor:"pointer",fontFamily:"inherit",color:ans[q.id]===o.v?T.teal:"#C8D8EC",fontWeight:600,fontSize:12}}>{o.l}</button>))}</div></div>))}<button onClick={()=>{save({...state,healthAnswers:ans});setShowHealthQ(false);toast("Score updated")}} style={{width:"100%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"16px",color:"#070D1A",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Save & see my score</button></Sheet>)}

  function SmallDonut({segments,size=90}){const total=segments.reduce((s,x)=>s+x.value,0);if(total===0)return null;const cx=size/2,cy=size/2,r=size*0.38,sw=size*0.18;let cum=-90;const toXY=a=>({x:cx+r*Math.cos(a*Math.PI/180),y:cy+r*Math.sin(a*Math.PI/180)});const arcs=segments.map(seg=>{const sweep=(seg.value/total)*360,start=cum;cum+=sweep;const s=toXY(start),e=toXY(start+sweep-0.5);return{...seg,d:`M${s.x},${s.y} A${r},${r} 0 ${sweep>180?1:0},1 ${e.x},${e.y}`}});return <svg width={size} height={size} style={{overflow:"visible"}}>{arcs.map((a,i)=><path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={sw}/>)}</svg>}

  return (
    <>
      <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"14px 18px"}}>

          {/* ═══ MONTHLY CHECK-IN ═══ */}
          {(() => {
            const lastUpdate = (state.history||[]).length > 0 ? state.history[state.history.length-1].month : null
            const currentMonth = new Date().toISOString().slice(0,7)
            const needsUpdate = !lastUpdate || lastUpdate !== currentMonth
            if (!needsUpdate || state.assets.length === 0) return null
            return (
              <div onClick={() => {
                const h = [...(state.history||[])]; const mk = currentMonth
                const ex = h.findIndex(x=>x.month===mk); if(ex>=0)h[ex]={month:mk,netWorth:netWorth}; else h.push({month:mk,netWorth:netWorth})
                save({...state, history:h}); toast("Monthly snapshot saved")
              }} style={{ background:`${T.teal}08`, border:`1.5px solid ${T.tealBorder}`, borderRadius:14, padding:"14px 16px", marginBottom:12, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36,height:36,borderRadius:10,background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>📸</div>
                <div style={{ flex:1 }}>
                  <p style={{ color:T.white,fontWeight:800,fontSize:13 }}>Monthly snapshot ready</p>
                  <p style={{ color:"#C8D8EC",fontSize:11 }}>Tap to record your net worth for {new Date().toLocaleDateString("en-GB",{month:"long"})} and track progress</p>
                </div>
                <span style={{ color:T.teal,fontWeight:800,fontSize:16 }}>→</span>
              </div>
            )
          })()}

          {/* ═══ 1. NET WORTH + HEALTH + COMPARISON (hero section) ═══ */}
          <div style={{background:T.card,border:`1.5px solid ${netWorth>=0?T.tealBorder:T.redBorder}`,borderRadius:22,marginBottom:14,overflow:"hidden"}}>
            {/* Net worth hero */}
            <div style={{padding:"18px 20px 12px",background:`linear-gradient(145deg,${T.card} 0%,rgba(15,191,184,.03) 100%)`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <p style={{color:"#6B8CB8",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Net Worth</p>
                  <p className="ls-numpop" style={{color:netWorth>=0?T.teal:T.red,fontWeight:900,fontSize:"clamp(28px,6vw,36px)",lineHeight:1,letterSpacing:-0.5}}>{fmt(netWorth)}</p>
                  <div style={{display:"flex",gap:14,marginTop:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/><span style={{color:T.green,fontWeight:700,fontSize:12}}>{fmtK(totalAssets)}</span><span style={{color:"#4A6080",fontSize:9}}>assets</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:totalDebts>0?T.red:T.muted}}/><span style={{color:totalDebts>0?T.red:T.muted,fontWeight:700,fontSize:12}}>{fmtK(totalDebts)}</span><span style={{color:"#4A6080",fontSize:9}}>debts</span></div>
                  </div>
                </div>
                <div onClick={()=>setShowHealthQ(true)} style={{cursor:"pointer",textAlign:"center",background:`${healthColor}08`,borderRadius:14,padding:"10px 12px",border:`1px solid ${healthColor}18`}}>
                  <p style={{color:"#6B8CB8",fontSize:7,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>Financial Health</p>
                  <p style={{color:healthColor,fontWeight:900,fontSize:26,lineHeight:1}}>{health.score}</p>
                  <p style={{color:healthColor,fontSize:9,fontWeight:700,marginTop:3}}>{health.score>=80?"Excellent":health.score>=60?"Good":health.score>=40?"Fair":"Needs work"}</p>
                  <div style={{display:"flex",gap:2,marginTop:5,justifyContent:"center"}}>
                    {[0,20,40,60,80].map(t=><div key={t} style={{width:14,height:3,borderRadius:2,background:health.score>t?healthColor:`${T.border}`}}/>)}
                  </div>
                  {health.isPartial&&<p style={{color:"#6B8CB8",fontSize:7,marginTop:3}}>Tap to complete</p>}
                </div>
              </div>
            </div>

            {/* Comparison section embedded */}
            {bench && <div style={{padding:"0 20px 16px",borderTop:`1px solid ${T.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"12px 0 4px"}}>
                <p style={{color:"#6B8CB8",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>How You Compare · Age {age}</p>
                <div style={{background:`${percentile>=50?T.teal:T.amber}12`,borderRadius:99,padding:"2px 8px",border:`1px solid ${percentile>=50?T.tealBorder:T.amberBorder}`}}><p style={{color:percentile>=50?T.teal:T.amber,fontWeight:900,fontSize:11}}>{percentile}th percentile</p></div>
              </div>
              <p style={{color:"#8FA3BE",fontSize:11,lineHeight:1.5,marginBottom:10}}>You are being compared to people your age across the UK using ONS wealth data. <button onClick={()=>setShowRefineSheet(true)} style={{background:"none",border:"none",color:T.teal,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:11,padding:0}}>Refine for accuracy →</button></p>
              <div style={{display:"flex",alignItems:"flex-end",height:32,gap:1,marginBottom:4}}>
                {Array.from({length:25},(_,i)=>{const bp=i/25*100,h=Math.exp(-0.5*Math.pow((i-12.5)/4,2))*100,isY=Math.abs(bp-percentile)<5;return <div key={i} style={{flex:1,height:`${h}%`,background:isY?T.teal:bp<percentile?`${T.teal}25`:`${T.muted}15`,borderRadius:"2px 2px 0 0",position:"relative"}}>{isY&&<div style={{position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderTop:`5px solid ${T.teal}`}}/>}</div>})}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><p style={{color:T.muted,fontSize:8}}>Bottom</p><p style={{color:T.muted,fontSize:8}}>Median</p><p style={{color:T.muted,fontSize:8}}>Top</p></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {[{l:"Net Worth",y:fmtK(netWorth),b:fmtK(bench.median),ok:netWorth>=bench.median},{l:"Savings Rate",y:`${savingsRate}%`,b:"12%",ok:savingsRate>=12},{l:"Emergency",y:`${emergencyMonths}mo`,b:"3mo",ok:emergencyMonths>=3}].map(m=>(
                  <div key={m.l} style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}>
                    <p style={{color:"#6B8CB8",fontSize:8,fontWeight:700,textTransform:"uppercase",marginBottom:3}}>{m.l}</p>
                    <p style={{color:m.ok?T.teal:T.white,fontWeight:900,fontSize:14}}>{m.y}</p>
                    <p style={{color:T.muted,fontSize:9}}>average {m.b}</p>
                  </div>
                ))}
              </div>
              {/* Plain-English narrative */}
              <div style={{background:T.surface,borderRadius:10,padding:"10px 12px",marginTop:10}}>
                <p style={{color:"#C8D8EC",fontSize:11,lineHeight:1.55}}>
                  {percentile >= 75 ? <>You are <strong style={{color:T.teal}}>well ahead</strong> of most people your age. Your job now is to keep the momentum and avoid lifestyle creep eating into your progress.</> :
                   percentile >= 50 ? <>You are <strong style={{color:T.teal}}>slightly above average</strong> for your age. A solid position to build from. Small consistent improvements compound into big results.</> :
                   percentile >= 30 ? <>You are <strong style={{color:T.amber}}>slightly below average</strong> for your age. Do not worry, this is just one indicator. Most of the people ahead of you started exactly where you are now.</> :
                   <>You are <strong style={{color:T.amber}}>behind the average</strong> right now. That is not a verdict, it is a starting point. The Learn tab will walk you through the highest-impact moves you can make from here.</>}
                </p>
              </div>
            </div>}
          </div>

          {/* ═══ 2. ANALYSE MY ASSETS ═══ */}
          <div style={{background:T.card,border:`1.5px solid ${assetsConfirmed?T.tealBorder:T.border}`,borderRadius:20,marginBottom:14,overflow:"hidden"}}>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>📊</span><div><p style={{color:T.white,fontWeight:800,fontSize:15}}>Analyse My Assets</p><p style={{color:T.muted,fontSize:10}}>Review and unlock your wealth breakdown</p></div></div>
                {assetsConfirmed&&<span style={{color:T.teal,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:3}}><Check size={10}/> Verified</span>}
              </div>

              {/* Assets list */}
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <p style={{color:T.green,fontWeight:800,fontSize:12}}>Assets · {fmtK(totalAssets)}</p>
                  <button onClick={()=>{setEditItem(null);setSheet("asset")}} style={{background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:8,padding:"3px 8px",color:T.teal,fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3}}><Plus size={10}/> Add</button>
                </div>
                <div style={{background:T.surface,borderRadius:12,overflow:"hidden"}}>
                  {state.assets.length===0?<button onClick={()=>{setEditItem(null);setSheet("asset")}} style={{width:"100%",background:"transparent",border:"none",padding:"16px",textAlign:"center",cursor:"pointer",fontFamily:"inherit"}}><p style={{color:"#4A6080",fontSize:11}}>+ Add your first asset</p></button>:
                  state.assets.map((a,i)=><div key={a.id} onClick={()=>{setEditItem(a);setSheet("asset")}} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderBottom:i<state.assets.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
                    <span style={{fontSize:14}}>{ASSET_TYPES.find(t=>t.cat===a.category||t.id===a.category)?.icon||"📦"}</span>
                    <div style={{flex:1,minWidth:0}}><p style={{color:"#E2EAF6",fontWeight:600,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</p>{a.annualReturn>0&&<p style={{color:T.purple,fontSize:8,fontWeight:600}}>{a.annualReturn}% return</p>}</div>
                    <p style={{color:T.green,fontWeight:800,fontSize:11}}>{fmtK(a.value)}</p><Pencil size={11} color={T.muted}/>
                  </div>)}
                </div>
              </div>

              {/* Debts list */}
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <p style={{color:totalDebts>0?T.red:"#6B8CB8",fontWeight:800,fontSize:12}}>Debts · {fmtK(totalDebts)}</p>
                  <button onClick={()=>{setEditItem(null);setSheet("debt")}} style={{background:T.redDim,border:`1px solid ${T.redBorder}`,borderRadius:8,padding:"3px 8px",color:T.red,fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3}}><Plus size={10}/> Add</button>
                </div>
                <div style={{background:T.surface,borderRadius:12,overflow:"hidden"}}>
                  {state.debts.length===0?<div style={{padding:"14px",textAlign:"center"}}><p style={{color:"#4A6080",fontSize:11}}>No debts ✓</p></div>:
                  state.debts.map((d,i)=><div key={d.id} onClick={()=>{setEditItem(d);setSheet("debt")}} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderBottom:i<state.debts.length-1?`1px solid ${T.border}`:"none",cursor:"pointer",background:d.interestRate>15?"rgba(248,113,113,.03)":"transparent"}}>
                    <span style={{fontSize:14}}>{DEBT_TYPES.find(t=>t.cat===d.category||t.id===d.category)?.icon||"💳"}</span>
                    <div style={{flex:1,minWidth:0}}><p style={{color:"#E2EAF6",fontWeight:600,fontSize:11}}>{d.name}</p><p style={{color:d.interestRate>15?T.red:"#4A6080",fontSize:8,fontWeight:600}}>{d.interestRate}% APR</p></div>
                    <p style={{color:T.red,fontWeight:800,fontSize:11}}>{fmtK(d.balance)}</p><Pencil size={11} color={T.muted}/>
                  </div>)}
                </div>
                {drag>0&&<div style={{background:T.redDim,borderRadius:10,padding:"8px 10px",marginTop:6,border:`1px solid ${T.redBorder}`}}><p style={{color:T.red,fontWeight:800,fontSize:11}}>💸 {fmt(Math.round(drag))}/yr interest · {fmt(Math.round(drag/12))}/mo</p></div>}
              </div>

              {/* Confirm button */}
              {(state.assets.length>0||state.debts.length>0)&&<button onClick={()=>setShowConfirmModal(true)} style={{width:"100%",background:assetsConfirmed?T.surface:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:assetsConfirmed?`1px solid ${T.border}`:"none",borderRadius:12,padding:"12px",color:assetsConfirmed?T.muted:"#070D1A",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{assetsConfirmed?"Update my figures":"✓ Confirm & unlock asset analysis"}</button>}
            </div>

            {/* Breakdown - unlocked */}
            {assetsConfirmed&&totalAssets>0&&(()=>{
              const segs=[{label:"Savings",value:state.assets.filter(a=>a.category==="savings").reduce((s,a)=>s+(a.value||0),0),color:T.teal,icon:"💰"},{label:"Investments",value:state.assets.filter(a=>a.category==="investments").reduce((s,a)=>s+(a.value||0),0),color:T.purple,icon:"📈"},{label:"Pension",value:state.assets.filter(a=>a.category==="pension").reduce((s,a)=>s+(a.value||0),0),color:T.amber,icon:"🏛️"},{label:"Property",value:state.assets.filter(a=>["primary_residence","investment_property"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0),color:T.green,icon:"🏠"},{label:"Other",value:state.assets.filter(a=>!["savings","investments","pension","primary_residence","investment_property"].includes(a.category)).reduce((s,a)=>s+(a.value||0),0),color:T.blue,icon:"📦"}].filter(s=>s.value>0)
              return(<div className="ls-fadein" style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
                <p style={{color:"#6B8CB8",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",margin:"12px 0 10px"}}>Your Wealth Breakdown</p>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{position:"relative",width:90,height:90,flexShrink:0}}><SmallDonut segments={segs} size={90}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><p style={{color:T.white,fontWeight:900,fontSize:10}}>{fmtK(totalAssets)}</p></div></div>
                  <div style={{flex:1}}>{segs.map(s=><div key={s.label} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><span style={{fontSize:11}}>{s.icon}</span><p style={{color:"#E2EAF6",fontSize:11,flex:1}}>{s.label}</p><p style={{color:s.color,fontWeight:800,fontSize:11}}>{Math.round(s.value/totalAssets*100)}%</p></div>)}</div>
                </div>
                <div style={{background:T.surface,borderRadius:10,padding:"10px 12px",marginTop:10}}>
                  <p style={{color:T.teal,fontWeight:800,fontSize:12,marginBottom:3}}>{productivePct}% productive assets</p>
                  <p style={{color:"#C8D8EC",fontSize:11,lineHeight:1.5}}>Productive assets (savings, investments, pensions) earn returns over time and compound. They are what build financial freedom. {productivePct<30?"Most of your wealth is currently in things that don't grow on their own. Shifting more into productive assets is the single biggest accelerator for your future net worth.":productivePct<60?"You have a decent foundation. Increasing this percentage means more money working for you while you sleep.":"Strong productive allocation. Your wealth is actively compounding toward financial freedom."}</p>
                  <button onClick={()=>{save({...state, pendingLessonN: 1, lessonReturnTab: 2});setTab(1)}} style={{background:"none",border:"none",color:T.teal,fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:0,marginTop:8}}>Learn more about productive assets in the Learn tab →</button>
                </div>
              </div>)
            })()}

            {/* Blurred preview when locked */}
            {!assetsConfirmed&&totalAssets>0&&<div style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
              <div style={{position:"relative",padding:"12px 0"}}>
                <div style={{filter:"blur(5px)",opacity:.3,pointerEvents:"none",display:"flex",alignItems:"center",gap:16}}><SmallDonut segments={[{value:60,color:T.teal},{value:40,color:T.amber}]} size={80}/><div style={{flex:1}}><p style={{color:"#E2EAF6",fontSize:11}}>Productive 60%</p><p style={{color:"#E2EAF6",fontSize:11}}>Lifestyle 40%</p></div></div>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:T.muted,fontWeight:700,fontSize:11}}>🔒 Confirm assets above to unlock analysis</p></div>
              </div>
            </div>}

            {/* Debt timeline inline */}
            {assetsConfirmed&&state.debts.length>0&&<div style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
              <p style={{color:"#6B8CB8",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",margin:"12px 0 10px"}}>Debt Freedom Timeline</p>
              {state.debts.map(d=>{const mi=(d.balance||0)*((d.interestRate||10)/100/12);const pay=d.minPayment||Math.max(mi*1.5,d.balance*0.02,25);const eff=pay-mi;const months=eff>0?Math.min(Math.ceil(d.balance/eff),360):360;const maxM=360;const label=months>=12?`${Math.round(months/12)}yr`:`${months}mo`;return <div key={d.id} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><p style={{color:"#E2EAF6",fontSize:11,fontWeight:600}}>{d.name} <span style={{color:"#4A6080",fontSize:9}}>{d.interestRate}%</span></p><p style={{color:T.muted,fontSize:10}}>{label}</p></div>
                <div style={{height:14,background:T.surface,borderRadius:5,overflow:"hidden"}}><div style={{width:`${Math.round(months/maxM*100)}%`,height:"100%",background:d.interestRate>15?`linear-gradient(90deg,${T.red}80,${T.red}40)`:d.interestRate>8?`linear-gradient(90deg,${T.amber}80,${T.amber}40)`:`linear-gradient(90deg,${T.blue}80,${T.blue}40)`,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 5px"}}><p style={{color:T.white,fontSize:8,fontWeight:700,textShadow:"0 1px 2px rgba(0,0,0,.5)"}}>{fmtK(d.balance)}</p></div></div>
              </div>})}
              {state.debts.some(d=>d.interestRate>15)&&<p style={{color:"#C8D8EC",fontSize:10,lineHeight:1.4,background:T.redDim,borderRadius:8,padding:"8px 10px"}}><strong style={{color:T.red}}>Priority:</strong> Pay down debts above 15% first — they cost the most.</p>}
            </div>}
          </div>

          {/* ═══ 3. INCOME & SPENDING ═══ */}
          <div style={{background:T.card,border:`1.5px solid ${spendingPhase==="chart"?T.purpleBorder:T.border}`,borderRadius:20,marginBottom:14,overflow:"hidden"}}>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:18}}>💰</span><div><p style={{color:T.white,fontWeight:800,fontSize:15}}>Income & Spending</p><p style={{color:T.muted,fontSize:10}}>Your monthly cash flow</p></div></div>
              <p style={{color:"#C8D8EC",fontSize:11,lineHeight:1.5,marginBottom:6}}>The goal is to land roughly around <strong style={{color:T.teal}}>50% needs, 30% wants, 20% savings</strong>. Most people spend too much on wants and not enough on their future without realising.</p>
              <button onClick={()=>{save({...state, pendingLessonN: 3, lessonReturnTab: 2});setTab(1)}} style={{background:"none",border:"none",color:T.teal,fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:0,marginBottom:12}}>Learn more about budgeting in the Learn tab →</button>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}>
                <div><p style={{color:T.teal,fontWeight:900,fontSize:18}}>{fmtK(totalIncome)}</p><p style={{color:"#4A6080",fontSize:8}}>income/mo</p></div>
                <div style={{textAlign:"center"}}><p style={{color:surplus>=0?T.teal:T.red,fontWeight:900,fontSize:14}}>{surplus>=0?"+":""}{fmt(surplus)}</p><p style={{color:"#4A6080",fontSize:8}}>surplus</p></div>
                <div style={{textAlign:"right"}}><p style={{color:T.amber,fontWeight:900,fontSize:18}}>{fmtK(totalSpending)}</p><p style={{color:"#4A6080",fontSize:8}}>spending/mo</p></div>
              </div>
              {totalIncome>0&&<div style={{position:"relative",height:16,background:T.surface,borderRadius:8,overflow:"hidden",marginBottom:6}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${Math.min(100,Math.round(totalSpending/totalIncome*100))}%`,background:`linear-gradient(90deg,${T.amber}70,${T.amber}30)`,borderRadius:8}}/>
                {surplus>0&&<div style={{position:"absolute",right:0,top:0,bottom:0,width:`${Math.round(surplus/totalIncome*100)}%`,background:`linear-gradient(90deg,${T.teal}30,${T.teal}70)`,borderRadius:"0 8px 8px 0"}}/>}
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:T.white,fontWeight:800,fontSize:9,textShadow:"0 1px 3px rgba(0,0,0,.6)"}}>{savingsRate}% saved</p></div>
              </div>}
              {(interestEarned>0||drag>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}>
                {interestEarned>0&&<div style={{background:T.tealDim,borderRadius:10,padding:"8px 10px",border:`1px solid ${T.tealBorder}`}}><p style={{color:T.teal,fontWeight:800,fontSize:12}}>+{fmt(Math.round(interestEarned/12))}/mo</p><p style={{color:"#C8D8EC",fontSize:9}}>returns for you</p></div>}
                {drag>0&&<div style={{background:T.redDim,borderRadius:10,padding:"8px 10px",border:`1px solid ${T.redBorder}`}}><p style={{color:T.red,fontWeight:800,fontSize:12}}>-{fmt(Math.round(drag/12))}/mo</p><p style={{color:"#C8D8EC",fontSize:9}}>interest on debts</p></div>}
              </div>}
            </div>
            {/* Spending analysis unlock */}
            <AnalyticsSpendingInner state={state} save={save} toast={toast} totalIncome={totalIncome} phase={spendingPhase} setPhase={setSpendingPhase}/>
          </div>

          {/* ═══ 4. WHAT-IF GRAPH ═══ */}
          <div style={{background:T.card,border:`1.5px solid ${T.tealBorder}`,borderRadius:20,marginBottom:14,overflow:"hidden"}}>
            <div style={{padding:"14px 16px 10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>🔮</span><div><p style={{color:T.white,fontWeight:800,fontSize:14}}>What If I Saved More?</p><p style={{color:T.muted,fontSize:10}}>Compound growth over time</p></div></div>
                <div style={{textAlign:"right"}}><p style={{color:T.teal,fontWeight:900,fontSize:16}}>+£{whatIfExtra}</p><p style={{color:"#4A6080",fontSize:8}}>per month</p></div>
              </div>
              <p style={{color:"#C8D8EC",fontSize:11,lineHeight:1.5,marginBottom:6}}>The grey line shows your current trajectory. The teal line shows where you'd land by saving an extra <strong style={{color:T.teal}}>£{whatIfExtra}</strong> per month. Drag the slider to see the impact.</p>
              <button onClick={()=>{save({...state, pendingLessonN: 14, lessonReturnTab: 2});setTab(1)}} style={{background:"none",border:"none",color:T.teal,fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:0,marginBottom:10}}>Learn more about investing and compound interest in the Learn tab →</button>
              <input type="range" min="0" max="1000" step="25" value={whatIfExtra} onChange={e=>setWhatIfExtra(Number(e.target.value))} style={{width:"100%",accentColor:T.teal,height:4,marginBottom:4}}/>
            </div>
            <div style={{height:160,padding:"0 4px"}}>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={wiData} margin={{top:5,right:8,bottom:0,left:0}}>
                  <defs><linearGradient id="gWiC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.muted} stopOpacity={.12}/><stop offset="95%" stopColor={T.muted} stopOpacity={0}/></linearGradient><linearGradient id="gWiB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.2}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="age" tick={{fontSize:9,fill:"#8FA3BE"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:8,fill:"#6B8CB8"}} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={48}/>
                  <Tooltip formatter={(v,n)=>[`£${fmtAx(v)}`,n==="current"?"Current":`+£${whatIfExtra}/mo`]} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:11,color:T.white}} labelFormatter={v=>`Age ${v}`}/>
                  <Area type="monotone" dataKey="current" stroke="#6B8CB8" strokeWidth={1.5} fill="url(#gWiC)" dot={false} name="current"/>
                  {whatIfExtra>0&&<Area type="monotone" dataKey="boosted" stroke={T.teal} strokeWidth={2.5} fill="url(#gWiB)" dot={false} name="boosted"/>}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {whatIfExtra>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,padding:"8px 16px 14px"}}>
              {[10,20,30].map(yr=>{const d=wiData.find(x=>x.year>=yr);return d?<div key={yr} style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:T.muted,fontSize:8}}>{yr}yr</p><p style={{color:T.teal,fontWeight:900,fontSize:13}}>+{fmtK(d.boosted-d.current)}</p></div>:null})}
            </div>}
          </div>

          {/* ═══ 5. FI METER ═══ */}
          {totalSpending>0&&<div style={{background:T.card,border:`1px solid rgba(52,211,153,.2)`,borderRadius:20,marginBottom:14,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>🏖️</span><div><p style={{color:T.white,fontWeight:800,fontSize:14}}>Financial Independence</p><p style={{color:T.muted,fontSize:10}}>When work becomes optional</p></div></div>
              <div style={{width:48,height:48}}><svg viewBox="0 0 48 48" width={48} height={48}><circle cx="24" cy="24" r="19" fill="none" stroke={T.border} strokeWidth="5"/><circle cx="24" cy="24" r="19" fill="none" stroke={T.green} strokeWidth="5" strokeDasharray={`${fiProg*1.194} ${119.4-fiProg*1.194}`} strokeLinecap="round" transform="rotate(-90 24 24)"/><text x="24" y="26" textAnchor="middle" fill={T.green} fontSize="11" fontWeight="900" fontFamily="Outfit">{fiProg}%</text></svg></div>
            </div>
            <div style={{height:8,background:T.border,borderRadius:4,overflow:"hidden",marginBottom:8}}><div style={{width:`${fiProg}%`,height:"100%",background:`linear-gradient(90deg,${T.green},${T.teal})`,borderRadius:4,transition:"width .8s"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:T.green,fontWeight:900,fontSize:13}}>{fmtK(fiNum)}</p><p style={{color:T.muted,fontSize:8}}>FI number</p></div>
              <div style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:T.white,fontWeight:900,fontSize:13}}>{fmtK(coastFI)}</p><p style={{color:T.muted,fontSize:8}}>Coast FI</p></div>
              <div style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:T.white,fontWeight:900,fontSize:13}}>{yearsToFI?`~${yearsToFI}yr`:"—"}</p><p style={{color:T.muted,fontSize:8}}>Years to FI</p></div>
            </div>
            <p style={{color:T.muted,fontSize:10,lineHeight:1.4,marginTop:8}}>FI = 25× annual spending in productive assets. Property equity excluded.</p>
          </div>}

          {/* ═══ 6. MOMENTUM ═══ */}
          <AnalyticsMomentum state={state}/>

        </div>
      </div>

      {/* ═══ MODALS — NO DOUBLE WRAPPING ═══ */}
      {sheet==="asset"&&<AssetSheet item={editItem} onClose={()=>{setSheet(null);setEditItem(null)}} onSave={saveAsset} onDelete={editItem?()=>{deleteAsset(editItem);setSheet(null);setEditItem(null)}:null}/>}
      {sheet==="debt"&&<DebtSheet item={editItem} onClose={()=>{setSheet(null);setEditItem(null)}} onSave={saveDebt} onDelete={editItem?()=>{deleteDebt(editItem);setSheet(null);setEditItem(null)}:null}/>}
      {showHealthQ&&<HQSheet/>}
      {showRefineSheet&&<RefineSheet state={state} save={save} toast={toast} onClose={()=>setShowRefineSheet(false)}/>}
      {showConfirmModal&&<div style={{position:"fixed",inset:0,background:"rgba(7,13,26,.88)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div className="ls-fadein" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:440,maxHeight:"80vh",overflowY:"auto"}}>
          <p style={{color:T.white,fontWeight:900,fontSize:17,marginBottom:6}}>Confirm your figures</p>
          <p style={{color:"#D8E8F8",fontSize:13,lineHeight:1.6,marginBottom:16}}>Are these roughly accurate? Tap any item to edit.</p>
          {state.assets.length>0&&<div style={{marginBottom:12}}><p style={{color:T.green,fontWeight:700,fontSize:11,marginBottom:6}}>Assets</p>{state.assets.map(a=><div key={a.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:T.card,borderRadius:8,marginBottom:3}}><p style={{color:"#E2EAF6",fontSize:12}}>{a.name}</p><p style={{color:T.teal,fontWeight:700,fontSize:12}}>{fmt(a.value)}</p></div>)}</div>}
          {state.debts.length>0&&<div style={{marginBottom:16}}><p style={{color:T.red,fontWeight:700,fontSize:11,marginBottom:6}}>Debts</p>{state.debts.map(d=><div key={d.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:T.card,borderRadius:8,marginBottom:3}}><p style={{color:"#E2EAF6",fontSize:12}}>{d.name} <span style={{color:"#4A6080",fontSize:10}}>({d.interestRate}%)</span></p><p style={{color:T.red,fontWeight:700,fontSize:12}}>{fmt(d.balance)}</p></div>)}</div>}
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setShowConfirmModal(false);setAssetsConfirmed(true);toast("Assets verified")}} style={{flex:1,background:T.teal,border:"none",borderRadius:12,padding:"14px",color:T.bg,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Yes, looks right</button>
            <button onClick={()=>setShowConfirmModal(false)} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",color:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Edit first</button>
          </div>
        </div>
      </div>}
    </>
  )
}

/* ════════ SPENDING ANALYSIS (inner, no card wrapper) ════════ */
const SPEND_CATS = [
  {id:"housing",label:"Rent / Mortgage",icon:"🏠",bucket:"needs"},{id:"food",label:"Groceries",icon:"🛒",bucket:"needs"},
  {id:"transport",label:"Transport",icon:"🚗",bucket:"needs"},{id:"bills",label:"Bills & utilities",icon:"⚡",bucket:"needs"},
  {id:"health",label:"Health & insurance",icon:"💊",bucket:"needs"},{id:"eating_out",label:"Eating out & coffee",icon:"🍽️",bucket:"wants"},
  {id:"subs",label:"Subscriptions",icon:"📺",bucket:"wants"},{id:"shopping",label:"Shopping & clothing",icon:"🛍️",bucket:"wants"},
  {id:"leisure",label:"Leisure & hobbies",icon:"🎮",bucket:"wants"},{id:"personal",label:"Personal care",icon:"💇",bucket:"wants"},
  {id:"debt_repay",label:"Debt repayments",icon:"💳",bucket:"needs"},{id:"other",label:"Other / misc",icon:"📦",bucket:"wants"},
]
const BUCKET_COLORS={needs:T.amber,wants:T.purple,savings:T.teal}
const BUCKET_LABELS={needs:"Needs",wants:"Wants",savings:"Savings"}

function AnalyticsSpendingInner({state,save,toast,totalIncome,phase,setPhase}){
  const[amounts,setAmounts]=useState(state.spending?.breakdown||{})
  const totalInput=Object.values(amounts).reduce((s,v)=>s+(parseFloat(v)||0),0)
  const leftover=Math.max(0,totalIncome-totalInput)
  const bucketTotals={needs:0,wants:0,savings:0}
  SPEND_CATS.forEach(c=>{bucketTotals[c.bucket]+=parseFloat(amounts[c.id])||0})
  bucketTotals.savings=leftover
  const allTotal=totalInput+leftover
  const chartSegs=Object.entries(bucketTotals).filter(([,v])=>v>0).map(([k,v])=>({label:BUCKET_LABELS[k],value:v,color:BUCKET_COLORS[k]}))
  function saveBreakdown(){save({...state,spending:{...state.spending,breakdown:amounts,monthly:totalInput}});setPhase("chart");toast("Spending saved")}
  function MiniDonut({segments,size=100}){const total=segments.reduce((s,x)=>s+x.value,0);if(total===0)return null;const cx=size/2,cy=size/2,r=size*0.38,sw=size*0.18;let cum=-90;const toXY=a=>({x:cx+r*Math.cos(a*Math.PI/180),y:cy+r*Math.sin(a*Math.PI/180)});const arcs=segments.map(seg=>{const sweep=(seg.value/total)*360,start=cum;cum+=sweep;const s=toXY(start),e=toXY(start+sweep-0.5);return{...seg,d:`M${s.x},${s.y} A${r},${r} 0 ${sweep>180?1:0},1 ${e.x},${e.y}`}});return <svg width={size} height={size} style={{overflow:"visible"}}>{arcs.map((a,i)=><path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={sw}/>)}</svg>}

  return(<>
    {/* Unlock button or edit */}
    {phase==="locked"&&<div style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
      <div style={{position:"relative",padding:"12px 0"}}>
        <div style={{filter:"blur(5px)",opacity:.3,pointerEvents:"none",display:"flex",alignItems:"center",gap:14}}><MiniDonut segments={[{value:50,color:T.amber},{value:30,color:T.purple},{value:20,color:T.teal}]} size={70}/><div><p style={{color:T.amber,fontSize:11}}>Needs 50%</p><p style={{color:T.purple,fontSize:11}}>Wants 30%</p><p style={{color:T.teal,fontSize:11}}>Savings 20%</p></div></div>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><button onClick={()=>setPhase("guide")} style={{background:T.purple,border:"none",borderRadius:12,padding:"10px 18px",color:T.bg,fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Unlock spending analysis →</button></div>
      </div>
    </div>}

    {phase==="guide"&&<div className="ls-fadein" style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
      <div style={{background:T.surface,borderRadius:12,padding:"14px",marginTop:12,marginBottom:12}}>
        <p style={{color:T.white,fontWeight:800,fontSize:13,marginBottom:8}}>📋 Quick prep</p>
        <p style={{color:"#D8E8F8",fontSize:12,lineHeight:1.6,marginBottom:8}}>Check your last 3 months of bank statements and average each category. Rough numbers are fine.</p>
        <p style={{color:T.muted,fontSize:10,lineHeight:1.4}}>Whatever is left over after spending is automatically counted as savings (50/30/20 framework).</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setPhase("input")} style={{flex:1,background:T.purple,border:"none",borderRadius:12,padding:"12px",color:T.bg,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>I'm ready →</button>
        <button onClick={()=>setPhase("locked")} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",color:T.muted,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Later</button>
      </div>
    </div>}

    {phase==="input"&&<div className="ls-fadein" style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,margin:"12px 0"}}>
        <div style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:T.teal,fontWeight:900,fontSize:14}}>{fmtK(totalIncome)}</p><p style={{color:"#4A6080",fontSize:8}}>income</p></div>
        <div style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:T.amber,fontWeight:900,fontSize:14}}>{fmtK(totalInput)}</p><p style={{color:"#4A6080",fontSize:8}}>spending</p></div>
        <div style={{background:T.surface,borderRadius:10,padding:"8px",textAlign:"center"}}><p style={{color:leftover>0?T.teal:T.red,fontWeight:900,fontSize:14}}>{fmtK(leftover)}</p><p style={{color:"#4A6080",fontSize:8}}>→ savings</p></div>
      </div>
      {["needs","wants"].map(bucket=>(<div key={bucket} style={{marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}><div style={{width:6,height:6,borderRadius:"50%",background:BUCKET_COLORS[bucket]}}/><p style={{color:BUCKET_COLORS[bucket],fontWeight:800,fontSize:10,textTransform:"uppercase",letterSpacing:0.8}}>{BUCKET_LABELS[bucket]}</p></div>
        {SPEND_CATS.filter(c=>c.bucket===bucket).map(cat=>(<div key={cat.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:13,width:20,textAlign:"center"}}>{cat.icon}</span><p style={{flex:1,color:"#E2EAF6",fontSize:11}}>{cat.label}</p>
          <div style={{display:"flex",alignItems:"center",gap:2}}><span style={{color:T.muted,fontSize:12}}>£</span><input type="number" min="0" placeholder="0" value={amounts[cat.id]||""} onChange={e=>setAmounts(v=>({...v,[cat.id]:e.target.value}))} style={{width:60,background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 6px",color:T.white,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/></div>
        </div>))}
      </div>))}
      <div style={{display:"flex",gap:8}}>
        <button onClick={saveBreakdown} disabled={totalInput===0} style={{flex:1,background:totalInput>0?T.purple:T.subtle,border:"none",borderRadius:12,padding:"12px",color:totalInput>0?T.bg:T.muted,fontWeight:800,fontSize:13,cursor:totalInput>0?"pointer":"not-allowed",fontFamily:"inherit"}}>Save & analyse</button>
        <button onClick={()=>setPhase(state.spending?.breakdown?"chart":"locked")} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",color:T.muted,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
      </div>
    </div>}

    {phase==="chart"&&chartSegs.length>0&&<div className="ls-fadein" style={{padding:"0 18px 16px",borderTop:`1px solid ${T.border}`}}>
      <p style={{color:"#6B8CB8",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",margin:"12px 0 10px"}}>50/30/20 Breakdown</p>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:12}}>
        <div style={{position:"relative",width:90,height:90,flexShrink:0}}><MiniDonut segments={chartSegs} size={90}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><p style={{color:T.white,fontWeight:900,fontSize:10}}>{fmt(allTotal)}</p><p style={{color:T.muted,fontSize:7}}>/mo</p></div></div>
        <div style={{flex:1}}>{chartSegs.map(s=>{const pct=allTotal>0?Math.round(s.value/allTotal*100):0;const target=s.label==="Needs"?50:s.label==="Wants"?30:20;const ok=s.label==="Savings"?pct>=target:pct<=target;return(<div key={s.label} style={{marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:s.color}}/><p style={{color:"#E2EAF6",fontSize:11}}>{s.label}</p></div><div style={{display:"flex",alignItems:"center",gap:5}}><p style={{color:s.color,fontWeight:800,fontSize:11}}>{pct}%</p><p style={{color:ok?T.green:T.amber,fontSize:8,fontWeight:700}}>{ok?"✓":`→${target}%`}</p></div></div>
          <div style={{background:T.surface,borderRadius:99,height:5,overflow:"hidden",position:"relative"}}><div style={{width:`${pct}%`,height:"100%",background:s.color,borderRadius:99}}/><div style={{position:"absolute",left:`${target}%`,top:0,bottom:0,width:1.5,background:"#fff",opacity:.2}}/></div>
        </div>)})}</div>
      </div>
      {(()=>{const nP=allTotal>0?Math.round(bucketTotals.needs/allTotal*100):0,sP=allTotal>0?Math.round(bucketTotals.savings/allTotal*100):0,wP=allTotal>0?Math.round(bucketTotals.wants/allTotal*100):0;let msg,col=T.teal;if(sP>=20&&nP<=55)msg="Your split looks healthy.";else if(sP<10){msg=`Only ${sP}% to savings. Small changes make a big difference over time.`;col=T.amber}else if(nP>60){msg=`Needs at ${nP}% — above 50% target. Look for ways to reduce fixed costs.`;col=T.amber}else if(wP>35){msg=`Wants at ${wP}%. Small reductions free up savings.`;col=T.amber}else msg="Decent position. Keep building savings.";return <div style={{background:`${col}08`,border:`1px solid ${col}15`,borderRadius:10,padding:"8px 12px"}}><p style={{color:"#E2EAF6",fontSize:11,lineHeight:1.45}}>{msg}</p></div>})()}
    </div>}
  </>)
}

/* ════════ NET WORTH MOMENTUM ════════ */
function AnalyticsMomentum({state}){
  const history=state.history||[];const has3=history.length>=3
  const demo=[{month:"Jan",nw:18000},{month:"Feb",nw:19200},{month:"Mar",nw:20100},{month:"Apr",nw:21800},{month:"May",nw:22400},{month:"Jun",nw:24000}]
  if(!has3)return(<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,marginBottom:12,padding:"14px 16px"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:18}}>📈</span><p style={{color:T.white,fontWeight:800,fontSize:14}}>Net Worth Over Time</p><span style={{marginLeft:"auto",color:T.muted,fontSize:10,fontWeight:700,background:T.surface,padding:"2px 8px",borderRadius:99}}>🔒 {history.length}/3</span></div>
    <div style={{position:"relative"}}><div style={{filter:"blur(5px)",opacity:.25,pointerEvents:"none",height:70}}><ResponsiveContainer width="100%" height={70}><AreaChart data={demo}><defs><linearGradient id="gMD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.blue} stopOpacity={.3}/><stop offset="95%" stopColor={T.blue} stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="nw" stroke={T.blue} strokeWidth={2} fill="url(#gMD)" dot={false}/></AreaChart></ResponsiveContainer></div><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><p style={{color:T.white,fontWeight:700,fontSize:11}}>Unlocks after 3 monthly updates</p><div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<history.length?T.teal:T.border}}/>)}</div></div></div>
  </div>)
  const cd=history.slice(-12).map(h=>({month:h.month?new Date(h.month+"-01").toLocaleDateString("en-GB",{month:"short"}):"?",nw:h.netWorth}))
  const change=(cd[cd.length-1]?.nw||0)-(cd[0]?.nw||0);const pct=cd[0]?.nw?Math.round((change/Math.abs(cd[0].nw))*100):0
  const fmtAx=v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1000?`${(v/1000).toFixed(0)}k`:`${v}`
  return(<div style={{background:T.card,border:`1.5px solid ${T.blueBorder}`,borderRadius:20,marginBottom:12,overflow:"hidden"}}>
    <div style={{padding:"14px 16px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>📈</span><div><p style={{color:T.white,fontWeight:800,fontSize:14}}>Net Worth Over Time</p><p style={{color:change>=0?T.teal:T.red,fontSize:11,fontWeight:700}}>{change>=0?"↑":"↓"} {fmt(Math.abs(change))} ({pct>0?"+":""}{pct}%)</p></div></div></div></div>
    <div style={{height:120,padding:"0 4px 12px"}}><ResponsiveContainer width="100%" height={120}><AreaChart data={cd} margin={{top:5,right:8,bottom:0,left:0}}><defs><linearGradient id="gMR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={change>=0?T.blue:T.red} stopOpacity={.3}/><stop offset="95%" stopColor={change>=0?T.blue:T.red} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" tick={{fontSize:9,fill:"#8FA3BE"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:8,fill:"#6B8CB8"}} axisLine={false} tickLine={false} tickFormatter={fmtAx} width={48}/><Tooltip formatter={v=>[fmt(v),"Net worth"]} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:11,color:T.white}}/><Area type="monotone" dataKey="nw" stroke={change>=0?T.blue:T.red} strokeWidth={2.5} fill="url(#gMR)" dot={{r:2.5,fill:change>=0?T.blue:T.red,strokeWidth:0}}/></AreaChart></ResponsiveContainer></div>
  </div>)
}

/* ════════ REFINE COMPARISON SHEET ════════ */
function RefineSheet({ state, save, toast, onClose }) {
  const r = state.refineProfile || {}
  const [education, setEducation] = useState(r.education || "")
  const [region, setRegion] = useState(r.region || "")
  const [industry, setIndustry] = useState(r.industry || "")
  const [housing, setHousing] = useState(r.housing || "")

  const EDUCATION = ["GCSE / no formal","A-levels","Undergraduate degree","Postgraduate degree"]
  const REGIONS = ["London","South East","South West","East","Midlands","North","Wales","Scotland","Northern Ireland"]
  const INDUSTRIES = ["Tech / IT","Finance / law","Healthcare","Education","Public sector","Retail / hospitality","Creative / media","Construction / trades","Self-employed","Other"]
  const HOUSING = ["Living with parents","Renting","Mortgage / own home","Own home outright"]

  function saveAndClose() {
    save({ ...state, refineProfile: { education, region, industry, housing } })
    toast("Comparison refined")
    onClose()
  }

  function Section({ label, options, value, onChange }) {
    return (
      <div style={{ marginBottom:18 }}>
        <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:8 }}>{label}</p>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
          {options.map(o => {
            const sel = value === o
            return <button key={o} onClick={()=>onChange(sel?"":o)}
              style={{ background:sel?T.tealDim:T.card,border:`1.5px solid ${sel?T.teal:T.border}`,borderRadius:99,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",color:sel?T.teal:"#C8D8EC",fontWeight:600,fontSize:12 }}>{o}</button>
          })}
        </div>
      </div>
    )
  }

  return (
    <Sheet title="Refine your comparison" onClose={onClose}>
      <p style={{ color:"#C8D8EC",fontSize:13,lineHeight:1.6,marginBottom:18 }}>The more we know about your situation, the more accurate your comparison becomes. All optional, all stays on your device.</p>
      <Section label="Highest education" options={EDUCATION} value={education} onChange={setEducation}/>
      <Section label="Where you live" options={REGIONS} value={region} onChange={setRegion}/>
      <Section label="Industry" options={INDUSTRIES} value={industry} onChange={setIndustry}/>
      <Section label="Housing" options={HOUSING} value={housing} onChange={setHousing}/>
      <Btn onClick={saveAndClose}>Save and refine</Btn>
    </Sheet>
  )
}

/* ── Asset Sheet detailed ───────────────────────────────────── */
function AssetSheet({ item, onClose, onSave, onDelete }) {
  const editing = !!item
  const [cat,     setCat]     = useState(item?.category||null)
  const [name,    setName]    = useState(item?.name||"")
  const [val,     setVal]     = useState(item?.value||0)
  const [income,  setIncome]  = useState(item?.monthlyIncome||0)
  const [hasLoan, setHasLoan] = useState(false)
  const [loanBal, setLoanBal] = useState(0)
  const [err,     setErr]     = useState("")

  const t = ASSET_TYPES.find(x=>x.cat===cat)
  const canHaveLoan = ["investment_property","vehicle"].includes(cat)

  function go() {
    if(!cat)   { setErr("Select an asset type."); return }
    if(val<=0) { setErr("Enter a value greater than zero."); return }
    setErr("")
    onSave({ cat, name:name||(t?.label||"Asset"), val, monthlyIncome:income, annualReturn:null, hasLoan, loanBal, existingId:item?.id, existingLinkedDebtId:item?.linkedDebtId })
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
        {["investment_property","rental"].includes(cat) && (
          <CurrencyInput label="Monthly rental income" value={income} onChange={setIncome}/>
        )}
        {canHaveLoan && (
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:hasLoan?10:0 }}>
              <Toggle value={hasLoan} onChange={setHasLoan}/>
              <p style={{ color:"#E2EAF6",fontSize:14,fontWeight:600 }}>Has a loan against it</p>
            </div>
            {hasLoan && <CurrencyInput label="Outstanding loan balance" value={loanBal} onChange={setLoanBal}/>}
          </div>
        )}
      </div>
      {err&&<p style={{ color:T.red,fontSize:13,marginBottom:10 }}>{err}</p>}
      <Btn onClick={go}>{editing?"Save changes":"Add asset"}</Btn>
      {editing && onDelete && (
        <button onClick={onDelete} style={{ width:"100%",background:"none",border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"12px",color:T.red,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:10 }}>
          Delete this asset
        </button>
      )}
    </Sheet>
  )
}

/* ── Debt Sheet detailed ────────────────────────────────────── */
function DebtSheet({ item, onClose, onSave, onDelete }) {
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
      {editing && onDelete && (
        <button onClick={onDelete} style={{ width:"100%",background:"none",border:`1px solid ${T.redBorder}`,borderRadius:12,padding:"12px",color:T.red,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:10 }}>
          Delete this debt
        </button>
      )}
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
   NEW LESSONS SYSTEM (LifeSmart Lessons v3)
   ════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   LIFESMART LESSONS v3: Refined Design and Content Updates
   ═══════════════════════════════════════════════════════════════════════ */

const C = {
  green: "#34D399", greenDark: "#059669", greenLight: "#10B98118",
  blue: "#38BDF8", blueDark: "#0EA5E9", blueLight: "#38BDF818",
  red: "#FB7185", redDark: "#EF4444", redLight: "#F8717118",
  orange: "#FBBF24", orangeLight: "#FBBF2418",
  purple: "#A78BFA", purpleDark: "#8B5CF6", purpleLight: "#A78BFA18",
  gold: "#FCD34D", goldLight: "#FCD34D14",
  bg: "#06080F", surface: "#0C1120", card: "#111827",
  text: "#F8FAFC", textMid: "#E2E8F0", textLight: "#94A3B8", textFaint: "#4B5563",
  border: "#1F2937", borderDark: "#374151",
  navy: "#0C1120", navyLight: "#1F2937",
  teal: "#2DD4BF",
}

const STYLES = `
@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.05)}70%{transform:scale(.95)}100%{opacity:1;transform:scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

.bounce-in{animation:bounceIn .5s cubic-bezier(.2,.8,.4,1) both}
.slide-up{animation:slideUp .4s cubic-bezier(.2,.8,.4,1) both}
.slide-in{animation:slideIn .35s cubic-bezier(.2,.8,.4,1) both}
.pop{animation:pop .3s cubic-bezier(.2,.8,.4,1) both}
.shake{animation:shake .4s ease both}
.pulse{animation:pulse .3s ease both}
.float{animation:float 3s ease-in-out infinite}
`

/* ─── SHARED COMPONENTS ──────────────────────────────────────────────── */

function Button3D({ children, color = C.green, darkColor, textColor = "#fff", onClick, disabled, style = {}, full }) {
  const dark = darkColor || (color === C.green ? C.greenDark : color === C.blue ? C.blueDark : color === C.red ? C.redDark : color === C.purple ? C.purpleDark : "#333")
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: full ? "100%" : "auto", background: color, border: "none", borderRadius: 14,
        padding: "16px 28px", color: textColor, fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em",
        boxShadow: `0 4px 0 ${dark}`, transform: "translateY(0)", transition: "all .1s",
        opacity: disabled ? .35 : 1, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...style }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(3px)"; e.currentTarget.style.boxShadow = `0 1px 0 ${dark}` }}}
      onMouseUp={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 0 ${dark}` }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 0 ${dark}` }}
    >{children}</button>
  )
}

function Tip({ icon = "💡", title, children, color = C.blue }) {
  return (
    <div style={{ background: `${color}0A`, borderLeft: `3px solid ${color}`, borderRadius: "0 14px 14px 0", padding: "16px 18px", margin: "16px 0" }}>
      {title && (
        <p style={{ color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 15 }}>{icon}</span> {title}
        </p>
      )}
      <p style={{ color: C.textMid, fontSize: 15, lineHeight: 1.7, fontWeight: 500 }}>{children}</p>
    </div>
  )
}

function Equation({ parts }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", margin: "20px 0", padding: "16px 0" }}>
      {parts.map((p, i) => p.op ? (
        <span key={i} style={{ color: C.textFaint, fontSize: 22, fontWeight: 800 }}>{p.op}</span>
      ) : (
        <div key={i} style={{ textAlign: "center", background: `${p.color}0A`, borderRadius: 12, padding: "12px 14px", border: `1px solid ${p.color}20` }}>
          <p style={{ color: p.color, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>{p.value}</p>
          <p style={{ color: C.textFaint, fontSize: 10, fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: .6 }}>{p.label}</p>
        </div>
      ))}
    </div>
  )
}

function LConfetti({ active }) {
  if (!active) return null
  const colors = [C.green, C.blue, C.gold, C.orange, C.purple, C.red, "#FF69B4"]
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 999 }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", top: -10, left: `${Math.random() * 100}%`,
          width: Math.random() * 10 + 6, height: Math.random() * 10 + 6,
          background: colors[i % colors.length], borderRadius: Math.random() > .5 ? "50%" : "2px",
          animation: `confettiFall ${Math.random() * 2 + 1.5}s ease-out ${Math.random() * .5}s forwards` }} />
      ))}
    </div>
  )
}

function ProgressBar({ current, total, onBack, onPrev, canGoBack }) {
  const pct = ((current + 1) / total) * 100
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: `${C.bg}F0`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${C.border}` }}>
      <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, display: "flex", color: C.textLight, fontSize: 20 }}>✕</button>
      {canGoBack && <button onClick={onPrev} style={{ background: "none", border: "none", padding: 4, display: "flex", color: C.textLight, fontSize: 18 }}>←</button>}
      <div style={{ flex: 1, height: 6, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.teal})`, borderRadius: 99, width: `${pct}%`, transition: "width .5s cubic-bezier(.2,.8,.4,1)" }} />
      </div>
      <span style={{ color: C.textFaint, fontSize: 12, fontWeight: 700, minWidth: 32, textAlign: "right" }}>{current + 1}/{total}</span>
    </div>
  )
}

function FeedbackBanner({ correct, message, onContinue }) {
  return (
    <div className="slide-up" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: correct ? "#064E3B" : "#7F1D1D", borderTop: `1px solid ${correct ? C.green+"40" : C.red+"40"}`, padding: "20px 20px 32px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{correct ? "✅" : "❌"}</span>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>{correct ? "Nice work!" : "Not quite!"}</p>
        </div>
        <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 16 }}>{message}</p>
        <Button3D color="rgba(255,255,255,.15)" darkColor="rgba(0,0,0,.2)" onClick={onContinue} full>Continue</Button3D>
      </div>
    </div>
  )
}

/* ─── VIDEO PLACEHOLDER CARD ─────────────────────────────────────────── */
function VideoCard({ s, onNext }) {
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <p style={{ color: C.textLight, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>📹 Go deeper</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(s.videos || []).map((v, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
            {/* Thumbnail placeholder */}
            <div style={{ height: 140, background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24, color: C.text, marginLeft: 3 }}>▶</span>
              </div>
              <span style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,.6)", color: C.text, fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{v.duration || "2:30"}</span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{v.title}</p>
              {v.desc && <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, marginTop: 4, lineHeight: 1.4 }}>{v.desc}</p>}
            </div>
          </div>
        ))}
      </div>
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

/* ─── SAVING GOAL CALCULATOR ─────────────────────────────────────────── */
function SavingGoalCard({ s, onNext }) {
  const [name, setName] = useState("")
  const [target, setTarget] = useState("")
  const [saved, setSaved] = useState("")
  const [monthly, setMonthly] = useState("")

  const tgt = parseFloat(target) || 0
  const svd = parseFloat(saved) || 0
  const mth = parseFloat(monthly) || 0
  const remaining = Math.max(0, tgt - svd)
  const months = mth > 0 ? Math.ceil(remaining / mth) : 0

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} />
      <HookBox color={C.purple}>{s.hook}</HookBox>
      {s.intro && <p style={{ color: C.textMid, fontSize: 16, fontWeight: 500, lineHeight: 1.65, marginBottom: 18 }}>{s.intro}</p>}

      <div style={{ background: C.card, borderRadius: 20, padding: "22px 20px", border: `1px solid ${C.border}` }}>
        <p style={{ color: C.textLight, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 14 }}>🎯 Set a saving goal</p>

        <label style={{ color: C.textLight, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>What are you saving for?</label>
        <input placeholder="e.g. Holiday, Car insurance, New phone" value={name} onChange={e => setName(e.target.value)}
          style={{ width: "100%", background: C.surface, border: `1px solid ${name ? C.purple : C.border}`, borderRadius: 14, padding: "14px 16px", color: C.text, fontSize: 16, fontWeight: 600, outline: "none", marginBottom: 14, transition: "border .2s" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ color: C.textLight, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Total cost</label>
            <CurrInput value={target} onChange={setTarget} placeholder="e.g. 600" color={C.purple} />
          </div>
          <div>
            <label style={{ color: C.textLight, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Already saved</label>
            <CurrInput value={saved} onChange={setSaved} placeholder="0" color={C.green} />
          </div>
        </div>

        <label style={{ color: C.textLight, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>How much can you save per month?</label>
        <CurrInput value={monthly} onChange={setMonthly} placeholder="e.g. 50" color={C.blue} />

        {tgt > 0 && mth > 0 && (
          <div className="slide-up" style={{ marginTop: 18, background: `linear-gradient(135deg, ${C.purple}30, ${C.blue}20)`, borderRadius: 18, padding: "22px 20px", textAlign: "center", color: C.text }}>
            <p style={{ fontSize: 14, fontWeight: 700, opacity: .85, textTransform: "uppercase", letterSpacing: .8 }}>
              {name || "Your goal"}
            </p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 44, fontWeight: 700, lineHeight: 1, marginTop: 8 }}>
              {months} month{months !== 1 ? "s" : ""}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, opacity: .85, marginTop: 8 }}>
              £{mth}/month × {months} months = £{(mth * months).toLocaleString()}
            </p>
            {remaining > 0 && remaining !== tgt && (
              <p style={{ fontSize: 13, fontWeight: 600, opacity: .7, marginTop: 6 }}>
                £{svd.toLocaleString()} already saved · £{remaining.toLocaleString()} to go
              </p>
            )}
          </div>
        )}
      </div>

      {s.examples && (
        <div style={{ marginTop: 18 }}>
          <p style={{ color: C.textLight, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>Common sinking fund ideas</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {s.examples.map((ex, i) => (
              <span key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: "7px 14px", fontSize: 14, fontWeight: 600, color: C.textMid }}>
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}

      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

/* ─── DEBT VISUAL CARD (Avalanche/Snowball diagrams) ─────────────────── */
function DebtVisualCard({ s, onNext }) {
  const [step, setStep] = useState(0)
  const debts = s.debts || []
  const maxSteps = debts.length

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} />
      <HookBox color={s.method === "avalanche" ? C.blue : C.purple}>{s.hook}</HookBox>
      <p style={{ color: C.textMid, fontSize: 16, fontWeight: 500, lineHeight: 1.65, marginBottom: 20 }}>{s.intro}</p>

      {/* Visual debt bars */}
      <div style={{ background: C.card, borderRadius: 20, padding: "22px 20px", border: `1px solid ${C.border}` }}>
        <p style={{ color: C.textLight, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 16 }}>
          {s.method === "avalanche" ? "📊 Highest rate first" : "❄️ Smallest balance first"}
        </p>
        {debts.map((d, i) => {
          const cleared = i < step
          const active = i === step
          const pct = cleared ? 0 : active ? Math.max(20, 100 - (step * 30)) : 100
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <p style={{ color: cleared ? C.green : active ? "#fff" : C.textMid, fontSize: 15, fontWeight: 700 }}>
                  {cleared ? "✅ " : active ? "🎯 " : ""}{d.label}
                </p>
                <p style={{ color: cleared ? C.green : C.textLight, fontSize: 13, fontWeight: 700 }}>
                  {cleared ? "CLEARED" : d.detail}
                </p>
              </div>
              <div style={{ height: 28, background: `${C.border}80`, borderRadius: 8, overflow: "hidden", position: "relative" }}>
                <div style={{
                  height: "100%", borderRadius: 8,
                  width: `${pct}%`, transition: "width .8s ease",
                  background: cleared ? C.green : active ? `linear-gradient(90deg, ${s.method === "avalanche" ? C.blue : C.purple}, ${s.method === "avalanche" ? "#4DC4FF" : "#E879F9"})` : C.border,
                }} />
                {!cleared && (
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: cleared || active ? "#fff" : C.textLight, fontSize: 13, fontWeight: 700 }}>
                    £{d.balance}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {step >= maxSteps && (
          <div className="bounce-in" style={{ background: C.greenLight, borderRadius: 14, padding: "16px", textAlign: "center", border: `2px solid ${C.green}`, marginTop: 8 }}>
            <p style={{ fontSize: 28, marginBottom: 6 }}>🏆</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.greenDark }}>Debt free!</p>
            <p style={{ color: C.textMid, fontSize: 15, fontWeight: 500, marginTop: 6 }}>{s.conclusion}</p>
          </div>
        )}
      </div>

      <FixedBottom>
        {step < maxSteps ? (
          <Button3D onClick={() => setStep(s => s + 1)} full color={s.method === "avalanche" ? C.blue : C.purple} darkColor={s.method === "avalanche" ? C.blueDark : "#9333EA"}>
            Clear next debt ›
          </Button3D>
        ) : (
          <Button3D onClick={onNext} full>Continue</Button3D>
        )}
      </FixedBottom>
    </div>
  )
}

/* ─── SMALL HELPERS ──────────────────────────────────────────────────── */

function FixedBottom({ children }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px 32px", background: `linear-gradient(transparent 0%, ${C.bg}CC 30%, ${C.bg} 50%)`, zIndex: 40 }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>{children}</div>
    </div>
  )
}

function CardHeader({ emoji, tag, title, iconBg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
      <div className="float" style={{
        width: 52, height: 52, borderRadius: 14, background: C.surface,
        border: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
      }}>{emoji}</div>
      <div>
        <p style={{ color: C.textFaint, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{tag}</p>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 21, fontWeight: 700, color: C.text, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
    </div>
  )
}

function HookBox({ children, color = C.blue }) {
  return (
    <p style={{ color, fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 22, padding: "14px 16px", background: `${color}08`, borderRadius: 12, border: `1px solid ${color}15` }}>{children}</p>
  )
}

function CurrInput({ value, onChange, placeholder, color = C.blue }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textFaint, fontWeight: 700, fontSize: 16 }}>£</span>
      <input type="number" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: C.surface, border: `1px solid ${value ? color+"60" : C.border}`, borderRadius: 12, padding: "13px 16px 13px 32px", color: C.text, fontSize: 16, fontWeight: 600, outline: "none", transition: "border .2s" }} />
    </div>
  )
}

const mapColor = c => c === "#0FBFB8" ? C.blue : c === "#F87171" ? C.red : c === "#F59E0B" ? C.orange : c === "#A78BFA" ? C.purple : c === "#34D399" ? C.green : c === "#60A5FA" ? C.blue : c || C.blue

/* ═══════════════════════════════════════════════════════════════════════
   CARD TYPES
   ═══════════════════════════════════════════════════════════════════════ */

function TeachCard({ s, onNext }) {
  const blocks = s.blocks || []
  const [reveals, setReveals] = useState({})
  const toggleReveal = k => setReveals(p => ({ ...p, [k]: !p[k] }))
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} iconBg={s.iconBg} />
      <HookBox color={mapColor(s.hookColor)}>{s.hook}</HookBox>
      {blocks.map((block, i) => {
        const delay = `${i * 0.06}s`
        if (block.type === "para") return (
          <p key={i} className="slide-up" style={{ color: block.muted ? C.textLight : C.textMid, fontSize: block.small ? 13 : 15, lineHeight: 1.75, marginBottom: 14, fontWeight: block.bold ? 700 : 500, animationDelay: delay }}>{block.text}</p>
        )
        if (block.type === "heading") return (
          <h3 key={i} className="slide-up" style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 10, marginTop: i > 0 ? 14 : 0, animationDelay: delay }}>{block.text}</h3>
        )
        if (block.type === "callout") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay }}>
            <Tip icon={block.icon} title={block.title} color={mapColor(block.color)}>{block.text}</Tip>
          </div>
        )
        if (block.type === "equation") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay }}>
            <Equation parts={block.parts.map(p => ({ ...p, color: mapColor(p.color) }))} />
          </div>
        )
        if (block.type === "chips") return (
          <div key={i} className="slide-up" style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "14px 0", animationDelay: delay }}>
            {block.items.map((item, ii) => {
              const cc = mapColor(item.color)
              return <span key={ii} style={{ background: `${cc}12`, border: `1px solid ${cc}25`, borderRadius: 99, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: cc }}>{item.label}</span>
            })}
          </div>
        )
        if (block.type === "steps") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay, margin: "14px 0" }}>
            {block.items.map((st, si) => (
              <div key={si}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${mapColor(st.color)}15`, border: `1px solid ${mapColor(st.color)}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{st.emoji}</div>
                  <div>
                    <p style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{st.label}</p>
                    <p style={{ color: C.textLight, fontSize: 13, fontWeight: 500 }}>{st.sub}</p>
                  </div>
                </div>
                {si < block.items.length - 1 && <div style={{ width: 2, height: 14, background: C.border, marginLeft: 17 }} />}
              </div>
            ))}
          </div>
        )
        if (block.type === "stat") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay, display: "grid", gridTemplateColumns: block.items?.length > 2 ? "1fr 1fr 1fr" : "1fr 1fr", gap: 10, margin: "16px 0" }}>
            {(block.items || []).map((st, si) => {
              const sc = mapColor(st.color)
              return (
                <div key={si} style={{ background: `${sc}10`, border: `1px solid ${sc}20`, borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
                  {st.emoji && <p style={{ fontSize: 22, marginBottom: 6 }}>{st.emoji}</p>}
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: sc, fontSize: st.big ? 28 : 22, fontWeight: 700, lineHeight: 1 }}>{st.value}</p>
                  <p style={{ color: C.textFaint, fontSize: 11, fontWeight: 700, marginTop: 6, textTransform: "uppercase", letterSpacing: .5 }}>{st.label}</p>
                </div>
              )
            })}
          </div>
        )
        if (block.type === "compare") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
            {(block.items || []).map((item, ci) => {
              const cc = mapColor(item.color)
              return (
                <div key={ci} style={{ background: `${cc}08`, border: `1px solid ${cc}20`, borderRadius: 14, padding: "16px 14px" }}>
                  <p style={{ fontSize: 22, marginBottom: 8 }}>{item.emoji}</p>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: cc, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{item.title}</p>
                  <p style={{ color: C.textLight, fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        )
        if (block.type === "reveal") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay, margin: "10px 0" }}>
            {(block.items || []).map((rv, ri) => {
              const isOpen = reveals[`${i}-${ri}`]
              const rc = mapColor(rv.color)
              return (
                <button key={ri} onClick={() => toggleReveal(`${i}-${ri}`)} style={{ width: "100%", background: isOpen ? `${rc}10` : C.card, border: `1px solid ${isOpen ? rc+"30" : C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{rv.emoji}</span>
                      <p style={{ color: isOpen ? rc : "#fff", fontWeight: 700, fontSize: 14 }}>{rv.title}</p>
                    </div>
                    <span style={{ color: C.textFaint, fontSize: 16, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</span>
                  </div>
                  {isOpen && <p className="slide-up" style={{ color: C.textLight, fontSize: 13, fontWeight: 500, lineHeight: 1.6, marginTop: 10, paddingLeft: 28 }}>{rv.text}</p>}
                </button>
              )
            })}
          </div>
        )
        if (block.type === "grid") return (
          <div key={i} className="slide-up" style={{ animationDelay: delay, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "14px 0" }}>
            {(block.items || []).map((g, gi) => (
              <div key={gi} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 12px" }}>
                <span style={{ fontSize: 20, display: "block", marginBottom: 6 }}>{g.emoji}</span>
                <p style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{g.title}</p>
                <p style={{ color: C.textFaint, fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{g.desc}</p>
              </div>
            ))}
          </div>
        )
        return null
      })}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function QuizCard({ s, onNext }) {
  const [sel, setSel] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const answered = sel !== null

  const handleSelect = (i) => {
    if (answered) return
    setSel(i)
    setTimeout(() => setShowFeedback(true), 400)
  }

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji || "🧠"} tag={s.tag || "Quiz"} title={s.title} iconBg={C.purpleLight} />
      <div style={{ background: C.surface, borderRadius: 18, padding: "20px 18px", marginBottom: 20, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.5 }}>{s.question}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.options.map((opt, i) => {
          let state = null
          if (answered) { if (opt.correct) state = "correct"; else if (i === sel) state = "wrong" }
          const configs = {
            null: { bg: C.surface, border: C.border, text: "#fff", circle: C.border },
            correct: { bg: `${C.green}15`, border: C.green, text: C.greenDark, circle: C.green },
            wrong: { bg: `${C.red}15`, border: C.red, text: C.redDark, circle: C.red },
          }
          const c = configs[state] || configs[null]
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={answered && i === sel && !opt.correct ? "shake" : answered && opt.correct ? "pulse" : ""}
              style={{ width: "100%", background: c.bg, border: `2px solid ${c.border}`, borderRadius: 14, padding: "15px 18px", boxShadow: "none", color: c.text, fontSize: 16, fontWeight: 600, textAlign: "left", transition: "all .15s", display: "flex", alignItems: "center", gap: 12, cursor: answered ? "default" : "pointer" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, border: `3px solid ${c.circle}`, background: state === "correct" ? C.green : state === "wrong" ? C.red : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                {state === "correct" && <span style={{ color: C.text, fontWeight: 900, fontSize: 14 }}>✓</span>}
                {state === "wrong" && <span style={{ color: C.text, fontWeight: 900, fontSize: 14 }}>✗</span>}
              </div>
              <span style={{ flex: 1, lineHeight: 1.45 }}>{opt.text}</span>
            </button>
          )
        })}
      </div>
      {showFeedback && <FeedbackBanner correct={s.options[sel].correct} message={s.options[sel].feedback} onContinue={onNext} />}
      {!answered && <FixedBottom><Button3D color={C.surface} darkColor={C.navy} textColor={C.textFaint} full disabled>Select an answer</Button3D></FixedBottom>}
    </div>
  )
}

function TapSortCard({ s, onNext }) {
  const [answers, setAnswers] = useState({})
  const allAnswered = Object.keys(answers).length === s.items.length
  const allCorrect = s.items.every(item => answers[item.id] === item.correct)

  const getBucketColor = (bid) => {
    if (bid === "productive" || bid === "asset" || bid === "need" || bid === "high") return C.green
    if (bid === "lifestyle" || bid === "debt" || bid === "low") return C.orange
    if (bid === "want") return C.purple
    if (bid === "liquid") return C.blue
    return C.blue
  }

  const handleSort = (itemId, bucketId) => {
    if (answers[itemId] !== undefined) return
    setAnswers(prev => ({ ...prev, [itemId]: bucketId }))
  }

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji || "🏷️"} tag={s.tag} title={s.title} iconBg={C.orangeLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 18 }}>{s.intro}</p>

      {/* Items with inline sort buttons :  no separate bucket headers */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.items.map(item => {
          const isAnswered = answers[item.id] !== undefined
          const isCorrect = answers[item.id] === item.correct

          if (isAnswered) {
            const bc = isCorrect ? C.green : C.red
            return (
              <div key={item.id} className={isCorrect ? "pulse" : "shake"}
                style={{ background: `${isCorrect ? C.green : C.red}15`, border: `1px solid ${bc}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <span style={{ flex: 1, fontWeight: 700, color: isCorrect ? C.greenDark : C.redDark, fontSize: 15 }}>{item.label}</span>
                <span style={{ fontSize: 18 }}>{isCorrect ? "✅" : "❌"}</span>
              </div>
            )
          }

          return (
            <div key={item.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 18px", boxShadow: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{item.label}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {s.buckets.map(b => {
                  const bc = getBucketColor(b.id)
                  return (
                    <button key={b.id} onClick={() => handleSort(item.id, b.id)}
                      style={{ flex: 1, background: `${bc}08`, border: `2px solid ${bc}35`, borderRadius: 10, padding: "9px 12px", cursor: "pointer", color: bc, fontWeight: 700, fontSize: 14, transition: "all .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = `${bc}20`}
                      onMouseLeave={e => e.currentTarget.style.background = `${bc}08`}>
                      {b.label.split("(")[0].trim().split(" ")[0]}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {allAnswered && (
        <div className="bounce-in" style={{ marginTop: 20, textAlign: "center", padding: "22px", background: allCorrect ? `${C.green}15` : `${C.orange}15`, borderRadius: 16, border: `1px solid ${allCorrect ? C.green : C.orange}` }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>{allCorrect ? "🎉" : "💪"}</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: allCorrect ? C.greenDark : C.orange }}>{allCorrect ? "Perfect!" : "Good effort!"}</p>
          <p style={{ color: C.textMid, fontSize: 15, fontWeight: 500, marginTop: 6 }}>{s.successMessage}</p>
        </div>
      )}

      <FixedBottom>
        {allAnswered ? <Button3D onClick={onNext} full>Continue</Button3D> : <Button3D color={C.surface} darkColor={C.navy} textColor={C.textFaint} full disabled>Sort all items to continue</Button3D>}
      </FixedBottom>
    </div>
  )
}

function ChecklistCard({ s, onNext }) {
  const [done, setDone] = useState(new Set())
  const toggle = i => setDone(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} iconBg={C.blueLight} />
      {s.intro && <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 16 }}>{s.intro}</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 10, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", background: done.size === s.items.length ? C.green : C.blue, borderRadius: 99, width: `${(done.size / s.items.length) * 100}%`, transition: "width .4s ease" }} />
        </div>
        <span style={{ color: done.size === s.items.length ? C.green : C.blue, fontSize: 14, fontWeight: 800 }}>{done.size}/{s.items.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.items.map((item, i) => {
          const isDone = done.has(i)
          return (
            <button key={i} onClick={() => toggle(i)} style={{ width: "100%", background: isDone ? `${C.green}12` : C.card, border: `1px solid ${isDone ? C.green+"30" : C.border}`, borderRadius: 14, padding: "14px 16px", boxShadow: "none", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, border: `3px solid ${isDone ? C.green : C.border}`, background: isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isDone && <span style={{ color: C.text, fontSize: 14, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.emoji}</span>
                  <p style={{ color: isDone ? C.green : "#fff", fontWeight: 700, fontSize: 15 }}>{item.label}</p>
                </div>
                <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, lineHeight: 1.45, marginTop: 4 }}>{item.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function SubAuditCard({ s, onNext }) {
  const [checked, setChecked] = useState(new Set())
  const toggle = k => setChecked(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n })
  const monthlyTotal = checked.size * 15

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} iconBg={C.orangeLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 16 }}>{s.intro}</p>
      {checked.size > 0 && (
        <div className="pop" style={{ background: `linear-gradient(135deg, ${C.orange}, #FFB347)`, borderRadius: 18, padding: "18px 20px", marginBottom: 20, color: C.text, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, opacity: .95 }}>Estimated monthly cost</p>
            <p style={{ fontSize: 13, fontWeight: 600, opacity: .7 }}>~£15 per subscription</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700 }}>£{monthlyTotal}</p>
            <p style={{ fontSize: 13, fontWeight: 600, opacity: .8 }}>£{monthlyTotal * 12}/year</p>
          </div>
        </div>
      )}
      {s.categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{cat.emoji}</span> {cat.label}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cat.items.map(item => {
              const isC = checked.has(item)
              return (
                <button key={item} onClick={() => toggle(item)}
                  style={{ background: isC ? C.orange : C.surface, border: `2px solid ${isC ? C.orange : C.border}`, borderRadius: 99, padding: "8px 16px", color: isC ? "#fff" : C.textMid, fontSize: 14, fontWeight: 700, transition: "all .15s", boxShadow: "none" }}>
                  {isC && "✓ "}{item}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function BudgetCalcCard({ s, onNext }) {
  const [step, setStep] = useState(0)
  const income = s.income || 2200
  const needsItems = s.needsItems || []
  const needs = needsItems.reduce((t, x) => t + x.amount, 0)
  const leftover = income - needs
  const savings = Math.round(leftover / 3)
  const spending = leftover - savings

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji || "🥧"} tag={s.tag} title={s.title} iconBg={C.purpleLight} />
      <p style={{ color: C.textMid, fontSize: 16, fontWeight: 500, lineHeight: 1.65, marginBottom: 20 }}>{s.intro}</p>

      <div style={{ background: C.greenLight, borderRadius: 18, padding: "18px 20px", marginBottom: 8, border: `2px solid ${C.green}25` }}>
        <p style={{ color: C.textLight, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 4 }}>Sam's monthly take-home pay</p>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.green, fontSize: 44, fontWeight: 700, lineHeight: 1 }}>£{income.toLocaleString()}</p>
      </div>

      {step >= 1 && (
        <div className="slide-up" style={{ background: C.blueLight, borderRadius: 18, padding: "18px 20px", marginBottom: 8, border: `2px solid ${C.blue}25` }}>
          <p style={{ color: C.textLight, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 12 }}>Step 1: Needs come out first</p>
          {needsItems.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <p style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>{item.emoji} {item.label}</p>
              <p style={{ color: C.blue, fontWeight: 800, fontSize: 15 }}>£{item.amount}</p>
            </div>
          ))}
          <div style={{ borderTop: `2px solid ${C.blue}25`, paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
            <p style={{ color: C.text, fontWeight: 800, fontSize: 16 }}>Total needs</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.blue, fontWeight: 700, fontSize: 26 }}>£{needs}</p>
          </div>
        </div>
      )}

      {step >= 2 && (
        <div className="slide-up" style={{ background: C.navy, borderRadius: 18, padding: "18px 20px", marginBottom: 8 }}>
          <Equation parts={[
            { value: `£${income}`, label: "take-home", color: C.green },
            { op: "−" },
            { value: `£${needs}`, label: "needs", color: C.blue },
            { op: "=" },
            { value: `£${leftover}`, label: "left over", color: C.gold },
          ]} />
        </div>
      )}

      {step >= 3 && (
        <div className="slide-up" style={{ background: C.purpleLight, borderRadius: 18, padding: "18px 20px", marginBottom: 8, border: `2px solid ${C.purple}25` }}>
          <p style={{ color: C.textLight, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Step 2: One third goes straight to savings</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.purple, fontSize: 34, fontWeight: 700 }}>£{savings} saved 🏦</p>
          <p style={{ color: C.purple, fontSize: 14, fontWeight: 600, marginTop: 4 }}>This builds productive assets and grows net worth every month.</p>
        </div>
      )}

      {step >= 4 && (
        <div className="bounce-in" style={{ background: C.goldLight, borderRadius: 18, padding: "18px 20px", border: `2px solid ${C.gold}25` }}>
          <p style={{ color: C.textLight, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>Step 3: The rest is guilt free</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.orange, fontSize: 34, fontWeight: 700 }}>£{spending} to enjoy ✨</p>
        </div>
      )}

      <FixedBottom>
        {step < 4 ? (
          <Button3D onClick={() => setStep(s => s + 1)} full color={[C.blue, C.navy, C.purple, C.orange][step]} darkColor={[C.blueDark, "#0D1020", "#9333EA", "#CC7700"][step]}>
            {["Show Sam's needs ›", "See what's left ›", "Show savings ›", "Show guilt-free spending ›"][step]}
          </Button3D>
        ) : (
          <Button3D onClick={onNext} full>Got it, continue ›</Button3D>
        )}
      </FixedBottom>
    </div>
  )
}

function PayslipCard({ s, onNext }) {
  const [sel, setSel] = useState(null)
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji="📋" tag="Reading your payslip" title={s.title} iconBg={C.blueLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 16 }}>{s.intro}</p>
      <div style={{ background: C.bg, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(0,0,0,.3)" }}>
        <div style={{ background: C.navy, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: C.text, fontWeight: 800, fontSize: 15 }}>📄 Monthly Payslip</p>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, fontWeight: 600 }}>Tap any line ›</p>
        </div>
        {s.lines.map((line, i) => {
          const isSel = sel === i
          const lc = mapColor(line.color)
          return (
            <button key={i} onClick={() => setSel(sel === i ? null : i)}
              style={{ width: "100%", background: isSel ? `${lc}08` : "transparent", border: "none", borderBottom: i < s.lines.length - 1 ? `1px solid ${C.border}` : "none", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background .2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: isSel ? lc : C.border, transition: "all .2s" }} />
                <p style={{ color: isSel ? lc : C.text, fontSize: 16, fontWeight: isSel ? 800 : 600, transition: "all .2s" }}>{line.label}</p>
              </div>
              <p style={{ color: lc, fontWeight: 800, fontSize: 17, fontFamily: "'Space Grotesk',sans-serif" }}>{line.sign === "minus" && "−"}{line.amount}</p>
            </button>
          )
        })}
      </div>
      {sel !== null ? (
        <div className="pop" style={{ marginTop: 16 }}>
          <Tip icon="📖" title={s.lines[sel].label} color={mapColor(s.lines[sel].color)}>{s.lines[sel].explain}</Tip>
        </div>
      ) : (
        <p style={{ color: C.textFaint, fontSize: 14, fontWeight: 600, textAlign: "center", marginTop: 14 }}>👆 Tap any line to understand what it means</p>
      )}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function TaxBandsCard({ s, onNext }) {
  const [sel, setSel] = useState(null)
  const [salary, setSalary] = useState("")
  const sal = parseFloat(salary) || 0
  const PA = 12570, BRT = 50270, HRT = 125140
  const incomeTax = sal <= PA ? 0 : sal <= BRT ? (sal - PA) * 0.20 : sal <= HRT ? (BRT - PA) * 0.20 + (sal - BRT) * 0.40 : (BRT - PA) * 0.20 + (HRT - BRT) * 0.40 + (sal - HRT) * 0.45
  const ni = sal <= PA ? 0 : sal <= BRT ? (sal - PA) * 0.08 : (BRT - PA) * 0.08 + (sal - BRT) * 0.02
  const bandColors = [C.green, C.blue, C.orange, C.red]

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji="🧮" tag="How income tax works" title={s.title} iconBg={C.greenLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 14 }}>{s.intro}</p>
      <Tip icon="✅" title="The big myth busted" color={C.green}>Getting a pay rise never means you take home less money. You only pay the higher rate on the extra pounds above the threshold, never on all your earnings at once.</Tip>

      <div style={{ display: "flex", gap: 3, borderRadius: 14, overflow: "hidden", height: 28, margin: "20px 0 14px" }}>
        {s.bands.map((b, i) => (
          <div key={i} onClick={() => setSel(sel === i ? null : i)} style={{ flex: b.flex, background: bandColors[i], opacity: sel === null || sel === i ? 1 : .25, transition: "opacity .3s", cursor: "pointer" }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {s.bands.map((b, i) => (
          <button key={i} onClick={() => setSel(sel === i ? null : i)}
            style={{ width: "100%", background: sel === i ? `${bandColors[i]}10` : C.bg, border: `2px solid ${sel === i ? bandColors[i] : C.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", boxShadow: sel === i ? "none" : `0 2px 0 ${C.borderDark}`, display: "flex", alignItems: "center", gap: 12, transition: "all .2s", textAlign: "left" }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: bandColors[i], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: sel === i ? bandColors[i] : "#fff", fontSize: 15, fontWeight: 700 }}>{b.label}</p>
              <p style={{ color: C.textLight, fontSize: 13, fontWeight: 600 }}>{b.range}</p>
            </div>
            <span style={{ background: `${bandColors[i]}15`, color: bandColors[i], fontSize: 15, fontWeight: 900, padding: "4px 14px", borderRadius: 99 }}>{b.rate}</span>
          </button>
        ))}
      </div>

      {sel !== null && <div className="pop" style={{ marginBottom: 14 }}><Tip color={bandColors[sel]} icon="📖" title={s.bands[sel].label}>{s.bands[sel].explain}</Tip></div>}

      <div style={{ background: C.surface, borderRadius: 20, padding: "20px" }}>
        <p style={{ color: C.textLight, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 12 }}>💸 How much tax and NI would you pay?</p>
        <CurrInput value={salary} onChange={setSalary} placeholder="Enter annual salary" color={C.green} />
        {sal > 0 && (
          <div className="slide-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {[
              { label: "Income tax/year", value: `£${Math.round(incomeTax).toLocaleString()}`, sub: `£${Math.round(incomeTax/12).toLocaleString()}/month`, color: C.red },
              { label: "National Insurance/year", value: `£${Math.round(ni).toLocaleString()}`, sub: `£${Math.round(ni/12).toLocaleString()}/month`, color: C.orange },
            ].map((r, i) => (
              <div key={i} style={{ background: `${r.color}08`, borderRadius: 14, padding: "14px 16px", border: `2px solid ${r.color}20` }}>
                <p style={{ color: C.textLight, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{r.label}</p>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: r.color, fontSize: 24, fontWeight: 700 }}>{r.value}</p>
                <p style={{ color: C.textFaint, fontSize: 13, fontWeight: 600, marginTop: 3 }}>{r.sub}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function TaxCodeCard({ s, onNext }) {
  const [sel, setSel] = useState(null)
  const cc = [C.green, C.orange, C.red]
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji="🔢" tag={s.tag} title={s.title} iconBg={C.blueLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 16 }}>{s.intro}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.codes.map((code, i) => (
          <button key={i} onClick={() => setSel(sel === i ? null : i)}
            style={{ width: "100%", background: sel === i ? `${cc[i]}08` : C.bg, border: `2px solid ${sel === i ? cc[i] : C.border}`, borderRadius: 16, padding: "16px 18px", cursor: "pointer", boxShadow: "none", display: "flex", alignItems: "center", gap: 14, textAlign: "left", transition: "all .2s" }}>
            <div style={{ background: cc[i], borderRadius: 12, padding: "8px 14px", flexShrink: 0 }}>
              <p style={{ color: C.text, fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700 }}>{code.code}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: sel === i ? cc[i] : "#fff", fontWeight: 700, fontSize: 16 }}>{code.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cc[i] }} />
                <p style={{ color: cc[i], fontSize: 13, fontWeight: 700 }}>{code.status}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {sel !== null && (
        <div className="pop" style={{ marginTop: 14 }}>
          <Tip color={cc[sel]} icon="📖" title={s.codes[sel].code}>{s.codes[sel].explain}</Tip>
          {s.codes[sel].action && <p style={{ color: cc[sel], fontSize: 15, fontWeight: 700, marginTop: 8, paddingLeft: 4 }}>👉 {s.codes[sel].action}</p>}
        </div>
      )}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function TaxPotCard({ s, onNext }) {
  const ex = s.example || 1000
  const pot = Math.round(ex * 0.30), keep = Math.round(ex * 0.70)
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji="💰" tag={s.tag} title={s.title} iconBg={C.goldLight} />
      {s.blocks?.map((b, i) => <p key={i} style={{ color: C.textMid, fontSize: 16, lineHeight: 1.7, marginBottom: 12, fontWeight: 500 }}>{b.text}</p>)}
      <div style={{ background: C.card, borderRadius: 20, padding: "22px 20px", border: `1px solid ${C.border}`, marginTop: 12 }}>
        <p style={{ color: C.textLight, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 16 }}>A payment of £{ex.toLocaleString()} arrives:</p>
        <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", height: 56, marginBottom: 16 }}>
          <div style={{ flex: keep, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: C.text, fontWeight: 900, fontSize: 16 }}>£{keep} yours</p>
          </div>
          <div style={{ flex: pot, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: C.text, fontWeight: 900, fontSize: 16 }}>£{pot} tax</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: C.greenLight, borderRadius: 16, padding: "18px", border: `2px solid ${C.green}25`, textAlign: "center" }}>
            <p style={{ color: C.textLight, fontSize: 13, fontWeight: 700 }}>✨ Keep and spend</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.green, fontSize: 34, fontWeight: 700, marginTop: 6 }}>£{keep}</p>
          </div>
          <div style={{ background: C.redLight, borderRadius: 16, padding: "18px", border: `2px solid ${C.red}25`, textAlign: "center" }}>
            <p style={{ color: C.textLight, fontSize: 13, fontWeight: 700 }}>🔒 Tax pot</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.red, fontSize: 34, fontWeight: 700, marginTop: 6 }}>£{pot}</p>
          </div>
        </div>
      </div>
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function NWCalcCard({ s, onNext }) {
  const [assets, setAssets] = useState([{ id: 0, label: "", val: "" }])
  const [debts, setDebts] = useState([{ id: 0, label: "", val: "" }])
  const totalA = assets.reduce((s, a) => s + (parseFloat(a.val) || 0), 0)
  const totalD = debts.reduce((s, d) => s + (parseFloat(d.val) || 0), 0)
  const nw = totalA - totalD, hasData = totalA > 0 || totalD > 0
  const addRow = (list, setList) => setList(p => [...p, { id: Date.now(), label: "", val: "" }])
  const update = (list, setList, id, key, val) => setList(p => p.map(x => x.id === id ? { ...x, [key]: val } : x))

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji="🧮" tag="Try it now" title={s.title} iconBg={C.greenLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 20 }}>{s.intro}</p>
      {[
        { label: "What you OWN", emoji: "💚", color: C.green, list: assets, setList: setAssets, ph: ["Bank savings", "Pension", "Car"] },
        { label: "What you OWE", emoji: "❤️", color: C.red, list: debts, setList: setDebts, ph: ["Credit card", "Student loan", "Overdraft"] },
      ].map((g, gi) => (
        <div key={gi} style={{ marginBottom: 20 }}>
          <p style={{ color: g.color, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>{g.emoji} {g.label}</p>
          {g.list.map((row, ri) => (
            <div key={row.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input placeholder={g.ph[ri % 3]} value={row.label} onChange={e => update(g.list, g.setList, row.id, "label", e.target.value)}
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 15, fontWeight: 600, outline: "none" }} />
              <div style={{ position: "relative", width: 120 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textFaint, fontWeight: 700 }}>£</span>
                <input type="number" placeholder="0" value={row.val} onChange={e => update(g.list, g.setList, row.id, "val", e.target.value)}
                  style={{ width: "100%", background: C.surface, border: `2px solid ${row.val ? g.color : C.border}`, borderRadius: 12, padding: "12px 14px 12px 28px", color: C.text, fontSize: 15, fontWeight: 700, outline: "none" }} />
              </div>
            </div>
          ))}
          <button onClick={() => addRow(g.list, g.setList)} style={{ background: "none", border: `2px dashed ${C.border}`, borderRadius: 12, padding: "10px", width: "100%", color: C.textLight, fontWeight: 700, fontSize: 14 }}>+ Add row</button>
        </div>
      ))}
      {hasData && (
        <div className="bounce-in" style={{ background: nw >= 0 ? `linear-gradient(135deg, ${C.green}, #2DD4BF)` : `linear-gradient(135deg, ${C.red}, #FF6B6B)`, borderRadius: 20, padding: "26px 20px", textAlign: "center", color: C.text }}>
          <p style={{ fontSize: 14, fontWeight: 700, opacity: .8, textTransform: "uppercase", letterSpacing: 1 }}>Your net worth</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 48, fontWeight: 700, lineHeight: 1, marginTop: 8 }}>{nw < 0 ? "−" : ""}£{Math.abs(Math.round(nw)).toLocaleString()}</p>
          <p style={{ fontSize: 15, fontWeight: 600, marginTop: 10, opacity: .85 }}>{nw >= 0 ? "Great start. Keep tracking to watch it grow." : "Negative is okay. Now you know, you can start to fix it."}</p>
        </div>
      )}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function ExpenseTilesCard({ s, onNext }) {
  const [sel, setSel] = useState(null)
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} iconBg={C.blueLight} />
      <p style={{ color: C.textMid, fontSize: 16, fontWeight: 500, lineHeight: 1.65, marginBottom: 14 }}>{s.intro}</p>
      <p style={{ color: C.textLight, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Tap any tile to see the details:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {s.items.map((item, i) => (
          <button key={i} onClick={() => setSel(sel === i ? null : i)}
            style={{ background: sel === i ? `${C.blue}10` : C.card, border: `2px solid ${sel === i ? C.blue : C.border}`, borderRadius: 16, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all .2s", boxShadow: "none" }}>
            <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{item.emoji}</span>
            <p style={{ color: sel === i ? C.blue : "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{item.label}</p>
          </button>
        ))}
      </div>
      {sel !== null && <div className="pop"><Tip color={C.blue} icon="📖" title={s.items[sel].label}>{s.items[sel].desc}</Tip></div>}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

function ThreeSortCard({ s, onNext }) {
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const allAnswered = Object.keys(answers).length === s.items.length
  const allCorrect = s.items.every(item => answers[item.id] === item.correct)
  const bucketColors = { liquid: C.blue, productive: C.green, lifestyle: C.orange }

  const handleSort = (itemId, bucketId) => {
    if (answers[itemId] !== undefined) return
    setAnswers(prev => {
      const updated = { ...prev, [itemId]: bucketId }
      if (Object.keys(updated).length === s.items.length) setTimeout(() => setShowFeedback(true), 600)
      return updated
    })
  }

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji || "🏷️"} tag={s.tag} title={s.title} iconBg={C.blueLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 18 }}>{s.intro}</p>
      {/* Category definitions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
        {s.buckets.map(b => {
          const bc = bucketColors[b.id] || C.blue
          return (
            <div key={b.id} style={{ background: `${bc}08`, border: `1px solid ${bc}25`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{b.emoji}</span>
              <div>
                <p style={{ color: bc, fontWeight: 800, fontSize: 15, marginBottom: 3 }}>{b.label}</p>
                <p style={{ color: C.textMid, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.items.map(item => {
          const isAnswered = answers[item.id] !== undefined
          const isCorrect = answers[item.id] === item.correct
          if (isAnswered) {
            return (
              <div key={item.id} className={isCorrect ? "pulse" : "shake"} style={{ background: `${isCorrect ? C.green : C.red}15`, border: `1px solid ${isCorrect ? C.green : C.red}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: isCorrect ? C.greenDark : C.redDark, fontSize: 15 }}>{item.label}</p>
                  {!isCorrect && <p style={{ color: C.redDark, fontSize: 13, fontWeight: 500, marginTop: 2 }}>This is: {s.buckets.find(b => b.id === item.correct)?.label}</p>}
                </div>
                <span style={{ fontSize: 18 }}>{isCorrect ? "✅" : "❌"}</span>
              </div>
            )
          }
          return (
            <div key={item.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 18px", boxShadow: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{item.label}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {s.buckets.map(b => {
                  const bc = bucketColors[b.id] || C.blue
                  return (
                    <button key={b.id} onClick={() => handleSort(item.id, b.id)}
                      style={{ flex: 1, background: `${bc}08`, border: `2px solid ${bc}35`, borderRadius: 10, padding: "8px 4px", cursor: "pointer", color: bc, fontWeight: 800, fontSize: 12 }}>
                      {b.emoji} {b.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {showFeedback && <FeedbackBanner correct={allCorrect} message={allCorrect ? s.successMessage : "A couple went wrong. Check the definitions above."} onContinue={onNext} />}
      {!allAnswered && <FixedBottom><Button3D color={C.surface} darkColor={C.navy} textColor={C.textFaint} full disabled>Sort all items to continue</Button3D></FixedBottom>}
    </div>
  )
}

function PatternCard({ s, onNext }) {
  const [revealed, setRevealed] = useState(1)
  const steps = s.steps || []
  const allRevealed = revealed >= steps.length

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji} tag={s.tag} title={s.title} iconBg={s.mode === "smart" ? C.greenLight : C.redLight} />
      <p style={{ fontSize: 16, fontWeight: 500, color: C.textMid, lineHeight: 1.65, marginBottom: 22 }}>{s.intro}</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {steps.slice(0, revealed).map((step, i) => (
          <div key={i}>
            <div className={i === revealed - 1 ? "slide-up" : ""} style={{ background: `${mapColor(step.color)}10`, border: `2px solid ${mapColor(step.color)}30`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: `${mapColor(step.color)}18`, border: `2px solid ${mapColor(step.color)}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{step.emoji}</div>
              <div>
                <p style={{ color: mapColor(step.color), fontWeight: 800, fontSize: 16, marginBottom: 2 }}>{step.label}</p>
                <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, lineHeight: 1.45 }}>{step.sub}</p>
              </div>
            </div>
            {i < revealed - 1 && <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}><span style={{ color: C.textFaint, fontSize: 22, fontWeight: 700 }}>↓</span></div>}
          </div>
        ))}
      </div>
      {allRevealed && s.conclusion && (
        <div className="bounce-in" style={{ marginTop: 20 }}>
          <Tip color={s.mode === "smart" ? C.green : C.red} icon={s.mode === "smart" ? "🎯" : "⚠️"} title={s.conclusionTitle || "The result"}>{s.conclusion}</Tip>
        </div>
      )}
      <FixedBottom>
        {!allRevealed ? (
          <Button3D onClick={() => setRevealed(r => r + 1)} full color={s.mode === "smart" ? C.green : C.red} darkColor={s.mode === "smart" ? C.greenDark : C.redDark}>Next step ›</Button3D>
        ) : (
          <Button3D onClick={onNext} full>Got it, continue ›</Button3D>
        )}
      </FixedBottom>
    </div>
  )
}

/* ─── COMPOUND GROWTH CHART CARD (fixed Y axis + simulate button) ──── */
function CompoundCalcCard({ s, onNext }) {
  const [monthly, setMonthly] = useState("200")
  const [rate, setRate] = useState("7")
  const [years, setYears] = useState("30")
  const [simKey, setSimKey] = useState(0)

  const m = parseFloat(monthly) || 0
  const r = (parseFloat(rate) || 0) / 100 / 12
  const n = Math.min(Math.max(parseInt(years) || 0, 1), 50)

  const points = []
  for (let y = 0; y <= n; y++) {
    const months = y * 12
    const value = r > 0 ? m * ((Math.pow(1 + r, months) - 1) / r) : m * months
    points.push({ y, contrib: m * months, value: Math.round(value) })
  }
  const finalValue = points[points.length - 1]?.value || 0
  const totalIn = m * n * 12
  const growth = Math.max(0, finalValue - totalIn)

  const maxVal = finalValue || 1
  const W = 340, H = 190, PADL = 52, PADR = 12, PADT = 12, PADB = 28
  const chartW = W - PADL - PADR, chartH = H - PADT - PADB

  const toX = y => PADL + (y / n) * chartW
  const toY = v => PADT + chartH - (v / maxVal) * chartH

  const valuePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.y).toFixed(1)},${toY(p.value).toFixed(1)}`).join(" ")
  const contribPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.y).toFixed(1)},${toY(p.contrib).toFixed(1)}`).join(" ")
  const fillPath = `${valuePath} L${toX(n).toFixed(1)},${(PADT + chartH).toFixed(1)} L${PADL},${(PADT + chartH).toFixed(1)} Z`
  const contribFill = `${contribPath} L${toX(n).toFixed(1)},${(PADT + chartH).toFixed(1)} L${PADL},${(PADT + chartH).toFixed(1)} Z`

  const fmt = v => v >= 1000000 ? `£${(v/1000000).toFixed(1)}m` : v >= 1000 ? `£${Math.round(v/1000)}k` : `£${v}`

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <CardHeader emoji={s.emoji || "📊"} tag={s.tag} title={s.title} iconBg={C.greenLight} />
      <HookBox color={C.green}>{s.hook}</HookBox>
      {s.intro && <p style={{ color: C.textMid, fontSize: 15, fontWeight: 500, lineHeight: 1.6, marginBottom: 18 }}>{s.intro}</p>}

      <div style={{ background: C.card, borderRadius: 20, padding: "20px", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ color: C.textFaint, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Monthly contribution</label>
            <CurrInput value={monthly} onChange={setMonthly} placeholder="200" color={C.green} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ color: C.textFaint, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Annual return (%)</label>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="7"
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.blue}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 16, fontWeight: 700, outline: "none" }} />
            </div>
            <div>
              <label style={{ color: C.textFaint, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Years</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="30"
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.purple}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 16, fontWeight: 700, outline: "none" }} />
            </div>
          </div>
          <Button3D onClick={() => setSimKey(k => k + 1)} full color={C.teal} darkColor="#0E7490">
            🚀 Simulate Growth
          </Button3D>
        </div>

        {m > 0 && n > 0 && (
          <div key={simKey} className="slide-up">
            <div style={{ marginBottom: 14, background: C.surface, borderRadius: 14, padding: "14px 10px 6px", border: `1px solid ${C.border}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
                {[0, 0.25, 0.5, 0.75, 1].map(frac => (
                  <g key={frac}>
                    <line x1={PADL} x2={PADL + chartW} y1={toY(maxVal * frac)} y2={toY(maxVal * frac)}
                      stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
                    <text x={PADL - 6} y={toY(maxVal * frac) + 4} textAnchor="end"
                      fontSize="10" fontWeight="700" fontFamily="'Space Grotesk',sans-serif" fill={C.textLight}>
                      {fmt(Math.round(maxVal * frac))}
                    </text>
                  </g>
                ))}
                {[0, Math.round(n / 2), n].map(yr => (
                  <text key={yr} x={toX(yr)} y={H - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={C.textFaint}>yr {yr}</text>
                ))}
                <defs>
                  <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity=".3" /><stop offset="100%" stopColor={C.green} stopOpacity=".02" /></linearGradient>
                  <linearGradient id="cfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.blue} stopOpacity=".25" /><stop offset="100%" stopColor={C.blue} stopOpacity=".02" /></linearGradient>
                </defs>
                <path d={fillPath} fill="url(#gfill)" />
                <path d={contribFill} fill="url(#cfill)" />
                <path d={contribPath} fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round" />
                <path d={valuePath} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 14, justifyContent: "center" }}>
              {[
                { color: C.green, label: "Total value" },
                { color: C.blue, label: "Your contributions" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 18, height: 3, background: l.color, borderRadius: 99 }} />
                  <span style={{ color: C.textLight, fontSize: 12, fontWeight: 600 }}>{l.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "You put in", value: fmt(Math.round(totalIn)), color: C.blue },
                { label: "Growth", value: fmt(growth), color: C.green },
                { label: `After ${n} yrs`, value: fmt(finalValue), color: C.teal },
              ].map((r, i) => (
                <div key={i} style={{ background: `${r.color}10`, borderRadius: 12, padding: "12px 8px", textAlign: "center", border: `1px solid ${r.color}20` }}>
                  <p style={{ color: C.textFaint, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>{r.label}</p>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: r.color, fontSize: 18, fontWeight: 700 }}>{r.value}</p>
                </div>
              ))}
            </div>
            <p style={{ color: C.textFaint, fontSize: 11, fontWeight: 500, marginTop: 10, textAlign: "center" }}>
              Illustrative only. Returns are not guaranteed.
            </p>
          </div>
        )}
      </div>

      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

/* ─── MYTH VS FACT CARD ─────────────────────────────────────────────── */
function MythFactCard({ s, onNext }) {
  const [idx, setIdx] = useState(0)
  const [ans, setAns] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const items = s.items || []
  const item = items[idx]
  const done = idx >= items.length

  const handleAns = (choice) => {
    if (ans !== null) return
    const correct = choice === item.answer
    setAns(choice)
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1) } else { setStreak(0) }
  }
  const handleNext = () => {
    if (idx < items.length - 1) { setIdx(i => i + 1); setAns(null) }
    else { setIdx(items.length) }
  }

  if (done) return (
    <div style={{ padding: "24px 20px 120px" }}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>{score === items.length ? "🎉" : "💪"}</p>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, color: score === items.length ? C.green : C.orange }}>{score}/{items.length}</p>
        <p style={{ color: C.textLight, fontSize: 15, fontWeight: 600, marginTop: 8 }}>{score === items.length ? "Perfect! You nailed every one." : `Good effort. Review the ones you missed.`}</p>
        {s.summary && <p style={{ color: C.textMid, fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginTop: 16, padding: "0 10px" }}>{s.summary}</p>}
      </div>
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>{s.title || "Myth or Fact?"}</p>
          <p style={{ color: C.textFaint, fontSize: 12, fontWeight: 700, marginTop: 4 }}>Statement {idx + 1} of {items.length}</p>
        </div>
        {streak >= 2 && <div className="pop" style={{ background: `${C.orange}20`, border: `1px solid ${C.orange}30`, borderRadius: 99, padding: "4px 12px" }}><span style={{ color: C.orange, fontSize: 13, fontWeight: 800 }}>🔥 {streak} streak</span></div>}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 20px", marginBottom: 16 }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.45 }}>{item.statement}</p>
      </div>

      {ans === null ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button onClick={() => handleAns("myth")} style={{ padding: "16px", borderRadius: 14, border: `1px solid ${C.red}30`, background: `${C.red}12`, color: C.red, fontSize: 16, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", cursor: "pointer" }}>MYTH</button>
          <button onClick={() => handleAns("fact")} style={{ padding: "16px", borderRadius: 14, border: `1px solid ${C.green}30`, background: `${C.green}12`, color: C.green, fontSize: 16, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", cursor: "pointer" }}>FACT</button>
        </div>
      ) : (
        <div className="slide-up">
          <div style={{ background: ans === item.answer ? `${C.green}12` : `${C.red}12`, border: `1px solid ${ans === item.answer ? C.green : C.red}30`, borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{ans === item.answer ? "✅" : "❌"}</span>
              <p style={{ color: ans === item.answer ? C.green : C.red, fontWeight: 800, fontSize: 15 }}>{ans === item.answer ? "Correct!" : `That's a ${item.answer}.`}</p>
            </div>
            <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>{item.explain}</p>
          </div>
          <Button3D onClick={handleNext} full>{idx < items.length - 1 ? "Next statement ›" : "See results ›"}</Button3D>
        </div>
      )}
    </div>
  )
}

/* ─── KEY INSIGHT CARD (big stat + explanation) ─────────────────────── */
function LInsightCard({ s, onNext }) {
  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <p style={{ color: C.textFaint, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>KEY INSIGHT</p>
      <div style={{ background: `linear-gradient(135deg, ${mapColor(s.color || C.green)}10, ${mapColor(s.color2 || C.blue)}08)`, border: `1px solid ${mapColor(s.color || C.green)}20`, borderRadius: 18, padding: "32px 20px", textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 44, fontWeight: 700, color: mapColor(s.color || C.green), lineHeight: 1 }}>{s.bigStat}</p>
        <p style={{ color: C.textLight, fontSize: 14, fontWeight: 600, marginTop: 10 }}>{s.statLabel}</p>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 10 }}>{s.title}</h3>
      <p style={{ color: C.textMid, fontSize: 15, fontWeight: 500, lineHeight: 1.7, marginBottom: 16 }}>{s.body}</p>
      {s.punchline && (
        <div style={{ background: `${mapColor(s.color || C.green)}08`, borderLeft: `3px solid ${mapColor(s.color || C.green)}`, borderRadius: "0 12px 12px 0", padding: "14px 16px" }}>
          <p style={{ color: mapColor(s.color || C.green), fontSize: 14, fontWeight: 700, fontStyle: "italic", lineHeight: 1.55 }}>{s.punchline}</p>
        </div>
      )}
      <FixedBottom><Button3D onClick={onNext} full>Continue</Button3D></FixedBottom>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CARD ROUTER
   ═══════════════════════════════════════════════════════════════════════ */
function CardRouter({ section, onNext }) {
  const map = { rich: TeachCard, quiz: QuizCard, sort: TapSortCard, checklist: ChecklistCard, "sub-audit": SubAuditCard, "budget-calc": BudgetCalcCard, "budget-steps": BudgetCalcCard, payslip: PayslipCard, "tax-bands": TaxBandsCard, "tax-code": TaxCodeCard, "tax-pot": TaxPotCard, "nw-calc": NWCalcCard, "three-sort": ThreeSortCard, pattern: PatternCard, "expense-tiles": ExpenseTilesCard, video: VideoCard, "saving-goal": SavingGoalCard, "debt-visual": DebtVisualCard, "compound-calc": CompoundCalcCard, "myth-fact": MythFactCard, "insight": LInsightCard }
  const Comp = map[section.type] || TeachCard
  return <Comp s={section} onNext={onNext} />
}

/* ═══════════════════════════════════════════════════════════════════════
   ACTION TAB + PATH SELECTOR + LESSON PLAYER
   ═══════════════════════════════════════════════════════════════════════ */
function ActionTab({ lesson, path, onComplete, done }) {
  const [steps, setSteps] = useState(new Set())
  const toggleStep = i => setSteps(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })
  const actionData = lesson.actionByPath ? (lesson.actionByPath[path] || lesson.action) : lesson.action
  if (!actionData) return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 44, marginBottom: 12 }}>📖</p>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>Finish the lesson first</p>
      <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, marginTop: 6 }}>Complete all cards, then come back here.</p>
    </div>
  )

  return (
    <div style={{ padding: "24px 20px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.text, lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 6 }}>{actionData.headline}</h2>
        <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{actionData.sub}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {actionData.steps.map((step, i) => {
          const isDone = steps.has(i)
          return (
            <button key={i} onClick={() => toggleStep(i)} style={{ width: "100%", background: isDone ? `${C.green}0A` : C.card, border: `1px solid ${isDone ? C.green+"20" : C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, marginTop: 1, border: `2px solid ${isDone ? C.green : C.textFaint+"60"}`, background: isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                {isDone ? <span style={{ color: C.text, fontSize: 12, fontWeight: 800 }}>✓</span> : <span style={{ color: C.textFaint, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: isDone ? C.green : C.text, fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{step.label}</p>
                <p style={{ color: C.textLight, fontSize: 13, lineHeight: 1.5, fontWeight: 400 }}>{step.desc}</p>
                {step.where && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: `${C.purple}0C`, border: `1px solid ${C.purple}18`, borderRadius: 99, padding: "2px 9px", marginTop: 6, color: C.purple, fontSize: 11, fontWeight: 600 }}>📍 {step.where}</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
        <p style={{ color: C.textFaint, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Level complete when</p>
        <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.55, fontWeight: 500 }}>{actionData.doneWhen}</p>
      </div>

      {!done ? <Button3D onClick={onComplete} full>Complete level ✓</Button3D> : (
        <div className="bounce-in" style={{ background: `${C.green}0A`, borderRadius: 14, padding: "24px 20px", textAlign: "center", border: `1px solid ${C.green}20` }}>
          <p style={{ fontSize: 36, marginBottom: 8 }}>🎉</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.green, marginBottom: 4 }}>Level complete!</p>
          <p style={{ color: C.textLight, fontSize: 13, fontWeight: 500 }}>Tap ✕ to return to the course.</p>
        </div>
      )}
    </div>
  )
}

function VideosTab({ lesson, path }) {
  const actionData = lesson.actionByPath ? (lesson.actionByPath[path] || lesson.action) : lesson.action
  const videos = actionData?.videos || []
  if (videos.length === 0) return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 44, marginBottom: 12 }}>📹</p>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>No videos yet</p>
      <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, marginTop: 6 }}>Check back later for video content.</p>
    </div>
  )
  return (
    <div style={{ padding: "24px 20px 40px" }}>
      <p style={{ color: C.textFaint, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Watch to go deeper</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {videos.map((v, i) => (
          <div key={i} className="slide-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", animationDelay: `${i * 0.08}s` }}>
            <div style={{ aspectRatio: "1", background: `linear-gradient(135deg, #0C1120 0%, #1a1a3e 50%, #0C1120 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.08)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.1)" }}>
                <span style={{ fontSize: 20, color: C.text, marginLeft: 3 }}>▶</span>
              </div>
              <span style={{ color: C.textFaint, fontSize: 11, fontWeight: 600 }}>{v.duration || "2:30"}</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{v.title}</p>
              {v.desc && <p style={{ color: C.textFaint, fontSize: 11, fontWeight: 500, marginTop: 4, lineHeight: 1.4 }}>{v.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PathSelector({ lesson, onSelect }) {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 44, marginBottom: 12 }}>🔀</p>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 6, letterSpacing: "-0.02em" }}>{lesson.pathQuestion}</h2>
      <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, marginBottom: 28 }}>Pick whichever fits. You can switch any time.</p>
      {lesson.paths.map(p => (
        <button key={p.id} onClick={() => onSelect(p.id)} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, marginBottom: 10, textAlign: "left", transition: "all .15s" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>{p.label}</p>
            <p style={{ color: C.textLight, fontSize: 13, fontWeight: 500, lineHeight: 1.4, marginTop: 3 }}>{p.desc}</p>
          </div>
          <span style={{ color: C.textFaint, fontSize: 16 }}>›</span>
        </button>
      ))}
    </div>
  )
}

function LessonPlayer({ lesson, onBack, onComplete }) {
  const [view, setView] = useState("learn")
  const [path, setPath] = useState(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [finished, setFinished] = useState(false)

  const sections = lesson.requiresPath && path ? (lesson.sectionsByPath[path] || []) : (!lesson.requiresPath ? lesson.sections : [])
  const total = sections.length
  const actionData = lesson.actionByPath ? (lesson.actionByPath[path] || lesson.action) : lesson.action
  const hasVideos = actionData?.videos?.length > 0
  const tabs = hasVideos ? ["learn", "videos", "action"] : ["learn", "action"]
  const tabLabels = { learn: "Learn", videos: "Videos", action: "Action" }
  const tabIcons = { learn: "📖", videos: "📹", action: "🎯" }

  const canGoBack = view === "learn" && !finished && cardIdx > 0

  const handleNext = () => {
    if (cardIdx < total - 1) { setCardIdx(i => i + 1); window.scrollTo({ top: 0, behavior: "smooth" }) }
    else { setFinished(true); window.scrollTo({ top: 0, behavior: "smooth" }) }
  }

  const handlePrev = () => {
    if (cardIdx > 0) { setCardIdx(i => i - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }
  }

  const handleTabChange = (v) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleComplete = () => { setDone(true); setShowConfetti(true); onComplete(); setTimeout(() => setShowConfetti(false), 3000) }

  return (
    <div style={{ minHeight: "100dvh", background: C.bg }}>
      <style>{STYLES}</style>
      <LConfetti active={showConfetti} />
      <ProgressBar current={finished ? total : (view === "action" || view === "videos" ? total : cardIdx)} total={total + 1} onBack={onBack} onPrev={handlePrev} canGoBack={canGoBack} />
      <div style={{ display: "flex", background: `${C.bg}F2`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(v => (
          <button key={v} onClick={() => handleTabChange(v)} style={{ flex: 1, background: "none", border: "none", padding: "12px 6px", color: view === v ? C.text : C.textFaint, fontWeight: 600, fontSize: 13, position: "relative", transition: "color .15s" }}>
            {tabIcons[v]} {tabLabels[v]}
            {view === v && <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, borderRadius: 99, background: C.green }} />}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 560, margin: "0 auto", paddingBottom: 140 }}>
        {view === "learn" && finished && (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏆</p>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, letterSpacing: "-0.02em" }}>Lesson complete</h2>
            <p style={{ color: C.textLight, fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 6 }}>{lesson.title}</p>
            <p style={{ color: C.textFaint, fontSize: 13, fontWeight: 500, lineHeight: 1.5, marginBottom: 28 }}>Apply what you have learned, watch the videos, or retake the lesson.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300, margin: "0 auto" }}>
              <Button3D onClick={() => handleTabChange("action")} full>Go to Action tab ›</Button3D>
              {hasVideos && (
                <button onClick={() => handleTabChange("videos")} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px", color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  📹 Watch videos to learn more
                </button>
              )}
              <button onClick={() => { setCardIdx(0); setFinished(false) }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px", color: C.textFaint, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Retake lesson</button>
            </div>
          </div>
        )}
        {view === "learn" && !finished && (
          lesson.requiresPath && !path ? <PathSelector lesson={lesson} onSelect={setPath} /> : sections.length > 0 && (
            <div key={cardIdx} className="slide-in">
              {lesson.requiresPath && path && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px 0" }}>
                  <span>{lesson.paths.find(p2 => p2.id === path)?.emoji}</span>
                  <p style={{ color: C.textLight, fontSize: 13, fontWeight: 600 }}>{lesson.paths.find(p2 => p2.id === path)?.label} path</p>
                  <button onClick={() => { setPath(null); setCardIdx(0) }} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Change</button>
                </div>
              )}
              <CardRouter section={sections[cardIdx]} onNext={handleNext} />
            </div>
          )
        )}
        {view === "videos" && <VideosTab lesson={lesson} path={path} />}
        {view === "action" && <ActionTab lesson={lesson} path={path} done={done} onComplete={handleComplete} />}
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════
   LESSON DATA :  Due to file size, lesson data is imported inline.
   Key changes:
   · Sort items jumbled (not alternating)
   · No bucket header labels (removed)
   · Islamic finance compliant (no promoting interest-bearing products)
   · Video placeholders added at lesson ends
   · Saving goal calc replaces sinking fund checklist
   · Debt visual cards for avalanche/snowball
   · Emergency fund simplified
   ═══════════════════════════════════════════════════════════════════════ */
const LT = { teal: "#0FBFB8", amber: "#F59E0B", red: "#F87171", purple: "#A78BFA", green: "#34D399", blue: "#60A5FA" }

const LESSONS_FOUNDATIONS = [
  {
    n: 1, phase: "Foundations", xp: 20, time: 15, title: "Your Net Worth", subtitle: "The Only Number That Matters", emoji: "📊", color: C.green,
    hook: "Everyone tracks their salary. Almost nobody tracks the number that actually shows how they are doing.",
    action: { headline: "Check your figures are correct", sub: "Take a few minutes to make sure everything in the app looks right.",
      steps: [
        { label: "Open the Analytics tab", desc: "Tap it from the bottom bar. You should see your current net worth.", where: "Analytics tab" },
        { label: "Check every asset is included", desc: "Log into your bank, pension portal (e.g. PensionBee, Aviva, your workplace portal), ISA provider, and check current balances. Add anything missing." },
        { label: "Check every liability is included", desc: "Credit cards, loans, mortgage balance, overdraft. Log into each provider and get the current figure." },
        { label: "Update any figures that have changed", desc: "Even rough numbers are fine. An approximate figure you update regularly beats a precise one you set once and forget." }
      ],
      doneWhen: "Your Analytics tab reflects a reasonably accurate picture of what you own and what you owe.",
      videos: [
        { title: "Balance Sheet and Net Worth Check", duration: "2:45", desc: "A walkthrough of how to read your personal balance sheet and what it tells you." },
        { title: "Asset Types", duration: "3:10", desc: "Understanding the difference between productive and lifestyle assets in more detail." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "£0", statLabel: "What most people think their net worth tracking is worth", color: C.red, color2: C.orange,
        title: "The number nobody talks about",
        body: "Everyone knows their salary. Most people can tell you their rent, their car payment, their phone bill. But almost nobody can tell you their net worth. It is the single most important number in personal finance, and it is the one that gets ignored.",
        punchline: "Your salary is your speed. Your net worth is how far you have actually travelled."
      },
      { type: "rich", emoji: "📊", tag: "The formula", title: "One equation that captures your entire financial life", hook: "This is the only formula in personal finance that really matters. Everything else is detail.", iconBg: C.greenLight,
        blocks: [
          { type: "equation", parts: [{ value: "Everything you OWN", label: "assets", color: C.green }, { op: "−" }, { value: "Everything you OWE", label: "liabilities", color: C.red }, { op: "=" }, { value: "Your net worth", label: "the real number", color: C.blue }] },
          { type: "para", text: "Think of it like a game. Your salary is how many coins you collect each round. Your net worth is your total score. The score is what matters." },
          { type: "stat", items: [
            { emoji: "💰", value: "£50k", label: "Salary", color: C.orange },
            { emoji: "📊", value: "£2,000", label: "Net worth", color: C.red },
          ]},
          { type: "para", text: "A person earning £50,000 with £2,000 in net worth is no further along than someone earning £25,000 with £2,000. The salary did not build anything." },
          { type: "callout", color: C.blue, title: "Why this matters", text: "A rising salary with nothing saved still leaves you dependent on the next pay cheque. A growing net worth means your options are expanding every month." }
        ]
      },
      { type: "rich", emoji: "📱", tag: "Where to find your numbers", title: "How to get each value", hook: "You do not need to be exact. But you do need to know roughly where you stand. Here is where to look.", iconBg: C.blueLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🏦", label: "Bank accounts", sub: "Open your banking app. Current account + any savings pots.", color: C.blue },
            { emoji: "🏛️", label: "Pension", sub: "Log into your workplace pension portal or provider (Aviva, Nest, PensionBee, etc.)", color: C.purple },
            { emoji: "📈", label: "ISA or investments", sub: "Check your ISA provider (Vanguard, Trading 212, Freetrade, etc.)", color: C.green },
            { emoji: "🏠", label: "Property equity", sub: "Estimate your home value (Zoopla/Rightmove) minus your mortgage balance.", color: C.orange },
            { emoji: "🚗", label: "Car value", sub: "Look up your car on AutoTrader or Webuyanycar for a rough figure.", color: C.orange },
            { emoji: "💳", label: "Debts", sub: "Credit card balances, loans, overdraft. Check each provider's app or statement.", color: C.red },
          ]},
          { type: "callout", color: C.green, title: "Rough is fine", text: "An estimate updated regularly beats a precise figure calculated once and forgotten. The habit matters more than the accuracy of any single number." }
        ]
      },
      { type: "rich", emoji: "🌱", tag: "The most important concept", title: "Productive vs lifestyle assets", hook: "This is the single most important idea behind building real financial freedom. Once you see it, you cannot unsee it.", iconBg: C.greenLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "📈", title: "Productive assets", desc: "Grow in value or generate income while you sleep. Pension, ISA, rental property. Working for you 24/7.", color: C.green },
            { emoji: "🎯", title: "Lifestyle assets", desc: "Things you own and enjoy but do not grow. Car, jewellery, gadgets, furniture. Mostly lose value.", color: C.orange }
          ]},
          { type: "para", bold: true, text: "Both count toward your net worth. But only productive assets are building your financial independence." },
          { type: "callout", color: C.green, title: "Why this changes everything", text: "Every pound in a productive asset is a tiny employee working for you. The more you have, the harder your money works. Eventually, those assets generate enough to cover your living costs. Work becomes a choice, not a requirement." },
        ]
      },
      { type: "sort", emoji: "🏷️", tag: "Sort these", title: "Productive or lifestyle?", hook: "Tap to sort each asset into the right column.",
        intro: "Productive assets grow or generate income. Lifestyle assets are things you enjoy but that do not build your wealth. Sort each one.",
        buckets: [{ id: "productive", label: "Productive 📈", color: C.green }, { id: "lifestyle", label: "Lifestyle 🎯", color: C.orange }],
        items: [
          { id: "c", emoji: "🏡", label: "Rental property", correct: "productive" },
          { id: "b", emoji: "🚗", label: "Your car", correct: "lifestyle" },
          { id: "e", emoji: "📈", label: "Stocks and Shares ISA", correct: "productive" },
          { id: "a", emoji: "🏛️", label: "Pension pot", correct: "productive" },
          { id: "f", emoji: "🏠", label: "Your main home", correct: "lifestyle" },
          { id: "d", emoji: "💍", label: "Jewellery", correct: "lifestyle" },
        ],
        successMessage: "Productive assets grow your net worth while you sleep. The game is building the productive column as fast as possible."
      },
      { type: "rich", emoji: "🏠", tag: "Equity explained", title: "Your home: what you own vs what the bank owns", hook: "Your full property value is not what counts. Only the part you actually own matters.", iconBg: C.blueLight,
        blocks: [
          { type: "equation", parts: [{ value: "£300,000", label: "property value", color: C.blue }, { op: "−" }, { value: "£240,000", label: "mortgage left", color: C.red }, { op: "=" }, { value: "£60,000", label: "your equity", color: C.green }] },
          { type: "para", text: "The same logic applies to anything bought on finance. A car worth £18,000 with £20,000 left on the loan? That is negative £2,000 on your net worth." },
          { type: "callout", color: C.orange, title: "Negative equity is real", text: "When the debt on an asset is higher than the asset is worth, it drags your net worth down. Most common with car finance." }
        ]
      },
      { type: "myth-fact", title: "Net Worth: Myth or Fact?",
        items: [
          { statement: "You need a high salary to have a high net worth.", answer: "myth", explain: "Net worth is about what you keep, not what you earn. Someone on £30k who saves consistently can have a higher net worth than someone on £100k who spends everything." },
          { statement: "Your main home counts as a productive asset.", answer: "myth", explain: "Your main home is a lifestyle asset. It provides shelter but does not generate income or grow your wealth independently. Only the equity contributes to net worth, and you cannot easily access it." },
          { statement: "A negative net worth is normal for young people.", answer: "fact", explain: "Student loans, car finance, and starting out often mean liabilities exceed assets. What matters is the direction: is the number moving up each month?" },
          { statement: "Checking your net worth monthly is more useful than checking it daily.", answer: "fact", explain: "Daily fluctuations create noise and anxiety. Monthly tracking shows real trends and gives you enough data to spot what is working and what is not." },
        ],
        summary: "Net worth is not about how much you earn. It is about the gap between what you own and what you owe, and whether that gap is growing every month."
      },
    ]
  },
  {
    n: 2, phase: "Foundations", xp: 25, time: 10, title: "How Wealth Actually Builds", subtitle: "The pattern that changes everything", emoji: "🔄", color: C.purple,
    hook: "This is the single most important idea in personal finance. Almost nobody is taught it.",
    action: { headline: "Audit your own money pattern", sub: "Honestly understand which pattern your current month looks like.",
      steps: [
        { label: "Write down what happens on your next payday", desc: "Where does money go first? Does anything go to productive assets automatically before you spend?" },
        { label: "Check your productive assets in the Analytics tab", desc: "Are they growing every month without fail?", where: "Analytics tab" },
        { label: "Identify one productive asset to automate", desc: "Even £25 a month into a pension or ISA counts. The habit matters more than the amount." },
        { label: "Set up a standing order on payday", desc: "Money reaches your productive assets before you have a chance to spend it." }
      ],
      doneWhen: "At least one productive asset receives money automatically on payday every month.",
      videos: [
        { title: "The Psychology of Money", duration: "2:50", desc: "Why our brains make it hard to build wealth and how to work with, not against, your instincts." },
        { title: "Know Your Why", duration: "2:20", desc: "Finding your personal reason for building wealth makes the habits stick." },
        { title: "Comparison Traps and Financial Freedom", duration: "3:00", desc: "How social comparison derails financial progress and what to do about it." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "Same salary", statLabel: "Completely different outcomes", color: C.purple, color2: C.green,
        title: "Two people earn the same money. One retires wealthy. The other retires broke.",
        body: "The difference is not luck, intelligence, or inheritance. It is the order in which money leaves their account each month. This lesson shows you the exact pattern that separates them.",
        punchline: "What you do on payday determines your entire financial future."
      },
      { type: "pattern", mode: "typical", emoji: "😓", tag: "The hard truth", title: "How most people handle money", intro: "This pattern plays out for millions of people every month. Most never realise they are in it.",
        steps: [
          { emoji: "💰", label: "Salary arrives", sub: "Take-home pay lands in the account", color: C.green },
          { emoji: "🏠", label: "Pay the needs", sub: "Rent, bills, food, transport", color: C.blue },
          { emoji: "🛍️", label: "Spend on lifestyle", sub: "Nice things, eating out, entertainment", color: C.orange },
          { emoji: "💳", label: "Borrow for bigger things", sub: "Car finance, holiday on credit, buy now pay later", color: C.red },
          { emoji: "💸", label: "Repayments eat next month", sub: "Paying for last month's lifestyle out of this month's salary", color: C.red },
          { emoji: "🔄", label: "Back to square one", sub: "Next month: repeat. No productive assets were built.", color: C.textFaint },
        ],
        conclusionTitle: "The result", conclusion: "Income keeps coming in. Lifestyle stays roughly the same. Net worth barely moves. This happens at every income level."
      },
      { type: "pattern", mode: "smart", emoji: "🚀", tag: "The wealth builder", title: "How financially free people handle money", intro: "This is not about earning more. It is about doing things in a different order.",
        steps: [
          { emoji: "💰", label: "Salary arrives", sub: "Same take-home pay as anyone else", color: C.green },
          { emoji: "📈", label: "Productive assets funded first", sub: "Pension and ISA contributions leave automatically on payday", color: C.green },
          { emoji: "🏠", label: "Needs paid as normal", sub: "Rent, bills, food, transport", color: C.blue },
          { emoji: "✨", label: "Spend the rest freely", sub: "Whatever remains is genuinely guilt-free spending", color: C.purple },
          { emoji: "📊", label: "Assets grow over time", sub: "Over time, returns start flowing back in", color: C.green },
          { emoji: "🎯", label: "Lifestyle expands from the gains", sub: "Better lifestyle funded by assets, not borrowing. Net worth climbing.", color: C.green },
        ],
        conclusionTitle: "The result", conclusion: "Net worth grows every single month. The productive assets generate their own returns. Eventually that can start to cover lifestyle costs."
      },
      { type: "quiz", emoji: "🧠", tag: "Let's check this", title: "Which move builds the most wealth?",
        question: "You receive an unexpected £500. Which of these has the biggest positive impact on your net worth?",
        options: [
          { text: "Pay off £500 of your credit card debt", correct: true, feedback: "Clearing high-cost debt is often the highest-return move. Eliminating £500 at 25% APR is equivalent to a guaranteed 25% return." },
          { text: "A weekend trip to celebrate", correct: false, feedback: "Enjoyable in the moment, but it contributes nothing to your financial position." },
          { text: "Add it to your Stocks and Shares ISA", correct: false, feedback: "Investing is excellent for long-term growth. But if you have high-cost debt, clearing that first typically has a bigger impact." },
          { text: "New clothes and a nice dinner", correct: false, feedback: "A lifestyle spend, not a wealth-building move." }
        ]
      },
      { type: "rich", emoji: "💡", tag: "The key insight", title: "Why the order matters more than the amount", hook: "Two people on the same salary can end up in completely different financial positions depending on one habit.", iconBg: C.purpleLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "😓", title: "Most people", desc: "Save what is left after spending. After spending, there is almost never anything left.", color: C.red },
            { emoji: "🚀", title: "Wealth builders", desc: "Fund productive assets first on payday. Live on what remains. Adjust spending, not saving.", color: C.green }
          ]},
          { type: "callout", color: C.purple, title: "Pay yourself first", text: "A standing order on payday that sends money to your productive assets before you spend removes willpower from the equation entirely." }
        ]
      }
    ]
  },
  {
    n: 3, phase: "Foundations", xp: 20, time: 15, title: "Income & Spending", subtitle: "Your Budget System", emoji: "💰", color: C.blue,
    hook: "Most people think they know what they spend. Almost everyone is surprised when they actually look.",
    action: { headline: "Build your budget picture in the app", sub: "Doing this even once gives you real insight into your spending.",
      steps: [
        { label: "Check your last 3 months of bank statements", desc: "Most banking apps show spending by category. Find your real monthly average." },
        { label: "Open the Analytics tab and update your income", desc: "Use your actual take-home pay, not your salary figure.", where: "Analytics tab" },
        { label: "Add your spending categories", desc: "Separate needs from wants as best you can." },
        { label: "See how you compare", desc: "The app will show where your split sits and flag anything worth reviewing." }
      ],
      doneWhen: "Your income and spending breakdown are entered in the Analytics tab.",
      videos: [
        { title: "Budgeting 50/30/20", duration: "2:40", desc: "The classic framework and when it works vs when it does not." },
        { title: "Tracking Incomes & Outgoings", duration: "2:15", desc: "How to set up tracking that actually sticks." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "£312/mo", statLabel: "What the average person cannot account for", color: C.orange, color2: C.blue,
        title: "Most people are surprised when they actually look",
        body: "The average UK adult has over £300 a month in spending they cannot explain when asked. Subscriptions, convenience purchases, small daily habits. None of them feel significant. Together they are transformative.",
        punchline: "You cannot manage what you do not measure."
      },
      { type: "rich", emoji: "💼", tag: "What comes in", title: "Take-home pay is your only budget number", hook: "Your salary and your take-home pay are not the same thing. Never budget from the wrong one.", iconBg: C.blueLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "💼", value: "£32,000", label: "Your salary", color: C.orange },
            { emoji: "💰", value: "£2,279", label: "Take-home pay", color: C.green },
          ]},
          { type: "para", text: "Before your salary reaches you, income tax, National Insurance, and your pension contribution are all taken out. What actually lands in your bank is your take-home pay. That is your real budget number." },
          { type: "callout", color: C.blue, title: "How to find it", text: "Open your banking app right now. Look at what came in on your last payday. That number, not your salary, is what you work with." },
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Quick check", title: "Which number do you budget from?", hook: "Make sure you are starting from the right place.",
        question: "You earn a salary of £36,000 a year. Your take-home pay is £2,300 a month. What should you budget from?",
        options: [
          { text: "£2,300 per month (what actually hits your bank account)", correct: true, feedback: "Exactly right. £2,300 is your real budget." },
          { text: "£3,000 per month (£36,000 divided by 12)", correct: false, feedback: "This is your gross salary before tax. You never actually receive this amount." },
          { text: "It does not matter which one I use", correct: false, feedback: "It matters a lot. Budgeting from gross means spending money you have not received." },
          { text: "£36,000 per year (the salary on my contract)", correct: false, feedback: "After deductions, your actual monthly pay will be significantly lower." },
        ]
      },
      { type: "rich", emoji: "📉", tag: "The spending truth", title: "You probably spend more than you think", hook: "This is not a criticism. It is just how human memory works.", iconBg: C.orangeLight,
        blocks: [
          { type: "para", text: "We remember the big purchases. The sofa. The flights. The new phone. We forget the coffee, the quick lunch, the impulse buy, the subscription that quietly renewed." },
          { type: "para", text: "On average, people's estimate of their monthly spending is 30 to 40 percent below what they actually spent." },
          { type: "callout", color: C.orange, title: "The only fix that works", text: "Look at your actual bank statements. Three months. Add them up. Divide by three. That is your real monthly spend." },
        ]
      },
      { type: "sub-audit", emoji: "📱", tag: "Find the hidden spending", title: "The subscription audit", hook: "These payments leave your account quietly every month.", intro: "Tap every subscription you are currently paying for.",
        categories: [
          { label: "Entertainment", emoji: "🎬", items: ["Netflix", "Disney+", "Amazon Prime", "Apple TV+", "Now TV", "Paramount+", "Sky"] },
          { label: "Music and audio", emoji: "🎵", items: ["Spotify", "Apple Music", "YouTube Premium", "Audible"] },
          { label: "Food and delivery", emoji: "🍕", items: ["Deliveroo Plus", "Uber One", "HelloFresh", "Gousto"] },
          { label: "Fitness and health", emoji: "🏃", items: ["Gym membership", "Peloton", "Calm", "Headspace"] },
          { label: "Software and tools", emoji: "💻", items: ["Adobe", "Microsoft 365", "iCloud", "Google One", "Canva"] },
          { label: "News and reading", emoji: "📰", items: ["The Times", "Economist", "Medium", "Substack"] }
        ]
      },
      { type: "sort", emoji: "🏠", tag: "Needs or wants?", title: "Sort these honestly", hook: "Some are deliberately tricky. That is the point.",
        intro: "A need is something you must pay regardless. A want is a choice, even if it feels essential.",
        buckets: [{ id: "need", label: "Need", color: C.green }, { id: "want", label: "Want", color: C.purple }],
        items: [
          { id: "a", emoji: "🏠", label: "Rent or mortgage", correct: "need" },
          { id: "h", emoji: "🎬", label: "Netflix subscription", correct: "want" },
          { id: "e", emoji: "🚌", label: "Bus pass to work", correct: "need" },
          { id: "b", emoji: "☕", label: "Daily café coffee", correct: "want" },
          { id: "d", emoji: "🥙", label: "Buying lunch at work daily", correct: "want" },
          { id: "c", emoji: "⚡", label: "Electricity bill", correct: "need" },
          { id: "j", emoji: "🍽️", label: "Eating out twice a week", correct: "want" },
          { id: "g", emoji: "🛒", label: "Groceries", correct: "need" },
          { id: "f", emoji: "🏋️", label: "Gym membership", correct: "want" },
          { id: "i", emoji: "📱", label: "Phone contract", correct: "need" },
        ],
        successMessage: "The tricky ones are worth thinking about. The café coffee and bought lunch feel necessary but could be made at home. Wants that feel like needs are where budgets quietly leak."
      },
      { type: "budget-steps", emoji: "🥧", tag: "Your budget system", title: "Three steps, in this order", intro: "Meet Sam. She earns £2,200 take-home each month. See how her budget works.", income: 2200,
        needsItems: [{ emoji: "🏠", label: "Rent", amount: 950 }, { emoji: "⚡", label: "Bills and utilities", amount: 180 }, { emoji: "🛒", label: "Food and groceries", amount: 200 }, { emoji: "🚌", label: "Transport", amount: 120 }]
      }
    ]
  },
  {
    n: 4, phase: "Foundations", xp: 15, time: 12, title: "Your Payslip and How Tax Works", subtitle: "Understand every line", emoji: "📋", color: C.orange,
    hook: "Most people have never properly read their payslip. Ten minutes with this lesson changes that.",
    requiresPath: true, pathQuestion: "Are you employed or self-employed?",
    paths: [{ id: "employed", emoji: "👔", label: "Employed", desc: "You receive a payslip from an employer each month" }, { id: "self-employed", emoji: "🧑‍💻", label: "Self-employed", desc: "You run your own business, freelance, or have mixed income" }],
    actionByPath: {
      employed: { headline: "Check your payslip today", sub: "This takes 10 minutes and could save you money.", steps: [{ label: "Find your most recent payslip", desc: "Digital payslips are usually in your employer's HR portal." }, { label: "Check your tax code", desc: "It should say 1257L. If different, note it down." }, { label: "Go through every deduction line", desc: "After this lesson you understand what each one means." }, { label: "If anything looks wrong, go to gov.uk/check-income-tax", desc: "HMRC can refund overpaid tax going back four years." }], doneWhen: "You understand every line of your payslip and have confirmed your tax code is correct." },
      "self-employed": { headline: "Set up your tax pot this week", sub: "One habit removes almost all self-employment tax stress.", steps: [{ label: "Open a separate savings pot and label it Tax", desc: "Monzo, Starling, and most banks let you create named pots." }, { label: "Move 30% of your last payment into it now", desc: "Start the habit today." }, { label: "Register for Self Assessment if not done", desc: "gov.uk/register-for-self-assessment. Takes about 15 minutes." }, { label: "List your regular expenses and save receipts", desc: "Every legitimate expense reduces your tax bill." }], doneWhen: "Your tax pot exists with money in it, and you are registered for Self Assessment." }
    },
    sectionsByPath: {
      employed: [
        { type: "payslip", emoji: "📋", tag: "Reading your payslip", title: "Every line, explained", hook: "Tap each line to understand what it means.", intro: "A typical payslip for someone earning ~£38,000. Your figures will differ but every employed person has the same lines.",
          lines: [
            { label: "Gross salary", amount: "£3,167", color: LT.teal, sign: "plus", explain: "Your total pay before anything is taken off. Never budget from this number." },
            { label: "Income tax (PAYE)", amount: "£505", color: LT.red, sign: "minus", explain: "Taken directly by your employer and sent to HMRC. PAYE stands for Pay As You Earn." },
            { label: "National Insurance", amount: "£225", color: LT.amber, sign: "minus", explain: "Separate from income tax. Pays for the NHS and your state pension entitlement. You need 35 qualifying years for the full amount." },
            { label: "Pension contribution", amount: "£158", color: LT.purple, sign: "minus", explain: "Leaves your pay before you see it. Your employer also adds their contribution. If you are not getting the full employer match, you are leaving free money on the table." },
            { label: "Net pay (take-home)", amount: "£2,279", color: LT.green, sign: "plus", explain: "What actually arrives in your bank. This is your real budget number." }
          ]
        },
        { type: "tax-bands", emoji: "🧮", tag: "How income tax works", title: "Tax bands are not what most people think", hook: "The most common tax myth: that a pay rise can mean you take home less. This is never true.", intro: "You only pay each rate on the slice of income within that band.",
          bands: [
            { label: "Personal Allowance", range: "Up to £12,570", rate: "0%", flex: 18, explain: "The first £12,570 you earn is completely tax free." },
            { label: "Basic Rate", range: "£12,571 to £50,270", rate: "20%", flex: 54, explain: "20p in every pound above £12,570. Most UK workers only ever pay this rate." },
            { label: "Higher Rate", range: "£50,271 to £125,140", rate: "40%", flex: 20, explain: "40% only on the portion above £50,270. A pay rise always means more money." },
            { label: "Additional Rate", range: "Above £125,140", rate: "45%", flex: 8, explain: "The top rate. Affects a very small percentage of earners." }
          ]
        },
        { type: "tax-code", emoji: "🔢", tag: "Your tax code", title: "Three tax codes you need to know", hook: "Your tax code controls how much is taken each month. A wrong one costs real money.", intro: "Most people have the standard code. If yours is different, it is worth understanding why.",
          codes: [
            { code: "1257L", name: "Standard code", statusColor: C.green, status: "Normal, you are fine", explain: "Standard personal allowance of £12,570 tax free per year. If you see this, your tax is correct.", action: null },
            { code: "W1 or M1", name: "Emergency code", statusColor: C.orange, status: "Worth checking", explain: "Applied when HMRC lacks your full details. Can cause overpayment.", action: "Check at gov.uk/check-income-tax" },
            { code: "BR", name: "Basic Rate, no allowance", statusColor: C.red, status: "Check urgently", explain: "20% on every pound with no allowance. Correct for a second job, but a mistake on your main job costs significant money.", action: "Go to gov.uk/check-income-tax immediately" }
          ]
        },
      ],
      "self-employed": [
        { type: "rich", emoji: "📊", tag: "Self-employment basics", title: "Revenue and profit are not the same thing", hook: "You are taxed on profit, not revenue. This distinction saves significant money.", iconBg: C.blueLight,
          blocks: [
            { type: "para", text: "Revenue is every pound that comes in. Profit is what is left after legitimate expenses. That is what HMRC taxes you on." },
            { type: "callout", color: C.blue, title: "Why this matters", text: "Every pound of legitimate business expenses directly reduces your taxable profit and your tax bill." },
          ]
        },
        { type: "expense-tiles", emoji: "🧾", tag: "Claim what you are owed", title: "Expenses most self-employed people miss", intro: "Every legitimate expense reduces your tax bill. If you use something for both work and personal, claim the work proportion.",
          items: [
            { emoji: "🏠", label: "Home office costs", desc: "A proportion of rent, utilities, council tax based on workspace used." },
            { emoji: "💻", label: "Equipment and software", desc: "Computers, phones, work subscriptions. Claim the work proportion." },
            { emoji: "🚗", label: "Travel and mileage", desc: "45p per mile for the first 10,000 business miles, then 25p." },
            { emoji: "📚", label: "Training", desc: "Courses and books developing skills used in your current business." },
            { emoji: "📣", label: "Marketing and website", desc: "Advertising, website hosting, design work, photography." },
            { emoji: "🏦", label: "Professional fees", desc: "Accountancy, legal advice, professional memberships." },
            { emoji: "📱", label: "Phone and broadband", desc: "The work proportion of your phone and internet bills." },
            { emoji: "☕", label: "Client meetings", desc: "Reasonable costs of meeting clients for business purposes." }
          ]
        },
        { type: "tax-pot", emoji: "💰", tag: "The rule that saves you from a nasty surprise", title: "Move 30% away the day money arrives", example: 1000,
          blocks: [
            { text: "One of the most common mistakes: spending all income as it arrives, then facing a tax bill months later you cannot pay." },
            { text: "The fix: every time a payment arrives, move 30% into a separate pot labelled Tax. When your Self Assessment bill arrives, the money is already waiting." }
          ]
        },
        { type: "rich", emoji: "📅", tag: "Self Assessment", title: "Key dates and how it works", hook: "Understanding Self Assessment now means no nasty surprises later.", iconBg: C.blueLight,
          blocks: [
            { type: "para", text: "The UK tax year runs 6 April to 5 April. Your return is due 31 January the following year. Register at gov.uk by 5 October after your first year of trading." },
            { type: "callout", color: C.red, title: "The Year Two trap", text: "Once your bill exceeds £1,000, HMRC starts collecting Payments on Account (advance payments). In year two you can face your full Year One bill plus 50% of next year's estimate at once. The 30% rule covers this automatically." },
            { type: "chips", items: [{ label: "5 April: Tax year ends", color: LT.teal }, { label: "5 October: Register deadline", color: LT.amber }, { label: "31 January: File and pay", color: LT.red }, { label: "31 July: Payment on account", color: LT.purple }] }
          ]
        }
      ]
    }
  }
]

const PHASE2_LESSONS = [
  {
    n: 5, phase: "Stabilise", xp: 25, time: 12, title: "Understanding Debt", subtitle: "How interest works and why it matters", emoji: "💳", color: C.red,
    hook: "Debt is not just money you owe. It is money working against you every single day.",
    action: { headline: "Map every debt you have", sub: "You cannot tackle what you have not measured.",
      steps: [
        { label: "Open the Analytics tab and check your debts", desc: "Are all debts listed? Credit cards, loans, overdraft, car finance.", where: "Analytics tab" },
        { label: "Add any that are missing", desc: "Include the current balance and the interest rate." },
        { label: "Note which has the highest interest rate", desc: "This is costing you the most." },
        { label: "Calculate minimum monthly payments", desc: "Most lenders show this on your statement." }
      ],
      doneWhen: "Every debt is listed with its balance and interest rate.",
      videos: [
        { title: "Good Debt vs Bad Debt", duration: "2:30", desc: "Understanding when borrowing helps and when it hurts." },
        { title: "How Credit Actually Works", duration: "3:00", desc: "Credit scores, bureaus, and what actually matters." },
        { title: "Cost of Borrowing", duration: "2:15", desc: "The real price you pay when you borrow money." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "24.9%", statLabel: "Average UK credit card APR", color: C.red, color2: C.orange,
        title: "Debt is not just money you owe",
        body: "Every day you carry debt, interest is quietly adding to the balance. A credit card at 24.9% APR adds roughly £20 a month to every £1,000 you owe. You do not see it happen. There is no notification. It just appears on your next statement, slightly higher than before.",
        punchline: "Savings work for you. Debt works against you. Same mechanics, opposite direction."
      },
      { type: "rich", emoji: "💸", tag: "What debt actually costs", title: "Interest: the price of borrowing money", hook: "When you borrow money, you do not just pay it back. You pay rent on it, every month, until it is gone.", iconBg: C.redLight,
        blocks: [
          { type: "para", text: "That rent is called interest. It is charged as a percentage of what you owe. The higher the percentage, the more expensive the borrowing." },
          { type: "stat", items: [
            { emoji: "💳", value: "£1,000", label: "You borrow", color: C.blue },
            { emoji: "📊", value: "+£20/mo", label: "Interest added", color: C.red },
            { emoji: "📈", value: "£1,240", label: "After 1 year", color: C.orange }
          ]},
          { type: "callout", color: C.red, title: "It compounds", text: "Interest is charged on your total balance, including last month's interest. So the debt grows by itself unless you actively pay it down." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "The number that matters", title: "APR: how to compare any debt fairly", hook: "APR is the one number that lets you compare completely different types of borrowing on a level playing field.", iconBg: C.orangeLight,
        blocks: [
          { type: "para", text: "APR stands for Annual Percentage Rate. It converts any borrowing cost into a single yearly percentage, no matter how the lender structures their charges." },
          { type: "reveal", items: [
            { emoji: "⚠️", title: "Why the monthly rate misleads you", text: "A lender says: pay 7% over 3 months. Sounds low. But 7% every 3 months, repeated four times, is actually closer to 28% APR. Always look at the APR.", color: C.orange },
            { emoji: "💳", title: "Credit card example", text: "At 24% APR, a £1,000 balance costs roughly £240 per year. Around £20 added every month even if you never spend again.", color: C.red },
            { emoji: "🏦", title: "Why lenders hide it", text: "Some show monthly rates, daily rates, or bury fees in the headline. APR forces everything into one format so you can compare.", color: C.blue },
          ]}
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Check your understanding", title: "How does interest work against you?",
        question: "You owe £500 on a credit card at 36% APR. You make no payments for a year. Roughly how much do you owe after 12 months?",
        options: [
          { text: "Around £680 (£500 plus 36% interest)", correct: true, feedback: "Correct. 36% of £500 is £180, making the total around £680. And next year, interest would be charged on £680, not the original £500. That is how it keeps compounding." },
          { text: "£500: interest only applies when you miss payments", correct: false, feedback: "Interest accrues every single month regardless of whether you make payments or not. Missing payments adds penalty charges on top of that." },
          { text: "Exactly £536: interest is 36p per pound", correct: false, feedback: "36% APR means 36% of the full balance per year. On £500 that is £180 in interest, not £36." },
          { text: "The same £500: the rate only affects minimum payments", correct: false, feedback: "The APR directly increases your balance every month. Even if you make minimum payments, most of that payment is going to interest, not reducing the debt." }
        ]
      },
      { type: "rich", emoji: "⚠️", tag: "Traps to know about", title: "0%* and the asterisk that changes everything", hook: "The asterisk in 0%* is not a footnote. It is the entire point.", iconBg: C.redLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🛒", label: "You buy something for £800 on 0% for 12 months", sub: "Looks free. No interest. Easy payments.", color: C.blue },
            { emoji: "📅", label: "Month 12 arrives. £200 is still outstanding", sub: "Life got in the way. You did not clear it in time.", color: C.orange },
            { emoji: "💥", label: "A rate of 34% APR kicks in immediately", sub: "Sometimes applied retroactively to the entire original purchase.", color: C.red },
            { emoji: "💸", label: "You owe far more than you thought", sub: "The promotional period was a window they bet you would not clear.", color: C.red },
          ]},
          { type: "callout", color: C.red, icon: "⚠️", title: "The design", text: "Stores advertise 0% finance knowing most people will not pay it off in time. The promotional period is not a benefit. It is a trap most people fall into." }
        ]
      },
      { type: "rich", emoji: "🚫", tag: "Buy Now Pay Later", title: "Why BNPL is designed to cost you", hook: "Buy Now Pay Later apps are built around one psychological trick: making the purchase feel free in the moment.", iconBg: C.redLight,
        blocks: [
          { type: "para", text: "Services like Klarna, Clearpay, and Laybuy split purchases into instalments, often appearing at checkout as the easiest option." },
          { type: "grid", items: [
            { emoji: "🧠", title: "The real product", desc: "You spend more than you would paying full price upfront. That is what they sell to retailers." },
            { emoji: "📱", title: "Multiple agreements", desc: "People accumulate BNPL across platforms and lose track of the total." },
            { emoji: "⚠️", title: "Missed payments", desc: "Trigger fees and can affect your credit score." },
            { emoji: "💸", title: "Hidden rates", desc: "Some providers charge high rates once the free period ends." },
          ]},
          { type: "callout", color: C.red, icon: "🚫", title: "The test", text: "If you need to split a payment to make something affordable, you cannot afford it. The total cost is the same, just stretched across months while the impact on your budget is hidden." }
        ]
      },
      { type: "myth-fact", title: "Debt: Myth or Fact?",
        items: [
          { statement: "Making minimum payments on a credit card is fine as long as you never miss one.", answer: "myth", explain: "Minimum payments are designed to keep you in debt as long as possible. On a £3,000 balance at 22% APR, minimum payments alone could take over 25 years to clear and cost thousands in interest." },
          { statement: "A 0% finance deal can end up costing you more than a regular purchase.", answer: "fact", explain: "If you do not clear the full balance before the 0% period ends, the lender applies a high interest rate, sometimes retroactively to the original amount. Most people do not clear it in time." },
          { statement: "Student loans in the UK should always be cleared as fast as possible.", answer: "myth", explain: "Most UK student loans (Plan 2 and Plan 5) are repaid as a percentage of income above a threshold and written off after a set period (typically 30 or 40 years depending on your plan). Overpaying rarely makes financial sense for most borrowers. Check your plan type at gov.uk as terms vary." },
          { statement: "Buy Now Pay Later does not affect your credit score.", answer: "myth", explain: "BNPL providers are increasingly reporting to credit agencies. Missed payments can and do appear on your credit file. Multiple active BNPL agreements can also affect lending decisions." },
          { statement: "Paying off high interest debt is effectively a guaranteed investment return.", answer: "fact", explain: "Clearing a credit card at 22% APR is equivalent to earning a guaranteed 22% return on that money. No investment can reliably match that." },
        ],
        summary: "The biggest misconceptions about debt are the ones that cost you the most. Understanding how interest actually works puts you ahead of most people."
      },
      { type: "rich", emoji: "⚖️", tag: "Good debt vs costly debt", title: "Not all debt is the same", hook: "Some debt helps you build assets. Other debt drains your wealth. The interest rate is the dividing line.", iconBg: C.blueLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "🔴", title: "High cost debt", desc: "Credit cards (20 to 35%), store cards, payday loans. Compounds faster than you can pay it off on minimums.", color: C.red },
            { emoji: "🟢", title: "Lower cost debt", desc: "Mortgage (property may grow). UK student loan (repaid as % of income, written off after 30 years).", color: C.green }
          ]},
          { type: "callout", color: C.blue, title: "The rule", text: "If the guaranteed saving from clearing a debt is higher than the expected return from using that money elsewhere, pay off the debt first. High cost debt almost always wins that comparison." }
        ]
      },
      { type: "quiz", emoji: "🎯", tag: "Which is highest priority?", title: "Pick the most urgent debt to clear",
        question: "You have three debts. Which should you focus extra payments on first?",
        options: [
          { text: "Store card at 35% APR (£400 balance)", correct: true, feedback: "At 35% APR this is the most expensive debt per pound. Even though the balance is smallest, every month it is open costs you significantly more than the others. Clearing this first saves the most total interest." },
          { text: "UK student loan (£28,000 balance)", correct: false, feedback: "UK student loans work very differently. Repaid as a percentage of income above a threshold, and written off entirely after 30 years. Almost never worth overpaying and should not be prioritised over high-cost debt." },
          { text: "Car loan at 7% (£8,000 balance)", correct: false, feedback: "7% is moderate. The store card at 35% is costing you five times as much per pound borrowed. Always target the highest rate first when using the Avalanche method." },
          { text: "Mortgage at 4.5% (£180,000 balance)", correct: false, feedback: "The mortgage is secured against an asset and has the lowest rate. The store card is costing you over seven times more per pound. Focus there first." }
        ]
      },
      { type: "rich", emoji: "🤝", tag: "If debt feels overwhelming", title: "There are always options. You are not alone.", hook: "Debt stress is one of the most common causes of financial anxiety in the UK.", iconBg: C.purpleLight,
        blocks: [
          { type: "reveal", items: [
            { emoji: "📞", title: "Free, confidential debt advice", text: "StepChange, National Debtline, and Citizens Advice all offer free debt advice. They can negotiate with creditors on your behalf. Millions of people use these services every year.", color: C.purple },
            { emoji: "🤝", title: "Lender hardship programmes", text: "Most lenders have hardship programmes and are legally required to deal with you fairly. Explaining your situation can lead to payment holidays, reduced rates, or restructured terms.", color: C.blue },
            { emoji: "⚡", title: "The most important step", text: "Do not ignore it. Interest continues accruing whether you engage or not. Reaching out is the single best step you can take.", color: C.green },
          ]}
        ]
      }
    ]
  },
  {
    n: 6, phase: "Stabilise", xp: 25, time: 12, title: "Paying Off Debt", subtitle: "Avalanche, Snowball and making a plan", emoji: "🏔️", color: C.orange,
    hook: "Having a plan to clear debt is worth more than any spreadsheet. Here is how to build one.",
    action: { headline: "Choose your strategy and start", sub: "Pick a method, write your order, set up one extra payment.",
      steps: [
        { label: "List your debts highest interest rate first", desc: "This is your Avalanche order. Smallest balance first is your Snowball order." },
        { label: "Set all debts to minimum payment by direct debit", desc: "Never miss a minimum. This protects your credit score." },
        { label: "Direct every extra pound to debt number one", desc: "Even £20 a month extra makes a material difference." },
        { label: "Set a monthly reminder to check progress", desc: "Watching the balance fall is incredibly motivating." }
      ],
      doneWhen: "You have chosen a payoff method and minimums are set up on all debts.",
      videos: [
        { title: "Snowball vs Avalanche", duration: "2:45", desc: "Side-by-side comparison of both methods with real numbers." },
        { title: "How Do Interest Rates Work", duration: "2:30", desc: "Understanding the mechanics of how interest compounds against you." },
        { title: "Why Banks Charge Interest", duration: "2:20", desc: "The business model behind lending and why rates vary so much." },
      ]
    },
    sections: [
      { type: "debt-visual", emoji: "🏔️", tag: "The Avalanche method", title: "Highest interest first: saves the most money", hook: "Pay minimums on everything. Throw every extra pound at the highest interest rate. When it is cleared, move to the next.", method: "avalanche", intro: "This is mathematically the cheapest way to clear debt. Watch how each cleared debt frees up more firepower for the next.",
        debts: [
          { label: "Store card (35% APR)", balance: "400", detail: "35% APR" },
          { label: "Credit card (29% APR)", balance: "1,200", detail: "29% APR" },
          { label: "Personal loan (9% APR)", balance: "3,000", detail: "9% APR" },
        ],
        conclusion: "Every pound that was going to interest now builds your future."
      },
      { type: "debt-visual", emoji: "❄️", tag: "The Snowball method", title: "Smallest balance first: builds momentum", hook: "Pay minimums on everything. All extra money goes to the smallest balance. Clear it. Move to the next. Build momentum.", method: "snowball", intro: "Research shows people who use this method are more likely to finish because early wins build motivation.",
        debts: [
          { label: "Store card (£400)", balance: "400", detail: "Smallest" },
          { label: "Credit card (£1,200)", balance: "1,200", detail: "Medium" },
          { label: "Personal loan (£3,000)", balance: "3,000", detail: "Largest" },
        ],
        conclusion: "A completed Snowball beats an abandoned Avalanche every time."
      },
      { type: "quiz", emoji: "🧠", tag: "Which method?", title: "Pick the right strategy for Jordan",
        question: "Jordan has three debts: credit card £300 at 29%, personal loan £2,000 at 11%, store card £150 at 34%. Jordan struggles to stay motivated and gave up on their last budget after two months. Which method?",
        options: [
          { text: "Snowball: start with the store card at £150", correct: true, feedback: "Jordan needs quick wins. The store card is the smallest balance and will be cleared fastest, creating momentum." },
          { text: "Avalanche: start with the store card at 34%", correct: false, feedback: "The store card has the highest rate, but the key concern is motivation. Snowball works here because the smallest balance happens to have the highest rate too, but the reasoning should be about quick wins." },
          { text: "Pay minimums on all three equally", correct: false, feedback: "Paying only minimums means interest compounds and debt barely shrinks. Focusing extra on one debt is significantly better." },
        ]
      },
      { type: "rich", emoji: "💡", tag: "One more tool", title: "Balance transfers and consolidation", hook: "Reducing the interest rate on existing debt is one of the highest-impact moves available.", iconBg: C.greenLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "💳", title: "0% Balance transfer", desc: "Move credit card debt to a new card with no interest for 12 to 30 months. Small transfer fee. Every payment reduces the actual debt.", color: C.blue },
            { emoji: "🔗", title: "Consolidation loan", desc: "Combine multiple debts into one at a lower rate. Simplifies repayment. Only works if you close the cleared accounts.", color: C.purple }
          ]},
          { type: "callout", color: C.green, title: "The important rule", text: "These tools only help if you commit to not adding new debt while using them. A balance transfer that buys 18 months of breathing room is invaluable. Spending on the cleared card defeats the purpose." }
        ]
      }
    ]
  },
  {
    n: 7, phase: "Stabilise", xp: 20, time: 10, title: "Your Emergency Fund", subtitle: "The foundation everything else is built on", emoji: "🛡️", color: C.blue,
    hook: "An emergency fund is not savings. It is insurance against life going wrong.",
    action: { headline: "Set up your emergency fund this week", sub: "Even a small start changes everything.",
      steps: [
        { label: "Open a separate account or pot", desc: "Any instant-access account. Label it Emergency Fund. Keep it separate from your spending money." },
        { label: "Make sure you can access it instantly", desc: "You need to be able to use this money the same day. Keep the card or account details somewhere safe." },
        { label: "Set a standing order on payday", desc: "Even £20 a month is a start. The account existing and growing matters." },
        { label: "Set a first milestone of £1,000", desc: "This covers most common emergencies. Start here." },
      ],
      doneWhen: "A named emergency fund account exists with at least one standing order running into it.",
      videos: [
        { title: "Savings Pots", duration: "2:30", desc: "How to structure your savings using pots and accounts." },
        { title: "Banking Basics", duration: "2:15", desc: "Understanding accounts, pots, and how to make your bank work harder for you." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "60%", statLabel: "of UK adults could not cover a £500 emergency from savings", color: C.blue, color2: C.purple,
        title: "One unexpected bill away from debt",
        body: "Most people are closer to financial trouble than they realise. A broken boiler, a car repair, a sudden job loss. Without a buffer, every one of these becomes new debt. An emergency fund is not about saving. It is about breaking the cycle where one bad month creates six months of repayments.",
        punchline: "An emergency fund is not savings. It is insurance you pay to yourself."
      },
      { type: "rich", emoji: "🛡️", tag: "What it is for", title: "Why an emergency fund changes everything", hook: "Without one, every unexpected cost becomes debt. With one, it is just a minor inconvenience.", iconBg: C.blueLight,
        blocks: [
          { type: "grid", items: [
            { emoji: "🔧", title: "Boiler breaks", desc: "£800 repair needed now" },
            { emoji: "🚗", title: "Car repair", desc: "£500 bill out of nowhere" },
            { emoji: "📱", title: "Phone dies", desc: "Need it for work, £400" },
            { emoji: "💼", title: "Job loss", desc: "No income for 2 months" },
          ]},
          { type: "compare", items: [
            { emoji: "😰", title: "Without a fund", desc: "Credit card, overdraft, borrowing. Creates stress, cost, and more debt.", color: C.red },
            { emoji: "😌", title: "With a fund", desc: "Pay for it, feel the dip, rebuild. No new debt. No panic.", color: C.green }
          ]},
          { type: "callout", color: C.orange, icon: "⚠️", title: "Why this comes before investing", text: "If you invest before building an emergency fund, any unexpected cost forces you to sell investments, often at a bad time. Build protection before growth." },
        ]
      },
      { type: "rich", emoji: "🎯", tag: "How much to save", title: "Start with £1,000. Build to 3 to 6 months.", hook: "The exact amount matters less than the habit.", iconBg: C.greenLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "🎯", value: "£1,000", label: "First milestone", color: C.blue, big: true },
            { emoji: "🛡️", value: "3 to 6 mo", label: "Long term target", color: C.green, big: true },
          ]},
          { type: "callout", color: C.green, title: "How long it takes", text: "At £100 a month: £1,000 in 10 months. At £200 a month: 5 months. Every pound saved is insurance that did not exist before." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Emergency or not?", title: "What counts as an emergency?",
        question: "Which of these is a true emergency?",
        options: [
          { text: "Your boiler breaks down in January", correct: true, feedback: "Exactly. Unexpected, urgent, and necessary. This is what the fund is for." },
          { text: "Christmas gifts for the family", correct: false, feedback: "Christmas happens every year on the same date. It should be planned for with a sinking fund." },
          { text: "Your annual car insurance renewal", correct: false, feedback: "Car insurance renews every year. This is a sinking fund item, not an emergency." },
          { text: "A sale on trainers you have been watching", correct: false, feedback: "Not an emergency. The fund stays protected for genuine crises." },
        ]
      },
      { type: "rich", emoji: "🏦", tag: "Where to keep it", title: "Instantly accessible and separate", hook: "Two rules: you can access it the same day, and it is not mixed with your spending money.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "Keep your emergency fund in a separate account or pot from your everyday spending. When you see the label Emergency Fund before dipping in, you pause. That psychological friction is genuinely useful." },
          { type: "para", text: "Make sure you have a card or the account details to hand so you can actually use it in an emergency. An account you cannot access quickly defeats the purpose." },
          { type: "callout", color: C.blue, title: "Naming helps", text: "Call it Emergency Fund, not just Savings. Most banking apps let you name pots. The label alone makes you think twice before spending it on something that is not a real emergency." }
        ]
      }
    ]
  },
  {
    n: 8, phase: "Stabilise", xp: 25, time: 12, title: "Sinking Funds and Saving With Purpose", subtitle: "From emergency fund to investing", emoji: "🪣", color: C.purple,
    hook: "Every cost that surprises you was actually predictable. You just had not planned for it.",
    action: { headline: "Set up one sinking fund this week", sub: "Pick your most predictable annual cost. Divide by 12. Set up a transfer.",
      steps: [
        { label: "Identify your biggest predictable annual cost", desc: "Car insurance, holidays, birthdays, home maintenance." },
        { label: "Divide the total by 12", desc: "£600 car insurance = £50 per month." },
        { label: "Open a named pot or account", desc: "Label it exactly. Car Insurance. Holiday. Christmas." },
        { label: "Set a monthly standing order", desc: "On payday, the money moves automatically." }
      ],
      doneWhen: "At least one sinking fund exists with a standing order.",
      videos: [
        { title: "SMART Goal Setting", duration: "2:40", desc: "How to set financial goals that actually stick." },
        { title: "Savings Pots", duration: "2:30", desc: "Structuring your savings so every pound has a job." },
      ]
    },
    sections: [
      { type: "rich", emoji: "🪣", tag: "What is a sinking fund?", title: "Saving in advance for predictable costs", hook: "A sinking fund is money set aside a little each month for something you know is coming.", iconBg: C.purpleLight,
        blocks: [
          { type: "para", text: "Car insurance. Annual holiday. Christmas. New phone. These costs are not unexpected. They are certain. They just feel unexpected because you had not planned for them." },
          { type: "para", text: "A sinking fund solves this. Divide the total cost by 12 and move that amount into a named account each month. When the cost arrives, the money is already there. No scrambling. No credit card." },
          { type: "callout", color: C.purple, title: "The reframe", text: "Everything that ends up on a credit card out of nowhere was actually predictable. Sinking funds convert financial surprises into routine transactions." }
        ]
      },
      { type: "saving-goal", emoji: "🎯", tag: "Set a saving goal", title: "Plan your first sinking fund", hook: "Pick something you are saving for and see how long it will take.", intro: "Enter the details below and the tool will calculate your timeline. This goal will sync to your dashboard.",
        examples: ["🚗 Car insurance", "✈️ Holiday", "🎁 Christmas", "📱 Phone upgrade", "🏠 Home maintenance", "🏥 Dental and optician"]
      },
      { type: "rich", emoji: "📈", tag: "The savings order", title: "Emergency fund › sinking funds › investing", hook: "The order matters. Each layer protects the one above it.", iconBg: C.greenLight,
        blocks: [
          { type: "para", text: "Your emergency fund is the foundation. It protects you from life going wrong and stops you reaching for debt in a crisis." },
          { type: "para", text: "Sinking funds sit on top. They handle predictable costs so your emergency fund is never raided for things that were not really emergencies." },
          { type: "para", text: "Once both are in place, investing is where your money builds long-term wealth." },
          { type: "callout", color: C.green, icon: "⚠️", title: "Why the order matters", text: "If you invest before building an emergency fund, any unexpected cost forces you to sell investments, often at a bad time and possibly at a loss. The protective layers need to exist before the growth layers are built." }
        ]
      },
      { type: "rich", emoji: "🚀", tag: "Ready to grow", title: "What comes next", hook: "Once your emergency fund is funded and sinking funds are running, you are financially stabilised.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "With an emergency fund covering shocks and sinking funds handling predictable costs, you are no longer one bad month away from debt." },
          { type: "para", text: "The next lessons cover the tools that build long-term wealth: your employer pension match, how ISAs work, and how to start investing." },
          { type: "callout", color: C.blue, title: "The shift", text: "Stabilising is about removing the things that stop you from growing. Once those are done, every pound you earn has more room to work for you." }
        ]
      }
    ]
  }
]

const PHASE3_LESSONS = [
  {
    n: 9, phase: "Optimise", xp: 20, time: 12, title: "How Tax Actually Works", subtitle: "Understanding the mechanics and how to pay less", emoji: "🧾", color: C.purple,
    hook: "Every time you make money in the UK, HMRC wants a share. Understanding exactly how it works is the first step to legally keeping more of it.",
    action: { headline: "Check three things today", sub: "These take under 30 minutes combined and could save you real money.",
      steps: [
        { label: "Check your tax code at gov.uk/check-income-tax", desc: "A wrong code costs money every month. Takes 5 minutes to check." },
        { label: "Check if you can claim working from home tax relief", desc: "Even one day a week working from home may qualify. Worth up to £312 per year at gov.uk/tax-relief-for-employees." },
        { label: "Check whether you are contributing enough to your pension", desc: "Pension contributions reduce your taxable income pound for pound. It is the single most powerful legal tax reduction available to most people." },
        { label: "If eligible, check marriage allowance at gov.uk/marriage-allowance", desc: "One partner earns under £12,570 and the other is a basic rate taxpayer? Up to £252 per year, backdatable four years." }
      ],
      doneWhen: "You have checked your tax code and identified at least one way to reduce your tax bill.",
      videos: [
        { title: "Banking Basics", duration: "2:15", desc: "How different account types affect what you pay in tax." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "£12,570", statLabel: "Tax free income every UK adult gets", color: C.purple, color2: C.green,
        title: "Tax is not a mystery. It is a system you can learn to use.",
        body: "Most people pay more tax than they need to because they never learned how the system actually works. The UK tax system has allowances, reliefs, and legal wrappers specifically designed to let you keep more of what you earn. This lesson shows you the mechanics.",
        punchline: "Understanding tax is not about avoidance. It is about not paying more than you are required to."
      },
      { type: "rich", emoji: "💸", tag: "The simple truth", title: "Anytime you make money, you owe tax on it", hook: "That is it. That is the whole principle. The rest is just the details of how much and when.", iconBg: C.purpleLight,
        blocks: [
          { type: "para", text: "Earn a salary? Tax on it. Freelance income? Tax on it. Sell investments at a profit? Tax on that too. Earn interest on savings above a small allowance? Also taxed." },
          { type: "para", text: "The UK has two main taxes most people will encounter:" },
          { type: "chips", items: [
            { label: "Income Tax: on money you earn", color: C.red },
            { label: "Capital Gains Tax: on profit when you sell assets", color: C.orange },
          ]},
          { type: "callout", color: C.purple, title: "Why this matters right now", text: "If you invest money outside a tax wrapper like an ISA, every gain you make could trigger a tax bill. The next lesson shows you how to legally avoid this entirely." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "Income Tax", title: "You only pay each rate on that slice of income", hook: "The biggest myth about tax: that earning more can make you worse off. It never can. Here is why.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "Income Tax is charged in bands. You only pay each rate on the income that falls within that band." },
          { type: "chips", items: [
            { label: "£0 to £12,570: 0%", color: C.green },
            { label: "£12,571 to £50,270: 20%", color: C.blue },
            { label: "£50,271 to £125,140: 40%", color: C.orange },
            { label: "Above £125,140: 45%", color: C.red },
          ]},
          { type: "para", text: "A pay rise never makes you worse off. A higher rate only applies to the extra pounds above the threshold, not to everything you earn." }
        ]
      },
      { type: "rich", emoji: "📈", tag: "Capital Gains Tax", title: "Selling something for more than you paid is a taxable event", hook: "Shares, investment funds, second properties, crypto. If you sell for a profit, HMRC wants a portion.", iconBg: C.orangeLight,
        blocks: [
          { type: "para", text: "You have a £3,000 Capital Gains Tax allowance per year (2024/25 tax year). Gains below that: no tax." },
          { type: "para", text: "Above £3,000: basic rate taxpayers pay 18% on investment gains. Higher rate taxpayers pay 24%." },
          { type: "callout", color: C.orange, title: "The ISA solution", text: "Inside a Stocks and Shares ISA, you pay zero Capital Gains Tax on any gain, ever. This is why ISAs matter so much for investors. More on this in the next lesson." }
        ]
      },
      { type: "rich", emoji: "🏛️", tag: "Other taxes to know about", title: "A few more taxes worth understanding", hook: "Most people only think about income tax. But there are several others that can affect you at different life stages.", iconBg: C.blueLight,
        blocks: [
          { type: "chips", items: [
            { label: "Inheritance Tax", color: C.purple },
            { label: "Stamp Duty", color: C.orange },
            { label: "Council Tax", color: C.blue },
            { label: "Dividend Tax", color: C.green },
          ]},
          { type: "heading", text: "Inheritance Tax (IHT)" },
          { type: "para", text: "Charged at 40% on the value of an estate above £325,000 when someone dies. If you leave your home to children or grandchildren, the threshold rises to £500,000. Married couples can combine their allowances, giving a potential £1 million threshold. Gifts made more than 7 years before death are usually exempt." },
          { type: "heading", text: "Stamp Duty Land Tax" },
          { type: "para", text: "Paid when you buy a property in England. First-time buyers pay nothing on the first £425,000. Additional properties (buy-to-let, second homes) carry a 3% surcharge on top of normal rates." },
          { type: "heading", text: "Dividend Tax" },
          { type: "para", text: "If you own shares outside an ISA and receive dividends, the first £500 per year is tax free (2024/25 figure). Above that, basic rate taxpayers pay 8.75%, higher rate pay 33.75%. Inside an ISA: zero dividend tax, ever." },
          { type: "callout", color: C.blue, title: "The pattern", text: "Most of these taxes have allowances, exemptions, and legal ways to reduce them. ISAs and pensions shelter investment returns from income tax, Capital Gains Tax, and dividend tax. Good financial planning addresses each of these over time." }
        ]
      },
      { type: "expense-tiles", emoji: "🎯", tag: "Tax saving examples", title: "Legal ways to pay less tax", intro: "Tap any tile to see how it works. These are the most accessible reductions available. Not all will apply to everyone.",
        items: [
          { emoji: "🏠", label: "Working from home", desc: "If your employer requires you to work from home, HMRC allows £6 per week (£312/year) without any receipts needed. A 20% taxpayer saves £62/year. Higher rate saves £125/year. Claim at gov.uk/tax-relief-for-employees. Can be backdated." },
          { emoji: "💒", label: "Marriage allowance", desc: "If one partner earns under £12,570 and the other is a basic rate taxpayer, the lower earner can transfer £1,260 of their unused allowance. Worth up to £252 per year. Backdatable four years. Apply at gov.uk/marriage-allowance." },
          { emoji: "🎁", label: "Gift Aid", desc: "When you tick Gift Aid on a charity donation, HMRC gives the charity 25p for every £1 you give, at no cost to you. If you pay 40% tax, you can also claim the difference back through Self Assessment." },
          { emoji: "📦", label: "ISA wrapper", desc: "Invest through a Stocks and Shares ISA and all gains are free of Capital Gains Tax, permanently. You have £20,000 of annual allowance. Use it or lose it each April. Full detail in the next lesson." },
          { emoji: "🏛️", label: "Pension contributions", desc: "Pension contributions reduce your taxable income. A 20% taxpayer who contributes £100 effectively only gives up £80 from their pay. HMRC adds the rest. Via salary sacrifice, you also save National Insurance on top." },
          { emoji: "🎀", label: "Gifting for IHT", desc: "You can give away up to £3,000 per year free of Inheritance Tax (the annual exemption). Gifts to a spouse or civil partner are always exempt. Regular gifts from surplus income are also exempt if they do not affect your standard of living." },
          { emoji: "🚴", label: "Cycle to work", desc: "Buy a commuting bike through your employer via salary sacrifice. You pay from gross income before tax, saving 20% to 42% depending on your rate. The bike must be used mainly for commuting." },
          { emoji: "👶", label: "Tax-Free Childcare", desc: "The government adds 20% to every pound you save into your childcare account. Up to £2,000 free per child per year (£4,000 for disabled children). Apply at childcarechoices.gov.uk." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Check this", title: "Which one reduces both income tax and National Insurance?",
        question: "You want to reduce your tax bill. Which option saves you both income tax AND National Insurance at the same time?",
        options: [
          { text: "Pension contributions via salary sacrifice", correct: true, feedback: "Salary sacrifice takes your pension contributions from gross pay before tax and NI are calculated. You pay both taxes on a lower number. No other common relief achieves both at once." },
          { text: "Claiming working from home tax relief", correct: false, feedback: "Working from home relief reduces income tax only. It is well worth claiming but does not touch your National Insurance." },
          { text: "Gift Aid on charity donations", correct: false, feedback: "Gift Aid benefits the charity and allows higher rate taxpayers to reclaim additional relief. It does not affect National Insurance." },
          { text: "Opening an ISA", correct: false, feedback: "An ISA shelters investment growth from Capital Gains Tax and income tax. It has no effect on National Insurance contributions." }
        ]
      }
    ]
  },
  {
    n: 10, phase: "Optimise", xp: 20, time: 12, title: "Your ISA: The Tax-Free Wrapper", subtitle: "How to stop HMRC taxing your investment growth", emoji: "📦", color: C.green,
    hook: "The last lesson explained that investment gains get taxed. This lesson explains how to legally stop that from happening.",
    action: { headline: "Open or top up your ISA", sub: "If you do not have one, this takes about 10 minutes to set up.",
      steps: [
        { label: "Decide which type of ISA you need right now", desc: "Stocks and Shares ISA for long-term investing. Cash ISA for money needed within 5 years. Lifetime ISA if under 40 and saving for a first home." },
        { label: "Open one with a low-cost provider", desc: "Vanguard, Trading 212, and Freetrade for Stocks and Shares. Moneybox for Lifetime ISAs. Takes about 10 minutes." },
        { label: "Set up a monthly direct debit into it on payday", desc: "Even £25 a month started now beats £200 a month started five years from now. Automate it." },
        { label: "Choose a fund if it is a Stocks and Shares ISA", desc: "A global index tracker is the right starting point for most people. The next lesson covers this in detail." }
      ],
      doneWhen: "An ISA is open and at least one contribution has been made or is scheduled.",
      videos: [
        { title: "Rate of Return", duration: "2:20", desc: "Understanding investment returns and what to realistically expect." },
        { title: "Time Horizon and Portfolio Construction", duration: "3:00", desc: "How to match your investments to when you will need the money." },
      ]
    },
    sections: [
      { type: "insight", bigStat: "£0 tax", statLabel: "On every penny of growth inside an ISA", color: C.green, color2: C.teal,
        title: "The legal cheat code most people ignore",
        body: "The government gives every UK adult £20,000 of tax-free investment space every single year. Whatever your money earns inside that space is yours to keep. No Capital Gains Tax. No income tax on dividends. Nothing. And most people do not use it.",
        punchline: "Not using your ISA allowance is volunteering to give HMRC money you did not need to."
      },
      { type: "rich", emoji: "📦", tag: "The wrapper concept", title: "An ISA is a box. Everything inside is tax free.", hook: "Put money in the box. Whatever the money earns inside the box, you pay no UK tax on it. Ever.", iconBg: C.greenLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "📦", title: "Inside an ISA", desc: "Money grows, produces income, and can be sold for profit. None of it is taxed. Ever.", color: C.green },
            { emoji: "🏛️", title: "Outside an ISA", desc: "Same investments, but HMRC takes a portion of every gain, dividend, and profit.", color: C.red }
          ]},
          { type: "callout", color: C.green, title: "£20,000 per year, use it or lose it", text: "Every UK adult gets £20,000 of ISA allowance each tax year. After 5 April the allowance disappears permanently. It does not roll over." }
        ]
      },
      { type: "rich", emoji: "🗂️", tag: "The types", title: "Four types. Which one do you need?", hook: "The right ISA depends on what you are saving for and when you need the money.", iconBg: C.blueLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "💰", label: "Cash ISA", sub: "Like a savings account inside the tax-free wrapper. Good for money you might need within 5 years. Lower returns, but stable and instantly accessible.", color: C.blue },
            { emoji: "📈", label: "Stocks and Shares ISA", sub: "Invest in funds and shares, completely tax free. Best for money you will not need for at least 5 years. Historically the highest long-term returns of any ISA type.", color: C.green },
            { emoji: "🏠", label: "Lifetime ISA", sub: "Under 40s only. Government adds 25% on up to £4,000 per year, so up to £1,000 free annually. Only for buying your first home or retirement from age 60. Penalties apply for other withdrawals.", color: C.purple },
            { emoji: "💼", label: "Innovative Finance ISA", sub: "Used for peer-to-peer lending. Higher risk. Not the right starting point for most people.", color: C.orange },
          ]}
        ]
      },
      { type: "rich", emoji: "💡", tag: "Why the S&S ISA matters most", title: "The tax saving with real numbers", hook: "Here is what the ISA wrapper actually saves you over time.", iconBg: C.greenLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "💰", value: "£10,000", label: "You invest", color: C.blue },
            { emoji: "📈", value: "7%/year", label: "Growth rate", color: C.green },
            { emoji: "⏱️", value: "20 years", label: "Time horizon", color: C.purple },
          ]},
          { type: "stat", items: [
            { value: "£38,700", label: "Final value", color: C.green, big: true },
            { value: "£28,700", label: "Total gain", color: C.teal, big: true },
          ]},
          { type: "compare", items: [
            { emoji: "✅", title: "Inside ISA", desc: "£0 tax on the gain. You keep all £38,700.", color: C.green },
            { emoji: "❌", title: "Outside ISA", desc: "Up to £6,168 in Capital Gains Tax. You keep £32,500.", color: C.red }
          ]},
          { type: "callout", color: C.green, title: "The most important investing decision", text: "Before you think about which fund to pick, make sure your investment is sitting inside an ISA. That decision matters more than the specific fund choice." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Which ISA?", title: "Match the person to the ISA",
        question: "Jamie is 26, has never owned a home, and wants to buy one in the next 4 years. They also want to invest some money for the long term. Which combination is right?",
        options: [
          { text: "Lifetime ISA for the deposit, Stocks and Shares ISA for long-term investing", correct: true, feedback: "The Lifetime ISA gives a 25% government bonus on up to £4,000 per year, specifically for a first home or retirement. The Stocks and Shares ISA handles the long-term wealth building. Jamie can open both and automate contributions to each." },
          { text: "One Cash ISA for everything", correct: false, feedback: "A Cash ISA suits money needed within 5 years. For the long term, cash savings typically do not keep pace with inflation. Jamie needs a Stocks and Shares ISA for long-term growth alongside the Lifetime ISA for the deposit." },
          { text: "You can only have one ISA at a time", correct: false, feedback: "You can hold multiple ISAs of different types at the same time. The only restriction is that your total contributions across all of them cannot exceed £20,000 in one tax year." },
          { text: "Just a Lifetime ISA because the 25% bonus is unbeatable", correct: false, feedback: "The Lifetime ISA bonus is genuinely excellent. But it comes with strict withdrawal rules. Taking money out for anything other than a first home or retirement after 60 triggers a penalty that wipes out the bonus and some of your own contributions too." }
        ]
      },
      { type: "rich", emoji: "🏦", tag: "Choosing a provider", title: "Platform fees are the number that matters", hook: "Small percentage differences in annual fees compound against you the same way returns compound for you.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "When comparing ISA providers, look at the annual platform fee. This is charged as a percentage of your total pot every year." },
          { type: "callout", color: C.orange, title: "Why this fee is so important", text: "On £100,000 invested, a 0.15% annual fee costs £150 per year. A 1.5% fee costs £1,500. Over 20 years with compound growth, that difference adds up to tens of thousands of pounds." },
          { type: "para", text: "Examples of Stocks and Shares ISA providers include Vanguard, Trading 212, Freetrade, and AJ Bell. Examples of Lifetime ISA providers include Moneybox and Hargreaves Lansdown. Compare fees before you open one." }
        ]
      },
      { type: "rich", emoji: "⏰", tag: "Time is the ingredient", title: "Starting early matters more than starting big", hook: "The single most powerful investing decision is simply to start, now, with whatever amount you have.", iconBg: C.greenLight,
        blocks: [
          { type: "chips", items: [
            { label: "Age 25: £200/month = ~£525k by 65", color: C.green },
            { label: "Age 35: £200/month = ~£243k by 65", color: C.orange },
          ]},
          { type: "para", text: "Same monthly amount. Same fund. Same return rate. Ten years earlier. £282,000 difference." },
          { type: "para", text: "This is compound growth. Your returns earn their own returns. The longer it runs, the bigger the effect." },
          { type: "callout", color: C.green, title: "Start now, refine later", text: "A small amount started today beats a larger amount started in three years. Open the account. Set up the direct debit. Everything else can be improved as you go." }
        ]
      }
    ]
  },
  {
    n: 11, phase: "Optimise", xp: 15, time: 10, title: "SMART Goal Setting", subtitle: "Financial goals that actually happen", emoji: "🎯", color: C.orange,
    hook: "Vague financial goals fail. Specific ones with numbers and dates succeed at a completely different rate.",
    action: { headline: "Set one real financial goal today", sub: "Use the SMART framework to turn a wish into a plan.",
      steps: [
        { label: "Pick one financial goal you actually care about", desc: "A house deposit. An emergency fund. A holiday. Something real and meaningful to you." },
        { label: "Make it SMART: give it a number and a date", desc: "Not 'save more'. Instead: '£5,000 in my emergency fund by December 2025'." },
        { label: "Calculate the monthly amount needed", desc: "Divide the total by the number of months you have. That is your standing order amount." },
        { label: "Add the goal to the app and set up the standing order", desc: "Track it monthly. Seeing progress is what keeps you going.", where: "Goals tab" }
      ],
      doneWhen: "One SMART financial goal is set with a specific number, specific date, and a standing order running.",
      videos: [
        { title: "SMART Goal Setting", duration: "2:40", desc: "How to set financial goals that actually stick." },
        { title: "Inflation", duration: "2:20", desc: "Why your savings need to grow and what happens if they do not." },
      ]
    },
    sections: [
      { type: "rich", emoji: "❌", tag: "Why goals fail", title: "The problem with most financial goals", hook: "The goal is not the problem. The way it is written is.", iconBg: C.redLight,
        blocks: [
          { type: "para", text: "Most people set financial goals that sound like: 'I want to save more money.' 'I should pay off my debt.' 'I need to start investing.'" },
          { type: "para", text: "Every single one of those will fail. Not because the person does not want it, but because the goal gives no direction. When? How much? By what date?" },
          { type: "callout", color: C.red, title: "Vague goals produce vague behaviour", text: "Your brain cannot work toward a fuzzy target. Without a specific number and a specific date, you will always find a reason to start next month. And next month never comes." }
        ]
      },
      { type: "rich", emoji: "✅", tag: "The SMART framework", title: "Make every goal do this", hook: "SMART is a tool for turning wishes into plans. Applied to financial goals it is transformative.", iconBg: C.greenLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🎯", label: "Specific", sub: "Exactly what do you want? Not 'save money'. Instead: 'save £3,000 for a holiday'.", color: C.green },
            { emoji: "📏", label: "Measurable", sub: "Can you track it? A number makes progress visible and motivation real.", color: C.blue },
            { emoji: "🌱", label: "Achievable", sub: "Is it realistic given your income and commitments? Stretch, but do not break.", color: C.green },
            { emoji: "💡", label: "Relevant", sub: "Does it actually matter to you personally? Goals you genuinely want have much higher completion rates.", color: C.purple },
            { emoji: "📅", label: "Time-bound", sub: "What is the deadline? A date creates urgency and tells you exactly how much to save each month.", color: C.orange },
          ]}
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Is this SMART?", title: "Which goal will actually lead to action?",
        question: "Which of these goal statements is most likely to result in real action?",
        options: [
          { text: "I want to save £5,000 for a house deposit by March 2026", correct: true, feedback: "Fully SMART. Specific amount (£5,000), specific purpose (deposit), specific deadline (March 2026). Divide by the number of months and you have an exact standing order amount you can set up today." },
          { text: "I want to save enough for a house one day", correct: false, feedback: "No number, no date. There is nothing actionable here. When is 'one day'? How much is 'enough'? Your brain has no target to work toward." },
          { text: "I need to be better with money", correct: false, feedback: "This is a wish, not a goal. It has no measurement, no deadline, and no specific action that follows from it. It will feel meaningful for a week and then disappear." },
          { text: "I will save more next month", correct: false, feedback: "How much more? More than what? Starting when exactly? Next month always becomes the month after. A real goal needs a number and a date." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "Multiple goals at once", title: "Running several goals without losing track", hook: "Once you have the system, you can run several goals in parallel automatically.", iconBg: C.purpleLight,
        blocks: [
          { type: "para", text: "Most people need to work on several goals at once: emergency fund, paying off debt, and saving for a holiday might all be active simultaneously." },
          { type: "para", text: "The key is separate pots, separate standing orders, separate tracking. Each goal has its own named account and its own automated transfer. They run in the background without requiring daily decisions." },
          { type: "callout", color: C.purple, title: "The right order", text: "Emergency fund first. High-cost debt second. Then everything else ranked by what matters most to you. The order matters for the maths, but the most important thing is that you are actually doing it and it is automated." }
        ]
      }
    ]
  },
  {
    n: 12, phase: "Optimise", xp: 25, time: 12, title: "Workplace Pensions", subtitle: "Free money most people are leaving behind", emoji: "🏛️", color: C.purple,
    hook: "For most employed people, their workplace pension is the single highest-return financial decision available. Many are leaving thousands of pounds on the table every year.",
    action: { headline: "Check and optimise your pension today", sub: "This takes about 15 minutes. The upside can be significant.",
      steps: [
        { label: "Find your pension provider", desc: "Check your payslip for the provider name. It is usually Aviva, Nest, Legal and General, Scottish Widows, or Peoples Pension." },
        { label: "Log into your pension portal", desc: "Create an account if you do not have one. Most providers have a simple app or website." },
        { label: "Find your current contribution rate and your employer matching limit", desc: "Both percentages will be visible in your account settings or payslip." },
        { label: "If you are not at the matching limit, increase your contribution", desc: "Do this through your HR portal or payroll team. This is a pay rise you are currently refusing." },
        { label: "Check your fund choice", desc: "Default funds are fine for most people. If you see an option to choose your own fund, look for a 'global equity' or 'lifestyle' option appropriate for your age." }
      ],
      doneWhen: "You know your contribution rate, your employer matching limit, and you are contributing enough to get the full match.",
      videos: [
        { title: "Retirement Toolkit", duration: "3:10", desc: "A complete overview of pensions, retirement planning, and how to build toward financial independence." },
        { title: "Rate of Return", duration: "2:20", desc: "Understanding investment returns and what your pension growth might realistically look like." },
      ]
    },
    sections: [
      { type: "rich", emoji: "🤔", tag: "What is a pension?", title: "It is an investment account with extra benefits", hook: "A pension is not a mysterious financial product. It is an investment account with two features no other account offers.", iconBg: C.purpleLight,
        blocks: [
          { type: "para", text: "Feature one: the government tops up everything you put in. A basic rate taxpayer contributes £80 and has £100 invested, because HMRC adds 20% tax relief. A 40% taxpayer contributes £60 and has £100 invested." },
          { type: "para", text: "Feature two: your employer often matches what you contribute. You put in 5%, they put in 5% on top. That is free money directly added to your pot." },
          { type: "callout", color: C.purple, title: "The catch", text: "You cannot access pension money until age 57 (rising to 57 in 2028). This makes it specifically for retirement. It is not a place for money you might need before then. But for long-term wealth building, no other account competes with it on tax efficiency." }
        ]
      },
      { type: "rich", emoji: "🎁", tag: "The free money", title: "Employer matching: turning down a pay rise every month", hook: "If your employer matches pension contributions and you are not contributing enough to get the full match, the calculation is simple: you are refusing a pay rise.", iconBg: C.greenLight,
        blocks: [
          { type: "callout", color: C.green, icon: "💰", title: "A concrete example", text: "Salary: £35,000. Employer matches up to 5%. You contribute 3%, so your employer also contributes 3%. If you increase to 5%, your employer increases to 5%. That extra 2% from them is £700 per year going into your pension. That is free money from your employer that you are currently not claiming just because of the percentage you have set." },
          { type: "para", text: "Via salary sacrifice, your contributions come from gross pay before tax and National Insurance are calculated. So the actual cost to your take-home pay is less than the contribution amount." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Does this make sense?", title: "What happens if you increase your contribution?",
        question: "Your salary is £32,000. Your employer matches up to 5% of salary. You currently contribute 3%. You increase to 5%. What is the rough impact?",
        options: [
          { text: "Your employer's contribution increases from £960 to £1,600. That is £640 more per year in your pension", correct: true, feedback: "Correct. 3% of £32,000 is £960 employer contribution. 5% is £1,600. You gain £640 per year just by changing a number in your HR portal. And because your own contribution is via salary sacrifice, your take-home only drops by around £53 per month after tax relief, while £133/month goes into your pension." },
          { text: "Nothing changes: employers always contribute the same amount", correct: false, feedback: "Matching means the employer tracks your contribution up to their stated limit. If you contribute below that limit, they only match what you contribute. Reach their limit to unlock their full contribution." },
          { text: "Your take-home pay drops by the full 2% extra contribution", correct: false, feedback: "Via salary sacrifice, contributions come before tax and NI are calculated. So increasing by 2% of £32,000 (£640/year) actually costs you less than £640 from your take-home, because you pay less income tax and NI on the lower taxable salary." },
          { text: "The employer contribution is taxed as income", correct: false, feedback: "Employer pension contributions are not taxable. They go straight into your pension pot and benefit from the same tax-free growth as your own contributions." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "How your money is invested", title: "You have more control than you might think", hook: "Most people are in their pension's default fund and have no idea what it is invested in or whether it is right for them.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "Your workplace pension will have a default investment option, usually a 'lifestyle' or 'target date' fund designed to automatically shift from higher-growth to lower-risk investments as you approach retirement." },
          { type: "para", text: "This is fine for most people, particularly if you are decades away from retirement. But you usually have the option to choose from a range of funds through your pension portal." },
          { type: "callout", color: C.blue, title: "How to check and change your fund", text: "Log into your pension provider's portal or app. Look for 'investment options' or 'fund choice'. If you want higher growth potential and are many years from retirement, look for a 'global equity' fund. If you are unsure, the default is designed to be a reasonable choice for most people." },
          { type: "para", text: "You can usually switch funds at no cost and the change takes effect within a few days. Your existing pot and future contributions can be directed to your chosen fund." }
        ]
      },
      { type: "rich", emoji: "🔄", tag: "Changing jobs", title: "Your pension pot belongs to you, not your employer", hook: "Most people end up with more pension pots than they realise. Every job can create a new one.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "When you leave a job, your pension pot stays invested and grows until retirement. Your employer stops contributing, but your money keeps working." },
          { type: "para", text: "Over a career with several employers, you may accumulate multiple small pots. These can be consolidated into a single pot (via a pension transfer) to simplify tracking and sometimes reduce fees." },
          { type: "callout", color: C.orange, title: "Track down lost pensions", text: "The government's Pension Tracing Service at gov.uk/find-pension-contact-details can find contact details for pension schemes from old employers. Many people are surprised by how much they find." }
        ]
      }
    ]
  },
  {
    n: 13, phase: "Optimise", xp: 20, time: 10, title: "SIPPs: Your Private Pension", subtitle: "A pension you own and control completely", emoji: "💼", color: C.blue,
    hook: "A SIPP (Self-Invested Personal Pension) is a private pension you set up yourself. It gives you the same tax benefits as a workplace pension, plus full control over how your money is invested.",
    action: { headline: "Decide if opening a SIPP makes sense for you", sub: "If it does, the setup takes about 15 minutes.",
      steps: [
        { label: "Identify whether a SIPP fits your situation", desc: "Self-employed, want to contribute more than your workplace pension allows, or want more investment options. Any of these is a good reason to open one." },
        { label: "Research providers and compare their annual platform fees", desc: "Examples include Vanguard, AJ Bell, PensionBee, and Hargreaves Lansdown. Fees vary, so compare before opening." },
        { label: "Open the account and make a first contribution", desc: "Getting started is the main step. Contribution amounts can always be changed later." },
        { label: "Choose a global equity index fund as your starting investment", desc: "More detail on fund selection in the investing lessons that follow." }
      ],
      doneWhen: "You have decided whether a SIPP is relevant and, if so, have opened one or have a clear plan to.",
      videos: [
        { title: "Retirement Toolkit", duration: "3:10", desc: "A complete guide to retirement planning, including SIPPs and how they fit into a long-term plan." },
      ]
    },
    sections: [
      { type: "rich", emoji: "💼", tag: "The three pension pillars", title: "Where a SIPP fits in your pension picture", hook: "The UK has three types of pension. A SIPP is the third one: a private pension you set up and control yourself.", iconBg: C.blueLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🏛️", label: "State Pension", sub: "Paid by the government from age 66 (rising to 67). Based on your National Insurance record. Currently around £11,500 per year. Not enough on its own.", color: C.blue },
            { emoji: "🏢", label: "Workplace Pension", sub: "Set up by your employer. They contribute alongside you. Automatic enrolment means most employees have one. Often limited fund choices.", color: C.green },
            { emoji: "💼", label: "SIPP (Private Pension)", sub: "A pension you open yourself, with any provider you choose. Full control over investments. Same tax benefits as a workplace pension.", color: C.purple },
          ]},
          { type: "callout", color: C.blue, title: "You can have all three", text: "These are not alternatives. They stack. The annual contribution limit of £60,000 (or 100% of earnings) covers all pensions combined (2024/25 figure)." }
        ]
      },
      { type: "rich", emoji: "🎯", tag: "Who needs one?", title: "Three reasons people open a SIPP", hook: "Not everyone needs a SIPP. But if any of these apply to you, it is worth setting one up.", iconBg: C.purpleLight,
        blocks: [
          { type: "grid", items: [
            { emoji: "🧑‍💻", title: "Self-employed", desc: "No employer pension. A SIPP is your main retirement vehicle. Contribute when you can." },
            { emoji: "📈", title: "Want to save more", desc: "Already maxed your workplace pension match? A SIPP lets you put more in and get more tax relief." },
            { emoji: "🔀", title: "Want more choice", desc: "Workplace pensions often have limited funds. A SIPP gives you access to thousands." },
            { emoji: "🔄", title: "Consolidating old pots", desc: "Multiple pensions from old jobs? A SIPP can bring them together in one place." },
          ]},
          { type: "para", text: "SIPP stands for Self Invested Personal Pension. It works identically to a workplace pension for tax purposes: you contribute, the government adds tax relief, your money grows tax free, and you access it from age 57 (rising to 58 from 2028)." },
          { type: "compare", items: [
            { emoji: "🏢", title: "Workplace pension", desc: "Employer chooses provider. Limited fund options. Employer contributes alongside you. Automatic.", color: C.green },
            { emoji: "💼", title: "SIPP", desc: "You choose provider. Wide fund choice. No employer involved. You decide when and how much.", color: C.purple }
          ]},
        ]
      },
      { type: "rich", emoji: "💰", tag: "The numbers", title: "What the tax relief actually looks like", hook: "The government adds money to every pension contribution you make. Here is how it works in practice.", iconBg: C.greenLight,
        blocks: [
          { type: "para", text: "You are self-employed and contribute £400 to your SIPP. The government automatically adds 20% tax relief, making it £500 in your pot." },
          { type: "para", text: "If you pay 40% tax, you can claim an additional 20% back through your tax return. That £400 contribution would have only cost you £240 after both rounds of relief." },
          { type: "callout", color: C.green, title: "A real example over time", text: "Mia is self-employed. She puts £500 per month into her SIPP. The government adds £125 relief. Her pot grows at 7% per year. After 25 years she has approximately £490,000. The total she personally contributed: £150,000. The rest is tax relief plus compound growth." }
        ]
      },
      { type: "rich", emoji: "🏦", tag: "Providers", title: "Examples of SIPP providers", hook: "There are several well-known SIPP providers. The annual platform fee is the most important thing to compare.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "The annual platform fee (charged as a percentage of your total pot) is what compounds against you over time. A 0.5% difference on a £200,000 pot is £1,000 per year." },
          { type: "chips", items: [
            { label: "Vanguard SIPP", color: LT.green },
            { label: "AJ Bell", color: LT.blue },
            { label: "PensionBee", color: LT.amber },
            { label: "Hargreaves Lansdown", color: LT.purple },
            { label: "InvestEngine", color: LT.teal },
          ]},
          { type: "para", text: "These are examples, not recommendations. Compare fees and investment options on each provider's website before opening an account." },
          { type: "callout", color: C.orange, title: "Self-employed and tax returns", text: "If you are self-employed and file a Self Assessment tax return, you declare your SIPP contributions there. Any additional tax relief above the basic 20% is then paid to you, either as a reduction in your tax bill or as a refund." }
        ]
      }
    ]
  }
]

const PHASE4_LESSONS = [
  {
    n: 14, phase: "Invest", xp: 20, time: 10, title: "How Investing Actually Works", subtitle: "What it really means to put your money to work", emoji: "📈", color: C.green,
    hook: "Almost everything you buy goes down in value. Investing is different: it is buying things that can go up in value and pay you an income. Financially successful people have mastered not just how they earn money, but how they make it work.",
    action: { headline: "Understand where you stand with investing", sub: "Before putting money in, make sure your foundation is right.",
      steps: [
        { label: "Confirm your emergency fund is in place", desc: "You should not invest money you might need within 3 years. The emergency fund covers unexpected costs so your investments can stay invested." },
        { label: "Confirm you have high-cost debt under control", desc: "Debt at 20% APR costs more than most investments return. Clear that first." },
        { label: "Decide on your time horizon", desc: "When will you realistically need this money? Shorter timelines suit lower risk investments. Longer timelines allow you to take more risk for potentially higher returns." },
        { label: "Open a Stocks and Shares ISA if you have not already", desc: "This is the wrapper your investments should sit inside. Details in the ISA lesson." }
      ],
      doneWhen: "You know your time horizon and have a Stocks and Shares ISA open or a plan to open one.",
      videos: [
        { title: "Risk and Risk Tolerance", duration: "2:30", desc: "How to think about risk honestly and match your investments to your personality." },
        { title: "Rate of Return", duration: "2:20", desc: "What to realistically expect from investments over time." },
      ]
    },
    sections: [
      { type: "rich", emoji: "📈", tag: "The big idea", title: "Your money can work harder than you do", hook: "Almost everything you buy loses value the moment you own it. Investing is the opposite.", iconBg: C.greenLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "💵", value: "£1,000", label: "Invested in 1985", color: C.blue },
            { emoji: "📈", value: "£11,000+", label: "Worth today", color: C.green },
          ]},
          { type: "para", text: "That is a global equity index over roughly 40 years. The person who invested did nothing except leave it alone. The money worked every single day, including weekends and holidays." },
          { type: "compare", items: [
            { emoji: "📉", title: "Consumption", desc: "Clothes, gadgets, cars, furniture. You buy them, use them, they depreciate. Money gone.", color: C.red },
            { emoji: "📈", title: "Investing", desc: "Buying something that can grow in value or pay you income. Ideally both. Money working.", color: C.green }
          ]},
          { type: "callout", color: C.green, title: "The pattern", text: "Financially successful people master how their money works when they are not working. Every pound invested is a tiny employee working around the clock." }
        ]
      },
      { type: "rich", emoji: "⚠️", tag: "The honest truth", title: "Investing is not guaranteed. That is the trade off.", hook: "You accept the possibility of losing money in exchange for the potential to grow it faster than cash.", iconBg: C.orangeLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "🔒", title: "Low risk (cash, bonds)", desc: "Capital is safer. Returns are lower. May not keep up with inflation over long periods.", color: C.blue },
            { emoji: "📈", title: "Higher risk (equities, property)", desc: "Can fall in value short term. Historically delivers stronger returns over 10+ years.", color: C.green }
          ]},
          { type: "callout", color: C.orange, title: "Risk and return are always linked", text: "Higher potential return always comes with higher risk. Lower risk always means lower return. Anyone offering high returns with no risk is not telling the truth." },
          { type: "callout", color: C.red, title: "Match your risk to your timeline", text: "The shorter your time horizon, the lower risk your investments should be. Money needed in 1 to 2 years suits cash or short term bonds. Money not needed for 10+ years can tolerate more volatility in exchange for higher expected returns. There is an investment approach for every timeline." }
        ]
      },
      { type: "rich", emoji: "📉", tag: "Why you cannot just save", title: "Inflation quietly erodes what you have", hook: "Money sitting in cash loses purchasing power every year.", iconBg: C.blueLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "💵", value: "£10,000", label: "Cash in 2004", color: C.blue },
            { emoji: "🛒", value: "£6,200", label: "Buying power in 2024", color: C.red },
          ]},
          { type: "para", text: "Your bank balance still says £10,000. But what it can actually buy has shrunk by nearly 40%. Inflation is invisible but relentless." },
          { type: "callout", color: C.blue, title: "The counterintuitive truth", text: "For longer term goals, keeping everything in cash can actually be the riskier choice because inflation steadily erodes its purchasing power. The right approach depends on when you need the money and how much risk you are comfortable with." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "The maths of growth", title: "What is rate of return and how does it work?", hook: "Rate of return is simply how much your investment grows (or shrinks) over a period, expressed as a percentage.", iconBg: C.greenLight,
        blocks: [
          { type: "equation", parts: [{ value: "£1,100", label: "end value", color: C.green }, { op: "−" }, { value: "£1,000", label: "start value", color: C.blue }, { op: "=" }, { value: "10%", label: "return", color: C.green }] },
          { type: "reveal", items: [
            { emoji: "📈", title: "Stocks and shares", text: "You buy shares for £1,000. A year later they are worth £1,100. Your return is 10%. If they also paid £30 in dividends, your total return is 13%.", color: C.green },
            { emoji: "🏠", title: "Property", text: "You buy a rental property for £200,000. It earns £10,000 rent per year after costs. Your rental yield is 5%. If the property also rises to £210,000, your total return is 10%.", color: C.blue },
            { emoji: "💵", title: "Cash savings", text: "Your savings account pays 4% interest. On £10,000 that is £400 per year. Simple. But if inflation is 3%, your real return is only 1%.", color: C.orange },
          ]},
          { type: "callout", color: C.green, title: "Compound returns", text: "When your returns earn their own returns, growth accelerates. £1,000 at 7% per year becomes £1,967 after 10 years and £7,612 after 30. The longer the time, the more powerful the effect." }
        ]
      },
      { type: "compound-calc", emoji: "🚀", tag: "See it for yourself", title: "The power of compound growth",
        hook: "Change the numbers and watch what happens. This is why starting early matters so much.",
        intro: "Enter a monthly contribution, an assumed annual return, and a number of years. The return rate is the average annual growth of your investment. For context, a diversified global equity fund has historically averaged around 7 to 10% per year over long periods. This is not guaranteed."
      },
      { type: "rich", emoji: "⚖️", tag: "Risk and return", title: "The relationship that never changes", hook: "Higher potential return always means higher risk. This rule has no exceptions.", iconBg: C.redLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "💵", label: "Cash", sub: "Lowest risk, lowest return. Capital is safe but barely grows.", color: C.blue },
            { emoji: "📋", label: "Bonds", sub: "Moderate risk, moderate return. Steadier than equities.", color: C.purple },
            { emoji: "🌍", label: "Global equities", sub: "Higher risk, higher long term return. The core of most portfolios.", color: C.green },
            { emoji: "🎰", label: "Speculative (single stocks, crypto)", sub: "Highest risk. Can fall to zero. Not investing, closer to speculation.", color: C.red },
          ]},
          { type: "callout", color: C.red, title: "Time horizon is everything", text: "Stocks can fall 30% in a year. Over 20 years, the global stock market has historically always recovered. A long time horizon turns short term volatility into an irrelevance." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Check this", title: "What is the most important factor?",
        question: "You have £5,000 to invest. What is the single most important thing to establish before deciding where to put it?",
        options: [
          { text: "When you will need the money", correct: true, feedback: "Your time horizon determines everything else. Money needed in 2 years belongs in cash. Money not needed for 20 years can tolerate more volatility in exchange for higher long-term returns. Get this wrong and you may be forced to sell at exactly the wrong moment." },
          { text: "Which investments are performing best right now", correct: false, feedback: "Past performance does not reliably predict future returns. Chasing recent winners is one of the most common and costly beginner mistakes. Time horizon comes first, then asset allocation, then specific choices." },
          { text: "The maximum possible return", correct: false, feedback: "Chasing maximum return means accepting maximum risk. The right question is what is appropriate for your time horizon, not what returns the most in theory." },
          { text: "Which platform has the most features", correct: false, feedback: "Platform features matter less than your asset allocation and time horizon. A simple, low-cost global index fund inside an ISA on a basic platform beats a complex portfolio on a fancy platform every time." }
        ]
      }
    ]
  },
  {
    n: 15, phase: "Invest", xp: 20, time: 12, title: "What You Can Invest In", subtitle: "The main asset classes explained simply", emoji: "🗂️", color: C.blue,
    hook: "Most people have heard of stocks. Far fewer understand bonds, property as an investment, or why the mix of these things matters enormously.",
    action: { headline: "Identify which asset classes are right for your situation", sub: "After this lesson, you will know what is in your pension or ISA and whether it makes sense.",
      steps: [
        { label: "Log into your pension portal and find your current fund", desc: "Note what your money is actually invested in. Is it stocks? Bonds? A mix?" },
        { label: "Check what is in any ISA you have open", desc: "If it is a Cash ISA, your money is in cash. If it is a Stocks and Shares ISA, check which fund." },
        { label: "Decide if the mix matches your time horizon", desc: "Long time horizon (10+ years): mostly equities is typically appropriate. Shorter timeframe: more cash or bonds." }
      ],
      doneWhen: "You know what asset classes your money is currently in and whether it matches your time horizon.",
      videos: [
        { title: "Risk and Risk Tolerance", duration: "2:30", desc: "Understanding how different asset classes carry different levels of risk." },
        { title: "Diversification", duration: "2:30", desc: "Why owning a mix of different assets reduces your overall risk." },
      ]
    },
    sections: [
      { type: "rich", emoji: "💵", tag: "Asset class 1", title: "Cash and savings accounts", hook: "Cash is not an investment. It is a store of value. Over the long term it typically loses purchasing power.", iconBg: C.blueLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "🔒", value: "Low risk", label: "Capital is safe", color: C.green },
            { emoji: "📉", value: "1 to 5%", label: "Typical interest", color: C.blue },
            { emoji: "⏱️", value: "Short term", label: "Best for near goals", color: C.purple },
          ]},
          { type: "grid", items: [
            { emoji: "✅", title: "Good for", desc: "Emergency funds, near term goals, capital you cannot afford to lose" },
            { emoji: "⚠️", title: "Watch out", desc: "Inflation erodes value over time. £10k in cash loses real buying power every year" },
          ]},
          { type: "callout", color: C.blue, title: "Role in a portfolio", text: "Cash is stability, not growth. Everyone needs some. But over a 20 year horizon, cash alone will almost certainly underperform equities." }
        ]
      },
      { type: "rich", emoji: "📈", tag: "Asset class 2", title: "Stocks (shares in companies)", hook: "When you buy a stock, you buy a tiny ownership stake in a real company. If the company grows, so does your stake.", iconBg: C.greenLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "📊", value: "Higher risk", label: "Can fall to zero", color: C.orange },
            { emoji: "📈", value: "7 to 10%", label: "Historic avg/yr", color: C.green },
            { emoji: "⏱️", value: "Long term", label: "Best for longer goals", color: C.purple },
          ]},
          { type: "compare", items: [
            { emoji: "📈", title: "Capital growth", desc: "The share price rises over time. You sell for more than you paid.", color: C.green },
            { emoji: "💷", title: "Dividends", desc: "Companies share profits with shareholders. Regular income from your investment.", color: C.blue }
          ]},
          { type: "callout", color: C.green, title: "The key rule", text: "Individual company stocks can fall to zero. A fund holding thousands of companies protects against this. Owning the market, not one company, is the principle." }
        ]
      },
      { type: "rich", emoji: "📜", tag: "Asset class 3", title: "Bonds (lending to governments and companies)", hook: "Bonds are how governments and large companies borrow money. You lend, they pay you back with interest.", iconBg: C.purpleLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "🔒", value: "Lower risk", label: "More stable", color: C.blue },
            { emoji: "💷", value: "3 to 6%", label: "Typical yield", color: C.purple },
            { emoji: "⚖️", value: "Balance", label: "Offsets stock risk", color: C.green },
          ]},
          { type: "compare", items: [
            { emoji: "🏛️", title: "Government bonds (gilts)", desc: "Very low risk. UK and US government bonds are among the safest investments. Lower returns.", color: C.blue },
            { emoji: "🏢", title: "Corporate bonds", desc: "Higher risk than government. Companies can default. Higher returns to compensate.", color: C.orange }
          ]},
          { type: "callout", color: C.purple, title: "Role in a portfolio", text: "Bonds provide stability. When stocks fall, bonds often hold or rise. As you approach needing the money, shifting toward bonds protects against a badly timed crash." }
        ]
      },
      { type: "rich", emoji: "🏠", tag: "Asset class 4", title: "Property as an investment", hook: "Property is the asset class most UK people instinctively understand. But it works differently as an investment versus a home.", iconBg: C.orangeLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "🏡", title: "Your home", desc: "Lifestyle asset. You need it to live in. Cannot easily access gains. Not a productive investment.", color: C.orange },
            { emoji: "🏢", title: "Rental property", desc: "Productive asset. Generates monthly income. May appreciate. But requires capital and management.", color: C.green }
          ]},
          { type: "reveal", items: [
            { emoji: "📊", title: "REITs: property without the property", text: "Real Estate Investment Trusts let you invest in property portfolios through the stock market. They trade like shares, are highly liquid, and pay out most income as dividends. Property exposure without the deposit or management burden.", color: C.blue },
          ]},
        ]
      },
      { type: "rich", emoji: "🪙", tag: "Asset classes 5 and 6", title: "Commodities, gold, and alternatives", hook: "These play a specific role in a portfolio. Mostly diversification and protection during downturns.", iconBg: C.blueLight,
        blocks: [
          { type: "grid", items: [
            { emoji: "🥇", title: "Gold", desc: "Store of value. Tends to hold up when stocks fall. A hedge, not a growth asset." },
            { emoji: "🛢️", title: "Oil and commodities", desc: "Physical goods. Prices fluctuate with supply and demand. Adds diversification." },
            { emoji: "🏗️", title: "Infrastructure", desc: "Roads, utilities, data centres. Steady income. Usually accessed via specialist funds." },
            { emoji: "🎨", title: "Collectibles", desc: "Art, wine, watches. Illiquid, subjective value. Not suitable for core portfolios." },
          ]},
          { type: "callout", color: C.blue, title: "For most people", text: "A globally diversified equity fund and perhaps some bonds is all most long-term investors need. Commodities and alternatives add complexity without necessarily improving outcomes." }
        ]
      }
    ]
  },
  {
    n: 16, phase: "Invest", xp: 25, time: 12, title: "Getting Started the Right Way", subtitle: "How to actually begin, step by step", emoji: "🚀", color: C.orange,
    hook: "Most people who want to invest never start because they are waiting until they fully understand it. This lesson is about starting correctly, right now, with what you have.",
    action: { headline: "Make your first investment today", sub: "Or set up a direct debit that will. The first step is the only one that matters right now.",
      steps: [
        { label: "Open a Stocks and Shares ISA if you have not already", desc: "Vanguard, Trading 212, or Freetrade. Takes about 10 minutes. Your investments must be inside this wrapper." },
        { label: "Choose a global equity index fund", desc: "Vanguard FTSE Global All Cap, Fidelity Index World, or a similar fund tracking the global stock market. More on why in the diversification lesson." },
        { label: "Set up a monthly direct debit into it", desc: "Even £25. The automation matters more than the amount. Set it to go out on payday." },
        { label: "Do not watch it daily", desc: "Check quarterly at most. Day-to-day fluctuations are normal and expected. Watching it constantly leads to bad decisions." }
      ],
      doneWhen: "A monthly direct debit is running into a Stocks and Shares ISA invested in a global equity index fund.",
      videos: [
        { title: "Rate of Return", duration: "2:20", desc: "What realistic investment returns look like and how to think about them." },
        { title: "Risk and Risk Tolerance", duration: "2:30", desc: "How to be honest about your risk tolerance and what it means for your investments." },
      ]
    },
    sections: [
      { type: "myth-fact", title: "Investing: Myth or Fact?",
        items: [
          { statement: "You need thousands of pounds to start investing.", answer: "myth", explain: "Many platforms let you start with as little as £1. The amount matters less than the habit. Starting small and being consistent beats waiting until you have a large lump sum." },
          { statement: "Keeping cash for 20+ years is actually riskier than investing.", answer: "fact", explain: "Inflation erodes cash purchasing power every year. Over 20 years, cash savings can lose 30 to 40% of their real value. Equities have historically beaten inflation over that timeframe." },
          { statement: "You should check your investments every day and react to changes.", answer: "myth", explain: "Daily checking leads to emotional decisions. The most successful long-term investors set up automatic contributions and check quarterly at most. Time in the market beats timing the market." },
          { statement: "Past performance of a fund reliably predicts its future returns.", answer: "myth", explain: "A fund that returned 20% last year has no greater probability of doing so again. Asset allocation and time horizon matter far more than chasing last year's winner." },
        ],
        summary: "Most people never start investing because of misconceptions. Now that you know the truth, the only question is when you begin."
      },
      { type: "rich", emoji: "📋", tag: "Your readiness check", title: "Make sure your foundation is solid before you invest", hook: "Investing before you have the basics sorted leads to selling at the worst time.", iconBg: C.blueLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🛡️", label: "Emergency fund in place?", sub: "Without this, an unexpected cost forces you to sell investments, possibly at a loss.", color: C.blue },
            { emoji: "💳", label: "High cost debt under control?", sub: "Debt at 20%+ APR costs more than almost any investment returns. Clear this first.", color: C.red },
            { emoji: "🏛️", label: "Employer pension match captured?", sub: "This is a guaranteed return. Claim it before any other investing.", color: C.purple },
            { emoji: "✅", label: "All three done? You are ready.", sub: "Surplus money you will not need immediately can now be put to work in investments matched to your timeline.", color: C.green },
          ]}
        ]
      },
      { type: "rich", emoji: "👤", tag: "Case study", title: "How Priya got started with her first investment", hook: "Priya is 27, earns £29,000, has an emergency fund, and no high cost debt. Here is exactly what she did and why it worked for her.", iconBg: C.greenLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "📦", label: "She opened a Stocks and Shares ISA", sub: "Chose a low cost platform (took about 10 minutes). All growth inside is tax free.", color: C.green },
            { emoji: "🌍", label: "She picked a global equity index fund", sub: "A single fund tracking thousands of companies worldwide. Simple and broadly diversified.", color: C.blue },
            { emoji: "📅", label: "She set up £50 per month on payday", sub: "Automated so it leaves before she sees it. She started small and plans to increase it over time.", color: C.purple },
            { emoji: "📵", label: "She checks it once a quarter, not daily", sub: "She knows fluctuations are normal. Checking constantly would lead to emotional decisions.", color: C.orange },
          ]},
          { type: "callout", color: C.green, title: "Why this works for Priya", text: "Her approach is low cost, broadly diversified, automated, and long term. She does not need to pick stocks, time the market, or monitor anything. Research shows this approach outperforms most professional fund managers over the long term." },
          { type: "para", muted: true, text: "This is one example, not a recommendation. Your situation, risk tolerance, and timeline may be different. The principles (low cost, diversified, automated, patient) apply broadly, but the specifics should reflect your own circumstances." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "Why this works", title: "Pound cost averaging removes the guesswork", hook: "Nobody can predict when markets will rise or fall. The good news is you do not need to.", iconBg: C.purpleLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "📉", title: "Market falls", desc: "Your fixed monthly amount buys MORE units. You are getting a discount.", color: C.green },
            { emoji: "📈", title: "Market rises", desc: "Your existing units are worth more. Your portfolio grows.", color: C.blue }
          ]},
          { type: "callout", color: C.purple, title: "The only strategy that consistently works", text: "Regular contributions into a diversified fund, started as early as possible, held for as long as possible. Everything else is complexity that the evidence does not support." }
        ]
      },
      { type: "rich", emoji: "🚫", tag: "The traps to avoid", title: "Common mistakes that cost beginners money", hook: "These mistakes are understandable and largely avoidable.", iconBg: C.redLight,
        blocks: [
          { type: "grid", items: [
            { emoji: "📦", title: "Investing outside a tax wrapper", desc: "Almost never a reason to hold investments outside an ISA when you have allowance remaining." },
            { emoji: "📊", title: "Chasing last year's winners", desc: "Platforms highlight recent top performers to attract money, not because it is good advice." },
            { emoji: "⏰", title: "Mismatching risk and timeline", desc: "Risky assets for short term goals is dangerous. Match your investment type to when you need the money." },
            { emoji: "📱", title: "Following social media tips", desc: "Individual stock picking is something even professionals fail at. For beginners, it is speculation." },
          ]},
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Common mistakes", title: "Which of these is a beginner investing mistake?",
        question: "Which of these is the most common mistake new investors make?",
        options: [
          { text: "Selling investments when the market falls significantly", correct: true, feedback: "Selling when markets fall is how investors turn a temporary paper loss into a permanent real one. Every major market crash in history has eventually recovered. The investors who stayed invested recovered with it. Those who sold locked in their losses." },
          { text: "Investing a fixed amount every month", correct: false, feedback: "Regular monthly investing (pound-cost averaging) is actually one of the most effective and consistent strategies. It removes the pressure of timing decisions and builds a long-term habit." },
          { text: "Choosing a global index fund", correct: false, feedback: "A global index fund is typically the recommended starting point for most investors. It provides instant diversification across thousands of companies at very low cost." },
          { text: "Leaving investments alone for long periods", correct: false, feedback: "Leaving investments alone is actually ideal for most investors. Frequent buying and selling generates costs and tax and typically leads to worse outcomes than simply staying invested in a good fund." }
        ]
      },
      { type: "rich", emoji: "⚠️", tag: "Things to avoid", title: "The traps that catch most beginners", hook: "These mistakes are common, understandable, and largely avoidable with a little awareness.", iconBg: C.redLight,
        blocks: [
          { type: "para", text: "Investing outside a tax wrapper. There is almost never a reason to hold investments outside an ISA or pension when you have allowance remaining. Doing so is paying Capital Gains Tax you do not need to pay." },
          { type: "para", text: "Choosing investments based on recent performance. Last year's best performer is often not next year's. Funds and platforms highlight recent winners because it attracts investment, not because it is good advice." },
          { type: "para", text: "Mismatching risk and timeline. Higher risk investments like equities need a longer horizon. If you need the money within a couple of years, lower risk options are more appropriate." },
          { type: "callout", color: C.red, title: "The most dangerous trap", text: "Following tips, hot stocks, or social media recommendations. Individual stock picking is something even professional fund managers fail to do better than the market index over time. For beginners, it is speculation, not investing." }
        ]
      }
    ]
  },
  {
    n: 17, phase: "Invest", xp: 20, time: 10, title: "Diversification Made Simple", subtitle: "Why spreading your money is the most important rule in investing", emoji: "🌐", color: C.purple,
    hook: "Putting all your money in one investment is not brave. It is unnecessarily risky when you do not have to be.",
    action: { headline: "Check that your investments are genuinely diversified", sub: "If you already have a global index fund, you are probably in good shape. Let's confirm.",
      steps: [
        { label: "Find out what your ISA or pension is actually invested in", desc: "Is it one company? One country? Or a fund tracking thousands of companies globally?" },
        { label: "If it is in a single stock or narrow fund, plan to switch", desc: "Moving to a global index fund inside an ISA is free and does not trigger Capital Gains Tax." },
        { label: "Check that your investments span multiple asset classes if appropriate", desc: "If you are within 10 years of needing the money, consider whether some bonds or cash make sense alongside equities." }
      ],
      doneWhen: "Your investments are spread across many companies and regions rather than concentrated in one place.",
      videos: [
        { title: "Diversification", duration: "2:30", desc: "The core principle of spreading risk and why it matters so much." },
        { title: "Risk and Risk Tolerance", duration: "2:30", desc: "How to think honestly about what level of risk is right for you." },
      ]
    },
    sections: [
      { type: "rich", emoji: "🥚", tag: "The core principle", title: "Do not put all your eggs in one basket", hook: "Diversification is the only free lunch in investing. Spreading your money reduces risk without necessarily reducing expected returns.", iconBg: C.purpleLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "💥", title: "1 company, all in", desc: "If that company fails, you lose everything. Even great companies can collapse.", color: C.red },
            { emoji: "🌍", title: "1,000+ companies, global", desc: "If one company fails, you barely notice. The rest carry on growing.", color: C.green }
          ]},
          { type: "stat", items: [
            { emoji: "🇬🇧", value: "~4%", label: "UK share of global market", color: C.blue },
            { emoji: "🌍", value: "~96%", label: "Rest of the world", color: C.green },
          ]},
          { type: "callout", color: C.purple, title: "Think globally", text: "Investing only in UK stocks means missing 96% of the world's companies and growth. A global fund gives you access to all of it automatically." }
        ]
      },
      { type: "rich", emoji: "⚠️", tag: "Why picking stocks is risky", title: "Even the professionals get it wrong", hook: "The evidence on individual stock picking is clear and consistent.", iconBg: C.redLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "📊", value: "80%+", label: "Of fund managers underperform the index over 15 years", color: C.red },
          ]},
          { type: "para", text: "If professional fund managers with entire research teams cannot consistently beat the market, picking winners yourself is unlikely to work out." },
          { type: "callout", color: C.red, title: "The maths of loss", text: "If an investment falls 50%, you need a 100% gain just to get back to where you started. Diversification protects against catastrophic single position losses." }
        ]
      },
      { type: "rich", emoji: "📊", tag: "The tool", title: "ETFs: own thousands of companies for pennies", hook: "ETFs solved the diversification problem. They track an index and can be bought like a single share.", iconBg: C.greenLight,
        blocks: [
          { type: "grid", items: [
            { emoji: "📦", title: "What is an ETF?", desc: "A basket of investments that trades on the stock market. One purchase, hundreds of companies." },
            { emoji: "🤖", title: "Index tracking", desc: "Follows a market index automatically. No active management needed. Very low cost." },
            { emoji: "💷", title: "Low fees", desc: "Typically 0.1 to 0.3% per year. Active funds charge 1%+. Over decades, this difference is enormous." },
            { emoji: "🌍", title: "Instant diversification", desc: "A global ETF gives you thousands of companies across dozens of countries in one purchase." },
          ]},
        ]
      },
      { type: "rich", emoji: "🛰️", tag: "Core and satellite", title: "Most of your portfolio should be broad. A small portion can explore.", hook: "The core and satellite approach balances stability with curiosity.", iconBg: C.purpleLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "🌍", value: "80 to 90%", label: "Core: broad global fund", color: C.green },
            { emoji: "🛰️", value: "10 to 20%", label: "Satellite: specific interests", color: C.purple },
          ]},
          { type: "reveal", items: [
            { emoji: "🌍", title: "Core (the foundation)", text: "A broad, globally diversified index fund. Stable, low cost, and requires no ongoing decisions. This is where most of your money should sit.", color: C.green },
            { emoji: "🛰️", title: "Satellite (the exploration)", text: "Specific sector ETFs (tech, healthcare), single country funds, or thematic investments. More concentrated risk but can reflect your views. Only with money you can afford to be wrong about.", color: C.purple },
            { emoji: "🎰", title: "Speculative (if at all)", text: "Individual stocks, crypto, niche themes. These sit outside the satellite in a separate mental bucket. Never risk money you need here.", color: C.red },
          ]},
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Diversification check", title: "Which portfolio is best diversified?",
        question: "Which investment choice is best diversified?",
        options: [
          { text: "A global equity index fund covering 6,000+ companies across 40+ countries", correct: true, feedback: "This is genuine diversification. No single company or country can significantly damage your returns. Even if dozens of companies fail, the overall fund continues to reflect the health of global markets." },
          { text: "Shares in five different UK companies you know well", correct: false, feedback: "Five companies in one country is very concentrated. Each company represents 20% of your portfolio. If one fails or struggles, the impact is enormous. Being limited to the UK also means missing 96% of global market growth." },
          { text: "100% in UK government bonds", correct: false, feedback: "This is concentrated in one asset class and one country. Bonds are low risk relative to stocks but provide lower long-term returns. A portfolio of only UK bonds is not diversified across asset classes." },
          { text: "Equal amounts in three popular individual stocks", correct: false, feedback: "Three stocks, however well-known, is extreme concentration. Each represents 33% of your portfolio. Individual stocks carry company-specific risk. Even large, well-known companies can fall dramatically." }
        ]
      },
      { type: "rich", emoji: "🏗️", tag: "Building a portfolio", title: "How risk and time horizon shape your mix", hook: "The right portfolio depends on when you need the money and how much volatility you can stomach.", iconBg: C.greenLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "⏳", label: "20+ years to go", sub: "Higher equity allocation is common. You have time to recover from short term drops. Growth is the priority.", color: C.green },
            { emoji: "📊", label: "10 to 20 years", sub: "A mix of equities and some bonds. Still growth focused but with more stability built in.", color: C.blue },
            { emoji: "🔒", label: "Under 10 years", sub: "More bonds and cash alongside equities. Protecting what you have becomes more important than maximum growth.", color: C.purple },
            { emoji: "💵", label: "Under 5 years", sub: "Mostly cash or very short term bonds. Cannot afford a market crash right before you need the money.", color: C.orange },
          ]},
          { type: "callout", color: C.green, title: "The principle", text: "Start simple. A broad, low cost, globally diversified fund is a strong foundation for any time horizon. As you get closer to needing the money, gradually shift toward stability. Complexity does not equal sophistication." }
        ]
      }
    ]
  },
  {
    n: 18, phase: "Invest", xp: 20, time: 12, title: "Property, Gold and Crypto", subtitle: "Understanding alternative investments honestly", emoji: "🏠", color: C.orange,
    hook: "These three assets generate enormous interest and strong opinions. Here is an honest, clear-eyed look at what each one actually offers and what the risks really are.",
    action: { headline: "Be clear about your reasons before investing in any of these", sub: "Each of these can have a role, but only with clear reasoning and appropriate sizing.",
      steps: [
        { label: "If considering property investment, ensure you have a large enough deposit", desc: "Buy-to-let typically requires 25% deposit minimum. Factor in stamp duty, maintenance, void periods, and management costs before calculating returns." },
        { label: "If considering gold, keep it to a small percentage of your portfolio", desc: "Gold is a hedge, not a growth asset. Most financial advisers suggest no more than 5 to 10% of a portfolio in gold." },
        { label: "If considering crypto, only invest what you could lose entirely", desc: "Crypto is speculative. Do not invest money needed for anything important. Understand you may lose all of it." },
        { label: "Ensure your core portfolio (global equity fund in ISA) is established first", desc: "These assets are for after you have the foundation sorted, not before." }
      ],
      doneWhen: "You understand the real characteristics of each of these assets and have decided your approach with clear reasoning.",
      videos: [
        { title: "Risk and Risk Tolerance", duration: "2:30", desc: "How to think about speculative vs core investments in your overall portfolio." },
      ]
    },
    sections: [
      { type: "rich", emoji: "🏠", tag: "Property investment", title: "Buy to let: a business, not just an asset", hook: "Property investment can work well. But it is far more complex, expensive, and work intensive than most people realise.", iconBg: C.orangeLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "📈", title: "The upside", desc: "Rental income every month. Property may appreciate over time. Tangible asset you can see and control.", color: C.green },
            { emoji: "⚠️", title: "The reality", desc: "25% deposit minimum. Higher mortgage rates. Maintenance, void periods, letting fees, stamp duty surcharge.", color: C.red }
          ]},
          { type: "reveal", items: [
            { emoji: "💷", title: "Costs most people forget", text: "Mortgage interest, maintenance (typically 1% of property value per year), insurance, letting agent fees (10 to 15% of rent), stamp duty surcharge for additional properties, and income tax on rental profits. When all factored in, many buy to lets deliver far lower returns than owners expect.", color: C.orange },
            { emoji: "📊", title: "REITs: property without the hassle", text: "Real Estate Investment Trusts let you invest in property portfolios through the stock market. They trade like shares, are liquid, and pay dividends. Property exposure without the deposit, management, or concentration risk.", color: C.blue },
          ]},
        ]
      },
      { type: "rich", emoji: "🪙", tag: "Gold", title: "A store of value, not a growth engine", hook: "Gold has stored value reliably for thousands of years. But in a modern portfolio it plays a specific, limited role.", iconBg: C.blueLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "💰", value: "No income", label: "No dividends or interest", color: C.orange },
            { emoji: "🛡️", value: "Hedge", label: "Holds value in crises", color: C.green },
            { emoji: "📊", value: "~Inflation", label: "Long term return", color: C.blue },
          ]},
          { type: "grid", items: [
            { emoji: "✅", title: "Good for", desc: "Crisis protection. When stocks crash, gold often holds or rises. A stabiliser." },
            { emoji: "⚠️", title: "Not good for", desc: "Growth. Over decades, equities have significantly outperformed gold." },
            { emoji: "🏦", title: "Physical gold", desc: "Coins and bars. Requires storage and insurance. Most hassle." },
            { emoji: "📦", title: "Gold ETFs", desc: "Track the gold price. Simpler, cheaper, more liquid. Preferred by most investors." },
          ]},
          { type: "callout", color: C.blue, title: "Sizing", text: "Most financial guidance suggests no more than 5 to 10% of a portfolio in gold. It is a hedge, not a core holding." }
        ]
      },
      { type: "rich", emoji: "₿", tag: "Cryptocurrency", title: "Speculative by nature. Understand this clearly.", hook: "Crypto is not an investment like stocks or bonds. It is speculation on what someone else will pay for it in the future.", iconBg: C.redLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "📈", value: "Can 10x", label: "Upside potential", color: C.green },
            { emoji: "📉", value: "Can drop 90%", label: "Has happened multiple times", color: C.red },
            { emoji: "🔓", value: "Unregulated", label: "No FSCS protection", color: C.orange },
          ]},
          { type: "grid", items: [
            { emoji: "⚡", title: "24/7 markets", desc: "Never closes. Prices move constantly. Can be emotionally exhausting." },
            { emoji: "🔒", title: "No safety net", desc: "If an exchange collapses, your money may be gone. No government protection." },
            { emoji: "🎭", title: "Driven by sentiment", desc: "Not backed by earnings or assets. Price is purely what people will pay." },
            { emoji: "⚠️", title: "Scam risk", desc: "Scams, hacks, and rug pulls are common. Many people have lost significant sums." },
          ]},
          { type: "callout", color: C.red, icon: "⚠️", title: "The rule", text: "If you choose to invest in crypto, treat it as a speculative position. Never put in more than you could afford to lose entirely. It should come only after your core portfolio is established and your financial foundations are solid." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Which fits where?", title: "Match the asset to its role",
        question: "You have a solid emergency fund, no high-cost debt, and a global equity ISA running. You have £500 spare. Which approach best fits adding a new asset class?",
        options: [
          { text: "Add £500 to your existing global equity ISA", correct: true, feedback: "For most investors, adding to an existing diversified global equity fund is the best use of additional capital. Complexity and diversification across multiple speculative assets rarely improves outcomes." },
          { text: "Put the £500 into one cryptocurrency that looks promising", correct: false, feedback: "£500 into one crypto asset is a highly concentrated speculative bet. Even if you have done research, individual cryptocurrencies can fall to near-zero. If you want crypto exposure, keep it small and expect you may lose it all." },
          { text: "Split it equally between gold, crypto, and a single stock", correct: false, feedback: "This creates a complex mix of speculative assets without a clear rationale. Three positions of £167 each across very different speculative assets is not a portfolio strategy. It is scattered bets." },
          { text: "Keep it in cash until the 'right time' to invest", correct: false, feedback: "There is no reliable way to know the right time. While you wait in cash, your money loses purchasing power to inflation. Regular investment into a diversified fund consistently outperforms attempts to time the market." }
        ]
      }
    ]
  }
]


/* ═══════════════════════════════════════════════════════════════════════
   ISLAMIC FINANCE MODULE
   ═══════════════════════════════════════════════════════════════════════ */
const ISLAMIC_LESSONS = [
  {
    n: 19, phase: "Islamic Finance", xp: 20, time: 12, title: "Islamic Finance: The Core Principles", subtitle: "What is allowed, what is not, and why", emoji: "☪️", color: C.purple,
    hook: "Islamic finance is not just about avoiding interest. It is a complete framework for handling money ethically, with risk shared fairly between parties.",
    action: { headline: "Understand where Islamic finance principles apply in your own life", sub: "After this lesson, you will know which everyday financial products and decisions need an Islamic finance alternative.",
      steps: [
        { label: "List the financial products you currently use", desc: "Bank account, mortgage, loans, insurance, pension, investments. Which ones might conflict with Islamic finance principles?" },
        { label: "Identify any that involve interest (riba)", desc: "Conventional loans, credit cards, and most mortgages all involve interest. Note which apply to you." },
        { label: "Note which investments you hold, if any", desc: "Are they in sectors forbidden under Islamic finance, such as alcohol, gambling, or conventional financial services?" }
      ],
      doneWhen: "You understand which of your financial products may need an Islamic finance alternative and why.",
      videos: [
        { title: "Banking Basics", duration: "2:15", desc: "How banking works and where Islamic alternatives fit in." }
      ]
    },
    sections: [
      { type: "insight", bigStat: "$3.4 trillion", statLabel: "Global Islamic finance industry size", color: C.purple, color2: C.green,
        title: "A complete financial system built on fairness",
        body: "Islamic finance is not a workaround or a niche product. It is a fully developed financial system used by hundreds of millions of people worldwide. The principles are simple: money should be channelled into real, productive activity. Risk and reward should be shared fairly. Nobody should be exploited.",
        punchline: "Everything in this course applies to you. These lessons show you how to access the same tools through Sharia-compliant structures."
      },
      { type: "rich", emoji: "📖", tag: "The foundation", title: "Where Islamic finance principles come from", hook: "Islamic finance applies Sharia law to financial transactions. The core aim is fairness, shared risk, and avoiding exploitation.", iconBg: C.purpleLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "💰", title: "Conventional finance", desc: "Money earns money. Lenders get guaranteed returns regardless of outcome. Risk sits with the borrower.", color: C.red },
            { emoji: "🤝", title: "Islamic finance", desc: "Money has no intrinsic value. Returns must come from real, productive activity. Risk and reward are shared.", color: C.green }
          ]},
          { type: "callout", color: C.purple, title: "Not just rules, a philosophy", text: "Islamic finance channels money into real, productive activity and ensures the financial system does not exploit those who need it." }
        ]
      },
      { type: "rich", emoji: "🚫", tag: "What is not allowed", title: "The four key prohibitions", hook: "Four things are forbidden. Understanding them makes the alternatives much easier to grasp.", iconBg: C.redLight,
        blocks: [
          { type: "grid", items: [
            { emoji: "🚫", title: "Riba (interest)", desc: "Any guaranteed return on money lent or borrowed. Covers conventional loans, mortgages, and credit cards." },
            { emoji: "🎰", title: "Gharar (uncertainty)", desc: "Contracts with significant ambiguity or unknown outcomes. Terms must be clear to both parties." },
            { emoji: "🎲", title: "Maysir (gambling)", desc: "Transactions based purely on chance with no underlying productive activity." },
            { emoji: "⚠️", title: "Haram industries", desc: "Investing in alcohol, pork, gambling, conventional banks, weapons, or tobacco." },
          ]}
        ]
      },
      { type: "rich", emoji: "✅", tag: "What is encouraged", title: "The principles that guide Islamic finance", hook: "Islamic finance actively encourages certain types of financial arrangements.", iconBg: C.greenLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🤝", label: "Risk sharing", sub: "Both parties share in the success or failure of the underlying activity. No guaranteed returns for one side.", color: C.green },
            { emoji: "🏗️", label: "Real asset backing", sub: "Transactions linked to real goods, services, or assets. Not pure financial speculation.", color: C.blue },
            { emoji: "🔍", label: "Fairness and transparency", sub: "Both parties clearly understand the terms. Neither is exploited.", color: C.purple },
          ]},
          { type: "callout", color: C.green, title: "The result", text: "These principles push money toward productive investment in real businesses and assets, and away from purely speculative or exploitative financial activity." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Check this", title: "Which of these conflicts with Islamic finance principles?",
        question: "Which of the following would be considered impermissible under Islamic finance?",
        options: [
          { text: "Taking a conventional mortgage at a fixed interest rate", correct: true, feedback: "A conventional mortgage involves riba (interest). The bank guarantees itself a return regardless of property outcome. Islamic alternatives like Musharakah Mutanaqisah share ownership, avoiding fixed interest." },
          { text: "Investing in a company that manufactures medical equipment", correct: false, feedback: "Medical equipment is a permissible industry. The company is engaged in real, productive activity in a halal sector." },
          { text: "Starting a business and sharing profits with an investor", correct: false, feedback: "Profit sharing (Musharakah or Mudarabah) is explicitly encouraged. Both parties share risk and reward, exactly the model Islamic finance promotes." },
          { text: "Saving money in a current account", correct: false, feedback: "Holding money in a current account is generally permissible. The issue arises only when the account pays interest. Many Islamic banks offer current accounts without interest." }
        ]
      },
      { type: "rich", emoji: "🌍", tag: "You can do this", title: "Islamic finance and everyday life are compatible", hook: "You do not need to choose between your faith and building financial security. The tools exist and people use them every day.", iconBg: C.greenLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "🏦", value: "Available", label: "Islamic bank accounts", color: C.blue },
            { emoji: "🏠", value: "Available", label: "Islamic mortgages", color: C.green },
            { emoji: "📈", value: "Available", label: "Halal ISA funds", color: C.purple },
          ]},
          { type: "callout", color: C.green, title: "The key takeaway", text: "Everything in this course applies to you. Budgeting, emergency funds, net worth tracking, investing. The next two lessons show how to access the same tools through Sharia-compliant structures. You do not need to compromise on either your faith or your financial future." }
        ]
      }
    ]
  },
  {
    n: 20, phase: "Islamic Finance", xp: 20, time: 12, title: "Islamic Alternatives to Borrowing and Insurance", subtitle: "Mortgages, loans, and takaful explained", emoji: "🏠", color: C.blue,
    hook: "There are Islamic alternatives to almost every common financial product. Understanding how they work makes them easier to choose and evaluate.",
    action: { headline: "Identify which Islamic finance products apply to your situation", sub: "Not everyone needs all of these. Focus on the ones relevant to your current life.",
      steps: [
        { label: "If you are considering a mortgage, research Islamic mortgage providers", desc: "Al Rayan Bank, Gatehouse Bank, and HSBC Amanah all offer Sharia-compliant home finance in the UK." },
        { label: "If you have or need insurance, look into takaful providers", desc: "Takaful is the Islamic alternative to conventional insurance, based on mutual contribution and shared risk." },
        { label: "If you carry credit card debt, explore Sharia-compliant alternatives", desc: "Some Islamic banks offer charge cards or deferred payment cards that do not charge interest." }
      ],
      doneWhen: "You know the Islamic finance alternative to any conventional product you currently use or are considering.",
      videos: [
        { title: "Banking Basics", duration: "2:15", desc: "How banking works and where Islamic alternatives fit in." }
      ]
    },
    sections: [
      { type: "rich", emoji: "🏠", tag: "Islamic mortgages", title: "Buying a home without paying interest", hook: "Two main Islamic mortgage structures exist in the UK. Both allow homeownership without riba.", iconBg: C.blueLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "🤝", title: "Diminishing Partnership", desc: "Bank and buyer jointly purchase the property. Buyer pays rent for the bank's share and gradually buys it out. As ownership shifts, rent reduces.", color: C.blue },
            { emoji: "🔑", title: "Ijara (Lease to Own)", desc: "Bank buys the property and leases it to you. Monthly payments are rent. At the end of the agreed period, ownership transfers to you.", color: C.green }
          ]},
          { type: "callout", color: C.blue, title: "Key difference from conventional", text: "In a conventional mortgage, the bank lends money and charges interest. In Islamic home finance, the bank co-owns the asset. The return comes from rent or the asset transaction, not interest on money." }
        ]
      },
      { type: "rich", emoji: "💳", tag: "Islamic banking", title: "Current accounts, savings, and personal finance", hook: "Islamic banks offer most of the same services, structured to avoid interest on both sides.", iconBg: C.greenLight,
        blocks: [
          { type: "reveal", items: [
            { emoji: "🏦", title: "Current accounts", text: "Typically do not pay or charge interest. May be structured on a Qard basis (benevolent loan with no return) or Amanah (trust), where the bank holds your money as a trustee.", color: C.blue },
            { emoji: "💰", title: "Savings accounts", text: "Instead of fixed interest, the bank invests deposits in Sharia-compliant activities and shares the resulting profit with depositors. The rate varies based on actual returns.", color: C.green },
            { emoji: "🛒", title: "Personal finance (replacing loans)", text: "Uses Murabahah: the bank buys an asset you need and sells it to you at a higher price with deferred payment. The profit margin is agreed upfront, not charged as interest on outstanding balance.", color: C.purple },
          ]}
        ]
      },
      { type: "rich", emoji: "🛡️", tag: "Takaful", title: "Islamic insurance: mutual protection", hook: "Conventional insurance involves elements that conflict with Islamic principles. Takaful is the cooperative alternative.", iconBg: C.purpleLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "🏢", title: "Conventional insurance", desc: "You pay a premium with uncertain outcome (gharar). The insurer profits from pooled premiums. Risk is transferred.", color: C.red },
            { emoji: "🤝", title: "Takaful", desc: "Participants contribute to a shared pool. Claims are paid from the pool. Any surplus belongs to participants. The operator takes a management fee only.", color: C.green }
          ]},
          { type: "chips", items: [
            { label: "Life (family takaful)", color: C.green },
            { label: "Health", color: C.blue },
            { label: "Motor", color: C.purple },
            { label: "Home", color: C.orange },
          ]},
          { type: "para", muted: true, text: "Availability in the UK is growing. Check providers like Salama and Noor Takaful. Some conventional insurers also offer takaful windows." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Check this", title: "How does Musharakah Mutanaqisah work?",
        question: "Under the Musharakah Mutanaqisah home finance structure, how does the bank make its return?",
        options: [
          { text: "By charging rent on the portion of the property it still owns", correct: true, feedback: "The bank co-owns the property and charges rent on its share. As the customer buys out the bank's share over time, the rent reduces. The return comes from rent and the asset transaction, not from interest." },
          { text: "By charging interest on the outstanding loan balance each month", correct: false, feedback: "Charging interest is riba, which is prohibited. Musharakah Mutanaqisah does not involve a loan at all." },
          { text: "By taking a percentage of any increase in the property's value", correct: false, feedback: "The bank's return is the rent paid for its ownership share, which decreases as the customer buys out that share. Not capital gains." },
          { text: "By charging a flat administration fee at the start", correct: false, feedback: "A flat fee alone would not reflect the ongoing nature of the arrangement. The structure involves ongoing rent payments that reduce as ownership transfers." }
        ]
      }
    ]
  },
  {
    n: 21, phase: "Islamic Finance", xp: 20, time: 12, title: "Investing the Islamic Way", subtitle: "Halal investing and Sharia-compliant portfolios", emoji: "📈", color: C.green,
    hook: "Investing is encouraged in Islam. The key is ensuring your investments involve real, productive activity in permissible industries and avoid riba, gharar, and haram sectors.",
    prereq: "Complete the investing module (lessons 14 to 18) before this one for the full context.",
    action: { headline: "Review your investments for Sharia compliance", sub: "If you already invest, check what you hold. If starting out, this helps you choose correctly.",
      steps: [
        { label: "If you invest in funds, check whether they are Sharia-screened", desc: "Look for funds described as Sharia-compliant or halal. They will have Sharia board oversight." },
        { label: "Check for haram sector exclusions", desc: "Alcohol, pork, gambling, conventional banking, weapons, tobacco. A halal fund excludes these automatically." },
        { label: "Check your pension fund choice", desc: "Most workplace pensions offer a Sharia-compliant fund option. Log into your pension portal and look for it." },
        { label: "Consider a Sharia-compliant ISA", desc: "Some ISA providers offer Sharia-screened equity funds within a Stocks and Shares ISA." }
      ],
      doneWhen: "Your investments are in Sharia-compliant funds, or you have a clear plan to move them.",
      videos: [
        { title: "Risk and Risk Tolerance", duration: "2:30", desc: "How risk works in investing and what to realistically expect." },
        { title: "Diversification", duration: "2:30", desc: "Why spreading your investments matters." }
      ]
    },
    sections: [
      { type: "rich", emoji: "✅", tag: "Investing is permitted", title: "Islam encourages productive investment", hook: "Islam encourages investment in real businesses and assets. The key is what you invest in and how.", iconBg: C.greenLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "✅", title: "Investing (halal)", desc: "Putting money into real productive activity with genuine risk and reward shared between parties.", color: C.green },
            { emoji: "🎲", title: "Gambling (haram)", desc: "Pure chance with no underlying value creation. No real asset, no productive activity.", color: C.red }
          ]},
          { type: "callout", color: C.green, title: "The core test", text: "Is the underlying activity real, productive, and halal? If yes, the investment is generally permissible." }
        ]
      },
      { type: "rich", emoji: "🔍", tag: "How it works", title: "Islamic ETFs: screened and ready to go", hook: "You do not need to research individual companies. Sharia-screened funds do all of that for you.", iconBg: C.blueLight,
        blocks: [
          { type: "para", text: "A Sharia-screened ETF applies automatic screening to exclude companies involved in impermissible activities. You get instant diversification across hundreds of screened companies." },
          { type: "grid", items: [
            { emoji: "🚫", title: "Screened out", desc: "Alcohol, pork, gambling, conventional banks, weapons, tobacco, adult entertainment" },
            { emoji: "📊", title: "Also screened", desc: "Companies where too much revenue or debt involves interest" },
            { emoji: "✅", title: "What remains", desc: "Hundreds of halal companies across tech, healthcare, consumer goods, energy, and more" },
            { emoji: "🏛️", title: "Oversight", desc: "A Sharia supervisory board handles all compliance decisions for you" },
          ]},
          { type: "reveal", items: [
            { emoji: "🌍", title: "iShares MSCI World Islamic UCITS ETF", text: "Tracks global equities, Sharia-screened, available on most UK platforms. A solid starting point for most investors.", color: C.blue },
            { emoji: "🏦", title: "HSBC Islamic Global Equity Index Fund", text: "Similar global screened exposure. Available through many pension providers and ISA platforms.", color: C.green },
            { emoji: "📋", title: "Franklin Global Sukuk Fund", text: "For those wanting Islamic bond exposure alongside equities. Lower volatility than pure equity funds.", color: C.purple },
          ]},
          { type: "para", muted: true, text: "These are examples, not recommendations. Always verify the Sharia board approval and fees before investing." }
        ]
      },
      { type: "rich", emoji: "🏛️", tag: "Pensions", title: "Making your workplace pension Sharia-compliant", hook: "Most large providers now offer at least one Sharia-compliant fund. You probably have access already.", iconBg: C.purpleLight,
        blocks: [
          { type: "steps", items: [
            { emoji: "🔑", label: "Log into your pension portal", sub: "Go to the fund selection area in your workplace pension provider.", color: C.blue },
            { emoji: "🔍", label: "Search for Sharia, Islamic, or halal", sub: "Aviva, Nest, Legal and General, and Scottish Widows all offer at least one option.", color: C.purple },
            { emoji: "🔄", label: "Switch your fund", sub: "Future contributions and your existing pot move to the screened fund. Takes a few minutes.", color: C.green },
          ]},
          { type: "callout", color: C.purple, title: "What to expect", text: "Sharia-screened funds tend to have higher exposure to technology and healthcare and lower exposure to financial services. They have performed competitively with conventional funds in recent years." }
        ]
      },
      { type: "rich", emoji: "📦", tag: "ISAs and Sharia", title: "The ISA wrapper works perfectly with halal investing", hook: "A Sharia-screened fund inside an ISA is probably the best place to start.", iconBg: C.greenLight,
        blocks: [
          { type: "stat", items: [
            { emoji: "✅", value: "Halal", label: "Screened investments", color: C.green },
            { emoji: "🛡️", value: "Tax free", label: "ISA wrapper", color: C.blue },
            { emoji: "🌍", value: "Diversified", label: "Hundreds of companies", color: C.purple },
          ]},
          { type: "para", text: "The ISA structure is generally considered permissible by Islamic scholars because it does not involve interest or prohibited activity. It is simply a tax-efficient wrapper." },
          { type: "callout", color: C.green, title: "Where to look", text: "Search for the fund names above on platforms such as AJ Bell, Hargreaves Lansdown, or InvestEngine. Use a Stocks and Shares ISA wrapper. Always verify current Sharia board certification." }
        ]
      },
      { type: "rich", emoji: "🔑", tag: "Sukuk", title: "Islamic bonds: an alternative to conventional bonds", hook: "For income or lower volatility alongside equities, sukuk are the Sharia-compliant alternative.", iconBg: C.blueLight,
        blocks: [
          { type: "compare", items: [
            { emoji: "❌", title: "Conventional bonds", desc: "Lending money at interest (riba). You are a creditor. Guaranteed fixed return regardless of outcome.", color: C.red },
            { emoji: "✅", title: "Sukuk", desc: "Ownership of an underlying asset (infrastructure, property). Your return comes from the income that asset generates.", color: C.green }
          ]},
          { type: "callout", color: C.blue, title: "Access via funds", text: "Individual sukuk are for large institutional investors. Most people access sukuk through Islamic bond funds on halal platforms. They can be held inside an ISA." }
        ]
      },
      { type: "quiz", emoji: "🧠", tag: "Check this", title: "What makes an investment Sharia-compliant?",
        question: "You want to invest in a global equity fund. Which of the following would make it Sharia-compliant?",
        options: [
          { text: "It excludes companies involved in alcohol, gambling, and conventional banks, and has Sharia board oversight", correct: true, feedback: "This covers the two key requirements: sector screening (excluding haram industries) and Sharia board oversight (ensuring methodology is correctly applied and certified). Both are necessary." },
          { text: "It invests in companies based in Muslim-majority countries", correct: false, feedback: "Geographic location is irrelevant. A company in a Muslim-majority country can still operate in prohibited industries. Screening is based on what the company does, not where it is." },
          { text: "It has low fees", correct: false, feedback: "Low fees are desirable but do not determine Sharia compliance. A fund can have very low fees and still invest in alcohol, gambling, or interest-bearing financial services." },
          { text: "It does not invest in technology companies", correct: false, feedback: "Technology companies are generally permissible. Many Sharia-compliant funds are significantly invested in companies like Apple and Microsoft." }
        ]
      }
    ]
  }
]

const LESSONS = [...LESSONS_FOUNDATIONS, ...PHASE2_LESSONS, ...PHASE3_LESSONS, ...PHASE4_LESSONS, ...ISLAMIC_LESSONS]

const LESSON_HINTS = {
  1:  "The number that actually shows how you're doing",
  2:  "The simple pattern wealthy people follow",
  3:  "Build a budget system that finally sticks",
  4:  "Understand every line of your payslip",
  5:  "How interest works and why it traps people",
  6:  "A clear plan to wipe out bad debt",
  7:  "The fund that stops a setback becoming a spiral",
  8:  "Save with purpose for every future goal",
  9:  "How tax actually works and how to pay less",
  10: "The tax-free wrapper everyone should use",
  11: "Set financial goals that actually happen",
  12: "The free money your employer is offering",
  13: "A private pension you fully own and control",
  14: "What investing actually means in practice",
  15: "The main asset classes explained simply",
  16: "How to start investing the right way",
  17: "Spread your money to reduce risk",
  18: "Property, gold and crypto, the honest take",
  19: "What Sharia compliant finance really means",
  20: "Islamic mortgages, loans and insurance explained",
  21: "How to invest the halal way",
}
/* ═══════════════════════════════════════════════════════════════════════
   LESSON LIST
   ═══════════════════════════════════════════════════════════════════════ */

/* Tile gradient backgrounds by phase */
const TILE_BG = {
  Foundations: ["linear-gradient(135deg, #0A1F1A, #0F2D25)", "linear-gradient(135deg, #150D28, #1E1040)", "linear-gradient(135deg, #0C1830, #102445)", "linear-gradient(135deg, #1A1508, #251C0A)"],
  Stabilise: ["linear-gradient(135deg, #1C0A0A, #2D1010)", "linear-gradient(135deg, #0C1830, #102445)", "linear-gradient(135deg, #150D28, #201242)", "linear-gradient(135deg, #1A1508, #251C0A)"],
  Optimise: ["linear-gradient(135deg, #150D28, #1E1040)", "linear-gradient(135deg, #0A1F1A, #0F2D25)", "linear-gradient(135deg, #0C1830, #102445)", "linear-gradient(135deg, #1A1508, #251C0A)", "linear-gradient(135deg, #150D28, #201242)"],
  Invest: ["linear-gradient(135deg, #0A1F1A, #0F2D25)", "linear-gradient(135deg, #0C1830, #102445)", "linear-gradient(135deg, #1A1508, #251C0A)", "linear-gradient(135deg, #150D28, #201242)", "linear-gradient(135deg, #1C0A0A, #2D1010)"],
  "Islamic Finance": ["linear-gradient(135deg, #150D28, #1E1040)", "linear-gradient(135deg, #0C1830, #102445)", "linear-gradient(135deg, #0A1F1A, #0F2D25)"],
}

const KNOWLEDGE_VIDEOS = [
  { section: "Foundations of Money", color: "#34D399", items: [
    { title: "History of Money", desc: "From shells to digital. How money evolved over thousands of years.", duration: "4:30", emoji: "📜" },
    { title: "Digital Dollars & Stablecoins", desc: "What CBDCs and stablecoins are, and why governments are interested.", duration: "5:10", emoji: "💱" },
    { title: "Banking Basics", desc: "How banks really work, what fractional reserve means, and why your deposit is a loan.", duration: "4:45", emoji: "🏦" },
  ]},
  { section: "Money Over Time", color: "#38BDF8", items: [
    { title: "The Time Value of Money", desc: "Why £100 today is worth more than £100 next year. The cornerstone of finance.", duration: "4:20", emoji: "⏳" },
    { title: "Exchange Rates & Global Currencies", desc: "How exchange rates are set, what moves them, and what it means for your money abroad.", duration: "5:00", emoji: "🌍" },
  ]},
  { section: "Markets & Economics", color: "#A78BFA", items: [
    { title: "Supply & Demand Explained", desc: "The two forces that determine every price in every market, ever.", duration: "4:15", emoji: "⚖️" },
    { title: "Inflation: How Money Loses Value", desc: "What causes inflation, how it is measured, and how it affects your savings.", duration: "5:25", emoji: "📉" },
    { title: "Economic Cycles", desc: "Why economies boom and bust on a roughly predictable rhythm.", duration: "5:40", emoji: "🔄" },
  ]},
  { section: "Policy & Performance", color: "#FBBF24", items: [
    { title: "The Federal Reserve 101", desc: "Who runs central banks, what they actually do, and why it matters to you.", duration: "6:00", emoji: "🏛️" },
    { title: "Economic Indicators in Everyday Life", desc: "GDP, unemployment, CPI: what these numbers actually tell you.", duration: "5:15", emoji: "📊" },
  ]},
]

const IB_WEBINARS = [
  { num: 1, title: "Breaking into Investment Banking", desc: "The market, the roles, and how to position yourself for an analyst offer.", duration: "90 min", emoji: "🏛️" },
  { num: 2, title: "Private Equity Fundamentals", desc: "How PE funds work, deal structures, and the career paths inside the industry.", duration: "90 min", emoji: "📊" },
  { num: 3, title: "Interview Prep & Case Studies", desc: "Technicals, modelling, and what interviewers really want to see from you.", duration: "90 min", emoji: "🎯" },
]

function LessonList({ onOpen, completed }) {
  const [activeTab, setActiveTab] = useState("freedom")

  const phases = [
    { key: "Foundations", label: "Phase 1 · Foundations", color: C.green },
    { key: "Stabilise", label: "Phase 2 · Stabilise", color: C.orange },
    { key: "Optimise", label: "Phase 3 · Optimise", color: C.purple },
    { key: "Invest", label: "Phase 4 · Invest", color: C.green },
    { key: "Islamic Finance", label: "Islamic Finance", color: C.teal },
  ]

  const renderTile = (lesson, li, phaseKey) => {
    const isDone = completed.has(lesson.n)
    const bg = (TILE_BG[phaseKey] || TILE_BG.Foundations)[li % (TILE_BG[phaseKey] || TILE_BG.Foundations).length]
    return (
      <button key={lesson.n} onClick={() => onOpen(lesson)} className="slide-up"
        style={{ background: bg, border: `1px solid ${isDone ? C.green+"30" : "rgba(255,255,255,.06)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", textAlign: "left", transition: "transform .15s", animationDelay: `${li * 0.05}s`, position: "relative", aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
        onMouseUp={e => e.currentTarget.style.transform = ""}
        onMouseLeave={e => e.currentTarget.style.transform = ""}>
        {isDone && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.green}, ${C.teal})` }} />}
        <div style={{ position: "absolute", top: 14, left: 14, fontSize: 34, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.3))" }}>{isDone ? "✅" : lesson.emoji}</div>
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <span style={{ color: "rgba(255,255,255,.7)", fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,.35)", backdropFilter: "blur(4px)", padding: "3px 8px", borderRadius: 99 }}>+{lesson.xp} XP</span>
        </div>
        <div>
          <p style={{ color: isDone ? C.green : "rgba(255,255,255,.4)", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, marginBottom: 5 }}>Lesson {lesson.n} · {lesson.time} min</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.text, fontWeight: 700, fontSize: 15, lineHeight: 1.2, letterSpacing: "-0.02em", textShadow: "0 1px 3px rgba(0,0,0,.3)" }}>{lesson.title}</p>
        </div>
      </button>
    )
  }

  const tabs = [
    { id: "freedom", label: "Financial Freedom", emoji: "🚀", color: C.teal },
    { id: "ibpe", label: "IBD and PE", emoji: "🏛️", color: C.purple },
    { id: "knowledge", label: "Money Knowledge", emoji: "💡", color: C.gold },
  ]

  return (
    <div style={{ minHeight: "100dvh", background: C.bg }}>
      <style>{STYLES}</style>
      <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, fontSize: 15, background: `linear-gradient(135deg, ${C.green}, ${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center" }}>🚀</div>
          <span style={{ color: C.text, fontSize: 14, fontWeight: 800, letterSpacing: 1.5 }}>LIFESMART</span>
        </div>
        <div style={{ background: C.card, borderRadius: 99, padding: "4px 11px", display: "flex", alignItems: "center", gap: 4, border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 12 }}>🔥</span>
          <span style={{ color: C.teal, fontSize: 12, fontWeight: 700 }}>{[...completed].reduce((t, n) => t + (LESSONS.find(l => l.n === n)?.xp || 0), 0)} XP</span>
        </div>
      </div>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px 80px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.text, fontWeight: 700, fontSize: 26, letterSpacing: "-0.03em", marginBottom: 4 }}>Courses</h1>
        <p style={{ color: C.textLight, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          {activeTab === "freedom" && "Start with Financial Freedom: the guide that changes everything."}
          {activeTab === "ibpe" && "Three live webinars covering everything you need to break into investment banking and PE."}
          {activeTab === "knowledge" && "Deeper dives into the economics and theory behind how money really works."}
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(t => {
            const isActive = activeTab === t.id
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ background: isActive ? `${t.color}10` : C.card, border: `1.5px solid ${isActive ? t.color : C.border}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}>
                <span style={{ fontSize: 16 }}>{t.emoji}</span>
                <span style={{ color: isActive ? C.text : C.textLight, fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>{t.label}</span>
              </button>
            )
          })}
        </div>

        {activeTab === "freedom" && (() => {
          const CHAPTERS = [
            { phase:"Foundations", num:"01", title:"Foundations", emoji:"🌱", color:"#34D399",
              promise:"See your real financial picture and understand how wealth actually builds." },
            { phase:"Stabilise",   num:"02", title:"Stabilise",   emoji:"🛡️", color:"#FBBF24",
              promise:"Wipe out bad debt and build the safety net that protects everything you do next." },
            { phase:"Optimise",    num:"03", title:"Optimise",    emoji:"⚡", color:"#60A5FA",
              promise:"Stop overpaying tax, claim the free money you are owed, and set goals that actually happen." },
            { phase:"Invest",      num:"04", title:"Invest",      emoji:"📈", color:"#A78BFA",
              promise:"Put your money to work so it earns while you sleep and compounds for decades." },
            { phase:"Islamic Finance", num:"05", title:"Islamic Finance", emoji:"☪️", color:"#2DD4BF",
              promise:"An optional path covering Sharia compliant alternatives for every financial decision." },
          ]
          const totalLessons = LESSONS.length
          const doneCount = LESSONS.filter(l => completed.has(l.n)).length
          const overallPct = Math.round((doneCount / totalLessons) * 100)
          return (
            <div>
              {/* Hero intro */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ color: "#2DD4BF", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Your guide to financial freedom</p>
                <p style={{ color: "#FFFFFF", fontWeight: 900, fontSize: 22, lineHeight: 1.2, marginBottom: 10, letterSpacing: -.3 }}>The complete path, taught one idea at a time</p>
                <p style={{ color: "#C8D8EC", fontSize: 13, lineHeight: 1.65, marginBottom: 10 }}>Five chapters. Each one builds on the last. Each lesson is short, teaches a single idea, and ends with one small action you can take today.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, background: "rgba(255,255,255,.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${overallPct}%`, height: "100%", background: "linear-gradient(90deg,#2DD4BF,#A78BFA)", borderRadius: 99, transition: "width .5s ease" }}/>
                  </div>
                  <p style={{ color: "#C8D8EC", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{doneCount} of {totalLessons} done</p>
                </div>
              </div>

              {/* Chapters */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CHAPTERS.map(ch => {
                  const chLessons = LESSONS.filter(l => l.phase === ch.phase)
                  if (chLessons.length === 0) return null
                  const chDone = chLessons.filter(l => completed.has(l.n)).length
                  const chPct = Math.round((chDone / chLessons.length) * 100)
                  const allDone = chDone === chLessons.length
                  return (
                    <div key={ch.phase} style={{ background: `linear-gradient(180deg,${ch.color}10 0%,${C.card} 100%)`, border: `1.5px solid ${ch.color}30`, borderRadius: 20, overflow: "hidden", boxShadow: `0 2px 24px ${ch.color}08` }}>
                      <div style={{ padding: "16px 18px 14px", borderBottom: `1px solid ${ch.color}15`, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at 100% 0%,${ch.color}18,transparent 60%)`, pointerEvents: "none" }}/>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, position: "relative" }}>
                          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${ch.color}22`, border: `1.5px solid ${ch.color}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{ch.emoji}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: ch.color, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Chapter {ch.num}</p>
                            <p style={{ color: "#FFFFFF", fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>{ch.title}</p>
                          </div>
                          {allDone && <div style={{ background: "#34D39920", border: `1px solid #34D39940`, borderRadius: 99, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 10 }}>✓</span><span style={{ color: "#34D399", fontSize: 10, fontWeight: 800 }}>Done</span>
                          </div>}
                        </div>
                        <p style={{ color: "#C8D8EC", fontSize: 12, lineHeight: 1.5, marginBottom: 10, position: "relative" }}>{ch.promise}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
                          <div style={{ flex: 1, background: "rgba(255,255,255,.06)", borderRadius: 99, height: 4, overflow: "hidden" }}>
                            <div style={{ width: `${chPct}%`, height: "100%", background: ch.color, borderRadius: 99, transition: "width .5s ease" }}/>
                          </div>
                          <p style={{ color: ch.color, fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{chDone}/{chLessons.length}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px 14px 16px" }}>
                        {chLessons.map(lesson => {
                          const isDone = completed.has(lesson.n)
                          return (
                            <button key={lesson.n} onClick={() => onOpen(lesson)} style={{ width: "100%", background: isDone ? `linear-gradient(135deg,#34D39915,#34D39906)` : `${ch.color}06`, border: `1.5px solid ${isDone ? "#34D39945" : ch.color+"22"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 12, transition: "all .15s" }}>
                              <div style={{ width: 38, height: 38, borderRadius: 11, background: isDone ? "#34D39925" : `${ch.color}18`, border: `1.5px solid ${isDone ? "#34D39955" : ch.color+"35"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{lesson.emoji}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                  <p style={{ color: isDone ? "#34D399" : "#FFFFFF", fontWeight: 800, fontSize: 13, lineHeight: 1.25 }}>Lesson {lesson.n}: {lesson.title}</p>
                                  {isDone && <span style={{ background: "#34D39925", borderRadius: 99, padding: "1px 6px", color: "#34D399", fontSize: 9, fontWeight: 800 }}>✓ Done</span>}
                                </div>
                                <p style={{ color: "#8FA3BE", fontSize: 11, lineHeight: 1.4 }}>{LESSON_HINTS[lesson.n] || lesson.subtitle}</p>
                              </div>
                              <span style={{ color: isDone ? "#34D399" : ch.color, fontWeight: 800, fontSize: 16, flexShrink: 0, opacity: .7 }}>›</span>
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
        })()}

        {activeTab === "ibpe" && (
          <div className="slide-up">
            <div style={{ background: `linear-gradient(135deg, ${C.purple}10, ${C.purple}05)`, border: `1px solid ${C.purple}30`, borderRadius: 18, padding: "20px", marginBottom: 20 }}>
              <p style={{ color: C.purple, fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Investment Banking and Private Equity</p>
              <p style={{ color: C.textMid, fontSize: 13, fontWeight: 500, lineHeight: 1.6 }}>Three live webinars of 90 minutes each, covering how to break into IBD and PE, understand deal structures, and ace your interviews.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {IB_WEBINARS.map((w, i) => (
                <button key={i} className="slide-up" style={{ background: `linear-gradient(135deg, #1A1145, #2A1865)`, border: `1px solid ${C.purple}25`, borderRadius: 16, overflow: "hidden", cursor: "pointer", textAlign: "left", padding: "16px", display: "flex", flexDirection: "column", aspectRatio: "1", justifyContent: "space-between", animationDelay: `${i * 0.08}s`, transition: "transform .15s" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                  onMouseUp={e => e.currentTarget.style.transform = ""}
                  onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ background: "rgba(0,0,0,.35)", color: C.purple, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, letterSpacing: 0.5 }}>WEBINAR {w.num}</span>
                    <span style={{ fontSize: 28, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))" }}>{w.emoji}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: C.text, fontWeight: 700, fontSize: 15, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 5 }}>{w.title}</p>
                    <p style={{ color: "rgba(255,255,255,.55)", fontSize: 11, fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{w.desc}</p>
                    <span style={{ color: C.purple, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>⏱ {w.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="slide-up">
            <div style={{ background: `${C.gold}08`, border: `1px solid ${C.gold}25`, borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>💡</span>
                <p style={{ color: C.text, fontWeight: 800, fontSize: 15 }}>Why this matters</p>
              </div>
              <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.65 }}>Working through these videos will make you genuinely more knowledgeable and comfortable about how money actually works. Once you understand the bigger picture — what shapes inflation, why central banks matter, how markets behave, where wealth comes from — every financial decision you make becomes clearer and more confident. You stop reacting to headlines and start thinking like someone in control of their own money.</p>
            </div>
            {KNOWLEDGE_VIDEOS.map((sec, si) => (
              <div key={si} style={{ marginBottom: 24 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: sec.color }} />
                  <p style={{ color: sec.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>{sec.section}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {sec.items.map((v, i) => (
                    <div key={i} className="slide-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", animationDelay: `${i * 0.05}s` }}>
                      <div style={{ aspectRatio: "1", background: `linear-gradient(135deg, #0C1120 0%, #1a1a3e 50%, #0C1120 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }}>
                        <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.4))" }}>{v.emoji}</span>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.08)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.1)" }}>
                          <span style={{ fontSize: 18, color: "#fff", marginLeft: 3 }}>▶</span>
                        </div>
                        <span style={{ color: C.textFaint, fontSize: 11, fontWeight: 600 }}>{v.duration}</span>
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 4 }}>{v.title}</p>
                        <p style={{ color: C.textFaint, fontSize: 11, fontWeight: 500, lineHeight: 1.45 }}>{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



/* ════════ END NEW LESSONS SYSTEM ════════ */

/* ════════════════════════════════════════════════════════════════════
   LEARN TAB — 9-level journey
   ════════════════════════════════════════════════════════════════════ */
function LearnTab() {
  const { state, save, toast, setTab } = useApp()
  const [active, setActive] = useState(null)
  const completedLessons = state.completedLessons || []
  const completed = new Set(completedLessons.map(x => typeof x === 'object' ? x.n : x))

  // Pending lesson from another tab (e.g. analytics learn link)
  const pendingN = state.pendingLessonN
  if (pendingN && active === null) {
    const lesson = LESSONS.find(l => l.n === pendingN)
    if (lesson) {
      save({ ...state, pendingLessonN: null })
      setActive(lesson)
    }
  }

  function closeLesson() {
    const returnTab = state.lessonReturnTab
    setActive(null)
    if (returnTab !== undefined && returnTab !== null && returnTab !== 1) {
      save({ ...state, lessonReturnTab: null })
      setTab(returnTab)
    } else if (state.lessonReturnTab) {
      save({ ...state, lessonReturnTab: null })
    }
  }

  function completeLesson() {
    if (!active) return
    if (completed.has(active.n)) return  // Already done — let the user close manually
    const newDone = [...completedLessons, active.n]
    const xpGain = active.xp || 20
    save({
      ...state,
      completedLessons: newDone,
      profile: { ...state.profile, points: (state.profile?.points || 0) + xpGain }
    })
    toast(`+${xpGain} XP`)
    // Don't auto-close — user sees confetti and celebration screen, taps back manually
  }

  if (active) {
    return (
      <div style={{ position:"fixed", inset:0, background:T.bg, zIndex:200, overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
        <LessonPlayer lesson={active} onBack={closeLesson} onComplete={completeLesson}/>
      </div>
    )
  }
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:0 }}>
      <LessonList onOpen={setActive} completed={completed}/>
    </div>
  )
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
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)

  const total = PERSONALITY_QUIZ.length
  const q = PERSONALITY_QUIZ[step - 1]
  const isIntro = step === 0
  const isResult = step > total

  function next() {
    if(isIntro) { setStep(1); return }
    if(selected === null) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    if(step >= total) {
      const r = calcQuizPersonality(newAnswers, state)
      setResult(r)
      save({ ...state, profile: { ...state.profile, personalityResult: r } })
      setStep(total + 1)
    } else {
      setStep(s => s + 1)
      setSelected(null)
    }
  }

  function back() {
    if(step <= 1) { onClose(); return }
    setStep(s => s - 1)
    const prevQ = PERSONALITY_QUIZ[step - 2]
    setSelected(answers[prevQ?.id] ?? null)
  }

  const pct = step === 0 ? 0 : Math.round((step / total) * 100)

  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:300,display:"flex",flexDirection:"column",overflowY:"auto" }}>
      <style>{`@keyframes quizIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.bg,zIndex:10 }}>
        <button onClick={isResult ? onClose : back} style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,padding:4,fontFamily:"inherit" }}>
          {isResult ? <span style={{ fontSize:13,fontWeight:700 }}>Done</span> : <span style={{ fontSize:20 }}>{"\u2190"}</span>}
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

        {isIntro && (
          <div style={{ animation:"quizIn .3s ease" }}>
            <div style={{ fontSize:56,marginBottom:20,textAlign:"center" }}>{"\u{1F9E0}"}</div>
            <h1 style={{ color:T.white,fontWeight:900,fontSize:26,textAlign:"center",marginBottom:12,lineHeight:1.2 }}>
              Discover your money personality
            </h1>
            <p style={{ color:"#E2EAF6",fontSize:15,textAlign:"center",lineHeight:1.7,marginBottom:32 }}>
              12 real-life scenarios. No right answers. Based on financial psychology research. Takes about 4 minutes.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:32 }}>
              {[
                { icon:"\u{1F3AF}", text:"Your archetype from 10 financial personality types" },
                { icon:"\u{1F4CA}", text:"7 dimensions of how you relate to money" },
                { icon:"\u{1F4A1}", text:"Your specific blind spots and hidden strengths" },
                { icon:"\u{1F52E}", text:"Personalised insights based on financial psychology research" },
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

        {!isIntro && !isResult && q && (
          <div key={step} style={{ animation:"quizIn .25s ease" }}>
            <h2 style={{ color:T.white,fontWeight:900,fontSize:21,lineHeight:1.25,marginBottom:6,marginTop:8 }}>{q.headline}</h2>
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
                      {sel ? "\u2713" : String.fromCharCode(65+oi)}
                    </div>
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <button onClick={next} disabled={selected===null}
              style={{ width:"100%",background:selected!==null?`linear-gradient(135deg,${T.teal},${T.purple})`:T.subtle,border:"none",borderRadius:14,padding:"15px",color:selected!==null?T.bg:T.muted,fontWeight:800,fontSize:15,cursor:selected!==null?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .2s" }}>
              {step < total ? "Next question" : "See my result"}
            </button>
          </div>
        )}

        {isResult && result && (
          <PersonalityResult result={result} onClose={onClose}/>
        )}
      </div>
    </div>
  )
}

function PersonalityResult({ result, onClose }) {
  const arch = result.archetype
  const [tab, setTab] = useState("overview")
  const dims = result.dimensions
  const norm = result.scores

  const dimRows = [
    { key:"Risk appetite", left:"Security-first", right:"Growth-seeking", val:norm.security_growth, color:norm.security_growth>55?T.teal:norm.security_growth<45?T.amber:T.muted },
    { key:"Time horizon", left:"Present-focused", right:"Future-focused", val:norm.present_future, color:norm.present_future>55?T.teal:norm.present_future<45?T.amber:T.muted },
    { key:"Decision style", left:"Methodical", right:"Spontaneous", val:norm.planned_spontaneous, color:T.purple },
    { key:"Money mindset", left:"Scarcity-aware", right:"Abundance-minded", val:norm.abundance_scarcity, color:norm.abundance_scarcity>55?T.green:norm.abundance_scarcity<45?T.red:T.amber },
    { key:"Decisions led by", left:"Emotion & instinct", right:"Data & analysis", val:norm.emotional_analytical, color:T.blue },
    { key:"Money means", left:"Status & security", right:"Freedom & options", val:norm.status_freedom, color:norm.status_freedom>55?T.teal:T.amber },
    { key:"Advice style", left:"Self-reliant", right:"Seeks input", val:norm.independent_social, color:T.purple },
  ]

  const DIM_TIPS = {
    "Risk appetite":"How comfortable you are with investment volatility. Higher = comfortable seeing your portfolio drop 30%. Lower = prefers certainty even at lower returns.",
    "Time horizon":"Whether you naturally optimise for now or for decades ahead. Affects how you should invest your pension and savings.",
    "Decision style":"Methodical = researches thoroughly and follows plans. Spontaneous = trusts instinct and moves quickly. Neither is better — both have different blind spots.",
    "Money mindset":"Abundance = believes there is enough and acts accordingly. Scarcity = carries background worry about money, even when the numbers say otherwise. Rooted in childhood experiences.",
    "Decisions led by":"Whether you make money decisions based on how they feel or what the data says. Most people believe they are more analytical than they actually are.",
    "Money means":"What money represents to you at a core level. Status-driven = money proves something. Freedom-driven = money buys options and autonomy.",
    "Advice style":"Whether you prefer to figure money out alone or value input from others. Neither is right, but extreme self-reliance can mean missing valuable perspectives.",
  }
  const [activeTip, setActiveTip] = useState(null)

  return (
    <div style={{ animation:"quizIn .3s ease" }}>
      <div style={{ textAlign:"center",marginBottom:28 }}>
        <div style={{ width:80,height:80,borderRadius:24,background:`${arch.color}20`,border:`2px solid ${arch.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 16px",boxShadow:`0 0 40px ${arch.color}30` }}>
          {arch.emoji}
        </div>
        <p style={{ color:arch.color,fontWeight:700,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>Your money personality</p>
        <h2 style={{ color:T.white,fontWeight:900,fontSize:28,marginBottom:8 }}>{arch.name}</h2>
        <p style={{ color:arch.color,fontWeight:700,fontSize:15,marginBottom:14 }}>{arch.headline}</p>
        <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.7 }}>{arch.summary}</p>
      </div>

      <div style={{ display:"flex",gap:6,marginBottom:20,background:T.surface,borderRadius:12,padding:4 }}>
        {[["overview","Overview"],["scenarios","What this means"],["blindspot","Blind spot"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ flex:1,background:tab===id?T.card:"transparent",border:`1px solid ${tab===id?T.border:"transparent"}`,borderRadius:9,padding:"8px 4px",cursor:"pointer",fontFamily:"inherit",color:tab===id?T.white:T.muted,fontWeight:tab===id?700:500,fontSize:12,transition:"all .15s" }}>
            {label}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>Your 7 dimensions</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:20 }}>
            {dimRows.map(d=>(
              <div key={d.key} onClick={()=>setActiveTip(activeTip===d.key?null:d.key)} style={{ background:T.card,border:`1px solid ${activeTip===d.key?arch.color+"50":T.border}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"border .15s" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                  <p style={{ color:"#8FA3BE",fontSize:12,fontWeight:600 }}>{d.key}</p>
                  <p style={{ color:d.color,fontWeight:800,fontSize:12 }}>{d.val}/100</p>
                </div>
                {/* Spectrum bar */}
                <div style={{ position:"relative",height:6,background:T.surface,borderRadius:3,marginBottom:4 }}>
                  <div style={{ position:"absolute",left:`${Math.max(2,Math.min(98,d.val))}%`,top:-2,width:10,height:10,borderRadius:"50%",background:d.color,transform:"translateX(-50%)",border:`2px solid ${T.card}`,transition:"left .6s" }}/>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <p style={{ color:d.val<45?"#E2EAF6":"#4A6080",fontSize:9,fontWeight:d.val<45?700:500 }}>{d.left}</p>
                  <p style={{ color:d.val>55?"#E2EAF6":"#4A6080",fontSize:9,fontWeight:d.val>55?700:500 }}>{d.right}</p>
                </div>
                {activeTip===d.key && (
                  <p className="ls-fadein" style={{ color:"#D8E8F8",fontSize:12,lineHeight:1.55,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}` }}>{DIM_TIPS[d.key]}</p>
                )}
              </div>
            ))}
          </div>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>Strengths</p>
          <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
            {(arch.traits||[]).map((t,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
                <span style={{ color:arch.color,fontSize:14,marginTop:1 }}>{"\u2713"}</span>
                <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="scenarios" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>This is probably true about you</p>
          <p style={{ color:"#C8D8EC",fontSize:13,lineHeight:1.55,marginBottom:14 }}>The more accurate these feel, the more reliable your result is.</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:24 }}>
            {(arch.scenarios||[]).map((s,i)=>(
              <div key={i} style={{ background:T.card,border:`1px solid ${arch.color}20`,borderRadius:12,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start" }}>
                <span style={{ color:arch.color,fontSize:14,marginTop:1,flexShrink:0 }}>{"\u2713"}</span>
                <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.55 }}>{s}</p>
              </div>
            ))}
          </div>
          {(arch.advice||[]).length>0 && <>
            <p style={{ color:T.muted,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:10 }}>Advice for your type</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {arch.advice.map((a,i)=>(
                <div key={i} style={{ background:`${arch.color}08`,border:`1px solid ${arch.color}18`,borderRadius:12,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start" }}>
                  <span style={{ color:arch.color,fontSize:14,marginTop:1,flexShrink:0 }}>{"\u{1F4A1}"}</span>
                  <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.55 }}>{a}</p>
                </div>
              ))}
            </div>
          </>}
        </div>
      )}

      {tab==="blindspot" && (
        <div style={{ animation:"quizIn .2s ease" }}>
          <div style={{ background:T.amberDim,border:`1.5px solid ${T.amberBorder}`,borderRadius:16,padding:"18px",marginBottom:20 }}>
            <p style={{ color:T.amber,fontWeight:700,fontSize:13,marginBottom:8 }}>{"\u26A0"} Your main blind spot</p>
            <p style={{ color:"#E2EAF6",fontSize:14,lineHeight:1.65 }}>{arch.blind_spot}</p>
          </div>
          <div style={{ background:`${arch.color}12`,border:`1.5px solid ${arch.color}30`,borderRadius:16,padding:"18px" }}>
            <p style={{ color:arch.color,fontWeight:700,fontSize:13,marginBottom:8 }}>{"\u2192"} Your next move</p>
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
  const quizResult = state.profile?.personalityResult
  const p = quizResult || calcPersonality(state)
  const arch = p.archetype
  const [showMode, setShowMode] = useState(false)
  const mode = PRIORITY_MODES.find(m=>m.id===(state.profile?.mode||"grow"))||PRIORITY_MODES[0]

  // Show quiz dimensions if quiz taken, otherwise show behavioral dimensions
  const dimCards = quizResult ? [
    { label:"Risk", val:p.scores?.security_growth>55?"Growth-seeking":p.scores?.security_growth<45?"Security-first":"Balanced", color:T.teal },
    { label:"Style", val:p.scores?.planned_spontaneous>55?"Spontaneous":p.scores?.planned_spontaneous<45?"Methodical":"Balanced", color:T.purple },
    { label:"Mindset", val:p.scores?.abundance_scarcity>55?"Abundance":p.scores?.abundance_scarcity<45?"Scarcity-aware":"Balanced", color:T.amber },
  ] : [
    { label:"Mindset", val:p.mindset==="security"?"Security":p.mindset==="growth"?"Growth":"Freedom", color:T.teal },
    { label:"Behaviour", val:p.behaviour==="starter"?"Starter":p.behaviour==="saver"?"Saver":p.behaviour==="builder"?"Builder":"Investor", color:T.purple },
    { label:"Risk", val:p.risk==="cautious"?"Cautious":p.risk==="adventurous"?"Adventurous":"Balanced", color:T.amber },
  ]

  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ background:T.card,border:`1.5px solid ${arch.color}35`,borderRadius:20,padding:"22px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,right:0,width:120,height:120,background:`radial-gradient(circle at 100% 0%,${arch.color}15,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:16,position:"relative" }}>
          <div style={{ width:56,height:56,borderRadius:16,background:`${arch.color}20`,border:`2px solid ${arch.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0 }}>{arch.emoji}</div>
          <div style={{ flex:1 }}>
            <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4 }}>Your money personality</p>
            <p style={{ color:T.white,fontWeight:900,fontSize:20,marginBottom:4 }}>{arch.name}</p>
            <p style={{ color:"#E2EAF6",fontSize:13,lineHeight:1.55 }}>{arch.summary?.slice(0,120)}...</p>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16 }}>
          {dimCards.map(d=>(
            <div key={d.label} style={{ background:T.surface,borderRadius:12,padding:"10px" }}>
              <p style={{ color:"#8FA3BE",fontSize:10,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:3 }}>{d.label}</p>
              <p style={{ color:d.color,fontWeight:800,fontSize:12 }}>{d.val}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:14 }}>
          <p style={{ color:"#8FA3BE",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10 }}>Deeper insights</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {PERSONALITY_LOCKED.map(l=>{
              const done = l.check(state)
              return (
                <div key={l.id} style={{ display:"flex",alignItems:"center",gap:10,background:done?`${arch.color}10`:T.faint,borderRadius:10,padding:"10px 12px",border:`1px solid ${done?arch.color+"30":T.border}` }}>
                  <span style={{ fontSize:16,flexShrink:0 }}>{l.icon}</span>
                  <p style={{ color:done?T.white:"#8FA3BE",fontWeight:done?700:500,fontSize:13,flex:1 }}>{l.label}</p>
                  {done ? <span style={{ color:arch.color,fontSize:11,fontWeight:700 }}>Unlocked ✓</span> : <span style={{ color:"#8FA3BE",fontSize:11 }}>{l.unlock}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div style={{ display:"flex",gap:8,marginTop:8 }}>
        <button onClick={onOpenQuiz} style={{ flex:1,background:`${arch.color}15`,border:`1px solid ${arch.color}35`,borderRadius:10,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",color:arch.color,fontWeight:700,fontSize:12 }}>
          {quizResult ? "View full result →" : "Take the quiz →"}
        </button>
        {quizResult && <button onClick={()=>{save({...state,profile:{...state.profile,personalityResult:null}})}} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",color:T.muted,fontWeight:700,fontSize:12 }}>
          Retake quiz
        </button>}
      </div>
      <div style={{ marginTop:4 }}>
        <button onClick={()=>setShowMode(v=>!v)} style={{ width:"100%",background:T.card,border:`1px solid ${mode.border}`,borderRadius:14,padding:"13px 18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between" }}>
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
                  <button key={m.id} onClick={()=>{save({...state,profile:{...state.profile,mode:m.id}});setShowMode(false)}} style={{ background:sel?m.dim:T.faint,border:`1.5px solid ${sel?m.color:T.border}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left" }}>
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
      <header style={{ background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 20px",height:50,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",zIndex:10,boxShadow:"0 4px 24px rgba(0,0,0,.25)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,rgba(15,191,184,.3),rgba(167,139,250,.3))",border:"1px solid rgba(15,191,184,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>🚀</div>
          <span style={{ color:"#FFFFFF",fontSize:13,fontWeight:800,letterSpacing:2 }}>LIFESMART</span>
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
