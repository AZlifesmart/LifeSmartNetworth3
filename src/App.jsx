import { useState, useEffect, useContext, createContext, useMemo, useRef } from "react"
import { Home, BookOpen, User, Check, X, ChevronLeft, ChevronRight, ChevronDown, Play, Lock, Clock, Zap, AlertTriangle, RotateCcw, Map } from "lucide-react"

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
const PC={Foundations:T.red,Stabilise:T.amber,Optimise:T.blue,Grow:T.green,Protect:T.purple}
const PE={Foundations:"🧱",Stabilise:"🛡️",Optimise:"⚙️",Grow:"🌱",Protect:"🔒"}
const getPhase=n=>n<=3?"Foundations":n<=6?"Stabilise":n<=9?"Optimise":n<=12?"Grow":"Protect"

/* ══════════════════ LEVELS ══════════════════ */
const LEVELS=[
{n:1,phase:"Foundations",title:"Know your actual numbers",
 hook:"Most people are wrong about their own spending. Find your real gap.",
 done:"You can state your monthly take-home, costs and surplus without guessing.",
 micros:[
   {type:"teach",title:"The spending gap",
    content:"You think you spend about £200/month on food. Your bank says £340. This is not unusual. Studies show people underestimate variable spending by 30 to 40%. The gap between what you think and what you actually spend is where money disappears.",
    keyPoint:"The gap between perceived and actual spending is where most money disappears.",
    example:{label:"Monthly reality check",items:[
      {left:"What you think",right:"What it actually is"},
      {left:"Food: £200",right:"Food: £340"},
      {left:"Going out: £100",right:"Going out: £220"},
      {left:"Subscriptions: £30",right:"Subscriptions: £85"},
      {left:"Total: £330/mo",right:"Total: £645/mo"}]}},
   {type:"interactive",title:"Find your gap",
    scenario:"You earn £2,400/month. Rent £850, bills £180, subscriptions £65, transport £120, food £340, phone £35.",
    question:"What is actually left each month?",
    opts:["£810","£610","£510","£410"],correct:0,
    reveal:"£2,400 minus £1,590 in costs = £810. This is your gap. Most people have never calculated it. That £810 is the number that changes your life because now you can decide what to do with it instead of wondering where it went.",
    breakdown:[{label:"Take-home",val:"£2,400"},{label:"Fixed costs",val:"-£1,590"},{label:"Your gap",val:"= £810",highlight:true}]},
   {type:"teach",title:"Why this matters",
    content:"People who track their spending build on average 4 times more wealth than those who do not. Not because they earn more but because knowing your numbers means every financial decision is informed rather than guesswork. This single habit, knowing your gap, is the foundation everything else builds on.",
    keyPoint:"Knowing your gap turns financial guesswork into informed decisions."}
 ],
 videos:[{title:"Tracking Incomes & Outgoings",role:"core",min:3},{title:"Budgeting: 50/30/20",role:"core",min:3},{title:"Know Your Why",role:"deeper",min:3}],
 action:"Run the gap analysis. Write your actual take-home, fixed costs, variable spend. Calculate your gap. This is the number that changes everything.",
 xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:2,phase:"Foundations",title:"Separate needs, wants and waste",
 hook:"You have 9 active subscriptions. You can name 5. What are the other 4 costing you?",
 done:"You have cancelled at least one forgotten subscription and categorised last month's spending.",
 micros:[
   {type:"teach",title:"The subscription trap",
    content:"The average UK adult has £250+ per year in forgotten subscriptions. Apps you downloaded once, free trials that converted, gym memberships you stopped using months ago. They are small enough to ignore individually but collectively they are a significant drain.",
    keyPoint:"£250+ per year leaves most people's accounts for things they do not use.",
    example:{label:"Common hidden subscriptions",items:[
      {left:"App free trials",right:"£5 to £15/month each"},
      {left:"Old gym membership",right:"£25 to £40/month"},
      {left:"Streaming services",right:"£30 to £60/month total"},
      {left:"Insurance add-ons",right:"£5 to £10/month"},
      {left:"Cloud storage upgrades",right:"£2 to £10/month"}]}},
   {type:"interactive",title:"Need, want or waste?",
    scenario:"Look at these monthly spends and categorise them.",
    question:"£400/month on going out. Is that a need, want, or waste?",
    opts:["It is always a want","If it makes you happy it is a need","It depends on whether you can afford it","It is waste if you regret it"],correct:2,
    reveal:"There is no right answer without context. £400 on going out when you have £800 surplus is an intentional choice. £400 when you have £100 surplus and growing debt is a different story. The question is not whether you spend, it is whether you chose to.",
    breakdown:[{label:"Need",val:"Survival costs. Rent, food, transport."},{label:"Want",val:"Chosen spending. Enjoyment, experiences."},{label:"Waste",val:"Spending you did not choose or notice."}]}
 ],
 videos:[{title:"Savings Pots",role:"core",min:3},{title:"Comparison Traps: Financial Freedom",role:"core",min:3}],
 action:"Go through last month's bank statement. Categorise every transaction as need, want, or waste. Cancel at least one subscription you forgot you were paying for.",
 xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:3,phase:"Foundations",title:"Read your payslip",
 hook:"Your payslip says £2,800 gross. You take home £2,190. Where did £610 go?",
 done:"You know your tax code, what it means, and have confirmed it is correct.",
 micros:[
   {type:"teach",title:"Where your money goes before you see it",
    content:"Every month, three things take money from your gross pay before it reaches your bank. Income tax (20% on earnings above £12,570), National Insurance (12% on earnings between £12,570 and £50,270), and your pension contribution (typically 3 to 5%). Most people never check whether these amounts are correct.",
    keyPoint:"Three deductions happen before you see your pay. Most people never verify them.",
    example:{label:"Payslip breakdown on £2,800 gross",items:[
      {left:"Gross pay",right:"£2,800"},
      {left:"Income tax (20%)",right:"-£303"},
      {left:"National Insurance (12%)",right:"-£175"},
      {left:"Pension (5%)",right:"-£140"},
      {left:"Take-home",right:"= £2,182"}]}},
   {type:"interactive",title:"Your tax code",
    scenario:"Your tax code is 1257L. This appears on every payslip and P60.",
    question:"What does the 1257 in your tax code mean?",
    opts:["Your employee number","Your tax-free personal allowance (£12,570)","The percentage of tax you pay","Your National Insurance category"],correct:1,
    reveal:"1257L means your personal allowance is £12,570. The first £12,570 you earn each year is completely tax-free. If your tax code is wrong, HMRC may not tell you, and you could be overpaying or underpaying tax for months. It takes 5 minutes to check on the HMRC website."}
 ],
 videos:[{title:"Banking Basics",role:"deeper",min:3}],
 action:"Check your tax code on the HMRC website (gov.uk/check-income-tax). Confirm it is 1257L or understand why it is different.",
 xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:4,phase:"Stabilise",title:"Kill high-interest debt",
 hook:"The maths will shock you. Interest is probably costing more than you think.",
 done:"Every debt listed, ranked by rate, with a payoff method chosen and target dates set.",
 micros:[
   {type:"teach",title:"The real cost of debt",
    content:"A £5,000 credit card balance at 22% APR, paying only the minimum (about £100/month), takes over 7 years to clear and costs over £3,500 in interest alone. You end up paying £8,500 for your original £5,000 of spending. Adding just £100 extra per month clears it in 2.5 years and saves you over £2,500 in interest.",
    keyPoint:"Minimum payments are designed to maximise profit for lenders, not to help you clear debt.",
    example:{label:"£5,000 credit card at 22% APR",items:[
      {left:"Minimum payments only",right:"7+ years, £3,500 interest"},
      {left:"£100 extra per month",right:"2.5 years, £1,000 interest"},
      {left:"£200 extra per month",right:"1.5 years, £500 interest"},
      {left:"You save",right:"Up to £3,000"}]}},
   {type:"interactive",title:"Which debt first?",
    scenario:"You have 3 debts: £800 at 19% APR, £2,200 at 34% APR, £500 at 9% APR. You have £200 extra per month to put towards debt.",
    question:"Which debt should you pay extra on first?",
    opts:["The £500 at 9% because it is smallest","The £800 at 19% as a middle ground","The £2,200 at 34% because the rate matters most","Pay them all equally"],correct:2,
    reveal:"Avalanche method: attack the highest interest rate first. The £2,200 at 34% costs you £748 per year in interest. The £500 at 9% costs just £45 per year. Clearing the highest rate debt first saves you the most money mathematically. The snowball method (smallest balance first) can work for motivation, but avalanche always saves more.",
    breakdown:[{label:"£2,200 at 34%",val:"£748/year in interest",highlight:true},{label:"£800 at 19%",val:"£152/year in interest"},{label:"£500 at 9%",val:"£45/year in interest"}]},
   {type:"teach",title:"Savings vs debt: the maths",
    content:"If you have £2,000 in savings earning 4% and £1,800 on a credit card at 34% APR, you are losing money every single day. Your savings earn £80 per year. Your card costs £612 per year. That is a net loss of £532 per year for the comfort of seeing money in your savings account. Pay off the card. Then rebuild savings without the anchor.",
    keyPoint:"High-interest debt costs more than savings earn. Clear it first, rebuild savings second."}
 ],
 videos:[{title:"Good debt vs. bad debt",role:"core",min:3},{title:"Cost of Borrowing",role:"core",min:3},{title:"Snowball vs. Avalanche",role:"core",min:3}],
 action:"List every debt with its balance, interest rate and minimum payment. Rank by rate. Choose avalanche (highest rate first) or snowball (smallest first). Write a payoff order with target dates.",
 xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:5,phase:"Stabilise",title:"Build a £1,000 starter buffer",
 hook:"Your boiler breaks. It costs £600. No savings means this becomes debt.",done:"£1,000 in a named easy-access savings account.",
 micros:[{type:"interactive",title:"Emergency = debt spiral",question:"Your boiler breaks in January. Repair costs £600. You have no savings. What happens?",
  opts:["Credit card at 24% APR","Borrow from family","Skip other bills","Any of these, none are good"],correct:3,
  reveal:"Without savings, every emergency becomes debt. A £600 repair on a 24% credit card, paying £50/month, costs £672 total. A £1,000 buffer prevents this spiral entirely."}],
 videos:[{title:"Banking Basics",role:"core",min:3},{title:"Savings Pots",role:"core",min:3}],
 action:"Open a named easy-access savings account. Transfer £1,000 or set up a standing order to get there.",
 xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:6,phase:"Stabilise",title:"Grow to 3 months of essentials",hook:"How long could you survive if your income stopped tomorrow?",done:"3-month essential costs calculated with an automated standing order running.",
 micros:[{type:"interactive",title:"Your safety number",question:"Essentials: rent £800, food £200, transport £120, utilities £90, phone £25. Your 3-month number?",opts:["£2,470","£3,105","£3,705","£4,200"],correct:2,reveal:"£1,235/month × 3 = £3,705. That is your real target."}],
 videos:[],action:"Calculate your 3-month essential costs. Set up a standing order. Name the pot Emergency Fund.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:7,phase:"Optimise",title:"Capture free money at work",hook:"Your employer is offering money you are not taking.",done:"Pension contribution matches employer maximum.",
 micros:[{type:"interactive",title:"The pay rise you have not claimed",question:"Employer matches pension up to 5%. You contribute 3%. On £30,000, how much free money are you missing per year?",opts:["£300","£600","£900","£1,200"],correct:1,reveal:"£600/year. Over 30 years at 7% growth, that compounds to over £56,000 in retirement savings you declined."}],
 videos:[{title:"Retirement Toolkit",role:"core",min:3}],action:"Log into your workplace pension. Check your contribution %. Increase to match your employer's maximum.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:8,phase:"Optimise",title:"Set up sinking funds",hook:"Christmas is not a surprise. Why do people go into debt for it?",done:"At least one named savings pot for a known future expense.",
 micros:[{type:"interactive",title:"Predictable expenses",question:"Car insurance renews in 4 months. It was £640 last year. Monthly amount?",opts:["£100","£160","£200","£640 when due"],correct:1,reveal:"£640 ÷ 4 = £160/month. Starting at renewal = £53/month over 12 months. The longer you plan, the smaller the amount."}],
 videos:[{title:"SMART Goal-Setting",role:"core",min:3},{title:"Savings Pots",role:"core",min:3}],action:"Name your next 3 predictable future expenses. Open named pots with monthly transfers.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:9,phase:"Optimise",title:"Understand your taxes",hook:"Most people misunderstand how tax bands work.",done:"You can explain your own tax situation in under 60 seconds.",
 micros:[{type:"interactive",title:"Tax bands",question:"You earn £38,000. Someone says you are in the 40% tax bracket. Are they right?",opts:["Yes, above the limit","No, only £300 is taxed at 40%","Your effective rate is 40%","Depends on tax code"],correct:1,reveal:"Only £300 is taxed at 40%. Your effective rate is about 17%. This misunderstanding stops people seeking pay rises."}],
 videos:[],action:"Calculate your effective tax rate. Check for missing allowances.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:10,phase:"Grow",title:"Open a Stocks & Shares ISA",hook:"The tax wrapper most people wait too long to use.",done:"You have an open Stocks & Shares ISA.",
 micros:[{type:"interactive",title:"Cash ISA vs Stocks & Shares ISA",question:"You are 27, saving for 20+ years. Which ISA is almost certainly better?",opts:["Cash ISA, no risk","Stocks & Shares ISA","About the same","Depends on rate"],correct:1,reveal:"Over 20+ years, stock market returns of 7 to 10% annually far outpace cash ISA rates. Short-term volatility smooths out over long periods."}],
 videos:[{title:"Asset Types",role:"core",min:3}],action:"Open a Stocks & Shares ISA. Vanguard, Freetrade or Trading 212.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:11,phase:"Grow",title:"Make your first investment",hook:"£200/month from 25 vs 35. Same amount. The difference is life-changing.",done:"Automated monthly payment into an index fund.",
 micros:[{type:"interactive",title:"The compound growth reveal",question:"You invest £200/month from 25. Friend starts at 35. Same return. At 60, difference?",opts:["£50k more","£100k more","£180k+ more","About the same"],correct:2,reveal:"You: ~£380,000. Friend: ~£196,000. Those first 10 years are worth almost as much as the next 25 combined."}],
 videos:[{title:"Rate of Return",role:"core",min:3},{title:"Funds",role:"core",min:3},{title:"Diversification",role:"core",min:3}],action:"Set up a monthly direct debit into a global index fund inside your ISA.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:12,phase:"Grow",title:"Build a pension strategy",hook:"Your pension default fund might be wrong for you.",done:"You have checked your pension fund and made a conscious choice.",
 micros:[{type:"interactive",title:"Default funds",question:"Default fund is 'Balanced Growth'. Right for a 28-year-old?",opts:["Yes, balanced is sensible","No, higher growth better at 28","Does not matter","Lowest risk is safest"],correct:1,reveal:"At 28, you have 30+ years. A higher-growth fund will almost certainly outperform. Default funds are designed for everyone, optimised for no one."}],
 videos:[{title:"Retirement Toolkit",role:"core",min:3}],action:"Log into your pension. Check your fund. Consider a higher-growth option if under 40.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:13,phase:"Protect",title:"Get income protection",hook:"Statutory sick pay is £116.75/week. Your rent is probably more.",done:"You know your sick pay policy and have made a decision about cover.",
 micros:[{type:"interactive",title:"The sick pay gap",question:"SSP is £116.75/week. Rent £900/month. Off sick 10 weeks. The shortfall?",opts:["SSP covers it","~£6,800 short","Employer tops up","Universal Credit covers it"],correct:1,reveal:"£116.75/week × 10 = £1,167. Rent alone for 10 weeks = £2,250. Income protection for a 28-year-old costs about £25/month and pays up to 60% of salary, tax-free."}],
 videos:[],action:"Check your contract for sick pay terms. Get at least one income protection quote if cover is inadequate.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:14,phase:"Protect",title:"Write a will",hook:"No common-law marriage exists in England and Wales. Your partner gets nothing without a will.",done:"You have a signed, witnessed will.",
 micros:[{type:"interactive",title:"The common-law myth",question:"Unmarried, 6 years together, no will. Your partner legally receives?",opts:["Everything","Half","What you discussed","Nothing by default"],correct:3,reveal:"There is no common-law marriage in England and Wales. Without a will, intestacy rules apply. Your partner receives nothing. Everything goes to blood relatives. A basic will costs from £50 online."}],
 videos:[],action:"Write a basic will. Farewill or Wills Online from £50.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

{n:15,phase:"Protect",title:"Annual money review",hook:"Your life changed. Did your financial settings change with it?",done:"Recurring annual calendar event with the review checklist.",
 micros:[{type:"interactive",title:"What drifts",question:"14 months since your last check. £4,000 pay rise. What did you forget?",opts:["Pension %","Emergency fund target","Budget categories","All of the above"],correct:3,reveal:"A pay rise changes pension amounts, emergency fund targets, budget categories. An annual 30-minute review prevents years of financial drift."}],
 videos:[{title:"Balance-Sheet and net worth check",role:"core",min:3},{title:"SMART Goal-Setting",role:"core",min:3}],action:"Book a recurring annual calendar event. Checklist: tax code, pension %, emergency fund, ISA allowance, insurance, will, net worth.",xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},
]

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

const QUICK_WINS=[
  {id:"tax",icon:"🔍",label:"Tax code check",min:5},
  {id:"subs",icon:"📱",label:"Subscription audit",min:10},
  {id:"savings",icon:"🏦",label:"Savings rate check",min:3},
  {id:"pension",icon:"💼",label:"Pension match check",min:5},
]

const GOAL_CONTENT={
  understand:{headline:"Nobody taught you this. Most adults are still figuring it out. That changes now.",cards:[{color:T.blue,text:"You will understand how money actually works: inflation, interest, tax, in plain language."},{color:T.green,text:"Starting now puts you years ahead of most people your age."},{color:T.amber,text:"You will never have to nod along pretending you understood something financial again."}],bullets:["Explain how your payslip works to someone else","Know exactly what your money is doing each month","Make financial decisions with confidence, not guesswork"]},
  budgeting:{headline:"You earn money. It disappears. We are going to find it.",cards:[{color:T.blue,text:"Most people find £50 to £150/month in forgotten subscriptions in the first session."},{color:T.green,text:"Once you know your gap, what is actually left each month, everything else becomes possible."},{color:T.amber,text:"A budget you stick to is not about restriction. It is about intentional spending."}],bullets:["Track every pound without it feeling like a chore","Cut spending you do not even notice","Build savings automatically from the gap you find"]},
  debt:{headline:"You are not in a hole. You are at the start of getting out of one.",cards:[{color:T.blue,text:"Most people clear debt faster than expected once they have a real plan."},{color:T.green,text:"You will know your exact debt-free date before you finish your first session."},{color:T.amber,text:"Interest is probably costing you more than you realise. We will show you the real number."}],bullets:["List every debt with its true cost","Have a payoff plan with actual dates","Stop paying interest you do not need to"]},
  investing:{headline:"You have income coming in. Right now it is just sitting there.",cards:[{color:T.blue,text:"Starting at 27 vs 37 is a £180,000+ difference at retirement."},{color:T.green,text:"90% of fund managers underperform a simple index fund. You do not need to pick stocks."},{color:T.amber,text:"Your employer may be offering free money you have not claimed yet."}],bullets:["Open a Stocks & Shares ISA and understand why","Set up automated investing that runs without you","Know the difference between good fees and bad fees"]},
  home:{headline:"You have a goal. Let us build the path backwards from it.",cards:[{color:T.blue,text:"You will know exactly how much you need, by when, and what needs to happen each month."},{color:T.green,text:"Most people overestimate how long it takes when they have a plan."},{color:T.amber,text:"There are government bonuses most first-time buyers do not know exist."}],bullets:["Calculate your exact savings target","Use the right accounts to get government bonuses","Build a realistic timeline that actually works"]},
  admin:{headline:"Most people overpay tax and underpay themselves. Let us fix both.",cards:[{color:T.blue,text:"A wrong tax code costs real money. We check this in the first session."},{color:T.green,text:"If your employer matches pension and you are not maximising it, you are turning down salary."},{color:T.amber,text:"30 minutes in this app will be worth more than most financial decisions this year."}],bullets:["Confirm your tax code is correct","Maximise your employer pension match","Know exactly what you are entitled to"]},
}


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
const DEFAULTS={profile:{name:"",age:null,onboardingComplete:false,goal:null,situations:[],currentLevel:1,completedLevels:[],phaseTag:"Foundations",personalityResult:null,xp:0,levelProgress:{}},assets:[],debts:[],income:{primary:0},spending:{monthly:0}}
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


/* ══════════════════ LEVEL PLAYER (rich micro lessons) ══════════════════ */
function LevelPlayer({level,onBack}){
  const{state,save,toast}=useApp()
  const prog=state.profile.levelProgress?.[level.n]||{microsDone:[],videosDone:[],actionDone:false}
  const[step,setStep]=useState("overview")
  const[microIdx,setMicroIdx]=useState(0)
  const[answer,setAnswer]=useState(null)
  const[showConfetti,setShowConfetti]=useState(false)

  function saveProg(u){const np={...prog,...u};save({...state,profile:{...state.profile,levelProgress:{...state.profile.levelProgress,[level.n]:np}}})}
  function addXP(amt){save({...state,profile:{...state.profile,xp:(state.profile.xp||0)+amt}})}
  function completeMicro(idx){const d=[...(prog.microsDone||[])];if(!d.includes(idx)){d.push(idx);saveProg({microsDone:d});addXP(level.xpMicro)}}
  function completeVideo(title){const d=[...(prog.videosDone||[])];if(!d.includes(title)){d.push(title);saveProg({videosDone:d});addXP(level.xpVideo)}}
  function completeAction(){
    saveProg({actionDone:true});addXP(level.xpAction)
    const cl=[...(state.profile.completedLevels||[])];if(!cl.includes(level.n))cl.push(level.n)
    const next=Math.min(Math.max(level.n+1,state.profile.currentLevel),15)
    save({...state,profile:{...state.profile,completedLevels:cl,currentLevel:next,phaseTag:getPhase(next),xp:(state.profile.xp||0)+level.xpAction,levelProgress:{...state.profile.levelProgress,[level.n]:{...prog,actionDone:true}}}})
    setShowConfetti(true);setTimeout(()=>setShowConfetti(false),2000);setStep("done");toast("🎉 Level complete!")
  }

  const pc=PC[level.phase]||T.teal
  const totalSteps=level.micros.length+(level.videos.length>0?1:0)+1
  const doneSteps=Math.min((prog.microsDone||[]).length,level.micros.length)+((prog.videosDone||[]).length>0?1:0)+(prog.actionDone?1:0)

  if(step==="overview")return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
        <div style={{flex:1}}><p style={{color:pc,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{level.phase} · Level {level.n}</p><p style={{color:T.white,fontWeight:800,fontSize:15}}>{level.title}</p></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"24px 20px 100px",maxWidth:600,margin:"0 auto",width:"100%"}}>
        <div style={{display:"flex",gap:4,marginBottom:24}}>{Array.from({length:totalSteps}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<doneSteps?T.teal:T.border}}/>)}</div>
        <p style={{color:"#E2EAF6",fontSize:15,lineHeight:1.6,marginBottom:6}}>{level.hook}</p>
        <p style={{color:T.muted,fontSize:13,marginBottom:28}}>Done when: {level.done}</p>

        <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>⚡ Lessons</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {level.micros.map((m,i)=>{const done=(prog.microsDone||[]).includes(i);return(
            <button key={i} onClick={()=>{setMicroIdx(i);setAnswer(null);setStep("micro")}}
              style={{background:done?`${T.teal}08`:T.card,border:`1.5px solid ${done?T.tealBorder:T.border}`,borderRadius:16,padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:10,background:done?T.tealDim:T.faint,border:`1px solid ${done?T.tealBorder:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {done?<Check size={16} color={T.teal}/>:<Zap size={16} color={T.muted}/>}
              </div>
              <div style={{flex:1}}>
                <p style={{color:done?T.teal:T.white,fontWeight:600,fontSize:13,lineHeight:1.4}}>{m.title}</p>
                <p style={{color:T.muted,fontSize:11,marginTop:2}}>{done?"Completed":m.type==="teach"?"Read · 2 min":"Interactive · 1 min"} · +15 XP</p>
              </div>
            </button>)})}
        </div>

        {level.videos.length>0&&(<><p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>🎬 Videos</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {level.videos.map((v,i)=>{const done=(prog.videosDone||[]).includes(v.title);return(
            <div key={i} style={{background:done?`${T.purple}08`:T.card,border:`1.5px solid ${done?T.purpleBorder:T.border}`,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:10,background:done?T.purpleDim:T.faint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done?<Check size={16} color={T.purple}/>:<Play size={16} color={T.muted}/>}</div>
              <div style={{flex:1}}><p style={{color:done?"#8FA3BE":T.white,fontWeight:600,fontSize:13}}>{v.title}</p><p style={{color:T.muted,fontSize:11,marginTop:2}}>{v.role==="core"?"Core":"Go deeper"} · {v.min} min</p></div>
              {!done&&<button onClick={()=>completeVideo(v.title)} style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:10,padding:"6px 14px",color:T.purple,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Watched</button>}
            </div>)})}
        </div></>)}

        <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>✅ Action</p>
        <div style={{background:prog.actionDone?`${T.green}08`:T.card,border:`1.5px solid ${prog.actionDone?"rgba(52,211,153,.3)":T.amberBorder}`,borderRadius:18,padding:"20px"}}>
          <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6,marginBottom:14}}>{level.action}</p>
          <p style={{color:T.muted,fontSize:12,marginBottom:16}}>Required to complete this level.</p>
          {!prog.actionDone?<Btn onClick={completeAction}>I have done this ✓</Btn>:<div style={{display:"flex",alignItems:"center",gap:10}}><Check size={18} color={T.green}/><p style={{color:T.green,fontWeight:700,fontSize:14}}>Completed</p></div>}
        </div>
      </div>
    </div>)

  // Micro lesson (teach or interactive)
  if(step==="micro"){
    const micro=level.micros[microIdx];if(!micro){setStep("overview");return null}
    const isTeach=micro.type==="teach"

    if(isTeach) return(
      <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column"}}>
        <div style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
          <button onClick={()=>{setStep("overview")}} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
          <p style={{color:T.white,fontWeight:700,fontSize:14}}>{micro.title}</p>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"28px 22px 100px",maxWidth:540,margin:"0 auto",width:"100%"}}>
          <p style={{color:"#E2EAF6",fontSize:15,lineHeight:1.7,marginBottom:20}}>{micro.content}</p>

          {/* Key point callout */}
          {micro.keyPoint&&<div style={{background:`${T.teal}10`,border:`1.5px solid ${T.tealBorder}`,borderRadius:16,padding:"16px 18px",marginBottom:20}}>
            <p style={{color:T.teal,fontWeight:700,fontSize:11,letterSpacing:.8,textTransform:"uppercase",marginBottom:6}}>Key takeaway</p>
            <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.5,fontWeight:600}}>{micro.keyPoint}</p>
          </div>}

          {/* Example table */}
          {micro.example&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px",marginBottom:20}}>
            <p style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:12}}>{micro.example.label}</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {micro.example.items.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:i===0?T.faint:"transparent",borderRadius:8,border:i===0?`1px solid ${T.border}`:"none"}}>
                  <p style={{color:i===0?T.muted:"#C8D8EC",fontSize:13,fontWeight:i===0?700:500}}>{item.left}</p>
                  <p style={{color:i===0?T.muted:"#C8D8EC",fontSize:13,fontWeight:i===0?700:600}}>{item.right}</p>
                </div>
              ))}
            </div>
          </div>}

          <button onClick={()=>{completeMicro(microIdx);if(microIdx<level.micros.length-1){setMicroIdx(microIdx+1);setAnswer(null)}else setStep("overview")}}
            style={{width:"100%",background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
            {microIdx<level.micros.length-1?"Got it, next →":"Got it, back to overview"}
          </button>
        </div>
      </div>)

    // Interactive micro
    return(
      <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column"}}>
        <div style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
          <button onClick={()=>{setStep("overview");setAnswer(null)}} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
          <p style={{color:T.white,fontWeight:700,fontSize:14}}>{micro.title}</p>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"28px 22px 100px",maxWidth:540,margin:"0 auto",width:"100%"}}>
          {micro.scenario&&<p style={{color:"#C8D8EC",fontSize:14,lineHeight:1.6,marginBottom:16,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px"}}>{micro.scenario}</p>}
          <h2 style={{color:T.white,fontWeight:900,fontSize:"clamp(18px,4vw,22px)",lineHeight:1.3,marginBottom:20}}>{micro.question}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {micro.opts.map((opt,i)=>{
              const picked=answer===i,correct=micro.correct===i
              let bg=T.card,border=T.border,tc=T.muted
              if(answer!==null&&correct){bg="rgba(52,211,153,.08)";border="rgba(52,211,153,.35)";tc=T.green}
              if(answer!==null&&picked&&!correct){bg=T.redDim;border=T.redBorder;tc=T.red}
              return(<button key={i} onClick={()=>{if(answer===null){setAnswer(i);completeMicro(microIdx)}}}
                style={{background:bg,border:`2px solid ${border}`,borderRadius:16,padding:"16px 18px",cursor:answer!==null?"default":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:28,height:28,borderRadius:8,background:answer!==null?(correct?"rgba(52,211,153,.15)":(picked?T.redDim:`${pc}10`)):`${pc}12`,border:`1.5px solid ${answer!==null?(correct?"rgba(52,211,153,.4)":(picked?T.redBorder:`${pc}25`)):T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:answer!==null?(correct?T.green:(picked?T.red:T.muted)):pc,fontWeight:800,fontSize:11}}>{answer!==null?(correct?"✓":(picked?"✗":String.fromCharCode(65+i))):String.fromCharCode(65+i)}</span>
                </div>
                <p style={{color:answer!==null?tc:T.white,fontWeight:600,fontSize:14,flex:1,lineHeight:1.4}}>{opt}</p>
              </button>)})}
          </div>
          {answer!==null&&<div className="ls-fadein">
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 20px",marginBottom:16}}>
              <p style={{color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>The takeaway</p>
              <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.65}}>{micro.reveal}</p>
            </div>
            {/* Breakdown if provided */}
            {micro.breakdown&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 20px",marginBottom:16}}>
              {micro.breakdown.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<micro.breakdown.length-1?`1px solid ${T.border}`:"none"}}>
                <p style={{color:b.highlight?T.teal:"#C8D8EC",fontWeight:b.highlight?700:500,fontSize:13}}>{b.label}</p>
                <p style={{color:b.highlight?T.teal:"#C8D8EC",fontWeight:b.highlight?800:600,fontSize:13}}>{b.val}</p>
              </div>)}
            </div>}
            <button onClick={()=>{if(microIdx<level.micros.length-1){setMicroIdx(microIdx+1);setAnswer(null)}else setStep("overview")}}
              style={{width:"100%",background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
              {microIdx<level.micros.length-1?"Next lesson →":"Back to overview"}
            </button>
          </div>}
        </div>
      </div>)
  }

  if(step==="done")return(<div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
    <Confetti active={showConfetti}/>
    <div className="ls-fadein" style={{textAlign:"center",padding:32,maxWidth:400}}>
      <div style={{fontSize:64,marginBottom:20}}>🎉</div>
      <h2 style={{color:T.white,fontWeight:900,fontSize:26,marginBottom:8}}>Level {level.n} Complete!</h2>
      <p style={{color:T.muted,fontSize:15,marginBottom:32}}>{level.title}</p>
      <Btn onClick={onBack}>Continue →</Btn>
    </div>
  </div>)
  return null
}

/* ══════════════════ HOME TAB (= journey map + current focus) ══════════════════ */
function HomeTab(){
  const{state,toast}=useApp()
  const{profile}=state
  const currentLevel=profile.currentLevel||1
  const completed=new Set(profile.completedLevels||[])
  const[activeLevel,setActiveLevel]=useState(null)
  const[warning,setWarning]=useState(null)
  const[showQuiz,setShowQuiz]=useState(false)

  function handleTap(level){
    const diff=level.n-currentLevel
    if(diff<=1||completed.has(level.n)){setActiveLevel(level.n);return}
    if(level.n>=10&&level.n<=12&&!completed.has(4)){setWarning({type:"red",level,msg:"You have high-interest debt at Level 4. Investing while paying high APR means your debt grows faster than your investments.",link:4,linkText:"Level 4: the maths will shock you →"});return}
    if(level.n>=10&&!completed.has(7)){setWarning({type:"amber",level,msg:"Check your pension match at Level 7 before opening an ISA. Free money first.",link:7,linkText:"Level 7: capture free money →"});return}
    if(level.n>=7&&currentLevel<=3){setWarning({type:"amber",level,msg:"These lessons land better once your foundation is solid.",link:currentLevel,linkText:`Continue with Level ${currentLevel} →`});return}
    setActiveLevel(level.n)
  }

  if(showQuiz)return<PersonalityQuiz state={state} onClose={()=>setShowQuiz(false)}/>
  if(activeLevel){const lv=LEVELS.find(l=>l.n===activeLevel);if(!lv){setActiveLevel(null);return null};return<LevelPlayer level={lv} onBack={()=>setActiveLevel(null)}/>}

  const phases=["Foundations","Stabilise","Optimise","Grow","Protect"]
  const level=LEVELS.find(l=>l.n===currentLevel)||LEVELS[0]
  const pc_=PC[level.phase]||T.teal

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
      {/* Greeting + current level hero */}
      <div style={{position:"relative",background:`linear-gradient(180deg,${pc_}12 0%,transparent 100%)`,padding:"28px 20px 20px"}}>
        <StarField count={8}/>
        <div style={{position:"relative",maxWidth:600,margin:"0 auto"}}>
          <p style={{color:T.white,fontWeight:800,fontSize:22,marginBottom:4}}>Hey {profile.name} 👋</p>
          <p style={{color:T.muted,fontSize:14,marginBottom:18}}>Level {currentLevel} of 15 · {getPhase(currentLevel)}</p>

          {/* Current level hero */}
          <div style={{background:`linear-gradient(145deg,${pc_}12,${pc_}04)`,border:`2px solid ${pc_}40`,borderRadius:22,padding:"22px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${pc_}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
            <p style={{color:pc_,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Your focus now · Level {currentLevel}</p>
            <h2 style={{color:T.white,fontWeight:900,fontSize:19,lineHeight:1.2,marginBottom:8}}>{level.title}</h2>
            <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5,marginBottom:16}}>{level.hook}</p>
            <button onClick={()=>setActiveLevel(currentLevel)} style={{width:"100%",background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Zap size={16}/>Start Level {currentLevel}
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"0 18px"}}>
        {/* Quick wins + personality quiz */}
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginTop:20,marginBottom:24,scrollbarWidth:"none"}}>
          {!profile.personalityResult&&<button onClick={()=>setShowQuiz(true)} style={{flexShrink:0,background:`linear-gradient(135deg,${T.purpleDim},rgba(167,139,250,.03))`,border:`1.5px solid ${T.purpleBorder}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🧠</span><div style={{textAlign:"left"}}><p style={{color:T.purple,fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>Money personality quiz</p><p style={{color:T.muted,fontSize:10}}>4 min · 8 types</p></div>
          </button>}
          {QUICK_WINS.map(qw=><button key={qw.id} onClick={()=>toast(`${qw.label}: coming soon!`)} style={{flexShrink:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{qw.icon}</span><div style={{textAlign:"left"}}><p style={{color:T.white,fontWeight:600,fontSize:12,whiteSpace:"nowrap"}}>{qw.label}</p><p style={{color:T.muted,fontSize:10}}>{qw.min} min</p></div>
          </button>)}
        </div>

        {/* All 15 levels journey map */}
        <p style={{color:T.white,fontWeight:800,fontSize:17,marginBottom:16}}>Your 15 Level Plan</p>
        {phases.map(phase=>{
          const phaseLevels=LEVELS.filter(l=>l.phase===phase)
          const pc2=PC[phase];const pe=PE[phase]
          return(<div key={phase} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:16}}>{pe}</span><p style={{color:pc2,fontWeight:800,fontSize:12,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
            </div>
            {phaseLevels.map((lv,i)=>{
              const isDone=completed.has(lv.n);const isCurrent=lv.n===currentLevel;const isFuture=lv.n>currentLevel&&!isDone;const isLast=i===phaseLevels.length-1
              const prog2=profile.levelProgress?.[lv.n]||{microsDone:[],videosDone:[],actionDone:false}
              const microCount=lv.micros.length;const videoCount=lv.videos.length
              return(<div key={lv.n} style={{display:"flex",gap:14,marginBottom:isLast?0:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:28,flexShrink:0}}>
                  <div style={{width:isDone?24:isCurrent?28:20,height:isDone?24:isCurrent?28:20,borderRadius:"50%",
                    background:isDone?T.green:isCurrent?T.teal:T.faint,border:`2.5px solid ${isDone?T.green:isCurrent?T.teal:T.border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                    boxShadow:isCurrent?`0 0 14px ${T.teal}40`:"none",zIndex:1}}>
                    {isDone?<Check size={12} color="#070D1A"/>:<p style={{color:isCurrent?"#070D1A":T.subtle,fontWeight:900,fontSize:10}}>{lv.n}</p>}
                  </div>
                  {!isLast&&<div style={{width:2,flex:1,background:isDone?`${T.green}40`:T.border,minHeight:16}}/>}
                </div>
                <button onClick={()=>handleTap(lv)} style={{flex:1,background:isCurrent?`${T.teal}08`:T.card,border:`1.5px solid ${isCurrent?T.tealBorder:isDone?`${T.green}20`:T.border}`,borderRadius:18,padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:10,opacity:isFuture?.65:1}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <p style={{color:isDone?T.green:isCurrent?T.teal:T.muted,fontSize:10,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
                    {isDone&&<span style={{background:T.greenDim,color:T.green,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Done</span>}
                    {isCurrent&&<span style={{background:T.tealDim,color:T.teal,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Current</span>}
                    {isFuture&&<span style={{background:T.faint,color:T.muted,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Browse</span>}
                  </div>
                  <p style={{color:isDone?"#7A8FA8":T.white,fontWeight:700,fontSize:14,lineHeight:1.3,textDecoration:isDone?"line-through":"none"}}>{lv.title}</p>
                  <p style={{color:T.muted,fontSize:12,marginTop:4,lineHeight:1.35}}>{lv.hook.length>65?lv.hook.slice(0,63)+"...":lv.hook}</p>
                  {/* Content indicators */}
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <span style={{color:T.muted,fontSize:10}}>⚡ {microCount} lesson{microCount>1?"s":""}</span>
                    {videoCount>0&&<span style={{color:T.muted,fontSize:10}}>🎬 {videoCount} video{videoCount>1?"s":""}</span>}
                    <span style={{color:T.muted,fontSize:10}}>✅ 1 action</span>
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

/* ══════════════════ LEARN TAB ══════════════════ */
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
  const currentLevel=profile.currentLevel||1;const phase=getPhase(currentLevel);const phaseColor=PC[phase]
  const completedCount=(profile.completedLevels||[]).length;const xp=profile.xp||0
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
      <p style={{color:T.muted,fontSize:13,marginTop:4}}>Level {currentLevel} of 15</p>
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
          <div style={{textAlign:"right"}}><p style={{color:T.white,fontWeight:700,fontSize:14}}>{completedCount} levels done</p><p style={{color:T.muted,fontSize:12}}>{15-completedCount} remaining</p></div>
        </div>
        <div style={{background:T.surface,borderRadius:99,height:6,overflow:"hidden"}}><div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99}}/></div>
        <p style={{color:T.muted,fontSize:11,marginTop:6}}>{nextM-xp} XP to next milestone</p>
      </div>

      {/* Phase */}
      <div style={{background:T.card,border:`1px solid ${phaseColor}25`,borderRadius:20,padding:"20px",marginBottom:16}}>
        <p style={{color:phaseColor,fontWeight:800,fontSize:14,marginBottom:6}}>{PE[phase]} {phase}</p>
        <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>
          {phase==="Foundations"?"Getting the real picture of your finances.":phase==="Stabilise"?"Building safety and clearing costly debt.":phase==="Optimise"?"Making your money work harder.":phase==="Grow"?"Growing real wealth for the long term.":"Protecting what you have built."}
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
