import { useState, useEffect, useContext, createContext, useMemo, useRef } from "react"
import { Home, BookOpen, User, Check, X, ChevronLeft, ChevronRight, ChevronDown, Play, Lock, Clock, Zap, AlertTriangle, RotateCcw, Map, Info, DollarSign } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

const G=`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',system-ui,sans-serif;background:#070D1A;-webkit-font-smoothing:antialiased}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}
input[type=number]{-moz-appearance:textfield}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1C2D47;border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes twinkle{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.8;transform:scale(1.5)}}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes quizIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.ls-fadein{animation:fadeUp .45s ease-out forwards}
.ls-float{animation:float 5s ease-in-out infinite}
.ls-star{animation:twinkle var(--d,2.5s) ease-in-out var(--dl,0s) infinite}
button{-webkit-tap-highlight-color:transparent}
`
const T={bg:"#070D1A",surface:"#0B1424",card:"#0F1D32",border:"#1B2C45",
  teal:"#0FBFB8",tealMid:"#14D4CC",tealDim:"rgba(15,191,184,.10)",tealBorder:"rgba(15,191,184,.30)",
  amber:"#F59E0B",amberDim:"rgba(245,158,11,.10)",amberBorder:"rgba(245,158,11,.28)",
  red:"#F87171",redDim:"rgba(248,113,113,.10)",redBorder:"rgba(248,113,113,.28)",
  purple:"#A78BFA",purpleDim:"rgba(167,139,250,.12)",purpleBorder:"rgba(167,139,250,.3)",
  green:"#34D399",greenDim:"rgba(52,211,153,.10)",
  blue:"#60A5FA",blueDim:"rgba(96,165,250,.1)",blueBorder:"rgba(96,165,250,.3)",
  white:"#F0F6FF",muted:"#7A8FA8",subtle:"#344D68",faint:"#162038"}

/* ══════════════════ LEVELS ══════════════════ */

const PC={Foundations:T.red,Stabilise:T.amber,Optimise:T.blue,Grow:T.green,Protect:T.purple}
const PE={Foundations:"🧱",Stabilise:"🛡️",Optimise:"⚙️",Grow:"🌱",Protect:"🔒"}
const getPhase=n=>n<=3?"Foundations":n<=6?"Stabilise":n<=7?"Optimise":"Grow"

const AGE_BENCH=[{max:25,median:5000},{max:34,median:30000},{max:44,median:130000},{max:54,median:250000},{max:64,median:370000},{max:999,median:500000}]
function getMedian(age){const b=AGE_BENCH.find(x=>(age||30)<=x.max);return b?b.median:30000}

/* ═══════════════════════════════════════════════════════
   LEVELS — 9 rich levels
   ═══════════════════════════════════════════════════════ */
const LEVELS=[
{n:1,phase:"Foundations",title:"Your Net Worth: The Only Number That Really Matters",hook:"Nobody builds wealth by accident. You have to track it.",time:15,
 sections:[
  {title:"Why net worth is the real measure",content:"Income is vanity. Net worth is reality. Two people can both earn £50k and have completely different financial lives. One has a net worth of £120k. The other is £8k in the hole. The difference is not what they earn. It is what they kept, grew, and owed.\n\nNet worth is the score. Everything else is just activity. You cannot manage what you do not measure. This is where that starts."},
  {title:"Productive vs lifestyle assets",content:"Productive assets put money in your pocket or grow without you working: cash savings, pension, Stocks and Shares ISA, investment property. These build financial freedom.\n\nLifestyle assets feel like assets but rarely grow: your car depreciates the moment you drive away. Including them is honest but the goal over time is to shift more into productive assets.",
   columns:[{label:"Productive (green)",items:["Cash savings","Pension","Stocks/ISA","Investment property"]},{label:"Lifestyle (amber)",items:["Car","Jewellery","Personal property"]}]},
  {title:"How to find your figures",content:"Assets: Log into your bank app for savings. Check your pension provider app. Check investment apps (Vanguard, Trading 212). Home value: Zoopla or Rightmove estimate. Car: Autotrader part-exchange value.\n\nLiabilities: Credit card balance from your app. Student loan: gov.uk. Mortgage remaining: lender app.\n\nRough estimates are fine. A ballpark net worth updated regularly beats a precise number calculated once three years ago."}
 ],
 dataFields:{
   assets:[{id:"cash",label:"Cash / current accounts",hint:"What is in your bank right now"},{id:"savings",label:"Savings accounts",hint:""},{id:"pension",label:"Pension estimated value",hint:"Check your pension app or annual statement"},{id:"stocksIsa",label:"Stocks & ISA value",hint:""},{id:"propertyValue",label:"Property value",hint:"Zoopla or Rightmove estimate"},{id:"carValue",label:"Car value",hint:"Autotrader part-exchange value"},{id:"other",label:"Other assets",hint:""}],
   liabilities:[{id:"mortgage",label:"Mortgage remaining",hint:""},{id:"creditCards",label:"Credit card balances",hint:"Total across all cards"},{id:"carFinance",label:"Car finance remaining",hint:""},{id:"personalLoans",label:"Personal loans",hint:""},{id:"studentLoan",label:"Student loan",hint:"gov.uk/student-loan-repayment"},{id:"otherDebt",label:"Other debt",hint:""}]
 },
 videos:[{title:"Balance-Sheet and net worth check",role:"core",min:3},{title:"Asset Types",role:"core",min:3},{title:"Know Your Why",role:"deeper",min:3}],
 action:"Set up a note, spreadsheet, or use this app to update your net worth quarterly. The habit of tracking matters as much as the number.",
 doneWhen:"You have entered your assets and liabilities and seen your net worth figure and projection. You do not need to be happy with the number. You just need to know it."},

{n:2,phase:"Foundations",title:"Income and Spending: Your Complete Financial Picture",hook:"Without this, every financial decision is based on a guess.",time:12,
 sections:[
  {title:"Income: one source vs multiple",content:"Active income is what most people have: a salary. If you stop working, it stops. Multiple income streams reduce risk and accelerate wealth building. A second income of even £300/month is £3,600/year.\n\nPassive income earns while you sleep: rental income, dividends, interest. This is what financial freedom actually looks like. Everything in this programme works toward making your passive income number real."},
  {title:"Why we always underestimate spending",content:"Research consistently shows people underestimate variable spending by 30 to 40%. We remember big purchases but forget the coffee, the Deliveroo, the impulse buy. Your mental estimate is almost always wrong.\n\nThe only way to know is to look at actual bank statements. Not what you think you spend. What you actually spent."},
  {title:"Subscriptions: the slow leak",content:"The average UK household has 7 active subscriptions and can name 4 of them. The forgotten ones typically add up to £30 to £60/month. That is £360 to £720/year.\n\nGo through your last bank statement and highlight every recurring payment. Cancel anything you would not actively choose to sign up for again today."}
 ],
 dataFields:{
   income:[{id:"takeHome",label:"Monthly take-home pay after tax",hint:"What hits your bank account"},{id:"sideIncome",label:"Side income / freelance (monthly avg)",hint:""},{id:"benefits",label:"Benefits / tax credits",hint:""},{id:"rentalIncome",label:"Rental income",hint:""},{id:"interest",label:"Interest / dividends",hint:""},{id:"otherIncome",label:"Other regular income",hint:""}],
   fixed:[{id:"rent",label:"Rent / mortgage payment",hint:""},{id:"gasElec",label:"Gas and electricity",hint:""},{id:"water",label:"Water",hint:""},{id:"councilTax",label:"Council tax",hint:""},{id:"phone",label:"Phone",hint:""},{id:"internet",label:"Internet",hint:""},{id:"transport",label:"Transport",hint:"Include car payment if applicable"},{id:"insurance",label:"Insurance (total all)",hint:"Car, home, life"}],
   variable:[{id:"groceries",label:"Groceries",hint:""},{id:"eatingOut",label:"Eating out / takeaways",hint:""},{id:"clothing",label:"Clothing / shopping",hint:""},{id:"entertainment",label:"Entertainment / going out",hint:""},{id:"personalCare",label:"Personal care",hint:""},{id:"otherVar",label:"Other",hint:""}]
 },
 videos:[{title:"Tracking Incomes & Outgoings",role:"core",min:3},{title:"Budgeting: 50/30/20",role:"core",min:3},{title:"The Psychology of Money",role:"deeper",min:4}],
 action:"Know your monthly surplus (or deficit) and where your money goes. Data saves and pre-fills Level 3.",
 doneWhen:"You know your monthly surplus and can see clearly where your money is going."},

{n:3,phase:"Foundations",title:"Budgeting: Give Every Pound a Job",hook:"The 50/30/20 rule is a starting framework. Your numbers make it personal.",time:10,
 sections:[
  {title:"Needs vs wants vs savings vs waste",content:"50% to needs (must-haves: rent, food, transport). 30% to wants (chosen: eating out, holidays). 20% to savings and debt repayment.\n\nIt is not rigid. London rent might push needs to 65%. The point is knowing your numbers and making conscious choices.\n\nWaste is different from wants. A want is consciously chosen and enjoyed. Waste is money spent without realising. Eliminating waste does not feel like sacrifice. It feels like getting your money back."},
  {title:"Budgeting methods that work",content:"Pay yourself first: savings leave your account on payday before spending. You live on what remains. The simplest method. Requires the least willpower because the decision is automated.\n\nZero-based: every pound assigned a job. Income minus all planned spending equals zero.\n\nStart with pay yourself first. Set up a standing order on payday."}
 ],
 dataFields:null,
 videos:[{title:"Savings Pots",role:"core",min:3},{title:"Comparison Traps: Financial Freedom",role:"core",min:3}],
 action:"Every spending item from Level 2 categorised. Monthly budget with targets set. The pay-yourself-first amount identified.",
 doneWhen:"You have a monthly budget with targets and have identified your pay-yourself-first amount."},

{n:4,phase:"Foundations",title:"Your Payslip and How Tax Actually Works",hook:"The most common tax misconception costs people real money.",time:10,
 sections:[
  {title:"Every payslip line explained",content:"Gross salary: what you are contracted to earn. Income tax (PAYE): taken at source, depends on your tax code. National Insurance: 12% on earnings between £12,570 and £50,270, separate from income tax. Pension contribution: usually shown as % of gross. Net pay: what hits your bank."},
  {title:"How tax bands actually work",content:"The misconception: 'I got a pay rise into the 40% bracket, I am worse off.' This is wrong.\n\nTax bands are marginal. You only pay the higher rate on the portion above the threshold.\n\n£0 to £12,570: 0% (personal allowance)\n£12,571 to £50,270: 20% (basic rate)\n£50,271 to £125,140: 40% (higher rate)\n\nSomeone earning £55,000 pays 0% on first £12,570, 20% on next £37,700, 40% only on £4,730 above £50,270. Effective rate: about 20%, not 40%."}
 ],
 dataFields:{payslip:[{id:"grossSalary",label:"Gross annual salary",hint:""},{id:"taxCode",label:"Tax code (e.g. 1257L)",hint:"Check your payslip"},{id:"monthlyTax",label:"Income tax paid per month",hint:""},{id:"monthlyNI",label:"NI paid per month",hint:""},{id:"monthlyPension",label:"Pension deducted per month",hint:""}]},
 videos:[{title:"Banking Basics",role:"deeper",min:3}],
 action:"Understand every line of your payslip. Confirm your tax code is correct at gov.uk/check-income-tax.",
 doneWhen:"You understand your payslip and have confirmed your tax code."},

{n:5,phase:"Stabilise",title:"Debt: Stop Letting Your Past Control Your Present",hook:"Interest compounds against you the same way investing compounds for you.",time:15,
 sections:[
  {title:"Why debt is the biggest drag",content:"£2,000 on a card at 34% APR, paying only the minimum £58/month, takes 11 years to clear and costs £1,400 in extra interest. Not a spending problem. A compounding problem working in the wrong direction.\n\nBeyond the financial cost: the low-level anxiety that does not go away. Clearing debt changes how people feel every day."},
  {title:"Paying off debt vs investing",content:"If your debt costs 29% APR, paying it off gives you a guaranteed 29% return, better than any investment can reliably promise. The stock market averages 7 to 10% per year.\n\nThe one exception: employer pension match. That is a guaranteed 100% return. Capture that first. But all other investing waits until high-interest debt is cleared."},
  {title:"Avalanche vs Snowball",content:"Avalanche (highest interest first): mathematically optimal, costs least total interest.\n\nSnowball (smallest balance first): costs more interest but research shows higher completion rates because of psychological momentum.\n\nPick the one you will stick to. A completed snowball beats an abandoned avalanche."}
 ],
 dataFields:{debts:"dynamic"},
 videos:[{title:"Good debt vs. bad debt",role:"core",min:3},{title:"Cost of Borrowing",role:"core",min:3},{title:"Snowball vs. Avalanche",role:"core",min:3}],
 action:"Every debt listed with APR. Payoff order chosen. First extra payment scheduled.",
 doneWhen:"Every debt listed with its APR. Payoff order and debt-free date set."},

{n:6,phase:"Stabilise",title:"Savings Pots: A Place for Everything",hook:"An emergency fund is not savings. It is insurance.",time:10,
 sections:[
  {title:"Emergency fund first",content:"Start with £1,000. That covers most common emergencies. Then build to 3 to 6 months of essential spending using your Level 2 numbers.\n\nKeep it in a high-interest easy-access account. Not your current account. Not an investment. A named pot, accessible within 24 hours but not accidentally spent."},
  {title:"Sinking funds",content:"A sinking fund is money set aside for a cost you know is coming. Car insurance (£800/year = £67/month). Holiday. Christmas. If you can predict it, save for it in advance.\n\nEverything that ends up on a credit card 'out of nowhere' was actually predictable. It just was not planned for."}
 ],
 dataFields:null,
 videos:[{title:"Savings Pots",role:"core",min:3},{title:"SMART Goal-Setting",role:"core",min:3}],
 action:"Emergency fund started with standing order. At least one sinking fund set up.",
 doneWhen:"Emergency fund started with a standing order running. At least one sinking fund set up."},

{n:7,phase:"Optimise",title:"Capture Free Money: Tax, Pension Match, Allowances",hook:"Your employer is offering money you are not taking.",time:10,
 sections:[
  {title:"Employer pension match",content:"If your employer matches up to 5% and you contribute 3%, on a £32,000 salary you are leaving £640/year in free money on the table.\n\nSalary sacrifice makes it even better. You pay pension from gross salary before tax or NI. On £35k contributing 5% via salary sacrifice, you save approximately £350/year in NI."},
  {title:"Tax allowances most people miss",content:"Marriage allowance: if one partner earns under £12,570, transfer £1,260 of personal allowance. Saves up to £252/year, backdatable 4 years.\n\nWorking from home: £6/week (£312/year) tax relief without receipts.\n\nUniform and professional fees, Gift Aid on charity donations, Rent a Room Relief (£7,500/year tax-free)."}
 ],
 dataFields:null,
 videos:[{title:"Retirement Toolkit",role:"core",min:3}],
 action:"Pension contribution set to capture full employer match. Applicable allowances identified.",
 doneWhen:"Pension contribution matches employer maximum. Applicable allowances claimed or queued."},

{n:8,phase:"Grow",title:"Open Your ISA: The Tax-Free Wrapper",hook:"Every year you delay costs you. The allowance does not roll over.",time:10,
 sections:[
  {title:"What an ISA is",content:"An ISA is a tax wrapper where money grows without being taxed. No capital gains tax. No income tax on dividends. No tax on withdrawal. Every adult has a £20,000 per year allowance. Use it or lose it.\n\nThe principle: fill an ISA before investing anywhere else. Why pay tax on growth when there is a legal wrapper that prevents it?"},
  {title:"Types of ISA",content:"Cash ISA: like a savings account, 4 to 5% interest tax-free. Good for money needed within 5 years.\n\nStocks and Shares ISA: invest in funds and shares inside the wrapper. 7 to 10% average long-term. This builds wealth.\n\nLifetime ISA (LISA): under-40s only. 25% government bonus on up to £4,000/year. For first home or retirement. If eligible, open one before you turn 40."},
  {title:"Where to open one",content:"Vanguard: lowest overall costs, great for beginners. Trading 212: 0% platform fee. Freetrade: popular for first-time investors. For LISA: Moneybox or AJ Bell."}
 ],
 dataFields:null,
 videos:[{title:"Asset Types",role:"core",min:3},{title:"Rate of Return",role:"core",min:3},{title:"Risk and Risk Tolerance",role:"core",min:3}],
 action:"A Stocks and Shares ISA is open. LISA opened if under 40 and planning to buy a first home.",
 doneWhen:"A Stocks and Shares ISA is open, even with £0 in it."},

{n:9,phase:"Grow",title:"Make Your First Investment: Let Time Do the Work",hook:"Starting at 25 vs 35 on £200/month is a £282,000 difference.",time:10,
 sections:[
  {title:"Compound growth",content:"£10,000 growing at 7%/year becomes £76,000 over 30 years without any additional contributions. Your returns earn returns.\n\nStart at 25 with £200/month at 7%: £525,000 by 65.\nStart at 35 with £200/month at 7%: £243,000 by 65.\n\nSame investment. Same fund. 10-year head start = £282,000 difference.\n\nThe mantra: start now, start small."},
  {title:"Index funds: why simple wins",content:"An index fund tracks a market like the S&P 500 or FTSE Global All Cap. You own a slice of hundreds of companies at once.\n\nOver 10 years, roughly 90% of active fund managers underperform their benchmark index. The reason is fees. 1.5% vs 0.2% on £100,000 over 10 years costs approximately £15,000.\n\nRecommended: Vanguard FTSE Global All Cap (0.23%) inside a Stocks and Shares ISA. Monthly direct debit. Do not watch it daily."},
  {title:"Risk and time horizon",content:"Under 3 years: keep in cash.\n3 to 5 years: cautious mix.\n5+ years: global equity index fund.\n10+ years: higher equity allocation.\n\nThe emergency fund from Level 6 exists so your investments can stay invested through volatile periods."}
 ],
 dataFields:{investing:[{id:"monthlyInvestment",label:"Monthly investment amount",hint:"From your surplus"},{id:"currentISA",label:"Any existing ISA balance",hint:""},{id:"targetAge",label:"Target age to stop working",hint:""}]},
 videos:[{title:"Funds",role:"core",min:3},{title:"Diversification",role:"core",min:3},{title:"Time horizon and portfolio construction",role:"core",min:3}],
 action:"A monthly direct debit is set up into a global index fund inside your ISA. Even £25/month.",
 doneWhen:"A monthly direct debit is running into an index fund. The habit matters more than the amount."},
]

const QUICK_WINS=[{id:"tax",icon:"🔍",label:"Tax code check",min:5},{id:"subs",icon:"📱",label:"Subscription audit",min:10},{id:"savings",icon:"🏦",label:"Savings rate check",min:3},{id:"pension",icon:"💼",label:"Pension match check",min:5}]


const LEARN_THEMES=[
  {id:"economy",icon:"🌍",title:"How the world economy works",items:[
    {title:"History of Money",min:4},{title:"Exchange Rates & Global Currencies",min:3},{title:"Supply & Demand",min:3},{title:"Economic Cycles",min:4}]},
  {id:"investing",icon:"🔮",title:"Beyond the basics",items:[
    {title:"Digital Dollars & Stablecoins",min:3},{title:"Commodities",min:3},{title:"Real Estate",min:4},{title:"Bonds and fixed income",min:3}]},
  {id:"psychology",icon:"🧠",title:"Understanding yourself with money",items:[
    {title:"Know Your Why",min:3},{title:"Comparison Traps",min:3},{title:"The Psychology of Money",min:4}]},
  {id:"credit",icon:"💳",title:"Credit deep dive",items:[
    {title:"How Credit Actually Works",min:3},{title:"Credit Scores and Bureaus",min:3},{title:"Credit Cards Explained",min:3}]},
]
/* ══════════════════ PERSONALITY QUIZ DATA ══════════════════ */
const PERSONALITY_QUIZ=[
  {id:"q1",dimension:"security_growth",headline:"You receive an unexpected £5,000.",sub:"What feels most natural?",options:[{label:"Add it straight to savings for security",scores:{security_growth:10,present_future:30,abundance_scarcity:30}},{label:"Split it: half saved, half invested",scores:{security_growth:45,present_future:60,abundance_scarcity:60}},{label:"Invest most of it for long-term growth",scores:{security_growth:80,present_future:80,abundance_scarcity:80}},{label:"Use it for something I have been putting off",scores:{security_growth:40,present_future:10,abundance_scarcity:70}}]},
  {id:"q2",dimension:"security_growth",headline:"Your investments drop 28% in three months.",sub:"What do you actually do?",options:[{label:"Sell some to limit further losses",scores:{security_growth:10,emotional_risk:15}},{label:"Do nothing and wait it out",scores:{security_growth:55,emotional_risk:55}},{label:"Buy more while prices are lower",scores:{security_growth:90,emotional_risk:90}},{label:"Check obsessively but do not act",scores:{security_growth:35,emotional_risk:30}}]},
  {id:"q3",dimension:"present_future",headline:"You could either...",sub:"Which feels right?",options:[{label:"Have £500/month more to enjoy life now",scores:{present_future:10}},{label:"Have £500/month more going into your pension",scores:{present_future:90}},{label:"Pay off debts faster each month",scores:{present_future:50,security_growth:30}},{label:"Invest it in a Stocks and Shares ISA",scores:{present_future:75,security_growth:75}}]},
  {id:"q4",dimension:"present_future",headline:"Pension contributions.",sub:"Which is closest to you?",options:[{label:"I contribute the minimum, retirement feels far away",scores:{present_future:15}},{label:"I contribute what I can but do not maximise",scores:{present_future:50}},{label:"I maximise contributions, it is a real priority",scores:{present_future:90}},{label:"I have not set one up yet",scores:{present_future:10,abundance_scarcity:25}}]},
  {id:"q5",dimension:"systematic_intuitive",headline:"How do you make big financial decisions?",sub:"Buying a car, switching mortgage, investing.",options:[{label:"Research thoroughly, compare options, then decide",scores:{systematic_intuitive:10,simplicity_complexity:80}},{label:"Get a gut feel for it and commit fairly quickly",scores:{systematic_intuitive:85,simplicity_complexity:30}},{label:"Ask someone I trust first",scores:{systematic_intuitive:40,independent_collaborative:20}},{label:"Delay until I feel completely certain",scores:{systematic_intuitive:25,abundance_scarcity:25}}]},
  {id:"q6",dimension:"systematic_intuitive",headline:"Your relationship with budgeting.",sub:"Be honest.",options:[{label:"I have a clear budget and follow it",scores:{systematic_intuitive:10}},{label:"Rough idea, check in occasionally",scores:{systematic_intuitive:45}},{label:"Track spending after the fact, loosely",scores:{systematic_intuitive:65}},{label:"I do not track, I just know if I am okay",scores:{systematic_intuitive:90}}]},
  {id:"q7",dimension:"independent_collaborative",headline:"When it comes to financial advice.",sub:"What feels most true?",options:[{label:"I research everything myself",scores:{independent_collaborative:10}},{label:"I like a sounding board but decide alone",scores:{independent_collaborative:45}},{label:"I would value a trusted adviser",scores:{independent_collaborative:80}},{label:"I discuss money openly with close people",scores:{independent_collaborative:65}}]},
  {id:"q8",dimension:"abundance_scarcity",headline:"When you spend money on yourself.",sub:"A meal out, a holiday, something you want.",options:[{label:"I feel good, I work hard for this",scores:{abundance_scarcity:90}},{label:"Fine, but I am conscious of the cost",scores:{abundance_scarcity:60}},{label:"I often feel slightly guilty afterwards",scores:{abundance_scarcity:30}},{label:"I find it genuinely difficult to justify",scores:{abundance_scarcity:10}}]},
  {id:"q9",dimension:"abundance_scarcity",headline:"Do you feel financially behind?",sub:"Compared to where you think you should be.",options:[{label:"Rarely, I feel broadly on track",scores:{abundance_scarcity:85}},{label:"Sometimes, depending on my mood",scores:{abundance_scarcity:55}},{label:"Often, I worry I have not done enough",scores:{abundance_scarcity:30}},{label:"Almost always, it is a persistent anxiety",scores:{abundance_scarcity:10}}]},
  {id:"q10",dimension:"simplicity_complexity",headline:"Your ideal financial setup.",sub:"If you could design it from scratch.",options:[{label:"One account, one fund, one simple plan",scores:{simplicity_complexity:10}},{label:"A few accounts, clearly organised",scores:{simplicity_complexity:40}},{label:"Multiple accounts optimised for different purposes",scores:{simplicity_complexity:75}},{label:"A fully detailed portfolio I manage actively",scores:{simplicity_complexity:95}}]},
  {id:"q11",dimension:"emotional_risk",headline:"You have £20,000 to invest for 15 years.",sub:"Which would you actually choose?",options:[{label:"Guaranteed 3.5% per year in a cash ISA",scores:{emotional_risk:10,security_growth:10}},{label:"Cautious fund: expected 5%, could drop 15%",scores:{emotional_risk:35,security_growth:35}},{label:"Balanced fund: expected 7%, could drop 30%",scores:{emotional_risk:65,security_growth:65}},{label:"Adventurous fund: expected 9%, could drop 45%",scores:{emotional_risk:90,security_growth:90}}]},
  {id:"q12",dimension:"security_growth",headline:"Your honest relationship with money.",sub:"Which comes closest?",options:[{label:"Money is safety, having enough lets me stop worrying",scores:{security_growth:15,abundance_scarcity:25}},{label:"Money is a tool, I want it working efficiently",scores:{security_growth:55,systematic_intuitive:30}},{label:"Money is opportunity, I want to grow it aggressively",scores:{security_growth:85,abundance_scarcity:80}},{label:"Money is complicated, I wish I understood it better",scores:{abundance_scarcity:30,security_growth:40}}]},
]

function calcQuizPersonality(answers,state){
  const scores={security_growth:0,present_future:0,systematic_intuitive:0,independent_collaborative:0,abundance_scarcity:0,simplicity_complexity:0,emotional_risk:0}
  const counts={...scores}
  Object.entries(answers).forEach(([qId,optIdx])=>{
    const q=PERSONALITY_QUIZ.find(x=>x.id===qId);if(!q)return
    const sc=q.options[optIdx]?.scores||{}
    Object.entries(sc).forEach(([dim,val])=>{if(scores[dim]!==undefined){scores[dim]+=val;counts[dim]++}})
  })
  const norm={};Object.keys(scores).forEach(d=>{norm[d]=counts[d]>0?Math.round(scores[d]/counts[d]):50})
  const sg=norm.security_growth<35?"security":norm.security_growth>65?"growth":"balanced"
  const pf=norm.present_future<35?"present":norm.present_future>65?"future":"balanced"
  const si=norm.systematic_intuitive<35?"systematic":norm.systematic_intuitive>65?"intuitive":"balanced"
  const ic=norm.independent_collaborative<40?"collaborative":"independent"
  const as_=norm.abundance_scarcity<35?"scarcity":norm.abundance_scarcity>65?"abundance":"balanced"
  const sc_=norm.simplicity_complexity>65?"complexity":"simplicity"
  const er=norm.emotional_risk<35?"cautious":norm.emotional_risk>65?"adventurous":"balanced"

  const ARCHETYPES={
    "security-future-systematic":{id:"guardian",name:"The Guardian",emoji:"🛡️",color:T.green,headline:"Careful. Disciplined. Long game.",summary:"You prioritise security and play the long game. Your discipline around saving and protecting what you have is a genuine financial strength.",traits:["Strong savings discipline","Prefers certainty over high returns","Tracks spending carefully"],blind_spot:"Over-protecting can be costly. Cash savings lose value to inflation every year.",next_step:"Consider putting anything above 6 months emergency fund into a low-cost index fund."},
    "security-future-intuitive":{id:"cultivator",name:"The Cultivator",emoji:"🌱",color:T.teal,headline:"Building carefully, for the long run.",summary:"You have patience and discipline. You think ahead, contribute consistently, and feel most secure when the future is being taken care of.",traits:["Consistent long-term saver","Prioritises pension and future security","Values financial stability"],blind_spot:"Your focus on security can mean you under-invest in growth assets.",next_step:"Review whether your pension contribution rate is genuinely maximising your employer match."},
    "growth-future-intuitive":{id:"accelerator",name:"The Accelerator",emoji:"🚀",color:T.teal,headline:"Long game. High conviction.",summary:"You think in decades. Short-term noise does not worry you. You see market drops as opportunities and compound growth as the most powerful force in finance.",traits:["Comfortable with investment volatility","Makes decisions with confidence","Attracted to growth assets"],blind_spot:"Conviction can lead to skipping fundamentals like insurance or an adequate emergency fund.",next_step:"Check your emergency fund covers 3 months before adding more to investments."},
    "growth-future-systematic":{id:"navigator",name:"The Navigator",emoji:"🧭",color:T.purple,headline:"Methodical. Growth-focused. In control.",summary:"You combine growth ambition with systematic discipline. You research before you act and follow through. One of the most effective financial profiles.",traits:["Research-led investor","Clear financial goals with plans","Balances structure with growth"],blind_spot:"Analysis paralysis. Taking a reasonable action earlier beats researching indefinitely.",next_step:"Pick one financial goal and set an automated monthly contribution this week."},
    "growth-present-intuitive":{id:"grower",name:"The Grower",emoji:"⚡",color:T.amber,headline:"Momentum, instinct, opportunity.",summary:"You back yourself, spot opportunities, and are not afraid to act. You live well now and want to grow your wealth too. The tension is between present enjoyment and future building.",traits:["Acts on financial instinct","Comfortable with risk","Less likely to follow rigid budgets"],blind_spot:"Without structure, income can disappear into lifestyle even at high earning levels.",next_step:"Set up an automated transfer to a Stocks and Shares ISA on payday."},
    "security-present-systematic":{id:"architect",name:"The Architect",emoji:"🏗️",color:T.blue,headline:"Strong foundations. Deep knowledge.",summary:"You have done the reading. You understand the mechanics of personal finance. Your challenge is that knowledge does not always translate into action.",traits:["High financial literacy","Security-focused but curious about growth","Understands the long game"],blind_spot:"Knowledge without action is just expensive inaction. The perfect plan started late loses to the good plan started now.",next_step:"Identify the one decision you have been researching for 3+ months and make it this month."},
    "freedom-present-intuitive":{id:"opportunist",name:"The Opportunist",emoji:"🌊",color:T.amber,headline:"Bold. Fast-moving. Opportunity-first.",summary:"You see financial freedom as the goal and move decisively. The risk is that ambition without foundation can leave gaps that become expensive later.",traits:["High confidence in financial decisions","Moves quickly when opportunity feels right","Values independence"],blind_spot:"A single bad decision without foundations can undo years of bold gains. Foundations are leverage.",next_step:"Check: do you have 3 months expenses in accessible cash? If not, build that first."},
    "freedom-present-systematic":{id:"learner",name:"The Learner",emoji:"💡",color:T.purple,headline:"Curious. Growing. Getting started.",summary:"You are building your financial foundations with self-awareness. You are at the most important stage. The habits you build now will compound for decades.",traits:["Open to learning","Values simplicity and clear guidance","Responds well to small wins"],blind_spot:"Waiting until you understand everything perfectly. Starting small now beats a perfect plan started later.",next_step:"Open a Stocks and Shares ISA this month, even with a small amount."},
  }
  const key=`${sg==="balanced"?"growth":sg}-${pf==="balanced"?"future":pf}-${si==="balanced"?"systematic":si}`
  return{scores:norm,dimensions:{sg,pf,si,ic,as_,sc_,er},archetype:ARCHETYPES[key]||ARCHETYPES["freedom-present-systematic"],completedAt:new Date().toISOString()}
}

/* ══════════════════ STATE ══════════════════ */
const DEFAULTS={profile:{name:"",age:null,onboardingComplete:false,goal:null,situations:[],phaseTag:"Foundations",personalityResult:null,xp:0},learningProgress:{currentLevel:1,completedLevels:[],levelData:{}},assets:[],debts:[],income:{primary:0},spending:{monthly:0}}
const load=()=>{try{const s=localStorage.getItem("ls_v3");return s?{...DEFAULTS,...JSON.parse(s)}:DEFAULTS}catch{return DEFAULTS}}
const AppCtx=createContext(null)
const useApp=()=>useContext(AppCtx)

function AppProvider({children}){
  const[state,setState]=useState(load)
  const[tab,setTab]=useState(0)
  const[toastMsg,setToastMsg]=useState(null)
  function save(ns){const m={...DEFAULTS,...ns};setState(m);try{localStorage.setItem("ls_v3",JSON.stringify(m))}catch{}}
  function reset(){setState(DEFAULTS);try{localStorage.removeItem("ls_v3")}catch{}}
  function toast(msg,dur=2400){setToastMsg(msg);setTimeout(()=>setToastMsg(null),dur)}
  return(<AppCtx.Provider value={{state,save,reset,tab,setTab,toast}}>
    <style>{G}</style>{children}
    {toastMsg&&<div className="ls-fadein" style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,color:"#070D1A",fontWeight:700,fontSize:14,padding:"12px 24px",borderRadius:99,zIndex:9999,whiteSpace:"nowrap",pointerEvents:"none",boxShadow:`0 8px 32px rgba(15,191,184,.4)`}}>{toastMsg}</div>}
  </AppCtx.Provider>)
}

/* ══════════════════ SHARED UI ══════════════════ */
function Btn({children,onClick,disabled,style:sx={}}){return<button onClick={disabled?undefined:onClick} style={{width:"100%",padding:"16px 20px",borderRadius:16,fontFamily:"inherit",fontWeight:700,fontSize:15,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,border:"none",background:disabled?T.subtle:`linear-gradient(135deg,${T.teal},${T.tealMid})`,color:"#070D1A",letterSpacing:.3,transition:"all .15s",...sx}}>{children}</button>}
function StarField({count=28}){const stars=useMemo(()=>Array.from({length:Math.min(count,28)},(_,i)=>({x:(i*137.508)%100,y:(i*93.7+17)%100,size:i%9===0?2.2:i%5===0?1.6:1,delay:(i*0.6)%6,dur:2+((i*0.9)%4),tint:i%13===0?"rgba(15,191,184,.7)":i%9===0?"rgba(167,139,250,.6)":"rgba(255,255,255,.7)"})),[count]);return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}><div style={{position:"absolute",top:"-30%",left:"-20%",width:"80%",height:"80%",background:"radial-gradient(ellipse,rgba(167,139,250,.05) 0%,transparent 65%)"}}/>
{stars.map((s,i)=><div key={i} className="ls-star" style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:s.tint,"--d":`${s.dur}s`,"--dl":`${s.delay}s`}}/>)}</div>)}
function Sheet({title,onClose,children}){return(<div className="ls-fadein" style={{position:"fixed",inset:0,background:"rgba(7,13,26,.8)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ls-fadein" style={{background:T.surface,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:600,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",border:`1px solid ${T.border}`,borderBottom:"none"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 22px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}><p style={{color:T.white,fontWeight:800,fontSize:17}}>{title}</p><button onClick={onClose} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><X size={20}/></button></div><div style={{flex:1,overflowY:"auto",padding:"22px"}}>{children}</div></div></div>)}
function Confetti({active}){if(!active)return null;const ps=Array.from({length:30},(_,i)=>({id:i,x:Math.random()*100,color:[T.teal,T.purple,T.amber,T.green,T.blue,"#F472B6"][Math.floor(Math.random()*6)],delay:Math.random()*0.4,size:6+Math.random()*6}));return(<div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none",overflow:"hidden"}}>{ps.map(p=><div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:Math.random()>0.5?"50%":"2px",animation:`confettiFall 1.4s ${p.delay}s ease-in forwards`}}/>)}</div>)}

/* ══════════════════ ONBOARDING ══════════════════ */
function Onboarding(){
  const{state,save}=useApp()
  const[screen,setScreen]=useState("goal")
  const[goal,setGoal]=useState(null)
  const[situations,setSituations]=useState([])
  const[name,setName]=useState("")
  const[age,setAge]=useState("")
  const GOALS=[{id:"understand",emoji:"🗺️",label:"Understand money",sub:"Nobody ever taught me"},{id:"budgeting",emoji:"💸",label:"Know where my money goes"},{id:"debt",emoji:"🧯",label:"Get out of debt"},{id:"investing",emoji:"📈",label:"Start investing or grow savings"},{id:"home",emoji:"🏠",label:"Buy a home or reach a big goal"},{id:"admin",emoji:"📋",label:"Sort my tax, pension or admin"}]
  const SITS=[{id:"employed",emoji:"💼",label:"Employed"},{id:"student",emoji:"🎓",label:"Student or just graduated"},{id:"selfemployed",emoji:"🧾",label:"Self-employed"},{id:"faith",emoji:"🌙",label:"My faith shapes my finances"},{id:"family",emoji:"👨‍👩‍👧",label:"Family situation changed"},{id:"newuk",emoji:"🌍",label:"New to the UK"}]
  function toggleSit(id){setSituations(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])}
  function finish(){save({...state,profile:{...state.profile,name:name||"Friend",age:parseInt(age)||null,onboardingComplete:true,goal,situations,currentLevel:1,completedLevels:[],phaseTag:"Foundations",xp:0}})}

  if(screen==="goal")return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={20}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"60px 24px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <div className="ls-float" style={{fontSize:48,marginBottom:20,textAlign:"center"}}>🚀</div>
        <h1 style={{color:"#FFF",fontWeight:900,fontSize:"clamp(24px,6vw,32px)",lineHeight:1.1,marginBottom:8,textAlign:"center",letterSpacing:-.5}}>What do you most want to sort out?</h1>
        <p style={{color:T.muted,fontSize:14,textAlign:"center",marginBottom:28}}>Your starting point. Everything else is still here.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {GOALS.map(g=>{const sel=goal===g.id;return(<button key={g.id} onClick={()=>setGoal(g.id)} style={{background:sel?`${T.teal}12`:"rgba(255,255,255,.03)",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.06)"}`,borderRadius:18,padding:"16px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s",display:"flex",alignItems:"center",gap:16}}>
            <span style={{fontSize:26,flexShrink:0}}>{g.emoji}</span>
            <div style={{flex:1}}><p style={{color:sel?"#FFF":"#C8D8EC",fontWeight:700,fontSize:15}}>{g.label}</p>{g.sub&&<p style={{color:sel?"#8FA3BE":"#4A6080",fontSize:12,marginTop:2}}>{g.sub}</p>}</div>
            <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.15)"}`,background:sel?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<div style={{width:8,height:8,borderRadius:"50%",background:"#070D1A"}}/>}</div>
          </button>)})}
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:480,margin:"0 auto",width:"100%"}}><Btn onClick={()=>{if(goal)setScreen("situation")}} disabled={!goal}>Continue</Btn></div>
    </div>)

  if(screen==="situation")return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={18}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"50px 24px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <h1 style={{color:"#FFF",fontWeight:900,fontSize:"clamp(24px,6vw,32px)",lineHeight:1.1,marginBottom:8,letterSpacing:-.5}}>What describes you right now?</h1>
        <p style={{color:T.muted,fontSize:14,marginBottom:6}}>Select everything that applies.</p>
        <span style={{display:"inline-block",background:T.amberDim,color:T.amber,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,border:`1px solid ${T.amberBorder}`,marginBottom:24}}>Pick as many as you like</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {SITS.map(s=>{const sel=situations.includes(s.id);return(<button key={s.id} onClick={()=>toggleSit(s.id)} style={{background:sel?`${T.teal}10`:"rgba(255,255,255,.03)",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.06)"}`,borderRadius:18,padding:"20px 14px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",position:"relative"}}>
            <div style={{position:"absolute",top:10,right:10,width:20,height:20,borderRadius:"50%",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.12)"}`,background:sel?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{sel&&<Check size={12} color="#070D1A"/>}</div>
            <span style={{fontSize:32,display:"block",marginBottom:8}}>{s.emoji}</span>
            <p style={{color:sel?"#FFF":"#8FA3BE",fontWeight:600,fontSize:13,lineHeight:1.3}}>{s.label}</p>
          </button>)})}
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <Btn onClick={()=>setScreen("name")}>Continue</Btn>
        <button onClick={()=>setScreen("goal")} style={{background:"none",border:"none",color:"#344D68",fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%",marginTop:12,padding:8}}>Back</button>
      </div>
    </div>)

  if(screen==="name")return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={16}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"50px 28px 20px",maxWidth:460,margin:"0 auto",width:"100%"}}>
        <h1 style={{color:"#FFF",fontWeight:900,fontSize:"clamp(24px,6vw,32px)",lineHeight:1.1,marginBottom:6,letterSpacing:-.5}}>Last one. Make this yours.</h1>
        <p style={{color:T.muted,fontSize:14,marginBottom:28}}>No email. No password. Just your name and age.</p>
        <div style={{display:"flex",gap:12,marginBottom:12}}>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="First name" autoFocus style={{flex:2,background:"rgba(255,255,255,.04)",border:`2px solid ${name?T.teal:"rgba(255,255,255,.08)"}`,borderRadius:16,padding:"17px 20px",color:"#FFF",fontSize:18,fontWeight:700,fontFamily:"inherit",outline:"none"}}/>
          <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" min="16" max="80" style={{flex:1,background:"rgba(255,255,255,.04)",border:`2px solid ${age?T.teal:"rgba(255,255,255,.08)"}`,borderRadius:16,padding:"17px 16px",color:"#FFF",fontSize:18,fontWeight:700,fontFamily:"inherit",outline:"none",textAlign:"center"}}/>
        </div>
        <p style={{color:"#344D68",fontSize:12,marginBottom:20}}>Age matters. A 22-year-old and a 34-year-old need genuinely different advice.</p>
        {(goal||situations.length>0)&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
          {goal&&<span style={{background:T.tealDim,color:T.teal,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,border:`1px solid ${T.tealBorder}`}}>{GOALS.find(g=>g.id===goal)?.emoji} {GOALS.find(g=>g.id===goal)?.label}</span>}
          {situations.map(s=>{const sit=SITS.find(x=>x.id===s);return sit?<span key={s} style={{background:T.purpleDim,color:T.purple,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,border:`1px solid ${T.purpleBorder}`}}>{sit.emoji} {sit.label}</span>:null})}
        </div>}
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 28px 48px",maxWidth:460,margin:"0 auto",width:"100%"}}>
        <Btn onClick={()=>{if(name&&age)setScreen("summary")}} disabled={!name||!age}>Show me my plan →</Btn>
        <button onClick={()=>setScreen("situation")} style={{background:"none",border:"none",color:"#344D68",fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%",marginTop:12,padding:8}}>Back</button>
      </div>
    </div>)

  if(screen==="summary"){
    const gc=GOAL_CONTENT[goal]||GOAL_CONTENT.understand
    const isHalal=situations.includes("faith")
    return(
      <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
        <StarField count={24}/>
        <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"50px 24px 20px",maxWidth:500,margin:"0 auto",width:"100%"}}>
          <span style={{display:"inline-block",background:T.greenDim,color:T.green,fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:99,border:`1px solid rgba(52,211,153,.3)`,marginBottom:20}}>Your plan is ready, {name}</span>
          <h1 style={{color:"#FFF",fontWeight:900,fontSize:"clamp(22px,5vw,28px)",lineHeight:1.2,marginBottom:10,letterSpacing:-.3}}>{gc.headline}</h1>
          <p style={{color:T.muted,fontSize:14,lineHeight:1.5,marginBottom:24}}>Here is what LifeSmart will help you change.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
            {gc.cards.map((c,i)=><div key={i} style={{background:`${c.color}10`,border:`1.5px solid ${c.color}30`,borderRadius:18,padding:"18px 20px"}}><p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.55,fontWeight:500}}>{c.text}</p></div>)}
            {isHalal&&<div style={{background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:18,padding:"18px 20px"}}><p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.55}}>🌙 Your faith shapes your finances, and we have built for that. Halal options are explained clearly throughout.</p></div>}
          </div>
          <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>What you will be able to do</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {gc.bullets.map((b,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}><div style={{width:22,height:22,borderRadius:"50%",background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><Check size={12} color={T.teal}/></div><p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.5}}>{b}</p></div>)}
          </div>
          {/* How levels work */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px 20px",marginBottom:24}}>
            <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:10}}>How it works</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{emoji:"⚡",text:"15 levels, each with short interactive lessons"},{emoji:"🎬",text:"Videos that explain concepts in 2 to 3 minutes"},{emoji:"✅",text:"A real action at each level that changes your finances"},{emoji:"🧠",text:"A money personality quiz to understand yourself"}].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{item.emoji}</span><p style={{color:"#C8D8EC",fontSize:13}}>{item.text}</p></div>
              ))}
            </div>
            <p style={{color:T.muted,fontSize:12,marginTop:12}}>Someone who completes all 15 levels is not just financially literate. They are financially sorted.</p>
          </div>
        </div>
        <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:500,margin:"0 auto",width:"100%"}}>
          <Btn onClick={finish}>Let's start →</Btn>
          <p style={{color:"#344D68",fontSize:11,textAlign:"center",marginTop:14}}>First step takes 10 minutes. The impact lasts decades.</p>
        </div>
      </div>)
  }
  return null
}



/* ═══════════════════════════════════════════════════════
   LEVEL PLAYER — 4-part structure: Learn, Data, Output, Action
   ═══════════════════════════════════════════════════════ */
function LevelPlayer({level,onBack}){
  const{state,save,toast}=useApp()
  const lp=state.learningProgress||{currentLevel:1,completedLevels:[],levelData:{}}
  const ld=lp.levelData?.[`level${level.n}`]||{}
  const[tab,setTab]=useState("learn")
  const[showConfetti,setShowConfetti]=useState(false)
  const pc=PC[level.phase]||T.teal

  // Data state for this level
  const[data,setData]=useState(ld)
  function updateData(key,val){setData(prev=>{const n={...prev,[key]:val};saveLevelData(n);return n})}
  function updateNested(group,key,val){setData(prev=>{const n={...prev,[group]:{...(prev[group]||{}),[key]:val}};saveLevelData(n);return n})}

  function saveLevelData(d){
    const newLP={...lp,levelData:{...lp.levelData,[`level${level.n}`]:d}}
    save({...state,learningProgress:newLP})
  }

  function completeLevel(){
    const newCompleted=[...(lp.completedLevels||[])];if(!newCompleted.includes(level.n))newCompleted.push(level.n)
    const newLP={...lp,currentLevel:Math.min(Math.max(level.n+1,lp.currentLevel||1),9),completedLevels:newCompleted,levelData:{...lp.levelData,[`level${level.n}`]:{...data,completed:true}}}
    save({...state,learningProgress:newLP,profile:{...state.profile,xp:(state.profile.xp||0)+80}})
    setShowConfetti(true);setTimeout(()=>setShowConfetti(false),2000)
    toast("🎉 Level "+level.n+" complete! +80 XP")
  }

  const isComplete=data.completed||(lp.completedLevels||[]).includes(level.n)
  const TABS=[{id:"learn",label:"Learn",icon:"📖"},{id:"data",label:"Your Numbers",icon:"📊"},{id:"output",label:"Results",icon:"📈"},{id:"action",label:"Action",icon:"✅"}]

  return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <Confetti active={showConfetti}/>
      {/* Header */}
      <div style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
        <div style={{flex:1}}><p style={{color:pc,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{level.phase} · Level {level.n}</p><p style={{color:T.white,fontWeight:800,fontSize:15}}>{level.title}</p></div>
        {isComplete&&<span style={{background:T.greenDim,color:T.green,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99}}>✓ Done</span>}
      </div>

      {/* Section tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surface,flexShrink:0}}>
        {TABS.map(t=>{const active=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",padding:"12px 8px",cursor:"pointer",fontFamily:"inherit",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            <span style={{fontSize:12}}>{t.icon}</span>
            <span style={{fontSize:11,fontWeight:active?700:500,color:active?T.teal:T.muted}}>{t.label}</span>
            {active&&<div style={{position:"absolute",bottom:0,left:"10%",right:"10%",height:2,borderRadius:2,background:T.teal}}/>}
          </button>
        )})}
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"20px 18px"}}>

          {/* LEARN TAB */}
          {tab==="learn"&&(
            <div className="ls-fadein">
              <p style={{color:"#C8D8EC",fontSize:14,lineHeight:1.6,marginBottom:20}}>{level.hook}</p>
              {level.sections.map((s,i)=>(
                <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:14}}>
                  <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:10}}>{s.title}</p>
                  {s.content.split("\n\n").map((para,j)=><p key={j} style={{color:"#C8D8EC",fontSize:14,lineHeight:1.65,marginBottom:j<s.content.split("\n\n").length-1?12:0}}>{para}</p>)}
                  {s.columns&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
                      {s.columns.map((col,ci)=>(
                        <div key={ci} style={{background:T.surface,borderRadius:12,padding:"12px"}}>
                          <p style={{color:ci===0?T.green:T.amber,fontWeight:700,fontSize:12,marginBottom:8}}>{col.label}</p>
                          {col.items.map((item,ii)=><p key={ii} style={{color:"#C8D8EC",fontSize:12,marginBottom:4}}>· {item}</p>)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Videos */}
              {level.videos.length>0&&(
                <div style={{marginTop:8}}>
                  <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:10}}>🎬 Videos</p>
                  {level.videos.map((v,i)=>(
                    <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                      <Play size={16} color={v.role==="core"?T.teal:T.purple}/>
                      <div style={{flex:1}}><p style={{color:T.white,fontWeight:600,fontSize:13}}>{v.title}</p><p style={{color:T.muted,fontSize:11}}>{v.role==="core"?"Core":"Go deeper"} · {v.min} min</p></div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={()=>setTab("data")} style={{width:"100%",marginTop:16,background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Enter your numbers →</button>
            </div>
          )}

          {/* DATA TAB */}
          {tab==="data"&&(
            <div className="ls-fadein">
              {level.n===1&&<Level1DataEntry data={data} updateNested={updateNested}/>}
              {level.n===2&&<Level2DataEntry data={data} updateNested={updateNested} updateData={updateData}/>}
              {level.n===5&&<Level5DataEntry data={data} updateData={updateData}/>}
              {level.n===9&&<Level9DataEntry data={data} updateNested={updateNested} age={state.profile?.age}/>}
              {![1,2,5,9].includes(level.n)&&(
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <p style={{fontSize:40,marginBottom:12}}>📊</p>
                  <p style={{color:T.white,fontWeight:700,fontSize:16,marginBottom:6}}>Data entry for this level</p>
                  <p style={{color:T.muted,fontSize:13}}>Review the educational content first, then complete the action to finish this level.</p>
                </div>
              )}
              <button onClick={()=>setTab("output")} style={{width:"100%",marginTop:16,background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>See your results →</button>
            </div>
          )}

          {/* OUTPUT TAB */}
          {tab==="output"&&(
            <div className="ls-fadein">
              {level.n===1&&<Level1Outputs data={data} age={state.profile?.age}/>}
              {level.n===2&&<Level2Outputs data={data}/>}
              {level.n===9&&<Level9Outputs data={data} age={state.profile?.age} state={state}/>}
              {![1,2,9].includes(level.n)&&(
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <p style={{fontSize:40,marginBottom:12}}>📈</p>
                  <p style={{color:T.white,fontWeight:700,fontSize:16,marginBottom:6}}>Complete data entry to see your results</p>
                  <p style={{color:T.muted,fontSize:13}}>Charts and insights appear here once you enter your numbers.</p>
                </div>
              )}
              <button onClick={()=>setTab("action")} style={{width:"100%",marginTop:16,background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>See the action →</button>
            </div>
          )}

          {/* ACTION TAB */}
          {tab==="action"&&(
            <div className="ls-fadein">
              <div style={{background:`${pc}10`,border:`1.5px solid ${pc}30`,borderRadius:20,padding:"24px",marginBottom:16}}>
                <p style={{color:pc,fontWeight:800,fontSize:13,letterSpacing:.5,textTransform:"uppercase",marginBottom:10}}>Your action</p>
                <p style={{color:"#E2EAF6",fontSize:15,lineHeight:1.65,marginBottom:16}}>{level.action}</p>
                <div style={{background:"rgba(0,0,0,.2)",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
                  <p style={{color:T.muted,fontSize:12,fontWeight:700,marginBottom:4}}>Done when:</p>
                  <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>{level.doneWhen}</p>
                </div>
                {!isComplete?
                  <button onClick={completeLevel} style={{width:"100%",background:T.teal,border:"none",borderRadius:14,padding:"16px",color:"#070D1A",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>I have done this ✓</button>:
                  <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}><Check size={20} color={T.green}/><p style={{color:T.green,fontWeight:800,fontSize:16}}>Level complete!</p></div>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DATA ENTRY COMPONENTS
   ═══════════════════════════════════════════════════════ */
function CurrInput({label,hint,value,onChange}){
  const[raw,setRaw]=useState(value>0?String(value):"")
  useEffect(()=>{if(value===0||value===null)setRaw("")},[value])
  return(
    <div style={{marginBottom:12}}>
      <p style={{color:"#C8D8EC",fontSize:12,fontWeight:600,marginBottom:5}}>{label}</p>
      <div style={{display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <span style={{padding:"0 12px",color:T.muted,fontSize:15,fontWeight:700}}>£</span>
        <input type="number" min="0" value={raw} placeholder="0"
          onChange={e=>{setRaw(e.target.value);onChange(parseFloat(e.target.value)||0)}}
          style={{flex:1,background:"transparent",border:"none",outline:"none",color:T.white,fontSize:15,fontWeight:600,padding:"12px 12px 12px 0",fontFamily:"inherit"}}/>
      </div>
      {hint&&<p style={{color:T.subtle,fontSize:11,marginTop:3}}>{hint}</p>}
    </div>
  )
}

function Level1DataEntry({data,updateNested}){
  const assets=data.assets||{};const liabs=data.liabilities||{}
  return(<div>
    <p style={{color:T.green,fontWeight:800,fontSize:15,marginBottom:12}}>Assets (what you own)</p>
    {[{id:"cash",label:"Cash / current accounts"},{id:"savings",label:"Savings accounts"},{id:"pension",label:"Pension value",hint:"Check pension app"},{id:"stocksIsa",label:"Stocks & ISA"},{id:"propertyValue",label:"Property value",hint:"Zoopla estimate"},{id:"carValue",label:"Car value",hint:"Autotrader value"},{id:"other",label:"Other assets"}].map(f=>
      <CurrInput key={f.id} label={f.label} hint={f.hint} value={assets[f.id]||0} onChange={v=>updateNested("assets",f.id,v)}/>
    )}
    <p style={{color:T.red,fontWeight:800,fontSize:15,marginTop:20,marginBottom:12}}>Liabilities (what you owe)</p>
    {[{id:"mortgage",label:"Mortgage remaining"},{id:"creditCards",label:"Credit card balances"},{id:"carFinance",label:"Car finance"},{id:"personalLoans",label:"Personal loans"},{id:"studentLoan",label:"Student loan",hint:"gov.uk/student-loan-repayment"},{id:"otherDebt",label:"Other debt"}].map(f=>
      <CurrInput key={f.id} label={f.label} hint={f.hint} value={liabs[f.id]||0} onChange={v=>updateNested("liabilities",f.id,v)}/>
    )}
  </div>)
}

function Level2DataEntry({data,updateNested,updateData}){
  const inc=data.income||{};const fixed=data.fixed||{};const variable=data.variable||{}
  const[subs,setSubs]=useState(data.subscriptions||[])
  const[subName,setSubName]=useState("");const[subAmt,setSubAmt]=useState("")
  function addSub(){if(subName&&subAmt){const ns=[...subs,{name:subName,amount:parseFloat(subAmt)||0}];setSubs(ns);updateData("subscriptions",ns);setSubName("");setSubAmt("")}}
  function removeSub(i){const ns=subs.filter((_,j)=>j!==i);setSubs(ns);updateData("subscriptions",ns)}
  return(<div>
    <p style={{color:T.teal,fontWeight:800,fontSize:15,marginBottom:12}}>Income</p>
    {[{id:"takeHome",label:"Monthly take-home pay",hint:"What hits your bank"},{id:"sideIncome",label:"Side income (monthly avg)"},{id:"benefits",label:"Benefits / tax credits"},{id:"rentalIncome",label:"Rental income"},{id:"interest",label:"Interest / dividends"},{id:"otherIncome",label:"Other income"}].map(f=>
      <CurrInput key={f.id} label={f.label} hint={f.hint} value={inc[f.id]||0} onChange={v=>updateNested("income",f.id,v)}/>
    )}
    <p style={{color:T.amber,fontWeight:800,fontSize:15,marginTop:20,marginBottom:12}}>Fixed spending</p>
    {[{id:"rent",label:"Rent / mortgage"},{id:"gasElec",label:"Gas & electricity"},{id:"water",label:"Water"},{id:"councilTax",label:"Council tax"},{id:"phone",label:"Phone"},{id:"internet",label:"Internet"},{id:"transport",label:"Transport"},{id:"insurance",label:"Insurance (total)"}].map(f=>
      <CurrInput key={f.id} label={f.label} value={fixed[f.id]||0} onChange={v=>updateNested("fixed",f.id,v)}/>
    )}
    <p style={{color:T.purple,fontWeight:800,fontSize:15,marginTop:20,marginBottom:12}}>Subscriptions</p>
    {subs.map((s,i)=>(
      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,background:T.card,borderRadius:10,padding:"10px 14px"}}>
        <p style={{color:T.white,fontSize:13,flex:1}}>{s.name}</p>
        <p style={{color:T.amber,fontWeight:700,fontSize:13}}>£{s.amount}</p>
        <button onClick={()=>removeSub(i)} style={{background:"none",border:"none",color:T.red,cursor:"pointer",padding:2}}><X size={14}/></button>
      </div>
    ))}
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      <input value={subName} onChange={e=>setSubName(e.target.value)} placeholder="Name" style={{flex:2,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
      <input type="number" value={subAmt} onChange={e=>setSubAmt(e.target.value)} placeholder="£" style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:"inherit",outline:"none",textAlign:"center"}}/>
      <button onClick={addSub} style={{background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"10px 14px",color:T.teal,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
    </div>
    <p style={{color:T.blue,fontWeight:800,fontSize:15,marginTop:8,marginBottom:12}}>Variable spending</p>
    {[{id:"groceries",label:"Groceries"},{id:"eatingOut",label:"Eating out / takeaways"},{id:"clothing",label:"Clothing / shopping"},{id:"entertainment",label:"Entertainment"},{id:"personalCare",label:"Personal care"},{id:"otherVar",label:"Other"}].map(f=>
      <CurrInput key={f.id} label={f.label} value={variable[f.id]||0} onChange={v=>updateNested("variable",f.id,v)}/>
    )}
  </div>)
}

function Level5DataEntry({data,updateData}){
  const[debts,setDebts]=useState(data.debts||[])
  const[name,setName]=useState("");const[bal,setBal]=useState("");const[apr,setApr]=useState("");const[minP,setMinP]=useState("")
  function addDebt(){if(name&&bal){const nd=[...debts,{name,balance:parseFloat(bal)||0,apr:parseFloat(apr)||0,minPayment:parseFloat(minP)||0}];setDebts(nd);updateData("debts",nd);setName("");setBal("");setApr("");setMinP("")}}
  return(<div>
    <p style={{color:T.red,fontWeight:800,fontSize:15,marginBottom:12}}>Your debts</p>
    {debts.map((d,i)=>(
      <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{color:T.white,fontWeight:700,fontSize:14}}>{d.name}</p>
          <button onClick={()=>{const nd=debts.filter((_,j)=>j!==i);setDebts(nd);updateData("debts",nd)}} style={{background:"none",border:"none",color:T.muted,cursor:"pointer"}}><X size={14}/></button>
        </div>
        <div style={{display:"flex",gap:16,marginTop:6}}>
          <p style={{color:T.red,fontSize:13}}>£{d.balance.toLocaleString()}</p>
          <p style={{color:T.amber,fontSize:13}}>{d.apr}% APR</p>
          <p style={{color:T.muted,fontSize:13}}>Min £{d.minPayment}/mo</p>
        </div>
      </div>
    ))}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px",marginTop:8}}>
      <p style={{color:T.muted,fontSize:12,fontWeight:700,marginBottom:8}}>Add a debt</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Barclaycard" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
        <div style={{display:"flex",gap:8}}>
          <input type="number" value={bal} onChange={e=>setBal(e.target.value)} placeholder="Balance £" style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
          <input type="number" value={apr} onChange={e=>setApr(e.target.value)} placeholder="APR %" style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
          <input type="number" value={minP} onChange={e=>setMinP(e.target.value)} placeholder="Min £/mo" style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
        </div>
        <button onClick={addDebt} style={{background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:10,padding:"10px",color:T.teal,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Add debt</button>
      </div>
    </div>
  </div>)
}

function Level9DataEntry({data,updateNested,age}){
  const inv=data.investing||{}
  return(<div>
    <p style={{color:T.green,fontWeight:800,fontSize:15,marginBottom:12}}>Your investing plan</p>
    <CurrInput label="Monthly investment amount" hint="From your surplus" value={inv.monthlyInvestment||0} onChange={v=>updateNested("investing","monthlyInvestment",v)}/>
    <CurrInput label="Any existing ISA balance" value={inv.currentISA||0} onChange={v=>updateNested("investing","currentISA",v)}/>
    <div style={{marginBottom:12}}>
      <p style={{color:"#C8D8EC",fontSize:12,fontWeight:600,marginBottom:5}}>Target age to stop working</p>
      <input type="range" min="50" max="70" value={inv.targetAge||65} onChange={e=>updateNested("investing","targetAge",parseInt(e.target.value))}
        style={{width:"100%",accentColor:T.teal}}/>
      <p style={{color:T.teal,fontWeight:800,fontSize:18,textAlign:"center"}}>{inv.targetAge||65}</p>
    </div>
  </div>)
}


/* ═══════════════════════════════════════════════════════
   OUTPUT COMPONENTS (Recharts)
   ═══════════════════════════════════════════════════════ */
const fmt=v=>{if(v==null||isNaN(v))return"£0";const a=Math.abs(Math.round(v)).toLocaleString("en-GB");return v<0?`-£${a}`:`£${a}`}
const fmtK=v=>{if(v==null||isNaN(v))return"£0";const a=Math.abs(v);return a>=1000000?`£${(a/1e6).toFixed(1)}M`:a>=1000?`£${(a/1000).toFixed(0)}k`:`£${Math.round(a)}`}
const CHART_COLORS=[T.teal,T.green,T.amber,T.purple,T.blue,T.red,"#F472B6"]

function Level1Outputs({data,age}){
  const assets=data.assets||{};const liabs=data.liabilities||{}
  const totalA=Object.values(assets).reduce((s,v)=>s+(v||0),0)
  const totalL=Object.values(liabs).reduce((s,v)=>s+(v||0),0)
  const nw=totalA-totalL
  const productive=(assets.cash||0)+(assets.savings||0)+(assets.pension||0)+(assets.stocksIsa||0)
  const lifestyle=(assets.propertyValue||0)+(assets.carValue||0)+(assets.other||0)
  const median=getMedian(age)
  const userAge=age||30

  if(totalA===0&&totalL===0) return(
    <div style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{filter:"blur(6px)",opacity:.3,marginBottom:16}}>
        <div style={{width:120,height:120,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal}30,${T.purple}30)`,margin:"0 auto"}}/>
      </div>
      <p style={{color:T.white,fontWeight:700,fontSize:16}}>Enter your numbers to see your picture</p>
      <p style={{color:T.muted,fontSize:13,marginTop:6}}>Go to the Your Numbers tab to get started.</p>
    </div>)

  // Projection data
  const monthlyGrowth=500
  const projData=[];let val=nw;for(let y=0;y<=Math.max(70-userAge,10);y++){projData.push({age:userAge+y,slow:Math.round(nw+y*200*12),moderate:Math.round(nw+y*500*12*(1+0.05*y/2)),fast:Math.round(nw+y*1000*12*(1+0.07*y/2))});val=val+monthlyGrowth*12}

  // Pie data
  const pieData=[];if(productive>0)pieData.push({name:"Productive",value:productive,fill:T.teal});if(lifestyle>0)pieData.push({name:"Lifestyle",value:lifestyle,fill:T.amber});if(totalL>0)pieData.push({name:"Liabilities",value:totalL,fill:T.red})

  // Asset breakdown
  const assetBars=Object.entries(assets).filter(([,v])=>v>0).map(([k,v],i)=>({name:k.replace(/([A-Z])/g," $1").trim(),value:v,fill:CHART_COLORS[i%7]}))

  return(<div>
    {/* Net worth hero */}
    <div style={{textAlign:"center",marginBottom:24}}>
      <p style={{color:T.muted,fontSize:14,fontWeight:600,marginBottom:6}}>Your net worth today</p>
      <p style={{fontSize:"clamp(36px,8vw,52px)",fontWeight:900,color:nw>=0?T.teal:T.red,lineHeight:1,textShadow:nw>=0?`0 0 40px ${T.teal}40`:`0 0 40px ${T.red}30`}}>{fmt(nw)}</p>
    </div>

    {/* Donut */}
    {pieData.length>0&&(
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
        <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:12}}>Composition</p>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{width:120,height:120,flexShrink:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                {pieData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Pie></PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{flex:1}}>
            {pieData.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:d.fill}}/><p style={{color:"#C8D8EC",fontSize:12}}>{d.name}</p></div>
              <p style={{color:d.fill,fontWeight:700,fontSize:12}}>{fmt(d.value)}</p>
            </div>)}
          </div>
        </div>
      </div>
    )}

    {/* Asset breakdown bar */}
    {assetBars.length>0&&(
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
        <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:12}}>Asset breakdown</p>
        <div style={{height:140}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetBars} layout="vertical" margin={{left:0,right:10}}>
              <XAxis type="number" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#C8D8EC"}} axisLine={false} tickLine={false} width={80}/>
              <Tooltip formatter={v=>fmt(v)} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white}}/>
              <Bar dataKey="value" radius={[0,6,6,0]}>{assetBars.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {/* Age comparison */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
      <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:8}}>👥 UK comparison</p>
      <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>
        The median net worth for someone aged {userAge} in the UK is approximately <strong style={{color:T.teal}}>{fmt(median)}</strong>.
        {nw>=median?" You are above the median. Tracking puts you on a path to pull ahead.":" Tracking is the first step. People who measure consistently close the gap faster."}
      </p>
    </div>

    {/* Projection */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
      <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:4}}>📈 Where could you be?</p>
      <p style={{color:T.muted,fontSize:12,marginBottom:14}}>Three scenarios based on monthly net worth growth</p>
      <div style={{height:200}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs>
              <linearGradient id="gFast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="age" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={42}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={v=>`Age ${v}`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white}}/>
            <Area type="monotone" dataKey="fast" stroke={T.teal} strokeWidth={2} fill="url(#gFast)" dot={false} name="Fast (£1k/mo)"/>
            <Area type="monotone" dataKey="moderate" stroke={T.amber} strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} name="Moderate (£500/mo)"/>
            <Area type="monotone" dataKey="slow" stroke={T.muted} strokeWidth={1} fill="none" strokeDasharray="2 4" dot={false} name="Slow (£200/mo)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:3,background:T.teal,borderRadius:2}}/><span style={{color:"#C8D8EC",fontSize:10}}>£1,000/mo</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:0,borderTop:`2px dashed ${T.amber}`}}/><span style={{color:"#C8D8EC",fontSize:10}}>£500/mo</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:0,borderTop:`1px dashed ${T.muted}`}}/><span style={{color:"#C8D8EC",fontSize:10}}>£200/mo</span></div>
      </div>
    </div>

    {/* Personalised paragraph */}
    <div style={{background:`${nw>=0?T.teal:T.amber}10`,border:`1px solid ${nw>=0?T.tealBorder:T.amberBorder}`,borderRadius:18,padding:"20px"}}>
      <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6}}>
        {nw<0?"Your net worth is "+fmt(nw)+". This means your debts currently outweigh what you own, which is more common in your 20s than you would think. Your income is your biggest asset right now. The good news: the plan from here is clear. Level 5 deals with debt directly.":
         nw<50000?"You are net positive, which puts you ahead of many people your age. The projection above shows what consistent, intentional decisions could do to this number over the next 20 to 30 years.":
         "You have built a solid foundation. The focus now is making sure your assets are working as hard as possible, and that the right proportion is in productive, growing assets."}
      </p>
    </div>
  </div>)
}

function Level2Outputs({data}){
  const inc=data.income||{};const fixed=data.fixed||{};const variable=data.variable||{};const subs=data.subscriptions||[]
  const totalIncome=Object.values(inc).reduce((s,v)=>s+(v||0),0)
  const totalFixed=Object.values(fixed).reduce((s,v)=>s+(v||0),0)
  const totalSubs=subs.reduce((s,x)=>s+(x.amount||0),0)
  const totalVar=Object.values(variable).reduce((s,v)=>s+(v||0),0)
  const totalSpend=totalFixed+totalSubs+totalVar
  const surplus=totalIncome-totalSpend

  if(totalIncome===0) return(
    <div style={{textAlign:"center",padding:"40px 20px"}}>
      <div style={{filter:"blur(6px)",opacity:.3,marginBottom:16}}><div style={{width:120,height:30,borderRadius:6,background:`linear-gradient(90deg,${T.teal}40,${T.amber}40,${T.purple}40)`,margin:"0 auto"}}/></div>
      <p style={{color:T.white,fontWeight:700,fontSize:16}}>Enter your income and spending</p>
      <p style={{color:T.muted,fontSize:13,marginTop:6}}>Go to Your Numbers to get started.</p>
    </div>)

  const barData=[{name:"Income",value:totalIncome,fill:T.teal}];if(totalFixed>0)barData.push({name:"Fixed",value:totalFixed,fill:T.amber});if(totalSubs>0)barData.push({name:"Subs",value:totalSubs,fill:T.purple});if(totalVar>0)barData.push({name:"Variable",value:totalVar,fill:T.blue});if(surplus>0)barData.push({name:"Surplus",value:surplus,fill:T.green})

  const spendPct=totalIncome>0?Math.round(totalSpend/totalIncome*100):0

  return(<div>
    {/* Surplus hero */}
    <div style={{textAlign:"center",marginBottom:24}}>
      <p style={{color:T.muted,fontSize:14,fontWeight:600,marginBottom:6}}>Your monthly surplus</p>
      <p style={{fontSize:"clamp(36px,8vw,48px)",fontWeight:900,color:surplus>=0?T.green:T.red,lineHeight:1}}>{fmt(surplus)}</p>
      <p style={{color:"#C8D8EC",fontSize:13,marginTop:8}}>{surplus>=0?"This is what you have to work with each month.":"You are currently spending more than you earn."}</p>
    </div>

    {/* Stacked bar */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
      <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:12}}>Monthly breakdown</p>
      <div style={{height:160}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{left:0,right:10}}>
            <XAxis dataKey="name" tick={{fontSize:10,fill:"#C8D8EC"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={42}/>
            <Tooltip formatter={v=>fmt(v)} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white}}/>
            <Bar dataKey="value" radius={[6,6,0,0]}>{barData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Spending % */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
      <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:8}}>Spending ratio</p>
      <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>You are spending <strong style={{color:spendPct>80?T.amber:T.teal}}>{spendPct}%</strong> of your income. The 50/30/20 guideline suggests 80% spending and 20% saving/investing.</p>
    </div>

    {/* Subscriptions spotlight */}
    {totalSubs>0&&(
      <div style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:18,padding:"20px",marginBottom:16}}>
        <p style={{color:T.purple,fontWeight:700,fontSize:14,marginBottom:6}}>📱 Subscription spotlight</p>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>Your subscriptions total <strong style={{color:T.purple}}>{fmt(totalSubs)}/month</strong> which is <strong>{fmt(totalSubs*12)}/year</strong>.</p>
        <div style={{marginTop:10}}>{subs.map((s,i)=><p key={i} style={{color:"#C8D8EC",fontSize:12,marginBottom:3}}>· {s.name}: £{s.amount}/mo</p>)}</div>
      </div>
    )}

    {/* Coffee calculator */}
    <CoffeeCalculator/>

    {/* Annual impact */}
    {surplus>0&&(
      <div style={{background:T.greenDim,border:`1px solid rgba(52,211,153,.3)`,borderRadius:18,padding:"20px"}}>
        <p style={{color:T.green,fontWeight:700,fontSize:14,marginBottom:6}}>Annual impact</p>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>Your monthly surplus of {fmt(surplus)} is <strong style={{color:T.green}}>{fmt(surplus*12)}/year</strong>. Invested at 7% average growth, that becomes approximately {fmt(Math.round(surplus*12*((Math.pow(1.07,20)-1)/0.07)))} over 20 years.</p>
      </div>
    )}
  </div>)
}

function CoffeeCalculator(){
  const[monthly,setMonthly]=useState(100)
  const calcGrowth=(m,years)=>Math.round(m*12*((Math.pow(1.07,years)-1)/0.07))
  const chartData=[{year:0,value:0},{year:5,value:calcGrowth(monthly,5)},{year:10,value:calcGrowth(monthly,10)},{year:20,value:calcGrowth(monthly,20)},{year:30,value:calcGrowth(monthly,30)}]

  return(
    <div style={{background:T.card,border:`1.5px solid ${T.tealBorder}`,borderRadius:20,padding:"22px",marginBottom:16}}>
      <p style={{color:T.teal,fontWeight:800,fontSize:15,marginBottom:4}}>☕ What if you redirected £{monthly}/month?</p>
      <p style={{color:T.muted,fontSize:12,marginBottom:14}}>Projected at 7% average annual growth</p>
      <input type="range" min="25" max="500" step="25" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}
        style={{width:"100%",accentColor:T.teal,marginBottom:12}}/>
      <p style={{color:T.teal,fontWeight:900,fontSize:22,textAlign:"center",marginBottom:12}}>£{monthly}/month</p>
      <div style={{height:140}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs><linearGradient id="gCoffee" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="year" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}yr`}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={42}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={v=>`${v} years`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white}}/>
            <Area type="monotone" dataKey="value" stroke={T.teal} strokeWidth={2.5} fill="url(#gCoffee)" dot={{fill:T.teal,r:4}} name="Portfolio value"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:14}}>
        <p style={{color:"#C8D8EC",fontSize:12}}>· £5/day coffee = £150/mo → <strong style={{color:T.teal}}>{fmtK(calcGrowth(150,20))}</strong> in 20 years</p>
        <p style={{color:"#C8D8EC",fontSize:12}}>· £50/mo less eating out → <strong style={{color:T.teal}}>{fmtK(calcGrowth(50,20))}</strong> in 20 years</p>
        <p style={{color:"#C8D8EC",fontSize:12}}>· Cancel 3 subs (£40/mo) → <strong style={{color:T.teal}}>{fmtK(calcGrowth(40,20))}</strong> in 20 years</p>
      </div>
      <p style={{color:T.muted,fontSize:11,marginTop:10}}>This is not about deprivation. It is about knowing the true cost of each choice.</p>
    </div>
  )
}

function Level9Outputs({data,age,state}){
  const inv=data.investing||{};const monthly=inv.monthlyInvestment||0;const currentISA=inv.currentISA||0;const targetAge=inv.targetAge||65
  const userAge=age||30;const years=Math.max(targetAge-userAge,5)
  if(monthly===0&&currentISA===0) return(<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{filter:"blur(6px)",opacity:.3,marginBottom:16}}><div style={{width:120,height:60,borderRadius:6,background:`linear-gradient(135deg,${T.teal}30,${T.green}30)`,margin:"0 auto"}}/></div><p style={{color:T.white,fontWeight:700,fontSize:16}}>Enter your investing numbers</p></div>)

  const projData=[];for(let y=0;y<=years;y++){
    const con=currentISA+monthly*12*y
    const mod=Math.round((currentISA*(Math.pow(1.07,y)))+(monthly*12*((Math.pow(1.07,y)-1)/0.07)))
    const grow=Math.round((currentISA*(Math.pow(1.09,y)))+(monthly*12*((Math.pow(1.09,y)-1)/0.09)))
    projData.push({age:userAge+y,conservative:Math.round((currentISA*(Math.pow(1.05,y)))+(monthly*12*((Math.pow(1.05,y)-1)/0.05))),moderate:mod,growth:grow})
  }
  const finalMod=projData[projData.length-1]?.moderate||0
  const passiveIncome=Math.round(finalMod*0.04)

  return(<div>
    <div style={{textAlign:"center",marginBottom:24}}>
      <p style={{color:T.muted,fontSize:14,fontWeight:600,marginBottom:6}}>Projected portfolio at age {targetAge}</p>
      <p style={{fontSize:"clamp(32px,8vw,48px)",fontWeight:900,color:T.teal,lineHeight:1}}>{fmtK(finalMod)}</p>
      <p style={{color:"#C8D8EC",fontSize:13,marginTop:8}}>At {fmt(monthly)}/month with 7% average growth</p>
    </div>

    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px",marginBottom:16}}>
      <p style={{color:T.white,fontWeight:700,fontSize:14,marginBottom:12}}>Compound growth projection</p>
      <div style={{height:220}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs><linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="age" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={48}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={v=>`Age ${v}`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:T.white}}/>
            <Area type="monotone" dataKey="growth" stroke={T.green} strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} name="Growth (9%)"/>
            <Area type="monotone" dataKey="moderate" stroke={T.teal} strokeWidth={2.5} fill="url(#gInv)" dot={false} name="Moderate (7%)"/>
            <Area type="monotone" dataKey="conservative" stroke={T.muted} strokeWidth={1} fill="none" strokeDasharray="2 4" dot={false} name="Conservative (5%)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Freedom indicator */}
    <div style={{background:`${T.teal}10`,border:`1.5px solid ${T.tealBorder}`,borderRadius:18,padding:"20px"}}>
      <p style={{color:T.teal,fontWeight:800,fontSize:15,marginBottom:8}}>🔥 Financial freedom indicator</p>
      <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6}}>
        At this rate, your projected portfolio at age {targetAge} could generate approximately <strong style={{color:T.teal}}>{fmt(passiveIncome)}/year</strong> in passive income (at 4% drawdown rate).
      </p>
    </div>
  </div>)
}


/* ═══════════════════════════════════════════════════════
   HOME TAB — Journey map with all 9 levels
   ═══════════════════════════════════════════════════════ */
function HomeTab(){
  const{state,toast}=useApp()
  const{profile}=state
  const lp=state.learningProgress||{currentLevel:1,completedLevels:[],levelData:{}}
  const currentLevel=lp.currentLevel||1
  const completed=new Set(lp.completedLevels||[])
  const[activeLevel,setActiveLevel]=useState(null)
  const[warning,setWarning]=useState(null)
  const[showQuiz,setShowQuiz]=useState(false)

  function handleTap(level){
    const diff=level.n-currentLevel
    if(diff<=1||completed.has(level.n)){setActiveLevel(level.n);return}
    if(level.n>=8&&!completed.has(5)){setWarning({type:"red",level,msg:"You have high-interest debt at Level 5 that has not been addressed. Investing while paying high APR means your debt grows faster than most investments earn.",link:5,linkText:"Level 5: the maths will shock you →"});return}
    if(level.n>=8&&!completed.has(6)){setWarning({type:"amber",level,msg:"Without an emergency fund, you might need to sell investments at the wrong moment. Consider completing Level 6 first.",link:6,linkText:"Level 6: build your safety net →"});return}
    if(diff>=2){setWarning({type:"amber",level,msg:"A couple of things earlier in the journey will help this land better. But you are welcome to read ahead.",link:currentLevel,linkText:`Continue with Level ${currentLevel} →`});return}
    setActiveLevel(level.n)
  }

  if(showQuiz)return<PersonalityQuiz state={state} onClose={()=>setShowQuiz(false)}/>
  if(activeLevel){const lv=LEVELS.find(l=>l.n===activeLevel);if(!lv){setActiveLevel(null);return null};return<LevelPlayer level={lv} onBack={()=>setActiveLevel(null)}/>}

  const level=LEVELS.find(l=>l.n===currentLevel)||LEVELS[0]
  const pc_=PC[level.phase]||T.teal
  const phases=["Foundations","Stabilise","Optimise","Grow"]

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
      {/* Hero greeting */}
      <div style={{position:"relative",background:`linear-gradient(180deg,${pc_}12 0%,transparent 100%)`,padding:"28px 20px 20px"}}>
        <StarField count={8}/>
        <div style={{position:"relative",maxWidth:600,margin:"0 auto"}}>
          <p style={{color:T.white,fontWeight:800,fontSize:22,marginBottom:4}}>Hey {profile.name} 👋</p>
          <p style={{color:T.muted,fontSize:14,marginBottom:18}}>Level {currentLevel} of 9 · {getPhase(currentLevel)}</p>

          {/* Current level card */}
          <div style={{background:`linear-gradient(145deg,${pc_}12,${pc_}04)`,border:`2px solid ${pc_}40`,borderRadius:22,padding:"22px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${pc_}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
            <p style={{color:pc_,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Your focus · Level {currentLevel}</p>
            <h2 style={{color:T.white,fontWeight:900,fontSize:18,lineHeight:1.2,marginBottom:8}}>{level.title}</h2>
            <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5,marginBottom:4}}>{level.hook}</p>
            <p style={{color:T.muted,fontSize:11,marginBottom:16}}>~{level.time} minutes</p>
            <button onClick={()=>setActiveLevel(currentLevel)} style={{width:"100%",background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Zap size={16}/>Start Level {currentLevel}
            </button>
          </div>

          {/* How this helps */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px",marginTop:14}}>
            <p style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:8}}>What completing all 9 levels gives you</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[
                "Know exactly what comes in and goes out each month",
                "No high-interest debt, or a plan with a payoff date",
                "An emergency fund covering 3 months of expenses",
                "A Stocks and Shares ISA with automated monthly investing",
                "A complete picture of your net worth at age 70",
              ].map((item,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <Check size={13} color={T.teal} style={{flexShrink:0,marginTop:2}}/>
                <p style={{color:"#C8D8EC",fontSize:12,lineHeight:1.4}}>{item}</p>
              </div>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"0 18px"}}>
        {/* Quick wins + quiz */}
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginTop:20,marginBottom:24,scrollbarWidth:"none"}}>
          {!profile.personalityResult&&<button onClick={()=>setShowQuiz(true)} style={{flexShrink:0,background:`linear-gradient(135deg,${T.purpleDim},rgba(167,139,250,.03))`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🧠</span><div style={{textAlign:"left"}}><p style={{color:T.purple,fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>Money personality quiz</p><p style={{color:T.muted,fontSize:10}}>4 min · 8 types</p></div>
          </button>}
          {QUICK_WINS.map(qw=><button key={qw.id} onClick={()=>toast(`${qw.label}: coming soon!`)} style={{flexShrink:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{qw.icon}</span><div style={{textAlign:"left"}}><p style={{color:T.white,fontWeight:600,fontSize:12,whiteSpace:"nowrap"}}>{qw.label}</p><p style={{color:T.muted,fontSize:10}}>{qw.min} min</p></div>
          </button>)}
        </div>

        {/* Journey map */}
        <p style={{color:T.white,fontWeight:800,fontSize:17,marginBottom:16}}>Your 9 Level Journey</p>
        {phases.map(phase=>{
          const phaseLevels=LEVELS.filter(l=>l.phase===phase)
          const pc2=PC[phase]||T.teal;const pe=PE[phase]||"📦"
          return(<div key={phase} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:16}}>{pe}</span><p style={{color:pc2,fontWeight:800,fontSize:12,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
            </div>
            {phaseLevels.map((lv,i)=>{
              const isDone=completed.has(lv.n);const isCurrent=lv.n===currentLevel;const isFuture=lv.n>currentLevel&&!isDone;const isLast=i===phaseLevels.length-1
              const ld=lp.levelData?.[`level${lv.n}`]
              const hasData=ld&&Object.values(ld).some(v=>v!==null&&v!==false&&v!==undefined&&!(typeof v==="object"&&Object.keys(v).length===0))
              return(<div key={lv.n} style={{display:"flex",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:28,flexShrink:0}}>
                  <div style={{width:isDone?24:isCurrent?28:20,height:isDone?24:isCurrent?28:20,borderRadius:"50%",
                    background:isDone?T.green:isCurrent?T.teal:T.faint,border:`2.5px solid ${isDone?T.green:isCurrent?T.teal:T.border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                    boxShadow:isCurrent?`0 0 14px ${T.teal}40`:"none",zIndex:1}}>
                    {isDone?<Check size={12} color="#070D1A"/>:<p style={{color:isCurrent?"#070D1A":T.subtle,fontWeight:900,fontSize:10}}>{lv.n}</p>}
                  </div>
                  {!isLast&&<div style={{width:2,flex:1,background:isDone?`${T.green}40`:T.border,minHeight:16}}/>}
                </div>
                <button onClick={()=>handleTap(lv)} style={{flex:1,background:isCurrent?`${T.teal}08`:T.card,border:`1.5px solid ${isCurrent?T.tealBorder:isDone?`${T.green}20`:T.border}`,borderRadius:18,padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:10,opacity:isFuture?.6:1}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <p style={{color:isDone?T.green:isCurrent?T.teal:T.muted,fontSize:10,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
                    {isDone&&<span style={{background:T.greenDim,color:T.green,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Done</span>}
                    {isCurrent&&<span style={{background:T.tealDim,color:T.teal,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Current</span>}
                    {isFuture&&<span style={{background:T.faint,color:T.muted,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Browse</span>}
                  </div>
                  <p style={{color:isDone?"#7A8FA8":T.white,fontWeight:700,fontSize:14,lineHeight:1.3,textDecoration:isDone?"line-through":"none"}}>{lv.title}</p>
                  <p style={{color:T.muted,fontSize:12,marginTop:4,lineHeight:1.35}}>{lv.hook.length>65?lv.hook.slice(0,63)+"...":lv.hook}</p>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <span style={{color:T.muted,fontSize:10}}>📖 {lv.sections.length} sections</span>
                    {lv.videos.length>0&&<span style={{color:T.muted,fontSize:10}}>🎬 {lv.videos.length} videos</span>}
                    <span style={{color:T.muted,fontSize:10}}>~{lv.time} min</span>
                    {hasData&&<span style={{color:T.teal,fontSize:10}}>📊 Data entered</span>}
                  </div>
                </button>
              </div>)})}
          </div>)})}
      </div>

      {/* Warning modal */}
      {warning&&<div style={{position:"fixed",inset:0,background:"rgba(7,13,26,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div className="ls-fadein" style={{background:T.surface,border:`1.5px solid ${warning.type==="red"?T.redBorder:T.amberBorder}`,borderRadius:22,padding:"28px 24px",width:"100%",maxWidth:420}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <AlertTriangle size={22} color={warning.type==="red"?T.red:T.amber}/>
            <p style={{color:warning.type==="red"?T.red:T.amber,fontWeight:800,fontSize:15}}>A couple of things first</p>
          </div>
          <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6,marginBottom:20}}>{warning.msg}</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>{setWarning(null);setActiveLevel(warning.link)}} style={{width:"100%",background:warning.type==="red"?T.red:T.amber,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{warning.linkText}</button>
            <button onClick={()=>{setWarning(null);setActiveLevel(warning.level.n)}} style={{width:"100%",background:"none",border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",color:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Browse anyway</button>
          </div>
        </div>
      </div>}
    </div>)
}

/* ══════════════════ PERSONALITY QUIZ UI ══════════════════ */
function PersonalityQuiz({state:_st,onClose}){
  const{state,save}=useApp()
  const[step,setStep]=useState(0)
  const[answers,setAnswers]=useState({})
  const[selected,setSelected]=useState(null)
  const[result,setResult]=useState(null)
  const total=PERSONALITY_QUIZ.length;const q=PERSONALITY_QUIZ[step-1];const isIntro=step===0;const isResult=step>total
  function next(){
    if(isIntro){setStep(1);return};if(selected===null)return
    const na={...answers,[q.id]:selected};setAnswers(na)
    if(step>=total){const r=calcQuizPersonality(na,state);setResult(r);save({...state,profile:{...state.profile,personalityResult:r}});setStep(total+1)}
    else{setStep(s=>s+1);setSelected(null)}
  }
  function back(){if(step<=1){onClose();return};setStep(s=>s-1);const pq=PERSONALITY_QUIZ[step-2];setSelected(answers[pq?.id]??null)}
  const pct=step===0?0:Math.round((step/total)*100)

  return(<div style={{position:"fixed",inset:0,background:T.bg,zIndex:300,display:"flex",flexDirection:"column",overflowY:"auto"}}>
    <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.bg,zIndex:10}}>
      <button onClick={isResult?onClose:back} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:4,fontFamily:"inherit"}}>{isResult?<span style={{fontSize:13,fontWeight:700}}>Done</span>:<span style={{fontSize:20}}>←</span>}</button>
      <div style={{flex:1}}>
        {!isIntro&&!isResult&&<><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><p style={{color:T.muted,fontSize:11,fontWeight:700}}>Question {step} of {total}</p><p style={{color:T.teal,fontSize:11,fontWeight:700}}>{pct}%</p></div>
        <div style={{background:T.surface,borderRadius:99,height:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width .4s ease"}}/></div></>}
        {(isIntro||isResult)&&<p style={{color:T.muted,fontSize:12,fontWeight:600}}>Money Personality</p>}
      </div>
    </div>
    <div style={{flex:1,padding:"28px 20px 40px",maxWidth:520,margin:"0 auto",width:"100%"}}>
      {isIntro&&<div style={{animation:"quizIn .3s ease"}}>
        <div style={{fontSize:56,marginBottom:20,textAlign:"center"}}>🧠</div>
        <h1 style={{color:T.white,fontWeight:900,fontSize:26,textAlign:"center",marginBottom:12,lineHeight:1.2}}>Find out your money personality</h1>
        <p style={{color:"#E2EAF6",fontSize:15,textAlign:"center",lineHeight:1.7,marginBottom:32}}>12 scenario questions. No right answers. About 4 minutes.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
          {[{icon:"🎯",text:"Your money archetype, one of 8 types"},{icon:"📊",text:"How you make financial decisions"},{icon:"💡",text:"Your specific blind spots and strengths"},{icon:"🗺️",text:"What this means in real life scenarios"}].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px"}}><span style={{fontSize:20}}>{item.icon}</span><p style={{color:"#E2EAF6",fontSize:13,fontWeight:500}}>{item.text}</p></div>
          ))}
        </div>
        <Btn onClick={next}>Start the quiz</Btn>
      </div>}

      {!isIntro&&!isResult&&q&&<div key={step} style={{animation:"quizIn .25s ease"}}>
        <span style={{background:T.purpleDim,color:T.purple,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99,border:`1px solid ${T.purpleBorder}`,letterSpacing:.8,textTransform:"uppercase"}}>{q.dimension.replace(/_/g," ")}</span>
        <h2 style={{color:T.white,fontWeight:900,fontSize:21,lineHeight:1.25,marginBottom:6,marginTop:14}}>{q.headline}</h2>
        <p style={{color:"#8FA3BE",fontSize:14,marginBottom:28}}>{q.sub}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
          {q.options.map((opt,oi)=>{const sel=selected===oi;return(
            <button key={oi} onClick={()=>setSelected(oi)} style={{background:sel?`linear-gradient(135deg,${T.tealDim},${T.purpleDim})`:T.card,border:`2px solid ${sel?T.teal:T.border}`,borderRadius:14,padding:"15px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:sel?T.white:"#E2EAF6",fontWeight:sel?700:500,fontSize:14,lineHeight:1.4,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,border:`2px solid ${sel?T.teal:T.border}`,background:sel?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:sel?T.bg:T.muted}}>{sel?"✓":String.fromCharCode(65+oi)}</div>
              {opt.label}
            </button>)})}
        </div>
        <Btn onClick={next} disabled={selected===null}>{step<total?"Next question":"See my result"}</Btn>
      </div>}

      {isResult&&result&&<PersonalityResult result={result} onClose={onClose}/>}
    </div>
  </div>)
}

function PersonalityResult({result,onClose}){
  const a=result.archetype;const[tab,setTab]=useState("overview")
  return(<div style={{animation:"quizIn .3s ease"}}>
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{width:80,height:80,borderRadius:24,background:`${a.color}20`,border:`2px solid ${a.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 16px",boxShadow:`0 0 40px ${a.color}30`}}>{a.emoji}</div>
      <p style={{color:a.color,fontWeight:700,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Your money personality</p>
      <h2 style={{color:T.white,fontWeight:900,fontSize:28,marginBottom:8}}>{a.name}</h2>
      <p style={{color:a.color,fontWeight:700,fontSize:15,marginBottom:14}}>{a.headline}</p>
      <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.7}}>{a.summary}</p>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:20,background:T.surface,borderRadius:12,padding:4}}>
      {[["overview","Overview"],["traits","Traits"],["blindspot","Blind spot"]].map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:tab===id?T.card:"transparent",border:`1px solid ${tab===id?T.border:"transparent"}`,borderRadius:9,padding:"8px 4px",cursor:"pointer",fontFamily:"inherit",color:tab===id?T.white:T.muted,fontWeight:tab===id?700:500,fontSize:12}}>{label}</button>
      ))}
    </div>
    {tab==="overview"&&<div><p style={{color:T.muted,fontSize:13,lineHeight:1.6}}>{a.summary}</p></div>}
    {tab==="traits"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{a.traits.map((t,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px"}}><Check size={14} color={a.color} style={{flexShrink:0,marginTop:2}}/><p style={{color:"#E2EAF6",fontSize:13,lineHeight:1.5}}>{t}</p></div>)}</div>}
    {tab==="blindspot"&&<div>
      <div style={{background:`${T.amber}10`,border:`1px solid ${T.amberBorder}`,borderRadius:16,padding:"18px",marginBottom:16}}><p style={{color:T.amber,fontWeight:700,fontSize:13,marginBottom:6}}>Your blind spot</p><p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6}}>{a.blind_spot}</p></div>
      <div style={{background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:16,padding:"18px"}}><p style={{color:T.teal,fontWeight:700,fontSize:13,marginBottom:6}}>Your next step</p><p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6}}>{a.next_step}</p></div>
    </div>}
    <button onClick={onClose} style={{width:"100%",marginTop:24,background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Done</button>
  </div>)
}

function LearnTab(){
  const{toast}=useApp();const[expanded,setExpanded]=useState(null)
  return(<div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
    <div style={{padding:"24px 20px 16px",borderBottom:`1px solid rgba(255,255,255,.05)`}}>
      <h2 style={{color:T.white,fontWeight:900,fontSize:22,letterSpacing:-.3}}>Learn</h2>
      <p style={{color:T.muted,fontSize:13}}>Explore topics beyond your current level. Pure curiosity.</p>
    </div>
    <div style={{padding:"20px 18px",maxWidth:600,margin:"0 auto"}}>
      {LEARN_THEMES.map(theme=>{const isOpen=expanded===theme.id;return(<div key={theme.id} style={{marginBottom:12}}>
        <button onClick={()=>setExpanded(isOpen?null:theme.id)} style={{width:"100%",background:isOpen?T.purpleDim:T.card,border:`1.5px solid ${isOpen?T.purpleBorder:T.border}`,borderRadius:18,padding:"18px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:24}}>{theme.icon}</span><div style={{flex:1}}><p style={{color:T.white,fontWeight:700,fontSize:15}}>{theme.title}</p><p style={{color:T.muted,fontSize:12}}>{theme.items.length} topics</p></div>
          <ChevronDown size={18} color={T.muted} style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}/>
        </button>
        {isOpen&&<div className="ls-fadein" style={{paddingTop:10,display:"flex",flexDirection:"column",gap:8}}>
          {theme.items.map((item,i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,marginLeft:20}}>
            <Play size={16} color={T.purple}/><div style={{flex:1}}><p style={{color:T.white,fontWeight:600,fontSize:13}}>{item.title}</p><p style={{color:T.muted,fontSize:11}}>{item.min} min</p></div>
            <button onClick={()=>toast("Video content coming soon")} style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:10,padding:"6px 14px",color:T.purple,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Watch</button>
          </div>)}
        </div>}
      </div>)})}
    </div>
  </div>)
}

/* ══════════════════ ME TAB ══════════════════ */
function MeTab(){
  const{state,save,reset}=useApp();const{profile}=state
  const lp=state.learningProgress||{currentLevel:1,completedLevels:[]}
  const currentLevel=lp.currentLevel||1;const phase=getPhase(currentLevel);const phaseColor=PC[phase]
  const completedCount=(lp.completedLevels||[]).length;const xp=profile.xp||0
  const isHalal=profile.situations?.includes("faith");const initials=(profile.name||"?").slice(0,2).toUpperCase()
  const[showQuiz,setShowQuiz]=useState(false)
  const arch=profile.personalityResult?.archetype

  const milestones=[0,100,250,500,800,1200,1725];const curM=milestones.filter(m=>m<=xp).pop()||0;const nextM=milestones.find(m=>m>xp)||1725
  const xpPct=nextM>curM?Math.round(((xp-curM)/(nextM-curM))*100):100

  if(showQuiz)return<PersonalityQuiz state={state} onClose={()=>setShowQuiz(false)}/>

  return(<div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
    <div style={{padding:"32px 20px 24px",textAlign:"center"}}>
      <div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,${T.teal},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 8px 32px rgba(15,191,184,.3)`}}><p style={{color:"#FFF",fontWeight:900,fontSize:24}}>{initials}</p></div>
      <p style={{color:T.white,fontWeight:800,fontSize:20}}>{profile.name||"You"}</p>
      <p style={{color:T.muted,fontSize:13,marginTop:4}}>Level {currentLevel} of 9</p>
      <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
        <span style={{background:T.faint,color:T.white,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.border}`}}>⚡ Level {currentLevel}</span>
        <span style={{background:`${phaseColor}12`,color:phaseColor,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${phaseColor}30`}}>{PE[phase]} {phase}</span>
        {arch&&<span style={{background:T.purpleDim,color:T.purple,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.purpleBorder}`}}>{arch.emoji} {arch.name}</span>}
        {isHalal&&<span style={{background:T.tealDim,color:T.teal,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.tealBorder}`}}>🌙 Halal finance</span>}
      </div>
    </div>
    <div style={{padding:"0 18px",maxWidth:500,margin:"0 auto"}}>
      {/* Personality card */}
      {arch?<div style={{background:T.card,border:`1.5px solid ${arch.color}25`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{width:44,height:44,borderRadius:13,background:`${arch.color}20`,border:`1px solid ${arch.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{arch.emoji}</div>
          <div><p style={{color:arch.color,fontSize:11,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>Your personality</p><p style={{color:T.white,fontWeight:800,fontSize:16}}>{arch.name}</p></div>
        </div>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>{arch.summary.slice(0,120)}...</p>
        <button onClick={()=>setShowQuiz(true)} style={{marginTop:10,background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>View full result →</button>
      </div>:
      <button onClick={()=>setShowQuiz(true)} style={{width:"100%",background:`linear-gradient(135deg,${T.purpleDim},rgba(167,139,250,.03))`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:20,padding:"20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>🧠</span><div><p style={{color:T.white,fontWeight:700,fontSize:15}}>Discover your money personality</p><p style={{color:T.muted,fontSize:12}}>12 questions · 4 minutes · 8 types</p></div>
        </div>
      </button>}

      {/* XP */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><p style={{color:T.teal,fontWeight:900,fontSize:28}}>{xp} XP</p><p style={{color:T.muted,fontSize:12}}>Total earned</p></div>
          <div style={{textAlign:"right"}}><p style={{color:T.white,fontWeight:700,fontSize:14}}>{completedCount} levels done</p><p style={{color:T.muted,fontSize:12}}>{9-completedCount} remaining</p></div>
        </div>
        <div style={{background:T.surface,borderRadius:99,height:6,overflow:"hidden"}}><div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99}}/></div>
        <p style={{color:T.muted,fontSize:11,marginTop:6}}>{nextM-xp} XP to next milestone</p>
      </div>

      {/* Phase */}
      <div style={{background:T.card,border:`1px solid ${phaseColor}25`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <p style={{color:phaseColor,fontWeight:800,fontSize:14,marginBottom:6}}>{PE[phase]} {phase}</p>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>
          {phase==="Foundations"?"Getting the real picture of your finances.":phase==="Stabilise"?"Building safety and clearing costly debt.":phase==="Optimise"?"Capturing free money and tax savings.":"Growing real wealth through ISAs and investing."}
        </p>
      </div>

      <button onClick={()=>{if(window.confirm("Reset all progress? This cannot be undone."))reset()}} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10}}>
        <RotateCcw size={16} color={T.muted}/><p style={{color:T.muted,fontWeight:700,fontSize:14}}>Reset progress</p>
      </button>
    </div>
  </div>)
}

/* ══════════════════ BOTTOM NAV ══════════════════ */
function BottomNav(){
  const{tab,setTab}=useApp()
  const TABS=[{icon:Home,label:"Home",idx:0},{icon:BookOpen,label:"Learn",idx:1},{icon:User,label:"Me",idx:2}]
  return(<nav style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",height:66,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 32px rgba(0,0,0,.3)"}}>
    {TABS.map(t=>{const active=tab===t.idx;const Icon=t.icon;return(
      <button key={t.idx} onClick={()=>setTab(t.idx)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"8px 0",position:"relative"}}>
        <Icon size={21} color={active?T.teal:T.muted} strokeWidth={active?2.5:1.8}/>
        <span style={{fontSize:10,fontWeight:active?700:500,color:active?T.teal:T.muted}}>{t.label}</span>
        {active&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:18,height:3,borderRadius:"3px 3px 0 0",background:T.teal}}/>}
      </button>)})}
  </nav>)
}

/* ══════════════════ APP SHELL ══════════════════ */
function AppShell(){
  const{tab}=useApp();const CONTENT=[<HomeTab/>,<LearnTab/>,<MeTab/>]
  return(<div style={{height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden"}}>
    <header style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 20px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:10,boxShadow:"0 4px 24px rgba(0,0,0,.25)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,rgba(15,191,184,.3),rgba(167,139,250,.3))",border:"1px solid rgba(15,191,184,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🚀</div>
        <span style={{color:"#FFF",fontSize:13,fontWeight:800,letterSpacing:2}}>LIFESMART</span>
      </div>
    </header>
    <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>{CONTENT[tab]}</div>
    <BottomNav/>
  </div>)
}

function Router(){const{state}=useApp();if(state.profile.onboardingComplete)return<AppShell/>;return<Onboarding/>}

export default function App(){
  useEffect(()=>{let m=document.querySelector('meta[name="viewport"]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m)};m.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'},[])
  return<AppProvider><Router/></AppProvider>
}
