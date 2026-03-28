import { useState, useEffect, useContext, createContext, useMemo } from "react"
import { Home, BookOpen, User, Check, X, ChevronLeft, ChevronRight, ChevronDown, Play, Zap, AlertTriangle, RotateCcw, ArrowRight } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

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
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.ls-fadein{animation:fadeUp .45s ease-out forwards}
.ls-slidein{animation:slideIn .28s ease-out forwards}
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

const PC={Foundations:T.red,Stabilise:T.amber,Optimise:T.blue,Grow:T.green,Protect:T.purple}
const PE={Foundations:"🧱",Stabilise:"🛡️",Optimise:"⚙️",Grow:"🌱",Protect:"🔒"}
const getPhase=n=>n<=3?"Foundations":n<=6?"Stabilise":n<=7?"Optimise":"Grow"
const AGE_BENCH=[{max:25,median:5000},{max:34,median:30000},{max:44,median:130000},{max:54,median:250000},{max:64,median:370000},{max:999,median:500000}]
function getMedian(age){const b=AGE_BENCH.find(x=>(age||30)<=x.max);return b?b.median:30000}

const LEVELS=[
{n:1,phase:"Foundations",title:"Your Net Worth: The Only Number That Really Matters",hook:"Nobody builds wealth by accident. You have to track it.",time:15,
 sections:[
  {emoji:"📊",title:"Why net worth is the real measure",stat:"Income is vanity. Net worth is reality.",content:"Two people both earn £50k. One has a net worth of £120k. The other is £8k in the hole. The difference isn't what they earn — it's what they kept, grew, and owed.\n\nNet worth is the score. Everything else is just activity. You cannot manage what you do not measure. This is where that starts."},
  {emoji:"🌱",title:"Productive vs lifestyle assets",stat:"Productive assets build freedom. Lifestyle assets don't.",content:"Productive assets put money in your pocket or grow without you working: cash savings, pension, Stocks and Shares ISA, investment property.\n\nLifestyle assets feel like assets but rarely grow: your car depreciates the moment you drive away. The goal over time is to shift more net worth into productive assets.",
   columns:[{label:"Productive",color:T.green,items:["Cash savings","Pension","Stocks / ISA","Investment property"]},{label:"Lifestyle",color:T.amber,items:["Car — depreciates","Jewellery","Personal property"]}]},
  {emoji:"🔍",title:"How to find your figures right now",stat:"Rough estimates are fine. Start now, refine later.",content:"Assets: Log into your bank app for savings. Check your pension app or annual statement. Home value: Zoopla or Rightmove. Car: Autotrader part-exchange value.\n\nLiabilities: Credit card balance from your banking app. Student loan: gov.uk/student-loan-repayment. Mortgage: your lender's app.\n\nA ballpark number updated regularly beats a precise number calculated once three years ago."}
 ],
 dataFields:{
   assets:[{id:"property",emoji:"🏠",label:"Property",sub:"Home, flat, land"},{id:"savings",emoji:"💰",label:"Savings",sub:"Cash, ISA, current acct"},{id:"pension",emoji:"🏛️",label:"Pension",sub:"Workplace or personal",hint:"Check your pension app"},{id:"investments",emoji:"📊",label:"Investments",sub:"Stocks, funds, S&S ISA"},{id:"vehicle",emoji:"🚗",label:"Vehicle",sub:"Car, motorbike",hint:"Autotrader part-exchange"},{id:"goldCrypto",emoji:"✨",label:"Gold / Crypto",sub:"Precious metals, crypto"},{id:"business",emoji:"💼",label:"Business",sub:"Business equity"},{id:"other",emoji:"📦",label:"Other",sub:"Art, collectibles, other"}],
   liabilities:[{id:"mortgage",emoji:"🏠",label:"Mortgage",sub:"~4.5% APR"},{id:"creditCards",emoji:"💳",label:"Credit Cards",sub:"~24% APR"},{id:"carFinance",emoji:"🚗",label:"Car Finance",sub:"~9% APR"},{id:"personalLoan",emoji:"👤",label:"Personal Loan",sub:"~11% APR"},{id:"bnpl",emoji:"🛍️",label:"Buy Now Pay Later",sub:"~29% APR"},{id:"overdraft",emoji:"🏦",label:"Overdraft",sub:"~19% APR"},{id:"studentLoan",emoji:"🎓",label:"Student Loan",sub:"~varies"},{id:"otherDebt",emoji:"📦",label:"Other Debt",sub:"~15% APR"}]
 },
 videos:[{title:"Balance-Sheet and net worth check",role:"core",min:3},{title:"Asset Types",role:"core",min:3},{title:"Know Your Why",role:"deeper",min:3}],
 action:"Set up a note, spreadsheet, or use this app to update your net worth quarterly. The habit of tracking matters as much as the number.",
 doneWhen:"You have entered your assets and liabilities and seen your net worth figure and projection."},

{n:2,phase:"Foundations",title:"Income and Spending: Your Complete Financial Picture",hook:"Without this, every financial decision is based on a guess.",time:12,
 sections:[
  {emoji:"💼",title:"Income: one source vs multiple vs passive",stat:"Passive income covering your costs = financial freedom.",content:"Active income is what most people have: a salary. If you stop working, it stops. Multiple streams reduce risk — a second income of even £300/month is £3,600/year.\n\nPassive income earns while you sleep: rental income, dividends, interest. This is what financial freedom actually looks like."},
  {emoji:"📉",title:"Why we always underestimate spending",stat:"People underestimate variable spending by 30–40% on average.",content:"We remember big purchases. We forget the coffee, the Deliveroo, the impulse buy. Your mental estimate is almost always wrong.\n\nThe only way to know is to look at actual bank statements. Banking apps like Monzo, Starling, and Chase categorise this automatically."},
  {emoji:"📱",title:"Subscriptions: the slow leak",stat:"Most households have 7 subscriptions and can name 4.",content:"The forgotten ones — trials that auto-renewed, apps used twice — typically add up to £30–60/month. That's £720/year leaving your account silently.\n\nGo through your last bank statement and highlight every recurring payment. Cancel anything you would not actively sign up for again today."}
 ],
 dataFields:{
   income:[{id:"takeHome",emoji:"💼",label:"Monthly take-home",sub:"After tax — what lands in your account",hint:"Check your last payslip or bank statement"},{id:"sideIncome",emoji:"⚡",label:"Side income",sub:"Freelance, gig work (monthly avg)"},{id:"benefits",emoji:"🏛️",label:"Benefits / tax credits",sub:"Monthly total"},{id:"rentalIncome",emoji:"🏠",label:"Rental income",sub:"Monthly"},{id:"interest",emoji:"📈",label:"Interest / dividends",sub:"Monthly"}],
   fixed:[{id:"rent",emoji:"🏠",label:"Rent / Mortgage",sub:"Monthly payment"},{id:"utilities",emoji:"⚡",label:"Utilities",sub:"Gas, electric, water"},{id:"councilTax",emoji:"🏛️",label:"Council Tax",sub:"Monthly"},{id:"phone",emoji:"📱",label:"Phone",sub:"Monthly"},{id:"internet",emoji:"🌐",label:"Internet",sub:"Monthly"},{id:"transport",emoji:"🚗",label:"Transport",sub:"Car payment, train, bus"},{id:"insurance",emoji:"🛡️",label:"Insurance",sub:"Car, home, life — total"}],
   variable:[{id:"groceries",emoji:"🛒",label:"Groceries",sub:"Monthly"},{id:"eatingOut",emoji:"🍽️",label:"Eating out",sub:"Restaurants, takeaways, coffee"},{id:"clothing",emoji:"👔",label:"Clothing / Shopping",sub:"Monthly average"},{id:"entertainment",emoji:"🎬",label:"Entertainment",sub:"Going out, events"},{id:"personalCare",emoji:"💆",label:"Personal care",sub:"Gym, haircuts, etc."}]
 },
 videos:[{title:"Tracking Incomes & Outgoings",role:"core",min:3},{title:"Budgeting: 50/30/20",role:"core",min:3},{title:"The Psychology of Money",role:"deeper",min:4}],
 action:"Know your monthly surplus (or deficit) and where your money goes.",
 doneWhen:"You know your monthly surplus and can see clearly where your money is going."},

{n:3,phase:"Foundations",title:"Budgeting: Give Every Pound a Job",hook:"The 50/30/20 rule is a starting framework. Your numbers make it personal.",time:10,
 sections:[
  {emoji:"🎯",title:"Needs vs wants vs savings vs waste",stat:"Waste isn't a want. It's money leaving without your permission.",content:"50% to needs (must-haves: rent, food, transport). 30% to wants (chosen: eating out, holidays). 20% to savings and debt repayment.\n\nWaste is different from wants. A want is consciously chosen and enjoyed. Waste is money spent without realising it. Eliminating waste feels like getting your money back."},
  {emoji:"💡",title:"Budgeting methods that actually work",stat:"Pay yourself first requires the least willpower.",content:"Pay yourself first: savings leave your account on payday before you can spend them. You live on what remains. The simplest method — automated, requiring no daily decisions.\n\nStart with pay yourself first. Set up a standing order on payday."}
 ],
 dataFields:null,
 videos:[{title:"Savings Pots",role:"core",min:3},{title:"Comparison Traps",role:"core",min:3}],
 action:"Every spending item from Level 2 categorised. Monthly budget with targets. Pay-yourself-first amount identified and automated.",
 doneWhen:"You have a monthly budget with targets and have identified your pay-yourself-first amount."},

{n:4,phase:"Foundations",title:"Your Payslip and How Tax Actually Works",hook:"The most common tax misconception costs people real money.",time:10,
 sections:[
  {emoji:"📋",title:"Every payslip line explained",stat:"Most people don't know what NI actually funds. It's your state pension.",content:"Gross salary: what you're contracted to earn before deductions. Income tax (PAYE): taken at source. National Insurance: 12% on earnings between £12,570 and £50,270 — separate from income tax, funds your state pension.\n\nPension contribution: leaves before you see it. Net pay: what actually hits your bank account."},
  {emoji:"🧮",title:"How tax bands actually work",stat:"Getting a pay rise never makes you worse off overall.",content:"Tax bands are marginal — you only pay the higher rate on the portion of income above the threshold, not all your income.\n\n£0–£12,570: 0% (personal allowance). £12,571–£50,270: 20%. £50,271–£125,140: 40% only on this slice.\n\nSomeone earning £55,000 pays 40% only on £4,730. Their effective rate is around 20% — not 40%."}
 ],
 dataFields:{payslip:[{id:"grossSalary",emoji:"💷",label:"Gross annual salary",sub:""},{id:"taxCode",emoji:"🔢",label:"Tax code (e.g. 1257L)",sub:"Check your payslip",isText:true},{id:"monthlyTax",emoji:"📊",label:"Income tax per month",sub:""},{id:"monthlyNI",emoji:"🏛️",label:"NI paid per month",sub:""},{id:"monthlyPension",emoji:"💼",label:"Pension deducted per month",sub:""}]},
 videos:[{title:"Banking Basics",role:"deeper",min:3}],
 action:"Understand every line of your payslip. Confirm your tax code is correct at gov.uk/check-income-tax.",
 doneWhen:"You understand your payslip and have confirmed your tax code."},

{n:5,phase:"Stabilise",title:"Debt: Stop Letting Your Past Control Your Present",hook:"Interest compounds against you the same way investing compounds for you.",time:15,
 sections:[
  {emoji:"⚖️",title:"Why debt is the biggest drag on future wealth",stat:"£2,000 at 34% APR, minimum payments only: 11 years and £1,400 extra in interest.",content:"Debt isn't just a financial problem — it's a time machine. Every payment on a credit card is paying for something bought months ago. That money can't build your future at the same time.\n\nBeyond the financial cost: the low-level anxiety that doesn't go away, avoiding opening statements. Clearing debt changes how people feel every day."},
  {emoji:"💡",title:"Paying off debt vs investing",stat:"Paying 29% APR debt = guaranteed 29% return. Beats the stock market.",content:"If your debt costs 29% APR, paying it off gives you a guaranteed 29% return — better than any investment can reliably promise.\n\nThe one exception: employer pension match. That's a guaranteed 100% return — capture that first. But all other investing waits until high-interest debt is cleared."},
  {emoji:"❄️",title:"Avalanche vs Snowball — pick one",stat:"A completed snowball beats an abandoned avalanche every time.",content:"Avalanche (highest interest first): mathematically optimal, costs least total interest.\n\nSnowball (smallest balance first): costs more interest but higher completion rates because early wins build momentum.\n\nBoth work. Pick the one you will actually stick to."}
 ],
 dataFields:{debts:"dynamic"},
 videos:[{title:"Good debt vs. bad debt",role:"core",min:3},{title:"Cost of Borrowing",role:"core",min:3},{title:"Snowball vs. Avalanche",role:"core",min:3}],
 action:"Every debt listed with APR. Payoff order chosen. First extra payment scheduled.",
 doneWhen:"Every debt listed with its APR. Payoff order and debt-free date set."},

{n:6,phase:"Stabilise",title:"Savings Pots: A Place for Everything",hook:"An emergency fund is not savings. It is insurance.",time:10,
 sections:[
  {emoji:"🛡️",title:"Emergency fund: your first financial priority",stat:"£1,000 changes everything. Start there.",content:"Start with £1,000. That covers most common emergencies — a car repair, a broken phone, an unexpected bill. Without it, every emergency becomes debt.\n\nThen build to 3–6 months of essential spending. Keep it in a high-interest easy-access account — Monzo pots, Starling Spaces, or Marcus are all good options."},
  {emoji:"📅",title:"Sinking funds: predict the unpredictable",stat:"Car insurance at £800/year = £67/month. Set it aside now.",content:"A sinking fund is money set aside gradually for a cost you know is coming. Car insurance, holiday, Christmas, home maintenance.\n\nEverything that ends up on a credit card 'out of nowhere' was actually predictable — it just wasn't planned for."}
 ],
 dataFields:null,
 videos:[{title:"Savings Pots",role:"core",min:3},{title:"SMART Goal-Setting",role:"core",min:3}],
 action:"Emergency fund started with a standing order running. At least one sinking fund set up.",
 doneWhen:"Emergency fund started with a standing order running. At least one sinking fund set up."},

{n:7,phase:"Optimise",title:"Capture Free Money: Tax, Pension Match, Allowances",hook:"Your employer is offering money you are not taking.",time:10,
 sections:[
  {emoji:"💰",title:"Employer pension match: a 100% guaranteed return",stat:"Not contributing enough to match your employer = turning down a pay rise.",content:"If your employer matches up to 5% and you contribute 3%, on a £32,000 salary you're leaving £640/year on the table.\n\nSalary sacrifice makes it better: you pay pension from gross salary before tax or NI. On £35k contributing 5% via salary sacrifice, you save approximately £350/year in NI on top."},
  {emoji:"🎁",title:"Tax allowances most people never claim",stat:"Marriage allowance: £252/year, backdatable 4 years.",content:"Working from home: £6/week (£312/year) without needing receipts.\n\nMarriage allowance: if one partner earns under £12,570 and the other is a basic rate taxpayer, transfer £1,260 of allowance. Up to £252/year, can be backdated 4 years.\n\nUniform, professional fees, Gift Aid on charity donations — each is free money left unclaimed."}
 ],
 dataFields:null,
 videos:[{title:"Retirement Toolkit",role:"core",min:3}],
 action:"Pension contribution set to capture full employer match. Applicable allowances identified and claimed.",
 doneWhen:"Pension contribution matches employer maximum. Applicable allowances claimed or queued."},

{n:8,phase:"Grow",title:"Open Your ISA: The Tax-Free Wrapper",hook:"Every year you delay costs you. The allowance does not roll over.",time:10,
 sections:[
  {emoji:"📦",title:"What an ISA actually is",stat:"£20,000/year, no tax on growth, no tax on withdrawal. Ever.",content:"An ISA is a tax wrapper — an account where money grows without being taxed. No capital gains tax. No income tax on dividends. No tax on withdrawal. Every adult has a £20,000 per year allowance — use it or lose it.\n\nFill an ISA before investing anywhere else. Why pay tax on growth when there's a legal wrapper that prevents it?"},
  {emoji:"🗂️",title:"Which ISA is right for you?",stat:"Stocks and Shares ISA: historically 7–10%/year long-term.",content:"Cash ISA: like a savings account, 4–5% tax-free. Good for money needed within 5 years.\n\nStocks and Shares ISA: invest in funds inside the wrapper. Best for 5+ years. This builds wealth.\n\nLifetime ISA (LISA): under-40s only. 25% government bonus on up to £4,000/year. For a first home or retirement."},
  {emoji:"🏦",title:"Where to open one",stat:"Vanguard: lowest costs. Trading 212: 0% platform fee.",content:"Vanguard: lowest overall costs, great for beginners. Trading 212: 0% platform fee. Freetrade: popular for first-time investors. For LISA: Moneybox or AJ Bell.\n\nHalal users: shariah-compliant funds are available inside a standard S&S ISA — Wahed Invest and HSBC Global Islamic Economy Fund are good options."}
 ],
 dataFields:null,
 videos:[{title:"Asset Types",role:"core",min:3},{title:"Rate of Return",role:"core",min:3},{title:"Risk and Risk Tolerance",role:"core",min:3}],
 action:"A Stocks and Shares ISA is open. LISA opened if under 40 and planning to buy a first home.",
 doneWhen:"A Stocks and Shares ISA is open, even with £0 in it."},

{n:9,phase:"Grow",title:"Make Your First Investment: Let Time Do the Work",hook:"Starting at 25 vs 35 on £200/month is a £282,000 difference.",time:10,
 sections:[
  {emoji:"⏰",title:"Compound growth: the most important concept",stat:"£200/month from age 25 vs 35: a £282,000 difference at 65.",content:"Compound growth means your returns earn returns. £10,000 growing at 7%/year becomes £76,000 over 30 years without any additional contributions.\n\nStart at 25 with £200/month: £525,000 by 65. Start at 35 with £200/month: £243,000 by 65. Same money. 10-year head start = £282,000 difference."},
  {emoji:"📈",title:"Index funds: why simple wins",stat:"90% of professional fund managers underperform a simple index fund over 10 years.",content:"An index fund tracks a market like the S&P 500 or FTSE Global All Cap — you own a tiny slice of hundreds of companies at once.\n\n1.5%/year vs 0.2% on £100,000 over 10 years costs approximately £15,000 that goes to the fund manager instead of you."},
  {emoji:"⚖️",title:"Risk and time horizon",stat:"Money needed in 5+ years: global equity index fund is appropriate for most people.",content:"Under 3 years: keep in cash savings. 3–5 years: cautious mix. 5+ years: global equity index fund. 10+ years: higher equity allocation.\n\nThe emergency fund from Level 6 exists so your investments can stay invested through volatile periods."}
 ],
 dataFields:{investing:[{id:"monthlyInvestment",label:"Monthly investment amount",hint:"From your surplus"},{id:"currentISA",label:"Any existing ISA balance",hint:""},{id:"targetAge",label:"Target age to stop working",hint:""}]},
 videos:[{title:"Funds",role:"core",min:3},{title:"Diversification",role:"core",min:3},{title:"Time horizon and portfolio construction",role:"core",min:3}],
 action:"A monthly direct debit is set up into a global index fund inside your ISA. Even £25/month.",
 doneWhen:"A monthly direct debit is running into an index fund. The habit matters more than the amount."},
]

const QUICK_WINS=[{id:"tax",icon:"🔍",label:"Tax code check",min:5},{id:"subs",icon:"📱",label:"Subscription audit",min:10},{id:"savings",icon:"🏦",label:"Savings rate check",min:3},{id:"pension",icon:"💼",label:"Pension match check",min:5}]

const GOAL_CONTENT={
  understand:{headline:"Nobody taught you this. Most adults are still figuring it out. That changes now.",cards:[{color:T.blue,text:"You will understand how money actually works: inflation, interest, tax, in plain language."},{color:T.green,text:"Starting now puts you years ahead of most people your age."},{color:T.amber,text:"You will never have to nod along pretending you understood something financial again."}],bullets:["Explain how your payslip works to someone else","Know exactly what your money is doing each month","Make financial decisions with confidence, not guesswork"]},
  budgeting:{headline:"You earn money. It disappears. We are going to find it.",cards:[{color:T.blue,text:"Most people find £50 to £150/month in forgotten subscriptions in the first session."},{color:T.green,text:"Once you know your gap, what is actually left each month, everything else becomes possible."},{color:T.amber,text:"A budget you stick to is not about restriction. It is about intentional spending."}],bullets:["Track every pound without it feeling like a chore","Cut spending you do not even notice","Build savings automatically from the gap you find"]},
  debt:{headline:"You are not in a hole. You are at the start of getting out of one.",cards:[{color:T.blue,text:"Most people clear debt faster than expected once they have a real plan."},{color:T.green,text:"You will know your exact debt-free date before you finish your first session."},{color:T.amber,text:"Interest is probably costing you more than you realise. We will show you the real number."}],bullets:["List every debt with its true cost","Have a payoff plan with actual dates","Stop paying interest you do not need to"]},
  investing:{headline:"You have income coming in. Right now it is just sitting there.",cards:[{color:T.blue,text:"Starting at 27 vs 37 is a £180,000+ difference at retirement."},{color:T.green,text:"90% of fund managers underperform a simple index fund. You do not need to pick stocks."},{color:T.amber,text:"Your employer may be offering free money you have not claimed yet."}],bullets:["Open a Stocks & Shares ISA and understand why","Set up automated investing that runs without you","Know the difference between good fees and bad fees"]},
  home:{headline:"You have a goal. Let us build the path backwards from it.",cards:[{color:T.blue,text:"You will know exactly how much you need, by when, and what needs to happen each month."},{color:T.green,text:"Most people overestimate how long it takes when they have a plan."},{color:T.amber,text:"There are government bonuses most first-time buyers do not know exist."}],bullets:["Calculate your exact savings target","Use the right accounts to get government bonuses","Build a realistic timeline that actually works"]},
  admin:{headline:"Most people overpay tax and underpay themselves. Let us fix both.",cards:[{color:T.blue,text:"A wrong tax code costs real money. We check this in the first session."},{color:T.green,text:"If your employer matches pension and you are not maximising it, you are turning down salary."},{color:T.amber,text:"30 minutes in this app will be worth more than most financial decisions this year."}],bullets:["Confirm your tax code is correct","Maximise your employer pension match","Know exactly what you are entitled to"]},
}

const LEARN_THEMES=[
  {id:"economy",icon:"🌍",title:"How the world economy works",items:[{title:"History of Money",min:4},{title:"Exchange Rates & Global Currencies",min:3},{title:"Supply & Demand",min:3},{title:"Economic Cycles",min:4}]},
  {id:"investing",icon:"🔮",title:"Beyond the basics",items:[{title:"Digital Dollars & Stablecoins",min:3},{title:"Commodities",min:3},{title:"Real Estate",min:4},{title:"Bonds and fixed income",min:3}]},
  {id:"psychology",icon:"🧠",title:"Understanding yourself with money",items:[{title:"Know Your Why",min:3},{title:"Comparison Traps",min:3},{title:"The Psychology of Money",min:4}]},
  {id:"credit",icon:"💳",title:"Credit deep dive",items:[{title:"How Credit Actually Works",min:3},{title:"Credit Scores and Bureaus",min:3},{title:"Credit Cards Explained",min:3}]},
]

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
  const ARCHETYPES={
    "security-future-systematic":{id:"guardian",name:"The Guardian",emoji:"🛡️",color:T.green,headline:"Careful. Disciplined. Long game.",summary:"You prioritise security and play the long game. Your discipline around saving and protecting what you have is a genuine financial strength.",traits:["Strong savings discipline","Prefers certainty over high returns","Tracks spending carefully"],blind_spot:"Over-protecting can be costly. Cash savings lose value to inflation every year.",next_step:"Consider putting anything above 6 months emergency fund into a low-cost index fund."},
    "security-future-intuitive":{id:"cultivator",name:"The Cultivator",emoji:"🌱",color:T.teal,headline:"Building carefully, for the long run.",summary:"You have patience and discipline. You think ahead and feel most secure when the future is being taken care of.",traits:["Consistent long-term saver","Prioritises pension and future security","Values financial stability"],blind_spot:"Your focus on security can mean you under-invest in growth assets.",next_step:"Review whether your pension contribution rate is genuinely maximising your employer match."},
    "growth-future-intuitive":{id:"accelerator",name:"The Accelerator",emoji:"🚀",color:T.teal,headline:"Long game. High conviction.",summary:"You think in decades. Short-term noise does not worry you. You see market drops as opportunities.",traits:["Comfortable with investment volatility","Makes decisions with confidence","Attracted to growth assets"],blind_spot:"Conviction can lead to skipping fundamentals like insurance or an adequate emergency fund.",next_step:"Check your emergency fund covers 3 months before adding more to investments."},
    "growth-future-systematic":{id:"navigator",name:"The Navigator",emoji:"🧭",color:T.purple,headline:"Methodical. Growth-focused. In control.",summary:"You combine growth ambition with systematic discipline. You research before you act and follow through.",traits:["Research-led investor","Clear financial goals with plans","Balances structure with growth"],blind_spot:"Analysis paralysis. Taking a reasonable action earlier beats researching indefinitely.",next_step:"Pick one financial goal and set an automated monthly contribution this week."},
    "growth-present-intuitive":{id:"grower",name:"The Grower",emoji:"⚡",color:T.amber,headline:"Momentum, instinct, opportunity.",summary:"You back yourself, spot opportunities, and are not afraid to act. You live well now and want to grow your wealth too.",traits:["Acts on financial instinct","Comfortable with risk","Less likely to follow rigid budgets"],blind_spot:"Without structure, income can disappear into lifestyle even at high earning levels.",next_step:"Set up an automated transfer to a Stocks and Shares ISA on payday."},
    "security-present-systematic":{id:"architect",name:"The Architect",emoji:"🏗️",color:T.blue,headline:"Strong foundations. Deep knowledge.",summary:"You have done the reading. You understand the mechanics of personal finance. Your challenge is that knowledge does not always translate into action.",traits:["High financial literacy","Security-focused but curious about growth","Understands the long game"],blind_spot:"Knowledge without action is just expensive inaction.",next_step:"Identify the one decision you have been researching for 3+ months and make it this month."},
    "freedom-present-intuitive":{id:"opportunist",name:"The Opportunist",emoji:"🌊",color:T.amber,headline:"Bold. Fast-moving. Opportunity-first.",summary:"You see financial freedom as the goal and move decisively. The risk is that ambition without foundation can leave gaps.",traits:["High confidence in financial decisions","Moves quickly when opportunity feels right","Values independence"],blind_spot:"A single bad decision without foundations can undo years of bold gains.",next_step:"Check: do you have 3 months expenses in accessible cash? If not, build that first."},
    "freedom-present-systematic":{id:"learner",name:"The Learner",emoji:"💡",color:T.purple,headline:"Curious. Growing. Getting started.",summary:"You are building your financial foundations with self-awareness. You are at the most important stage.",traits:["Open to learning","Values simplicity and clear guidance","Responds well to small wins"],blind_spot:"Waiting until you understand everything perfectly. Starting small now beats a perfect plan started later.",next_step:"Open a Stocks and Shares ISA this month, even with a small amount."},
  }
  const key=`${sg==="balanced"?"growth":sg}-${pf==="balanced"?"future":pf}-${si==="balanced"?"systematic":si}`
  return{scores:norm,archetype:ARCHETYPES[key]||ARCHETYPES["freedom-present-systematic"],completedAt:new Date().toISOString()}
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
function StarField({count=28}){const stars=useMemo(()=>Array.from({length:Math.min(count,28)},(_,i)=>({x:(i*137.508)%100,y:(i*93.7+17)%100,size:i%9===0?2.2:i%5===0?1.6:1,delay:(i*0.6)%6,dur:2+((i*0.9)%4),tint:i%13===0?"rgba(15,191,184,.7)":i%9===0?"rgba(167,139,250,.6)":"rgba(255,255,255,.7)"})),[count]);return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>{stars.map((s,i)=><div key={i} className="ls-star" style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:s.tint,"--d":`${s.dur}s`,"--dl":`${s.delay}s`}}/>)}</div>)}
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
        <div style={{fontSize:52,textAlign:"center",marginBottom:24}}>👋</div>
        <h1 style={{color:"#FFF",fontWeight:900,fontSize:28,lineHeight:1.1,marginBottom:8,textAlign:"center"}}>Last one. Make this yours.</h1>
        <p style={{color:T.muted,fontSize:14,textAlign:"center",marginBottom:8}}>No email. No password. Just your name and age.</p>
        <div style={{background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:28,textAlign:"center"}}>
          <p style={{color:T.teal,fontSize:12}}>Age matters — a 22-year-old and a 34-year-old need different advice.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 88px",gap:12,marginBottom:8}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your first name" style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"16px 18px",color:T.white,fontSize:16,fontWeight:600,fontFamily:"inherit",outline:"none"}}/>
          <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"16px 12px",color:T.white,fontSize:16,fontWeight:600,fontFamily:"inherit",outline:"none",textAlign:"center"}}/>
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 28px 48px",maxWidth:460,margin:"0 auto",width:"100%"}}>
        <Btn onClick={()=>{if(name.trim())setScreen("summary")}} disabled={!name.trim()}>Show me my plan →</Btn>
        <p style={{color:T.subtle,fontSize:11,textAlign:"center",marginTop:10}}>We never sell your data. Ever.</p>
        <button onClick={()=>setScreen("situation")} style={{background:"none",border:"none",color:"#344D68",fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%",marginTop:8,padding:8}}>Back</button>
      </div>
    </div>)
  const gc=GOAL_CONTENT[goal]||GOAL_CONTENT["understand"]
  return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={14}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"40px 24px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <span style={{display:"inline-block",background:T.greenDim,color:T.green,fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:99,border:`1px solid ${T.green}30`,marginBottom:16}}>Your plan is ready, {name||"you"}</span>
          <h1 style={{color:"#FFF",fontWeight:900,fontSize:"clamp(20px,5vw,26px)",lineHeight:1.25,marginBottom:8}}>{gc.headline}</h1>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {gc.cards.map((card,i)=><div key={i} style={{background:`${card.color}10`,border:`1px solid ${card.color}30`,borderRadius:16,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:card.color,flexShrink:0,marginTop:5}}/>
            <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.5}}>{card.text}</p>
          </div>)}
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px"}}>
          <p style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:12}}>What you will be able to do</p>
          {gc.bullets.map((b,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:T.teal,flexShrink:0,marginTop:5}}/>
            <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.4}}>{b}</p>
          </div>)}
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <Btn onClick={finish}>Let's start →</Btn>
        <p style={{color:T.subtle,fontSize:11,textAlign:"center",marginTop:8}}>First step takes 10 minutes. The impact lasts decades.</p>
      </div>
    </div>)
}

/* ══════════════════ SECTION CARD PLAYER (interactive lesson cards) ══════════════════ */
function SectionCardPlayer({sections,phaseColor,onDone}){
  const[card,setCard]=useState(0)
  const[dir,setDir]=useState(1)
  const total=sections.length
  const s=sections[card]
  function goNext(){setDir(1);if(card<total-1)setCard(c=>c+1);else onDone()}
  function goPrev(){setDir(-1);setCard(c=>c-1)}

  return(
    <div>
      {/* Progress bar */}
      <div style={{display:"flex",gap:5,marginBottom:20}}>
        {sections.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:3,background:i<=card?phaseColor:T.border,transition:"background .3s"}}/>)}
      </div>

      {/* Card */}
      <div className="ls-slidein" key={card} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:22,overflow:"hidden",marginBottom:16}}>
        {/* Header */}
        <div style={{background:`${phaseColor}15`,borderBottom:`1px solid ${phaseColor}20`,padding:"20px 22px 16px",textAlign:"center"}}>
          <div style={{fontSize:38,marginBottom:10}}>{s.emoji}</div>
          <p style={{color:phaseColor,fontWeight:700,fontSize:10,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>{card+1} of {total}</p>
          <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:18,lineHeight:1.25}}>{s.title}</h3>
        </div>

        {/* Key stat highlight */}
        <div style={{background:`${phaseColor}08`,borderBottom:`1px solid ${phaseColor}12`,padding:"12px 20px"}}>
          <p style={{color:phaseColor,fontWeight:700,fontSize:13,textAlign:"center",lineHeight:1.4}}>💡 {s.stat}</p>
        </div>

        {/* Content */}
        <div style={{padding:"18px 20px 20px"}}>
          {s.content.split("\n\n").map((para,j)=><p key={j} style={{color:"#C8D8EC",fontSize:14,lineHeight:1.65,marginBottom:j<s.content.split("\n\n").length-1?12:0}}>{para}</p>)}
          {s.columns&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
              {s.columns.map((col,ci)=>(
                <div key={ci} style={{background:T.surface,borderRadius:14,padding:"14px 12px",border:`1px solid ${col.color}25`}}>
                  <p style={{color:col.color,fontWeight:700,fontSize:11,marginBottom:10,letterSpacing:.4}}>{col.label}</p>
                  {col.items.map((item,ii)=><div key={ii} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:col.color,flexShrink:0}}/>
                    <p style={{color:"#C8D8EC",fontSize:12}}>{item}</p>
                  </div>)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{display:"flex",gap:10}}>
        {card>0&&<button onClick={goPrev} style={{flex:"0 0 52px",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"13px",color:T.muted,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <ChevronLeft size={18}/>
        </button>}
        {card<total-1
          ?<button onClick={goNext} style={{flex:1,background:phaseColor,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            Next <ChevronRight size={16}/>
          </button>
          :<button onClick={onDone} style={{flex:1,background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            Enter my numbers <ArrowRight size={16}/>
          </button>
        }
      </div>
    </div>
  )
}

/* ══════════════════ TILE INPUT (tap-to-expand data entry) ══════════════════ */
function TileInput({emoji,label,sub,value,onChange,hint}){
  const[open,setOpen]=useState(false)
  const[raw,setRaw]=useState(value>0?String(value):"")
  const hasValue=value>0
  return(
    <div style={{marginBottom:2}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:open?`${T.teal}12`:hasValue?`${T.green}06`:T.card,border:`1.5px solid ${open?T.teal:hasValue?`${T.green}50`:T.border}`,borderRadius:open?"16px 16px 0 0":16,padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"border-color .15s,background .15s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24,flexShrink:0}}>{emoji}</span>
          <div style={{flex:1}}>
            <p style={{color:"#FFFFFF",fontWeight:600,fontSize:14}}>{label}</p>
            <p style={{color:T.muted,fontSize:12,marginTop:1}}>{sub}</p>
          </div>
          {hasValue&&!open&&<span style={{color:T.green,fontWeight:800,fontSize:14,flexShrink:0}}>£{Math.round(value).toLocaleString("en-GB")}</span>}
          <ChevronDown size={16} color={open?T.teal:T.muted} style={{flexShrink:0,transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}/>
        </div>
      </button>
      {open&&<div style={{background:T.surface,border:`1.5px solid ${T.teal}`,borderTop:`1px solid ${T.tealBorder}`,borderRadius:"0 0 16px 16px",padding:"14px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:hint?8:10}}>
          <span style={{padding:"0 14px",color:T.muted,fontSize:18,fontWeight:700}}>£</span>
          <input autoFocus type="number" min="0" value={raw} placeholder="0"
            onChange={e=>{setRaw(e.target.value);onChange(parseFloat(e.target.value)||0)}}
            style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#FFFFFF",fontSize:20,fontWeight:700,padding:"13px 12px 13px 0",fontFamily:"inherit"}}/>
        </div>
        {hint&&<p style={{color:T.muted,fontSize:11,marginBottom:10,lineHeight:1.4}}>{hint}</p>}
        <button onClick={()=>setOpen(false)} style={{width:"100%",background:T.teal,border:"none",borderRadius:10,padding:"10px",color:"#070D1A",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Save ✓</button>
      </div>}
    </div>
  )
}

function DebtTileInput({tile,balance,apr,onChange}){
  const[open,setOpen]=useState(false)
  const[rawBal,setRawBal]=useState(balance>0?String(balance):"")
  const[rawApr,setRawApr]=useState(apr>0?String(apr):"")
  const hasValue=balance>0
  return(
    <div style={{marginBottom:2}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:open?`${T.red}10`:hasValue?`${T.red}06`:T.card,border:`1.5px solid ${open?T.red:hasValue?`${T.red}40`:T.border}`,borderRadius:open?"16px 16px 0 0":16,padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:22,flexShrink:0}}>{tile.emoji}</span>
          <div style={{flex:1}}>
            <p style={{color:"#FFFFFF",fontWeight:600,fontSize:14}}>{tile.label}</p>
          </div>
          {hasValue&&!open&&<span style={{color:T.red,fontWeight:800,fontSize:14,flexShrink:0}}>£{Math.round(balance).toLocaleString("en-GB")}</span>}
          <span style={{color:T.red,fontWeight:600,fontSize:11,background:T.redDim,padding:"2px 8px",borderRadius:99,flexShrink:0}}>{hasValue&&apr>0?`${apr}% APR`:tile.apr}</span>
          <ChevronDown size={15} color={open?T.red:T.muted} style={{flexShrink:0,transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}/>
        </div>
      </button>
      {open&&<div style={{background:T.surface,border:`1.5px solid ${T.red}`,borderTop:`1px solid ${T.redBorder}`,borderRadius:"0 0 16px 16px",padding:"14px 16px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:10,marginBottom:12}}>
          <div>
            <p style={{color:T.muted,fontSize:11,fontWeight:600,marginBottom:6}}>Balance owed</p>
            <div style={{display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
              <span style={{padding:"0 10px",color:T.muted,fontWeight:700,fontSize:16}}>£</span>
              <input autoFocus type="number" value={rawBal} placeholder="0"
                onChange={e=>{setRawBal(e.target.value);onChange(parseFloat(e.target.value)||0,parseFloat(rawApr)||0)}}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#FFFFFF",fontSize:16,fontWeight:700,padding:"12px 8px 12px 0",fontFamily:"inherit"}}/>
            </div>
          </div>
          <div>
            <p style={{color:T.muted,fontSize:11,fontWeight:600,marginBottom:6}}>APR %</p>
            <div style={{display:"flex",alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
              <input type="number" value={rawApr} placeholder={tile.aprDefault||"20"}
                onChange={e=>{setRawApr(e.target.value);onChange(parseFloat(rawBal)||0,parseFloat(e.target.value)||0)}}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#FFFFFF",fontSize:15,fontWeight:700,padding:"12px 8px",fontFamily:"inherit",textAlign:"center"}}/>
              <span style={{padding:"0 8px",color:T.muted,fontSize:11}}>%</span>
            </div>
          </div>
        </div>
        <button onClick={()=>setOpen(false)} style={{width:"100%",background:T.red,border:"none",borderRadius:10,padding:"10px",color:"#FFF",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Save ✓</button>
      </div>}
    </div>
  )
}

/* ══════════════════ NET WORTH BAR ══════════════════ */
function NetWorthBar({assets,liabilities,label,age}){
  const fmt=v=>{if(!v&&v!==0)return"£0";const a=Math.abs(Math.round(v));return(v<0?"-":"")+`£${a>=1000?`${(a/1000).toFixed(0)}k`:a}`}
  const totalA=Object.values(assets||{}).reduce((s,v)=>s+(v||0),0)
  const totalL=Object.values(liabilities||{}).reduce((s,v)=>s+(v||0),0)
  const nw=totalA-totalL
  const median=getMedian(age||30)
  return(
    <div style={{background:"#070F1E",border:`1px solid ${T.border}`,borderRadius:16,padding:"16px",marginTop:8}}>
      <p style={{color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>{label||"YOUR PICTURE SO FAR"}</p>
      <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",marginBottom:12}}>
        <div style={{textAlign:"center"}}>
          <p style={{color:T.teal,fontWeight:900,fontSize:20}}>{fmt(totalA)}</p>
          <p style={{color:T.muted,fontSize:11,marginTop:2}}>Assets</p>
        </div>
        <div style={{width:1,height:32,background:T.border}}/>
        <div style={{textAlign:"center"}}>
          <p style={{color:T.red,fontWeight:900,fontSize:20}}>{fmt(totalL)}</p>
          <p style={{color:T.muted,fontSize:11,marginTop:2}}>Liabilities</p>
        </div>
        <div style={{width:1,height:32,background:T.border}}/>
        <div style={{textAlign:"center"}}>
          <p style={{color:nw>=0?T.green:T.red,fontWeight:900,fontSize:20}}>{fmt(nw)}</p>
          <p style={{color:T.muted,fontSize:11,marginTop:2}}>Net worth</p>
        </div>
      </div>
      {totalA>0&&<div style={{background:T.card,borderRadius:10,padding:"10px 12px"}}>
        <p style={{color:"#C8D8EC",fontSize:12,lineHeight:1.5}}>👥 At your age, people who actively track their finances typically have around <strong style={{color:T.teal}}>{fmt(median)}</strong>. The fact you're measuring puts you ahead of those who don't.</p>
      </div>}
    </div>
  )
}

/* ══════════════════ LEVEL DATA ENTRY COMPONENTS ══════════════════ */
function Level1DataEntry({data,updateNested,age}){
  const assets=data.assets||{}
  const liabs=data.liabilities||{}
  const[step,setStep]=useState("assets")
  const lv=LEVELS[0]
  const totalA=Object.values(assets).reduce((s,v)=>s+(v||0),0)
  const totalL=Object.values(liabs).reduce((s,v)=>s+(v||0),0)
  return(
    <div>
      <div style={{background:T.tealDim,border:`1px solid ${T.tealBorder}`,borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:16}}>💡</span>
        <p style={{color:T.teal,fontSize:13,lineHeight:1.4}}>Estimates are fine. Tap any type to see where to find the number.</p>
      </div>
      {/* Step tabs */}
      <div style={{display:"flex",background:T.surface,borderRadius:14,padding:4,marginBottom:20,border:`1px solid ${T.border}`}}>
        <button onClick={()=>setStep("assets")} style={{flex:1,background:step==="assets"?T.card:"transparent",border:`1px solid ${step==="assets"?T.border:"transparent"}`,borderRadius:11,padding:"10px 8px",cursor:"pointer",fontFamily:"inherit",color:step==="assets"?T.teal:T.muted,fontWeight:700,fontSize:13,transition:"all .15s"}}>
          🟢 Assets {totalA>0&&`· £${Math.round(totalA/1000)}k`}
        </button>
        <button onClick={()=>setStep("debts")} style={{flex:1,background:step==="debts"?T.card:"transparent",border:`1px solid ${step==="debts"?T.border:"transparent"}`,borderRadius:11,padding:"10px 8px",cursor:"pointer",fontFamily:"inherit",color:step==="debts"?T.red:T.muted,fontWeight:700,fontSize:13,transition:"all .15s"}}>
          🔴 Debts {totalL>0&&`· £${Math.round(totalL/1000)}k`}
        </button>
      </div>
      {step==="assets"&&(
        <div>
          <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:22,marginBottom:4}}>What do you own?</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Tap each one. Rough estimates are totally fine.</p>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:16}}>
            {lv.dataFields.assets.map(f=>(
              <TileInput key={f.id} emoji={f.emoji} label={f.label} sub={f.sub} hint={f.hint}
                value={assets[f.id]||0} onChange={v=>updateNested("assets",f.id,v)}/>
            ))}
          </div>
          <button onClick={()=>setStep("debts")} style={{width:"100%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
            Next: What do you owe? →
          </button>
        </div>
      )}
      {step==="debts"&&(
        <div>
          <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:22,marginBottom:4}}>What do you owe?</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Tap what applies. No debt? Great — skip straight through.</p>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {lv.dataFields.liabilities.map(f=>(
              <TileInput key={f.id} emoji={f.emoji} label={f.label} sub={f.sub}
                value={liabs[f.id]||0} onChange={v=>updateNested("liabilities",f.id,v)}/>
            ))}
          </div>
        </div>
      )}
      <NetWorthBar assets={assets} liabilities={liabs} age={age}/>
    </div>
  )
}

function Level2DataEntry({data,updateNested,updateData}){
  const income=data.income||{}
  const fixed=data.fixed||{}
  const variable=data.variable||{}
  const subs=data.subscriptions||[]
  const[step,setStep]=useState("income")
  const[subName,setSubName]=useState("")
  const[subAmt,setSubAmt]=useState("")
  const lv=LEVELS[1]
  const totalIncome=Object.values(income).reduce((s,v)=>s+(v||0),0)
  const totalFixed=Object.values(fixed).reduce((s,v)=>s+(v||0),0)
  const totalSubs=subs.reduce((s,x)=>s+(x.amount||0),0)
  const totalVar=Object.values(variable).reduce((s,v)=>s+(v||0),0)
  const surplus=totalIncome-(totalFixed+totalSubs+totalVar)
  function addSub(){if(!subName||!subAmt)return;updateData("subscriptions",[...subs,{name:subName,amount:parseFloat(subAmt)||0}]);setSubName("");setSubAmt("")}
  function removeSub(i){updateData("subscriptions",subs.filter((_,idx)=>idx!==i))}
  const STEPS=["income","fixed","variable","subscriptions"]
  const stepIdx=STEPS.indexOf(step)
  return(
    <div>
      {/* Step pills */}
      <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
        {["💼 Income","🏠 Fixed","🛒 Variable","📱 Subs"].map((label,i)=>(
          <button key={i} onClick={()=>setStep(STEPS[i])} style={{flexShrink:0,background:i===stepIdx?T.teal:i<stepIdx?`${T.teal}15`:T.card,border:`1px solid ${i===stepIdx?T.teal:i<stepIdx?T.tealBorder:T.border}`,borderRadius:99,padding:"7px 14px",cursor:"pointer",fontFamily:"inherit",color:i===stepIdx?"#070D1A":i<stepIdx?T.teal:T.muted,fontWeight:700,fontSize:12}}>
            {i<stepIdx?"✓ ":""}{label}
          </button>
        ))}
      </div>

      {step==="income"&&(
        <div>
          <div style={{textAlign:"center",marginBottom:20}}>
            <span style={{fontSize:44,display:"block",marginBottom:10}}>💼</span>
            <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:22,marginBottom:4}}>What's your monthly take-home?</h3>
            <p style={{color:T.muted,fontSize:13}}>After tax. This powers your surplus and projection calculations.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:16}}>
            {lv.dataFields.income.map(f=>(
              <TileInput key={f.id} emoji={f.emoji} label={f.label} sub={f.sub} hint={f.hint}
                value={income[f.id]||0} onChange={v=>updateNested("income",f.id,v)}/>
            ))}
          </div>
          {totalIncome>0&&<div style={{background:T.greenDim,border:`1px solid ${T.green}30`,borderRadius:14,padding:"14px",marginBottom:16,textAlign:"center"}}>
            <p style={{color:T.green,fontWeight:900,fontSize:22}}>£{Math.round(totalIncome).toLocaleString("en-GB")}/month</p>
            <p style={{color:T.muted,fontSize:12,marginTop:4}}>£{Math.round(totalIncome*12).toLocaleString("en-GB")}/year take-home</p>
          </div>}
          <button onClick={()=>setStep("fixed")} style={{width:"100%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Continue →</button>
        </div>
      )}

      {step==="fixed"&&(
        <div>
          <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:20,marginBottom:4}}>Fixed costs</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Leaves every month, no matter what.</p>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:16}}>
            {lv.dataFields.fixed.map(f=>(
              <TileInput key={f.id} emoji={f.emoji} label={f.label} sub={f.sub}
                value={fixed[f.id]||0} onChange={v=>updateNested("fixed",f.id,v)}/>
            ))}
          </div>
          <button onClick={()=>setStep("variable")} style={{width:"100%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Continue →</button>
        </div>
      )}

      {step==="variable"&&(
        <div>
          <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:20,marginBottom:4}}>Variable spending</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Monthly estimates — be honest, not aspirational.</p>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:16}}>
            {lv.dataFields.variable.map(f=>(
              <TileInput key={f.id} emoji={f.emoji} label={f.label} sub={f.sub}
                value={variable[f.id]||0} onChange={v=>updateNested("variable",f.id,v)}/>
            ))}
          </div>
          <button onClick={()=>setStep("subscriptions")} style={{width:"100%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Continue →</button>
        </div>
      )}

      {step==="subscriptions"&&(
        <div>
          <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:20,marginBottom:4}}>Subscriptions</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Check your bank statement. Add every recurring payment.</p>
          {subs.length>0&&<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
            {subs.map((s,i)=>(
              <div key={i} style={{background:T.card,border:`1px solid ${T.purpleBorder}`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:16}}>📱</span>
                <p style={{color:"#FFFFFF",fontWeight:600,fontSize:13,flex:1}}>{s.name}</p>
                <p style={{color:T.purple,fontWeight:700,fontSize:13}}>£{s.amount}/mo</p>
                <button onClick={()=>removeSub(i)} style={{background:"none",border:"none",color:T.red,cursor:"pointer",padding:4}}><X size={14}/></button>
              </div>
            ))}
          </div>}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",marginBottom:12}}>
            <p style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:8,letterSpacing:.5}}>ADD SUBSCRIPTION</p>
            <input value={subName} onChange={e=>setSubName(e.target.value)} placeholder="e.g. Netflix, Gym, Spotify" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:"#FFFFFF",fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:8}}/>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,display:"flex",alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                <span style={{padding:"0 10px",color:T.muted,fontWeight:700}}>£</span>
                <input type="number" value={subAmt} onChange={e=>setSubAmt(e.target.value)} placeholder="0" style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#FFFFFF",fontSize:14,fontFamily:"inherit",padding:"10px 8px 10px 0"}}/>
                <span style={{padding:"0 10px",color:T.muted,fontSize:11}}>/mo</span>
              </div>
              <button onClick={addSub} style={{background:T.teal,border:"none",borderRadius:10,padding:"10px 16px",color:"#070D1A",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
            </div>
          </div>
          {totalSubs>0&&<div style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:12,padding:"12px 14px",marginBottom:12}}>
            <p style={{color:T.purple,fontWeight:700,fontSize:13}}>📱 Total: £{totalSubs}/month — £{Math.round(totalSubs*12).toLocaleString("en-GB")}/year</p>
          </div>}
        </div>
      )}

      {/* Live surplus bar */}
      {totalIncome>0&&<div style={{background:"#070F1E",border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",marginTop:10}}>
        <p style={{color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>YOUR PICTURE SO FAR</p>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <p style={{color:T.teal,fontWeight:900,fontSize:18}}>£{Math.round(totalIncome).toLocaleString("en-GB")}</p>
            <p style={{color:T.muted,fontSize:11,marginTop:2}}>Income</p>
          </div>
          <div style={{width:1,height:28,background:T.border}}/>
          <div style={{textAlign:"center"}}>
            <p style={{color:T.amber,fontWeight:900,fontSize:18}}>£{Math.round(totalFixed+totalSubs+totalVar).toLocaleString("en-GB")}</p>
            <p style={{color:T.muted,fontSize:11,marginTop:2}}>Spending</p>
          </div>
          <div style={{width:1,height:28,background:T.border}}/>
          <div style={{textAlign:"center"}}>
            <p style={{color:surplus>=0?T.green:T.red,fontWeight:900,fontSize:18}}>{surplus>=0?"":"–"}£{Math.abs(Math.round(surplus)).toLocaleString("en-GB")}</p>
            <p style={{color:T.muted,fontSize:11,marginTop:2}}>Surplus</p>
          </div>
        </div>
      </div>}
    </div>
  )
}

const DEBT_TILES=[
  {id:"mortgage",emoji:"🏠",label:"Mortgage",apr:"~4.5% APR",aprDefault:"4.5"},
  {id:"creditCards",emoji:"💳",label:"Credit Cards",apr:"~24% APR",aprDefault:"24"},
  {id:"carFinance",emoji:"🚗",label:"Car Finance",apr:"~9% APR",aprDefault:"9"},
  {id:"personalLoan",emoji:"👤",label:"Personal Loan",apr:"~11% APR",aprDefault:"11"},
  {id:"bnpl",emoji:"🛍️",label:"Buy Now Pay Later",apr:"~29% APR",aprDefault:"29"},
  {id:"overdraft",emoji:"🏦",label:"Overdraft",apr:"~19% APR",aprDefault:"19"},
  {id:"studentLoan",emoji:"🎓",label:"Student Loan",apr:"~varies",aprDefault:"6"},
  {id:"otherDebt",emoji:"📦",label:"Other Debt",apr:"~15% APR",aprDefault:"15"},
]

function Level5DataEntry({data,updateData}){
  const debts=data.debts||{}
  const totalDebt=Object.values(debts).reduce((s,d)=>s+(d?.balance||0),0)
  const monthlyInterest=Object.values(debts).reduce((s,d)=>{
    const apr=(d?.apr||20)/100;return s+(d?.balance||0)*apr/12
  },0)
  function onChange(id,balance,apr){
    const nd={...debts};if(balance>0){nd[id]={balance,apr}}else{delete nd[id]}
    updateData("debts",nd)
  }
  return(
    <div>
      <div style={{background:T.amberDim,border:`1px solid ${T.amberBorder}`,borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:16}}>💡</span>
        <p style={{color:T.amber,fontSize:13,lineHeight:1.4}}>Knowing your debts is the first step to clearing them. We use estimated rates — update any time.</p>
      </div>
      <h3 style={{color:"#FFFFFF",fontWeight:900,fontSize:22,marginBottom:4}}>What do you owe?</h3>
      <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Tap what applies. No debt? Great — just hit Continue.</p>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
        {DEBT_TILES.map(tile=>(
          <DebtTileInput key={tile.id} tile={tile}
            balance={debts[tile.id]?.balance||0}
            apr={debts[tile.id]?.apr||0}
            onChange={(bal,apr)=>onChange(tile.id,bal,apr)}/>
        ))}
      </div>
      {/* Debt summary bar */}
      <div style={{background:"#070F1E",border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",marginTop:8}}>
        <p style={{color:T.muted,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>YOUR DEBT PICTURE</p>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <p style={{color:T.red,fontWeight:900,fontSize:18}}>£{Math.round(totalDebt).toLocaleString("en-GB")}</p>
            <p style={{color:T.muted,fontSize:11,marginTop:2}}>Total owed</p>
          </div>
          <div style={{width:1,height:28,background:T.border}}/>
          <div style={{textAlign:"center"}}>
            <p style={{color:T.amber,fontWeight:900,fontSize:18}}>£{Math.round(monthlyInterest).toLocaleString("en-GB")}</p>
            <p style={{color:T.muted,fontSize:11,marginTop:2}}>Interest/month</p>
          </div>
          <div style={{width:1,height:28,background:T.border}}/>
          <div style={{textAlign:"center"}}>
            <p style={{color:T.white,fontWeight:900,fontSize:18}}>{Object.keys(debts).length}</p>
            <p style={{color:T.muted,fontSize:11,marginTop:2}}>Debts tracked</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Level9DataEntry({data,updateNested,age}){
  const inv=data.investing||{}
  return(<div>
    <p style={{color:T.green,fontWeight:800,fontSize:15,marginBottom:12}}>Your investing plan</p>
    <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:16}}>
      <TileInput emoji="💰" label="Monthly investment amount" sub="From your surplus" value={inv.monthlyInvestment||0} onChange={v=>updateNested("investing","monthlyInvestment",v)}/>
      <TileInput emoji="📊" label="Any existing ISA balance" sub="If you have one already" value={inv.currentISA||0} onChange={v=>updateNested("investing","currentISA",v)}/>
    </div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px",marginBottom:12}}>
      <p style={{color:"#C8D8EC",fontSize:12,fontWeight:600,marginBottom:10}}>Target age to stop working</p>
      <input type="range" min="50" max="70" value={inv.targetAge||65} onChange={e=>updateNested("investing","targetAge",parseInt(e.target.value))} style={{width:"100%",accentColor:T.teal,marginBottom:8}}/>
      <p style={{color:T.teal,fontWeight:900,fontSize:26,textAlign:"center"}}>{inv.targetAge||65}</p>
    </div>
    {inv.monthlyInvestment>0&&<div style={{background:T.greenDim,border:`1px solid ${T.green}30`,borderRadius:14,padding:"12px 16px"}}>
      <p style={{color:T.green,fontWeight:700,fontSize:13}}>📈 At £{inv.monthlyInvestment}/month at 7% average growth, in 20 years: approximately £{Math.round(inv.monthlyInvestment*12*((Math.pow(1.07,20)-1)/0.07)).toLocaleString("en-GB")}</p>
    </div>}
  </div>)
}

/* ══════════════════ OUTPUT COMPONENTS ══════════════════ */
const fmt=v=>{if(v==null||isNaN(v))return"£0";const a=Math.abs(Math.round(v)).toLocaleString("en-GB");return v<0?`-£${a}`:`£${a}`}
const fmtK=v=>{if(v==null||isNaN(v))return"£0";const a=Math.abs(v);return a>=1000000?`£${(a/1e6).toFixed(1)}M`:a>=1000?`£${(a/1000).toFixed(0)}k`:`£${Math.round(a)}`}
const CHART_COLORS=[T.teal,T.green,T.amber,T.purple,T.blue,T.red,"#F472B6"]

function Level1Outputs({data,age}){
  const assets=data.assets||{};const liabs=data.liabilities||{}
  const totalA=Object.values(assets).reduce((s,v)=>s+(v||0),0)
  const totalL=Object.values(liabs).reduce((s,v)=>s+(v||0),0)
  const nw=totalA-totalL
  const productive=(assets.savings||0)+(assets.pension||0)+(assets.investments||0)
  const lifestyle=(assets.property||0)+(assets.vehicle||0)+(assets.other||0)+(assets.goldCrypto||0)+(assets.business||0)
  const median=getMedian(age)
  const userAge=age||30

  if(totalA===0&&totalL===0)return(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{filter:"blur(7px)",opacity:.25,marginBottom:20}}>
        <div style={{width:160,height:160,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal}40,${T.purple}40)`,margin:"0 auto"}}/>
      </div>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:17,marginBottom:8}}>Enter your numbers to see your picture</p>
      <p style={{color:T.muted,fontSize:13}}>Go to the Your Numbers tab to get started.</p>
    </div>)

  // Projection — matches image 5 style
  const projData=[];for(let y=0;y<=Math.max(70-userAge,10);y++){
    projData.push({
      age:userAge+y,
      realistic:Math.max(0,Math.round(nw+(y*12*280*(1+0.035*y/2)))),
      optimistic:Math.max(0,Math.round(nw+(y*12*560*(1+0.065*y/2))))
    })
  }
  const finalRealistic=projData[projData.length-1]?.realistic||0
  const finalOptimistic=projData[projData.length-1]?.optimistic||0

  const pieData=[]
  if(productive>0)pieData.push({name:"Productive",value:productive,fill:T.teal})
  if(lifestyle>0)pieData.push({name:"Lifestyle",value:lifestyle,fill:T.amber})
  if(totalL>0)pieData.push({name:"Liabilities",value:totalL,fill:T.red})

  return(<div>
    {/* Hero net worth */}
    <div style={{textAlign:"center",padding:"20px 0 20px",borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
      <p style={{color:T.muted,fontSize:12,fontWeight:600,marginBottom:8,letterSpacing:.8,textTransform:"uppercase"}}>Your net worth today</p>
      <p style={{fontSize:"clamp(44px,10vw,64px)",fontWeight:900,color:nw>=0?T.teal:T.red,lineHeight:1,textShadow:nw>=0?`0 0 60px ${T.teal}40`:`0 0 60px ${T.red}30`}}>{fmt(nw)}</p>
      <p style={{color:"#8FA3BE",fontSize:13,marginTop:10,lineHeight:1.5}}>{nw>=0?"Net positive — tracking puts you ahead.":"Negative net worth is common in your 20s–30s. The plan starts here."}</p>
    </div>

    {/* Asset composition donut */}
    {pieData.length>0&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:14}}>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:14,marginBottom:14}}>What you're made of</p>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <div style={{width:110,height:110,flexShrink:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
              {pieData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
            </Pie></PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{flex:1}}>
          {pieData.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:d.fill}}/><p style={{color:"#C8D8EC",fontSize:12}}>{d.name}</p></div>
            <p style={{color:d.fill,fontWeight:700,fontSize:13}}>{fmt(d.value)}</p>
          </div>)}
        </div>
      </div>
    </div>}

    {/* UK comparison */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"18px",marginBottom:14}}>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:14,marginBottom:10}}>👥 UK comparison (age {userAge})</p>
      <div style={{display:"flex",gap:10,marginBottom:8}}>
        <div style={{flex:1,background:T.surface,borderRadius:10,padding:"10px",textAlign:"center"}}>
          <p style={{color:T.teal,fontWeight:900,fontSize:18}}>{fmt(nw)}</p>
          <p style={{color:T.muted,fontSize:11,marginTop:3}}>Your net worth</p>
        </div>
        <div style={{flex:1,background:T.surface,borderRadius:10,padding:"10px",textAlign:"center"}}>
          <p style={{color:T.muted,fontWeight:900,fontSize:18}}>{fmt(median)}</p>
          <p style={{color:T.muted,fontSize:11,marginTop:3}}>UK median</p>
        </div>
      </div>
      <p style={{color:"#C8D8EC",fontSize:12,lineHeight:1.5}}>{nw>=median?"You are above the UK median. Tracking consistently means you will stay ahead.":"Tracking is the first step. People who measure consistently close the gap faster."}</p>
    </div>

    {/* Wealth projection — styled like image 5 */}
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:14}}>
      <p style={{color:T.teal,fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>LIFESMART WEALTH PROJECTION</p>
      <p style={{color:T.teal,fontWeight:900,fontSize:38,lineHeight:1,marginBottom:4}}>{fmtK(finalRealistic)}</p>
      <p style={{color:"#8FA3BE",fontSize:12,marginBottom:14}}>Based on your current assets, a conservative growth estimate and your financial profile. As you complete levels and build your assets, this number will grow.</p>
      <div style={{background:`${T.amber}15`,border:`1px solid ${T.amberBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:16}}>
        <p style={{color:T.amber,fontWeight:700,fontSize:12,lineHeight:1.5}}>✨ Or {fmtK(finalOptimistic)} with the right money decisions — optimising your investments and pension could get you there.</p>
      </div>
      <div style={{height:200}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs>
              <linearGradient id="gReal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.25}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="age" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={44}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={v=>`Age ${v}`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:"#FFFFFF"}}/>
            <Area type="monotone" dataKey="realistic" stroke={T.teal} strokeWidth={2.5} fill="url(#gReal)" dot={false} name="Realistic (conservative)"/>
            <Area type="monotone" dataKey="optimistic" stroke={T.amber} strokeWidth={1.5} fill="none" strokeDasharray="5 3" dot={false} name="Optimistic (right decisions)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"flex",gap:16,marginTop:10}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:3,background:T.teal,borderRadius:2}}/><span style={{color:"#C8D8EC",fontSize:10}}>Realistic (conservative)</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:0,borderTop:`2px dashed ${T.amber}`}}/><span style={{color:"#C8D8EC",fontSize:10}}>Optimistic (right decisions)</span></div>
      </div>
    </div>

    {/* Personalised read */}
    <div style={{background:`${nw>=0?T.teal:T.amber}10`,border:`1px solid ${nw>=0?T.tealBorder:T.amberBorder}`,borderRadius:18,padding:"18px"}}>
      <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.65}}>
        {nw<0?"Your net worth is "+fmt(nw)+". This means debts currently outweigh assets — more common in your 20s and 30s than people realise. Your income is your biggest asset right now. Level 5 deals with debt directly.":nw<50000?"You are net positive. The projection above shows what consistent, intentional decisions could do to this number over the next 20–30 years.":"You have built a solid foundation. The focus now is making sure your assets are working as hard as possible — and that the right proportion is in productive, growing assets."}
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
  if(totalIncome===0)return(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{filter:"blur(6px)",opacity:.25,marginBottom:16}}><div style={{width:200,height:32,borderRadius:8,background:`linear-gradient(90deg,${T.teal}40,${T.amber}40,${T.purple}40)`,margin:"0 auto"}}/></div>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:16,marginBottom:6}}>Enter your income and spending</p>
      <p style={{color:T.muted,fontSize:13}}>Go to Your Numbers to get started.</p>
    </div>)
  const barData=[{name:"Income",value:totalIncome,fill:T.teal}]
  if(totalFixed>0)barData.push({name:"Fixed",value:totalFixed,fill:T.amber})
  if(totalSubs>0)barData.push({name:"Subs",value:totalSubs,fill:T.purple})
  if(totalVar>0)barData.push({name:"Variable",value:totalVar,fill:T.blue})
  if(surplus>0)barData.push({name:"Surplus",value:surplus,fill:T.green})
  const spendPct=totalIncome>0?Math.round(totalSpend/totalIncome*100):0
  return(<div>
    <div style={{textAlign:"center",padding:"20px 0 20px",borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
      <p style={{color:T.muted,fontSize:12,fontWeight:600,marginBottom:8,letterSpacing:.8,textTransform:"uppercase"}}>Your monthly surplus</p>
      <p style={{fontSize:"clamp(40px,10vw,60px)",fontWeight:900,color:surplus>=0?T.green:T.red,lineHeight:1}}>{fmt(surplus)}</p>
      <p style={{color:"#C8D8EC",fontSize:13,marginTop:8}}>{surplus>=0?"This is what you have to work with each month.":"You are currently spending more than you earn."}</p>
    </div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:14}}>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:14,marginBottom:12}}>Monthly breakdown</p>
      <div style={{height:160}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{left:0,right:10}}>
            <XAxis dataKey="name" tick={{fontSize:10,fill:"#C8D8EC"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={42}/>
            <Tooltip formatter={v=>fmt(v)} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:"#FFFFFF"}}/>
            <Bar dataKey="value" radius={[6,6,0,0]}>{barData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"18px",marginBottom:14}}>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:14,marginBottom:8}}>Spending ratio</p>
      <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>You spend <strong style={{color:spendPct>80?T.amber:T.teal}}>{spendPct}%</strong> of your income. The 50/30/20 guideline suggests 80% max on spending and 20% saving/investing.</p>
    </div>
    {totalSubs>0&&<div style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:20,padding:"18px",marginBottom:14}}>
      <p style={{color:T.purple,fontWeight:700,fontSize:14,marginBottom:6}}>📱 Subscription spotlight</p>
      <p style={{color:"#C8D8EC",fontSize:13,marginBottom:8}}>Your subscriptions total <strong style={{color:T.purple}}>{fmt(totalSubs)}/month</strong> — {fmt(totalSubs*12)}/year.</p>
      {subs.map((s,i)=><p key={i} style={{color:"#C8D8EC",fontSize:12,marginBottom:3}}>· {s.name}: £{s.amount}/mo</p>)}
    </div>}
    <CoffeeCalculator/>
    {surplus>0&&<div style={{background:T.greenDim,border:`1px solid rgba(52,211,153,.3)`,borderRadius:18,padding:"18px"}}>
      <p style={{color:T.green,fontWeight:700,fontSize:14,marginBottom:6}}>Annual impact</p>
      <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>Your surplus of {fmt(surplus)} is <strong style={{color:T.green}}>{fmt(surplus*12)}/year</strong>. Invested at 7% average growth, that becomes approximately {fmt(Math.round(surplus*12*((Math.pow(1.07,20)-1)/0.07)))} over 20 years.</p>
    </div>}
  </div>)
}

function CoffeeCalculator(){
  const[monthly,setMonthly]=useState(100)
  const calcG=(m,y)=>Math.round(m*12*((Math.pow(1.07,y)-1)/0.07))
  const chartData=[{year:0,value:0},{year:5,value:calcG(monthly,5)},{year:10,value:calcG(monthly,10)},{year:20,value:calcG(monthly,20)},{year:30,value:calcG(monthly,30)}]
  return(
    <div style={{background:T.card,border:`1.5px solid ${T.tealBorder}`,borderRadius:20,padding:"22px",marginBottom:14}}>
      <p style={{color:T.teal,fontWeight:800,fontSize:15,marginBottom:4}}>☕ What if you redirected £{monthly}/month?</p>
      <p style={{color:T.muted,fontSize:12,marginBottom:14}}>Projected at 7% average annual growth (S&P 500 long-term)</p>
      <input type="range" min="25" max="500" step="25" value={monthly} onChange={e=>setMonthly(Number(e.target.value))} style={{width:"100%",accentColor:T.teal,marginBottom:10}}/>
      <p style={{color:T.teal,fontWeight:900,fontSize:22,textAlign:"center",marginBottom:14}}>£{monthly}/month</p>
      <div style={{height:130}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs><linearGradient id="gCoffee" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="year" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}yr`}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={40}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={v=>`${v} years`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:"#FFFFFF"}}/>
            <Area type="monotone" dataKey="value" stroke={T.teal} strokeWidth={2.5} fill="url(#gCoffee)" dot={{fill:T.teal,r:4}} name="Portfolio value"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:12}}>
        <p style={{color:"#C8D8EC",fontSize:12}}>· £5/day coffee = £150/mo → <strong style={{color:T.teal}}>{fmtK(calcG(150,20))}</strong> in 20 years</p>
        <p style={{color:"#C8D8EC",fontSize:12}}>· £50/mo less eating out → <strong style={{color:T.teal}}>{fmtK(calcG(50,20))}</strong> in 20 years</p>
        <p style={{color:"#C8D8EC",fontSize:12}}>· Cancel 3 subs (£40/mo) → <strong style={{color:T.teal}}>{fmtK(calcG(40,20))}</strong> in 20 years</p>
      </div>
      <p style={{color:T.muted,fontSize:11,marginTop:10,fontStyle:"italic"}}>This is not about deprivation. It is about knowing the true cost of each choice.</p>
    </div>
  )
}

function Level9Outputs({data,age}){
  const inv=data.investing||{};const monthly=inv.monthlyInvestment||0;const currentISA=inv.currentISA||0;const targetAge=inv.targetAge||65
  const userAge=age||30;const years=Math.max(targetAge-userAge,5)
  if(monthly===0&&currentISA===0)return(<div style={{textAlign:"center",padding:"60px 20px"}}><p style={{color:"#FFFFFF",fontWeight:700,fontSize:16}}>Enter your investing numbers in Your Numbers</p></div>)
  const projData=[];for(let y=0;y<=years;y++){
    projData.push({age:userAge+y,conservative:Math.round((currentISA*(Math.pow(1.05,y)))+(monthly*12*((Math.pow(1.05,y)-1)/0.05))),moderate:Math.round((currentISA*(Math.pow(1.07,y)))+(monthly*12*((Math.pow(1.07,y)-1)/0.07))),growth:Math.round((currentISA*(Math.pow(1.09,y)))+(monthly*12*((Math.pow(1.09,y)-1)/0.09)))})
  }
  const finalMod=projData[projData.length-1]?.moderate||0
  const passiveIncome=Math.round(finalMod*0.04)
  return(<div>
    <div style={{textAlign:"center",marginBottom:24}}>
      <p style={{color:T.muted,fontSize:12,fontWeight:600,marginBottom:8,letterSpacing:.8,textTransform:"uppercase"}}>Projected portfolio at age {targetAge}</p>
      <p style={{fontSize:"clamp(36px,9vw,52px)",fontWeight:900,color:T.teal,lineHeight:1}}>{fmtK(finalMod)}</p>
      <p style={{color:"#C8D8EC",fontSize:13,marginTop:8}}>At {fmt(monthly)}/month with 7% average growth</p>
    </div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:14}}>
      <p style={{color:"#FFFFFF",fontWeight:700,fontSize:14,marginBottom:12}}>Compound growth projection</p>
      <div style={{height:200}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs><linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="age" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.subtle}} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={48}/>
            <Tooltip formatter={v=>fmt(v)} labelFormatter={v=>`Age ${v}`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,color:"#FFFFFF"}}/>
            <Area type="monotone" dataKey="growth" stroke={T.green} strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false} name="Growth (9%)"/>
            <Area type="monotone" dataKey="moderate" stroke={T.teal} strokeWidth={2.5} fill="url(#gInv)" dot={false} name="Moderate (7%)"/>
            <Area type="monotone" dataKey="conservative" stroke={T.muted} strokeWidth={1} fill="none" strokeDasharray="2 4" dot={false} name="Conservative (5%)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div style={{background:`${T.teal}10`,border:`1.5px solid ${T.tealBorder}`,borderRadius:18,padding:"20px"}}>
      <p style={{color:T.teal,fontWeight:800,fontSize:15,marginBottom:8}}>🔥 Financial freedom indicator</p>
      <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6}}>At this rate, your projected portfolio at age {targetAge} could generate approximately <strong style={{color:T.teal}}>{fmt(passiveIncome)}/year</strong> in passive income (at 4% drawdown rate).</p>
    </div>
  </div>)
}

/* ══════════════════ LEVEL PLAYER ══════════════════ */
function LevelPlayer({level,onBack}){
  const{state,save,toast}=useApp()
  const lp=state.learningProgress||{currentLevel:1,completedLevels:[],levelData:{}}
  const ld=lp.levelData?.[`level${level.n}`]||{}
  const[tab,setTab]=useState("learn")
  const[showConfetti,setShowConfetti]=useState(false)
  const pc=PC[level.phase]||T.teal
  const[data,setData]=useState(ld)
  function updateData(key,val){setData(prev=>{const n={...prev,[key]:val};saveLevelData(n);return n})}
  function updateNested(group,key,val){setData(prev=>{const n={...prev,[group]:{...(prev[group]||{}),[key]:val}};saveLevelData(n);return n})}
  function saveLevelData(d){save({...state,learningProgress:{...lp,levelData:{...lp.levelData,[`level${level.n}`]:d}}})}
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
      <div style={{background:"rgba(11,20,36,.96)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
        <div style={{flex:1,minWidth:0}}>
          <p style={{color:pc,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{level.phase} · Level {level.n}</p>
          <p style={{color:"#FFFFFF",fontWeight:800,fontSize:14,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{level.title}</p>
        </div>
        {isComplete&&<span style={{background:T.greenDim,color:T.green,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,flexShrink:0}}>✓ Done</span>}
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surface,flexShrink:0}}>
        {TABS.map(t=>{const active=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",padding:"11px 4px",cursor:"pointer",fontFamily:"inherit",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
            <span style={{fontSize:11}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:active?700:500,color:active?T.teal:T.muted}}>{t.label}</span>
            {active&&<div style={{position:"absolute",bottom:0,left:"8%",right:"8%",height:2,borderRadius:2,background:T.teal}}/>}
          </button>
        )})}
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:40}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"20px 18px"}}>

          {tab==="learn"&&(
            <div className="ls-fadein">
              <div style={{background:`${pc}12`,border:`1px solid ${pc}22`,borderRadius:14,padding:"12px 16px",marginBottom:20}}>
                <p style={{color:pc,fontWeight:700,fontSize:14,lineHeight:1.5}}>{level.hook}</p>
              </div>
              <SectionCardPlayer sections={level.sections} phaseColor={pc} onDone={()=>setTab("data")}/>
              {level.videos.length>0&&(
                <div style={{marginTop:20}}>
                  <p style={{color:"#FFFFFF",fontWeight:700,fontSize:14,marginBottom:10}}>🎬 Videos</p>
                  {level.videos.map((v,i)=>(
                    <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                      <div style={{width:36,height:36,borderRadius:10,background:v.role==="core"?T.tealDim:T.purpleDim,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Play size={14} color={v.role==="core"?T.teal:T.purple}/>
                      </div>
                      <div style={{flex:1}}><p style={{color:"#FFFFFF",fontWeight:600,fontSize:13}}>{v.title}</p><p style={{color:T.muted,fontSize:11}}>{v.role==="core"?"Core":v.role==="deeper"?"Go deeper":v.role} · {v.min} min</p></div>
                      <span style={{background:v.role==="core"?T.tealDim:T.purpleDim,color:v.role==="core"?T.teal:T.purple,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99}}>Watch</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab==="data"&&(
            <div className="ls-fadein">
              {level.n===1&&<Level1DataEntry data={data} updateNested={updateNested} age={state.profile?.age}/>}
              {level.n===2&&<Level2DataEntry data={data} updateNested={updateNested} updateData={updateData}/>}
              {level.n===5&&<Level5DataEntry data={data} updateData={updateData}/>}
              {level.n===9&&<Level9DataEntry data={data} updateNested={updateNested} age={state.profile?.age}/>}
              {![1,2,5,9].includes(level.n)&&(
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <p style={{fontSize:48,marginBottom:12}}>📊</p>
                  <p style={{color:"#FFFFFF",fontWeight:700,fontSize:16,marginBottom:6}}>Review the lesson first</p>
                  <p style={{color:T.muted,fontSize:13}}>Then complete the action to finish this level.</p>
                </div>
              )}
              <button onClick={()=>setTab("output")} style={{width:"100%",marginTop:20,background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>See your results →</button>
            </div>
          )}

          {tab==="output"&&(
            <div className="ls-fadein">
              {level.n===1&&<Level1Outputs data={data} age={state.profile?.age}/>}
              {level.n===2&&<Level2Outputs data={data}/>}
              {level.n===9&&<Level9Outputs data={data} age={state.profile?.age}/>}
              {![1,2,9].includes(level.n)&&(
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <p style={{fontSize:48,marginBottom:12}}>📈</p>
                  <p style={{color:"#FFFFFF",fontWeight:700,fontSize:16,marginBottom:6}}>Results appear when you enter your numbers</p>
                  <p style={{color:T.muted,fontSize:13}}>Go to Your Numbers to see charts and insights.</p>
                </div>
              )}
              <button onClick={()=>setTab("action")} style={{width:"100%",marginTop:20,background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>See the action →</button>
            </div>
          )}

          {tab==="action"&&(
            <div className="ls-fadein">
              <div style={{background:`${pc}10`,border:`1.5px solid ${pc}30`,borderRadius:20,padding:"24px",marginBottom:16}}>
                <p style={{color:pc,fontWeight:800,fontSize:13,letterSpacing:.5,textTransform:"uppercase",marginBottom:10}}>Your action</p>
                <p style={{color:"#E2EAF6",fontSize:15,lineHeight:1.65,marginBottom:16}}>{level.action}</p>
                <div style={{background:"rgba(0,0,0,.25)",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
                  <p style={{color:T.muted,fontSize:12,fontWeight:700,marginBottom:4}}>Done when:</p>
                  <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>{level.doneWhen}</p>
                </div>
                {!isComplete
                  ?<button onClick={completeLevel} style={{width:"100%",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",borderRadius:14,padding:"16px",color:"#070D1A",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>I have done this ✓</button>
                  :<div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}><Check size={20} color={T.green}/><p style={{color:T.green,fontWeight:800,fontSize:16}}>Level complete!</p></div>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════ HOME TAB ══════════════════ */
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
    if(level.n>=8&&!completed.has(5)){setWarning({type:"red",level,msg:"You have high-interest debt at Level 5 that hasn't been addressed. Investing while paying high APR means your debt grows faster than most investments earn.",link:5,linkText:"Level 5: the maths will shock you →"});return}
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
      <div style={{position:"relative",background:`linear-gradient(180deg,${pc_}12 0%,transparent 100%)`,padding:"28px 20px 20px"}}>
        <StarField count={8}/>
        <div style={{position:"relative",maxWidth:600,margin:"0 auto"}}>
          <p style={{color:"#FFFFFF",fontWeight:800,fontSize:22,marginBottom:4}}>Hey {profile.name} 👋</p>
          <p style={{color:T.muted,fontSize:14,marginBottom:18}}>Level {currentLevel} of 9 · {getPhase(currentLevel)}</p>
          <div style={{background:`linear-gradient(145deg,${pc_}12,${pc_}04)`,border:`2px solid ${pc_}40`,borderRadius:22,padding:"22px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${pc_}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
            <p style={{color:pc_,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Your focus · Level {currentLevel}</p>
            <h2 style={{color:"#FFFFFF",fontWeight:900,fontSize:18,lineHeight:1.2,marginBottom:8}}>{level.title}</h2>
            <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5,marginBottom:4}}>{level.hook}</p>
            <p style={{color:T.muted,fontSize:11,marginBottom:16}}>~{level.time} minutes</p>
            <button onClick={()=>setActiveLevel(currentLevel)} style={{width:"100%",background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Zap size={16}/>Start Level {currentLevel}
            </button>
          </div>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:"18px",marginTop:14}}>
            <p style={{color:"#FFFFFF",fontWeight:700,fontSize:13,marginBottom:8}}>What completing all 9 levels gives you</p>
            {["Know exactly what comes in and goes out each month","No high-interest debt, or a plan with a payoff date","An emergency fund covering 3 months of expenses","A Stocks and Shares ISA with automated investing","A complete picture of your net worth at age 70"].map((item,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
              <Check size={13} color={T.teal} style={{flexShrink:0,marginTop:2}}/><p style={{color:"#C8D8EC",fontSize:12,lineHeight:1.4}}>{item}</p>
            </div>)}
          </div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"0 18px"}}>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginTop:20,marginBottom:24,scrollbarWidth:"none"}}>
          {!profile.personalityResult&&<button onClick={()=>setShowQuiz(true)} style={{flexShrink:0,background:`linear-gradient(135deg,${T.purpleDim},rgba(167,139,250,.03))`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🧠</span><div style={{textAlign:"left"}}><p style={{color:T.purple,fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>Money personality quiz</p><p style={{color:T.muted,fontSize:10}}>4 min · 8 types</p></div>
          </button>}
          {QUICK_WINS.map(qw=><button key={qw.id} onClick={()=>toast(`${qw.label}: coming soon!`)} style={{flexShrink:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{qw.icon}</span><div style={{textAlign:"left"}}><p style={{color:"#FFFFFF",fontWeight:600,fontSize:12,whiteSpace:"nowrap"}}>{qw.label}</p><p style={{color:T.muted,fontSize:10}}>{qw.min} min</p></div>
          </button>)}
        </div>
        <p style={{color:"#FFFFFF",fontWeight:800,fontSize:17,marginBottom:16}}>Your 9 Level Journey</p>
        {phases.map(phase=>{
          const phaseLevels=LEVELS.filter(l=>l.phase===phase)
          const pc2=PC[phase]||T.teal;const pe=PE[phase]||"📦"
          return(<div key={phase} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:16}}>{pe}</span><p style={{color:pc2,fontWeight:800,fontSize:12,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
            </div>
            {phaseLevels.map((lv,i)=>{
              const isDone=completed.has(lv.n);const isCurrent=lv.n===currentLevel;const isFuture=lv.n>currentLevel&&!isDone;const isLast=i===phaseLevels.length-1
              return(<div key={lv.n} style={{display:"flex",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:28,flexShrink:0}}>
                  <div style={{width:isDone?24:isCurrent?28:20,height:isDone?24:isCurrent?28:20,borderRadius:"50%",background:isDone?T.green:isCurrent?T.teal:T.faint,border:`2.5px solid ${isDone?T.green:isCurrent?T.teal:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:isCurrent?`0 0 14px ${T.teal}40`:"none",zIndex:1}}>
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
                  <p style={{color:isDone?"#7A8FA8":"#FFFFFF",fontWeight:700,fontSize:14,lineHeight:1.3,textDecoration:isDone?"line-through":"none"}}>{lv.title}</p>
                  <p style={{color:T.muted,fontSize:12,marginTop:4,lineHeight:1.35}}>{lv.hook.length>65?lv.hook.slice(0,63)+"...":lv.hook}</p>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <span style={{color:T.muted,fontSize:10}}>📖 {lv.sections.length} cards</span>
                    {lv.videos.length>0&&<span style={{color:T.muted,fontSize:10}}>🎬 {lv.videos.length} videos</span>}
                    <span style={{color:T.muted,fontSize:10}}>~{lv.time} min</span>
                  </div>
                </button>
              </div>)})}
          </div>)})}
      </div>
      {warning&&<div style={{position:"fixed",inset:0,background:"rgba(7,13,26,.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
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

/* ══════════════════ PERSONALITY QUIZ ══════════════════ */
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
        <h1 style={{color:"#FFFFFF",fontWeight:900,fontSize:26,textAlign:"center",marginBottom:12,lineHeight:1.2}}>Find out your money personality</h1>
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
        <h2 style={{color:"#FFFFFF",fontWeight:900,fontSize:21,lineHeight:1.25,marginBottom:6,marginTop:14}}>{q.headline}</h2>
        <p style={{color:"#8FA3BE",fontSize:14,marginBottom:28}}>{q.sub}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
          {q.options.map((opt,oi)=>{const sel=selected===oi;return(
            <button key={oi} onClick={()=>setSelected(oi)} style={{background:sel?`linear-gradient(135deg,${T.tealDim},${T.purpleDim})`:T.card,border:`2px solid ${sel?T.teal:T.border}`,borderRadius:14,padding:"15px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:sel?"#FFFFFF":"#E2EAF6",fontWeight:sel?700:500,fontSize:14,lineHeight:1.4,display:"flex",alignItems:"center",gap:12}}>
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
      <h2 style={{color:"#FFFFFF",fontWeight:900,fontSize:28,marginBottom:8}}>{a.name}</h2>
      <p style={{color:a.color,fontWeight:700,fontSize:15,marginBottom:14}}>{a.headline}</p>
      <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.7}}>{a.summary}</p>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:20,background:T.surface,borderRadius:12,padding:4}}>
      {[["overview","Overview"],["traits","Traits"],["blindspot","Blind spot"]].map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:tab===id?T.card:"transparent",border:`1px solid ${tab===id?T.border:"transparent"}`,borderRadius:9,padding:"8px 4px",cursor:"pointer",fontFamily:"inherit",color:tab===id?"#FFFFFF":T.muted,fontWeight:tab===id?700:500,fontSize:12}}>{label}</button>
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

/* ══════════════════ LEARN TAB ══════════════════ */
function LearnTab(){
  const{toast}=useApp();const[expanded,setExpanded]=useState(null)
  return(<div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
    <div style={{padding:"24px 20px 16px",borderBottom:`1px solid rgba(255,255,255,.05)`}}>
      <h2 style={{color:"#FFFFFF",fontWeight:900,fontSize:22,letterSpacing:-.3}}>Learn</h2>
      <p style={{color:T.muted,fontSize:13}}>Explore topics beyond your current level.</p>
    </div>
    <div style={{padding:"20px 18px",maxWidth:600,margin:"0 auto"}}>
      {LEARN_THEMES.map(theme=>{const isOpen=expanded===theme.id;return(<div key={theme.id} style={{marginBottom:12}}>
        <button onClick={()=>setExpanded(isOpen?null:theme.id)} style={{width:"100%",background:isOpen?T.purpleDim:T.card,border:`1.5px solid ${isOpen?T.purpleBorder:T.border}`,borderRadius:18,padding:"18px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:24}}>{theme.icon}</span><div style={{flex:1}}><p style={{color:"#FFFFFF",fontWeight:700,fontSize:15}}>{theme.title}</p><p style={{color:T.muted,fontSize:12}}>{theme.items.length} topics</p></div>
          <ChevronDown size={18} color={T.muted} style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}/>
        </button>
        {isOpen&&<div className="ls-fadein" style={{paddingTop:10,display:"flex",flexDirection:"column",gap:8}}>
          {theme.items.map((item,i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,marginLeft:20}}>
            <Play size={16} color={T.purple}/><div style={{flex:1}}><p style={{color:"#FFFFFF",fontWeight:600,fontSize:13}}>{item.title}</p><p style={{color:T.muted,fontSize:11}}>{item.min} min</p></div>
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
      <p style={{color:"#FFFFFF",fontWeight:800,fontSize:20}}>{profile.name||"You"}</p>
      <p style={{color:T.muted,fontSize:13,marginTop:4}}>Level {currentLevel} of 9</p>
      <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
        <span style={{background:T.faint,color:"#FFFFFF",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.border}`}}>⚡ Level {currentLevel}</span>
        <span style={{background:`${phaseColor}12`,color:phaseColor,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${phaseColor}30`}}>{PE[phase]} {phase}</span>
        {arch&&<span style={{background:T.purpleDim,color:T.purple,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.purpleBorder}`}}>{arch.emoji} {arch.name}</span>}
        {isHalal&&<span style={{background:T.tealDim,color:T.teal,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.tealBorder}`}}>🌙 Halal finance</span>}
      </div>
    </div>
    <div style={{padding:"0 18px",maxWidth:500,margin:"0 auto"}}>
      {arch?<div style={{background:T.card,border:`1.5px solid ${arch.color}25`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{width:44,height:44,borderRadius:13,background:`${arch.color}20`,border:`1px solid ${arch.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{arch.emoji}</div>
          <div><p style={{color:arch.color,fontSize:11,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>Your personality</p><p style={{color:"#FFFFFF",fontWeight:800,fontSize:16}}>{arch.name}</p></div>
        </div>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>{arch.summary.slice(0,120)}...</p>
        <button onClick={()=>setShowQuiz(true)} style={{marginTop:10,background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>View full result →</button>
      </div>:
      <button onClick={()=>setShowQuiz(true)} style={{width:"100%",background:`linear-gradient(135deg,${T.purpleDim},rgba(167,139,250,.03))`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:20,padding:"20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>🧠</span><div><p style={{color:"#FFFFFF",fontWeight:700,fontSize:15}}>Discover your money personality</p><p style={{color:T.muted,fontSize:12}}>12 questions · 4 minutes · 8 types</p></div>
        </div>
      </button>}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><p style={{color:T.teal,fontWeight:900,fontSize:28}}>{xp} XP</p><p style={{color:T.muted,fontSize:12}}>Total earned</p></div>
          <div style={{textAlign:"right"}}><p style={{color:"#FFFFFF",fontWeight:700,fontSize:14}}>{completedCount} levels done</p><p style={{color:T.muted,fontSize:12}}>{9-completedCount} remaining</p></div>
        </div>
        <div style={{background:T.surface,borderRadius:99,height:6,overflow:"hidden"}}><div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99}}/></div>
        <p style={{color:T.muted,fontSize:11,marginTop:6}}>{nextM-xp} XP to next milestone</p>
      </div>
      <div style={{background:T.card,border:`1px solid ${phaseColor}25`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <p style={{color:phaseColor,fontWeight:800,fontSize:14,marginBottom:6}}>{PE[phase]} {phase}</p>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>{phase==="Foundations"?"Getting the real picture of your finances.":phase==="Stabilise"?"Building safety and clearing costly debt.":phase==="Optimise"?"Capturing free money and tax savings.":"Growing real wealth through ISAs and investing."}</p>
      </div>
      <button onClick={()=>{if(window.confirm("Reset all progress? This cannot be undone."))reset()}} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10}}>
        <RotateCcw size={16} color={T.muted}/><p style={{color:T.muted,fontWeight:700,fontSize:14}}>Reset progress</p>
      </button>
    </div>
  </div>)
}

/* ══════════════════ BOTTOM NAV + SHELL ══════════════════ */
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
