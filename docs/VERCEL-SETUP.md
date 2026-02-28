# Vercel options to change — step-by-step

Use this list when setting up or fixing deployment for tofuOS. Do these in order.

---

## 1. Open your project

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Open the **TofuOS** project (or the project linked to your repo).
3. Click the project name to open the project dashboard.

---

## 2. Build & Development Settings

1. In the top menu, click **Settings**.
2. In the left sidebar, click **General** (under “Project”).
3. Check or set:

   | Option | What to set | Why |
   |--------|------------------|-----|
   | **Framework Preset** | Next.js | Should be auto-detected. If not, choose Next.js. |
   | **Build Command** | `npm run build` | Or leave empty to use the default (same as in `vercel.json`). |
   | **Output Directory** | *(leave default)* | Next.js uses `.next`; do not change unless you use static export. |
   | **Install Command** | `npm ci` | **Important.** So Vercel installs exactly from `package-lock.json` (React 18, Next 14). |
   | **Development Command** | `npm run dev` | Optional; only for “Run dev” in the dashboard. |

4. Click **Save** if you changed anything.

---

## 3. Environment Variables

1. In the left sidebar, click **Environment Variables**.
2. Add these for **Production** (and add the same for **Preview** and **Development** if you use them):

   | Name | Value | Where to get it |
   |------|--------|------------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Project Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (long string) | Supabase → Project Settings → API → Project API keys → `anon` `public` |
   | `GOOGLE_GEMINI_API_KEY` | Your Gemini API key | [Google AI Studio](https://aistudio.google.com/) → Get API key |
   | `OPENAI_API_KEY` | `sk-proj-...` (if you use OpenAI) | [OpenAI API keys](https://platform.openai.com/api-keys) |

3. For each variable:
   - Click **Add New** (or **Add**).
   - Enter **Key** (name) and **Value**.
   - Choose **Production** (and **Preview** / **Development** if needed).
   - Click **Save**.
4. **Never** commit these values in the repo; only in Vercel (or in local `.env.local`).

---

## 4. Git (repository and branch)

1. In the left sidebar, click **Git**.
2. Check:

   | Option | What to use |
   |--------|------------------|
   | **Production Branch** | Usually `main` (or the branch you want for production). |
   | **Ignored Build Step** | Leave empty so every push builds. |

3. Ensure the correct GitHub (or GitLab/Bitbucket) repo is connected. If not, go to **Settings → Git** and connect the repository.

---

## 5. Node.js version (optional)

1. In the left sidebar, under **General**, scroll to **Node.js Version** (or find it under **Build & Development** in some dashboards).
2. Set to **18.x** or **20.x** (recommended: **20.x**).
3. Save. This avoids surprises if a default changes.

---

## 6. Redeploy after changing settings

1. Go to the **Deployments** tab.
2. Open the **⋮** menu on the latest deployment.
3. Click **Redeploy**.
4. Check the build logs to confirm the build uses `npm ci` and completes without errors.

---

## Quick checklist

- [ ] **Settings → General**: Install Command = `npm ci`.
- [ ] **Settings → Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and optional `GOOGLE_GEMINI_API_KEY`, `OPENAI_API_KEY`).
- [ ] **Settings → Git**: Production branch = `main` (or your chosen branch).
- [ ] **Repo**: `package-lock.json` is committed.
- [ ] **Supabase**: Production URL (e.g. `https://your-app.vercel.app`) added to Authentication → URL Configuration → Redirect URLs.
- [ ] **Redeploy** once after changing options.

If the build still fails, check the **Build** log on the failed deployment and compare with the [Restrategy & Deployment](RESTRATEGY-AND-DEPLOYMENT.md) guide.
