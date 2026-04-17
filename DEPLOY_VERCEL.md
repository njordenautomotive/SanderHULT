# Deploying to Vercel

This project is a frontend-only React data-storytelling site (CRA). The
FastAPI backend template is unused at runtime because all data is
pre-processed into `frontend/src/data/dataset.json` at build time.

## One-time setup

1. Push this repo to GitHub (use Emergent's **Save to GitHub** button in
   the top bar of the chat).
2. Go to https://vercel.com/new and import the GitHub repo.
3. Vercel will read `vercel.json` at the repo root and use:
   - **Build Command**: `cd frontend && yarn install --frozen-lockfile && yarn build`
   - **Output Directory**: `frontend/build`
4. Leave all other settings at their defaults. Click **Deploy**.

## Custom domain

1. In the Vercel project → **Settings → Domains → Add**.
2. Type your domain (e.g. `example.com` or `story.example.com`).
3. Vercel will show either:
   - **For apex (root) domain**: add an **A record** pointing to `76.76.21.21`
   - **For a subdomain**: add a **CNAME** pointing to `cname.vercel-dns.com`
4. Make those changes in your domain registrar's DNS panel.
5. Propagation is usually 5–15 min. Vercel auto-issues an SSL cert once DNS resolves.

## If you later re-run the preprocessor

The CSV is already cleaned, but if you update
`Data Viz Clean Data.csv` and want Vercel to pick up new numbers:

```bash
cd app
python scripts/preprocess.py   # regenerates frontend/src/data/dataset.json
git add frontend/src/data/dataset.json
git commit -m "refresh data"
git push
```

Vercel will auto-deploy on every push to `main`.
