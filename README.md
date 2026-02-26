# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Running with the backend (user data persistence)**

To have login and sources saved per user and persist across logout/refresh, run the API server as well:

```sh
# Terminal 1: install and start the backend (from project root)
cd server && npm i && cd .. && npm run server

# Terminal 2: start the frontend
npm run dev
```

Then open http://localhost:8080. The frontend proxies `/api` to the server (port 3001). User data is stored under the `data/` folder.

**AI analysis and Jira**

- **Analyze sources:** In the Chat panel, use **Analyze sources** to run an AI (project-manager style) analysis on your selected sources. Requires `OPENAI_API_KEY` to be set (see **How to set the OpenAI API key** below).
- **Jira:** Configure Jira (domain, email, API token) when you first click **Create Jira ticket** on an insight. Credentials are stored per user in the backend.

---

## How to set the OpenAI API key (step-by-step)

The key is used by the **backend** (the `server/` app). **Never put it in your code or commit it to GitHub.**

### Option A: Backend running on your computer (local)

1. **Get your API key**  
   Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys), sign in, and create a new key. Copy it (it starts with `sk-...`).

2. **Open a terminal** in your project folder (the one that contains the `server` folder).

3. **Start the server with the key**  
   Run this in the terminal — replace `sk-your-actual-key-here` with your real key:

   **Mac / Linux:**
   ```bash
   OPENAI_API_KEY=sk-your-actual-key-here npm run server
   ```

   **Windows (Command Prompt):**
   ```bash
   set OPENAI_API_KEY=sk-your-actual-key-here && npm run server
   ```

   **Windows (PowerShell):**
   ```powershell
   $env:OPENAI_API_KEY="sk-your-actual-key-here"; npm run server
   ```

   Leave this terminal open while you use the app. In another terminal, run `npm run dev` for the frontend.

4. **Optional — use a `.env` file**  
   To avoid typing the key every time: in the **project root** (same level as the `server` folder), create a file named `.env` and add one line:  
   `OPENAI_API_KEY=sk-your-actual-key-here`  
   Save. The file is in `.gitignore`, so it won’t be pushed to GitHub. You still need to load it when starting the server (e.g. run the same command as in step 3, or use a tool that loads `.env`).

### Option B: Backend running on Railway, Render, or Fly.io

1. **Get your API key**  
   Same as Option A, step 1.

2. **Open your backend project** on the host (e.g. [railway.app](https://railway.app) → your project).

3. **Find the environment / variables section**  
   - **Railway:** Project → your service → **Variables** tab.  
   - **Render:** Dashboard → your service → **Environment** (or **Environment Variables**).  
   - **Fly.io:** In the terminal, run:  
     `fly secrets set OPENAI_API_KEY=sk-your-actual-key-here`

4. **Add the variable**  
   - **Name:** `OPENAI_API_KEY`  
   - **Value:** paste your key (the full `sk-...` string).  
   Save. The host will restart the server and use the new key.

5. **Redeploy** if the host didn’t auto-redeploy, then try **Analyze sources** again in the app.

---

**Deploying to Vercel (GitHub → Vercel)**

- **Frontend:** Pushing to GitHub with Vercel connected will build and deploy the **Vite app** only. The site will load, but **login, sources, AI analysis, and Jira will not work** until the API is available.
- **Never commit secrets.** Do not put `OPENAI_API_KEY`, Jira tokens, or any API keys in the repo. Use environment variables everywhere.
- **Backend elsewhere:** The Express server in `server/` does not run on Vercel. Deploy it to a Node host (e.g. [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io)) and set `OPENAI_API_KEY` (and any other env vars) in that host’s dashboard.
- **Point frontend at the API:** In the Vercel project, go to **Settings → Environment Variables** and add:
  - **`VITE_API_URL`** = your backend URL (e.g. `https://your-app.railway.app`), no trailing slash.
  - Redeploy so the frontend uses this URL for all `/api` requests.
- **Security:** Keep `.env` and `data/` in `.gitignore` (they already are). Add secrets only in Vercel (for `VITE_*` if needed) and in your backend host’s env (for `OPENAI_API_KEY`, etc.).

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
