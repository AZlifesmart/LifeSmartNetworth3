# LifeSmart — Deploy to Vercel

## Prerequisites
- Node.js 18+ installed (https://nodejs.org)
- A free Vercel account (https://vercel.com)
- Git installed

---

## Option A: Deploy via Vercel CLI (fastest)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to this folder
cd lifesmart-deploy

# 3. Install dependencies
npm install

# 4. Deploy (follow the prompts — all defaults are fine)
vercel

# 5. For production URL:
vercel --prod
```

Vercel will give you a URL like `https://lifesmart-abc123.vercel.app`

---

## Option B: Deploy via GitHub + Vercel UI

1. Create a new GitHub repo (private or public)
2. Push this folder to it:
   ```bash
   cd lifesmart-deploy
   git init
   git add .
   git commit -m "Initial LifeSmart deploy"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to https://vercel.com → New Project → Import your repo
4. Vercel auto-detects Vite — just click Deploy
5. Done. You get a live URL instantly.

---

## Local dev

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Build locally

```bash
npm run build
npm run preview
```
# LifeSmartNetworth
# LifeSmartNetworth
