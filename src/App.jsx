import { useState, useEffect, useContext, createContext, useMemo, useRef } from "react"
import { Home, Map, BookOpen, User, Check, X, ChevronLeft, ChevronRight, Pencil, Trash2, Plus, Lock, Clock, Play, ChevronDown, AlertTriangle, Zap, Award, RotateCcw } from "lucide-react"

/* ════════════════════════════════════════════════════════════════════
   STYLES
   ════════════════════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',system-ui,sans-serif;background:#070D1A;-webkit-font-smoothing:antialiased}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type=number]{-moz-appearance:textfield}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1C2D47;border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes twinkle{0%,100%{opacity:.06;transform:scale(1)}50%{opacity:.8;transform:scale(1.5)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(15,191,184,.3)}70%{box-shadow:0 0 0 10px rgba(15,191,184,0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes slideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
.ls-fadein{animation:fadeUp .45s ease-out forwards}
.ls-float{animation:float 5s ease-in-out infinite}
.ls-star{animation:twinkle var(--d,2.5s) ease-in-out var(--dl,0s) infinite}
.ls-pulse{animation:pulse 2.5s ease-in-out infinite}
button{-webkit-tap-highlight-color:transparent}
`

/* ════════════════════════════════════════════════════════════════════
   THEME
   ════════════════════════════════════════════════════════════════════ */
const T={
  bg:"#070D1A",surface:"#0B1424",card:"#0F1D32",cardHover:"#142240",
  border:"#1B2C45",borderLight:"#223A5E",
  teal:"#0FBFB8",tealMid:"#14D4CC",tealDim:"rgba(15,191,184,.10)",tealBorder:"rgba(15,191,184,.30)",
  amber:"#F59E0B",amberDim:"rgba(245,158,11,.10)",amberBorder:"rgba(245,158,11,.28)",
  red:"#F87171",redDim:"rgba(248,113,113,.10)",redBorder:"rgba(248,113,113,.28)",
  purple:"#A78BFA",purpleDim:"rgba(167,139,250,.12)",purpleBorder:"rgba(167,139,250,.3)",
  green:"#34D399",greenDim:"rgba(52,211,153,.10)",
  blue:"#60A5FA",blueDim:"rgba(96,165,250,.1)",blueBorder:"rgba(96,165,250,.3)",
  white:"#F0F6FF",muted:"#7A8FA8",subtle:"#344D68",faint:"#162038"
}

const PHASE_COLORS={Foundations:T.red,Stabilise:T.amber,Optimise:T.blue,Grow:T.green,Protect:T.purple}
const PHASE_EMOJIS={Foundations:"🧱",Stabilise:"🛡️",Optimise:"⚙️",Grow:"🌱",Protect:"🔒"}

/* ════════════════════════════════════════════════════════════════════
   LEVELS DATA (all 15)
   ════════════════════════════════════════════════════════════════════ */
const LEVELS=[
  {n:1,phase:"Foundations",title:"Know your actual numbers",
   hook:"Most people are wrong about their own spending. Find your real gap.",
   done:"You can write down your monthly take-home, fixed costs, variable spend, and what is left without guessing.",
   micros:[
     {q:"You think you spend about £200/month on food. Your bank says £340. Why the gap?",
      opts:["You eat out more than you realise","Your brain anchors to the number you want, not the one you spend","You forgot about delivery apps and coffees","All of the above"],
      correct:3,
      reveal:"Your brain anchors to the number you want, not the one you spend. Most people underestimate variable spending by 30 to 40%. Delivery apps, coffees and impulse buys add up invisibly."},
     {q:"You earn £2,400/month. Rent £850, bills £180, subscriptions £65, transport £120, food £340, phone £35. What is actually left?",
      opts:["£810","£610","£510","£410"],
      correct:0,
      reveal:"£810 is your gap. That is the number that changes your life. Most people have never calculated it precisely. Knowing it means you can decide what to do with it instead of wondering where it went."}
   ],
   videos:[{title:"Tracking Incomes & Outgoings",role:"core",min:3},{title:"Budgeting: 50/30/20",role:"core",min:3},{title:"Know Your Why",role:"deeper",min:3},{title:"The Psychology of Money",role:"deeper",min:4}],
   action:"Run the gap analysis. Write your actual take-home, fixed costs, variable spend. The gap is the number that changes your life.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:2,phase:"Foundations",title:"Separate needs, wants and waste",
   hook:"You have 9 active subscriptions. You can name 5. What are the other 4 costing you?",
   done:"You have cancelled at least one forgotten subscription and categorised last month's spending.",
   micros:[
     {q:"You have 9 active subscriptions. You can name 5. What are the other 4 probably costing you per year?",
      opts:["About £50","About £120","About £250","About £400+"],
      correct:2,
      reveal:"The average person has £250+ per year in forgotten subscriptions. Apps you downloaded once, free trials that converted, gym memberships you stopped using. Check your bank statement, they are hiding in plain sight."},
     {q:"£400/month on going out. Is that a need, want, or waste?",
      opts:["It depends on whether you can afford it","It is always a want","If it makes you happy it is a need","It is waste if you regret it the next day"],
      correct:0,
      reveal:"There is no right answer without context. £400 on going out when you have £800 surplus is an intentional choice. £400 when you have £100 surplus and growing debt is a different story. The question is not whether you spend, it is whether you decided to."}
   ],
   videos:[{title:"Savings Pots",role:"core",min:3},{title:"Comparison Traps: Financial Freedom",role:"core",min:3},{title:"The Psychology of Money",role:"deeper",min:4}],
   action:"Go through last month's bank statement. Categorise every transaction as need, want, or waste. Cancel at least one subscription you forgot you were paying for.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:3,phase:"Foundations",title:"Read your payslip",
   hook:"Your payslip says £2,800 gross. You take home £2,190. Where did £610 go?",
   done:"You know your tax code, what it means, and have confirmed it is correct.",
   micros:[
     {q:"Your payslip says £2,800 gross. You take home £2,190. Where did £610 go, and is that right?",
      opts:["Income tax takes most of it","It is a mix of income tax, National Insurance and pension","Your employer keeps some as profit","You are probably being overcharged"],
      correct:1,
      reveal:"Income tax, National Insurance contributions and your pension contribution. Most people never check the breakdown. A wrong tax code alone can cost you hundreds per year."},
     {q:"Your tax code is 1257L. What does the 1257 mean?",
      opts:["Your employee number","Your tax-free personal allowance (£12,570)","The percentage of tax you pay","Your National Insurance category"],
      correct:1,
      reveal:"1257L means you have a £12,570 personal allowance. The first £12,570 you earn each year is tax-free. If your tax code is wrong, you could be paying too much or too little tax. Check it on the HMRC website."}
   ],
   videos:[{title:"Banking Basics",role:"deeper",min:3}],
   action:"Check your tax code on the HMRC website. Confirm it is 1257L or understand why it is different.",
   selfEmployedAlt:{title:"Understand your income",action:"Track your income for the last 3 months. Calculate your average monthly take-home after setting aside 30% for tax."},
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:4,phase:"Stabilise",title:"Kill high-interest debt",
   hook:"The maths will shock you. Interest is probably costing more than you think.",
   done:"Every debt listed, ranked by rate, with a payoff method chosen and target dates set.",
   micros:[
     {q:"You have £2,000 in savings and £1,800 on a credit card at 34% APR. Should you pay off the card or keep the savings?",
      opts:["Keep the savings for emergencies","Pay off the card immediately","Split it, pay half the card","Move the card balance to a 0% deal first"],
      correct:1,
      reveal:"Your savings earn maybe 4%. Your credit card costs 34%. Every day you keep both, you are losing money. Pay it off. Then rebuild your savings without the 34% anchor dragging you down."},
     {q:"3 debts: £800 at 19%, £2,200 at 34%, £500 at 9%. Which do you pay extra on first?",
      opts:["The £500 at 9%, it is the smallest","The £800 at 19%, middle ground","The £2,200 at 34%, highest rate","Pay them all equally"],
      correct:2,
      reveal:"Avalanche method: attack the highest rate first. The £2,200 at 34% is costing you £748/year in interest. The £500 at 9% costs £45. The maths is clear. Snowball (smallest first) works for motivation, but avalanche saves you the most money."}
   ],
   videos:[{title:"Good debt vs. bad debt",role:"core",min:3},{title:"Cost of Borrowing",role:"core",min:3},{title:"Snowball vs. Avalanche payoff methods",role:"core",min:3},{title:"Why Banks Charge Interest",role:"core",min:2},{title:"How Credit Actually Works",role:"deeper",min:3},{title:"Credit Cards Explained",role:"deeper",min:3}],
   action:"List every debt: balance, interest rate, minimum payment. Rank by rate. Choose avalanche or snowball. Write a payoff order with target dates.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:5,phase:"Stabilise",title:"Build a £1,000 starter buffer",
   hook:"Your boiler breaks. It costs £600. You have no savings. What happens next?",
   done:"£1,000 sitting in a named, easy-access savings account separate from your current account.",
   micros:[
     {q:"Your boiler breaks in January. The repair costs £600. You have no savings. What actually happens?",
      opts:["You use a credit card at 24% APR","You borrow from family","You skip other bills to cover it","Any of these, none of them are good"],
      correct:3,
      reveal:"Without savings, emergencies become debt. A £600 repair on a credit card at 24% APR, paying £50/month, costs you £672 total and takes over a year to clear. A £1,000 buffer prevents this spiral entirely."},
     {q:"You put £1,000 in a high street savings account at 1.2%. Your mate uses a Marcus account at 5.1%. After one year, what is the difference?",
      opts:["£12 vs £51","£39 difference","Both are about right","The difference does not matter for £1,000"],
      correct:1,
      reveal:"£39 difference on £1,000. Not life-changing, but it is free money for 10 minutes of switching. And the principle matters: as your savings grow to £5,000 or £10,000, that rate difference becomes £195/year. Always check the rate."}
   ],
   videos:[{title:"Banking Basics",role:"core",min:3},{title:"Savings Pots",role:"core",min:3},{title:"Inflation",role:"deeper",min:3}],
   action:"Open a named easy-access savings account (not your main bank if the rate is low). Transfer £1,000 or set up a standing order to get there.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:6,phase:"Stabilise",title:"Grow to 3 months of essentials",
   hook:"How long could you survive if your income stopped tomorrow?",
   done:"You have calculated your 3-month essential costs number and have an automated standing order running toward it.",
   micros:[
     {q:"Essential costs: rent £800, food £200, transport £120, utilities £90, phone £25. What is your 3-month safety net number?",
      opts:["£2,470","£3,105","£3,705","£4,200"],
      correct:2,
      reveal:"£1,235/month × 3 = £3,705. This is your real safety net target. Not a round number you guessed, your actual essential costs times three. Knowing the precise target makes it achievable."},
     {q:"You save £100/month towards your £3,600 emergency fund. Six months in, you have £600. Car needs £400 repair. Do you dip in?",
      opts:["Yes, that is what it is for","No, find another way to pay","Use half from the fund, half from elsewhere","It depends on whether the car is essential"],
      correct:3,
      reveal:"If the car is essential for getting to work, this is exactly what the fund is for. If you can get a bus for a week while you save, protect the fund. The rule: use it for genuine emergencies, then rebuild it immediately."}
   ],
   videos:[],
   action:"Calculate your 3-month essential costs. Set up a standing order into your easy-access account. Name the pot Emergency Fund.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:7,phase:"Optimise",title:"Capture free money at work",
   hook:"The pay rise you have not claimed. Your employer is offering money you are not taking.",
   done:"Your pension contribution is high enough to receive your employer's full match.",
   micros:[
     {q:"Your employer matches pension up to 5%. You contribute 3%. On a £30,000 salary, how much free money are you leaving on the table per year?",
      opts:["£300","£600","£900","£1,200"],
      correct:1,
      reveal:"£600 per year. Your employer will put in 5% if you put in 5%. At 3%, they only put in 3%. That missing 2% of £30,000 is £600/year of free money you are declining. Over 30 years at 7% growth, that compounds to over £56,000."},
     {q:"Salary sacrifice vs net pay pension contribution. You earn £35k. Which method also saves you National Insurance?",
      opts:["Net pay","Salary sacrifice","Both save the same","Neither saves NI"],
      correct:1,
      reveal:"Salary sacrifice reduces your gross salary before NI is calculated, saving you an extra 12% in National Insurance on top of the income tax relief. On £200/month contribution, that is an extra £24/month, or £288/year. Ask your employer if they offer it."}
   ],
   videos:[{title:"Retirement Toolkit",role:"core",min:3}],
   action:"Log into your workplace pension portal. Check your current contribution %. Increase it to match your employer's maximum.",
   selfEmployedAlt:{title:"Set up a SIPP",action:"Research and open a Self-Invested Personal Pension. Set up an initial contribution. Every £100 you contribute becomes £125 with basic rate tax relief."},
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:8,phase:"Optimise",title:"Set up sinking funds",
   hook:"Christmas, car insurance, a holiday. These are not surprises. Why do most people go into debt for them?",
   done:"At least one named savings pot with a monthly amount going in for a known future expense.",
   micros:[
     {q:"Car insurance renews in 4 months. It was £640 last year. How much should you be setting aside each month?",
      opts:["£100/month","£160/month","£200/month","£640 when it is due"],
      correct:1,
      reveal:"£640 ÷ 4 months = £160/month. If you started when you last renewed, it would be £53/month over 12 months. The longer you plan ahead, the smaller the monthly amount. Sinking funds turn big expenses into small, manageable ones."},
     {q:"Christmas, a holiday, a new phone. These are not surprises. Why do most people still go into debt for them?",
      opts:["They cannot afford them","They forget to plan","They know but choose not to save","A mix of forgetting and not having a system"],
      correct:3,
      reveal:"Most people know these costs are coming but do not have a system. A named pot with a standing order turns a predictable expense from a crisis into a non-event. Monzo and Starling make this easy with named pots."}
   ],
   videos:[{title:"SMART Goal-Setting",role:"core",min:3},{title:"Savings Pots",role:"core",min:3}],
   action:"Name your next 3 predictable future expenses. Divide each by months until needed. Open named pots and set up monthly transfers.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:9,phase:"Optimise",title:"Understand your taxes",
   hook:"Most people misunderstand how tax bands work. This costs real money.",
   done:"You can accurately explain your own tax situation in under 60 seconds.",
   micros:[
     {q:"You earn £38,000. Someone says that puts you in the 40% tax bracket. Are they right?",
      opts:["Yes, £38,000 is above the basic rate limit","No, only the amount above £37,700 is taxed at 40%","Partly, your effective rate is about 40%","It depends on your tax code"],
      correct:1,
      reveal:"Only £300 of your income is taxed at 40% (the amount above the £37,700 higher rate threshold). The rest is taxed at 20% or is within your personal allowance. Your effective tax rate is about 17%, not 40%. This misunderstanding stops people from seeking pay rises."},
     {q:"Personal allowance is £12,570. You earn £28,000. What is your actual taxable income?",
      opts:["£28,000","£15,430","£12,570","£22,430"],
      correct:1,
      reveal:"£28,000 minus £12,570 personal allowance = £15,430 taxable. At 20%, that is £3,086 in income tax, plus National Insurance. Your effective tax rate is about 11%, well below what most people assume."}
   ],
   videos:[{title:"Credit Scores and Bureaus",role:"deeper",min:3},{title:"Credit Utilisation Ratio",role:"deeper",min:3}],
   action:"Calculate your effective tax rate. Check whether you are owed any rebates or missing any allowances.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:10,phase:"Grow",title:"Open a Stocks & Shares ISA",
   hook:"The tax wrapper most people wait too long to use. Every year you delay costs you.",
   done:"You have an open Stocks & Shares ISA, even if you have not yet put money in.",
   micros:[
     {q:"Cash ISA vs Stocks & Shares ISA. You are 27 and saving for 20+ years. Which is almost certainly better?",
      opts:["Cash ISA, no risk of losing money","Stocks & Shares ISA, historically higher returns over long periods","They are about the same over 20 years","Depends entirely on the interest rate"],
      correct:1,
      reveal:"Over 20+ years, the stock market has historically returned 7 to 10% annually, far outpacing cash ISA rates of 3 to 5%. Short-term volatility smooths out over long periods. A Cash ISA is for money you need within 5 years. A Stocks & Shares ISA is for money you are growing long-term."},
     {q:"You have £500/month to invest. General account vs ISA. After 10 years at 7% growth, how much extra tax does the general account cost you?",
      opts:["About £500","About £2,000","About £5,000","About £8,000+"],
      correct:2,
      reveal:"In a general investment account, you pay Capital Gains Tax on profits above £3,000/year. Over 10 years with £500/month at 7%, that could cost you roughly £5,000 in tax that you would have paid zero on inside an ISA. Use your £20,000 annual ISA allowance first, always."}
   ],
   videos:[{title:"Asset Types",role:"core",min:3},{title:"Balance-Sheet and net worth check",role:"core",min:3}],
   action:"Open a Stocks & Shares ISA. Recommended platforms: Vanguard (lowest cost, good for beginners), Freetrade, Trading 212.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:11,phase:"Grow",title:"Make your first investment",
   hook:"£200/month from age 25 vs age 35. Same amount, same return. The difference is life-changing.",
   done:"Money is leaving your account automatically every month into an index fund. Even £25 counts.",
   micros:[
     {q:"You invest £200/month from age 25. Your friend starts at 35. Same amount, same 7% return. At 60, who has more and by how much?",
      opts:["You: £50,000 more","You: £100,000 more","You: £180,000+ more","About the same, 10 years is not that long"],
      correct:2,
      reveal:"You: roughly £380,000. Your friend: roughly £196,000. Same contribution, same return, but you had 10 extra years of compound growth. Those first 10 years are worth almost as much as the next 25 combined. Time is literally money."},
     {q:"A fund manager charges 1.5%. An index fund charges 0.2%. On £50,000 over 20 years at 7%, what does that fee difference cost you?",
      opts:["About £5,000","About £15,000","About £30,000","About £50,000"],
      correct:2,
      reveal:"The 1.5% fee fund gives you roughly £115,000. The 0.2% fund gives you roughly £145,000. That 1.3% difference costs you about £30,000 on a £50,000 portfolio over 20 years. And 90% of active fund managers underperform the index fund anyway. Fees matter enormously."}
   ],
   videos:[{title:"Rate of Return",role:"core",min:3},{title:"Risk and Risk Tolerance",role:"core",min:3},{title:"Funds",role:"core",min:3},{title:"Diversification",role:"core",min:3},{title:"Time horizon and portfolio construction",role:"core",min:3},{title:"Equities",role:"deeper",min:3},{title:"Time Value of Money",role:"deeper",min:3}],
   action:"Set up a monthly direct debit into a global index fund inside your ISA. The Vanguard FTSE Global All Cap or similar. Automate it, set and forget.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:12,phase:"Grow",title:"Build a pension strategy",
   hook:"Your pension default fund might be wrong for you. Most people never check.",
   done:"You have logged into your pension, know what fund your money is in, and have made a conscious choice.",
   micros:[
     {q:"Your pension default fund is 'Balanced Growth'. Is that right for a 28-year-old?",
      opts:["Yes, balanced is always sensible","Probably not, a higher growth fund would be better at 28","It does not matter, pension returns are all similar","You should be in the lowest risk fund"],
      correct:1,
      reveal:"At 28, you have 30+ years until retirement. A higher-growth fund will almost certainly outperform a balanced fund over that timeframe. Default funds are designed to be safe for everyone, which means they are not optimised for anyone. Check what you are in and make a conscious choice."},
     {q:"£500/month into a pension with 40% tax relief (higher rate taxpayer). How much does it actually cost you to invest £500?",
      opts:["£500","£400","£300","£250"],
      correct:2,
      reveal:"With 40% tax relief, every £500 in your pension only costs you £300 from your take-home. The government adds £200. If you use salary sacrifice, you also save National Insurance, bringing the real cost even lower. Pensions are the most tax-efficient investment vehicle available."}
   ],
   videos:[{title:"Retirement Toolkit",role:"core",min:3},{title:"Time horizon and portfolio construction",role:"core",min:3}],
   action:"Log into your workplace pension. Find out what fund your money is in. If you are under 40, consider whether a higher-growth fund is appropriate.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:13,phase:"Protect",title:"Get income protection",
   hook:"Statutory sick pay is £116.75/week. Your rent alone is probably more than that.",
   done:"You know your employer's sick pay policy and have either got cover or made a conscious decision.",
   micros:[
     {q:"Statutory sick pay is £116.75/week. Your rent alone is £900/month. If you were off sick for 10 weeks, what actually happens?",
      opts:["SSP covers your rent","You would be £6,832 short over 10 weeks","Your employer tops it up automatically","You can claim Universal Credit immediately"],
      correct:1,
      reveal:"£116.75/week × 10 = £1,167.50 total. Your rent alone for 10 weeks is £2,250. Before food, bills, or anything else, you are already short. Most people assume their employer covers more than they do. Check your contract. Income protection insurance for a 28-year-old costs about £20 to £30/month."},
     {q:"Income protection for a 28-year-old non-smoker in a desk job costs about £25/month. What does it actually pay out?",
      opts:["£500/month","Up to 60% of your salary, tax-free","A lump sum after 6 months","Only covers accidents, not illness"],
      correct:1,
      reveal:"Income protection typically pays up to 60% of your gross salary, tax-free, until you can return to work or until retirement age. £25/month to protect potentially decades of income. It is the insurance most financial advisers say people should have but almost nobody does."}
   ],
   videos:[],
   action:"Check your employment contract for sick pay terms. If cover is inadequate, get at least one income protection quote.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:14,phase:"Protect",title:"Write a will",
   hook:"You are not married. You have lived with your partner for 6 years. You die without a will. What does your partner legally receive?",
   done:"You have a signed, witnessed will, even a basic one.",
   micros:[
     {q:"You are not married. You have lived with your partner for 6 years. You die without a will. What does your partner legally receive?",
      opts:["Everything, as your common-law spouse","Half of your estate","Whatever you discussed verbally","Nothing. There is no common-law marriage in England and Wales"],
      correct:3,
      reveal:"There is no such thing as common-law marriage in England and Wales. Without a will, intestacy rules apply. Your partner, no matter how long you have been together, receives nothing. Everything goes to your closest blood relatives. This catches thousands of couples every year."},
     {q:"It takes 30 minutes and costs less than a dinner out. Why do most 20 to 35 year olds not have a will?",
      opts:["They do not have enough assets","They think it is morbid","They assume the law protects their wishes","A combination of all three"],
      correct:3,
      reveal:"A basic will costs from £50 online (Farewill, Wills Online). If you own anything, have a partner, or have dependents, you need one. The cost of not having one is not financial, it is the people you love being left in a legal mess."}
   ],
   videos:[],
   action:"Write a basic will. Online options from £50. If you own property or have dependents, use a solicitor.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},

  {n:15,phase:"Protect",title:"Annual money review",
   hook:"Your life changed. Did your financial settings change with it?",
   done:"You have a recurring calendar event, once a year, called Money Review with the checklist saved.",
   micros:[
     {q:"It has been 14 months since you last checked your pension. You got a £4,000 pay rise. What did you probably forget to update?",
      opts:["Your pension contribution percentage","Your emergency fund target","Your budget categories","All of the above"],
      correct:3,
      reveal:"A pay rise changes everything: your pension contribution amount (even if the % stays the same), your emergency fund target (3 months of higher expenses), your budget categories (lifestyle inflation is real). An annual review catches all of this."},
     {q:"Your life last year: same job, same rent. This year: pay rise, new relationship, moving house. How many of your financial settings need updating?",
      opts:["Just your budget","Your budget and pension","At least 5 things","Nothing, they adjust automatically"],
      correct:2,
      reveal:"At minimum: budget, pension contribution, emergency fund target, insurance cover, tax code check, ISA allowance usage, will update. Life changes mean plans must change. A 30-minute annual review prevents years of financial drift."}
   ],
   videos:[{title:"Balance-Sheet and net worth check",role:"core",min:3},{title:"SMART Goal-Setting",role:"core",min:3},{title:"Inflation",role:"deeper",min:3}],
   action:"Book a recurring annual calendar event. The checklist: tax code, pension contribution %, emergency fund level, ISA allowance used, insurance cover, will up to date, net worth snapshot.",
   xpMicro:15,xpVideo:20,xpAction:50,xpBonus:15},
]

const QUICK_WINS=[
  {id:"tax",icon:"🔍",label:"Tax code check",min:5},
  {id:"subs",icon:"📱",label:"Subscription audit",min:10},
  {id:"savings",icon:"🏦",label:"Savings rate check",min:3},
  {id:"pension",icon:"💼",label:"Pension match check",min:5},
  {id:"personality",icon:"🎯",label:"Money personality quiz",min:4},
]

const LEARN_THEMES=[
  {id:"economy",icon:"🌍",title:"How the world economy works",items:[
    {title:"History of Money",min:4},{title:"Exchange Rates & Global Currencies",min:3},
    {title:"Supply & Demand",min:3},{title:"Economic Cycles",min:4},
    {title:"The Federal Reserve 101",min:3},{title:"Economic Indicators in Everyday Life",min:3}]},
  {id:"investing",icon:"🔮",title:"Beyond the basics (investing)",items:[
    {title:"Digital Dollars & Stablecoins",min:3},{title:"Commodities",min:3},
    {title:"Alternatives",min:3},{title:"Real Estate",min:4},{title:"Bonds and fixed income",min:3}]},
  {id:"psychology",icon:"🧠",title:"Understanding yourself with money",items:[
    {title:"Know Your Why",min:3},{title:"Comparison Traps: Financial Freedom",min:3},
    {title:"The Psychology of Money",min:4}]},
  {id:"credit",icon:"💳",title:"Credit deep dive",items:[
    {title:"How Credit Actually Works",min:3},{title:"Credit Utilisation Ratio",min:3},
    {title:"Credit Scores and Bureaus",min:3},{title:"Credit Cards Explained",min:3},
    {title:'0% vs "0%**" explained',min:3}]},
]

/* ════════════════════════════════════════════════════════════════════
   SUMMARY SCREEN CONTENT
   ════════════════════════════════════════════════════════════════════ */
const GOAL_CONTENT={
  understand:{
    headline:"Nobody taught you this. Most adults are still figuring it out. That changes now.",
    cards:[
      {color:T.blue,text:"You will understand how money actually works: inflation, interest, tax, in plain language."},
      {color:T.green,text:"Starting now, even before you are earning much, puts you years ahead of most people your age."},
      {color:T.amber,text:"You will never have to nod along pretending you understood something you did not."}],
    bullets:["Explain how your payslip works to someone else","Know exactly what your money is doing each month","Make financial decisions with confidence, not guesswork"]},
  budgeting:{
    headline:"You earn money. It disappears. We are going to find it.",
    cards:[
      {color:T.blue,text:"Most people find £50 to £150/month in forgotten subscriptions and direct debits in the first session."},
      {color:T.green,text:"Once you know your gap, what is actually left each month, everything else becomes possible."},
      {color:T.amber,text:"A budget you can stick to is not about restriction. It is about knowing which spending is intentional."}],
    bullets:["Track every pound without it feeling like a chore","Cut spending you do not even notice","Build savings automatically from the gap you find"]},
  debt:{
    headline:"You are not in a hole. You are at the start of getting out of one.",
    cards:[
      {color:T.blue,text:"Most people who clear debt do it faster than expected once they have a real plan, not a rough intention."},
      {color:T.green,text:"You will know your exact debt-free date before you finish your first session."},
      {color:T.amber,text:"Interest is probably costing you more than you realise. We will show you the real number."}],
    bullets:["List every debt with its true cost","Have a payoff plan with actual dates","Stop paying interest you do not need to"]},
  investing:{
    headline:"You have got income coming in. Right now it is just sitting there.",
    cards:[
      {color:T.blue,text:"Starting at 27 vs 37 is a £180,000+ difference at retirement. You still have time."},
      {color:T.green,text:"90% of professional fund managers underperform a simple index fund. You do not need to pick stocks."},
      {color:T.amber,text:"Your employer may be offering free money you have not claimed yet. We check this in step one."}],
    bullets:["Open a Stocks & Shares ISA and understand why","Set up automated investing that runs without you","Know the difference between good fees and bad fees"]},
  home:{
    headline:"You have a goal. Let us build the path backwards from it.",
    cards:[
      {color:T.blue,text:"You will know exactly how much you need, by when, and what needs to happen each month."},
      {color:T.green,text:"Most people overestimate how long it takes when they have a plan."},
      {color:T.amber,text:"There are government bonuses and tax wrappers most first-time buyers do not know exist."}],
    bullets:["Calculate your exact savings target","Use the right accounts to get government bonuses","Build a realistic timeline that actually works"]},
  admin:{
    headline:"Most people overpay tax and underpay themselves. Let us fix both.",
    cards:[
      {color:T.blue,text:"A wrong tax code costs real money. HMRC will not always tell you. We check this in the first session."},
      {color:T.green,text:"If your employer matches pension contributions and you are not maximising it, you are turning down part of your salary."},
      {color:T.amber,text:"30 minutes in this app will be worth more than most financial decisions you will make this year."}],
    bullets:["Confirm your tax code is correct and understand it","Maximise your employer pension match","Know exactly what you are entitled to and claim it"]},
}

const GOAL_KEYS={understand:"understand",budgeting:"budgeting",debt:"debt",investing:"investing",home:"home",admin:"admin"}


/* ════════════════════════════════════════════════════════════════════
   STATE & CONTEXT
   ════════════════════════════════════════════════════════════════════ */
const DEFAULTS={
  profile:{name:"",age:null,onboardingComplete:false,goal:null,situations:[],
    currentLevel:1,completedLevels:[],phaseTag:"Foundations",personalityResult:null,
    xp:0,levelProgress:{}},
  assets:[],debts:[],income:{primary:0},spending:{monthly:0},goals:[],history:[],completedLessons:[],badges:[]
}
const load=()=>{try{const s=localStorage.getItem("ls_v2");return s?{...DEFAULTS,...JSON.parse(s)}:DEFAULTS}catch{return DEFAULTS}}
const fmt=v=>{if(v==null||isNaN(v))return"£0";const a=Math.abs(Math.round(v)).toLocaleString("en-GB");return v<0?`-£${a}`:`£${a}`}
const getPhase=n=>n<=3?"Foundations":n<=6?"Stabilise":n<=9?"Optimise":n<=12?"Grow":"Protect"

const AppCtx=createContext(null)
const useApp=()=>useContext(AppCtx)

function AppProvider({children}){
  const[state,setState]=useState(load)
  const[tab,setTab]=useState(0)
  const[toastMsg,setToastMsg]=useState(null)
  function save(ns){const m={...DEFAULTS,...ns};setState(m);try{localStorage.setItem("ls_v2",JSON.stringify(m))}catch{}}
  function reset(){setState(DEFAULTS);try{localStorage.removeItem("ls_v2")}catch{}}
  function toast(msg,dur=2400){setToastMsg(msg);setTimeout(()=>setToastMsg(null),dur)}
  return(
    <AppCtx.Provider value={{state,save,reset,tab,setTab,toast}}>
      <style>{G}</style>
      {children}
      {toastMsg&&<div className="ls-fadein" style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,color:"#070D1A",fontWeight:700,fontSize:14,padding:"12px 24px",borderRadius:99,zIndex:9999,whiteSpace:"nowrap",pointerEvents:"none",boxShadow:`0 8px 32px rgba(15,191,184,.4)`}}>{toastMsg}</div>}
    </AppCtx.Provider>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SHARED UI
   ════════════════════════════════════════════════════════════════════ */
function Btn({children,onClick,disabled,style:sx={}}){
  return<button onClick={disabled?undefined:onClick} style={{width:"100%",padding:"16px 20px",borderRadius:16,fontFamily:"inherit",fontWeight:700,fontSize:15,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,transition:"all .15s",border:"none",background:disabled?T.subtle:`linear-gradient(135deg,${T.teal},${T.tealMid})`,color:"#070D1A",letterSpacing:.3,...sx}}>{children}</button>
}

function StarField({count=28}){
  const stars=useMemo(()=>Array.from({length:Math.min(count,28)},(_,i)=>({
    x:(i*137.508)%100,y:(i*93.7+17)%100,
    size:i%9===0?2.2:i%5===0?1.6:1,
    delay:(i*0.6)%6,dur:2+((i*0.9)%4),
    tint:i%13===0?"rgba(15,191,184,.7)":i%9===0?"rgba(167,139,250,.6)":"rgba(255,255,255,.7)"
  })),[count])
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      <div style={{position:"absolute",top:"-30%",left:"-20%",width:"80%",height:"80%",background:"radial-gradient(ellipse,rgba(167,139,250,.05) 0%,transparent 65%)",pointerEvents:"none"}}/>
      {stars.map((s,i)=><div key={i} className="ls-star" style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:s.tint,"--d":`${s.dur}s`,"--dl":`${s.delay}s`}}/>)}
    </div>
  )
}

function Sheet({title,onClose,children}){
  return(
    <div className="ls-fadein" style={{position:"fixed",inset:0,background:"rgba(7,13,26,.8)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="ls-fadein" style={{background:T.surface,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:600,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",border:`1px solid ${T.border}`,borderBottom:"none"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 22px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
          <p style={{color:T.white,fontWeight:800,fontSize:17}}>{title}</p>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><X size={20}/></button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"22px"}}>{children}</div>
      </div>
    </div>
  )
}

function Confetti({active}){
  if(!active)return null
  const pieces=Array.from({length:30},(_,i)=>({id:i,x:Math.random()*100,color:[T.teal,T.purple,T.amber,T.green,T.blue,"#F472B6"][Math.floor(Math.random()*6)],delay:Math.random()*0.4,size:6+Math.random()*6}))
  return(<div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none",overflow:"hidden"}}>{pieces.map(p=><div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:Math.random()>0.5?"50%":"2px",animation:`confettiFall 1.4s ${p.delay}s ease-in forwards`}}/>)}</div>)
}

/* ════════════════════════════════════════════════════════════════════
   ONBOARDING (3 screens + summary)
   ════════════════════════════════════════════════════════════════════ */
function Onboarding(){
  const{state,save}=useApp()
  const[screen,setScreen]=useState("goal")
  const[goal,setGoal]=useState(null)
  const[situations,setSituations]=useState([])
  const[name,setName]=useState("")
  const[age,setAge]=useState("")

  const GOALS=[
    {id:"understand",emoji:"🗺️",label:"Understand money",sub:"Nobody ever taught me"},
    {id:"budgeting",emoji:"💸",label:"Know where my money goes",sub:"Each month"},
    {id:"debt",emoji:"🧯",label:"Get out of debt",sub:""},
    {id:"investing",emoji:"📈",label:"Start investing or grow savings",sub:""},
    {id:"home",emoji:"🏠",label:"Buy a home or reach a big goal",sub:""},
    {id:"admin",emoji:"📋",label:"Sort my tax, pension or admin",sub:""},
  ]

  const SITS=[
    {id:"employed",emoji:"💼",label:"Employed or in a career"},
    {id:"student",emoji:"🎓",label:"Student or just graduated"},
    {id:"selfemployed",emoji:"🧾",label:"Self-employed or freelance"},
    {id:"faith",emoji:"🌙",label:"My faith shapes my finances"},
    {id:"family",emoji:"👨‍👩‍👧",label:"Family situation just changed"},
    {id:"newuk",emoji:"🌍",label:"New to the UK"},
  ]

  function toggleSit(id){setSituations(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])}

  function finish(){
    save({...state,profile:{...state.profile,name:name||"Friend",age:parseInt(age)||null,onboardingComplete:true,goal,situations,currentLevel:1,completedLevels:[],phaseTag:"Foundations",xp:0}})
  }

  // Screen 1: Goal
  if(screen==="goal") return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={20}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"60px 24px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <div className="ls-float" style={{fontSize:48,marginBottom:20,textAlign:"center"}}>🚀</div>
        <h1 style={{color:"#FFFFFF",fontWeight:900,fontSize:"clamp(24px,6vw,32px)",lineHeight:1.1,marginBottom:8,textAlign:"center",letterSpacing:-.5}}>What do you most want to sort out?</h1>
        <p style={{color:T.muted,fontSize:14,textAlign:"center",marginBottom:28}}>Your starting point. Everything else is still here.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {GOALS.map(g=>{
            const sel=goal===g.id
            return(
              <button key={g.id} onClick={()=>setGoal(g.id)} style={{background:sel?`${T.teal}12`:"rgba(255,255,255,.03)",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.06)"}`,borderRadius:18,padding:"16px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .15s",display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:26,flexShrink:0}}>{g.emoji}</span>
                <div style={{flex:1}}>
                  <p style={{color:sel?"#FFFFFF":"#C8D8EC",fontWeight:700,fontSize:15}}>{g.label}</p>
                  {g.sub&&<p style={{color:sel?"#8FA3BE":"#4A6080",fontSize:12,marginTop:2}}>{g.sub}</p>}
                </div>
                <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.15)"}`,background:sel?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                  {sel&&<div style={{width:8,height:8,borderRadius:"50%",background:"#070D1A"}}/>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <Btn onClick={()=>{if(goal)setScreen("situation")}} disabled={!goal}>Continue</Btn>
      </div>
    </div>
  )

  // Screen 2: Situation (multi-select)
  if(screen==="situation") return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={18}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"50px 24px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <h1 style={{color:"#FFFFFF",fontWeight:900,fontSize:"clamp(24px,6vw,32px)",lineHeight:1.1,marginBottom:8,letterSpacing:-.5}}>What describes you right now?</h1>
        <p style={{color:T.muted,fontSize:14,marginBottom:6}}>Select everything that applies.</p>
        <span style={{display:"inline-block",background:T.amberDim,color:T.amber,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,border:`1px solid ${T.amberBorder}`,marginBottom:24}}>Pick as many as you like</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {SITS.map(s=>{
            const sel=situations.includes(s.id)
            return(
              <button key={s.id} onClick={()=>toggleSit(s.id)} style={{background:sel?`${T.teal}10`:"rgba(255,255,255,.03)",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.06)"}`,borderRadius:18,padding:"20px 14px",cursor:"pointer",textAlign:"center",fontFamily:"inherit",transition:"all .15s",position:"relative"}}>
                <div style={{position:"absolute",top:10,right:10,width:20,height:20,borderRadius:"50%",border:`2px solid ${sel?T.teal:"rgba(255,255,255,.12)"}`,background:sel?T.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                  {sel&&<Check size={12} color="#070D1A"/>}
                </div>
                <span style={{fontSize:32,display:"block",marginBottom:8}}>{s.emoji}</span>
                <p style={{color:sel?"#FFFFFF":"#8FA3BE",fontWeight:600,fontSize:13,lineHeight:1.3}}>{s.label}</p>
              </button>
            )
          })}
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <Btn onClick={()=>setScreen("name")}>Continue</Btn>
        <button onClick={()=>setScreen("goal")} style={{background:"none",border:"none",color:"#344D68",fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%",marginTop:12,padding:8}}>Back</button>
      </div>
    </div>
  )

  // Screen 3: Name + Age
  if(screen==="name") return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <StarField count={16}/>
      <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"50px 28px 20px",maxWidth:460,margin:"0 auto",width:"100%"}}>
        <h1 style={{color:"#FFFFFF",fontWeight:900,fontSize:"clamp(24px,6vw,32px)",lineHeight:1.1,marginBottom:6,letterSpacing:-.5}}>Last one. Make this yours.</h1>
        <p style={{color:T.muted,fontSize:14,marginBottom:28}}>No email. No password. Just your name and age so we can personalise everything.</p>
        <div style={{display:"flex",gap:12,marginBottom:12}}>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="First name" autoFocus style={{flex:2,background:"rgba(255,255,255,.04)",border:`2px solid ${name?T.teal:"rgba(255,255,255,.08)"}`,borderRadius:16,padding:"17px 20px",color:"#FFFFFF",fontSize:18,fontWeight:700,fontFamily:"inherit",outline:"none",transition:"border .15s"}}/>
          <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" min="16" max="80" style={{flex:1,background:"rgba(255,255,255,.04)",border:`2px solid ${age?T.teal:"rgba(255,255,255,.08)"}`,borderRadius:16,padding:"17px 16px",color:"#FFFFFF",fontSize:18,fontWeight:700,fontFamily:"inherit",outline:"none",transition:"border .15s",textAlign:"center"}}/>
        </div>
        <p style={{color:"#344D68",fontSize:12,marginBottom:20}}>Age matters. A 22-year-old and a 34-year-old need genuinely different advice.</p>

        {/* Show their selections back */}
        {(goal||situations.length>0)&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
            {goal&&<span style={{background:T.tealDim,color:T.teal,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,border:`1px solid ${T.tealBorder}`}}>{GOALS.find(g=>g.id===goal)?.emoji} {GOALS.find(g=>g.id===goal)?.label}</span>}
            {situations.map(s=>{const sit=SITS.find(x=>x.id===s);return sit?<span key={s} style={{background:T.purpleDim,color:T.purple,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,border:`1px solid ${T.purpleBorder}`}}>{sit.emoji} {sit.label}</span>:null})}
          </div>
        )}
      </div>
      <div style={{position:"relative",zIndex:1,padding:"0 28px 48px",maxWidth:460,margin:"0 auto",width:"100%"}}>
        <Btn onClick={()=>{if(name&&age)setScreen("summary")}} disabled={!name||!age}>Show me my plan →</Btn>
        <button onClick={()=>setScreen("situation")} style={{background:"none",border:"none",color:"#344D68",fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%",marginTop:12,padding:8}}>Back</button>
        <p style={{color:"#344D68",fontSize:11,textAlign:"center",marginTop:12}}>We never sell your data. Ever.</p>
      </div>
    </div>
  )

  // Summary / Results screen
  if(screen==="summary"){
    const gc=GOAL_CONTENT[goal]||GOAL_CONTENT.understand
    const isHalal=situations.includes("faith")
    return(
      <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
        <StarField count={24}/>
        <div className="ls-fadein" style={{position:"relative",zIndex:1,flex:1,overflowY:"auto",padding:"50px 24px 20px",maxWidth:500,margin:"0 auto",width:"100%"}}>
          <span style={{display:"inline-block",background:T.greenDim,color:T.green,fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:99,border:`1px solid rgba(52,211,153,.3)`,marginBottom:20}}>Your plan is ready, {name}</span>
          <h1 style={{color:"#FFFFFF",fontWeight:900,fontSize:"clamp(22px,5vw,28px)",lineHeight:1.2,marginBottom:10,letterSpacing:-.3}}>{gc.headline}</h1>
          <p style={{color:T.muted,fontSize:14,lineHeight:1.5,marginBottom:24}}>Here is what LifeSmart will help you change, and why it matters more than you might think.</p>

          {/* 3 transformation cards */}
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
            {gc.cards.map((c,i)=>(
              <div key={i} style={{background:`${c.color}10`,border:`1.5px solid ${c.color}30`,borderRadius:18,padding:"18px 20px"}}>
                <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.55,fontWeight:500}}>{c.text}</p>
              </div>
            ))}
            {isHalal&&(
              <div style={{background:T.tealDim,border:`1.5px solid ${T.tealBorder}`,borderRadius:18,padding:"18px 20px"}}>
                <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.55,fontWeight:500}}>🌙 Your faith shapes your finances, and we have built for that. Halal investing, Islamic mortgages, and shariah-compliant options are explained clearly throughout.</p>
              </div>
            )}
          </div>

          {/* What you'll be able to do */}
          <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>What you will be able to do</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {gc.bullets.map((b,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:T.tealDim,border:`1px solid ${T.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><Check size={12} color={T.teal}/></div>
                <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.5}}>{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{position:"relative",zIndex:1,padding:"0 24px 48px",maxWidth:500,margin:"0 auto",width:"100%"}}>
          <Btn onClick={finish}>Let's start →</Btn>
          <p style={{color:"#344D68",fontSize:11,textAlign:"center",marginTop:14}}>First step takes 10 minutes. The impact lasts decades.</p>
        </div>
      </div>
    )
  }

  return null
}


/* ════════════════════════════════════════════════════════════════════
   LEVEL PLAYER (micro lessons + videos + action)
   ════════════════════════════════════════════════════════════════════ */
function LevelPlayer({level,onBack,onComplete}){
  const{state,save,toast}=useApp()
  const prog=state.profile.levelProgress?.[level.n]||{microsDone:[],videosDone:[],actionDone:false}
  const[step,setStep]=useState("overview") // overview|micro_N|videos|action|done
  const[microIdx,setMicroIdx]=useState(0)
  const[answer,setAnswer]=useState(null)
  const[showConfetti,setShowConfetti]=useState(false)
  const isSelfEmployed=state.profile.situations?.includes("selfemployed")
  const title=(isSelfEmployed&&level.selfEmployedAlt)?level.selfEmployedAlt.title:level.title
  const actionText=(isSelfEmployed&&level.selfEmployedAlt)?level.selfEmployedAlt.action:level.action

  function saveProg(updates){
    const np={...prog,...updates}
    save({...state,profile:{...state.profile,levelProgress:{...state.profile.levelProgress,[level.n]:np}}})
  }

  function completeMicro(idx){
    const done=[...(prog.microsDone||[])]
    if(!done.includes(idx)){done.push(idx);saveProg({microsDone:done});addXP(level.xpMicro)}
  }

  function completeVideo(title){
    const done=[...(prog.videosDone||[])]
    if(!done.includes(title)){done.push(title);saveProg({videosDone:done});addXP(level.xpVideo)}
  }

  function completeAction(){
    saveProg({actionDone:true})
    addXP(level.xpAction)
    // Check if full level done for bonus
    const allMicros=level.micros.every((_,i)=>[...(prog.microsDone||[]),].includes(i)||(prog.microsDone||[]).length>=level.micros.length)
    if(allMicros)addXP(level.xpBonus)
    // Mark level complete
    const cl=[...(state.profile.completedLevels||[])]
    if(!cl.includes(level.n))cl.push(level.n)
    const nextLevel=Math.max(level.n+1,state.profile.currentLevel)
    save({...state,profile:{...state.profile,completedLevels:cl,currentLevel:Math.min(nextLevel,15),phaseTag:getPhase(Math.min(nextLevel,15)),levelProgress:{...state.profile.levelProgress,[level.n]:{...prog,actionDone:true}}}})
    setShowConfetti(true)
    setTimeout(()=>setShowConfetti(false),2000)
    setStep("done")
    toast("🎉 Level complete! +"+level.xpAction+" XP")
  }

  function addXP(amt){save({...state,profile:{...state.profile,xp:(state.profile.xp||0)+amt}})}

  const phaseColor=PHASE_COLORS[level.phase]||T.teal
  const microsDoneCount=(prog.microsDone||[]).length
  const videosDoneCount=(prog.videosDone||[]).length
  const totalSteps=level.micros.length+(level.videos.length>0?1:0)+1
  const doneSteps=Math.min(microsDoneCount,level.micros.length)+(videosDoneCount>0?1:0)+(prog.actionDone?1:0)

  // Overview
  if(step==="overview") return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
        <div style={{flex:1}}>
          <p style={{color:phaseColor,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{level.phase} · Level {level.n}</p>
          <p style={{color:T.white,fontWeight:800,fontSize:15}}>{title}</p>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"24px 20px 100px",maxWidth:600,margin:"0 auto",width:"100%"}}>
        {/* Progress pips */}
        <div style={{display:"flex",gap:4,marginBottom:24}}>
          {Array.from({length:totalSteps}).map((_,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<doneSteps?T.teal:T.border}}/>
          ))}
        </div>

        <p style={{color:"#E2EAF6",fontSize:15,lineHeight:1.6,marginBottom:8}}>{level.hook}</p>
        <p style={{color:T.muted,fontSize:13,marginBottom:28}}>Done when: {level.done}</p>

        {/* Micro lessons */}
        <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>⚡ Quick Lessons</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {level.micros.map((m,i)=>{
            const done=(prog.microsDone||[]).includes(i)
            return(
              <button key={i} onClick={()=>{setMicroIdx(i);setAnswer(null);setStep("micro")}}
                style={{background:done?`${T.teal}08`:T.card,border:`1.5px solid ${done?T.tealBorder:T.border}`,borderRadius:16,padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:36,height:36,borderRadius:10,background:done?T.tealDim:T.faint,border:`1px solid ${done?T.tealBorder:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {done?<Check size={16} color={T.teal}/>:<Zap size={16} color={T.muted}/>}
                </div>
                <div style={{flex:1}}>
                  <p style={{color:done?T.teal:T.white,fontWeight:600,fontSize:13,lineHeight:1.4}}>{m.q.length>80?m.q.slice(0,78)+"...":m.q}</p>
                  <p style={{color:T.muted,fontSize:11,marginTop:2}}>{done?"Completed":"~1 min · +15 XP"}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Videos */}
        {level.videos.length>0&&(
          <>
            <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>🎬 Videos</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {level.videos.map((v,i)=>{
                const done=(prog.videosDone||[]).includes(v.title)
                return(
                  <div key={i} style={{background:done?`${T.purple}08`:T.card,border:`1.5px solid ${done?T.purpleBorder:T.border}`,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:36,height:36,borderRadius:10,background:done?T.purpleDim:T.faint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {done?<Check size={16} color={T.purple}/>:<Play size={16} color={T.muted}/>}
                    </div>
                    <div style={{flex:1}}>
                      <p style={{color:done?"#8FA3BE":T.white,fontWeight:600,fontSize:13}}>{v.title}</p>
                      <p style={{color:T.muted,fontSize:11,marginTop:2}}>{v.role==="core"?"Core":"Go deeper"} · {v.min} min</p>
                    </div>
                    {!done&&<button onClick={()=>completeVideo(v.title)} style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:10,padding:"6px 14px",color:T.purple,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Watched</button>}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Action */}
        <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>✅ Action</p>
        <div style={{background:prog.actionDone?`${T.green}08`:T.card,border:`1.5px solid ${prog.actionDone?`rgba(52,211,153,.3)`:T.amberBorder}`,borderRadius:18,padding:"20px"}}>
          <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6,marginBottom:14}}>{actionText}</p>
          <p style={{color:T.muted,fontSize:12,marginBottom:16}}>This is the only thing required to complete this level.</p>
          {!prog.actionDone?
            <Btn onClick={completeAction}>I have done this ✓</Btn>:
            <div style={{display:"flex",alignItems:"center",gap:10}}><Check size={18} color={T.green}/><p style={{color:T.green,fontWeight:700,fontSize:14}}>Action completed</p></div>
          }
        </div>
      </div>
    </div>
  )

  // Micro lesson
  if(step==="micro"){
    const micro=level.micros[microIdx]
    if(!micro){setStep("overview");return null}
    return(
      <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column"}}>
        <div style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid rgba(255,255,255,.05)`,flexShrink:0}}>
          <button onClick={()=>{setStep("overview");setAnswer(null)}} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",padding:4}}><ChevronLeft size={22}/></button>
          <p style={{color:T.white,fontWeight:700,fontSize:14}}>Quick Lesson {microIdx+1} of {level.micros.length}</p>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"28px 22px 100px",maxWidth:540,margin:"0 auto",width:"100%"}}>
          <h2 style={{color:T.white,fontWeight:900,fontSize:"clamp(18px,4vw,22px)",lineHeight:1.3,marginBottom:24}}>{micro.q}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {micro.opts.map((opt,i)=>{
              const picked=answer===i
              const correct=micro.correct===i
              let bg=T.card,border=T.border,tc=T.muted
              if(answer!==null&&correct){bg="rgba(52,211,153,.08)";border="rgba(52,211,153,.35)";tc=T.green}
              if(answer!==null&&picked&&!correct){bg=T.redDim;border=T.redBorder;tc=T.red}
              return(
                <button key={i} onClick={()=>{if(answer===null){setAnswer(i);completeMicro(microIdx)}}}
                  style={{background:bg,border:`2px solid ${border}`,borderRadius:16,padding:"16px 18px",cursor:answer!==null?"default":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:answer!==null?(correct?"rgba(52,211,153,.15)":(picked?T.redDim:`${phaseColor}10`)):`${phaseColor}12`,border:`1.5px solid ${answer!==null?(correct?"rgba(52,211,153,.4)":(picked?T.redBorder:`${phaseColor}25`)):T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:answer!==null?(correct?T.green:(picked?T.red:T.muted)):phaseColor,fontWeight:800,fontSize:11}}>
                      {answer!==null?(correct?"✓":(picked?"✗":String.fromCharCode(65+i))):String.fromCharCode(65+i)}
                    </span>
                  </div>
                  <p style={{color:answer!==null?tc:T.white,fontWeight:600,fontSize:14,flex:1,lineHeight:1.4}}>{opt}</p>
                </button>
              )
            })}
          </div>
          {answer!==null&&(
            <div className="ls-fadein" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 20px"}}>
              <p style={{color:T.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>The takeaway</p>
              <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.65}}>{micro.reveal}</p>
              <button onClick={()=>{
                if(microIdx<level.micros.length-1){setMicroIdx(microIdx+1);setAnswer(null)}
                else setStep("overview")
              }} style={{marginTop:16,background:T.teal,border:"none",borderRadius:12,padding:"12px 24px",color:"#070D1A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
                {microIdx<level.micros.length-1?"Next lesson →":"Back to overview"}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Done screen
  if(step==="done") return(
    <div style={{minHeight:"100dvh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <Confetti active={showConfetti}/>
      <div className="ls-fadein" style={{textAlign:"center",padding:"32px",maxWidth:400}}>
        <div style={{fontSize:64,marginBottom:20}}>🎉</div>
        <h2 style={{color:T.white,fontWeight:900,fontSize:26,marginBottom:8}}>Level {level.n} Complete!</h2>
        <p style={{color:T.muted,fontSize:15,marginBottom:32}}>{title}</p>
        <Btn onClick={onBack}>Continue →</Btn>
      </div>
    </div>
  )

  return null
}

/* ════════════════════════════════════════════════════════════════════
   HOME TAB
   ════════════════════════════════════════════════════════════════════ */
function HomeTab(){
  const{state,setTab}=useApp()
  const{profile}=state
  const currentLevel=profile.currentLevel||1
  const level=LEVELS.find(l=>l.n===currentLevel)||LEVELS[0]
  const phase=getPhase(currentLevel)
  const phaseColor=PHASE_COLORS[phase]||T.teal
  const completedCount=(profile.completedLevels||[]).length
  const prog=profile.levelProgress?.[currentLevel]||{microsDone:[],videosDone:[],actionDone:false}
  const totalSteps=level.micros.length+(level.videos.length>0?1:0)+1
  const doneSteps=Math.min((prog.microsDone||[]).length,level.micros.length)+((prog.videosDone||[]).length>0?1:0)+(prog.actionDone?1:0)

  const[activeLevel,setActiveLevel]=useState(null)

  if(activeLevel){
    const lv=LEVELS.find(l=>l.n===activeLevel)
    if(!lv){setActiveLevel(null);return null}
    return<LevelPlayer level={lv} onBack={()=>setActiveLevel(null)} onComplete={()=>setActiveLevel(null)}/>
  }

  const nextLevels=LEVELS.filter(l=>l.n>currentLevel).slice(0,3)

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
      {/* Greeting */}
      <div style={{position:"relative",background:`linear-gradient(180deg,${phaseColor}12 0%,transparent 100%)`,padding:"28px 20px 20px"}}>
        <StarField count={8}/>
        <div style={{position:"relative",maxWidth:600,margin:"0 auto"}}>
          <p style={{color:T.white,fontWeight:800,fontSize:22,marginBottom:4}}>Hey {profile.name} 👋</p>
          <p style={{color:T.muted,fontSize:14}}>Level {currentLevel} of 15 · {phase}</p>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"0 18px"}}>
        {/* Current level hero card */}
        <div style={{background:`linear-gradient(145deg,${phaseColor}12,${phaseColor}04)`,border:`2px solid ${phaseColor}40`,borderRadius:24,padding:"24px",marginTop:16,marginBottom:24,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle,${phaseColor}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
          <p style={{color:phaseColor,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Your focus right now · Level {currentLevel}</p>

          {/* Step pips */}
          <div style={{display:"flex",gap:4,marginBottom:14}}>
            {Array.from({length:totalSteps}).map((_,i)=>(
              <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<doneSteps?T.teal:T.border}}/>
            ))}
          </div>

          <h2 style={{color:T.white,fontWeight:900,fontSize:20,lineHeight:1.2,marginBottom:8}}>{level.title}</h2>
          <p style={{color:"#C8D8EC",fontSize:14,lineHeight:1.5,marginBottom:18}}>{level.hook}</p>

          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setActiveLevel(currentLevel)}
              style={{flex:1,background:T.teal,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Zap size={16}/>Quick lesson
            </button>
            <button onClick={()=>setActiveLevel(currentLevel)}
              style={{flex:1,background:"rgba(255,255,255,.06)",border:`1.5px solid rgba(255,255,255,.1)`,borderRadius:14,padding:"14px",color:T.white,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
              Continue →
            </button>
          </div>
        </div>

        {/* Quick wins strip */}
        <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>Quick wins</p>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginBottom:24,scrollbarWidth:"none"}}>
          {QUICK_WINS.map(qw=>(
            <button key={qw.id} onClick={()=>toast(`${qw.label}: coming soon!`)}
              style={{flexShrink:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>{qw.icon}</span>
              <div style={{textAlign:"left"}}>
                <p style={{color:T.white,fontWeight:600,fontSize:12,whiteSpace:"nowrap"}}>{qw.label}</p>
                <p style={{color:T.muted,fontSize:10}}>{qw.min} min</p>
              </div>
            </button>
          ))}
        </div>

        {/* Coming up */}
        <p style={{color:T.white,fontWeight:800,fontSize:15,marginBottom:12}}>Coming up</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {nextLevels.map((nl,i)=>{
            const pc=PHASE_COLORS[nl.phase]||T.muted
            const isNext=i===0
            return(
              <div key={nl.n} style={{background:T.card,border:`1px solid ${isNext?`${pc}30`:T.border}`,borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,opacity:isNext?1:.65}}>
                <div style={{width:36,height:36,borderRadius:10,background:isNext?`${pc}15`:T.faint,border:`1px solid ${isNext?`${pc}25`:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <p style={{color:isNext?pc:T.subtle,fontWeight:900,fontSize:13}}>{nl.n}</p>
                </div>
                <div style={{flex:1}}>
                  {isNext&&<span style={{background:`${pc}15`,color:pc,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,marginBottom:4,display:"inline-block"}}>Up next</span>}
                  <p style={{color:isNext?T.white:"#8FA3BE",fontWeight:700,fontSize:13,lineHeight:1.3}}>{nl.title}</p>
                  <p style={{color:T.muted,fontSize:12,marginTop:2}}>{nl.hook.length>60?nl.hook.slice(0,58)+"...":nl.hook}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Explore strip */}
        <button onClick={()=>setTab(2)} style={{width:"100%",background:`linear-gradient(135deg,${T.purpleDim},rgba(167,139,250,.03))`,border:`1px solid ${T.purpleBorder}`,borderRadius:18,padding:"16px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>🎓</span>
          <div style={{flex:1}}>
            <p style={{color:T.white,fontWeight:700,fontSize:14}}>Want to go deeper?</p>
            <p style={{color:T.muted,fontSize:12}}>Browse all lessons and extras</p>
          </div>
          <ChevronRight size={16} color={T.purple}/>
        </button>
      </div>
    </div>
  )
}


/* ════════════════════════════════════════════════════════════════════
   PLAN TAB (all 15 levels, journey map)
   ════════════════════════════════════════════════════════════════════ */
function PlanTab(){
  const{state,toast}=useApp()
  const{profile}=state
  const currentLevel=profile.currentLevel||1
  const completed=new Set(profile.completedLevels||[])
  const[activeLevel,setActiveLevel]=useState(null)
  const[warning,setWarning]=useState(null)

  function handleTap(level){
    const diff=level.n-currentLevel
    // No warning for current or next
    if(diff<=1||completed.has(level.n)){setActiveLevel(level.n);return}
    // Red warning: investing while in debt
    if(level.n>=10&&level.n<=12&&!completed.has(4)){
      setWarning({type:"red",level,msg:"You have high-interest debt at Level 4. Putting money into investments while paying high APR means your debt grows faster than your investments. Sort Level 4 first.",link:4,linkText:"Level 4: the maths will shock you →"})
      return
    }
    // Soft nudge: ISA before pension match
    if(level.n>=10&&level.n<=12&&!completed.has(7)){
      setWarning({type:"amber",level,msg:"Almost there. Check your pension match at Level 7 before opening an ISA. Free money first.",link:7,linkText:"Level 7: capture free money at work →"})
      return
    }
    // Amber warning: Optimise while in Foundations
    if(level.n>=7&&currentLevel<=3){
      setWarning({type:"amber",level,msg:"These lessons land better once your financial foundation is solid.",link:currentLevel,linkText:`Continue with Level ${currentLevel} →`})
      return
    }
    setActiveLevel(level.n)
  }

  if(activeLevel){
    const lv=LEVELS.find(l=>l.n===activeLevel)
    if(!lv){setActiveLevel(null);return null}
    return<LevelPlayer level={lv} onBack={()=>setActiveLevel(null)} onComplete={()=>setActiveLevel(null)}/>
  }

  const phases=["Foundations","Stabilise","Optimise","Grow","Protect"]

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
      <div style={{padding:"24px 20px 16px",borderBottom:`1px solid rgba(255,255,255,.05)`}}>
        <h2 style={{color:T.white,fontWeight:900,fontSize:22,letterSpacing:-.3}}>Your Plan</h2>
        <p style={{color:T.muted,fontSize:13}}>15 levels. Complete in order. Browse freely.</p>
      </div>

      <div style={{padding:"20px 18px",maxWidth:600,margin:"0 auto"}}>
        {phases.map(phase=>{
          const phaseLevels=LEVELS.filter(l=>l.phase===phase)
          const pc=PHASE_COLORS[phase]
          const pe=PHASE_EMOJIS[phase]
          return(
            <div key={phase} style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <span style={{fontSize:16}}>{pe}</span>
                <p style={{color:pc,fontWeight:800,fontSize:13,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
              </div>

              {phaseLevels.map((level,i)=>{
                const isDone=completed.has(level.n)
                const isCurrent=level.n===currentLevel
                const isFuture=level.n>currentLevel&&!isDone
                const isLast=i===phaseLevels.length-1
                return(
                  <div key={level.n} style={{display:"flex",gap:16,marginBottom:isLast?0:0}}>
                    {/* Timeline line + node */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:28,flexShrink:0}}>
                      <div style={{width:isDone?26:isCurrent?28:22,height:isDone?26:isCurrent?28:22,borderRadius:"50%",
                        background:isDone?T.green:isCurrent?T.teal:T.faint,
                        border:`2.5px solid ${isDone?T.green:isCurrent?T.teal:T.border}`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                        boxShadow:isCurrent?`0 0 16px ${T.teal}40`:"none",zIndex:1}}>
                        {isDone?<Check size={13} color="#070D1A"/>:<p style={{color:isCurrent?"#070D1A":T.subtle,fontWeight:900,fontSize:10}}>{level.n}</p>}
                      </div>
                      {!isLast&&<div style={{width:2,flex:1,background:isDone?`${T.green}40`:T.border,minHeight:20}}/>}
                    </div>

                    {/* Card */}
                    <button onClick={()=>handleTap(level)}
                      style={{flex:1,background:isCurrent?`${T.teal}08`:T.card,
                        border:`1.5px solid ${isCurrent?T.tealBorder:isDone?`${T.green}25`:T.border}`,
                        borderRadius:18,padding:"16px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                        marginBottom:12,opacity:isFuture?.7:1,transition:"all .15s"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                        <p style={{color:isDone?T.green:isCurrent?T.teal:T.muted,fontSize:11,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>{phase}</p>
                        {isDone&&<span style={{background:T.greenDim,color:T.green,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Completed</span>}
                        {isCurrent&&<span style={{background:T.tealDim,color:T.teal,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Current</span>}
                        {isFuture&&<span style={{background:T.faint,color:T.muted,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Browse</span>}
                      </div>
                      <p style={{color:isDone?"#8FA3BE":T.white,fontWeight:700,fontSize:14,lineHeight:1.3,textDecoration:isDone?"line-through":"none"}}>{level.title}</p>
                      <p style={{color:T.muted,fontSize:12,marginTop:4,lineHeight:1.4}}>{level.hook.length>70?level.hook.slice(0,68)+"...":level.hook}</p>
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Warning modal */}
      {warning&&(
        <div style={{position:"fixed",inset:0,background:"rgba(7,13,26,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="ls-fadein" style={{background:T.surface,border:`1.5px solid ${warning.type==="red"?T.redBorder:T.amberBorder}`,borderRadius:22,padding:"28px 24px",width:"100%",maxWidth:420}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <AlertTriangle size={22} color={warning.type==="red"?T.red:T.amber}/>
              <p style={{color:warning.type==="red"?T.red:T.amber,fontWeight:800,fontSize:15}}>{warning.type==="red"?"A couple of things first":"A couple of things to do first"}</p>
            </div>
            <p style={{color:"#E2EAF6",fontSize:14,lineHeight:1.6,marginBottom:20}}>{warning.msg}</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>{setWarning(null);setActiveLevel(warning.link)}} style={{width:"100%",background:warning.type==="red"?T.red:T.amber,border:"none",borderRadius:14,padding:"14px",color:"#070D1A",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{warning.linkText}</button>
              <button onClick={()=>{setWarning(null);setActiveLevel(warning.level.n)}} style={{width:"100%",background:"none",border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",color:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Browse anyway</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   LEARN TAB (extra content library)
   ════════════════════════════════════════════════════════════════════ */
function LearnTab(){
  const{toast}=useApp()
  const[expanded,setExpanded]=useState(null)
  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
      <div style={{padding:"24px 20px 16px",borderBottom:`1px solid rgba(255,255,255,.05)`}}>
        <h2 style={{color:T.white,fontWeight:900,fontSize:22,letterSpacing:-.3}}>Learn</h2>
        <p style={{color:T.muted,fontSize:13}}>Explore topics beyond your current level. Pure curiosity, no XP.</p>
      </div>
      <div style={{padding:"20px 18px",maxWidth:600,margin:"0 auto"}}>
        {LEARN_THEMES.map(theme=>{
          const isOpen=expanded===theme.id
          return(
            <div key={theme.id} style={{marginBottom:12}}>
              <button onClick={()=>setExpanded(isOpen?null:theme.id)}
                style={{width:"100%",background:isOpen?`${T.purpleDim}`:T.card,border:`1.5px solid ${isOpen?T.purpleBorder:T.border}`,borderRadius:18,padding:"18px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all .15s"}}>
                <span style={{fontSize:24}}>{theme.icon}</span>
                <div style={{flex:1}}>
                  <p style={{color:T.white,fontWeight:700,fontSize:15}}>{theme.title}</p>
                  <p style={{color:T.muted,fontSize:12}}>{theme.items.length} topics</p>
                </div>
                <ChevronDown size={18} color={T.muted} style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}/>
              </button>
              {isOpen&&(
                <div className="ls-fadein" style={{paddingTop:10,display:"flex",flexDirection:"column",gap:8}}>
                  {theme.items.map((item,i)=>(
                    <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,marginLeft:20}}>
                      <Play size={16} color={T.purple}/>
                      <div style={{flex:1}}>
                        <p style={{color:T.white,fontWeight:600,fontSize:13}}>{item.title}</p>
                        <p style={{color:T.muted,fontSize:11}}>{item.min} min</p>
                      </div>
                      <button onClick={()=>toast("Video content coming soon")} style={{background:T.purpleDim,border:`1px solid ${T.purpleBorder}`,borderRadius:10,padding:"6px 14px",color:T.purple,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Watch</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   ME TAB (profile, XP, personality)
   ════════════════════════════════════════════════════════════════════ */
function MeTab(){
  const{state,reset}=useApp()
  const{profile}=state
  const currentLevel=profile.currentLevel||1
  const phase=getPhase(currentLevel)
  const phaseColor=PHASE_COLORS[phase]
  const completedCount=(profile.completedLevels||[]).length
  const xp=profile.xp||0
  const isHalal=profile.situations?.includes("faith")
  const initials=(profile.name||"?").slice(0,2).toUpperCase()

  // XP milestones
  const milestones=[0,100,250,500,800,1200,1725]
  const currentMilestone=milestones.filter(m=>m<=xp).pop()||0
  const nextMilestone=milestones.find(m=>m>xp)||milestones[milestones.length-1]
  const xpPct=nextMilestone>currentMilestone?Math.round(((xp-currentMilestone)/(nextMilestone-currentMilestone))*100):100

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>
      <div style={{padding:"32px 20px 24px",textAlign:"center"}}>
        {/* Avatar */}
        <div style={{width:72,height:72,borderRadius:22,background:`linear-gradient(135deg,${T.teal},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 8px 32px rgba(15,191,184,.3)`}}>
          <p style={{color:"#FFFFFF",fontWeight:900,fontSize:24}}>{initials}</p>
        </div>
        <p style={{color:T.white,fontWeight:800,fontSize:20}}>{profile.name||"You"}</p>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Level {currentLevel} of 15</p>

        {/* Identity pills */}
        <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
          <span style={{background:T.faint,color:T.white,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.border}`}}>⚡ Level {currentLevel}</span>
          <span style={{background:`${phaseColor}12`,color:phaseColor,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${phaseColor}30`}}>{PHASE_EMOJIS[phase]} {phase}</span>
          {isHalal&&<span style={{background:T.tealDim,color:T.teal,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:99,border:`1px solid ${T.tealBorder}`}}>🌙 Halal finance</span>}
        </div>
      </div>

      <div style={{padding:"0 18px",maxWidth:500,margin:"0 auto"}}>
        {/* Where you are */}
        <div style={{background:T.card,border:`1.5px solid ${phaseColor}25`,borderRadius:20,padding:"20px",marginBottom:16}}>
          <p style={{color:phaseColor,fontWeight:800,fontSize:14,marginBottom:6}}>{PHASE_EMOJIS[phase]} {phase} · Levels {phase==="Foundations"?"1 to 3":phase==="Stabilise"?"4 to 6":phase==="Optimise"?"7 to 9":phase==="Grow"?"10 to 12":"13 to 15"}</p>
          <p style={{color:"#C8D8EC",fontSize:13,lineHeight:1.5}}>
            {phase==="Foundations"?"Getting the real picture. Knowing your numbers is the foundation everything else builds on.":
             phase==="Stabilise"?"Building the safety net and clearing costly debt. The foundation that makes everything else possible.":
             phase==="Optimise"?"Making your money work harder. Free employer money, smart tax, and systems that run themselves.":
             phase==="Grow"?"Growing real wealth. ISAs, index funds, and pension strategy that compounds for decades.":
             "Protecting what you have built. Income protection, a will, and an annual review that keeps everything on track."}
          </p>
        </div>

        {/* XP & Progress */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"20px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <p style={{color:T.teal,fontWeight:900,fontSize:28}}>{xp} XP</p>
              <p style={{color:T.muted,fontSize:12}}>Total earned</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{color:T.white,fontWeight:700,fontSize:14}}>{completedCount} levels done</p>
              <p style={{color:T.muted,fontSize:12}}>{15-completedCount} remaining</p>
            </div>
          </div>
          <div style={{background:T.surface,borderRadius:99,height:6,overflow:"hidden"}}>
            <div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${T.teal},${T.purple})`,borderRadius:99,transition:"width .6s"}}/>
          </div>
          <p style={{color:T.muted,fontSize:11,marginTop:6}}>{nextMilestone-xp} XP to next milestone</p>
        </div>

        {/* Reset */}
        <button onClick={()=>{if(window.confirm("Reset all progress? This cannot be undone."))reset()}}
          style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 18px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10}}>
          <RotateCcw size={16} color={T.muted}/>
          <p style={{color:T.muted,fontWeight:700,fontSize:14}}>Reset progress</p>
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   BOTTOM NAV
   ════════════════════════════════════════════════════════════════════ */
function BottomNav(){
  const{tab,setTab}=useApp()
  const TABS=[
    {icon:Home,label:"Home",idx:0},
    {icon:Map,label:"Plan",idx:1},
    {icon:BookOpen,label:"Learn",idx:2},
    {icon:User,label:"Me",idx:3},
  ]
  return(
    <nav style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",height:66,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 32px rgba(0,0,0,.3)"}}>
      {TABS.map(t=>{
        const active=tab===t.idx
        const Icon=t.icon
        return(
          <button key={t.idx} onClick={()=>setTab(t.idx)}
            style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"8px 0",position:"relative"}}>
            <Icon size={21} color={active?T.teal:T.muted} strokeWidth={active?2.5:1.8}/>
            <span style={{fontSize:10,fontWeight:active?700:500,color:active?T.teal:T.muted,letterSpacing:.2}}>{t.label}</span>
            {active&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:18,height:3,borderRadius:"3px 3px 0 0",background:T.teal}}/>}
          </button>
        )
      })}
    </nav>
  )
}

/* ════════════════════════════════════════════════════════════════════
   APP SHELL + ROUTER + EXPORT
   ════════════════════════════════════════════════════════════════════ */
function AppShell(){
  const{tab}=useApp()
  const CONTENT=[<HomeTab/>,<PlanTab/>,<LearnTab/>,<MeTab/>]
  return(
    <div style={{height:"100dvh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden"}}>
      <header style={{background:"rgba(11,20,36,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 20px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:10,boxShadow:"0 4px 24px rgba(0,0,0,.25)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,rgba(15,191,184,.3),rgba(167,139,250,.3))",border:"1px solid rgba(15,191,184,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🚀</div>
          <span style={{color:"#FFFFFF",fontSize:13,fontWeight:800,letterSpacing:2}}>LIFESMART</span>
        </div>
      </header>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>
        {CONTENT[tab]}
      </div>
      <BottomNav/>
    </div>
  )
}

function Router(){
  const{state}=useApp()
  if(state.profile.onboardingComplete)return<AppShell/>
  return<Onboarding/>
}

export default function App(){
  useEffect(()=>{
    let meta=document.querySelector('meta[name="viewport"]')
    if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta)}
    meta.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
  },[])
  return(
    <AppProvider>
      <Router/>
    </AppProvider>
  )
}
